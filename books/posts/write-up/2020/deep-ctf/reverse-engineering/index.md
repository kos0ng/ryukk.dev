# Reverse Engineering

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>Nested Rev (150 Pts)</td><td><a href="#nested-rev-150-pts">Here</a></td></tr><tr><td>SkipMe (200 Pts)</td><td><a href="#skipme-200-pts">Here</a></td></tr><tr><td>0xKEY (300 Pts)</td><td><a href="#id-0xkey-300-pts">Here</a></td></tr><tr><td>Down (300 Pts)</td><td><a href="#down-300-pts">Here</a></td></tr><tr><td>Wacha Wachin (500 Pts)</td><td><a href="#wacha-wachin-500-pts">Here</a></td></tr></tbody></table>

## Nested Rev (150 Pts)

### Description

\-

### Solution

<figure><img src="https://cdn-images-1.medium.com/max/800/1*Y-L9pLvdnjMR4eHXCi4nQQ.png" alt=""><figcaption></figcaption></figure>

Using ghidra for open the binary file and go to the main function

<figure><img src="https://cdn-images-1.medium.com/max/800/1*AzYr825i5AM4Z0f7FaMnJg.png" alt=""><figcaption></figcaption></figure>

There are lots of if statement which if we order the variables it will produce flag, but i’m too lazy to do it. So here i am using angr to automate solving that binary.

Finding address of main function

<figure><img src="https://cdn-images-1.medium.com/max/800/1*N89YU9tqdsXsx-KYhbuAUw.png" alt=""><figcaption></figcaption></figure>

Finding instruction for load string “Voila!!! You Got It” from memory using gdb.

<figure><img src="https://cdn-images-1.medium.com/max/800/1*dEhWC40hLB5K1WkZMT2dVg.png" alt=""><figcaption></figcaption></figure>

<figure><img src="https://cdn-images-1.medium.com/max/800/1*EXGA4aH5ZJQIee7cw_rCjQ.png" alt=""><figcaption></figcaption></figure>

After that write a program for find the correct value automatically using angr.

```python
import angr
import monkeyhex
import sys

base=0x400000
main=base+0x0000000000001155
project = angr.Project('binary/Cr4ckm3')
initial_state=project.factory.entry_state(addr=main)
simulation=project.factory.simgr(initial_state)

load_good_address=base+0x0000000000001295
simulation.explore(find=load_good_address)

if simulation.found:
    solution_state = simulation.found[0]
    print(solution_state.posix.dumps(sys.stdin.fileno()))
else:
    raise Exception('Could not find the solution')
```

and here is the result.

<figure><img src="https://cdn-images-1.medium.com/max/800/1*qkZN6_0SYA2jz2go65uUIA.png" alt=""><figcaption></figcaption></figure>

Flag : d33p{y0u\_r3v3rs3d\_1t\_w3ll}

## SkipMe (200 Pts)

### Description

\-

### Solution

<figure><img src="https://cdn-images-1.medium.com/max/800/1*58XpIf7cFE1lY-lQ5Z4X3A.png" alt=""><figcaption></figcaption></figure>

Open the binary using ghidra and go to the main function

<figure><img src="https://cdn-images-1.medium.com/max/800/1*aECffliq6SU33tk7a_2skA.png" alt=""><figcaption></figcaption></figure>

In this challenge we need to change the value of our computer name,os,cpuid to the correct value like in strcmp argument and in the end if our values are correct the program will run finish function. So like the title of challenge **“SkipMe” ,** we can skip all those checks and directly call finish function.

<figure><img src="https://cdn-images-1.medium.com/max/800/1*bQ01jUxz6HeD7QNQau2Htw.png" alt=""><figcaption></figcaption></figure>

<figure><img src="https://cdn-images-1.medium.com/max/800/1*ULVfEBtWOZU3DCYShonZeA.png" alt=""><figcaption></figcaption></figure>

Flag : d33p{f51579e9ca38ba87d71539a9992887ff}

## 0xKEY (300 Pts)

### Description

\-

### Solution

<figure><img src="https://cdn-images-1.medium.com/max/800/1*_uoqlF-9W8ZaDIVJPuVwxQ.png" alt=""><figcaption></figcaption></figure>

Open the binary using ghidra and go to the main function

<figure><img src="https://cdn-images-1.medium.com/max/800/1*h5dtJLuMbqshg18VlaCaFQ.png" alt=""><figcaption></figcaption></figure>

I think this challenge is broke, because we can easily knowing the flag by using ltrace command (because there is strcmp function which compare string and we can find out the argument of strcmp using ltrace command).

<figure><img src="https://cdn-images-1.medium.com/max/800/1*xuOLggRbRBzcY6J7Jms_sg.png" alt=""><figcaption></figcaption></figure>

If there is no strcmp function we can examine the address of secret like this for find out the flag.

