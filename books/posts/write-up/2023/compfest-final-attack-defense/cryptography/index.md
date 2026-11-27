# Cryptography

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>is_admin=True</td><td><a href="#is_admin-true">Here</a></td></tr></tbody></table>

## is\_admin=True

### Description

\-

### Solution

#### Exploit

Diberikan source code sebagai berikut

```python
from hashlib import sha256
import random
import os

p = 69278042787891942769502075928585090381290090384778024990006411012262963663859
g = 2
m = 4267738774321166375026693303590202006447685928119906506624384544530089122661922193
a = 1872159875735606573086019350365709191427276692069413859597107145760799047673904037
c = 3852523496907343703707599716820831623137858734069135383774172801943851091960152572

class LCG:
    def __init__(self, m,a,c, seed):
        self.m = m
        self.a = a
        self.c = c
        self.state = seed

    def next(self):
        self.state = (self.a * self.state + self.c) % self.m
        return self.state >> 16

class TokenGenerator:
    def __init__(self, p,g,m,a,c):
        self.p = p
        self.g = g
        self.x = random.randint(1,p)
        self.lcg = LCG(m,a,c, random.randint(1, m))

    def next(self):
        k = self.lcg.next()
        self.x = pow(self.g, k, self.p) * self.x % self.p
        return self.x

class Server:
    def __init__(self):
        self.users = {}
        self.sessions = {}
        self.token_generator = TokenGenerator(p,g,m,a,c)
        self.user = None

    def generate_token(self):
        x = self.token_generator.next()
        return hex(x)

    def register(self, username, password, is_admin=False):
        if username in self.users:
            print("[x] Username already exists")
            return
        token = self.generate_token()
        self.sessions[token] = username
        self.users[username] = {
            "username": username,
            "password": sha256(password.encode()).hexdigest(),
            "token": token,
            "is_admin": is_admin,
        }
        return token

    def get_token(self, username, password):
        if username not in self.users:
            print("[x] Invalid username")
            return
        if self.users[username]["password"] != sha256(password.encode()).hexdigest():
            print("[x] Invalid password")
            return

        token = self.generate_token()
        self.sessions[token] = username
        self.users[username]["token"] = token
        return token

    def set_token(self, token):
        if token not in self.sessions:
            print("[x] Invalid token")
            return
        self.user = self.users[self.sessions[token]]
        print("Welcome, " + self.user["username"])

    def get_flag(self):
        if self.user is None:
            print("You must login first")
            return
        if not self.user["is_admin"] == True: # <-- is_admin=true??
            print("Only admin can access the flag")
            return
        
        print(open("/flag/flag.txt").read())

print("=" * 100)
print(f"p = {p}")
print(f"g = {g}")
print(f"m = {m}")
print(f"a = {a}")
print(f"c = {c}")
print("=" * 100)

server = Server()
server.register("admin", os.getenv("PASSWORD"), True)
server.register("john doe", "password2", False)
server.register("jane doe", "password3", False)


def menu():
    print("=" * 100)
    print("1. Register")
    print("2. Get Token")
    print("3. Set Token")
    print("4. Get flag")
    print("5. Exit")
    return int(input("choose option: "))


print("Welcome to the server!")
while True:
    choice = menu()
    if choice == 1:
        username = input("Username: ")
        password = input("Password: ")
        token = server.register(username, password)
        if token:
            print(f"Your token: {token}")
    elif choice == 2:
        username = input("Username: ")
        password = input("Password: ")
        token = server.get_token(username, password)
        if token:
            print(f"Your token: {token}")
    elif choice == 3:
        token = input("Token: ")
        server.set_token(token)
    elif choice == 4:
        server.get_flag()
    elif choice == 5:
        print("Bye!")
        break

```

TokenGenerator intinya melakukan generate lcg lalu menghasilkan token dengan cara g^k \* x untuk nilai k adalah nilai lcg dan nilai x adalah token sebelumnya atau nilai random (initial). Jadi untuk mendapatkan token dari admin kita bisa lakukan flow sebagai berikut

* Generate ulang nilai token admin karena sudah mengetahui state dan x (token)
* Nilai k bisa didapatkan dengan discrete log karena p smooth
* Lakukan multiplicative inverse untuk dapat nilai g^k % p
* Login 2 kali sebagai john doe untuk dapat tokennya

