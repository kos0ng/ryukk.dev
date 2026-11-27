# Forensic

<!-- challenge-index: 76be55351a64aad6 -->

| Challenge | Topic |
| --- | --- |
| [Baby SoC (256 pts) 🥈](#baby-soc-256-pts) | Flash Dump, Firmware Analysis |
| [Budget SoC (363 pts) 🥈](#budget-soc-363-pts) | Flash Dump, AES |

<!-- /challenge-index -->

## Baby SoC (256 pts)

### Description

We found really funny device. It was broken from the beginning, trust us! Can you help with recovering the truth?

### Solution

Given flashdump.bin, parse the executable using [this](https://github.com/tenable/esp32_image_parser) parser. There will be issue if we use the newer version of esptool library, use this [patch](https://github.com/tenable/esp32_image_parser/issues/14#issuecomment-2041247535) to solve the issue. First, take a look on available partition on the flashdump.bin

```
python3 esp32_image_parser.py show_partitions flashdump.bin
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FLr5ES2UChM7datPNSUN0%2Fimage.png?alt=media&amp;token=3e3fd131-b9c3-4a7f-a1c5-eb0b37e5b465" alt=""><figcaption></figcaption></figure>

Dump app0 executable using create\_elf argument.

```
python esp32_image_parser.py create_elf flashdump.bin -partition app0 -output app.elf
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FeOMLnJIKYJLn7Bf9Ujlf%2Fimage.png?alt=media&amp;token=8fef4c21-9503-4897-b16a-9d3b05146962" alt=""><figcaption></figcaption></figure>

Use ghidra to decompile the ELF file. Looking at available strings that there is "Flag" string.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FLmXy7OcjBug0t2b9YzbA%2Fimage.png?alt=media&amp;token=f467b40c-2768-42d5-ae29-a7ce07a5d0c2" alt=""><figcaption></figcaption></figure>

<pre class="language-c" data-title="FUN_400d2964" data-line-numbers><code class="lang-c">---snippet---
  memw();
  memw();
  iStack_24 = _DAT_3ffc4170;
  FUN_400d8108(0x3ffc3f3c,&#x26;DAT_3f400120);
  memcpy_(auStack_7c,s__&#x3C;!DOCTYPE_html>_&#x3C;html>_&#x3C;head>_&#x3C;_3f400125);
  if (DAT_3ffc3ce8 != '\0') {
    FUN_400d8108(0x3ffc3f3c,s_here2_3f4002d0);
<strong>    FUN_400d293c(auStack_49);
</strong><strong>    memcpy_(auStack_6c,auStack_49);
</strong>    memcpy_(auStack_5c,s_&#x3C;h2>Flag:_3f4002d6);
<strong>    uVar2 = FUN_400d87ec(auStack_5c,auStack_6c);
</strong>    uVar2 = FUN_400d881c(uVar2,s_&#x3C;/h2>_3f4002e1);
    FUN_400d8708(auStack_7c,uVar2);
    FUN_400d82dc(auStack_5c);
    FUN_400d80f0(0x3ffc3f3c,auStack_6c);
    FUN_400d82dc(auStack_6c);
  }
  FUN_400d87b8(auStack_7c,s_&#x3C;/body>&#x3C;/html>_3f4002e7);
  FUN_400d7334(0x3ffc3cec,200,s_text/html_3f4002f6,auStack_7c);
  FUN_400d82dc(auStack_7c);
---snippet---
</code></pre>

As we can see on line 12 there is code like an string builder that result \<h2>Flag: ??? \</h2>.  So we can assume that auStack\_6c is the variable that store the flag. auStack\_6c copied from auStack\_49 that constructed from FUN\_400d293c. Take a look on FUN\_400d293c.

```c
void FUN_400d293c(byte *param_1)

{
  *param_1 = DAT_3ffbdb68 ^ DAT_3ffbdb8d;
  return;
}
```

FUN\_400d293c do xor for two static values which are DAT\_3ffbdb68 and DAT\_3ffbdb8d. To get the flag we just need to do xor for those static values.

```python
a = [0xEE,0xCE,0x48,0x21,0x63,0xA8,0x1C,0xB8,0xA8,0x61,0x61,0x0D,0x8B,0x36,0xF0,0x07,0x25,0x85,0x5C,0xB0,0x6A,0x4B,0xC6,0xEF,0xBB,0x74,0x80,0x06,0x67,0x44,0xED,0x2A,0xD3,0x26,0xF7, 0xC6]
b = [0x84,0xBB,0x3B,0x55,0x20,0xFC,0x5A,0xC3,0xD1,0x0E,0x14,0x52,0xF3,0x06,0x82,0x58,0x48,0xE0,0x03,0xC2,0x5B,0x2C,0xAE,0x9B,0xE4,0x06,0xB0,0x73,0x09,0x20,0xB2,0x48,0xE7,0x44,0x8E,0xBB]

flag = b""
for i in range(len(a)):
    flag += bytes([a[i] ^ b[i]])
print(flag)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FtWAIohRei9HHE7JkVW3l%2Fimage.png?alt=media&amp;token=b697a9d0-ebe3-4e96-829b-a8545d245836" alt=""><figcaption></figcaption></figure>

Flag: justCTF{you\_x0r\_me\_r1ght\_r0und\_b4by}

## Budget SoC (363 pts)

### Description

We've obtained a mysterious device. Our forensic team tried to retrieve the original source code, but something went wrong. Fortunately, we managed to dump the memory into a file. Can you find what we need?

### Solution

Given flashdump.bin, parse the executable using [this](https://github.com/tenable/esp32_image_parser) parser. There will be issue if we use the newer version of esptool library, use this [patch](https://github.com/tenable/esp32_image_parser/issues/14#issuecomment-2041247535) to solve the issue. First, take a look on available partition on the flashdump.bin.

```
python3 esp32_image_parser.py show_partitions flashdump.bin
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FoGCtqMkqvbY5OkGhVsZu%2Fimage.png?alt=media&amp;token=68ea3019-abab-48fc-afd0-5c73cc213013" alt=""><figcaption></figcaption></figure>

Dump app0 executable using create\_elf argument.

```
python esp32_image_parser.py create_elf flashdump.bin -partition app0 -output app0.elf
```

Open it using ghidra and look at string "flag" we will found reference to the function that will produce flag like in previous SOC challenge.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FCGzdoD5xDfDtH8qXp0Qf%2Fimage.png?alt=media&amp;token=4e8655e8-9c22-4406-ac8f-eaa1d818fd76" alt=""><figcaption></figcaption></figure>

Rename some variable and function to make it easier to understand.

{% code title="FUN\_400d29b" %}

```c
---snippet--- 
memw();
  memw();
  iStack_24 = _DAT_3ffc4120;
  FUN_400d88c4(0x3ffc3eec,&DAT_3f400120);
  memcpy_(auStack_94,s__<!DOCTYPE_html>_<html>_<head>_<_3f400125);
  if (DAT_3ffc3ca8 != '\0') {
    FUN_400d88c4(0x3ffc3eec,s_here2_3f4002d0);
    if (0x83 < _DAT_3ffc3e3c) {
      allocation_(ciphertext,_DAT_3ffc3e38 + 100,0x20);
    }
    FUN_400d296c(ciphertext,decrypted,0x20);
    memcpy_(auStack_84,decrypted);
    memcpy_(auStack_74,s_<h2>Flag:_3f4002d6);
    uVar2 = FUN_400d8fa8(auStack_74,auStack_84);
    uVar2 = FUN_400d8fd8(uVar2,s_</h2>_3f4002e1);
    FUN_400d8ec4(auStack_94,uVar2);
    FUN_400d8a98(auStack_74);
    FUN_400d88ac(0x3ffc3eec,auStack_84);
    FUN_400d8a98(auStack_84);
  }
---snippet---
```

{% endcode %}

So the ciphertext are processed on function FUN\_400d296c, next take a look on function FUN\_400d296c. There are some constant in the function so it nice to search it on github.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FX3bHyPhD2pKHZ8UKjmBT%2Fimage.png?alt=media&amp;token=cb2c17a9-bbcd-4759-a6a8-0e707da0360d" alt=""><figcaption></figcaption></figure>

Search for the constant in 4 bytes format, <https://github.com/search?q=0x52096ad5&type=code> and i found [this](https://github.com/defanator/mcespi/blob/800d492838ca56dde29e6c56df28249131fda3d4/mcespi.c#L339.).&#x20;

From above code we can see that the constant is actually from aes decrypt process. Looking at another function looks like it is same like in the app0.elf function. So the last step is basically finding the key and the ciphertext used by the function in app0.elf.&#x20;

```c
undefined4
FUN_400d82e4(int instance,undefined4 ciphertext,int param_3,undefined4 param_4,undefined4 key,
            undefined2 length,undefined4 param_7)

{
  undefined4 uVar1;
  int iVar2;
  
  *(instance + 0xfc) = param_3;
  aes_key_expand(instance,key,length);
  iVar2 = param_3 + 0xf;
  if (-1 < param_3) {
    iVar2 = param_3;
  }
  aes_(instance,ciphertext,param_4,iVar2 >> 4,param_7);
  uVar1 = FUN_40173bc4(instance,param_4,param_3);
  return uVar1;
}
```

From the caller function we get the key, which is on the fifth argument (DAT\_3ffbdb68). The ciphertext is on second argument and it allocated from function allocation\_ that we assume the data is from \_DAT\_3ffc3e38.

```c
FUN_400d831c(auStack_134,ciphertext,param_3,output,&DAT_3ffbdb68,0x10,uVar1);
```

Looking at ELF file, we know that \_DAT\_3ffc3e38 is not stored on it.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FoJq324uHXJqIoQQGUkQk%2Fimage.png?alt=media&amp;token=e8e3c737-e394-42df-9740-71d6bdbf82b1" alt=""><figcaption></figcaption></figure>

So we assume that the data is maybe on runtime memory. Because we have the flashdump.bin we try to directly find the ciphertext by bruteforcing all 32 bytes value in the flashdump.bin. Below is our script to do bruteforce.

```python
from Crypto.Cipher import AES

f = open("flashdump.bin", "rb").read()
key = [0x33,0xBD,0xFB,0x72,0x4C,0x22,0x87,0x33,0x62,0xFF,0x75,0x41,0xD5,0x14,0xF6,0xFD]
bytes_key = bytes(key)

for i in range(0, len(f) - 32):
	cipher = AES.new(bytes_key, AES.MODE_ECB)
	tmp = f[i:i+32]
	res = cipher.decrypt(tmp)
	if b"just" in res:
		print(i, res)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F7WjyqMjkgtrMYHaHRDe3%2Fimage.png?alt=media&amp;token=d6cb882f-637f-4d31-8ad2-d10e14246f9e" alt=""><figcaption></figcaption></figure>

Looks like we got partial flag, so the mode should be not ECB. The next step we do is trying to use AES CBC with iv null bytes, because the first block is already correct plaintext.

```python
from Crypto.Cipher import AES

f = open("flashdump.bin", "rb").read()
key = [0x33,0xBD,0xFB,0x72,0x4C,0x22,0x87,0x33,0x62,0xFF,0x75,0x41,0xD5,0x14,0xF6,0xFD]
bytes_key = bytes(key)
iv = b"\x00"*16
i = 42308
cipher = AES.new(bytes_key, AES.MODE_CBC, iv)
tmp = f[i:i+32]
print(cipher.decrypt(tmp))
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FokU1UVpnbJPPcSPyiUoa%2Fimage.png?alt=media&amp;token=850a9c51-191e-4326-bb3a-db0facade8c7" alt=""><figcaption></figcaption></figure>

Flag: justCTF{dUmp3d\_r3v3rs3d\_h4ck3d}
