# Cryptography

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>not-so-random (100 pts)</td><td><a href="#not-so-random-100-pts">Here</a></td></tr><tr><td>two-round-rsa (100 pts)</td><td><a href="#two-round-rsa-100-pts">Here</a></td></tr><tr><td>baby-prng (100 pts)</td><td><a href="#baby-prng-100-pts">Here</a></td></tr><tr><td>i-am-legend (100 pts)</td><td><a href="#i-am-legend-100-pts">Here</a></td></tr></tbody></table>

## not-so-random (100 pts)

### Description

\-

### Solution

Given source code below

```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
from Crypto.Util.Padding import pad
import random

def chunks(lst, n):
    """Yield successive n-sized chunks from lst."""
    for i in range(0, len(lst), n):
        yield lst[i:i + n]

flag = open("flag.txt", "rb").read()
flag = list(chunks(flag, len(flag)//8))

seeds = bytearray(random.getrandbits(4) for _ in range(8))
print(seeds)
random.seed(seeds)

key = bytearray(random.getrandbits(8) for _ in range(16))
iv = bytearray(random.getrandbits(8) for _ in range(16))
cipher = AES.new(key, AES.MODE_CBC, iv = iv)

ct_lst= []
for i in range(len(flag)):
    ct_bytes = flag[i]
    for _ in range(seeds[i]):
        ct_bytes = pad(ct_bytes, AES.block_size)
        ct_bytes = cipher.encrypt(ct_bytes)
        cipher = AES.new(key, AES.MODE_CBC, iv = iv)
    ct_lst.append(ct_bytes.hex())

print(f"ct_lst = {ct_lst}")
```

So there is a seed generated from getrandbits(4) 8 times. The seed will be used as seed for random that will be used to generate key and iv. If we can leak seed we can easily generate key and iv.

Lets take a look on encryption process. In encryption process, the plaintext (flag\[i]) will be encrypted several times using the same key and iv. Number of encryptions performed base on the seed for each index. For example, for the first block plaintext if the first byte of seed is 3 the encryption will be performed 3 times. The 3 times of encryption + padding will affect to the length of the output (ciphertext). So based on this information we can leak the seed by using the length of each ciphertext block.&#x20;

* plaintext\[0] -> 16 bytes \[1]
  * enc(pad(plaintext\[0])) -> 32 bytes \[1]
    * enc(pad(enc(pad(plaintext\[0])))) -> 48 bytes \[2]

By assuming that each chunk is not more than 16 bytes, we can leak the seed by dividing the length with 16 (cause each pad add 16 more bytes). Below is the script to solve the challenge

