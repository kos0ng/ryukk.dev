# Reverse Engineering

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>Branches (260 pts) 🥇</td><td><a href="#branches-260-pts">Here</a></td></tr><tr><td>Serial (390 pts) 🥇</td><td><a href="#serial-390-pts">Here</a></td></tr><tr><td>Box (623 pts) 🥇</td><td><a href="#box-623-pts">Here</a></td></tr><tr><td>Standard (1000 pts) 🥇</td><td><a href="#standard-1000-pts">Here</a></td></tr></tbody></table>

## Branches (260 pts)

### Description

\-

### Solution

Diberikan file ELF. buka dengan IDA

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXf7dippekurTcdq4FaeekGB--52VOoG31apk6K9WRz4ZUQBNdMhqmBMWzZaJZSWN1P0pGzQ2U_kAa5VDuyAkEU0a8C0fY7Yl50ajKmtKWZj2bP8KrKQBetjq_ofFcLAWFhtoCRcYJ_na3DbhqAYFUcU-wBu?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Dari kode diatas diketahui bahwa input kita akan dimapping ke check\_function. Check\_function berisi shellcode karena akan dieksekusi/dipanggil nantinya. Jadi disini ada dua kemungkinan mengenai input kita, yang pertama adalah input kita akan digunakan sebagai instruksi atau yang kedua sebagai operand. Mari kita cek

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXeJaP81dCYyVe0Ol0HyZcNtj6gp_tuR8LtdVc0v-XovXtav_tF3eXyUT9TZenEudUvi0abLz0Fn7s1yFnFhil14IajSCoEif3wiZXYIFsYZfspvBgR4JFNHCd3uGdnU7f3ETp6X10xxP5WGH8vfdGZYpmfP?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Input pertama akan terletak pada 0x4066 (nilai setelah t). Lakukan disasm

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXdYop_Kgn9TdfAJ0_uVSlNTguFblfbRMyP00Ah5HYntztmyfA2PrnoMvBsjW9KuFCnud3gsMeQRH0XV88dr6H9dpgVoEQvRvDQjB6MMCVc4254xl13NCCqFS51_SJZgt7Vh8jt8lemEIREy6JomyYHMVT_f?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Jika kita ganti nilai ff dengan nilai lain misal 00 maka bisa dilihat bahwa operand dari jz akan berubah

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXf20rYFBWTpqDHUywfR2L6tp_nvZOMO2SqQ3tlnZMvJe-vo9a7J_IMtVPATv0N7c7XlvjcAOpqKpLvlFq9yxqSjS46kgrREbqcfj60DRzAwnz-7UOfVTARNrt1pg9_E9lkYbBuMkbN25fovnhh1x0giokq_?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Jadi disini bisa kita simpulkan bahwa input kita berfungsi sebagai operand dari jz, kita tahu jz pasti akan dieksekusi dikarenakan cmp 0,0 pasti true. Langkah selanjutnya hanya menentukan dimana address yang valid untuk eksekusi selanjutnya. Cek input selanjutnya berada dimana

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXemtDoOtH2rKx5FAG_cuHdOi0kJaqlELm3viB4Y-pdK5MCprWOez8BI1qspIKAo2Qn9Amem46WXHeW6uPV4qJinxFXw_Lvmih1l03bDa0wJ0SfHtNXoD45NL4fLXg0s7fbXyVZ_7k0VdMzdE8EN53aEL0RR?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Input selanjutnya berada pada 0x40b4, lakukan disasm di instruksi sekitar 0x40b4. Dengan trial dan error bisa kita temukan bahwa instruksi valid berada pada 0x40b0.

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXd3P_8Bt2LcOqPLRy6WoDJyfObBBGcPBgR6WmP3lfy09MioFY4p9ujT4ZJnbgnd1mta-jsdOOHK-mHmjTqu-AJdfpmCBxL4cRKWUp_nMJQpdEzKH0fGlj_WH5BpP3_Ta0dtDRH6nED2XSqsyRrt-MUes2lS?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Dari sini kita tahu bahwa nilai operand pada jz adalah 0x40b0. Jadi untuk mendapatkan operand yang valid kita bisa dengan melihat selisih dari kedua address tersebut. (target\_address - address\_after\_jz). Contoh untuk input pertama adalah 0x40b0 - 0x4067

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXenwkSX7ur-5KTmYC1FUhxFXB_d61xeq6CTbdzhS-ZYycbPGsweMTmLW6vHjMZR8mriWPV6lOBxH7HvgCYIPpJr4pQ5P1yzBIqtwAUW_CQwy6550sElLMdoQ4hhG1ZhlYpndiuPJfwBrxfQGR4BM4jd0acM?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Asumsi kami disini semua bentuk assemblynya sama, jadi tinggal scripting letak ‘t’ lalu kurangi dengan letak ‘t’ selanjutnya dimana perlu ada padding sebesar 5 supaya menghasilkan seperti kasus manual diatas. Berikut solver yang kami gunakan

