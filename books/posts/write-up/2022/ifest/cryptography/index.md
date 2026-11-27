# Cryptography

<!-- challenge-index: f15d6dc73618dfa0 -->

| Challenge | Topic |
| --- | --- |
| [Kata Pengantar (100 pts)](#kata-pengantar-100-pts) | Substitution Cipher |
| [Kisinik Kripti Algoritem (223 pts)](#kisinik-kripti-algoritem-223-pts) | Chosen Plaintext, Substitution Cipher |
| [Kepapasan (431 pts)](#kepapasan-431-pts) | AES, Meet-in-the-Middle |
| [Rabun Genap (431 pts)](#rabun-genap-431-pts) | RSA, Modular Roots |

<!-- /challenge-index -->

## Kata Pengantar (100 pts)

### Description

\-

### Solution

Diberikan file txt sebagai berikut

```
Cjixoxv Qxvxtp qz ZBJCV 2022!

Wxz cjonx! Xfxgxw gxizxt djlcjoxtpxv ntvng djlgyofjvzcz?
Gnwxlxf gxizxt cjonx fntux cjoxtpxv uxtp cxox qjtpxtgn!
Cjoxtpxv vzqxg wxtux djlqxofxg fxqx gxizxt cxex, vjvxfz
enpx vjlwxqxf vjoxt-vjoxt gxizxt, exqz vjvxfixw cjoxtpxv!
Xuy xmxiz fjlenxtpxton qjtpxt ojojkxwgxt cyxi ztz!
Gxon fxcvz dzcx! ztz, bixptux xqx qzdxmxw ! 
ZBJCV22{1ii_cv4u_du_u0nl_c1q3_qdx943210}
```

Gunakan quipquip , mendapatkan string yang bisa terbaca namun ada beberapa kesalahan. Lakukan pembenaran secara manual dengan memetakan nilai yang tepat. Berikut pemetaan yang kami gunakan untuk mendapatkan flag

```
Cjixoxv=Selamat Qxvxtp=Datang qz=di ZBJCV=IFEST cjonx=semua 
djlcjoxtpxv=bersemangat
```

<figure><img src="https://lh7-us.googleusercontent.com/ZXYZJae50Rs0F1yHlQRN5cNHd56LB7jxdThI2kl8Fwv3Z-FHYhs1JRfFeb4wJme5jirewBCUma9f7IShFUjwbjXtxPYvPHnZbqLINpPu9ukJFq2MN1X2U-YX6Si73YdgTpMH9MQQMotzlxXVOjeEPYk" alt=""><figcaption></figcaption></figure>

Flag : IFEST22{1ll\_st4y\_by\_y0ur\_s1d3\_dba943210}

## Kisinik Kripti Algoritem (223 pts)

### Description

\-

### Solution

<figure><img src="https://lh7-us.googleusercontent.com/aptlOeM-IWJJaa8omNAZiAjn1Dqbv5J1J2Xeug9_-gsLve-nOrHtDIejM6ebRWAKxQ5VhUD8VxN2hwJj96FwypblDrJQytI1ruafYpIhkDWXax9TRPNJm8tGh9ROShN_HM5y-ekqIS9YuliR-qo869c" alt=""><figcaption></figcaption></figure>

Bisa dilihat hasil enkripsi berulang dan nilai untuk setiap index sama pemetaannya. Misal AB dengan CB , maka nilai ciphertext B akan sama. Jadi tinggal leak semua kemungkinan dan petakan ke plaintext. Berikut solver yang kami gunanakn

```python
from pwn import *
import string

length = 38
r = remote("103.185.38.244",9989)

r.recvuntil(b"Pilih: ")
r.sendline(b"3")
r.recvuntil(b"Hasil: ")
ct = r.recvline().strip().decode()
list_pt = string.printable[:-6]
list_map = [[] for _ in range(length)]
for i in list_pt:
	r.recvuntil(b"Pilih: ")
	r.sendline(b"1")
	r.recvuntil(b"string: ")
	payload = i.encode()*length
	r.sendline(payload)
	r.recvuntil(b"Hasil: ")
	tmp = r.recvline().strip().decode()
	for j in range(len(tmp)):
		list_map[j].append(tmp[j])
flag = ""
for i in range(len(ct)):
	flag += list_pt[list_map[i%length].index(ct[i])]
print(flag)

```

<figure><img src="https://lh7-us.googleusercontent.com/wTezxxfVQc8_ubf1nndoLUvhrlHB3x0jrmLydQTPvehnBFlvvy-WmLz40cufGW0wGQrAa-0T3IHg3Pq5ckdKuZD7R2n6zzIWaTddrZSq7S6pTnBY6rQskcZZ5Ptkf4PYlwpbSt5BlIBO7vc5Y8QrSTo" alt=""><figcaption></figcaption></figure>

Flag : IFEST22{ad03h\_k03ntj1ku\_k3t4hu4n\_ini\_random\_string\_biar\_ga\_di\_brute\_force\_sama\_kamu}

## Kepapasan (431 pts)

### Description

\-

### Solution

Diberikan source code sebagai berikut

```python
from Crypto.Cipher import AES
import random
from Crypto.Util.Padding import pad


# J: So for the key, I use 5 random digits and repeat it until i get 16 bytes
# M: What? Man, i was using the exact same formula!

first_key = b""
second_key = b""
FLAG = b"IFEST22{REDACTED}"

def generateKey():
	global first_key, second_key
	first_key = (str(random.randint(0, 99999)).zfill(5)*4)[:16].encode()
	second_key = (str(random.randint(0, 99999)).zfill(5)*4)[:16].encode()

def encrypt(plaintext, a, b):
	cipher = AES.new(a, mode=AES.MODE_ECB)
	ct = cipher.encrypt(pad(plaintext, 16))
	cipher = AES.new(b, mode=AES.MODE_ECB)
	ct = cipher.encrypt(ct)
	return ct.hex()

def main():
	generateKey()
	print("Here's your flag, but encrypted heheh:", encrypt(FLAG, first_key, second_key))
	while True:
		print("Text to encrypt:")
		plain = input(">> ")
		print("result:", encrypt(plain.encode(), first_key, second_key))

if __name__ == '__main__':
	main()

```

Mirip soal pico ctf , kebetulan kemaren ngerjain. Jadi gunakan script yang sama tinggal ubah des (di pico) menjadi aes. Vulnya adalah meet-in-the-middle , intinya decrypt hasil enkripsi known untuk key1 dan encrypt known untuk dapat key1 dimana hasil decrypt enkripsi known dengan key2 == hasil encrypt known dengan key1 . Berikut solver yang kami gunakan

```python
from Crypto.Cipher import AES
import random
from Crypto.Util.Padding import pad
from pwn import *

payload = b"a"
inp = pad(payload,16)
r = remote("kepapasan.user.cloudjkt01.com",9977)
r.recvuntil(b"heheh: ")
ct_flag = bytes.fromhex(r.recvline().strip().decode())
r.recvuntil(b">> ")
r.sendline(payload)
r.recvuntil(b"result: ")
enc_inp = bytes.fromhex(r.recvline().strip().decode())
r.close()
list_key1 = {}
list_key2 = {}
for i in range(0, 99999+1):
	key = (str(i).zfill(5)*4)[:16].encode()
	cipher1 = AES.new(key, AES.MODE_ECB)
	enc_msg = cipher1.encrypt(inp)
	dec_msg = cipher1.decrypt(enc_inp)
	list_key1[enc_msg] = key
	list_key2[dec_msg] = key

tmp = list_key1.keys() & list_key2.keys()
print(tmp)
index = tmp.pop()
key1 = list_key1[index]
key2 = list_key2[index]
print(f"Key 1 : {key1}")
print(f"Key 2 : {key2}")
cipher1 = AES.new(key1, AES.MODE_ECB)
cipher2 = AES.new(key2, AES.MODE_ECB)

enc_msg = cipher2.decrypt(ct_flag)
flag = cipher1.decrypt(enc_msg)
print(flag)

```

<figure><img src="https://lh7-us.googleusercontent.com/E0hiYUidIKwSp02vw-c15WjcWI8pD1Uzl-jtRcqYjXLK_aic9YXgfrKrnWbiQhEsiX_WM0uzNHafvptgD1nQVgUbFn1XU-ttpYFL13NHN41_Vs6jDNjazjGlj_s_GI8yQ_M-vuSUzOs9c1DqA6FG05s" alt=""><figcaption></figcaption></figure>

Flag : IFEST22{Prepare\_for\_AES\_Trouble\_and\_make\_it\_AES\_Double}

## Rabun Genap (431 pts)

### Description

\-

### Solution

Diberikan source code sebagai berikut

```python
from Crypto.Util.number import *
import random
from sympy import *

FLAG = b"IFEST22{REDACTED}"
def generate_prime():
	p = getPrime(512)
	q = nextprime(p)
	while p%4 != 3 or q%4 !=3:
		p = getPrime(512)
		q = nextprime(p)
	return p, q

def encrypt(m, n):
	return pow(m, 32, n)

p, q = generate_prime()
n = p*q
m = bytes_to_long(FLAG)

ct = encrypt(m, n)

file = open('out.txt', 'w')
file.write(f"n = {n}\nct = {ct}")

```

p dan q bisa didapat dengan square root lalu next prime. Untuk decrypt mendapatkan referensi berikut <https://github.com/Hong5489/0x41414141-CTF/tree/main/easyrsa> . Karena e=32 , maka e = 2^5 . Jadi bedanya tinggal nambah 1 loop saja

```python
from Crypto.Util.number import *
import gmpy2
from sympy import *

n = 167369799324048138104052175535407583505752871957215436773759031023017258211926244898005523956634683846521843112989667257058661590892952518940981897603075244277403071620405906110395876285850586645267366109871364424530232323323093329164542366451609555755793278574306885322737868611730986497942446035931912990173
c = 21531359371326785000813539498235533853399851284161815602787505606478539937473829218703225074127036671433545623422527404993307032442845415396127106566947516725271774364574823414757530290809389432379888075234068890851808191948433382743838583087849527954870829102252458108566336758346284806983878333023038231317
tmp = gmpy2.iroot(n,2)[0]
q = nextprime(tmp)
p = n//q
e = 32
phi = (p-1)*(q-1)
d = inverse(e,phi)
# m = pow(ct,d,n)

def egcd(a, b):
	if a == 0:
		return (b, 0, 1)
	else:
		g, y, x = egcd(b % a, a)
		return (g, x - (b // a) * y, y)

g ,yp,yq = egcd(p,q)

mp = pow(c,(p+1)//4,p)
mq = pow(c,(q+1)//4,q)

for i in range(4):
	mp = pow(mp,(p+1)//4,p)
	mq = pow(mq,(q+1)//4,q)

r = (yp*p*mq + yq*q*mp) % n
mr = n - r
s = (yp*p*mq - yq*q*mp) % n
ms = n - s
for num in [r,mr,s,ms]:
	print(long_to_bytes(num))
```

<figure><img src="https://lh7-us.googleusercontent.com/98r-1CZskB8fFKhWkL7B_ukkozfVx5C0OlOcTjj3qlD3Y3FQk4i4gvAuLVAUL_9E8R9KE4mUGr3n2prugZMACEJ0pp2qgjoR01Rp9QuY8_U0ys19-ukt2QjnSD-yeSqbW8MscToPycbU8jy3mUnGJq8" alt=""><figcaption></figcaption></figure>

Flag : IFEST22{xixixi\_bapack\_rabin\_bisa\_aja}
