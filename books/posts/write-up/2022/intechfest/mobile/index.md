# Mobile

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>flag (428 pts)</td><td><a href="#flag-428-pts">Here</a></td></tr><tr><td>OAT (500 pts)🥇</td><td><a href="#oat-500-pts">Here</a></td></tr><tr><td>Game #1 (500 pts)🥇</td><td><a href="#game-1-500-pts">Here</a></td></tr><tr><td>Game #2 (500 pts)🥇</td><td><a href="#game-2-500-pts">Here</a></td></tr><tr><td>Game #3 (500 pts)🥇</td><td><a href="#game-3-500-pts">Here</a></td></tr><tr><td>Game #4 (500 pts)🥇</td><td><a href="#game-4-500-pts">Here</a></td></tr></tbody></table>

## flag (428 pts)

### Description

\-

### Solution

Diberikan file apk , kami lakukan decompile dengan menggunakan apktool. Kemudian lakukan grep pada string flag dan kami mendapatkan suatu hash.

<figure><img src="https://lh7-us.googleusercontent.com/268LR9tXuQ8A94ushFwDYJMhLMM7UytAvBDCI5a4Cir53iXScqOu6ZcLiNg3e54QwFI__gaHQKvLwn-iSDauKwdtuHIbMqR_WC7jkQqeddYCLRKHQuALj6Dr3Z2qkOSgB_beA_-g4dEsY2yOSFh6WG4" alt=""><figcaption></figcaption></figure>

Selanjutnya kami lakukan crack dengan onlinetools yaitu crackstation.

<figure><img src="https://lh7-us.googleusercontent.com/_64-ngeqRL68OdGJ0wN_1aOTTlHYo6g7OJq9HVjBvrhHFUT1vnFK6FMtVky0sFgn_GltEwM62CxpXxhIfhC6ytQ-HOnGjdafR9rO0mg9kITmoS5Q2xrfBRGOgx_vvQnRsRFK7EZtKH0QtqrrPU5gaSw" alt=""><figcaption></figcaption></figure>

Flag : itf{Android}

## OAT (500 pts)

### Description

\-

### Solution

Diberikan file oat

<figure><img src="https://lh7-us.googleusercontent.com/4oAIXBOdUphGPG8OvICFgWwWln2ZUCHcpNs_K2T3wK-C4gS9qD40PE4mG8f23kR1RwIrzdyMjjMUFWLxl5U311b4NUMvy4VS54dYdJwwIQKtaNxtGhT47reo-dpZQLL8d3542nrcObIy3IpGjg5FHIs" alt=""><figcaption></figcaption></figure>

Disini kami menggunakan oat2dex untuk mendapatkan file dexnya.

<figure><img src="https://lh7-us.googleusercontent.com/H_2lIqBVuhNFuKx5Q4JYjamSU2XJzxnTPsTddgNyq9ymh9kaTEIbJDsoPEhL531v_TRtfcS-K2pU355tqhbqw4VF817_71dPYEy8F0tTYJ9dYwrn44or_I3r2U3Eke2xNKd3XiwSObD0kS4ft0j8Z1Q" alt=""><figcaption></figcaption></figure>

Sesudah mendapatkan odex , kita bisa decompile menjadi java dengan jadx.&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/0qSYCYZupIWP_9rCFHrWKUBfhWa0igp0qul77uJjZ59LWXZzSAqaeyKUKznsuORv0_6d0yQocKMzL6SXCVK0lh9wII6_X3WTUBIKgZ2M1GdFZe5S6ZMja-DjdKCUWRXGqUZqcq3yjYsPMUO6qH3WF8M" alt=""><figcaption></figcaption></figure>

Kemudian kami mencari “flag” pada direktori com.mxtech karena ini package utama dari APK. Akhirnya kami mendapatkan function decrypt\_flag

<figure><img src="https://lh7-us.googleusercontent.com/tyU_-Ys1LJI35F2D_CjaD6FIiNaTAyUKof1yKKCR0mLzSpQx8FHj9ArdV_ITwY19C4V-RS7bv3ipACi2wlsbxGIBq_FxR0VpKQ_0U4iEO-CEhhClNuW0dRUtMDItVeW0AwHa-efik_pfJCRvPbGeyXg" alt=""><figcaption></figcaption></figure>

Karena ini fungsi decrypt flag , jadi cukup salin dan compile menggunakan java untuk dapat flag. Berikut solver yang kami gunakan

<figure><img src="https://lh7-us.googleusercontent.com/WgO_Rnw04PbWPlW9rVUn02OAvQ_2DzYepB8o5GBQKGQ3h283l2IK032Ub7GE3qa2qxhJoE5za9qMpKqM4njlqA0FrO2AGXKFsPgPdjIqQEqzQ5JB2WrNf7qUZaj4q-r_p4nxvw04s2rjEHoVBLIHVFM" alt=""><figcaption></figcaption></figure>

