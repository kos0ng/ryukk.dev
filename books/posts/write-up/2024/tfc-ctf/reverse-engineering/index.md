# Reverse Engineering

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>Signal (50 pts)</td><td>Here</td></tr><tr><td>License (50pts)</td><td>Here</td></tr><tr><td>Brave Traveler (191 pts)</td><td>Here</td></tr><tr><td>Virtual Rev (360 pts)</td><td>Here</td></tr><tr><td>x8 (360 pts)</td><td>Here</td></tr><tr><td>Functional (476 pts) 🥇</td><td><a href="#functional-476-pts">Here</a></td></tr><tr><td>Mcknight (487 pts) 🥈</td><td><a href="#mcknight-487-pts">Here</a></td></tr></tbody></table>

## Functional (476 pts)

### Description

It functions.

### Solution

Given program compiled with ghc, lets try to run it.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FKRt6OyzFQ0n0zaRw9XRX%2Fimage.png?alt=media&amp;token=8c9bd85e-ac03-426a-b002-9469c2857657" alt=""><figcaption></figcaption></figure>

It only shows "Checking flag..." and there is no process that receive our input when we run the program. Decompile it using IDA. Searching for "Checking flag..." string we will see another string in near the address of "Checking flag..."

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FjuCRWDeRGLgzelbdq6oS%2Fimage.png?alt=media&amp;token=c848034f-e32a-4d77-b98b-3526bfb728d5" alt=""><figcaption></figcaption></figure>

Based on information above the program should produce "Wrong!" output if we input incorrect value. Previously i've been reversed program compiled with ghc too in this [writeup](https://blog.ryukk.dev/ctfs/write-up/2023/hsctf/reverse-engineering#re-cursed-4-solves).  So the next step i did is debugging using GDB. Set breakpoint on instruction that call res\_evalLazyIO.

```
b *0x48AAD9
```

Run the program with argument, in this case i tried to check wether our argument is used or not as the input.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F4Lodhdwu7xw2oodsB8iS%2Fimage.png?alt=media&amp;token=a754aa9f-7428-4223-a5b5-a6acc5a89b25" alt=""><figcaption></figcaption></figure>

Set hardware read breakpoint on 0x4d3410 then continue the program

```
rwatch *0x4d3410
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FO7N0NWLMPp9giCDYA0ZY%2Fimage.png?alt=media&amp;token=cc9a693f-8653-4353-81e1-5abd28f4b8d9" alt=""><figcaption></figcaption></figure>

From image above we know that our input processed and it passed to function base\_GHCziForeign\_zdwpeekCString\_info which is ghc internal function.  Continue the program and we will see again that the next index will be processed also. Continue until the program exited we still dont receive any "Wrong" output. In this step i assume that the length should be correct, so lets just bruteforce it.

```python
from subprocess import *

for i in range(1, 100):
	command = "./main " + "A"*i
	target = Popen(command, stdout=PIPE, stdin=PIPE, stderr=STDOUT, shell=True)
	target_output, _ = target.communicate()
	print(i, target_output)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FdnrDaYyz69ymkrAttXOy%2Fimage.png?alt=media&amp;token=4e8dab63-1a0a-4ec6-942a-32b0f8fdc1e0" alt=""><figcaption></figcaption></figure>

We can see that there is Wrong output when i == 28 , so our input length should be 28. Lets strace the program. Try with argument "A"\*28 , "T"  + "A"\*27 , "TF" + A\*26.&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FoODSgI9wEEgQQWMQqNT0%2Fimage.png?alt=media&amp;token=49588251-c5a3-421d-ad57-fe44a7d2b32b" alt=""><figcaption></figcaption></figure>

All of the trial give different length of  total instruction executed

* "A" \* 28 -> 262
* "T" + "A"\*27 -> 386
* "TF" + "A"\*26 -> 508

All of the trial also delayed for each index, especially if it is correct value. So for example

* A -> delay n seconds
* TA -> delay 2\*n seconds
* TFA -> delay 3\*n seconds

If i do bruteforce based on time or instruction it can be solved but would take a long time since basically if we do brute force for index 2 it will take 3\*n for each character tested. So my approach is trying to find out which function that trigger the delay. During the competition i did some approach but not limited to tracing the "thread", "input", sleeping\_queue, etc. In the end i found that there is function getDelayTarget that will make the program delayed based on its argument, in this challenge it will delayed 3 seconds.

* <https://github.com/ghc/ghc/blob/8b2f70a202ec0913515bf4945de789e959ff8cac/rts/posix/Select.c#L69>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F8RhsX9ztqLVZXUj0JiFU%2Fimage.png?alt=media&amp;token=93552023-f481-49e2-8611-029da198a3e1" alt=""><figcaption></figcaption></figure>

If the value is correct it will execute `call getDelayTarget` so we can trace the correct value by counting the executed times on 0x497896. Lets patch instruction so it will always do getDelayTarget(0)

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FGeZsFJJY1Jqtqul0MmzF%2Fimage.png?alt=media&amp;token=65a30105-e278-4a24-9cbe-d94fc0669f94" alt=""><figcaption></figcaption></figure>

The easiest way is jut by changing xor eax,eax to xor edi, edi. After that just do gdb scripting to get the flag.

```python
#!/usr/bin/python3
import string
import time

class SolverEquation(gdb.Command):
    def __init__ (self):
        super (SolverEquation, self).__init__ ("solve-equation",gdb.COMMAND_OBSCURE)

    def invoke (self, arg, from_tty):
        static_val = []
        
        gdb.execute("del")
        gdb.execute("b *0x497896") # call getDelayTarget
        gdb.execute("b *0x48AB0C") # call shutdownHaskellAndExit
        flag = "TFCCTF{"
        list_char = "_" + string.printable[:-6]
        start = time.time()
        for _ in range(20):
            for i in list_char:
                tmp = "A"*(27 - len(flag))
                gdb.execute(f"run {flag + i + tmp}")
                counter = 0
                for _ in range(len(flag) + 1):
                    gdb.execute("c")
                    val = addr2num(gdb.selected_frame().read_register("rip"))
                if val == 4814998:
                    flag += i
                    break
            print(f"FLAG -> {flag}")
        end = time.time()
        print(end-start)
        print(f"FLAG -> {flag}}}")

def addr2num(addr):
    try:
        return int(addr)  # Python 3
    except:
        return long(addr) # Python 2
SolverEquation()
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FEqaMi4jUY6uxmJC46bEv%2Fimage.png?alt=media&amp;token=c8a0147a-25e4-43f2-9d44-073ad41090bf" alt=""><figcaption></figcaption></figure>

Flag : TFCCTF{timing\_are\_a\_bit\_off}

## Mcknight (487 pts)

### Description

Knights wear armour, but does it protect them from dragons? Flag format: TFCCTF{sha256(password)}

### Solution