<figure><img src="https://cdn-images-1.medium.com/max/800/1*V9ST-ymt3OQ3qRhNLr2Atw.png" alt=""><figcaption><p>main function</p></figcaption></figure>

<figure><img src="https://cdn-images-1.medium.com/max/800/1*5W5oqb1zUgm6Azt9FHU0aQ.png" alt=""><figcaption><p>break after generateMyFlag and then run the program</p></figcaption></figure>

<figure><img src="https://cdn-images-1.medium.com/max/800/1*LVr9keLEwhkvoUhLNZ1MYA.png" alt=""><figcaption><p>examine the value of secret as string and got the flag</p></figcaption></figure>

Flag : d33p{jnhFClg2sv3uaBBxs}

## Down (300 Pts)

### Description

\-

### Solution

<figure><img src="https://cdn-images-1.medium.com/max/800/1*KO38gZHFxTqKF9W5ET-tdw.png" alt=""><figcaption></figcaption></figure>

Open the binary using ghidra

<figure><img src="https://cdn-images-1.medium.com/max/800/1*mT0sdxHaxI_cLMZLvGxpSQ.png" alt=""><figcaption></figcaption></figure>

Nothing helpful, so here i decide to run the file and here is the result.

<figure><img src="https://cdn-images-1.medium.com/max/800/1*oaFLOdkIOWvVyhydt3u6Sw.png" alt=""><figcaption></figcaption></figure>

After clicking ok the program will close, but here we know some string stored on that executable , so the next step is try to examine defined string on that executable.

<figure><img src="https://cdn-images-1.medium.com/max/800/1*cFR0l0DoL2HC9a-6vv9YkQ.png" alt=""><figcaption></figcaption></figure>

Using the address for that string we can find the reference to that address which may be the address of main function.

<figure><img src="https://cdn-images-1.medium.com/max/800/1*SOEQpUZprhDlbVsI3vmncQ.png" alt=""><figcaption></figcaption></figure>

Lets move to assembly tab instead of pseudocode tab to be more obvious.

<figure><img src="https://cdn-images-1.medium.com/max/800/1*3BLevWGUjsrxUBo2A_xefA.png" alt=""><figcaption></figcaption></figure>

from the instruction we know that the program after calling message box will call FUN\_004012c0() which is calling GetTickCount function and the next instrucion is INT (interrupt) 3 which is intended for calling the debug exception handler and this instruction make the program break. There area many int 3 instruction after calling FUN\_004012c0() and then something like garbage after the last int 3 instruction.

<figure><img src="https://cdn-images-1.medium.com/max/800/1*YySmn8b9LnUXyoerdxzrug.png" alt=""><figcaption></figcaption></figure>

Here i try to convert it to assembly instruction and here is the result

<figure><img src="https://cdn-images-1.medium.com/max/800/1*h8_eNbLyFPF7T76zGyLoBg.png" alt=""><figcaption></figcaption></figure>

There are some jump instruction and the last jump instruction lead to the flag.

<figure><img src="https://cdn-images-1.medium.com/max/800/1*ldWjobcgKR65BKsgjuOKQA.png" alt=""><figcaption></figcaption></figure>

So here my solution is changing the assembly instruction int3 to nop so the program can continue to the next instruction and lead to the message box with flag on it.

<figure><img src="https://cdn-images-1.medium.com/max/800/1*iHCQPUPUoVxKGM5q4IgJYQ.png" alt=""><figcaption><p>before patched</p></figcaption></figure>

<figure><img src="https://cdn-images-1.medium.com/max/800/1*DB8p-juVV20JWAlpLSDb0w.png" alt=""><figcaption><p>after patched</p></figcaption></figure>

And then run the file to get the flag

<figure><img src="https://cdn-images-1.medium.com/max/800/1*wPgSVIkJ4XU-NwOOLggSIg.png" alt=""><figcaption></figcaption></figure>

<figure><img src="https://cdn-images-1.medium.com/max/800/1*qxnewrP_fETnEbZwDLzxkg.png" alt=""><figcaption></figcaption></figure>

Flag : d33p{ww\.canabalt.com}

## Wacha Wachin (500 Pts)

### Description

\-

### Solution

<figure><img src="https://cdn-images-1.medium.com/max/800/1*SjESZ_0iHj3S8z4ZRHUb3w.png" alt=""><figcaption></figcaption></figure>

At the beginning i thought the challenge was about reversing the encrypted pdf file , but it didn’t,it was even worse :) . Here is the contents of the pdf file.

<figure><img src="https://cdn-images-1.medium.com/max/800/1*F9NEtVFZLerTWpPhJDYYLw.png" alt=""><figcaption></figcaption></figure>

<figure><img src="https://cdn-images-1.medium.com/max/800/1*2dKsyimqXlwZ9dcR7boVtg.png" alt=""><figcaption></figcaption></figure>