```python
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
import random

ct_lst = ['765852323e93d7ea22803eabad3f23ba27f8738a933ac64780d5de145fe7618c2142d714e7b412d247e12823e469629f', 'a4fd67b4efc533f1caf67283b4da6289d932a32e681b41b775773cc3ff826edc3914850acdc583ded61d5855f9c976671c497d3607a0b9c4220e421f973f2b15cbf3abc334f8004834110f68a42c901cf0ba3ade7f4e3a242702066b57470373ccd4c824cae1f7fc5ac9c67afd88d51e842c1f14a008db4bfa67e3c81335cb476b13cf73c91162387f95a37c14ca4dd3f8080149f88454adf9ffcef6d05a6ebc10cfa22cb25f9e269aeeeb733544c27fd715128de3ef215db6103d4cecfdc42c45e199c49fb8f475959ce5005a808d83', 'a6b227f5cb857bfeecb5af298764cb4e9ffe54840c4e6b940a5a90298de91f326a0405c1d47d5690e0e5c1b042c6033c1f0fec87efcd3464466cf51d18a5eae02326f4ea762bb6aa46c3219f91fc83e0e93c842e64885c335e1abe293bc6d6a51529e6886a2ab0f5d2d6f500dad6ce5e', '520348a37d0004eb610cb9a315b7352386403439d463724d1d4e1bec2d5c2041be1f911bbae9374612c12141dd24192d095158af743a490f1896c38ee86aa13895e00736dbab01f09b263b6cdc7c71a5bfb1c87113a0141e06d075295e76dcf6', '3d27697fa697265ed76c0498ee8285a1d930af543b4171a56bbb262e82fdee58b252316b849f2425c115e8b89070a476', '511234c0852228c50b1bc97ab7928d99c2e237161a06c9a5fc268ddb5769c1abc698deb5f93586b8c8f1375b96d5d35bdffd28a0b1c76965217b261bef7ae00605cfb3c4d429de56c6794ed719e8991cdda33bfc59f2e37ec294f789c19c81774bcb3bd690af3e09a37160a0327f438019d37cc372076277f85a029afe3821fe75b07c6af27c20bc2a6e4af4419dd84f019c89da471dde2815dc7f9d8adec572d78d89333ee4aa530364182cb55b5a85eb38145e5e6508694af0881d48c55e7749d5ec9484c1a581a0e7a05b5ec1365c0e8d9a7304f66d6c51a5699ebd824182337ef5a90bfc9527f03c83daf038d75b', 'aeafa8570515a50fce2ac05acdce55e5b5ae218100e8c6f07373a463dd34d529a4d7925adf41053da160bb282eed8e3423d482bba7a4905b18fc658ac643f511', 'bd425afaddbd71dae3562294b911116609cdda350892ba0e916eb22ba4e7ba971ba59e724dd3659b141276a0fa4dc514']

fix_ct = [bytes.fromhex(i) for i in ct_lst]
seeds = b""

for i in fix_ct:
	seeds += bytes([len(i) // 16])

random.seed(seeds)
key = bytearray(random.getrandbits(8) for _ in range(16))
iv = bytearray(random.getrandbits(8) for _ in range(16))

cipher = AES.new(key, AES.MODE_CBC, iv = iv)
flag = b""

for i in range(len(seeds)):
    ct_bytes = fix_ct[i]
    for _ in range(seeds[i]):
        ct_bytes = cipher.decrypt(ct_bytes)
        cipher = AES.new(key, AES.MODE_CBC, iv = iv)
    flag += unpad(ct_bytes[:16], 16)
print(flag)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FXlmbds5WpNS3VuEefhDU%2Fimage.png?alt=media&amp;token=21fb4f8c-c298-45e5-ac38-dd0d8a29d74f" alt=""><figcaption></figcaption></figure>

Flag: CBC2024{okaay\_congrattsss\_\_\_this\_is\_your\_flag!!}

## two-round-rsa (100 pts)

### Description

\-

### Solution

Given source code below

```python
from Crypto.Util.number import *
import random 

def gen_key_1():
    p = getPrime(512)
    q = getPrime(512)
    e = getPrime(64)
    d = inverse(e, (p-1)*(q-1))
    n = p * q
    return e, d, n
    
def gen_key_2():
    while True:
        a = random.randint(10 ** 6, 10 ** 7)
        b = random.randint(10 ** 6, 10 ** 7)
        p = 2 * a * b + 1
        q = a ** 2 + b ** 2
        if isPrime(p) and isPrime(q):
            break
    e = 65537
    d = inverse(e, (p-1)*(q-1))
    n = p * q
    return e, d, n

flag = open("flag.txt", "rb").read()
m = bytes_to_long(flag)

e1, d1, n1 = gen_key_1()
c1 = pow(m, d1, n1)

e2, d2, n2 = gen_key_2()
c2 = pow(e1, e2, n2)

