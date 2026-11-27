# Cryptography

| Challenge                         | Link                                  |
| --------------------------------- | ------------------------------------- |
| My\_beloved\_LCG.py (3 solves) 🥈 | [Here](#my_beloved_lcg.py-495-points) |

## My\_beloved\_LCG.py (3 solves)

### Description

Given challenge as below

```python
from Crypto.Util.number import long_to_bytes ,getPrime
from random import randint,shuffle
import json
# from banner import banner

class LCG:
    def __init__(self,m, seed):
        self.a = randint(1,m)
        self.b = randint(1,m)
        self.m = m
        self.state = seed
        self.refresh()

    def refresh(self):
        self.state = (self.get_random_bits()*self.get_random_bits())%self.m

    def next_state(self):
        self.state = (self.a * self.state + self.b) % self.m

    def get_random_bits(self):
        self.next_state()
        return (self.state)>>100

    def encrypt(self,msg):
        tmp = self.get_random_bits()
        return long_to_bytes(tmp^int(msg,16)).hex()

banner()

m=8232312959811687665793375850697161475128245885498087244865661043365300427355910967177802992671927606112967162365226385902985055038600150891334303906988843
seed=randint(1,m)
L=LCG(m,seed)
FLAG=open("flag.txt",'rb').read()

for i in range(50):
    try:
        choice=json.loads(input("give a message to encrypt\n"))

        if("option" not in choice):
            print("give me an option")
        else:

            if(choice["option"]=="parameters"):
                print(json.dumps({"M":L.m,"a":L.a,"b":L.b}))
                continue

            if(choice["option"]=="get_flag"):
                print(json.dumps({"enc_flag":L.encrypt(FLAG.hex())}))
                continue

            if choice["option"]=="encrypt" and "msgs" in choice:
                msgs=choice["msgs"]
                if(len(msgs)==20):
                    encyrpted_msgs=[]
                    for i in msgs:
                        encyrpted_msgs.append(L.encrypt(i)) 
                    shuffle(encyrpted_msgs) # swix :)

                    print(json.dumps({"encrypted_msgs":encyrpted_msgs}))
                else:
                    print("give me 64 msgs to encrypt")
                continue

            print("give a valid option")

    except:
        # print("dont try something stupid")
        exit()
```

### Solution

The idea is cracking partial lcg value with minimum known value because there is 20 values generated and shuffled. In this case i can crack lcg using two latest values generated. Here is solver i used during competition

```python
from sage.all import QQ
from sage.all import ZZ
from sage.all import matrix
from sage.all import vector
from pwn import *
import json
from Crypto.Util.number import *
from itertools import permutations

class LCG:
    def __init__(self, seed, a, c, m):
        self.seed = seed
        self.a = a
        self.c = c
        self.m = m

    def next(self):
        self.seed = (self.a * self.seed + self.c) % self.m
        return self.seed

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

def get_param():
	payload = {"option" : "parameters"}
	r.recvuntil(b"to encrypt")
	r.sendline(json.dumps(payload).encode())
	r.recvline()
	return json.loads(r.recvline().strip().decode())

def get_flag():
	payload = {"option" : "get_flag"}
	r.recvuntil(b"to encrypt")
	r.sendline(json.dumps(payload).encode())
	r.recvline()
	return json.loads(r.recvline().strip().decode())

def encrypt(payload):
	payload = {"option" : "encrypt", "msgs" : payload}
	r.recvuntil(b"to encrypt")
	r.sendline(json.dumps(payload).encode())
	r.recvline()
	return json.loads(r.recvline().strip().decode())

def solve(arr, m, a, c, ct):
	for bit_length in range(411,413):
		res = attack(arr, m.bit_length(), bit_length, m, a, c)
		lcg = LCG(int(res[-1]),a,c,m)
		pt = (lcg.next()>>100) ^^ ct
		pt = long_to_bytes(pt)
		if(b"BSidesIndore" in pt): 
			print(arr, bit_length, pt)

# r = process(["python3","My_beloved_LCG.py"])
r = remote("34.30.232.46", int(1111))
resp = get_param()
m = resp['M']
a = resp['a']
c = resp['b']

data = encrypt("A"*20)
print(data)
arr = []
for i in data['encrypted_msgs']:
	arr.append(bytes_to_long(bytes.fromhex(i))^^10)
ct = bytes_to_long(bytes.fromhex(get_flag()['enc_flag']))
r.close()

for i in permutations(arr, int(2)):
	tmp = list(i)
	# print(tmp)
	solve(tmp, m, a, c, ct)
```
