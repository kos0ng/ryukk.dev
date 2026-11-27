# Cryptography

<!-- challenge-index: e481745d77ebad93 -->

| Challenge | Topic |
| --- | --- |
| [number (247 pts)](#number-247-pts) | Bytewise Brute Force |
| [encryptor (409 pts)🥇](#encryptor-409-pts) | Byte Permutation, XOR |
| [valorand (490 pts)](#valorand-490-pts) | MT19937, Gray Code, LCG |
| [Regulus (490 pts)](#regulus-490-pts) | RSA, XOR Factorization |
| [see are see(500 pts)🥇](/notes/research/2022/cracking-crc32-with-forward-polynomial-constant/) | CRC32, Polynomial Recovery |
| [prospero (500 pts)🥇](/notes/research/2022/attacking-non-avalanche-aes-custom-aes-implementation/) | Custom AES, Avalanche Effect |

<!-- /challenge-index -->

## number (247 pts)

### Description

\-

### Solution

Diberikan soal sebagai berikut

```python
flag = "itf{REDACTED}"

def obfuscate(flag):
    diction = {0:1,1:2,2:3,3:4,4:5}
    flag = flag[::-1]
    temp = []
    temp.append(ord(flag[0]))
    for i in range(1, len(flag)):
        temp.append(ord(flag[i]) ^ temp[-1])
    res = []
    for i in temp:
        res.append(i + diction[i % 5])
    return res

print(obfuscate(flag))
```

Karena kita tahu nilai akhir dari flag yaitu } jadi kita bisa manfaatkan hal tersebut untuk bruteforce per byte.  Dengan algoritma yang sama kita bisa bruteforce dan bandingkan dengan hasil enkripsi. Berikut solver yang kami gunakan

```python
import string

res = [126, 39, 126, 32, 118, 47, 33, 124, 41, 77, 37, 128, 30, 113, 93, 58, 17, 121, 28, 120, 45, 87, 35, 66, 119, 14, 113, 30, 119]
diction = {0:1,1:2,2:3,3:4,4:5}

known = ord("}")
temp = [known]
flag = "}"
while len(temp)!=len(res):
	for i in string.printable[:-6]:
		tmp = ord(i)^temp[-1]
		tmp2 = tmp + diction[tmp % 5]
		try:
			if(tmp2==res[len(temp)]):
				temp.append(tmp)
				flag += i
		except Exception as e:
			break
print(flag[::-1])

```

<figure><img src="https://lh7-us.googleusercontent.com/aJ-0O9upFKGCO9xpRnD6zoVis9ieooibsxJB4z-9KwhcWAlCsQq6Qf98qDnWwiOzHsOWMVvAIu16mxAciZV2jGPO3wQfmr-gB8k7QkAYVM9XyV8P6Sk6wZBqWbb1QILXoxoumGdohT2RE1rDC8aN0s8" alt=""><figcaption></figcaption></figure>

Flag : itf{3asy\_obu5c4te\_ha\_h4\_ha\_\_}

## encryptor (409 pts)

### Description

\-

### Solution

Diberikan soal sebagai berikut

```python
from pwn import xor

def banner():
    print("""=======================================
welcome to message encryptor/decryptor
=======================================
choose one of the following options:
\033[33m
1.) encrypt
2.) decrypt\033[37m
=======================================""")

def enc(flag):
    enc = b''
    enc2 = b''
    for i in range(len(flag)):
        enc += xor(flag[i].encode(), i)
    for i in range(int(len(flag)/2)):
        enc2 += chr(enc[i]).encode() if i % 5 == 5 else chr(enc[i] - 1).encode()
        enc2 += chr(enc[eval(f'-{i+1}')]).encode()
    open('enc_message.txt', 'wb').write(enc2)


def dec(enc):
    print("Accidently delete the decryption function, can you help me to fix it?")
    

def main():
    banner()
    while True:
        try:
            choice = int(input("choose method \033[33m>>>\033[39m "))
            if int(choice) == 1:
                msg = input("enter the message: ")
                if len(msg)%2 != 0:
                    print("encrypted message should be even!")
                    continue
                enc(msg)
                print("message encrypted successfully!")
                exit("=======================================")
            else:
                encrypted = open('enc_message.txt', 'rb').read()
                dec(encrypted)
                exit("=======================================")
        except ValueError:
            print("invalid input, please input number above")
            continue
        except KeyboardInterrupt:
            print("\nbye")
            exit("=======================================")

if __name__ == "__main__":
    main()

```

Kita bisa mendapatkan nilai flag dengan mengembalikan index flag kembali seperti awal (index setelah di encrypt adalah index 0 , index -1, dst ) . Kemudian tinggal +1 xor dengan index untuk nilai pada index  0 - len(flag)//2 dan xor dengan index saja untuk len(flag)//2 - len(flag). Berikut solver yang kami gunakan

```python
enc = "hXtVcFwK6QcPt~}vVBiha~i}_F`vP#9u~JMaj|"

pref = ""
suff = ""
for i in range(0,len(enc),2):
	pref += enc[i]
	suff += enc[i+1]
dec = pref + suff[::-1]
flag = ""

for i in range(len(dec)//2):
	flag += chr((ord(dec[i])+1)^i)
for i in range(len(dec)//2,len(dec)):
	flag += chr((ord(dec[i]))^i)
print(flag)
```

<figure><img src="https://lh7-us.googleusercontent.com/U3L_2sQ-i-7Yl2QPulWA0mwlubVG_6AE0l1U2CCmDOPIYscOL0HpCLr24TaeutbsYaVOCS8fkpSDd5tlF0FrWj_lIKDY4SpOv1j2XQ0G1QMbVausOWK-4UcdUY68qfpZk4wp9x6uS_MnA-PTJZbdsIk" alt=""><figcaption></figcaption></figure>

Flag : itf{3asy\_chall\_5o\_you\_c4n\_get\_happier}

## valorand (490 pts)

### Description

\-

### Solution

Diberikan soal sebagai berikut

```python
#!/usr/bin/python3
from Crypto.Util.number import *
import random, os, base64
from libnum import grey_code
from valo import agents, maps, flag

LEN = 32
SECRET = os.urandom(LEN//2)

def next_prime(x):
    y = x | 1
    while not isPrime(y) or y == x:
        y += 2
    return y

def they_are_so_dead(x):
    a,b,c = x[0],x[1],x[2]
    for i in range((LEN << 11)+1):
        a,b,c = list(map(grey_code, [a,b,c]))
    return [a,b,c]

def invitation_code(x):
    z = random.getrandbits(x * 8)
    # print(z)
    rand = z.to_bytes(x, 'little')
    return rand.hex()

class RANDOM:
    def __init__(self, seed, m):
        self.seed = seed
        self.m = next_prime(m)
        self.a = random.randint(1, m-1)
        self.c = random.randint(1, m-1)

    def next(self):
        self.seed = (self.seed * self.a + self.c) % self.m
        return self.seed

def encrypt(secret,mod):
    seed,mod = bytes_to_long(secret),int(mod[:LEN],16)
    prng = RANDOM(seed, mod)
    l_rand = they_are_so_dead([prng.next() for _ in range(3)])
    return base64.b64encode(b' >//< '.join([long_to_bytes(i) for i in l_rand])).decode()

def banner():
    print("\n" + "="*15 + " Hallo Pemain Satu " + "="*15)
    print("\n1) Get Invitation Code")
    print("2) Encrypted Secret")
    print("3) Guessing for Flag")
    print("4) I Don't Care\n")

while True:
    try:
        banner()
        choose = int(input("> "))
        if choose == 1:
            print("Hey mike, Let's play Valorand\n")
            print(f"Here's my Invitation Code: {invitation_code(LEN)} ")
        elif choose == 2:
            print(encrypt(SECRET, invitation_code(LEN)))
        elif choose == 3:
            print(SECRET)
            awikwok = bytes_to_long(SECRET)
            print(awikwok)
            idx = awikwok % len(agents)
            print("\nAs a friend, I'll test you to guess my favourite Agent & Map. Would ya?")
            ga = input("Your guess (agent): ")
            if (ga == agents[idx]):
                idx = (awikwok//(idx+1)) % len(maps)
                gm = input("Your guess (map): ")
                if (gm == maps[idx]):
                    print("No way, I bet you can't leaked my Secret haha")
                    gs = input("Secret (in hex): ").strip()
                    if (bytes.fromhex(gs) == SECRET):
                        print(f"Well, I think you deserve this {flag}")
                        exit()
                    else:
                        print("Ohhh damnn so close")
                        exit()
                else:
                    print("Wrong!")
                    exit()
            else:
                print("Wrong!, pffftt ur not my friend")
                exit()
        elif choose == 4:
            print("Understandable, Have a Great Day")
            exit()
        else:
            print("You choose violence huh?!\n")
    except:
        break

```

Untuk nilai getrandbits kita bisa predict, kita hanya perlu mendapatkan 624\*32 bits number untuk dapat memprediksi nilai selanjutnya. Untuk grey\_code bisa di reverse dengan function dari libnum yaitu rev\_grey\_code. Untuk class RANDOM merupakan lcg, jadi bisa dicrack untuk nilai nilai multiplier dan incrementnya dengan minimal 3 states yang diketahui. Selanjutnya kita perlu mendapatkan state awal, bisa dengan melakukan modular inverse terhadap nilai multiplier lalu dikalikan dengan state dan disubtract dengan nilai increment (<https://stackoverflow.com/questions/2911432/reversible-pseudo-random-sequence-generator>) . Setelah dapat nilai secret tinggal lakukan hal yang sama seperti pada soal dan dapat flag. Berikut solver yang kami gunakan

```python
from pwn import *
import base64
from Crypto.Util.number import *
from randcrack import RandCrack
from libnum import rev_grey_code
from valo import agents, maps, flag

LEN = 32

def int_from_bytes(xbytes: bytes) -> int:
    return int.from_bytes(xbytes, 'little')

def decrypt(ct,mod):
    seed,mod = bytes_to_long(secret),int(mod[:LEN],16)
    prng = RANDOM(seed, mod)
    l_rand = they_are_so_dead([prng.next() for _ in range(3)])
    return base64.b64encode(b' >//< '.join([long_to_bytes(i) for i in l_rand])).decode()

def rev_they_are_so_dead(x):
    a,b,c = x[0],x[1],x[2]
    for i in range((LEN << 11)+1):
        a,b,c = list(map(rev_grey_code, [a,b,c]))
    return [a,b,c]

def gcdExtended(a, b): 
    if a == 0 :  
        return b,0,1
    gcd,x1,y1 = gcdExtended(b%a, a) 
    x = y1 - (b//a) * x1 
    y = x1 
    return gcd,x,y
      
def modinv(b, n):
    g, x, _ = gcdExtended(b, n)
    if g == 1:
        return x % n

def crack_unknown_increment(states, modulus, multiplier):
    increment = (states[1] - states[0]*multiplier) % modulus
    return modulus, multiplier, increment

def crack_unknown_multiplier(states, modulus):
    multiplier = (states[2] - states[1]) * modinv(states[1] - states[0], modulus) % modulus
    return crack_unknown_increment(states, modulus, multiplier)

def next_prime(x):
    y = x | 1
    while not isPrime(y) or y == x:
        y += 2
    return y

class Rnd:
	
	def __init__(self,state,mod,inc,mul):
		self.x = state
		self.M = mod
		self.A = mul
		self.C = inc
	
	def prev(self):
		ainverse = gcdExtended(self.A, self.M)[1]
		self.x = (ainverse * ((self.x) - self.C)) % self.M
		return self.x;

rc = RandCrack()
# r = process("./chall.py")
r = remote("15.235.143.42",24480)
r.recvuntil(b"> ")
for i in range(78):
	r.sendline(b"1")
	r.recvuntil(b"Code: ")
	tmp = int_from_bytes(bytes.fromhex(r.recvline().strip().decode()))
	while tmp > 0:
		rc.submit(tmp % (1 << 32))
		tmp = tmp >> 32
r.recvuntil(b"> ")
r.sendline(b"2")
tmp = base64.b64decode(r.recvline().strip().decode()).split(b' >//< ')
l_rand = [bytes_to_long(i) for i in tmp]
list_prng = rev_they_are_so_dead(l_rand)
z = rc.predict_randrange(0, 115792089237316195423570985008687907853269984665640564039457584007913129639935)
rand = z.to_bytes(LEN, 'little')
mod = rand.hex()
mod = next_prime(int(mod[:LEN],16))
mod, mul, inc = crack_unknown_multiplier(list_prng,mod)
rnd = Rnd(list_prng[0],mod,inc,mul)
SECRET = rnd.prev()
awikwok = SECRET
idx = awikwok % len(agents)
r.recvuntil(b"> ")
r.sendline(b"3")
r.recvuntil(b"(agent): ")
r.sendline(agents[idx].encode())
idx = (awikwok//(idx+1)) % len(maps)
r.recvuntil(b"(map): ")
r.sendline(maps[idx].encode())
r.recvuntil(b"(in hex): ")
r.sendline(long_to_bytes(SECRET).hex().encode())
r.interactive()
```

<figure><img src="https://lh7-us.googleusercontent.com/5pLgXRBvwZCRXB-6cJwNelbziA7hpjAWyVowuv54I3imosurzXhb1lIXgx2ZoA5uopBali0gcJQ4paEpqhSjUxjFxmMGP_mVLA_G670c_DRNHdWfrpLlsxZJNt-U_3xoJFn7YQqu_NjJUkzr9-TUM5U" alt=""><figcaption></figcaption></figure>

Flag : itf{s00000\_M4nYyy\_Vu1n3r4b1LyTYY\_iN\_r44nnD00mNe5555}

## Regulus (490 pts)

### Description

\-

### Solution

Diberikan soal sebagai berikut

```python
#!/usr/bin/env python3
from Crypto.Util.number import *

FLAG = open('flag.txt', 'rb').read()


def gen_key(e):
    while True:
        p = getPrime(1024)
        q = getPrime(1024)

        if GCD(e, p - 1) != 1:
            n = p * q
            x = (p | q) & (~p | ~q)

            return x, n


e = 17
x, n = gen_key(e)

m = bytes_to_long(FLAG)
c = pow(m, e, n)

print(f"e = {e}")
print(f"x = {x}")
print(f"n = {n}")
print(f"c = {c}")
```

x adalah p^q , jadi kami menggunakan solver berikut untuk mendapatkan p dan q <https://github.com/sliedes/xor_factor/blob/master/xor_factor.py> . Selanjutnya karena gcd(e,p-1) != 1 maka seharusnya public exponent menjadi invalid (tidak bisa langsung didapatkan plaintext dengan rsa biasa). Selanjutnya kami cek apakah q-1 relatif prima dengan e atau tidak ternyata iya. Kami coba asumsikan bahwa nilai plaintext < q , jika iya maka cukup menggunakan q saja kita bisa mendapatkan plaintext dan ternyata bisa. Berikut solver yang kami gunakan

```python
#!/usr/bin/env python3

import math
import sys
from Crypto.Util.number import *

def check_cong(k, p, q, n, xored=None):
    kmask = (1 << k) - 1
    p &= kmask
    q &= kmask
    n &= kmask
    pqm = (p*q) & kmask
    return pqm == n and (xored is None or (p^q) == (xored & kmask))

def extend(k, a):
    kbit = 1 << (k-1)
    assert a < kbit
    yield a
    yield a | kbit

def factor(n, p_xor_q):
    tracked = set([(p, q) for p in [0, 1] for q in [0, 1]
                   if check_cong(1, p, q, n, p_xor_q)])

    PRIME_BITS = int(math.ceil(math.log(n, 2)/2))

    maxtracked = len(tracked)
    for k in range(2, PRIME_BITS+1):
        newset = set()
        for tp, tq in tracked:
            for newp_ in extend(k, tp):
                for newq_ in extend(k, tq):
                    # Remove symmetry
                    newp, newq = sorted([newp_, newq_])
                    if check_cong(k, newp, newq, n, p_xor_q):
                        newset.add((newp, newq))

        tracked = newset
        if len(tracked) > maxtracked:
            maxtracked = len(tracked)
    print('Tracked set size: {} (max={})'.format(len(tracked), maxtracked))

    # go through the tracked set and pick the correct (p, q)
    for p, q in tracked:
        if p != 1 and p*q == n:
            return p, q

    assert False, 'factors were not in tracked set. Is your p^q correct?'

def main():
    n = 22451551366816023348447360202706900510830228629535815632658578221314261064933474109636193729071628012788940344452133851852017366927912454304020151569077485428297287005092834399390331099292171142378091606316748297786818433520789846641672149800540227266293454818259245555037809687786408161265527128130286378132948469437045923528803839460472658089176281722635258117945691238035953639144567185393378025198781483772862757035177291776200594778755058897094464206604922106079336841950344777388210700915854307396511199737299628895177354590685847912303822981430221023684494499862378536004374159141470325183538271583329616455757
    p_xor_q = 13325746550403466212714844471707212937581458917071528889507316337472192514813105181935336789043645998333195565571097932091147031399645852915634658166184147103093354018188111637363471637779171476786034005445587323443827018127885697909742606323087732854102560044520839819469235327883849488746246247697743171692

    e = 17
    p, q = factor(n, p_xor_q)
    phi_q = q-1
    assert(math.gcd(e,q-1) == 1)
    assert(p*q == n)
    d = inverse(e,phi_q)
    c = 9047109186695716774493044743719567175241644184089507442584534823490756021179430936117703186628297798259962946105389678055937492529139624918819050121145820040744493946685696954852665988130200490572330390736017156342489807822905818339681033123588313594877193383455078089960731734527174011784218941887134291367527052665464983565114074040366884625418398659288026406454520940740270300118969354963533194264073904597417067604434831121704761033826371763757844708719978440319590584091409656789067656896398639616192828948187752275446654682648902660578332094386655437184555798059618096082012599980495812821602065652614873657083
    print("pt < q == ",pow(c,d,q)<q)
    print(long_to_bytes(pow(c,d,q)))

if __name__ == '__main__':
    main()
```

<figure><img src="https://lh7-us.googleusercontent.com/sn3Awm_6pPt0DX0GPmLdlY1OrGLTvjShqPMWWWBsn3vd5RskwxOtjvg8qnl-YeYhdDv91FJCkA3mRC7-m4GCBTYl5Bae51Ck8_Hwy9c3CYr3l1ibqoco2DSIX-pAvawrrSXSMP94x-_QGTSAa4RFLMU" alt=""><figcaption></figcaption></figure>

Flag : itf{math\_problem\_require\_math\_solution}