print("n1 = ", n1)
print("c1 = ", c1)
print("n2 = ", n2)
print("e2 = ", e2)
print("c2 = ", c2)
```

So there is 2 function provided, gen\_key\_1 and gen\_key\_2. Nothing interesting in gen\_key\_1, so lets continue on gen\_key\_2. gen\_key\_2 create prime based on a and b. Lets check the constructed prime

* a = randint(10^6,10^7)
* b = randint(10^6,10^7)
* a and b maximum value is 10^7
* so the upper value of p and q will be
  * p < 2 \* 10^7 \* 10^ 7 + 1
    * p <= 200000000000001 (48 bits)
  * q < (10^7)^2 + (10^7)^2
    * q < 20000000000000000000000000000000000000000000000000 (164 bits)

From above equation we know that the maximum bits for p is 48 bits and q is 164 bits which we know is not a secure factor. In this case we can factorize it using sage. After we leak the factor of key\_2, we will get e1, lets continue to key\_1. key\_1 is used to do the encryption but it actually not encryption process, it is a decryption process because it use d1 as a power. So to get the m value we just need to do the power of e1 by the concept of RSA. Below is the script to solve the challenge

```python
from Crypto.Util.number import *

n1 =  120274584926541650596150802553551319268524213527113984388746342438726490855541620904028486319085558586715716888717657377022076473141689082483027882849704525356968708862701962833622228590119398076286388002907369453772835055261697787362038295629394379921129929348191129212370757944744217440392141398955229977113
c1 =  2672355857507683939061074831074000539151281451144553949968331484111770870732146056294273025467737338511872585686266563419100339128601898887069672988800149659879717318703718892293055106734019046295414118956831550830447946891346566744632171639767937023229712954825142727022709039850125374703635427299356076669
n2 =  1644602928672495425615641921
e2 =  65537
c2 =  109755987858753270782749734

fact = list(factor(n2))
p2 = fact[0][0]
q2 = fact[1][0]

phi = (p2 - 1) * (q2 - 1)
e1 = pow(c2, inverse(e2, phi), n2)

print(long_to_bytes(pow(c1, e1, n1)))
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F2353mHqePp9Dqza91qcQ%2Fimage.png?alt=media&amp;token=f7297bb4-5e8b-430e-b0bc-12c01f0758e1" alt=""><figcaption></figcaption></figure>