Berikut solver yang kami gunakan

```python
#!/usr/bin/env sage

from pwn import * 
from Crypto.Util.number import *
import sys
import os

def attack(y, k, s, m, a, c):
    """
    Recovers the states associated with the outputs from a truncated linear congruential generator.
    More information: Frieze, A. et al., "Reconstructing Truncated Integer Variables Satisfying Linear Congruences"
    :param y: the sequential output values obtained from the truncated LCG (the states truncated to s most significant bits)
    :param k: the bit length of the states
    :param s: the bit length of the outputs
    :param m: the modulus of the LCG
    :param a: the multiplier of the LCG
    :param c: the increment of the LCG
    :return: a list containing the states associated with the provided outputs
    """
    diff_bit_length = k - s

    # Preparing for the lattice reduction.
    delta = c % m
    y = vector(ZZ, y)
    for i in range(len(y)):
        # Shift output value to the MSBs and remove the increment.
        y[i] = (y[i] << diff_bit_length) - delta
        delta = (a * delta + c) % m

    # This lattice only works for increment = 0.
    B = matrix(ZZ, len(y), len(y))
    B[0, 0] = m
    for i in range(1, len(y)):
        B[i, 0] = a ** i
        B[i, i] = -1

    B = B.LLL()

    # Finding the target value to solve the equation for the states.
    b = B * y
    for i in range(len(b)):
        b[i] = round(QQ(b[i]) / m) * m - b[i]

    # Recovering the states
    delta = c % m
    x = list(B.solve_right(b))
    for i, state in enumerate(x):
        # Adding the MSBs and the increment back again.
        x[i] = int(y[i] + state + delta)
        delta = (a * delta + c) % m

    return x

def regist(username, password):
	r.recvuntil(b"option: ")
	r.sendline(b"1")
	r.recvuntil(b"Username: ")
	r.sendline(username)
	r.recvuntil(b"Password: ")
	r.sendline(password)
	r.recvuntil(b"Your token: ")
	token = int(r.recvline().strip().decode(),16)
	return token

def login(username, password):
	r.recvuntil(b"option: ")
	r.sendline(b"2")
	r.recvuntil(b"Username: ")
	r.sendline(username)
	r.recvuntil(b"Password: ")
	r.sendline(password)
	r.recvuntil(b"Your token: ")
	token = int(r.recvline().strip().decode(),16)
	return token

ip = sys.argv[1]

r = remote(ip, int(50004))
r.recvuntil(b"p = ")
p = int(r.recvline().decode().strip())
r.recvuntil(b"g = ")
g = int(r.recvline().decode().strip())
r.recvuntil(b"m = ")
m = int(r.recvline().decode().strip())
r.recvuntil(b"a = ")
a = int(r.recvline().decode().strip())
r.recvuntil(b"c = ")
c = int(r.recvline().decode().strip())

if(m != 4267738774321166375026693303590202006447685928119906506624384544530089122661922193 or p != 69278042787891942769502075928585090381290090384778024990006411012262963663859):
    exit()


username = b"john doe"
password = b"password2"
y = []
token1 = login(username, password)
token2 = login(username, password)
token3 = login(username, password)

g1 = Mod(2, p)

gkp = inverse(token1, p) * token2
y.append(discrete_log(gkp,g1))

gkp = inverse(token2, p) * token3
y.append(discrete_log(gkp,g1))

k = 271
s = 255

list_state = attack(y, k, s, m, a, c)

for i in range(3):
	k = (((list_state[0] - c ) * inverse(a, m)) % m)
	list_state.insert(0, k)

list_x = [token1, token2, token3]

for i in range(3):
	new_x = (list_x[0] * inverse(pow(g, list_state[2 - i] >> 16, p), p))%p
	list_x.insert(0, new_x)

r.recvuntil(b"option: ")
r.sendline(b"3")
r.recvuntil(b"Token: ")
r.sendline(hex(list_x[0]).encode())
r.recvuntil(b"option: ")
r.sendline(b"4")
print(r.recvline().strip().decode(), flush=True)
r.close()

```

#### Patching

Patching yang dilakukan adalah dengan melakukan perubahan terhadap p dan m dengan strong prime, berikut untuk patch yang diimplementasi.

