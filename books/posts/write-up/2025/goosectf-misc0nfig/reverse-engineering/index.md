# Reverse Engineering

<table><thead><tr><th width="347">Challenge</th><th>Topic</th></tr></thead><tbody><tr><td><a href="#wasm-1-139-pts">Wasm 1 (139 Pts)</a></td><td>WASM</td></tr><tr><td><a href="#gone-fishing-491-pts">Gone Fishing (491 Pts)</a></td><td>Custom Algorithm</td></tr><tr><td><a href="#my-lucky-number-499-pts">My Lucky Number (499 Pts)</a></td><td>Flow Obfuscation</td></tr><tr><td><a href="#vvmm-500-pts">VvmM (500 Pts)</a> 🥇</td><td>VM, GDB Scripting</td></tr><tr><td><a href="#wasm-2-500-pts">Wasm 2 (500 Pts) </a>🥇</td><td>WASM, z3</td></tr><tr><td><a href="#wasm-3-500-pts">Wasm 3 (500 Pts)</a> - UPSOLVE</td><td>-</td></tr></tbody></table>

## Wasm 1 (139 Pts)

### Description

Our good friends at Interrupt Labs have made this challenge.

### Solution

Decompile the wasm file using Ghidra. Looks at export and we can see unlock function.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fif2jsINiSAFjsfQiKz8S%2Fimage.png?alt=media&amp;token=29903347-31a5-4665-bd81-ab011f54e824" alt=""><figcaption></figcaption></figure>

pbVar2\[0] is our input and pbVar2\[0x100] and pbVar2\[0x200] are static values. So we can easily get the flag by xoring those static values. We can see those static values through chrome debuggger.

Flag:

## Gone Fishing (491 Pts)

### Description

\-

### Solution

Given ELF 64 bit, decompile using IDA.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FBNP5Cei09zJ6UCOSRwOw%2Fimage.png?alt=media&amp;token=ec11f0fc-92a5-4be8-9a9f-e65538570c19" alt=""><figcaption></figcaption></figure>

From code above we can see that the hash and encrypt function are executed to generate the ciphertext that will be processed with our input. So we can said that ciphertext is static value and we can focus to the next step. The next encrypt process is reverseable, the idea is the core of encryption is on input\[j + v24] ^= ciphertext\[j] so we need to get the exact same ciphertext\[j] like the encrypt process.  Because ciphertext\[j+1] is chained with input\[j] that has been xored and we know those value we can easily write the solver. Following is my solver

