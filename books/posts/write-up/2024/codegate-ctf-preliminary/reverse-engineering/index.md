# Reverse Engineering

<!-- challenge-index: 41ce9f35c57b6d63 -->

| Challenge | Topic |
| --- | --- |
| [Everlasting\_Message (250 pts)](#everlasting_message-250-pts) | Reverse Engineering |
| [prism\_messenger (358 pts)](#prism_messenger-358-pts) | Reverse Engineering |
| [LACUCARA\_VM (805 pts)](#lacucara_vm-805-pts) | Custom VM |

<!-- /challenge-index -->

## Everlasting\_Message (250 pts)

### Description

\-

### Solution

TBU

## prism\_messenger (358 pts)

### Description

\-

### Solution

TBU

## LACUCARA\_VM (805 pts)

### Description

\-

### Solution

```python

def print_hex(arr):
	tmp = []
	for i in arr:
		tmp.append(hex(i))
	print(tmp)

rol = lambda val, r_bits, max_bits: \
    (val << r_bits%max_bits) & (2**max_bits-1) | \
    ((val & (2**max_bits-1)) >> (max_bits-(r_bits%max_bits)))
 
ror = lambda val, r_bits, max_bits: \
    ((val & (2**max_bits-1)) >> r_bits%max_bits) | \
    (val << (max_bits-(r_bits%max_bits)) & (2**max_bits-1))

mask = 2**32 -1

# key = [0x0b07bbe1, 0x0407edb8]
key = [0x7F78E2E4, 0xD219BB1F]
# inp = [0x38396162, 0x63646566]
inp = [0x4b4f534f, 0x4e47424c]
sbox1 = [0x43415241, 0x4c414355]
# inp = [0x30313233, 0x34353637]

print_hex(inp)

tmp1 = []
for i in range(len(key)):
	tmp1.append(key[i] ^ sbox1[i] ^ inp[i])

dict1 = {}
dict1[0x9] = 0xc
dict1[0x8] = 0xf
dict1[0xd] = 0x0
dict1[0x8] = 0xf
dict1[0xb] = 0xa
dict1[0xa] = 0x9
dict1[0x3] = 0x1
dict1[0x7] = 0xd
dict1[0xc] = 0x3
dict1[0x2] = 0x2
dict1[0xf] = 0x6
dict1[0x0] = 0x4
dict1[0x6] = 0xe
dict1[0x5] = 0xb
dict1[0x1] = 0x7
dict1[0xe] = 0x5
dict1[0x4] = 0x8

dict2 = {}
dict2[0xc] = 0x9
dict2[0xf] = 0x8
dict2[0x0] = 0xd
dict2[0xf] = 0x8
dict2[0xa] = 0xb
dict2[0x9] = 0xa
dict2[0x1] = 0x3
dict2[0xd] = 0x7
dict2[0x3] = 0xc
dict2[0x2] = 0x2
dict2[0x6] = 0xf
dict2[0x4] = 0x0
dict2[0xe] = 0x6
dict2[0xb] = 0x5
dict2[0x7] = 0x1
dict2[0x5] = 0xe
dict2[0x8] = 0x4

xor_val1 = [0x3707344, 0x299f31d0, 0xec4e6c89, 0x38d01377, 0x34e90c6c, 0]
xor_val2 = [0x13198a2e, 0xa4093822, 0x82efa98, 0x452821e6, 0xbe5466cf, 0]

for y in range(5):
	
	# print_hex(tmp1)
	result1 = 0
	for i in range(8):
		tmp2 = (tmp1[1] >> (4 * i)) | ((tmp1[0] << (32 - 4 * i)) & mask)
		index = tmp2 & 0xf
		result1 |= (dict1[index] << (4 * i))

	result2 = 0
	for i in range(8):
		tmp2 = tmp1[0] >> (i * 4)
		index = tmp2 & 0xf
		result2 |= (dict1[index] << (4 * i))
	
	# print("input", hex(result1), hex(result2))
	first_block = [result2 >> 0x10, ((result1 << 0x10) & mask) >> 0x10]
	second_block = [((result2 << 0x10) & mask) >> 0x10, result1 >> 0x10]
	arr2 = []
	for x in range(2):
		tmp2 = first_block[x]
		arr1 = [0]
		for i in range(1, 0x10):
			arr1.append(tmp2 >> i)
		
		result3 = tmp2
		
		var1 = arr1[0x8] ^ arr1[0xc]
		var2 = arr1[0xb] ^ arr1[0xf]
		var3 = arr1[0x7] ^ arr1[0xb]
		var4 = arr1[0x4] ^ arr1[0x8]
		var5 = arr1[0xa] ^ arr1[0xe]
		
		result3 ^= var4
		
		var6 = arr1[0x6] ^ arr1[0xe]
		var7 = arr1[0x3] ^ var3
		var8 = arr1[0x2] ^ var6
		var9 = arr1[0x9] ^ arr1[0xd]
		var10 = arr1[0x1] ^ var9
		var11 = arr1[0x4] ^ var1
		var12 = arr1[0x7] ^ var2
		var13 = arr1[0x2] ^ arr1[0x6]
		var14 = var13 ^ arr1[0xa]
		var15 = var1 ^ tmp2
		var16 = arr1[0xd] ^ arr1[0x1]
		var17 = arr1[0x5] ^ var16
		var18 = var2 ^ arr1[0x3]
		var19 = var5 ^ arr1[0x6]
		var20 = arr1[0x1] ^ arr1[0x9] ^ arr1[0x5]
		var21 = arr1[0x4] ^ arr1[0xc] ^ tmp2
		var22 = arr1[0x3] ^ arr1[0x7] ^ arr1[0xf]
		var23 = var5 ^ arr1[0x2]
		var24 = arr1[0x5] ^ var9
		
		
		result4 = (result3 & 0x1)
		result4 |= (var7 << 0xf) 
		result4 |= (var8 << 0xe) & 0x4000
		result4 |= (var10 << 0xd) & 0x2000
		result4 |= (var11 << 0xc) & 0x1000
		result4 |= (var12 << 0xb) & 0x800
		result4 |= (var14 << 0xa) & 0x400
		result4 |= (var17 << 0x9) & 0x200
		result4 |= (var15 << 0x8) & 0x100
		result4 |= (var18 << 0x7) & 0xff
		result4 |= (var19 << 0x6) & 0x40
		result4 |= (var20 << 0x5) & 0x20
		result4 |= (var21 << 0x4) & 0x10
		result4 |= (var22 << 0x3) & 0x8
		result4 |= (var23 << 0x2) & 0x4
		result4 |= (var24 << 0x1) & 0x2
		
		result5 = ((result4 << 0x10) & mask) >> 0x10
		# print(hex(result4))
		
	
		tmp2 = second_block[x]
		arr1 = [0]
		# print("pt", hex(tmp2))
		for i in range(1, 0x10):
			arr1.append(tmp2 >> i)
		
		var1 = arr1[0x8] ^ arr1[0xc]
		var2 = arr1[0xb] ^ arr1[0xf]
		var3 = arr1[0xe] ^ arr1[0xa]
		var4 = arr1[0x7] ^ var2
		var5 = arr1[0x4] ^ var1
		var6 = arr1[0x6] ^ arr1[0xa]
		var7 = var6 ^ arr1[0x2]
		var8 = arr1[0x9] ^ arr1[0xd]
		var9 = arr1[0x5] ^ arr1[0xd]
		var10 = var9 ^ arr1[0x1]
		var11 = tmp2 ^ var1
		var12 = arr1[0x3] ^ var2
		var13 = var3 ^ arr1[0x6]
		var14 = arr1[0x1] ^ arr1[0x5]
		var15 = var14 ^ arr1[0x9]
		var16 = arr1[0x4] ^ arr1[0xc]
		var17 = var16 ^ tmp2
		var18 = arr1[0x7] ^ arr1[0xf]
		var19 = var18 ^ arr1[0x3]
		var20 = var3 ^ arr1[0x2]
		var21 = var8 ^ arr1[0x5]
		var22 = arr1[0x4] ^ arr1[0x8]
		var23 = var22 ^ tmp2
		var24 = arr1[0x7] ^ arr1[0xb]
		var25 = var24 ^ arr1[0x3]
		var26 = arr1[0x2] ^ arr1[0x6]
		var27 = var26 ^ arr1[0xe]
		var28 = var8 ^ arr1[0x1]
		
		result4 = (var5 & 0x1)
		result4 |= (var4 << 0xf) 
		result4 |= (var7 << 0xe) & 0x4000
		result4 |= (var10 << 0xd) & 0x2000
		result4 |= (var11 << 0xc) & 0x1000
		result4 |= (var12 << 0xb) & 0x800
		result4 |= (var13 << 0xa) & 0x400
		result4 |= (var15 << 0x9) & 0x200
		result4 |= (var17 << 0x8) & 0x100
		result4 |= (var19 << 0x7) & 0xff
		result4 |= (var20 << 0x6) & 0x40
		result4 |= (var21 << 0x5) & 0x20
		result4 |= (var23 << 0x4) & 0x10
		result4 |= (var25 << 0x3) & 0x8
		result4 |= (var27 << 0x2) & 0x4
		result4 |= (var28 << 0x1) & 0x2
		
		result6 = ((result4 << 0x10) & mask) >> 0x10
		arr2.append(result5)
		arr2.append(result6)
	
	ct1 = (arr2[3] << 0x10) | arr2[2]
	ct2 = (arr2[0] << 0x10) | arr2[1]
	
	var1 = ct2 >> 0x1c
	var2 = (var1 << 0x14) & mask
	var3 = ct2 >> 0x18
	var4 = var3 & 0xf
	var5 = ct2 >> 0x4
	var6 = (var5 << 0x1c) & mask
	var7 = var6 | var2
	
	var8 = (ct1 << 0x8) & mask
	var9 = var8 & 0xf00
	var10 = var7 | var9
	
	var11 = ct2 >> 0x8
	var12 = var11 & 0xf000
	var13 = var4 | var12
	
	var14 = (ct2 << 0x8) & mask
	var15 = var14 & 0xf000000
	var16 = var15 | var13
	
	var17 = var10 | ((ct2 >> 0x8) & 0xf0)
	var18 = var17 | (((ct2 << 0x8) & mask) & 0xf0000)
	var19 = var16 | ((ct2 << 0x8) & 0xf00)
	var20 = (ct2 << 0x4) & mask
	var21 = ct1 >> 0x1c
	var22 = var20 | var21
	var23 = var19 | (((var22 << 0x14) & mask) & 0xf00000)
	var24 = var18 | ((ct1 >> 0x18) & 0xf)
	
	var25 = (ct2 << 0xc) & mask
	var26 = (ct1 >> 0x14) | var25
	var27 = var24 | ((var26 << 0xc) & 0xf000)
	
	var28 = ((ct1 << 0x8) & mask) & 0xf000000
	var29 = var23 | ((ct1  >> 0x8) & 0xf0)
	var30 = var29 | (((ct1 << 0x8) & mask) & 0xf0000)
	
	var31 = ((ct1 >> 0x4) << 0x1c) & mask
	
	var32 = var30 | var31
	var33 = var27 | var28
	
	# print("result", hex(var32), hex(var33))
	tmp1[1] = var32 ^ 0x4c414355 ^ xor_val1[y]
	tmp1[0] = var33 ^ 0x43415241 ^ xor_val2[y]

# separator

for y in range(1):
	
	# print_hex(tmp1)
	result1 = 0
	for i in range(8):
		tmp2 = (tmp1[1] >> (4 * i)) | ((tmp1[0] << (32 - 4 * i)) & mask)
		index = tmp2 & 0xf
		result1 |= (dict1[index] << (4 * i))

	result2 = 0
	for i in range(8):
		tmp2 = tmp1[0] >> (i * 4)
		index = tmp2 & 0xf
		result2 |= (dict1[index] << (4 * i))
	
	# print("input", hex(result1), hex(result2))
	# correct
	first_block = [result2 >> 0x10, ((result1 << 0x10) & mask) >> 0x10]
	second_block = [((result2 << 0x10) & mask) >> 0x10, result1 >> 0x10]
	arr2 = []
	
	for x in range(2):
		tmp2 = first_block[x]
		arr1 = [0]
		for i in range(1, 0x10):
			arr1.append(tmp2 >> i)
		
		result3 = tmp2
		
		var1 = arr1[0x8] ^ arr1[0xc]
		var2 = arr1[0xb] ^ arr1[0xf]
		var3 = arr1[0x7] ^ arr1[0xb]
		var4 = arr1[0x4] ^ arr1[0x8]
		var5 = arr1[0xa] ^ arr1[0xe]
		
		result3 ^= var4
		
		var6 = arr1[0x6] ^ arr1[0xe]
		var7 = arr1[0x3] ^ var3
		var8 = arr1[0x2] ^ var6
		var9 = arr1[0x9] ^ arr1[0xd]
		var10 = arr1[0x1] ^ var9
		var11 = arr1[0x4] ^ var1
		var12 = arr1[0x7] ^ var2
		var13 = arr1[0x2] ^ arr1[0x6]
		var14 = var13 ^ arr1[0xa]
		var15 = var1 ^ tmp2
		var16 = arr1[0xd] ^ arr1[0x1]
		var17 = arr1[0x5] ^ var16
		var18 = var2 ^ arr1[0x3]
		var19 = var5 ^ arr1[0x6]
		var20 = arr1[0x1] ^ arr1[0x9] ^ arr1[0x5]
		var21 = arr1[0x4] ^ arr1[0xc] ^ tmp2
		var22 = arr1[0x3] ^ arr1[0x7] ^ arr1[0xf]
		var23 = var5 ^ arr1[0x2]
		var24 = arr1[0x5] ^ var9
		
		
		result4 = (result3 & 0x1)
		result4 |= (var7 << 0xf) 
		result4 |= (var8 << 0xe) & 0x4000
		result4 |= (var10 << 0xd) & 0x2000
		result4 |= (var11 << 0xc) & 0x1000
		result4 |= (var12 << 0xb) & 0x800
		result4 |= (var14 << 0xa) & 0x400
		result4 |= (var17 << 0x9) & 0x200
		result4 |= (var15 << 0x8) & 0x100
		result4 |= (var18 << 0x7) & 0xff
		result4 |= (var19 << 0x6) & 0x40
		result4 |= (var20 << 0x5) & 0x20
		result4 |= (var21 << 0x4) & 0x10
		result4 |= (var22 << 0x3) & 0x8
		result4 |= (var23 << 0x2) & 0x4
		result4 |= (var24 << 0x1) & 0x2
		
		result5 = ((result4 << 0x10) & mask) >> 0x10
		# print(hex(result4))
		
	
		tmp2 = second_block[x]
		arr1 = [0]
		# print("pt", hex(tmp2))
		for i in range(1, 0x10):
			arr1.append(tmp2 >> i)
		
		var1 = arr1[0x8] ^ arr1[0xc]
		var2 = arr1[0xb] ^ arr1[0xf]
		var3 = arr1[0xe] ^ arr1[0xa]
		var4 = arr1[0x7] ^ var2
		var5 = arr1[0x4] ^ var1
		var6 = arr1[0x6] ^ arr1[0xa]
		var7 = var6 ^ arr1[0x2]
		var8 = arr1[0x9] ^ arr1[0xd]
		var9 = arr1[0x5] ^ arr1[0xd]
		var10 = var9 ^ arr1[0x1]
		var11 = tmp2 ^ var1
		var12 = arr1[0x3] ^ var2
		var13 = var3 ^ arr1[0x6]
		var14 = arr1[0x1] ^ arr1[0x5]
		var15 = var14 ^ arr1[0x9]
		var16 = arr1[0x4] ^ arr1[0xc]
		var17 = var16 ^ tmp2
		var18 = arr1[0x7] ^ arr1[0xf]
		var19 = var18 ^ arr1[0x3]
		var20 = var3 ^ arr1[0x2]
		var21 = var8 ^ arr1[0x5]
		var22 = arr1[0x4] ^ arr1[0x8]
		var23 = var22 ^ tmp2
		var24 = arr1[0x7] ^ arr1[0xb]
		var25 = var24 ^ arr1[0x3]
		var26 = arr1[0x2] ^ arr1[0x6]
		var27 = var26 ^ arr1[0xe]
		var28 = var8 ^ arr1[0x1]
		
		result4 = (var5 & 0x1)
		result4 |= (var4 << 0xf) 
		result4 |= (var7 << 0xe) & 0x4000
		result4 |= (var10 << 0xd) & 0x2000
		result4 |= (var11 << 0xc) & 0x1000
		result4 |= (var12 << 0xb) & 0x800
		result4 |= (var13 << 0xa) & 0x400
		result4 |= (var15 << 0x9) & 0x200
		result4 |= (var17 << 0x8) & 0x100
		result4 |= (var19 << 0x7) & 0xff
		result4 |= (var20 << 0x6) & 0x40
		result4 |= (var21 << 0x5) & 0x20
		result4 |= (var23 << 0x4) & 0x10
		result4 |= (var25 << 0x3) & 0x8
		result4 |= (var27 << 0x2) & 0x4
		result4 |= (var28 << 0x1) & 0x2
		
		result6 = ((result4 << 0x10) & mask) >> 0x10
		arr2.append(result5)
		arr2.append(result6)
	# correct
	
	ct1 = (arr2[3] << 0x10) | arr2[2]
	ct2 = (arr2[0] << 0x10) | arr2[1]

	var7 = 0
	var8 = 0
	
	for j in range(8):
		var2 = (ct1 >> (0x4 * j))
		var3 = (ct2 << (32 - 0x4*j)) & mask
		var4 = var2 | var3
		var6 = 0x10 + (var4 & 0xf)
		index = (var6 & 0xf)
		var7 |= dict2[index] << (j*4)
	
	for j in range(8):
		var2 = (ct2 >> (0x4 * j))
		var3 = (ct1 << (32 - 0x4*j)) & mask
		var4 = var2 | var3
		var6 = 0x10 + (var4 & 0xf)
		index = (var6 & 0xf)
		var8 |= dict2[index] << (j*4)

	ct1 = (var7 ^ 0x4c414355 ^ 0xfd955cb1)
	ct2 = (var8 ^ 0x43415241 ^ 0x7ef84f78)


xor_val3 = [0xf1ac43aa, 0x25323c54, 0xe0e3610d, 0xca0c2399, 0]
xor_val4 = [0x85840851, 0xc882d32f, 0x64a51195, 0xd3b5a399, 0]

for y in range(5):

	# print("inp", hex(ct1), hex(ct2))
	var1 = ct2 >> 0x1c
	var2 = (var1 << 0x14) & mask
	var5 = ct2 >> 0x4
	var6 = (var5 << 0x1c) & mask
	var7 = var6 | var2
	
	var3 = (ct2 << 0x8) & mask
	var4 = (ct1 >> 0x18) & 0xf
	var8 = (ct2 >> 0x18)
	
	var9 = ((ct1 << 0x8) & mask) & 0xf00
	var10 = var4 | var9
	
	var11 = var8 & 0xf
	var12 = var7 | var11
	
	var13 = (ct2 >> 0x8) & 0xf000
	var14 = var13 | var10
	var15 = var3 & 0xf000000
	var16 = var12 | var15
	
	var17 = var16 | ((ct2 >> 0x8) & 0xf0)
	var18 = var14 | (var3 & 0xf0000)
	var19 = var17 | (var3 & 0xf00)
	
	var20 = (ct2 << 0x4)
	var21 = (ct1 >> 0x1c)
	var22 = var20 | var21
	var23 = var18 | (((var22 << 0x14) & mask) & 0xf00000)
	
	var24 = (ct2 << 0xc) & mask
	var25 = (ct1 >> 0x14)
	var26 = var24 | var25
	var27 = var19 | ((var26 << 0xc) & 0xf000)
	var28 = var23 | (((ct1 << 0x8) & mask) & 0xf000000)
	var29 = var28 | ((ct1 >> 0x8) & 0xf0)
	var30 = ((ct1 << 0x8) & mask) & 0xf0000
	var31 = ((ct1 >> 0x4) << 0x1c) & mask
	
	result1 = var29 | var31
	result2 = var27 | var30
	
	first_block = [result2 >> 0x10, ((result1 << 0x10) & mask) >> 0x10]
	second_block = [((result2 << 0x10) & mask) >> 0x10, result1 >> 0x10]
	arr2 = []
	
	for x in range(2):
		tmp2 = first_block[x]
		arr1 = [0]
		for i in range(1, 0x10):
			arr1.append(tmp2 >> i)
		
		result3 = tmp2
		
		var1 = arr1[0x8] ^ arr1[0xc]
		var2 = arr1[0xb] ^ arr1[0xf]
		var3 = arr1[0x7] ^ arr1[0xb]
		var4 = arr1[0x4] ^ arr1[0x8]
		var5 = arr1[0xa] ^ arr1[0xe]
		
		result3 ^= var4
		
		var6 = arr1[0x6] ^ arr1[0xe]
		var7 = arr1[0x3] ^ var3
		var8 = arr1[0x2] ^ var6
		var9 = arr1[0x9] ^ arr1[0xd]
		var10 = arr1[0x1] ^ var9
		var11 = arr1[0x4] ^ var1
		var12 = arr1[0x7] ^ var2
		var13 = arr1[0x2] ^ arr1[0x6]
		var14 = var13 ^ arr1[0xa]
		var15 = var1 ^ tmp2
		var16 = arr1[0xd] ^ arr1[0x1]
		var17 = arr1[0x5] ^ var16
		var18 = var2 ^ arr1[0x3]
		var19 = var5 ^ arr1[0x6]
		var20 = arr1[0x1] ^ arr1[0x9] ^ arr1[0x5]
		var21 = arr1[0x4] ^ arr1[0xc] ^ tmp2
		var22 = arr1[0x3] ^ arr1[0x7] ^ arr1[0xf]
		var23 = var5 ^ arr1[0x2]
		var24 = arr1[0x5] ^ var9
		
		
		result4 = (result3 & 0x1)
		result4 |= (var7 << 0xf) 
		result4 |= (var8 << 0xe) & 0x4000
		result4 |= (var10 << 0xd) & 0x2000
		result4 |= (var11 << 0xc) & 0x1000
		result4 |= (var12 << 0xb) & 0x800
		result4 |= (var14 << 0xa) & 0x400
		result4 |= (var17 << 0x9) & 0x200
		result4 |= (var15 << 0x8) & 0x100
		result4 |= (var18 << 0x7) & 0xff
		result4 |= (var19 << 0x6) & 0x40
		result4 |= (var20 << 0x5) & 0x20
		result4 |= (var21 << 0x4) & 0x10
		result4 |= (var22 << 0x3) & 0x8
		result4 |= (var23 << 0x2) & 0x4
		result4 |= (var24 << 0x1) & 0x2
		
		result5 = ((result4 << 0x10) & mask) >> 0x10
		# print(hex(result4))
		
	
		tmp2 = second_block[x]
		arr1 = [0]
		# print("pt", hex(tmp2))
		for i in range(1, 0x10):
			arr1.append(tmp2 >> i)
		
		var1 = arr1[0x8] ^ arr1[0xc]
		var2 = arr1[0xb] ^ arr1[0xf]
		var3 = arr1[0xe] ^ arr1[0xa]
		var4 = arr1[0x7] ^ var2
		var5 = arr1[0x4] ^ var1
		var6 = arr1[0x6] ^ arr1[0xa]
		var7 = var6 ^ arr1[0x2]
		var8 = arr1[0x9] ^ arr1[0xd]
		var9 = arr1[0x5] ^ arr1[0xd]
		var10 = var9 ^ arr1[0x1]
		var11 = tmp2 ^ var1
		var12 = arr1[0x3] ^ var2
		var13 = var3 ^ arr1[0x6]
		var14 = arr1[0x1] ^ arr1[0x5]
		var15 = var14 ^ arr1[0x9]
		var16 = arr1[0x4] ^ arr1[0xc]
		var17 = var16 ^ tmp2
		var18 = arr1[0x7] ^ arr1[0xf]
		var19 = var18 ^ arr1[0x3]
		var20 = var3 ^ arr1[0x2]
		var21 = var8 ^ arr1[0x5]
		var22 = arr1[0x4] ^ arr1[0x8]
		var23 = var22 ^ tmp2
		var24 = arr1[0x7] ^ arr1[0xb]
		var25 = var24 ^ arr1[0x3]
		var26 = arr1[0x2] ^ arr1[0x6]
		var27 = var26 ^ arr1[0xe]
		var28 = var8 ^ arr1[0x1]
		
		result4 = (var5 & 0x1)
		result4 |= (var4 << 0xf) 
		result4 |= (var7 << 0xe) & 0x4000
		result4 |= (var10 << 0xd) & 0x2000
		result4 |= (var11 << 0xc) & 0x1000
		result4 |= (var12 << 0xb) & 0x800
		result4 |= (var13 << 0xa) & 0x400
		result4 |= (var15 << 0x9) & 0x200
		result4 |= (var17 << 0x8) & 0x100
		result4 |= (var19 << 0x7) & 0xff
		result4 |= (var20 << 0x6) & 0x40
		result4 |= (var21 << 0x5) & 0x20
		result4 |= (var23 << 0x4) & 0x10
		result4 |= (var25 << 0x3) & 0x8
		result4 |= (var27 << 0x2) & 0x4
		result4 |= (var28 << 0x1) & 0x2
		
		result6 = ((result4 << 0x10) & mask) >> 0x10
		arr2.append(result5)
		arr2.append(result6)

	ct1 = (arr2[3] << 0x10) | arr2[2]
	ct2 = (arr2[0] << 0x10) | arr2[1]
	
	var7 = 0
	var8 = 0
	
	for j in range(8):
		var2 = (ct1 >> (0x4 * j))
		var3 = (ct2 << (32 - 0x4*j)) & mask
		var4 = var2 | var3
		var6 = 0x10 + (var4 & 0xf)
		index = (var6 & 0xf)
		var7 |= dict2[index] << (j*4)
	
	for j in range(8):
		var2 = (ct2 >> (0x4 * j))
		var3 = (ct1 << (32 - 0x4*j)) & mask
		var4 = var2 | var3
		var6 = 0x10 + (var4 & 0xf)
		index = (var6 & 0xf)
		var8 |= dict2[index] << (j*4)

	if y == 4:
		var1 = (inp[0] << 0x1f) & mask
		var2 = inp[1] >> 0x1
		var3 = var2 | var1
		var4 = (inp[1] << 0x1f) & mask
		var5 = inp[0] >> 0x1
		var6 = var5 | var4

		print(hex(var3), hex(var6))

		ct1 = var7 ^ 0x4c414355 ^ var3
		ct2 = var8 ^ 0x43415241 ^ var6
	else:
		ct1 = var7 ^ 0x4c414355 ^ xor_val3[y]
		ct2 = var8 ^ 0x43415241 ^ xor_val4[y]
	
ct1 ^= 0xc97c50dd
ct2 ^= 0xc0ac29b7
print(hex(ct1))
print(hex(ct2))

```
