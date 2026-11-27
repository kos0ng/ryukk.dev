# Cryptography

<!-- challenge-index: 5a03450c66192a3e -->

| Challenge | Topic |
| --- | --- |
| [sabeb64 (331 pts)](#sabeb64-331-pts) | Custom Base64, Brute Force |
| [Cakemath (451 pts)](#cakemath-451-pts) | Quadratic Residues, Jacobi Symbol |
| [Turmoil (491 pts)](#turmoil-491-pts) | MT19937, RSA Factors |

<!-- /challenge-index -->

## sabeb64 (331 pts)

### Description

\-

### Solution

Diberikan file sabeb.py sebagai berikut dan akses ke service.

```python
import binascii
import random

charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
charset2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

def generateSecret():
	secret = "".join(random.choices(charset2, k=30))
	return secret.encode()

def sabebencode(text):
    ####################################
    ####################################
    ####################################
    ##ceritanya ini rusak kesiram kopi##
    ####################################
    ####################################
    ####################################

if __name__ == '__main__':
	print('Hi! I am Decoda, your personal base64 encoder 0_0')
	print('People said my calculations a little bit something... dunno. But, i\'ll do my best 0_0')
	print("My boss said bruteforce isn't needed, so you're only given 10 chances to use the encoder")
	print('====================================================')
	print('Please make a choice from the options below:')
	count = 0
	secret = generateSecret()
	while True:
		if count == 10:
			print("You've reached your limit")
			print("Thank you and have a good time! ^_^")
			break
		print(f"Encode remaining: {10 - count}")
		print('1. Print encoded secret')
		print('2. Encode plaintext')
		print('3. Submit secret and get flag')
		inputan = input('>> ')
		if inputan == '1':
			print('Here\'s your encoded secret sir:')
			res = sabebencode(secret)
			print(res)
			print('')
			print('Anything else? 0_0')
		elif inputan =='2':
			print('Please input your plaintext in hex 0_0.')
			text = input('>>')
			try:
				text = binascii.unhexlify(text)
				res = sabebencode(text)
				print('Beep boop... here\'s the result sir:')
				print(res)
				print('')
				print('Anything else? 0_0')
				count+=1
			except:
				print('Sorry sir... weird input detected 0_0\n')
		elif inputan == '3':
			print("Please submit the administrator's secret")
			secretsubmit = input('>>').encode()
			try:
				if secretsubmit == secret:
					flag = 'REDACTED'
					print(f"Welcome back, admin. Here's your flag: {flag}\n")
				else:
					print("Wrong secret! You are not admin >:[\n");
			except:
				print('Sorry sir... weird input detected 0_0\n')
		else:
			print('Sorry sir... weird input detected 0_0\n')
```

\
Jadi intinya kita disuruh mengetahui value dari secretsubmit, namun disini kode dari sabebencode di hilangkan. Disini kita bisa melakukan analisis terhadap input dan output guna menentukan seperti apa algoritma yang ada pada sabebencode.

<figure><img src="https://lh7-us.googleusercontent.com/VUXJbyLnKILARdo6jQCOiI4DtVoAsPlAmaJkmZQjIDJYuMgdsUwGyEEW7dKopG-RriOiLPFwxHyQdaIAw9GxvhxirtrSi9km2TRlN6Gt-KPZbm-jKFSI6SaK4wcbnUGo17YyqpUYG84plvbDQUVPo2s" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/hatrQxNFDkNbblERFvKdiMDqPIg-pqMu2ySh9U3Dw_XtWedFL6Z_ERyGLykldKYl5wXKE97wXy8ttqBKqzqKRglsWWCPijg3b6Oeyx7f4nGZUHAD4lyrhLbUvVtbkdK9l7Tqs8celQHU3HYKKt8T4Ro" alt=""><figcaption></figcaption></figure>

Bisa kita lihat dari input dan output diatas bahwa terdapat perbedaan antara encode aa dan aaaa pada base64 biasa dan sabeb64. Setelah kami validasi ternyata asumsi kami benar bahwa input di encode setiap 2 bytes, karena 2 bytes printable tidak terlalu banyak maka kita bisa petakan semua nilai dan decrypt secretsubmit dengan memetakannya kembali ke value aslinya.&#x20;

```python
from pwn import *
from itertools import product

dicc = {}
r = remote("103.167.136.75",9988)
for i in product(string.printable[:-6],repeat=2):
	tmp = ''.join(i)
	try:
		r.recvuntil(b">> ")
		r.sendline(b"2")
		r.sendline(tmp.encode().hex().encode())
		r.recvuntil(b":\n")
		res = r.recvline().strip().decode()
		dicc[res] = tmp
	except Exception as e:
		r.close()
		r = remote("103.167.136.75",9988)
		r.recvuntil(b">> ")
		r.sendline(b"2")
		r.sendline(tmp.encode().hex().encode())
		r.recvuntil(b":\n")
		res = r.recvline().strip().decode()
		dicc[res] = tmp
r.close()
print("nice")

# backup
import json  
with open('dicc.txt', 'w') as convert_file:
     convert_file.write(json.dumps(dicc))

r = remote("103.167.136.75",9988)
r.recvuntil(b">> ")
r.sendline(b"1")
r.recvuntil(b":\n")
ct_secret = r.recvline().strip().decode()
list_ct = []
for i in range(0,len(ct_secret),3):
	list_ct.append(ct_secret[i:i+3])
secc = ""
for i in list_ct:
	secc += dicc[i]
r.recvuntil(b">> ")
r.sendline(b"3")
r.recvuntil(b">>")
r.sendline(secc.encode())
r.interactive()

```

<figure><img src="https://lh7-us.googleusercontent.com/aQSIqNrT0A1TrjlEeglNZjLp9_cv5cqqjvoRUE4a59LD7KI_ZxxjqeTQrnpH6mRq0OGygg-1AVUf11TG1iq-rkh-dyDu1Y2Cu22PwigxXfus2po-ZQXcpX3n4SjJ0mXL8_q8719QW9tmDX3LWpl4_6o" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/PT-s9VMm7D8ykYIvDmZP7qdU62iyb_yNU0jb3Rt0ynndNlSm5shQY-B5Gydi4tE4838xQFgcCSriVQRE54sA1CIBLSuK-4WdgR0cSNyKAcxQJlxCUnYyv3H0rOvsTWo2mQR0osNkcPwvqnc5OybtXhw" alt=""><figcaption></figcaption></figure>

Flag : NCW22{jusT\_a\_littl3\_d1ff3r3nt\_C0ncept\_0f\_base\_6nam\_emp4t\_x1x1x1\_1be1ec3c3ea96b983a75e17dd3d44e8b}

## Cakemath (451 pts)

### Description

\-

### Solution

Diberikan file dessert.py sebagai berikut

```python
import random,math,os
from Crypto.Util.number import *

flag = os.getenv("NCW_FLAG")
c_n1 = random.getrandbits(512)
c_n2 = random.getrandbits(512)

assert c_n1 != c_n2
encrypted = []
bittersweet = [int(r) for r in "{:b}".format(bytes_to_long(flag))]
for sugar in bittersweet:
	while True:
		gc_c = random.randint(65536, c_n1)
		if math.gcd(gc_c, c_n1) == 1:
			encrypted.append((pow(c_n2,sugar)*pow(gc_c,2)) % c_n1)
			break

print("c_n1 =",str(c_n1))
print("c_n2 =",str(c_n2))
print("encrypted = ", end='')
print(encrypted)

```

Flag dikonversi ke binary jadi ada 2 kemungkinan yakni 1 atau 0 untuk variable sugar. Disini kita bisa mengembalikan nilai dari binary tersebut dengan cara mengecek apakah nilai pada encrypted merupakan bilangan square atau bukan , karena c\_n1 dan g\_c relatif prima namun c\_n1 bukan prima maka kita bisa gunakan jacobi symbol untuk mengetahui apakah suatu bilangan square atau bukan. Berikut solver yang kami gunakan

```python
from Crypto.Util.number import *
from libnum import *

c_n1 = 3855144799899048327534121215306941141185997589420691125094911911082597963257300429096794014315805279596530735439263764994759442420373314885435640329972555
c_n2 = 5299396373535953706628077154342198627748435935987447573061077335778202151741165833985790411265547771371574434052556785516415658261684773030001154912306733
encrypted = [507104000732472450402938437721529021378564745838604181711052463510983043412099070337891206768987338263502149153936534933899109822282227342709312445026628,...SNIPPET…, 1983121417614455624787082919584128947462950990156463566859101453080668678780641745395775761769267205914558434913337236643284756856405940720684555555234672]

res = ""
for i in encrypted:
	if(jacobi(i,c_n1)==0):
		res += "1"
	else:
		res += "0"
print(long_to_bytes(int(''.join(res),2)))
```

<figure><img src="https://lh7-us.googleusercontent.com/XIfY8mnCj2pGxTd6jRqTumlgcq0aTk-ZTsceUev8ig-_z_QpC5KNjSruOxVIAGAH_5cgirqmG8wElhSoLNk4kmyq2zx3zfX2Qv4KhhPwkjmo0yclEgsLeW2vzLsOyj3Zz3FQ3PCJOXDUPuHoBLesOPk" alt=""><figcaption></figcaption></figure>

Flag : NCW22{j4c0bi\_symb0ls\_101\_w!th\_c0mposit3\_numbers}

## Turmoil (491 pts)

### Description

\-

### Solution

Diberikan file soal.py sebagai berikut

```python
from Crypto.Util.number import *
import random
import math
m = bytes_to_long(b"REDACTED")

def primevalue(value):
	ind = 0
	while not isPrime(value):
		value += 1
		ind += 1
	print(f"added {ind}")
	return value

def generatePrimes():
	print("generating random numbers...")
	p = random.getrandbits(512)
	q = random.getrandbits(512)
	print("calculating next prime...")
	p = primevalue(p)
	q = primevalue(q)
	print("comparing values...")
	print("=======| > |=======") if p > q else print("=======| < |=======")
	return p, q

while True:
	try:
		print("==================================")
		print("J&M's EncRSAyption MacRSAhine 3000")
		print("==================================")
		print("1. Spill Administrator's message")
		print("2. Encrypt your own message")
		pilihan = input("[?] ")
		if pilihan == "1":
			p, q = generatePrimes()
			e = primevalue(random.randint(3, 100000))
			n = p*q
			c = long_to_bytes(pow(m, e, n))
			print("\nToo bad this part is highly confidential, only the ciphertext are allowed to be displayed.")
			print(f"[>] {c.hex()}\n")
		elif pilihan == "2":
			p, q = generatePrimes()
			n = p * q
			phi  = (p-1)*(q-1)
			print("")
			print("Input plaintext")
			message = bytes_to_long(input("[?] ").encode())
			while True:
				print("Input your exponent")
				e = int(input("[?] "))
				if math.gcd(e, phi) != 1:
					print('Error! exponent and totient have same factor(s)')
				else:
					d = inverse(e, phi)
					print("Imma just show this to you, you already know your own message anyway")
					print(f"d = {d}")
					print("Use this exponent? (Y/N)")
					choice = input("[?] ")
					if choice == "Y" or choice == "y":
						break
					elif choice == "N" or choice == "n":
						pass
			c = pow(message, e, n)
			print("Here's the result:")
			print(f"[>] n = {n}\n[>] e = {e}\n[>] c = {c}\n")
	except:
		print('Error\n')
```

Intinya kita bisa melakukan predict terhadap nilai prime karena digenerate berdasarkan getrandbits. Untuk nilai state sebelumnya kita bisa dapatkan karena kita mengetahui nilai d,e,n dan bisa melakukan recover terhadap p,q dimana p,q bisa kita kembalikan ke nilai state (getrandbits) dengan mengurangkan sesuai dengan penambahannya. Dan untuk mengetahui mana p dan q bisa dari hasil recover bisa diketahui dengan keterangan tambahan mengenai nilai besar kecil dari p q pada bagian “comparing values” . Terakhir cukup brute e pada enkripsi flag karena nilai e tidak terlalu besar. Disini sempet stuck karena mencoba mengimplementasikan recovery p,q secara naive (bisa dapat bisa tidak) yang ternyata setelah mencari-cari ada scriptnya :3 <https://github.com/truongkma/ctf-tools/blob/master/RecoverPrimeFactors.py> .  Berikut solver yang kami gunakan.

```python
from math import gcd
from randcrack import RandCrack
from pwn import *
from Crypto.Util.number import *

# import fractions  # for gcd function (or easily implementable to avoid import)
import random  # for random elements drawing in RecoverPrimeFactors


def failFunction():
    print("Prime factors not found")


def outputPrimes(a, n):
    p = gcd(a, n)
    q = int(n // p)
    if p > q:
        p, q = q, p
    # print("Found factors p and q")
    # print("p = {0}".format(str(p)))
    # print("q = {0}".format(str(q)))
    return p, q


def RecoverPrimeFactors(n, e, d):
    k = d * e - 1
    if k % 2 == 1:
        failFunction()
        return 0, 0
    else:
        t = 0
        r = k
        while(r % 2 == 0):
            r = int(r // 2)
            t += 1
        for i in range(1, 101):
            g = random.randint(0, n)  # random g in [0, n-1]
            y = pow(g, r, n)
            if y == 1 or y == n - 1:
                continue
            else:
                for j in range(1, t):  # j \in [1, t-1]
                    x = pow(y, 2, n)
                    if x == 1:
                        p, q = outputPrimes(y - 1, n)
                        return p, q
                    elif x == n - 1:
                        continue
                    y = x
                    x = pow(y, 2, n)
                    if x == 1:
                        p, q = outputPrimes(y - 1, n)
                        return p, q

def primevalue(value):
	ind = 0
	while not isPrime(value):
		value += 1
		ind += 1
	return value

pub_exp = [65537]
def get_pq(n,list_d,p_add,q_add,cmp_val,one_factor=False):
	for i in range(len(pub_exp)):
		e = pub_exp[i]
		d = list_d[i]
		p,q = RecoverPrimeFactors(n,e,d)
	if(cmp_val):
		tmp_p = max(p,q)
		tmp_q = min(p,q)
	else:
		tmp_p = min(p,q)
		tmp_q = max(p,q)
	p = tmp_p - p_add
	q = tmp_q - q_add
	# print("p = {0}".format(str(p)))
	# print("q = {0}".format(str(q)))
	while p > 0:
		rc.submit(p % (1 << 32))
		p = p >> 32
	if(one_factor==False):
		while q > 0:
			rc.submit(q % (1 << 32))
			q = q >> 32
	
rc = RandCrack()
r = remote("103.167.136.75",9966)
# r = process("./soal.py")
for i in range(20):
	# print(i)
	r.recvuntil(b"[?] ")
	r.sendline(b"2")
	r.recvuntil(b"added ")
	p_add = int(r.recvline().strip().decode())
	r.recvuntil(b"added ")
	q_add = int(r.recvline().strip().decode())
	r.recvuntil(b"=======|")
	cmp_val = r.recvline().strip().decode()
	r.recvuntil(b"[?] ")
	r.sendline(b"a")
	list_d = []
	for e in pub_exp:
		r.recvuntil(b"[?] ")
		r.sendline(str(e).encode())
		zzz = r.recvline()
		if(b"Error!" in zzz):
			list_d.append(0)
			continue
		r.recvuntil(b"d = ")
		d = int(r.recvline().strip().decode())
		list_d.append(d)
		r.recvuntil(b"[?] ")
		# print(e)
		if(e == pub_exp[-1]):
			r.sendline(b"Y")
		else:
			r.sendline(b"N")
	r.recvuntil(b"n = ")
	n = int(r.recvline().strip().decode())
	if(i==19):
		if(">" in cmp_val):
			get_pq(n,list_d,p_add,q_add,True,True)
		else:
			get_pq(n,list_d,p_add,q_add,False,True)
	else:
		if(">" in cmp_val):
			get_pq(n,list_d,p_add,q_add,True)
		else:
			get_pq(n,list_d,p_add,q_add,False)
print("noice")
r.recvuntil(b"[?] ")
r.sendline(b"1")
r.recvuntil(b"added ")
e_add = int(r.recvline().strip().decode())
r.recvuntil(b"[>] ")
ct = bytes_to_long(bytes.fromhex(r.recvline().strip().decode()))
print("CT",ct)
r.close()
junk = rc.predict_randrange(0, 13407807929942597099574024998205846127479365820592393377723561443721764030073546976801874298166903427690031858186486050853753882811946569946433649006084095)
p = rc.predict_randrange(0, 13407807929942597099574024998205846127479365820592393377723561443721764030073546976801874298166903427690031858186486050853753882811946569946433649006084095)
q = rc.predict_randrange(0, 13407807929942597099574024998205846127479365820592393377723561443721764030073546976801874298166903427690031858186486050853753882811946569946433649006084095)
p = primevalue(p)
q = primevalue(q)
# print(p)
# print(q)
phi = (p-1)*(q-1)
n = p*q
for e in range(3, 100000):
	if(isPrime(e)):
		try:
			d = inverse(e,phi)
			tmp = long_to_bytes(pow(ct,d,n))
			if(b"NCW" in tmp):
				print(e,tmp)
				break
			if(tmp.decode()):
				print(e,tmp)
				break
		except:
			continue
```

<figure><img src="https://lh7-us.googleusercontent.com/bqqPLbSJd_pIJwP5Fq8z0y_yjM2wtKhTKt82WRkgkjShAF4ut7Z59W8rcwSNKdSjEUkENRkT7ZfwYYylC-PLnQXE6ySJuDqUVC8Z3VEcgaD2c6cCrkDwy3GQX5f6ADJzyscFMFymv3JC0b1PRMd-9SQ" alt=""><figcaption></figcaption></figure>

Flag : NCW22{ReCoVer\_PriMes\_tO\_dIsCoVEr\_PriMes}
