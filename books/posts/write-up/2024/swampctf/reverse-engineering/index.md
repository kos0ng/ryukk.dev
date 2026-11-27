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

<figure><img src="images/cafd8c5ad3618608fdf3ba73.png" alt=""><figcaption></figcaption></figure>

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

<figure><img src="images/d468134fe1f2c99554047407.png" alt=""><figcaption></figcaption></figure>

Flag: swampCTF{X0R\_inv0luti0n\_i5\_c00l}

## ARMory (190 pts)

### Description

This new phone from UFSIT is running, SwampOS, which is highly secure version of AOSP. Running with full disk encryption by default, figure out the password to unlock the phone.

### Solution

Given ELF file, open it using IDA.

<figure><img src="images/2a76130b358c379cc7d5a5e8.png" alt=""><figcaption></figcaption></figure>

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

<figure><img src="images/ba97e418c950243583a2c18e.png" alt=""><figcaption></figcaption></figure>

Flag: swampCTF{y0ur\_4rm\_5k1ll5\_n33d\_1mpr0v3m3n7\_6cd3f5}

## Off The Hook (300 pts)

### Description

We did some dabbling with apk's, have fun!

### Solution

Given APK file, decompile using jadx-gui.

<figure><img src="images/733a2649c9ed8ae743e4e361.png" alt=""><figcaption></figcaption></figure>

From MainActivity we can see that there is getFlag function. There is validation during getFlag function.

* If argument == Onions, throw exception
* If checkLeet (native function) != 1337., throw exception

The program above will always throw exception because getFlag call verify function with hardcoded string "Onions". checkLeet also do the same thing, it will return value != 1337

<figure><img src="images/a3d93ae6d77f90e95c9cf4f9.png" alt=""><figcaption><p>lib/x86_64/libanative.so</p></figcaption></figure>

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

<figure><img src="images/8b3774c0604809676b53fc4e.png" alt="" width="188"><figcaption></figcaption></figure>

Flag: swampCTF{TH\@TLL\_D0\_D0NK!}

## McGuffin Hunt (500 pts)

### Description

Sometimes an object as simple as a fence can slow the main character of a story down, but notice how I didn't say stop....

### Solution

Given several files.

<figure><img src="images/04fb09f0195d64fff44319a6.png" alt=""><figcaption></figcaption></figure>

So this is the first time i do reverse engineering for any TI-\* . Lets read README.txt.

<figure><img src="images/750d26884d8e245efd4dbe79.png" alt=""><figcaption></figcaption></figure>