Flag : itf{an4lyzing\_d33x\_l1k3\_a\_b00ss}

## Game #1 (500 pts)

### Description

\-

### Solution

Diberikan sebuah apk, kami coba decompile menggunakan jadx

<figure><img src="https://lh7-us.googleusercontent.com/VKsxWHMvFPi_GR7yxxWRjWMBgYa17p6tVJD1iXAPVFiwHn3gpnHSuL4vg7xxz0mzVykupkr4HWHWKQO1IkvcVr0ieIL9a9Z5brYGhGEah6VxcopGDyMc75TrX29BPIYpONecYUF0bNsw10R1vDIBLnQ" alt=""><figcaption></figcaption></figure>

Terdapat native library yaitu intechfest yang di load dimana 2 fungsi yang dipanggil pada mainActivity adalah init dan check. Kita lakukan decompile pada library tersebut menggunakan IDA

<figure><img src="https://lh7-us.googleusercontent.com/LFw5KfT5lm6Fn-M0LbtsS90CezqMFpxgPubxZ8VNvn6_76Gt4r7XoD9e7w1hTKDK45brvN_jXa4pWqktyYztpEj0XC4cCmALZa76ISZrKJm3KSD6Y29YvKUogBMs7JItdW95Ab3IkeZm_qt1cCeTLm0" alt=""><figcaption></figcaption></figure>

Pada fungsi init , setelah kami analisis terlihat bahwa dilakukan decrypt section .text. Langkah decryptnya simple yaitu dilakukan xor dengan key , dimana key digenerate berdasarkan static value. Jadi disini kami reproduce kode untuk generate key untuk mendapatkan key. Berikut kodenya

```c
#include <stdio.h>

int main(int argc, char const *argv[])
{
	char g_key[] = {0x6F, 0x68, 0xF0, 0xED, 0x66, 0x55, 0xE2, 0x75, 0xF0, 0x4C, 0xD7, 0x6B, 0x50, 0x71, 0xD9, 0xEB, 0xCB, 0xED, 0x5B, 0x6D, 0xCE, 0x64, 0xE7, 0x4F, 0x6C, 0x67, 0xE2, 0x67, 0x62, 0xEF, 0x31};
	for ( int i = 0; i <= 0x1E; ++i ){
        g_key[i] = (((((g_key[i] + 26) & 0x80) != 0) | (2 * (g_key[i] + 26))) ^ 0x95 ^ i) - 29;
	}
	for (int i = 0; i <= 0x1e; ++i)
	{
		printf("%c", g_key[i]);
	}
	printf("\n");
	return 0;
}

```

&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/OzyuKP1I31qn9vfgPxCTUYr9s2IhZu85ktKEP1iiY84d85IYxtRNVTgaSza_Vj-mMdDRXz70KQYDGpEssQFClPozksWVSgUz-2nQ9BXUG_OViMr_bVn-zsCZZJHWOj9sSpTwVshrCLGRSIImZvU--9g" alt=""><figcaption></figcaption></figure>

Dapat flag pertama, setelah dapat flag pertama untuk melakukan decrypt terhadap section main ternyata tidak dimulai dari index ke-0 pada key. Namun kita bisa bruteforce dan validasi manual untuk index key yang digunakan mulai dari nilai berapa. Caranya adalah dengan disassemble fungsi yang didecrypt dan validasi manual .&#x20;

```python
from elftools.elf.elffile import ELFFile
from capstone import *
import os

f = open('./libintechfest.so', 'rb')
g = f.read()
elf = ELFFile(f)
code = elf.get_section_by_name('.text')
ops = code.data()
start =  g.index(ops[:10])
length = len(ops)
key = b"itf{s1Mpl3_x0r_s1mPl3_d3crYpT}"
for ind in range(0,len(key)):
    h = list(g)
    # print(h[0])
    for i in range(start,start+length+1):
        h[i] = h[i]^key[(i+ind)%30]
    fn = "libpatch_first.so"
    out = open(fn,"wb")
    out.write(bytes(h))
    out.close()
    print(ind)
    os.system("aarch64-linux-gnu-objdump -d libpatch_first.so  | grep -A3 \" 10000:\"")

```

<figure><img src="https://lh7-us.googleusercontent.com/DuQLT9v-aQ-T_cz-CPs89h_17u7u7NDOGFXFVnBXhlsRNhhw9CzZnrNjaJ0MYx3FbGRK-WSfgQqI_VtIH1p74hmkWRXk6qEI3EIEyZ_mRSymh_20Jh9ook7BwqEIHuSHjaJmeRtKHz8a1o3Ebzr6ZFo" alt=""><figcaption></figcaption></figure>

