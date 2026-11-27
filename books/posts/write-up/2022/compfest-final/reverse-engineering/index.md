# Reverse Engineering

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>baby networking (496 pts)🥇</td><td><a href="#baby-networking-496-pts">Here</a></td></tr><tr><td>baby mips? (500 pts)🥇</td><td><a href="#baby-mips-500-pts">Here</a></td></tr></tbody></table>

## baby networking (496 pts)

### Description

\-

### Solution

Diberikan file ELF, kami langsung membukanya menggunakan IDA

<figure><img src="https://lh7-us.googleusercontent.com/RAzbbqsEBHPRRbXQAX2NQbeZwA2PYKHD0x6jpjAo06MajpKcs3OuCJEo_oB-Ns_xzmdy9cGYlD1joePYeYLG7FCH-RuenQqRrBl5LKhjRmQ7VlnKW6IK_5vn-babmzSa_fd2qc9cx9o6cWd4GiIM2I0" alt=""><figcaption></figcaption></figure>

Jadi disini fungsi yang berjalan dengan sempurna adalah fungsi generate public key. Berikut fungsinya

<figure><img src="https://lh7-us.googleusercontent.com/jY7gDBcPj0ua0hzKztQfYyCp8Bnd5yJ-sHnvVzcHPyixxX7AUu5pAG4xcx-qmN2eo4ZzGSCxL_kTa_uxD4idd3SheUZfMD5MqIClN-0EFVRzJmM8cUvV1PLr-L4ppM3mqV00oC4KTlDUqFU9doY0Vxk" alt=""><figcaption></figcaption></figure>

Name dan host dilakukan enkripsi dengna key yaitu IP . Berikut algoritma enkripsinya

<figure><img src="https://lh7-us.googleusercontent.com/2iQ6DlFB1AkDU2SRBRERqYIr1Ev11xWyqIGjR2MPj8Y61TaS8abAuB0b1kOiYvjBL0Zpmjyi3dkduuXYtxQNpwuQLLkQkrtRc9jaFRtrbKhvlRGMFixU2zLfWtx6vJO-GiYOaeUELe-nBb5om2D0TVg" alt=""><figcaption></figcaption></figure>

Disini kami tidak membaca deskripsi , namun kami berhasil melakukan leak terhadap IP address dengan berdasarkan pada ip dari service lain . Berikut script yang kami gunakan ketika melakuka percobaan semi manual

```python
# a = "gcaeeqwrrgmnvyxgcaevjnlraidvzm11235"
a = "nsbopgwibtJcqm8080"

# a1[i] = (a1[i] - 97 + a2[i] - 46) % 26 + 97;
def dec(a1,a2):
	res = ""
	for i in range(min(len(a1),len(a2))):
		res += chr(((ord(a1[i]) - 97 - ord(a2[i]) + 46) % 26) + 97)
	return res

def enc(a1,a2):
	res = ""
	for i in range(min(len(a1),len(a2))):
		res += chr((ord(a1[i]) - 97 + ord(a2[i]) - 46) % 26 + 97)
	return res

# z = "wibtJcqm"
# b = "kosong"
# a = dec(z,"127.0.0.1")
# print(a)

a = "gcaeeqwrrgmnvyx"
b = "gcaevjnlraidvzm"
test = "taestaaaaaa.com"
# c = "^_`^nrvoqjKcrp1234"
c = "whvtkrvtKfrm"
# plain = "kosong"
# print(enc(plain,"127.0.0.1"))
brute = "103.167.132.188"
print("name",dec(a,brute))
print("host",dec(b,brute))

```

<figure><img src="https://lh7-us.googleusercontent.com/p0mAhj_lMncQJDVdbkGi0B4p9DUAw_2tpQSkrpcs4RmKPB_1bIRQCWLnxa0AaVeR6Ti3TtxtiKALKeHt3piDSieTffkno3Up0hT-Xj-X6RiujSdvCoT7ISzUo695Om5W3j3fdNDGh1xUsVBLgSGC1Oc" alt=""><figcaption></figcaption></figure>

Kemudian kami membaca deskripsi dan ternyata ada namanya jadi ini benar. Selanjutnya tinggal cari tahu fungsi untuk komunikasi dengan server

<figure><img src="https://lh7-us.googleusercontent.com/sCdyjb16phIKP7EJqgQJWIBBB_hqUhoOhLAtCaT61vysNSsTaJnzQrsHcir78gFPyGiH97CwEV2Zmbfdhg6_A016T_IwRXWnonTQXie0wDkRpk_2kGGD85UYI5014bISfbu60b6xqB0zAQ8Bf_am6O0" alt=""><figcaption></figcaption></figure>

Fungsi pada ELF tidak sempurna , namun overall jelas. Jadi caranya adalah dengan konek ke server lalu mengirim value sebagai berikut

<figure><img src="https://lh7-us.googleusercontent.com/F5oG-ZSi6rN0d_qsiPCm0WeGGcuv9QTY8VoYcnDv38dY-rvlYj0Pu-kDhxIy2_EKjblN-J1T1e-QkksN6AAd4MBKg7dXClJruKDj8LRvUWdme4R9hV4rYOJULRUpcV1HQqPo6_soSEYyThYXhYDszLQ" alt=""><figcaption></figcaption></figure>

```
flag<name>_<host>_<ip>_<port>
```

Berikut final solver dari kami

```python
from pwn import *

