# Cryptography

<!-- challenge-index: 7ee43f52371060ab -->

| Challenge | Topic |
| --- | --- |
| [Shuvvler (300 pts)](#shuvvler-300-pts) | Substitution Cipher, Key Cycles |

<!-- /challenge-index -->

## Shuvvler (300 pts)

### Description

\-

### Solution

Diberikan source code sebagai berikut

```python
#!/usr/bin/env python3
import random, string, sys

chars = string.ascii_lowercase + string.ascii_uppercase + string.digits + string.punctuation

def func1(s, key):
	r = ''
	for i in range(len(s)):
    	if s[i] in chars:
        	if   s[i] in string.ascii_lowercase: z = string.ascii_lowercase
        	elif s[i] in string.ascii_uppercase: z = string.ascii_uppercase
        	elif s[i] in string.digits:      	z = string.digits
        	else:                            	z = string.punctuation
        	r += z[(z.index(s[i]) + key) % len(z)]
    	else:
        	r += s[i]
	return r

def func2(s):
	return s.translate(s.maketrans(chars, chars[13:] + chars[:13]))

def encrypt(s):
	key = random.getrandbits(128)
	r = s
	for _ in range(8):
    	r = func1(r, key)
    	r = func2(r)
	return r

def main():
	fns = sys.argv[1:]
	for fn in fns:
    	try:
        	x = open(fn, 'r').read()
        	f = open(fn + '.enc', 'w')
        	f.write(encrypt(x))
        	f.close()
    	except:
        	continue

if __name__ == '__main__':
	if len(sys.argv) < 2:
    	print(f'Usage: {sys.argv[0]} <file>')
    	print(f'Example: {sys.argv[0]} flag.html')
    	sys.exit()
	main()

```

Terlihat terdapat 2 fungsi yang dijalankan pada fungsi enkripsi , fungsi pertama melakukan penambahan nilai index pada charset X , fungsi kedua melakukan translate. Karena key cukup besar nilainya yaitu 128 bit , maka bruteforce 128 bit key bukan solusinya. Kalau kita lihat berdasarkan nilai modulus ( panjang charset - 26 26 10 32) maka kita dapat memetakan nilai keynya. Hal yang perlu dilakukan adalah melakukan bruteforce kemungkinan pemetaan key dan berhenti jika nilai pemetaan sudah pernah digenerate sebelumnya ( karena akan berulang nantinya ). Selanjutnya tinggal decrypt saja , ubah + jadi - . Fungsi kedua adalah translasi , semacam membuat dictionary lalu melakukan translate. Jadi tinggal dibalik saja nilai chars dan chars\[13:] + chars\[:13]. Berikut solver yang kami gunakan

```python
import string

def rev2(s):
	return s.translate(s.maketrans(chars[13:] + chars[:13],chars))

def rev1(s, keys):
	r = ''
	for i in range(len(s)):
    	if s[i] in chars:
        	if   s[i] in string.ascii_lowercase:
       		 z = string.ascii_lowercase
       		 key = keys[0]
        	elif s[i] in string.ascii_uppercase:
       		 z = string.ascii_uppercase
       		 key = keys[1]
        	elif s[i] in string.digits:
       		 z = string.digits
       		 key = keys[2]
        	else:
       		 z = string.punctuation
       		 key = keys[3]
        	r += z[(z.index(s[i]) - key) % len(z)]
    	else:
        	r += s[i]
	return r

def dec(s,key):
    r = s
    for _ in range(8):
   	 r = rev2(r)
   	 r = rev1(r, key)
    return r
   	 
a = string.ascii_lowercase
b = string.ascii_uppercase
c = string.digits
d = string.punctuation
keypair = []
for key in range(0xffff):
	z = [key%len(a),key%len(b),key%len(c),key%len(d)]
	if(z in keypair):
    	break
	else:
    	keypair.append(z)

chars = string.ascii_lowercase + string.ascii_uppercase + string.digits + string.punctuation
f = open("flag.html.enc","r").read()
g = open("res","w")
for key in keypair:
	tmp = dec(f,key)
	if(tmp[:6]=="<html>"):
    	g.write(tmp)
    	g.write("\n")
```

Didapatkan file html sebagai berikut

```html
<html>
  <div class="stage">
	<div class="layer"></div>
	<div class="layer"></div>
	<div class="layer"></div>
	<div class="layer"></div>
	<div class="layer"></div>
	<div class="layer"></div>
	<div class="layer"></div>
	<div class="layer"></div>
	<div class="layer"></div>
	<div class="layer"></div>
	<div class="layer"></div>
	<div class="layer"></div>
	<div class="layer"></div>
	<div class="layer"></div>
	<div class="layer"></div>
	<div class="layer"></div>
	<div class="layer"></div>
	<div class="layer"></div>
	<div class="layer"></div>
	<div class="layer"></div>
  </div>
 
  <!-- Credit to https://codepen.io/noahblon/pen/CsxfH -->
 
  <style>
	body {
  	min-height: 450px;
  	height: 100vh;
  	margin: 0;
  	background: radial-gradient(circle, #0077ea, #1f4f96, #1b2949, #000);
	}
    
	.stage {
  	height: 300px;
  	width: 500px;
  	margin: auto;
  	position: absolute;
  	top: 0;
  	right: 0;
  	bottom: 0;
  	left: 0;
  	perspective: 9999px;
  	transform-style: preserve-3d;
	}
    
	.layer {
  	width: 100%;
  	height: 100%;
  	position: absolute;
  	transform-style: preserve-3d;
  	animation: naon 5s infinite alternate ease-in-out -7.5s;
  	animation-fill-mode: forwards;
  	transform: rotateY(40deg) rotateX(33deg) translateZ(0);
	}
    
	.layer:after {
  	font: 50px/0.5 "Pacifico", "Kaushan Script", Futura, "Roboto", "Trebuchet MS", Helvetica, sans-serif;
  	content: "Substitut3_4nd_sh1ft_555";
  	white-space: pre;
  	text-align: center;
  	height: 100%;
  	width: 100%;
  	position: absolute;
  	top: 50px;
  	color: whitesmoke;
  	letter-spacing: -2px;
  	text-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
	}
    
	.layer:nth-child(1):after {
  	transform: translateZ(0px);
	}
    
	.layer:nth-child(2):after {
  	transform: translateZ(-1.5px);
	}
    
	.layer:nth-child(3):after {
  	transform: translateZ(-3px);
	}
    
	.layer:nth-child(4):after {
  	transform: translateZ(-4.5px);
	}
    
	.layer:nth-child(5):after {
  	transform: translateZ(-6px);
	}
    
	.layer:nth-child(6):after {
  	transform: translateZ(-7.5px);
	}
    
	.layer:nth-child(7):after {
  	transform: translateZ(-9px);
	}
    
	.layer:nth-child(8):after {
  	transform: translateZ(-10.5px);
	}
    
	.layer:nth-child(9):after {
  	transform: translateZ(-12px);
	}
    
	.layer:nth-child(10):after {
  	transform: translateZ(-13.5px);
	}
    
	.layer:nth-child(11):after {
  	transform: translateZ(-15px);
	}
    
	.layer:nth-child(12):after {
  	transform: translateZ(-16.5px);
	}
    
	.layer:nth-child(13):after {
  	transform: translateZ(-18px);
	}
    
	.layer:nth-child(14):after {
  	transform: translateZ(-19.5px);
	}
    
	.layer:nth-child(15):after {
  	transform: translateZ(-21px);
	}
    
	.layer:nth-child(16):after {
  	transform: translateZ(-22.5px);
	}
    
	.layer:nth-child(17):after {
  	transform: translateZ(-24px);
	}
    
	.layer:nth-child(18):after {
  	transform: translateZ(-25.5px);
	}
    
	.layer:nth-child(19):after {
  	transform: translateZ(-27px);
	}
    
	.layer:nth-child(20):after {
  	transform: translateZ(-28.5px);
	}
    
	.layer:nth-child(n+10):after {
  	-webkit-text-stroke: 3px rgba(0, 0, 0, 0.25);
	}
    
	.layer:nth-child(n+11):after {
  	-webkit-text-stroke: 15px dodgerblue;
  	text-shadow: 6px 0 6px #00366b, 5px 5px 5px #002951, 0 6px 6px #00366b;
	}
    
	.layer:nth-child(n+12):after {
  	-webkit-text-stroke: 15px #0077ea;
	}
    
	.layer:last-child:after {
  	-webkit-text-stroke: 17px rgba(0, 0, 0, 0.1);
	}
    
	.layer:first-child:after {
  	color: #fff;
  	text-shadow: none;
	}
    
	@keyframes naon {
  	100% {
    	transform: rotateY(-40deg) rotateX(-43deg);
  	}
	}
  </style>
</html>

```

Flag : CJ2021{Substitut3\_4nd\_sh1ft\_555}
