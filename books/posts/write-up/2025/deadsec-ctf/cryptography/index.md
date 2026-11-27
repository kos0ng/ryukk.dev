# Cryptography

<table><thead><tr><th width="347">Challenge</th><th>Topic</th></tr></thead><tbody><tr><td><a href="#imrul-kaes-338-pts">imrul kAES (338 pts)</a></td><td>Encryption Oracle, Homomorphic</td></tr></tbody></table>

## imrul kAES (338 pts)

### Description

Imrul Kayes may not always be in the playing XI, but somehow, he's found himself inside an AES encryption scheme. We don't know how. He doesn't know how. But he's in. And he’s trolling hard.

Instead of swinging the bat, Imrul is now swinging bytes, and dropping more blocks than a DJ with Parkinson’s.

### Solution

Given code below

```python
#!/usr/local/bin/python
from Crypto.Util.number import bytes_to_long, long_to_bytes, getPrime
from Crypto.Util.Padding import pad
from Crypto.Random import get_random_bytes
from Crypto.Cipher import AES

print('Yo welcome to my sign as a service...')

p, q = getPrime(512), getPrime(512)
e = 12389231641983877009741841713701317189420787527171545487350619433744301520682298136425919859970313849150196317044388637723151690904279767516595936892361663
n = p * q
d = pow(e, -1, (p - 1) * (q - 1))

k = get_random_bytes(16)
cipher = AES.new(k, AES.MODE_ECB)

flag = open('flag.txt', 'rb').read()
assert len(flag) <= 50
ct = pow(bytes_to_long(flag), e, n)

print(ct)

while 1:
	try:
		i = int(input("Enter message to sign: "))
		assert(0 < i < n)
		print(cipher.encrypt(pad(long_to_bytes(pow(i, d, n) & ((1<<512) - 1)), 16)).hex())
	except:
		print("bad input, exiting")
```

From code above we can see that there is combination of RSA decryption and AES encryption oracle. Previously, we also given a ciphertext of flag (RSA) and basically we can get the ciphertext (AES) from the flag by using the oracle. Now, how can we leak the flag if we only given ciphertext (AES) ?

We know that each encryption of AES use the same key and we know that AES is a block cipher. In AES ECB mode, there is a well known attack for encryption oracle that if secret data and plaintext are concatenated and we can control the plaintext then we can leak the whole secret data. For example

```python
plaintext = "ABCDEFGHIJLKLMN"
secret = "THIS_IS_SECRET"
E(null_pad(plaintext+secret)) = E("ABCDEFGHIJLKLMNT") + E("HIS_IS_SECRET\x00\x00\x00")
```

Because we can control the plaintext and in above example plaintext length is 15 bytes then there will be one byte of secret will be leaked. After that we will know the ciphertext of first block that leak one byte of secret, then we can easily bruteforce it by sending plaintext + one byte guess, if the first block match then we found one byte of secret. To leak the next byte we can do the same process, but by reducing the size of plaintext to 14 bytes so 2 first bytes of secret will be added in first block, then do bruteforce  for plaintext + leaked\_value + one byte guess.&#x20;

In this challenge, our input are passed to RSA decryption and there is no secret or flag added to our input. But, because we have the ciphertext (RSA) of flag we can implicitly add "flag" and plaintext to AES encryption oracle by utilizing its homomorphic property. Example

$$
c\_1 = m\_1^e \bmod n \\
c\_2 = (m\_1\*m\_2)^e \bmod n
$$

To create c2 we dont need to know m1 value because we can do the following equation

$$
c\_2 \equiv c\_1 \* (m\_2 ^ e) \bmod n
$$

Then, what should be the value of m2? because we want the decryption result of RSA still contains the valid flag we can do null padding, such as from "A" become "A\x00". Null padding basically multiply a value with 256^i for i = padding length. So if we pad the flag with null padding it will append data after the flag or it becomes different with first example to leak the flag which controlled plaintext become a prefix not the suffix.&#x20;

Take a look back on the challenge we see that it is not only decrypting the RSA ciphertext but it limits the decryption result to 64 bytes ((1<<512) - 1). So if we pad the flag with 63 bytes null then we can leak one byte of the flag because it will only get the last 64 bytes of value!

```python
data = b'DEAD{TESTING_FLAG}\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
data &= b'\xff'*64
data[:16] == b'}\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
```

Last, we just need to brute first block by creating a valid RSA ciphertext with value null\_pad(guess). Because we didnt get the modulus we can easiliy leak the modulus by utlizing the assertion (assert(0 < i < n)) and binary search. Following is my script to solve the challenge

```python
from pwn import *
from tqdm import tqdm
from Crypto.Util.number import long_to_bytes, bytes_to_long
from Crypto.Util.Padding import pad
from pwn import *
import time

conn = remote("nc.deadsec.quest", 32160)
# conn = process(["python3", "ori.py"])


def is_valid(i):
    try:
        conn.recvuntil(b"sign:")
        conn.sendline(str(i).encode())
        out = conn.recvline()
        return b"bad input" not in out
    except:
        return False

def find_n():
    lo = 1
    hi = 1 << 1024 
    #hi = 2

    with tqdm(desc="Finding upper bound") as pbar:
        while is_valid(hi):
            lo = hi
            hi *= 2
            pbar.update(1)

    total_iterations = (hi - lo).bit_length()  # Estimate max iterations
    with tqdm(total=total_iterations, desc="Binary search") as pbar:
        while lo < hi:
            mid = (lo + hi) // 2
            if is_valid(mid):
                lo = mid + 1
            else:
                hi = mid
            pbar.update(1)

    return lo

def make_blocks(data):
    data = bytes.fromhex(data)
    blocks = []
    for i in range(0, len(data), 16):
        blocks.append(data[i:i+16])
    return blocks

def custom_pad(m):
    x = 16 - len(m) % 16
    return m + bytes([0] * x)


if __name__ == "__main__":
    conn.readline()
    ct = int(conn.readline().strip())
    n = find_n()
    e = 12389231641983877009741841713701317189420787527171545487350619433744301520682298136425919859970313849150196317044388637723151690904279767516595936892361663
    print(f"Found n: {n}")
    known = b""
    for i in range(63 - len(known), -1, -1): 
        new = (pow(256**i, e, n) * ct) % n
        conn.recvuntil(b"Enter message to sign: ")
        conn.sendline(str(new).encode())
        data = conn.recvline().strip().decode()
        blocks1 = make_blocks(data)
        
        for bf in tqdm(string.printable[:-6]):
            conn.recvuntil(b"Enter message to sign: ")
            guess_ct = pow(bytes_to_long(custom_pad(bf.encode() + known)), e, n)
            conn.sendline(str(guess_ct).encode())
            data = conn.recvline().strip().decode()
            blocks2 = make_blocks(data)
            if blocks1[0] == blocks2[0]:
                known = bf.encode() + known
                print("known", known)
                break

        if b"DEAD{" in known:
            print(known)
            break
```

Flag: DEAD{p4ddin6\_04aC13\_477aCk!\_48570cb5ebf34f16}
