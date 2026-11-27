# Misc

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>Lost Some Magic (92 pts)</td><td><a href="#lost-some-magic-92-pts">Here</a></td></tr></tbody></table>

## Lost Some Magic (92 pts)

### Description

Our SOC analysts saw some strange DNS traffic. Wanted you to figure out what was exfiltated , can you check it and sum it up ?

### Solution

Given file with unknown type, lets check the contents.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FA3BmSBYkuslezwAN40Aa%2Fimage.png?alt=media&amp;token=6271a3c8-2031-4ad1-aecd-eb78fcdf7bb4" alt=""><figcaption></figcaption></figure>

There is no extension with header signature 4200. Based on the description it should be kind of compression so lets try to check another compressed file.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FCLazLXLnRWDA5d2uv6Bw%2Fimage.png?alt=media&amp;token=55558c03-5804-4b3f-bd70-e5df71487ceb" alt=""><figcaption></figcaption></figure>

bz2 header looks similar with 2 bytes value nulled. So rewrite those null bytes to 5a68 and do bz2 decompress.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FRFIbI90iLx6NgV1EkwSf%2Fimage.png?alt=media&amp;token=64cc1dc6-3cd8-461f-a28c-679418a4e950" alt=""><figcaption></figcaption></figure>

Okay, lets check the next part.&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FqiX9XnxTgw3eYYG96ok9%2Fimage.png?alt=media&amp;token=a25c9b2f-2b91-454d-89d8-6870c4cb83e5" alt=""><figcaption></figcaption></figure>

Looks like it similar with tar archive, tar doesn't compress the value. So just take directly the value from xxd.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FdWIWzMZ1b5lfhkQFwN06%2Fimage.png?alt=media&amp;token=1ad9e4c9-8fe6-42f5-a88b-643d1a476db4" alt=""><figcaption></figcaption></figure>

```python
f = open("data2.tar", "rb").read()
data = bytes.fromhex("8b08086e37c4650003666c6167")
index = f.index(data)
val = f[index:index+73]

g = open("data3", "wb")
g.write(val)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FZaNiqp4yDRfxM1V2BbHQ%2Fimage.png?alt=media&amp;token=7c51c53f-b820-483a-949e-bf5a99d2b8b2" alt=""><figcaption></figcaption></figure>

Looks like data3 is gz archive with removed header and trailer. Lets add header and trailer and try to decompress it.

```python
f = open("data2.tar", "rb").read()
data = bytes.fromhex("8b08086e37c4650003666c6167")
index = f.index(data)
val = f[index:index+73]
new_val = b"\x1f" + val + b"\x00" * 3

g = open("data3.gz", "wb")
g.write(new_val)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FSqJxWAXxkZsVLiDFkHiY%2Fimage.png?alt=media&amp;token=152cfc76-fef4-4ede-a9b9-40f9b4544d44" alt=""><figcaption></figcaption></figure>

Flag: swampCTF{C0113ct1ng\_th3\_mag1c\_number5}
