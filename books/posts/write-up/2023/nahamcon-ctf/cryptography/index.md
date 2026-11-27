# Cryptography

| Challenge                  | Link                              |
| -------------------------- | --------------------------------- |
| RSA Outro (n solves)       | [Here](#rsa-outro-n-solves)       |
| Just One More (n solves)   | [Here](#just-one-more-n-solves)   |
| ForgeMe 1 (n solves)       | [Here](#forgeme-1-n-solves)       |
| ForgeMe 2 (n solves)       | [Here](#forgeme-2-n-solves)       |
| Signed Jeopardy (n solves) | [Here](#signed-jeopardy-n-solves) |

## RSA Outro (n solves)

### Description

\-

### Solution

We have `p = 2*q + 1`, so&#x20;

$$
\begin{gathered}
p*q = 2*q^2 + q\\
\frac{p*q}{2} = q^2 + \frac{q}{2}
\end{gathered}
$$

With those equation , we can get number close with `q` by doing integer square root on `(p*q)/2` . Here is implemented script i used

```python
from Crypto.Util.number import *
import gmpy2

e = 65537
d = 53644719720574049009405552166157712944703190065471668628844223840961631946450717730498953967365343322420070536512779060129496885996597242719829361747640511749156693869638229201455287585480904214599266368010822834345022164868996387818675879350434513617616365498180046935518686332875915988354222223353414730233
phi = 245339427517603729932268783832064063730426585298033269150632512063161372845397117090279828761983426749577401448111514393838579024253942323526130975635388431158721719897730678798030368631518633601688214930936866440646874921076023466048329456035549666361320568433651481926942648024960844810102628182268858421164
ct = 37908069537874314556326131798861989913414869945406191262746923693553489353829208006823679167741985280446948193850665708841487091787325154392435232998215464094465135529738800788684510714606323301203342805866556727186659736657602065547151371338616322720609504154245460113520462221800784939992576122714196812534

q = gmpy2.iroot(phi//2, 2)[0]
q = gmpy2.next_prime(q)

p = 2*q + 1

assert((p-1)*(q-1) == phi)

n = p*q

print(long_to_bytes(pow(ct,d,n)))
```

## Just One More (n solves)

### Description

\-

### Solution

Since we know all values used in multiplication with flag we can use z3 to get the flag. So we just need to change the flag value with `Int('x{}')` to make z3 find those values. Here is script that i used during the competition &#x20;

```python
from z3 import *

init = [12407953253235233563, 3098214620796127593, 18025934049184131586, 14516706192923330501, 13439587873423175563, 17668371729629097289, 4983820371965098250, 1941436363223653079, 15491407246309500298, 8746935775477023498, 911995915798699052, 16286652540519392376, 13788248038504935294, 18140313902119960073, 11357802109616441330, 2498891881524249135, 9088680937359588259, 14593377776851675952, 2870989617629497346, 18249696351449250369, 2029516247978285970, 14734352605587851872, 8485311572815839186, 8263508188473851570, 14727305307661336083, 6229129263537323513, 17136745747103828990, 8565837800438907855, 17019788193812566822, 9527005534132814755, 1469762980661997658, 16549643443520875622, 9455193414123931504, 12209676511763563786, 271051473986116907, 17058641684143308429, 13420564135579638218, 7599871345247004229]
s_arr = [35605255015866358705679, 36416918378456831329741, 35315503903088182809184, 36652502430423040656502, 34898639998194794079275, 36303059177758553252637, 35047128751853183340357, 36513205019421922844286, 35188395228735536982649, 35301216188296520201752, 35877364908848326577377, 35548407875093684038138, 36846989992339836295226, 35424096673112978582599, 35435941095923989701820, 35884660233631412675912, 35250569480372437220096, 36071512852625372107309, 35636049634203159168488, 35407704890518035619865, 35691117250745693469087, 35942285968400856168658, 35659245396595333737528, 34682110547383898878610, 36251061019324605768432, 34350337346574061914637, 36706069443188806905153, 35296365364968284652906, 34767397368306249667499, 37665777691001951216694, 33927027243025444519647, 37464577169642287783563, 34818703279589326375333, 35526731706613463585509, 36698165076109278070662, 34612009622491263626134, 37224659068886403545747]

a = [Int("x{}".format(i)) for i in range(len(init))]

s = Solver()

for i in range(len(a)):
	s.add(a[i] < 255)

l = len(init)

for i in range(len(init) - 1):
    s_i = Sum([ init[j]*a[j] for j in range(l)])
    s.add(s_i == s_arr[i])
    
    init = [init[-1]] + init[:-1]

print(s.check())

model = s.model()
flag = ""
for i in a:
    flag += chr(model[i].as_long())
print(flag)
```

## ForgeMe 1 (n solves)

### Description

\-

### Solution

The idea is doing `hash length extension attack` on `sha1`. In this case i used `hashpump` command line because hashpump python library doesn't work on my machine. Nothing special since we just need to `add random value` to make our new value not available in `queries`. Because we need to include `first_part` in our value, we can use `mac_query` function to get the signature first and add random value on it. Here is solver i used to implement the idea &#x20;

```python
from pwn import *
import sys
import subprocess


def forge(known_hash, known_data, additional_data, key_length):
	output = subprocess.check_output(['hashpump', '-s', known_hash, '-d', known_data, '-a', additional_data, '-k', key_length]).decode().split("\n")
	hmac = output[0]
	exec(f"global val;val = b'{output[1]}'")
	return val, hmac

def sign(payload):
	r.recvuntil(b": ")
	r.sendline(b"1")
	r.recvuntil(b": ")
	r.sendline(payload.hex().encode())
	r.recvuntil(b": ")
	return r.recvline().strip().decode()

def verify(payload, signature):
	r.recvuntil(b": ")
	r.sendline(b"2")
	r.recvuntil(b": ")
	r.sendline(payload.hex().encode())
	r.recvuntil(b": ")
	r.sendline(signature)
	return r.recvline()

def get_flag(payload, signature):
	r.recvuntil(b": ")
	r.sendline(b"3")
	r.recvuntil(b": ")
	r.sendline(payload.hex().encode())
	r.recvuntil(b": ")
	r.sendline(signature)
	return r.recvline()

# r = remote("127.0.0.1", 1234)
r = remote("challenge.nahamcon.com", 31337)
payload = b"I guess you are just gonna have to include this!"
kh = sign(payload)

new_payload, new_signature = forge(kh, payload.decode(), 'A'*8, '64')
resp = verify(new_payload, new_signature.encode())
resp = get_flag(new_payload, new_signature.encode())
print(resp)
r.interactive()
```

## ForgeMe 2 (n solves)

### Description

\-

### Solution

The idea is same like `forge1` , but we need to brute the `key length`. Here is solver i used during the competition

```python
from pwn import *
import sys
import subprocess


def forge(known_hash, known_data, additional_data, key_length):
	output = subprocess.check_output(['hashpump', '-s', known_hash, '-d', known_data, '-a', additional_data, '-k', key_length]).decode().split("\n")
	hmac = output[0]
	exec(f"global val;val = b'{output[1]}'")
	return val, hmac

def sign(payload):
	r.recvuntil(b": ")
	r.sendline(b"1")
	r.recvuntil(b": ")
	r.sendline(payload.hex().encode())
	r.recvuntil(b": ")
	return r.recvline().strip().decode()

def verify(payload, signature):
	r.recvuntil(b": ")
	r.sendline(b"2")
	r.recvuntil(b": ")
	r.sendline(payload.hex().encode())
	r.recvuntil(b": ")
	r.sendline(signature)
	return r.recvline().strip()

def get_flag(payload, signature):
	r.recvuntil(b": ")
	r.sendline(b"3")
	r.recvuntil(b": ")
	r.sendline(payload.hex().encode())
	r.recvuntil(b": ")
	r.sendline(signature)
	return r.recvline()

INJECTION = b'https://www.youtube.com/@_JohnHammond'
# r = remote("127.0.0.1", 1234)
r = remote("challenge.nahamcon.com", 31337)

r.recvuntil(b"first_part: ")
payload = r.recvline().strip()
payload += INJECTION

kh = sign(payload)

for i in range(10,121):
	new_payload, new_signature = forge(kh, payload.decode(), 'A'*8, str(i))
	resp = verify(new_payload, new_signature.encode())
	print(i, resp)
	if(resp == b'True'):
		break

resp = get_flag(new_payload, new_signature.encode())
print(resp)
r.interactive()
```

## Signed Jeopardy (n solves)

### Description

\-

### Solution

We know that r\*d is static, d is generated at initial run and r is calculated from k and G which is generated at initial run also. By using two different message we have

$$
\begin{gathered}
s_1 = (h(m_1) + r*d) * k^{-1}\\
s_2 = (h(m_2) + r*d) * k^{-1}\\
s_1 - s_2 = (h(m_1) - h(m_2)) * k^{-1}
\end{gathered}
$$

Since we can get value of h(m1) and h(m2) we can leak k using equation below

$$
\begin{gathered}
(s_1 - s_2)^{-1} = (h(m_1) - h(m_2))^{-1} * k\\
k = (h(m_1) - h(m_2)) * (s_1 - s_2 )^{-1}
\end{gathered}
$$

After getting value for k , we can get value for other unknown value which is d. To get value of d we can use equation below

$$
\begin{gathered}
s_1 = (h(m_1) + r*d) * k^{-1}\\
s_1 * k = (h(m_1) + r*d)\\
s_1 * k - h(m_1) * r^{-1} = d
\end{gathered}
$$

Last step just sign new value using leaked value. Here is solver i used during competition

```python
from pwn import *
from Crypto.Util.number import *
import hashlib

def get_sign():
	r.recvuntil(b"Quit")
	r.sendline(b"1")
	r.recvuntil(b"Here is the question: ")
	quest = r.recvline().strip().decode()
	print(quest)
	for i in questions:
		if(i == quest):
			r.recvuntil(b"And here is the signature: (")
			tmp = r.recvline().strip().decode().split(", ")
			r1 = tmp[0]
			s1 = tmp[1][:-1]
			return r1, s1, questions.index(quest)
	return 0,0,0

def get_flag(answer, r1, s):
	r.recvuntil(b"Quit")
	r.sendline(b"2")
	r.recvuntil(b"message")
	r.sendline(answer)
	r.recvuntil(b"signature")
	r.sendline(r1)
	r.recvuntil(b"signature")
	r.sendline(s)
	print(r.recvline())
	print(r.recvline())
	print(r.recvline())
	print(r.recvline())
	# return r.recvline()

questions = ["This game featured on the NES featured a character who rides on balloons.", "The annoying little deku fairy who helps The Hero Of Time through his quest to defeat Ganondorf and save Zelda."]
answers = ["Balloon Fight", "Navi"]
list_s = []
list_h = []

# r = process(["sage", "server.sage"])
r = remote("challenge.nahamcon.com", 31337)
while len(list_s) != 2:
	r1, s1, ind = get_sign()
	print(ind)
	if(r1 != 0):
		if(int(s1) not in list_s):
			list_s.append(int(s1))
			ans = "What is "+answers[ind].upper()+"?"
			hsh = int(hashlib.sha512(ans.encode()).hexdigest(), 16)
			list_h.append(hsh)

print(list_h)
print(list_s)
print(r1)

n = 6864797660130609714981900799081393217269435300143305409394463459185543183397655394245057746333217197532963996371363321113864768612440380340372808892707005449
r1 = int(r1)
m_h_diff = (list_h[0] - list_h[1]) % n
r_inv = inverse(r1, n)

answer = "kosong"
payload = int(hashlib.sha512(answer.encode()).hexdigest(), 16)

for k_try in (list_s[0] - list_s[1], list_s[0] + list_s[1], -list_s[0] - list_s[1], -list_s[0] + list_s[1]):
	try:
		k = ( m_h_diff * inverse(k_try, n) ) % n
		d = ((((list_s[0] * k % n) - list_h[0]) % n ) * r_inv ) % n
		s = ((payload + (r1*d))*inverse(k,n))%n
		resp = get_flag(answer.encode(), str(r1).encode(), str(s).encode())
		print(r1, s)
	except Exception as e:
		print(e)
		continue

r.interactive()
```