Flag: CBC2024{hope\_you\_are\_not\_using\_automation\_tools\_for\_this\_:(}

## baby-prng (100 pts)

### Description

\-

### Solution

Given source code below

```python
import random
from Crypto.Util.number import *

class LCG:
    def __init__(self, state, a, c, m):
        self.state = state
        self.a = a
        self.c = c
        self.m = m

    def next(self):
        self.state = (self.a * self.state + self.c) % self.m
        return self.state
    
state = ## REDACTED ##
a = ## REDACTED ##
c = ## REDACTED ##
m = 2594826617
LCGs = LCG(state, a, c, m)

ct_lst = []
flag = open('flag.txt', "rb").read()
for i in range(0, len(flag), 3):
    pt = bytes_to_long(flag[i:i+3])
    ct = LCGs.next() ^ pt
    ct_lst.append(ct)

print("ct_lst =", ct_lst)
```

From code above we know that the challenge use LCG as the RNG. In this case we know that increment, multiplier, and state are unknown. Flag are processed 3 bytes each time, based on the LCG crack algorithm i know we need to get at least 3 states to leak the unknown multiplier. We know that the format flag is "CBC2024{" which is 8 bytes. So basically we just need to brute 1 byte to crack the unknown multiplier. After we leak the multiplier we need to leak the increment than just use known state to generate the next state and do decryption using xor. Below is the script to solve the challenge

```python
import random
from Crypto.Util.number import *
from functools import reduce
from math import gcd


def egcd(a, b):
    if a == 0:
        return b, 0, 1
    else:
        g, x, y = egcd(b % a, a)
        return g, y - (b // a) * x, x


def modinv(b, n):
    g, x, _ = egcd(b, n)
    if g == 1:
        return x % n


def crack_unknown_increment(states, modulus, multiplier):
    increment = (states[1] - states[0] * multiplier) % modulus
    return increment


def crack_unknown_multiplier(states, modulus):
    # multiplier = (states[2] - states[1]) * modinv(states[1] - states[0], modulus) % modulus
    multiplier = (states[2] - states[1]) * inverse(states[1] - states[0], modulus) % modulus
    return multiplier


def crack_unknown_modulus(states):
    diffs = [s1 - s0 for s0, s1 in zip(states, states[1:])]
    zeroes = [t2 * t0 - t1 * t1 for t0, t1, t2 in zip(diffs, diffs[1:], diffs[2:])]
    modulus = abs(reduce(gcd, zeroes))
    return modulus


class LCG:
    # Xn = (a*Xn-1 + c) % n
    def __init__(self, seed, a, c, m):
        self.seed = seed
        self.a = a
        self.c = c
        self.m = m

    def next(self):
        self.seed = (self.a * self.seed + self.c) % self.m
        return self.seed

import string

known = [b"CBC", b"202"]
ct_lst = [2102339510, 201697442, 2493158946, 166672257, 3789596, 1160668690, 1481975077, 2124350211, 943329066, 2044520621, 82513028, 2207880904, 1436817304, 1083426542, 35086421, 1371601831, 1511718692, 1079607174]

what = []
for i in string.printable[:-6]:
    known_elements = []
    for j in range(len(known)):
        known_elements.append(bytes_to_long(known[j]) ^ ct_lst[j]) # 0, 1
    known_elements.append( bytes_to_long(b"4{" + i.encode()) ^ ct_lst[2])
    modulus = 2594826617
    flag = b"CBC"
    try:
        multiplier = crack_unknown_multiplier(known_elements, modulus)
        increment = crack_unknown_increment(known_elements, modulus, multiplier)
        lcg = LCG(known_elements[0], multiplier, increment, modulus)
        tmp = []
        for k in range(1, len(ct_lst)):
            flag += long_to_bytes(lcg.next() ^ ct_lst[k])
        if flag[-1] == ord('}'):
            print(flag)
    except Exception as e:
        continue
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FhmEb6bZG5dvPIDJYtsf3%2Fimage.png?alt=media&amp;token=8bd48075-cfdf-471b-b026-39a391f532d6" alt=""><figcaption></figcaption></figure>

Flag: CBC2024{simple\_linear\_congruential\_generator\_cracks}

## i-am-legend (100 pts)

### Description

\-

### Solution

Given source code below

```python
from Crypto.Util.number import *

flag = open("flag.txt", "rb").read()
binFlag = "".join([bin(i)[2:].rjust(8, "0") for i in flag])

p = getPrime(64)
c_list = []
for b in binFlag:
    e = getPrime(32)
    res = pow(e, 2, p)
    if b == "1":
        c_list.append(res)
    else:
        c_list.append(-res % p)

print("p =", p)
print("c_list =", c_list)
```

From above code we know that there is to possibility of value in c\_list, 1 if the value is square number and 0 if the value is not square number. To solve this challenge we can utilize legendre symbol.

* pow(i, (p - 1)//2,  p)
  * if return is 1 , it is modular square number
  * if return is 0, it is not a modular square number

After that just convert it back to bytes. Below is the script to solve the challenge

```python
p = 13457617796272697239
c_list = [6747678029406146790, 6429137654571782929, 6815591572589228598, 9272272846953042229, 1979866594910995230, 6543048637259252670, 8600255847292956961, 11731287822212691121, 2887126569872016270, 1589127929151525762, 8705614457292541189, 11993730099017081629, 6991717183521025710, 460128324708618918, 9873151435894151161, 1786665559131690558, 3802999540842887958, 2021734947392880642, 3049401070771518030, 3185925337971266598, 6851692886775926358, 7257482692203008838, 3446411849821482282, 5121052759401616489, 8732832099256512150, 5262097366008097518, 8720284425689098441, 8256687472569081529, 1608893843699880030, 12636943331177251357, 3314547290242894530, 8047547491801554150, 7090228296021017478, 9223398722865486637, 1317142905323001042, 11217220692721226401, 11865299100767788309, 5512565475092604678, 8573133863107863918, 12068657169626006077, 7585260006787275198, 7678011586830238590, 3371764986441306090, 4373424860339736090, 8806828820078670030, 2022674977037622798, 10437060519048952441, 4803157149104929278, 6810668235528696078, 12066764654289489349, 12114769234736077849, 4671171425326754209, 1972061618802815430, 5910197921981358769, 9544659472297244509, 629660863858501950, 5503783124252161470, 12679633230414591169, 6403535585026180969, 10373358858252186889, 4520985545886215250, 3620170429533039510, 3027438159996151362, 12843367898282373169, 3997787210896327158, 5166009646190377009, 4503872494586109030, 9133504128578307109, 12635286241303677961, 10238845645334419129, 3389992156339159050, 10823390352051838201, 2398056889580070270, 3640200644674106682, 5464531895121854358, 1409874393653041758, 1349679427829664210, 7300724192146992438, 4622555930269182049, 4792057450505185530, 12076956027872929477, 8897244795689850961, 6792178315540652190, 9395955707435147041, 4250316889533958242, 11543309981703000601, 7224068906692519249, 13358879392506766561, 5086601741049599910, 4531240071721074402, 5038925652024950449, 5162221061690201718, 160955715672154962, 4012957087831361802, 9085439202999225361, 8066365684267511238, 1860020287942650990, 3382976806401101370, 12215139209876962921, 10630819663124514709, 11802281777741136889, 956267266121731122, 4739023846114187569, 6759563669841055921, 828679924973910990, 6069682477969608481, 10572948817312194769, 12784914923776803721, 1907233899268958910, 9713001153697953721, 5914456188326319001, 7916386809541708969, 4121545655567936310, 12650333706243639121, 8168636145858722358, 7875069319516562881, 11094679881387501169, 5654639558509651609, 6348486743408807449, 7413486803092978609, 6366455947150553430, 5044681365351196969, 12984258630061847041, 681968297955584562, 10061981528464773469, 1853111793105000870, 12763960432397697961, 203633682517501290, 11316110345339573629, 13011869194008253321, 3390477912731392482, 6006728067384072961, 7017480327946333590, 3832879034504796522, 8030621272014728190, 4656362019458949361, 8784775564240334797, 7360807052923494361, 7794531949203472201, 13253751228073340749, 10687908447321214237, 7472191609270950750, 8208106211799774361, 6526864711271439438, 3862837966927503318, 11631810983012839921, 5290647649221542521, 7921551154195904238, 7467678677484712129, 8598329787337429129, 9720320933904826789, 6478918623474744001, 2873274815752506510, 2582789130810780522, 3107455236159162810, 13291728585746982949, 3472110366746660682, 3635605202419174398, 5047111141242150630, 1611239596516841922, 2543344143521440398, 7906509246087761761, 10704185843206093681, 6269753077748355001, 3856154025221465550, 6886208426182083769, 987554837566485078, 12883871111796782269, 12139116570172856749, 8751917148241772761, 11025092347969866469, 950687042011010610, 947968598739374010, 6754825934829011209, 7316930363176005049, 13178201074935148849, 3433389244275495870, 868923003157610850, 12084400252796185609, 12972485652919157401, 686774576360131590, 7924569238828466449, 9309026295290708317, 660806874531920838, 5760373801428605190, 4716408955026266370, 5235022382597402641, 5178419822051213838, 5710843220716917721, 10438921537209145789, 7836847360572307590, 10953060003613133677, 3576626027380964070, 10320088074437593321, 916559587058304930, 9882987016637521309, 5951403953665902601, 13054269146034486157, 6051091159778886390, 13379322186328785241, 12976542463561612549, 11273308893497971609, 7448799760115629969, 6375585514111136761, 6196725748322260230, 3766724456427856398, 5911618775180249041, 11063610850541639569, 7087208545765518150, 6804662429806394521, 8174750914648154838, 11815552397300391601, 9846513992655971401, 12058843102695081001, 6699477549381340201, 4140137860587905370, 8609977140455931469, 5320988848166543161, 2789851711520892810, 1486812801113674470, 597329662892073918, 4887278881626113569, 5201148479115459649, 9810144802774519837, 8290056880033414950, 12692732525022727321, 2172821192045232762, 7096759974896256918, 4764591484348725241, 3415858822124637810, 170438334085124358, 3512808606768739830, 3956622269633606190, 7423281951907862401, 11399550835164035569, 4891112475252237390, 8970809493574919149, 2318812759067780670, 13138257241733475637, 4806691525773413329, 7930687378955040030, 5090584548047999641, 975548552815634202, 10661212124929775029, 2968057372647623670, 4807641978382628202, 1064508092500676850, 10884770847283496881, 6679813524204504630, 3331350759497368530, 7362866926435961310, 7341651009176438161, 7086466976198018161, 12035289393075314521, 2438200979602357002, 585123926365444530, 3481194103072594278, 6614594454151681321, 5520174858690426169, 9906095909209219801, 7511766699395899590, 3231858671992917318, 11196449377387776877, 13185010762098042169, 8447766067344879990, 8101508174096855281, 5607910961355746761, 13343828303519547289, 5800596093745731630, 1043941042578763050, 8227858844881273110, 6159692600343585601, 12033714598720206877, 10515141300963751321, 7469767014813677401, 459609227961036630, 5856004147929440521, 6922839059172370998, 8965373031097631509, 7091881644971807401, 3591152819193321558, 7716560831314406569, 6844186003802667529, 6860509982871522270, 8546447506824111870, 7981383960851141478, 11785281187694091289, 12081528238131614089, 4128722192278906350, 9105885383843513521, 6472562108806040809, 116458738227167358, 2317498635370129002, 4038504527020970358, 9448185720252355129, 593934702684225162, 11978605766868055789, 3636032355572990490, 5479266490329856249, 1306140968348155830, 1796173792667996202, 2420329148601236682, 2146128307483707870, 5002297398398587470, 5248327743816155550, 5500124470681329889, 11090653867124268889, 2353958405052710202, 5682783746184154009, 5718308949093405678, 3371279914452284718, 4856749862204643001, 6577629960162602958, 8571265913627017350, 965052589018427370, 5071741238155532838, 6992364974468480790, 8603996372693175630, 7633270380841923798, 9574690763380677841, 9588663349972830757, 1801462039159906878, 1774554282271191282, 1058606303076791118, 10818351362011147477, 9876116066303102557, 4432497918684351798, 12687508953367914961, 7683903756603512790, 3554060828702353950, 3865508833662299850, 9888232213245407389, 4399651020229639110, 8735432136749801149, 5765621299421372598, 6439586048966798809, 12459962449290711829, 8865154140301238641, 10913637056926283761, 8941540921115456809, 12013167527918765569, 6601968566994485161, 11927620611185524789, 8838316774572510241]

flag = ""
for i in c_list:
	if pow(i, (p - 1)//2, p) == 1:
		flag += "1"
	else:
		flag += "0"


real_flag = ""
for i in range(0, len(flag), 8):
		real_flag += chr(int(flag[i:i+8], 2))

print(real_flag)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FuymyqtLZXpzYCTQiF9HB%2Fimage.png?alt=media&amp;token=6c2fdb1b-798c-400a-878b-7dd83ec7d437" alt=""><figcaption></figcaption></figure>

Flag: CBC2024{OK\_now\_submit\_this\_flag\_quickly!!!}