```python
f = open("result.bin", "rb").read()
a = []
for i in range(len(f)):
	if f[i] == ord("t"):
		a.append(i)

flag = ""
for i in range(0, len(a) - 1):
	flag +=(chr(a[i + 1] - a[i] - 5))
print(flag)
```

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXeyVDKIJ5mjE_asjV5N7bNOBJHUhkPJsAbQDERdCC1B9QSV9xdtNodTtDcQ_Apj_MwMW4o370a2qqeU5cW7QfppgTBYBtdJcdeOMa1vFL7qVgs4nw6U1W5KXImiaUrT4py411Pq-5oK2z10sgHnaWZwp8vT?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Flag: INTECHFEST{Br4nch3s\_As\_Fl4g\_Ch3ck3r\_Wh0\_W0uld\_Hav3\_Th0ught}

## Serial (390 pts)

### Description

\-

### Solution

Diberikan file PE .NET, buka dengan dnspy

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXcIemyhrXI2STqWbXaddtsTF6-1iloW9y0M70p75XZlGfzfGMkXSvmbTsXMV4lDRKy5DJX1KtQl20y1iSZ9mlHisFWt8Au9KZRsU65W_BMSKPlGm_H5DwCSrQO4DVIAvpZt94noIMnZFjoIN9JCuU291dKA?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Fungsi yang dibuat oleh probset tidak terlihat langsung, buka dengan IDA untuk melihat fungsi lebih jelas. Pada IDA fungsi terlihat lebih jelas

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXeKtJ-KedSpEPKEV33uuwoUPFVBTsT_j9jad-lN9iAxRRalC3tpXQbypNmKWDfdTL0cgowV-BDUmNn88edTQ4JgVeSuhhsw9X7lAS5sot7qEhEhnwzZmIz3EDb8cWC5kU0m-3UmTM95lZLlrLMoCR1G7wU6?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Lakukan decompile pada dnspy untuk fungsi decryptflag. Lakukan analyze pada fungsi decryptflag untuk mendpat xref.

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXc0ZrbDt87FWCAlTmpIIcWk3-Qzr0mCrjF4weWErVQ4BOSLrhg4Vcusa0fxKFjRXxvitcrWEVwlPG5w_k0JwAK2Yf7FZDzuPFAXvNTpQjzO_TxndvG_w55vSwnz9uHWWDXgUYBEnYhnfES9JQX5vLHITZiC?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Bisa dilihat bahwa fungsi DecryptFlag akan dipanggil jika username equal dengan Administrator dan serial untuk user Administrator valid. Jadi selanjutnya cek fungsi checkSerial. Fungsi checkSerial menerima dua argument yaitu username dan serial. Bisa dilihat bahwa username akan diproses pada kode berikut

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXfPRH5Oz_1wnZW4CvOaTWDcHlGo1AhP8BYW7dHKwNtE_B74SzFHztXjcw6KPtj7FzYAYfINDviX-uYYUhITRxfJCdoG68RBkXidMUPI__FsAO6-vYfEgQqzGQrBgapqtnu4j1q1FfKwQ7VAAO69sNVFzTU?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Nilai akhir dari proses yang memanfaatkan username akan disimpan pada variable num6. Kemudian num6 akan disimpan pada vector \_u0020&#x20;

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXcgi3yobRc11WA0ho-ZHi2ey12S0gDvs6uhb6jJLwiO0kdEPtf-scGejPqo0VQm1Zwj8rQSkr4YOkzYTsBlfw8u_H2cBMWKznxeOQ8boGgIAr3rzPNWLVNbZookTLJNOs7y3CoxGGJj4b-tXdXp6gq31uU?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Selanjutnya vector tersebut akan digunakan untuk validasi terhadap serial. Sampai disini kita tahu bahwa nilai num6 bisa kita dapatkan dari program, selanjutnya tinggal mencari tahu bagaimana serial divadliasi berdasarkan num6.

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXfYBIQb3z2V-zpL8bzYSl7CFJNspFtYEFTpGC4FIpkRZR0nYVkNjFq8xjcLqGElXqgh2z8LF7HLO_xVBemk6EhXdtCznbEQ-q5J1re8BuV4dj2Qz2_xs1rouxrIEGSHJnTuyASWP7sR2UACckdu6KHGyelj?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Sebelumnya ada validasi seperti input harus valid hexadecimal karakter. Selain itu terdapat validasi sebenarnya yaitu seperti pada (num20 << 4) | num21 != \_u0020 & 255. Jadi tinggal reverse kode tersebut dan dapat serial yang valid. Berikut kode yang kami gunakan