README.txt show us how to run the SWAMPCTF.8xp file using given emulator (Wabbitemu64.exe). Before we can run the program, we must download the ROM which is [TI-84+ ROM](https://tiroms.weebly.com/uploads/1/1/0/5/110560031/ti84plus.rom). After following the instruction we will see display like image below.

<figure><img src="images/10a59c1dfc8e1cce84664b88.png" alt=""><figcaption></figcaption></figure>

There is debug menu in toolbar, click it and click open debugger.

<figure><img src="images/297b028c4dcfb1be785a690f.png" alt=""><figcaption></figcaption></figure>

Looks like it is not x86/x64 assembly, so lets try to find reference about it. This [reference](https://www.omnimaga.org/asm-language/ida-pro/) give me help about disassembling the program. From that reference i know that the base address of the program is 0x9d95. After successfuly disassembly the program using IDA, lets validate it with the assembly on debugger.

<figure><img src="images/d7404e183fff6e0392b01c8d.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/ed39153f067adb44289ec358.png" alt=""><figcaption></figcaption></figure>

Okay looks like same. Now, take a look on available strings on the program.

<figure><img src="images/4326587c4b3a1e1f873bc72a.png" alt=""><figcaption></figcaption></figure>

So those strings are used in the program but when we try to find reference to those strings IDA can't find it.

<figure><img src="images/607f104590438dfe5850ab39.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/d03e7b99377f60b4b97897ee.png" alt=""><figcaption></figcaption></figure>

From image above we can see that the string shown on the calculator is same like we found on IDA. So the next step i do is trying to find assembly that use address of string as operand.&#x20;

<figure><img src="images/0db1d5dacbec6a58bc27eb73.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/fe883cf52fedc91e9bbce9f2.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/33489055da86702fa60400fc.png" alt=""><figcaption></figcaption></figure>

I found instruction that use 0xa341 as operand. 0xa341 store strings value that shown during conversation with people near the gate.

<figure><img src="images/5a6d63d3fcefd4a2bd5902dc.png" alt=""><figcaption></figcaption></figure>

Opening sub\_a2c3, we can see that there are some string address loaded before sub\_A09F (ld hl, \<string\_address>. In this step i assume that sub\_A09F do the print things. In sub\_a2c3, IDA can't detect any reference to that function.

<figure><img src="images/7edf0617cd8c1e8643849653.png" alt=""><figcaption></figcaption></figure>

We know that sub\_a2c3 is called, because IDA can't detect the reference lets utilize the debugger. Set breakpoint on A2C3 that continue the program.

<figure><img src="images/b03573f0ba1ee04bae24518b.png" alt=""><figcaption></figcaption></figure>

If we hit the people object (phi) near the gate, the program will break at 0xa2c3. To understand the instruction i use this [reference](https://clrhome.org/table/#ld) from Resources/Zilog Z80 Microprocessor Instruction Table.url file. There is a cp instruction, basically it does substract operation and will set zero flag that will affect the jump instruction (jr). If we change the z flags (zero flag) the flow will be different, the program will not show "If Only ..." but it will show "You Got ...". It is the same like the logic we found on sub\_a2c3.

<figure><img src="images/2d7bf68dfb5e8a5d5b501da3.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/b274ec70fb6fca0bf6369792.png" alt=""><figcaption></figcaption></figure>

With assembly knowledge, we know that after ret instruction we will go back to previous frame that call current function. So lets set breakpoint on ret then step the debugger.

<figure><img src="images/900524072ee63807afd79047.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/88586a1ed55bd8f4ee2c3e6d.png" alt=""><figcaption></figcaption></figure>

Lets take a look on 9fbe on IDA.

<figure><img src="images/02932743002949bc46d45ee7.png" alt=""><figcaption></figcaption></figure>

There are many branch on sub\_9ead. From the conversation in program we know that there is something outside the fence and there are some type of object in the game. So in this step i tried to find out which address is executed by each object. I did it by analyzing the branch and debug it, at the end i found information below

* 1 - Collide with "wall" , address executed : 9e8f&#x20;
* 2 - Collide with ".." (change map) , address executed : 9ef1&#x20;
* 3 - Collide with "door" , address executed : 9f41&#x20;
* 4 - No collision
* 5 - Collide with "phi" , address executed : 9f7f

Because my assumption that we need to bypass the wall, i change my focus to analyzing sub\_9e8f. First, i tried to collide with wall on left.

<figure><img src="images/f8cdd763d736fd6b001183ad.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/799a8a46b3cca50cf3c7415e.png" alt=""><figcaption></figcaption></figure>

There are some interesting value on 9341-9344, lets try to hit another two walls. Go down from previous position and hit wall on left.

<figure><img src="images/a5d7bb8482efdf7d01f1cedc.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/713118206751c951442e2eeb.png" alt=""><figcaption></figcaption></figure>

Last, with previous position hit wall on bottom.

<figure><img src="images/d3476e516743cf41f266db6d.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/bcc19db187af8e1de063148a.png" alt=""><figcaption></figcaption></figure>

From above experiments, we can conclude that sub\_9e8f make our target coordinate back to latest coordinate.&#x20;

* Target coordinate
  * 9341 = x, 9342 = y
* Last coordinate
  * 9343 = x, 9344 = y

To implement my idea (bypass the wall), i tried to change the target coordinate outside the wall when it hits instruction ret (0x9e9d).

* Change 0x9341 to 0x1
* Run the program and got the flag

<figure><img src="images/716813b518bea90bdbb57748.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/701ef479369e0f74375f84ba.png" alt=""><figcaption></figcaption></figure>

Flag: SwampCTF{MC6UFF1N\_F0UND}
