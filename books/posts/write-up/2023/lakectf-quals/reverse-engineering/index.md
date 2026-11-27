# Reverse Engineering

<!-- challenge-index: 8c69f8a91b6d3010 -->

| Challenge | Topic |
| --- | --- |
| [dive in the lake (50 pts)](#dive-in-the-lake-50-pts) | LLVM IR, Constraint Solving |
| [FUNTRAN (115 pts) UPSOLVE](#funtran-50-pts) | Fortran, Numerical Integration |
| [TheGoodGod (264 pts)](#thegoodgod-264-pts) | Control Flow Obfuscation, GDB |
| [smolene's latest obsession (338 pts) UPSOLVE](#smolenes-latest-obsession-338-pts) | Forth, Stack Interpreter |

<!-- /challenge-index -->

## dive in the lake (50 pts)

### Description

Can you make it to 320m?

### Solution

Given ELF 64 bit, open it using IDA

<figure><img src="images/d20448b6d4bfa2e99488a9bb.png" alt=""><figcaption></figcaption></figure>

Program receive input using argument and in this case there are 3 arguments needed. All arguments passed to function f.

<figure><img src="images/19dc4b3dbc02f5ceec074d53.png" alt=""><figcaption></figcaption></figure>

function f just add those 3 arguments and return the result. Looking at another function i dont see any suspicious function available, so there should be something in another place (outside .text section). The first approach i do is executing strings command to the executable

<figure><img src="images/c56c10723fafc57a593b8ad4.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/143d0920e9b316e5626ae7c3.png" alt=""><figcaption></figcaption></figure>

So there are some suspicious section such as .debug\_info, searching that section i found this reference <https://stackoverflow.com/questions/77169835/issue-in-parsing-dwarf-debug-info-section-in-an-elf-file>. .debug\_info section has relation with dwarf, searching about how to dump dwarf information from ELF file i found dwarfdump command. Execute dwarfdump command i got this result

<figure><img src="images/62701614dd56b52ca4c8198a.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/d78068e0779fcc819fc0d449.png" alt=""><figcaption></figcaption></figure>

We can see that the start address is 0x00001147 which is the end of function f.

<figure><img src="images/cdb485aa5e4dde6e5d4d46f6.png" alt=""><figcaption></figcaption></figure>

Searching about dumped instruction i found that those instruction called dwarf expression <https://llvm.org/docs/AMDGPUDwarfExtensionAllowLocationDescriptionOnTheDwarfExpressionStack/AMDGPUDwarfExtensionAllowLocationDescriptionOnTheDwarfExpressionStack.html>. Next step i do is searching any useful command in GDB that related to dwarf expression and found that we can dump the instruction using info scope command <https://yourlabs.org/posts/2014-04-13-gdb-debugging-basics/> .&#x20;

<figure><img src="images/d5d296cef7c92576c678d416.png" alt=""><figcaption></figcaption></figure>

My approach is trying to reconstruct the whole instruction in python with reference <https://dwarfstd.org/doc/DWARF5.pdf>. Here is my reimplemented code

```python
def push(arr, val):
  arr.insert(0, val)

def and_op(arr):
  tmp1 = arr.pop(0)
  tmp2 = arr.pop(0)
  tmp3 = tmp1 & tmp2
  push(arr, tmp3)

def mul_op(arr):
  tmp1 = arr.pop(0)
  tmp2 = arr.pop(0)
  tmp3 = tmp1 * tmp2
  push(arr, tmp3)

def mul_op(arr):
  tmp1 = arr.pop(0)
  tmp2 = arr.pop(0)
  tmp3 = tmp1 + tmp2
  push(arr, tmp3)

def ne_op(arr):
  tmp1 = arr.pop(0)
  tmp2 = arr.pop(0)
  return tmp1 != tmp2


stack = []

rdi = 123
rsi = 123
rdx = 123

push(stack, 1)
push(stack, rdi)
push(stack, rsi)
and_op(stack)
push(stack, rdx)
and_op(stack)
push(stack, 7219272754963824708)

if(ne_op(stack) == 0):
  push(stack, 3)
  mul_op(stack)

push(stack, 9259542123273814144)
push(stack, 9259542123273814144)
push(stack, 9259542123273814144)
push(stack, rdi)
and_op(stack)
push(stack, 0)

if(ne_op(stack) == 0):
  push(stack, rsi)
  and_op(stack)
  tmp = stack.pop(0)
  
  if(tmp == 0):
    push(stack, rdx)
    and_op(stack)
    tmp = stack.pop(0)
    if(tmp == 0):
      push(stack, 3)
      mul_op(stack)
  
  push(stack, rdi)
  push(stack, rdi)
  mul_op(stack)

  push(stack, rsi)
  push(stack, rsi)
  mul_op(stack)
  
  add_op(stack)
  push(stack, 18116903027530606121)
  
  if(ne_op(stack) == 0):
    push(stack, 3)
    mul_op(stack)
  
  push(stack, rdx)
  push(stack, rdx)
  mul_op(stack)

  push(stack, rsi)
  push(stack, rsi)
  mul_op(stack)

  add_op(stack)
  push(stack, 16612709672999228116)
  
  if(ne_op(stack) == 0):
    push(stack, 7)
    mul_op(stack)
  
  print(stack.pop(0)) # should be 189
```

Lets analyze each part

* So we need to get value 189 which is the result of all correct input
  * 1\*3\*3\*3\*7
* rdi & rsi & rdx == 7219272754963824708
  \*

  <figure><img src="images/a07d886366e022932481eceb.png" alt=""><figcaption></figcaption></figure>
* rdi, rsi, rdx are printable (<=0x7f)

  * rdi, rsi, rdx & 0x8080808080808080 == 0
  *

  <figure><img src="images/381dfc1f68ecd4299425af76.png" alt=""><figcaption></figcaption></figure>
* rdi\*rdi + rsi\*rsi == 18116903027530606121
  \*

  <figure><img src="images/90f0d4de0afc4cb1e1f60270.png" alt=""><figcaption></figcaption></figure>
* rdx\*rdx + rsi\*rsi == 16612709672999228116
  \*

  <figure><img src="images/f6419d0526a86135c4dff563.png" alt=""><figcaption></figcaption></figure>

We can see that the constraint looks like solveable using SMT solver like z3. So the last step is creating script to find the valid value for rdi, rsi, and rdx using z3. Here is my script

```python
from z3 import *
from Crypto.Util.number import *

rdi = BitVec('x', 64)
rsi = BitVec('y', 64)
rdx = BitVec('z', 64)

s = Solver()

s.add(rdi & rsi & rdx == 7219272754963824708)
s.add(rdi*rdi + rsi*rsi == 18116903027530606121)
s.add(rdx*rdx + rsi*rsi == 16612709672999228116)
s.add(rdi & 0x8080808080808080 == 0)
s.add(rsi & 0x8080808080808080 == 0)
s.add(rdx & 0x8080808080808080 == 0)

print(s.check())
model = s.model()

flag = long_to_bytes(model[rdi].as_long())[::-1]
flag += long_to_bytes(model[rsi].as_long())[::-1]
flag += long_to_bytes(model[rdx].as_long())[::-1]
print(flag)
```

<figure><img src="images/d4b26cf402386ec289485bc8.png" alt=""><figcaption></figcaption></figure>

Flag : EPFL{\_1tTookS3venDwarf5}

## FUNTRAN (50 pts)

### Description

### Solution

## TheGoodGod (264 pts)

### Description

History teaches us there are good gods and bad ones. Good ones write their own deobfuscator. Bad ones just guess the flag directly.

### Solution

Given ELF 64 bit, open it using IDA

<figure><img src="images/52f2c28493100f760531760f.png" alt=""><figcaption></figcaption></figure>

There is obfuscation on main function, through debugging we can know which instruction executed and which are not. In this case i try to dump executed instruction by automating the next instruction process.

```python
#!/usr/bin/python3
import string
import os
import string

class SolverEquation(gdb.Command):
    def __init__ (self):
        super (SolverEquation, self).__init__ ("solve-equation",gdb.COMMAND_OBSCURE)
    
    def invoke (self, arg, from_tty):
        
        gdb.execute("pie b 0x15ce")
        gdb.execute("pie run < x.txt")
        arch = gdb.selected_frame().architecture()
        dict = {}
        main_iter = 1564 # trial and error
        for _ in range(main_iter):
            print(_)
            current_pc = addr2num(gdb.selected_frame().read_register("pc"))
            disa = arch.disassemble(current_pc)[0]
            addr = current_pc - 0x555555554000
            if(addr not in dict):
                dict[addr] = [disa["asm"], disa["length"]]
            gdb.execute("ni")
        for i in dict:
            print(f"{hex(i)} : {dict[i]}")
        
def addr2num(addr):
    try:
        return int(addr)  # Python 3
    except:
        return long(addr) # Python 2
SolverEquation()
```

```armasm
0x15ce : ['and    r11,0x7fff', 7]
0x15d5 : ['mov    rax,r11', 3]
0x15d8 : ['imul   rax,r11', 4]
0x15dc : ['add    r11,rax', 3]
0x15df : ['and    r11,0x1', 4]
0x15e3 : ['ja     0x5555555555e7', 2]
0x15e5 : ['push   rbp', 1]
0x15e6 : ['mov    rbp,rsp', 3]
0x15e9 : ['sub    rsp,0x20', 4]
0x15ed : ['and    rax,0x7fff', 6]
0x15f3 : ['mov    r11,rax', 3]
0x15f6 : ['imul   r11,rax', 4]
0x15fa : ['add    rax,r11', 3]
0x15fd : ['and    rax,0x1', 4]
0x1601 : ['je     0x555555555605', 2]
0x1605 : ['mov    DWORD PTR [rbp-0x14],edi', 3]
0x1608 : ['mov    QWORD PTR [rbp-0x20],rsi', 4]
0x160c : ['lea    rax,[rip+0xa1a]        # 0x55555555602d', 7]
0x1613 : ['mov    rdi,rax', 3]
0x1616 : ['mov    eax,0x0', 5]
0x161b : ['call   0x555555555050 <printf@plt>', 5]
0x1620 : ['and    r11,0x7fff', 7]
0x1627 : ['mov    rdx,r11', 3]
0x162a : ['imul   rdx,r11', 4]
0x162e : ['add    r11,rdx', 3]
0x1631 : ['and    r11,0x1', 4]
0x1635 : ['ja     0x55555555563a', 2]
0x1637 : ['mov    rax,QWORD PTR [rip+0x2a22]        # 0x555555558060 <stdin>', 7]
0x163e : ['mov    rdx,rax', 3]
0x1641 : ['mov    esi,0x39', 5]
0x1646 : ['and    r11,0x7fff', 7]
0x164d : ['mov    rax,r11', 3]
0x1650 : ['imul   rax,r11', 4]
0x1654 : ['add    r11,rax', 3]
0x1657 : ['and    r11,0x1', 4]
0x165b : ['je     0x55555555565f', 2]
0x165f : ['lea    rax,[rip+0x2a1a]        # 0x555555558080', 7]
0x1666 : ['mov    rdi,rax', 3]
0x1669 : ['call   0x555555555080 <fgets@plt>', 5]
0x166e : ['test   rax,rax', 3]
0x1671 : ['jne    0x55555555567d', 2]
0x167d : ['and    rcx,0x7fff', 7]
0x1684 : ['mov    rax,rcx', 3]
0x1687 : ['imul   rax,rcx', 4]
0x168b : ['add    rcx,rax', 3]
0x168e : ['and    rcx,0x1', 4]
0x1692 : ['je     0x555555555696', 2]
0x1696 : ['mov    BYTE PTR [rip+0x2a1b],0x0        # 0x5555555580b8', 7]
0x169d : ['mov    QWORD PTR [rbp-0x8],0x0', 8]
0x16a5 : ['jmp    0x555555555712', 2]
0x1712 : ['cmp    QWORD PTR [rbp-0x8],0x38', 5]
0x1717 : ['jbe    0x5555555556a7', 2]
0x16a7 : ['and    rax,0x7fff', 6]
0x16ad : ['mov    rdx,rax', 3]
0x16b0 : ['imul   rdx,rax', 4]
0x16b4 : ['add    rax,rdx', 3]
0x16b7 : ['and    rax,0x1', 4]
0x16bb : ['je     0x5555555556c2', 2]
0x16c2 : ['mov    rax,QWORD PTR [rbp-0x8]', 4]
0x16c6 : ['lea    rdx,[rax*4+0x0]', 8]
0x16ce : ['lea    rcx,[rip+0x29ab]        # 0x555555558080', 7]
0x16d5 : ['mov    rax,QWORD PTR [rbp-0x8]', 4]
0x16d9 : ['add    rax,rcx', 3]
0x16dc : ['movzx  eax,BYTE PTR [rax]', 3]
0x16df : ['movsx  eax,al', 3]
0x16e2 : ['mov    esi,eax', 2]
0x16e4 : ['lea    rax,[rip+0x29d5]        # 0x5555555580c0', 7]
0x16eb : ['mov    rdi,rax', 3]
0x16ee : ['call   0x555555555189', 5]
0x16f3 : ['and    rax,0x7fff', 6]
0x16f9 : ['mov    rcx,rax', 3]
0x16fc : ['imul   rcx,rax', 4]
0x1700 : ['add    rax,rcx', 3]
0x1703 : ['and    rax,0x1', 4]
0x1707 : ['je     0x55555555570d', 2]
0x170d : ['add    QWORD PTR [rbp-0x8],0x1', 5]
0x1719 : ['and    r10,0x7fff', 7]
0x1720 : ['mov    rcx,r10', 3]
0x1723 : ['imul   rcx,r10', 4]
0x1727 : ['add    r10,rcx', 3]
0x172a : ['and    r10,0x1', 4]
0x172e : ['je     0x555555555734', 2]
0x1734 : ['mov    edx,0x39', 5]
0x1739 : ['lea    rax,[rip+0x28e0]        # 0x555555558020', 7]
0x1740 : ['mov    rsi,rax', 3]
0x1743 : ['and    r8,0x7fff', 7]
0x174a : ['mov    r11,r8', 3]
0x174d : ['imul   r11,r8', 4]
0x1751 : ['add    r8,r11', 3]
0x1754 : ['and    r8,0x1', 4]
0x1758 : ['ja     0x55555555575b', 2]
0x175a : ['lea    rax,[rip+0x291f]        # 0x555555558080', 7]
0x1761 : ['mov    rdi,rax', 3]
0x1764 : ['call   0x55555555528c', 5]
0x1769 : ['test   eax,eax', 2]
0x176b : ['jne    0x5555555557e8', 2]
0x17e8 : ['and    rax,0x7fff', 6]
0x17ee : ['mov    r11,rax', 3]
0x17f1 : ['imul   r11,rax', 4]
0x17f5 : ['add    rax,r11', 3]
0x17f8 : ['and    rax,0x1', 4]
0x17fc : ['ja     0x5555555557ff', 2]
0x17fe : ['lea    rax,[rip+0x83d]        # 0x555555556042', 7]
0x1805 : ['mov    rdi,rax', 3]
0x1808 : ['call   0x555555555030 <puts@plt>', 5]
0x180d : ['mov    eax,0x0', 5]
```

From the trace we can see that there are two type of obfuscation.

* Dont execute jump in ja
  \*

  <figure><img src="images/c0f51b2d7a350da47bda3159.png" alt=""><figcaption></figcaption></figure>
* Execute jump in je
  \*

  <figure><img src="images/6cf49871d1da641e82d0db9c.png" alt=""><figcaption></figcaption></figure>

So there is a pattern although it use different register on each obfuscation part. With those knowledge we can create script to automatically deobfuscate the program.

```python
from idaapi import *
import idc
import ida_bytes

def deobfuscate(address):
	start_address = address
	insn = insn_t()
	last_inst = ""
	list_inst = []
	
	for i in range(500):
		create_insn(start_address)
		size = decode_insn(insn, start_address)
		inst = idc.print_insn_mnem(start_address)
		operand = []
		
		for j in range(3):
			tmp = idc.print_operand(start_address, j)
			if(tmp == ''):
				break
			operand.append(tmp)
		
		joined_operand = ','.join(operand)
		list_inst.append([start_address, size, inst, joined_operand])
	
		if(inst == "jz" and last_inst == "and"):
			tmp = joined_operand.split("_")[-1].split("+")
			new_addr = 0
			for j in range(len(tmp)):
				new_addr += int(tmp[j], 16)
			ida_bytes.del_items(start_address + size)
			ida_bytes.del_items(new_addr + 1)
			
			for j in range(1,7):
				tmp_inst = list_inst[-1*j]
				for k in range(tmp_inst[1]):
					patch_byte(tmp_inst[0]+k, 0x90)
			for j in range(start_address, new_addr):
				patch_byte(j, 0x90)
			
			start_address = new_addr
		elif(inst == "ja" and last_inst == "and"):
			for j in range(1,7):
				tmp_inst = list_inst[-1*j]
				for k in range(tmp_inst[1]):
					patch_byte(tmp_inst[0]+k, 0x90)
		elif(inst == "retn"):
			break
		else:
			start_address += size
		last_inst = inst

list_address = [0x1189, 0x128C, 0x15ce]
for start_address in list_address:
	deobfuscate(start_address)
```

The script will automatically nop obfuscation part then we can decompile the function. To create a function we can follow step below

1. Undefine instruction (press u)
2. Make instruction (press c)
3. Create function on push rbp (press p)

In some part we will facing issue regarding the old xreference, to patch it we can do undefine instruction then make instruction on address that has xreference. Here is the final code after deobfuscation

<figure><img src="images/4ee2cb41146790240e29cf9b.png" alt=""><figcaption><p>main function</p></figcaption></figure>

<figure><img src="images/224d037a12d0b6b1668090dd.png" alt=""><figcaption><p>sub_1189 function</p></figcaption></figure>

<figure><img src="images/e6d22ecba07b2539411b5ef6.png" alt=""><figcaption><p>sub_12a3 function</p></figcaption></figure>

Here is the analysis for each function

* main
  * receive input
  * call sub\_1189 0x39 times. sub\_1189 process our input and store it to unk\_40c0
  * call sub\_12a3. sub\_12a3 process our input.
  * compare unk\_40c0 with unk\_2010 (static values)
* sub\_1189
  * Do some arithmetic operation
  * Each 4 bytes on input will be stored on 3 bytes result
    * i = \[0,1,2,3]
      * (4\*i) >> 3 = \[0, 0, 1, 1] -> index on a1
      * ((4\*i) >> 3) + 1 = \[None, 1, None, 2] -> index on a1
* sub\_12a3
  * Compare the count of character on a1 and a2, e.g:
    * a1 = "aabc", a2 = "caba"
    * sub\_12a3(a1, a2) -> True
      * Since count of "a" in a1 and a2 is 2
      * Since count of "b" in a1 and a2 is 1
      * Since count of "c" in a1 and a2 is 1

Basically we can bruteforce 4 bytes input then compare 2 bytes result since those 2 bytes will not processed in further iteration. There will be many possibility but we can reduce the possibility and accelerate the process by modifying charset for each product iteration. In this case i implement that algorithm as recursive function. Here is my solver

```python
import string
from itertools import product

def sub_1189(a1, a2, a3):
	a1[a3 >> 3] ^= (a2 >> (a3 & 7))
	if((a3 & 7) != 0):
		a1[(a3 >> 3) + 1] ^= (a2 << (8 - (a3&7)))&0xff

def recur(arr, flag, charset):
	if(len(flag) >= 56 ):
		print(f"Possible Flag : {flag}")
	for i in product(charset, repeat=4):
		arr2 = arr[:]
		tmp = flag + ''.join(i).encode()
		for j in range(len(flag), len(tmp)):
			sub_1189(arr2, tmp[j], 4*j)
		if(arr2[:len(tmp)//2] == cmp_val[:len(tmp)//2]):
			charset_tmp = charset[:]
			for k in charset_tmp:
				tmp2 = tmp.count(k.encode())
				tmp3 = charset_ori.count(k)
				if(tmp2 == tmp3):
					charset_tmp.remove(k)
			recur(arr2, tmp, charset_tmp)

charset_ori = [0x33, 0x33, 0x33, 0x34, 0x34, 0x34, 0x34, 0x35, 0x35, 0x36, 0x38, 0x45, 0x46, 0x4c, 0x50, 0x5f, 0x5f, 0x5f, 0x5f, 0x5f, 0x5f, 0x5f, 0x5f, 0x5f, 0x5f, 0x5f, 0x61, 0x61, 0x61, 0x64, 0x65, 0x65, 0x65, 0x66, 0x68, 0x68, 0x69, 0x69, 0x6c, 0x6c, 0x6d, 0x6e, 0x6e, 0x72, 0x73, 0x74, 0x74, 0x74, 0x74, 0x76, 0x77, 0x7a, 0x7a, 0x7a, 0x7b, 0x7d]
charset_ori = [chr(i) for i in charset_ori]

flag = b"EPFL"

for i in flag:
	charset_ori.remove(chr(i))

uniq = []
for i in charset_ori:
	if(i not in uniq):
		uniq.append(i)

cmp_val = [0x40, 0x42, 0xb8, 0x4f, 0x92, 0xe5, 0x26, 0x33, 0xee, 0xa0, 0xc1, 0x97, 0xbc, 0x4f, 0x81, 0x43, 0x81, 0xe2, 0xdc, 0x2b, 0x92, 0xf9, 0xf, 0x73, 0x96, 0x18, 0x2b, 0x33, 0xd0]

arr = [0 for _ in range(57)]

for i in range(len(flag)):
	sub_1189(arr, flag[i], 4*i)
recur(arr, flag, uniq)
```

<figure><img src="images/15f7a8831ef10163467b43d1.png" alt=""><figcaption></figcaption></figure>

Flag : EPFL{3z\_disa55em8le\_4\_an\_3z\_r3v\_with\_4n\_ez\_fl46\_at\_th4t}

## smolene's latest obsession (338 pts)

### Description

### Solution