```python
data = [0x9F, 0x1E, 0x35, 0xB1, 0xBE, 0x67, 0xE9, 0xAB, 0xAB, 0x7D, 
  0x6F, 0x67, 0x42, 0xF0, 0x09, 0xB5, 0x7D, 0x64, 0x7C, 0x70, 
  0x7C, 0x09, 0xC0, 0xF3, 0x80, 0x0F, 0xD9, 0x49, 0x40, 0x53, 
  0xFC, 0xA8, 0xE2, 0xCA, 0xB2, 0xE8, 0x07, 0xE6, 0x84, 0xD8, 
  0xEE, 0x8F, 0xD8, 0xB2, 0x67, 0x49, 0x88, 0x36, 0x19, 0x4A, 
  0x4F, 0x87, 0xE4, 0xA1, 0xF6, 0x8B, 0x1C, 0x01, 0x97, 0x5E, 
  0x30, 0x83, 0xDA, 0xA7, 0xE6, 0xEC, 0xE6, 0x64, 0x43, 0x4A, 
  0xB7, 0x74, 0x7B, 0xBA, 0x4C, 0x94, 0xE6, 0x05, 0x1F, 0xC1, 
  0x6F, 0xB3, 0x9B, 0x24, 0x92, 0x69, 0x03, 0x8C, 0xA3, 0x3E, 
  0xF3, 0xD6, 0xCE, 0x4A, 0xCF, 0xB6, 0x41, 0x4B, 0x69, 0x1E, 
  0xD0, 0xB7, 0x33, 0xE7, 0xD9, 0x4B, 0x97, 0xAE, 0xF4, 0xAC, 
  0xC2, 0x0F, 0x31, 0xBF, 0x68, 0x95, 0x67, 0x62, 0x7A, 0x1E, 
  0xE1, 0x63, 0x5B, 0xB5, 0x78, 0x25, 0x1D, 0xD1, 0x0F, 0xB7, 
  0x9F, 0x83, 0x89, 0xB9, 0x88, 0x8D, 0xA2, 0x8D, 0xA9, 0xA8, 
  0xC3, 0xDD, 0x8C, 0xA5, 0x2E, 0x0A, 0x85, 0x60, 0x98, 0x61, 
  0x83, 0x4F, 0xB0, 0x75, 0x9E, 0x13, 0x99, 0x2E, 0xB6, 0x76, 
  0x2D, 0x4E, 0x83, 0x6F]

v10 = [0x48, 0x3e, 0x4, 0x97, 0x2, 0x72, 0x60, 0x3f, 0x51, 0x8, 0x56, 0x88, 0x20, 0xc7, 0x19, 0xc8, 0xc6, 0x23, 0xf7, 0xe, 0xeb, 0x6e, 0xa1, 0x9, 0x9b, 0x94, 0xcf, 0x5a, 0x8d, 0x3f, 0xe9, 0x95, 0x35, 0xd9, 0xe3, 0x7b, 0x98, 0x9f, 0xd2, 0x23, 0x67, 0xd7, 0x5b, 0xdf, 0x56, 0xa9, 0xa9, 0x25, 0xb, 0x4d, 0x5a, 0x46, 0x93, 0xcc, 0x1b, 0x83, 0xa5, 0xd1, 0x47, 0x75, 0x90, 0xde, 0x23, 0x20]
v8 = 0
counter = 0

plaintext = [  0x0F, 0xB7, 0x9F, 0x83, 0x89, 0xB9, 0x88, 0x8D, 0xA2, 0x8D, 
  0xA9, 0xA8, 0xC3, 0xDD, 0x8C, 0xA5, 0x2E, 0x0A, 0x85, 0x60, 
  0x98, 0x61, 0x83, 0x4F, 0xB0, 0x75, 0x9E, 0x13, 0x99, 0x2E, 
  0xB6, 0x76, 0x2D, 0x4E, 0x83, 0x6F]

ciphertext = plaintext[:]
while len(plaintext) >= v8:
	for j in range(16):
		plaintext[j + counter] ^= v10[j]
		if j != 16:
			v10[j + 1] = v10[j] ^ ciphertext[j] ^ data[counter]
	counter += 16
	v8 = counter + 16

if len(plaintext) % 16 != 0:
	for k in range(len(plaintext) % 16):
		plaintext[k + counter] ^= v10[k]

print(bytes(plaintext))
```

## My Lucky Number (499 Pts)

### Description

Can you guess my lucky number?

### Solution

Given ELF 64-bit file, decompile it using IDA.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FG3OgqJ2Lz9Jy7VxBA1mM%2Fimage.png?alt=media&amp;token=d77344cf-06f2-4f89-ae12-9d8720e7a08b" alt=""><figcaption></figcaption></figure>

Main function basically set a handler for segmentation fault and then call funky function. In main there is no something that likely will trigger segfault error but if we take a look on funky function we gonna see something suspicious.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FQmO5r6fMK1NaxRzyLjQu%2Fimage.png?alt=media&amp;token=716027d7-53dd-44ac-b93c-b08081576f01" alt=""><figcaption></figcaption></figure>

funky function basically will add RDI (our input) to the value stoed in stack. Value stored in stack is PIE address + 0x134a. Then, if retn instruction executed it will jump to the address stored in stack/rsp. So basically the result of addition with our argument will be used as the next instruction address funky function. After `retn` instruction we can see that there are suspicious instructions that never executed but doesn't looks like a "good" instruction in this case because when we see in main function, we can see that the value that will be passed to `printf` is the value returned by funky function (rax)

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FdGfnscM2XJ2nAPlsQQGE%2Fimage.png?alt=media&amp;token=51555c73-bc25-4971-9574-827617a5f5de" alt=""><figcaption></figcaption></figure>

So in this case we need to find the "correct" address that will give valid rax value after funky function called. IDA or another disassembler will try to do disassembly for an address from start, so there is possibility that the instruction on 0x1353 is not actually started on 0x1353, and this kind of mechanism is widely used as an anti disassembly technique. Let's try to decode the instruction from different start.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FTws7EZM28a0UmyYqmo8s%2Fimage.png?alt=media&amp;token=1e9a781d-fc1e-40cd-b956-f5f56313faa3" alt=""><figcaption></figcaption></figure>