Terlihat index 14 memiliki instruksi yang valid. Jadi gunakan index 14 untuk start index pada key dan lakukan decrypt keseluruhan section .text. Caranya cukup ubah loop ind yang awalnya range(0,len(key)) menjadi range(14,15)

<figure><img src="https://lh7-us.googleusercontent.com/ZHuR7jn8mcif80XMOkHMcnoy8RVsEnVs1zlRY4qrKQDIb-H5Yr6Pn0pJCk5rNGmtpkDNdwx4Zfe11XfsRjZU6KfvVmvt-oHauwNjfup4SI-8Hs0p4uon3I2rK8XnGiv7bddFQO45naoe2Pal2hlMZUg" alt=""><figcaption></figcaption></figure>

Sampai disini kita telah berhasil decrypt section .text

Flag : itf{s1Mpl3\_x0r\_s1mPl3\_d3crYpT}

## Game #2 (500 pts)

### Description

\-

### Solution

Selanjutnya untuk game #2 lanjutkan analisis pada library. Disini kami melakukan analisis terhadap fungsi level1 pada gambar sebelumnya.

<figure><img src="https://lh7-us.googleusercontent.com/scI_38n5Fg0-KaTROshljD395-OoeD03yI6G8BuvMHLE3oyHiGLPPLD4PtRlhFiNgYPEQtcp-oriUzyDyXJ4tAZ6kPXG7tbY6ipOQAe3AD__0EqOmXDM1aRJcbXon6LKiYVO7f8XU3LbbsLa-Zs7E50" alt=""><figcaption></figcaption></figure>

level 1 melakukan decrypt terhadap section .level2 , dan sub\_104D0 merupakan fungsi string compare, jadi kita bisa mendapatkan keynya dari fungsi  SSM::Decrypt((SSM \*)((unsigned int)\&dword\_40 + 1)); . Argument fungsi SSM:Decrypt adalah 0x40+1 . Jadi implementasikan SSM:Decrypt menggunakan python dan dapatkan hasil decrpyt untuk nilai sesuai argumentnya. Berikut implementasi dari SSM:Decrypt.

