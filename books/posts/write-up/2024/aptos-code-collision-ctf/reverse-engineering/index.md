# Reverse Engineering

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>Can You Revela Me (50 pts)</td><td><a href="#can-you-revela-me-50-pts">Here</a></td></tr><tr><td>Sage (212 pts) 🥉</td><td><a href="#sage-212-pts">Here</a></td></tr><tr><td>U Can't Touch This (372 pts) - UPSOLVE</td><td><a href="#u-cant-touch-this-372-pts">Here</a></td></tr></tbody></table>

## Can You Revela Me (50 pts)

### Description

A friend of mine found this on his PC, but he can't remember what it is. It should contain juicy information. Can you recover it?

### Solution

Given mv file which is a compiled move code.  Trying to find disassembler or decompiler for given file i found this [repository](https://github.com/verichains/revela). The repository name has the same name with the challenge, so i tried to use the the released binary from the repository to decompile the mv file.

```bash
./revela-aarch64-apple-darwin -b source.mv
```

```rust
module 0x1337::source {
    public fun a0() : vector<u8> {
        magic_1(b"etpkw", 4)
    }
    
    public fun a1() : vector<u8> {
        magic_2(b"zrn^", 1)
    }
    
    public fun a10() : vector<u8> {
        magic_2(b"bW", 10)
    }
    
    public fun a2() : vector<u8> {
        magic_3(b"_uoy")
    }
    
    public fun a3() : vector<u8> {
        magic_1(b"i`wd", 1)
    }
    
    public fun a4() : vector<u8> {
        magic_2(b"]jc_", 2)
    }
    
    public fun a5() : vector<u8> {
        magic_1(b"qmfg", 3)
    }
    
    public fun a6() : vector<u8> {
        magic_3(b"woh_")
    }
    
    public fun a7() : vector<u8> {
        magic_2(b"^sn^", 1)
    }
    
    public fun a8() : vector<u8> {
        magic_1(b"qwa[", 4)
    }
    
    public fun a9() : vector<u8> {
        magic_3(b"ever")
    }
    
    public fun get_flag() : vector<u8> {
        let v0 = a0();
        0x1::vector::append<u8>(&mut v0, a1());
        0x1::vector::append<u8>(&mut v0, a2());
        0x1::vector::append<u8>(&mut v0, a3());
        0x1::vector::append<u8>(&mut v0, a4());
        0x1::vector::append<u8>(&mut v0, a5());
        0x1::vector::append<u8>(&mut v0, a6());
        0x1::vector::append<u8>(&mut v0, a7());
        0x1::vector::append<u8>(&mut v0, a8());
        0x1::vector::append<u8>(&mut v0, a9());
        0x1::vector::append<u8>(&mut v0, a10());
        0x1::vector::append<u8>(&mut v0, b"}");
        v0
    }
    
    fun magic_1(arg0: vector<u8>, arg1: u8) : vector<u8> {
        let v0 = 0x1::vector::empty<u8>();
        let v1 = 0;
        while (v1 < 0x1::vector::length<u8>(&arg0)) {
            0x1::vector::push_back<u8>(&mut v0, *0x1::vector::borrow<u8>(&arg0, v1) ^ arg1);
            v1 = v1 + 1;
        };
        v0
    }
    
    fun magic_2(arg0: vector<u8>, arg1: u8) : vector<u8> {
        let v0 = 0x1::vector::empty<u8>();
        let v1 = 0;
        while (v1 < 0x1::vector::length<u8>(&arg0)) {
            0x1::vector::push_back<u8>(&mut v0, *0x1::vector::borrow<u8>(&arg0, v1) + arg1);
            v1 = v1 + 1;
        };
        v0
    }
    
    fun magic_3(arg0: vector<u8>) : vector<u8> {
        let v0 = 0x1::vector::empty<u8>();
        let v1 = 0x1::vector::length<u8>(&arg0);
        while (v1 > 0) {
            let v2 = v1 - 1;
            v1 = v2;
            0x1::vector::push_back<u8>(&mut v0, *0x1::vector::borrow<u8>(&arg0, v2));
        };
        v0
    }
    
    // decompiled from Move bytecode v6
}
```

From code above we can see that there are some function and there is one function named get\_flag. So in this case our objective is to find the flag that created from get\_flag function. My approach is to rewrite above code in python and then print out the flag. &#x20;

```python
def magic_1(a, b):
	res = []
	for i in a:
		res.append(i ^ b)
	return bytes(res)

def magic_2(a, b):
	res = []
	for i in a:
		res.append(i + b)
	return bytes(res)

def magic_3(a):
	return a[::-1]

flag = []
flag.append(magic_1(b"etpkw", 4))
flag.append(magic_2(b"zrn^", 1))
flag.append(magic_3(b"_uoy"))
flag.append(magic_1(b"i`wd", 1))
flag.append(magic_2(b"]jc_", 2))
flag.append(magic_1(b"qmfg", 3))
flag.append(magic_3(b"woh_"))
flag.append(magic_2(b"^sn^", 1))
flag.append(magic_1(b"qwa[", 4))
flag.append(magic_3(b"ever"))
flag.append(magic_2(b"bW", 10))

