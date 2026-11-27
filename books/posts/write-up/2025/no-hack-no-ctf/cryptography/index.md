# Cryptography

<table><thead><tr><th width="347">Challenge</th><th>Topic</th></tr></thead><tbody><tr><td><a href="#verifier-460-pts">🐺 Verifier (460 pts)</a></td><td>MT19937, Hastad Broadcast Attack</td></tr><tr><td><a href="#verifier--497-pts">🐺 Verifier +  (497 pts)</a></td><td>MT19937, Franklin Reiter Attack</td></tr><tr><td><a href="#verifier-max-499-pts">🐺 Verifier Max  (499 pts)</a></td><td>MT19937, Franklin Reiter Attack, AGCD</td></tr></tbody></table>

## 🐺 Verifier (460 pts)

### Description

Welcome to my new verifier system, hope to be safe ;P\
Wolves are social animals

### Solution

Given code below

```python
from Crypto.Util.number import *
from random import getrandbits

SIZE = 64
FLAG = bytes_to_long(b'NHNC{FAKE_FLAG}')
e = 37
p, q = getPrime(1024), getPrime(1024)
while ((p-1)*(q-1)) % e == 0 :
    p, q = getPrime(1024), getPrime(1024)
N = p*q

print("=== ICEDTEA Verifier 1.0 ===")

while True:
    OTP = getrandbits(SIZE)
    print(f"signed: {pow(OTP, e, N)}")
    TRIAL = int(input("OTP: "))
    if TRIAL == OTP:
        print(f"signed: {pow(FLAG, e, N)}")
        continue
        
    print(f"Invalid OTP, {OTP}")

```

From code above we can see that we can try many OTP as we want and if the OTP is incorrect we can get the valid OTP. The OTP is 64 bit, by requesting 312 times OTP we can predict the next OTP using randcrack.&#x20;

Each valid OTP will give us the encrypted version of flag which is m^e mod n\_i, since we can reconnect multiple times and the flag is static we can request different modulus that will produce different ciphertext (c\_i). Last, we can just implement CRT on known ciphertext (c\_i) and modulus (n\_i) to get the actual m^e with N > m^e.&#x20;

To get the modulus, we can do the following equation

$$
\begin{gathered}
c_i \equiv m_i^e\pmod n\\
c_i - m_i^e \equiv 0 \pmod n\\
c_i - m_i^e = k*n
\end{gathered}
$$

Next, by using two different ciphertext and plaintext we can recover the modulus by implementing GCD to those values. Following is my script to solve the challenge

```python
from pwn import *
from randcrack import RandCrack
import math
import tqdm
from Crypto.Util.number import long_to_bytes
from sympy.ntheory.modular import crt
import gmpy2
import sys

def submit_crack(rc, tmp):
	while tmp > 0:
		try:
			rc.submit(tmp % (1 << 32))
			tmp = tmp >> 32
		except Exception as e:
			break

list_c = []
list_n = []
context.log_level = 'error'

for _ in tqdm.tqdm(range(37)):
	r = process(["python3", "share/chal.py"])
	# r = remote("chal.78727867.xyz", 31337)
	rc = RandCrack()
	for _ in range(312):
		r.recvuntil(b"OTP: ")
		r.sendline(b"1")
		r.recvuntil(b"Invalid OTP, ")
		num = int(r.recvline().strip().decode())
		submit_crack(rc, num)
	
	r.recvuntil(b"OTP: ")
	r.sendline(str(rc.predict_getrandbits(64)).encode())
	r.recvuntil(b"signed: ")
	found_c =  int(r.recvline().strip())
	
	r.recvuntil(b"signed: ")
	a1 =  int(r.recvline().strip())
	a2 = rc.predict_getrandbits(64)
	r.recvuntil(b"OTP: ")
	r.sendline(b"2")
	
	r.recvuntil(b"signed: ")
	b1 =  int(r.recvline().strip())
	b2 = rc.predict_getrandbits(64)
	r.recvuntil(b"OTP: ")
	r.sendline(b"2")
	
	tmp1= b2**37 - b1
	tmp2 = a2**37 - a1
	kn = math.gcd(tmp1, tmp2)
	
	low_prime = [2, 3, 5, 7, 11, 13, 17, 19]
	for i in low_prime:
		while kn % i == 0:
			kn //= i
	
	assert pow(b2, 37, kn) == b1
	list_c.append(found_c)
	list_n.append(kn)
	
	
	r.close()

# print(list_n)
# print(list_c)

sys.set_int_max_str_digits(1000000)
gmpy2.get_context().precision=2048

e = 37

me = crt(list_n,list_c)[0]
m = gmpy2.iroot(me, e)

print(long_to_bytes(m[0]))
```

