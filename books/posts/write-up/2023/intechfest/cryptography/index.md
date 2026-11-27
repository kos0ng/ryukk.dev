# Cryptography

<!-- challenge-index: 5a077ae5a34ffc0a -->

| Challenge | Topic |
| --- | --- |
| [Familiar (100 pts)](#familiar-100-pts) | Base32, Custom Alphabet |
| [Elysium (244 pts)](#elysium-244-pts) | Elliptic Curves, Scalar Multiplication |

<!-- /challenge-index -->

## Familiar (100 pts)

### Description

\-

### Solution

Diberikan kode berikut

```python
def encode(data):
    charset = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"
    padd = "="

    binstr = "".join(format(byte, "08b") for byte in data)
    padding = (5 - len(binstr) % 5) % 5
    binstr += "0" * padding
    groups = [binstr[i:i+5] for i in range(0, len(binstr), 5)]

    result = ""
    for group in groups:
        dec = int(group, 2)
        result += charset[dec]

    result += padd * (padding // 2)
    return result

FLAG = "flag{fake_flag_dont_submit}"
print(encode(FLAG.encode()))
```

Kode tersebut melakukan konversi dari 8 bit ke 5 bit lalu nilai dari 5 bit dikonversikan ke nilai pada charset. Jadi untuk mendapatkan plaintextnya tinggal dapatkan nilai 5 bit (dari index) lalu knoversi ke 8 bit. Berikut solver yang kami gunakan

```python
charset = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"

ct = "*&(&)<+$*\"$%+?_?:.,[;[+~+{](+`#%,|![{[*;.]^@}@,>'.:@)_\"<+.:?+`>$'\"#$#`=((|};=="

tmp_bin = ""
for i in ct:
	ind = charset.index(i)
	tmp_bin += bin(ind)[2:].rjust(5,"0")

flag = ""
for i in range(0,len(tmp_bin),8):
	flag += chr(int(tmp_bin[i:i+8],2))
print(flag)
```

<figure><img src="https://lh7-us.googleusercontent.com/ENHJ8YeDj_T5vYUGuMJwDcBA_NzFnKrL7h8jCqoCpADAJFsHmPu_304aQuwtg4OaP44Cmg4woO2QwEVF9tg7oGMXq2z-K2OJ_kKmk-7eRCpEJ1ZeCLX6BWhxqGMqQu5nSv8SUC5H-yz07naV-LZ4iQI" alt=""><figcaption></figcaption></figure>

Flag : INTECHFEST{WhY\_W0ulD\_AnY0n3\_Us3\_Th1S\_Enc0D1nG?}

## Elysium (244 pts)

### Description

\-

### Solution

Diberikan kode berikut

```python
from Crypto.Util.number import bytes_to_long
from sage.all import *


def add(G, P):
    return G + G + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + G + G + P + G + G + G + P + G + G + G + G + G + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + G + P + G + G + G + G + G + P + P + G + G + G + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + \
        G + G + P + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + P + G + G + P + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + G + G + \
        G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + \
        G + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + G + \
        G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + P + G + G


flag = open('flag.txt', 'rb').read()

p = 0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff
K = GF(p)
a = 0xffffffff00000001000000000000000000000000fffffffffffffffffffffffc
b = 0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b
E = EllipticCurve(K, (a, b))

G = E.gens()[0]

m = bytes_to_long(flag)
P = E.lift_x(Integer(m))
Q = add(G, P)

print('Q:', Q)

```

Add menjalankan operasi 288\*G + 21\*P . Karena kita tahu nilai G maka kita bisa kurangkan saja Q dengan 288\*G untuk mendapatkan 21\*P. Pada ecc terdapat konsep public dan private key dalam bentuk Q = nP dimana Q merupakan public key, n private key, dan P adalah base point. Jadi untuk mendapatkan P disini kita bisa lakukan inverse nilai n dengan order dari Q lalu kalikan dengan Q <https://crypto.stackexchange.com/questions/86663/how-to-find-the-base-point-given-public-and-private-key-and-ec-parameters-except> atau dalam bentuk persamaan adalah P = 21^-1 \* Q. Berikut solver yang kami gunakan

```python
from Crypto.Util.number import *

def add(G, P):
    return G + G + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + G + G + P + G + G + G + P + G + G + G + G + G + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + G + P + G + G + G + G + G + P + P + G + G + G + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + \
        G + G + P + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + P + G + G + P + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + G + G + \
        G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + G + \
        G + G + G + G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + G + \
        G + G + G + G + G + P + G + G + G + G + G + G + G + G + G + G + P + G + G

p = 0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff
K = GF(p)
a = 0xffffffff00000001000000000000000000000000fffffffffffffffffffffffc
b = 0x5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b
E = EllipticCurve(K, (a, b))
G = E.gens()[0]

Q = E(26326686390928441989926437302948364151298187886536227434090842323538336764500, 15057597490574272687879749163595226837809841897797118807290241444796596563842)
q = Q.order()
tmp = Q - 288*G
flag = inverse(21, q) * tmp
print(long_to_bytes(int(flag.xy()[0])))

```

<figure><img src="https://lh7-us.googleusercontent.com/gh5SUYqquCWSASSS8nqZCDUK2LnHuamu1IRJ5B8gA3gzvdHGoNfTOxVFvPlTRTfKDeerl_Do1y_U53sguBMaKtbh5L35xiNEql3nDAP8-avQFhWtLGETg5-Lui9_SOOA65paR4SuIRWSMidEnegEhTo" alt=""><figcaption></figcaption></figure>

Flag : INTECHFEST{ECC\_FUNd4m3nt4l}

<br>
