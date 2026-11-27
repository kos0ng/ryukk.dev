# Reverse Engineering

<!-- challenge-index: 19412b3314caf5b8 -->

| Challenge | Topic |
| --- | --- |
| [👦 You need to GO! John (500 pts)🥇](#you-need-to-go-john-500-pts) | Go, OTP Validation, Z3 |
| [⚡ Ragnarok (500 pts)🥇](#ragnarok-500-pts) | Unpacking, VM, Z3 |
| [🎮 80's (500 pts)🥇](/notes/research/2022/reverse-engineering-game-boy/) | Game Boy ROM, Emulation |

<!-- /challenge-index -->

## 👦 You need to GO! John (500 pts)

### Description

\-

### Solution

Diberikan file PE yang dibuat dengan golang. Disini kami membukanya menggunakan IDA. Kita perlu menginputkan value yang sesuai sebanyak 3 kali. Pertama username, password, lalu OTP.

<figure><img src="https://lh7-us.googleusercontent.com/Bs-3SjKlZ5aJoZF4LrPdtXrs2KmNl7bbjEVcC82JP_Te2UMJwR85B3cgUQoCNinVsg8oqzeOrTwF9LEjnPNt1T60dfqP5p8JOzxSbCuebVpOqmyKT-6DKstV7eo5CaTwLmn8n0qsLr3__Y0_OIxQ6mc" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/7qLOcpehIU5dnlrZV5Q3bGwC9yEWGHnYXJ__yOpkZdaDbZIbjV9G1ppkxkTWAnyYi-9xPVYQjDyv1iurwvZg3Yi3Ye5uX3_f8vuM_grs3zktXxXzgEFwIKCKlvuq0PafYAR40UOyfyNBUcf5Iy2LGI0" alt=""><figcaption></figcaption></figure>

Untuk username algoritmanya dapat dilihat diatas, intinya kita bisa lakukan leak terhadap value dari xor dan mendapatkan value input yang sesuai.

<figure><img src="https://lh7-us.googleusercontent.com/1Qf-evYbzlH9ujHlj8ZdsMYHkk91TbnI9oDn9VBd7tlammeel5cOVs5Ifi1OQaEoX7KV4ipBU10SwWLZKvIgsVDrOXqFK9dQ9y_wB-WHa7xHu-XgiHFagA4PsHsNlu1jUX9loSZN1a06vwkI3_8GWRU" alt=""><figcaption></figcaption></figure>

Leak value rdx pada 0x5152c5 dan qword ptr \[rsp+rcx\*8+4F8h+var\_3F0] pada 0x5152bd. Lakukan xor dapat value username yang sesuai.

```python
xor_inp = [0x46,0x3C,0x32,0x50,0x46,0x3C,0x32]
cmp_val = [0xc,0x53,0x5a,0x3e,0x11,0x55,0x4a]
username = ""
for i in range(0,len(xor_inp)):
	username += chr(xor_inp[i]^cmp_val[i])
print(username) # JohnWix
```

Selanjutnya password, namun disini ada beberapa sleep yang tidak berhubungan dengan password/flag jadi bisa kita patch supaya tidak dijalankan fungsi sleep sebenarnya.

<figure><img src="https://lh7-us.googleusercontent.com/CFotyLsPRXY0AedaRvn_hu7b93I562tg603HRB8NyW2uxQF8uitm4B4f2nMDcDGMlIRPwm_tedduFwU1kcVJDkpf-BFrcjUozg7oOWuQX-ouNojtS_OQyGHB6-zoe2-TFg_TN7k6rjVT2sMX0bWsf4o" alt=""><figcaption></figcaption></figure>

Caranya dengan mengubah jle menjadi jnz pada 0x4db203 .&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/kuyesCHYq5dNLJ_VGKtOEIkbQx4NqdwauJhhhcvmZOROXm9xJIcLflnyj680SV62ynIodngHGRCU_CiODHjZNBKgDx92TPMAPDeg0FSMNVaijd5E9i-j5g7m4PjR0k7Qf9rrIlA6kyj3sHqDieLRfX0" alt=""><figcaption></figcaption></figure>

Untuk value password tinggal dapatkan semua static value lalu gunakan z3. Berikut script yang kami gunakan

```python
from z3 import *

v164 =[BitVec("x{}".format(i), 8) for i in range(11)]

main_VARDEC11111 = 5
main_VARDEC11121 = 6
main_VARDEC12114 = 9
main_VARDEC13111 = 7
main_VARDEC22121 = 8
main_VARDEC67728 = 3
main_VARDEC91550 = 2
main_VARDEC99994 = 4
main_VARDEC00000 = 0

v13 = 4
s = Solver()
s.add(main_VARDEC67728 + v164[0] + 67 * main_VARDEC91550 - 2 * main_VARDEC12114 == 193)
s.add(v164[1] ^ (15 * main_VARDEC11111 - main_VARDEC22121) == 54)
s.add(v13 + main_VARDEC13111 + main_VARDEC11121 + main_VARDEC11111 + main_VARDEC99994 + v164[2] == 138)
s.add(v164[3] ^ (10 * main_VARDEC91550 * main_VARDEC67728) == 13)
s.add((main_VARDEC13111 * main_VARDEC67728) + (main_VARDEC91550 * main_VARDEC99994) + v164[4] == 84)
s.add((v164[5] ^ (38 * main_VARDEC67728)) - (main_VARDEC12114 * main_VARDEC91550) == 47)
s.add(v164[6] + main_VARDEC91550 * (main_VARDEC22121 * main_VARDEC13111 - 100) == 26)
s.add(v164[7] ^ (main_VARDEC11121 * main_VARDEC11111 * main_VARDEC11111 * main_VARDEC11111 - main_VARDEC67728 * main_VARDEC91550 * main_VARDEC91550 * main_VARDEC91550) == 750)
s.add(v164[8] - main_VARDEC67728 + (main_VARDEC11121 * main_VARDEC22121) - main_VARDEC12114 == 147)
s.add((v164[9] + 3 * main_VARDEC12114) ^ (main_VARDEC12114 * main_VARDEC12114 - main_VARDEC00000) == 26)
s.add(v164[0] + v164[1] + v164[2] + v164[3] + v164[4] + v164[5] + v164[6] + v164[7] + v164[8] + v164[9] + v164[10] == 864 )

print(s.check())
input2 =""
model=s.model()
for i in v164:
    input2 +=chr(model[i].as_long())
print(input2) # Jup173r8o0M

```

Terakhir adalah OTP

<figure><img src="https://lh7-us.googleusercontent.com/iDG36puMPScvIxOFZwy6xS82GvZ89QIEjngxjayf5Bhugb5ck81R2XH6mPTqMfcNfogi5a-sBKfkiNWacFdPNfrKc0fL5qX8Ixkedrl8VxebEs1XX36q64x6h--IuvyDx-zr92nNSqC2MMEpo3Z4TqA" alt=""><figcaption></figcaption></figure>

Leak value rax setelah pemanggilan fungsi rand lalu kurangkan dengan main\_minran.

<figure><img src="https://lh7-us.googleusercontent.com/IbAa_FalIqwcZHuknQL8-q0C1epuf0lV_UDK_tSoNC0ASczgsh9vBAcVEI58osK-izjoH0y2qhiEoUi9x2mJ1qd-eZ1XyuI_pi_eXpA9hqHifWqNMwdl1r4dO8qcT8XfK4FmxxheMnPKN_VFPaWJ1bQ" alt=""><figcaption></figcaption></figure>

&#x20;![](https://lh7-us.googleusercontent.com/9Rzq44yywaIt5PdQtmMOCeJsgb55UdXeZHXTwtgobzPSS_g1lrvekzmpq1ZjXGi3xUHMcRJPUuFiUUiUibstbyAPgsiO0RMNNJz9bNawEihesFW-KrgMx4Si2HQS5GEbwcyhiVi04q3cc72ECSRM97w)

<figure><img src="https://lh7-us.googleusercontent.com/tDRgEulBCjVUbklLla6RZ7zMaKg-ITdrMA6HxuI1I51wCOhJqaJ19wygQ-ZSIgnrGczp_pEGVDs6AWrRcdksj_tYyN4hmnVGMwFK8AcTjiNjv-CEWhRB-vaIymoTuSrlh5Ov3TTf76xVPUXtUK7UYOs" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/8m1rGQoXVIP4tv6Y8XNoKR60q0voUm9GXaVDe80-xcT183ahQS7zd_yQYuQNpBhhWlk2niE4lE4G6P7dSGWQdlJc4InTxecdLs3kg1HHftFV1Jfj-w05TC4xdKB95jYiTfZVH4YEa9wDce4MVGf7cjo" alt=""><figcaption></figcaption></figure>

Flag  : NCW22{1t\_1sNT\_JU5t\_4n\_0TP\_C0d3\_155351}

## ⚡ Ragnarok (500 pts)

### Description

\-

### Solution

Diberikan file PE yang dipack , karena disini kami tidak tahu packer yang digunakan jadi debug saja. Set breakpoint pada akhir pemanggilan fungsi yang melakukan jump pada suatu address

<figure><img src="https://lh7-us.googleusercontent.com/iAbqN8glBJqVOxxYlmB431NJVQqEkT9q6OmLWnyoaFL4-yTLHA3es3w33A7Kc8sDaH3iNYIKbHq8W-67bTyXkOT4QThuLXyhYqMCNpVkbaMMO-b2Bvc6UZgSh9OXjh98MOehsXjuLvheUkzJ5vgjYwo" alt=""><figcaption></figcaption></figure>

Step over dan nanti akan ketemu dengan pemanggilan suatu fungsi

<figure><img src="https://lh7-us.googleusercontent.com/3V9_VweKh2hggBj64kx1pPb0BqLbtLqT_3PtPTTiY5O1QvFQ8ehUl6PokQbEtUCZvGZheTFfw4lYRBgoezJSSXXXTgMJIHULNdQNvppBZCA7lMJVsoTTYIWHDHsOD2ZlcmlafUv2FjD7Q14VKmnKeWw" alt=""><figcaption></figcaption></figure>

Selanjutnya step into

<figure><img src="https://lh7-us.googleusercontent.com/mFCCM4e6jMZl-ECpc385uxQJc51jTs6MqtDu9EY4fiAAqWq0szzRm8lAJzN26UpBm7C3SzS3tXtrytBUFzLkioQOiGy6IM2HXhnqKDLM_uTnacmpV6_hg9LgBFNgpWVhBOqJ4i-ZCCeEpDdkhNnxAF4" alt=""><figcaption></figcaption></figure>

Sampai disini kita sudah masuk ke hasil unpacknya (program aslinya). Selanjutnya lakukan analisis dan kami mendapatkan fungsi pengecekannya yaitu pada sub\_7FF6BF631A57

<figure><img src="https://lh7-us.googleusercontent.com/axNaDGB3s5WX3l-MDDXFkgdk5iS2blenckc5ciTjFDuh-2n4ZuqIAt57UIQQXkhibkX1BHvnJ2wFBlc-RnqBOnRXmSaXLwDo4PfZWme1FkUleBWDPlC3Z5a68VvyghUuRtbXNR61Z0gHF8O8So2fT6E" alt=""><figcaption></figcaption></figure>

Intinya kita disuruh menginputkan 24 bytes value. Nantinya 24 bytes value tersebut akan dioperasikan dan operasinya berbasis VM (hardcode).

<figure><img src="https://lh7-us.googleusercontent.com/xkCC1EG1cM0i31lXIuQ13fESGO4C4_5Q9Gw3Zco6rxbfEaZafi5czZ0Xe_8k1QmuQ-VLs5KWBsQvDHrpw5X_DQ4RmcGx7roENG5HvFRV9WH_nAcUAaOnK90OSmQz2HfdWY_Kgb6sjCCb60C56Z2uzaA" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/2ISkJhVQPk1Xx_oQPTamzTM_5ZwzwGWKiREAG-dqQDfbpH4BlreCOnaKLHoFKUldVeOayKzdyxJA1EASoKBe4zUKkG7pSdy51qzY-np6FrR2CxnQ08zEOO8TEW1P5a5F0sktSJH7_li7k8wxKb640Ro" alt=""><figcaption></figcaption></figure>

Untuk mempermudah disini kami membuat assemblernya namun pertama kami perlu lakukan leak terhadap bytecode VM nya terlebih dahulu.

<figure><img src="https://lh7-us.googleusercontent.com/R0YIVJ2xVuBuazQqZTdUpsnAolgu5TWkwjicg3sOQh2Dt54_z_id-NLQm6-RsRtdMNWH1bhHa7T-LdARQ7yDIeBiPQEjZSlOa2yqD1HWYA6HFhrK2mAONC0NRrGjIXZwY9Tir4ieR-TEF5sgZrasMpE" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/V-vFdGdIIf8951LgSkr7ZL_7K_rZY-7dQEaCykMQYuk6tvDYN1Evbuw8Sfp6ZBP5dbH5R_n1VIS8Hs2V0FxCzSWHT7-YbnIbQ-haAHLQX6o1saTgHDfkLnboq8T2niLqq9UkPg5Ebzlc4atEZQ8CZbc" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/cwuiO114CHCIlsJk-ML1MNVNydnHwaHianUc5v4XbYOibE2oqQNN5FV3WCz-w9XTr2iVS-lSjVgELEgt5RU3c4YcJQzLPChGy0wvfXNuM_CY2emjwMIf1GTJPndPnUarzze84An5L34hwhpMywx0llU" alt=""><figcaption></figcaption></figure>

Copya value pada address 0000021F0B3924B0 sampai 0000021F0B392520 (bytecode VM). Berikut assembler yang kami buat

```python
from Crypto.Util.number import *
data = [0x11,0x06,0x00,0x01,0x06,0x03,0x10,0x07,0x17,0x2D,0x6E,0x2C,0x01,0x06,0x07,0x11,0x08,0x01,0x06,0x08,0x02,0x10,0x09,0xD3,0xB1,0xA6,0xBE,0x01,0x08,0x09,0x08,0x05,0x03,0x10,0x0A,0x34,0xEB,0x22,0x05,0x01,0x0A,0x05,0x06,0x02,0x00,0x10,0x0B,0xC8,0xB0,0x54,0xD2,0x01,0x0B,0x02,0x06,0x00,0x01,0x10,0x0D,0xB3,0xD1,0x94,0xD2,0x01,0x0D,0x00,0x11,0x0E,0x04,0x01,0x0E,0x01,0x10,0x0F,0x2F,0x5D,0x57,0x7B,0x01,0x0F,0x0E,0x11,0x10,0x04,0x06,0x05,0x03,0x01,0x10,0x05,0x10,0x11,0x07,0x04,0x56,0x40,0x01,0x11,0x10,0x01,0x06,0x08,0x01,0x0A,0x0B,0x01,0x06,0x0A,0x01,0x0D,0x0F,0x01,0x06,0x0D,0x01,0x06,0x0F,0x01,0x06,0x11,0x11,0x00,0x06,0xFF,0x00,0x00,0x00,0x00]
inp = ['0123','4567','89ab','cdef','ghij','klmn']
cnt = 0 
while data[cnt]!=0xff:
	ins = data[cnt]
	if(ins==17):
		print(f"inp[{data[cnt+1]}] = inp[{data[cnt+2]}]")
		cnt += 3
	elif(ins==1):
		print(f"inp[{data[cnt+1]}] ^= inp[{data[cnt+2]}]")
		cnt += 3
	elif(ins==16):
		a = bytes(data[cnt+2:cnt+6])
		print(f"inp[{data[cnt+1]}] = {hex(bytes_to_long(a[::-1]))}")
		cnt += 6
	elif(ins==8):
		print(f"inp[{data[cnt+1]}] -= inp[{data[cnt+2]}]")
		cnt += 3
	elif(ins==6):
		print(f"inp[{data[cnt+1]}] += inp[{data[cnt+2]}]")
		cnt += 3
	else:
		print(hex(ins))
		cnt += 3
```

![](https://lh7-us.googleusercontent.com/f7QpKUv2-x6mTazI6IrxJbBlB3wpscONTHQPaUG_uivyakyehMPzAIUkIPfe8phD1r7YL_X3dBAGlw05KpdRLH-guGmxzF3SlafYMWXgoAW2Y_eQpA2S-FPbS7p3ySaen5JgvaYRqLrEldHjQl50QZQ)

Selanjutnya udah jelas maksudnya yaitu mendapatkan input yang pas, gunakan z3.

```python
from z3 import *
from Crypto.Util.number import *

inp =[BitVec("x{}".format(i), 32) for i in range(6)]
s = Solver()
s.add(inp[0]^inp[3] == 0x2c6e2d17)
s.add(inp[1]+inp[2] == 0xbea6b1d3)
s.add(inp[5]-inp[3] == 0x522eb34)
s.add(inp[2]+inp[0] == 0xd254b0c8)
s.add(inp[0]+inp[1] == 0xd294d1b3)
s.add(inp[4]^inp[1] == 0x7b575d2f)
s.add(inp[4]^inp[5] == 0x40560407)
print(s.check())
model=s.model()
# print(model)
flag = b""
for i in inp:
    tmp = model[i].as_long()
    flag += long_to_bytes(tmp)[::-1]
print(flag)

```

<figure><img src="https://lh7-us.googleusercontent.com/RTehPHF5bM3nkUrnUw_T3xxuwJ0l63nY4xi7AxKQaCYHMnaCQDRrnIUKizVXQBnzMFb4_XegU57j7i-D0TPUKmTsv8VTpFtPP0VtHE8a8amlX1lq9LF7Yb-TOSKylcR5eIrRTanFDpf8YaDv2rIs_4w" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/S1gE-u-iYbqTwuaNrvRBCdcS-hpcY-ewxBgRUB2r5SE0tlilOwlWIIaQ6c_yNSYMOSjCTXTDtWnqf4M9wWNeM6f0j-fj4-7TY-TBTCMJWH_N6N9TrupQaI3oGrFIEjpSe0S9Zg1Xz8jILlEJHr-5u6k" alt=""><figcaption></figcaption></figure>

Flag : NCW22{Th!s\_is\_tH3\_CEO\_p4$$w0rd}