&#x20;Flag: NHNC{using\_big\_intergers\_in\_python\_is\_still\_a\_pain}

## 🐺 Verifier + (497 pts)

### Description

Well ... those wolves don't know how to patch their verifier, so they implemented the new Wolves' Verifier + to keep you out from message plaintexts !

### Solution

Given code below

<pre class="language-python"><code class="lang-python">from Crypto.Util.number import *
from random import getrandbits

<strong>SIZE = 65
</strong>FLAG = bytes_to_long(b'NHNC{FAKE_FLAG}')
e = 37
p, q = getPrime(1024), getPrime(1024)
while ((p-1)*(q-1)) % e == 0 :
    p, q = getPrime(1024), getPrime(1024)
N = p*q

print("=== ICEDTEA Verifier 1.1 ===")

while True:
    OTP = getrandbits(SIZE)
    print(f"signed: {pow(OTP, e, N)}")
    TRIAL = int(input("OTP: "))
    if TRIAL == OTP:
<strong>        super_secret = getrandbits(1024)
</strong><strong>        print(f"signed: {pow(FLAG + super_secret, e, N)}")
</strong>        continue
        
    print(f"Invalid OTP, {OTP}")
</code></pre>

The highlighted lines in the code above are the codes that were changed or added. Getrandbits changed from 64 bit to 65, in general we know that to predict getrandbits value we need to use 624 \* 32 bit value. But in this case we got partial value which is 32 bit, 32 bit, and 1 bit. Looking at <https://rbtree.blog/posts/2021-05-18-breaking-python-random-module/> we know that we can recover partial random value. The next problem is there is limitation 5 minutes for each connection to the service, using the python script given it takes more than 5 minutes to just recovering the state. So i decided to convert the python code to CPP to reduce the time to recover.

For the second part, there is random added to the flag but we can predict it also. So basically we can get the ciphertext, modulus, and the super\_secret value. To get the flag we can utilize franklin reiter attack with a few changes of equation (m + r1 and m + r2 instead of m+0 and m+r1).

Following is the script i used to solve the challenge

{% code title="solver.sage" %}

