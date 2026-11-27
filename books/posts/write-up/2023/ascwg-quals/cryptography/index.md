# Cryptography

<!-- challenge-index: ede218dc96757711 -->

| Challenge | Topic |
| --- | --- |
| [Perfect Encryption (300 pts)](#perfect-encryption-300-pts) | Modular Equations, Discrete Logarithm |
| [Sign Hell (300 pts)](#sign-hell-300-pts) | Signature Nonce Reuse |
| [Power Times (600 pts)](#power-times-600-pts) | Discrete Logarithm, Smooth Primes |

<!-- /challenge-index -->

### Perfect Encryption (300 pts)

#### Description

Given challenge below

```python
from Crypto.Util.number import bytes_to_long, getStrongPrime
from random import getrandbits

FLAG = bytes_to_long(b"ASCWG{XXXX}")

p = getStrongPrime(512)
a, b, c = getrandbits(256), getrandbits(256), getrandbits(256)

x = getrandbits(512)
y = FLAG*x % p

f1 = (a*x*y + b*x - c*y + a*b) % p
f2 = (a*x*y - a*b*x + c*y - a*b*c) % p
f3 = (a*x*y + a*b*x - b*y + a*c) % p

print(f"{a=}\n{b=}\n{c=}\n{p=}")
print(f"{f1=}\n{f2=}\n{f3=}")
```

#### Solution

So we have equation below

$$
\begin{gathered}
f1 = axy + bx - cy + ab\\
f2 = axy - abx + cy - abc\\
f3 = axy + abx - by + ac
\end{gathered}
$$

So basically we need to recover `x` and `y` and we know `a`, `b`, and `c`. The idea i used to solve the challenge is by eliminating the variable. Here is the proof

$$
\begin{gathered}
f1 - f2 = kx - ly + d\\
f2 - f3 = mx - ny + e
\end{gathered}
$$

Variables `k`, `m`, `l`, `n`, `d`, and `e` are known so the next step is by doing `lcm` on one of the coefficent on `x` or `y`. After that just eliminate the variable and back to modulus part. For example i eliminate variable `x` so now we need to work only with variable y and some known constant which are `k`, `d`, and `e`.

$$
\begin{gathered}
k*y - d  = e \bmod p\\
k*y = e + d \bmod p\\
y = (e + d)*k^{-1} \bmod p
\end{gathered}
$$

After getting `y` next we just need to substitute `y` and one of initial equation to get `x`. To get flag we just need to inverse the `x` then multiply with `y`. Here is script i used to solve the challenge

```python
from Crypto.Util.number import *

a=104290256438464238265920655110843789355215462446618909362719610248661044655027
b=51377041544373038040355907810892111390501284088151402869947729149784382975340
c=33607469487038655534452887169909251709064921357237953655926459853107316549445
p=11777932795008234937554901192530674345218991539703072132156127068946946972145785796843203243414854874792790874422630471893317874927684942543648149902518429
f1_val=4393450432502936586942125381637603594967424429450041652241154373587594289593710667561969065441313205238350018007250796310103876164723965465384784041009952
f2_val=11758359456591126288355398100033811157654788859704663069490658186848940636735180110386914705819056992670969028976783609655478685964439506912465882470156531
f3_val=4526962740230169131710354844377916940967201676526826430849484531211915498483780757376719893812797798719451042286927996929324321141661155944161904629619229

x, y = var('x y')
f1 = (a*x*y + b*x - c*y + a*b)
f2 = (a*x*y - a*b*x + c*y - a*b*c)
f3 = (a*x*y + a*b*x - b*y + a*c)

eq1 = f1 - f2
eq2 = f2 - f3

eq1_val = f1_val - f2_val
eq2_val = f2_val - f3_val

eq1_x = eq1.coefficient(x)
eq1_y = eq1.coefficient(y)
eq2_x = eq2.coefficient(x)
eq2_y = eq2.coefficient(y)

lcm_x = lcm(eq1_x,eq2_x)

eq3 = (lcm_x/eq1_x) * eq1
eq4 = (lcm_x/eq2_x) * eq2
eq3_val = (lcm_x/eq1_x) * eq1_val
eq4_val = (lcm_x/eq2_x) * eq2_val

eq5 = eq3 - eq4
eq5_y = eq5.coefficient(y)
eq5_val = eq3_val - eq4_val

tmp = (eq5_val + (-1 * eq5.operands()[1])) 
tmp = int(tmp) % p
tmp = inverse(int(eq5_y), int(p)) * tmp
y_val = tmp % p

f1_sub = (a*x*y_val + b*x - c*y_val + a*b)
f1_sub_x = f1_sub.coefficient(x)
tmp = (f1_val + (-1 * f1_sub.operands()[1])) 
tmp = int(tmp) % p
tmp = inverse(int(f1_sub_x), int(p)) * tmp
x_val = tmp % p

flag = inverse(x_val, p) * y_val
flag %= p

print(long_to_bytes(flag))
```

Flag : ASCWG{4tt\@ck\_7h3\_Id3\@l\_w0RlD\_0f\_Gr0e6N2r$$}

### Sign Hell (300 pts)

#### Description

Given challenge below

```python
import os

FLAG = os.getenv("FLAG", "ASCWG{XXXX}")

def get_prime():
    while True:
        p = 1
        for _ in range(9):
            p *= getrandbits(64)
        if is_prime(p+1):
            return p+1

def sign(M):
    S1 = int(pow(g,k,p))
    S2 = int(((M - a*S1)*inverse_mod(k,p-1))) % (p-1)
    return S1, S2

def verify(M, S1, S2):
    return pow(A,S1,p)*pow(S1,S2,p) % p == pow(g,M,p)

p = get_prime()
g = primitive_root(p)

a = secret = int.from_bytes(FLAG.encode(), "big")
A = pow(g,a,p)

k = getrandbits(256)
while gcd(k, p-1) != 1:
    k = getrandbits(256)

public = p,g,A
private = p,g,secret

print(f"Public: ", public)
while True:
    m = int.from_bytes(os.urandom(32), "big")
    S1, S2 = sign(m)
    print(S1, S2, m)
```

#### Solution

So we can recover the flag by utilizing 2 pair of signature. First we need to substract `s2` on each pair

$$
\begin{gathered}
S_{21} = (M_1 - a*S_1) * k^{-1}\\
S_{22} = (M_2 - a*S_1) * k^{-1}\\
S_{21} - S_{22} = (M_1 - M_2) * k^{-1}
\end{gathered}
$$

Since we know values of `M1` and `M2` we can eliminate it to get `k`

$$
\begin{gathered}
(S_{21} - S_{22})^{-1} = (M_1 - M_2) * k\\
k = (M_1 - M_2) * (S_{21} - S_{22})^{-1}
\end{gathered}
$$

After getting `k` now we can recover `a` by doing equation below

$$
\begin{gathered}
(M_1 - a*S_1) * k^{-1} = S_2\\
(M_1 - a*S_1) = S_2 * k\\
a*S_1 = (S_2 * k) - M_1\\
- a = ((S_2 * k) - M_1) * S_1^{-1}\\
-1 * -a = - (((S_2 * k) - M_1) * S_1^{-1})
\end{gathered}
  $$

But since there is chance that `s1` and `k` are not coprime with `p-1` we can still get the flag by repeating request until get the flag. Here is script i used to solve the challenge

```python
from Crypto.Util.number import *
from math import gcd
from pwn import *

while True:
	r = remote("34.154.18.2", 6951)
	r.recvuntil(b"Public:  ")
	value = r.recvline().strip()
	exec(f"p, g, A = {value.decode()}")
	
	s1_1, s2_1, m1 = list(map(int,r.recvline().decode().split(" ")))
	s1_2, s2_2, m2 = list(map(int,r.recvline().decode().split(" ")))

	r.close()

	
	n = p - 1
	s2_diff = (s2_1 - s2_2) % n
	s1_inv = inverse(s1_2//(gcd(s1_2,n)), n)
	
	list_s = [m1, m2]
	for k_try in (list_s[0] - list_s[1], list_s[0] + list_s[1], -list_s[0] - list_s[1], -list_s[0] + list_s[1]):
		try:
			k_inv = (s2_diff * inverse(k_try,n) ) % n
			k = inverse(k_inv, n)
			a = (((s2_1 * k) - m1) * s1_inv) % n
			flag = -a % n
			for i in range(1,100000):
				tmp = flag // i
				tmp = long_to_bytes(tmp)
				if(b"ASCWG" in tmp):
					print(tmp)
					break
		except Exception as e:
			continue
```

Flag : ASCWG{R3uS31n9\_G4m4l\_NoNc3\_S19n1n9\_1s\_50o\_B4d\_d9ae71c5}

### Power Times (600 pts)

#### Description

Given challenge below

```python
import os
import time

FLAG = os.getenv("FLAG", "ASCWG{XXXX}").encode()

def gen_prime():
    while True:
        p = 2
        for _ in range((2<<2)+1):
            p *= getrandbits(58)
        if is_prime(p+1):
            return p+1

def encrypt():
    rand_val = getrandbits(256)
    x = G(rand_val) 
    h = g^x
    y = G.random_element()
    s = h^y
    c1 = g^y
    m = G(int.from_bytes(FLAG, byteorder="big"))
    c2 = m*s
    return (q, g, h, c1, c2), x

if __name__ == "__main__":
    q = gen_prime()
    G = GF(q, modulus="primitive")
    g = G.gen()
    print(encrypt()[0])
```

#### Solution

We can see that generated prime is `smooth`, so we can do discrete log by using `Pohlig-Hellman` algorithm. In this challenge i use sage to do the discrete log. After getting x we just need to power `c1` with `x` then inverse it. After that just multiply `c2` with inverse value then get flag. Here is the script i used to solve the challenge

```python
from Crypto.Util.number import *

# get values from service
q, g, h, c1, c2 = (875224290892889410253168846038019495397845981839895578503538762070606629236318636299280667067488152448925123623980445977018237347103987840918389215641601, 53, 668470863937718723825354309435934649904792238682832221264120364357988404177550549769338892561589799679349995460516437572438684131831080306276964600141039, 470878962668317620809812946691419181909240344358287048400184661683087768031571681980489293375447027465015614359318228582735903960499464295349483276943379, 431842574173304880865818550579295915213571302015965986053503318188592141963759191137818608526476403184681573593979962710727636081373213496309873939220545)
gp = GF(q)
cp = gp(h)
g1 = gp(g)
x = discrete_log(cp, g1)

x = 51569899004643158586115894615877127399796211204579510660966346446530141286946

tmp = pow(c1, x, q)
result = (c2 * inverse(tmp, q)) % q

print(long_to_bytes(result))
```

Flag : ASCWG{H0w\_5m0o0zy\_E1G4m4l\_c\@n\_B3\_e28b6f81}