```python
data = [0, 0xC3, 0x88, 0xAF, 0xEF, 0x23, 0, 0, 0xB5, 0x67, 0x74, 0x92, 0x82, 0x26, 0xDF, 0x8F, 0xE2, 0x57, 0x89, 0xA7, 0x3E, 0x55, 0x77, 0x3A, 0x4C, 0x74, 0x70, 0x5F, 0xBD, 0xD0, 0, 0, 0xB9, 0x3D, 0x82, 0x13, 0x1D, 0x76, 0x59, 0xED, 0x4B, 0x56, 0xDA, 0xB1, 0xCC, 0xF6, 0x6F, 0xB7, 0x23, 0xF1, 0xE3, 0x83, 0x6D, 0xFB, 0x72, 0xD6, 0x58, 0x77, 0x1C, 0x25, 0x98, 0x75, 0x1F, 0xD9, 0, 0, 0x48, 0x94, 0x89, 0x4D, 0xD, 0x2D, 0x58, 0x70, 0xEE, 0x96, 0x48, 0x30, 0x2E, 0xA3, 0x7F, 0xD5, 0xC2, 0xCB, 0x4C, 0xD5, 0xBE, 0x67, 0x2D, 0xBD, 0x44, 0xEC, 2, 0xC2, 0x3E, 0x59, 0, 0, 0x4D, 0xC5, 0x8C, 0xDB, 0x15, 0xE4, 0x50, 0x9B, 0xBC, 0xF9, 0x8C, 0x3F, 0xE7, 0x4E, 0xF8, 0xDA, 0x56, 0x4F, 0, 0, 0x77, 0xF9, 0x94, 0xD, 8, 0x84, 0x55, 0x3B, 0xB7, 0x94, 0xBD, 0xC3, 0xCB, 6, 0x8A, 0xCD, 0xBD, 0x68, 0x41, 0x6E, 0x76, 0xEF, 0xC0, 0xAC, 0x30, 0x54, 0xD0, 0xA3, 0x68, 0xA4, 0xEB, 0x6D, 0x57, 0x65, 0xD6, 0xE0, 0xEC, 0x9B, 0, 0, 0xFB, 0xC9, 0xAC, 0x6A, 0xB, 0x63, 3, 0x81, 0xFE, 0xBD, 0x63, 0xBB, 0x9B, 1, 0x5C, 1, 0xA, 0, 0, 0x38, 0x34, 0xE2, 0xDF, 0x42, 0xB7, 0x32, 0xDC, 0x21, 0x3D, 0xFD, 0xEA, 0xA3, 0xAF, 0x5C, 0x61, 0x4E, 0x14, 0x25, 4, 0x59, 0x74, 0x7C, 0xA9, 0x3B, 0x3D, 0xBF, 0xDD, 0x91, 0x7E, 0xE1, 0x2F, 0x71, 0xE7, 0xD1, 0x6D, 0x3B, 0, 0, 0x9B, 0x6D, 0xC, 0x7C, 0x63, 0x37, 0xCB, 0x45, 0x56, 0, 0, 0xBA, 0xBF, 0xC1, 0xE3, 0xB6, 0x8F, 0x2B, 0x91, 0x7E, 0xDF, 0xAB, 0x98, 0x8C, 0xD7, 0x89, 0x74, 0x5A, 0x64, 0xA0, 0x1D, 0x55, 0x91, 0xF1, 0xCC, 0x67, 0x1D, 0xD7, 0x5F, 0x77, 0x26, 0x8A, 0xC2, 0xC3, 0x91, 0x92, 0x25, 0x31, 0xF, 0x72, 0xC0, 0x54, 0x23, 0x97, 0xF1, 7, 0x94, 0x53, 0x20, 0xEB, 0xC0, 0xD1, 0x20, 0xE5, 0x8B, 0x29, 0x8C, 0xEF, 0x5B, 0xC3, 0xCC, 0x91, 0, 0, 0x42, 0xA1, 0xCC, 0x4F, 0xD1, 0xBC, 0xF8, 0x5E, 0x7F, 0xB7, 0xD8, 0x24, 0x7F, 0x4A, 0x52, 0x91, 0x23, 0xE5, 0x61, 0xCE, 0x73, 0x49, 0, 0, 0xC6, 0x47, 0x2C, 2, 0xEE, 0xDD, 0xFD, 0xAF, 0, 0, 0x1F, 0xCD, 6, 0xA, 0xB6, 0xA8, 0x76, 0xE7, 0x20, 0x91, 0x1A, 0x57, 0x98, 0x37, 0x61, 0xE2, 0xF6, 0x2E, 0x4A, 0x4B, 0, 0, 0x34, 0x7E, 0xEB, 0x62, 0, 0, 0xB5, 0xD8, 0x45, 0x6A, 0x59, 0xA0, 0xC2, 0xE1, 0x1F, 0x1F, 0x9A, 0x4F, 0xAE, 0x76, 0x68, 0x9E, 0x66, 0xAB, 0x9C, 0x17, 0xD4, 0x24, 0x87, 0xA0, 0x47, 0x65, 0xD1, 0x20, 0x1F, 0x65, 0x66, 0x81, 0xA6, 0x76, 0xC4, 0x82, 0x42, 0x5D, 0xBF, 0xF4, 0xD1, 0x3F, 0xC, 3, 0x50, 0, 0, 0x33, 0x74, 0x60, 0xA2, 0x47, 0xEC, 0x15, 0xDB, 0x71, 0, 0, 0x9D, 0x69, 0x69, 0xF5, 0xD8, 0xB0, 0xE2, 0x63, 0x7F, 0xB4, 0x31, 0x4D, 0x6D, 0xDA, 0xA2, 0xAD, 0x4D, 0x84, 0x12, 0xE8, 0x25, 0x13, 0xA5, 0xF1, 0x61, 0xD3, 0xDA, 0xF8, 0xDE, 5, 0x37, 0xF9, 0x2C, 0xE5, 0xBA, 0x1B, 0, 0, 0xD4, 0xA8, 0x5A, 0xBC, 0xC8, 0x4F, 0xD1, 0x61, 0x71, 0xFB, 0x96, 0x1D, 0xE1, 0xA7, 0x5E, 0xD1, 0x16, 0x5A, 0xEB, 0, 0, 0xA7, 0x1E, 0xFB, 0x6E, 0x59, 0xE, 0xC4, 0xAC, 0xB3, 0x28, 0xA6, 0x2B, 0xE3, 0x2E, 0xBE, 0x8E, 0xCD, 0x14, 0xB5, 0, 0, 0xE3, 0xCB, 0x32, 0xF7, 0xC6, 0xBA, 0x82, 0x8B, 0xA9, 0, 0, 0x6B, 0x75, 0, 0, 0x67, 0xEF, 0xCF, 0xA5, 0xE6, 0xFD, 0x2F, 0x60, 0, 0, 0x14, 0xDB, 0xCE, 0x4B, 0x45, 0x62, 0xC, 0xAC, 0x62, 0x95, 0xB1, 0, 0]
keys = [0x4A, 0xC0, 0x4B, 0x9C, 0xC6, 0x72, 0xB3, 0x9B, 0x6D, 0xB8, 0x56, 0xC1, 0xF8, 0x1E, 0xE7, 0xD2, 0xB5, 0x93, 0xA8, 0x43, 0xF, 0x7B, 0xE3, 0x63, 7, 0x7B, 0xC5, 0xFC, 0x7D, 0xB7, 0x11, 0x46, 0x77, 0x5B, 0xE1, 0xBC, 0x4C, 0x95, 0x57, 0xB8, 0x4D, 0xAC, 0xF9, 0x45, 0x49, 0xE0, 0x17, 0xFE, 0xF2, 0x3E, 0x41, 0x80, 0xB9, 0xA3, 0x63, 0x3F, 0x1E, 0x28, 0xBB, 0x1A, 0xDE, 0xCB, 0x60, 0xD5, 0xA5, 0x41, 0x91, 0xF1, 0x55, 0x29, 0x21, 0x14, 0x22, 0x65, 0x5D, 0x81, 0xFB, 0x5B, 0xF3, 0xB8, 0x1B, 0x73, 0xF0, 0xBD, 0xD5, 0x30, 0x5B, 0x7D, 0xEA, 0x74, 0x5B, 0xB5, 0xD3, 0x30, 0xD9, 0x94, 0x41, 0xCA, 0xE8, 0xA8, 0xF3, 0x89, 0x3B, 0x94, 0xED, 0x97, 0x95, 0x68, 0x71, 0x88, 0xA0, 0x8B, 0x7A, 0x90, 0xC8, 0xCF, 0x3F, 0x23, 0x4C, 0xA8, 0x16, 0x26, 0xDC, 0x69, 0x56, 0xB6, 0xFC, 0x16, 0x80, 0x64, 0xBD, 0xF2, 0xEC, 0xF7, 0x87, 0x5A, 0xF, 0x9B, 0x41, 0x7F, 0xA2, 0x60, 0x8A, 0x9B, 0xF0, 0xD1, 0x6A, 0xAE, 0xF3, 0x35, 0x57, 0x88, 0x5B, 0x33, 0xF0, 0x30, 0x68, 0x6C, 0x45, 0xE8, 0x81, 0x5A, 0x3C, 0x78, 0x60, 0x15, 6, 0xFA, 0xD5, 0x85, 0x9C, 0x35, 0x8E, 0x38, 0xA4, 0x5F, 0x21, 0x53, 0xD1, 0x56, 0xA9, 0x59, 0xB0, 0x5B, 0xC9, 0x5F, 0xC3, 0x35, 0xA3, 0x2B, 0x84, 0x24, 0x84, 0x40, 0x1B, 0xE4, 0xD3, 0x21, 0x5E, 0xA8, 0x25, 0x7A, 0x5D, 0x32, 0x31, 1, 0x90, 0x51, 0x53, 0xE0, 0x26, 0x7B, 0xB8, 0x55, 0xD6, 0x81, 0xB3, 0x19, 0xB6, 0xD5, 0x43, 0xB9, 0xF8, 0x46, 0x78, 0x93, 0xA9, 0xB3, 8, 0x73, 0x57, 0x81, 0xCF, 0x88, 0xB1, 0xD0, 0x97, 0x81, 0x23, 0x77, 0xA7, 0x1E, 0x2F, 0xFB, 0x73, 0x30, 0x8B, 0xE5, 4, 0x4D, 0x1E, 0xFC, 0x12, 0x96, 0xF, 0xBB, 0xE1, 0xC1, 0x42, 0x54, 0x97, 0xC2, 0x24, 0x1F, 0xF2, 0x73, 0xB5, 0xF2, 0x15, 0xAB, 0x99, 0x32, 0x59, 0x15, 0xA4, 0x88, 0x43, 0xAE, 0x6D, 0x46, 0xFA, 0xB, 0xC1, 0xD, 0xA0, 0xCF, 0x47, 1, 0x10, 0x88, 0xD3, 0xA6, 0xC9, 0x76, 0x44, 0x3B, 0xE8, 0x78, 0x2D, 0x7D, 0xA2, 0x46, 0xAE, 0xFB, 0x5A, 0xD2, 0x83, 0x1C, 0x80, 0x70, 0x61, 0xFA, 0x7A, 0xA2, 7, 0x99, 0x71, 0xCC, 0x99, 1, 0x54, 0xEB, 0x26, 0x1D, 0x62, 0x6A, 0x57, 0xC9, 0x61, 3, 0x46, 4, 0x48, 0x74, 0xFE, 0x21, 0x46, 0x81, 0x3C, 0xC5, 0x70, 0x1D, 0xBF, 0xE9, 0xBE, 0x45, 2, 0xAE, 0x11, 0x9A, 0x2E, 0xE3, 6, 0x54, 0xFF, 0x67, 0x3D, 0xD5, 0xAF, 0x1D, 0xD8, 0xF5, 0x20, 0x20, 0x69, 0x9D, 0x41, 0xAE, 0x9E, 0xFB, 0xF2, 0xE, 0x18, 0x32, 0x77, 0x55, 0xF5, 0x78, 0x83, 7, 0x92, 0xB0, 0x69, 0x97, 0x83, 0x69, 0xFD, 0x3F, 0xBD, 0xAC, 0x5C, 0x95, 0x21, 0xFA, 0x35, 9, 0x98, 0xF4, 0xB6, 0xB5, 0xEF, 0x29, 0xC2, 0x87, 0x5A, 0x39, 0x5B, 0x4F, 0xB1, 0xDD, 0xD4, 0x43, 0xE, 0x3E, 0xD9, 0x10, 0x26, 0x56, 0x4F, 0x62, 0x81, 0xAA, 0xF7, 0x22, 0x24, 0xAB, 0x2A, 0xBB, 0x9F, 0x60, 0x70, 0xE, 0x88, 0xB2, 0x14, 0x61, 0xEA, 0x6F, 0x2F, 0x1B, 0x4C, 0x83, 0xDC, 0xD8, 0xC0, 0x35, 0xE8, 0x65, 0xA, 0x37, 0xC6, 0xB, 0x60, 0x3D, 0x2C, 0x83, 0xE7, 0x55, 0xBE, 6, 0xB4, 0xAD, 0x93, 0xBB, 0x5F, 0xA6, 0x1C, 0xC9, 0x15, 0x4B, 0xE3, 0xE0, 0xCD, 0x40, 0xB8, 0xD, 0x74, 0xA0, 0xF0, 0x7E, 0x56, 0x36, 0x88, 0xB5, 0x73, 0x33, 0xB8, 0xD9, 0x87, 0x76, 0x5F, 0xBB, 0x23, 0x71, 0xF5, 0x82, 0x17, 0x91, 0xCA, 0xAB, 0x5B, 0x2D, 0x8B, 0xA7, 0x6C, 0xC2, 0x33, 0xE0, 0xE2, 0x23, 0xDD, 0x38, 0xD7, 0xE4, 0x6D, 0x4A, 0x17, 0x25, 0xA3, 0x1D, 0x9A, 0x81, 0x57, 0x3C, 0xF1, 0x4D, 0x3D, 0]
param_1 = 0x40+1
result = []
i = 0
dec = ""
while data[param_1+1+i]!=0:
    data[param_1+1+i] ^= (keys[param_1+i] * (param_1-i))^0xa0
    dec += chr(data[param_1+1+i]&0xff)
    i+=1
print(dec)
```

