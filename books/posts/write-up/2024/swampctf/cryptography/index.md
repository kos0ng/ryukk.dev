# Cryptography

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>Jank File Encryptor (315 pts)</td><td><a href="#jank-file-encryptor-315-pts">Here</a></td></tr><tr><td>Copper Crypto (328 pts)</td><td><a href="#copper-crypto-328-pts">Here</a></td></tr></tbody></table>

## Jank File Encryptor (315 pts)

### Description

They say you shouldn't roll your own encryption code, but I think all those naysayers are just gatekeeping!

### Solution

Given source code below

```python
import random

# File to encrypt
file_name = input("Please input the filename: ")

# Choose whether to encrypt or decrypt the file
choice = input("Enter 'encrypt' or 'decrypt' to preform the respective operation on the selected file: ")

# Open the file
f = open(file_name, mode="rb")

# Read the file
data = f.read()

if choice == "encrypt":
    # Generate random numbers for the LCG
    seed = random.randint(1, 256)
    a = random.randint(1, 256)
    c = random.randint(1, 256)
    modulus = random.randint(1, 256)

    print(f"Seed: {seed}")
    print(f"A: {a}")
    print(f"C: {c}")
    print(f"Modulus: {modulus}")

    # Pad the file out with some filler bytes to obscure it's size
    arr = bytearray(data)
    arr += bytearray([0x41] * 1000)

    save = bytearray()

    # Encrypt the files contents with the LCG
    for i in arr:
        seed = (a * seed + c) % modulus
        save.append(i ^ seed)

    f.close()

    # Write the encrypted file back to the disk
    with open(f"{file_name}.enc", "wb") as binary_file:
        binary_file.write(save)

elif choice == "decrypt":
    seed = int(input("Seed: "))
    a = int(input("A: "))
    c = int(input("C: "))
    modulus = int(input("Modulus: "))

    # Remove the padding bytes
    arr = bytearray(data[:len(data)-1000])

    save = bytearray()

    # Decrypt the files contents with the LCG
    for i in arr:
        seed = (a * seed + c) % modulus
        save.append(i ^ seed)

        # Write the encrypted file back to the disk
        with open(f"{file_name}.dec", "wb") as binary_file:
            binary_file.write(save)
```

* Plaintext padded with 1000 bytes 0x41
* Seed, a, c, and modulus used in LCG generated with random integer 1-256

We can leak 1000 bytes last seed by xor last 1000 bytes ciphertext with 0x41. Because a, c, and modulus only 1 byte (1-256) it is possible to do bruteforce (total 3 bytes). After getting valid a,c, and modulus value just reverse the flow to get previous seed.&#x20;

$$
s\_i = (a \* s\_{i-1} + c) \bmod m\\
s\_{i-1} = ((s\_i - c)\*a^{-1}) \bmod m
$$

Here is my solver

```python
from itertools import product

f = open("flag.txt.enc", "rb").read()
known_ct = f[-1000:]
key = []
for i in range(len(known_ct)):
	key.append(known_ct[i] ^ 0x41)

flag_ct = f[:-1000]
seed = key[0]
arr = [i for i in range(1,0x101)]

for i in product(arr, repeat=3):
	tmp_seed = seed
	a = i[0]
	c = i[1]
	modulus = i[2]
	found = True
	for j in range(100):
		try:
			tmp_seed = (a * tmp_seed + c) % modulus
		except Exception as e:
			found = False
			break
		if(tmp_seed != key[1 + j]):
			found = False
			break
	if found:
		break

last_seed = key[0]
inverse_a = pow(a, -1, modulus)
flag = b""
for i in range(len(flag_ct)-1, -1, -1):
	last_seed = ((last_seed - c) * inverse_a) % modulus
	flag += bytes([last_seed ^ flag_ct[i]])
print(flag[::-1])
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F9ENiWmh38rYuCaVHq2ZL%2Fimage.png?alt=media&amp;token=7faca46f-2cc5-473c-a36d-e83bf85406e7" alt=""><figcaption></figcaption></figure>

Flag: swampCTF{d0nt\_l3ak\_ur\_k3ystr3am5}

## Copper Crypto (328 pts)

### Description

I've been learning the new pycryptodome library! I don't know much yet though. Here's my first code to encrypt some text:

### Solution

Given source code below

```python
#!/bin/python3

from Crypto.Util.number import *

with open('flag.txt', 'rb') as fin:
	flag = fin.read().rstrip()

pad = lambda x: x + b'\x00' * (500 - len(x))

m = bytes_to_long(pad(flag))

p = getStrongPrime(512)
q = getStrongPrime(512)

n = p * q
e = 3
c = pow(m,e,n)

with open('out.txt', 'w') as fout:
	fout.write(f'n = {n}\n')
	fout.write(f'e = {e}\n')
	fout.write(f'c = {c}\n')

```

* Flag are padded, so pad(m)^e > n
  * null byte padding same as multiplication with 256^i with i = padding length &#x20;
* e is 3, if m^e < n , so we can get m by doing nth root

So the idea is finding m^e by removing the padding. Because the padded m is m\*256^i we can remove the padding by doing multiplication inverse with 256^-i. After that just do nthroot.

$$
ct = (m\*256^i)^e \bmod n\\
ct \* (256^{-i})^e = m^e \bmod n
$$

Here is my solver

```python
import gmpy2
from Crypto.PublicKey import RSA
from Crypto.Util.number import *

def solve(ct, e, n, padding_len):
    new_ct = ct * pow(inverse(256, n) ** padding_len, e, n)
    new_ct %= n
    potential_pt, is_cube = gmpy2.iroot(new_ct, e)
    if is_cube:
        print(i, long_to_bytes(potential_pt))

n = 119604938096697044316047691964929805828918626075093639662825464535827900362132954794317391864822750976662931603966282850021396173045319251883406363073183189808699680701857953334587328906486229075428157995555693476599232724728486400143213284483622313607354815609215059406863340823255111036033446109329593686949
e = 3
c = 91149569482452486003218449809382430813144791805261257903556643652008332135606236690176360090659938752235745771493858775509562950906764411011689366104109528195425590415243479424000644174707030408431768079041029193109110970032733391052611637831168097556118005523386390422929265528589660737843901941464809893959

for i in range(500):
    solve(c, e, n, i)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FatVbp7XPVhI8a8xKV4oP%2Fimage.png?alt=media&amp;token=c1ff86d6-98e6-4d31-b26b-bc57b8e0e85f" alt=""><figcaption></figcaption></figure>

Flag: swampCTF{pycryp70d0m3\_h45\_4\_p4dd1n6\_func}
