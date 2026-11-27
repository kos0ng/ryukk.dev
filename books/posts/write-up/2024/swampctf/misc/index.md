# Misc

<!-- challenge-index: 94ffd36ae31b1044 -->

| Challenge | Topic |
| --- | --- |
| [Lost Some Magic (92 pts)](#lost-some-magic-92-pts) | File Signatures, Nested Compression |

<!-- /challenge-index -->

## Lost Some Magic (92 pts)

### Description

Our SOC analysts saw some strange DNS traffic. Wanted you to figure out what was exfiltated , can you check it and sum it up ?

### Solution

Given file with unknown type, lets check the contents.

<figure><img src="images/6d5fb4970c6dab6876aa2c97.png" alt=""><figcaption></figcaption></figure>

There is no extension with header signature 4200. Based on the description it should be kind of compression so lets try to check another compressed file.

<figure><img src="images/acd4ebd98ebe9cacf4625705.png" alt=""><figcaption></figcaption></figure>

bz2 header looks similar with 2 bytes value nulled. So rewrite those null bytes to 5a68 and do bz2 decompress.

<figure><img src="images/d0de7c773669c2177f81757b.png" alt=""><figcaption></figcaption></figure>

Okay, lets check the next part.&#x20;

<figure><img src="images/af5ae5637af29330b4a6fde2.png" alt=""><figcaption></figcaption></figure>

Looks like it similar with tar archive, tar doesn't compress the value. So just take directly the value from xxd.

<figure><img src="images/00a80aecb1fbcd7289e2454e.png" alt=""><figcaption></figcaption></figure>

```python
f = open("data2.tar", "rb").read()
data = bytes.fromhex("8b08086e37c4650003666c6167")
index = f.index(data)
val = f[index:index+73]

g = open("data3", "wb")
g.write(val)
```

<figure><img src="images/ae848fa8cb3cb4742e431bdb.png" alt=""><figcaption></figcaption></figure>

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

<figure><img src="images/13584350c00176d94acd6097.png" alt=""><figcaption></figcaption></figure>

Flag: swampCTF{C0113ct1ng\_th3\_mag1c\_number5}