<figure><img src="https://lh7-us.googleusercontent.com/QEjhXrs0mcQKR4zBCA7-Ltlqy2q43qvnhmuVnWTeQt35NFXYyLPw85xgDeu8q6pe5wO7OdyOUZSCwz6aHbO--6P_rZYLmDZwZr1Z7d7VOugi2JfLmf25rDVVlw8MRbfUtkfJ4x7bdWxwrf_3EzsfWWM" alt=""><figcaption></figcaption></figure>

Setelah mendapatkan key maka selanjutnya decrypt section .level2 . Caranya sama seperti kode decrypt .text sebelumnya, cman beda di validasi address disassembly, section, dan keynya.

```python
from elftools.elf.elffile import ELFFile
from capstone import *
import os

f = open('./libpatch_first.so', 'rb')
g = f.read()
elf = ELFFile(f)
code = elf.get_section_by_name('.level2')
ops = code.data()
start =  g.index(ops[:10])
length = len(ops)
key = b"itf{h1dd3n_bY_w3ak_3ncrypt10n}"
for ind in range(len(key)):
    h = list(g)
    for i in range(start,start+length+1):
        h[i] = h[i]^key[(i+ind)%30]
    fn = "libpatch_second.so"
    out = open(fn,"wb")
    out.write(bytes(h))
    out.close()
    print(ind)
    os.system("aarch64-linux-gnu-objdump -d libpatch_second.so  | grep -A3 \" 2a60c:\"")

```

