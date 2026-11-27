# Forensic

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>Sequel (499 pts)</td><td><a href="#sequel-499-pts">Here</a></td></tr></tbody></table>

## Sequel (499 pts)

### Description

\-

### Solution

Given json file, when we check the data we found sql injection payload on query parameter.&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/gFprsQ8ccnJu0p3zfv4V4jOi0rgjg8dAF54Olyo-JmtOlx63gDKvZlSOIdkRh86fx7g6wq2PhcWL0B5A4h0Ron8Y0xceeyPYKKuL07Cwzuj-hC9iRcCwhGhGPxu-M_m_gU22thQJzEfNebSiE6ZpR9s" alt=""><figcaption></figcaption></figure>

Payload we found are used for time based sql injection based on the time to deliver the generated file from randomblob. So the first step we do is determining the difference between true response or false response. In this case we found that we can utilize “time” key to determine that, so if the return is randomblob(1500000000/2) the time should be greater than 3 but if the return is randomblob(1000000000/2) the time should be greater than 2 but lower than 3. After that since we know the operation, index value (substring), and the result from query we can use z3 to find the correct value. For the operation we trial error also analyzing the result to find the correct parenthesis, something like if there is modulo and multiplication which operation will be done first. Here is parser we create to get the z3 constraint format.

```python
import json
import re

def check(url):
	for i in blacklist:
		if(url.endswith(i)):
			return True
	return False

def beautify_sql(text):
	text = text.lower()
	text = text.replace("/**/", " ")
	return text

def check_sqli(data):
	req = json.loads(data['request']['postData']['text'])
	resp = data['response']
	ts = data['time']
	query = beautify_sql(req['query'])
	if(query == 'undefined'):
		return -1
	substr_data = re.findall(r"substr\((.*?)\)", query)
	bool_val = re.findall(r"then hex\((.*?)\)", query)
	bool_val.append(re.findall(r"else hex\((.*?)\)", query)[0])
	result_val = re.findall(r"\) like \s*(.*)", query)
	operator_val = re.findall(r"\'%cj%\'\)(.*?)\(", query)
	
	# print(substr_data,ts,bool_val)
	# print(bool_val)
	# print(result_val)
	# print(operator_val)
	
	if(ts > 3000):
		true_index = bool_val.index('randomblob(1500000000/2')
	else:
		true_index = bool_val.index('randomblob(1000000000/2')

	if(true_index == 1):
		return -1
	else:
		if(len(substr_data) == 2):
			tmp1 = substr_data[0].split(",")[1]
			tmp2 = substr_data[1].split(",")[1]
			tmp_res = result_val[0].split(" ")[0]
			if("-" not in tmp1):
				tmp1 += " + 1"
			if("-" not in tmp2):
				tmp2 += " + 1"
			if("'" in tmp_res):
				fmt = f"s.add((a1[{tmp1}] {operator_val[0]} a1[{tmp2}]) == {bytes.fromhex(tmp_res[1:-1]).decode()} )"
			else:
				fmt = f"s.add((a1[{tmp1}] {operator_val[0]} a1[{tmp2}]) == {tmp_res} )"
			return fmt
		elif(len(substr_data) == 3):
			tmp1 = substr_data[0].split(",")[1]
			tmp2 = substr_data[1].split(",")[1]
			tmp3 = substr_data[2].split(",")[1]
			if("-" not in tmp1):
				tmp1 += " + 1"
			if("-" not in tmp2):
				tmp2 += " + 1"
			if("-" not in tmp3):
				tmp3 += " + 1"


			tmp_res = result_val[0].split(" ")[0]
			# print(operator_val)
			if("'" in tmp_res):
				if('%' in operator_val and '*' in operator_val):
					fmt = f"s.add((a1[{tmp1}] {operator_val[0]} a1[{tmp2}]) {operator_val[1]} a1[{tmp3}] == {bytes.fromhex(tmp_res[1:-1]).decode()} )"
				elif('%' in operator_val):
					ind = operator_val.index('%')
					# print("ind", ind, '%')
					if(ind == 0):
						fmt = f"s.add((a1[{tmp1}] {operator_val[0]} a1[{tmp2}]) {operator_val[1]} a1[{tmp3}] == {bytes.fromhex(tmp_res[1:-1]).decode()} )"
					else:
						fmt = f"s.add(a1[{tmp1}] {operator_val[0]} (a1[{tmp2}] {operator_val[1]} a1[{tmp3}]) == {bytes.fromhex(tmp_res[1:-1]).decode()} )"
				elif('*' in operator_val):
					ind = operator_val.index('*')
					# print("ind", ind, '*')
					if(ind == 0):
						fmt = f"s.add((a1[{tmp1}] {operator_val[0]} a1[{tmp2}]) {operator_val[1]} a1[{tmp3}] == {bytes.fromhex(tmp_res[1:-1]).decode()} )"
					else:
						fmt = f"s.add(a1[{tmp1}] {operator_val[0]} (a1[{tmp2}] {operator_val[1]} a1[{tmp3}]) == {bytes.fromhex(tmp_res[1:-1]).decode()} )"
				else:
					fmt = f"s.add((a1[{tmp1}] {operator_val[0]} a1[{tmp2}]) {operator_val[1]} a1[{tmp3}] == {bytes.fromhex(tmp_res[1:-1]).decode()} )"
			else:
				if('%' in operator_val and '*' in operator_val):
					fmt = f"s.add((a1[{tmp1}] {operator_val[0]} a1[{tmp2}]) {operator_val[1]} a1[{tmp3}] == {tmp_res} )"
				elif('%' in operator_val):
					ind = operator_val.index('%')
					# print("ind", ind, '%')
					if(ind == 0):
						fmt = f"s.add((a1[{tmp1}] {operator_val[0]} a1[{tmp2}]) {operator_val[1]} a1[{tmp3}] == {tmp_res} )"
					else:
						fmt = f"s.add(a1[{tmp1}] {operator_val[0]} (a1[{tmp2}] {operator_val[1]} a1[{tmp3}]) == {tmp_res} )"
				elif('*' in operator_val):
					ind = operator_val.index('*')
					# print("ind", ind, '*')
					if(ind == 0):
						fmt = f"s.add((a1[{tmp1}] {operator_val[0]} a1[{tmp2}]) {operator_val[1]} a1[{tmp3}] == {tmp_res} )"
					else:
						fmt = f"s.add(a1[{tmp1}] {operator_val[0]} (a1[{tmp2}] {operator_val[1]} a1[{tmp3}]) == {tmp_res} )"
				else:
					fmt = f"s.add((a1[{tmp1}] {operator_val[0]} a1[{tmp2}]) {operator_val[1]} a1[{tmp3}] == {tmp_res} )"
			return fmt





f = open("sequel","r").read()
data = json.loads(f)

constraint = []

flag = [0 for _ in range(100)]

blacklist = ['js', 'css', 'ico']
for i in data['log']['entries'][12:]:
	if(check(i['request']['url'])):
		continue
	else:
		tmp_check = check_sqli(i)
		if(tmp_check != -1):
			constraint.append(tmp_check)
		else:
			continue

for i in constraint:
	print(i)

```