<figure><img src="https://cdn-images-1.medium.com/max/800/1*Q0MkHx58sZpFLMZndosdIQ.png" alt=""><figcaption></figcaption></figure>

That is assembly on arm architecture, here I analyze these instructions manually .

Some arm assembly instruction cheat sheet

```armasm
ADD     R2, R2, R1    ; R2=R2+R1
MOV     R3, R2,LSL#6  ; R3=R2<<6
SUB     R3, R3, R2    ; R3=R3-R2
EOR     R3, R3, R2    ; R3=R3^R2
AND     R3, R3, #0xFF ; R3=R3&0XFF
ORR     R3, R0, R3    ; R3=R0|R3
```

Here i will say set of instruction per box as section, so start from the first section

{% code title="First Section" %}

```armasm
check_flag:
STMFD   SP!, {R11,LR}
ADD     R11, SP, #4
SUB     SP, SP, #0x18
STR     R0, [R11,#var_18]       ; R11,#var_18 is the flag
LDR     R3, =aAqlbn; "AQLbN"
STR     R3, [R11,#var_C]        ; Store "AQLbN" to R11,#var_C  
LDR     R3, =asc_1D250; "-="
STR     R3, [R11,#var_10]       ; Store "-=" to R11,#var_10
LDR     R3, [R11,#var_18]
LDRB    R3, [R3]                ; Load first byte from flag / flag[0]
MOV     R1, R3
MOV     R2, R1                  ; R2 = first byte from flag
MOV     R2, R2,LSL#1            
ADD     R2, R2, R1              
MOV     R3, R2,LSL#6            
SUB     R3, R3, R2              
MOV     R3, R3,LSL#1            
ADD     R3, R3, R1             
MOV     R3, R3,LSL#1
MOV     R2, R3
LDR     R3, [R11,#var_18]       
ADD     R3, R3, #9              
LDRB    R3, [R3]                ; R3 = flag[9]
ADD     R3, R2, R3
LDR     R2, =0x1225C
CMP     R3, R2                  ; compare R3 with 0x1255c
BNE     loc_83F0                ; if same jump to second section , if not same jump to fail section
```

{% endcode %}

{% code title="Second Section" %}

```armasm
LDR     R3, [R11,#var_18]
ADD     R3, R3, #1
LDRB    R2, [R3]                 ; R2 = flag[1]
LDR     R3, [R11,#var_18]
ADD     R3, R3, #8               
LDRB    R3, [R3]                 ; R3 = flag[8]
EOR     R3, R3, R2
AND     R3, R3, #0xFF
MOV     R3, R3,LSL#1
CMP     R3, #0xE                 ; compare R3 with 0xE 
BNE     loc_83EC                 ; if same jump to third section , if not same jump to fail section
```

{% endcode %}

{% code title="Third Section" %}

```armasm
LDR     R3, [R11,#var_18]
ADD     R3, R3, #8             
LDRB    R3, [R3]                 ; R3 = flag[8]
LDR     R2, =0x4EC4EC4F
UMULL   R1, R3, R2, R3           ; Multiply R2 and R3,store the most 
                                    significat 32 digit on R3
MOV     R3, R3,LSR#2
AND     R3, R3, #0xFF
MOV     R2, R3
LDR     R3, [R11,#var_18]
LDRB    R3, [R3]                 ; R3 = flag[0]
ADD     R3, R2, R3
CMP     R3, #0x66 ; 'f'          ; compare R3 with 'f'
BNE     loc_83E8                 ; if same jump to fourth section , if not same jump to fail section
```

{% endcode %}

{% code title="Fourth section" %}

```armasm
LDR     R3, [R11,#var_18]
ADD     R3, R3, #1
LDRB    R3, [R3]                 ; R3 = flag[1]
MOV     R0, R3
LDR     R3, [R11,#var_18]
ADD     R3, R3, #9 
LDRB    R3, [R3]                 ; R3 = flag[9]
MOV     R1, R3
MOV     R3, R1
MOV     R3, R3,LSL#1
ADD     R3, R3, R1
MOV     R2, R3,LSL#3
SUB     R2, R2, R3
MOV     R2, R2,LSL#1
ADD     R3, R2, R1
ORR     R3, R0, R3
LDR     R2, =0x833
CMP     R3, R2                   ; compare R3 and R2
BNE     loc_83E4                 ; if same jump to fifth section , if not same jump to fail section
```

{% endcode %}

{% code title="Fifth section" %}

```armasm
LDR     R3, [R11,#var_18]
ADD     R3, R3, #7
LDRB    R3, [R3]                 ; R3 = flag[7]
CMP     R3, #0x69 ; 'i'          ; compare R3 with 'i'
BNE     loc_83E0                 ; if same jump to loop section , if not same jump to fail section
```

