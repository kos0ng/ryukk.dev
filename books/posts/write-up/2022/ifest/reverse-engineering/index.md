# Reverse Engineering

<!-- challenge-index: 7a39fcdec0fc71d8 -->

| Challenge | Topic |
| --- | --- |
| [Help Maxine (364 pts)](#help-maxine-364-pts) | Python Obfuscation, Fernet, XOR |
| [Count the Flag (400 pts)](#count-the-flag-400-pts) | Incremental Input Validation |
| [MaskManGem (500 pts)🥇](#maskmangem-500-pts) | PyInstaller, AES-CTR |
| [5P Authenticator (500 pts)🥇](#5p-authenticator-500-pts) | Go, License Validation |

<!-- /challenge-index -->

## Help Maxine (364 pts)

### Description

\-

### Solution

Diberikan source code sebagai berikut

<figure><img src="images/5ae87a21645756e52a470dd2.png" alt=""><figcaption></figcaption></figure>

Ubah exec menjadi print untuk mendapatkan source code yang dieksekusi. Lakukan deobfuscate manual dengan mengubah nama obfuscated functionnya, berikut hasilnya

```python
#!/usr/bin python3

import os
import random
import base64
from cryptography.fernet import Fernet
import requests
ye="so_strange/"
yX=[]
yg=[]
yY=random.randint(1,256)
def yG(filename):
 yF=requests.get(base64.b32decode(b'NB2HI4DTHIXS64DBON2GKYTJNYXGG33NF5ZGC5ZPOBGDQTKSIZFWE==='))
 yo=bytes(yF.text,'utf-8')
 yj=base64.urlsafe_b64encode(yo)
 ym=Fernet(yj)
 with open(ye+filename+".enc","rb")as f:
  x=f.read()
 yT=ym.encrypt(x)
 with open(ye+filename+".fntenc","wb")as g:
  g.write(yT)
 f.close()
 g.close()
for yL in os.listdir(ye):
 if yL.endswith(".jpg")or yL.endswith(".png"):
  yX=[]
  yW=[]
  with open(ye+yL,'rb')as f:
   while True:
    yx=f.read(1).hex()
    yX.append(yx)
    if len(yx)==0:
     break
  f.close()
  yf=yX[::-1]
  for x in range(len(yf)):
   try:
    yH=(int(yf[x],16)^yY)
    yW.append(yH)
   except requests.get:
    pass
  with open(ye+yL+".enc",'wb')as f:
   f.write(bytes(yW))
  f.close()
  yG(yL)
  if os.name=='posix':
   os.system('cd so_strange/; rm *.enc')
  elif os.name=='nt':
   os.system('cd so_strange && del *.enc')
  print("{} Encrrequests.getted".format(yL))

```

Selanjutnya tinggal di reverse saja, decrypt dengan fernet (known key) , reverse nilainya, dan bruteforce xor key (1-256). Berikut solver yang kami gunakan.

```python
from cryptography.fernet import Fernet
import requests
import base64

dir_name = "so_strange/"
dir_res = "result/"
# f = open(dir_name+"max.png.fntenc","rb")
f = open(dir_name+"max.png.fntenc","rb").read()
yF=requests.get(base64.b32decode(b'NB2HI4DTHIXS64DBON2GKYTJNYXGG33NF5ZGC5ZPOBGDQTKSIZFWE==='))
yo=bytes(yF.text,'utf-8')
yj=base64.urlsafe_b64encode(yo)
ym=Fernet(yj)

yT=ym.decrypt(f)[::-1]
for i in range(1,257):
	tmp = []
	for j in yT:
		tmp.append(j^i)
	g = open(dir_res+"{}.png".format(i),"wb")
	g.write(bytes(tmp))

```

<figure><img src="images/bfab9fd75082cbf5da85a9a9.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/8ef37edc2b3572fc755d106a.png" alt=""><figcaption></figcaption></figure>

Flag : IFEST22{it5\_th3\_ups1d3\_d0wN}

## Count the Flag (400 pts)

### Description

\-

### Solution

Diberikan executable

<figure><img src="images/6a400fb6b475824e764f3d21.png" alt=""><figcaption></figcaption></figure>

Jadi validasi sebenarnya ada pada potongan kode yang kami blok. Berikut salah satu contoh potongan kode validasinya

<figure><img src="images/cc25c9c92215c3c8f35fb9ab.png" alt=""><figcaption></figcaption></figure>

Entah kenapa z3 error, namun karena value per index nya urut, jika index ke i diketahui maka i+1 bisa didapatkan dimana i>=0 . Jadi tinggal brute per byte dngan validasi manual. Berikut solvernya

```python
import string

a1 = []
for i in string.printable[:-6]:
	if(ord(i) == 24 * (ord(i) % 2 + 3) + 6):
		a1.append(ord(i))

for i in string.printable[:-6]:
	if(ord(i) == a1[0] - 36 + 2 * ord(i) - 106):
		a1.append(ord(i))

for i in string.printable[:-6]:
	if(ord(i) == 3 * (ord(i) + a1[0] / 2 - a1[1]) - 11):
		# print(i)
		a1.append(ord(i))

for i in string.printable[:-6]:
	if(ord(i) == a1[2] * a1[1] // 32):
		# print(i)
		a1.append(ord(i))

for i in string.printable[:-6]:
	if(ord(i) + (a1[0]-a1[1]) == ((ord(i) + (a1[0]-a1[1]) )// 2) + 41):
		# print(i)
		a1.append(ord(i))
		break
# a1[4] = C,D
qq = a1[4]
a1[4] += a1[0] - a1[1]
print(hex(a1[4]))
print(chr(a1[4]))
for i in string.printable[:-6]:
	if(ord(i) == 4*((a1[4])>>2)):
		print("5",i)
		a1.append(ord(i))
print(a1[4])
tmp = 4*((a1[4])>>2)
print(hex(tmp))
for i in string.printable[:-6]:
	if(ord(i) == ((2 * a1[5]) + ord(i)) // 3):
		print("6",i)
		a1.append(ord(i))
		break

# a1[6] = P,O

a1[6] = ord('P')
for i in string.printable[:-6]:
	if(ord(i) == 6 * (ord(i) - a1[6]) - 5 ):
		print("7",i)
		a1.append(ord(i))
		break

for i in string.printable[:-6]:
	if(ord(i) == a1[7] % a1[5] * (a1[0] - 75) + 10):
		print("8",i)
		a1.append(ord(i))
		# break

for i in string.printable[:-6]:
	if(ord(i) == 2 * a1[8] - a1[2] - 7):
		print("9",i)
		a1.append(ord(i))
		# break

for i in string.printable[:-6]:
	if(ord(i) == 4 * (a1[8] - ord(i) - 1) ):
		print("10",i)
		a1.append(ord(i))
		# break

for i in string.printable[:-6]:
	if(ord(i) == 26 * (ord(i) - a1[7] - 3)):
		print("11",i)
		a1.append(ord(i))
		# break

for i in string.printable[:-6]:
	if(ord(i) == 3 * (a1[11] - a1[0]) + 1):
		print("12",i)
		a1.append(ord(i))
		# break

a1[4] = qq
flag = ""
for i in a1:
	flag += chr(i)
print(flag)
```

<figure><img src="images/0e1ae93b7da333d0d5caf699.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/ede027fe560a65d20a0556ca.png" alt=""><figcaption></figcaption></figure>

Flag : IFEST22{NluVCPPa\_H0hO}

## MaskManGem (500 pts)

### Description

\-

### Solution

Diberikan executable yang dicompile menggunakan pyinstaller. Lakukan decompile dengan <https://github.com/extremecoders-re/pyinstxtractor/blob/master/pyinstxtractor.py> . Disini python saya build dari source code untuk 3.8.9&#x20;

<figure><img src="images/36655b47392bc6a0f37ab4e4.png" alt=""><figcaption></figcaption></figure>

Selanjutnya tinggal jalankan file py dan dapat hasil extractnya. Sempat terjebak mengira bahwa array congratuliaions lah flagnya tapi salah. Jadinya cari lagi ternyata ada di fungsi secret\_func. Namun aneh hasil pyz encrypted, mencari referensi menemukan <https://github.com/extremecoders-re/pyinstxtractor/wiki/Frequently-Asked-Questions#are-encrypted-pyz-archives-supported> . Jadi tinggal ikuti saja caranya , berikut script decrypt yang kami gunakan

```python
# https://github.com/extremecoders-re/pyinstxtractor/wiki/Frequently-Asked-Questions
#!/usr/bin/env python3
from Crypto.Cipher import AES
from Crypto.Util import Counter
import zlib

CRYPT_BLOCK_SIZE = 16

# key obtained from pyimod00_crypto_key
key = bytes('\\(*O*)/69\\(*O*)/', 'utf-8')

inf = open('secret.pyc.encrypted', 'rb') # encrypted file input
outf = open('secret.pyc', 'wb') # output file 

# Initialization vector
iv = inf.read(CRYPT_BLOCK_SIZE)

ctr = Counter.new(128, initial_value=int.from_bytes(iv, byteorder='big'))

cipher = AES.new(key, AES.MODE_CTR, counter=ctr)

# Decrypt and decompress
plaintext = zlib.decompress(cipher.decrypt(inf.read()))

# Write pyc header
# The header below is for Python 3.8
outf.write(b'\x55\x0d\x0d\x0a\0\0\0\0\0\0\0\0\0\0\0\0')

# Write decrypted data
outf.write(plaintext)

inf.close()
outf.close()
```

Selanjutnya tinggal decompile file secret.pyc

<figure><img src="images/8c306ca4836de873a739bc96.png" alt=""><figcaption></figcaption></figure>

Jalankan dapat flag

<figure><img src="images/7504e2ec7732731459024db3.png" alt=""><figcaption></figcaption></figure>

Flag : IFEST22{mAsm4n\_sEnan9\_1stri\_tEnanG}

## 5P Authenticator (500 pts)

### Description

\-

### Solution

Executable golang. Mudahnya lakukan debugging, coba bypass setiap pengecekan

<figure><img src="images/352dfc09dace050de5a6dc88.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/62a646912ff28ac165707593.png" alt=""><figcaption></figcaption></figure>

Contohnya ubah nilai rax menjadi 0x41 pada saat pc ada pada instruksi tersebut. Setelah bypass semua ternyata dapat format flag

```
IFEST22{93n3r4t3_3_4_5}


3 4 5 adalah input ke 3 4 dan 5 , jadi formatnya adalah


IFEST22{93n3r4t3_input3_input4_input5}
```

Selanjutnya tinggal cari input 3 4 5 saja.

<figure><img src="images/9e6d23088e5e5edb8d8a1c33.png" alt=""><figcaption></figcaption></figure>

Kurang lebih hanya aritmatika biasa. Berikut solvernya

```
main_VALUE_5 = 0x8511B2B88
main_VALUE_4 = 0x1BFF873E8
main_VALUE_4_ext = 0x1FA34787C
main_VALUE_3 = 0x0BCC119E0
main_VALUE_5_ext = 0x0B21C2A1B


inp3 =  main_VALUE_3 + 833428390
inp4 =  main_VALUE_4_ext - main_VALUE_4 + 23188190
inp5 = (main_VALUE_5//2) - main_VALUE_4 - main_VALUE_4_ext - main_VALUE_5_ext + main_VALUE_3 - 30010011


print(inp3,inp4,inp5)
```

<figure><img src="images/7462e1669a132eb76a5318cd.png" alt=""><figcaption></figcaption></figure>

Flag : IFEST22{93n3r4t3\_4000200070\_1000200050\_2000400010}