<figure><img src="https://lh7-us.googleusercontent.com/wwk3Ps3TMHLDQ9FWcWQtV25OXzvCzA_zv0u6ENb3Q__b_GXJIDML5lqpzFZPeeHtz7pSnP5sHrV-yfeILUl13bZXye7tUGzXEe75QG5Qz7zWJ_Zg3cdyqa9gSrrx-3LOiamoW3N_eFmToJXV9ORF9Us" alt=""><figcaption></figcaption></figure>

After that just put the constraint into z3. When the first time running the solver , it produce unsat/failed then we found that there is invalid constraint that make our solver fail (because the value is impossible since the sum of two printable charset should not be greater than 1 byte). So after commenting that constraint we got the valid flag. Here is the final solver we use

```python
from z3 import *

a1 = [Int("x{}".format(i)) for i in range(50)]

s = Solver()
for i in range(len(a1)):
	s.add(a1[i] > 0)
	s.add(a1[i] < 128)

s.add((a1[-23] % a1[-18]) == 52 )
s.add((a1[-42] * a1[-36]) == 6888 )
s.add((a1[0x1 + 1] * a1[-35]) == 6700 )
s.add((a1[-2] % a1[-39]) - a1[-48] == -22 )
s.add((a1[-23] * a1[0x12 + 1]) - a1[0x9 + 1] == 5201 )
s.add((a1[-36] + a1[-30]) == 106 )
s.add((a1[0x2c + 1] % a1[0xb + 1]) + a1[-47] == 121 )
s.add(a1[-46] - (a1[0x23 + 1] * a1[-4]) == -4994 )
s.add((a1[0x11 + 1] * a1[0x24 + 1]) * a1[-28] == 297000 )
s.add((a1[-18] * a1[-26]) * a1[-26] == 922082 )
s.add((a1[-29] % a1[0x2c + 1]) + a1[0xd + 1] == 57 )
s.add((a1[-46] * a1[0x26 + 1]) % a1[0xb + 1] == 46 )
s.add((a1[-33] % a1[-32]) == 49 )
s.add((a1[0x17 + 1] - a1[-1]) == -28 )
s.add((a1[-2] * a1[-48]) == 6499 )
s.add((a1[0x21 + 1] - a1[0x19 + 1]) == 1 )
s.add((a1[-43] * a1[-6]) == 5151 )
s.add((a1[-8] * a1[-3]) == 5252 )
s.add((a1[0x21 + 1] % a1[0x7 + 1]) * a1[-24] == 2450 )
s.add((a1[-17] - a1[-14]) == -2 )
s.add((a1[-48] + a1[0x16 + 1]) == 122 )
s.add((a1[0x10 + 1] * a1[-12]) % a1[-14] == 18 )
s.add((a1[0x3 + 1] * a1[0x1e + 1]) - a1[-2] == 2453 )
s.add(a1[0x2b + 1] - (a1[-22] % a1[-33]) == 100 )
s.add((a1[0x4 + 1] * a1[-2]) == 4656 )
s.add((a1[0x1b + 1] * a1[0x2c + 1]) % a1[0x7 + 1] == 36 )
s.add((a1[0x30 + 1] % a1[0x29 + 1]) == 21 )
s.add((a1[-15] * a1[-5]) - a1[-14] == 5200 )
s.add((a1[0x12 + 1] - a1[0x1a + 1]) == 49 )
s.add((a1[0x11 + 1] - a1[0x20 + 1]) == 4 )
s.add((a1[-10] - a1[0x10 + 1]) + a1[0x26 + 1] == 58 )
# s.add((a1[0x7 + 1] + a1[-44]) == 943 )
s.add((a1[0x2a + 1] * a1[-41]) + a1[0x20 + 1] == 5579 )
s.add((a1[0x5 + 1] * a1[-41]) % a1[-29] == 56 )
s.add((a1[0x15 + 1] % a1[-15]) * a1[-29] == 4896 )
s.add((a1[-15] + a1[-9]) + a1[0x1f + 1] == 252 )
s.add((a1[0x11 + 1] - a1[-17]) == 4 )
s.add(a1[-5] - (a1[0x25 + 1] * a1[0x24 + 1]) == -5289 )
s.add((a1[-5] - a1[0x13 + 1]) == 51 )
s.add((a1[0x8 + 1] % a1[0x2b + 1]) * a1[-22] == 9603 )
s.add(a1[0x9 + 1] + (a1[-40] * a1[0x2 + 1]) == 3825 )
s.add((a1[-46] % a1[0x22 + 1]) == 50 )
s.add(a1[-4] - (a1[-29] * a1[-44]) == -5003 )
s.add((a1[0xf + 1] * a1[0x1b + 1]) % a1[-29] == 39 )
s.add((a1[0x12 + 1] * a1[0x20 + 1]) * a1[0x15 + 1] == 505000 )
s.add((a1[-7] + a1[-14]) + a1[0xe + 1] == 209 )
s.add(a1[0x13 + 1] + (a1[-2] * a1[0x1a + 1]) == 5094 )
s.add((a1[-32] % a1[0xd + 1]) + a1[0xc + 1] == 155 )
s.add((a1[-19] % a1[-33]) == 2 )
s.add((a1[-19] % a1[0x25 + 1]) * a1[-33] == 2499 )
s.add((a1[0x3 + 1] - a1[-16]) + a1[-26] == 97 )
s.add((a1[0x17 + 1] - a1[-15]) == 45 )
s.add((a1[0x10 + 1] * a1[0x1a + 1]) == 2548 )
s.add((a1[-29] % a1[0x1d + 1]) - a1[-41] == -91 )
s.add((a1[-1] % a1[0x2b + 1]) * a1[-16] == 1200 )
s.add(a1[0x25 + 1] + (a1[0x2f + 1] * a1[-20]) == 4754 )
s.add((a1[-21] * a1[-47]) == 4144 )
s.add(a1[0x24 + 1] + (a1[0xe + 1] * a1[0xf + 1]) == 5555 )
s.add((a1[-23] + a1[-18]) == 150 )
s.add((a1[-11] + a1[0x27 + 1]) == 107 )
s.add((a1[0x1d + 1] * a1[0x1 + 1]) == 3216 )
s.add(a1[-12] - (a1[0x15 + 1] % a1[-23]) == 50 )
s.add(a1[-29] + (a1[-10] % a1[0x2e + 1]) == 153 )
s.add((a1[0x11 + 1] % a1[-8]) == 2 )
s.add(a1[-26] + (a1[-3] % a1[-27]) == 143 )
s.add((a1[-37] - a1[-25]) - a1[0x2 + 1] == -26 )
s.add(a1[0x5 + 1] - (a1[-21] % a1[0x25 + 1]) == -6 )
s.add((a1[-40] * a1[0x16 + 1]) == 2805 )
s.add((a1[0x5 + 1] - a1[0x2a + 1]) - a1[-5] == -108 )
s.add((a1[-28] + a1[-6]) == 201 )
s.add((a1[-48] - a1[-43]) + a1[-10] == 67 )
s.add((a1[0x20 + 1] * a1[-36]) == 2800 )
s.add((a1[0x3 + 1] - a1[-47]) + a1[-1] == 101 )

print(s.check())

model = s.model()

flag = b""

for i in a1:
    flag += bytes([model[i].as_long()])
print(flag)

```

![](https://lh7-us.googleusercontent.com/fhle3_Rm8n0fOLSC-1-U3zt5p6bK0tB1Q-Zb_K0vkrz8Dm6tgWfnRSFeDvX7IgoYm0PZTyTNhVrECIn_MSq7ANyNrk1I44mQO7AyjN9TbYaPTyW0ClmWgOEecu2mX_do6je_PQmGyhYpdhFddCE2hmE)

Flag : CJ2023{a346e8d716e2fd7a514c803b22447b83f49eeaea}