```python
num6 = 0xF8809629
num = 0x0000BFFD

vector = [0 for _ in range(8)]

vector[4] = num6 % 256
vector[5] = (num6 >> 8) % 256
vector[6] = (num6 >> 16) % 256
vector[7] = (num6 >> 24) % 256
vector[3] = 156

ptr7 = vector[5]
vector[2] = (num % 256) ^ ptr7

ptr7 = vector[7]
vector[1] = (num >> 8) ^ ptr7

ptr7 = vector[1]
vector[0] = ((vector[6] ^ ptr7 ^ 85) % 256) ^ 167

serial = ""
for i in range(0, len(vector), 2):
	serial += (hex(vector[i]))[2:] + hex(vector[i+1])[2:]
	serial += "-"
print(serial[:-1].upper())
```

Dapatkan num6 dari breakpoint pada line berikut

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXcbbhcCKW66OPC7fSZpO3cbbdq3NN8sQUKRPN2Y5tNLl6sNiYuUnJCUFalJHYuoUnynQYJfXEcMNn-DLSu9mK5a9cDGR8tRkSkesMp0MxAHXWD22j_ErPvpw18Le0bnX6rC-zobH6cQJkdAlxXBxpK_54eX?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXdILdgtJbWoiLajHNfeO_Qnwsp3Xb5a2TNkCMAuXMSpCk6duJLvhow7-disT30i3MEJflQ-CdFDVfL5aYsP5yV9yeHlw2DFe1YId8u50VS6_VWYxausZYmal2OhhyClP6vtwbwwRo0rqP84pqjwOSrYZfYu?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Selanjutnya tinggal masukkan user dan serial ke program dan dapat flag

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXchGeBKBDNUryxVmIjPRhIfX0-HOsvlLI4k_KajBfmP4cL9L7gKdPkXiF7tS94nEmhXH_EG6RPGfsorq2VgYXJQeUHFUrPb_CV7ZFQN7p5j-18IYnS77SsHW92bz3_h8oRx4YvAdGWI52HQagRlxzUsitqu?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXdrcgAytVwbUC4d6p0JToF9NG4OS51oekyUD-VZxMf83L0yzypTfRQ4LF5vdA3pi7vcIHtjlTgYCnISjlcR866ysD3cpH2zDkRdEB2yaJl3h0CB6PeA-As37GryHIFZy5kBqD_gt7zhhjt-BrqLzHvFg4OM?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

<br>

Flag: INTECHFEST{did\_you\_know\_that\_this\_serial\_system\_was\_the\_same\_serial\_system\_for\_010\_editor?}

## Box (623 pts)

### Description

\-

### Solution