We can see that if we move a byte (started from 0x1354) it will shown another valid instruction which looks like legit instruction for this case. Because in the end it will fill rax value. Now, we just need to find the correct value to jump to PIE + 0x1354 which we can do it manually.

```python
f = open("payload", "wb")
inp = 0x0a00000000000000 # 0x1354 - 0x134a
f.write(str(inp).encode())
f.close()
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FfSVGvpg7N9qnEDkQOnB2%2Fimage.png?alt=media&amp;token=d18dad57-a375-461a-b88c-8854771e8279" alt=""><figcaption></figcaption></figure>

Flag: GooseCTF{iharcbh}

## VvmM (500 Pts)

### Description

VMs? I was in a VM once, it had lots of instructions, bytecode instructions, bytecode Instructions with arguments, and bytecode instructions make VMs. VMs? I was in a VM once, it had lots of instructions, bytecode instructions, bytecode Instructions with arguments, and bytecode instructions make VMs. VMs? I was in a VM once, it had lots of instructions, bytecode instructions, bytecode Instructions with arguments, and bytecode instructions make VMs. VMs? I was in a VM once, it had lots of instructions, bytecode instructions, bytecode Instructions with arguments, and bytecode instructions make VMs.

### Solution

TBU

```python
#!/usr/bin/python3
import string
import json

def write_payload(data):
    f = open("payload.txt", "wb")
    f.write(bytes(data))
    f.close()

def write_to_file(data):
    with open('out.txt', 'w') as f:
        f.write(json.dumps(data))

class SolverEquation(gdb.Command):
    def __init__ (self):
        super (SolverEquation, self).__init__ ("solve-equation",gdb.COMMAND_OBSCURE)

    def invoke (self, arg, from_tty):
        length = 52
        inp = "0" * length
        inp = list(map(ord, inp))
        write_payload(inp)

        gdb.execute("del")
        gdb.execute("b *0x4014E0")
        gdb.execute("run final.byc < payload.txt")
        flag = b""
        for _ in range(length):
            gdb.execute("del")
            gdb.execute("b *0x4015D3")
            gdb.execute("c")
            rax = addr2num(gdb.selected_frame().read_register("rax"))
            rdx = addr2num(gdb.selected_frame().read_register("rdx"))
            flag += bytes([rax ^ rdx ^ ord('0')])
            gdb.execute("del")
            gdb.execute("b *0x4014E0")
            gdb.execute("c")
        print(flag)


def addr2num(addr):
    try:
        return int(addr)
    except:
        return long(addr)

def parse(f):
    f = f.split("\n")
    result = []
    for i in f:
        tmp = i.split("\t")
        for j in range(1,len(tmp)):
            result.append(int(tmp[j],16))
    return result

SolverEquation()
```

## Wasm 2 (500 Pts)

### Description

Our good friends at Interrupt Labs have made this challenge.

### Solution

TBU

```python
from pwn import xor
import numpy as np


def sub_bytes(a1):
	result = []
	for i in a1:
		result.append(sbox[i])
	return result

def bitwise_mixing_1(var0, var1):
    v0 = np.array(var0, dtype=np.uint8)
    v1 = np.array(var1, dtype=np.uint8)
    
    combined = np.concatenate((v0, v1))
    
    shuffle1 = combined[[3, 29, 23, 31, 2, 16, 10, 5, 20, 18, 24, 28, 30, 8, 9, 11]]
    mask1 = np.uint8(128)
    
    shuffle2 = combined[[31, 21, 25, 8, 10, 30, 2, 17, 22, 18, 3, 12, 5, 7, 13, 15]]
    mask2 = np.uint8(64)
    
    shuffle3 = combined[[23, 21, 26, 0, 5, 30, 20, 14, 16, 12, 15, 28, 7, 31, 27, 19]]
    mask3 = np.uint8(32)
    
    shuffle4 = combined[[18, 14, 26, 27, 11, 0, 8, 7, 17, 1, 25, 22, 16, 13, 15, 31]]
    mask4 = np.uint8(16)
    
    shuffle5 = combined[[20, 18, 29, 3, 30, 6, 21, 26, 22, 4, 1, 15, 11, 9, 27, 28]]
    mask5 = np.uint8(8)
    
    shuffle6 = combined[[24, 17, 26, 2, 14, 29, 21, 6, 25, 4, 27, 13, 30, 9, 16, 8]]
    mask6 = np.uint8(4)
    
    shuffle7 = combined[[21, 5, 7, 17, 24, 22, 16, 3, 6, 9, 4, 23, 19, 30, 28, 29]]
    mask7 = np.uint8(2)
    
    shuffle8 = combined[[11, 23, 17, 15, 22, 29, 5, 25, 12, 18, 0, 24, 14, 2, 19, 31]]
    mask8 = np.uint8(1)
    
    result = (shuffle1 & mask1) | \
             (shuffle2 & mask2) | \
             (shuffle3 & mask3) | \
             (shuffle4 & mask4) | \
             (shuffle5 & mask5) | \
             (shuffle6 & mask6) | \
             (shuffle7 & mask7) | \
             (shuffle8 & mask8)
    
    return result.tolist()

