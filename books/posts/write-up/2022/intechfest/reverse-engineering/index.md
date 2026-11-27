# Reverse Engineering

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>fr00t (175 pts)</td><td><a href="#fr00t-175-pts">Here</a></td></tr><tr><td>snake code (247 pts)</td><td><a href="#snake-code-247-pts">Here</a></td></tr><tr><td>Lua (472 pts)</td><td><a href="#lua-472-pts">Here</a></td></tr><tr><td>go go go! (499 pts)🥇</td><td><a href="#go-go-go-499-pts">Here</a></td></tr><tr><td>Exposed (499 pts)🥇</td><td><a href="#exposed-499-pts">Here</a></td></tr></tbody></table>

## fr00t (175 pts)

### Description

\-

### Solution

Diberikan file ELF, kami membukanya menggunakann IDA.

<figure><img src="https://lh7-us.googleusercontent.com/54p_URSV3ai4H9XCpLkL5psub79pebc9CiI_nh5I-p2iGOTv6d3Ap2VG4hZOBTsK-0UXCj0T0gogw2qRLNjDYKOPuEPGWx16QxPS4G7z7PAqglVpVf4Ilz-7AZD4KkQHb0faB3Vg13ym8JbQXiVPR6E" alt=""><figcaption></figcaption></figure>

Intinya kita harus mengubah variable v6 menjadi true dan harus memiliki balance yang melebihi harga flag. Bugnya ada pada fungsi sub\_805FCA0 atau pada saat input nama

<figure><img src="https://lh7-us.googleusercontent.com/ZHTxMDA5d1augWAT8-oJNUuVGS7YFt64UikBk4BqAgEX4_3_vTnZDxlXBUWdn6rt-ux15KbO2_hrn7Ta5v_t2GHehfkNTw9wxQE6pUx5GwoJxS2VrxHSy-JN0zbaNDwG5DwxqEj6mMPe6lDIPgiMMWY" alt=""><figcaption></figcaption></figure>

Ini lebih ke pwn, jadi tinggal buat payload untuk overwrite local variable balance ebp-C  dan v6 ebp-1C. Berikut solver yang kami gunakan

```python
from pwn import *

payload = b"A"*(0x3c-0x1c)
payload += p32(1)
payload += p32(0)
payload += p32(0)
payload += p32(0)
payload += p32(123456)
# r = process("./challenge")
r = remote("15.235.143.42",18635)
# gdb.attach(r,"""
# 	b *0x08049A52
# 	c
# 	""")
r.recvuntil(b"name: ")
r.sendline(payload)
r.recvuntil(b": ")
r.sendline(b"2")
r.recvuntil(b": ")
r.sendline(b"4")
r.recvuntil(b": ")
r.sendline(b"1")
r.interactive()

```

<figure><img src="https://lh7-us.googleusercontent.com/EPiscZMTGhJKG-2T_FnS-gTbSe45P6HXqY-UxMSSWRCv6OfExCPM8o8xM9AhvfGv_zb4sVVl_ghPLi-x_320YT3qzIp4wVWO_aQqH6mmgdhDaEkHIa7eG7AkacALI1Ih9vbiGNU72t9Iu4CoOwhednw" alt=""><figcaption></figcaption></figure>

Flag : itf{int3g3r\_0v3rfl00w\_s000\_bas111c}

## snake code (247 pts)

### Description

\-

### Solution

Diberikan opcode python sebagai berikut

```nasm
  5           0 BUILD_LIST               0
              2 STORE_FAST               1 (enc)

  6           4 LOAD_FAST                0 (flag)
              6 GET_ITER
        >>    8 FOR_ITER                17 (to 44)
             10 STORE_FAST               2 (i)

  7          12 LOAD_FAST                1 (enc)
             14 LOAD_METHOD              0 (append)
             16 LOAD_GLOBAL              1 (chr)
             18 LOAD_GLOBAL              2 (ord)
             20 LOAD_FAST                2 (i)
             22 CALL_FUNCTION            1
             24 LOAD_CONST               1 (69)
             26 BINARY_XOR
             28 LOAD_CONST               2 (5000)
             30 BINARY_ADD
             32 CALL_FUNCTION            1
             34 LOAD_METHOD              3 (encode)
             36 CALL_METHOD              0
             38 CALL_METHOD              1
             40 POP_TOP
             42 JUMP_ABSOLUTE            4 (to 8)

  8     >>   44 LOAD_CONST               3 (b'')
             46 LOAD_METHOD              4 (join)
             48 LOAD_FAST                1 (enc)
             50 CALL_METHOD              1
             52 LOAD_METHOD              5 (decode)
             54 CALL_METHOD              0
             56 RETURN_VALUE

```