```python
import random
import tqdm
from pwn import *
import subprocess
import time
from Crypto.Util.number import *

def franklinReiter(n,e,r1,r2,c1,c2):
    R.<X> = Zmod(n)[]
    f1 = (X + r1)^e - c1
    f2 = (X + r2)^e - c2
    return Integer(n-(compositeModulusGCD(f1,f2)).coefficients()[0])

def compositeModulusGCD(a, b):
    if(b == 0):
        return a.monic()
    else:
        return compositeModulusGCD(b, a % b)

def attack(counter, list_num):
    data = ','.join(map(str, list_num))
    fn = f"outputs/numbers_{counter}.txt"
    out = open(fn, "w")
    out.write(data)

    p = process(["./mt19937_attack", fn])
    p.recvuntil(b"Output")
    p.recvline()
    tmp = list(map(int, p.recvline().strip().decode().split(" ")))
    return [int(i & (2**32 - 1)) for i in tmp]

list_c  = []
list_n  = []
list_rand = []

counter = 1337

while True:
    loop = 624
    bit = 32
    r = process(["python3", "../share/chal.py"])
    # r = remote("chal.78727867.xyz", int(31338))
    list_num = []
    
    for _ in tqdm.tqdm(range(loop)):
        r.recvuntil(b"OTP: ")
        r.sendline(b"1")
        r.recvuntil(b"Invalid OTP, ")
        num = int(r.recvline().strip().decode())
        list_num.append(num)
    
    print(f"start attack {counter}")

    start = time.time()
    state = attack(counter, list_num)
    recovered_state = (int(3), tuple(state + [0]), None)
    print(recovered_state)
    end = time.time()
    print(f"Time: {end-start}")
    random.setstate(recovered_state)
    
    for x in range(loop):
        random.getrandbits(65)
    
    for _ in range(2):
        print("trying")
        r.recvuntil(b"OTP: ")
        r.sendline(str(random.getrandbits(65)).encode())
        tmp = r.recvline()
        if b"signed: " in tmp:
            print("found", _)
            found_c = int(tmp.strip().decode().split(" ")[-1])
            rand_val = int(random.getrandbits(1024))
            list_rand.append(rand_val)
            list_c.append(found_c)    
    
    r.recvuntil(b"signed: ")
    a1 =  int(r.recvline().strip())
    r.recvuntil(b"OTP: ")
    r.sendline(b"2")
    r.recvuntil(b"Invalid OTP, ")
    a2 = int(r.recvline().strip().decode())

    r.recvuntil(b"signed: ")
    b1 =  int(r.recvline().strip())
    r.recvuntil(b"OTP: ")
    r.sendline(b"2")
    r.recvuntil(b"Invalid OTP, ")
    b2 = int(r.recvline().strip().decode())

    tmp1 = b2**37 - b1
    tmp2 = a2**37 - a1
    kn = math.gcd(tmp1, tmp2)
    
    low_prime = [2, 3, 5, 7, 11, 13, 17, 19]
    for i in low_prime:
        while kn % i == 0:
            kn //= i
    
    assert pow(b2, 37, kn) == b1
    
    m = franklinReiter(int(kn), int(37), list_rand[0], list_rand[1], list_c[0], list_c[1])
    print(long_to_bytes(m))
    
    counter += 1
    break
```

{% endcode %}

<pre class="language-cpp" data-title="attack.cpp"><code class="lang-cpp"><strong>// g++ -o mt19937_attack attack.cpp -L/opt/homebrew/lib -lgmp -lgmpxx -std=c++17
</strong>
#include &#x3C;iostream>
#include &#x3C;vector>
#include &#x3C;string>
#include &#x3C;fstream>
#include &#x3C;sstream>
#include &#x3C;algorithm>
#include &#x3C;gmp.h>
#include &#x3C;gmpxx.h>

class Twister {
private:
    static const int N = 624;
    static const int M = 397;
    static const uint32_t A = 0x9908b0df;
    
    std::vector&#x3C;std::vector&#x3C;mpz_class>> state;
    int index;
    
    static std::vector&#x3C;mpz_class> _xor(const std::vector&#x3C;mpz_class>&#x26; a, const std::vector&#x3C;mpz_class>&#x26; b) {
        std::vector&#x3C;mpz_class> result;
        for (size_t i = 0; i &#x3C; a.size(); i++) {
            result.push_back(a[i] ^ b[i]);
        }
        return result;
    }
    
    static std::vector&#x3C;mpz_class> _and(const std::vector&#x3C;mpz_class>&#x26; a, uint32_t x) {
        std::vector&#x3C;mpz_class> result;
        for (int i = 0; i &#x3C; 32; i++) {
            if ((x >> (31 - i)) &#x26; 1) {
                result.push_back(a[i]);
            } else {
                result.push_back(mpz_class(0));
            }
        }
        return result;
    }
    
    static std::vector&#x3C;mpz_class> _shiftr(const std::vector&#x3C;mpz_class>&#x26; a, int x) {
        std::vector&#x3C;mpz_class> result;
        for (int i = 0; i &#x3C; x; i++) {
            result.push_back(mpz_class(0));
        }
        for (int i = 0; i &#x3C; (int)a.size() - x; i++) {
            result.push_back(a[i]);
        }
        return result;
    }
    
    static std::vector&#x3C;mpz_class> _shiftl(const std::vector&#x3C;mpz_class>&#x26; a, int x) {
        std::vector&#x3C;mpz_class> result;
        for (int i = x; i &#x3C; (int)a.size(); i++) {
            result.push_back(a[i]);
        }
        for (int i = 0; i &#x3C; x; i++) {
            result.push_back(mpz_class(0));
        }
        return result;
    }
    
