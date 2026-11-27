# Reverse Engineering

<!-- challenge-index: 46cb7033cf210053 -->

| Challenge | Topic |
| --- | --- |
| [What am I? (80 pts)](#what-am-i-80-pts) | PE Resources, DLL Analysis |
| [Can you break the armor? (180 pts)](/notes/research/2024/reverse-engineering-application-protected-with-pyarmor/) | PyArmor, Python Bytecode |
| [Light up the Server (320 pts)](#light-up-the-server-320-pts) | Lighttpd, Regular Expressions |

<!-- /challenge-index -->

## What am I? (80 pts)

### Description

\-

### Solution

Given DLL file, decompiling the file we don't find any interesting part. So the next step we do is checking the executable file using CFF Explorer. Take a look on resource editor we found flag in image format

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FVvc0L8W30KMimE9DLVRY%2Fimage.png?alt=media&amp;token=755af5b3-459f-4da3-bfb6-61c30c2ff265" alt=""><figcaption></figcaption></figure>

Flag : BHFlagY{c3wl\_r3s0rce\_f1nding}

## Light up the Server (320 pts)

### Description

\-

### Solution

Given elf 64 bit file

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FamnF5Ano4sc9OH2L73bf%2Fimage.png?alt=media&amp;token=3e444f13-2ff9-465f-8558-31e27857df27" alt=""><figcaption></figcaption></figure>

Opening it using IDA, take a look on main function and strings window

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FGinAh3NpwqAoZEZeNlYL%2Fimage.png?alt=media&amp;token=4ea2acf5-9a10-4d06-af7c-7f3f060fe6b5" alt=""><figcaption><p>main function</p></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FFawowiiIhr9K3BPEG6Oe%2Fimage.png?alt=media&amp;token=1b78bd79-69d6-465f-9f95-492c762948e7" alt=""><figcaption><p>strings window</p></figcaption></figure>

In this case i tried to search string "-f filename of the config-file" on github and found this

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fmk67rubngxXotOmElN5C%2Fimage.png?alt=media&amp;token=7b3ba555-4857-4347-868e-09f1e084cbb9" alt=""><figcaption></figcaption></figure>

Now, we know that the executable maybe lighttpd since it contains some string that available on lighttp repository. The given executable contains many function that can be function available on original lighttpd. So my approach is to find function that is not available on original lighttpd. First step i do is finding the correct version of lighttpd used in the challenge.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FBbDNO1SiNyRYP5w5mkbt%2Fimage.png?alt=media&amp;token=73647189-31f4-429c-96f7-28c93f419f14" alt=""><figcaption></figcaption></figure>

From the string window we found there is "1.4.72-devel" before "\nusage" and based on repository we found that string should be the version of lighttp used.&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fok0C3AShY9XlW2DPB5tc%2Fimage.png?alt=media&amp;token=b12f0386-abb3-4a15-a53a-8b1c817af0b8" alt=""><figcaption></figcaption></figure>

Now clone the specific version from lighttpd repository and build the binary.

```bash
git clone -b lighttpd-1.4.72 https://github.com/lighttpd/lighttpd1.4.git
cd lighttpd1.4
cmake .
make
file build/lighttpd
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FQ7cJLwnoxQwy5B5lHxDi%2Fimage.png?alt=media&amp;token=6574fbb5-6064-42f3-92eb-1a0bc9a29d27" alt=""><figcaption></figcaption></figure>

Now we have lighttpd original binary, next we need to findout how to compare two binary in low level. Searching on google i found this plugin on ida <http://diaphora.re/>. Download the plugin then open diaphora.py through script file. First, i open lighttpd original file then use diaphora to dump IDA database in SQLite format with option below.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F8g7WZv54OypgfvuXM5pE%2Fimage.png?alt=media&amp;token=66301db2-aa3e-4872-8147-41a95a0210a1" alt=""><figcaption><p>lighttpd binary</p></figcaption></figure>

Next open challenge file then load diaphora again. Now put lighttpd\_new\.sqlite to SQLite database to diff against form then click ok.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FJ0Xzdcq42dYlmUsY012v%2Fimage.png?alt=media&amp;token=7304a70e-ee5b-4ac9-8e1c-550a1f1fa37e" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FOWu1DsT9yGIfkvuaK9vY%2Fimage.png?alt=media&amp;token=901807c6-654f-437d-8863-ab6d6f5f804b" alt=""><figcaption></figcaption></figure>

There are some tab opened after diaphora analysis done. Since challenge binary is on first position, so open primary tab then check one by one the function.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FTcAKDhSU6xe472qBQ4jh%2Fimage.png?alt=media&amp;token=cf956989-5f5b-484b-b779-8eb92bee716e" alt=""><figcaption></figcaption></figure>

Latest stripped function before libc function is suspicious.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fu5dU8Jc1NS0gnLUA8jYz%2Fimage.png?alt=media&amp;token=2b4d2a74-b219-4947-a11e-e8134099a0f3" alt=""><figcaption></figcaption></figure>

```regex
^\\([a-z]\\?[^a-e,g-z]\\)la[g]{\\(h\\)0\\(s\\)t_\\2\\(e\\)4d\\4\\(r\\([_]\\?[^a-z]\\)\\)\\(!\\)n\\(\\(j\\(3\\)\\)cti0\\)n\\(_\\)1s\\6\\{1\\}5up3\\5c3wl}$
```

We can see that the function compile the regex and match a variable with the pattern. Analyzing a few first part of the pattern we found that it match with flag format. I use this online regex to debug it <https://regex101.com/> . We need to remove some backslash to make the pattern valid

```regex
^([a-z]?[^a-e,g-z])la[g]{
```

* \[a-z]? a until z (optional), so can be blank
* \[^a-e,g-z], not a-e or g-z, so it string "f"
* la, string "la"
* \[g], string "g"

So, we just need to continue debugging the next pattern

```regex
(h)0(s)t_\2(e)4d\4(r([_]?[^a-z]))(!)n((j(3))cti0)n(_)1s\6{1}5up3\5c3wl}$

create group based on round brackets ()
+ group 1, 0-1	  f
+ group 2, 5-6	  h 
+ group 3, 7-8	  s
+ group 4, 11-12  e
+ group 5, 15-17  r_
+ group 6, 16-17  _
+ group 7, 17-18  !
+ group 8, 19-25  j3cti0
+ group 9, 19-21  j3
+ group 10, 20-21 3
+ group 11, 26-27 _

- (h) == h
- 0 == 0
- (s) == s
- t == t
- _ == _
- \2 == h, match second group
- (e) == e
- 4d == 4d
- \4 == e, match fourth group
- (r([_]?[^a-z])) == r_ , r then underscore with optional a-z after that
- (!) == !
- n == n
- ((j(3))cti0) == j3cti0
- n == n
- (_) == _
- 1s == 1s
- \6{1} == _, match sixth group
- 5up3 == 5up3
- \5 == r_, match fifth rgroup
- c3wl}$ == c3wl}
```

Flag : flag{h0st\_he4der\_!nj3cti0n\_1s\_5up3r\_c3wl}
