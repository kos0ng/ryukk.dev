# Misc

<!-- challenge-index: 1b29c461a8fc9354 -->

| Challenge | Topic |
| --- | --- |
| [sharing is caring🥇](#sharing-is-caring) | BitTorrent, SHA-1 |

<!-- /challenge-index -->

## sharing is caring

### Description

\-

### Solution

Diberikan file torrent, ketika kami coba lakukan pengunduhan ternyata gagal. Kemudian kami coba cari cara melakukan parse terhadap data yang ada pada torrent dan menemukan repo berikut <https://github.com/webtorrent/parse-torrent> .&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/Iz1za5eg6KnlRS4mqP34ffTbZ-Nsx3n7lQhU6NiRGE3IRUqNpKa1NMU0JfRMhm6k7jxZ_U7CoVCnSVJBpPhRKw157DLappl4-lnyPpqIBe7oawLEG2LQFzjG-Css5yFGOtEq6KO5P2a1s1qgTQS-c34" alt=""><figcaption></figcaption></figure>

Selanjutnya kami menemukan referensi mengenai key-key yang ada pada torrent tersebut <https://b0tchsec.com/2016/tjctf/torrent> . Jadi setiap nilai pada pieces merupakan checksum dari 12 bytes (pieceLength) data dari file yang akan diunduh dengan torrent. Karena 12 bytes panjang dan sepertinya tidak memungkinkan untuk bruteforce 12 bytes, jadi kami coba dengan checksum terakhir karena checksum terakhir memiliki data dengan panjang 3 bytes (lastPieceLength) .&#x20;

```python
import string
from itertools import product
import hashlib

known = '86ea61ed95e70b7f923f6f7a4496935e2e53cd38'

list_char = [bytes([i]) for i in range(0x100)]
for i in product(list_char, repeat=4):
	tmp = b''.join(i)
	if(hashlib.sha1(tmp).hexdigest() == known):
		print("nice", tmp)
		break
```

<figure><img src="https://lh7-us.googleusercontent.com/YQfNbF6cIDZDTamznfBEZawviNcaPRI8b4yz2GW_eOMIWNoOaG6XujYUaAWjtj_1nZ1imUeEz9YiYvdJqpc_dYXi2A0-LjibN8fir1WWA-1rbnSX_iugadBwFSZXIpZiRQmFcUTPT-xSwyt9KRVgVQM" alt=""><figcaption></figcaption></figure>

Didapatkan nilai b'\xef\xbd\x94' . Terlihat bukan valid common char (<0x7f), jadi selanjutnya kami coba cari nilai tersebut dan didapatkan referensi berikut <https://www.kaminomoto.co.jp/sub/lib/Unicode/Japanese.pm> . Dari deskripsi diketahui bahwa ini mungkin ditulis dengan karakter pada bahasa jepang, awalnya kami coba bruteforce dengan daftar karakter pada link tersebut tetapi gagal karena ada beberapa simbol yang tidak ada. Jadi kami coba cari di github untuk nilai tersebut dan didapatkan file berikut <https://github.com/Voine/ChatWaifu_Mobile/blob/14092ac66c2afd51de06bb126fd102cec869eb8e/VITS/src/main/cpp/openjtalk/text2mecab/text2mecab_rule_ascii_for_utf_8.h#L160> . Karena terlihat lengkap jadi selanjutnya tinggal bruteforce saja. Waktu brute dari akhir karena nama file flag.txt terdapat keterangan pada plaintext/data nya yaitu flag ada pada diary\_1.txt, jadi selanjutnya kami hentikan dan start bruteforce dari pieces 32 (375/12 == 31.23, dengan asumsi ada format flag jadi kita tahu nilai awalnya).&#x20;

```python
import string
from itertools import product
import hashlib

def get_dict(target):
	flag = ""
	for j in target:
		for i in dicc:
			if(dicc[i] == j):
				flag += i
				break
	return flag

dicc = {}
dicc[" "] = b"\xe3\x80\x80"
dicc["!"] = b"\xef\xbc\x81"
dicc['"'] = b"\xe2\x80\x9d"
dicc["#"] = b"\xef\xbc\x83"
dicc["$"] = b"\xef\xbc\x84"
dicc["%"] = b"\xef\xbc\x85"
dicc["&"] = b"\xef\xbc\x86"
dicc["'"] = b"\xe2\x80\x99"
dicc["("] = b"\xef\xbc\x88"
dicc[")"] = b"\xef\xbc\x89"
dicc["*"] = b"\xef\xbc\x8a"
dicc["+"] = b"\xef\xbc\x8b"
dicc[","] = b"\xef\xbc\x8c"
dicc["-"] = b"\xe2\x88\x92"
dicc["."] = b"\xef\xbc\x8e"
dicc["/"] = b"\xef\xbc\x8f"
dicc["0"] = b"\xef\xbc\x90"
dicc["1"] = b"\xef\xbc\x91"
dicc["2"] = b"\xef\xbc\x92"
dicc["3"] = b"\xef\xbc\x93"
dicc["4"] = b"\xef\xbc\x94"
dicc["5"] = b"\xef\xbc\x95"
dicc["6"] = b"\xef\xbc\x96"
dicc["7"] = b"\xef\xbc\x97"
dicc["8"] = b"\xef\xbc\x98"
dicc["9"] = b"\xef\xbc\x99"
dicc[":"] = b"\xef\xbc\x9a"
dicc[";"] = b"\xef\xbc\x9b"
dicc["<"] = b"\xef\xbc\x9c"
dicc["="] = b"\xef\xbc\x9d"
dicc[">"] = b"\xef\xbc\x9e"
dicc["?"] = b"\xef\xbc\x9f"
dicc["@"] = b"\xef\xbc\xa0"
dicc["A"] = b"\xef\xbc\xa1"
dicc["B"] = b"\xef\xbc\xa2"
dicc["C"] = b"\xef\xbc\xa3"
dicc["D"] = b"\xef\xbc\xa4"
dicc["E"] = b"\xef\xbc\xa5"
dicc["F"] = b"\xef\xbc\xa6"
dicc["G"] = b"\xef\xbc\xa7"
dicc["H"] = b"\xef\xbc\xa8"
dicc["I"] = b"\xef\xbc\xa9"
dicc["J"] = b"\xef\xbc\xaa"
dicc["K"] = b"\xef\xbc\xab"
dicc["L"] = b"\xef\xbc\xac"
dicc["M"] = b"\xef\xbc\xad"
dicc["N"] = b"\xef\xbc\xae"
dicc["O"] = b"\xef\xbc\xaf"
dicc["P"] = b"\xef\xbc\xb0"
dicc["Q"] = b"\xef\xbc\xb1"
dicc["R"] = b"\xef\xbc\xb2"
dicc["S"] = b"\xef\xbc\xb3"
dicc["T"] = b"\xef\xbc\xb4"
dicc["U"] = b"\xef\xbc\xb5"
dicc["V"] = b"\xef\xbc\xb6"
dicc["W"] = b"\xef\xbc\xb7"
dicc["X"] = b"\xef\xbc\xb8"
dicc["Y"] = b"\xef\xbc\xb9"
dicc["Z"] = b"\xef\xbc\xba"
dicc["["] = b"\xef\xbc\xbb"
dicc["\\"] = b"\xef\xbf\xa5"
dicc["]"] = b"\xef\xbc\xbd"
dicc["^"] = b"\xef\xbc\xbe"
dicc["_"] = b"\xef\xbc\xbf"
dicc["`"] = b"\xe2\x80\x98"
dicc["a"] = b"\xef\xbd\x81"
dicc["b"] = b"\xef\xbd\x82"
dicc["c"] = b"\xef\xbd\x83"
dicc["d"] = b"\xef\xbd\x84"
dicc["e"] = b"\xef\xbd\x85"
dicc["f"] = b"\xef\xbd\x86"
dicc["g"] = b"\xef\xbd\x87"
dicc["h"] = b"\xef\xbd\x88"
dicc["i"] = b"\xef\xbd\x89"
dicc["j"] = b"\xef\xbd\x8a"
dicc["k"] = b"\xef\xbd\x8b"
dicc["l"] = b"\xef\xbd\x8c"
dicc["m"] = b"\xef\xbd\x8d"
dicc["n"] = b"\xef\xbd\x8e"
dicc["o"] = b"\xef\xbd\x8f"
dicc["p"] = b"\xef\xbd\x90"
dicc["q"] = b"\xef\xbd\x91"
dicc["r"] = b"\xef\xbd\x92"
dicc["s"] = b"\xef\xbd\x93"
dicc["t"] = b"\xef\xbd\x94"
dicc["u"] = b"\xef\xbd\x95"
dicc["v"] = b"\xef\xbd\x96"
dicc["w"] = b"\xef\xbd\x97"
dicc["x"] = b"\xef\xbd\x98"
dicc["y"] = b"\xef\xbd\x99"
dicc["z"] = b"\xef\xbd\x9a"
dicc["{"] = b"\xef\xbd\x9b"
dicc["|"] = b"\xef\xbd\x9c"
dicc["}"] = b"\xef\xbd\x9d"
dicc["~"] = b"\xe3\x80\x9c"

list_char = [dicc[i] for i in dicc]

# nice 82c23a8f2db5dbf4f6b261d6771cfa864875764e 1.tx
# nice 499b8aa3e573283f727ff4ff6d2f4ef81d2ea47e ary_
# nice 8660b7f81fc71913b4bf6eda58be36d38bc7b4e1 n di
# nice 4f4022c7fd9f377b9b42f3ec9de094f889a44d10 is o
# nice 456ab31b89477fd56389d4d6034ff4db0f2d95ca lag 
# nice 11dd0da5820d8c29f9e4ee6901eb2afacc549a5b in.f
# nice 737e5327ac401930016e65ec37e90c63d028ddb3  aga
# nice d80a6b7f68e16fd4a92efa2e3b042afc8c7aeac9  try

pieces = ["bbceaa299cee49bea99676e780397f83eac70fc0",
    "dc4f42c705572b74de694cfc5edf8d934e70e16a",
    "33130af5e0031c173316e658ef2b692f4d558d90",
    "9ca50e285da73a771c5ce2067f48da49cd021256",
    "29a7375bc6be2630d0618d329106f35fde55fe17",
    "f6d1f555784bf783f7df0248fce453f0b80cbb8e",
    "0691c5b4b55901e4e0a3f4312cb6fd8e8630f8e7",
    "b2241dfcb2b7942b820ff636cf9730af3896d1ad",
    "97e249428e4cd7e91c57758546d8fa6e49ba2e78",
    "bff5d16ca7bf4de5485c89d2dc5482e4d50744b8",
    "0e1d283904a8695c350a4a4e5f049c95f5df4097",
    "a154ef701791363dac47db39364c08cc9857a9e0",
    "141566e96a5ae272cfe4bf36c0d6e9a935f54821",
    "2c8d2c6c77395f972a20a40b262395f51bf84dd9",
    "673c1864773d42f39d7ecabe4ce6d2065f79a48a",
    "c849fda4f85c60014a32ad7c986ea7d418836d35",
    "9cbec1cd7b635e4daf683a4741189fc7247d5e2a",
    "20c4276fe0652b2d133913d6a3e5b48970f7ca77",
    "d439582d6474553e105fed3c60a1a2cb98c9d6e8",
    "84f0cca287971a1e48be67386a68f42f955e6be9",
    "ff6b7ae4aa073c420f4f3c649a53107385105977",
    "fb8c1e62abbe4a0524ac5e050c617a712df9d549",
    "32fe790695ef906b39cd1f0f95d3f06348eb6ea3",
    "14ad1bfe6ff28e9d6f0029ba48418a60c009d6f9",
    "a0bd5b0eece1eadfacfd15e151c919c24d87d652",
    "6c594e728bd597af7715714110f46d9813bcb49b",
    "80322a17756b22c75f8281cd41f41d5be256364b",
    "a4e3be221146d6a9a06579a95af859b8d6f07a17",
    "c6e76fe144b2504effc73dfd814b82992074b750",
    "f3f46bcd1bf8c6b93a93482c1dfbc266eaf65716",
    "b53f0fd11d33ebec50064781135799d72d3d4ea2",
    "5678e0f829a7667e31ad20fa14b092dcb3b8992b",
    "9d4a0905daaa27073dcabe66adc59051a08240f0",
    "7b5feb45a9c246100091c32d660940fbfbbf75e3",
    "8dc0e8a48d516f33a8f8ac0ac20d8ae21212bd67",
    "27a868f2dc4ba35e5451942b0c267c27ef888742",
    "8604c899d98a3dbbd668f801222ba7a939c6ae5b",
    "dfa27014e5cc7c7c68422071de4c36570315c7e6",
    "8eee64e9ecdc7c8928b2e3a8c0d17e246136268d",
    "3836ced657531d5294f15f0f5b78bbb4e5f8d6ba",
    "cbc2f8710b4b394c594f7c5df8cba2317f086600",
    "1d1f764a6eee2b072e5ee5f4f2d7973950afe073",
    "08caae9561ae6679e7b0d84f197c1d03805cd258",
    "fd3ecd1ced67ca3b1f1c444a21ce5f2f25e37337",
    "9d2b06f0bbb0f46f0bdd20e635c2e0d187b1b472",
    "f3ddbe3beceadb6410edafac69b83888c6e2215e",
    "d6c1cca070b78012e24c3b7d7d1513260f883488",
    "23aae4f4d58bbcc60125d6eb47bdbb8ca5deadf3",
    "29cb381a5c22e38bccee25c6e906c2a619ce0b4b",
    "f7e706e807d4bd198cad8cd327dd1b36824a8e18",
    "3ec1f3cd7ff48d6ea54cf7133023dd8a9691570e",
    "1679aa928738caec2de0e76c35c3df52b3097b86",
    "5c1d88d66e8491664d6ea355a46cb931328f8438",
    "8ae550c710276a11c9306b7a3145431a87f84914",
    "919e0ecf24e86e91e5b0bac0abaebc86da27506a",
    "898078931c0fea481e7c753b5bb2047595711e96",
    "299e1b722e3ccb2d1c1a285603490f99c340f02e",
    "e71af8e46be5d7a6a86a126765624bd7709d6830",
    "59f339853af5bdec4a833226861eb0e7fed74c45",
    "3618f7c2972a5844cd9aeabb463691e37c601ee0",
    "083a4606615582a72e0297d2d2c1db7247f94370",
    "f506e2bd94db61d105cf6a923b9a019721c2f34c",
    "1f5656037d6efe74cfea98698b06a404345fcfaf",
    "97338191b4516f6dc90e9f1612942d8e8c8766e3",
    "38826752201933963bfe1360bb86755a81391cf8",
    "0e1fb6224960c205ba0bf3ffdd8e9cb64f9d1786",
    "cb66acb10d8599e24de135c86820786db7053869",
    "9e1f08d5e3b7d49af38f17e6d502143f1c7e5027",
    "456ab31b89477fd56389d4d6034ff4db0f2d95ca",
    "daae9870cd8e4ffc0e13f6dbdb28e87cd5c187ef",
    "4129a08141de9367f0f08558481fec7e63f5106b",
    "fed89c70c830b0803297159da39b5c468fe6ebe3",
    "d80a6b7f68e16fd4a92efa2e3b042afc8c7aeac9",
    "737e5327ac401930016e65ec37e90c63d028ddb3",
    "11dd0da5820d8c29f9e4ee6901eb2afacc549a5b",
    "456ab31b89477fd56389d4d6034ff4db0f2d95ca",
    "4f4022c7fd9f377b9b42f3ec9de094f889a44d10",
    "8660b7f81fc71913b4bf6eda58be36d38bc7b4e1",
    "499b8aa3e573283f727ff4ff6d2f4ef81d2ea47e",
    "82c23a8f2db5dbf4f6b261d6771cfa864875764e"]

msg = ""
for known in pieces[32:]:
    for i in product(list_char, repeat=4):
        tmp = b''.join(i)
        if(hashlib.sha1(tmp).hexdigest() == known):
            res = get_dict(i)
            msg += res
            break
    print(msg)

```

<figure><img src="https://lh7-us.googleusercontent.com/YCleq7508SIUC1wT84fkXS-Mu6fuyu8w362-7tmDa5NmWcGIuGO47S61N7OoDEB7xDlEjgbY6kUkB4tMpYBLRHkDxNldBQnZEaJmf4jpGNoUpTzKxUbk2B5q92vPbvcnuChS8RsYOx7Lxj_2E8Za8wo" alt=""><figcaption></figcaption></figure>

Ternyata flagnya menggunakan karakter jepang, jadi konversi ulang.

```python
a = 'COMPFEST15{b3ep_b0p__BEEP_boP_cl4sSiC_t0RRent_d94ca75f62}'
dicc = {}
dicc[" "] = b"\xe3\x80\x80"
dicc["!"] = b"\xef\xbc\x81"
dicc['"'] = b"\xe2\x80\x9d"
dicc["#"] = b"\xef\xbc\x83"
dicc["$"] = b"\xef\xbc\x84"
dicc["%"] = b"\xef\xbc\x85"
dicc["&"] = b"\xef\xbc\x86"
dicc["'"] = b"\xe2\x80\x99"
dicc["("] = b"\xef\xbc\x88"
dicc[")"] = b"\xef\xbc\x89"
dicc["*"] = b"\xef\xbc\x8a"
dicc["+"] = b"\xef\xbc\x8b"
dicc[","] = b"\xef\xbc\x8c"
dicc["-"] = b"\xe2\x88\x92"
dicc["."] = b"\xef\xbc\x8e"
dicc["/"] = b"\xef\xbc\x8f"
dicc["0"] = b"\xef\xbc\x90"
dicc["1"] = b"\xef\xbc\x91"
dicc["2"] = b"\xef\xbc\x92"
dicc["3"] = b"\xef\xbc\x93"
dicc["4"] = b"\xef\xbc\x94"
dicc["5"] = b"\xef\xbc\x95"
dicc["6"] = b"\xef\xbc\x96"
dicc["7"] = b"\xef\xbc\x97"
dicc["8"] = b"\xef\xbc\x98"
dicc["9"] = b"\xef\xbc\x99"
dicc[":"] = b"\xef\xbc\x9a"
dicc[";"] = b"\xef\xbc\x9b"
dicc["<"] = b"\xef\xbc\x9c"
dicc["="] = b"\xef\xbc\x9d"
dicc[">"] = b"\xef\xbc\x9e"
dicc["?"] = b"\xef\xbc\x9f"
dicc["@"] = b"\xef\xbc\xa0"
dicc["A"] = b"\xef\xbc\xa1"
dicc["B"] = b"\xef\xbc\xa2"
dicc["C"] = b"\xef\xbc\xa3"
dicc["D"] = b"\xef\xbc\xa4"
dicc["E"] = b"\xef\xbc\xa5"
dicc["F"] = b"\xef\xbc\xa6"
dicc["G"] = b"\xef\xbc\xa7"
dicc["H"] = b"\xef\xbc\xa8"
dicc["I"] = b"\xef\xbc\xa9"
dicc["J"] = b"\xef\xbc\xaa"
dicc["K"] = b"\xef\xbc\xab"
dicc["L"] = b"\xef\xbc\xac"
dicc["M"] = b"\xef\xbc\xad"
dicc["N"] = b"\xef\xbc\xae"
dicc["O"] = b"\xef\xbc\xaf"
dicc["P"] = b"\xef\xbc\xb0"
dicc["Q"] = b"\xef\xbc\xb1"
dicc["R"] = b"\xef\xbc\xb2"
dicc["S"] = b"\xef\xbc\xb3"
dicc["T"] = b"\xef\xbc\xb4"
dicc["U"] = b"\xef\xbc\xb5"
dicc["V"] = b"\xef\xbc\xb6"
dicc["W"] = b"\xef\xbc\xb7"
dicc["X"] = b"\xef\xbc\xb8"
dicc["Y"] = b"\xef\xbc\xb9"
dicc["Z"] = b"\xef\xbc\xba"
dicc["["] = b"\xef\xbc\xbb"
dicc["\\"] = b"\xef\xbf\xa5"
dicc["]"] = b"\xef\xbc\xbd"
dicc["^"] = b"\xef\xbc\xbe"
dicc["_"] = b"\xef\xbc\xbf"
dicc["`"] = b"\xe2\x80\x98"
dicc["a"] = b"\xef\xbd\x81"
dicc["b"] = b"\xef\xbd\x82"
dicc["c"] = b"\xef\xbd\x83"
dicc["d"] = b"\xef\xbd\x84"
dicc["e"] = b"\xef\xbd\x85"
dicc["f"] = b"\xef\xbd\x86"
dicc["g"] = b"\xef\xbd\x87"
dicc["h"] = b"\xef\xbd\x88"
dicc["i"] = b"\xef\xbd\x89"
dicc["j"] = b"\xef\xbd\x8a"
dicc["k"] = b"\xef\xbd\x8b"
dicc["l"] = b"\xef\xbd\x8c"
dicc["m"] = b"\xef\xbd\x8d"
dicc["n"] = b"\xef\xbd\x8e"
dicc["o"] = b"\xef\xbd\x8f"
dicc["p"] = b"\xef\xbd\x90"
dicc["q"] = b"\xef\xbd\x91"
dicc["r"] = b"\xef\xbd\x92"
dicc["s"] = b"\xef\xbd\x93"
dicc["t"] = b"\xef\xbd\x94"
dicc["u"] = b"\xef\xbd\x95"
dicc["v"] = b"\xef\xbd\x96"
dicc["w"] = b"\xef\xbd\x97"
dicc["x"] = b"\xef\xbd\x98"
dicc["y"] = b"\xef\xbd\x99"
dicc["z"] = b"\xef\xbd\x9a"
dicc["{"] = b"\xef\xbd\x9b"
dicc["|"] = b"\xef\xbd\x9c"
dicc["}"] = b"\xef\xbd\x9d"
dicc["~"] = b"\xe3\x80\x9c"
flag = ""
zz = ""
for i in a:
	zz += dicc[i].decode('utf-8')
print(zz)

```

<figure><img src="https://lh7-us.googleusercontent.com/kF9HqdFkYEmVKk3CuwIc0Ek_7U0AOtgCHGhros9gtA7t5z48wMSbeWVdF71KBRxb-7W1FTJtAW_gjG54lWor4nlL2p_O1U15mKjJKRcdsQKjiN0h0A2pgwM9GIHC21ZQuj4qlosd0lul4B2WkBYr_jY" alt=""><figcaption></figcaption></figure>

Flag : ＣＯＭＰＦＥＳＴ１５｛ｂ３ｅｐ＿ｂ０ｐ＿＿ＢＥＥＰ＿ｂｏＰ＿ｃｌ４ｓＳｉＣ＿ｔ０ＲＲｅｎｔ＿ｄ９４ｃａ７５ｆ６２｝