public:
    Twister() {
        init();
    }
    
    void init() {
        state.clear();
        state.resize(N);
        
        for (int i = 0; i &#x3C; N; i++) {
            state[i].resize(32);
            for (int j = 0; j &#x3C; 32; j++) {
                mpz_class power;
                mpz_ui_pow_ui(power.get_mpz_t(), 2, 32 * i + (31 - j));
                state[i][j] = power;
            }
        }
        index = 0;
    }
    
    std::vector&#x3C;mpz_class> get32bits() {
        if (index >= N) {
            for (int kk = 0; kk &#x3C; N; kk++) {
                std::vector&#x3C;mpz_class> y;
                y.push_back(state[kk][0]);
                for (int i = 1; i &#x3C; 32; i++) {
                    y.push_back(state[(kk + 1) % N][i]);
                }
                
                std::vector&#x3C;mpz_class> z(32);
                for (int i = 0; i &#x3C; 32; i++) {
                    if ((A >> (31 - i)) &#x26; 1) {
                        z[i] = y[31];
                    } else {
                        z[i] = mpz_class(0);
                    }
                }
                
                state[kk] = _xor(state[(kk + M) % N], _shiftr(y, 1));
                state[kk] = _xor(state[kk], z);
            }
            index = 0;
        }
        
        std::vector&#x3C;mpz_class> y = state[index];
        y = _xor(y, _shiftr(y, 11));
        y = _xor(y, _and(_shiftl(y, 7), 0x9d2c5680));
        y = _xor(y, _and(_shiftl(y, 15), 0xefc60000));
        y = _xor(y, _shiftr(y, 18));
        
        index++;
        return y;
    }
    
    std::vector&#x3C;mpz_class> getrandbits(int bit) {
        std::vector&#x3C;mpz_class> result = get32bits();
        if (bit &#x3C; 32) {
            result.resize(bit);
        }
        return result;
    }
};

class Solver {
private:
    std::vector&#x3C;mpz_class> equations;
    std::vector&#x3C;mpz_class> outputs;
    
public:
    Solver() {}
    
    void insert(const mpz_class&#x26; equation, const mpz_class&#x26; output) {
        mpz_class eq = equation;
        mpz_class out = output;
        
        for (size_t i = 0; i &#x3C; equations.size(); i++) {
            mpz_class lsb = equations[i] &#x26; (-equations[i]);
            if ((eq &#x26; lsb) != 0) {
                eq ^= equations[i];
                out ^= outputs[i];
            }
        }
        
        if (eq == 0) {
            return;
        }
        
        mpz_class lsb = eq &#x26; (-eq);
        for (size_t i = 0; i &#x3C; equations.size(); i++) {
            if ((equations[i] &#x26; lsb) != 0) {
                equations[i] ^= eq;
                outputs[i] ^= out;
            }
        }
        
        equations.push_back(eq);
        outputs.push_back(out);
    }
    
    std::vector&#x3C;uint32_t> solve() {
        mpz_class num = 0;
        for (size_t i = 0; i &#x3C; equations.size(); i++) {
            if (outputs[i] != 0) {
                num |= equations[i] &#x26; (-equations[i]);
            }
        }
        
        std::vector&#x3C;uint32_t> state(624);
        for (int i = 0; i &#x3C; 624; i++) {
            mpz_class shifted = num >> (32 * i);
            mpz_class masked = shifted &#x26; mpz_class(0xFFFFFFFF);
            state[i] = mpz_get_ui(masked.get_mpz_t());
        }
        
        return state;
    }
};

std::vector&#x3C;mpz_class> readNumbersFromFile(const std::string&#x26; filename) {
    std::vector&#x3C;mpz_class> numbers;
    std::ifstream file(filename);
    std::string line;
    
