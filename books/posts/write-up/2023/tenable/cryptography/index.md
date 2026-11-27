# Cryptography

<table><thead><tr><th width="355">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>PseudoRandom (328 pts)</td><td><a href="#pseudorandom-328-pts">Here</a></td></tr><tr><td>Quantum Crypto (444 pts)</td><td><a href="#quantum-crypto-444-pts">Here</a></td></tr></tbody></table>

## PseudoRandom (328 pts)

### Description

Given challenge below

```python
import random
import time
import datetime  
import base64

from Crypto.Cipher import AES
flag = b"find_me"
iv = b"\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"

for i in range(0, 16-(len(flag) % 16)):
    flag += b"\0"

ts = time.time()

print("Flag Encrypted on %s" % datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M'))
seed = round(ts*1000)

random.seed(seed)

key = []
for i in range(0,16):
    key.append(random.randint(0,255))

key = bytearray(key)


cipher = AES.new(key, AES.MODE_CBC, iv) 
ciphertext = cipher.encrypt(flag)

print(base64.b64encode(ciphertext).decode('utf-8'))
```

### Solution

So we just need to bruteforce the seed to get valid key then decrypt the ciphertext. Time used as seed was 2023-08-02 10:27 (author local time). Based on time used in ctf (platform) we get the timezone then convert that local time to unix timestamp. Here is script i used to get the flag

```python
import base64
import random
from itertools import product
from Crypto.Cipher import AES

iv = b"\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0"

ts = '16909864'

ct = base64.b64decode('lQbbaZbwTCzzy73Q+0sRVViU27WrwvGoOzPv66lpqOWQLSXF9M8n24PE5y4K2T6Y')
chrset = [str(i) for i in range(10)]
for i in product(chrset, repeat=5):
    tmp_seed = ts + ''.join(i)
    seed = round(int(tmp_seed))
    random.seed(seed)
    key = []
    for i in range(0,16):
        key.append(random.randint(0,255))
    key = bytearray(key)
    cipher = AES.new(key, AES.MODE_CBC, iv) 
    pt = cipher.decrypt(ct)
    try:
        print(pt.decode())
        break
    except Exception as e:
        continue
```

Flag : flag{r3411y\_R4nd0m\_15\_R3ally\_iMp0r7ant}

## Quantum Crypto (444 pts)

### Description

Given challenge below

```python
import numpy as np
import random
from base64 import b64encode, b64decode
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

...

# computational basis states
one_state = np.array([[1.0],[0.0]])
zero_state = np.array([[0.0],[1.0]])

# Hadamard and X-pauli gates
H = np.array([[1.0,1.0],[1.0,-1.0]])/np.sqrt(2), 
X = np.array([[0.0,1.0],[1.0,0.0]])

def get_quantum_key(state_list, basis_list):
    key_bits = ''   
    
    if(len(state_list) != 1024 or len(basis_list) != 1024):
        return -1
    
    for basis in basis_list:
        if(str.upper(basis) not in ['H', 'X']):
                return -1
                    
    our_basis = []
                    
    for i in range(0, 1024):
        our_basis.append(random.choice(["H", "X"]))
            
    for i in range(0, 1024):
        if(our_basis[i] == basis_list[i]):
                if(basis_list[i] == "H"):
                    state = np.dot(H, state_list[i])
                else:
                    state = np.dot(X, state_list[i])

                if(state[0][0] > .99):
                    key_bits += '1'
                else:
                    key_bits += '0'
    
    if(len(key_bits) < 128):
        return -1
    
    key = bitstring_to_bytes(key_bits[0:128])
    
    cipher = AES.new(key, AES.MODE_CBC)
    cipher_text = cipher.encrypt(pad(flag, AES.block_size))
    iv = cipher.iv
    
    return {"basis": our_basis, "iv":b64encode(iv), "ciphertext":b64encode(cipher_text)}
```

### Solution

So we need to send basis and state with length 1024. We can see that the key bits must greater or equal than 128. Since our input is 1024 so it has bigger chance to get valid basis with length greater or equal than 128. For the state we just need to send valid state that result 2 decimal points to make state\[0]\[0] valid. Here is script i used to get the flag

```python
import requests
import random
from base64 import b64encode, b64decode
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad
import numpy as np
import json

def bitstring_to_bytes(s):
    v = int(s, 2)
    b = bytearray()
    while v:
        b.append(v & 0xff)
        v >>= 8
    return bytes(b[::-1])

def get_quantum_key(state_list, basis_list, our_basis, iv, ct):
    iv = b64decode(iv)
    ct = b64decode(ct)
    key_bits = ''   
    
    if(len(state_list) != 1024 or len(basis_list) != 1024):
        return -1
    
    for basis in basis_list:
        if(str.upper(basis) not in ['H', 'X']):
                return -1
                    
            
    for i in range(0, 1024):
        if(our_basis[i] == basis_list[i]):
                if(basis_list[i] == "H"):
                    state = np.dot(H, state_list[i])
                else:
                    state = np.dot(X, state_list[i])

                if(state[0][0] > .99):
                    key_bits += '1'
                else:
                    key_bits += '0'
    
    if(len(key_bits) < 128):
        return -1
    
    key = bitstring_to_bytes(key_bits[0:128])
    
    cipher = AES.new(key, AES.MODE_CBC, iv)
    pt = cipher.decrypt(ct) 
    
    return pt

H = np.array([[1.0,1.0],[1.0,-1.0]])/np.sqrt(2), 
X = np.array([[0.0,1.0],[1.0,0.0]])

r = requests.session()

url = "https://nessus-quantumcrypto.chals.io/quantum_key"

basis = []
for i in range(1024):
	basis.append("H")

state = []
for i in range(1024):
	state.append([1.1, 1.1])

json_data = {
	"state_list" : state,
	"basis_list" : basis
}

resp = r.post(url, json = json_data)
data = json.loads(resp.text)
our_basis = data["basis"]
iv = data["iv"]
ct = data["ciphertext"]

print(get_quantum_key(state, basis, our_basis, iv, ct))
```

Flag : flag{d0nT\_T0uch\_QB17s\_ar3\_FraG1l3}
