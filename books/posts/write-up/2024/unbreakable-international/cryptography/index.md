# Cryptography

<!-- challenge-index: 3e6ff3b7ac0c743e -->

| Challenge | Topic |
| --- | --- |
| [krotate (463 pts)](#krotate-463-pts) | Key Rotation, XOR |
| [sat1sf1  (463 pts)](#sat1sf1-463-pts) | Bitwise Constraints, Z3 |

<!-- /challenge-index -->

## krotate (463 pts)

### Description

We managed to intercep communication with a critical mission. We can't decipher it but managed to break into the system and recover what looks like part of the communication and an algorithm for it.

Can you get the full message?

### Solution

Given source code below.

```python
from Crypto.Random import get_random_bytes

KEY_LEN = 100
key = get_random_bytes(KEY_LEN)
R = 0x01

def RGEN():
    global R
    R = ((R << 1) ^ (0x71 if (R & 0x80) else 0)) & 0xFF
    return R


def xor_text(text, key):
    return bytes([text[i] ^ key[i] for i in range(len(text))])


def next_key(key):
    return bytes([key[i] ^ RGEN() for i in range(len(key))])


def encrypt(text, key):
    ciphertext = b""

    blocks = [text[i : i + KEY_LEN] for i in range(0, len(text), KEY_LEN)]

    for block in blocks:
        ciphertext += xor_text(block, key)
        key = next_key(key)

    return ciphertext


# ---

text = b""
with open("text.txt", "rb") as f:
    text = f.read()

ciphertext = encrypt(text, key)
with open("ct.txt", "wb") as g:
    g.write(ciphertext)
```

Below is the program flow:

1. Generate random key with length 100 bytes
2. Split plaintext to block with each block length is 100 bytes
3. Loop until all encrypted
   1. Xor block plaintext with key
   2. Create new key based on previous key and RGEN function

So if we know the the first generated key we will decrypt the rest ciphertext because the next key is based on previous key. Since it is almost impossible to brute 100 bytes immediately so my idea is brute 4 bytes first key with assumption we can read partial valid "plaintext" that consist of 4 bytes then bruteforce 1 bytes semi automatically. To reduce the possibility we can loop through all blocks and validate only specific index on decrypted text, if those value on specific index on all blocks are printable so it is one of the possible key. For example if we want to get key on index 10 we only validate plaintext on index 10 on block1,block2,..block100, if there is 100 valid printable character at index 10 from all blocks it is one of the possible key.

```python
import string
from itertools import product

def RGEN():
    global R
    R = ((R << 1) ^ (0x71 if (R & 0x80) else 0)) & 0xFF
    return R

def xor_text(text, key):
    return bytes([text[i] ^ key[i] for i in range(len(text))])

def next_key(key):
    return [key[i] ^ RGEN() for i in range(len(key))]

KEY_LEN = 100
key = [0 for i in range(KEY_LEN)]

f = open("ciphertext.txt", "rb").read()

target_length = 4
possible_key = [[] for i in range(target_length)]
possible_key += [[0] for i in range(100 - target_length)]

for target in range(target_length):
    for j in range(0x100):
        R = 0x01
        key[target] = j
        counter = 0
        for i in range(0, len(f), KEY_LEN):
            tmp = f[i:i+KEY_LEN]
            result = xor_text(tmp, key)
            if(chr(result[target]) in string.printable):
                counter += 1
            key = next_key(key)
        if counter >= int(len(f)//100) + 1:
            possible_key[target].append(j)

for i in product(*possible_key):
    R = 0x01
    tmp_key = list(i)
    plaintext = []
    for j in range(0, len(f), KEY_LEN):
        block = f[j:j+KEY_LEN]
        tmp = xor_text(block, tmp_key)
        plaintext.append(tmp[:target_length])
        tmp_key = next_key(tmp_key)
    print(list(i)[:target_length], plaintext)
    print()

```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FtPwhZmHCdmyrLChJclpb%2Fimage.png?alt=media&amp;token=63cf006b-97ae-4c36-bf27-4c0fc04dc825" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FZ4HFWpbPIXelPf2g9yk7%2Fimage.png?alt=media&amp;token=d5f69c9c-5a02-44f3-8781-d73fe4de3a0f" alt=""><figcaption></figcaption></figure>

After getting first 4 bytes key, lets do semi automatic bruteforce for each next byte key.

```python
import string
from itertools import product

def RGEN():
    global R
    R = ((R << 1) ^ (0x71 if (R & 0x80) else 0)) & 0xFF
    return R

def xor_text(text, key):
    return bytes([text[i] ^ key[i] for i in range(len(text))])

def next_key(key):
    return [key[i] ^ RGEN() for i in range(len(key))]

KEY_LEN = 100
ct = open("ciphertext.txt", "rb").read()
pt = b"-----BEGIN PGP SIGNED MESSAGE-----\n" # well known format after leaking ----BEG

ori_key = []
for i in range(len(pt)):
    ori_key.append(pt[i] ^ ct[i])

ori_key += [0 for i in range(100 - len(ori_key))]

target = len(pt)

while True:
    for x in range(0x100):
        R = 0x1
        key = ori_key[:]
        key[target] = x
        for i in range(0, len(ct), KEY_LEN):
            block = ct[i:i+KEY_LEN]
            tmp = xor_text(block, key)
            print(x, tmp[:target + 1])
            key = next_key(key)
        print()
    print(ori_key)
    ori_key[target] = int(input("dec: "))
    target += 1
```

At the end we will get first 100 bytes key

```
ori_key = [31, 63, 14, 99, 227, 6, 74, 154, 116, 22, 252, 224, 98, 229, 131, 236, 6, 84, 48, 171, 248, 63, 186, 127, 46, 110, 71, 158, 190, 255, 94, 255, 183, 103, 227, 31, 210, 40, 199, 18, 201, 206, 252, 160, 79, 182, 62, 185, 184, 22, 113, 215, 48, 101, 99, 172, 4, 187, 87, 114, 195, 92, 35, 221, 94, 3, 221, 227, 102, 194, 181, 179, 5, 4, 168, 96, 157, 25, 85, 56, 107, 193, 154, 146, 9, 33, 168, 114, 236, 159, 146, 75, 59, 86, 183, 253, 92, 120, 28, 75]
```

Then just use it to decrypt the whole ciphertext.

```python
def RGEN():
    global R
    R = ((R << 1) ^ (0x71 if (R & 0x80) else 0)) & 0xFF
    return R

def xor_text(text, key):
    return bytes([text[i] ^ key[i] for i in range(len(text))])

def next_key(key):
    return [key[i] ^ RGEN() for i in range(len(key))]

key = [31, 63, 14, 99, 227, 6, 74, 154, 116, 22, 252, 224, 98, 229, 131, 236, 6, 84, 48, 171, 248, 63, 186, 127, 46, 110, 71, 158, 190, 255, 94, 255, 183, 103, 227, 31, 210, 40, 199, 18, 201, 206, 252, 160, 79, 182, 62, 185, 184, 22, 113, 215, 48, 101, 99, 172, 4, 187, 87, 114, 195, 92, 35, 221, 94, 3, 221, 227, 102, 194, 181, 179, 5, 4, 168, 96, 157, 25, 85, 56, 107, 193, 154, 146, 9, 33, 168, 114, 236, 159, 146, 75, 59, 86, 183, 253, 92, 120, 28, 75]
R = 0x1
pt = b""
ct = open("ciphertext.txt", "rb").read()
KEY_LEN = 100
for i in range(0, len(ct), KEY_LEN):
    block = ct[i:i+KEY_LEN]
    tmp = xor_text(block, key)
    pt += tmp
    key = next_key(key)

print(pt)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FSAWDp4Wpccl530U7Ia8x%2Fimage.png?alt=media&amp;token=63c420f5-cce3-40e5-897f-4fb28bd331a8" alt=""><figcaption></figcaption></figure>

Flag: CTF{cc64393474865290892e5197153ad6109151d8ee2fd5e316d81b80c3d825bd82}

## sat1sf1 (463 pts)

### Description

Made my own hashing function sah652.

Here the super-secure hash of my secret: `2033251f4b3161e4455a4c261e3f631e18653c3a6c136e30304037373e6e1f6c6f6448673e686b1e18603d10306d323f3a4b626eee636c3c3c62483592123e6d6c6c3a49ca`

Feeling generous to share some hints about my secret that you definitely will not able to recover:

Text length: 69 characters

Flag regex: `CTF{[a-f0-9]{64}}`

Flag contains somewhere the text: `beebeef`

### Solution

Given source code below

```python
from functools import reduce
import sys


def KekF1601onLanes(lanes):
    R = 1
    for _ in range(24):
        C = [reduce(lambda a, b: a ^ b, lanes[x]) for x in range(len(lanes))]
        D = [
            C[(x + 4) % len(lanes)] ^ C[(x + 1) % len(lanes)] for x in range(len(lanes))
        ]

        lanes = [[lanes[x][y] ^ D[y] for y in range(8)] for x in range(len(lanes))]

        for i in range(len(lanes)):
            aux = lanes[i][0]
            for j in range(len(lanes[0]) - 1):
                lanes[i][j] = lanes[i][j + 1]
            lanes[i][-1] = aux

        aux = lanes[0]
        for j in range(len(aux)):
            for i in range(len(lanes) - 1):
                lanes[i][j] = lanes[i][j] ^ lanes[i + 1][j]
            lanes[-1][j] = lanes[-1][j] ^ aux[j]

        R = ((R << 1) ^ ((R >> 7) * 0x71)) % 256
        lanes[0][0] ^= R & 2
    return lanes


def KekF1601(state):
    lanes = [state[x * 8 : (x + 1) * 8] for x in range(len(state) // 8)]
    lanes = KekF1601onLanes(lanes)
    state = [item for row in lanes for item in row]

    return state


OUT_LEN = 69


def Kek(rate, state, delimitedSuffix):
    rateInBytes = rate // 8
    blockSize = 69

    state[blockSize] = state[blockSize] ^ delimitedSuffix
    state[rateInBytes - 1] = state[rateInBytes - 1] ^ 0x80
    state = KekF1601(state)

    return state[0:OUT_LEN]


def SAH3_652(state_arr):
    return Kek(1088, state_arr, 0x06)


pt = "" # Flag
state0 = list(pt.encode("utf-8"))
state0.extend([0] * (200 - len(state0)))
out = SAH3_652(state0)
print(bytes(out).hex())

# 2033251f4b3161e4455a4c261e3f631e18653c3a6c136e30304037373e6e1f6c6f6448673e686b1e18603d10306d323f3a4b626eee636c3c3c62483592123e6d6c6c3a49ca
```

Below is the program flow:

1. Create delimiter at index 69 by xoring value on index 69
2. Split to block with each block consist of 8 bytes data
3. Loop 24 times
   1. Xor all value on each block and store on C
   2. Xor C on index (x+1) with (x + 4) and store on D
   3. Xor original block value with D
   4. Shift value on each row
   5. Do something like mix row (xor value different row)
   6. Xor first value with R

From above flow i assume that SAT/SMT solver can solve this challenge. The idea is trying to get the plaintext by utilizing z3. Below is my script

```python
from functools import reduce
import sys
from z3 import *

def KekF1601onLanes(lanes):
    R = 1
    for _ in range(24):
        C = [reduce(lambda a, b: a ^ b, lanes[x]) for x in range(len(lanes))]
        D = [
            C[(x + 4) % len(lanes)] ^ C[(x + 1) % len(lanes)] for x in range(len(lanes))
        ]
        
        lanes = [[lanes[x][y] ^ D[y] for y in range(8)] for x in range(len(lanes))]
        
        for i in range(len(lanes)):
            aux = lanes[i][0]
            for j in range(len(lanes[0]) - 1):
                lanes[i][j] = lanes[i][j + 1]
            lanes[i][-1] = aux

        aux = lanes[0]
        for j in range(len(aux)):
            for i in range(len(lanes) - 1):
                lanes[i][j] = lanes[i][j] ^ lanes[i + 1][j]
            lanes[-1][j] = lanes[-1][j] ^ aux[j]

        R = ((R << 1) ^ ((R >> 7) * 0x71)) % 256
        lanes[0][0] ^= R & 2
    return lanes


def KekF1601(state):
    lanes = [state[x * 8 : (x + 1) * 8] for x in range(len(state) // 8)]
    lanes = KekF1601onLanes(lanes)
    state = [item for row in lanes for item in row]
    return state


OUT_LEN = 69


def Kek(rate, state, delimitedSuffix):
    rateInBytes = rate // 8
    blockSize = 69

    state[blockSize] = state[blockSize] ^ delimitedSuffix
    state[rateInBytes - 1] = state[rateInBytes - 1] ^ 0x80
    state = KekF1601(state)

    return state[0:OUT_LEN]


def SAH3_652(state_arr):
    return Kek(1088, state_arr, 0x06)

s = Solver()

known = b"ctf{"
pt = [BitVec("x{}".format(i), 8) for i in range(69)]
pt += [0 for i in range(131)]

output = "2033251f4b3161e4455a4c261e3f631e18653c3a6c136e30304037373e6e1f6c6f6448673e686b1e18603d10306d323f3a4b626eee636c3c3c62483592123e6d6c6c3a49ca"

data = list(bytes.fromhex(output))
out = SAH3_652(pt)

# found another valid character, so add some constraints
s.add(pt[61] == ord('e'))
s.add(pt[62] == ord('e'))
s.add(pt[63] == ord('f'))

for i in range(len(out)):
    s.add(out[i] == data[i])

print(s.check())
model = s.model()

flag = b""
for i in pt:
    flag += bytes([model[i].as_long()])
    print(i, flag)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fd5Qli3cDuou5VEipy92v%2Fimage.png?alt=media&amp;token=55ba922a-c929-4463-9a5e-aad7bb68ee9b" alt=""><figcaption></figcaption></figure>

Flag: CTF{45adda2019d24619435fcb0a0b644f576c8baeffeeb603d1618cdbeebeefaead}