Diberikan file APK, decompile dengan apktool. Dari struktur direktori asset diketahui bahwa apk tersebut dibuat dengan unity

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXfANUZPwXkuzPc5bpp3GqL4-cBmoyw6NIuG6OmB-kXnFtjxLqZ1mzCMKCYKGOX61AmL8h4xtVfnfDINUBS0KWaLXwWF0Xa-ENzc0jYpTBdQWDoblIVI43lP6edTe4jwOWXOjyT6DFTMd08NhbWvxJvQXEM?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Karena tidak ada Assembly-CSharp.dll pada assets maka kita perlu melakukan reverse engineering terhadap libil2cpp.so yang ada pada lib direktori. Disini kita bisa memanfaatkan global-metadata.dat untuk melakukan recover terhadap beberapa informasi pada libil2cpp.so seperti nama fungsi. Gunakan il2cppdumper untuk mendapatkan datanya <https://github.com/Perfare/Il2CppDumper>.&#x20;

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXdWW8M7HUeiMJf-maWIHMuF3mZ0cOgZILaeOaALMlppFyox4p9WfgLW9P70AK-Ib_b3uuDzKusZi2bSx5SYbj6XOHRdGReY-cDmz0jsq3bpVGQ74Xx_MHzz3Gl_1OvI6Gn_U2ltm3Bgha5l4uCRgY2nc6h5?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Selanjutnya gunakan script sesuai dengan tools yang digunakan untuk melakukan patch terhadap executable berdasarkan hasil extract dari global-metadata.dat. Disini saya menggunakan ida lalu melakukan load terhadap ida\_py3.py dan pilih script.json. Selanjutnya kita fokus pada fungsi dengan awalan GameManager.

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXdlWLjcaA81x84VfLv66TK_rpF4VXrCl7zL83lSpUR7kq2Ik5ILSsu1Xva_VxKHhUq9ZjQvsWqW0NLqW0EuDkxZmGxn-xgOzqRTbY6eUYAWxX8Cekxp5g1LMlQB2TXEEz9KJ4zW9sX4D_74_RsM8aZFBMYO?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Lihat fungsi AddScore

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXfEshqU4QfpdlBQmc4ISnbJ_WmLbxpIoB0AEFp3LvRVkgrZ63BM9hdu5Pe8j_AuzVFkGOD0AgQiErh3e-ARim7eVeSodUCVGLF-4i6QHWVR_wOn9ngeHgVQIpjc7HGGJDDGfHMDJ3uz7e8CcbpS7y-15cM1?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Dapat diketahui bahwa AddScore pasti melakukan penambahan score. Penambahan score dilakukan sebanyak 1 kali, jadi bisa diketahui bahwa (v1+32) merupakan address untuk score. Dapat diketahui juga bahwa terdapat increment lain yaitu untuk v2 (v1 + 36) dimana nilainya didecrypt lalu ditambah dan diencrypt lagi. Jadi disini nilai score sebenarnya ada 2 yaitu pada v1 + 32 dan v1 + 36. Selanjutnya lihat fungsi Update

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXceBeuSoam9m38A0G1GnJOu8iqly5ccoYP23xmiu5Rbja0YkLaAdint5in0ey5AWkDqSyfSHG7FjU5KkfOgKVj9piza-bUIQJyItm3-8ID6lEJiPsfAd9iV2CyXJdTWSh7vFhqhANFo7MH_hGXP1n6mqvgU?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Pada bagian awal dari fungsi Update dapat diketahui bahwa terdapat decrypt process untuk +0x24 atau 36, hasil decrypt akan dibandingkan dengan plaintext score (+0x20). Jika berbeda akan menampilkan “CHEATER DETECTED!!!”

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXdaGxjA0qP3vtp7ffsoH3vGawbHoXkmX_rTpZXkmD4yzp0fY4JB5gFzfVOyH3DPAvLO8KyuyEVMTQ3ygRmWQzsSYMk1JyA5PrMFKC0aWXfdnrIz9ERYJbkSlT6nknYBQZK9E491ImpMU-NIeuhZQcqt2tJM?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Selanjutnya dibawah ada pengecekan nilai plaintext score, jika lebih besar atau sama dengan 0xCC07C9 maka akan dilakukan decrypt. Asumsi disini decrypt adalah fungsi untuk menampilkan flag. Lanjut pengecekan ke fungsi decrypt

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXc4aly5Uc7MB5nJdQm1j3uwxqrZ5db7aq6YTNsGqaL32yCynwERA7vXnqcMWFrr25pOJMCWeKubJRN2mUvHYq-e5qc962DyYMubNaSDus49n-G5k-VHbNapFKdUNN_46WU8PySyeDDizrlZOrmu5NZre-kK?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Fungsi decrypt menggunakan a1+0x24 yang mana nilai dari score yang terencrypt sebagai argument untuk md5. Dimana nilai md5 tersebut akan digunakan untuk melakukan decrypt flag. Sampai disini kita tahu bahwa kita harus melakukan update terhadap 2 nilai jika ingin melakukan cheat, yaitu 0x20 dan 0x24. Gunakan IDA untuk debug<br>

Set breakpoint pada address 0xD7ADE4 dan 0xD7AE10. Pada 0xd7ade4 ubah nilai x8 menjadi 0xCC07C9

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXdfPQY3nB8urTc2lby3nD56YjFUOpJ4tBHu2tB0jX3Sgt4j9CjvaLzVdsgYhhfiZPHh4B6xSGx6Id_bzlwzytvjIQiIreP1J1-fEhIqac3ytHgjRB-90mgHTUvplFntk1wklcV0NkdopiyqjyoJa6WB1Z0?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Selanjutnya pada 0xD7AE10 ubah nilai x0 menjadi 0xCC07C9

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXegryYn9rsRxDnd04e-SgYjDjqivKZgjaYQ0dCROXyVTWQ-ARBBax0mXYhQOjR2GqBFAgmtssQxc5RosWFuMpibV1lpbBo9xaHF0QAuMPMh66FATHUvJwS8YdObGnjQqsIiN_UUKcWb0eidr6803LI-OLU?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Selanjutnya tinggal continue saja dan jika ada error pilih pass to the app&#x20;

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXfcGXJXR-a-3gal8Cdy9CtMZ6DLb-8iOr9so2kPbpDXFper9pMndC0vVm4y22FnXe-BYiVYG5O8umqbBCF6xNPczqt0VcWDAvT8iKxNY3tHBIx9Nj-KuB3oaR5cOz4V2Ob1Pr7XkNSBnBpSKecmeviDkmKt?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Flag: INTECHFEST{Byp4ss1ng\_Sh1tty\_4nt1\_Ch34t\_S0\_EZ}