    if (!file.is_open()) {
        std::cerr &#x3C;&#x3C; "Error: Cannot open file " &#x3C;&#x3C; filename &#x3C;&#x3C; std::endl;
        return numbers;
    }
    
    while (std::getline(file, line)) {
        std::stringstream ss(line);
        std::string token;
        
        while (std::getline(ss, token, ',')) {
            token.erase(std::remove_if(token.begin(), token.end(), ::isspace), token.end());
            if (!token.empty()) {
                numbers.push_back(mpz_class(token));
            }
        }
    }
    
    file.close();
    return numbers;
}

std::tuple&#x3C;int, std::vector&#x3C;uint32_t>, void*> attack(const std::vector&#x3C;mpz_class>&#x26; list_num) {
    const int num = 624;
    const int bit = 32;
    
    std::vector&#x3C;mpz_class> outputs;
    std::vector&#x3C;mpz_class> lol;
    
    for (int i = 0; i &#x3C; num &#x26;&#x26; i &#x3C; (int)list_num.size(); i++) {
        mpz_class tmp = list_num[i];
        lol.push_back(tmp);
        
        mpz_class mask;
        mpz_ui_pow_ui(mask.get_mpz_t(), 2, 32);
        mask -= 1;
        
        outputs.push_back(tmp &#x26; mask);
        tmp >>= 32;
        outputs.push_back(tmp &#x26; mask);
        tmp >>= 32;
        outputs.push_back(tmp &#x26; mask);
    }
    
    Twister twister;
    std::vector&#x3C;std::vector&#x3C;mpz_class>> equations;
    
    for (int i = 0; i &#x3C; num; i++) {
        equations.push_back(twister.getrandbits(bit));
        equations.push_back(twister.getrandbits(bit));
        equations.push_back(twister.getrandbits(1));
    }
    
    Solver solver;
    int counter = 0;
    
    for (int i = 0; i &#x3C; num; i++) {
        // printf("%d\n", i);
        for (int j = 0; j &#x3C; bit; j++) {
            mpz_class bit_val = (outputs[counter] >> (bit - 1 - j)) &#x26; 1;
            solver.insert(equations[counter][j], bit_val);
        }
        counter++;
        
        for (int j = 0; j &#x3C; bit; j++) {
            mpz_class bit_val = (outputs[counter] >> (bit - 1 - j)) &#x26; 1;
            solver.insert(equations[counter][j], bit_val);
        }
        counter++;
        
        mpz_class bit_val = outputs[counter] &#x26; 1;
        solver.insert(equations[counter][0], bit_val);
        counter++;
    }
    
    std::vector&#x3C;uint32_t> state = solver.solve();
    
    return std::make_tuple(3, state, nullptr);
}

int main(int argc, char *argv[]) {
    std::string filename = argv[1]; 
    std::vector&#x3C;mpz_class> list_num = readNumbersFromFile(filename);
    
    if (list_num.empty()) {
        std::cerr &#x3C;&#x3C; "err" &#x3C;&#x3C; std::endl;
        return 1;
    }
    
    auto [version, recovered_state, ptr] = attack(list_num);
    
    std::cout &#x3C;&#x3C; "Output" &#x3C;&#x3C; std::endl;
    for (int i = 0; i &#x3C; (int)recovered_state.size(); i++) {
        std::cout &#x3C;&#x3C; recovered_state[i] &#x3C;&#x3C; " ";
    }
    std::cout &#x3C;&#x3C; std::endl;
    
    return 0;
}
</code></pre>

## 🐺 Verifier Max (499 pts)

### Description

Welcome to the (maybe) last journey in cracking Wolves' Verifier, why are you so persist in sniffing their secrets??

### Solution

Given code below

<pre class="language-python"><code class="lang-python">from Crypto.Util.number import *
from random import getrandbits

SIZE = 65
FLAG = bytes_to_long(b'NHNC{FAKE_FLAG}')
e = 37
p, q = getPrime(1024), getPrime(1024)
while ((p-1)*(q-1)) % e == 0 :
    p, q = getPrime(1024), getPrime(1024)
N = p*q

print("=== ICEDTEA Verifier 1.2 ===")

while True:
    OTP = getrandbits(SIZE)
<strong>    print(f"signed: {pow(OTP, e, N) >> SIZE}")
</strong>    TRIAL = int(input("OTP: "))
    if TRIAL == OTP:
        super_secret = getrandbits(1024)
        print(f"signed: {pow(FLAG + super_secret, e, N)}")
        continue
        
    print(f"Invalid OTP, {OTP}")
</code></pre>

The different with previous version is the signed OTP is shifted right 65 bit so we can't recover modulus using the same equations. But in this case we can use approximate GCD to recover the modulus with r\_i is 65 bit.

$$
m_i^e - (c_i << 65) + r_i= k*n
$$

```python
import sys
from Crypto.Util.number import *
from random import getrandbits
import tqdm
from pwn import *
import time
sys.path.append("/Users/kosong/tools/crypto-attacks/attacks/acd/")
from ol import attack as acd_attack


def find_modulus(list_num, list_num_ct):
	e = 37
	kn = []
	for i in range(e):
		kn.append(list_num[i]^e - (list_num_ct[i] << 65))
	n = acd_attack(kn, 256)[0]
	return int(n)

def franklinReiter(n,e,r1,r2,c1,c2):
	R.<X> = Zmod(n)[]
	f1 = (X + r1)^e - c1
	f2 = (X + r2)^e - c2
	return Integer(n-(compositeModulusGCD(f1,f2)).coefficients()[0])

def compositeModulusGCD(a, b):
	if(b == 0):
		return a.monic()
	else:
		return compositeModulusGCD(b, a % b)

def attack(counter, list_num):
	data = ','.join(map(str, list_num))
	fn = f"outputs/numbers_{counter}.txt"
	out = open(fn, "w")
	out.write(data)

	p = process(["./mt19937_attack", fn])
	p.recvuntil(b"Output")
	p.recvline()
	tmp = list(map(int, p.recvline().strip().decode().split(" ")))
	return [int(i & (2**32 - 1)) for i in tmp]

list_c  = []
list_n  = []
list_rand = []

counter = 1337

while True:
	e = 37
	loop = 624
	bit = 32
	r = process(["python3", "share/chal.py"])
	# r = remote("chal.78727867.xyz", int(31338))
	list_num = []
	list_num_ct = []
	
	for _ in tqdm.tqdm(range(loop)):
		r.recvuntil("signed: ")
		a1 =  int(r.recvline().strip())
		r.recvuntil(b"OTP: ")
		r.sendline(b"1")
		r.recvuntil(b"Invalid OTP, ")
		num = int(r.recvline().strip().decode())
		list_num.append(num)
		list_num_ct.append(a1)
	
	n = find_modulus(list_num, list_num_ct)

	print(f"found n : {n}")
	
	assert (pow(list_num[0], 37, n) >> 65) == list_num_ct[0]

	print(f"start attack {counter}")

	start = time.time()
	state = attack(counter, list_num)
	recovered_state = (int(3), tuple(state + [0]), None)
	# print(recovered_state)
	end = time.time()
	print(f"Time: {end-start}")
	random.setstate(recovered_state)
	
	for x in range(loop):
		random.getrandbits(65)
	
	for _ in range(2):
		print("trying")
		r.recvuntil(b"OTP: ")
		r.sendline(str(random.getrandbits(65)).encode())
		tmp = r.recvline()
		if b"signed: " in tmp:
			print("found", _)
			found_c = int(tmp.strip().decode().split(" ")[-1])
			rand_val = int(random.getrandbits(1024))
			list_rand.append(rand_val)
			list_c.append(found_c)    
	
	m = franklinReiter(n, int(e), list_rand[0], list_rand[1], list_c[0], list_c[1])
	print(long_to_bytes(m))
	
	# counter += 1
	break
```
