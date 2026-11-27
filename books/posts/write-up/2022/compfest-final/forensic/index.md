# Forensic

<!-- challenge-index: d2330ae1ca084d52 -->

| Challenge | Topic |
| --- | --- |
| [Nintendo (484 pts)](#nintendo-484-pts) | Animated PNG, Pixel Steganography |

<!-- /challenge-index -->

## Nintendo (484 pts)

### Description

\-

### Solution

Diberikan image dan script disini kami lakukan analisis terhadap script tersebut. Intinya dari base image (nintendo.jpg) dibuat beberapa file dan masing-masing file di ubah nilai pixel i,i dimana i adalah index. Nilai pixel i diubah dengan format pixel\[0]\*flag dan hasilnya disimpan pada pixel dengan struktur (pixel\[1],pixel\[0],0) . Kemudian semua gambar digabung menjadi apng dengan library apng. Untuk extract apng menjadi file kami gunakan referensi berikut <https://github.com/tothi/ctfs/blob/master/asis-finals-ctf-2016/p1ng/README.md> namun kami ubah beberapa kode hingga menjadi berikut

```python
import apng

from struct import pack, unpack

im = apng.APNG.open("nintendo.apng")
i = 0
for png, control in im.frames:
    print(png)
    w, h = unpack(">I", png.chunks[0][1][8:12])[0], unpack(">I", png.chunks[0][1][12:16])[0]
    png.chunks[0] = ('IHDR', apng.make_chunk("IHDR", pack(">I", w) + pack(">I", h) + b'\x08\x06\x00\x00\x00'))
    png.save("%02d.png" % i)
    i += 1
```

Sebelumnya disini file nintendo.apng juga diubah headernya namun bisa kita kembalikan dengan menyesuaikan dengan header png asli

<figure><img src="https://lh7-us.googleusercontent.com/zkY2_fF0K85JrTOikLQJIsjk2yR1PTx0K_SAuoHTCh43sqdyfxqD9syuyII7Cbo7NaOeOHHTuWD3fqU9L83Duq7UGvcHOhfd0u8KDxmjzWgqy4XkXAuqiEKO0SjvKEUq7OzO8e-bdy6SdRLRHBR8cuI" alt=""><figcaption></figcaption></figure>

Selanjutnya setelah setiap image terextract(dimana setiap image terdapat flag) kita bisa langsung lakukan extract value flag dari setiap image. Berikut script yang kami gunakan

```python
from PIL import Image
from Crypto.Util.number import long_to_bytes, bytes_to_long

length = 19
my_png = Image.open("nintendo.png")
pixels = my_png.load()

filename = "{}.png"
flag = ""
for i in range(length):
	fn = str(i).rjust(2,"0")
	tmp = filename.format(fn)
	extracted_png = Image.open(tmp)
	pixel1 = list(extracted_png.getpixel((i, i)))
	pixel2 = list(my_png.getpixel((i, i)))
	tmp2 = bytes([pixel1[1],pixel1[0]])
	value = bytes_to_long(tmp2)
	res = value//pixel2[0]
	flag += chr(res)
print(flag)
```

<figure><img src="https://lh7-us.googleusercontent.com/d5UeM9uJkrhGbL4fOc1gkfG9qNFHqfsunlTYND5OH4eJ7_0gTeyJV1ScyUooOrIeRH3F6pV7Hs2UwjYFrQdmxlRBdEiKCnOj5lbuP0MOdwyQbK8rqjhbat94SwLLCHetjw00Zm3nCWfA2RXG0kcvKZA" alt=""><figcaption></figcaption></figure>

Flag : COMPFEST14{1ts\_aN\_4n1Mat3d\_PNG}
