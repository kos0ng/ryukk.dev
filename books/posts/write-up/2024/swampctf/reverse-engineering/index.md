# Reverse Engineering

<!-- challenge-index: db0146613d74ba33 -->

| Challenge | Topic |
| --- | --- |
| [Beginner Rev (50 pts)](#beginner-rev-50-pts) | XOR, Known Constant |
| [ARMory (190 pts)](#armory-190-pts) | ARM Assembly, Input Validation |
| [Off The Hook (300 pts) 🥇](#off-the-hook-300-pts) | Android, Method Hooking |
| [McGuffin Hunt (500 pts) 🥇](#mcguffin-hunt-500-pts) | TI Calculator, Game Reversing |

<!-- /challenge-index -->

## Beginner Rev (50 pts)

### Description

To all the new CTFers who are starting to dip their toes in the wonderful world of cybersecurity, we wish you all the best in your CTF journey!ts

### Solution

Given ELF file, open it using IDA

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FzYqQtSdVbkbPNmDaTVN8%2Fimage.png?alt=media&amp;token=9f079c72-839d-42cc-a0cd-18ff457c6d5a" alt=""><figcaption></figcaption></figure>

So it just basic validation, to get valid input just xor byte\_402010 with 0x41. Here is my solver

```python
a = [  0x32, 0x36, 0x20, 0x2C, 0x31, 0x02, 0x15, 0x07, 0x3A, 0x19, 
  0x71, 0x13, 0x1E, 0x28, 0x2F, 0x37, 0x71, 0x2D, 0x34, 0x35, 
  0x28, 0x71, 0x2F, 0x1E, 0x28, 0x74, 0x1E, 0x22, 0x71, 0x71, 
  0x2D, 0x3C]

flag = b""
for i in a:
	flag += bytes([i ^ 0x41])
print(flag)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F2r0ybTEZajlwr7VKOCsP%2Fimage.png?alt=media&amp;token=9c6e6c6d-6273-4045-972d-fd03e0ddae85" alt=""><figcaption></figcaption></figure>

Flag: swampCTF{X0R\_inv0luti0n\_i5\_c00l}

## ARMory (190 pts)

### Description

This new phone from UFSIT is running, SwampOS, which is highly secure version of AOSP. Running with full disk encryption by default, figure out the password to unlock the phone.

### Solution

Given ELF file, open it using IDA.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FkNEHLQr9xyPCwFYUOG44%2Fimage.png?alt=media&amp;token=50952d3b-5630-4e30-aeba-3e9e14951778" alt=""><figcaption></figcaption></figure>

It looks like previous challenge but with more operations. The program above actually did the operation below

```python
a_0 == input[i] ^ 0x41 ^ salt_1[i%len(salt)]
```

So to get the input we can reverse the operation, here is my solver

```python
a = [0xEC, 0x9B, 0x9E, 0xC3, 0xEF, 0xAF, 0xAB, 0xE8, 0xE4, 0x95, 
  0xCF, 0xDB, 0xED, 0xB3, 0xCB, 0xDC, 0xF2, 0xB3, 0xCA, 0xC5, 
  0xAE, 0x80, 0x93, 0x9B, 0xC0, 0x82, 0xCC, 0x9D, 0xFB, 0xB3, 
  0xCE, 0xC3, 0xEF, 0x9E, 0xCF, 0xD8, 0xAC, 0x81, 0xCC, 0xC0, 
  0xA8, 0xB3, 0xC9, 0xCD, 0xFB, 0xDF, 0x99, 0x9B, 0xE2, 0x00]

salt = [0xde, 0xad, 0xbe, 0xef]
flag = b""
for i in range(len(a)):
    flag += bytes([a[i] ^ 0x41 ^ salt[i % len(salt)]])
print(flag)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FnViSV7uQloFJzWeei5Ue%2Fimage.png?alt=media&amp;token=d2c0316f-431f-4a7f-8c2f-39c60e02e48f" alt=""><figcaption></figcaption></figure>

Flag: swampCTF{y0ur\_4rm\_5k1ll5\_n33d\_1mpr0v3m3n7\_6cd3f5}

## Off The Hook (300 pts)

### Description

We did some dabbling with apk's, have fun!

### Solution

Given APK file, decompile using jadx-gui.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FFlzQ2R3lKIhbazExgpXF%2Fimage.png?alt=media&amp;token=cc507a0a-cfb7-4900-b4f4-97df47bea1ae" alt=""><figcaption></figcaption></figure>

From MainActivity we can see that there is getFlag function. There is validation during getFlag function.

* If argument == Onions, throw exception
* If checkLeet (native function) != 1337., throw exception

The program above will always throw exception because getFlag call verify function with hardcoded string "Onions". checkLeet also do the same thing, it will return value != 1337

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FbIWUr1T7cLIF7HwuDlFo%2Fimage.png?alt=media&amp;token=01284535-c451-4e11-9939-294dd393d40a" alt=""><figcaption><p>lib/x86_64/libanative.so</p></figcaption></figure>

To get the flag my idea is patching verify function. First, decompile swamp.apk using apktool.

```
apktool d swamp.apk
```

<pre class="language-smali" data-title="MainActivity.smali" data-line-numbers><code class="lang-smali">...
.method public verify(Ljava/lang/String;)V
    .locals 2

<strong>    const-string v0, "Onionz"
</strong>
    .line 51
    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_1

    .line 55
    invoke-virtual {p0}, Lcom/rumpelstiltskin/anative/MainActivity;->checkLeet()I

    move-result p1

    const/16 v1, 0x539

<strong>    if-eq p1, v1, :cond_0
</strong>
    return-void

    .line 56
    :cond_0
    new-instance p1, Ljava/lang/IllegalStateException;
...
</code></pre>

* Line 5: change from Onions to Onionz
* Line 21: change from checkLeet() != 1337 to checkLeet() == 1337

Compile the APK and sign it. Finally, just click "PRESS ME" and flag will be shown.

```bash
apktool b swamp
uber-apk-signer --allowResig -a swamp/dist/swamp.apk
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FGRNhSuyALbQoGofxMMSQ%2Fimage.png?alt=media&amp;token=6a518c96-0b39-49f8-b512-ad8227a71e71" alt="" width="188"><figcaption></figcaption></figure>

Flag: swampCTF{TH\@TLL\_D0\_D0NK!}

## McGuffin Hunt (500 pts)

### Description

Sometimes an object as simple as a fence can slow the main character of a story down, but notice how I didn't say stop....

### Solution

Given several files.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FAIR6yUuByIgx0kGXWxRZ%2Fimage.png?alt=media&amp;token=c9ca618e-d2d7-4a41-ae10-d81103ca845c" alt=""><figcaption></figcaption></figure>

So this is the first time i do reverse engineering for any TI-\* . Lets read README.txt.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F7AqVqTxCdqNYPwM6VTDg%2Fimage.png?alt=media&amp;token=60af74f9-6589-4e47-beec-295961f24500" alt=""><figcaption></figcaption></figure>

README.txt show us how to run the SWAMPCTF.8xp file using given emulator (Wabbitemu64.exe). Before we can run the program, we must download the ROM which is [TI-84+ ROM](https://tiroms.weebly.com/uploads/1/1/0/5/110560031/ti84plus.rom). After following the instruction we will see display like image below.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FVabem7HtthttCstE3XZS%2Fimage.png?alt=media&amp;token=1eb8be3c-f023-4630-99f6-7f4c8cbb1e1e" alt=""><figcaption></figcaption></figure>

There is debug menu in toolbar, click it and click open debugger.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FCBquIWX1Wx6Nagd1Nh4n%2Fimage.png?alt=media&amp;token=faa7eaba-9745-425f-b3f0-29d4d1e63784" alt=""><figcaption></figcaption></figure>

Looks like it is not x86/x64 assembly, so lets try to find reference about it. This [reference](https://www.omnimaga.org/asm-language/ida-pro/) give me help about disassembling the program. From that reference i know that the base address of the program is 0x9d95. After successfuly disassembly the program using IDA, lets validate it with the assembly on debugger.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FAGyBAVXkmGOUMRgMwfBX%2Fimage.png?alt=media&amp;token=34a1b3bb-4db9-48cc-a1d9-229b6ce64e3f" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FsasNOb9OdCPUdvKhkF2D%2Fimage.png?alt=media&amp;token=88397d09-f164-4ff6-b3e0-51d0321ba269" alt=""><figcaption></figcaption></figure>

Okay looks like same. Now, take a look on available strings on the program.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fh64BkJGzdlMiOU12k8gy%2Fimage.png?alt=media&amp;token=e6cc4d1c-e194-409e-b82e-cbe19b8fc71c" alt=""><figcaption></figcaption></figure>

So those strings are used in the program but when we try to find reference to those strings IDA can't find it.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FGSsbg9yntbYKeaY1A4g0%2Fimage.png?alt=media&amp;token=e533e4bf-6c3a-4863-b191-172833802eb3" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FO8z2rFgLTun2GFtnW2AO%2Fimage.png?alt=media&amp;token=8ba6ac15-c52c-4887-9b6c-8ccdd41a05ca" alt=""><figcaption></figcaption></figure>

From image above we can see that the string shown on the calculator is same like we found on IDA. So the next step i do is trying to find assembly that use address of string as operand.&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FvPn1sRRxkW61OKdXWCVx%2Fimage.png?alt=media&amp;token=8e181352-3453-4280-a3f9-caf38e312c54" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FU3zPyQstlGdMP6F2j3FG%2Fimage.png?alt=media&amp;token=527d1a50-92b8-46a1-bdc6-343de920cdf6" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FcqVPTmkPa5ABEfwZjQuj%2Fimage.png?alt=media&amp;token=7d2ccf14-ec6f-4f05-bcbc-5b55638984e9" alt=""><figcaption></figcaption></figure>

I found instruction that use 0xa341 as operand. 0xa341 store strings value that shown during conversation with people near the gate.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FGOs0gh0IMz1VR1KqtZsz%2Fimage.png?alt=media&amp;token=6408a73f-d5a2-4ee3-8352-0774dc9d433e" alt=""><figcaption></figcaption></figure>

Opening sub\_a2c3, we can see that there are some string address loaded before sub\_A09F (ld hl, \<string\_address>. In this step i assume that sub\_A09F do the print things. In sub\_a2c3, IDA can't detect any reference to that function.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fo33ycbnMZ1jACVBLZIrT%2Fimage.png?alt=media&amp;token=c767bde2-5e37-4a08-8431-130b53784336" alt=""><figcaption></figcaption></figure>

We know that sub\_a2c3 is called, because IDA can't detect the reference lets utilize the debugger. Set breakpoint on A2C3 that continue the program.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FEi1fNIbs29ksv61GxMga%2Fimage.png?alt=media&amp;token=655dd106-0f04-442c-a367-6a6001cd6a36" alt=""><figcaption></figcaption></figure>

If we hit the people object (phi) near the gate, the program will break at 0xa2c3. To understand the instruction i use this [reference](https://clrhome.org/table/#ld) from Resources/Zilog Z80 Microprocessor Instruction Table.url file. There is a cp instruction, basically it does substract operation and will set zero flag that will affect the jump instruction (jr). If we change the z flags (zero flag) the flow will be different, the program will not show "If Only ..." but it will show "You Got ...". It is the same like the logic we found on sub\_a2c3.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FgXSsynTtZAR9MI0yiskD%2Fimage.png?alt=media&amp;token=143f10b8-4e32-4395-9a35-c5301755360c" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F6eoyJ294A0Tg74m4LMnz%2Fimage.png?alt=media&amp;token=f6dae43f-6fae-49a4-be52-073f000f5fde" alt=""><figcaption></figcaption></figure>

With assembly knowledge, we know that after ret instruction we will go back to previous frame that call current function. So lets set breakpoint on ret then step the debugger.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FxAuHnR3YneYSNQramC8a%2Fimage.png?alt=media&amp;token=9a656838-2204-4eb6-b9d8-08a2e5ffbbce" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FL1dyuOatXSKOroznlDap%2Fimage.png?alt=media&amp;token=32252d66-cb18-4d37-b41c-0091bb32d53a" alt=""><figcaption></figcaption></figure>

Lets take a look on 9fbe on IDA.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FCr6k0czqpug8DBUnlnfz%2Fimage.png?alt=media&amp;token=b5783642-01f0-4c22-85a3-ef27fac67220" alt=""><figcaption></figcaption></figure>

There are many branch on sub\_9ead. From the conversation in program we know that there is something outside the fence and there are some type of object in the game. So in this step i tried to find out which address is executed by each object. I did it by analyzing the branch and debug it, at the end i found information below

* 1 - Collide with "wall" , address executed : 9e8f&#x20;
* 2 - Collide with ".." (change map) , address executed : 9ef1&#x20;
* 3 - Collide with "door" , address executed : 9f41&#x20;
* 4 - No collision
* 5 - Collide with "phi" , address executed : 9f7f

Because my assumption that we need to bypass the wall, i change my focus to analyzing sub\_9e8f. First, i tried to collide with wall on left.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Ft3MUB4Wggp2ZrA0xzaiH%2Fimage.png?alt=media&amp;token=20143b2a-fefa-435f-ad29-b75c82ff9003" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FCjJNSOAJlJsUx0Y6YTi5%2Fimage.png?alt=media&amp;token=444e7e78-bb58-468e-aac1-dbf015eead92" alt=""><figcaption></figcaption></figure>

There are some interesting value on 9341-9344, lets try to hit another two walls. Go down from previous position and hit wall on left.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fow2XbacH4MWa9xmhxsBj%2Fimage.png?alt=media&amp;token=f451644b-5e44-4a42-8566-2a0830bf6cce" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FGUcQ0NFKz2tfyo4zwlR6%2Fimage.png?alt=media&amp;token=f5d298b1-bd05-44a2-8d57-e4278c2dc735" alt=""><figcaption></figcaption></figure>

Last, with previous position hit wall on bottom.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FvDouyEv9aypLyE5mu2oO%2Fimage.png?alt=media&amp;token=deef75ae-f048-4998-8f1a-575e7e16c0d7" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F2RQZZQZ9uQbUyM9XVghq%2Fimage.png?alt=media&amp;token=cc48323b-d0fa-4bbc-8450-c0556c02a9b9" alt=""><figcaption></figcaption></figure>

From above experiments, we can conclude that sub\_9e8f make our target coordinate back to latest coordinate.&#x20;

* Target coordinate
  * 9341 = x, 9342 = y
* Last coordinate
  * 9343 = x, 9344 = y

To implement my idea (bypass the wall), i tried to change the target coordinate outside the wall when it hits instruction ret (0x9e9d).

* Change 0x9341 to 0x1
* Run the program and got the flag

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FM1lH66Xk0qPHSmClO2av%2Fimage.png?alt=media&amp;token=5c12cca7-9a72-4854-ad15-682ded99b4a0" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fk1oAV52cyz84aolxzXM4%2Fimage.png?alt=media&amp;token=a67f2056-8b1a-4e2c-89c6-1332827c92ed" alt=""><figcaption></figcaption></figure>

Flag: SwampCTF{MC6UFF1N\_F0UND}
