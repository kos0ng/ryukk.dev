# Reverse Engineering

<!-- challenge-index: 151205b873585046 -->

| Challenge | Topic |
| --- | --- |
| [Yggdarsil (656 Pts)](#yggdarsil-656-pts) | Rust, Mach-O, Elm |
| [Goliath (699 Pts)](#goliath-699-pts) | Rust, Self-Modifying Code |

<!-- /challenge-index -->

## Yggdarsil (656 Pts)

### Description

\-

### Solution

Diberikan file mach-o , jadi kami coba jalankan terlebih dahulu menggunakan vm mac-os.

<figure><img src="https://lh7-us.googleusercontent.com/Gm5zQkCbZoVwkog_2CG4bRl8aeo8YTZWT-LaO1-DZXbg3reE1MGhqTXfcVaDtLgl6jOJi4Yu5-o0ZJjwZfEm9H4y0gDZHz86MTpebvfMPzqf0g3UllyB1C20VGcpC_hxKtEFsjqc57wde8SvUUiuHg" alt=""><figcaption></figcaption></figure>

Selanjutnya kita coba lakukan decompile terhadap file tersebut.

<figure><img src="https://lh7-us.googleusercontent.com/9VYf2s2YFE-mmVE4F84s1SX1AC0tTGLY9tOSLdBE4_zvd2E9cwlrEzpVj414SmfH3SlP0Gd5IJcEnBYnGEoJc5iLOceFzPo2GJ1APqD4jSsrmPsq00wceFY-EfZPZeRfDWow9IuDuSs1C1weEMK19Q" alt=""><figcaption></figcaption></figure>

Terlihat bahwa program tersebut dibuat menggunakan rust , pada fungsi main terdapat fungsi untuk memanggil webview , jadi bisa kita simpulkan dari hasil eksekusi dan static analysis bahwa program tersebut melakukan load terhadap web. Ada 2 kemungkinan disini , web bisa online atau di store di program itu sendiri, jadi lakukan string untuk melihat string apa aja yang disimpan oleh program.

<figure><img src="https://lh7-us.googleusercontent.com/n6g5Yai_qAwTR3P6kWhphHauNigdKlwFY-6Ea9yEISLVW_kHSpvWHhNJZlDL_Hl7RHrrIUbPfwC0AVeN4s6k8X5oft-mZZ_11M55d769LG5R3jD2KCyFr68J9hUDGw10Pn0mDTx77z0KYx-u3farzw" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/Gu1yKdnO-sUpBZCZ5UuQxKjGJ5ojBOHAdnM9ulgOpEWm8e_RtWYB5x3r3hzkSItPMl29CTtDu7tRkh6WPbVfVG_JxajJX5BJstbg6A5z66Q90FSWWYHSVYcavYZ7h9PDYzuaNGG98QXZ1awwEYHs9Q" alt=""><figcaption></figcaption></figure>

Terlihat terdapat kode html ,lakukan search pada “Incorrect!”

<figure><img src="https://lh7-us.googleusercontent.com/VRld9XvPv7cSMnbJkFABHmJL4tRoHHYwTTLzRi41fzYOdybwW_udLMxMvgoNNokjiFP6QHacgPOtR4Kbj1Jvui6XwCs0cBTBWWcOlq4tHvawiKBqEYeKzVVXtsaYz-MngeNfuXCyJ-k32Cu3E2b1-Q" alt=""><figcaption></figcaption></figure>

Dapat dilihat pada potongan kode diatas bahwa terdapat pengecekan terhadap hasil encrypt dari input kita.

Berikut adalah kode dari fungsi doEncrypt

```javascript
var $author$project$Main$doEncrypt = F3(
    function (time, passphrase, plaintext) {
   	 return A3(
   		 $billstclair$elm_crypto_string$Crypto$Strings$encrypt,
   		 $elm$random$Random$initialSeed(time),
   		 passphrase,
   		 plaintext);
    });

```

Fungsi tersebut menjalankan fungsi billstclair$elm\_crypto\_string$Crypto$Strings$encrypt dan salah satu argumen juga menjalankan suatu fungsi $elm$random$Random$initialSeed. Jadi tinggal search aja untuk kedua fungsi tersebut dan didapatkan informasi bahwa kode tersebut dibuat menggunakan elm-lang dan fungsi encrypt diambil dari salah satu library yang ada pada elm-lang

<figure><img src="https://lh7-us.googleusercontent.com/g9AXFGkpshQZZlTAsRq8sYmNO9glPofol1GAu_qSdFkCDZRSrAAh5WK2z7jPu7_585a9G-fhN6JKlIS1L5OhpyIGgjM3QOUarLwiZVIHQTwCFIUFSvTUev9_Ih095skC8LFW5q5XjNmzNyVvs26ZfA" alt=""><figcaption></figcaption></figure>

Lakukan install terhadap elm-lang dan juga librarynya , lalu coba fungsinya ( lakukan encrypt decrypt ).

<figure><img src="https://lh7-us.googleusercontent.com/7kLtnqpzXv-6ABV9xy50pgtFCNt1iow0nATQ35DgJmfyBhGI0IxbMIMPgGp0pjl19uckO8s2mg2jTc92RTFj_2iyOyqx1UZk6fEdf6e2ad0RqiqynoQDdtHraHdkCADkSgA_-Ty36LEPCrtsrmc5Ww" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/cvAteemhIZoE5kKBEi5JOMEpp4mmz22NVDj6xQvBCM1ZlR72M2TT66PPd-KKW_vM9jwe_4Irj2ClXW6kKKfsdEX166ksgZcen4SnWtygAu8nHbKGL5oE5t7WlLNTSM4ToqmqFQfLv32nfSZiKLsbXg" alt=""><figcaption></figcaption></figure>

Karena sudah bisa encrypt decrypt maka kita coba lakukan decrypt terhadap ct yang dibandingkan dengan hasil encrypt input kita.

```javascript
A3($author$project$Main$doEncrypt, 1337, 'sacred_key_for_sacred_tree', flag)),
var $author$project$Main$ct = 'LUYEOHmRZ4iocP3J67VJ5Cg6WENfuCS6B5BXeqBjMtARkE7d80JjKU53yfTM\n3mm5TgE74LOtl/q6nedvGI+Qbg==';
```

Karena sudah memiliki key dan ct maka lakukan decrypt

<figure><img src="https://lh7-us.googleusercontent.com/d9u6uQTYnDhbCO6AhuERx7gOEqRE02A2sB1urMBxRgUfLYGitoAFI9lwAb4in9ps-RmehYWSMXN3MQoL6Udhbjk8237kk_1iJr7Z-8NYb-Wlj7GrEsJp2N2QLCle9neWvpmKD2aisyAFntw0cNXVvQ" alt=""><figcaption></figcaption></figure>

Flag : CJ2021{a\_delightful\_flag\_for\_reliable\_reverser}

## Goliath (699 Pts)

### Description

\-

### Solution

Diberikan file ELF 64-bit , kalau diliat dari strings program tersebut dibuat menggunakan rust

<figure><img src="https://lh7-us.googleusercontent.com/hA6J7Bv-AryuZOq7qozp0NrUhZnhQNen21_5AeHzYO25ZIaGFcsIYEC1g0s6p7H6A9foVJPHMTkXd-3bs5ug-bVhSqUKs5VgI71rxocNzjcoaBXeoYw57wwMdiFMEp7P8pCwA12ndsN5IrA_601yow" alt=""><figcaption></figcaption></figure>

Selanjutnya kita coba jalankan file tersebut dan ada yang aneh , yaitu keluar encrypted tapi telat ( sepertinya program lain ) dan hasil md5sum berubah

<figure><img src="https://lh7-us.googleusercontent.com/uU7uBTVziHqA4lJLf7-PfRcUg963CJgrWauvWb7FkktutbLLmx1ZQaxXSSXm1uuGFifglTIkweAE6WY4FgmZcDHxtGKA3MLmM9xLwr1m3BaG4HkFMTTuKKf79NKU9LzEYIautkIB-GNa5aMgahjf4Q" alt=""><figcaption></figcaption></figure>

Maka dari itu kami coba lakukan static analysis dan dynamic analysis.&#x20;

Pertama kita tahu bahwa goliath berubah , berarti terdapat open terhadap file goliath . Dapat dipastikan ketika kita ubah nama filenya maka akan error

<figure><img src="https://lh7-us.googleusercontent.com/_pjULowQcjke58KgaUWsX5UWoKmRy9xqd2bMLfL9-pPHA1lmZYC8ARrB4Cgt2UaMurDDkaVFgN411w7-CdbGN7b9ScOmrNwaXMDA6XrqnLN3Ayd8B0P9oxZuMDk7QlGiWFu0Sli_8qj9PZOoLheBFQ" alt=""><figcaption></figcaption></figure>

Cek fungsi open dan liat reference terhadap fungsi tersebut

<figure><img src="https://lh7-us.googleusercontent.com/irUzJlr_IR66tr2pyBPARymh0JIwvie3wAauBgOg4RiaegDTquOJu4yNrHg37t9jpLCVVzTnJkM32QwmC9y90eiucLmo4pKQk9b0TLcH_2BIEOwUOWBpnCnY5DLinw0WqMfWhNquQCk44XNGRTRDmA" alt=""><figcaption></figcaption></figure>

Hanya dipanggil difungsi main dan sepertinya bisa kita skip

<figure><img src="https://lh7-us.googleusercontent.com/RSO42PDjxrxhNXVMBTzp9yFtc2DvY_ZO5h0J1z1bdyift2-Qrc4EuWlCrflNF8UwLtJe9fl7t_2ERvXSdJvXkzmSP_SQfdHvAQNCsOfd38at-98b3sCNqSIRzYgAEZPGYoA0HrSkjd37_Te28BfMGw" alt=""><figcaption></figcaption></figure>

Selanjutnya cek fungsi open64

<figure><img src="https://lh7-us.googleusercontent.com/38uNlluwMPjnHafZJ2NWncRW_MynGeoOxemewYX3zgMsnjbXdrHsDjQxIv_a4qH-J7Mc7KmkqbIygRErJJzHdZx8pnbEf6lqw_jp_km9oY6cfMXn_RjNUE2YsX0HbwMSeEUBBHCdxVxYfiI90wQ9OQ" alt=""><figcaption></figcaption></figure>

Terlihat bahwa dipanggil oleh beberapa fungsi , jadi kita keep informasi ini. Berdasarkan informasi sebelumnya kita ketahui bahwa ada perubahan terhadap file dengan nama goliath , jadi kita search string goliath.

<figure><img src="https://lh7-us.googleusercontent.com/gNsTnbKP48iTRf7KQqwg-8z04ejMecW9ZkF_biNTrpC9Hhfk7KIDVvWyvuVUeoqJYrJ2k9dj3f8aj47WGGd9e-j_KfxKclKqQTLQpa8gtqe46mGUQGKKr9P6NnQw_2ZBiZok_jALv3cn6NbMErB6_g" alt=""><figcaption></figcaption></figure>

Didapatkan string goliath juga diload di fungsi sub\_8CAC , maka selanjutnya analisis fungsi sub\_8CAC.

Disini kami melakukan analisis beberapa fungsi secara dynamic , adapun berikut untuk beberapa address penting yang kami catat.

```
Num Type       Disp Enb Address        What
1   breakpoint keep y   0x000055555540cd75
    breakpoint already hit 1 time
2   breakpoint keep y   0x0000555555408cbb
    breakpoint already hit 1 time
3   breakpoint keep y   0x0000555555408cd8 -> detect file
    breakpoint already hit 1 time
4   breakpoint keep y   0x0000555555408e0c -> check length
5   breakpoint keep y   0x0000555555408e60
7   breakpoint keep y   0x0000555555408f4d
8   breakpoint keep y   0x0000555555408ed5
9   breakpoint keep y   0x0000555555409019 -> ptrace
10  breakpoint keep y   0x0000555555409034 -> ptrace
11  breakpoint keep y   0x0000555555409041
```

Jadi untuk fungsi ptrace kita bypass , caranya adalah dengan mengubah nilai ecx menjadi 6

<figure><img src="https://lh7-us.googleusercontent.com/fh8XtUUUTUJFn8XGeLbUSZLORcZyxe4FKJD2-dd3jJNpWgMKY3xsDNoovwGR-7YvrwJH7IXmavHZTAaNA_Py9O5iQFtle0tGPCINe-dibmz46T1-A-Sh6mSl8qmXIhq2PhmBIzh53UoK8SkLBv3eXQ" alt=""><figcaption></figcaption></figure>

Selanjutnya akan dilakukan xor value yang ada dimemory $rbp+$rdi dan $r14+$rbx

<figure><img src="https://lh7-us.googleusercontent.com/8d1T4os1mkBABpyhB-7MruVcnP4VnjLxRpXYMAUf69ijdj5PuhYtUKSaN0wVQZ6hn5Kryi0he8QHph7zWMkmgojC3lIYmC2t3-WhdazD1EbdRJG7648J3_QanVDYnJ9dTUk4cAwCUZKXI_lgSA42Cg" alt=""><figcaption></figcaption></figure>

Jadi kita lakukan dump terhadap nilai pada address tersebut, adapun untuk panjangnya kita ketahui dari perbandingan nilai rbx dan r12

<figure><img src="https://lh7-us.googleusercontent.com/5VXgnMJ8_ErKvph1ijK_c770Re2b7XyEFhv-2TEtPcn2cviKbmnF8_GOJryC3Ckr7aNF1NSxgvYTw4qpUfj1XQ4-d2ADzEC5BE5sMxtN5FmXfcu2Iag3_bEbxAV3RiWNhg7LZ2qXJ1OJqKVSLUX8BQ" alt=""><figcaption></figcaption></figure>

Berikut untuk dumpnya

<figure><img src="https://lh7-us.googleusercontent.com/ZeXujHvUYenOimZ2LE23aIr0Bj3EMCixqYtEoEF6UoNsH7xMqK8YbRFDWhnkXsoFnNtwoh-cI9QSgI1hsR8Fop-u6fLUXvgJus08mdmuLxDKsstyVbuDG8H95Xi1t6mX3u2yagRmtJtUuwH75uuvuw" alt=""><figcaption></figcaption></figure>

Selanjutnya tinggal lakukan xor dan cek hasil dari xor tersebut.

```python
key = [0xa1, 0xad, 0xcf, 0xdb, 0x47, 0x95, 0xba, 0x46, 0x49, 0xa4, 0x42, 0xcd, 0x72, 0x84, 0x59, 0x38, 0x35, 0x2a, 0x1a, 0x6a, 0xea, 0x23, 0x47, 0x2e, 0xca, 0x1d, 0xa8, 0x26, 0x3a, 0x73, 0x76, 0x89]
f = open("xor1.bin","rb").read()
res = []
q = open("out","wb")
for i in range(len(f)):
    res.append(f[i]^key[i%len(key)])
q.write(bytes(res))
```

<figure><img src="https://lh7-us.googleusercontent.com/-ntxS0pO_kzpTZBycQLtZryNSi_zSMhf-E1T5RKORLl7Ec7glDaesKLPSECCsd22TrbsRa2KGm91kD3NE9hMX70ffn-vAk6eS0VGZhbfeXOWkGfVVoRjLuM1Whih-FzLSKrB1ogwtfwx9vLDCGvJvQ" alt=""><figcaption></figcaption></figure>

Ternyata file gzip , jadi ubah extensi jadi gz lalu lakukan extract.

![](https://lh7-us.googleusercontent.com/LNilCoT68dstla9aUFjTAMIcthv10W5y9SgzS3l_6LV46u1Boj6TemTrDvksI6M7dR2PVX60RSdDt__Iv-BJAI9zBmkm561Prxo-Z7mDuDeWwvp3qqXA7mFP5toEXMusD2URQLSQo1RAMVcWr4OSjA)

Didapatkan file out yang merupakan file ELF64 bit

<figure><img src="https://lh7-us.googleusercontent.com/g7U00SMT02FWDbuVT3qKgbMwSvHkl3ifWGd5DGoaGzqlLANj46v6QBnhWmL-yrJMtQhiPu1pTYCxi_Q7GLpG-g_gj5jxKUM2th0z2dwjdSswT983uFlKGCVsCDS93h9KoWfgk4DDNlz9lfYhnhrHPA" alt=""><figcaption></figcaption></figure>

Yang mana ketika kita jalankan akan menghasilkan output seperti yang diawal tadi&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/i80-YZHOMVEsL5lR58VERpB5MsiLnyOnmqLdCOzdNmAXQV66GBVT1WR6QFkmx7qklM9RV508vYANEw2d-djxOzxYfLhuuWOEgLXS4APmPiFtOx7tNUrQrGEFR5XGwjTTStVzsQhfakLq6vDQCWKQIA" alt=""><figcaption></figcaption></figure>

Jadi selanjutnya langsung decompile file tersebut

```c
// local variable allocation has failed, the output may be wrong!
void __cdecl main_main()
{
  string length; // [rsp+10h] [rbp-E0h]
  __int64 lengtha; // [rsp+10h] [rbp-E0h]
  string lengthb; // [rsp+10h] [rbp-E0h]
  string lengthc; // [rsp+10h] [rbp-E0h]
  uint8 *elem; // [rsp+18h] [rbp-D8h]
  string elema[3]; // [rsp+18h] [rbp-D8h] OVERLAPPED
  __int64 a; // [rsp+20h] [rbp-D0h]
  __int128 aa; // [rsp+20h] [rbp-D0h] OVERLAPPED
  string ab; // [rsp+20h] [rbp-D0h]
  __interface_{} ac; // [rsp+20h] [rbp-D0h]
  string a_16; // [rsp+30h] [rbp-C0h]
  string plaintext; // [rsp+48h] [rbp-A8h]
  string key_len; // [rsp+58h] [rbp-98h]
  char v13[64]; // [rsp+68h] [rbp-88h] BYREF
  uint8 *key_ptr; // [rsp+A8h] [rbp-48h]
  uint8 *iv_ptr; // [rsp+B0h] [rbp-40h]
  string v16; // [rsp+B8h] [rbp-38h] BYREF
  _OWORD v17[2]; // [rsp+C8h] [rbp-28h] BYREF

  main_ran(32LL);
  key_ptr = elem;
  *((_QWORD *)&aa + 1LL) = main_ran(16LL).str;
  iv_ptr = elem;
  length.str = (uint8 *)"https://gist.githubusercontent.com/vidner/6fede10781c23f76d222fdbec6c4607c/raw/1058e0711938e1c80"
                    	"d69ecfeebd470790a2f4863/viva-el-rey";
  length.len = 131LL;
  *(__uint8 *)&elema[1LL].len = main_doRequest(length);
  lengtha = a;
  *(_QWORD *)&aa = elema[1LL].len;
  crypto_sha256_Sum256(lengtha, *((_QWORD *)&aa + 1LL));
  ((void (*)(void))loc_4564A4)();
  v17[1LL] = 0LL;
  *(runtime_eface_0 *)&elema[1LL].len = runtime_convT2Enoptr((runtime__type_0 *)&stru_6969C0, v13);
  v17[1LL] = aa;
  lengthb.str = (uint8 *)"%x";
  lengthb.len = 2LL;
  *(_QWORD *)&aa = &v17[1LL];
  *((_QWORD *)&aa + 1LL) = 1LL;
  elema[1LL].len = 1LL;
  plaintext = fmt_Sprintf(lengthb, *(__interface_{} *)&aa);
  elema[0LL].str = (uint8 *)"CJ2021{";
  elema[0LL].len = 7LL;
  elema[1LL] = elema[2LL];
  elema[2LL].str = (uint8 *)"}";
  elema[2LL].len = 1LL;
  key_len = runtime_concatstring3((uint8 (*)[32])&v13[32LL], *(string (*)[3])&elema[0LL].str);
  ab.str = key_ptr;
  ab.len = (__int64)key_len.str;
  a_16.str = iv_ptr;
  a_16.len = key_len.len;
  main_Ase256(plaintext, ab, a_16, 16LL);
  v16 = plaintext;
  v17[0LL] = 0LL;
  runtime_convT2Estring((runtime__type_0 *)&e, &v16);
  v17[0LL] = *(_OWORD *)&ac.array;
  lengthc.str = (uint8 *)"Too bad its already encrypted: %v\n";
  lengthc.len = 34LL;
  ac.array = (interface_{} *)v17;
  ac.len = 1LL;
  ac.cap = 1LL;
  fmt_Printf(lengthc, ac);
}

```

Terlihat bahwa program melakukan request terhadap suatu gist lalu melakukan sha256 dan enkripsi aes. Karena terlihat terdapat format flag maka kemungkinan yang di encrypt adalah flag , jadi lakukan breakpoint pada pemanggilan fungsi main\_Ase256 agar tahu value dari argumentnya (flag).

<figure><img src="https://lh7-us.googleusercontent.com/Fpm1mULzP-YgjBOqmuU6DXHvc1abTWN1g1nqUAjZ_6zofWWuh-RRTkQ7RJKSsSPe1AxAYvafv7e-CIEc5ucFPG4wcg_oT45OoJADLbmczU4BNuMDYgrjRrP3_-0ixeU2CnyHCyEd5re9a5KNOwnjUw" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/YHNQEBz62S3PjkYbK5NjqWhMpDXH1PqfTV9-w28aqXho5K5kKc4haIzy0Xa2aYNU2fODcTHukxDHj22T322NigvMo-fJCBRoLyBJyUNw_a_m73tYuK6NdbNey37nYBEl7m7IrWjpy5_DrfBweOstRw" alt=""><figcaption></figcaption></figure>

Adapun berikut breakpoint yang kami set sebelumnya untuk melakukan analisis pada binary tersebut

<figure><img src="https://lh7-us.googleusercontent.com/KMmnj_QenKAh38U8un2UeoiNnSZ3MNQZF25T5cpVkR_l--LrdXOXCSMwChzMHVibDproqGS09AXf6Dx9mjtx7TEBGKH9HxtWwBW4BpiQjcK1I9dqVdPJmHLfCTS-yIckENcWlZhNv4-7wN2bX1SQ9Q" alt=""><figcaption></figcaption></figure>

Flag : CJ2021{eaca9080fa4c6a8bca426dc205e73d96a5e5814fdef8aa7ef0f219c6ba761fb3}
