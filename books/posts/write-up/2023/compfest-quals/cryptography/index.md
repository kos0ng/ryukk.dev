# Cryptography

<!-- challenge-index: b0cf2632325957e7 -->

| Challenge | Topic |
| --- | --- |
| [choose exponent](#choose-exponent) | RSA, Small Exponent |
| [CryptoVault](#cryptovault) | ECDSA, Signature Verification |
| [Knapsack](#knapsack) | Knapsack, LLL |

<!-- /challenge-index -->

## choose exponent

### Description

\-

### Solution

Diberikan source code sebagai berikut

```python
from Crypto.Util.number import getPrime, bytes_to_long

FLAG = b"COMPFEST15{REDACTED}".ljust(256, b"\x00")

class RSA:
    def __init__(self):
        self.p = getPrime(1024)
        self.q = getPrime(1024)
        self.n = self.p * self.q
        # you can choose your own public exponent
        # self.e = 65537

    def encrypt(self, m, e):
        return pow(m, e, self.n)

    def decrypt(self, c, d):
        return pow(c, d, self.n)


def main():
    print("Welcome to RSA challenge!")
    print("In this challenge you can choose your own public exponent")

    rsa = RSA()
    m = bytes_to_long(FLAG)
    count = 0
    while count < 3:
        print("What do you want to do?")
        print("1. Get encrypted flag")
        print("2. Exit")

        option = input(">> ")
        if option == "1":
            e = int(input("Enter your public exponent (e cannot be 1 and even): "))
            if e == 1 or e % 2 == 0:
                print("loh gak bahaya tah")
                continue
            c = rsa.encrypt(m, e)
            print(f"Here is your encrypted flag: {c}")
            count += 1
        elif option == "2":
            print("Bye!")
            exit()
        else:
            print("Invalid option")
            continue
    
    print("You have reached maximum number of public exponent")

if __name__ == "__main__":
    main()
```

Jadi intinya kita bisa kontrol nilai e, karena disini nilai modulus tidak diketahui maka kita perlu leak terlebih dahulu dengan persamaan berikut

```
(m^3)^3 - m^9 = k1*n
(m^9)^3 - m^27 = k2*n
```

Dengan melakukan gcd pada k1\*n dan k2\*n kita akan mendapatkan nilai n. Selanjutnya, karena kita menggunakan nilai exponent yang kecil namun terdapat padding, maka lakukan eliminasi terhadap padding dengan melakukan inverse terhadap 256 (padding b”\x00) ^ i untuk nilai kurang dari 256 kemudian tinggal integer root. Berikut solver yang kami gunakan

```python
from pwn import *
import math
import gmpy2
from Crypto.Util.number import *

r = remote("34.101.122.7", 10004)

list_e = [3, 9, 27]
# r = process(["python3","chall.py"])
list_ct = []

for i in list_e:
	print(r.recvuntil(b">> "))
	r.sendline(b"1")
	r.recvuntil(b": ")
	r.sendline(str(i).encode())
	r.recvuntil(b"flag: ")
	list_ct.append(int(r.recvline().decode()))

eq1 = list_ct[0]**3 - list_ct[1]
eq2 = list_ct[1]**3 - list_ct[2]
n = math.gcd(eq1,eq2)

for i in range(0x100):
	try:
		new_ct = list_ct[0] * pow(inverse(256, n) ** i, 3, n)
		new_ct %= n
		print(long_to_bytes(gmpy2.iroot(new_ct, 3)[0]))
	except:
		continue
	
r.interactive()
```

<figure><img src="https://lh7-us.googleusercontent.com/KkJkZ4do0Qs2MSlpmfSlZP6Iw_DG8GpaJ9TmehMmUdZ80ZjYQOqLsGM0YiWmCqb19VSZhC78icwcv3VSaBQweJ4sWHoqRz-OEWs8UHzCtG5AB11U5iFVp1L-0kwW2NE5p_GLdnOrWkqkVySjxtIUjig" alt=""><figcaption></figcaption></figure>

Flag : COMPFEST15{bezout\_identity\_is\_key\_8316a2afd2}

## CryptoVault

### Description

\-

### Solution

Diberikan source code sebagai berikut

```python
from flask import Flask, jsonify, request, render_template
import ecdsa
import ecdsa.ellipticcurve as EC
from flask_cors import CORS
import binascii
import ecdsa.util

app = Flask(__name__)
CORS(app)

curve = ecdsa.SECP256k1
G = curve.generator
n = G.order()
x = int('ce205d44c14517ba33f3ef313e404537854d494e28fcf71615e5f51c9a459f42', 16)
y = int('6080e22d9a44a5ce38741f8994ac3a14a6760f06dd1510b89b6907dfd5932868', 16)
Q = EC.Point(curve.curve, x, y)
PUBKEY = ecdsa.VerifyingKey.from_public_point(Q, curve)

# Convert the public key to standard format
PUBKEY_str = binascii.hexlify(PUBKEY.to_string()).decode()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/verify_signature', methods=['POST'])
def verify_signature():
    data = request.get_json()
    signature_hex = data['signature']
    message_hash = int(data['message_hash'], 16)
    print(message_hash)
        # Convert the signature from standard format
    signature_bin = binascii.unhexlify(signature_hex)
    r = int.from_bytes(signature_bin[:32], 'big')
    s = int.from_bytes(signature_bin[32:], 'big')
    sig = ecdsa.ecdsa.Signature(r, s)
    result = verify_ecdsa_signature(sig, message_hash)
    
    response = {'result': result, 'pubkey': PUBKEY_str}
    return jsonify(response)

def verify_ecdsa_signature(sig, message_hash):
    m = message_hash
    if PUBKEY.pubkey.verifies(m, sig):
        return "this is the flag"
    else:
        return "skill issue ( ͡° ͜ʖ ͡°)"

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=1984)

```

Dapat dilihat bahwa message\_hash tidak dilakukan hash, jadi kita bisa input plaintext pada message\_hash. Mencari informasi mengenai hal tersebut kami menemukan referensi berikut <https://crypto.stackexchange.com/questions/48716/is-it-secure-to-ecdsa-sign-a-public-key-without-hashing-it-first> .

<figure><img src="https://lh7-us.googleusercontent.com/6I2CZ-Ag4ggL-CCS78nqzxjLRly_LNdNyv28MRujwx5EwAPMpr545JH7I7j7wG_sl-koTQGWKxjv_s_STJEMGFHeUmUyXRR3r1Qjn1dIjfSjnI6Vh7RHgJqVXtfT-3jENxAdLLtT1dirp4okrsih6pw" alt=""><figcaption></figcaption></figure>

Jadi kita bisa menginputkan null byte unutk message\_hash dan nilai r,s == x\_a , untuk nilai x\_a kami dapatkan dengan cara menambahkan print .x() pada fungsi verifies (/Users/kosong/.pyenv/versions/3.11.2/lib/python3.11/site-packages/ecdsa/ecdsa.py

).

<figure><img src="https://lh7-us.googleusercontent.com/MRidyCOio9X4d0y9RyuuVnXAj_n07GfS02a07Jl-uN8rjJXI0uKNu4B31I4XClUJzQep_c12bX2LRe7H7WbuPuN9MLkApgi1Otz3Wtzk3uaSWTeYL_thzcFHlb-Lh2JBQi3AxubytxEngVB2XkfDvA4" alt=""><figcaption></figcaption></figure>

Dapat nilai x\_a yaitu 93233629630266104566162329194337469407578449363377301369248925679328375971650, selanjutnya tinggal kirim ke server.

```python
# https://crypto.stackexchange.com/questions/48716/is-it-secure-to-ecdsa-sign-a-public-key-without-hashing-it-first
import requests
from Crypto.Util.number import *

url = 'http://34.101.122.7:10006/verify_signature'

x_a = long_to_bytes(93233629630266104566162329194337469407578449363377301369248925679328375971650).hex()
data = {
	'signature' : x_a*2,
	'message_hash' : '00'
}

print(requests.post(url, json=data).text)

```

<figure><img src="https://lh7-us.googleusercontent.com/eB55rKqwdFsb9CqEY6phnTiRb-DhmTBk7OhTFPIKhmrL2EiHyv5VqxU2m_AMCONW7Y8ZFwhMlUA6tBlhMz93Ox8Y1FvRzOYR8Upvml3ECNdJs1264l4H8Tdjzxo68cFDbQJartjiSfypPSccpEBpgDI" alt=""><figcaption></figcaption></figure>

Flag : COMPFEST15{mU57\_vErIFy\_TH3\_h4SH\_373dd88e55}

## Knapsack

### Description

\-

### Solution

Diberikan source code sebagai berikut

```python
from collections import namedtuple
import random
from Crypto.Util.number import isPrime, GCD
# from secret import message, key_size

message = b"The Merkle-Hellman Knapsack Cryptosystem, developed by Ralph Merkle and Martin Hellman, is a public-key encryption algorithm known for its resistance to attacks using conventional computers. It operates on the principle of the knapsack problem, making it difficult to solve without the private key.\nIn this cryptosystem, a superincreasing knapsack is created as the public key. Each element of the knapsack is generated using a specific algorithm, ensuring that the sum of any subset of elements is unique. This property makes it challenging to deduce the original combination used to create the knapsack.\nTo encrypt a message, the plaintext is divided into binary bits and combined with the public key. This process results in a ciphertext that obscures the original message. Decrypting the ciphertext requires the knowledge of the private key, which is a set of carefully selected parameters used to generate the knapsack.\nThe security of the Merkle-Hellman Knapsack Cryptosystem relies on the complexity of solving the subset sum problem, which is considered computationally difficult. Traditional methods, such as brute-force attacks, are ineffective due to the large search space involved. COMPFEST15{kosongblongaaa}"
key_size = 70
PrivateKey = namedtuple("PrivateKey", "W q r")
PublicKey = namedtuple("PublicKey", "B")

def to_bits(m):
    _bin = lambda b: [1 if b & (1 << n) else 0 for n in range(7)]
    return sum([_bin(b) for b in m], [])


def to_bytes(bits):
    _byte = lambda b: sum([b[i] << i for i in range(7)])
    return bytes([_byte(bits[i : i + 7]) for i in range(0, len(bits), 7)])


def pad(m):
    return m + b"\x00" * (-len(m) % (key_size // 7))


def unpad(m):
    return m.rstrip(b"\x00")


def gen_private_key(key_size):
    W = []
    s = 6969

    # generate W
    for _ in range(key_size):
        w_i = random.randint(s + 1, 2 * s)
        assert w_i > sum(W)
        W.append(w_i)
        s += w_i

    # generate q
    while True:
        q = random.randint(2 * s, 32 * s)
        if isPrime(q):
            break

    # generate r
    r = random.randint(s + 1, q - 1)

    assert q > sum(W)
    assert GCD(q, r) == 1
    return PrivateKey(W, q, r)


def gen_public_key(private_key):
    B = []
    for w_i in private_key.W:
        B.append((private_key.r * w_i) % private_key.q)
    return PublicKey(B)


def encrypt(msg, public_key):
    msg_bit = to_bits(pad(msg))
    print(len(msg_bit))
    key_size = len(public_key.B)
    enc = []
    for i in range(0, len(msg_bit), key_size):
        enc.append(sum([msg_bit[i + j] * public_key.B[j] for j in range(key_size)]))
    print(enc[0].bit_length())
    return enc


def decrypt(enc, private_key):
    dec = []
    for c in enc:
        c_ = (c * pow(private_key.r, -1, private_key.q)) % private_key.q
        bits = []
        for w_i in reversed(private_key.W):
            if c_ >= w_i:
                bits.append(1)
                c_ -= w_i
            else:
                bits.append(0)
        dec += bits[::-1]
    return unpad(to_bytes(dec))

private_key = gen_private_key(key_size)
public_key = gen_public_key(private_key)
enc = encrypt(message, public_key)
dec = decrypt(enc, private_key)


assert dec == message

with open("lol2.txt", "w") as f:
    # f.write(f"B = {public_key.B}\n")
    f.write(f"enc = {enc}\n")
    f.write(f"{message[:1194].decode()}")

```

Tebak panjang key dengan sedikit bruteforce dan statistik (karena panjangnya/bit\_length tidak selalu disekitar 113-114) . Selanjutnya setelah dapat key\_size yang mungkin perlu dilakukan pengembalian nilai public key, karena kita tahu nilai dari message nya sepanjang 1194 bytes jadi kita cukup lakukan inverse matrix untuk dapat nilai public key. Setelah dapat public key langkah selanjutnya manfaatkan LLL untuk menyelesaikan subset sum problem, karena solver saya untuk SSP sejenis hilang, maka gunakan solusi di ch sebagai referensi. Berikut solver yang kami gunakan

```python
from Crypto.Util.number import *

def to_bits(m):
    _bin = lambda b: [1 if b & (1 << n) else 0 for n in range(7)]
    return sum([_bin(b) for b in m], [])

def pad(m):
    return m + b"\x00" * (-len(m) % (key_size // 7))

key_size = 70
message = b"The Merkle-Hellman Knapsack Cryptosystem, developed by Ralph Merkle and Martin Hellman, is a public-key encryption algorithm known for its resistance to attacks using conventional computers. It operates on the principle of the knapsack problem, making it difficult to solve without the private key.\nIn this cryptosystem, a superincreasing knapsack is created as the public key. Each element of the knapsack is generated using a specific algorithm, ensuring that the sum of any subset of elements is unique. This property makes it challenging to deduce the original combination used to create the knapsack.\nTo encrypt a message, the plaintext is divided into binary bits and combined with the public key. This process results in a ciphertext that obscures the original message. Decrypting the ciphertext requires the knowledge of the private key, which is a set of carefully selected parameters used to generate the knapsack.\nThe security of the Merkle-Hellman Knapsack Cryptosystem relies on the complexity of solving the subset sum problem, which is considered computationally difficult. Traditional methods, such as brute-force attacks, are ineffective due to the large search space involved."
msg_bit = to_bits(message)
block_msg = []
for i in range(0, len(msg_bit), key_size):
	block_msg.append(msg_bit[i:i+key_size])

enc = [11777743254884910867736071000802359, 9885367164484426877141712841289221, 10856960655537648470866892845455709, 12396844046310131327328676182785384, 10293406405260841919973448808441389, 7161552265897968311561098524910942, 10615787983784797652230739276445941, 8750996343125558087794309091207648, 9793482204040387456132647801296313, 10082519515116179234452192268207537, 11320102966402368083376899357909591, 12863315726661485156488840690651082, 11531046537784628833143256540008389, 9286560942760408224853358742306869, 12279582004149322390043290795184438, 11978789745490392114224327243767043, 12084485742145391797013212600989700, 11561154470121507020306698832744599, 13178456331567650213084024227496278, 10196086379552872917716585823999514, 10601541281173337913507909606005653, 9966399811463401202257751291120170, 10250511746568637708134548840731312, 11889575565127642830776977900408626, 10933709862860216194904138708336773, 10007593807392566080878720263508671, 10843011316705174491702117107785768, 12383694531221582253577117167915563, 9894583959533524041648917678111635, 10430518900617276344682533425679992, 10018475657312899961053882989990531, 12880429380373138445215696957506949, 10918434549436697161520320355333263, 11400042022902061481939614685122963, 11171610137545211187916226582376885, 7554940907108436037367038464198228, 9695912009774929988863012317171859, 9343496763562026180227665632657363, 12025067720426566083965241093256942, 9658955369440797726004826519759606, 9428833271132121009515800913622083, 10461484260876120487748327356785073, 10940612465536330800162700132905186, 10750467235934085792526359728596178, 10678873223029328852630062166689316, 10051894872077260074152880418222275, 10497008510500960013913178933854405, 10753394290126674824447926145896263, 10374556791613714702994629355809965, 10751549259077891899074410410421186, 10497129585037258904358709726525823, 11713351721867966767470659598304708, 9750904136088440351393297931807531, 12920557770888166933984079266544430, 9835518991386093395547202596319386, 10686991553601958185529117081292430, 10817714646369847390214302366874082, 11656133992050865158028442465948881, 9710481682340951577750560981814297, 9812463701289538441884338771424591, 10553500394965127205851299497413972, 9072662701494366982448390007849710, 10626852662537677429807153297591631, 10320557743814566446047834649298263, 10229033571571432213114817752122773, 10137091208657689466011904565821444, 9671296686420595758174214901621293, 11060629505422615215479089478068342, 9363787514709375187692683504126271, 9282781227753261317425876892013992, 9792647279730520129037413182534118, 11813869200575530803652104759262730, 9161928319229922257558038982128902, 10971796325720348232207258964788834, 9768861656419748162363181789101894, 10457965191293035226753206288146876, 11507982245405850634450464634589014, 10178640325420144331673938576834887, 10422017659145361826713838891135351, 9522927671377163131409738991653604, 10718579523969523227649591475908544, 12001115266350043980981379604813238, 10578812558562041805075262672497200, 9752859065974451382515905408025221, 11167987407122180703265457924178842, 9254029087396928912823658881409506, 10883479949880070871921870163374012, 11641336159459821580913821804515986, 9831976055167640701792299948722247, 9607326851652988564446116205180982, 11804616236914324707289980227637258, 8737658801206619958913982157263731, 9321117326771341614560384118866848, 12434262148233111040506390593441974, 9094596632057590879309101458194330, 10919870415301977737620426338392154, 9973779461746337777601698299498727, 13077097958532704050556386545741606, 10169545420422687603182882727171540, 11112798322767421119202274397188040, 9686860625851189937448816700040764, 11346835372920653632886580259127170, 9653724702297290643613793338823616, 11402239574264886427635550872788202, 9164717106755214577990540059670310, 10757982233067007899585898815139468, 11491931619173132257869978491641067, 10320404508097598075786619727003330, 10360404911242274038733003166681825, 11504881273300385090543651942681693, 10050497788566704765830589138400435, 9538999475912234600157681944493317, 11563463623586812255485232857599142, 8346901243091379690454826112441168, 10985123722502869338191643390313317, 9889419332627564614605267676475582, 9859008421534798027137238190169291, 8938108903576444037425026088417415, 11680785377217252765318352340278111, 11827065014133601933199138466286954, 10313025714965640595018569900420070, 11417267430337929136320784840421909, 8422584002870384136094081858383799, 10690359392494235886344438075661972, 10471344316033728097890752546524525, 10297237481194543096768525745798780, 11852784405095354362694442350929004, 11119778357967519776338637639047638, 9866655586941191421363196046299360, 10190115156307836485874719502143486, 12043225446675699386463230372571576, 10552241846308353818649522824971213, 9988028333155853144238651873306651, 10091392579705422187015420572382039, 10005842533804787157435320367039807, 10290501388089990847500605282087698, 10260079649840625499533386845655403, 9880687720157416551773806961186599, 12012537693823600317312532902550958, 8433167876202052583892538043499959, 11291163813180795239823826678637357, 8012971667935976011881461871593275, 13055895017385493902965307298758371, 10956829329131089932931803183795475, 10648023387171769092056689660527946, 9220397506426318617705668568380205, 9871207467819032200547465506808880, 10934669185660283455617271150287701, 9467876649386646296389087904618660, 13794160913300054581464395357038327, 9079301979125027938314870240165138, 12857015710047013040592592010876990, 11760789607847616802409107522171732, 12101202285031769352939345225180229, 11479374430179263163764851706844319, 9618684327449521603105661594573419, 11368851597362018368159187165305341, 10926103543543835056336767571733674, 12113712395211988433505262029083924, 8409110871996716684073156006373610, 10634854008206235974941650718127360, 11191821014173140552936341375666462, 11734220008676991656373171468230169, 11700550791405431460693949785169775, 11027471624758702087033927626502411, 10564827560525376313267401679415349, 10127201149696841461429643317101068, 10726399432872273049792997541701017, 10991865026417715013894334993971459, 10613123876559868339081376626812279, 8265705744262621901191334665843770, 8839978095214156480555512903831932, 11523816542334107733475885455187708, 11396931014886569225447187208304949, 9148460817006566054942492973353282, 11486944793732160981882091263330869, 7987682971004889468582279658369686]
print(len(block_msg[:-1]))
M = Matrix(block_msg[:-1])
b = vector(enc[:119])

H = list(M.solve_right(b))

c = 10576970794302563919281084570502166
result = ''
for c in enc:
	N = len(H)
	M = 2 * identity_matrix(N)
	M = M.insert_row(N, [1 for x in range(N)])
	M = M.augment(matrix([[x] for x in H] + [[c]]))
	
	B = M.LLL()
	
	for v in B:
	   S = 0
	   for i in range(len(v)):
	      if v[i] < 0:
	         S += H[i]
	   if S == c:
	      break
	plaintext_bin = ''
	for e in v[0:-1]:
	   if e == -1:
	      plaintext_bin += '1'
	   else:    
	      plaintext_bin += '0'
	plaintext_bin = plaintext_bin[::-1]
	plaintext = ''
	for i in range(0, len(plaintext_bin), 7):
	   plaintext += chr(int(plaintext_bin[i : i + 7], 2))
	result += plaintext[::-1]
	print(result)
# print(result)

```

<figure><img src="https://lh7-us.googleusercontent.com/DnNjPFQNLIF6BPEPxfgP5635AxYoM3l5_3D_mPOZyF22p7Ph6GfYTrvrHkmK6uiKA32tQtUELFquuAqF_tJ-HjC3aWpWwPXT1HudUuSnxS7OAZYkBX48yEBRQ5kNEU5pZPvT5r7Ey0AacsWE9NR_zGo" alt=""><figcaption></figcaption></figure>

Flag : COMPFEST15{D4ngerr\_LLL\_1s\_Ev3ryWh3r3\_ed2c699bb3}