print(b''.join(flag) + b"}")
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F6UuVmlBMyw56QoOib9SW%2Fimage.png?alt=media&amp;token=bc208d6f-20ba-4a29-9189-aed9ad60291d" alt=""><figcaption></figcaption></figure>

Flag: aptos{so\_you\_have\_learned\_how\_to\_use\_revela}

## Sage (212 pts)

### Description

I lost my code to unlock the flag. HELP ME

### Solution

Given an archive file that consist of framework and framework-solve folder. Take a look on framework folder to get information about the challenge. We can see the challenge in file framework/challenge/sources/sage.move.

```rust
module challenge::sage {

    use aptos_framework::signer;
    use std::vector;

    struct ChallengeStatus has key {
        is_solved: bool,
    }

    public entry fun initialize(account: &signer) {
        let account_address = signer::address_of(account);
        assert!(account_address == @challenger, 0);
        move_to(account, ChallengeStatus { is_solved: false })

    }

    public entry fun challenge(m: vector<u64>, n: vector<u64>) acquires ChallengeStatus {

        let flag: vector<u64> = vector[
            12, 0, 7, 7, 37, 20, 25, 39, 10, 6, 35, 25, 43, 43, 26, 12, 28, 34, 37, 5, 22,
            9, 25, 4, 31, 8, 40, 38, 3, 27, 3, 24, 8, 0, 23, 38, 10, 5, 2, 16, 11, 37, 28,
            0, 18, 2, 12, 27, 40, 3, 11, 32, 24, 14, 2, 20, 12, 38, 30, 17, 21, 37, 26, 37,
            12, 28, 12, 27, 34, 24, 18, 32];

        if (build(m, n) == flag) {
            let challenge_status = borrow_global_mut<ChallengeStatus>(@challenger);
            challenge_status.is_solved = true;
        }
    }

    fun build(m: vector<u64>, n: vector<u64>): vector<u64> {
        let m1 = copy m;
        let text = &mut m1;
        let text_length = vector::length(text);
        assert!(text_length > 3, 0);

        if (text_length % 3 != 0) {
            if (3 - (text_length % 3) == 2) {
                vector::push_back(text, 0);
                vector::push_back(text, 0);
                text_length = text_length + 2;
            } else {
                vector::push_back(text, 0);
                text_length = text_length + 1;
            }
        };

        let next_text = vector::empty<u64>();
        vector::push_back(&mut next_text, 42);
        vector::push_back(&mut next_text, 11);
        vector::push_back(&mut next_text, 13);
        vector::push_back(&mut next_text, 16);
        vector::push_back(&mut next_text, 13);
        vector::push_back(&mut next_text, 62);
        vector::push_back(&mut next_text, 72);
        vector::push_back(&mut next_text, 13);
        vector::push_back(&mut next_text, 12);
        vector::append(&mut next_text, *text);
        text_length = text_length + 9;

        let n2 = copy n;
        let r = &mut n2;
        let x11 = *vector::borrow(r, 0);
        let x12 = *vector::borrow(r, 1);
        let x13 = *vector::borrow(r, 2);
        let x21 = *vector::borrow(r, 3);
        let x22 = *vector::borrow(r, 4);
        let x23 = *vector::borrow(r, 5);
        let x31 = *vector::borrow(r, 6);
        let x32 = *vector::borrow(r, 7);
        let x33 = *vector::borrow(r, 8);

        assert!(vector::length(r) == 9, 0);
        let i: u64 = 0;
        let end_text = vector::empty<u64>();
        while (i < text_length) {
            let y11 = *vector::borrow(&mut next_text, i + 0);
            let y21 = *vector::borrow(&mut next_text, i + 1);
            let y31 = *vector::borrow(&mut next_text, i + 2);

            let z11 = ((x11 + y31) * (x12 + y11) + (x13 * y21)) % 44;
            let z21 = ((x21 + y31) * (x22 + y11) + (x23 * y21)) % 44;
            let z31 = ((x31 + y31) * (x32 + y11) + (x33 * y21)) % 44;

            vector::push_back(&mut end_text, z11);
            vector::push_back(&mut end_text, z21);
            vector::push_back(&mut end_text, z31);

            i = i + 3;
        };

        end_text
    }

    public entry fun is_solved() acquires ChallengeStatus {
        let challenge_status = borrow_global_mut<ChallengeStatus>(@challenger);
        assert!(challenge_status.is_solved, 2);
    }
}
```

initialize is the first function executed in main.rs, after that we will interact with the server (framework folder). In this case we can call public function and because this is a RE challenge so our objective is to call the challenge function and send the valid m and n array. Build function seems like solvable using z3 but in this case we can directly solve by just putting the build function on z3. To solve the challenge we need to add some constraint and put the correct bit length. Below is my approach to solve it using z3

* Information we know
  * next\_text consist of static values (42,11,13,16,13,62,72,13,12) + m
  * array m and n consist of value with maximum size u64 (64 bit/8 bytes)