{% endcode %}

{% code title="" %}

```armasm
MOV     R3, #0                   ; set initiate value for looping, R3=0
STR     R3, [R11,#var_8]         ; save R3=0 to R11,#var_8
B       loc_83D0                 ; jump to next instruction
LDR     R3, [R11,#var_8]         ; Load value from R11,#var_8 and save to R3
CMP     R3, #4                   ; compare r3 with 4
BLE     loc_8368                 ; if r3<=4 jump to next instruction,if not jump to win
LDR     R3, [R11,#var_8]
ADD     R3, R3, #2               ; R3=R3+2
MOV     R2, R3                   ; R2=R3
LDR     R3, [R11,#var_18]
ADD     R3, R3, R2
LDRB    R2, [R3]                 ; R3=flag[R2] , R2 will be 2,3,4,5,6
LDR     R3, [R11,#var_8]
CMP     R3, #0
AND     R3, R3, #1               ; check odd or even ,if odd result = 1, even result = 0
RSBLT   R3, R3, #0               ; if r3<0 set r3=0-r3 ( absolute )
MOV     R1, R3
LDR     R3, [R11,#var_10]    
ADD     R3, R3, R1
LDRB    R3, [R3]                 ; R3=var_10[R1] , R1 will be 0,1,0,1,0
EOR     R3, R3, R2
AND     R2, R3, #0xFF
LDR     R3, [R11,#var_8]
LDR     R1, [R11,#var_C]
ADD     R3, R1, R3
LDRB    R3, [R3]                 ; R3=var_C[R3] , R3 will be 0,1,2,3,4
CMP     R2, R3                   ; compare R2 with R3
BEQ     loc_83C4                 ; if same jump to next instruction, if not same jump to fail section     
LDR     R3, [R11,#var_8]        
ADD     R3, R3, #1
STR     R3, [R11,#var_8]         ; var_8=var_8+1
```

{% endcode %}

The next step is writing script for bruteforcing the value per section.&#x20;

* On the first section i got exact value for flag\[0] and flag\[9].&#x20;
* On the second section i got many possibilities for flag\[1] and flag\[8] , so we keep the value and go to third section.&#x20;
* On third section i failed to find value for flag\[8] ( i think because i fail to implement umull instruction ) so i decided to go to fourth section.
* On fourth section i got exact value for flag\[1] and on the second section we know that flag\[1] and flag\[8] in pairs , so from fourth section i got value for flag\[1] and flag\[8]. Fifth section is the clearest section,flag\[7]=’i’ .
* The last is loop section , on loop section we will get values for flag\[2] until flag\[6]. Here is my script i used to get the flag using bruteforce method.

```python
import string

flag=[0]*10
r3="AQLbN"
varc=list(r3)
r3="-="
var10=list(r3)
for i in string.printable[:-6]:
	r1=ord(i)
	r2=r1
	r2=r2<<1
	r2=r2+r1
	r3=r2<<6
	r3=r3-r2
	r3=r3<<1
	r3=r3+r1
	r3=r3<<1
	r2=r3
	for j in string.printable[:-6]:
		r3=r2+ord(j)
		r2=0x1225C
		if(r3==r2):
			flag[0]=i
			flag[9]=j
			break
x=[]
y=[]
for i in string.printable[:-6]:
	r2=ord(i)
	for j in string.printable[:-6]:
		r3=ord(j)^r2
		r3=r3&0xff
		r3=r3<<1
		if(r3==0xe):
			x.append(j)
			y.append(i)
for i in y:
	r0=ord(i)
	r3=ord(flag[9])
	r1=r3
	r3=r1
	r3=r3<<1
	r3=r3+r1
	r2=r3<<3
	r2=r2-r3
	r2=r2<<1
	r3=r2+r1
	r3=r0|r3
	r2=0x833
	if(r3==r2):
		flag[1]=i
		flag[8]=x[y.index(i)]
		break
flag[7]='i'
var8=0
r3=var8
z=[]
while(var8<=4):
	r3=var8
	r3=r3+2
	count=r3
	for j in string.printable[:-6]:
		r2=ord(j)
		r3=var8
		r3=r3&1
		if(r3<0):
			r3=0-r3
		r1=r3
		r3=var10
		r3=ord(r3[r1])
		r3=r3^r2
		r2=r3&0xff
		r3=var8
		r1=varc
		r3=r1[r3]
		if(r2==ord(r3)):
			flag[count]=j
	r3=var8
	r3=r3+1
	var8=r3
print 'd33p{'+''.join(flag)+'}'
```

or you can see the [full script](https://github.com/kos0ng/ctf-writeups/blob/master/solver/2020/deepCTF2020/solver_wachan.py) include my comment while debugging.

Flag : d33p{b3lla\_ci40}
