# Reverse Engineering

<!-- challenge-index: eb2a97ee1d5de2d8 -->

| Challenge | Topic |
| --- | --- |
| [beginners\_rev\_2023 (189 pts)](#beginners_rev_2023-189-pts) | XOR Shift, Gray Code |
| [T the weakest (215 pts)](#t-the-weakest-215-pts) | GDB Scripting, Control Flow |
| [Conduit (470 pts) UPSOLVE](#conduit-470-pts) | Go, Regex Bytecode |
| [Natural Flag Processing 2 (470 pts) UPSOLVE](#natural-flag-processing-2-470-pts) | Transformer Models, Attention |
| [Nets (500 pts) UPSOLVE](#nets-500-pts) | Reverse Engineering |
| [mimetic\_cycle (500 pts) UPSOLVE](#mimetic_cycle-500-pts) | PowerShell Obfuscation |
| [Frictionless (500 pts) UPSOLVE](#frictionless-500-pts) | Reverse Engineering |

<!-- /challenge-index -->

## beginners\_rev\_2023 (189 pts)

### Description

Let's just deal with them one by one, shall we?

### Solution

Given PE32+ executable, open it using IDA

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FJIWdkzeShcnjXwXQ3dHQ%2Fimage.png?alt=media&amp;token=79c50ceb-31f9-4faf-94f2-59961e1c4f20" alt=""><figcaption></figcaption></figure>

We can see that there are some unknown function such as sub\_140001020 and sub\_140001000. Take a look on each function we can know what is those function do

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FjduIC1tZHOvkXCDX8FXX%2Fimage.png?alt=media&amp;token=072fcb18-1447-4499-9a93-ef5e8d6e3211" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FobiLUYQpkmTkUWenyqd2%2Fimage.png?alt=media&amp;token=71382e90-2fac-4289-adc5-b682b4e7c02e" alt=""><figcaption></figcaption></figure>

To help us carry out static analysis, we rename those function.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fi6MhbghIfRfJmfp4GfJs%2Fimage.png?alt=media&amp;token=20815596-608e-431d-8778-b64d62a2e890" alt=""><figcaption></figcaption></figure>

We can see the program receive our input on line 28 using scanf function, but there is a function that executed before our input received which is sub\_140001480.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fxg7yRXJyxzQ2ionJOAJM%2Fimage.png?alt=media&amp;token=dfeed7ad-0fc6-4745-8001-9dbec8fd9a17" alt=""><figcaption></figcaption></figure>

Function sub\_140001480 is custom function and the result from that function is static.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fn4ZZsiO4gEGln3TIdaSA%2Fimage.png?alt=media&amp;token=7d97f176-69d5-4386-a7e6-e125917f0ab0" alt=""><figcaption><p>Value generated from function sub_140001480 (1)</p></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FKvYHOfGWoDUNqFQ6uB4j%2Fimage.png?alt=media&amp;token=e464b8f4-0f96-4e0d-8a6c-6266c8b0f68d" alt=""><figcaption><p>Value generated from function sub_140001480 (2)</p></figcaption></figure>

So basically we can dump the values and use it for next step without reimplement the function.  After receiving our input, the program processed our input with custom algorithm again.

```c
----SNIPPET----
  v7 = input + 3;
  v8 = 2i64;
  do
  {
    *(v7 - 3) ^= *(v7 - 3) >> 12;
    *(v7 - 2) ^= *(v7 - 2) >> 12;
    *(v7 - 1) ^= *(v7 - 1) >> 12;
    *v7 ^= *v7 >> 12;
    v7[1] ^= v7[1] >> 12;
    v7[2] ^= v7[2] >> 12;
    v7[3] ^= v7[3] >> 12;
    v7[4] ^= v7[4] >> 12;
    v7[5] ^= v7[5] >> 12;
    v7[6] ^= v7[6] >> 12;
    v7[7] ^= v7[7] >> 12;
    v7[8] ^= v7[8] >> 12;
    v7[9] ^= v7[9] >> 12;
    v7[10] ^= v7[10] >> 12;
    v7[11] ^= v7[11] >> 12;
    v7[12] ^= v7[12] >> 12;
    v7[13] ^= v7[13] >> 12;
    v7[14] ^= v7[14] >> 12;
    v7[15] ^= v7[15] >> 12;
    v7[16] ^= v7[16] >> 12;
    v7[17] ^= v7[17] >> 12;
    v7[18] ^= v7[18] >> 12;
    v7[19] ^= v7[19] >> 12;
    v7[20] ^= v7[20] >> 12;
    v9 = v7[21];
    v7 += 32;
    *(v7 - 11) = v9 ^ (v9 >> 12);
    *(v7 - 10) ^= *(v7 - 10) >> 12;
    *(v7 - 9) ^= *(v7 - 9) >> 12;
    *(v7 - 8) ^= *(v7 - 8) >> 12;
    *(v7 - 7) ^= *(v7 - 7) >> 12;
    *(v7 - 6) ^= *(v7 - 6) >> 12;
    *(v7 - 5) ^= *(v7 - 5) >> 12;
    *(v7 - 4) ^= *(v7 - 4) >> 12;
    --v8;
  }
----SNIPPET----
```

So there is little obfuscation regarding the index of input, but we can easily analyze it

```c
v7 = input + 3;

*(v7 - 3) ^= *(v7 - 3) >> 12; // (input + 3 - 3) = input + 0
*(v7 - 2) ^= *(v7 - 2) >> 12; // (input + 3 - 2) = input + 1
*(v7 - 1) ^= *(v7 - 1) >> 12; // (input + 3 - 2) = input + 2
...
v9 = v7[21];
v7 += 32;
*(v7 - 11) = v9 ^ (v9 >> 12); // input + 3 + 32 - 11 = input + 24
*(v7 - 10) ^= *(v7 - 10) >> 12; // input + 3 + 32 - 10 = input + 25
```

So basically it loop from index 0 until index 31 (32 iteration), but since v8 value is 2 so it do iteration for index 0 until index 63 (64 iteration). Here is the implementation on python.

```python
for i in range(0, len(v7), 32):
	for j in range(32):
		v7[i+j] ^= v7[i+j] >> 12
```

&#x20;Next, we take a look on function sub\_1400010E0.

```c
sub_1400010E0(v3, (__int64)v7, (__int64)input, (__int64)Buf1);
```

```c
  LODWORD(v4) = *a1;
  v5 = (_BYTE *)(a4 + 2);
  LODWORD(v6) = a1[1];
  v7 = (_BYTE *)(a3 + 2);
  v8 = a4 - a3;
  v10 = 32i64;
  do
  {
    v11 = (unsigned __int8)(v4 + 1);
    v12 = a1[v11 + 2];
    v13 = (unsigned __int8)(v12 + v6);
    v14 = a1[v13 + 2];
    a1[v11 + 2] = v14;
    a1[v13 + 2] = v12;
    v7[v8 - 2] = *(v7 - 2) ^ LOBYTE(a1[(unsigned __int8)(v12 + v14) + 2]);
    v15 = (unsigned __int8)(v11 + 1);
    v16 = a1[v15 + 2];
    v17 = (unsigned __int8)(v13 + v16);
    v18 = a1[v17 + 2];
    a1[v15 + 2] = v18;
    a1[v17 + 2] = v16;
    *(v5 - 1) = *(v7 - 1) ^ LOBYTE(a1[(unsigned __int8)(v16 + v18) + 2]);
    v19 = (unsigned __int8)(v15 + 1);
    v20 = a1[v19 + 2];
    v21 = (unsigned __int8)(v17 + v20);
    v22 = a1[v21 + 2];
    a1[v19 + 2] = v22;
    a1[v21 + 2] = v20;
    *v5 = *v7 ^ LOBYTE(a1[(unsigned __int8)(v20 + v22) + 2]);
    v23 = (unsigned __int8)(v19 + 1);
    v24 = a1[v23 + 2];
    v25 = (unsigned __int8)(v21 + v24);
    v26 = a1[v25 + 2];
    a1[v23 + 2] = v26;
    a1[v25 + 2] = v24;
    v5[1] = v7[1] ^ LOBYTE(a1[(unsigned __int8)(v24 + v26) + 2]);
    v27 = (unsigned __int8)(v23 + 1);
    v28 = a1[v27 + 2];
    v29 = (unsigned __int8)(v25 + v28);
    v30 = a1[v29 + 2];
    a1[v27 + 2] = v30;
    a1[v29 + 2] = v28;
    v5[2] = v7[2] ^ LOBYTE(a1[(unsigned __int8)(v28 + v30) + 2]);
    v31 = (unsigned __int8)(v27 + 1);
    v32 = a1[v31 + 2];
    v33 = (unsigned __int8)(v29 + v32);
    v34 = a1[v33 + 2];
    a1[v31 + 2] = v34;
    a1[v33 + 2] = v32;
    v5[3] = v7[3] ^ LOBYTE(a1[(unsigned __int8)(v32 + v34) + 2]);
    v35 = (unsigned __int8)(v31 + 1);
    v36 = a1[v35 + 2];
    v37 = (unsigned __int8)(v33 + v36);
    v38 = a1[v37 + 2];
    a1[v35 + 2] = v38;
    a1[v37 + 2] = v36;
    v5[4] = v7[4] ^ LOBYTE(a1[(unsigned __int8)(v36 + v38) + 2]);
    v39 = (unsigned __int8)(v35 + 1);
    v40 = a1[v39 + 2];
    v41 = (unsigned __int8)(v37 + v40);
    v42 = a1[v41 + 2];
    a1[v39 + 2] = v42;
    a1[v41 + 2] = v40;
    v5[5] = v7[5] ^ LOBYTE(a1[(unsigned __int8)(v40 + v42) + 2]);
    v43 = (unsigned __int8)(v39 + 1);
    v44 = a1[v43 + 2];
    v45 = (unsigned __int8)(v41 + v44);
    v46 = a1[v45 + 2];
    a1[v43 + 2] = v46;
    a1[v45 + 2] = v44;
    v5[6] = v7[6] ^ LOBYTE(a1[(unsigned __int8)(v44 + v46) + 2]);
    v47 = (unsigned __int8)(v43 + 1);
    v48 = a1[v47 + 2];
    v49 = (unsigned __int8)(v45 + v48);
    v50 = a1[v49 + 2];
    a1[v47 + 2] = v50;
    a1[v49 + 2] = v48;
    v5[7] = v7[7] ^ LOBYTE(a1[(unsigned __int8)(v48 + v50) + 2]);
    v51 = (unsigned __int8)(v47 + 1);
    v52 = a1[v51 + 2];
    v53 = (unsigned __int8)(v49 + v52);
    v54 = a1[v53 + 2];
    a1[v51 + 2] = v54;
    a1[v53 + 2] = v52;
    v5[8] = v7[8] ^ LOBYTE(a1[(unsigned __int8)(v52 + v54) + 2]);
    v55 = (unsigned __int8)(v51 + 1);
    v56 = a1[v55 + 2];
    v57 = (unsigned __int8)(v53 + v56);
    v58 = a1[v57 + 2];
    a1[v55 + 2] = v58;
    a1[v57 + 2] = v56;
    v5[9] = v7[9] ^ LOBYTE(a1[(unsigned __int8)(v56 + v58) + 2]);
    v59 = (unsigned __int8)(v55 + 1);
    v60 = a1[v59 + 2];
    v61 = (unsigned __int8)(v57 + v60);
    v62 = a1[v61 + 2];
    a1[v59 + 2] = v62;
    v5 += 16;
    a1[v61 + 2] = v60;
    v7 += 16;
    *(v5 - 6) = *(v7 - 6) ^ LOBYTE(a1[(unsigned __int8)(v60 + v62) + 2]);
    v63 = (unsigned __int8)(v59 + 1);
    v64 = a1[v63 + 2];
    v65 = (unsigned __int8)(v61 + v64);
    v66 = a1[v65 + 2];
    a1[v63 + 2] = v66;
    a1[v65 + 2] = v64;
    *(v5 - 5) = *(v7 - 5) ^ LOBYTE(a1[(unsigned __int8)(v64 + v66) + 2]);
    v67 = (unsigned __int8)(v63 + 1);
    v68 = a1[v67 + 2];
    v69 = (unsigned __int8)(v65 + v68);
    v70 = a1[v69 + 2];
    a1[v67 + 2] = v70;
    a1[v69 + 2] = v68;
    *(v5 - 4) = *(v7 - 4) ^ LOBYTE(a1[(unsigned __int8)(v68 + v70) + 2]);
    v4 = (unsigned __int8)(v67 + 1);
    v71 = a1[v4 + 2];
    v6 = (unsigned __int8)(v69 + v71);
    v72 = a1[v6 + 2];
    a1[v4 + 2] = v72;
    a1[v6 + 2] = v71;
    result = *(v7 - 3) ^ LOBYTE(a1[(unsigned __int8)(v71 + v72) + 2]);
    *(v5 - 3) = result;
    --v10;
  }
  while ( v10 );
  a1[1] = v6;
  *a1 = v4;
  return result;
```

The algorithm has pattern, so we just need to deobfuscate the first part then just loop the rest.

```c
// a1 = generated_values from sub_140001480

LODWORD(v4) = *a1; // a1[0] == 0
v5 = (_BYTE *)(a4 + 2); // result_address (stored processed input)
LODWORD(v6) = a1[1]; // a1[1] == 0
v7 = (_BYTE *)(a3 + 2);
v8 = a4 - a3;
v10 = 32i64;
do {  
    v11 = (unsigned __int8)(v4 + 1); // 0 + 1 = 1
    v12 = a1[v11 + 2]; // a1[1+2] = a1[3]
    v13 = (unsigned __int8)(v12 + v6); // a1[3] + 0 = a1[3]
    v14 = a1[v13 + 2]; // a1[a1[3] + 2]
    a1[v11 + 2] = v14; // a1[1] = v14
    a1[v13 + 2] = v12; // a1[a1[3]] = v12
    v7[v8 - 2] = *(v7 - 2) ^ LOBYTE(a1[(unsigned __int8)(v12 + v14) + 2]); // result_address[0] = processed_input[0] ^ a1[a1[3] + a1[a1[3] + 2] + 2]
...
```

To validate the last part (xor part), we can debug the executable and breakpoint on instruction below

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FpPeyrvTkcJiijP6VSRZh%2Fimage.png?alt=media&amp;token=1e830a69-7866-4048-8c95-d6c91a8d9abd" alt=""><figcaption></figcaption></figure>

```nasm
00007FF7293A113C: xor     al, [r11-2]
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FjIJwz5TQAIDTOoG8CDca%2Fimage.png?alt=media&amp;token=c5bf252f-8db7-4580-893c-57390209dcee" alt=""><figcaption></figcaption></figure>

After we know how the algorithm processed our input and static values now we just need to reimplement it on python

```python
def sub_7FF671F610E0(a1, a2):
	v4 = a1[0]
	v6 = a1[1]
	v5 = []
	for i in range(32):
		for j in range(16):
			v4 += 1
			v4 &= 0xff
			v12 = a1[v4+2]
			v6 += v12
			v6 &= 0xff
			v14 = a1[v6+2]
			a1[v4+2] = v14
			a1[v6+2] = v12
			v5.append(a2[i][j] ^ a1[((v12 + v14)&0xff) + 2])
	return v5
```

Back to main function, returned values from sub\_7FF7293A10E0 processed with the same algorithm like previous part.

```c
----SNIPPET----
    *((_QWORD *)v10 - 3) ^= *((_QWORD *)v10 - 3) >> 12;
    *((_QWORD *)v10 - 2) ^= *((_QWORD *)v10 - 2) >> 12;
    *((_QWORD *)v10 - 1) ^= *((_QWORD *)v10 - 1) >> 12;
    *(_QWORD *)v10 ^= *(_QWORD *)v10 >> 12;
    *((_QWORD *)v10 + 1) ^= *((_QWORD *)v10 + 1) >> 12;
    *((_QWORD *)v10 + 2) ^= *((_QWORD *)v10 + 2) >> 12;
    *((_QWORD *)v10 + 3) ^= *((_QWORD *)v10 + 3) >> 12;
    *((_QWORD *)v10 + 4) ^= *((_QWORD *)v10 + 4) >> 12;
    *((_QWORD *)v10 + 5) ^= *((_QWORD *)v10 + 5) >> 12;
    *((_QWORD *)v10 + 6) ^= *((_QWORD *)v10 + 6) >> 12;
    *((_QWORD *)v10 + 7) ^= *((_QWORD *)v10 + 7) >> 12;
    *((_QWORD *)v10 + 8) ^= *((_QWORD *)v10 + 8) >> 12;
    *((_QWORD *)v10 + 9) ^= *((_QWORD *)v10 + 9) >> 12;
    *((_QWORD *)v10 + 10) ^= *((_QWORD *)v10 + 10) >> 12;
    *((_QWORD *)v10 + 11) ^= *((_QWORD *)v10 + 11) >> 12;
    *((_QWORD *)v10 + 12) ^= *((_QWORD *)v10 + 12) >> 12;
----SNIPPET----
```

Since we've reimplement it on python we can reuse the code. Here is the final script to implement the whole algorithm.

```python
from Crypto.Util.number import *
import string

def print_hex(inp):
	arr = []
	for i in inp:
		arr.append(hex(i))
	print(arr)

def make_block(inp):
	blocks = []
	for i in range(0, len(inp), 8):
		blocks.append(bytes_to_long(inp[i:i+8]))
	return blocks

def make_byte(inp):
	arr = []
	for i in range(len(inp)):
		tmp = long_to_bytes(inp[i])[::-1]
		for j in range(len(tmp)):
			arr.append(tmp[j])
	return arr

def combine_16(inp):
	arr = []
	for i in range(0, len(inp), 2):
		tmp = long_to_bytes(inp[i])[::-1]
		tmp += long_to_bytes(inp[i+1])[::-1]
		arr.append(tmp)
	return arr

def combine_8(inp):
	arr = []
	for i in range(0, len(inp), 8):
		arr.append(bytes_to_long(bytes(inp[i:i+8])[::-1]))
	return arr

def sub_7FF671F610E0(a1, a2):
	v4 = a1[0]
	v6 = a1[1]
	v5 = []
	for i in range(32):
		for j in range(16):
			v4 += 1
			v4 &= 0xff
			v12 = a1[v4+2]
			v6 += v12
			v6 &= 0xff
			v14 = a1[v6+2]
			a1[v4+2] = v14
			a1[v6+2] = v12
			v5.append(a2[i][j] ^ a1[((v12 + v14)&0xff) + 2])
	return v5

dk = [0x0,0x0,0x32,0x63,0x4F,0x6A,0x61,0x0B,0x0D7,0x31,0x76,0x29,0x0C,0x69,0x21,0x93,0x1C,0x2B,0x0E9,0x0B6,0x0AA,0x3C,0x0CA,0x7,0x9B,0x54,0x58,0x6,0x0ED,0x96,0x89,0x0C7,0x0F9,0x66,0x0B8,0x92,0x82,0x17,0x19,0x1D,0x0A9,0x30,0x0FC,0x0E4,0x0F7,0x33,0x5C,0x0BB,0x8C,0x7A,0x0DD,0x38,0x48,0x0CD,0x1,0x1B,0x0B3,0x0DE,0x0,0x15,0x0CE,0x43,0x3,0x7E,0x36,0x7D,0x23,0x73,0x6B,0x0B1,0x46,0x52,0x59,0x3D,0x7F,0x5B,0x78,0x9F,0x85,0x4A,0x20,0x97,0x9A,0x1F,0x77,0x0AB,0x28,0x72,0x0CB,0x81,0x0CC,0x0EB,0x0D2,0x0B9,0x2D,0x12,0x13,0x0C0,0x0A6,0x25,0x71,0x0A,0x88,0x9E,0x37,0x22,0x24,0x47,0x42,0x0A5,0x0FA,0x2A,0x53,0x8A,0x6C,0x99,0x9,0x0E3,0x0EF,0x0EC,0x0E0,0x0A0,0x51,0x0F3,0x1E,0x4,0x8F,0x0E7,0x2,0x0A1,0x90,0x60,0x0A4,0x0AD,0x0FD,0x5F,0x79,0x44,0x6E,0x39,0x34,0x4C,0x0A3,0x0D4,0x74,0x0B4,0x9C,0x8E,0x83,0x0E6,0x4E,0x0D5,0x3A,0x0F1,0x0BE,0x6D,0x5,0x0BA,0x84,0x0B2,0x87,0x10,0x0F4,0x0BC,0x0D8,0x0FE,0x0AE,0x0BD,0x7C,0x0C3,0x0E8,0x0E5,0x4B,0x0C9,0x2C,0x0B5,0x3F,0x4D,0x50,0x0BF,0x8D,0x45,0x0C8,0x18,0x0F0,0x0DA,0x8B,0x0DB,0x0C4,0x16,0x8,0x0F,0x62,0x0D6,0x91,0x1A,0x0A8,0x9D,0x0D1,0x98,0x86,0x67,0x0C5,0x68,0x0C6,0x35,0x0AF,0x0EA,0x0F8,0x0C2,0x0D0,0x56,0x94,0x40,0x0FF,0x26,0x65,0x2E,0x0D9,0x49,0x57,0x5D,0x0AC,0x0A2,0x0B0,0x0D,0x0F6,0x0C1,0x0EE,0x0FB,0x55,0x6F,0x0A7,0x0DC,0x75,0x0E,0x64,0x14,0x0DF,0x95,0x0CF,0x3E,0x0F2,0x0F5,0x41,0x0D3,0x0E2,0x0B7,0x80,0x3B,0x27,0x7B,0x5E,0x0E1,0x2F,0x5A,0x70,0x11,0x0ABABABAB,0x0ABABABAB,0x0ABABABAB,0x0ABABABAB,0x0FEEEFEEE,0x0FEEEFEEE,0x0,0x0,0x0,0x0]
cmp_val = [  0x07, 0x56, 0xE5, 0x58, 0x71, 0x89, 0x9A, 0xCA, 0xF0, 0x67, 
  0x03, 0x2D, 0x49, 0xFB, 0x6E, 0x86, 0xC2, 0xF7, 0x48, 0xCA, 
  0x3C, 0x43, 0xDB, 0x8E, 0x04, 0x2A, 0x56, 0x4A, 0x97, 0x33, 
  0xA1, 0xA2, 0x07, 0x83, 0xF0, 0x89, 0x19, 0x13, 0x77, 0xB4, 
  0x9F, 0x7D, 0x7B, 0x9C, 0xDD, 0x8E, 0xFD, 0xAD, 0xB5, 0xE2, 
  0x28, 0x0E, 0x06, 0xAF, 0xE5, 0xE3, 0x86, 0xC3, 0x08, 0xAD, 
  0xE6, 0x4C, 0xDE, 0x63, 0xA3, 0x5F, 0x1E, 0x96, 0x34, 0x7D, 
  0x9D, 0x19, 0xF5, 0xC8, 0x84, 0x7F, 0x7B, 0x62, 0x2A, 0x6B, 
  0xC1, 0x28, 0x3B, 0x6D, 0x09, 0xEF, 0xFC, 0xCB, 0xA0, 0x90, 
  0x9A, 0x3E, 0x66, 0xA2, 0x4E, 0x06, 0x90, 0x2C, 0x9D, 0xAE, 
  0x3C, 0x99, 0x40, 0x53, 0x4C, 0x69, 0x63, 0xE7, 0xB9, 0xA8, 
  0xB3, 0x87, 0xA5, 0x97, 0x98, 0xFE, 0x1F, 0x20, 0x51, 0xA7, 
  0xAE, 0x0D, 0x00, 0xAB, 0x16, 0x35, 0x59, 0x3D, 0x08, 0x1B, 
  0x1C, 0x92, 0xE2, 0x4F, 0x1D, 0x86, 0xA5, 0x6E, 0x0A, 0x14, 
  0x45, 0x4D, 0x61, 0x08, 0x69, 0xC3, 0x12, 0xA2, 0xEB, 0x50, 
  0x13, 0x93, 0x22, 0xE2, 0xC4, 0x10, 0xCA, 0x5F, 0xB2, 0x0B, 
  0xA2, 0x30, 0xC8, 0x54, 0x91, 0x3A, 0x37, 0xFD, 0xD2, 0x10, 
  0xAB, 0x5A, 0xF8, 0x38, 0xF3, 0xD3, 0xD5, 0x85, 0x58, 0xDE, 
  0xDF, 0xC0, 0xF4, 0x17, 0x4E, 0xF7, 0x31, 0x79, 0xDD, 0x41, 
  0x2F, 0xB3, 0x20, 0xC7, 0xEC, 0x98, 0x5E, 0xAE, 0xF7, 0xA9, 
  0xCB, 0x27, 0x13, 0x72, 0xFE, 0xCA, 0x64, 0xFF, 0x43, 0x93, 
  0x80, 0x3E, 0x1E, 0xE5, 0x99, 0xBF, 0x41, 0x4B, 0x9D, 0x85, 
  0x4E, 0x0F, 0x99, 0x94, 0x57, 0xE1, 0x63, 0xD9, 0x01, 0x85, 
  0x78, 0x8A, 0x06, 0xFE, 0x9D, 0x41, 0x32, 0x74, 0x55, 0x83, 
  0xB2, 0x85, 0xE9, 0x9F, 0xC6, 0x2C, 0x4B, 0x62, 0x8F, 0xBF, 
  0x7D, 0x57, 0xC8, 0x76, 0x3B, 0x31, 0x5E, 0x87, 0x60, 0x89, 
  0x35, 0x41, 0xC1, 0x52, 0x6C, 0xD0, 0x0B, 0x7D, 0xCA, 0x60, 
  0x5D, 0x82, 0x19, 0xB0, 0x96, 0x5E, 0x16, 0xE7, 0x9B, 0x2F, 
  0x37, 0x5F, 0xC9, 0xC5, 0xF3, 0x20, 0xC3, 0x45, 0xCB, 0x47, 
  0xA1, 0xCC, 0x79, 0xE5, 0xB6, 0xFB, 0xD4, 0x55, 0xDB, 0xC1, 
  0x35, 0x9B, 0x8B, 0xFA, 0x38, 0xD5, 0xB2, 0xB5, 0xE0, 0x4F, 
  0x4D, 0x6C, 0x4F, 0x8C, 0x0C, 0x42, 0xBC, 0x8E, 0xB3, 0x78, 
  0x48, 0xE4, 0x87, 0x8E, 0x34, 0xA3, 0x1D, 0x01, 0x53, 0x98, 
  0x71, 0xFA, 0x8F, 0x2F, 0xE3, 0x7A, 0x6B, 0xB9, 0x1B, 0xB6, 
  0x7E, 0x34, 0x7F, 0xC8, 0xC4, 0x6C, 0xAB, 0x45, 0x4D, 0x81, 
  0xEF, 0xEE, 0xC3, 0xD9, 0xDB, 0x13, 0x5B, 0x63, 0x90, 0xFC, 
  0x34, 0x18, 0x81, 0xBC, 0xD1, 0x18, 0x48, 0xBB, 0x7C, 0x24, 
  0x5B, 0x56, 0x2B, 0x35, 0x6B, 0xD7, 0xF9, 0xD3, 0xD5, 0x2B, 
  0xE2, 0x24, 0xD8, 0x50, 0xF1, 0xEC, 0xD5, 0xE6, 0x29, 0x55, 
  0x66, 0xF2, 0xF7, 0x28, 0x20, 0x7D, 0xF3, 0x47, 0x40, 0x03, 
  0x11, 0x4A, 0x47, 0xA5, 0xB4, 0x74, 0x15, 0x35, 0xD0, 0xF0, 
  0xE5, 0x4C, 0x04, 0xB5, 0x59, 0xFE, 0xFC, 0x45, 0x9D, 0x3A, 
  0xA1, 0x3F, 0x1A, 0xA7, 0xA8, 0x51, 0xE5, 0x65, 0xF1, 0x56, 
  0xEE, 0xDE, 0xFC, 0xC4, 0x87, 0xF5, 0xFA, 0x79, 0x31, 0x07, 
  0x0A, 0x3F, 0x41, 0x28, 0xD1, 0x59, 0x17, 0x4D, 0x02, 0xE4, 
  0x5A, 0x22, 0x3A, 0xBC, 0xD2, 0xCD, 0x80, 0xBC, 0x2A, 0x49, 
  0xF0, 0x7F, 0x97, 0xA1, 0x90, 0x59, 0x01, 0x8D, 0x25, 0x43, 
  0xD8, 0x00, 0xEA, 0xD8, 0x4F, 0xE2, 0x4E, 0x2B, 0x06, 0xFD, 
  0x7E, 0x16, 0xA9, 0x92, 0xC4, 0xFD, 0xB5, 0x6A, 0x82, 0x06, 
  0x18, 0x0C, 0x0A, 0xB7, 0xB8, 0x29, 0x8F, 0x87, 0x63, 0x65, 
  0x25, 0xB9, 0x7A, 0xD0, 0x6E, 0x30, 0x3C, 0xF2, 0xF7, 0xC2, 
  0x30, 0x86]

inp = b""
for i in string.printable[:64]:
	inp += (i*8).encode()

print(inp)
v7 = make_block(inp)

for i in range(0, len(v7), 32):
	for j in range(32):
		v7[i+j] ^= v7[i+j] >> 12

v7_16 = combine_16(v7)
v10 = sub_7FF671F610E0(dk, v7_16)
v10_8 = combine_8(v10)
for i in range(0, len(v10_8), 32):
	for j in range(32):
		v10_8[i+j] ^= v10_8[i+j] >> 12

res = make_byte(v10_8)

print_hex(res)
```

Now, we assume that those algorhtm encrypt our input. So the next step we do is figuring out how to implement the decryption routine.&#x20;

* sub\_7FF671F610E0&#x20;
  * Encryption routine : xor processed input (a2) with static values (a1/SBOX)
  * Decyption routine : xor processed input (a2) with static values (a1/SBOX)
* Xor shift part
  * Encryption routine : the algorithm looks like grey code but with shift 12
  * Decryption routine : implement rev grey code with shift 12 (<https://github.com/hellman/libnum/blob/master/libnum/stuff.py#L10>)

Last step just implement decryption routine with above information then decrypt ciphertext of flag. Here is the implementation in python.

```python
from Crypto.Util.number import *
import string

def print_hex(inp):
	arr = []
	for i in inp:
		arr.append(hex(i))
	print(arr)

def make_block(inp):
	blocks = []
	for i in range(0, len(inp), 8):
		blocks.append(bytes_to_long(inp[i:i+8]))
	return blocks

def make_byte(inp):
	arr = []
	for i in range(len(inp)):
		tmp = long_to_bytes(inp[i])[::-1]
		for j in range(len(tmp)):
			arr.append(tmp[j])
	return arr

def combine_16(inp):
	arr = []
	for i in range(0, len(inp), 2):
		tmp = long_to_bytes(inp[i]).rjust(8, b"\x00")[::-1]
		tmp += long_to_bytes(inp[i+1]).rjust(8, b"\x00")[::-1]
		arr.append(tmp)
	return arr

def combine_8(inp):
	arr = []
	for i in range(0, len(inp), 8):
		arr.append(bytes_to_long(bytes(inp[i:i+8])[::-1]))
	return arr

def sub_7FF671F610E0(a1, a2):
	v4 = a1[0]
	v6 = a1[1]
	v5 = []
	for i in range(32):
		for j in range(16):
			v4 += 1
			v4 &= 0xff
			v12 = a1[v4+2]
			v6 += v12
			v6 &= 0xff
			v14 = a1[v6+2]
			a1[v4+2] = v14
			a1[v6+2] = v12
			v5.append(a2[i][j] ^ a1[((v12 + v14)&0xff) + 2])
	return v5

def rev_shift(g):
    n = 0
    while g:
        n ^= g
        g >>= 12
    return n

res = [  0x07, 0x56, 0xE5, 0x58, 0x71, 0x89, 0x9A, 0xCA, 0xF0, 0x67, 
  0x03, 0x2D, 0x49, 0xFB, 0x6E, 0x86, 0xC2, 0xF7, 0x48, 0xCA, 
  0x3C, 0x43, 0xDB, 0x8E, 0x04, 0x2A, 0x56, 0x4A, 0x97, 0x33, 
  0xA1, 0xA2, 0x07, 0x83, 0xF0, 0x89, 0x19, 0x13, 0x77, 0xB4, 
  0x9F, 0x7D, 0x7B, 0x9C, 0xDD, 0x8E, 0xFD, 0xAD, 0xB5, 0xE2, 
  0x28, 0x0E, 0x06, 0xAF, 0xE5, 0xE3, 0x86, 0xC3, 0x08, 0xAD, 
  0xE6, 0x4C, 0xDE, 0x63, 0xA3, 0x5F, 0x1E, 0x96, 0x34, 0x7D, 
  0x9D, 0x19, 0xF5, 0xC8, 0x84, 0x7F, 0x7B, 0x62, 0x2A, 0x6B, 
  0xC1, 0x28, 0x3B, 0x6D, 0x09, 0xEF, 0xFC, 0xCB, 0xA0, 0x90, 
  0x9A, 0x3E, 0x66, 0xA2, 0x4E, 0x06, 0x90, 0x2C, 0x9D, 0xAE, 
  0x3C, 0x99, 0x40, 0x53, 0x4C, 0x69, 0x63, 0xE7, 0xB9, 0xA8, 
  0xB3, 0x87, 0xA5, 0x97, 0x98, 0xFE, 0x1F, 0x20, 0x51, 0xA7, 
  0xAE, 0x0D, 0x00, 0xAB, 0x16, 0x35, 0x59, 0x3D, 0x08, 0x1B, 
  0x1C, 0x92, 0xE2, 0x4F, 0x1D, 0x86, 0xA5, 0x6E, 0x0A, 0x14, 
  0x45, 0x4D, 0x61, 0x08, 0x69, 0xC3, 0x12, 0xA2, 0xEB, 0x50, 
  0x13, 0x93, 0x22, 0xE2, 0xC4, 0x10, 0xCA, 0x5F, 0xB2, 0x0B, 
  0xA2, 0x30, 0xC8, 0x54, 0x91, 0x3A, 0x37, 0xFD, 0xD2, 0x10, 
  0xAB, 0x5A, 0xF8, 0x38, 0xF3, 0xD3, 0xD5, 0x85, 0x58, 0xDE, 
  0xDF, 0xC0, 0xF4, 0x17, 0x4E, 0xF7, 0x31, 0x79, 0xDD, 0x41, 
  0x2F, 0xB3, 0x20, 0xC7, 0xEC, 0x98, 0x5E, 0xAE, 0xF7, 0xA9, 
  0xCB, 0x27, 0x13, 0x72, 0xFE, 0xCA, 0x64, 0xFF, 0x43, 0x93, 
  0x80, 0x3E, 0x1E, 0xE5, 0x99, 0xBF, 0x41, 0x4B, 0x9D, 0x85, 
  0x4E, 0x0F, 0x99, 0x94, 0x57, 0xE1, 0x63, 0xD9, 0x01, 0x85, 
  0x78, 0x8A, 0x06, 0xFE, 0x9D, 0x41, 0x32, 0x74, 0x55, 0x83, 
  0xB2, 0x85, 0xE9, 0x9F, 0xC6, 0x2C, 0x4B, 0x62, 0x8F, 0xBF, 
  0x7D, 0x57, 0xC8, 0x76, 0x3B, 0x31, 0x5E, 0x87, 0x60, 0x89, 
  0x35, 0x41, 0xC1, 0x52, 0x6C, 0xD0, 0x0B, 0x7D, 0xCA, 0x60, 
  0x5D, 0x82, 0x19, 0xB0, 0x96, 0x5E, 0x16, 0xE7, 0x9B, 0x2F, 
  0x37, 0x5F, 0xC9, 0xC5, 0xF3, 0x20, 0xC3, 0x45, 0xCB, 0x47, 
  0xA1, 0xCC, 0x79, 0xE5, 0xB6, 0xFB, 0xD4, 0x55, 0xDB, 0xC1, 
  0x35, 0x9B, 0x8B, 0xFA, 0x38, 0xD5, 0xB2, 0xB5, 0xE0, 0x4F, 
  0x4D, 0x6C, 0x4F, 0x8C, 0x0C, 0x42, 0xBC, 0x8E, 0xB3, 0x78, 
  0x48, 0xE4, 0x87, 0x8E, 0x34, 0xA3, 0x1D, 0x01, 0x53, 0x98, 
  0x71, 0xFA, 0x8F, 0x2F, 0xE3, 0x7A, 0x6B, 0xB9, 0x1B, 0xB6, 
  0x7E, 0x34, 0x7F, 0xC8, 0xC4, 0x6C, 0xAB, 0x45, 0x4D, 0x81, 
  0xEF, 0xEE, 0xC3, 0xD9, 0xDB, 0x13, 0x5B, 0x63, 0x90, 0xFC, 
  0x34, 0x18, 0x81, 0xBC, 0xD1, 0x18, 0x48, 0xBB, 0x7C, 0x24, 
  0x5B, 0x56, 0x2B, 0x35, 0x6B, 0xD7, 0xF9, 0xD3, 0xD5, 0x2B, 
  0xE2, 0x24, 0xD8, 0x50, 0xF1, 0xEC, 0xD5, 0xE6, 0x29, 0x55, 
  0x66, 0xF2, 0xF7, 0x28, 0x20, 0x7D, 0xF3, 0x47, 0x40, 0x03, 
  0x11, 0x4A, 0x47, 0xA5, 0xB4, 0x74, 0x15, 0x35, 0xD0, 0xF0, 
  0xE5, 0x4C, 0x04, 0xB5, 0x59, 0xFE, 0xFC, 0x45, 0x9D, 0x3A, 
  0xA1, 0x3F, 0x1A, 0xA7, 0xA8, 0x51, 0xE5, 0x65, 0xF1, 0x56, 
  0xEE, 0xDE, 0xFC, 0xC4, 0x87, 0xF5, 0xFA, 0x79, 0x31, 0x07, 
  0x0A, 0x3F, 0x41, 0x28, 0xD1, 0x59, 0x17, 0x4D, 0x02, 0xE4, 
  0x5A, 0x22, 0x3A, 0xBC, 0xD2, 0xCD, 0x80, 0xBC, 0x2A, 0x49, 
  0xF0, 0x7F, 0x97, 0xA1, 0x90, 0x59, 0x01, 0x8D, 0x25, 0x43, 
  0xD8, 0x00, 0xEA, 0xD8, 0x4F, 0xE2, 0x4E, 0x2B, 0x06, 0xFD, 
  0x7E, 0x16, 0xA9, 0x92, 0xC4, 0xFD, 0xB5, 0x6A, 0x82, 0x06, 
  0x18, 0x0C, 0x0A, 0xB7, 0xB8, 0x29, 0x8F, 0x87, 0x63, 0x65, 
  0x25, 0xB9, 0x7A, 0xD0, 0x6E, 0x30, 0x3C, 0xF2, 0xF7, 0xC2, 
  0x30, 0x86]

print(len(res))

v10_8 = combine_8(res)

for i in range(0, len(v10_8),  32):
	for j in range(31, -1, -1):
		v10_8[i+j] = rev_shift(v10_8[i+j])

v10 = combine_16(v10_8)
dk = [0x0,0x0,0x32,0x63,0x4F,0x6A,0x61,0x0B,0x0D7,0x31,0x76,0x29,0x0C,0x69,0x21,0x93,0x1C,0x2B,0x0E9,0x0B6,0x0AA,0x3C,0x0CA,0x7,0x9B,0x54,0x58,0x6,0x0ED,0x96,0x89,0x0C7,0x0F9,0x66,0x0B8,0x92,0x82,0x17,0x19,0x1D,0x0A9,0x30,0x0FC,0x0E4,0x0F7,0x33,0x5C,0x0BB,0x8C,0x7A,0x0DD,0x38,0x48,0x0CD,0x1,0x1B,0x0B3,0x0DE,0x0,0x15,0x0CE,0x43,0x3,0x7E,0x36,0x7D,0x23,0x73,0x6B,0x0B1,0x46,0x52,0x59,0x3D,0x7F,0x5B,0x78,0x9F,0x85,0x4A,0x20,0x97,0x9A,0x1F,0x77,0x0AB,0x28,0x72,0x0CB,0x81,0x0CC,0x0EB,0x0D2,0x0B9,0x2D,0x12,0x13,0x0C0,0x0A6,0x25,0x71,0x0A,0x88,0x9E,0x37,0x22,0x24,0x47,0x42,0x0A5,0x0FA,0x2A,0x53,0x8A,0x6C,0x99,0x9,0x0E3,0x0EF,0x0EC,0x0E0,0x0A0,0x51,0x0F3,0x1E,0x4,0x8F,0x0E7,0x2,0x0A1,0x90,0x60,0x0A4,0x0AD,0x0FD,0x5F,0x79,0x44,0x6E,0x39,0x34,0x4C,0x0A3,0x0D4,0x74,0x0B4,0x9C,0x8E,0x83,0x0E6,0x4E,0x0D5,0x3A,0x0F1,0x0BE,0x6D,0x5,0x0BA,0x84,0x0B2,0x87,0x10,0x0F4,0x0BC,0x0D8,0x0FE,0x0AE,0x0BD,0x7C,0x0C3,0x0E8,0x0E5,0x4B,0x0C9,0x2C,0x0B5,0x3F,0x4D,0x50,0x0BF,0x8D,0x45,0x0C8,0x18,0x0F0,0x0DA,0x8B,0x0DB,0x0C4,0x16,0x8,0x0F,0x62,0x0D6,0x91,0x1A,0x0A8,0x9D,0x0D1,0x98,0x86,0x67,0x0C5,0x68,0x0C6,0x35,0x0AF,0x0EA,0x0F8,0x0C2,0x0D0,0x56,0x94,0x40,0x0FF,0x26,0x65,0x2E,0x0D9,0x49,0x57,0x5D,0x0AC,0x0A2,0x0B0,0x0D,0x0F6,0x0C1,0x0EE,0x0FB,0x55,0x6F,0x0A7,0x0DC,0x75,0x0E,0x64,0x14,0x0DF,0x95,0x0CF,0x3E,0x0F2,0x0F5,0x41,0x0D3,0x0E2,0x0B7,0x80,0x3B,0x27,0x7B,0x5E,0x0E1,0x2F,0x5A,0x70,0x11,0x0ABABABAB,0x0ABABABAB,0x0ABABABAB,0x0ABABABAB,0x0FEEEFEEE,0x0FEEEFEEE,0x0,0x0,0x0,0x0]
v7_16 = sub_7FF671F610E0(dk, v10)
v7 = combine_8(v7_16)

for i in range(0, len(v7),  32):
	for j in range(31, -1, -1):
		v7[i+j] = rev_shift(v7[i+j])

print(bytes(make_byte(v7)))
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FPewHMVvVH0MF4ssH6hAV%2Fimage.png?alt=media&amp;token=6b496950-e53e-47e6-9105-f6e1f6d7444d" alt=""><figcaption></figcaption></figure>

Flag : TSGCTF{y0u\_w0uld\_und3r57and\_h0w\_70\_d3cryp7\_arc4\_and\_h0w\_70\_d3cryp7\_7h3\_l3ak3d\_5af3\_l1nk1ng\_p01n73r}

## T the weakest (215 pts)

### Description

T「AHHHHHH!」 S「LOOKS LIKE T IS DEFEATED」 G「HEH. HE'S ALWAYS THE WEAKEST OF THE BIG ONE HUNDRED.」 C「LOSING TO A MERE MORTAL. WHAT A DISGRANCE TO TSG-ER.」

### Solution

Given ELF 64 bit, open it using IDA

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FWs2xg4yHctcup2pW8C8u%2Fimage.png?alt=media&amp;token=1b954fac-57a2-4645-8d08-2d4d431bdfca" alt=""><figcaption></figcaption></figure>

So IDA cant decompile it and when i try to edit the stack IDA still cant decompile it. Next, i try to open it using ghidra. Looking at start function, we found the main address which is LAB\_001010a0.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FHquzWYQkJmWhWtMXhTR9%2Fimage.png?alt=media&amp;token=8c0e1844-9b99-42db-ae61-9d90a64917cc" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FVBwHS5WayEWElwFV1lqo%2Fimage.png?alt=media&amp;token=b31f733d-8aa8-4557-9a4d-60e3339de158" alt=""><figcaption><p>FUN_001010a0</p></figcaption></figure>

From pseudocode we can see the big picture of the program but there still some part that easier to analyze on assembly part. Here is the big picture of the whole executable

* FUN\_00101255(), print "ng" then exit
  \*

  ```
  <figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FPESs5tLYa6UhaUKWSIhB%2Fimage.png?alt=media&amp;token=88fe63b6-026f-4a75-88ed-f12f8022710f" alt=""><figcaption></figcaption></figure>
  ```
* If there is no argument provided, the program will exit by calling FUN\_00101255
  \*

  ```
  <figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FdDpIHHLclk3jYPzkObCh%2Fimage.png?alt=media&amp;token=13d06588-1974-4298-a5ce-60954fcec8b0" alt=""><figcaption></figcaption></figure>
  ```
* If argv\[1] (first argument) is not "T" the program will exit by calling FUN\_00101255.
  \*

  ```
  <figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FAUF1u8X65aoOVkGk1YFu%2Fimage.png?alt=media&amp;token=8be92282-ed98-4f7b-a9b2-42b09d39d925" alt=""><figcaption></figcaption></figure>
  ```
* Program will call memfd\_create using syscall then write data to it. After write done, execute the written data on fd/x using execv function with the next byte of our first argument (argv\[1] + 1).
  \*

  ```
  <figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FIr3pswn5yNhazFAr9gXY%2Fimage.png?alt=media&amp;token=bbb2b57c-3cbc-462b-9408-a1857a1ed333" alt=""><figcaption></figcaption></figure>
  ```

From above information, i tried to implement automation using gdb scripting. In this case i try to implement flow below automatically with my script.

* Check the main address is correct by analyzing the first instruction
* Set pie breakpoint and delete pie breakpoint
* If input is correct, it will call write function that has known pattern in assembly. So dump the new executable if it call write function then move to new executable.
  \*

  ```
  <figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FsiBSnUHFEb4qsle9S0gO%2Fimage.png?alt=media&amp;token=7b97ceeb-af5c-4e0e-8f4c-2658a0eb1908" alt=""><figcaption></figcaption></figure>
  ```
* Check if char has been found or not, if char not found so there is something different with the new executable

```python
#!/usr/bin/python3
import string
import os

class SolverEquation(gdb.Command):
    def __init__ (self):
        super (SolverEquation, self).__init__ ("solve-equation",gdb.COMMAND_OBSCURE)
    
    def invoke (self, arg, from_tty):
        flag = ""
        list_chr = '_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ{}'
        poss_main = ["0x10a0"]
        cnt = 0
        while "}" not in flag:
            i = len(flag)
            os.system(f"chmod +x t{i}")
            base_main = poss_main[cnt%len(poss_main)]
            print(f"base_main: {base_main}")
            
            for z in list_chr:
                inp = flag + z
                gdb.execute("del")
                gdb.execute("pie del")
                gdb.execute(f"pie b {base_main}")
                
                gdb.execute(f"file t{i}")
                gdb.execute(f"pie run {inp[i]}")
                
                try:
                    arch = gdb.selected_frame().architecture()
                except Exception as e:
                    break

                current_pc = addr2num(gdb.selected_frame().read_register("pc"))
                disa = arch.disassemble(current_pc)[0]

                if("push" in disa["asm"]):
                    tmp = gdb.execute("x/150i $pc", to_string=True)
                    dict = parse_and_break(tmp)
                
                    print(i, inp)
                    gdb.execute("c")

                    try:
                        rip = addr2num(gdb.selected_frame().read_register("pc"))
                        flag = inp
                        gdb.execute(f"dump binary memory t{i+1} $rsi $rsi+$rdx")
                        gdb.execute("pie run")
                        break
                    except Exception as e:
                        gdb.execute("pie run")
                        continue
                else:
                    gdb.execute("pie run")
                    break
            if(len(flag) == i):
                print("Something different")
                break
            cnt += 1
            print("flag", i, flag)

def parse_and_break(a1):
    zz = a1.split("\n")[:-1]
    dict = {}
    for i in range(3, len(zz)):
        tmp4 = zz[i-3].split(":\t")
        tmp3 = zz[i-2].split(":\t")
        tmp2 = zz[i-1].split(":\t")
        tmp = zz[i].split(":\t")
        if(("mov    rbx,rax" == tmp3[1] or "mov    rbp,rax" == tmp3[1]) and "mov    edi,eax" == tmp2[1] and "call" in tmp[1]):
            dict["rip"] = tmp[0][-14:]
            gdb.execute(f"b *{tmp[0][-14:]}")

    return dict

        
def addr2num(addr):
    try:
        return int(addr)  # Python 3
    except:
        return long(addr) # Python 2

SolverEquation()
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FV9x6sQjk3iIiquiKTGvz%2Fimage.png?alt=media&amp;token=7a08e766-934a-4c7e-ba6f-1d2c6c907e83" alt=""><figcaption></figcaption></figure>

Last flag we got is TSGCTF{hint\_do\_script, so check the newest executable then decompile it using ghidra.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FmVV6gnWRP94F6B296tNa%2Fimage.png?alt=media&amp;token=b362aaed-12c7-455d-b356-06d4ab289625" alt=""><figcaption></figcaption></figure>

main function on t21 is on address 001010b0.&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FLaOXtytkYuTMnChIIkny%2Fimage.png?alt=media&amp;token=25174871-919c-464f-9385-81ddb8eeb0a8" alt=""><figcaption></figcaption></figure>

t21 check environment variable LINES and COLUMNS, if there is environment variable LINES and COLUMNS it will automatically exit the program by calling FUN\_0010285 function. So to bypass this validation we need to add unset environment command in our automation script. Besides that we need to add address 0x001010b0 in list of main function. Here is the modified script

```python
#!/usr/bin/python3
import string
import os

class SolverEquation(gdb.Command):
    def __init__ (self):
        super (SolverEquation, self).__init__ ("solve-equation",gdb.COMMAND_OBSCURE)
    
    def invoke (self, arg, from_tty):
        flag = "TSGCTF{hint_do_script"
        list_chr = '_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ{}'
        poss_main = ["0x10a0", "0x10b0"]
        cnt = 0
        while "}" not in flag:
            i = len(flag)
            os.system(f"chmod +x t{i}")
            base_main = poss_main[cnt%len(poss_main)]
            print(f"base_main: {base_main}")
            
            for z in list_chr:
                inp = flag + z
                gdb.execute("del")
                gdb.execute("pie del")
                gdb.execute(f"pie b {base_main}")
                gdb.execute("unset environment LINES")
                gdb.execute("unset environment COLUMNS")
                
                gdb.execute(f"file t{i}")
                gdb.execute(f"pie run {inp[i]}")
                
                try:
                    arch = gdb.selected_frame().architecture()
                except Exception as e:
                    break

                current_pc = addr2num(gdb.selected_frame().read_register("pc"))
                disa = arch.disassemble(current_pc)[0]

                if("push" in disa["asm"]):
                    tmp = gdb.execute("x/150i $pc", to_string=True)
                    dict = parse_and_break(tmp)
                
                    print(i, inp)
                    gdb.execute("c")

                    try:
                        rip = addr2num(gdb.selected_frame().read_register("pc"))
                        flag = inp
                        gdb.execute(f"dump binary memory t{i+1} $rsi $rsi+$rdx")
                        gdb.execute("pie run")
                        break
                    except Exception as e:
                        gdb.execute("pie run")
                        continue
                else:
                    gdb.execute("pie run")
                    break
            
            print("flag", i, flag)
            
            if(len(flag) == i):
                cnt += 1
                if(cnt == len(poss_main)):
                    print("Something different")
                    break
            else:
                cnt = 0

def parse_and_break(a1):
    zz = a1.split("\n")[:-1]
    dict = {}
    for i in range(3, len(zz)):
        tmp4 = zz[i-3].split(":\t")
        tmp3 = zz[i-2].split(":\t")
        tmp2 = zz[i-1].split(":\t")
        tmp = zz[i].split(":\t")
        if(("mov    rbx,rax" == tmp3[1] or "mov    rbp,rax" == tmp3[1]) and "mov    edi,eax" == tmp2[1] and "call" in tmp[1]):
            dict["rip"] = tmp[0][-14:]
            gdb.execute(f"b *{tmp[0][-14:]}")

    return dict

        
def addr2num(addr):
    try:
        return int(addr)  # Python 3
    except:
        return long(addr) # Python 2

SolverEquation()
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FKpIoNgXOnhUZyRS5CpKI%2Fimage.png?alt=media&amp;token=428fc4ad-7493-4180-a64f-2b9538cc79e0" alt=""><figcaption></figcaption></figure>

Okay, t26 is different. Open it using ghidra

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FpU3XEDYolKwCfX7x3iJ0%2Fimage.png?alt=media&amp;token=913c3f4e-39b9-4a49-b7a2-80276f22f47d" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fzpo5DXx7BdVsC0zilNTJ%2Fimage.png?alt=media&amp;token=d9f1f582-f882-42cc-8a58-6cbff2b36ded" alt=""><figcaption></figcaption></figure>

There is new validation which compare (returned values from malloc) - rdx with 0x20000. To bypass this we just need to set rax value to > 0x20000 on address 0x1010d8. Here is the modified script

```python
#!/usr/bin/python3
import string
import os

class SolverEquation(gdb.Command):
    def __init__ (self):
        super (SolverEquation, self).__init__ ("solve-equation",gdb.COMMAND_OBSCURE)
    
    def invoke (self, arg, from_tty):
        flag = "TSGCTF{hint_do_scripting_R"
        list_chr = '_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ{}'
        poss_main = ["0x10a0", "0x10b0"]
        cnt = 0
        while "}" not in flag:
            i = len(flag)
            os.system(f"chmod +x t{i}")
            base_main = poss_main[cnt%len(poss_main)]
            print(f"base_main: {base_main}")
            
            for z in list_chr:
                inp = flag + z
                gdb.execute("del")
                gdb.execute("pie del")
                gdb.execute(f"pie b {base_main}")
                gdb.execute("unset environment LINES")
                gdb.execute("unset environment COLUMNS")
                
                gdb.execute(f"file t{i}")
                gdb.execute(f"pie run {inp[i]}")
                
                try:
                    arch = gdb.selected_frame().architecture()
                except Exception as e:
                    break

                current_pc = addr2num(gdb.selected_frame().read_register("pc"))
                disa = arch.disassemble(current_pc)[0]

                if("push" in disa["asm"]):
                    tmp = gdb.execute("x/150i $pc", to_string=True)
                    dict = parse_and_break(tmp)
                
                    print(i, inp)
                    gdb.execute("c")

                    if("jg" in dict):
                        gdb.execute("set $rax=0x20001")
                        gdb.execute("c")

                    try:
                        rip = addr2num(gdb.selected_frame().read_register("pc"))
                        flag = inp
                        gdb.execute(f"dump binary memory t{i+1} $rsi $rsi+$rdx")
                        gdb.execute("pie run")
                        break
                    except Exception as e:
                        gdb.execute("pie run")
                        continue
                else:
                    gdb.execute("pie run")
                    break
            
            print("flag", i, flag)
            
            if(len(flag) == i):
                cnt += 1
                if(cnt == len(poss_main)):
                    print("Something different")
                    break
            else:
                cnt = 0

def parse_and_break(a1):
    zz = a1.split("\n")[:-1]
    dict = {}
    for i in range(3, len(zz)):
        tmp4 = zz[i-3].split(":\t")
        tmp3 = zz[i-2].split(":\t")
        tmp2 = zz[i-1].split(":\t")
        tmp = zz[i].split(":\t")
        
        if(("mov    rbx,rax" == tmp3[1] or "mov    rbp,rax" == tmp3[1]) and "mov    edi,eax" == tmp2[1] and "call" in tmp[1]):
            dict["rip"] = tmp[0][-14:]
            gdb.execute(f"b *{tmp[0][-14:]}")

        if("cmp    rax,0x20000"  == tmp[1]):
            dict["jg"] = tmp[0][-14:]
            gdb.execute(f"b *{tmp[0][-14:]}")

    return dict

        
def addr2num(addr):
    try:
        return int(addr)  # Python 3
    except:
        return long(addr) # Python 2

SolverEquation()
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F2uVqGGIyRv9IJChp8nsp%2Fimage.png?alt=media&amp;token=c51461d0-6c63-42dd-914e-1189901ac890" alt=""><figcaption></figcaption></figure>

Open t41 using ghidra.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FatqHXn8buSLX8BYb2hJU%2Fimage.png?alt=media&amp;token=ea56725a-a84a-48db-9106-5817f0c18a9f" alt=""><figcaption></figcaption></figure>

It use LAB\_001010c0 as main address, open main function

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FRQhKaX4dAvOof6dnVJxW%2Fimage.png?alt=media&amp;token=f1b8a6d9-a8c1-453c-9990-658d6469daeb" alt=""><figcaption></figcaption></figure>

It calls signal function that will exit program in particular time. So to bypass this we can just skip the call process of signal function. We can skip it by set the rip register to next instruction which has different 0x5 with call signal address.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FFDjGDY6El7hA17J6JVWz%2Fimage.png?alt=media&amp;token=e221a44e-9f12-44f5-8773-29d0481f1e73" alt=""><figcaption></figcaption></figure>

```python
#!/usr/bin/python3
import string
import os

class SolverEquation(gdb.Command):
    def __init__ (self):
        super (SolverEquation, self).__init__ ("solve-equation",gdb.COMMAND_OBSCURE)
    
    def invoke (self, arg, from_tty):
        flag = "TSGCTF{hint_do_scripting_RdJ5GNjKkUidxjcG"
        list_chr = '_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ{}'
        poss_main = ["0x10a0", "0x10b0", "0x10c0"]
        cnt = 0
        while "}" not in flag:
            i = len(flag)
            os.system(f"chmod +x t{i}")
            base_main = poss_main[cnt%len(poss_main)]
            print(f"base_main: {base_main}")
            
            for z in list_chr:
                inp = flag + z
                gdb.execute("del")
                gdb.execute("pie del")
                gdb.execute(f"pie b {base_main}")
                gdb.execute("unset environment LINES")
                gdb.execute("unset environment COLUMNS")
                
                gdb.execute(f"file t{i}")
                gdb.execute(f"pie run {inp[i]}")
                
                try:
                    arch = gdb.selected_frame().architecture()
                except Exception as e:
                    break

                current_pc = addr2num(gdb.selected_frame().read_register("pc"))
                disa = arch.disassemble(current_pc)[0]

                if("push" in disa["asm"]):
                    tmp = gdb.execute("x/150i $pc", to_string=True)
                    dict = parse_and_break(tmp)
                
                    print(i, inp)
                    gdb.execute("c")

                    if("jg" in dict):
                        gdb.execute("set $rax=0x20001")
                        gdb.execute("c")

                    if("signal1" in dict and "signal2" in dict):
                        gdb.execute(f"set $rip={dict['signal1']}+0x5")
                        gdb.execute("c")
                        gdb.execute(f"set $rip={dict['signal2']}+0x5")
                        gdb.execute("c")

                    try:
                        rip = addr2num(gdb.selected_frame().read_register("pc"))
                        flag = inp
                        gdb.execute(f"dump binary memory t{i+1} $rsi $rsi+$rdx")
                        gdb.execute("pie run")
                        break
                    except Exception as e:
                        gdb.execute("pie run")
                        continue
                else:
                    gdb.execute("pie run")
                    break
            
            print("flag", i, flag)
            
            if(len(flag) == i):
                cnt += 1
                if(cnt == len(poss_main)):
                    print("Something different")
                    break
            else:
                cnt = 0

def parse_and_break(a1):
    zz = a1.split("\n")[:-1]
    dict = {}
    for i in range(3, len(zz)):
        tmp4 = zz[i-3].split(":\t")
        tmp3 = zz[i-2].split(":\t")
        tmp2 = zz[i-1].split(":\t")
        tmp = zz[i].split(":\t")
        
        if(("mov    rbx,rax" == tmp3[1] or "mov    rbp,rax" == tmp3[1]) and "mov    edi,eax" == tmp2[1] and "call" in tmp[1]):
            dict["rip"] = tmp[0][-14:]
            gdb.execute(f"b *{tmp[0][-14:]}")

        if("cmp    rax,0x20000"  == tmp[1]):
            dict["jg"] = tmp[0][-14:]
            gdb.execute(f"b *{tmp[0][-14:]}")

        if("call" in tmp[1] and tmp4[1] == tmp[1] and "mov    edi,0x4" == tmp2[1] and "lea    rsi" in tmp3[1]):
            dict["signal2"] = tmp[0][-14:]
            dict["signal1"] = tmp4[0][-14:]
            gdb.execute(f"b *{tmp4[0][-14:]}")
            gdb.execute(f"b *{tmp[0][-14:]}")

    return dict

        
def addr2num(addr):
    try:
        return int(addr)  # Python 3
    except:
        return long(addr) # Python 2

SolverEquation()
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FhazS34OcpbQ5FwPG6tL6%2Fimage.png?alt=media&amp;token=04cd9130-6f5e-49f7-9e9a-c58e3ad8ee00" alt=""><figcaption></figcaption></figure>

Open t59 using ghidra.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FBHUnN2nF3bd8QZhMr8Jl%2Fimage.png?alt=media&amp;token=fe4b455f-b21e-4227-a4bc-f226031cf767" alt=""><figcaption></figcaption></figure>

t59 use LAB\_001010e0 as main function, open main function.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FYAUNeSyY3eGygP1iuuQW%2Fimage.png?alt=media&amp;token=2163442d-d482-4e45-95da-1d41667cb1af" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F1GivGzccHETcMIhGmlgU%2Fimage.png?alt=media&amp;token=c3909cb5-076e-44f2-a941-21a1ff9cd424" alt=""><figcaption></figcaption></figure>

It compare the return of ptrace function with 0 after incremented it. So to bypass it we just need to set the rax value to valid value, such as for INC RAX -> JNZ we can set RAX to 0xffffffffffffffff, for INC RAX -> JZ we can set RAX to 0x0. Here is the modified script

```python
#!/usr/bin/python3
import string
import os

class SolverEquation(gdb.Command):
    def __init__ (self):
        super (SolverEquation, self).__init__ ("solve-equation",gdb.COMMAND_OBSCURE)
    
    def invoke (self, arg, from_tty):
        flag = "TSGCTF{hint_do_scripting_RdJ5GNjKkUidxjcGN4o7j5Wxz1Feo19Q0_"
        list_chr = '_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ{}'
        poss_main = ["0x10a0", "0x10b0", "0x10c0", "0x10e0"]
        cnt = 0
        while "}" not in flag:
            i = len(flag)
            os.system(f"chmod +x t{i}")
            base_main = poss_main[cnt%len(poss_main)]
            print(f"base_main: {base_main}")
            
            for z in list_chr:
                inp = flag + z
                gdb.execute("del")
                gdb.execute("pie del")
                gdb.execute(f"pie b {base_main}")
                gdb.execute("unset environment LINES")
                gdb.execute("unset environment COLUMNS")
                
                gdb.execute(f"file t{i}")
                gdb.execute(f"pie run {inp[i]}")
                
                try:
                    arch = gdb.selected_frame().architecture()
                except Exception as e:
                    gdb.execute("pie run")
                    break

                current_pc = addr2num(gdb.selected_frame().read_register("pc"))
                disa = arch.disassemble(current_pc)[0]
                
                if("push" in disa["asm"]):
                  
                    tmp = gdb.execute("x/150i $pc", to_string=True)
                    dict = parse_and_break(tmp)
                
                    print(i, inp)
                    gdb.execute("c")

                    if("jg" in dict):
                        gdb.execute("set $rax=0x20001")
                        gdb.execute("c")

                    if("signal1" in dict and "signal2" in dict):
                        gdb.execute(f"set $rip={dict['signal1']}+0x5")
                        gdb.execute("c")
                        gdb.execute(f"set $rip={dict['signal2']}+0x5")
                        gdb.execute("c")

                    if("ptrace" in dict):
                        try:
                            gdb.execute("set $rax = 0xffffffffffffffff")
                            gdb.execute("c")
                            gdb.execute("set $rax = 0x0")
                            gdb.execute("c")
                            gdb.execute("set $rax = 0xffffffffffffffff")
                            gdb.execute("c")
                            gdb.execute("set $rax = 0xffffffffffffffff")
                            gdb.execute("c")
                        except Exception as e:
                            gdb.execute("pie run")
                            continue

                    try:
                        rip = addr2num(gdb.selected_frame().read_register("pc"))
                        flag = inp
                        gdb.execute(f"dump binary memory t{i+1} $rsi $rsi+$rdx")
                        gdb.execute("pie run")
                        break
                    except Exception as e:
                        gdb.execute("pie run")
                        continue
                else:
                    gdb.execute("pie run")
                    break
            
            print("flag", i, flag)
            
            if(len(flag) == i):
                cnt += 1
                if(cnt == len(poss_main)):
                    print("Something different")
                    break
            else:
                cnt = 0

def parse_and_break(a1):
    zz = a1.split("\n")[:-1]
    dict = {}
    for i in range(3, len(zz)):
        tmp4 = zz[i-3].split(":\t")
        tmp3 = zz[i-2].split(":\t")
        tmp2 = zz[i-1].split(":\t")
        tmp = zz[i].split(":\t")
        
        if(("mov    rbx,rax" == tmp3[1] or "mov    rbp,rax" == tmp3[1]) and "mov    edi,eax" == tmp2[1] and "call" in tmp[1]):
            dict["rip"] = tmp[0][-14:]
            gdb.execute(f"b *{tmp[0][-14:]}")

        if("cmp    rax,0x20000"  == tmp[1]):
            dict["jg"] = tmp[0][-14:]
            gdb.execute(f"b *{tmp[0][-14:]}")

        if("call" in tmp[1] and tmp4[1] == tmp[1] and "mov    edi,0x4" == tmp2[1] and "lea    rsi" in tmp3[1]):
            dict["signal2"] = tmp[0][-14:]
            dict["signal1"] = tmp4[0][-14:]
            gdb.execute(f"b *{tmp4[0][-14:]}")
            gdb.execute(f"b *{tmp[0][-14:]}")

        if(("jne" in tmp[1] or "je" in tmp[1]) and "inc" in tmp2[1] and "call" in tmp3[1]):
            dict["ptrace"] = [tmp2[0][-14:]]
            gdb.execute(f"b *{tmp2[0][-14:]}")

    return dict

        
def addr2num(addr):
    try:
        return int(addr)  # Python 3
    except:
        return long(addr) # Python 2

SolverEquation()
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FTmdg1jBImvXYMqAvFE2B%2Fimage.png?alt=media&amp;token=29033322-7d1b-45bb-b983-dca89c1c9815" alt=""><figcaption></figcaption></figure>

Open t60 using ghidra

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F107ocopArlWMkfhMd19D%2Fimage.png?alt=media&amp;token=52d1fa55-15c1-48cc-a259-7d4eca6e9f15" alt=""><figcaption></figcaption></figure>

t60 only has diffeerent on main address. So just add 0x1100 in poss\_main array.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F38IM61Q0T9ksTW1u6Rkj%2Fimage.png?alt=media&amp;token=3cb3468e-e68a-4116-b8b4-bda4bc8f6e6c" alt=""><figcaption></figcaption></figure>

t64 also has different in main address, so just add 0x10f0 in poss\_main array.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FUDHIPSQFTeE8FldGXpbc%2Fimage.png?alt=media&amp;token=2e698ce7-cf2d-45c7-846e-9e367e79a48f" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FtmR1ihmE1tXt2ISuCl5D%2Fimage.png?alt=media&amp;token=4da1cb55-c546-405e-a150-95bf72733f42" alt=""><figcaption></figcaption></figure>

Got sigsegv on t84, open it using ghidra

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FLhGXloRQnZ3sED8ugtnR%2Fimage.png?alt=media&amp;token=503f762b-de42-4e42-9ad4-5d75e9142892" alt=""><figcaption></figcaption></figure>

It use 0x1010d0 as main address, so add it to poss\_main array.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fh2IZIrdnSi9LiUysaVMZ%2Fimage.png?alt=media&amp;token=02119c8e-181c-4ee8-91e7-1e8a44e44aa6" alt=""><figcaption></figcaption></figure>

Here is the final script

```python
#!/usr/bin/python3
import string
import os

class SolverEquation(gdb.Command):
    def __init__ (self):
        super (SolverEquation, self).__init__ ("solve-equation",gdb.COMMAND_OBSCURE)
    
    def invoke (self, arg, from_tty):
        flag = "TSGCTF{hint_do_scripting_RdJ5GNjKkUidxjcGN4o7j5Wxz1Feo19Q0_hop3_you_did_no7_s0lve_ma"
        list_chr = '_0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ{}'
        poss_main = ["0x10a0", "0x10b0", "0x10c0", "0x10d0", "0x10e0", "0x10f0", "0x1100"]
        cnt = 0
        while "}" not in flag:
            i = len(flag)
            os.system(f"chmod +x t{i}")
            base_main = poss_main[cnt%len(poss_main)]
            print(f"base_main: {base_main}")
            
            for z in list_chr:
                inp = flag + z
                gdb.execute("del")
                gdb.execute("pie del")
                gdb.execute(f"pie b {base_main}")
                gdb.execute("unset environment LINES")
                gdb.execute("unset environment COLUMNS")
                
                gdb.execute(f"file t{i}")
                gdb.execute(f"pie run {inp[i]}")
                
                try:
                    arch = gdb.selected_frame().architecture()
                except Exception as e:
                    gdb.execute("pie run")
                    break

                current_pc = addr2num(gdb.selected_frame().read_register("pc"))
                disa = arch.disassemble(current_pc)[0]
                
                if("push" in disa["asm"]):
                    tmp = gdb.execute("x/150i $pc", to_string=True)
                    dict = parse_and_break(tmp)
                
                    print(i, inp)
                    gdb.execute("c")

                    if("jg" in dict):
                        gdb.execute("set $rax=0x20001")
                        gdb.execute("c")

                    if("signal1" in dict and "signal2" in dict):
                        gdb.execute(f"set $rip={dict['signal1']}+0x5")
                        gdb.execute("c")
                        gdb.execute(f"set $rip={dict['signal2']}+0x5")
                        gdb.execute("c")

                    if("ptrace" in dict):
                        try:
                            gdb.execute("set $rax = 0xffffffffffffffff")
                            gdb.execute("c")
                            gdb.execute("set $rax = 0x0")
                            gdb.execute("c")
                            gdb.execute("set $rax = 0xffffffffffffffff")
                            gdb.execute("c")
                            gdb.execute("set $rax = 0xffffffffffffffff")
                            gdb.execute("c")
                        except Exception as e:
                            gdb.execute("pie run")
                            continue

                    try:
                        rip = addr2num(gdb.selected_frame().read_register("pc"))
                        flag = inp
                        gdb.execute(f"dump binary memory t{i+1} $rsi $rsi+$rdx")
                        gdb.execute("pie run")
                        break
                    except Exception as e:
                        gdb.execute("pie run")
                        continue
                else:
                    gdb.execute("pie run")
                    break
            
            print("flag", i, flag)
            
            if(len(flag) == i):
                cnt += 1
                if(cnt == len(poss_main)):
                    print("Something different")
                    break
            else:
                cnt = 0

def parse_and_break(a1):
    zz = a1.split("\n")[:-1]
    dict = {}
    for i in range(3, len(zz)):
        tmp4 = zz[i-3].split(":\t")
        tmp3 = zz[i-2].split(":\t")
        tmp2 = zz[i-1].split(":\t")
        tmp = zz[i].split(":\t")
        
        if(("mov    rbx,rax" == tmp3[1] or "mov    rbp,rax" == tmp3[1]) and "mov    edi,eax" == tmp2[1] and "call" in tmp[1]):
            dict["rip"] = tmp[0][-14:]
            gdb.execute(f"b *{tmp[0][-14:]}")

        if("cmp    rax,0x20000"  == tmp[1]):
            dict["jg"] = tmp[0][-14:]
            gdb.execute(f"b *{tmp[0][-14:]}")

        if("call" in tmp[1] and tmp4[1] == tmp[1] and "mov    edi,0x4" == tmp2[1] and "lea    rsi" in tmp3[1]):
            dict["signal2"] = tmp[0][-14:]
            dict["signal1"] = tmp4[0][-14:]
            gdb.execute(f"b *{tmp4[0][-14:]}")
            gdb.execute(f"b *{tmp[0][-14:]}")

        if(("jne" in tmp[1] or "je" in tmp[1]) and "inc" in tmp2[1] and "call" in tmp3[1]):
            dict["ptrace"] = [tmp2[0][-14:]]
            gdb.execute(f"b *{tmp2[0][-14:]}")

    return dict

        
def addr2num(addr):
    try:
        return int(addr)  # Python 3
    except:
        return long(addr) # Python 2

SolverEquation()
```

Flag : TSGCTF{hint\_do\_scripting\_RdJ5GNjKkUidxjcGN4o7j5Wxz1Feo19Q0\_hop3\_you\_did\_no7\_s0lve\_manu4l1y\_vNbwVTKw}

## Conduit (470 pts)

### Description

### Solution

## Natural Flag Processing 2 (470 pts)

### Description

### Solution

## Nets (500 pts)

### Description

### Solution

## mimetic\_cycle (500 pts)

### Description

### Solution

## Frictionless (500 pts)

### Description

### Solution
