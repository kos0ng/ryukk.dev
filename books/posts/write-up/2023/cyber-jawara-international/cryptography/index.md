# Cryptography

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>Oreo (495 pts)</td><td><a href="#oreo-495-pts">Here</a></td></tr></tbody></table>

## Oreo (495 pts)

### Description

\-

### Solution

Given challenge below

```python
#!/usr/bin/env python3
from Crypto.Util.number import getRandomRange, isPrime
from secret import FLAG, z

def nextPrime(a):
    b = a | 1
    while not isPrime(b) or a == b:
        b += 2
    return b

def getPrime(z):
    while True:
        a = nextPrime(getRandomRange(z // 2, z - 1))
        b = nextPrime(getRandomRange(z // 2, z - 1))
        p = a * pow(z, 2) + b
        if isPrime(p):
            return p

m = int.from_bytes(FLAG, "big")
e = 65537
p = getPrime(z)
q = getPrime(z)
n = p * q
c = pow(m, e, n)

print(f"{z = }")
print(f"{e = }")
print(f"{n = }")
print(f"{c = }")

```

We know that the factor of n (p and q) calculated from linear operation which is a \* pow(z, 2) + b. In this case we know z and n. If we convert n to equation that contains z it should be like this

| z^4\*a1a2 + z^2\*a1b2 + z^2\*b1a2 + b1b2 |
| ---------------------------------------- |

Since it is z^4 also a and b value lower than z we can get value of a1a2 by dividing it with z^4 then subtract by one. After getting a1a2 value, we can get the value of (a1b2 + a2b1) through equation below

| <ul><li>n - z^4*a1a2  =  z^2*a1b2 + z^2*b1a2 + b1b2</li><li>z^2*a1b2 + z^2\*b1a2 + b1b2 = z^2(a1b2  + a2b1) + b1b2</li></ul> |
| ---------------------------------------------------------------------------------------------------------------------------- |

Repeating the same way, we can get a1b2 + a2b1 by dividing it with z^2. After that we can get b1b2 since we know the rest value. Since we have a1b2 + a2b1 we can square it to get (a1b2)^2 + 2(a2b1a1b2) + (a2b1)^2 then since we know a2b1a1b2 we can substract those equation with 4(a2b1a1b2) and then we have equation in format a2 - 2ab + b2 which has root a-b or in this case a1b2 - a2b1. After that just eliminate 1 value then substitute it to get a1,a2,b1,and b2. After that we can reconstruct the p and q then decrypt the flag. Here is the implementation in python

```python
import gmpy2
import math
from Crypto.Util.number import *

z = 39034347554788886188862828900368120155828678821750756988259309575481111063637738059399123616138932815543173268897792
e = 65537
n = 2321010676166719118897826665875390682891949606512201428283248708840614266911157720553883983862075137533586180681806316522480374692719265009808209053436714133474159477242844656189854107104663916817618923342109557206226391708294059163789479444486374971847213643475786053872372075542905820258894793750064557484808755431002123838035881052516897396197497957299308002263522728187179713121836248578666705684511079444259620989928479107549061487480987290742958002393670323319548185012995139274218132931936277332139730630343391164855300595117539322314890049895741401684432438694821530311996068879896537317508586484401630348743550618039575684244050728491184825105784844388851371116518367199401684996302759
c = 2032919062393150283468406176591317257678226420131066911193262489006912230326726006846206142563260467940585484438197136926144142653746060997326221963056979545689389889833813269426801682762389633865027900173483649597369907139278474124244103625917238223653479788470555295105394419509207014387728816355944680139093327582447577348161001287641847786152028938129175974936823892356898440150885828648909449789673082354855211136511758227279525345406511178080957291892414222370079885248860756767484870395397898120895895207160829963016245342715094241989315582495873067530842016551465937663014265681112175004893952724133325729904032144226139069856555075561157269720291056671679616474431424342058838104372127

a1a2 = n//z**4
a1a2 -= 1


tmp = n - (z**4)*a1a2

a1b2_add_a2b1 = tmp // (z**2)
b1b2 = tmp - (z**2) * a1b2_add_a2b1


zzz = a1b2_add_a2b1**2 - 4*(a1a2*b1b2)
a1_sub_b2 = gmpy2.iroot(zzz,2)[0]
tmp2 = a1_sub_b2 + a1b2_add_a2b1
tmp2 //= 2
b2 = math.gcd(tmp2,b1b2)
a1 = math.gcd(tmp2,a1a2)

a2 = a1a2//a1
b1 = b1b2//b2

p = a1*pow(z,2) + b1
q = a2*pow(z,2) + b2

phi = (p-1)*(q-1)
d = inverse(e, phi)

print(long_to_bytes(pow(c,d,n)))

```

<figure><img src="https://lh7-us.googleusercontent.com/WniP21-_4KMFEEBZREyGkuwmY0Nlsk-WLOKH8NqIljzr6dG3DC7hl-RlcF02uIqgxI9eao4V75cE1-_lIowAUjizwmFJZMFrWO55pTiCxEHwspMJYDyJVBiWkEzRLbPnqAF7IBxkKcq8GBLPBeamIzU" alt=""><figcaption></figcaption></figure>

Flag : CJ2023{*diputar\_\_d1j1lat\_\_disambit*}<br>