Selanjutnya tinggal konversi ke kode python secara manual . Kode tersebut melakukan xor dengan 69 lalu ditambah dengan 5000 , kemudian di encode dan disimpan di file. Jadi solvernya tinggal decode , substract, lalu xor dengan konstanta yang sama. Berikut solver yang kami gunakan

```python
f = open("flag.enc","rb").read()
a = f.decode()
flag = ""
for i in a:
	flag += chr((ord(i)-5000)^69)
print(flag)
```

<figure><img src="https://lh7-us.googleusercontent.com/KZw6m3avtc6-lZNAAGyR7hgKEySwghTpGjCIvFA8mXG92W6xslKrxEo7895AKXU1KDt5COYJP8imGY15MpcG7yqa6WsQMpvsqtk_-X_nw_hx_YcrmEpDsF7YDjlG0fMxXnD-Cg93_b0RQef7F_y5yrM" alt=""><figcaption></figcaption></figure>

Flag : itf{d0nt\_u\_l0vE\_4NaLyZinG\_pYc}

## Lua (472 pts)

### Description

\-

### Solution

Diberikan file luac&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/dfN0T8D59uyCtWdR5jn6UGqH1XGFoGNfz0d4qceNf0nNAvFprnBWH9X76yS_udUkqmnlCJOTXLFQco_FUQEd-vf7LS5Fu9U4WtTA-wi8Z4Jw5_z8LssKaqTDye8Jcv4Y518DGtGE4jmg8hLZ6rqKVeo" alt=""><figcaption></figcaption></figure>

