# Cryptography

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>Simple (38 pts)</td><td><a href="#simple-38-pts">Here</a></td></tr><tr><td>xor (38 pts)</td><td><a href="#xor-38-pts">Here</a></td></tr><tr><td>symmetric (101 pts)</td><td><a href="#symmetric-101-pts">Here</a></td></tr><tr><td>Blok barat (105 pts)</td><td><a href="#blok-barat-105-pts">Here</a></td></tr><tr><td>Whining (109 pts)</td><td><a href="#whining-109-pts">Here</a></td></tr></tbody></table>

## Simple (38 pts)

### Description

\-

### Solution

Diberikan file flag.encrypted dan private.pem , dilihat dari konten private.pem diketahui bahwa algoritma enkripsi yang digunakan adalah RSA. Jadi tinggal decrypt saja karena punya private keynya , berikut script yang kami gunakan

```python
from Crypto.PublicKey import RSA
from Crypto.Util.number import *

f = open('private.pem','r')
key = RSA.importKey(f.read())
g = open('flag.encrypted').read()
ct = bytes_to_long(g)
print long_to_bytes(pow(ct,key.d,key.n))
```

Flag : IFEST2021{s1Mpl3\_eNcRyPt10n\_f1l3S\_uS1nG\_RSA}

## xor (38 pts)

### Description

\-

### Solution

Diberikan flag.enc dan xor.py , isi dari xor.py melakukan xor flag dengan key, jadi lakukan xor balik untuk mendapatkan flag. Berikut solver yang kami gunakan

```python
import base64


a = base64.b64decode('Jyk1NidcX0JUCAZfHDwsBlsIVSExNx83LBYgAhcBHBI=')
key = "nopes"
flag = ""
for i in range(0,len(a)):
    flag += chr(ord(key[i%len(key)])^ord(a[i]))
print flag
```

Flag : IFEST2021{h0lY\_h4x0R\_XoR\_xOrrrr}

## symmetric (101 pts)

### Description

\-

### Solution

Diberikan file symmetric.py dan flag.enc . Pada symmetric.py terlihat terdapat enkripsi yang dilakukan per character dengan memetakan value pada key dan plaintext lalu ditambahkan sebagai integer. Jadi karena diencrypt per char kita lakukan bruteforce saja untuk mendapatkan flagnya. Berikut script yang kami gunakan

```python
import string

words = "gueliseuy"
insert = words + "abcdefghiklmnopqrstuvwxyz"
table = []
num = ""
for i in range(len(insert)):
	if(insert[i] not in table):
    	table.append(insert[i])

def encrypt(plain,key):
	for i in range(len(plain)):
    	row = (table.index(plain[i])//5)+1
    	col = (table.index(plain[i])%5)+1
    	row2 = (table.index(key[i])//5)+1
    	col2 = (table.index(key[i])%5)+1
    	num = int(str(row) + str(col))
    	num2 = int(str(row2) + str(col2))
	return str(num+num2)

target = '68-67-76-46-76-27-28-36-86-56-29-44-56-32-74-38-58-49-27-60-35-50-64-48-23-83-88-38-82-58-86-53'.split('-')
key = "rockwellmalanghackerlinkunpadctf"
flag = ''
for i in range(len(key)):
	for j in insert:
    	if(target[i]==encrypt(j,key[i])):
        	flag += j
        	break
print(flag)
```

Flag : actuallythisisnihilismalgorithms

## Blok barat (105 pts)

### Description

\-

### Solution

Pada script barat.py terlihat bahwa IV merupakan flag dan key dirahasiakan sebanyak 3 byte. Selain itu kita tahu nilai dari plaintext dan juga ciphertext yang menggunakan flag sebagai IV. Jadi tinggal kita decrypt ciphertext tersebut dengan ECB ( tanpa IV ) lalu lakukan xor block pertama dengan message untuk mendapatkan IV nya , untuk keynya bruteforce aja. Berikut script yang kami gunakan

```python
from Crypto.Cipher import AES
from itertools import product
import string

a = "480d6d63bd08dddff77300fd2eab5c020984cea3e41613bb59fd964cb41be64cf5798fe66e64ff93f4ceb9eeddef29ad05910022eb4d3ff031ebeee061a1dde6".decode('hex')
message = 'blok barat terdiri dari block negara kapitalis yang bersatu padu'
key = "7d8AtE9m23gI1"
for i in product(string.printable[:-6],repeat=3):
    tmp_key = key + i[0] + i[1] + i[2]
    aes = AES.new(tmp_key, AES.MODE_ECB)
    tmp = aes.decrypt(a)
    flag = ""
    for i in range(16):
   	 flag += chr(ord(tmp[i])^ord(message[i]))
    if all(c in string.printable for c in flag):
   	 print flag
   	 break
```

Flag : IFEST2021{wR3ck\_W3st\_Bl0cG}

## Whining (109 pts)

### Description

\-

### Solution

Diberikan file public key dan juga encrypted text. Jadi selanjutnya kita cek nilai modulus dan public exponentnya

```python
rom Crypto.PublicKey import RSA

f = open('key.pub','r')
key = RSA.importKey(f.read())
print(key.n)
print(key.e)
```

<figure><img src="https://lh7-us.googleusercontent.com/oKsxKVyRnYds55hV-CmA0d7auBpSx8ESw5Du4IWiVnBWIPB9STzoimisK__5HPeNcKhweNH92KFDQbMBIeuh1T0MC_aWJM1uqIk0ryT4R3uHN3mUA1N94u7F7cS8Tm4wO5RRkq55YfaAE3D1eQIbgw" alt=""><figcaption></figcaption></figure>

Ternyata nilai public exponent \~ modulus , jadi nya kita bisa coba lakukan common attack pada kasus serupa yaitu wiener attack.

Dapetin d , karena gabisa long\_to\_bytes di python 3 , masalah di encoding , jadi pake python2 aja untuk decryptnya

```python
from Crypto.PublicKey import RSA
from Crypto.Util.number import *
import owiener

f = open('key.pub','r')
key = RSA.importKey(f.read())
d = owiener.attack(key.e,key.n)
print(d)
# 32949980623925232523625629808672011632097834303758330539120354282153396424798323323465341
```

```python
from Crypto.Util.number import *

d = 32949980623925232523625629808672011632097834303758330539120354282153396424798323323465341
n = 11221440812972542750826454701039569573482291468122754023642431301808216364337580504208927546261064846751137444645007721850331554074395653958374809755680288095560143240497326775255499814897192322006509094928136444964076495884456452342201314951632027439278269272675363784127461966215133117033330722257929906340047840484861406962073199730867359185702574517221991613380708112149916186619683683367149465398791595957139100427923570288149757294714383536806323670486229350435619705109939327290730205072024318283452040961365237688085397132180212466115472928208027059543555688994728169949590682947037991301693477274454730750773
g = open('whine.encrypted').read()
ct = bytes_to_long(g)
print(long_to_bytes(pow(ct,d,n)))
```

Flag : IFEST2021{wH1nIn9}