## Standard (1000 pts)

### Description

\-

### Solution

Diberikan file ELF 64 bit, decompile dengan IDA. Terlihat bahwa program dibuat dengan c++.&#x20;

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXc-uu1owW_WPKw0wASRIxrfUF5Ejk4r8bp6x2IN4DqW5o5i1h6DuvhV_-55Nyt3qa88OYmqrxy_SdKyM4zI0okvUk5p3EQ7qaISjHcog4-JJWj6k0y6v4Xt6CLGRXvyV5tAUskjHuhvmVOzaW86VAqPJHc?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Pada awal program dilakukan penerimaan input lalu pengecekan format flag dan membagi input berdasarkan dengan \_ sebagai separator. Pada line 114 dilakukan pengecekan nilai dari vector (hasil split) jika panjangnya 4 maka valid lanjut ke line 121 untuk looping pengecekan setiap nilainya. Jadi total ada 4 nilai yang dicek.<br>

Masuk ke fungsi std::for\_each<\_\_gnu\_cxx::\_\_normal\_iterator\<std::string \*,std::vector\<std::string>>,main::{lambda(std::string&)#1}.&#x20;

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXcsi6M8srupke76w4qOH8RThpTJ3LArS5N_ebtDjjODelT2yuCRCeKVlBsfspRE5LTkkkgztSIzgsVDFo9waQUIGF_NJK9hTPWm4ewOsONS7_jkaAy4O2TrVb8LBcmuT8--r568wi6VjGm6FJIAB1P8t_Ie?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Input kita akan diproses pada fungsi main::{lambda(std::string &)#1}::operator()((\_\_int64)\&v5, v3);. Pada fungsi tersebut akan dilakukan pengecekan untuk keempat nilai, berikut untuk gambaran besar flownya

* Pengecekan terhadap karakter yang menyusun nilai tersebut/charset (step 1)
  * Contoh fungsi
    * std::all\_of<\_\_gnu\_cxx::\_\_normal\_iterator\<char \*,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#1}
  * Semisal pengecekan apakah 1 block tersebut terdiri dari angka semua, huruf, dkk
  * Jika semua pengecekan menghasilkan nilai true maka lanjut ke pengecekan nilai setiap indexnya (step 2)
  * Jika tidak, lanjut ke pengecekan terhadap karakter yang menyusun nilai tersebut tetapi berbeda pengecekan (misal yang awalnya cek untuk huruf besar dan angka jika salah lanjut ke pengecekan huruf kecil dan angka)
* Pengecekan nilai setiap index(step 2)
  * Contoh fungsi
    * std::find\_if<\_\_gnu\_cxx::\_\_normal\_iterator\<char \*,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#3}>
  * Setiap index akan dilakukan pengecekan dengan pemanggilan fungsi yang sama beberapa kali
  * Tidak ada pengecekan urutan setiap block, jadi kita tentukan sendiri (step 3)
  * 1 yang pasti adalah pengecekan terhadap nilai 0xDEA47FED merupakan pengecekan terakhir karena diakhir akan ditambahkan }
  * Pengecekan terhadap&#x20;

Total ada 4 block, jadi total ada 4 block pengecekan. Kita tahu nilai dari masing-masing block jika valid akan digabung dengan \_ , jadi kita bisa memberi tanda bahwa setiap penambahan \_ akhir dari block pengecekan (diluar penambahan }). Untuk mengetahui nilai yang dicek, kita bisa decompile fungsi secara berulang jika ada fungsi didalamnya, hal tersebut saya ketahui dari debugging. Contoh