<figure><img src="https://lh7-us.googleusercontent.com/xvS-B-t0D3KrcJ2JUt9z5TTIMhyZYA78xUpukwzqJ_mEqS8KBKNhqFrAjwj7Xf3GJ0DvBDvlrHFUM6p6vXbooNYvvJqYW0XF3YmlYwD5uiAeuxaJ_LHiYhUOXYExGaNPZboGDAuj-WYz31q1irvsaRc" alt=""><figcaption></figcaption></figure>

Terlihat index ke-0 sudah merupakan instruksi yang valid, jadi gunakan index ke-0.

Flag : itf{h1dd3n\_bY\_w3ak\_3ncrypt10n}

## Game #3 (500 pts)

### Description

\-

### Solution

Selanjutnya analisis level 2

<figure><img src="https://lh7-us.googleusercontent.com/B8klx-5gbBTRgorPCX4yG2f9fMZJblECZcHeFARAjGnyX11FsyTfyAZVCwNJMTrMz3Wj3hoazLVgPWdlY-b_JrNje4CJdlefKLzFICTR18n-AuuyG1NZ1Kwp9yhe0z-rCQrYEUVqZHR__EZuPvw3Ow8" alt=""><figcaption></figcaption></figure>

Terlihat terdapat xor terhadap static value dan algoritma semacam caesar cipher. Jadi tinggal implementasi saja untuk mendapatkan v122 dimana v122 ini nanti dibandingkan dengan suatu nilai dan digunakan untuk decrypt section. Maka dari sini bisa kita simpulkan bahwa v122 merupakan keynya.

