# Forensic

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>NotFS (180 pts)</td><td><a href="#notfs-180-pts">Here</a></td></tr></tbody></table>

## NotFS (180 pts)

### Description

Is this a FileSystem? Identify the file and make the necessary adjustments to solve the challenge. Note: The challenge file size is 16GB after extraction.

### Solution

During the competition, my friend found an interesting file without header using r-studio

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FXvjfOmEVt7u75lOLDFiI%2Fimage.png?alt=media&amp;token=52e10526-591d-4c61-8a6e-307840577c41" alt=""><figcaption></figcaption></figure>

Because it is a free edition of r-studio we cant dump the file, so looking at some hex value i tried to search the file. First, i use autopsy to load Chall.img file and export the unallocated space partition. Because if we search on 16gb files it will take a long time. Because i know some hex value and know what should the end of PNG file we can just parse the png and get the flag.

```python
f = open("Unalloc_4_20054016_544342528", "rb").read()
index = f.index(bytes.fromhex("A350A89C73CE3957"))
leak = f[index-104:index+20000]
last = f[index:].index(b"IEND")
nice = f[index-100:index+last+8]

nice = b"\x89\x50\x4e\x47" + nice
out = open("flag.png", "wb")
out.write(nice)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FbBEuaetraaN47QHXBZ4C%2Fflag.png?alt=media&amp;token=6d35ed01-d7d6-4a94-8ddd-af65421344af" alt=""><figcaption></figcaption></figure>

Flag: BHFlagY{8bd8dc3ea7636c5fb8aeb}
