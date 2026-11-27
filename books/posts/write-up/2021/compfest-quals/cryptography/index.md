# Cryptography

<!-- challenge-index: 1f0ae5b5e2112b17 -->

| Challenge | Topic |
| --- | --- |
| [Snab? Yes, Snab (397 pts)](#snab-yes-snab-397-pts) | RSA, Shared Factors |
| [Secure Channel (479 pts)](#secure-channel-479-pts) | AES, Key Search, Base85 |
| [You AES Me Up (482 pts)](#you-aes-me-up-482-pts) | AES, IV Reuse |

<!-- /challenge-index -->

## Snab? Yes, Snab (397 pts)

### Description

\-

### Solution

Diberikan source code sebagai berikut

```python
from Cryptodome.Util.number import*

e = 0x10001
s = pow(p + q, 2)
n = p*q
a = pow(s, 3, r)
b = (s - q*(2*p + q))*r

m_list = [findme]

c_list = []
for i in range(len(m_list)):
	m = bytes_to_long(m_list[i])
	c = pow(m*r, e, n)

	c_list.append(c)

output = open("output.txt", "w")
output.writelines([str(i) + "\n" for i in [e, s, n, a, b, c_list]])
output.close()
```

Terlihat terdapat beberapa parameter tambahan hasil operasi dari parameter lain yang dituliskan pada output.txt , jadi disini kami menjabarkan parameter yang ada tersebut.

```python
s = p2 + 2pq + q2

b = (p2 + 2pq + q2 - q(2p + q))*r
b = (p2 + 2pq + q2 - 2pq - q2)*r
b = p2r + 2pqr + q2r - 2pqr - q2r
b = p2r

n = p*q
```

Karena b dan n sama sama memiliki faktor p , maka lakukan gcd didapatkan p , selanjutnya bagi n dengan p dapat q. Untuk r tinggal bagi b dengan p2 . Sisanya tinggal decrypt rsa kemudian bagi dengan r.

```python
from Crypto.Util.number import *

import gmpy2
b = 1443061772954701335732136128869248910288995712185482317126411260349775148932784597588115548780067761993841192961205698418501468762734686695975550561598140253475710348439640002745286347562
n = 121789376487960809489253386587170686658768726657045553214623415992384832614485249137256874454267032401365173859563210814953487893574413409932117585950570225259024509903129746392143101
p = gmpy2.gcd(b,n)
q = n/p
r = b/p**2
e = 0x10001
enc = [95844532553991737600355244654272099305361975575150371319709729091243030203575898742071987199800250922501746626433985253038713853151746857514762678605619742310839669559545627531098676, 42098262117872607180245376226279234844537189667792611290978137770131205295202393318329675438677406769928295941768074280915365884838027414974072838410934952571392616562898636004189303, 8604504123043858588289398284978073629384165878986588408956445422750740896636700840713408309772547146776823067482307495576552057400894861616123713400577813256614795674220942022738198, 66896916235028791010554130879834163456721897024453929564151545727202320039792487273512943832159287883050106923587075192390665897004465138382234040927275478139131450371794658563343368, 88176130128782413821390318550151008388570132120182664342566671328546119423517817326934034720909238554168653863093116429325532932401977519369212892117707167802400008407395125896733332, 42250039274640778630603717605163827961176577828564055370588929192401015587247485151024369147022833032549004175634147831360114651662490704138925606397505368573040950634048151235675964, 106267843822546752528780879737401351948170741446817769684516569656816005147897267321452764634553751488085440938706773625287154372645991244141121226180609731226228509942129690482744498, 7344462713592491879813960159075800353984094813742489003735150623847056840460595091048879286634691169764793649426176975158414555454778075430233699780146900520609629142406422725693811, 68155732896092345896827379516624133280166986984023541993085330906321960888421556683672078055376548346464764100036149614632795220030187229733989823788323988946361921828069707823065198, 2456638129741631242062051214133833843357605035108383884677777076160879939756985403557604264648903511528401478876871578775440101482814072714355366084122429853207060638683606389504551, 99671982271645788903414016384550975165361965345980177928115018027271173062935625698434769263846972984813377601618481025600240081090732166957299336765744471217496851539810214590361856]
phi = (p-1)*(q-1)
d = inverse(e,phi)
flag = ""
for i in enc:
    flag += long_to_bytes(pow(i,d,n)/r)
print flag
```

Ternyata didapatkan source code lain

```python
#Snab says good job! But you're not done yet
flag = findme
halfa = ''.join([flag[i] for i in range (0, len(flag), 2)])
halfb = ''.join([flag[i] for i in range (1, len(flag), 2)]
p = bytes_to_long(bytes(halfa, encoding = 'utf-8'))
q = bytes_to_long(bytes(halfb, encoding = 'utf-8'))
r = 0
while (not(isPrime(p) and isPrime(q))):
	p += 1
	q += 1
	r += 1
```

Karena nilai p dan q diketahui jadi kurangi saja dengan nilai r dan didapatkan flagnya . Flag dibagi berdasarkan ganjil genpa jadi tinggal reverse saja.

```python
from Crypto.Util.number import *
import gmpy2

b = 1443061772954701335732136128869248910288995712185482317126411260349775148932784597588115548780067761993841192961205698418501468762734686695975550561598140253475710348439640002745286347562
n = 121789376487960809489253386587170686658768726657045553214623415992384832614485249137256874454267032401365173859563210814953487893574413409932117585950570225259024509903129746392143101
p = gmpy2.gcd(b,n)
q = n/p
r = b/p**2
e = 0x10001
enc = [95844532553991737600355244654272099305361975575150371319709729091243030203575898742071987199800250922501746626433985253038713853151746857514762678605619742310839669559545627531098676, 42098262117872607180245376226279234844537189667792611290978137770131205295202393318329675438677406769928295941768074280915365884838027414974072838410934952571392616562898636004189303, 8604504123043858588289398284978073629384165878986588408956445422750740896636700840713408309772547146776823067482307495576552057400894861616123713400577813256614795674220942022738198, 66896916235028791010554130879834163456721897024453929564151545727202320039792487273512943832159287883050106923587075192390665897004465138382234040927275478139131450371794658563343368, 88176130128782413821390318550151008388570132120182664342566671328546119423517817326934034720909238554168653863093116429325532932401977519369212892117707167802400008407395125896733332, 42250039274640778630603717605163827961176577828564055370588929192401015587247485151024369147022833032549004175634147831360114651662490704138925606397505368573040950634048151235675964, 106267843822546752528780879737401351948170741446817769684516569656816005147897267321452764634553751488085440938706773625287154372645991244141121226180609731226228509942129690482744498, 7344462713592491879813960159075800353984094813742489003735150623847056840460595091048879286634691169764793649426176975158414555454778075430233699780146900520609629142406422725693811, 68155732896092345896827379516624133280166986984023541993085330906321960888421556683672078055376548346464764100036149614632795220030187229733989823788323988946361921828069707823065198, 2456638129741631242062051214133833843357605035108383884677777076160879939756985403557604264648903511528401478876871578775440101482814072714355366084122429853207060638683606389504551, 99671982271645788903414016384550975165361965345980177928115018027271173062935625698434769263846972984813377601618481025600240081090732166957299336765744471217496851539810214590361856]
phi = (p-1)*(q-1)
d = inverse(e,phi)
flag = ""
for i in enc:
    flag += long_to_bytes(pow(i,d,n)/r)
a = long_to_bytes(p-r)
b = long_to_bytes(q-r)
res = ""
for i in range(len(a)):
    res += a[i]
    res += b[i]
print res

```

<figure><img src="https://lh7-us.googleusercontent.com/OtZLIHLnR1HaCoxyHPk84jbxMm5sB9R514xHM79t3QuJgW7zkrtw-SI2PnmM7ySKYVXxsOvjyiOCCbvBnkWZ4rMKvq6Jtv4BCyko2Hb0UKs6xlCvTL6UBsaz8mmUpbjOBim4xh1vGhdSXUBL2YcZGw" alt=""><figcaption></figcaption></figure>

Flag : COMPFEST13{y0U\_d1DnT\_3xpEcT\_t0\_FinD\_pQ\_4s\_a\_fl4g\_DiD\_y0u\_7e1877a801}

## Secure Channel (479 pts)

### Description

\-

### Solution

Diberikan 4 source code , disini kami melakukan analisis pada file inti yaitu dimana percakapan antara bob dan alice terjadi.

```python
#!/usr/bin/env python3
import sys
from base64 import b64encode, b64decode
from Crypto.Util.number import getPrime, bytes_to_long  as bl, long_to_bytes as lb
from secrets import Alice, Bob
from chats import alice_dialogue, bob_dialogue
import time

class Unbuffered(object):
	def __init__(self, stream):
    	self.stream = stream
	def write(self, data):
    	self.stream.write(data)
    	self.stream.flush()
	def writelines(self, datas):
    	self.stream.writelines(datas)
    	self.stream.flush()
	def __getattr__(self, attr):
    	return getattr(self.stream, attr)

sys.stdout = Unbuffered(sys.stdout)

try:
	g = bl(b64decode(input('g: ')))
	assert g > 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
	p = getPrime(512)

	alice = Alice()
	bob = Bob()

	alice_public_part = alice.make_public_part(g, p)
	bob_public_part = bob.make_public_part(g, p)

	alice.make_private_part(bob_public_part, p)
	bob.make_private_part(alice_public_part, p)

	print('p:', p)
	print('Alice\'s public part:', b64encode(lb(alice_public_part)).decode())
	#print('Bob\'s public part:', b64encode(lb(bob_public_part)).decode()) # Bob doesn't want to share it to you :(
	print()

	assert len(alice_dialogue) == len(bob_dialogue)
	while True:   	 
    	for i in range(len(alice_dialogue)):
        	print('Messages from Alice:')
        	msg = alice.send_message(alice_dialogue[i])
        	print(b64encode(msg).decode())
        	print(bob.receive_message(msg))
        	print()
        	time.sleep(0.5)

        	print('Messages from Bob:')    
        	msg = bob.send_message(bob_dialogue[i])
        	print(b64encode(msg).decode())
        	print(alice.receive_message(msg))
        	print()
        	time.sleep(0.5)
except:
	print('Something is wrong.')
	exit(0)
```

Sepertinya tidak ada yang aneh , kemudian cek file secrets.py

```python
#!/usr/bin/env python3
from Crypto.Util.number import bytes_to_long as bl, long_to_bytes as lb
from Crypto.Cipher import AES
import os
import random
import string

sp = list(map(ord, list(string.printable)))

def pad(msg):
	pad_length = random.randint(20, 100)
	for i in range(pad_length):
    	c = random.randint(0, 255)
    	while c in sp:
        	c = random.randint(0, 255)
    	pos = random.randint(0, len(msg) - 1)
    	msg = msg[:pos] + chr(c).encode() + msg[pos:]
	while True:
    	c = random.randint(0, 255)
    	while c in sp:
        	c = random.randint(0, 255)
    	pos = random.randint(0, len(msg) - 1)
    	msg = msg[:pos] + chr(c).encode() + msg[pos:]
    	if (len(msg) % 16 == 0):
        	break
	return msg

class Person:
	def make_public_part(self, g, p):
    	return pow(g, self.secret, p)

	def make_private_part(self, gx, p):
    	self.key = pow(gx, self.secret, p) % 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
    	self.key = lb(self.key)
    	while (len(self.key) != 16):
        	self.key += b'\x01'
    	return self.key

	def send_message(self, msg):
    	iv = os.urandom(16)
    	cipher = AES.new(self.key, AES.MODE_CBC, iv)
    	enc = iv + cipher.encrypt(pad(msg))
    	return enc
    
	def receive_message(self, enc_message):
    	try:
        	iv = enc_message[:16]
        	enc = enc_message[16:]
        	cipher = AES.new(self.key, AES.MODE_CBC, iv)
        	msg = cipher.decrypt(enc)
        	return 'Message received!'
    	except:
        	return 'Message not received!'

class Alice(Person):
	def __init__(self):
    	self.secret = 0 # REDACTED

class Bob(Person):
	def __init__(self):
    	self.secret = 0 # REDACTED
    	assert 2 < self.secret < 100

class You(Person):
	def __init__(self, secret):
    	self.secret = secret
```

Terlihat pada constraint pada constructor kelas bob bahwa nilai secret > 2 dan < 100 . Jadi bisa dibruteforce . Yang jadi maslaah kita tidak tahu plaintextnya apa untuk pembandingnya, tapi bisa diatasi dengan melakukan >= 2 kali request ke server dan melakukan decrypt keduanya dengan key 3-100 , jika ada nilai yang sama dikeduanya berarti itulah plaintextnya. Berikut contohnya

```python
a = ['u\'!IIC5uB)sv>#$`NcR`j g8|LBE#"CoI2\x0bvSrE>]1Qmd2G.)T>oL', "i5\x0b_of~\x0cFR0d9[}>A6GW?twwM_\tM\x0caQ7\n2:x`(;<YX5_<?K'[Q", ':d90)=;j\nOOhSakTs/$\x0cxE& SU/#^aE;tdRw\r\\TRc2_J#R8UjyFXk<83[ ej', 'q{?wd3?Rw?5\x0b{Q:}2IUQ<6k3`f4G^QOAQSjn:Is|K(DR!\x0c5Jmjt\x0c5qY7SB~', 'Fm!DH9YyyK$M2il\n=*F;nT3ya)YF*,8Q"KJ~05+n}ZQ(0F[6.|F\r`})H4J', '`;G,x2]d\\(ec QSFeB*a\x0bM\\W$wB1W2sd}|l*Tx1mOj39 5q%#Ei\x0b\x0cf%]2UZ,E', "T}>)G;Qhw5.X3<\x0b&A5c9OT-bW=\r$D'%U8aQeY~rl?FL/f\x0b5B+pBFZ{k&qVyGZ", '|D6/DTcA!`dG1>/{}DZj&n,A0lW<&vesAXm.\t5.O)y,1\x0c7DktZ', 'e$W[,"R:(eUIxI_\tVnD_(6\rYgQ+v};fhk|R9z6;p#j|84;#!\tbi\'ZJh\x0cD.zHW,', 'B1Z\njP\tyM,YI@>GW6_g}B=a[!"<d}z\n/W`e4C8\x0cij5r&C*?E}$Hl"', '\x0b&,Csm!_p OX!`4lQ4WHLHC\rMi;NFVu<<nJ})>)M*rqFe"\rzj]TA4G$oot]+', 'KPKjGz#_s2\t6s:U9R2K6B\x0cjId\tbWVUr?(5rJ\\i<j#@7];[Tb]6$z;`* _i', 'FYT3QeGtN>k759?ik$OxAyd0Tq^g6m+1 *B)dSVjQA?xGzRJ-n', 'gdM`xdyh;i7s+!8kCQ7\x0b9WN!y@L;\r\txTIy1&A3\x0b!1wyX|^p2Fu4Zek@zpJu>', 'QWOcQf})(>U)8j7r*O\'&pt1I\\qImo*Y\nS knwa9DBPp6-+c[fQL6\x0c"=V}?1%usP7sh', 'VmK}R@Le4W\nVuylN+a.IWNG\'~\nDv{Q"^M5SD?XdB<RD\nu5X\rof0O!=e%hz(U$GBi', '9u0lfBbln_8^*f\t84yqt7S%X=}foRq3uA]_>M|A\t&A\x0b"HzKh(Nx=~', 'q5uK#uh-Pn\nLGgKj\n[,`\thT3T!D"\nZj6<!_9qqLNs+P[[WqQe+Q:%j6x9;\r/ I4W\x0c', '\r\x0cgrF]?]L%6%=T9\nc<@fN/o^vvSj<3awRw5W\x0b660e|:bh902gZNl[', '\n\x0c2}o\x0bV8|PpEQg~D~gl<Bc5%O.{)VK7\r4xTm"A9ag\rEh]~PgCJn[=,_=3', 'sVB=~hl_Xt\r>aCiW\t}jR{V2i?S*p5X;\nuOW<q[2\x0bCt}h', '%=K)T?>4w(\x0b^n|%=7r$JjwVAR/2F^RxCM(gQ"\tECz.2WJyLDsn|\'Rrb', "M6%dk\tggHahExLpbZ\\leq\x0b+8KIP xai1l!D6+yA%'kh/)^AU}", "J@qEEQw=tzkWT\x0b$9.[\rd9\nc^2Q1mODKwDpb&PN>yFE1>\rX3{(#QF0{'r!pCA~\r", "c'CC6DIl7L2\\`G\x0bh9gSR>$/k&`]%[!PIOMw[<'[k\\hS*EQxE&#\nv]D", "+047Q}yk\x0b\r-:$\\\nb;9!\\5mhSk)M\nb\nE'|)A##e|sI:.iu%bJ]", '0f\\I0EC.Vr^!<%4[!\\[[WqoG*=&gD+4/Rv `?:6Qy[EmHsVh\rElUl&>iO,E', 'vw*3j%V_:g~(V\x0bKJ\x0c:!E,fqM^J.{*@QGQ$_R"M\x0c42\tY\x0cA^ZSYi{A#XS;1\x0b', 'F0Z@2 o29/Bk9U@,a%Zf+@O0op$9+(K=24\x0bJB&0"4nmc$B<c', "''kEo?\x0cZdl2m@]5\r;mll\x0bq4>Ms#wSKLF\x0cETcf\t\rM>W%+pl^E$;~v\\BW\\n<", 'JA\\Rd(e\\3bN\t[L}4E`}xtGx;bN_3yW?<J}Zn}jKOX?_^\x0b"', "(9-JF)H5+T#&>DtaQ,'MeT/;EAK,s%VtD*n(\x0cuH3%Af|!WOZj\x0bK", 'Zk2:+%R!WN~\'\'<|^yOO\'B1EO%V*f8]$zDsk5ecs"oQ]zd?a`&B"r8CWh8%Zv]jJ}UV', 'mJ\rD\tw5];K\ruvW*\\\\!JVx%30u*1r\n>V(k<83W^HJ5;\n]_OkyKO#JT\tx{(Zg5FJp', 'q)Vk)R]^ctLIy\tY?NS015COM2($(X{Xcm0SzHKx->5pUwq_HlX;+[', "' m[~\\<]3T!qhhmudnr\x0b|}6DAC{x|%$8\nL\x0b':E(a$<IBt\x0b\\R3dQdL wN", '.lxQQ58C2:/RMo uSxkk;`>GSDp/9WSI#X2l}4%FWYlXQ', 'W6PRO<Z#h/-Mw\r|bNNvUCvJQ.(uu~Mqx:UFK\\;8Fh `e-Zd>o=F>4&KGXw:', 'J Dhx)JI77-O_ukY5duBW3obe [$3JP{U@,>PZMZYSiQtFd&6P422.@~Ekq', '-5|okNIX+\\q\t1&U\tD-\t$k(?Od{,Q94l!(!K?\x0c>7~;mg\x0clclV5dYrWQF[dg', 'S|~W?r" Oft]rHW%6(Fg2|.O\x0bdBSM\nKU(vtQ-/t7H@"y/oqNp;}Ag5X\x0b', "XhZ&x(\t%Wc#\\ s`k%vE\x0c51>'\nh.bgb|:R6k(R@Y{JB-/5z!%MAmb!", 'l\'\\k[\t\x0cFTkr!~M4(^l]JhN!%?Y\'vZS^,U#!j#5F1|\\{"4(a,<N=d\x0bK\x0b{', "Ve~>unB\\oPFAy%n\nCwP;\x0c`KW:@af5tlQDUnMrNNd&1W:\\T*Mm.QtN/G)X7uvob'", '(~`@la{Xo&rDh 5X:O:\x0cTv7s# 92:b\n7r7M)"9{E4xe.1JT]Zl<d9VaXgma', "+2.#\\ym~N^:v[~>49=\x0c\nm8\r'X\tv~o4vOj8$oO*|y 6\\}G(\tel=\rX:", 'B,J-,IIR"H&vfDloX;O_1GyF3Awh|8cN8+TquT\\u5!Qx`ZTl*U+h', '9W6aq=OrK?N@R;}Rq\'"N\\K2cTf@tM9k&{7opKgO/Ac\t$mt`:rT2%6id', 'lP}7qo%#\x0bePtd.LTueAkj6\t]K6#}w%cJ4^wLb,0[+[cCz\rdl.l,,R6EZSM', '# u#Xb+,7R~mk-L7@Y5<a@U7!\x0bSZXTU{Y;8jPf\x0cS#k>0Hz4xhEW>Z;', "-L>e\x0be;_E{ U8fgqC:a6'n\\2~oR53_%\ns<L^yv;3qLB.|2F;%M", '\t>\x0c^!XErP3F7i<)DN 7GBzTw\t\\]mm-Y|rBnqd{-_R}|~&SpEa i', '}[q}DCn*jO&:l<I6"NiP<Cr& (_\nCZ~|R"@:iyh>h}xs$/wjENxnmiU:I>?O', '1iEEr\\Q F\'OT}Y"czek\x0bKVVw\x0ciP:yV\t\x0bYg>ldQAibya/P4J}I:D\'kb.O0', 'B/5bP]+PJ9hYwOp6AW=[W ?w|m&d>r\n<bn\\DeG`SkFF#@N_', 'u\\=\r,r"BDKmB\n47xYe|n(L5@tOwEH::{F[%]V\x0cK\te!OMq\n\x0c ,*gMr@,75]tPYf', 'h:!r\rdLdEBRL]SO(;"\x0c\x0c:&d(H6#>Nk`s~ur58=\n-L<P8p%)pgmm(.', '\'DfiKGH2"AwFPj^rX.J0T]\x0b\x0bC!\x0c\x0c1\\ecYv+!9=\t;ld,T+\rzB\nn,~; ?)\t[', ':zH(l@/+Z+F 2R+xKjT)-b_P6Wm)LlEWgc,LN$}M"!DLBu.>5sp#^TPs92', '4p(sM&E(&J*t/(Fz7\roIe$|\n;N\x0cg@1-AEq7PEb0 TM&QuB"GyT\n', "e+Q{>1Z2Zl){>:g7jpQSs,)b{P_T'I>ZKFRIxayPLGjt[d\rajZ1X:A({Wou&O9\t", 'dUVY/q,[qd%#<,Kl*75[6-\\k9J3G(v;aH;W3[;JOw)Ts92\n>Ce#}jz}', 'PY;o{?\\xXxb>[ASZ`>S3hC])?(c?.g$ByAGm~+zwSDG8)y5p;:/KT8*8^56\\t)b)', 'X:Ce8=5C[/67HX`1re~9\n&uR%D]qe1\x0c-<.C 813F6I\\sm9\x0b$5Ksbl\tM.x_dLRM%', '\tGmy#vDpUG\x0br7\\!g!j77rdr*Y`\\X\\/Jo\x0bccfEo<m3yau&\x0c38cul>*CkyO>', '?\rk$#JDxy&cF`;qoQ^P8\rk-(34DoS.\r<*:w~*/1[eE\t5XZoJgr@=YD', ':+.?UCx,7Y7bJCi;-}<QZ2v9 6vPTX8\x0cO7KV,n?kFh~^E7&:Nw[ahI\x0bm]rfr x^', 'Fc>?sHoxPk:Rp$`<dAPf~xAjq\x0cx"0j?m"@_(:\t]G4~8()arYuN~\rWX', ' ;iy$\\=-FC_T?%GJY%[8DjQ=*h \x0cG~gfPNP?4n}3k322A+/=A"Ksmb', 'y\'sEx37\x0cL,!0j]BToIi8\nOU4r6#>s<KZ1n@\nq#T1ggz)?keSoTbyLU"vn', '87d&', 'Hf{5!UUvHa8%>O6!2V$1dz{:3oC]_\tjz4P1BB/e!37u>/"NS5;(%!oz3', 'K~.\t>VWc\r%{\tMEZ_g>\t5{gfr\\4EIO3;ZXmG/S-sFb([|zH', "I*=[CLY0_m'uLWQ.ZeW\x0cW5Y60#{H\nhcK\t^bI!!k:HKj)w<[r<)cCL!%+c:\t9N`B", 'QqW\t!LU*pO$No\tRGZ#U5NzW};$p\x0b>\r`}IOKD?&M+.\tC-CL7\t*+CNk7j=YG,X\x0b]:', '1$2Q,W)/hS]TjT6ybpw,*Mie1Gl%;0F*5i!7"n6?\r)!Yc!CWa', 'zA/:ZZjpFU/^i3f@.zdWFX0\rWz7Pf|\\\tQNB$Eu@R1]u%F?O}h]e+g)2D\n[z', 'Tf7307+xA4{&*>\nm8|\x0b7,#\'Gj{X$w3LcS*Mhx_)S`,|\\-F]S"4t]p@0|SW(oyW:', 'QD*T.1-:_-/l)y|a"i=)X\x0b!J8pP|,x}.9\\!+zju]`EV)k\\\\cRIS\x0cql', 'oX^{?p|a\\\nbZq>3PR|m8}"m0(N=1lI\x0bzR[<P5B\'#,#\rE@0a%L', 'p(ZYyrHYU<bPcmsB8]\x0br-$>p2 eNz~2goGcOqK5&&7o \\T.T=(f%;N-SI\x0b`V5\t,', 'Rhg:|$S;mOqm s%9W\rT6J)\tvJ9\\PP1=X8D!T0$7\t_TN#8\n&q1', 'j(C&`{ofr5@Y\'"lBfe5<pU S_A1-WJC0ThCP86"X[?iQ<CClqdPUA<(PnBllLE\'6@4p3\r', " 1-vmf>eMl1sHPJ9)0nUW~B?'@TZ^LK<smZH\rDRFg(M\tO?9<<;[1\t", 'm6+BB\\Wgr^lcVI#OJ%71PQz&cAx>Q<\\Y#~yR[5wCCF nx"[\nUu0A6$[G', 'e\x0c/Y8\t.swwc-Y"$Ip0IuQ2brp|b{{/\x0c}Y*9hn5{uV!eu\'JdM%*Ts.:%5cs\'dnk$', 'ks3+rcgyzx?[^^^\x0b9\r5H}7DH`8Nu1JXt<rzcH2!a(Re52Q?\r#%kZD6\x0c4D', ',$YFPHA*\nE)"N\x0c-J%QY\\RY(j\r}8s<\tj\nn:HDJ@PRA??!z`oMucUUJ', '(mlr~qT)RX|SML>^&sTwk0?di@@V|%#8B r]^_ZUE0YJK|&s', ';-cm!*J.LXvqCy#\x0baO#f^-]\r@ -Z7zb=2=d`JAp"\rLK s`<-H>~<G/NWKsi', 'Jr%!uH\rlG_Y+$qd8~{+MnVH&7+M>nZROMPi5DE@xFmtN{pa{Lk', '/ \\J^(#+aMp3c{fe>TVtdo?RxrPl*w4wcE`WWf$ZS7fh ({k2 1!6p\tLM~FZ CJs', "Cn#;_2i.ztS&81IJ9DJ1Ph b<'`# nA\r<N0[t:()\t9Hu 9m@`,\tv_W!#UTg)", "\rimH'Icq:C<t&Wd?VV9}fkp8d~b\x0c%}--|@\n<\x0bu ^lcaz6&cF`tV", 'i0AnV-JxT+:WSe{l)Xz{J\x0cpF@\\K0>\x0b\tbWFFjEKd\x0b+w$gO3bx_,z<~C~v^y}gz', "%{v*b8-c]`vR*\n#FXX'657w!+^NeG>SpX9;V:\n\r", 'd^.ENb\nBYuvlZl\x0buFPH.NOaa\\+\x0b1#YmFfPH_2Aedjq4gJx^>8}\rY9l]rA-', '1\tM-,dyLj^)4z=%?z+j.utOh*1m\'Z=]\nlv@Nl@"/\x0b$*JnO!v^P?4`29g4S']
b = ['Q:`o[jzpR;sG{)-1\x0c`Qm{\nWV(3B0T0fEQ&#R`g\n', 'F}AY{fh|o\x0bn\t6cfmJol>e;>If/\tg98 ,!` {XS', 'fDNnjcfLRNVf$pT{J8\t4-fh8GI3NBj u\nLdNoiRs],#DE\np:3`', "#yHB5|qjBoR)\x0cTJ$3-\r\x0c-g=e;3!\t+fKaouqtZ3\x0b K9@@\x0bR%?^\x0c'h--6", 'DFP]\\uoPjkk@X(jz"\x0bGJ9/\x0bhx.\r>\x0bzab96IK/\r', '0&sB?hC8V7p0|C>a\t*yI\r=W~L*:})aso|>/Iy$2zUN\nN', "SH\n:1G5\nqH@`!B|bd->r'1kNF? t]XzPnqKlq\r_iC", '\tjQf-bdlkPR+!i)xSbLCl,AYNCu759!s2YzYs*  k7J}', '`({;e\'Z086Z8dtOqE6%Qjk7A2oc "G1jR\\N\'i)\no+|', '[\nhYoaD*3H;kXd^v%`an6t51Pi6zbqY",3ZiRq', 'FD8sm)+W`g|R/$D=wnO&>g#)uL)+h}lqY`m', '1^G/.a9HzCLX:sd\tkO_^;u /Qq\r@f`02r6n94', '}0,TuyS\njqk)GS:EAXm8$-8JI:fC1\rl" jpxb`_i|kAd<VKaK', ',xax]HnB6,ceDv#\nhy";MW\'6{?>k+hvl?`=\x0b{_V^3\tW', "{+Pm'Fkbj!w-@9Ly5!%PQ;\r1FlX~r5@/I`'3u@7*,", '/U$\n OBc:.:/Nbv>so1MkHT(f~[g,A.M_I%*70e#', 'u/zP}u%o7`x;\'@77XA7\x0b}\rbAA|"Cm;%$Xn)-z{jfHU%tbOEs', 'J]4\x0b*^O#h56h<k]hG,A<7zt{H 3pJ5V,pv?g\rE', 'm\x0bW^[/Sun11D#O.+0:HeZdT[v6m{!5c?.aKlNQ1;`ENY', 'z#X9+cX|jEf!kqKx\nT{Q-L]\rS1Ya=ZYNV.Y8%sU\x0b', 'jR,}\nx_;H\\\x0c"x"nt\nCkk9Vc{X2H\x0bpK;Z<jzLsuzRuZ)', 'iD.$^o[p:7Wh2\t8eWlA1n5!bl(\nD\\JCGA::ig\x0bx7nq-!', "b5}[*;.\x0cU8+26\x0c+=mNDFWkZAHCM{>lfY|#f@['u/b-K:2F\x0bB\n", "Gx7=_i=.,g4G'78iiNr=+_}!;_Y`Ps?RWQkI{4> h]n", '1y3%bO>D"\\sZ{dQ/+n?A\x0b[)1&dwu%n\x0b\\G|\tv=\x0bWO', ';Q"q3iPrS?&\x0ck\t8uK<Wv&v^!%l=r2\x0bT]k A%yW$a/sEK\'D:gS', 'bH?,~U^NR\\C8n;g>^\t\x0c2RInFn)#r/(7YfYB&UZ]', '5 +/&<pWbXI~P(2eIm\r\x0b@FMx.[G6O6L_t1ZWz_?Kbjj', "1v-^!p-JZ+I%xGdX'!G(f4<7#=9cTQh}O\x0ch@gmS\n$\\x%(D+", '!\x0cE#s=*~NP#.w:X71q!J49`cIA)\x0bICv]ql1\x0b/3/x>n9 \t*f`', '?**+{K]95KV}4EJj*cIuJWhjR\r0rW*vV&JxI]\x0b]=b_t|V=]>\\x', "\tZz@>aB!b3u`|44W4P:qP}hG>'jU_%GoZfvDum;)", 'X\x0boh4}~X\x0ccN:+@\n\t;Hngb\thN*:Y', "-&2'StT&)$;8@ZWf`OL#>_psavu\r1>7WjNnM#rfal>n5*'A\x0b%\n", 'HEi".#}Cu`Q]n;;EYLL(1:h|?DI^7vxDtS/dMOz5"', "<H='X,P%11pbh\r{ p]mFgt^oXLEHY~\nnIU>OXx\t", '-48{&,\\l\r4C6J~xz[NMxsl`YC<!I\\L*v.fq', 'l\r:\x0bdeM_/O`gS?i\x0cE6CKLq4r{.`4Y<ab5x7YRYb', '`Ao0*m4e;x"/\tA9Fy\tWND\nY+@^?=IRhQ#7j\'SN', 'bWwh"_E["S~&Ya%1ptV.4g+^~F(1#Rf;{4NWou~r#(!YahH', "VR')g\x0c,[C*Ppp{?\rn;ez34z\\@pA p\\Ib@iU@~_1&\t1dfD{4M<", 'k|&i}{n\x0b7`cdv+)z1()D.mPYqMCLb~xgo(\\Jm&\x0cA,No', 'rwnE6Y4pIJ8|8-|=#a)4+c\trHI\n|~}SRVi<\x0b.^CZ', '\x0cPK\n{x|ocx!i$`&Dx"pR>GjS 2At{ft8Kt#Kr2I\'', '4iWN>q&\\} mn!q,vZoL\x0czJm#Y=eWlzC`hZ4z>,vQ/$tk\tJ/w', '\rAYtpk%N\nQ*d zgp|y Km/Nq\tR+"G9{\x0bqL3cit', '#5){?AR]mh1\tHO35pB\\~-b&GfYINP+"i= eCzJG6L\n\x0bDGB', ']ah$xG\\2<CO5t J#f8F#(oRMxk{Y%P[18 K\nes1^+uD', '2R8^"k\'Bg\\b{\':W\tvt\t\x0c%X}HHQfv} J,i7)ix1E)$"g', ']XX;@iqQj1yVEwP{z23s\t\t,\tB`vcx 7Vj:VQ|OHRh;\x0c', 'atT\neM)%BtWaNp\\e=W>)8!ni9GM(ous19c6p,HGta2&Ogp', 'zoyE\x0b;l :<\x0ce^V:sg7Kf1W]I;m8"EzKSKI3i< 86', '&L) \rT[wMuO-li.|uz7}@\newQ?vmR^.RIs3&ZVU}62fjF', 'Y}T<~V2d\x0c$IsR[\ndZlOiW_gh|.A|*[zox+\\_d63:', 'u%Z\\e\x0byF3GmomB\r\tiO1\x0b}$K&@Y\\}!Egbg@veo {\n+,$X', '\nh75;\n34KI}x/sLjI7x;ywBX0{m;i"sAk?+.kf rR2*&[/L', 'q\r;P+,ou!>$j@;Fea?\\L%uQ\rMTq~_H*.%zND:!F5Gx6jNMM', 'tqsJ7LC6Wc{~JVgK-t,^z0>!\twpM=!U;\nVU,#lk=4n~&_? {y', "*]vTn%\r2v^%gOlI\\isO:g>{\t%|mafXJu-xV'E[(;~!bFF\n", "[PMSUhxY7H<3*X)Bc(y7p]j0U~*YwEoG*v)m\x0cpj'P", '[Zo: *z>~z>f6\t:-<\\={r\rqh#\x0b4\x0ce|3QSshn9Gd;o$y', '[A(Q5b1m\\$@wl5K`s;(s{4=<c`y/A k K10p&,M:M{W7', "*4_lQN.*Iv`}3hrJ@o1S+C=RV{]g*aII\thD'x", 'G9>_ge-c8ewI#$xL\n\x0ct.a^l#NzK/eO@RO"1H"<9\x0b,6dQO', 'g!)h.k`,|mdn;J%k=[ \x0cxg)E%X$%=\x0c~Q|u\ncH^<', '_2:g$El_B&-\tn]-Xx}\t?"<Z@UZ63vk;nv)%Qa*f', '-FXLR -H&DW&iXt)t0[F@`8Afp%;NIp[vMUp>7<{wkf9\x0cYt(7M#', "fGJMmgw~qf-kJ$I0:e:5j;s]yae('P6O*+y\x0b\x0b@7fD%,(*", '\r%\x0c\rQ>GwvU-F(t<HaJQ{kskg#IJ/H``pcJ4+&<?_-.*%zJfL', '}V$c6CihZItc*GM\x0bt8I9+ H&_\rx$zz^JM', '87d&', '@^L!U*_d?@0Ux1F.F5WjRG"yv#~ sE6SZ9wG>LB=', 'Sg%)tG~\x0c=-{sfSG1?[\x0bGD\nUQG\\gd)9:Sx/"F8I', 'D?\n43L(N+"eZ:-mkl\x0c9 oWW\t.HVGV8M.Wt', '%caqVLfic"=jrnq>NUK0Jkr!nVYs *POUbN*-J(b?Z\x0c6', '" (37p>`d\x0c!$ZGd}@R\t_$ME\t0k$cfg} Q=VYS;-9k', 'KQLch*49+*Po0cWk/A><w"wxK5pc0W6K\'W', '^f$23JA!_;)S]_i<"*RM}XI[.@yh,b_gcS&Uv\x0b3% IhR', 'bZ~GE{r-,\'\x0b^f:t2\x0bW.er-ol",_-xrN/A`gKncE)\'k{B', "A)o'$,}:,SxaQN+G|j<7ksp+nKpwRj(T\\hgCgH\x0b", '=F<E\rfNKV*d|S-,_U4"RmMtLUZ"|$,1%\tV5SRU@8>jWg`9\r\t~', ',6#\\Zp:D%S.;h;C*>=yN\x0bJ]{Bam1Vgb\rY.c9x+{VPOED# G\x0b^', ',-N%*Ml<-GAmX"!B4I8QXAI2,vXJK:L/qmNQf;;% ', 'Q_tO=2eN*tq&qttq9?$SJM1.|CHGW:&B\\V!.MA_', "s5vPeDB<$3z\ngt.\r X/L(tGho>\t\x0b3p7%'hv\rjTnmd\x0c]", 'qMXnB1{xD"!gl\t\x0c:\t9PI2H(ht#\tj8s`Q\x0ciVTHG~"K$o', 'jYX0U8I\rImnHU=?H:(/z=8oJK\'IJR0%C)"cAo_=~.S&', 'a"t8UU)P~X|34VaS.\\\'v2[ji78!RXC//k:-$!` (8hIuz^w.\tiuJ2/', "e0O3.*3Kz\x0b'dPoVw_9JW|9+#j*T#H)rC\tBR60/ohcVZ~]X`B", 'YlGE=seEh>A7;5#\t0KW\\\x0cEkTj~F~&3}F;[e,B~/Q:NJ]D<&eS2H', 'Yz\x0cz{4T/mhIgarO"g>#X4HH3|D4FCsXNPy;', "ln\x0bxckk/k m'dDbPHw5Y;p]\x0b!|sifLckq3%2q\x0bQF(", 'i]axX+_Vbp/WM.9N|[`Ck$N9Kh"dW8Y;-llzjWH~64RB', 'Jua@boN"GD)6bV\'\'2;9wv1\r8k0Bw"h;510cXs bL0-`8Br_', "boPY/?w8'6i(Z^:a`1h`i*/0I?^?2W^bj<y'IAL)QQP;GV", '\rDfA\\_Psy%^BC*(?v*HL%o_7NJ:~M#EDFNM;4\rfTVhP', 'T1!OOc~Mv)dQY@2SGEd \'\nV"QArFvfLeQ\x0cP', ' zemcYx=#&Mg}j~+2.JJNF*f]}V.O,m(J0qB/v\t( E']
c = ['v\x0b(Bw>\ttM/]cVtT=\'e]\r\\2joDEr"GO;cbo\x0c1!|(', '7:+W0q=f$DqL,Xe)^Od*_\nGTm1\x0c?$ lVHu{QI;(+B%,1cgX', "'<;2`WM:T)Ub%F\x0bo8zWWt(Mg75'l)VstQkh3q#\\>-8Ca`1;=S)", "Xb!=50b*o\x0c`/I)|f_[)efvM:`m+[clI+Y07fqs=guXFZ<j;m'", "(U*TdU':D[ql'&%lLs4?BexH}E[/9U\tEXAJFu", "3;70vYuKpd\x0cpcU,+Zms`QRu\n'zqM4~,ZV:lv]8I5.5F(@r:M", '!0l*,_kq}zI^Z\x0c@|\x0b.\n4KC?[|SA5hWC5\rZ/<3YVP]\x0b\r@', 'D[Uc,WL{1c!RQE\\PVCqOIY"n\x0bfJ2T', '<hK%:OmzE\\1O$Tb=\x0b5p"OJX3xl\\\\"vY4\'WA,7];CVWo/qA', 'r?\n<st%}r_U<?&oZk57x/V:9G@0"t~Z%><nlwJmxus4T', 'Naa/5di|VS0-=VII7JDND~5Y.@-jQ,x12+dU\\;HeM', 'IzQv"Q.WoH+\r6YS|4\'al\x0c"k\x0c*_\n;6\tU,AhLTpVGU\tm', '^!hN7p4vbh |<i{YHRxeAem_@|\n@k$\t\x0c@0<6"Z2Vs.&b', "^@k7/<C#e?b(bTw-\\ :g1G#*\t9X9@D f;t;z'E,1rd>", 'S*A$|744;gLOL5BPjBJ\x0c\x0beV/}ShCg\n{2jAM5J*Cm$\tWt2KG74_U5O', '9hxA.I}\x0b^)gfn7SV\x0c[_[pw|fJ+#~03-upai3^H?o', "GPg^fc:'@j %|?W)!CS(+]#\n\\_M?#ORD@%*zdGf/o_*fAk", '6Jj<lb!^i6N.I\\(EN.Kg*\t4q1<8ce/^<bKlZk`i{<Dnm', "`_;=Z\x0c\x0cdFYPW.!/WKm'd6\\fCnxz<.1X!~0.8e|Qv,", '.]KK\x0cucD7"I/0? D`V,\rx<)[dw@%pR f', '"\t/dQ&([tv~H`c@vx9?`bScGY\nb2Zs&O6)\r0~,>z\tdpX^;Vf\'dY/*)_', 'DBbA1\x0bUX4Clp)}/W"^`l?\\nMqU$sZz\x0b$6Bm~\nG:J\rLK%dqT', 'T\x0bd}}b_}(H2x|kuW?6+J\tZ&4@AUUe\rLf\r*%Djhb#0syR&g5', "EztDC,$O?zJn:\\M5v';7V`- V\r?!}nDn\r^(!P%fi255{", 'yTpJ~>)}KM+s&LF O,&yPZe:)\x0b"K"L\\@y\rcGo(2\\|o3K', "Q\t\x0c:VR>~'S 9+6y#xAx)\x0b}\\i:mX0\x0c{=K]MxC+b\x0b.5\x0cC[_", '.A$S]M]\nl\x0bZ;rm4"($x\'#K#C-"?B/g;\\\'(l.QQ#;Zgg~.P', 'ir[ "\t\n0|XG^p#?CVeHr+-sdI\x0b&x\n ?:w[HY1WUgJ|A;Z(-', "brAt7]\tA01}(ea=H)\x0clGU{ jAUc'.`R$yb15%_((%y'", '|%?,2uM0%>GU`a+n\\:HOSKdtB8GE\\P]dm{`xL', '$eXW*f/\r3t3C/!&\t\\j;2$3HNjRM)k#\tp?%xpGB>', "Q_iKoJ)N.\\s7.'%+,q3?Ad\nilU9y)@\x0b'\x0cK!jJ", "@PBkcu7GB'CJ(\n\ntCUbv#[s(gk*]\x0czI5'OBRmQU", '78H*na.\\@<tv0$"]thwe/#8\\\n(\t#WEQu}gQ/h0w', 'IH/n:&P1%8A(;\n\\j!#e e7kr{@)0*dy6Y4%:"bRR#', 'LYe;g2D\x0b}Id`L"P4`\tsoAtJ$Qi0XS5WikdU[Jk~1<VVMQOm', '\\(}&Y\tnnY#,\r2XE43^d\x0b&P3r$|nw*2S[tH8N+>,-g6dXc?PI', '\x0b0dP;$bwl"& WG\rlx"\'Uh3)"3<`i;;vty2>uiGS', '%F?XbIVvD0$\x0b9R\x0c\x0bxjhvV-Ixd\x0cqComoMn7(~g7l\rb rYB@RM)', 'JiT929gN]<f 8hFyB$E1x\n-T80~l}IOMrh`b]', '-b)RY7 u\x0cr/ByMlO9VSULDghI#4jT0=r*ZYZ0b\x0c`hcd6L', "6'od}6b|8p}+z7^DMx6iN.BwZ~kb=S>\nw[W65vr?&r", "F~\x0b}zXxX7?eo9;13\nk}^!7)_5\t%+\tIs'JEKNu_", 'K(\x0c,n^|2[i\x0c&Dp*;HQ\'AZ!b\t\\S";(H\\&%s-X~f< &q', '_G]xPm\x0cG|IT%dBMaUT%loVg3\x0bn,qnRuu%\x0b%ca?,[)}Xr22-(X', "hXQr@474w' gRx0SG=~l@#[DWh|eD{tii!", 'L49_3WPWMnsf\ru/mt,9l|\riYpbfPvgoevN;\raA.m', 'q^I 03vZA5Gxk0j|Q5)YR*7R`3%XX/Wh Y?]\x0c6WNafJ', 'Ok;W6>E!vgzEK&_!~\\"\nJcpZH__*KAYw&~A1LG[\txoInxG\x0bx?=:w\t{:', ">9U&DWgV/ I4J_eD~8C'>d((%B=!#O,18'}\rM{ g<\rP", "(Fk?S'v!D7K CW7:b$xYb?o^t$\x0csmI1\rV4/![mj;c2Kh", 'rkD8"YBiUg.7(k\x0cd\\^M/~D.\x0c;K=1VmI(2fTukv"GH-ROz5', 'M7%M_\r/UJcMMi5fh\\FSRb1q\x0c2aS,<9\\*ZT~%$Kd:p', ',qu9$W0\x0cpNo 4wW1Yt&js\n+)W3}RFR3A\\r.,uX\\&L<', "D0?e+NGpM\\\x0cXVe,HEO's!uG:q*FsC\rqF[$RZB2Y0RB", '7#dSF!V2^4]*As\x0b^6S>3"E]Hw#gh#]:FHkJpfDq[y}U', 'Ab4]1Qyc:<)^N/UWh6KFUm]^*dq~u6uiyX"o"Q,2zxIC', 'U@kTj+b+was6=zm48@u]kWOL|({^<>E=\\Sdx{Lo0x"`/(X{b', 'F1fLyxx]5S(wm.hy76Qws>[}!n\x0cn^.I\\A<\\T3]h/`,^', '!{f@n#dJU}\x0cJIR7#k(*Sbs`_QYxC3NX\nQ^w}:hkx', '&*<;F\\OYm5\rkHMqfe7CJ2Y)H$\tGZn\\V:Vj6lwQ', "\x0cmD\ry[ .5_gp!Im<'q?wa{^+TonvJ?rLC%", '* ?|4C"H.@{?\\\n{J5Tq!}\x0c]t\'!5^E^s^DuXMtH-.S3_H`', '~fr3\\jSkIclSO>y@%(C5WxoMEb8sW?\t,(^iTOKd~,IO', 'Kz^O{v2);TIOb\th@paf7\\jk /5U\x0c5]XH<bv(N8s0|,ovl+z\x0bl!~B', '8C>d\rL~5qXoK<@B@I4A%E@5 l_]:B/@MQ~$u"+Q03P6Y3r?EM^4s.', 'vgxu(+Y%pdoG~X~sL}hCxv\rne\t#kbv<Z(L91CgxL5', 'J\n(+\\jJK\r~k$\n7~XIi^~t7.>?h\x0bT{>1I#uQ+#\n8?\tD', 'f`vv+cO\\`C<.sa 9\t4BfDx}A4z?oZV}#9A\x0bP_[77SH@U j', 't0:F2IXb?e9X^6f[7S}_@H{iNI0V&\x0c/`9(Y:SZ4yR?HEb', '87d&', "5xu\t_$vn=#}q%J+i{E[.bW?T.^0mdLPlm3_IO 5V'X-e", '=/.q<K)l:zByMT9[-8Pa-jA|+EQ/1&j+A o%;?mbR"IC?', '80\rCZ/\x0b|63M\n!t67uA6PXh:,oxb`[^[^E"@>\x0btN|f&8pd', '\ru/+<0N%`qVz:>o.4}VrdKx\x0b?)T@0A|o\tZd`+i\n) ', 'e apY~GiK6}zR:Z{;QjURoo"cfF+)$a# d\x0b`\\s\r7/fH~f', '8ZqlKj(QL*Yr-\'m)tNp(){l>\t!&CU6{aAed<+NG\nmHv)"_{', 'Q2)zs<:\x0cG\nI56|0Re{F6VK&.~h\'\tB ; Ig"W;^_{=', '8%aPe\rmzgF<thSSE/I\x0b]NzX!mp@E$;PK.~O1f*r t\n3+#s\n', '#QBk=En~Bju5P^!`<HX/&$\rE[JDx !j}D5f:@sikT\x0bPcK^', '\nhp}D2}Q:7H4U#)<\r70j?9,WqVaDFflrbQuxJ[V%', 'F_ESpfg*Gsuu[J5F=(j]K){\tcPP_e_ #4Sri7Ov{{=;\\|$Z%p,', 'XjS,aqF:\n:9\t,b7PUes8:XSE_|!1U97IM 8?d3y', '-B,(d))bWIY#[J~,)9F@WqnI\x0bB*.?QrV~)"Q&/y', 'i.W;f"U];iyVS^E36]-T68@b?tMlcA`F,qz8yM9M.*4', 'nJ$B)l1&\x0b?kyyrR-{3on_((iZbMdw>RU+%ax!la\\0kIG\nH\tV', '\rzjxHS}:-2HeosqQyp=z,w3HsP|pa}{}pK{R>W^yAf.Cd42', "g.ScqIFwI!TeB@*-|q1>4p\r9'%w]<&@M.'Z=<z>xyn&q+4*", "5g}\x0b'+O\n_Z7+([(\x0c=_dSQ_X/ZI]MxZ3+Q3%4%W", 'F&>?W]ly/>~.^n[~v\tv?\\%*t!%h\x0bloiwaf@:', '(NW_I<}p#/_S`&$Eo`%$\rAOR583_{rU4Mb~hnX\r7\t\x0b!~', 'yd>[NDOAMb5\':vCW>h\re9*\\d%9)Q="vb(t', "4HbdVBAn142/efMo6'&#colt[D{oTe!` .?@(jP", '\x0c,=5q95.K{B+QJM2a+t@`}h)f@0<oesAQRR%>m~Sj~p,+]82$RKXZH!', ',g8\t\\H>^)74~+eyX_w)I5x#K\x0cIz25#Xt396|nd8;<B', 'G^]{tTimFv[Eka-~`i!--,&W@MR*"\x0c7;oVgb5zi*!:lGwPzZd', '+C!\n\x0b4E33T_a\rjb3[G=4_(t<\r=9\x0b{%\t^*do)9sb;J|CG)KTv_Ij-(', ')n+;/N]]Q{S$<FU$&`&c8<\x0brC:l}$62`"AuionfkT;F"#']
for i in range(len(a)):
    if(a[i] in b and a[i] in c):
   	 print(a[i])
```

<figure><img src="https://lh7-us.googleusercontent.com/knjDSg3BdpUp65S0oKYJuRQV8-93jYfs2vLiQyxr8f8UDZpqI5hzHOhx8NW-qnu67SS32tt9YVMAfSJeS4FYPvZL2QeETKhIdo5awRutDdh8kuFVdWqGuT552qThnVsAQmpE8qELkFdIehM8gSIIAg" alt=""><figcaption></figcaption></figure>

Didapatkan outputnya “87d&”. Jadi bisa digunakan sebagai pembanding di script utama.

```python
from Crypto.Util.number import *
import base64
from Crypto.Cipher import AES
import string
from pwn import *

def decrypt(enc,key,iv):
    cipher = AES.new(key, AES.MODE_CBC, iv)
    msg = cipher.decrypt(enc)
    return msg

sp = list(string.printable)
g = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF+1
r = remote("103.152.242.242",1457)
# r = process("./alice-bob.py")
r.recvuntil("g: ")
r.sendline(base64.b64encode(long_to_bytes(g)))
r.recvuntil("p: ")
p = int(r.recvline().strip())
r.recvuntil("public part: ")
alice_pub = r.recvline().strip()
a_pub = bytes_to_long(base64.b64decode(alice_pub))
list_msg = []
for i in range(40):
    # print(i)
    r.recvuntil("Alice:\n")
    list_msg.append(base64.b64decode(r.recvline().strip()))
    r.recvuntil("Bob:\n")
    list_msg.append(base64.b64decode(r.recvline().strip()))
r.close()
# print(list_msg)
hmm = []
for msg in list_msg[:1]:
    for k in range(3,101):
   	 ss = pow(a_pub, k, p) % 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
   	 key = long_to_bytes(ss)
   	 while (len(key) != 16):
   		 key += '\x01'
   	 tmp = decrypt(msg[16:],key,msg[:16])
   	 flag = ""
   	 for i in tmp:
   		 if(i in sp):
   			 flag += i
   	 if(flag=='87d&'):
   		 break
flag = []
for msg in list_msg:
    tmp = decrypt(msg[16:],key,msg[:16])
    tmp2 = ""
    for i in tmp:
   	 if(i in sp):
   		 tmp2 += i
    flag.append(tmp2)
print(flag)
# print(list_msg)
```

Output

```
['87d&', "87d'2", '6>p<c/c', '=(l#a', '6uO2nDfm1=Bkq9&@3BW&@rc.&56', '=(lLpA8c%#DC9NKCh[Zr56', ":2+3L/g*_.BOQ'q+EV:2F!,(2@:q1", '=(l#a56', '6VgEQ7R^6T0f+/5An3YW1c@1!', "88W2r+A-ctF<G[=AKYT!EcZ=F1,'h\\BOPpi@ru:&F$B", "8LJ?tE,oN3FEo!MF`M%9H#IgJBOQ'q+EV:.+ED%7F8", '=_2#T/0JP@@:re"0KM*G>l', '8K_\\TG%De<BOr;uCggs\\2D@0t+EVO?/hSa', ':MVL(8K`4kCht58ASu$$BlkJ+AoqU)+F.mJ/g*Z&+E)-M', '1GE8q0f:XC2DR7%@:h?\'2`!:"1HAu\'1H9d', '1,r\\s@P^#%2*#8*An*\\P0Ocjn@l.XL2e?JY@:V;R2)-jB3Ab/(', ':2+3L/0K.J+D>2,AKZ).AKYT$@:p^#Dg*?', '8K_\\bE+L/*@:O(aEcW@5@;]t$F<GX9AKZ).Blbm', '<+oue+Cf(nDJj$%+DGm>F(Jj(Eb-A6BkM+$56', '=_2#T/c', '8K_\\bE+L/;DfmFJAKZ#-B4uB>', '8K_\\bE+L/5D_;', ':MV(pBOu&', '6@!,p', '6@!,', '@X2M', '87d&', "87d'2", '6>p<c/c', '=(l#a', '6uO2nDfm1=Bkq9&@3BW&@rc.&56', '=(lLpA8c%#DC9NKCh[Zr56', ":2+3L/g*_.BOQ'q+EV:2F!,(2@:q1", '=(l#a56', '6VgEQ7R^6T0f+/5An3YW1c@1!', "88W2r+A-ctF<G[=AKYT!EcZ=F1,'h\\BOPpi@ru:&F$B", "8LJ?tE,oN3FEo!MF`M%9H#IgJBOQ'q+EV:.+ED%7F8", '=_2#T/0JP@@:re"0KM*G>l', '8K_\\TG%De<BOr;uCggs\\2D@0t+EVO?/hSa', ':MVL(8K`4kCht58ASu$$BlkJ+AoqU)+F.mJ/g*Z&+E)-M', '1GE8q0f:XC2DR7%@:h?\'2`!:"1HAu\'1H9d', '1,r\\s@P^#%2*#8*An*\\P0Ocjn@l.XL2e?JY@:V;R2)-jB3Ab/(', ':2+3L/0K.J+D>2,AKZ).AKYT$@:p^#Dg*?', '8K_\\bE+L/*@:O(aEcW@5@;]t$F<GX9AKZ).Blbm', '<+oue+Cf(nDJj$%+DGm>F(Jj(Eb-A6BkM+$56', '=_2#T/c', '8K_\\bE+L/;DfmFJAKZ#-B4uB>', '8K_\\bE+L/5D_;', ':MV(pBOu&', '6@!,p', '6@!,', '@X2M', '87d&', "87d'2", '6>p<c/c', '=(l#a', '6uO2nDfm1=Bkq9&@3BW&@rc.&56', '=(lLpA8c%#DC9NKCh[Zr56', ":2+3L/g*_.BOQ'q+EV:2F!,(2@:q1", '=(l#a56', '6VgEQ7R^6T0f+/5An3YW1c@1!', "88W2r+A-ctF<G[=AKYT!EcZ=F1,'h\\BOPpi@ru:&F$B", "8LJ?tE,oN3FEo!MF`M%9H#IgJBOQ'q+EV:.+ED%7F8", '=_2#T/0JP@@:re"0KM*G>l', '8K_\\TG%De<BOr;uCggs\\2D@0t+EVO?/hSa', ':MVL(8K`4kCht58ASu$$BlkJ+AoqU)+F.mJ/g*Z&+E)-M', '1GE8q0f:XC2DR7%@:h?\'2`!:"1HAu\'1H9d', '1,r\\s@P^#%2*#8*An*\\P0Ocjn@l.XL2e?JY@:V;R2)-jB3Ab/(', ':2+3L/0K.J+D>2,AKZ).AKYT$@:p^#Dg*?', '8K_\\bE+L/*@:O(aEcW@5@;]t$F<GX9AKZ).Blbm', '<+oue+Cf(nDJj$%+DGm>F(Jj(Eb-A6BkM+$56', '=_2#T/c', '8K_\\bE+L/;DfmFJAKZ#-B4uB>', '8K_\\bE+L/5D_;', ':MV(pBOu&', '6@!,p', '6@!,', '@X2M', '87d&', "87d'2"]
```

<figure><img src="https://lh7-us.googleusercontent.com/URhGuETaZCsZ2pxa75Qp2HvLq9REjM0SqcohawcV9oIVMKGJLkd1Hkm6KRF_IUKyM0sSR0bTroh7-6XscMgHlkELYZP6ndCs0BwKRBuwj1OAZ3NQ3Rpe_TD_2fxJmT9oWYlKBl2kemDMPFnt3uekGA" alt=""><figcaption></figcaption></figure>

Didapatkan output aneh , cukup lama stuck disini karena kami tidak memisahkan setiap percakapannya dan langsung melakukan decode secara keseluruhan. Namun untungnya kami sempat mencoba di cyberchef dan terlihat bahwa ada beberapa string yang terbaca ketika menggunakan base85 decode , kemudian kami sadar ternyata harusnya di decode per percakapan ( tidak berkelanjutan ) . Jadi decode saja sampai ketemu flagnya

<figure><img src="https://lh7-us.googleusercontent.com/q5gtS04Kns5YdC_Sw6n0YR6McEEp1E8wUpSm3xtf3ypnD6GNzStbQLdL0oCFOtKzDq4KPCdWsy7xQqJQiIlcjMDZeT8URe-kLOl2-H6e-UUfTW1wZmlP3PnoOCegkU17xweVGV5U-eLP0Y0jyGlOCw" alt=""><figcaption></figcaption></figure>

<br>

<figure><img src="https://lh7-us.googleusercontent.com/-yqQNcOy_fg37v7zaSC7MCOkzCmI-bDbDzau8zgo5pmuj4kTiXNxW7Q8sRZ2MVwY5wM8Y4Yl_x9QzQwecPRAK7rWedqug9X9qwYOY_jlO5W_vok6pctDGY_pJiiH6tHyC9VI7twcdQg1tcV9CcAqqg" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/qpfr5MLhs0ysK34J-G2GLbsgi-oQcDKMJ-gLdgAitTuVcj_KVH_oxNeF_SdgZ9AO1P5rZaq3750X99EJWvhdpAZtaooSvOxHizLR479KIAC34SCqMWJwMWVzqeYO4X_4SVQG3hFBiumgiqA-6xcdVQ" alt=""><figcaption></figcaption></figure>

Flag : COMPFEST13{4fd29464a28a1b39559f4fc500b41c4b17ec8ad74512394a830b51506628caf4\_734b39d538}

## You AES Me Up (482 pts)

### Description

\-

### Solution

Diberikan source code sebagai berikut

```python
#!/usr/bin/env python3
import sys
import os
import random
import binascii
from Crypto.Cipher import AES
from Crypto.Util.number import long_to_bytes, bytes_to_long
from secret import FLAG

IV = os.urandom(AES.block_size)
KEY = os.urandom(AES.block_size)

class Unbuffered(object):
	def __init__(self, stream):
    	self.stream = stream
	def write(self, data):
    	self.stream.write(data)
    	self.stream.flush()
	def writelines(self, datas):
    	self.stream.writelines(datas)
    	self.stream.flush()
	def __getattr__(self, attr):
    	return getattr(self.stream, attr)

sys.stdout = Unbuffered(sys.stdout)

def pad(msg):
	return msg + (chr(16 - len(msg) % 16) * (16 - len(msg) % 16)).encode()

def get_flag():
	flag = pad(FLAG)
	cipher = AES.new(IV, AES.MODE_ECB)
	flag = cipher.encrypt(flag)

	enc = b''
	flag = pad(flag)
	iv = IV
	for i in range(0, len(flag), 16):
    	cipher = AES.new(KEY, AES.MODE_CBC, iv)
    	enc += cipher.encrypt(flag[i:i+16])
    	iv = long_to_bytes(bytes_to_long(enc[i:i+16]) ^ bytes_to_long(flag[i:i+16]))
	print('flag (in hex) =', binascii.hexlify(enc).decode())

def encrypt():
	msg = input('msg (in hex) = ')
	if (len(msg) % 2 != 0):
    	print('Invalid input!')
    	return
	msg = binascii.unhexlify(msg.encode())
	cipher = AES.new(KEY, AES.MODE_CBC, IV)
	enc = cipher.encrypt(pad(msg))
	print('enc (in hex) =', binascii.hexlify(enc).decode())

def decrypt():
	enc = input('enc (in hex) = ')
	if (len(enc) % 32 != 0):
    	print('Invalid input!')
    	return
	enc = binascii.unhexlify(enc.encode())
	cipher = AES.new(KEY, AES.MODE_CBC, IV)
	msg = cipher.decrypt(enc)
	print('msg (in hex) =', binascii.hexlify(msg).decode())

def menu():
	print('1. Get encrypted flag')
	print('2. Encrypt a message')
	print('3. Decrypt a message')
	print('4. Exit')

if __name__ == '__main__':
	while True:
    	try:
        	menu()
        	choice = input('> ')
        	if choice == '1':
            	get_flag()
        	elif (choice == '2'):
            	encrypt()
        	elif (choice == '3'):
            	decrypt()
        	elif (choice == '4'):
            	print('Bye.')
            	break
        	else:
            	print('Invalid input!')
    	except:
        	print('Something went wrong.')
        	break
```

Setelah kami lakukan analisis kami menemukan 2 bug , yang pertama kita bisa leak iv , iv nya digunakan berulang kali. Untuk mudahnya encrypt satu block null byte lalu decrypt null byte + enc(null byte) -> otomatis bakal melakukan xor null byte dengan hasil decrypt null byte ( harusnya di xor dengan iv biar null byte hasilnya , tapi malah di xor dengan null byte jadinya dapat iv ). Yang kedua ada ini baru sadar setelah coba coba running filenya + debug nilainya , ternyata hasil enkripsi flag di padding , jadi kita tau nilai akhir dari flag hasil padding , yaitu “\x10”\*16 . Jadi tinggal balik aja prosesnya&#x20;

```python
Block = block[::1] Urutan block dibalik

dec(enc(block[i]),iv)^iv -> biar dapet nilai asli dari dec (tanpa xor iv)
dec(enc(block[i]),iv)^iv^known_plain -> dapet nilai iv yang digunain buat encrypt di looping ke-i
dec(enc(block[i]),iv)^iv^known_plain^block[i+1] -> dapet plaintext ( value flag )

```

berikut solver yang kami gunakan

```python
from Crypto.Util.strxor import strxor
from pwn import *
from Crypto.Cipher import AES

r = remote("103.152.242.242",5592)
r.recvuntil(">")
r.sendline("2")
r.recvuntil(" = ")
r.sendline("00"*16)
r.recvuntil(" = ")
leak_enc = r.recvline().strip()
r.recvuntil(">")
r.sendline("3")
r.recvuntil(" = ")
r.sendline("00"*16+leak_enc)
r.recvuntil(" = ")
tmp = r.recvline().strip()
iv = tmp[32:64].decode('hex')
# print(iv)
r.sendline("1")
r.recvuntil(" = ")
enc_flag = r.recvline().strip()
list_enc = []
for i in range(0,len(enc_flag),32):
    list_enc.append(enc_flag[i:i+32])
known_plain = "10101010101010101010101010101010".decode('hex')
list_enc = list_enc[::-1]
list_flag = []
for i in range(len(list_enc)-1):
    r.recvuntil(">")
    r.sendline("3")
    r.recvuntil(" = ")
    r.sendline(list_enc[i])
    r.recvuntil(" = ")
    tmp_dec = r.recvline().strip()
    tmp_dec = tmp_dec.decode('hex')
    tmp_iv = strxor(strxor(known_plain,tmp_dec),iv)
    known_plain = strxor(tmp_iv,list_enc[i+1].decode('hex'))
    list_flag.append(known_plain)
cipher = AES.new(iv, AES.MODE_ECB)
res = ""
for i in list_flag[::-1]:
    res += cipher.decrypt(i)
print res
```

<figure><img src="https://lh7-us.googleusercontent.com/B5OtoG2cPy1-bZ9Udhtpjm82CMiPLyKdUmvZqXC9mmYK7PHxfTBf2Q29YHOpvu3ZcJjg7BqS_c3MNJ4iirgUcAQdETDr1_-UXNPVOwVBaF4YP8MmKyScOFQsJV1uBm5eTIxZQtbvvmma08SZkxZOXw" alt=""><figcaption></figcaption></figure>

Flag : COMPFEST13{Y0u\_aes\_me\_Uppppppp\_\_\_\_\_t0\_c0dE\_on\_st0rmy\_Seaaaas\_\_\_\_e0212d1a34}
