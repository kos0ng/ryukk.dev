# Forensic

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>Riil Kh? (364 pts)</td><td><a href="#riil-kh-364-pts">Here</a></td></tr><tr><td>Syntek Hospital's Evidence (Part 1) (456 pts)</td><td><a href="#syntek-hospitals-evidence-part-1-456-pts">Here</a></td></tr></tbody></table>

## Riil Kh? (364 pts)

### Description

\-

### Solution

Jadi flag ada di email , ada 2 bagian. Tapi saya nemu jadi 1. Karena kami gatau bagaimana request saat pengiriman email, jadi kami coba analisis requestnya dengan burpsuite.

<figure><img src="https://lh7-us.googleusercontent.com/H72xLxJrys3L86t4uBfuRX130jeN3asgosiMlGeiUDOXSVUQan-poxKWeQWAaJ8Td3z3Go6-XhpJTthZYJBkaWJ8RD40P8UFiQXHdkpB2_tw3l7aD7IHRLLQjaI2Q6zkBBMpPsiVmn9wxb7uTlGNhTc" alt=""><figcaption></figcaption></figure>

Jadi ada di post sync/u/\<int> . Cari req tersebut diwireshark

<figure><img src="https://lh7-us.googleusercontent.com/Fx8v8lVYEBZFbxw1qM-SQ7IMkYnPf429orR4jP9vLhjRs1QoukAoXM-o-7W3LjFezV0k1F3GzVEMWw_InOfoeVwTX-jI56xsUZamV7TaFTwz9gqrsQoDOy1_JNflpUvGgwYiGMcffQXvqWkV5KqvAYY" alt=""><figcaption></figcaption></figure>

Hingga didapatkan 1 req yang memiliki flag. Copy jsonnya dan liat ada flag

<figure><img src="https://lh7-us.googleusercontent.com/RsXok73-Je1S7hg_CLgyhhEKTucbZKsf-XGRBAo8ct8dQsOiaalaBMO0xyD0RoefhK4Iv2-t07hEFcX-ttlmZWpuUN9nVrb-lMqLqk0PFyp7Wwko4aUGlFDOrCfnoDnZyTaZ7ZB1XMwEpU4G3hXccnc" alt=""><figcaption></figcaption></figure>

Flag : IFEST22{Th3\_tRutH\_15\_g3ner\@LLy\_s33n\_@nd\_RareLy\_h3ard\_yagesya}

## Syntek Hospital's Evidence (Part 1) (456 pts)

### Description

\-

### Solution

Diberikan mem dump, lakukan analisis terhadap proses yang berjalan.

<figure><img src="https://lh7-us.googleusercontent.com/NXR46WCg_ZXjTTL_Hsh-H0CZPUuXIpVJQz5BeSwWPsgmrSDkalUf642T5bQ65UtzG7ubvmOwEKl62tu1II0XPn_p1EM6jhn44Hv3lmIrSedFpbVJ_oOw0SvtrAWfwZfgYj3vgtXMreQvbLY3MQZ5wMw" alt=""><figcaption></figcaption></figure>

Karena deskripsi menjelaskan bahwa aplikasi ngoding  yang biasa digunakan maka dari nama filenya kemungkinan adalah scripteditor.exe atau code.exe. Lakukan procdump untuk kedua proses tersebut

```bash
python3 vol.py -f dump/syn1/dump.raw  -o dump/syn1/ windows.dumpfile --pid 3116
python3 vol.py -f dump/syn1/dump.raw  -o dump/syn1/ windows.dumpfile --pid 1740
```

Setelah melakukan analisis unutk file exenya kami menemukan kejanggalan pada Code.exe (dibuild menggunakan c#). Disini kami menggunakn ilspy untuk decompile

<figure><img src="https://lh7-us.googleusercontent.com/h1Ik6zLJzJnUFki1KxbMd0B0coFvt1xdgm_MUOKHPyU1qUrUuYKOtJeDjKuozFtBIRVUYyUXSxR7JIBOFu5dAX7MNBaIYk5qQzW1PybgSc3sIc4jSS86YnsaFF-ujrC16zKGEAF2wJCTSCITnAHHq98" alt=""><figcaption></figcaption></figure>

Program tersebut menjalankan Code.ps1, jadi kami save resourcenya.&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/uYk6RXhP24oAj9HEOp_oHC8BW6etp7pRkiBt1ySpZdXhIhlEZXK4UQf9Bgp1j-w302SHNGCnoOhkEqCPqqAsYfzjW408OqgxSDRESAp-TUQWC8vWc1BESibNo2c4k09OJSfTVlLlKJVylThw03NUrcg" alt=""><figcaption></figcaption></figure>

Lakukan binwalk dan kami mendapat Code.ps1

<figure><img src="https://lh7-us.googleusercontent.com/Od65OtXlwvUsG3cxAa618dn-UcP2FFlbG9nr72S_UVOjaP_CrAb9izAfMD9QD-oMxSc_9LN7JwUWQDY-DRlAubrkW8GWIF0kulA5fqa2Yv3vFcyJlVNNjQOrvEEgVlWNTt5-tNTKgj-I_bTZGHippzY" alt=""><figcaption></figcaption></figure>

Sampai disini terlihat address dan port nya jadi tinggal gabunngkan dengan filename untuk mendapatkan flagnya

Flag : IFEST22{Code.exe\_192.168.219.147\_443}