def bitwise_mixing_2(var0, var1):
    v0 = np.array(var0, dtype=np.uint8)
    v1 = np.array(var1, dtype=np.uint8)
    
    combined = np.concatenate((v0, v1))
    
    shuffle1 = combined[[26, 1, 25, 6, 21, 19, 12, 4, 7, 0, 13, 15, 17, 27, 22, 14]]
    mask1 = np.uint8(128)
    
    shuffle2 = combined[[0, 1, 28, 11, 27, 26, 16, 23, 9, 14, 24, 4, 19, 29, 6, 20]]
    mask2 = np.uint8(64)
    
    shuffle3 = combined[[1, 9, 13, 3, 4, 11, 22, 6, 25, 29, 2, 10, 8, 17, 18, 24]]
    mask3 = np.uint8(32)
    
    shuffle4 = combined[[28, 24, 23, 3, 20, 10, 30, 19, 29, 6, 12, 4, 5, 2, 21, 9]]
    mask4 = np.uint8(16)
    
    shuffle5 = combined[[8, 0, 2, 5, 16, 17, 25, 19, 7, 12, 31, 13, 24, 14, 23, 10]]
    mask5 = np.uint8(8)
    
    shuffle6 = combined[[11, 23, 20, 7, 3, 10, 22, 5, 12, 1, 18, 19, 15, 31, 0, 28]]
    mask6 = np.uint8(4)
    
    shuffle7 = combined[[31, 0, 1, 8, 10, 15, 20, 18, 27, 12, 11, 25, 14, 13, 26, 2]]
    mask7 = np.uint8(2)
    
    shuffle8 = combined[[21, 4, 16, 30, 3, 13, 1, 8, 6, 7, 20, 26, 9, 28, 10, 27]]
    mask8 = np.uint8(1)
    
    result = (shuffle1 & mask1) | \
             (shuffle2 & mask2) | \
             (shuffle3 & mask3) | \
             (shuffle4 & mask4) | \
             (shuffle5 & mask5) | \
             (shuffle6 & mask6) | \
             (shuffle7 & mask7) | \
             (shuffle8 & mask8)
    return result.tolist()