```python
from hashlib import sha256
import random
import os

p = 28952647841308909269621833267645540813923816053722153826289301924999333975928896957179767092359509824355232814941347849551776965418137320339601906230282605594626237498752828145255589306309199485972897747710200521090486640719956082408562332744778767163030676864747306290834058185412835555997245698931634481293469986945016639304887198130326321012590709317025628821727318888569661590445928105140417820553266128980155518948472369598427185397761897457811418641433812768636207567944001166960240695174113089294317062878260104214348742827688597787318015273359751774467162937353388062956924818911652362606302919071776598499731
g = 2
m = 23322999113566101166114868124251825777365249360854342284449108846057303452231680280816276323545317723530798105085775063547649502566177099584656749522730458778431643207849601139934044213540531482786160671227007312005845732423057563401780925301182577005723978598069967606433875464655042765896069375797207954898058844109743672092024959235213634452809303282814155344147049128759319214396832414040370797209682104576109966781362622017838989976748426416664284714756136603330385027960471417902560636197303489555416069538245512300869624770713471348308348195927404882994404686461451427816100230103666860295624396647517406817593
a = 1872159875735606573086019350365709191427276692069413859597107145760799047673904037
c = 3852523496907343703707599716820831623137858734069135383774172801943851091960152572

class LCG:
    def __init__(self, m,a,c, seed):
        self.m = m
        self.a = atar
        self.c = c
        self.state = seed

    def next(self):
        self.state = (self.a * self.state + self.c) % self.m
        return self.state >> 16

class TokenGenerator:
    def __init__(self, p,g,m,a,c):
        self.p = p
        self.g = g
        self.x = random.randint(1,p)
        self.lcg = LCG(m,a,c, random.randint(1, m))

    def next(self):
        k = self.lcg.next()
        self.x = pow(self.g, k, self.p) * self.x % self.p
        return self.x

class Server:
    def __init__(self):
        self.users = {}
        self.sessions = {}
        self.token_generator = TokenGenerator(p,g,m,a,c)
        self.user = None

    def generate_token(self):
        x = self.token_generator.next()
        return hex(x)

    def register(self, username, password, is_admin=False):
        if username in self.users:
            print("[x] Username already exists")
            return
        token = self.generate_token()
        self.sessions[token] = username
        self.users[username] = {
            "username": username,
            "password": sha256(password.encode()).hexdigest(),
            "token": token,
            "is_admin": is_admin,
        }
        return token

    def get_token(self, username, password):
        if username not in self.users:
            print("[x] Invalid username")
            return
        if self.users[username]["password"] != sha256(password.encode()).hexdigest():
            print("[x] Invalid password")
            return

        token = self.generate_token()
        self.sessions[token] = username
        self.users[username]["token"] = token
        return token

    def set_token(self, token):
        if token not in self.sessions:
            print("[x] Invalid token")
            return
        self.user = self.users[self.sessions[token]]
        print("Welcome, " + self.user["username"])

    def get_flag(self):
        if self.user is None:
            print("You must login first")
            return
        if not self.user["is_admin"] == True: # <-- is_admin=true??
            print("Only admin can access the flag")
            return
        
        print(open("/flag/flag.txt").read())

print("=" * 100)
print(f"p = {p}")
print(f"g = {g}")
print(f"m = {m}")
print(f"a = {a}")
print(f"c = {c}")
print("=" * 100)

server = Server()
server.register("admin", os.getenv("PASSWORD"), True)
server.register("john doe", "password2", False)
server.register("jane doe", "password3", False)


def menu():
    print("=" * 100)
    print("1. Register")
    print("2. Get Token")
    print("3. Set Token")
    print("4. Get flag")
    print("5. Exit")
    return int(input("choose option: "))


print("Welcome to the server!")
while True:
    choice = menu()
    if choice == 1:
        username = input("Username: ")
        password = input("Password: ")
        token = server.register(username, password)
        if token:
            print(f"Your token: {token}")
    elif choice == 2:
        username = input("Username: ")
        password = input("Password: ")
        token = server.get_token(username, password)
        if token:
            print(f"Your token: {token}")
    elif choice == 3:
        token = input("Token: ")
        server.set_token(token)
    elif choice == 4:
        server.get_flag()
    elif choice == 5:
        print("Bye!")
        break
```
