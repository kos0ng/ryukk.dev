# Reverse Engineering

| Challenge                    | Link                          |
| ---------------------------- | ----------------------------- |
| Flag Generator (4 solves) 🥈 | [Here](#free-play-495-points) |

## Flag Generator (4 solves)

### Description

\-

### Solution

Should be unintended, since the key length is only 6. I brute each 3 bytes and get the flag by guess it :p . Here is script i used to bruteforce the possible key and value

```python
from itertools import permutations
import string

def check(hello):
	return all(c in string.printable for c in hello)

ct = [0x7d, 0x9c, 0x73, 0xb4, 0xc, 0x8e, 0x4e, 0x99, 0x71, 0xe0, 0xb, 0x9e, 0x63, 0xd8, 0x75, 0xef, 0x50, 0xa3, 0x20, 0xde, 0x42, 0xf4, 0x4d, 0x8c, 0x22, 0xdf, 0x42, 0xe1, 0x4d, 0x92, 0x30, 0x8c, 0x3c]

list_poss = [i for i in range(256)]

for i in permutations(list_poss, 3):
	poss = []
	for j in range(0,len(ct)-5,6):
		tmp = bytes([(ct[j+3]^i[0])]) # tmp = bytes([(ct[j]^i[0])])
		tmp += bytes([ct[j+4]^i[1]]) # tmp += bytes([ct[j+1]^i[1]])
		tmp += bytes([ct[j+5]^i[2]]) # tmp += bytes([ct[j+2]^i[1]])
		try:
			tmp = tmp.decode()
			if(check(tmp)):
				poss.append(tmp)
		except Exception as e:
			break
	if(len(poss) == 5):
		print(i, poss)
```

Flag : l1n34r\_4lg3bruhhh\_1s\_sup3r\_fun!!!