sbox = [129,206,198,68,251,215,191,31,43,136,74,18,32,27,204,230,255,16,245,75,139,61,53,242,28,35,226,146,110,122,8,0,211,208,107,124,70,87,250,131,103,186,39,93,234,183,52,137,60,182,95,235,142,92,187,1,77,145,41,104,58,25,189,125,152,128,254,166,202,49,201,220,113,91,105,238,212,3,218,135,90,108,181,117,207,45,94,127,188,102,47,237,176,248,171,120,178,143,227,79,158,249,42,51,168,162,225,64,149,82,219,159,69,89,10,223,252,140,147,96,239,209,154,243,138,54,80,76,180,46,112,21,116,200,203,106,34,231,78,157,56,173,150,11,134,163,17,98,73,244,12,241,177,179,161,233,148,40,221,7,141,50,210,160,14,81,155,185,123,132,199,2,240,83,62,22,109,4,100,184,236,26,63,37,121,153,19,118,36,151,229,66,71,205,174,57,193,197,247,5,164,86,214,126,33,216,119,6,167,65,88,253,84,194,111,217,172,170,115,246,175,133,196,224,169,228,165,222,48,144,99,30,156,38,59,101,55,190,97,195,20,44,23,15,232,85,9,192,24,29,213,13,67,72,130,114]
cmp_val = [216,37,179,160,11,50,237,148,204,70,30,87,163,230,103,7,77,8,84,141,192,46,80,116,170,160,191,50,144,99,234,51,129,103,61,184,119,111,27,202,30,165,123,76,202,31,60,227,237,229,29,27,181,42,173,212,204,169,48,207,180,119,234,215,24,116,255,12,95,126,196,33,94,186,173,173,95,102,123,223,248,122,46,31,6,124,136,7,123,104,69,195,253,40,169,178,86,7,78,154,148,135,15,108,26,135,27,137,195,145,147,253,16,8,144,120,155,201,173,157,46,138,235,115,170,254,159,208,151,123,85,106,215,238,71,111,183,69,211,27,247,208,49,87,159,92,68,229,134,2,249,112,242,253,71,135,69,25,108,233,171,26,158,120,104,226,60,81,117,122,88,207,106,88,6,253,135,96,173,78,198,96,135,89,159,73,60,223,189,191,190,188,35,128,67,163,191,233,64,102,251,159,120,227,219,255,201,59,8,99,190,210,149,33,28,31,127,211,89,249,188,7,192,186,112,236,253,84,226,234,174,194,216,244,147,146,51,252,30,195,151,219,117,98,210,232,62,178,83,238,121,98,137,44,11,236,161,212,45,33,35,246,142,26,140,116,133,220,229,141,92,74,97,139,75,207,196,168,209,74,45,70,164,96,161,42,184,76,97,218,94,84,61,248,187,38,204,111,234,27,137,233,215,177,147,123,234,14,238,126,94,201,216,55,158,58,93,60,20,143,33,250,132,70,135,193,202,95,206,9,254,194,94,168,120,76,92,104,84,42,130,25,39,49,9,203,120,13,136,24,217,59,205,88,237,80,236,255,24,221,57,210,163,103,84,93,35,240,69,184,52,103,72,191,229,220,71,140,200,159,39,161,233,229,9,114,223,150,159,232,31,13,57,48,95,221,144,49,128,90,36,180,121,237,143,193,175,7,4,246,17,220,18,126,229,170,21,4,198,123,34,13,101,188,169,173,138,19,182,153,40,161,70,213,214,61,171,109,184,135,153,31,59,52,82,153,169,220,66,66,124,110,126,96,163,209,120,65,54,42,220,242,7,205,1,71,111,175,182,41,217,67,143,135,179,76,161,141,40,19,19,81,159,248,91,168,95,23,66,212,199,39,75,159,28,211,131,111,55,66,31,244,241,154,113,165,169,52,100,80,111,145,80,245,56,186,247,108,11,105,174,181,116,228,86,43,120,215,232,88,1,101,34,223,208,89,172,178,255,212,84,224,191,205,173,145,85,21,212,180,105,3,45,77,97,30,193,70,236,179,133,129,49,72,132,69,225,25,235,104,229,97,95,230,58,221,19,221,62,211,157,141,103,208,145,236,43,252,33,87,51,44,58,246,222,66,93,219,158,133,243,215,29,175,241,21,1,100,73,142,154,228,16,74,43,162,118,232,116,255,10,208,205,214,76,16,49,126,105,55,76,217,125,143,158,8,167,134,47,136,87,142,141,68,12,33,85,100,202,78,212,163,223,162,32,10,172,196,156,162,132,166,230,102,221,134,203,38,240,7,122,30,69,119,210,237,222,209,108,61,62,213,66,153,82,193,106,71,37,224,131,3,0,151,207,163,50,41,127,37,58,47,54,143,147,172,238,166,37,101,128,27,28,116,239,240,68,251,78,150,210,210,217,68,2,31,32,25,145,248,161,107,164,137,8,128,175,6,86,245,118,35,77,45,168,203,140,187,171,207,49,91,130,247,148,238,94,186,19,29,139,219,231,137,120,118,111,137,223,251,44,39,29,91,244,99,138,205,155,169,247,183,209,252,227,111,135,79,183,108,105,34,245,165,61,21,207,189,52,249,66,198,186,158,184,233,23,142,148,243,198,163,213,95,217,152,133,75,4,139,159,84,242,105,249,183,226,33,11,86,52,60,164,87,218,203,55,181,19,177,134,23,63,235,161,160,184,121,65,52,99,153,218,237,0,224,87,224,237,48,73,245,122,154,104,137,169,152,143,188,89,242,200,84,104,0,218,87,182,132,201,53,30,63,25,132,156,207,102,36,70,27,131,148,223,196,114,133,83,22,255,145,190,157,20,112,104,132,245,238,190,152,78,118,132,16,232,74,97,103,215,226,224,166,124,21,195,137,236,165,227,212,9,236,77,227,112,214,135,134,75,74,91,107,6,233,121,88,207,194,234,215,30,136,157,231,36,18,58,42,130,136,170,157,231,245,153,233,150,232,221,23,22,207,244,50,195,96,78,122,196,33,156,76,157,43,248,183,182,155,56,30,40,199,244,177,110,143,173,132,55,125,41,136,132,80,234,86,230,239,204,192,89,184,47,2,54,179,251,23,29,74,176,167]

