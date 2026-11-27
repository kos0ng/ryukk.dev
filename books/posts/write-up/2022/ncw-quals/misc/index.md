# Misc

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>Solar System (500 pts)🥇</td><td><a href="#solar-system-500-pts">Here</a></td></tr></tbody></table>

## Solar System (500 pts)

### Description

\-

### Solution

Diberikan file zip dengan isi sebagai berikut

<figure><img src="https://lh7-us.googleusercontent.com/9GEbwNhL6PSUeWvsiFY3kyYYCQY6QeIOJUl0mt5oZqEAzYeIeEcL6duWgmSScNaHBRqD_R_VpMbmeVXUgtPzp4e5_W2winsr6ptAS1lMBhFmrt6ua9eXRI4IhCBLSg8k_fbSi5GMcKoYMpAWLyIJDP0" alt=""><figcaption></figcaption></figure>

Karena soal ini masih terlalu asing bagi kami , jadi kami coba lakukan pencarian mengenai bagaimana cara compile file .sol . Disini kami menemukan ada package brownie pada python (<https://eth-brownie.readthedocs.io/en/stable/>) namun ketika kami coba compile gagal. Kami lanjut mencari hingga menemukan referensi writeup berikut <https://medium.com/zh3r0/sharky-ctf-blockchain-level-0-to-4-writeup-524b728709d0> . Jadi ternyata kita bisa lakukan compile menggunakan remix ide dan ada online compilernya , jadi gunakan online compiler (<https://remix.ethereum.org/>) . Ada beberapa contract didalam file .sol, disini kami lakukan penyelesaian untuk setiap contract.

#### Flag1

<figure><img src="https://lh7-us.googleusercontent.com/83XA9yNaVd9XKuQRWbY7H8Em2CKeR_FBvKmC64y5WT25MlFaz05WDQjA579gGC_QN-R3IsWS3-Eebr2h6RAohcsgn8_9ypGu_w6N0AaUzQ8ooqLksS-60Hx9sO4JlvYbgwNlY1PorUEuC5NPpA-P_yM" alt=""><figcaption></figcaption></figure>

Flag1 merupakan free flag bisa langsung kita dapatkan pada contract International\_Space\_Station di constructor.

<figure><img src="https://lh7-us.googleusercontent.com/hPzBskqFQaB0PRDiIg4GaSafroHQF_iHdB6nx1u7xVIqSle6Pa5-5yVY5YDXCnzSjxS3jGZB04wZF6LdhOB1TIebEDBMEIrJZyzgpHPCR3RC4lASpxVzfMaOZ_e3WAQehu0Ck2O3aXtEFY-8b8a5Nu4" alt=""><figcaption></figcaption></figure>

Flag1 : w0w\_im\_going\_around\_the\_galaxy

#### Flag2

Flag2 gunakan remix ide, compile dan deploy contract baru.

<figure><img src="https://lh7-us.googleusercontent.com/5w5jMTmJeFu2Z47hMPORmtzlfvB-NSKFCJ41ZEfmv9xWRwcmILqfwdk0II9U8b0QlWxPG7mfkXr3wWjL8MU4VHju0AgFyEF6R9pNUJ3mGxQo5wJihohuZ8iiYuPG6MEq6CryPMhZX_JSkTHy_F4z-CU" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/OOjVIOhQvCP4iekRoxh0waTqSsIjjlATo634gAGKtAHe3X0cfQvALDQMUGfdnxT-Ewsb6agQmYWbMw8sr1nKf8L3wmge_R96e5dnqgZXplKfUE1j1C1bM9Hz9P_hqnjWvGl_yd-NQGR_nehbjK-1FZc" alt=""><figcaption></figcaption></figure>

Disini ada beberapa fungsi yang bisa kita panggil, namun bisa dilihat pada beberapa fungsi terdapat requirement, seperti contohnya untuk fungsi earth kita harus jalankan fungsi neptune terlebih dahulu. Jadi disini kami lakukan pemetaan pemanggilan fungsi dan juga constraint lain sehingga didapatkan sebagai berikut

```
Urutan planet
Mercury,uranus,jupiter,venus,saturn,mars,neptune,earth

Total gas untuk sampai bumi
5+15+3+20+23+8+29+133 = 236

Total gas tambahan = 236 - 50 = 186
Gas awal 50, dan baru bisa mengisi setiap 2 stop dan juga pada awal perjalanan, jadi untuk setiap pengisian jumlahnya adalah sebagai berikut
[50, 50, 50, 36]
```

Pada flagzonia terdapat pengecekan tambahan, yaitu Intergalactic\_Visa . Disini untuk mengubah variable tersebut menjadi true kita perlu memanggil fungsi visum. Namun gas kita 0, jadi setelah kami cek ada fungsi exclusive\_gas dan bisa dijalankan ketika kita sudah ke bumi dan tambahan gas harus 50. Jadi nantinya gas = 0 setelah di Visum dan memenuhi semua constraint yang ada. Terakhir tinggal panggil flagzonia dan dapat angka yang merupakan part of flag.

<figure><img src="https://lh7-us.googleusercontent.com/Dbc8oZr7ZGR4TseARFCzdlFRx7_6N_w6DKWV-4cUnbTpU7jm_2X5tZW3taACh15PAJ5my-oKG2LAyiP49DwI59Nbo_KnHxf8EWehZsnay8JsNjtXP3aqJG8l-QuRPE3c4OVL2N1WgRZZijaQ3JRaBXI" alt=""><figcaption></figcaption></figure>

Flag2 : 2498186224138974628302655144

#### Flag3&#x20;

Flag3 adalah nama fungsi yang ada pada contract Bank\_Of\_Flagzonia dan memiliki execution fee paling rendah. Karena kami tidak tahu bagaimana mengecek execution fee, maka coba-coba saja karena kebetulan daftar fungsi yang mencurigakan hanya ada 2 yakni donateClothes dan donateHouse. Dan diakhir kami mendapatkan yang benar yaitu donateHouse setelah mencobanya pada platform hehe.

Flag3 : donateHouse

#### Flag4

Flag4 kami dapatkan dengan static analysis. Lakukan beautify pada Space\_Artifacts.json

<figure><img src="https://lh7-us.googleusercontent.com/_uJv6j5XcMQhzyGBvZt7KHZYUHKKDNKQrTjyHnNz14So7ri8P8YAD0xaB6BdDC2yhV5fhEFb63vXf6P_Mo-dhxDKicz3YF4kN-PFiQH51gnbrFvZxQfDbf0qkZWLX53-pV-kyi_ePItwfKKd3_FX6VQ" alt=""><figcaption></figcaption></figure>

Selanjutnya terdapat kodingan yang mirip pada contract Space\_Artifac pada SOLAR.sol . Lakukan beautify dengan mengubah melakukan parsing terhadap \n.

<figure><img src="https://lh7-us.googleusercontent.com/-PDtxGCgtOBoNVMkfQds7f-QaP07U6_RJAzZfo779Vx8uH2RgcRU49jZsDEWbKlNQnLQrPt5UvyDkDGe7YGPqdn0hRtiyfP3kvxnlnPXsB4f7wAIoI40NEVCZOh9xj-68Uya-jmNVhmCgN6Tt7Dlm-4" alt=""><figcaption></figcaption></figure>

Jadi flag adalah hidden-Box. Namun dapat dilhat bahwa hidden dan Box valuenya dihilangkan pada kodingan diatas. Mencari di Space\_Artifacts.json kami menemukan kedua value tersebut

<figure><img src="https://lh7-us.googleusercontent.com/b4ExLQ930ODz6wg5pf5hBH4FPc2z3TNSmeiHSsqIwS7t1fqrKIRQX3b1DDNHbkMMIAJG5buYp0gKZwTUyW8HkQ86p2W-IHc3fMrCLgsv7XMnHNLDVjok1__Jb4Ax_yEDP3fyvdXMjY4n9FkHkFiw8w8" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/hqF1IOuQBtXIuU-MpRScI9zDOtQwxhEvUhGWsRNM-o9YGRHXmBnDbQWxjqnXdkEBjqJ8b4P_NcFvCzAwohG-o8UFl74jdrAtcga7S2KTZhkwozGWhDh9M-qIaw89xrzUyXOU1wAOfVnGXMJvsBEn34o" alt=""><figcaption></figcaption></figure>

Selanjutnya karena itu merupakan hexvalue maka perlu kita ubah ke bentuk ascii nya

<figure><img src="https://lh7-us.googleusercontent.com/UwaD2X9rUfjWFOopYVEspTg4UsDRJpROuRVI09JUG1LHsCwOsHQysT7e9w9SZYBud28oEsoiqLHn7-gmQw_L1dCYs12ea-v0_AaMD5grQ8sQLHOgzMM5AecbDlQI5ZdcdjgNcvzrKnEdQ1mGZYfX3X4" alt=""><figcaption></figcaption></figure>

Flag4 : f0r\_th0s3\_wh0\_N33dEd\_dyjkn82910}

Gabungkan semua flag dengan format NCW22{1\_2\_3\_4 dan submit

Flag : NCW22{w0w\_im\_going\_around\_the\_galaxy\_2498186224138974628302655144\_donateHouse\_f0r\_th0s3\_wh0\_N33dEd\_dyjkn82910}