```python
a = [0x3E, 0xA, 5, 0x1E, 0xF, 0x10, 0x49, 0, 0x13, 0x49, 0x27, 5, 6, 4, 7]
v122 = []
for i in a:
	v122.append(i^0x69)

for i in range(15):
	if(v122[i]<0x61 or v122[i]>0x7a):
		if(v122[i] >= 0x41 and v122[i]<=0x5a):
			v122[i] =  (v122[i] - 59) %26 + 65
	else:
		v122[i] =  (v122[i] - 91) %26 + 97
print(''.join(map(chr,v122)))
```

<figure><img src="https://lh7-us.googleusercontent.com/i1f1yqbwQq2teBLDUbEowWeGnqE2rh1s6U0meCRtJVGpSCHDz1FjltERDAafqUMBSBJBkpRygUL2FTsME1M8vkoSrMhC91qak1HAtgpn5pRDAmXyGH93nZVpuKUT_sKDitydGWp0Gkqmp5JkRnSevUg" alt=""><figcaption></figcaption></figure>

Selanjutnya decrypt section .level3 dengan key tersebut

```python
from elftools.elf.elffile import ELFFile
from capstone import *
import os

f = open('./libpatch_second.so', 'rb')
g = f.read()
elf = ELFFile(f)
code = elf.get_section_by_name('.level3')
ops = code.data()
start =  g.index(ops[:10])
length = len(ops)
key = b"Circle of Trust"
for ind in range(len(key)):
    h = list(g)
    for i in range(start,start+length+1):
        h[i] = h[i]^key[(i+ind)%15]
    fn = "libpatch_final.so"
    out = open(fn,"wb")
    out.write(bytes(h))
    out.close()
    print(ind)
    os.system("aarch64-linux-gnu-objdump -d libpatch_final.so  | grep -A3 \" 2aa88:\"")

```

<figure><img src="https://lh7-us.googleusercontent.com/AgIsOHIRyZR41aorNDwiNWl3mK8Ka-bNfh-TEUmEn9zbP1N-YCBigwr7XUOW-B7HqHiA4IybT_rMlHn3iifT7PLdEEp5fz1SORrtgJyyvRfPpVLBd02OXl9IgfK8RXjnp6cD8nxaZ-_MFhXtJ9WdzPM" alt=""><figcaption></figcaption></figure>

Terlihat index 7 merupakan instruksi yang valid.

Flag : itf{Circle of Trust}

## Game #4 (500 pts)

### Description

\-

### Solution

Terakhir , dilakukan decrypt terhadap game.dex pada assets . Hal ini diketahui dari decrypt menggunakan SSM:Decrypt untuk setiap index yang menjadi argument.

<figure><img src="https://lh7-us.googleusercontent.com/ygCLPCEeLJmT_KD0K1GDW_RYXAJh6pPWliOnQATPQY2zwkFYlYc8E5XhO_CP2E8M2qn6qZFhjrByNoJqV1sHmS76BHmJjm1XeNX_zc0eT6iX377bB93IrCNqxegQsQtoQGZqLyqq-6B9wMHRpzsP0K0" alt=""><figcaption></figcaption></figure>

Algoritma decrypt yang diimplementasikan adalah rc4 jadi tinggal dapatkan key (v12) lalu implementasikan decrypt menggunakan rc4.

```
Ubah value param_1 pada script ssm_dec sebelumnya menjadi 0x202
```

<figure><img src="https://lh7-us.googleusercontent.com/1Ua6XBJLZs34Yg6jzSP6EkJP0SUc9COYCiBybH1cRD8IqoDxjs0LOYDvOmjmWFqxFKfhi_lylCBeVW8WEhrvXHGhanWp5yn7L5i_99Vb7YhJCuAgvOvlULGvhj_Lymr5pQgX9JW9QqjNZP2HAXriD9w" alt=""><figcaption></figcaption></figure>

Read asset dilakukan per 0x400 bytes, jadi implementasikan hal yang sama juga.