inp = b"0" * 16
inp += b"1" * 16

a1 = inp[:16]
b1 = inp[16:32]

for i in range(0, 32 * 32, 32):
	a1 = sub_bytes(a1)
	b1 = sub_bytes(b1)
	a2 = bitwise_mixing_1(a1,b1)
	b2 = bitwise_mixing_2(a1,b1)
	tmp = cmp_val[i:i+32]
	key1 = tmp[0:16]
	key2 = tmp[16:32]
	a1 = xor(a2, key1)
	b1 = xor(b2, key2)

print(a1.hex(), b1.hex())
```

TBU

```python
from pwn import xor
from z3 import *

def reverse_wasm_shuffle(result_1, result_2):
    solver = Solver()

    var0 = [BitVec(f'var0_{i}', 8) for i in range(16)]
    var1 = [BitVec(f'var1_{i}', 8) for i in range(16)]

    combined = var0 + var1

    def apply_shuffle(indices, mask):
        shuffled = [combined[i] for i in indices]
        return [shuffled[i] & mask for i in range(16)]

    final_result_1 = [0 for _ in range(16)]
    final_result_2 = [0 for _ in range(16)]
    masks = [128, 64, 32, 16, 8, 4, 2, 1]
    
    shuffle_indices_1 = [
       [3, 29, 23, 31, 2, 16, 10, 5, 20, 18, 24, 28, 30, 8, 9, 11],
       [31, 21, 25, 8, 10, 30, 2, 17, 22, 18, 3, 12, 5, 7, 13, 15],
       [23, 21, 26, 0, 5, 30, 20, 14, 16, 12, 15, 28, 7, 31, 27, 19],
       [18, 14, 26, 27, 11, 0, 8, 7, 17, 1, 25, 22, 16, 13, 15, 31],
       [20, 18, 29, 3, 30, 6, 21, 26, 22, 4, 1, 15, 11, 9, 27, 28],
       [24, 17, 26, 2, 14, 29, 21, 6, 25, 4, 27, 13, 30, 9, 16, 8],
       [21, 5, 7, 17, 24, 22, 16, 3, 6, 9, 4, 23, 19, 30, 28, 29],
       [11, 23, 17, 15, 22, 29, 5, 25, 12, 18, 0, 24, 14, 2, 19, 31]
    ]

    shuffle_indices_2 = [
        [26, 1, 25, 6, 21, 19, 12, 4, 7, 0, 13, 15, 17, 27, 22, 14],
        [0, 1, 28, 11, 27, 26, 16, 23, 9, 14, 24, 4, 19, 29, 6, 20],
        [1, 9, 13, 3, 4, 11, 22, 6, 25, 29, 2, 10, 8, 17, 18, 24],
        [28, 24, 23, 3, 20, 10, 30, 19, 29, 6, 12, 4, 5, 2, 21, 9],
        [8, 0, 2, 5, 16, 17, 25, 19, 7, 12, 31, 13, 24, 14, 23, 10],
        [11, 23, 20, 7, 3, 10, 22, 5, 12, 1, 18, 19, 15, 31, 0, 28],
        [31, 0, 1, 8, 10, 15, 20, 18, 27, 12, 11, 25, 14, 13, 26, 2],
        [21, 4, 16, 30, 3, 13, 1, 8, 6, 7, 20, 26, 9, 28, 10, 27]
    ]

    for i in range(8):
        mask = masks[i]
        indices = shuffle_indices_1[i]
        masked_shuffle = apply_shuffle(indices, mask)
        for j in range(16):
            final_result_1[j] |= masked_shuffle[j]
    
    for i in range(8):
        mask = masks[i]
        indices = shuffle_indices_2[i]
        masked_shuffle = apply_shuffle(indices, mask)
        for j in range(16):
            final_result_2[j] |= masked_shuffle[j]

    for i in range(16):
        solver.add(final_result_1[i] == result_1[i])

    for i in range(16):
        solver.add(final_result_2[i] == result_2[i])

    if solver.check() == sat:
        model = solver.model()
        recovered_var0 = [model.eval(var0[i]).as_long() for i in range(16)]
        recovered_var1 = [model.eval(var1[i]).as_long() for i in range(16)]
        return recovered_var0, recovered_var1
    else:
        return None, None  