Terlihat versinya 5.2 , jadi kita bisa gunakan luadec dan compile manual dengan versi 5.2 (<https://github.com/viruscamp/luadec>) . Ketika di decompile mendapatkan segmentation fault, kita coba disassembly lalu mendapatkan nama fungsinya. Kemudian kita coba decompile specific functionnya.&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/VlHrWiZ6Mcb-TN4iX_i4EcbWNUCoQM5L-5PbUFPtR1TNTCCbc0ZySTfVWSfxwXxTqDzrDJuFMJous0lVm7liKvPB4MfPqGHo0aEEz5pin7WbuEgKpXuEznRKQaNdovYJbygTNeiMPBNJ-FUVfu-HkYg" alt=""><figcaption></figcaption></figure>

Fungsinya cukup simple , jadi selanjutnya tinggal kita reverse saja. Berikut solver yang kami gunakan

```python
f = open("challenge.luac","rb").read()
ind = f.index(b"i\x06")
a = f[ind:ind+58]
flag = ""
for i in range(0,len(a),2):
	tmp1 = a[i]
	tmp2 = a[i+1]
	tmp2 -= 5
	tmp2 >>= 1
	flag += chr(tmp2^tmp1)
print(flag)
```

<figure><img src="https://lh7-us.googleusercontent.com/jo9jCIje16RMKfc5J6siFk8hgiQnMHD3xxtYTlFc1erPWGCy_qobj0LNkj3B8sF3HceBjtCrDw3vrP4Lev-FRoD-_L_JBDOHG2fHnmA4-4t1i7BaZmO6KTc424u0pLcV7UcDXRNSkfuD-eAAhyLk7Xs" alt=""><figcaption></figcaption></figure>

## go go go! (499 pts)

### Description

\-

### Solution

Diberikan file ELF, kita buka menggunakan IDA

<figure><img src="https://lh7-us.googleusercontent.com/hfkErAsayXrBMt0whp2SBPpYxaHj_wpxF5iHf9zrYH86yh4-ozqaPR34c2daoDNgW2pHsvFhTUjV8zUCIIW00_4CqCakCYfjiRCqw48nMxD8IyDcvVNHGKA3WC9uYRnQtMaZgePra_b-Sy7bfI_GLkI" alt=""><figcaption></figcaption></figure>

Terlihat ada fungsi yang menghasilkan nilai random. Jadi kita coba debug untuk mengetahui prosesnya

<figure><img src="https://lh7-us.googleusercontent.com/8hxrQXK2uCWXJt7iRuR2B6pUjIm3IdzZJN_bytUai37ExD4w3MKxBjzZDjLL2XQUO7xdcI_7kBfLGOtLQZjSwCvGvEnIp6pzW6N9FT7HEL1dn9gmBVx9BV0xUuIhyXQD00hc0q8aORJM8V30-1BUWPo" alt=""><figcaption></figcaption></figure>

0x69 (i) di tambah dengan random value yaitu 0x54

<figure><img src="https://lh7-us.googleusercontent.com/4sSfPENNRE0lqJWHRMah6_HyDl0BR54eJcYnelIlIKFSJoYnbwJPGXCzFqsgERfLR8Jv8DCuty8MjQDNAky1w2m7Z5ybgJM7uEwNiUQoclUxoLhwu1Gz9ZhGTTPIpSWYKMqAPUzFrSmlkW7JxEkmUwI" alt=""><figcaption></figcaption></figure>

Kemudian hasil jumlah tadi di xor dengan 0x34 (random value) . Karena kita tahu format flag jadi kita bisa mencari possibility value yang digunakan untuk operasi xor dan add. Kemudian possibility nilai tersebut tinggal di operasikan ke ciphertext dan validasi flag yang mungkin secara manual. Berikut solver yang kami gunakan

```python
f = open("engkrip","rb").read()
known = "itf{"

dictt = {}
for i in range(len(known)):
	for j in range(0xff):
		for k in range(0xff):
			tmp = ord(known[i])
			tmp += j
			tmp ^= k
			if(tmp==f[i]):
				a = str(j).rjust(3,"0")
				b = str(k).rjust(3,"0")
				c = a+b
				if(c in dictt):
					dictt[c] += 1
				else:
					dictt[c] = 1

poss_key = []
for i in dictt:
	if(dictt[i]==4):
		poss_key.append([int(i[:3]) ,int(i[3:])])

for i in poss_key:
	flag = ""
	for j in f:
		flag += chr(((j^i[1])-i[0])&0xff)
	print(flag)

```

<figure><img src="https://lh7-us.googleusercontent.com/AgFHeqonA2tUdD7N1i2YZGFmMP4TgBBvSp18-LtMKmd_wSohW_pStP7RNPJS9uxfRp6WwH57YFzvuFrVD-9g0z-OFDTuKwOpA-tBymMW_jU764OqVsOAM8PVwQCW1Uz_CuLr8bFvLJa88IyenJt6O4U" alt=""><figcaption></figcaption></figure>

Flag : itf{Here's\_some\_choccy\_milk\_cz\_you\_are\_3P1CCC}

## Exposed (499 pts)

### Description

\-

### Solution

Diberikan file PE. Terlihat bahwa executable tersebut dibuat dengan c# .  Selanjutnya decompile dengan dnSpy. Terlihat bahwa program diobfuscate menggunakan confuserex. Jadi tinggal deobfuscate saja. Set breakpoint pada pemanggilan fungsi gchandle.Free().&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/82t8R3rzsIAjxbUmStAtSqSn3KfYWoCEpAdD79MC1mxPnve5Cjij_Fb9qEnGudxXI08BvV2K9msD5zb_y9OeCmdsBa3MtAYSfl3G3zadxs3GAek5ofCAVW7BcVB4aYQBapEh_NQ40VY1b-w_qLq8UTE" alt=""><figcaption></figcaption></figure>

Kemudian dump module koi yang merupakan executable aslinya.&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/cuzs5hB37HTw8TPw4vOxXnOmO0bLSHwP5ZR2F2hq8SaInutkrX8Y_Q7DYxqpPagUjdQU4upTYnXRAj4SOLk2VrAPiWrjN3SqgxVp91Y_vKjTO4QUWhWKcYboS-QnFUBNfNLnEyVccvdxuTiahbu7rP0" alt=""><figcaption></figcaption></figure>

Selanjutnya buka file koi tersebut dan terlihat kode program aslinya

<figure><img src="https://lh7-us.googleusercontent.com/MX5ywZ1jWwzuNrA5GcLg2l3XS8b1Zjs22Q4Tr6zhr36Sc1mNXJG7qiJDBrj5XCwGdhGPuJjK1PYErAbv1fjQJGxl4cHWCPND7KUx2kcHH5mMhlpw-_7D-lnlhLXsz52EHJhi_JkWVc0LwUF2PDb6I9s" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/E8PjwbO2Rv0BIlYp8EMhzBm71Dlunq6dvjygTHi_95QOfY3dOqM8SEd6qJ0DMANDS6aZx9hltYwtqG18J0ygnj8RiKrOSPBaB5o33CWfSUsZb3f6pAE8LVy5alrxnvI6094lGLcnX4SZzt97Ytpz4NU" alt=""><figcaption></figcaption></figure>

Terakhir tinggal reverse saja. Intinya value pada config.txt di xor dimana untuk valuenya (nilai setelah koma) didecode hex namun untuk keynya(nilai sebelum koma) tidak. Setelah mendapat key tinggal xor dengan isi dari setiap file. Berikut solver yang kami gunakan

```python
import os


dictt = {}
dictt['5a49034ec21b04b927949104cb0d0461'] = '7138787f424365331250470a4a52235f'
dictt['1403358783bdce4dc72076c61c10dcd5'] = '52537d495d7c6a514a550f3d2a245a08'
dictt['e5b220a461f180aa4ccbf2ff0dad637c'] = '125e2b7a5d6835645e53047342472416'
dictt['930b17e21a6dfcd2e948ec9f34ef3e87'] = '717d56315c46107b5d0b5c032a390f55'
dictt['c91d7566bf7b4d156ff350d3fe1b1bd3'] = '277046267f52545337035338702c4b72'
dictt['49fbd1af267b2945bd755037fb89542f'] = '77782b06305f100f48625423787a5051'
dictt['afd41358be3afa6c6f5d39d269ec3ad6'] = '07130f79554b587c2d36540524327a11'
dictt['e5c24594f708d88d75e17b776f01234b'] = '3c5727466d746d651471597f2a4d6d00'
dir_path = 'res'

list_files = []

def xor(a,b):
    res = []
    for i in range(len(a)):
        res.append(ord(b[i])^a[i])
        # res += bytes([(ord(a[i])^ord(b[i]))])
    return res

for path in os.listdir(dir_path):
    if os.path.isfile(os.path.join(dir_path, path)):
        list_files.append(path)
list_key = []
for i in list_files:
    key = xor(bytes.fromhex(dictt[i]),i)
    fn = dir_path + "/" + i
    f = open(fn,"rb").read()
    res = []
    for j in range(len(f)):
        res.append(key[j%len(key)]^f[j])
    g = open(fn+".jpg","wb")
    g.write(bytes(res))
    g.close()
```

<figure><img src="https://lh7-us.googleusercontent.com/pEpvWOhtA4BHXZOkdHefL89ZCxFMqb5XeSTIUybEvg7RNnp_1nsdF6iJhigHGG5KxINUb_GaJchj5lMncYt8U7_Yu-lA7f_D9OsNzzuhTg-AH-_SaW4W1aA1ZjwsGCTEogMnc9kIkwncFESqTz9e5oY" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/AOSKUILsbaXJ4L-CMiGZ5fiipj0LNGq-vXf1FOIRkTBmino41P5j2SQDZZWxSXfS5f_M7yNW3z2sLdMQIZvC5lGwmWFFvhI5JbfjYp1f6I96MorYuNz1WWnTezcWyJxUmLjiifNtiOxhvhH-Lqebvd8" alt=""><figcaption></figcaption></figure>

Kemudian tinggal satukan gambarnya dan dapat flag

<figure><img src="https://lh7-us.googleusercontent.com/AQRyayssFM9A3eKWMsuRIqerIpM-WOpIoUIotTQDWBnA8LB2_BLDQ7G8XnSc1DjR_jae8nebXr1d1ZvYAVSHfL9OuPPI5wKh6Ld_pH7gLprKaw0Djgx-tYhx2Y4jaqR-UWRTjl0KQvDfoTM5NAikcao" alt=""><figcaption></figcaption></figure>

Flag : itf{exp0s3d\_keys\_are\_dang3rous}
