# Reverse Engineering

| Challenge                    | Link                                |
| ---------------------------- | ----------------------------------- |
| 1125899906842622 (18 solves) | [Here](#1125899906842622-18-solves) |
| re-cursed (4 solves) 🥇      | [Here](#re-cursed-4-solves)         |

## 1125899906842622 (18 solves)

### Description

I found this credit card on the floor!

```python
a = int(input())
t = a
b = 1
c = 211403263193325564935177732039311880968900585239198162576891024013795244278301418972476576250867590357558453818398439943850378531849394935408437463406454857158521417008852225672729172355559636113821448436305733721716196982836937454125646725644730318942728101471045037112450682284520951847177283496341601551774254483030077823813188507483073118602703254303097147462068515767717772884466792302813549230305888885204253788392922886375194682180491793001343169832953298914716055094436911057598304954503449174775345984866214515917257380264516918145147739699677733412795896932349404893017733701969358911638491238857741665750286105099248045902976635536517481599121390996091651261500380029994399838070532595869706503571976725974716799639715490513609494565268488194
verified = False
while 1:
	if b == 4:
		verified = True
		break
	d = 2 + (1125899906842622 if a&2 else 0)
	if a&1:
		b //= d
	else:
		b *= d
	b += (b&c)*(1125899906842622)
	a //= 4
if verified:
	t %= (2**300)
	t ^= 1565959740202953194497459354306763253658344353764229118098024096752495734667310309613713367
	print(t)
```

### Solution

From the source code we can see that there is 4 possibility of our input since our input processed each 2 bit.&#x20;

```python
xx11 -> (b // 1125899906842624) + ((b // 1125899906842624)&c)*1125899906842622 
xx10 -> (b * 1125899906842624) + ((b * 1125899906842624)&c)*1125899906842622
xx01 -> (b // 2) + ((b // 2)&c)*1125899906842622
xx00 -> (b * 2) + ((b * 2)&c)*1125899906842622
```

Possible first 2 bits should be `10` and `00` cause if we use `01` and `11` it should produce `b == 0` . After struggling to find the base case or constraint for recursive function i try to find the relation of b and c variable. We can see that the first possible value are `10` and `00` , it looks like an entry corner to a maze since we can go right and down if we start from top left corner. Since c is square number `(bit_length == 2500)`, so we try to use this value as the map. For the c value, since it uses and operator , the bit processed should be from the last bit so we need to reverse the binary to start the maze from initial position **(0, 0)**. Last step, just implement **Depth First Search (DFS)** algorithm to find the correct path. Here is my implementation on python.

```python
from Crypto.Util.number import *

def check(coor):
	if(mapp[coor[0]][coor[1]] == 1):
		return False
	if(coor[0] < 0 or coor[0] > 49 or coor[1] < 0 or coor[1] > 49):
		return False
	return True

def parse(path):
	res = ""
	for i in range(1,len(path)):
		tmp = (path[i][0] - path[i-1][0], path[i][1] - path[i-1][1] )
		if(tmp == (1, 0)):
			res = "10" + res
		elif(tmp == (0, 1)):
			res = "00" + res
		elif(tmp == (0, -1)):
			res = "01" + res
		elif(tmp == (-1, 0)):
			res = "11" + res
		else:
			print("???")
	return int(res,2)

def dfs(coor):
	
	if(coor == finish):
		t = parse(visited)
		t %= (2**300)
		t ^= 1565959740202953194497459354306763253658344353764229118098024096752495734667310309613713367
		print(long_to_bytes(t))
		exit()

	up = (coor[0], coor[1] - 1)
	down = (coor[0], coor[1] + 1)
	right = (coor[0] + 1, coor[1])
	left = (coor[0] - 1, coor[1])
	
	if(check(up) and up not in visited):
		visited.append(up)
		if(dfs(up)):
			return True
		visited.pop()
	
	if(check(down) and down not in visited):
		visited.append(down)
		if(dfs(down)):
			return True
		visited.pop()
	
	if(check(right) and right not in visited):
		visited.append(right)
		if(dfs(right)):
			return True
		visited.pop()
	
	if(check(left) and left not in visited):
		visited.append(left)
		if(dfs(left)):
			return True
		visited.pop()

	return False

c = 211403263193325564935177732039311880968900585239198162576891024013795244278301418972476576250867590357558453818398439943850378531849394935408437463406454857158521417008852225672729172355559636113821448436305733721716196982836937454125646725644730318942728101471045037112450682284520951847177283496341601551774254483030077823813188507483073118602703254303097147462068515767717772884466792302813549230305888885204253788392922886375194682180491793001343169832953298914716055094436911057598304954503449174775345984866214515917257380264516918145147739699677733412795896932349404893017733701969358911638491238857741665750286105099248045902976635536517481599121390996091651261500380029994399838070532595869706503571976725974716799639715490513609494565268488194
mapp = []
a = bin(c)[2:][::-1]

assert(len(a) == 2500)

for i in range(0,len(a),50):
	tmp = []
	for j in range(50):
		tmp.append(int(a[i+j]))
	mapp.append(tmp)

visited = [(0,0)]
coor = (0,0)
finish = (49,49)

mapp[finish[0]][finish[1]] = 0

dfs(coor)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FBUOxSaazB7OwsS7ZQIJX%2Fimage.png?alt=media&amp;token=bb8b2077-9012-4294-b4a9-0e7be9676f3d" alt=""><figcaption></figcaption></figure>

Flag : flag{l4byr1nth\_9abe79d712e6dd52c4597}

## re-cursed (4 solves)

### Description

Scotland forever!

### Solution

First step, we should extract the original elf executed in `recursed` binary. This should be done by set breakpoint on write function and dump the memory

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F5krS8dOlULjkL7yhpUm1%2Fimage.png?alt=media&amp;token=04b63af6-f6b1-4b5f-907e-7c12927123cd" alt=""><figcaption></figcaption></figure>

```bash
dump binary memory result.bin 0x00007fffffbd5450 0x00007fffffbd5450+0x0000000000428f10
```

After that we should facing the real cursed binary, compiled using ghc and of course it made using `haskell`. In this case we can't use <https://github.com/gereeter/hsdecomp> or another modified `hsdecomp`. So my initial approach by enumerating what instruction that processed our input. It can be done by doing hardware breakpoint on our input.&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FubDoqAmnVGprrbILKjVg%2Fimage.png?alt=media&amp;token=1d72b782-786b-4447-91a6-08737d12d4e8" alt=""><figcaption></figcaption></figure>

From image above we can see that our input stored at `0x7fffffffe701`. Next step is doing hardware breakpoint on that address by using command below

```
rwatch *0x7fffffffe701
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Ffr93UbOMmADG2ciLEen9%2Fimage.png?alt=media&amp;token=bf6b2755-97b4-4263-8db0-2f607ccfd3a8" alt=""><figcaption></figcaption></figure>

After some enumeration i found that there is something like argument processing and we can skip that by setting up breakpoint on `0x4afbae`

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FoXjuQiSi0f0aBjsRayvw%2Fimage.png?alt=media&amp;token=a6118f4c-8ed9-4a76-8ab3-4fcf69385e50" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FD5XvisNbt8pR8Q866w1b%2Fimage.png?alt=media&amp;token=ee14c06d-e562-4616-b66c-724ca2c2f16b" alt=""><figcaption></figcaption></figure>

After hitting breakpoint, search value for our argument. In this case i used `RYUK12345` as argument

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FDlLfjcD6C9sB8WyYZaey%2Fimage.png?alt=media&amp;token=5f29305e-b218-4a27-95a1-d16e6ae9c1e4" alt=""><figcaption></figcaption></figure>

There are some value found on memory, we can enumerate 1 by 1. In this challenge, i found that `0x507b70` used for next process. The next step is changing the hardware breakpoint each the value moved or processed by the instruction, here is for example

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FPbubE854Frrrr1xTNI1I%2Fimage.png?alt=media&amp;token=5c3960c7-a677-4b7a-ac07-07dbd529acb3" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F2kx94zUkyVky5Kr1z8iR%2Fimage.png?alt=media&amp;token=8ed33553-9a20-4f8a-9500-c6f5695a9245" alt=""><figcaption></figcaption></figure>

Do the same process until you find something interesting. In this case we found interesting function that process our input at first time, it is `ghczmbignum_GHCziNumziInteger_integerXor_info` .

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F3nruTczxkPntgPT8G2K8%2Fimage.png?alt=media&amp;token=86961637-29eb-4748-9c13-509dbc7709cd" alt=""><figcaption></figcaption></figure>

Take a look on decompiler it contains so much code just for "xor" operation. But again we can validate which instruction process our value. It is relative simple since the code that doing xor for different value only on line `159` or address `0x49FB98`

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FvWznrUdi44dg7AjqUMA9%2Fimage.png?alt=media&amp;token=2373d353-9f6a-4bb3-94fa-34cb4ef5a308" alt=""><figcaption></figcaption></figure>

The function name has pattern, so we can try set breakpoint on function that maybe process our input.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F5pxDIyUkDEqqtY2LEAzb%2Fimage.png?alt=media&amp;token=01660d64-ce75-4bbc-a277-dec77674d43d" alt=""><figcaption></figcaption></figure>

For example we can just do command like below

```
b *ghczmbignum_GHCziNumziInteger_integerAdd_info
c
```

For finding the exact instruction it is same, just debug and validate that there is your input processed by the instruction (if it is hard to find through decompiler). At the end i found the following address that processed our input

```python
0x49fb98 -> ghczmbignum_GHCziNumziInteger_integerXor_info
0x499929 -> ghczmbignum_GHCziNumziInteger_integerAdd_info
0x49839b -> ghczmbignum_GHCziNumziInteger_integerSub_info
0x4978f0 -> ghczmbignum_GHCziNumziInteger_integerEqzh_info
```

Okay next we just need to create automation to get all value processed by those instruction. Here is the script i used for gdb automation

```python
#!/usr/bin/python3
import string

data = []
class SolverEquation(gdb.Command):
    def __init__ (self):
        super (SolverEquation, self).__init__ ("solve-equation",gdb.COMMAND_OBSCURE)
    
    def invoke (self, arg, from_tty):
        global data
        gdb.execute("del")
        gdb.execute("start")
        gdb.execute("b *0x49fb98")
        gdb.execute("b *0x499929")
        gdb.execute("b *0x49839b")
        gdb.execute("b *0x4978f0")
        # gdb.execute("r 0123456789abcdefghijklmnopq") # cmp1
        # gdb.execute("r ABCDEFGHIJKLMNOPQRSTUVWXYZa") # cmp2
        # gdb.execute("r aaaaaaaaaaaaaaaaaaaaaaaaaaa") # cmp3
        # gdb.execute("r AAAAAAAAAAAAAAAAAAAAAAAAAAA") # cmp4
        gdb.execute("r qponmlkjihgfedcba9876543210") # cmp5
        arch = gdb.selected_frame().architecture()
        while True:
            try:
                current_pc = addr2num(gdb.selected_frame().read_register("pc"))
                disa = arch.disassemble(current_pc)[0]
                if("xor" in disa["asm"]):
                    rax = addr2num(gdb.selected_frame().read_register("rax"))&0xff
                    rbx = addr2num(gdb.selected_frame().read_register("rbx"))&0xff
                    fmt = f"{rax} ^ {rbx} = {rax^rbx}"
                    data.append(fmt)
                elif("add" in disa["asm"]):
                    rax = parse(gdb.execute("x/bx $rax",to_string=True))[0]&0xff
                    rbx = addr2num(gdb.selected_frame().read_register("rbx"))&0xff
                    fmt = f"{rax} + {rbx} = {rax+rbx}"
                    data.append(fmt)
                elif("sub" in disa["asm"]):
                    rbx = parse(gdb.execute("x/bx $rbx",to_string=True))[0]&0xff
                    rax = addr2num(gdb.selected_frame().read_register("rax"))&0xff
                    fmt = f"{rax} - {rbx} = {(rax-rbx)&0xff}"
                    data.append(fmt)
                elif("cmp" in disa["asm"]):
                    rbx = parse(gdb.execute("x/bx $rbx+0x7",to_string=True))[0]&0xff
                    rax = addr2num(gdb.selected_frame().read_register("rax"))&0xff
                    fmt = f"{rax} ==  {rbx} = {(rax == rbx)}"
                    data.append(fmt)
                else:
                    data.append("???")
                gdb.execute("c")
            except Exception as e:
                for i in data:
                    print(i)
                print(e)
                break

def parse(f):
    f = f.split("\n")
    result = []
    for i in f:
        tmp = i.split("\t")
        for j in range(1,len(tmp)):
            result.append(int(tmp[j],16))
    return result
        
def addr2num(addr):
    try:
        return int(addr)  # Python 3
    except:
        return long(addr) # Python 2
SolverEquation()
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F70ca7zwoCjhzH5D22MoR%2Fimage.png?alt=media&amp;token=f562388b-f6f7-4a99-b9c1-b99f994e9990" alt=""><figcaption></figcaption></figure>

Since there are many values are same, so i use different value as our input for 5 times to get 5 different output. Each output i saved it to file and named it as `cmp{i}` . Here is example for `cmp5` file, output from input `qponmlkjihgfedcba9876543210`

```
113 ^ 57 = 72
112 ^ 72 = 56
111 ^ 56 = 87
110 ^ 87 = 57
109 ^ 57 = 84
108 ^ 84 = 56
107 ^ 56 = 83
106 ^ 83 = 57
105 ^ 57 = 80
104 ^ 80 = 56
103 ^ 56 = 95
102 ^ 95 = 57
101 ^ 57 = 92
100 ^ 92 = 56
99 ^ 56 = 91
98 ^ 91 = 57
97 ^ 57 = 88
57 ^ 88 = 97
56 ^ 97 = 89
55 ^ 89 = 110
54 ^ 110 = 88
53 ^ 88 = 109
52 ^ 109 = 89
51 ^ 89 = 106
50 ^ 106 = 88
49 ^ 88 = 105
48 ^ 105 = 89
87 - 24 = 63
63 ^ 43 = 20
5 + 20 = 25
22 - 25 = 253
3 + 72 = 75
75 ^ 43 = 96
5 + 96 = 101
78 - 101 = 233
253 ^ 233 = 20
56 ^ 43 = 19
5 + 19 = 24
29 - 24 = 5
20 ^ 5 = 17
56 - 24 = 32
32 ^ 43 = 11
5 + 11 = 16
37 - 16 = 21
17 ^ 21 = 4
3 + 57 = 60
60 ^ 43 = 23
5 + 23 = 28
24 - 28 = 252
4 ^ 252 = 248
84 ^ 43 = 127
5 + 127 = 132
106 - 132 = 230
248 ^ 230 = 30
80 - 24 = 56
56 ^ 43 = 19
5 + 19 = 24
5 - 24 = 237
30 ^ 237 = 243
3 + 83 = 86
86 ^ 43 = 125
5 + 125 = 130
105 - 130 = 231
243 ^ 231 = 20
57 ^ 43 = 18
5 + 18 = 23
14 - 23 = 247
20 ^ 247 = 227
57 - 24 = 33
33 ^ 43 = 10
5 + 10 = 15
0 - 35 = 221
221 - 15 = 206
227 ^ 206 = 45
3 + 56 = 59
59 ^ 43 = 16
5 + 16 = 21
6 - 21 = 241
45 ^ 241 = 220
95 ^ 43 = 116
5 + 116 = 121
127 + 5 = 132
132 - 121 = 11
220 ^ 11 = 215
91 - 24 = 67
67 ^ 43 = 104
5 + 104 = 109
83 - 109 = 230
215 ^ 230 = 49
3 + 92 = 95
95 ^ 43 = 116
5 + 116 = 121
75 - 121 = 210
49 ^ 210 = 227
56 ^ 43 = 19
5 + 19 = 24
56 - 24 = 32
227 ^ 32 = 195
97 - 24 = 73
73 ^ 43 = 98
5 + 98 = 103
41 - 103 = 194
195 ^ 194 = 1
3 + 57 = 60
60 ^ 43 = 23
5 + 23 = 28
19 - 28 = 247
1 ^ 247 = 246
88 ^ 43 = 115
5 + 115 = 120
106 - 120 = 242
246 ^ 242 = 4
88 - 24 = 64
64 ^ 43 = 107
5 + 107 = 112
122 - 112 = 10
4 ^ 10 = 14
3 + 89 = 92
92 ^ 43 = 119
5 + 119 = 124
105 - 124 = 237
14 ^ 237 = 227
110 ^ 43 = 69
5 + 69 = 74
7 - 74 = 189
227 ^ 189 = 94
106 - 24 = 82
82 ^ 43 = 121
5 + 121 = 126
51 - 126 = 181
94 ^ 181 = 235
3 + 109 = 112
112 ^ 43 = 91
5 + 91 = 96
61 - 96 = 221
235 ^ 221 = 54
89 ^ 43 = 114
5 + 114 = 119
92 - 119 = 229
54 ^ 229 = 211
89 - 24 = 65
65 ^ 43 = 106
5 + 106 = 111
124 - 111 = 13
211 ^ 13 = 222
3 + 88 = 91
91 ^ 43 = 112
5 + 112 = 117
91 - 117 = 230
222 ^ 230 = 56
105 ^ 43 = 66
5 + 66 = 71
39 - 71 = 224
56 ^ 224 = 216
216 ==  0 = False
```

Then i wrote a script to parse which value are constant and which value are variable. Also i write optimization to format it to equation format at the end.

```python
def parse(a1):
	tmp = a1.split(" ")
	return tmp

def check_ret(a1, a2, res2, res3):
	result = []
	for i in range(len(res2)):
		if((a1 == res2[i]) and (a2 == res3[i])):
			result.append(i)
	return result

def optimize(res, inp):
	tmp = res[27:]
	operator = ['+', '-', '^']
	arr = []
	opt = []
	data = ''
	init = True
	for i in tmp:
		# print(i) # debug
		check = True
		for j in inp:
			if(j in i):
				if(init and len(data) != 0):
					opt.append(data)
					init = False
				data = ' '.join(i[:3])
				check = False
				break
		if(check):
			if("res" in i[0] and "res" in i[2] and "^" == i[1]):
				opt.append(data)
				continue
			else:
				tmp2 = []
				for j in range(3):
					if("res[" not in i[j]):
						tmp2.append(i[j])
				str_tmp2 = ' '.join(tmp2)
				for j in operator:
					if(tmp2[0] == j):
						data = f"({data}) {str_tmp2}"
						break
					if(tmp2[1] == j):
						data = f"{str_tmp2} ({data})"
						break
	return '\n'.join(opt)


def check(f, g):
	res = []
	res2 = []
	res3 = []
	cnt_var = 0
	inp = [f"res[{i}]" for i in range(27)]
	for ind in range(len(g)):
		a1 = parse(f[ind])
		a2 = parse(g[ind])
		if(a1 == a2):
			res.append(a1)
			continue
		tmp_res = []
		for i in range(3):
			if(a1[i] != a2[i]):
				tmp_check = check_ret(a1[i], a2[i], res2, res3)
				length = len(tmp_check)
				if(length > 0):
					if(length > 1):
						val = '_'.join(map(str,tmp_check))
						if(ind < 27):
							inp.append(f"res[{val}]")
						tmp_res.append(f"res[{val}]")
					else:
						tmp_res.append(f"res[{tmp_check[0]}]")
				else:
					tmp_res.append(f"var[{cnt_var}]")
					cnt_var += 1
			else:
				tmp_res.append(a1[i])
		tmp_res.append(a1[3])
		tmp_res.append(f"res[{len(res2)}]")
		res.append(tmp_res)
		res2.append(a1[4])
		res3.append(a2[4])
	
	return optimize(res, inp)

def diff(f,g):
	for i in range(min(len(f),len(g))):
		a1 = parse(f[i])
		a2 = parse(g[i])
		if(a1[1] != a2[1]):
			return i
	return -1

files = [f"cmp{i}" for i in range(1,6)]
for i in range(len(files)):
	for j in range(i+1,len(files)):
		f = open(files[i],"r").read().split("\n")
		g = open(files[j],"r").read().split("\n")
		diff_index = diff(f, g)
		
		if(diff_index != -1):
			if(len(f) > len(g)):
				f.pop(diff_index)
			else:
				g.pop(diff_index)
		if(len(f) != len(g)):
			print("ERR : ",files[i], files[j], diff_index)
		else:
			result = check(f,g)
			out = open(f"{files[i]}_{files[j]}.out","w")
			out.write(result)
			out.close()
```

Here is the example output for `cmp1_cmp2.out` file

```
22 - (5 + ((res[2] - 24) ^ 43))
78 - (5 + ((3 + res[0]) ^ 43))
29 - (5 + (res[1] ^ 43))
37 - (5 + ((res[5] - 24) ^ 43))
24 - (5 + ((3 + res[3]) ^ 43))
106 - (5 + (res[4] ^ 43))
5 - (5 + ((res[8] - 24) ^ 43))
105 - (5 + ((3 + res[6]) ^ 43))
14 - (5 + (res[7] ^ 43))
221 - (0 - 35 (5 + ((res[11] - 24) ^ 43)))
6 - (5 + ((3 + res[9]) ^ 43))
132 - (127 + 5 (5 + (res[10_14_18_22] ^ 43)))
83 - (5 + ((res[10_14_18_22] - 24) ^ 43))
75 - (5 + ((3 + res[12_16_20_24]) ^ 43))
56 - (5 + (res[13] ^ 43))
41 - (5 + ((res[17] - 24) ^ 43))
19 - (5 + ((3 + res[15]) ^ 43))
106 - (5 + (res[12_16_20_24] ^ 43))
122 - (5 + ((res[12_16_20_24] - 24) ^ 43))
105 - (5 + ((3 + res[10_14_18_22]) ^ 43))
7 - (5 + (res[19] ^ 43))
51 - (5 + ((res[23] - 24) ^ 43))
61 - (5 + ((3 + res[21]) ^ 43))
92 - (5 + (res[10_14_18_22] ^ 43))
124 - var[27] ((res[26] - 24) ^ 43)
91 - (5 + ((3 + res[12_16_20_24]) ^ 43))
39 - (5 + (res[25] ^ 43))
```

Because there is still the same value, i fixed it manually by checking on each output with knowledge of the pattern used. Last, because i'm too lazy to reverse the process i just put the equation on `z3` and got the flag also first blood :> .&#x20;

```python
from z3 import *

var = [BitVec("x{}".format(i), 8) for i in range(27)]

res = [0 for _  in range(27)]

res[0] = var[0] ^ 57
for i in range(1,27):
	res[i] = var[i] ^ res[i-1]

s = Solver()
s.add(22 - (5 + ((res[2] - 24) ^ 43)) == 0)
s.add(78 - (5 + ((3 + res[0]) ^ 43)) == 0)
s.add(29 - (5 + (res[1] ^ 43))== 0)
s.add(37 - (5 + ((res[5] - 24) ^ 43)) == 0)
s.add(24 - (5 + ((3 + res[3]) ^ 43)) == 0)
s.add(106 - (5 + (res[4] ^ 43)) == 0)
s.add(5 - (5 + ((res[8] - 24) ^ 43)) == 0)
s.add(105 - (5 + ((3 + res[6]) ^ 43)) == 0)
s.add(14 - (5 + (res[7] ^ 43)) == 0)
s.add(221 - (5 + ((res[11] - 24) ^ 43)) == 0)
s.add(6 - (5 + ((3 + res[9]) ^ 43)) == 0)
s.add(132 - (5 + (res[10] ^ 43)) == 0)
s.add(83 - (5 + ((res[14] - 24) ^ 43)) == 0)
s.add(75 - (5 + ((3 + res[12]) ^ 43)) == 0)
s.add(56 - (5 + (res[13] ^ 43)) == 0)
s.add(41 - (5 + ((res[17] - 24) ^ 43)) == 0)
s.add(19 - (5 + ((3 + res[15]) ^ 43)) == 0)
s.add(106 - (5 + (res[16] ^ 43)) == 0)
s.add(122 - (5 + ((res[20] - 24) ^ 43)) == 0)
s.add(105 - (5 + ((3 + res[18]) ^ 43)) == 0)
s.add(7 - (5 + (res[19] ^ 43)) == 0)
s.add(51 - (5 + ((res[23] - 24) ^ 43)) == 0)
s.add(61 - (5 + ((3 + res[21]) ^ 43)) == 0)
s.add(92 - (5 + (res[22] ^ 43)) == 0)
s.add(124 - (5 + ((res[26] - 24) ^ 43)) == 0)
s.add(91 - (5 + ((3 + res[24]) ^ 43)) == 0)
s.add(39 - (5 + (res[25] ^ 43)) == 0)

print(s.check())

model = s.model()
flag = ""
for i in var:
    flag += chr(model[i].as_long())
print(flag)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FA1Zj0IWRN0FGdQfquRSF%2Fimage.png?alt=media&amp;token=565e06cb-21e1-4ece-963f-622ea8330c07" alt=""><figcaption></figcaption></figure>

Flag : flag{monads\_are\_like\_flags}