def inv_bytes(a1):
    result = []
    for i in a1:
        result.append(sbox.index(i))
    return result

sbox = [129,206,198,68,251,215,191,31,43,136,74,18,32,27,204,230,255,16,245,75,139,61,53,242,28,35,226,146,110,122,8,0,211,208,107,124,70,87,250,131,103,186,39,93,234,183,52,137,60,182,95,235,142,92,187,1,77,145,41,104,58,25,189,125,152,128,254,166,202,49,201,220,113,91,105,238,212,3,218,135,90,108,181,117,207,45,94,127,188,102,47,237,176,248,171,120,178,143,227,79,158,249,42,51,168,162,225,64,149,82,219,159,69,89,10,223,252,140,147,96,239,209,154,243,138,54,80,76,180,46,112,21,116,200,203,106,34,231,78,157,56,173,150,11,134,163,17,98,73,244,12,241,177,179,161,233,148,40,221,7,141,50,210,160,14,81,155,185,123,132,199,2,240,83,62,22,109,4,100,184,236,26,63,37,121,153,19,118,36,151,229,66,71,205,174,57,193,197,247,5,164,86,214,126,33,216,119,6,167,65,88,253,84,194,111,217,172,170,115,246,175,133,196,224,169,228,165,222,48,144,99,30,156,38,59,101,55,190,97,195,20,44,23,15,232,85,9,192,24,29,213,13,67,72,130,114]
cmp_val = [216,37,179,160,11,50,237,148,204,70,30,87,163,230,103,7,77,8,84,141,192,46,80,116,170,160,191,50,144,99,234,51,129,103,61,184,119,111,27,202,30,165,123,76,202,31,60,227,237,229,29,27,181,42,173,212,204,169,48,207,180,119,234,215,24,116,255,12,95,126,196,33,94,186,173,173,95,102,123,223,248,122,46,31,6,124,136,7,123,104,69,195,253,40,169,178,86,7,78,154,148,135,15,108,26,135,27,137,195,145,147,253,16,8,144,120,155,201,173,157,46,138,235,115,170,254,159,208,151,123,85,106,215,238,71,111,183,69,211,27,247,208,49,87,159,92,68,229,134,2,249,112,242,253,71,135,69,25,108,233,171,26,158,120,104,226,60,81,117,122,88,207,106,88,6,253,135,96,173,78,198,96,135,89,159,73,60,223,189,191,190,188,35,128,67,163,191,233,64,102,251,159,120,227,219,255,201,59,8,99,190,210,149,33,28,31,127,211,89,249,188,7,192,186,112,236,253,84,226,234,174,194,216,244,147,146,51,252,30,195,151,219,117,98,210,232,62,178,83,238,121,98,137,44,11,236,161,212,45,33,35,246,142,26,140,116,133,220,229,141,92,74,97,139,75,207,196,168,209,74,45,70,164,96,161,42,184,76,97,218,94,84,61,248,187,38,204,111,234,27,137,233,215,177,147,123,234,14,238,126,94,201,216,55,158,58,93,60,20,143,33,250,132,70,135,193,202,95,206,9,254,194,94,168,120,76,92,104,84,42,130,25,39,49,9,203,120,13,136,24,217,59,205,88,237,80,236,255,24,221,57,210,163,103,84,93,35,240,69,184,52,103,72,191,229,220,71,140,200,159,39,161,233,229,9,114,223,150,159,232,31,13,57,48,95,221,144,49,128,90,36,180,121,237,143,193,175,7,4,246,17,220,18,126,229,170,21,4,198,123,34,13,101,188,169,173,138,19,182,153,40,161,70,213,214,61,171,109,184,135,153,31,59,52,82,153,169,220,66,66,124,110,126,96,163,209,120,65,54,42,220,242,7,205,1,71,111,175,182,41,217,67,143,135,179,76,161,141,40,19,19,81,159,248,91,168,95,23,66,212,199,39,75,159,28,211,131,111,55,66,31,244,241,154,113,165,169,52,100,80,111,145,80,245,56,186,247,108,11,105,174,181,116,228,86,43,120,215,232,88,1,101,34,223,208,89,172,178,255,212,84,224,191,205,173,145,85,21,212,180,105,3,45,77,97,30,193,70,236,179,133,129,49,72,132,69,225,25,235,104,229,97,95,230,58,221,19,221,62,211,157,141,103,208,145,236,43,252,33,87,51,44,58,246,222,66,93,219,158,133,243,215,29,175,241,21,1,100,73,142,154,228,16,74,43,162,118,232,116,255,10,208,205,214,76,16,49,126,105,55,76,217,125,143,158,8,167,134,47,136,87,142,141,68,12,33,85,100,202,78,212,163,223,162,32,10,172,196,156,162,132,166,230,102,221,134,203,38,240,7,122,30,69,119,210,237,222,209,108,61,62,213,66,153,82,193,106,71,37,224,131,3,0,151,207,163,50,41,127,37,58,47,54,143,147,172,238,166,37,101,128,27,28,116,239,240,68,251,78,150,210,210,217,68,2,31,32,25,145,248,161,107,164,137,8,128,175,6,86,245,118,35,77,45,168,203,140,187,171,207,49,91,130,247,148,238,94,186,19,29,139,219,231,137,120,118,111,137,223,251,44,39,29,91,244,99,138,205,155,169,247,183,209,252,227,111,135,79,183,108,105,34,245,165,61,21,207,189,52,249,66,198,186,158,184,233,23,142,148,243,198,163,213,95,217,152,133,75,4,139,159,84,242,105,249,183,226,33,11,86,52,60,164,87,218,203,55,181,19,177,134,23,63,235,161,160,184,121,65,52,99,153,218,237,0,224,87,224,237,48,73,245,122,154,104,137,169,152,143,188,89,242,200,84,104,0,218,87,182,132,201,53,30,63,25,132,156,207,102,36,70,27,131,148,223,196,114,133,83,22,255,145,190,157,20,112,104,132,245,238,190,152,78,118,132,16,232,74,97,103,215,226,224,166,124,21,195,137,236,165,227,212,9,236,77,227,112,214,135,134,75,74,91,107,6,233,121,88,207,194,234,215,30,136,157,231,36,18,58,42,130,136,170,157,231,245,153,233,150,232,221,23,22,207,244,50,195,96,78,122,196,33,156,76,157,43,248,183,182,155,56,30,40,199,244,177,110,143,173,132,55,125,41,136,132,80,234,86,230,239,204,192,89,184,47,2,54,179,251,23,29,74,176,167]
result_1 = [54, 180, 180, 190, 54, 190, 54, 52, 180, 188, 188, 190, 190, 62, 54, 54]
result_2 = [190, 60, 188, 60, 180, 180, 54, 54, 62, 60, 52, 62, 180, 188, 182, 60]

result_1 = bytes.fromhex("b053830b5e0f3380f6530cc07eb3d161")
result_2 = bytes.fromhex("6fd558949c72d1a3fcc2d97a6df0d175")

for i in range(32 * 31, -32, -32):
    tmp = cmp_val[i:i+32]
    key1 = tmp[0:16]
    key2 = tmp[16:32]
    result_1 = xor(result_1, key1)
    result_2 = xor(result_2, key2)
    recovered_var0, recovered_var1 = reverse_wasm_shuffle(result_1, result_2)
    result_1 = inv_bytes(recovered_var0)
    result_2 = inv_bytes(recovered_var1)

print(bytes(result_1 + result_2))
```

## Wasm 3 (500 Pts)

### Description

Our good friends at Interrupt Labs have made this challenge.

### Solution

TBU