r = remote("103.167.132.188",11235)
payload = "flagdavebinrobinson_davesbelovedspc_103.167.132.188_11235"
r.send(payload)
r.interactive()
```

<figure><img src="https://lh7-us.googleusercontent.com/CQsT1RFq_5hTBfXp8CNvKtgRgbkghu1sM0sot3yMWwnBV57-b_Ez7LSw5433x5c9B-qjUYZqaNiv_QRgEneevzcN97PQKK3SV7XRvz07ZS8Lmr8Bbg5HfJ4Ppb-RDZKgr1iCyQj_KEzKTdzDDHNOkWY" alt=""><figcaption></figcaption></figure>

Flag : COMPFEST14{D4ve\_heR3\_t0ld\_mE\_tHat\_this\_chAllenge\_1s\_tr4sh\_cf74de3037}

## baby mips? (500 pts)

### Description

\-

### Solution

Diberikan ELF yang dicompile menggunakan mips64 el, binary tersebut dicompile dengan static. Kami menggunakan referensi berikut untuk melakukan debug <https://reverseengineering.stackexchange.com/questions/8829/cross-debugging-for-arm-mips-elf-with-qemu-toolchain> dan diawal kami coba lakukan compile dan debug untuk program yang kita buat sendiri (untuk memahami proses debugging terhadap mips64el executable) . Lakukan debug. Disini untuk menemukan fungsi dengan cara trial and error, intinya kami coba breakpoint di beberapa fungsi yang sepertinya dibuat oleh problem setter (bukan library). Hingga kami menemukan fungsi yang menerima input sampai di operasi terhadap input. Berikut daftar breakpoint yang tercatat (ketika step akhir untuk mendapat flag).&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/do4g23n5AGKRMNUBeovg2cXWZcHLFiwEqSDDvLKwIQYfXrEELiIjyRgrWHaNH1dSPRbvlTX5PH2GDPvgakEGrCM-O0-CQwvNcveWNQRm7GEmMuCecL2c970S7LlHDJcPCGBlHqyt1kPT4ewLEfXidsA" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/ArJPs9wBcJl7g9peqhZagAP6z0yBzRkYqSKtX9lQNZNw-H_7bUUkMW977Y3iiQLYMsXayJ0MvwlsaaxP2F-eSqV_k4F0EFwbxdM3pD6FxasHUIC6M0CrxqcjWgmTA1nsqQ9CCaNQsS10Y2TNAxIWMXE" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/gH-E9Cc-XsB8Z_V585TfAgvq5X9oTb8YFuNT2SMrFDvpa1IyfNvkwjhms-tnvQx9RQAhvpN_A0w1jIDDR1RehHATaTab85saQYHiHE7vG29EV49oXw9EPeejFgAR5ALhrkfLtCM7O0bVkE3Cudv8Nw8" alt=""><figcaption></figcaption></figure>

Pada salah satu fungsi kami melihat addressnya lalu cross check dengan ghidra dan didapatkan fungsi berikut

<figure><img src="https://lh7-us.googleusercontent.com/OnsFzcv6ZZYylqkIBiZpXZSMD8DogH8RvWXqH7y2lqueExkD7q8JriOIfZ8ze34WhHFKUXlCONFCJ0djw8QxS9wnUkTbEFZgoY_vma7A4bOkhulZzb6K1aSueCHy0SE-iczxvdGHBmBcaO6ydeyGvwU" alt=""><figcaption></figcaption></figure>

Terlihat bahwa dilakukan xor, dan hasil dari analisis kami setiap hasil enkripsi untuk input nilainya sama asalkan indexnya sama dan valuenya sama untuk index tersebut. Ketika kami lakukan breakpoint pada fungsi tersebut didapatkan bahwa input kita (4 byte) di lakukan xor dengan suatu nilai static.

<figure><img src="https://lh7-us.googleusercontent.com/8AaAy0NexRhL4FRWZ_XObYykbOnV7R8vps2AXmRvC4ByEEQT2JoywdrMaLFKZYy89VLa7tJ4fatuIL7JF5QWC3VUoC8FjHKx7BI_xilhLv25YcHFa9qI7vZOEkVER0u6Sli-zHN1MsTejcHuIaMTSyo" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/8DE0176XD5WJ56zMV3fbEQviZEknrF2tUz1Q2-ipFtfl2fFQKheXmr7IjXlIs_iC9GeNm9FWl6nz308Lg9IlHi08zI5cCaZjLSRgp97K0SZVrC2W_CKOeaQZNxCC7klKeXuv4L39EW4R5Ao3QryOKxY" alt=""><figcaption></figcaption></figure>

Dump nilai tersebut lalu xor dengan encrypted value dari soal dan dapat flag. Berikut solver yang kami gunakan

```python
a = [0xc0,0xff,0xbd,0x67,0x00,0x00,0xbf,0xff,0x08,0x00,0xa4,0x67,0x25,0x28,0x00,0x00,0x2c,0x00,0x06,0x24,0x60,0x80,0x99,0xdf,0xf5,0x09,0x11,0x04,0x00,0x00,0x00,0x00,0x68,0x80,0x84,0xdf,0x08,0x00,0xa5,0x67,0x70,0x80,0x99,0xdf,0x28,0x01,0x11,0x04,0x00,0x00,0x00,0x00,0x08,0x00,0xb0,0x67,0x08,0x00,0xac,0x67]
f = open("out.bin","rb").read()
flag = ""
for i in range(len(f)):
	flag += chr(f[i]^a[i])
print(flag)
```

<figure><img src="https://lh7-us.googleusercontent.com/GitLvVtFLUPuhwF4V9CoKb0Yxr9iu-1KBi1wlZa3N2cih_5y4685U9dTHJ7BQ-ZWc6eQt9coYseoAR3-qrlt2_HgmzuMTClLs-3D6lZxy3YwRkfsx4o9SpD3iNUr015gQPQgAP7Q3B0scCEt3aRjB3I" alt=""><figcaption></figcaption></figure>

Flag : COMPFEST14{m1ps\_i3\_e4sy\_r1gHt???\_b868937a70}
