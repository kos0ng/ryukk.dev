# Reverse Engineering

<!-- challenge-index: dbb6ee9040db6d43 -->

| Challenge | Topic |
| --- | --- |
| [Paranoia (100 pts)](#paranoia-100-pts) | Time-Based Seed, XOR |
| [Grip (100 pts)](#grip-100-pts) | Runtime Code Generation, XOR |
| [Sperm Rev (100 pts)](#sperm-rev-100-pts) | ELF Strings |
| [Risks (205 pts)](#risks-205-pts) | RISC-V, Z3 |
| [Packeta (460 pts)](#packeta-460-pts) | ELF Packing, RC4 |
| [Mips (477 pts)](#mips-477-pts) | Nintendo 64, MIPS |
| [Orgalorg (498 pts)](#orgalorg-498-pts) | Control Flow Obfuscation, GDB |

<!-- /challenge-index -->

## Paranoia (100 pts)

### Description

im baby

Author: **miyako**

`nc 20.80.240.190 1234`

### Solution

Given ELF 64 bit file, open it using IDA.

```c
int __fastcall main(int argc, const char **argv, const char **envp)
{
  unsigned int v3; // eax
  int v4; // ebx
  int v5; // eax
  unsigned __int64 i; // [rsp+8h] [rbp-18h]

  v3 = time(0LL);
  srand(v3);
  for ( i = 0LL; i <= 0x11; ++i )
  {
    v4 = flag[i];
    v5 = rand();
    printf("%i ", v4 ^ ((unsigned __int8)(((unsigned int)(v5 >> 31) >> 24) + v5) - ((unsigned int)(v5 >> 31) >> 24)));
  }
  putchar(10);
  return 0;
```

Basically it just do xor with random value with seed current time (time(0)). To get the plaintext we can do the same process. To overcome delay issue, we can do little bruteforce from current time.&#x20;

```python
from ctypes import CDLL
import time
from pwn import *

libc = CDLL("libc.so.6")
current = int(time.time())
r = remote("20.80.240.190", 1234)
ct = list(map(int, r.recvline().strip().split(b" ")))
for i in range(current, current-10, -1):
	libc.srand(i)
	tmp_flag = b""
	for v4 in ct:
		v5 = libc.rand()
		tmp_flag += bytes([v4 ^ (((((v5 >> 31) >> 24) + v5) - ((v5 >> 31) >> 24)) & 0xff)])
	print(i, tmp_flag)
r.interactive()
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FbKFIQpZ3rpMXEflV0sk6%2Fimage.png?alt=media&amp;token=9b67c896-2f91-4b3a-b037-b43283892dc4" alt=""><figcaption></figcaption></figure>

Flag: akasec{n0t\_t00\_m4ny\_br41nc3lls\_l3ft}

## Grip (100 pts)

### Description

its...its...Grippy

Author: **miyako**

### Solution

Given ELF 64 bit, open it using IDA.

```c
__int64 __fastcall main(int a1, char **a2, char **a3)
{
  __int64 v3; // rbx
  __int64 v4; // rbx
  __int64 v5; // rbx
  __int64 v6; // rbx
  __int64 v7; // rbx
  __int64 v8; // rbx
  __int64 v9; // rbx
  __int64 v10; // rbx
  __int64 v11; // rbx
  unsigned __int64 i; // [rsp+18h] [rbp-C8h]
  _QWORD *v14; // [rsp+20h] [rbp-C0h]
  __int64 v15; // [rsp+30h] [rbp-B0h]
  __int64 v16; // [rsp+38h] [rbp-A8h]
  __int64 v17; // [rsp+40h] [rbp-A0h]
  __int64 v18; // [rsp+48h] [rbp-98h]
  __int64 v19; // [rsp+50h] [rbp-90h]
  __int64 v20; // [rsp+58h] [rbp-88h]
  __int64 v21; // [rsp+60h] [rbp-80h]
  __int64 v22; // [rsp+68h] [rbp-78h]
  __int64 v23; // [rsp+70h] [rbp-70h]
  __int64 v24; // [rsp+78h] [rbp-68h]
  __int64 v25; // [rsp+80h] [rbp-60h]
  __int64 v26; // [rsp+88h] [rbp-58h]
  __int64 v27; // [rsp+90h] [rbp-50h]
  __int64 v28; // [rsp+98h] [rbp-48h]
  __int64 v29; // [rsp+A0h] [rbp-40h]
  char v30[13]; // [rsp+A8h] [rbp-38h]
  __int64 v31; // [rsp+B5h] [rbp-2Bh]
  unsigned __int64 v32; // [rsp+C8h] [rbp-18h]

  v32 = __readfsqword(0x28u);
  v15 = 0xB21E71BA177BBAA7LL;
  v16 = 0xF2F2DAD7F679BA96LL;
  v17 = 0xBA32C30AB77BBAF2LL;
  v18 = 0xCBD3D5C3D1DBD14ALL;
  v19 = 0xC9C4C481D848BAC3LL;
  v20 = 0xBA22B77BBA84C0EFLL;
  v21 = 0xC0EFC94ABA2AA77BLL;
  v22 = 0xEF48BAD483DBD384LL;
  v23 = 0xBACDC9C284DE81D2LL;
  v24 = 0x3516A77BBA2EB77BLL;
  v25 = 0xEA19F2F2F2F23EB7LL;
  v26 = 0x22F7B644FD3EB779LL;
  v27 = 0x3EB779307BB00271LL;
  v28 = 0xF33EB77122F7A67ALL;
  v29 = 0xBA621084E93E8F71LL;
  *(_QWORD *)v30 = 0xD7F6D9BA960AB779LL;
  *(_QWORD *)&v30[5] = 0x86F2F2F2DAD7F6D9LL;
  v31 = 0x313BF2F2F2F21AF7LL;
  for ( i = 0LL; i <= 0x8C; ++i )
    *((_BYTE *)&v15 + i) ^= 0xF2u;
  v14 = mmap(0LL, 0x8DuLL, 6, 34, -1, 0LL);
  v3 = v16;
  *v14 = v15;
  v14[1] = v3;
  v4 = v18;
  v14[2] = v17;
  v14[3] = v4;
  v5 = v20;
  v14[4] = v19;
  v14[5] = v5;
  v6 = v22;
  v14[6] = v21;
  v14[7] = v6;
  v7 = v24;
  v14[8] = v23;
  v14[9] = v7;
  v8 = v26;
  v14[10] = v25;
  v14[11] = v8;
  v9 = v28;
  v14[12] = v27;
  v14[13] = v9;
  v10 = *(_QWORD *)v30;
  v14[14] = v29;
  v14[15] = v10;
  v11 = v31;
  *(_QWORD *)((char *)v14 + 125) = *(_QWORD *)&v30[5];
  *(_QWORD *)((char *)v14 + 133) = v11;
  ((void (__fastcall *)(_QWORD))v14)(0LL);
  puts(":3");
  return 0LL;
}
```

We can see that there is mmap function called then the address from mmap (v14) used to store value of static value xored with 0xf2. At the end, v14 called in the main function. From those information we can assume that value on address v14 contains valid assembly because it called in the end. So dump the bytecode then open it again using decompiler.

```python
from Crypto.Util.number import *
ct = []
ct.append(0xB21E71BA177BBAA7)
ct.append(0xF2F2DAD7F679BA96)
ct.append(0xBA32C30AB77BBAF2)
ct.append(0xCBD3D5C3D1DBD14A)
ct.append(0xC9C4C481D848BAC3)
ct.append(0xBA22B77BBA84C0EF)
ct.append(0xC0EFC94ABA2AA77B)
ct.append(0xEF48BAD483DBD384)
ct.append(0xBACDC9C284DE81D2)
ct.append(0x3516A77BBA2EB77B)
ct.append(0xEA19F2F2F2F23EB7)
ct.append(0x22F7B644FD3EB779)
ct.append(0x3EB779307BB00271)
ct.append(0xF33EB77122F7A67A)
ct.append(0xBA621084E93E8F71)
ct.append(0xD7F6D9BA960AB779)
ct.append(0x86F2F2F2DAD7F6D9)

pt = []
for i in ct:
    tmp = long_to_bytes(i)[::-1]
    for j in tmp:

        pt.append(j ^ 0xf2)
pt[-4] = 0xc3

out = open("dump.bin", "wb")
out.write(bytes(pt))
```

3 null bytes at the end will cause error on decompile process, so put 0xc3 (ret) to overcome the issue.&#x20;

```c
unsigned __int64 sub_0()
{
  unsigned int i; // [rsp+Ch] [rbp-34h]
  __int64 v2; // [rsp+10h] [rbp-30h]
  _DWORD v3[3]; // [rsp+18h] [rbp-28h]
  __int64 v4; // [rsp+24h] [rbp-1Ch]
  unsigned __int64 v5; // [rsp+38h] [rbp-8h]

  v5 = __readfsqword(0x28u);
  v2 = 0x3139212731232923i64;
  v3[0] = 909538090;
  *(_QWORD *)&v3[1] = 0x2671292176321D3Bi64;
  v4 = 0x3F3B30762C73201Di64;
  for ( i = 0; i <= 0x1B; ++i )
    *((_BYTE *)&v3[-2] + i) ^= 0x42u;
  return v5 - __readfsqword(0x2825042Bu);
}
```

Now we have the code, then just convert it to python and get the flag.

```python
from Crypto.Util.number import *

ct = []
ct.append(0x3139212731232923)
ct.append(0x3636732A)
ct.append(0x2671292176321D3B)
ct.append(0x3F3B30762C73201D)

flag = b""
for i in ct:
  tmp = long_to_bytes(i)[::-1]
  for j in tmp:
    flag += bytes([j ^ 0x42])
print(flag)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fm6CsSSBoUQvWyj1hrRsA%2Fimage.png?alt=media&amp;token=fb78dc2a-e722-4ad2-8a07-43d887187884" alt=""><figcaption></figcaption></figure>

Flag: akasec{sh1tty\_p4ck3d\_b1n4ry}

## Sperm Rev (100 pts)

### Description

before baby rev, there was sperm rev <3

solve it fast to win another race in your life.

Author: **Pengolian**

### Solution

Given ELF 64 bit, open it using IDA. Nothing useful in available function, check on strings.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FH2sVqiOMIQrp9AXKA98N%2Fimage.png?alt=media&amp;token=d382cd6a-6a2a-4c3d-99ad-c4c19c228b4a" alt=""><figcaption></figcaption></figure>

Flag: AKASEC{strings\_b35t\_t00l\_1n\_r3v3r5e\_eng1n33r1ng}

## Risks (205 pts)

### Description

theres this pretty cool isa called riscv it sounds awesome.

Author: **miyako**

### Solution

Given ELF 64 bit RISCV file, open it using ghidra. Rename some known function to make it easily to understand.

<pre class="language-c" data-line-numbers><code class="lang-c">undefined8 main(void)

{
  char cVar1;
  long lVar2;
  undefined8 local_30;
  long local_28;
  long local_20;
  long local_18;
  
  local_28 = 0;
  local_30 = 0;
  printf_("whats the flag: ");
  local_18 = getline_(&#x26;local_28,&#x26;local_30,_stdin);
  *(local_18 + -1 + local_28) = 0;
  local_20 = local_28;
<strong>  FUN_00101ad4(local_28);
</strong><strong>  FUN_00101346(local_20);
</strong><strong>  FUN_00100c8c(local_20);
</strong><strong>  FUN_00100786(local_20);
</strong>  lVar2 = strlen_(local_28);
<strong>  if ((lVar2 == 0x20) &#x26;&#x26; (cVar1 = compare_value(local_20), cVar1 == '\x01')) {
</strong>    puts_("good job!");
    return 0;
  }
  puts_("nuh uh");
  return 0;
}
</code></pre>

So there are 5 custom functions in the program.&#x20;

* FUN\_00101ad4, FUN\_00101346, FUN\_00100c8c, and FUN\_00100786 process our input with some operation such as xor and add.
* compare\_value validate our processed input with static value

From those informations we can get the valid input by utilizing z3. Below is my solution

```python
from z3 import *
from Crypto.Util.number import *

inp = [BitVec("x{}".format(i), 64) for i in range(4)]
s = Solver()

param_1 = [0 for _ in range(4)]

# FUN_00101ad4
param_1[0] = inp[0] + 0x75978f47ac76cf;
param_1[1] = inp[1] + 0xff889b2d229768ef;
param_1[0] = param_1[0] ^ 0x76bf86ade5d5cc;
param_1[2] = inp[2] + 0x760f38b4bc69dc;
param_1[0] = param_1[0] ^ 0x559f46365cee21;
param_1[0] = param_1[0] + 0x5c6476bf0d4a19;
param_1[0] = param_1[0] ^ 0xed41cda9780;
param_1[2] = param_1[2] ^ 0x1e555c027a4e43;
param_1[3] = inp[3] + 0xfff29f96915a6e96;
param_1[0] = param_1[0] ^ 0x4c46c321e8dc3d;
param_1[2] = param_1[2] + 0x440d7b5dafb63c;
param_1[3] = param_1[3] ^ 0x39549dd6e1299b;
param_1[0] = param_1[0] + 0xff80a83276856f6b;
param_1[0] = param_1[0] + 0x3869018f758dd0;
param_1[0] = param_1[0] + 0xfff507f694ac1618;
param_1[0] = param_1[0] + 0xffaef9a6a60ac41c;
param_1[2] = param_1[2] ^ 0x4bb739ae97e2b2;
param_1[0] = param_1[0] ^ 0xb9c189c728744;
param_1[3] = param_1[3] ^ 0x63b60e480e2904;
param_1[1] = param_1[1] + 0x70ea19e458d1dd;
param_1[0] = param_1[0] ^ 0x1c380c9255dc4a;
param_1[0] = param_1[0] ^ 0x72195b264896c6;
param_1[0] = param_1[0] + 0xb58f5721006db;
param_1[1] = param_1[1] + 0xfff1a19d465554d0;
param_1[1] = param_1[1] + 0x45c8dee1a136cd;
param_1[1] = param_1[1] + 0xff95aa1bc2ad9c07;
param_1[3] = param_1[3] + 0xffed79b44c733cd6;
param_1[0] = param_1[0] + 0x27d894eb9caa9b;
param_1[3] = param_1[3] + 0xff9cb13f334ec53a;
param_1[3] = param_1[3] + 0x3c2a0d8d36145a;
param_1[1] = param_1[1] + 0x30a473f940b5dd;
param_1[2] = param_1[2] + 0x7239ea8aa2bc49;
param_1[1] = param_1[1] + 0x71e89e42b8b132;
param_1[1] = param_1[1] + 0xff887455a5eb36fd;
param_1[2] = param_1[2] + 0xffc07313a3962d72;
param_1[2] = param_1[2] + 0xffcf924d075d2a72;
param_1[1] = param_1[1] ^ 0x3707089012b521;
param_1[2] = param_1[2] + 0x12b99b0e57e3bb;
param_1[1] = param_1[1] + 0x3e897bb78bc162;
param_1[2] = param_1[2] + 0xffc244c1f804fc9b;
param_1[3] = param_1[3] ^ 0x21e211817f468b;
param_1[3] = param_1[3] + 0x44c0052fcca332;
param_1[1] = param_1[1] + 0x4f53af9faf8acf;
param_1[1] = param_1[1] + 0x2fda660863a649;
param_1[1] = param_1[1] + 0xffa9f06d0990b3ac;
param_1[2] = param_1[2] + 0x2e93addef2df4f;
param_1[3] = param_1[3] + 0x4531b2344b641b;
param_1[3] = param_1[3] + 0xfff8e89a72f8e26c;
param_1[1] = param_1[1] + 0x15c6da9bc36ed0;
param_1[2] = param_1[2] ^ 0x738278f8599e2d;
param_1[1] = param_1[1] ^ 0x44dd76d42e4513;
param_1[1] = param_1[1] + 0xffb57183e089ceb4;
param_1[2] = param_1[2] ^ 0x27972fbdfd287c;
param_1[0] = param_1[0] ^ 0x7eb9039a2b6bf0;
param_1[2] = param_1[2] + 0xffc75c67f5de1b31;

# FUN_00101346
param_1[0] = param_1[0] ^ 0x131e29f760409;
param_1[1] = param_1[1] + 0x23fe2dd7650a73;
param_1[1] = param_1[1] + 0xfff70308e97acf79;
param_1[2] = param_1[2] + 0xffb870f6f2950920;
param_1[0] = param_1[0] ^ 0x58bd244826ef43;
param_1[2] = param_1[2] + 0xffdc5874e8d03bbc;
param_1[1] = param_1[1] + 0xffb3ce0944bbfc19;
param_1[0] = param_1[0] ^ 0x38b3e1c4b3be14;
param_1[3] = param_1[3] ^ 0x6de4b0dccee1f8;
param_1[2] = param_1[2] + 0x48e99a2ccfbefa;
param_1[2] = param_1[2] + 0x2803831f197314;
param_1[2] = param_1[2] ^ 0x7fd3195c5e8bfb;
param_1[1] = param_1[1] + 0x2311f9e5515a6d;
param_1[3] = param_1[3] + 0x29e99994341bad;
param_1[2] = param_1[2] + 0xffa46f41e698229f;
param_1[0] = param_1[0] ^ 0x16097f9beb9df8;
param_1[2] = param_1[2] ^ 0x58f5f5f9e64f77;
param_1[2] = param_1[2] + 0xffce81bd3383de95;
param_1[0] = param_1[0] + 0x1437a45ffed077;
param_1[2] = param_1[2] + 0x4ec7609899b599;
param_1[3] = param_1[3] + 0x77832406a422ee;
param_1[0] = param_1[0] ^ 0xa299bfabd147f;
param_1[0] = param_1[0] + 0xff9731d63e0a4ce9;
param_1[0] = param_1[0] ^ 0x3ea0b669b87301;
param_1[0] = param_1[0] ^ 0x7bc3ff2762eeb0;
param_1[0] = param_1[0] + 0x2ff3559df23d95;
param_1[2] = param_1[2] + 0xffb0934ca254c450;
param_1[0] = param_1[0] + 0xff8b3b8d33d104e1;
param_1[3] = param_1[3] ^ 0x2f268e55029508;
param_1[2] = param_1[2] + 0xffe1c76d94c5b270;
param_1[3] = param_1[3] ^ 0x5575918734e1cd;
param_1[0] = param_1[0] + 0xffe368f50fe7ff81;
param_1[0] = param_1[0] ^ 0x22b615021c1680;
param_1[0] = param_1[0] + 0xff95c819c49f5170;
param_1[2] = param_1[2] + 0x485e655976a7ee;
param_1[0] = param_1[0] + 0x6f4847b022b253;
param_1[1] = param_1[1] ^ 0x392622311d6f3d;
param_1[1] = param_1[1] + 0xffb3096849dd7eb3;
param_1[3] = param_1[3] ^ 0x6e8b5de620fa;
param_1[3] = param_1[3] + 0x21d4322fefd286;
param_1[3] = param_1[3] + 0xffe14e96454625c5;
param_1[3] = param_1[3] ^ 0x4757d3b35495bb;
param_1[1] = param_1[1] + 0xffc4845886e53673;
param_1[0] = param_1[0] ^ 0x57617d2db4d1c4;
param_1[0] = param_1[0] ^ 0x69bd97ec881da;
param_1[2] = param_1[2] ^ 0x57ac6bbc11593;
param_1[2] = param_1[2] ^ 0x5c2cbf22512aa3;
param_1[2] = param_1[2] + 0x1860e298e3c0d5;
param_1[2] = param_1[2] + 0xffe6f1b24728fb11;
param_1[0] = param_1[0] + 0x4561b3931db109;
param_1[0] = param_1[0] ^ 0x1a70a95138d536;
param_1[2] = param_1[2] + 0x32ff8082367e19;
param_1[3] = param_1[3] + 0xff99a53e605869f2;
param_1[0] = param_1[0] + 0x1e359449108efb;
param_1[0] = param_1[0] + 0xff9338172cb899f9;
param_1[0] = param_1[0] + 0x33dbc3093cba9e;
param_1[1] = param_1[1] + 0x7d005d760e8a00;
param_1[0] = param_1[0] ^ 0x630abe094f2fcb;
param_1[2] = param_1[2] ^ 0x5c693ca6ad4098;
param_1[2] = param_1[2] ^ 0x1218c2c1fc6aab;
param_1[2] = param_1[2] ^ 0x78d35fbb138c9c;
param_1[3] = param_1[3] + 0x42dfb926a777d2;
param_1[3] = param_1[3] ^ 0x3f60fd507495c5;
param_1[1] = param_1[1] + 0x2cca6aa235fa04;
param_1[0] = param_1[0] + 0x5a8e68db17f162;
param_1[0] = param_1[0] + 0x1287bd45883bda;
param_1[0] = param_1[0] + 0xffe7b46bbeb822c6;
param_1[3] = param_1[3] + 0x5234b2a7901fd8;
param_1[3] = param_1[3] + 0xa856e4c03b946;
param_1[1] = param_1[1] ^ 0x6312ec05f527a4;
param_1[1] = param_1[1] + 0x46ce8a9c234e2f;
param_1[3] = param_1[3] + 0x171cfaebba97ed;

# FUN_00100c8c
param_1[2] = param_1[2] ^ 0x21552380a54ebd;
param_1[2] = param_1[2] ^ 0x217fe5a723014c;
param_1[2] = param_1[2] + 0xff929930c56e6594;
param_1[2] = param_1[2] ^ 0x7eb96f8929799a;
param_1[3] = param_1[3] + 0x67d0ff39897513;
param_1[3] = param_1[3] + 0x26a2f35c92df10;
param_1[2] = param_1[2] + 0xffd5d8a901dbebd6;
param_1[2] = param_1[2] + 0xad9fcf45aef6;
param_1[2] = param_1[2] + 0xffc53d1702ef8aa8;
param_1[0] = param_1[0] + 0x591ac5d1939c8b;
param_1[2] = param_1[2] ^ 0x33d94a84565532;
param_1[2] = param_1[2] ^ 0x308afb7e01e13e;
param_1[3] = param_1[3] + 0xffb48db7039082e1;
param_1[2] = param_1[2] ^ 0x55662e74858cf1;
param_1[3] = param_1[3] + 0xffa5b828a6179210;
param_1[1] = param_1[1] ^ 0x1638c6225c560d;
param_1[2] = param_1[2] ^ 0x40641fcdaf2a6d;
param_1[0] = param_1[0] + 0x1907586d8aaec6;
param_1[1] = param_1[1] ^ 0x2ac0e1d87fbfd3;
param_1[0] = param_1[0] + 0x4903ecf455fa05;
param_1[1] = param_1[1] + 0xff84efef75a89283;
param_1[2] = param_1[2] ^ 0x575e02c2ec2e98;
param_1[2] = param_1[2] ^ 0x5686c924044043;
param_1[0] = param_1[0] + 0xffa75728515de781;
param_1[0] = param_1[0] + 0x6c40d33a5de8b4;
param_1[0] = param_1[0] + 0xffae776809930118;
param_1[1] = param_1[1] + 0x77250c081305ce;
param_1[2] = param_1[2] + 0xffeff0d64a3fb770;
param_1[3] = param_1[3] + 0x1106386668917b;
param_1[2] = param_1[2] ^ 0x2a958285eaabc6;
param_1[1] = param_1[1] + 0x17e82fdc4bb7e6;
param_1[2] = param_1[2] + 0x6e5b6deacda2b3;
param_1[1] = param_1[1] + 0xffe4362cd469721d;
param_1[1] = param_1[1] ^ 0x46a8ddb8e7831e;
param_1[0] = param_1[0] + 0x5ef639bb0d96fc;
param_1[3] = param_1[3] ^ 0x540dd0d8537808;
param_1[3] = param_1[3] + 0xffd7468d44d84bfc;
param_1[2] = param_1[2] + 0xffb5048de8c6e26a;
param_1[0] = param_1[0] ^ 0x457b282105f5ff;
param_1[1] = param_1[1] ^ 0x2eff779ebf04ee;
param_1[1] = param_1[1] ^ 0x282c4c9602a8d1;
param_1[0] = param_1[0] ^ 0x5892a99ecd56db;
param_1[1] = param_1[1] + 0x7306fd8fb4ac48;
param_1[3] = param_1[3] + 0x4b3f6ca9126599;
param_1[3] = param_1[3] + 0xffed5514bbd0b395;
param_1[0] = param_1[0] + 0x19b2a80c1ebde0;
param_1[2] = param_1[2] ^ 0x34ab995333d7bc;
param_1[0] = param_1[0] ^ 0x4b803835540e77;
param_1[2] = param_1[2] ^ 0x4aaf3dd459117d;
param_1[3] = param_1[3] ^ 0x45b9bf142dd7b9;
param_1[0] = param_1[0] + 0xffdae06e2a1c7254;
param_1[1] = param_1[1] + 0xff805d1980ad21aa;
param_1[0] = param_1[0] + 0xff8aba0c42d40896;
param_1[0] = param_1[0] + 0x425422cc59e30;
param_1[0] = param_1[0] + 0x235f71339ac927;
param_1[2] = param_1[2] + 0xffb282c744cb6616;
param_1[2] = param_1[2] + 0xffa61489eb15d360;
param_1[0] = param_1[0] ^ 0x8db3daacc3ff9;
param_1[2] = param_1[2] ^ 0x97368bc6e7d41;
param_1[3] = param_1[3] ^ 0x86c96f6b4510f;
param_1[2] = param_1[2] ^ 0x1951f11deeb2fa;
param_1[1] = param_1[1] + 0x5dc2de99056b51;
param_1[2] = param_1[2] + 0xffb654da8cc4cb5f;

# FUN_00100786
param_1[3] = param_1[3] + 0xffdb0267f30481de;
param_1[0] = param_1[0] + 0xd349975ed71ce;
param_1[3] = param_1[3] + 0x396b3ec36373cc;
param_1[3] = param_1[3] ^ 0x2d2d96a9d4da30;
param_1[2] = param_1[2] ^ 0x656498272858da;
param_1[2] = param_1[2] + 0xffb3ad5ab10bc1f3;
param_1[0] = param_1[0] + 0x23b2f30be0e9ab;
param_1[0] = param_1[0] + 0xff99bef8c799559b;
param_1[0] = param_1[0] + 0xffe049bda2d90572;
param_1[2] = param_1[2] + 0xff9d4568f99d45eb;
param_1[2] = param_1[2] ^ 0x26ed48b4153eb0;
param_1[2] = param_1[2] ^ 0x1af75e7b5b8c5f;
param_1[2] = param_1[2] + 0xffe9fc2941b7bd92;
param_1[1] = param_1[1] ^ 0x4b4b690f995f73;
param_1[0] = param_1[0] + 0xffa3bcbff21dd191;
param_1[2] = param_1[2] ^ 0x6feb10d533c4b1;
param_1[1] = param_1[1] + 0xffb8a8e39fec3250;
param_1[2] = param_1[2] + 0xffdb2496d81b4293;
param_1[0] = param_1[0] + 0xffb778b645f31de9;
param_1[0] = param_1[0] ^ 0x531e0306cda7a9;
param_1[2] = param_1[2] ^ 0x3521f52cd98bf4;
param_1[1] = param_1[1] + 0xff880d1e8951a4a0;
param_1[2] = param_1[2] + 0x3858d7d314a793;
param_1[2] = param_1[2] + 0xffd7c92ed6f1e27a;
param_1[1] = param_1[1] + 0x37f1e8ac57fd21;
param_1[2] = param_1[2] + 0x794d667495ec53;
param_1[0] = param_1[0] + 0xf80ea376dfe9c;
param_1[2] = param_1[2] + 0x7077ef6357df45;
param_1[1] = param_1[1] + 0xfffe413b9b12d6da;
param_1[3] = param_1[3] + 0x562536f5f8bacf;
param_1[3] = param_1[3] + 0xff9f07032cf0845d;
param_1[0] = param_1[0] ^ 0x4ba91df7d06027;
param_1[0] = param_1[0] + 0xfff6ae6bcf2ebbbc;
param_1[3] = param_1[3] ^ 0x55cdaa7dfb2afc;
param_1[3] = param_1[3] + 0x318ce149b3a1fc;
param_1[3] = param_1[3] + 0xffd5d916adc11571;
param_1[0] = param_1[0] + 0xffc3560b3c7ef5e9;
param_1[1] = param_1[1] + 0xa8c0f5e148a9e;
param_1[2] = param_1[2] ^ 0x7b607330d80f26;
param_1[0] = param_1[0] ^ 0x3c139ff1892f4f;
param_1[1] = param_1[1] + 0x1f63d4725b825e;
param_1[3] = param_1[3] + 0x6be58b7a89dd9d;
param_1[1] = param_1[1] ^ 0x67b81b10716f5;
param_1[1] = param_1[1] + 0x70efa9f526c942;
param_1[3] = param_1[3] ^ 0x411eb7ecadc3cb;
param_1[3] = param_1[3] ^ 0x250c9395e3a054;
param_1[0] = param_1[0] + 0x78f186d15f1e3b;

# compare_function
s.add(param_1[0] ==  0x3167deae217139c1)
s.add(param_1[1] ==  0x6745aeaf0c9a62e5)
s.add(param_1[2] ==  0x62664d91c2da0c7b)
s.add(param_1[3] ==  0x7ee01bea8defde65)

print(s.check())
model = s.model()
flag_bytes = b""

for i in inp:
    flag_bytes += long_to_bytes(model[i].as_long())[::-1]

print(flag_bytes)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FOQPH7YORKya8tc7rHPPb%2Fimage.png?alt=media&amp;token=ee694c6b-800a-49d3-9d13-4e7968936123" alt=""><figcaption></figcaption></figure>

Flag: akasec{1n\_my\_b4g\_0n3\_s3c0nd\_0n3}

## Packeta (460 pts)

### Description

Balança o ombrin', vai, vai Balança o ombrin', vai, vai

Balança o ombrin' Jogadinha do Packeta

Author: **Pengolian**

### Solution

Given 2 ELF 64 bit files which are flag and packeta. First, open packeta using IDA. There are many function in the program, rename each function.

<pre class="language-c" data-title="packeta - main" data-line-numbers><code class="lang-c">__int64 __fastcall main(int a1, char **a2, char **a3)
{
  __int64 v3; // rdi
  __int64 v4; // rdx
  __int64 v5; // r8
  __int64 v6; // r9
  __int64 v7; // rdx
  __int64 v8; // r8
  __int64 v9; // r9
  __int64 v10; // rdx
  __int64 v11; // r8
  __int64 v12; // r9
  int fd; // [rsp+1Ch] [rbp-54h]
  __int64 v15; // [rsp+20h] [rbp-50h] BYREF
  void *v16; // [rsp+28h] [rbp-48h]
  size_t len; // [rsp+30h] [rbp-40h]
  _BYTE *v18; // [rsp+38h] [rbp-38h]
  void *v19; // [rsp+40h] [rbp-30h]
  void *v20; // [rsp+48h] [rbp-28h]
  unsigned __int64 v21; // [rsp+58h] [rbp-18h]

  v21 = __readfsqword(0x28u);
  v16 = 0LL;
  if ( a1 &#x3C;= 1 )
  {
    printf("Usage:\n$> %s your_elf_binary", *a2);
    exit(1);
  }
  fd = open(a2[1], 0, a3);
  if ( !fd )
    exit(1);
  len = lseek(fd, 0LL, 2);
  if ( len == -1LL )
  {
    close(fd);
    exit(1);
  }
  v16 = mmap(0LL, len, 3, 2, fd, 0LL);
  if ( v16 == (void *)-1LL )
    exit(1);
  close(fd);
  v18 = malloc(0x40uLL);
  if ( !v18 )
    exit(1);
  if ( !sub_17CD(v16, v18) )
    exit(1);
  v19 = malloc(8LL * *((unsigned __int16 *)v18 + 30));
  if ( !v19 )
    exit(1);
  v3 = 8LL * *((unsigned __int16 *)v18 + 28);
  v20 = malloc(v3);
  if ( !v20 )
    exit(1);
  call_memcpy_1(v3, (__int64)v18, v4, (__int64)v19, v5, v6, v15, (__int64)v16, len, (__int64)v18, (__int64)v19);
  call_memcpy_2(
    v3,
    (__int64)v18,
    v7,
    (__int64)v19,
    v8,
    v9,
    v15,
    (__int64)v16,
    len,
    (__int64)v18,
    (int)v19,
    (__int64)v20);
<strong>  generate_key();
</strong><strong>  call_rc4(v3, (__int64)v18, v10, (__int64)v19, v11, v12, v15, (__int64)v16, len, (__int64)v18, (__int64)v19);
</strong>  write_to_file((__int64)&#x26;v15);
  return 0LL;
}
</code></pre>

* generate\_key function

```c
unsigned __int64 sub_1CE2()
{
  int i; // [rsp+8h] [rbp-68h]
  time_t timer; // [rsp+10h] [rbp-60h] BYREF
  __int64 v3; // [rsp+18h] [rbp-58h]
  char v4[72]; // [rsp+20h] [rbp-50h] BYREF
  unsigned __int64 v5; // [rsp+68h] [rbp-8h]

  v5 = __readfsqword(0x28u);
  v3 = 4919LL;
  time(&timer);
  srand(v3 + timer % 500);
  strcpy(v4, "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
  for ( i = 0; i <= 15; ++i )
    byte_5020[i] = v4[rand() % 62];
  return v5 - __readfsqword(0x28u);
}
```

So basically it generate key based on (current time % 500) + 4919. From that information we know that the possibility of the key only 500 (possible to brute).&#x20;

* call\_rc4 function

```c
unsigned __int64 __fastcall sub_1464(
        __int64 a1,
        __int64 a2,
        __int64 a3,
        __int64 a4,
        __int64 a5,
        __int64 a6,
        int a7,
        __int64 a8,
        int a9,
        __int64 a10,
        __int64 a11)
{
  unsigned __int64 result; // rax
  unsigned __int64 i; // [rsp+0h] [rbp-10h]
  void *ptr; // [rsp+8h] [rbp-8h]

  for ( i = 0LL; ; ++i )
  {
    result = *(unsigned __int16 *)(a10 + 60);
    if ( i >= result )
      break;
    ptr = sub_19C8(a8, *(_QWORD *)(a11 + 8LL * *(unsigned __int16 *)(a10 + 62)), **(_DWORD **)(8 * i + a11));
    if ( (unsigned int)sub_13F8(ptr) )
      rc4(a8 + *(_QWORD *)(*(_QWORD *)(8 * i + a11) + 24LL), *(_QWORD *)(*(_QWORD *)(8 * i + a11) + 32LL));
    free(ptr);
  }
  return result;
}
```

Lets take a look on rc4 function

```c
unsigned __int64 __fastcall sub_1C66(__int64 a1, __int64 a2)
{
  char v3[264]; // [rsp+10h] [rbp-110h] BYREF
  unsigned __int64 v4; // [rsp+118h] [rbp-8h]

  v4 = __readfsqword(0x28u);
  sub_1A84(byte_5020, v3);
  sub_1B5C(v3, a1, a2);
  return v4 - __readfsqword(0x28u);
}
```

From above code we can confirm that byte\_5020 used as the key for rc4 function. To know the ciphertext values we can debug the executable using GDB.

```
pie b 0x1CC6
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fs4hVAjqByvP6FTApAajV%2Fimage.png?alt=media&amp;token=8eabb0ba-32e1-46bb-8bdb-9c3242f19f0c" alt=""><figcaption></figcaption></figure>

```
gef➤  x/32bx 0x00007ffff7fb8060
0x7ffff7fb8060:	0x4d	0x75	0xac	0xea	0x75	0xab	0x78	0x07
0x7ffff7fb8068:	0x90	0x58	0x8e	0x25	0x07	0x84	0x3f	0x73
0x7ffff7fb8070:	0x2b	0xa2	0x70	0x40	0x78	0x62	0x4b	0xfd
0x7ffff7fb8078:	0x65	0xf0	0x9b	0x07	0x58	0x44	0x9d	0xca
```

The ciphertext values start with 0x4d75. Check on flag binary to findout on which section those ciphertext.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F5ETISjVQYnHse5nTXA3v%2Fimage.png?alt=media&amp;token=abcfd5b4-0385-4c4c-aaea-bc79a1ec26ce" alt=""><figcaption></figcaption></figure>

From image above we can confirm that the ciphertext section is on .text section. To get the valid key we can do bruteforce and validate manually which plaintext consist of valid assembly instruciton because the first ciphertext is the start function. Below is my script

```python
from Crypto.Cipher import ARC4
from ctypes import CDLL
from capstone import *
import string

md = Cs(CS_ARCH_X86, CS_MODE_64)

libc = CDLL("libc.so.6")
ct = [0x4d, 0x75, 0xac, 0xea, 0x75, 0xab, 0x78, 0x7, 0x90, 0x58, 0x8e, 0x25, 0x7, 0x84, 0x3f, 0x73, 0x2b, 0xa2, 0x70, 0x40, 0x78, 0x62, 0x4b, 0xfd, 0x65, 0xf0, 0x9b, 0x7, 0x58, 0x44, 0x9d, 0xca]
v4 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

for i in range(500):
	libc.srand(4919 + i)
	key = ""
	for j in range(16):
		key += v4[libc.rand() % 62]
	cipher = ARC4.new(key.encode())
	asm = cipher.decrypt(bytes(ct))
	for j in md.disasm(asm, 0x401000):
		print(i, j)
	print()
```

For the comparison we can use the standard start function, such as from packeta file.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FUyejm8A5kxvmZ01egFW3%2Fimage.png?alt=media&amp;token=8eb77429-e18b-46cd-a9dd-7e6a519035d8" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FbZs5iSDQAIt3bzqssIBR%2Fimage.png?alt=media&amp;token=41fb7a09-c0e6-46a2-ac6c-3692b41e42d2" alt=""><figcaption></figcaption></figure>

So i == 127 looks like the correct value because it result valid assembly like standard start function. To get the rest plaintext we can debug the program and set the value for the (current\_time % 500).

```
pie b 0x1d49
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FF5BHZfXLyhgSEMDThKgh%2Fimage.png?alt=media&amp;token=cf5c8b72-ca56-4f00-af8c-24ec6b48628a" alt=""><figcaption></figcaption></figure>

Continue the process then run the new generated ELF named new.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FGmrCSscSnlMdjjaIXNFz%2Fimage.png?alt=media&amp;token=0c970deb-6d2f-4d5e-a5df-246cb602065b" alt=""><figcaption></figcaption></figure>

Flag: AKASEC{h4lf\_p4ck\_h4lf\_7h3\_fl46}

## Mips (477 pts)

### Description

check out my 16 star pb (note: you need ares to run the rom properly)

Author: **miyako**

`nc 20.80.240.190 4321`

### Solution

Given Nintendo 64 ROM image. During the competition i found good [reference](https://blog.quantumlyconfused.com/ctf/2022/05/22/nsec2022-n64/) about nintedo 64 reverse engineering. From the description we know that we can run the rom using [ares](https://ares-emu.net/). In this case i install the emulator on ubuntu. To load the rom we can click Load -> Nintendo -> Nintendo 64.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FOkYe7dqtdR6QC4fIN2jC%2Fimage.png?alt=media&amp;token=a53d5f4b-39de-4509-8440-c750ee78afb3" alt=""><figcaption></figcaption></figure>

Setup the input mapping by click Settings -> Input.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FgK2PeT3YaqasiJzAy6EP%2Fimage.png?alt=media&amp;token=b8c4945f-bb90-4c41-9941-c7c2cf9c9281" alt=""><figcaption></figcaption></figure>

Press some random button and it will reflected on screen, to submit the button we can press enter button (start).

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FGpdMXcswrVatbPbp6wUD%2Fimage.png?alt=media&amp;token=fab16241-9629-4bbe-85c6-478c59ef04fe" alt=""><figcaption></figcaption></figure>

Next, we need to decompile the rom. I use ghidra with [N64LoaderWV](https://github.com/zeroKilo/N64LoaderWV) plugin to do that.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fduf80M6WQd1OLJCykzlz%2Fimage.png?alt=media&amp;token=794ae25f-d69f-4207-ad04-99470a9e7f9e" alt=""><figcaption></figcaption></figure>

Searching for "wrong" string then we will found the validation program.

<pre class="language-c" data-line-numbers><code class="lang-c">void FUN_8000b4e0(void)

{
  undefined uVar2;
  longlong lVar1;
  uint uVar3;
  int iVar4;
  int unaff_gp_lo;
  undefined4 local_48;
  int iStack_44;
  undefined8 local_40;
  undefined8 local_38;
  undefined8 local_30;
  
  FUN_80007340(&#x26;local_48);
  if ((*(unaff_gp_lo + -0x7e6c) == '\0') &#x26;&#x26; (uVar3 = (&#x26;DAT_ffff8195)[unaff_gp_lo], iStack_44 != 0))
  {
    if ((&#x26;DAT_ffff8195)[unaff_gp_lo] == 0) {
      iVar4 = -0x7ffd0000;
      _DAT_800280b0 = 0;
      _PTR_DAT_800280b8 = 0;
      _PTR_DAT_800280c0 = 0;
      PTR_DAT_800280c8 = 0x0;
      PTR_DAT_800280cc._0_2_ = 0;
      uVar2 = FUN_8000b200(CONCAT44(local_48,iStack_44),local_40,local_38,local_30);
      *(iVar4 + -0x7f50) = uVar2;
      (&#x26;DAT_ffff8195)[unaff_gp_lo] = 1;
      return;
    }
<strong>    uVar2 = FUN_8000b200(CONCAT44(local_48,iStack_44),local_40,local_38,local_30);
</strong>    (&#x26;DAT_800280b0)[uVar3] = uVar2;
    (&#x26;DAT_ffff8195)[unaff_gp_lo] = uVar3 + 1;
<strong>    if ((uVar3 + 1 &#x26; 0xff) == 0x1e) {
</strong><strong>      lVar1 = FUN_80010ed8(0xffffffff800280b0,0xffffffff800270c8,0x1e);
</strong>      if (lVar1 == 0) {
        *(unaff_gp_lo + -0x7f5c) = s_correct!_80019be0;
        *(unaff_gp_lo + -0x7e6c) = 1;
      }
      else {
        *(unaff_gp_lo + -0x7f5c) = s_wrong_80019bf0;
        (&#x26;DAT_ffff8195)[unaff_gp_lo] = 0;
      }
    }
  }
  return;
}
</code></pre>

From above code we got some information

* Line 30: Our input mapped to some constant value
* Line 33: Input length is 0x1e, we can also confirm through user interface by input more than 30 button then it will reset
* Line 34: Our mapped input validated with constant value at (DAT\_800270c8)

Now we need to get the valid input mapping, one of the way to do that is by debugging. Click Settings -> Debug then enable debugging with below options.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FVSknIAZRZlHAyOrceVvT%2Fimage.png?alt=media&amp;token=884be369-b92e-4b6e-9fac-bd16f61f44df" alt=""><figcaption></figcaption></figure>

After that, use gdb-multiarch to connect to gdb server.

```
target remote localhost:9123
ctrl+c
set endian big
x/20i 0x8000b4e0
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FLUZ0qNyPYFMfWJ1zfQbt%2Fimage.png?alt=media&amp;token=fa5bb55e-32cd-4549-86dd-c14df9cf8f83" alt=""><figcaption></figcaption></figure>

Then breakpoint at 0x8000b53c.

```
break *0x8000b53c
c
```

Press up button (for example), then the breakpoint will be hitten. Look at v0 register to know the mapped value for up button.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FL3W2twwz9QQzQmwA3Sre%2Fimage.png?alt=media&amp;token=a4dadc97-c20c-47c5-ad41-57e6751fdb58" alt=""><figcaption></figcaption></figure>

Do the same thing until got all mapped input then create script to get the reflected input on screen.

```python
dict = {}
dict[2] = 'U'
dict[5] = 'L'
dict[9] = 'R'
dict[1] = 'D'
dict[0xa] = 'CU'
dict[0x14] = 'CL'
dict[0xf] = 'CD'
dict[0x19] = 'CR'
dict[0x7] = 'B'
dict[0x4] = 'A'
dict[0xb] = 'LR'
dict[0xc] = 'RR'
dict[0x3] = 'Z'

target_button = [0x03,0x0C,0x0A,0x0A,0x0A,0x0A,0x14,0x01,0x01,0x0A,0x04,0x07,0x19,0x09,0x01,0x0A,0x02,0x05,0x09,0x07,0x02,0x0C,0x09,0x07,0x0A,0x0C,0x0A,0x03,0x09,0x03]

button = ""

for i in target_button:
	button += dict[i]

print(button)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F6cxKF9O2mlWgAwZoBdit%2Fimage.png?alt=media&amp;token=8814b61e-5976-458c-8098-2117224b4c98" alt=""><figcaption></figcaption></figure>

Flag: akasec{m1ps\_1s\_c00l\_l0l}

## Orgalorg (498 pts)

### Description

Did you know that Gunter is literally Orgalorg, a primordial cosmic entity, feared as the Breaker of Worlds, disguised as a penguin on earth...

`nc 20.80.240.190 1235`

Author: **pengolian**

### Solution

Given ELF 64 bit file, open it using IDA.

```c
__int64 __fastcall main(int a1, const char **a2, char **a3, int a4, int a5, int a6)
{
  const char *v6; // rbp
  size_t v7; // rax
  size_t v8; // rbx
  __int64 *v10; // rdi
  size_t v11; // [rsp+8h] [rbp-60h] BYREF
  __int64 v12[2]; // [rsp+10h] [rbp-58h] BYREF
  __int64 v13[9]; // [rsp+20h] [rbp-48h] BYREF

  v13[3] = __readfsqword(0x28u);
  func_1(a1, a2, a3, a4, a5, a6); 
  if ( dword_17240 )
  {
    func_2();
    return 0LL;
  }
  v6 = *a2;
  v12[0] = v13;
  if ( !v6 )
    std::__throw_logic_error("basic_string: construction from null is not valid");
  v7 = strlen(v6);
  v11 = v7;
  v8 = v7;
  if ( v7 > 0xF )
  {
    v12[0] = std::string::_M_create(v12, &v11, 0LL);
    v10 = v12[0];
    v13[0] = v11;
    goto LABEL_12;
  }
  if ( v7 != 1 )
  {
    if ( !v7 )
      goto LABEL_6;
    v10 = v13;
LABEL_12:
    memcpy(v10, v6, v8);
    goto LABEL_6;
  }
  LOBYTE(v13[0]) = *v6;
LABEL_6:
  v12[1] = v11;
  *(v12[0] + v11) = 0;
  sub_5950(v12);
  std::string::_M_dispose(v12);
  return 0LL;
}
```

So in main function there are two user defined function which are func\_1 and sub\_5950. Lets take a look on func\_1. At the time of competition i've renamed some function while debugging.

<pre class="language-c"><code class="lang-c">unsigned __int64 __fastcall sub_5150()
{
  __m128i *v0; // rax
  __m128i v1; // xmm2
  __m128i v2; // xmm3
  char *LOGNAME; // rbx
  __int32 *v4; // rax
  __int32 v5; // r9d
  char *OGP; // r14
  size_t v7; // rax
  size_t v8; // rax
  __m128i *v10; // rax
  __m128i v11; // xmm7
  void *v12[2]; // [rsp+0h] [rbp-98h] BYREF
  __int32 *v13; // [rsp+10h] [rbp-88h]
  __m128i si128; // [rsp+20h] [rbp-78h] BYREF
  __int64 v15; // [rsp+30h] [rbp-68h]
  __int64 v16; // [rsp+38h] [rbp-60h]
  char *name[2]; // [rsp+40h] [rbp-58h] BYREF
  __int64 v18[3]; // [rsp+50h] [rbp-48h] BYREF
  unsigned __int64 v19; // [rsp+68h] [rbp-30h]

  v19 = __readfsqword(0x28u);
<strong>  if ( anti_debug_1() )
</strong>    goto LABEL_22;
  LODWORD(v16) = -1073741632;
  v15 = 0xC00000C1400000C0LL;
  v13 = 0LL;
  si128 = _mm_load_si128(&#x26;xmmword_F130);
  *v12 = 0LL;
  v0 = operator new(0x1CuLL);
  v12[0] = v0;
  v1 = _mm_load_si128(&#x26;si128);
  v2 = _mm_loadu_si128(&#x26;si128.m128i_i8[12]);
  v13 = &#x26;v0[1].m128i_i32[3];
  *v0 = v1;
  *(v0 + 12) = v2;
  v12[1] = &#x26;v0[1].m128i_u64[1] + 4;
<strong>  get_string(name, v12);
</strong>  LOGNAME = getenv(name[0]);                    // getenv("LOGNAME")
  if ( name[0] != v18 )
    operator delete(name[0], v18[0] + 1);
  if ( v12[0] )
    operator delete(v12[0], v13 - v12[0]);
  si128.m128i_i32[2] = 1610612930;
  v13 = 0LL;
  si128.m128i_i64[0] = 0x800000C0800000C1LL;
  *v12 = 0LL;
  v4 = operator new(0xCuLL);
  v12[0] = v4;
  v5 = si128.m128i_i32[2];
  v13 = v4 + 3;
  *v4 = si128.m128i_i64[0];
  v4[2] = v5;
  v12[1] = v4 + 3;
<strong>  get_string(name, v12);
</strong>  OGP = getenv(name[0]);                        // getenv("OGP")
  if ( name[0] != v18 )
    operator delete(name[0], v18[0] + 1);
  if ( v12[0] )
    operator delete(v12[0], v13 - v12[0]);
  if ( LOGNAME )
  {
    v7 = strlen(LOGNAME);
    std::string::_M_replace(&#x26;LOGNAME_1, 0LL, LOGNAME_LENGTH, LOGNAME, v7);
  }
  if ( OGP )
  {
    v8 = strlen(OGP);
    std::string::_M_replace(&#x26;OGP_1, 0LL, OGP_LENGTH, OGP, v8);
  }
  if ( OGP_LENGTH )
  {
<strong>    if ( sub_BBC0(&#x26;OGP_1) )                     // check length OGP and digits
</strong>    {
      dword_171E0 = sub_4730();
      LODWORD(v15) = 0x600000C6;
      v13 = 0LL;
      si128 = _mm_load_si128(&#x26;xmmword_F140);
      *v12 = 0LL;
      v10 = operator new(0x14uLL);
      v11 = _mm_load_si128(&#x26;si128);
      v12[0] = v10;
      v10[1].m128i_i32[0] = v15;
      *v10 = v11;
      v13 = &#x26;v10[1].m128i_i32[1];
      v12[1] = v10[1].m128i_i64 + 4;
<strong>      get_string(name, v12);
</strong><strong>      prctl(15, name[0], 0LL, 0LL, 0LL);        // prctl(PR_SET_NAME,"sleep")
</strong>      if ( name[0] != v18 )
        operator delete(name[0], v18[0] + 1);
      if ( v12[0] )
        operator delete(v12[0], v13 - v12[0]);
<strong>      dword_17240 = 1;
</strong>      return v19 - __readfsqword(0x28u);
    }
LABEL_22:
    exit(1);
  }
  return v19 - __readfsqword(0x28u);
}
</code></pre>

* anti\_debug\_1
  * anti debug function, will exit the process if debugging detected
  * will open /proc/self/status to check debugging status
  * We can easily bypass the the anti debug by changing the return value
* get\_string
  * kind of string obfuscation, the function will return "plaintext" of obfuscated/encrypted string
* sub\_bbc0
  * check length of OGP and ensure that it constructed only from digits
* prctl
  * set the process name to sleep
* dword\_17240
  * There will be set of dword\_17240 variable to 1 if there is valid OGP and debugging not detected

Back to main function, after calling of func\_1 there will be validation of dword\_17240. If dword\_17240 not zero it will call func\_2. So lets take a look on func\_2.

<pre class="language-c"><code class="lang-c">__int64 sub_45F0()
{
  __pid_t v0; // eax
  __pid_t v1; // eax
  int v2; // eax
  int v3; // ebx
  int v4; // eax
  int v5; // edi
  int v6; // edi
  int v7; // edi
  int v8; // edi
  int v9; // edi
  int v11; // edi
  int v13; // edi

<strong>  v0 = fork();
</strong>  if ( v0 &#x3C; 0 )
    goto LABEL_24;
  if ( v0 )
    goto LABEL_23;
  if ( setsid() &#x3C; 0 || (v1 = fork(), v1 &#x3C; 0) )
LABEL_24:
    exit(1);
  if ( v1 )
LABEL_23:
    exit(0);
  umask(0);
  v2 = sysconf(4);
  v3 = v2;
  if ( v2 >= 0 )
  {
    v4 = (v2 + 1) &#x26; 7;
    if ( !v4 )
      goto LABEL_27;
    if ( v4 != 1 )
    {
      if ( v4 != 2 )
      {
        if ( v4 != 3 )
        {
          if ( v4 != 4 )
          {
            if ( v4 != 5 )
            {
              if ( v4 != 6 )
              {
                v13 = v3--;
                close(v13);
              }
              v5 = v3--;
              close(v5);
            }
            v6 = v3--;
            close(v6);
          }
          v7 = v3--;
          close(v7);
        }
        v8 = v3--;
        close(v8);
      }
      v9 = v3--;
      close(v9);
    }
    close(v3);
    if ( v3-- != 0 )
    {
LABEL_27:
      do
      {
        close(v3);
        close(v3 - 1);
        close(v3 - 2);
        close(v3 - 3);
        close(v3 - 4);
        close(v3 - 5);
        close(v3 - 6);
        v11 = v3 - 7;
        v3 -= 8;
        close(v11);
      }
      while ( v3 != -1 );
    }
  }
  return func_3();
}
</code></pre>

* fork
  * There is call of fork, so after calling fork the rest flow will be processed by the child process
  * Set follow fork mode to child on GDB to debug the child process

Next, take a look on func\_3

<pre class="language-c" data-line-numbers><code class="lang-c">// positive sp value has been detected, the output may be wrong!
__int64 sub_BDB0()
{
  int v0; // esi
  int v1; // edx
  int v2; // ecx
  int v3; // r8d
  int v4; // r9d
  char *v5; // rax
  _BYTE *v6; // r15
  size_t v7; // rax
  size_t v8; // rbp
  void *v9; // rsi
  _QWORD *v10; // rdi
  nfds_t v11; // r12
  struct pollfd *v12; // rax
  int v13; // ebp
  __int64 v14; // rax
  __int64 v15; // r13
  int v16; // r14d
  _QWORD *v17; // rdi
  __int64 v18; // rax
  int i; // r14d
  _QWORD *v20; // r12
  int v21; // eax
  int v23; // [rsp-118h] [rbp-80148h]
  void *v24; // [rsp-110h] [rbp-80140h] BYREF
  char *v25; // [rsp-108h] [rbp-80138h] BYREF
  char *v26; // [rsp-100h] [rbp-80130h]
  char *v27; // [rsp-F8h] [rbp-80128h]
  void *v28; // [rsp-F0h] [rbp-80120h]
  void *v29[2]; // [rsp-E8h] [rbp-80118h] BYREF
  __int64 v30; // [rsp-D8h] [rbp-80108h] BYREF
  void *v31[2]; // [rsp-C8h] [rbp-800F8h] BYREF
  _QWORD v32[2]; // [rsp-B8h] [rbp-800E8h] BYREF
  _BYTE v33[168]; // [rsp-A8h] [rbp-800D8h] BYREF
  char v34; // [rsp+0h] [rbp-80030h] BYREF
  __int64 v35; // [rsp+1000h] [rbp-7F030h] BYREF
  unsigned __int64 v36; // [rsp+7FFF0h] [rbp-40h]

  while ( &#x26;v34 != (&#x26;v35 - 0x10000) )
    ;
  v0 = dword_171E0;
  v36 = __readfsqword(0x28u);
  (sub_6750)(v33, dword_171E0);
  if ( anti_debug_1(v33, v0, v1, v2, v3, v4, v23, v24, v25, v26, v27, v28, v29[0], v29[1]) )
    exit(1);
  if ( (call_socket)(v33) )
  {
<strong>    if ( !(call_setsockopt)(v33) || !(call_fcntl)(v33) || !call_bind(v33) || !(call_listen)(v33) )
</strong>      (call_exit_1)(v33, 1LL);
    (call_memset)(v33);
    v5 = operator new(0x10uLL);
    v25 = v5;
    v27 = v5 + 16;
    *v5 = _mm_load_si128(&#x26;xmmword_14700);
    v26 = v5 + 16;
    get_string(v29, &#x26;v25);
    v6 = v29[0];
    v31[0] = v32;
    if ( !v29[0] )
      std::__throw_logic_error("basic_string: construction from null is not valid");
    v7 = strlen(v29[0]);                        // p455
    v24 = v7;
    v8 = v7;
    v9 = v7;
    if ( v7 > 0xF )
    {
      v31[0] = std::string::_M_create(v31, &#x26;v24, 0LL);
      v17 = v31[0];
      v32[0] = v24;
    }
    else
    {
      if ( v7 == 1 )
      {
        LOBYTE(v32[0]) = *v6;
LABEL_12:
        v10 = v32;
        goto LABEL_13;
      }
      if ( !v7 )
        goto LABEL_12;
      v17 = v32;
    }
    memcpy(v17, v6, v8);
    v9 = v24;
    v10 = v31[0];
LABEL_13:
    v31[1] = v9;
    *(v9 + v10) = 0;
    (call_string_assign)(v33, v31);
    if ( v31[0] != v32 )
      operator delete(v31[0], v32[0] + 1LL);
    if ( v29[0] != &#x26;v30 )
      operator delete(v29[0], v30 + 1);
    if ( v25 )
      operator delete(v25, v27 - v25);
    signal(17, handler);
LABEL_20:
    v11 = (get_arr_1)(v33);
    v12 = (call_a1_plus_4)(v33);
    if ( !poll(v12, v11, 172800000) )
      (call_exit_1)(v33, 1LL);
    v13 = 0;
    while ( 1 )
    {
      while ( 1 )
      {
        if ( v13 >= (get_arr_1)(v33) )
          goto LABEL_20;
        v15 = 8LL * v13;
        if ( *((call_a1_plus_4)(v33) + v15 + 6) )
          break;
LABEL_23:
        ++v13;
      }
      v16 = *((call_a1_plus_4)(v33) + 8LL * v13);
      if ( v16 == (get_arr_3)(v33) )
      {
<strong>        if ( !send_banner(v33) )    
</strong>          (call_exit_1)(v33, 1LL);
        goto LABEL_23;
      }
      v14 = (call_a1_plus_4)(v33);
<strong>      if ( (process_recv)(v33, *(v14 + 8LL * v13)) )
</strong>        goto LABEL_23;
      v18 = (call_a1_plus_4)(v33);
      (call_close_2)(v33, *(v18 + 8LL * v13));
      for ( i = v13; i &#x3C; (get_arr_1)(v33); ++i )
      {
        v20 = ((call_a1_plus_4)(v33) + v15 + 8);
        *((call_a1_plus_4)(v33) + v15) = *v20;
        v15 += 8LL;
      }
      v21 = (get_arr_1)(v33);
      (get_arr_2)(v33, (v21 - 1));
    }
  }
  (call_close_1)(v33);
  return 1LL;
}
</code></pre>

* Line 50: initialize socket listening, bind to port 50009
* Line 121: sending banner (during the initial connection)
* Line 126: process our input

Next lets take a look on process\_recv.

<pre class="language-c" data-line-numbers><code class="lang-c">__int64 __fastcall process_recv(__int64 a1, int a2)
{
  _DWORD *v3; // r14
  size_t v4; // rax
  __int64 v5; // rdx
  __int64 v6; // r15
  ssize_t v7; // rax
  int input_length; // eax
  char *v9; // r15
  __int64 *v11; // r8
  char *v12; // r12
  __int64 v13; // r10
  __int64 v14; // r12
  unsigned int v15; // r8d
  unsigned int v16; // r9d
  __int64 v17; // r15
  __int64 v18; // rcx
  __int64 v19; // r9
  __int64 v20; // r11
  __int64 v21; // r15
  __int64 v22; // rcx
  __int64 v23; // r11
  __int64 v24; // r15
  __int64 v25; // rcx
  __int64 v26; // rdi
  __int64 v27; // rdx
  __int64 v28; // rsi
  __int64 v29; // r9
  __int64 v30; // r11
  __int64 v31; // r10
  __int64 v32; // r15
  __int64 v33; // rdi
  __int64 v34; // rcx
  __int64 v35; // rdx
  __int64 v36; // rsi
  size_t actual_input_length; // rdx
  unsigned __int64 last_of; // rax
  size_t v39; // r12
  __int64 *v40; // r11
  __int64 *v41; // rdx
  __int64 *v42; // rax
  __m128i v43; // xmm1
  __int64 v44; // rax
  __int64 *v45; // rdi
  __m128i v46; // xmm0
  __int64 v47; // r11
  __int64 v48; // rcx
  __int8 v49; // dl
  __int64 v50; // r10
  unsigned __int64 v51; // r11
  signed __int64 v52; // rax
  __int8 *v53; // rdi
  unsigned int v54; // edx
  unsigned int v55; // r9d
  unsigned int v56; // esi
  __int64 v57; // r10
  __int64 v58; // rcx
  __int64 v59; // rax
  __int64 v60; // r10
  __int64 v61; // r12
  __int64 v62; // rsi
  __int64 v63; // r10
  __int64 v64; // rcx
  __int64 v65; // rsi
  __int64 v67; // [rsp+18h] [rbp-2B0h] BYREF
  void *input_user_2; // [rsp+20h] [rbp-2A8h] BYREF
  __m128i n; // [rsp+28h] [rbp-2A0h] BYREF
  void *v70; // [rsp+40h] [rbp-288h]
  __int64 v71; // [rsp+48h] [rbp-280h]
  char s[8]; // [rsp+50h] [rbp-278h] BYREF
  __int64 v73; // [rsp+58h] [rbp-270h]
  void *v74; // [rsp+60h] [rbp-268h] BYREF
  __m128i v75; // [rsp+68h] [rbp-260h] BYREF
  __int64 v76; // [rsp+78h] [rbp-250h]
  char user_input[520]; // [rsp+80h] [rbp-248h] BYREF
  unsigned __int64 v78; // [rsp+288h] [rbp-40h]

  v78 = __readfsqword(0x28u);
  n.m128i_i32[0] = 1610612940;
  input_user_2 = 0xA00000CFA00000CFLL;
  v70 = s;
  v3 = operator new(0xCuLL);
  *v3 = 0xA00000CFA00000CFLL;
  v3[2] = 1610612940;
  v71 = 3LL;
  strcpy(s, ">> ");
  v74 = &#x26;v75.m128i_u64[1];
  v4 = strlen(s);
  if ( v4 != 1 )
  {
    if ( !v4 )
      goto LABEL_3;
    v11 = &#x26;v75.m128i_i64[1];
    v12 = s;
    if ( v4 >= 8 )
    {
      v14 = 8LL;
      v15 = v4 &#x26; 0xFFFFFFF8;
      v75.m128i_i64[1] = *s;
      v16 = (((v4 &#x26; 0xFFFFFFF8) - 1) >> 3) &#x26; 7;
      if ( (v4 &#x26; 0xFFFFFFF8) > 8 )
      {
        if ( !v16 )
          goto LABEL_104;
        if ( v16 != 1 )
        {
          if ( v16 != 2 )
          {
            if ( v16 != 3 )
            {
              if ( v16 != 4 )
              {
                if ( v16 != 5 )
                {
                  if ( v16 != 6 )
                  {
                    v76 = v73;
                    LODWORD(v14) = 16;
                  }
                  v17 = v14;
                  LODWORD(v14) = v14 + 8;
                  *(&#x26;v75.m128i_i64[1] + v17) = *&#x26;s[v17];
                }
                v18 = v14;
                LODWORD(v14) = v14 + 8;
                *(&#x26;v75.m128i_i64[1] + v18) = *&#x26;s[v18];
              }
              v19 = v14;
              LODWORD(v14) = v14 + 8;
              *(&#x26;v75.m128i_i64[1] + v19) = *&#x26;s[v19];
            }
            v20 = v14;
            LODWORD(v14) = v14 + 8;
            *(&#x26;v75.m128i_i64[1] + v20) = *&#x26;s[v20];
          }
          v21 = v14;
          LODWORD(v14) = v14 + 8;
          *(&#x26;v75.m128i_i64[1] + v21) = *&#x26;s[v21];
        }
        v22 = v14;
        v14 = (v14 + 8);
        *(&#x26;v75.m128i_i64[1] + v22) = *&#x26;s[v22];
        if ( v14 &#x3C; v15 )
        {
LABEL_104:
          do
          {
            v23 = (v14 + 8);
            v24 = (v14 + 16);
            v25 = (v14 + 24);
            v26 = *&#x26;s[v23];
            v27 = *&#x26;s[v24];
            v28 = *&#x26;s[v25];
            *(&#x26;v75.m128i_i64[1] + v14) = *&#x26;s[v14];
            v29 = (v14 + 32);
            *(&#x26;v75.m128i_i64[1] + v23) = v26;
            v30 = (v14 + 40);
            v31 = *&#x26;s[v29];
            *(&#x26;v75.m128i_i64[1] + v24) = v27;
            v32 = (v14 + 48);
            v33 = *&#x26;s[v30];
            *(&#x26;v75.m128i_i64[1] + v25) = v28;
            v34 = (v14 + 56);
            v35 = *&#x26;s[v32];
            v14 = (v14 + 64);
            v36 = *&#x26;s[v34];
            *(&#x26;v75.m128i_i64[1] + v29) = v31;
            *(&#x26;v75.m128i_i64[1] + v30) = v33;
            *(&#x26;v75.m128i_i64[1] + v32) = v35;
            *(&#x26;v75.m128i_i64[1] + v34) = v36;
          }
          while ( v14 &#x3C; v15 );
        }
      }
      v11 = (&#x26;v75.m128i_i64[1] + v14);
      v12 = &#x26;s[v14];
    }
    v13 = 0LL;
    if ( (v4 &#x26; 4) != 0 )
    {
      v13 = 4LL;
      *v11 = *v12;
      if ( (v4 &#x26; 2) == 0 )
      {
LABEL_24:
        if ( (v4 &#x26; 1) == 0 )
          goto LABEL_3;
LABEL_25:
        *(v11 + v13) = v12[v13];
        goto LABEL_3;
      }
    }
    else if ( (v4 &#x26; 2) == 0 )
    {
      goto LABEL_24;
    }
    *(v11 + v13) = *&#x26;v12[v13];
    v13 += 2LL;
    if ( (v4 &#x26; 1) == 0 )
      goto LABEL_3;
    goto LABEL_25;
  }
  v75.m128i_i8[8] = 62;
LABEL_3:
  v75.m128i_i64[0] = v4;
  v75.m128i_i8[v4 + 8] = 0;
  v5 = v75.m128i_i64[0];
  if ( v75.m128i_i64[0] )
  {
    v6 = 0LL;
    do
    {
      v7 = send(a2, v74 + v6, v5 - v6, 0);
      if ( v7 == -1 )
        break;
      v5 = v75.m128i_i64[0];
      v6 += v7;
    }
    while ( v75.m128i_i64[0] != v6 );
  }
  if ( v74 != &#x26;v75.m128i_u64[1] )
    operator delete(v74, v75.m128i_i64[1] + 1);
  if ( v70 != s )
    operator delete(v70, *s + 1LL);
  operator delete(v3, 0xCuLL);
  memset(user_input, 0, 0x200uLL);
  input_user_2 = &#x26;n.m128i_u64[1];
  n.m128i_i64[0] = 0LL;
  n.m128i_i8[8] = 0;
  v70 = s;
  v71 = 0LL;
  s[0] = 0;
  while ( 1 )
  {
<strong>    input_length = recv(a2, user_input, 0x1FEuLL, 0);
</strong>    if ( input_length != -1 )
      break;
    if ( *__errno_location() != 11 )
    {
      LODWORD(v9) = 0;
      goto LABEL_15;
    }
  }
  LODWORD(v9) = 0;
  if ( input_length )
  {
    user_input[input_length] = 0;
    actual_input_length = strlen(user_input);
    if ( 0x3FFFFFFFFFFFFFFFLL - n.m128i_i64[0] &#x3C; actual_input_length )
      std::__throw_length_error("basic_string::append");
    std::string::_M_append(&#x26;input_user_2, user_input, actual_input_length);
    if ( std::string::find_first_of(&#x26;input_user_2, "\r\n", 0LL, 2LL) == -1 )
    {
      LODWORD(v9) = 1;
      goto LABEL_15;
    }
    last_of = std::string::find_last_of(&#x26;input_user_2, "\r\n", -1LL, 2LL);
    v74 = &#x26;v75.m128i_u64[1];
    v39 = last_of;
    v9 = input_user_2;
    if ( last_of > n.m128i_i64[0] )
      v39 = n.m128i_i64[0];
    v67 = v39;
    if ( v39 > 0xF )
    {
      v74 = std::string::_M_create(&#x26;v74, &#x26;v67, 0LL);
      v45 = v74;
      v75.m128i_i64[1] = v67;
    }
    else
    {
      if ( v39 == 1 )
      {
        v75.m128i_i8[8] = *input_user_2;
        goto LABEL_55;
      }
      if ( !v39 )
      {
LABEL_55:
        v40 = &#x26;v75.m128i_i64[1];
        goto LABEL_56;
      }
      v45 = &#x26;v75.m128i_i64[1];
    }
    memcpy(v45, v9, v39);
    v39 = v67;
    v40 = v74;
LABEL_56:
    v75.m128i_i64[0] = v39;
    *(v40 + v39) = 0;
    v41 = input_user_2;
    v42 = input_user_2;
    if ( input_user_2 == &#x26;n.m128i_u64[1] )
    {
      if ( v74 != &#x26;v75.m128i_u64[1] )
      {
        v46 = _mm_loadu_si128(&#x26;v75);
        input_user_2 = v74;
        n = v46;
        goto LABEL_69;
      }
    }
    else if ( v74 != &#x26;v75.m128i_u64[1] )
    {
      v43 = _mm_loadu_si128(&#x26;v75);
      v44 = n.m128i_i64[1];
      input_user_2 = v74;
      n = v43;
      if ( v41 )
      {
        v74 = v41;
        v75.m128i_i64[1] = v44;
LABEL_60:
        v75.m128i_i64[0] = 0LL;
        *v41 = 0;
        if ( v74 != &#x26;v75.m128i_u64[1] )
          operator delete(v74, v75.m128i_i64[1] + 1);
<strong>        LOBYTE(v9) = sus_func_1(a1, a2, &#x26;input_user_2) != 0;
</strong>        goto LABEL_15;
      }
LABEL_69:
      v74 = &#x26;v75.m128i_u64[1];
      v41 = &#x26;v75.m128i_i64[1];
      goto LABEL_60;
    }
    v47 = v75.m128i_i64[0];
    v48 = v75.m128i_i64[0];
    if ( !v75.m128i_i64[0] )
    {
LABEL_78:
      n.m128i_i64[0] = v47;
      *(v41 + v47) = 0;
      v41 = v74;
      goto LABEL_60;
    }
    if ( v75.m128i_i64[0] == 1 )
    {
      *input_user_2 = v75.m128i_i8[8];
      v47 = v75.m128i_i64[0];
      v41 = input_user_2;
      goto LABEL_78;
    }
    v49 = v75.m128i_i8[0];
    if ( v75.m128i_i32[0] >= 8u )
    {
      v50 = v75.m128i_u32[0];
      v51 = (input_user_2 + 8) &#x26; 0xFFFFFFFFFFFFFFF8LL;
      *input_user_2 = v75.m128i_i64[1];
      *(v42 + v50 - 8) = *(v75.m128i_i64 + v50);
      v52 = v42 - v51;
      v53 = &#x26;v75.m128i_i8[-v52 + 8];
      if ( ((v48 + v52) &#x26; 0xFFFFFFF8) >= 8 )
      {
        v54 = (v48 + v52) &#x26; 0xFFFFFFF8;
        v55 = 8;
        v9 = *v53;
        *v51 = *v53;
        v56 = ((v54 - 1) >> 3) &#x26; 7;
        if ( v54 > 8 )
        {
          if ( !v56 )
            goto LABEL_105;
          if ( v56 != 1 )
          {
            if ( v56 != 2 )
            {
              if ( v56 != 3 )
              {
                if ( v56 != 4 )
                {
                  if ( v56 != 5 )
                  {
                    if ( v56 != 6 )
                    {
                      *(v51 + 8) = *(v53 + 1);
                      v55 = 16;
                    }
                    v57 = v55;
                    v55 += 8;
                    *(v51 + v57) = *&#x26;v53[v57];
                  }
                  v58 = v55;
                  v55 += 8;
                  *(v51 + v58) = *&#x26;v53[v58];
                }
                v59 = v55;
                v55 += 8;
                v9 = *&#x26;v53[v59];
                *(v51 + v59) = v9;
              }
              v60 = v55;
              v55 += 8;
              *(v51 + v60) = *&#x26;v53[v60];
            }
            v61 = v55;
            v55 += 8;
            *(v51 + v61) = *&#x26;v53[v61];
          }
          v62 = v55;
          v55 += 8;
          *(v51 + v62) = *&#x26;v53[v62];
          if ( v55 &#x3C; v54 )
          {
LABEL_105:
            do
            {
              *(v51 + v55) = *&#x26;v53[v55];
              v63 = v55 + 32;
              *(v51 + v55 + 8) = *&#x26;v53[v55 + 8];
              *(v51 + v55 + 16) = *&#x26;v53[v55 + 16];
              v64 = v55 + 40;
              v65 = v55 + 48;
              *(v51 + v55 + 24) = *&#x26;v53[v55 + 24];
              v9 = (v55 + 56);
              v55 += 64;
              *(v51 + v63) = *&#x26;v53[v63];
              *(v51 + v64) = *&#x26;v53[v64];
              *(v51 + v65) = *&#x26;v53[v65];
              *&#x26;v9[v51] = *&#x26;v9[v53];
            }
            while ( v55 &#x3C; v54 );
          }
        }
      }
    }
    else
    {
      if ( (v75.m128i_i8[0] &#x26; 4) != 0 )
      {
        *input_user_2 = v75.m128i_i32[2];
        *(v42 + v47 - 4) = *(&#x26;v75.m128i_i32[1] + v47);
        v48 = v75.m128i_i64[0];
        v42 = input_user_2;
        goto LABEL_77;
      }
      if ( !v75.m128i_i32[0] )
      {
LABEL_77:
        v47 = v48;
        v41 = v42;
        goto LABEL_78;
      }
      LODWORD(v9) = v75.m128i_u8[8];
      *input_user_2 = v75.m128i_i8[8];
      if ( (v49 &#x26; 2) != 0 )
      {
        *(v42 + v47 - 2) = *(&#x26;v75.m128i_i16[3] + v47);
        v48 = v75.m128i_i64[0];
        v42 = input_user_2;
        goto LABEL_77;
      }
    }
    v48 = v75.m128i_i64[0];
    v42 = input_user_2;
    goto LABEL_77;
  }
LABEL_15:
  if ( v70 != s )
    operator delete(v70, *s + 1LL);
  if ( input_user_2 != &#x26;n.m128i_u64[1] )
    operator delete(input_user_2, n.m128i_i64[1] + 1);
  return v9;
}
</code></pre>

* Line 235: receive user input
* Line 318: process received user input

Take a look on sus\_func\_1

<pre class="language-c" data-line-numbers><code class="lang-c">__int64 __fastcall sus_func_1(__int64 a1, int a2, char *input_user)
{
  char *v4; // r12
  char *splitted_input; // rbx
  char *v6; // r13
  __int8 *v7; // r15
  __m128i *v8; // rsi
  void *v9; // rdx
  __m128i *v10; // r15
  unsigned int v11; // r13d
  char *v12; // rbp
  __int64 v13; // r15
  char *v14; // rdi
  char *v15; // r14
  char *v16; // rdi
  char *v17; // rdi
  __m128i *v19; // rdi
  char *v20; // r14
  void *v21; // r13
  __pid_t v22; // eax
  __m128i *v23; // rdi
  const char *v24; // r13
  void *v26[2]; // [rsp+28h] [rbp-168h] BYREF
  __int64 v27; // [rsp+38h] [rbp-158h]
  void *v28[4]; // [rsp+48h] [rbp-148h] BYREF
  void *v29[2]; // [rsp+68h] [rbp-128h] BYREF
  __int64 v30; // [rsp+78h] [rbp-118h]
  char *path[4]; // [rsp+88h] [rbp-108h] BYREF
  char *s[4]; // [rsp+A8h] [rbp-E8h] BYREF
  __m128i v33; // [rsp+C8h] [rbp-C8h] BYREF
  __m128i v34; // [rsp+D8h] [rbp-B8h] BYREF
  int v35; // [rsp+E8h] [rbp-A8h]
  void *s2[2]; // [rsp+F8h] [rbp-98h] BYREF
  __m128i si128; // [rsp+108h] [rbp-88h] BYREF
  __m128i v38; // [rsp+118h] [rbp-78h]
  __m128i v39; // [rsp+128h] [rbp-68h]
  __int64 v40; // [rsp+138h] [rbp-58h]
  int v41; // [rsp+140h] [rbp-50h]
  unsigned __int64 v42; // [rsp+150h] [rbp-40h]

  v42 = __readfsqword(0x28u);
  *v26 = 0LL;
  v27 = 0LL;
  split_string(a1, input_user, ' ', v26);       // split by ' '
  v4 = v26[1];
  splitted_input = v26[0];
  if ( v26[0] == v26[1] )
  {
    v11 = 1;
    if ( !v26[0] )
      return v11;
    goto LABEL_31;
  }
  v6 = *(a1 + 524416);
  v7 = *(a1 + 524408);
  s2[0] = &#x26;si128;
  v29[0] = v6;
  if ( v6 > 0xF )
  {
    s2[0] = std::string::_M_create(s2, v29, 0LL);
    v19 = s2[0];
    si128.m128i_i64[0] = v29[0];
    goto LABEL_34;
  }
  if ( v6 != &#x26;dword_0 + 1 )
  {
    if ( !v6 )
      goto LABEL_5;
    v19 = &#x26;si128;
LABEL_34:
    memcpy(v19, v7, v6);
    v6 = v29[0];
    v8 = s2[0];
    goto LABEL_6;
  }
  si128.m128i_i8[0] = *v7;
LABEL_5:
  v8 = &#x26;si128;
LABEL_6:
  s2[1] = v6;
  v6[v8] = 0;
  v9 = *(splitted_input + 1);                   // first value
  v10 = s2[0];
<strong>  if ( v9 == s2[1] &#x26;&#x26; (!v9 || !memcmp(*splitted_input, s2[0], v9)) )// compare length and values (p455)
</strong>  {
    if ( v10 != &#x26;si128 )
      operator delete(v10, si128.m128i_i64[0] + 1);
    v11 = 1;
<strong>    if ( *(splitted_input + 5) != 0x1ELL )      // second value
</strong>      goto LABEL_10;
<strong>    if ( compare_string(a1, splitted_input + 4)
</strong><strong>      &#x26;&#x26; compare_and_md5(a1, splitted_input + 4)
</strong><strong>      &#x26;&#x26; compare_string_2(a1, splitted_input + 4)
</strong><strong>      &#x26;&#x26; compare_and_md5_2(a1, splitted_input + 4) )
</strong>    {
      v41 = 0x200000C9;
      *s2 = _mm_load_si128(&#x26;xmmword_14680);
      v40 = 0x9FFFFF3C7FFFFF3ALL;
      si128 = _mm_load_si128(&#x26;xmmword_14690);
      v38 = _mm_load_si128(&#x26;xmmword_146A0);
      v39 = _mm_load_si128(&#x26;xmmword_146B0);
      sub_5DA0(v29, s2, 19LL);
      get_string(s, v29);                       // string enjoy
      v20 = s[0];
      v33.m128i_i64[0] = &#x26;v34;
      if ( !s[0] )
        std::__throw_logic_error("basic_string: construction from null is not valid");
      v28[0] = strlen(s[0]);
      v21 = v28[0];
      if ( v28[0] > &#x26;byte_9[6] )
      {
        v33.m128i_i64[0] = std::string::_M_create(&#x26;v33, v28, 0LL);
        v23 = v33.m128i_i64[0];
        v34.m128i_i64[0] = v28[0];
      }
      else
      {
        if ( v28[0] == &#x26;dword_0 + 1 )
        {
          v34.m128i_i8[0] = *v20;
LABEL_50:
          v33.m128i_i64[1] = v28[0];
          *(v28[0] + v33.m128i_i64[0]) = 0;
          sub_61D0(a2);
          std::string::_M_dispose(&#x26;v33);
          std::string::_M_dispose(s);
          if ( v29[0] )
            operator delete(v29[0], v30 - v29[0]);
          v22 = fork();
          if ( !v22 )
          {
            close(*a1);
            dup2(a2, 0);
            dup2(a2, 1);
            dup2(a2, 2);
            v38.m128i_i32[0] = 1610612933;
            *s2 = _mm_load_si128(&#x26;xmmword_146C0);
            si128 = _mm_load_si128(&#x26;xmmword_146D0);
            sub_5DA0(v29, s2, 9LL);
            get_string(s, v29);
            v35 = 1610612933;
            v24 = s[0];
            v33 = _mm_load_si128(&#x26;xmmword_146C0);
            v34 = _mm_load_si128(&#x26;xmmword_146D0);
            sub_5DA0(v28, &#x26;v33, 9LL);
            get_string(path, v28);
            execl(path[0], v24, 0LL);
            std::string::_M_dispose(path);
            if ( v28[0] )
              operator delete(v28[0], v28[2] - v28[0]);
            std::string::_M_dispose(s);
            if ( v29[0] )
              operator delete(v29[0], v30 - v29[0]);
            exit(0);
          }
          v11 = 0;
          if ( v22 &#x3C; 0 )
            exit(1);
          goto LABEL_10;
        }
        if ( !v28[0] )
          goto LABEL_50;
        v23 = &#x26;v34;
      }
      memcpy(v23, v20, v21);
      goto LABEL_50;
    }
  }
  else if ( v10 != &#x26;si128 )
  {
    operator delete(v10, si128.m128i_i64[0] + 1);
  }
  v11 = 1;
LABEL_10:
  v12 = splitted_input;
  v13 = (((v4 - splitted_input - 32) >> 5) + 1) &#x26; 3;
  if ( ((((v4 - splitted_input - 32) >> 5) + 1) &#x26; 3) == 0 )
    goto LABEL_69;
  if ( v13 != 1 )
  {
    if ( v13 != 2 )
    {
      if ( *splitted_input != splitted_input + 16 )
        operator delete(*splitted_input, *(splitted_input + 2) + 1LL);
      v12 = splitted_input + 32;
    }
    if ( *v12 != v12 + 16 )
      operator delete(*v12, *(v12 + 2) + 1LL);
    v12 += 32;
  }
  if ( *v12 != v12 + 16 )
    operator delete(*v12, *(v12 + 2) + 1LL);
  v12 += 32;
  if ( v4 != v12 )
  {
LABEL_69:
    do
    {
      if ( *v12 != v12 + 16 )
        operator delete(*v12, *(v12 + 2) + 1LL);
      v14 = *(v12 + 4);
      v15 = v12 + 32;
      if ( v14 != v12 + 48 )
        operator delete(v14, *(v12 + 6) + 1LL);
      v16 = *(v12 + 8);
      if ( v16 != v12 + 80 )
        operator delete(v16, *(v12 + 10) + 1LL);
      v17 = *(v12 + 12);
      if ( v17 != v12 + 112 )
        operator delete(v17, *(v12 + 14) + 1LL);
      v12 += 128;
    }
    while ( v4 != v15 + 96 );
  }
LABEL_31:
  operator delete(splitted_input, v27 - splitted_input);
  return v11;
}
</code></pre>

* Line 84: compare "p455" with first value on splitted input
* Line 91-94: compare second value on splitted input with some character and hash
  * all the hash are available on online database because it only a few character
  * sub\_DEB0 == md5

So basically we can find all the valid values by set breakpoint on all cmp instruction. For example

```
pie b 0x6CE8
pie b 0x6E45
pie b 0x75B7
...
```

During the competition i create gdb script to automate the repetitive task.

```python
#!/usr/bin/python3

class SolverEquation(gdb.Command):
    def __init__ (self):
        super (SolverEquation, self).__init__ ("solve-equation",gdb.COMMAND_OBSCURE)

    def invoke (self, arg, from_tty):
        gdb.execute("pie del")
        
        gdb.execute("set environment OGP=123456")
        gdb.execute("pie b 0x41f1")
        gdb.execute("pie b 0x5175") # anti debug 1
        # gdb.execute("pie b 0x531C") # compare OGP LENGTH
        gdb.execute("pie b 0x41FC") # check success run func_1
        gdb.execute("pie b 0x45f5") # call fork
        gdb.execute("pie b 0x46F3") # call func_3
        gdb.execute("pie b 0xBE09") # anti debug 1
        gdb.execute("pie b 0xBED5") # strlen

        
        gdb.execute("pie run")
        gdb.execute("c")

        gdb.execute("set $al=0x0") # bypass anti debug 1
        gdb.execute("c")

        gdb.execute("c")

        gdb.execute("set follow-fork-mode child")
        gdb.execute("c")
        
def addr2num(addr):
    try:
        return int(addr)  # Python 3
    except:
        return long(addr) # Python 2
SolverEquation()
```

After get the valid input, just send it to the server and got the shell

```python
from pwn import *

# context.log_level = 'debug'
# r = remote("127.0.0.1", 50009)
r = remote("20.80.240.190", 1235)
r.recvuntil(b">> ")

payload = b"p455 eO23410239a3adefing3k0mn00q666\n"
r.send(payload)
r.interactive()
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FQbVGumtwm7G6B9ljGVww%2Fimage.png?alt=media&amp;token=83a2dd83-89dd-4ede-bd55-9770ca78517b" alt=""><figcaption></figcaption></figure>

Flag: AKASEC{Orgalor6\_1n\_d1sgu1s3\_as\_d4em0n\_p3ngu1n}