```python
from arc4 import ARC4

f = open("resources/assets/game.dex","rb").read()
out = open("dec.dex","wb")
for i in range(0,len(f),0x400):
	arc4 = ARC4(b'n1n0_k4w4ii')
	tmp = arc4.encrypt(f[i:i+0x400])
	out.write(tmp)
out.close()
```

Gunakan jadx untuk decompile file dex nya

<figure><img src="https://lh7-us.googleusercontent.com/vp7Hex2eMeUE_8By5585QCmkhu8RYNdfosTSXGTzQDpz-TRh-k7rAT6csRB6Az_NCS05IzQrVQLI8yKlh2vZCkIw7DsUzXjb_2o_rIRwcuaCeCDrLoUpJlH04bckIKeWi5my3bO0vcFyznpx1tVV8qQ" alt=""><figcaption></figcaption></figure>

Terlihat terdapat function getFlag yang dipanggil dari libgame.so . Karena libgame.so juga diobfsucate dan cukup kompleks , maka cara paling mudah adalah dengan mengikuti alur dari awal. Yaitu input key pada apk, patch file name apk . Dari percobaan ketika score 9 maka titik hijau yang ditekan menjadi sangat acak dan tidak bisa ditekan. Jadi disini kami lakukan patch untuk game.dex (patch pada smali) karena entah kenapa kami tidak bisa melakukan hook terhadap beberapa function. Berikut alur patch kami + commandnya

Ubah pengecekan pemanggilan getFlag dari score==10 menjadi score==2 , jangan lupa ubah nilai i<9 juga menjadi i<2. Selanjutnya pada percobaan pertama ternyata ada validasi juga di library , maka kita perlu tambahkan 5 kali pemanggilan submitscore untuk setiap score+=1 . Sehingga saat score ==2 maka dilakukan pemanggilan submitscore sebanyak 10 kali. Berikut alur patch kami

```bash
java -jar baksmali-2.5.2.jar dis dec.dex
# patch smali
java -jar smali-2.5.2.jar as out
mv out.dex nHVZeGukN75PpvXrhtOe/assets/game.dex
python enc.py
# ubah app_name pada strings.xml menjadi <string name="app_name">Circle of Trust</string>
apktool b nHVZeGukN75PpvXrhtOe
rm circle-aligned-debugSigned.apk && rm circle.apk
cp nHVZeGukN75PpvXrhtOe/dist/nHVZeGukN75PpvXrhtOe.apk circle.apk
java -jar uber-apk-signer-1.2.1.jar --allowResign -a circle.apk
```

Berikut smali yang kami patch

<figure><img src="https://lh7-us.googleusercontent.com/APC-f5WQZBQta544vQxGZuie3agKZF3Jv4GJxEPbXBidPpgGPa1LEHcGV7g7kT3gHZ8AXpLoNwDTE5wqz2rhg4_Plq5BpTtDEYjDcJzxeuuwyRHMQBLqkHiwo4VLRS8tPKPJaKvsrbOC8c74MfPyiYc" alt=""><figcaption></figcaption></figure>

Berikut full file smalinya <https://gist.github.com/kos0ng/95092381869c0a4d1d1e5e32616434ed>&#x20;

Jalankan apk dan ketika score==2 maka akan dapat flag, sayangnya flagnya tidak kelihatan. Karena flag tidak kelihatan maka kami gunakan frida untuk hook fungsi yang menggambar flag.

```javascript
// frida -U --no-pause -l finalhook.js -f com.intechfest.game
Java.perform(function x(){ 
  var paint = 'android.graphics.Paint';
  var tmp = Java.use(paint);
  var str = 'java.lang.String';
  tmp.measureText.overload(str).implementation = function(x){
      console.log("noice");
      console.log(x);
      return this.measureText(x);
  }
});
```

<figure><img src="https://lh7-us.googleusercontent.com/3900CUdExcyeNxdqeo7n5rsOO3LZp45HvcjuZasuo-TZNNR3tHrkslFDP2fPrQaT5aD2W1fxgrSgDQ6PtQGBT5ULvH2qIkeiMooOGK7dWBbS6zHlvF288tq3s15Ay5RnPh_gHBuQDr8dczYmi9mdbCk" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/5wT-FApk02BM5809jVIRBKjwc6ZfebmBpu0kc4R-tsWiqdWfyfDe1DoJ6-_iF8nKU5v6YVKANRkXMpFwuIkI2uZ2zKQY8r67FXTijd2TfDhAiqpZJRSC-pSQoTJVcHoZX5oUsWR3hSNurhQZ4Zi8L34" alt=""><figcaption></figcaption></figure>

Flag : itf{0bFusC4t10n\_V3rryy\_AnN0y1nG\_R1gHt}
