# Reverse Engineering

<!-- challenge-index: 38cf69a249c6cff0 -->

| Challenge | Topic |
| --- | --- |
| [jumpout (84 pts)](#jumpout-84-pts) | Control Flow Obfuscation, XOR |
| [Sickle (106 pts)](#sickle-106-pts) | Python Pickle, Disassembly |
| [Perfect Blu (135 pts)](#perfect-blu-135-pts) | Blu-ray Bytecode |
| [optinimize (152 pts)](#optinimize-152-pts) | Nim, Big Integer Arithmetic |
| [xuyao (176 pts)](#xuyao-176-pts) | Custom Block Cipher |

<!-- /challenge-index -->

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FNxDUjcOM7l4q0gGpsJbA%2Fimage.png?alt=media&amp;token=0e75603a-7d39-4274-9bbe-f0de77306d45" alt=""><figcaption></figcaption></figure>

## jumpout (84 pts)

### Description

Sequential execution

### Solution

Given ELF 64 bit, decompile with IDA

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FXLIp5t1EGu3ThhraXyag%2Fimage.png?alt=media&amp;token=772a0812-1b83-4a95-ace4-8ffe7e4ed981" alt=""><figcaption></figcaption></figure>

Basically the program receive input then it will validate the input. In this case we can't directly see the algorithm since the program call the function by jumping to some address. So, to get the correct algorithm one of the way we can do is debugging. Run the program then press ctrl+c

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FwOBR6QojNb6l9zrnpBkH%2Fimage.png?alt=media&amp;token=59314a99-9316-4f08-add5-b276fda89b03" alt=""><figcaption></figcaption></figure>

Use bt command to see the backtrace

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FaA4h8lPV4lPWKFNGuXsA%2Fimage.png?alt=media&amp;token=9cea9b07-18b4-4941-818c-95da503be491" alt=""><figcaption></figcaption></figure>

Set breakpoint on 0x555555555203 then run again the program

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FVLTUrNvUIqhNL0YguQwT%2Fimage.png?alt=media&amp;token=a8d3fb8f-4693-4714-989a-cba2a79736ce" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F5GcqiP6sWdA16k3qNJrX%2Fimage.png?alt=media&amp;token=5f172f10-7dfe-4dc9-ac08-9c20b909c7ba" alt=""><figcaption></figcaption></figure>

Set hardware breakpoint on address that store our input. Then continue

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FywtmWoxncHKnxRSXCZrP%2Fimage.png?alt=media&amp;token=8d893cf6-0190-404c-934e-f280b4c4a37d" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FMizdKok2lRviGl1ojEkG%2Fimage.png?alt=media&amp;token=65d3f68a-2eaf-4bba-9d0a-b829efb8ae1d" alt=""><figcaption></figcaption></figure>

So our input length should be 0x1d . Set breakpoint on 0x5555555554f4 then rerun the program with input that has length 0x1d . Step in to next instruction until found interesting instruction such as xoring our value with index (0x555555555453) and with static value 0x55 (0x55555555543b)

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FwxAljeMCdu5nVn64NiXj%2Fimage.png?alt=media&amp;token=73bf890a-751e-414f-b959-b07b3f5af7e5" alt=""><figcaption></figcaption></figure>

&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FIDTZEdKVg196TMUGHDrh%2Fimage.png?alt=media&amp;token=e825bb29-d2ae-4cdb-82f1-4b2b9df517a5" alt=""><figcaption></figcaption></figure>

After calculated the input program will xored again with value on 0x55555555540b. r9d register filled with value from address on $r10+$rdi with $rdi == index.&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FWvJgXq80LSb6NyVztdrN%2Fimage.png?alt=media&amp;token=57f7d685-6850-4b3b-abe6-3b612ca9dfc1" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FsFIG4WclOja8Dz7KfqR1%2Fimage.png?alt=media&amp;token=17cec32e-f0f5-4c61-9ce2-4a8ac9efed3a" alt=""><figcaption></figcaption></figure>

Dump the values using command below

```bash
print-format --length 0x1d --bitlen 8 $r10
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fk2LnZpfny1FUKY7qDwUr%2Fimage.png?alt=media&amp;token=81a6636e-04f2-41d5-bd6a-e45a8766b5be" alt=""><figcaption></figcaption></figure>

Continue the flow we will see instruction that compare our calculated input on 0x55555555557c . Dump the values then write script to get the flag, since the program only do xor so we can directly implement the same process to get the actual input (flag)

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FCN3CZO5MckaRwwjPNH9d%2Fimage.png?alt=media&amp;token=3131afe7-8a9d-4e5e-a437-ef09541a7f22" alt=""><figcaption></figcaption></figure>

```python
buf1 = [0xf6, 0xf5, 0x31, 0xc8, 0x81, 0x15, 0x14, 0x68, 0xf6, 0x35, 0xe5, 0x3e, 0x82, 0x9, 0xca, 0xf1, 0x8a, 0xa9, 0xdf, 0xdf, 0x33, 0x2a, 0x6d, 0x81, 0xf5, 0xa6, 0x85, 0xdf, 0x17]
buf2 = [0xf0, 0xe4, 0x25, 0xdd, 0x9f, 0xb, 0x3c, 0x50, 0xde, 0x4, 0xca, 0x3f, 0xaf, 0x30, 0xf3, 0xc7, 0xaa, 0xb2, 0xfd, 0xef, 0x17, 0x18, 0x57, 0xb4, 0xd0, 0x8f, 0xb8, 0xf4, 0x23]

flag = b""
for i in range(len(buf1)):
	flag += bytes([buf1[i]^buf2[i]^0x55^i])
print(flag)
```

Flag : SECCON{jump\_table\_everywhere}

## Sickle (106 pts)

### Description

Pickle infected with COVID-19

### Solution

Given python script that load pickle data (serialized payload). Actually i've tried pickle reverse engineering challenge on [LACTF](https://github.com/kos0ng/ctf-writeups/tree/c8cccc9005f68ac3cc15c23f2c3cdee75ab60568/solver/2023/lactf/re/snek). We can decompile pickle data using fickling <https://github.com/trailofbits/fickling>. But somehow in this case we can't decompile the data and got error.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FzO7JigJb3AkTMryoODsD%2Fimage.png?alt=media&amp;token=0eebb5e6-3492-46fc-a66a-28a3a740cf38" alt=""><figcaption></figcaption></figure>

To know the next decompiled code, i rewrite the library and add some line of code to skip the error and continue the decompile process. Open the source code, in my machine the code stored in `/Users/kosong/.pyenv/versions/3.11.2/lib/python3.11/site-packages/fickling/pickle.py`

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FYwAVaxC21aZ2Y5Bv1myj%2Fimage.png?alt=media&amp;token=9de3d9db-0376-4bb0-8460-8cd6f8e04e81" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F0iRHh9cr6yUpIyav5M02%2Fimage.png?alt=media&amp;token=9fd71f62-a5b1-491f-8773-3405c3855fa0" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F8XDnjnd34LjltKVUv0Qr%2Fimage.png?alt=media&amp;token=5b3dba60-b22c-4cf8-bf03-c366570d638c" alt=""><figcaption></figcaption></figure>

So i add new variable `tmp_val` to store all pushed object and when there is error caused by pop from empty stack i just pop some random object from fake stack (tmp\_val). Run the fickling again and we will get pseudocode of pickle data.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Ft6vT8K2cfc1ZsGW0XIpS%2Fimage.png?alt=media&amp;token=10405dee-026c-48bf-b5ab-e5b0f947a08b" alt=""><figcaption></figcaption></figure>

```python
_var0 = input('FLAG> ')
_var1 = getattr(_var0, 'encode')
_var2 = _var1()
_var3 = getattr(dict, 'get')
_var4 = globals()
_var5 = _var3(_var4, 'f')
_var6 = getattr(_var5, 'seek')
_var7 = getattr(int, '__add__')
_var8 = getattr(int, '__mul__')
_var9 = getattr(int, '__eq__')
_var10 = len(_var2)
_var11 = _var9(_var10, 64)
_var12 = _var7(_var11, 261)
_var13 = _var6(_var12)
result0 = _var13
_var14 = 'builtins'('builtins', '__getitem__')
_var15 = 'builtins'(_var14)
_var16 = 'builtins'(_var15, '__le__')
_var17 = _var16(127)
_var18 = 'builtins'(_var17, 330)
_var19 = 'builtins'(_var18)
result1 = _var19
_var20 = 'builtins'('builtins', 1)
_var21 = 'builtins'(_var20, 64)
_var22 = 'builtins'(_var21, 85)
_var23 = 'builtins'(_var22, 290)
_var24 = 'builtins'(_var23)
_var25 = 'builtins'([], 'append')
_var26 = 'builtins'('builtins', '__getitem__')
_var27 = 'builtins'(int, 'from_bytes')
_var28 = _var27(0, 8)
_var29 = _var26(0, 1)
_var30 = _var27(_var29, 8)
_var31 = slice(_var28, _var30)
_var32 = 'builtins'(_var31)
_var33 = 'builtins'(_var32, 'little')
_var34 = 'builtins'(_var33)
_var35 = _var26(0, 1)
_var36 = _var27(_var35, 8)
_var37 = _var26(_var36, 119)
_var38 = _var25(_var37, 457)
_var39 = 'builtins'(_var38)
_var40 = 'builtins'([], 'append')
_var41 = 'builtins'('builtins', '__getitem__')
_var42 = 'builtins'(int, '__xor__')
_var43 = pow(0)
_var44 = 'builtins'('builtins', _var43)
_var45 = 'builtins'(_var44, 65537, 18446744073709551557)
_var46 = 'builtins'(_var45)
_var47 = 'builtins'(0)
_var48 = _var26(0, 1)
_var49 = [](_var48, 8)
_var50 = _var27(_var49, 131)
_var51 = _var26(_var50, 679)
_var52 = _var25(_var51)
_var53 = 'builtins'('builtins', '__eq__')
_var54 = _var53([8215359690687096682, 1862662588367509514, 8350772864914849965, 11616510986494699232, 3711648467207374797, 9722127090168848805, 16780197523811627561, 18138828537077112905])
result2 = _var54
```

Although the produced code is not correct but we still guess some part of the code. Here is recovered algorithm we found

* Our input should be 64 bytes length
* Something sliced each 8 byte then converted to int
* Something calculated using xor
* RSA algorithm found with prime modulus
  * pow(something, 65537, 18446744073709551557)
* Something compared with static value on array&#x20;

So the first step i do is decrypting the known value using RSA Algorithm

```python
from Crypto.Util.number import *

ct = [8215359690687096682, 1862662588367509514, 8350772864914849965, 11616510986494699232, 3711648467207374797, 9722127090168848805, 16780197523811627561, 18138828537077112905]
p = 18446744073709551557
d = inverse(65537, p-1)

print(long_to_bytes(pow(ct[0], d, p)))
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fy4JLa6qwXWdGIVVEneqs%2Fimage.png?alt=media&amp;token=e49b933a-8218-447c-875c-3f4f58a1be76" alt=""><figcaption></figcaption></figure>

We can't get the correct output, so the next step i do is replacing the builtins pow to know the actual value processed by the pow function. Here is the flow i used

* Change pow to eval since eval not used and to keep pow function valid
  * change pow stirng to eval string
  * change 03 to 04 (length of next data)
* Overwrite eval function to custom function to do pow and print value

```python
import pickle, io

def coba(a,b,c):
    print(a,b,c)
    return pow(a,b,c)

__builtins__.eval = coba

payload = b'\x8c\x08builtins\x8c\x07getattr\x93\x942\x8c\x08builtins\x8c\x05input\x93\x8c\x06FLAG> \x85R\x8c\x06encode\x86R)R\x940g0\n\x8c\x08builtins\x8c\x04dict\x93\x8c\x03get\x86R\x8c\x08builtins\x8c\x07globals\x93)R\x8c\x01f\x86R\x8c\x04seek\x86R\x94g0\n\x8c\x08builtins\x8c\x03int\x93\x8c\x07__add__\x86R\x940g0\n\x8c\x08builtins\x8c\x03int\x93\x8c\x07__mul__\x86R\x940g0\n\x8c\x08builtins\x8c\x03int\x93\x8c\x06__eq__\x86R\x940g3\ng5\n\x8c\x08builtins\x8c\x03len\x93g1\n\x85RM@\x00\x86RM\x05\x01\x86R\x85R.0g0\ng1\n\x8c\x0b__getitem__\x86R\x940M\x00\x00\x940g2\ng3\ng0\ng6\ng7\n\x85R\x8c\x06__le__\x86RM\x7f\x00\x85RMJ\x01\x86R\x85R.0g2\ng3\ng4\ng5\ng3\ng7\nM\x01\x00\x86Rp7\nM@\x00\x86RMU\x00\x86RM"\x01\x86R\x85R0g0\ng0\n]\x94\x8c\x06append\x86R\x940g8\n\x8c\x0b__getitem__\x86R\x940g0\n\x8c\x08builtins\x8c\x03int\x93\x8c\nfrom_bytes\x86R\x940M\x00\x00p7\n0g9\ng11\ng6\n\x8c\x08builtins\x8c\x05slice\x93g4\ng7\nM\x08\x00\x86Rg4\ng3\ng7\nM\x01\x00\x86RM\x08\x00\x86R\x86R\x85R\x8c\x06little\x86R\x85R0g2\ng3\ng4\ng5\ng3\ng7\nM\x01\x00\x86Rp7\nM\x08\x00\x86RMw\x00\x86RM\xc9\x01\x86R\x85R0g0\n]\x94\x8c\x06append\x86R\x940g0\ng12\n\x8c\x0b__getitem__\x86R\x940g0\n\x8c\x08builtins\x8c\x03int\x93\x8c\x07__xor__\x86R\x940I1244422970072434993\n\x940M\x00\x00p7\n0g13\n\x8c\x08builtins\x8c\x04eval\x93g15\ng10\ng7\n\x85Rg16\n\x86RI65537\nI18446744073709551557\n\x87R\x85R0g14\ng7\n\x85Rp16\n0g2\ng3\ng4\ng5\ng3\ng7\nM\x01\x00\x86Rp7\nM\x08\x00\x86RM\x83\x00\x86RM\xa7\x02\x86R\x85R0g0\ng12\n\x8c\x06__eq__\x86R(I8215359690687096682\nI1862662588367509514\nI8350772864914849965\nI11616510986494699232\nI3711648467207374797\nI9722127090168848805\nI16780197523811627561\nI18138828537077112905\nl\x85R.'
f = io.BytesIO(payload)
res = pickle.load(f)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fl5lo3ErZoezpww5qI7OY%2Fimage.png?alt=media&amp;token=d6f90e89-d6df-4ef9-b246-1fdd83beb73c" alt=""><figcaption></figcaption></figure>

Value processed on pow is 5982845580366531443 and our input should be 4774451407313060418 so there is algorithm that process our input. Using previous information i try to xor the processed value on pow with actual "BBBBBBBB" value and got 1244422970072434993. Xoring our decrypted output from RSA before, we got the part of flag.

```python
print(long_to_bytes(pow(ct[0], d, p) ^ 1244422970072434993)[::-1])
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FqA6IlBlRfXMqBbSPm8nQ%2Fimage.png?alt=media&amp;token=d4da3af8-ad22-4de0-b4b6-484efb2d4e99" alt=""><figcaption></figcaption></figure>

Decrypting the next value using the same flow and value we got invalid output. So there is something wrong with the static value (xor part). Through previous output (from nice.py), we can analyze what is the actual xor value.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FEW5WSe26yyQgb9ITzEwr%2Fimage.png?alt=media&amp;token=2b531b01-2fc1-4e4b-bae2-92bcd4ddcdd2" alt=""><figcaption></figcaption></figure>

So basically the actual xor value for next process is the ciphertext value from RSA. Using this information i write the script to get the whole flag

```python
from Crypto.Util.number import *

ct = [8215359690687096682, 1862662588367509514, 8350772864914849965, 11616510986494699232, 3711648467207374797, 9722127090168848805, 16780197523811627561, 18138828537077112905]
p = 18446744073709551557
d = inverse(65537, p-1)
ct_xor = [long_to_bytes(1244422970072434993)]
xor_val_arr = []
flag = b""

for i in range(len(ct)):
	zz  = long_to_bytes(pow(ct[i],d,p))
	ct_xor.append(long_to_bytes(ct[i]))
	xor_val = ct_xor[i]
	tmp_flag = b""
	for j in range(len(zz)):
		tmp_flag += bytes([zz[j] ^ xor_val[j]])
	flag += tmp_flag[::-1]

print(flag)
```

Flag : SECCON{Can\_someone\_please\_make\_a\_debugger\_for\_Pickle\_bytecode??}

## Perfect Blu (135 pts)

### Description

No, I'm real!

### Solution

Given ISO file, open it using VLC media viewer

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FDqn3u6m1v9aN23kgHVE9%2Fimage.png?alt=media&amp;token=5591e0a6-9188-410e-80c4-20466ee4770a" alt=""><figcaption></figcaption></figure>

So basically the program is flag checker and we can click on screen to give input. To get the code behind that ISO we try to findout what tools can be used. Then we found <https://bdedit.pel.hu/> . Double click on ISO will automatically mounted it on windows. Load the mounted ISO on BDedit

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FglibL5wR1AcGkCrUxP4p%2Fimage.png?alt=media&amp;token=1fc3ac33-7d27-472e-a183-7ebcddbcfada" alt=""><figcaption></figcaption></figure>

Exploring the tools, we found out one of the way to get the logic. Click on CLIPINF tab then choose sequence under zzzzz.clpi then click "Read". After that double click on Stream Type IG on ProgramInfo.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FVewD2PvcxGGfU5mY2mTS%2Fimage.png?alt=media&amp;token=9740cbbd-3dbc-4f08-b3db-3294c5b8fd8f" alt=""><figcaption></figcaption></figure>

We can see that there are many ID and all of the ID represent object on program for example button.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FOZdmQswDveDBu3Y0tzk3%2Fimage.png?alt=media&amp;token=c2a403e8-4093-4e04-85c4-18f14786386b" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FF8v3XFKnavwO7keTsS0n%2Fimage.png?alt=media&amp;token=c735e20a-8f73-4aab-b4e7-bf5a5bc29d0f" alt=""><figcaption></figcaption></figure>

Deeping dive into each value on each id we get some valuable information like on table below

| Key          | Description                                |
| ------------ | ------------------------------------------ |
| Opcode       | Hexadecimal representation of machine code |
| Command Line | Instruction translation from opcode        |
| X            | Horizontal coordinate of object            |
| Y            | Vertical coordinate of object              |

Looking at Command Line value we got something weird, one of the object has different call object. For 00000.clpi , ID 21 has different value. Since we know the layout of virtual keyboard we can determine which object on ID 21.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FUqsiF0EyYA8sIfCPXuh8%2Fimage.png?alt=media&amp;token=2c909333-942e-4ab8-85c0-7faae329185e" alt=""><figcaption></figcaption></figure>

```python
list_y = [413, 543, 672, 802]
list_x = [315, 453, 590, 727, 865, 1002, 1139, 1277, 1414, 1551]

list_alphabet = "1234567890qwertyuiopasdfghjkl{zxcvbnm_-}".upper()
dicti = {}
k = 0
for i in list_y:
	tmp_dicti = {}
	for j in list_x:
		tmp_dicti[j] = list_alphabet[k]
		k += 1
	dicti[i] = tmp_dicti

print(dicti[672][453])
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FEC1s5zSwq3EwXpdVHYQR%2Fimage.png?alt=media&amp;token=00a5c1d5-64dd-4181-b065-8311f0f08317" alt=""><figcaption></figcaption></figure>

Output from above code is S and looks like legit since we know the flag format is SECCON{}. So the next step we do is writing script to automatically parsing which button that has different call object and translate it to keyboard layout. We can using find function to validate which file that really contains opcode.

```python
f = open("00000.m2ts", "rb").read()
x_val = b"\x01\x3b"
y_val = b"\x01\x9d"
obj = b"\x21\x82\x00\x00"
print(f.index(x_val))
print(f.index(y_val))
print(f.index(obj))
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FK7rzUbpOG0IpZapVLrxh%2Fimage.png?alt=media&amp;token=00e634bc-93b7-42bd-9110-09880aa1fa37" alt=""><figcaption></figcaption></figure>

Okay, now last step just implement parsing for all \*m2ts file, get different call object, and translate it. Here my implementation in python

```python
from Crypto.Util.number import *

def find(target, data):
	list_i = []
	for i in range(0, len(data)-len(target)):
		if(data[i:i+len(target)] == target):
			list_i.append(i-len(target))
	return list_i

obj = b"\x21\x82\x00\x00"

list_y = [413, 543, 672, 802]
list_x = [315, 453, 590, 727, 865, 1002, 1139, 1277, 1414, 1551]

list_alphabet = "1234567890qwertyuiopasdfghjkl{zxcvbnm_-}".upper()
dicti = {}

k = 0

for i in list_y:
	tmp_dicti = {}
	for j in list_x:
		tmp_dicti[j] = list_alphabet[k]
		k += 1
	dicti[i] = tmp_dicti

flaggg = "" 


for num in range(90):
	tmp_num = str(num).rjust(5, "0")
	f = open(f"{tmp_num}.m2ts", "rb").read()
	
	done = False
	for y in range(4):
		y_val = long_to_bytes(list_y[y])
		arr_y = find(y_val, f)
		for i in range(10):
			ind = arr_y[i]
			data = f[ind:ind+94]
			for j in list_x:
				val = long_to_bytes(j)
				if(val in data):
					if(obj in data):
						tmp_ind = data.index(obj)
						res = bytes_to_long(data[tmp_ind+4:tmp_ind+8])
						if(res == (num+1)):
							flaggg += dicti[list_y[y]][j]
							print(flaggg)
							done = True
							break
					if(done):
						break
				if(done):
					break
			if(done):
				break
		if(done):
			break

print(flaggg)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FOihBHzhW7YBlL40WgK6m%2Fimage.png?alt=media&amp;token=1f1f91e9-f013-492b-a407-24cecd7d1871" alt=""><figcaption></figcaption></figure>

Looks like there is missing one character on 5EL part, during the competition i just validate it manually by using BDedit to find out which object that different and i found that the missing part should be `85EL`

Flag : SECCON{JWBH-85EL-QWRL-CLSW-UFRI-XUY3-YHKK-KFBV}

## optinimize (152 pts)

### Description

Nim is good at bignum arithmetic.

### Solution

TBU

```python
import sympy
import string

preprocess_value = [0x4A, 0x55, 0x6F, 0x79, 0x80, 0x95, 0x0AE, 0x0BF, 0x0C7, 0x0D5, 0x306, 0x1AC8, 0x24BA, 0x3D00, 0x4301, 0x5626, 0x6AD9, 0x7103, 0x901B, 0x9E03, 0x1E5FB6, 0x26F764, 0x30BD9E, 0x407678, 0x5B173B, 0x6FE3B1, 0x78EF25, 0x858E5F, 0x98C639, 0x0AD6AF6, 0x1080096, 0x18E08CD, 0x1BB6107, 0x1F50FF1, 0x25C6327, 0x2A971B6, 0x2D68493, 0x362F0C0, 0x3788EAD, 0x3CAA8ED] 
xor_keys =[0x3C, 0x0F4, 0x1A, 0x0D0, 0x8A, 0x17, 0x7C, 0x4C, 0x0DF, 0x21, 0x0DF, 0x0B0, 0x12,0x0B8, 0x4E, 0x0FA, 0x0D9, 0x2D, 0x66, 0x0FA, 0x0D4, 0x95, 0x0F0, 0x66, 0x6D, 0x0CE, 0x69, 0x0, 0x7D, 0x95, 0x0EA, 0x0D9, 0x0A, 0x0EB, 0x27, 0x63, 0x75, 0x11, 0x37, 0xD4]
keys = [367,433,601,659,709,857,1031,1151,1213,1301,5869,69001,97829,171403,189817,250057,316919,336683,439409,486053,32290399,42106697,53430277,71926391,103839599,129151843,140251081,155813837,179656963,205472089,320518241,494588603,554258797,630614177,768532223,872167577,933088907,1124023861,1153586989,1266126107]

flag = []
for i in range(len(keys)):
    dicti = {}
    tmp = keys[i]
    for j in range(21):
        tmp2 = (tmp&0xff)^xor_keys[i]
        tmp = sympy.prevprime(tmp)
        if(chr(tmp2) in string.printable[:-6]):
            dicti[j] = chr(tmp2)
    flag.append(dicti)

# guess
# for i in flag: 
    # print(i)

list_char = "0123456789abcdef"
last_j = -1
flagg = ""
for dicti2 in flag[7:-1]:
    for j in dicti2:
        if(dicti2[j] in list_char):
            if(last_j <= j):
                last_j = j
                flagg += dicti2[j]
                break
print(flagg)
```

Flag : SECCON{3b4297373223a58ccf3dc06a6102846f}

## xuyao (176 pts)

### Description

X86-64 Unbreakable Yet Another Obfuscation

### Solution

Given ELF 64 bit, open it using IDA

```c
int __cdecl main(int argc, const char **argv, const char **envp)
{
  void *v3; // rax
  __int64 v4; // rbx
  __int64 *v5; // r12
  __int64 *v6; // rdx
  int i; // eax
  char *v8; // rbp
  char *v9; // rdx
  char v10; // al
  char *v11; // rcx
  int v12; // edx
  int v13; // ecx
  unsigned int v14; // edx
  unsigned int j; // eax
  _BYTE *v16; // rdx
  int v17; // eax
  _BOOL8 v18; // rax
  __int64 v20[224]; // [rsp+0h] [rbp-E98h] BYREF
  char v21[1792]; // [rsp+700h] [rbp-798h] BYREF
  char s; // [rsp+E00h] [rbp-98h] BYREF
  char v23; // [rsp+E01h] [rbp-97h] BYREF
  unsigned __int64 v24; // [rsp+E78h] [rbp-20h]

  v24 = __readfsqword(0x28u);
  v3 = mmap(0LL, 0x1000uLL, 3, 34, -1, 0LL);
  if ( v3 == -1LL )
    exit(1);
  v4 = v3;
  v5 = v20;
  v6 = v20;
  for ( i = 0; i != 112; ++i )
  {
    *v6 = v4;
    *(v6 + 2) = i;
    *(v6 + 3) = 1;
    v6 += 2;
  }
  v8 = v21;
  v9 = v21;
  do
  {
    *v9 = v4;
    *(v9 + 2) = i;
    *(v9 + 3) = 1;
    ++i;
    v9 += 16;
  }
  while ( i != 224 );
  __printf_chk(1LL, "Message: ", v9);
  if ( !fgets(&s, 100, _bss_start) )
    exit(1);
  *(v4 + 224) = 0;
  v10 = s;
  if ( s )
  {
    v11 = &v23;
    do
    {
      v12 = *(v5 + 3);
      switch ( v12 )
      {
        case 1:
          *(*v5 + *(v5 + 2)) = v10;
          break;
        case 2:
          *(*v5 + *(v5 + 2)) = v10;
          break;
        case 4:
          *(*v5 + *(v5 + 2)) = v10;
          break;
        case 8:
          *(*v5 + *(v5 + 2)) = v10;
          break;
        default:
          BUG();
      }
      ++*(v4 + 224);
      v10 = *v11;
      v5 += 2;
      ++v11;
    }
    while ( v10 );
  }
  v13 = *(v4 + 224);
  v14 = (v13 + 16) & 0xFFFFFFF0;
  *(v4 + 228) = v14;
  *(v4 + 232) = v14 - v13;
  *(v4 + 236) = v14 - v13;
  for ( j = v13; j < *(v4 + 228); *(v4 + 224) = j )
  {
    if ( HIDWORD(v20[2 * j + 1]) != 1 )
      BUG();
    *(v20[2 * j] + LODWORD(v20[2 * j + 1])) = *(v4 + 236);
    j = *(v4 + 224) + 1;
  }
  encrypt(v20, v4, 0x4000000E4uLL, "SECCON CTF 2023!", v21);
  v16 = &enc;
  do
  {
    v17 = *(v8 + 3);
    if ( v17 == 1 )
    {
      if ( *(*v8 + *(v8 + 2)) != *v16 )
        goto LABEL_34;
    }
    else
    {
      switch ( v17 )
      {
        case 2:
          v18 = *(*v8 + *(v8 + 2)) != *v16;
          break;
        case 4:
          v18 = *(*v8 + *(v8 + 2)) != *v16;
          break;
        case 8:
          v18 = *(*v8 + *(v8 + 2)) != *v16;
          break;
        default:
          BUG();
      }
      if ( v18 )
      {
LABEL_34:
        puts("Wrong...");
        goto LABEL_35;
      }
    }
    v8 += 16;
    ++v16;
  }
  while ( v8 != &s );
  puts("Correct! I think you got the flag now :)");
LABEL_35:
  munmap(v4, 0x1000uLL);
  return 0;
}
```

So basically the program encrypt our input then compared it with static values. My approach is reconstructing the whole encryption process. The first step i do is reconstructing the function inside `encrypt` function.&#x20;

```c
// encrypt function
----snippet----
          v25 += 2;
    }
    while ( &v53 != v25 );
    v32 = &v53;
    encrypt_block(&v41, v77, &v53);             // something
    v33 = a5 + v26 + 64;
    do
    {
      if ( *(v32 + 3) != 4 )
        BUG();
      *v7 = *(*v32 + *(v32 + 2));
----snippet----
```

We can see that there is encrypt block, which indicate this custom cipher is kind of block cipher algorithm.

```c
// encrypt_block function
----snippet----
    r(&v33, *v11, v11[1], v5, 0x400000000uLL);
    v24 = v38;
    if ( v35 != v38 )
      BUG();
    if ( v35 == 1 )
    {
      v13 = &v36[v37 / 4];
      *(v33 + v34) = *v13;
      v14 = v41;
      if ( v24 == v41 )
      {
        v15 = &v39[v40 / 4];
        *v13 = *v15;
        if ( v44 == v14 )
        {
          *v15 = v42[v43 / 4];
          goto LABEL_21;
        }
        goto LABEL_39;
      }
      goto LABEL_38;
    }
----snippet----
```

encrypt\_block function call r function and inside r function there are some nested function called tnls and els. During the competition i wrote helper script to accelerate my process. Here is script i used to automate debugging process

```python
#!/usr/bin/python3
import string

class SolverEquation(gdb.Command):
    def __init__ (self):
        super (SolverEquation, self).__init__ ("solve-equation",gdb.COMMAND_OBSCURE)

    def invoke (self, arg, from_tty):
        f = open("x.txt","w")
        # f.write("B"*16)
        # f.write("A"*12 + "B"*4)
        # f.write("B"*16)
        # f.write("A"*16)
        # f.write("A"*16)
        f.write("Q"*16)
        f.close()
        gdb.execute("pie del")
        # gdb.execute("pie b 0x1a6a") # xor
        # gdb.execute("pie b 0x1b8f") # mov
        # gdb.execute("pie b 0x2256")
        # gdb.execute("pie run < x.txt")
        # arch = gdb.selected_frame().architecture()
        # data = []
        # for i in range(32):
        #     tmp = gdb.execute("x/wx 0x00007ffff7fb9000", to_string=True)
        #     data.append(hex(parse(tmp)[0]))
        #     gdb.execute("c")
        # print(data)

        gdb.execute("pie b 0x1e96")
        gdb.execute("pie run < x.txt")
        data_eax = []
        data_edx = []
        for i in range(31):
            eax = addr2num(gdb.selected_frame().read_register("eax"))
            # tmp = gdb.execute("x/wx $rdi+$r13", to_string=True)
            # tmp = gdb.execute("x/wx $r8+$rdx", to_string=True)
            data_eax.append((eax))
            # data_edx.append((parse(tmp)[0]))
            gdb.execute("c")
        print(data_eax)
        # print(data_edx)


def parse(f):
    f = f.split("\n")
    result = []
    for i in f:
        tmp = i.split("\t")
        for j in range(1,len(tmp)):
            result.append(int(tmp[j],16))
    return result

        
def addr2num(addr):
    try:
        return int(addr)&0xffffffff  # Python 3
    except:
        return long(addr) # Python 2
SolverEquation()
```

The summary of each function are described in table below

| Function name  | Description                                                                     |
| -------------- | ------------------------------------------------------------------------------- |
| encrypt\_block | process our input each 16 bytes (4 blocks of 4 bytes). Do xor and call function |
| r              | call tnsl then els function                                                     |
| tnls           | convert input to sbox values                                                    |
| els            | process sbox values with rol and xor                                            |

Below is reconstructed encryption algorithm in python

```python
from Crypto.Util.number import *

rol = lambda val, r_bits, max_bits: \
    (val << r_bits%max_bits) & (2**max_bits-1) | \
    ((val & (2**max_bits-1)) >> (max_bits-(r_bits%max_bits)))

def els(inp):
	v11 = inp
	v12 = rol(inp, 3, 32)
	v11 ^= v12
	v13 = rol(inp, 14, 32)
	v11 ^= v13
	v14 = rol(inp, 15, 32)
	v11 ^= v14
	v15 = rol(inp, 9, 32)
	v11 ^= v15
	return v11

def tnls(inp):
	tmp = long_to_bytes(inp)
	res = 0
	for i in range(len(tmp)):
		res |= sbox[tmp[i]]<<((3-i)*8)
	return res

def r(inp):
	tmp = tnls(inp)
	return els(tmp)

sbox = [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x1, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x4, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x5, 0x9a, 0x7, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x9, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x0, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x2, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0xc, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0xb, 0xdb, 0xe0, 0x32, 0x3a, 0xa, 0x49, 0x6, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x8, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x3, 0xf6, 0xe, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0xd, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0xf, 0xb0, 0x54, 0xbb, 0x16]
static_buf =  [0xf6067814, 0xed73cb7e, 0x1583a8b2, 0xdde8d93, 0x23e2374b, 0x40b83c72, 0xb3f811a, 0xd6e7a993, 0x2622de7c, 0xc581dcae, 0xa906524c, 0xdb4f2cc1, 0xddb3477, 0x8c1a92a4, 0x3bd711c0, 0x1bb16503, 0xacd720, 0x2735f2d0, 0x9a9300fe, 0xfb2556a7, 0xcbe1fe58, 0xc03db8c9, 0xf77cb701, 0xa1f85ae, 0x14dd27dc, 0xe1a5e3a9, 0x41d1f9ee, 0xfe6afce7, 0xd80eac32, 0xf43efead, 0x6475d80f, 0x38a310d6]

inp = b"A"*8 + b"B"*8
inp_block = []
for i in range(0,len(inp),4):
	inp_block.append(bytes_to_long(inp[i:i+4]))

for i in range(32):
	tmp = inp_block[i+2]^inp_block[i+1]^inp_block[i+3]^static_buf[i]
	res = r(tmp) ^ inp_block[i]
	print("input - ", inp_block[i], inp_block[i+1], inp_block[i+2], inp_block[i+3])
	inp_block.append(res)

ct = inp_block[-4:]
print(inp_block[-4:])
```

ct we got for each block are last 16 bytes value in result variable. In this case we can reverse the whole process (create decrypt function). Below is the flow of decrypt function

```python
# i = 0
# encrypt, process 16 byte
tmp = inp_block[2]^inp_block[1]^inp_block[3]^static_buf[0]
res = r(tmp)^inp_block[0]
inp_block.append(res) # res == inp_block[4]
ct = inp_block[-4:] # get last 16 bytes

# decrypt, process 16 bytes
inp_block = ct
tmp = inp_block[0]^inp_block[1]^inp_block[2]^static_buf[0]
pt = inp_block[3]^r(tmp) # get inp_block[0] in encrypt function
```

So we just need to iterate 32 times until get the plaintext. Here is the final script to get the flag using decrypt function

```python
from Crypto.Util.number import *

rol = lambda val, r_bits, max_bits: \
    (val << r_bits%max_bits) & (2**max_bits-1) | \
    ((val & (2**max_bits-1)) >> (max_bits-(r_bits%max_bits)))

def els(inp):
	v11 = inp
	v12 = rol(inp, 3, 32)
	v11 ^= v12
	v13 = rol(inp, 14, 32)
	v11 ^= v13
	v14 = rol(inp, 15, 32)
	v11 ^= v14
	v15 = rol(inp, 9, 32)
	v11 ^= v15
	return v11

def tnls(inp):
	tmp = long_to_bytes(inp)
	res = 0
	for i in range(len(tmp)):
		res |= sbox[tmp[i]]<<((3-i)*8)
	return res

def r(inp):
	tmp = tnls(inp)
	return els(tmp)

flagg = b""
sbox = [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x1, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15, 0x4, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x5, 0x9a, 0x7, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75, 0x9, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x0, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf, 0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x2, 0x7f, 0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0xc, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73, 0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0xb, 0xdb, 0xe0, 0x32, 0x3a, 0xa, 0x49, 0x6, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x8, 0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x3, 0xf6, 0xe, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf, 0x8c, 0xa1, 0x89, 0xd, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0xf, 0xb0, 0x54, 0xbb, 0x16]
static_buf =  [0xf6067814, 0xed73cb7e, 0x1583a8b2, 0xdde8d93, 0x23e2374b, 0x40b83c72, 0xb3f811a, 0xd6e7a993, 0x2622de7c, 0xc581dcae, 0xa906524c, 0xdb4f2cc1, 0xddb3477, 0x8c1a92a4, 0x3bd711c0, 0x1bb16503, 0xacd720, 0x2735f2d0, 0x9a9300fe, 0xfb2556a7, 0xcbe1fe58, 0xc03db8c9, 0xf77cb701, 0xa1f85ae, 0x14dd27dc, 0xe1a5e3a9, 0x41d1f9ee, 0xfe6afce7, 0xd80eac32, 0xf43efead, 0x6475d80f, 0x38a310d6]

real_ct = [0xc0a860fe, 0x66bcfe3b, 0x319b9afc, 0xbb03d89a, 0xfc56e1a9, 0x899f11fc, 0xe09f4d5f, 0xcf2aae9f, 0xeccb735e, 0xd1b9ff3f, 0x9a1b4499, 0xd1ec7979, 0x2beafdb4, 0x701af1e2, 0x7f2e3c76, 0x667b3b3f, 0x5c1b4ba3, 0x98ddbe0f, 0xad05b5a, 0x102c7e3d, 0x87102a56, 0x7fb9d95d, 0xb7862e3e, 0xb1df0417, 0xe247c427, 0x489a7ad9, 0x1dc6db7c, 0x21a3003c]

for x in range(0,25):
	tmp_ct = real_ct[x:x+4]
	ct = []
	for i in tmp_ct:
		ct.append(bytes_to_long(long_to_bytes(i)[::-1]))
	ct = ct[::-1]
	
	for i in range(32):
		tmp = ct[0]^ct[1]^ct[2]^static_buf[len(static_buf) - 1 - i]
		ct.insert(0, r(tmp) ^ ct[3])
	flag = b""
	for i in range(4):
		flag += long_to_bytes(ct[i])
	if(x % 4 == 0):
		flagg += flag

print(flagg)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FZm3BrOxrX9nNU2ft6tQ7%2Fimage.png?alt=media&amp;token=d92d2a66-0608-4beb-9d25-24f2145de545" alt=""><figcaption></figcaption></figure>

Flag : SECCON{x86\_he2\_zhuan1\_you3\_zi4\_jie2\_ma3\_de\_hun4he2}