* From information above i try to find value for m and n with size u8 (8 bit/1 byte)
* If i put bit length of m and n in z3 with size of 8 it will automatically wrapped to 1 byte, so i can't use 8 as the bit length
* The maximum bit length from the operation should be 19, we know it from below operation

  * Lets use maximum 1 byte value for each variable
  * ((x11 + y31) \* (x12 + y11) + (x13 \* y21))
  *

  ```
  <figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FLWCCL0T7w4PvObze7j9A%2Fimage.png?alt=media&amp;token=0d7bb489-0988-49c6-9d9b-da367d03cf36" alt=""><figcaption></figcaption></figure>
  ```

So to utilize approach above we will use bit length 19 and use ULE function to make sure that the value will be 1 byte.&#x20;

```python
from z3 import *

bit_length = 19

a = [BitVec("x{}".format(i), bit_length) for i in range(72)]
r = [BitVec("y{}".format(i), bit_length) for i in range(9)]

known = [42,11,13,16,13,62,72,13,12]

x11 = r[0]
x12 = r[1]
x13 = r[2]
x21 = r[3]
x22 = r[4]
x23 = r[5]
x31 = r[6]
x32 = r[7]
x33 = r[8]

target = [12, 0, 7, 7, 37, 20, 25, 39, 10, 6, 35, 25, 43, 43, 26, 12, 28, 34, 37, 5, 22, 9, 25, 4, 31, 8, 40, 38, 3, 27, 3, 24, 8, 0, 23, 38, 10, 5, 2, 16, 11, 37, 28, 0, 18, 2, 12, 27, 40, 3, 11, 32, 24, 14, 2, 20, 12, 38, 30, 17, 21, 37, 26, 37, 12, 28, 12, 27, 34, 24, 18, 32]

s = Solver()

for i in range(len(known)):
	s.add(a[i] == known[i])

length = 72

for i in range(length):
	s.add(ULE(a[i], 2**8-1))

for i in range(9):
	s.add(ULE(r[i], 2**8-1))

for i in range(0, length, 3):
	y11 = a[i]
	y21 = a[i+1]
	y31 = a[i+2]
	z11 = (((x11 + y31) * (x12 + y11)) + (x13 * y21))
	z21 = (((x21 + y31) * (x22 + y11)) + (x23 * y21))
	z31 = (((x31 + y31) * (x32 + y11)) + (x33 * y21))
	s.add(z11 % 44 == target[i])
	s.add(z21 % 44 == target[i+1])
	s.add(z31 % 44 == target[i+2])

# print(s)
print(s.check())
model = s.model()

m = []
for i in a:
	m.append(model[i].as_long())
n = []
for i in r:
	n.append(model[i].as_long())

next_text = m[:]

x11 = n[0]
x12 = n[1]
x13 = n[2]
x21 = n[3]
x22 = n[4]
x23 = n[5]
x31 = n[6]
x32 = n[7]
x33 = n[8]

end_text = []

for i in range(0, len(next_text), 3):
	y11 = next_text[i]
	y21 = next_text[i+1]
	y31 = next_text[i+2]

	z11 = ((x11 + y31) * (x12 + y11) + (x13 * y21)) % 44;
	z21 = ((x21 + y31) * (x22 + y11) + (x23 * y21)) % 44;
	z31 = ((x31 + y31) * (x32 + y11) + (x33 * y21)) % 44;

	end_text.append(z11)
	end_text.append(z21)
	end_text.append(z31)

assert(end_text == target)

print(f"{m=}")
print(f"{n=}")
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Ftfy9dafPSFvzUUprVsUT%2Fimage.png?alt=media&amp;token=526ba445-1896-4d60-8cde-6e11ce01e38b" alt=""><figcaption></figcaption></figure>

After getting the valid value for m and n lets put it in move and send run the solver.

```rust
module solution::exploit {
    use challenge::sage;
    use std::vector;

    public entry fun solve() {
        let m: vector<u64> = vector[112, 58, 255, 94, 17, 220, 195, 108, 55, 132, 107, 52, 162, 29, 162, 130, 186, 72, 22, 252, 103, 254, 150, 112, 69, 217, 91, 243, 193, 136, 146, 134, 101, 239, 104, 5, 96, 231, 187, 156, 8, 37, 7, 224, 105, 183, 88, 46, 54, 151, 183, 92, 227, 44, 244, 142, 68, 241, 215, 230, 113, 60, 39];
        let n: vector<u64> = vector[3, 11, 28, 230, 233, 25, 144, 107, 2];
        sage::challenge(m, n);
    }
}
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FmTZrYNdRgvUnWO4clQqo%2Fimage.png?alt=media&amp;token=52c4fcf4-169d-4acc-8804-ce32a5769aaf" alt=""><figcaption></figcaption></figure>

Flag: AptosCTF{a7ed0e353b00f098d765c11605fa807b78cf4b80c8879afb5aa17351760f9787}

## U Can't Touch This (372 pts)

### Description

I'll keep this short for you. The flag is inside the Safe Deposit Box. Only the admin can access it. Good Luck!

### Solution

TBU