* …or\<char \*,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#3}>
  * …\_\_ops::\_Iter\_pred\<main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#3}>>
    * …\_Iter\_pred\<main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#3}>>
      * …const(std::string &)::{lambda(char)#3}>::operator()<\_\_gnu\_cxx::\_\_normal\_iterator\<char \*,std::string>>
        * …:operator() const(std::string &)::{lambda(char)#3}::operator()(a1, \*v2
          * return a2 == 84;

Jadi selanjutnya tinggal cek semua fungsi dan dapat flag. Berikut komen pada hasil decompile yang saya simpan

```cpp
__int64 __fastcall main::{lambda(std::string &)#1}::operator()(__int64 a1, __int64 input)
{
  __int64 v2; // rbx
  __int64 v3; // rax
  __int64 v4; // rbx
  __int64 v5; // rax
  __int64 v7; // rbx
  __int64 v8; // rax
  __int64 v9; // rdx
  __int64 v10; // rbx
  __int64 v11; // rax
  __int64 v12; // rbx
  __int64 v13; // rax
  __int64 v14; // rax
  __int64 result; // rax
  __int64 v16; // rax
  __int64 v17; // rbx
  __int64 v18; // rax
  __int64 v19; // rbx
  __int64 v20; // rax
  char *v22; // rax
  __int64 v23; // rdx
  __int64 v24; // rbx
  __int64 v25; // rax
  __int64 v26; // rdx
  __int64 v27; // rbx
  __int64 v28; // rax
  __int64 v29; // rdx
  __int64 v30; // rbx
  __int64 v31; // rax
  __int64 v33; // rax
  __int64 v34; // rax
  __int64 v35; // rax
  __int64 v36; // rbx
  __int64 v37; // rax
  __int64 v38; // rbx
  __int64 v39; // rax
  __int64 v40; // rbx
  __int64 v41; // rax
  char *v43; // rax
  __int64 v44; // rax
  char *v45; // rax
  __int64 v47; // rbx
  __int64 v48; // rax
  __int64 v49; // rbx
  __int64 v50; // rax
  __int64 v51; // rdx
  __int64 v52; // rbx
  __int64 v53; // rax
  __int64 v54; // rbx
  __int64 v55; // rax
  char check_var; // al
  __int64 v57; // rax
  __int64 v58; // rax
  __int64 v59; // rbx
  __int64 v60; // rax
  __int64 v61; // rbx
  __int64 v62; // rax
  __int64 v63; // rdx
  __int64 v64; // rax
  __int64 v65; // rax
  __int64 v66; // rax
  __int64 v67; // rax
  __int64 v68; // [rsp+18h] [rbp-E8h] BYREF
  __int64 v69; // [rsp+20h] [rbp-E0h] BYREF
  __int64 v70; // [rsp+28h] [rbp-D8h] BYREF
  __int64 v71; // [rsp+30h] [rbp-D0h] BYREF
  __int64 v72; // [rsp+38h] [rbp-C8h] BYREF
  __int64 v73; // [rsp+40h] [rbp-C0h] BYREF
  __int64 v74; // [rsp+48h] [rbp-B8h] BYREF
  __int64 v75; // [rsp+50h] [rbp-B0h] BYREF
  __int64 v76; // [rsp+58h] [rbp-A8h] BYREF
  __int64 v77; // [rsp+60h] [rbp-A0h] BYREF
  __int64 v78; // [rsp+68h] [rbp-98h] BYREF
  __int64 v79; // [rsp+70h] [rbp-90h] BYREF
  __int64 v80; // [rsp+78h] [rbp-88h] BYREF
  __int64 v81; // [rsp+80h] [rbp-80h] BYREF
  __int64 v82; // [rsp+88h] [rbp-78h] BYREF
  __int64 v83; // [rsp+90h] [rbp-70h] BYREF
  __int64 v84; // [rsp+98h] [rbp-68h] BYREF
  __int64 v85; // [rsp+A0h] [rbp-60h] BYREF
  __int64 v86; // [rsp+A8h] [rbp-58h] BYREF
  __int64 v87; // [rsp+B0h] [rbp-50h] BYREF
  __int64 v88; // [rsp+B8h] [rbp-48h] BYREF
  __int64 v89; // [rsp+C0h] [rbp-40h] BYREF
  __int64 v90; // [rsp+C8h] [rbp-38h] BYREF
  __int64 v91; // [rsp+D0h] [rbp-30h] BYREF
  __int64 v92; // [rsp+D8h] [rbp-28h] BYREF
  __int64 v93; // [rsp+E0h] [rbp-20h] BYREF

  v2 = std::string::end(input);
  v3 = std::string::begin(input);
  if ( std::all_of<__gnu_cxx::__normal_iterator<char *,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#1}>(
         v3,
         v2) )                                  // isalpha
  {
    v4 = std::string::end(input);
    v5 = std::string::begin(input);
    if ( !std::all_of<__gnu_cxx::__normal_iterator<char *,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#2}>(
            v5,
            v4) )                               // isxdigit, if non hex digit continue
    {
      v69 = std::string::begin(input);
      v7 = std::string::end(input);
      v8 = std::string::begin(input);
      v70 = std::find_if<__gnu_cxx::__normal_iterator<char *,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#3}>(
              v8,
              v7);
      if ( !__gnu_cxx::operator==<char *,std::string>((__int64)&v70, (__int64)&v69) )// check T
        goto INVALID_FLAG_1;
      v72 = std::string::begin(input);
      v71 = __gnu_cxx::__normal_iterator<char *,std::string>::operator+(&v72, 1LL);
      v10 = std::string::end(input);
      v11 = std::string::begin(input);
      v73 = std::find_if<__gnu_cxx::__normal_iterator<char *,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#4}>(
              v11,
              v10);                             // check h
      if ( !__gnu_cxx::operator==<char *,std::string>((__int64)&v73, (__int64)&v71) )
        goto INVALID_FLAG_1;
      v75 = std::string::begin(input);
      v74 = __gnu_cxx::__normal_iterator<char *,std::string>::operator+(&v75, 2LL);
      v12 = std::string::end(input);
      v13 = std::string::begin(input);
      v76 = std::find_if<__gnu_cxx::__normal_iterator<char *,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#5}>(
              v13,
              v12);                             // check e
      if ( __gnu_cxx::operator==<char *,std::string>((__int64)&v76, (__int64)&v74) )
      {
        v14 = std::operator<<<char>(&_bss_start, input);
        return std::operator<<<std::char_traits<char>>(v14, '_');// VALID_FLAG_1
      }
      else
      {
INVALID_FLAG_1:
        v16 = std::operator<<<std::char_traits<char>>(&_bss_start, "Invalid flag!", v9);
        return std::ostream::operator<<(v16, &MEMORY[0x7EFEAA151910]);
      }
    }
  }
  v17 = std::string::end(input);
  v18 = std::string::begin(input);
  if ( (unsigned __int8)std::any_of<__gnu_cxx::__normal_iterator<char *,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#6}>(
                          v18,
                          v17) )                // isalpha
  {
    v19 = std::string::end(input);
    v20 = std::string::begin(input);
    if ( (unsigned __int8)std::any_of<__gnu_cxx::__normal_iterator<char *,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#7}>(
                            v20,
                            v19) )              // isalnum
    {
      v22 = (char *)std::string::operator[](input, 0LL);
      if ( isalpha(*v22) )
      {
        v77 = std::string::begin(input);
        v24 = std::string::end(input);
        v25 = std::string::begin(input);
        v78 = std::find_if<__gnu_cxx::__normal_iterator<char *,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#8}>(
                v25,
                v24);                           // C val
        if ( __gnu_cxx::operator==<char *,std::string>((__int64)&v78, (__int64)&v77) )
        {
          v27 = std::string::end(input);
          v28 = std::string::begin(input);
          v68 = std::find_if<__gnu_cxx::__normal_iterator<char *,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#9}>(
                  v28,
                  v27);                         // + val
          v79 = std::string::end(input);
          if ( (unsigned __int8)__gnu_cxx::operator!=<char *,std::string>(&v68, &v79)
            && (v80 = std::string::end(input),
                v30 = std::string::end(input),
                v31 = __gnu_cxx::__normal_iterator<char *,std::string>::operator+(
                        &v68,
                        1LL),                   // + val
                v81 = std::find_if<__gnu_cxx::__normal_iterator<char *,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#10}>(
                        v31,
                        v30),
                (unsigned __int8)__gnu_cxx::operator!=<char *,std::string>(&v81, &v80)) )
          {
            v33 = std::operator<<<char>(&_bss_start, input);
            return std::operator<<<std::char_traits<char>>(v33, 95LL);// VALID_FLAG_2
          }
          else
          {
            v34 = std::operator<<<std::char_traits<char>>(&_bss_start, "Invalid flag!", v29);
            return std::ostream::operator<<(v34, &MEMORY[0x7EFEAA151910]);
          }
        }
        else
        {
          v35 = std::operator<<<std::char_traits<char>>(&_bss_start, "Invalid flag!", v26);
          return std::ostream::operator<<(v35, &MEMORY[0x7EFEAA151910]);
        }
      }
INVALID_FLAG_3:
      v67 = std::operator<<<std::char_traits<char>>(&_bss_start, "Invalid flag!", v23);
      return std::ostream::operator<<(v67, &MEMORY[0x7EFEAA151910]);
    }
  }
  v36 = std::string::end(input);
  v37 = std::string::begin(input);
  if ( !(unsigned __int8)std::any_of<__gnu_cxx::__normal_iterator<char *,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#11}>(
                           v37,
                           v36)
    || (v38 = std::string::end(input),
        v39 = std::string::begin(input),
        !(unsigned __int8)std::any_of<__gnu_cxx::__normal_iterator<char *,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#12}>(
                            v39,
                            v38))
    || (v40 = std::string::end(input),
        v41 = std::string::begin(input),
        (unsigned __int8)std::all_of<__gnu_cxx::__normal_iterator<char *,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#13}>(
                           v41,
                           v40) == 1) )
  {
    v59 = std::string::end(input);
    v60 = std::string::begin(input);
    if ( (unsigned __int8)std::all_of<__gnu_cxx::__normal_iterator<char *,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#18}>(
                            v60,
                            v59) )
    {
      v61 = std::string::end(input);
      v62 = std::string::begin(input);
      if ( (unsigned int)std::accumulate<__gnu_cxx::__normal_iterator<char *,std::string>,int,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(int,char)#1}>(
                           v62,
                           v61,
                           0) == 0xDEA47FED )
      {
        v64 = std::operator<<<char>(&_bss_start, input);
        v65 = std::operator<<<std::char_traits<char>>(v64, 125LL);// VALID_FLAG_4
        v66 = std::operator<<<std::char_traits<char>>(v65, " is the correct flag!", v65);
      }
      else
      {
        v66 = std::operator<<<std::char_traits<char>>(&_bss_start, "Invalid flag!", v63);
      }
      return std::ostream::operator<<(v66, &MEMORY[0x7EFEAA151910]);
    }
    goto INVALID_FLAG_3;
  }
  v43 = (char *)std::string::operator[](input, 0LL);
  if ( !isalpha(*v43) )
    goto INVALID_FLAG_3;
  v44 = std::string::size(input);
  v45 = (char *)std::string::operator[](input, v44 - 1);
  if ( !isalpha(*v45) )
    goto INVALID_FLAG_3;
  v82 = std::string::end(input);
  v47 = __gnu_cxx::__normal_iterator<char *,std::string>::operator-(&v82, 1LL);
  v83 = std::string::begin(input);
  v48 = __gnu_cxx::__normal_iterator<char *,std::string>::operator+(&v83, 1LL);
  result = std::all_of<__gnu_cxx::__normal_iterator<char *,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#14}>(
             v48,                               // check digit
             v47);
  if ( (_BYTE)result )
  {
    v85 = std::string::begin(input);
    v84 = __gnu_cxx::__normal_iterator<char *,std::string>::operator+(&v85, 1LL);
    v87 = std::string::end(input);
    v49 = __gnu_cxx::__normal_iterator<char *,std::string>::operator-(&v87, 1LL);
    v88 = std::string::begin(input);
    v50 = __gnu_cxx::__normal_iterator<char *,std::string>::operator+(&v88, 1LL);
    v86 = std::find_if<__gnu_cxx::__normal_iterator<char *,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#15}>(
            v50,                                // 0 val
            v49);
    if ( !__gnu_cxx::operator==<char *,std::string>((__int64)&v86, (__int64)&v84) )
      goto INVALID_FLAG_2;
    v89 = std::string::begin(input);
    v52 = std::string::end(input);
    v53 = std::string::begin(input);
    v90 = std::find_if<__gnu_cxx::__normal_iterator<char *,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#16}>(
            v53,
            v52);                               // G val
    if ( !__gnu_cxx::operator==<char *,std::string>((__int64)&v90, (__int64)&v89) )
      goto INVALID_FLAG_4;
    v92 = std::string::end(input);
    v91 = __gnu_cxx::__normal_iterator<char *,std::string>::operator-(&v92, 1LL);
    v54 = std::string::end(input);
    v55 = std::string::begin(input);
    v93 = std::find_if<__gnu_cxx::__normal_iterator<char *,std::string>,main::{lambda(std::string&)#1}::operator() const(std::string&)::{lambda(char)#17}>(
            v55,                                // d val
            v54);
    if ( __gnu_cxx::operator==<char *,std::string>((__int64)&v93, (__int64)&v91) )
      check_var = 1;
    else
INVALID_FLAG_4:
      check_var = 0;
    if ( check_var )
    {
      v57 = std::operator<<<char>(&_bss_start, input);
      return std::operator<<<std::char_traits<char>>(v57, '_');// VALID_FLAG_3
    }
    else
    {
INVALID_FLAG_2:
      v58 = std::operator<<<std::char_traits<char>>(&_bss_start, "Invalid flag!", v51);
      return std::ostream::operator<<(v58, &MEMORY[0x7EFEAA151910]);
    }
  }
  return result;
}

```

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXf0H62zPFWsLFuJ6CquSQec3TErFw2cFdFcEyICyDEcpG1areM5vpqQctX56_vTy2AifmrISPaty7lPOEuWPg_d4vcTKXagVkdGypX-d83FDnkd5qzJGCQAuKfc3l_DZxUechGuEJdhPApykkM_jxWSQcei?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Flag: `INTECHFEST{The_C++_G0d_dea47fed}`
