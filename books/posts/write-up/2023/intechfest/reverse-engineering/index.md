# Reverse Engineering

<!-- challenge-index: 3a4b15c37231a4a7 -->

| Challenge | Topic |
| --- | --- |
| [NFC (275 pts)🥇](#nfc-275-pts) | GDB Scripting, Bytewise Validation |
| [32t8 (475 pts)🥇](#32t8-475-pts) | Boolean Circuits, Z3 |
| [NoJS (475 pts)🥇](#nojs-475-pts) | Packaged JavaScript, Deobfuscation |
| [VA (496 pts)🥇](#va-496-pts) | Windows Binaries, XOR |

<!-- /challenge-index -->

## NFC (275 pts)

### Description

\-

### Solution

Diberikan file ELF 64 bit, lakukan decompile

<figure><img src="https://lh7-us.googleusercontent.com/98mCX9ffgAvh_aFGryDxb3uDC40QNLhVAEehKTK-CuYgNrvCzf0jsLiAPWxNaqBHYCD4amhvDOC-KnF7GS5PDTB_dG9c6z4ojUdTvoI7ZZrShlz82vDWSh1IlDinEg6bqdgUTbskKRKONcxf2KaBnEo" alt=""><figcaption></figcaption></figure>

Pada address 0x3e2aa diketahui terdapat pengecekan nilai dl al yang mana jika tidak sesuai akan print nah namun jika sesuai akan dilakukan increment pada avriable rbp+var\_4 sampai totalnya 0x4a. Set breakpoint pada address 0x3e2aa dan disini kami gunakan input “A”\*0x4a

<figure><img src="https://lh7-us.googleusercontent.com/HBo5DUkzZc85A1uKr4oTpnl8cffULUtZppojHOnf2_LUf7haD1v8ov_yPB9Dg2SRUEltLfP6Fr0xCpSmYiguKzuGDsF0evLLev-KH6V7nCnd-KeaNxx8H1H-B6-ePxxpsguA0xMAKUWGoFcj1Q9EuMY" alt=""><figcaption></figcaption></figure>

Dapat dilihat bahwa input (al) tidak dilakukan proses apapun. Jadi selanjutnya tinggal scripting saja untuk leak semua value. Saat proses leak set nilai al==dl supaya bisa lanjut ke iterasi selanjutnya. Berikut script yang kami gunakan

```python
#!/usr/bin/python3
import string

class SolverEquation(gdb.Command):
    def __init__ (self):
        super (SolverEquation, self).__init__ ("solve-equation",gdb.COMMAND_OBSCURE)
    
    def invoke (self, arg, from_tty):
        f = open("x.txt","w")
        f.write(string.printable[:0x4b])
        f.close()
        gdb.execute("pie del")
        
        gdb.execute("pie b 0x3e2aa")
        gdb.execute("pie run < x.txt")        
        arch = gdb.selected_frame().architecture()
        list_dl = []
        list_al = []
        
        for i in range(0x4b):
            dl = addr2num(gdb.selected_frame().read_register("dl"))
            al = addr2num(gdb.selected_frame().read_register("al"))
            list_al.append(al)
            list_dl.append(dl)
            gdb.execute("set $dl = $al")
            gdb.execute("c")
        
        print(list_dl)
        print(list_al)
        print(''.join(map(chr,list_al)))

        
def addr2num(addr):
    try:
        return int(addr)  # Python 3
    except:
        return long(addr) # Python 2
SolverEquation()

```

<figure><img src="https://lh7-us.googleusercontent.com/krWGdYKObGDDEkLqiYMHNx2DUSyZjoiTzeG3pN4XJpKCx81NxwJSFXCx360JrF928L3dP3E4N2sS_1iTfRPTpfDVActu_aW5xY9YdSToVRa2JLb4w0Oymxkvfu3WTPhU1swBNYy6rniDVB2qZKlIJj8" alt=""><figcaption></figcaption></figure>

Flag : INTECHFEST{N0\_D3c0mP1L3d\_C0d3\_Fr0m\_IDA?\_N0\_Pr0bL3m\_CuZ\_I\_c4N\_Ju5t\_D3bUg\_IT}<br>

## 32t8 (475 pts)

### Description

\-

### Solution

Diberikan file JSON, prettify dengan jq

<figure><img src="https://lh7-us.googleusercontent.com/IAlYJgtdihaId5WcJOFNkhwx8lueiQRKmtYdMxnXiEQYtc8YvVNiYigTmeAcFf8n9OSOYOu_TMKTkfky_qeINwVkXMUGD-QtaHcQidUKoDO5IcYC4X5GbQQBUPXHiGHIg_wQ4SBSh-dZTk72NQFay-c" alt=""><figcaption></figcaption></figure>

Dapat dilihat bahwa key dari json tersebut berupa operasi logika dan input-i. Untuk key yang merupakan operasi logika terdapat inputs yang berisi nilai yang dioperasikan. Dengan informasi tersebut maka lakukan parsing terhadap file json tersebut dan gunakan z3 untuk otomatis mendapatkan nilai yang valid. Penggunaan bitvec 1 karena nilainya hanya 1 bit (0 atau 1)

```python
import json
from z3 import *

f = open("gates.json", "r").read()
s = Solver()
a1 = [BitVec("x{}".format(i), 1) for i in range(32)]
data = json.loads(f)

data2 = {}

for i in data:
	if("input-" in i):
		tmp = i.split('-')
		exec(f"{i.replace('-','_')} = a1[{int(tmp[1]) - 1}]")
		continue
	else:
		data2[i] = data[i]

while True:
	data3 = {}
	for i in data2:
		try:
			tmp = i.split("-")
			if(tmp[0] == "not"):
				constraint = f"{i.replace('-','_')} = (~{data2[i]['inputs'][0].replace('-','_')}&0x1)"
			elif(tmp[0] == "and3"):
				constraint = f"{i.replace('-','_')} = ({data2[i]['inputs'][0].replace('-','_')} & {data2[i]['inputs'][1].replace('-','_')} & {data2[i]['inputs'][2].replace('-','_')})"
			elif(tmp[0] == "and"):
				constraint = f"{i.replace('-','_')} = ({data2[i]['inputs'][0].replace('-','_')} & {data2[i]['inputs'][1].replace('-','_')})"
			elif(tmp[0] == "xor"):
				constraint = f"{i.replace('-','_')} = ({data2[i]['inputs'][0].replace('-','_')} ^ {data2[i]['inputs'][1].replace('-','_')})"
			elif(tmp[0] == "output"):
				constraint = f"{i.replace('-','_')} = ({data2[i]['inputs'][0].replace('-','_')})"

			elif(tmp[0] == "nor"):
				constraint = f"{i.replace('-','_')} = (~({data2[i]['inputs'][0].replace('-','_')} | {data2[i]['inputs'][1].replace('-','_')})&0x1)"
			elif(tmp[0] == "or"):
				constraint = f"{i.replace('-','_')} = ({data2[i]['inputs'][0].replace('-','_')} | {data2[i]['inputs'][1].replace('-','_')})"
			else:
				print("??", i)
				break
			
			if(tmp[0] == "output"):
				exec(f"{constraint}")
				exec(f"s.add({i.replace('-','_')} == 1)")
			else:
				exec(f"{constraint}")
		except Exception as e:
			print(e)
			data3[i] = data2[i]
	if(len(data3) == 0):
		break
		
print(s)
print(s.check())
model = s.model()
flag = ""
for i in a1:
	if(model[i] == None):
		flag += '?'
	else:
		flag += str(model[i].as_long())

print(flag)

```

<figure><img src="https://lh7-us.googleusercontent.com/aW42g9Zqf0aYxDf9ZNariiHFr1Lqnt5RMN6aQf70hR2RXgzruC530JGQ4rRU6PwsIQ1AgrJrGTdzJcoDNUaE6XoKhbv-b0Rg3r_HHXC9WLiu9QekkmU4_qEEFy2o2CxZ3Ke8Nvpd9eQyG418EfI_0z8" alt=""><figcaption></figcaption></figure>

Didapatkan output 00101110?010?1010100001?000?0001. Nilai ? pada input dapat diisikan dengan nilai bebas (0 atau 1), jadi pilih salah satu sebagai input dan submit sebagai flag (karena flag menggunakan regex).

Flag : INTECHFEST{00101110101011010100001100010001}

## NoJS (475 pts)

### Description

\-

### Solution

Diberikan file PE, lakukan decompile dengan IDA. Disini kita perlu tahu bagaimana cara file js dicompile/pack menjadi executable. Mencari string yang menarik disini kami menemukan string “runneradmin”

<figure><img src="https://lh7-us.googleusercontent.com/nCuPie6kEXh9Ip05YO7De6jpARa9kIPB35oRZK-e4fcJPYNqrVhebkTunpYlwi8kt3KQ5M6ZnqZvf1T__JaBGPt6W081P0S_3CX387C2t7kOjTif_gZQmNFsDdAQ2iIItGb1aC6zI9LUDGSjnA2W6uE" alt=""><figcaption></figcaption></figure>

Terdapat direktori pkg.\<hex> , disini kami coba cari node pkg dan menemukan bahwa aplikasi tersebut digunakan untuk melakukan compile ke executable

<figure><img src="https://lh7-us.googleusercontent.com/Jq4yOPZDyTjcPZkaj18UKKcNrBmMsPeNjcsqcsFycP4f31ArJ5WhLOCQ3HQbCCEdlGux4dp2kLlQgrOLBoRncY_8D5Z5vWqCzVMe7B06uAf3rV8uLiO5OkQ1ul9i_B8YKzNgDAUM7hbKOruxx0SJrQU" alt=""><figcaption></figcaption></figure>

Hal tersebut juga kami validasi dengan melakukan compile sendiri dengan pkg.&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/BYse8rAC-ednbs6jf8_m0t9RdTYQw1EAJmIavDKwZtkbMdRkHnBLGX8u1GIZALDaswzIexFqjVihAiixMeW_7R1Zk2BZCDtknW8r_kC67GTBh37cud-roEXw5-LOn-eFWG_ZWb0Mv61mSZG068cb1lE" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/zDCDO8TvTD4uexsyTXSiIjShvTWVR9U6hFelFcVeRWIw2jPjECTaV0w5PFwhTtdaVs5AuIdD32a99Bra5oDhfpSR2jOv_5_YT3zeZ0JFiJgX368xePaLTriOC7x7OPU2zprbmMMgfrIZjjKKyi-9-ZI" alt=""><figcaption></figcaption></figure>

Selanjutnya cari cara decompile/extract JS dari executable tersebut dan menemukan repo berikut ​​<https://github.com/LockBlock-dev/pkg-unpacker> .&#x20;

![](https://lh7-us.googleusercontent.com/Qvkdez0cYMI38fIkmurB85WMBV49KRz2pmKP9jzajaWboYLeGmbc_tbf4GwQ1wK4pdogg6F5Q_MOj-M-cReJ8nA2UeVk-jm8o8abzJ59Ap4GsuqNYbNsSfSy8F6e26RJa5V4keaGCib4tOssPEvG_bI)

<figure><img src="https://lh7-us.googleusercontent.com/OgfUDWmZdRMlTT0TfJ8EHWP2zxx5GUSf_if6iaPDSb8Ivv5BbRbH1Pw3sW7V9bNSJx85NEE7_KdjeNxQ91d3XVUf2kDoOeBKJn2aM6UtQOgMPaUV0Nmgezgp_-RPzKZNpw4DTZG3HqwSYe3ZDCLIT50" alt=""><figcaption></figcaption></figure>

Lakukan decode terhadap base64 tersebut (argument dari atob)

<figure><img src="https://lh7-us.googleusercontent.com/-K9Y3XCmy2sA92bTwTog1xJScLyxGX2fW2ACdzJt61O-VDdE6GMQLfJiK-JvsUZsXMwBUTE72V7ZqluTtoJra8zjTEJAXQcR7ZR6zYv81HJRT_KrQ9LOTgFazPy-_P8-sZImCkQKgHVlhPfFQtqQLVA" alt=""><figcaption></figcaption></figure>

Dari debugging (menambahkan console.log)  javascript yang ada diketahui bahwa algoritma yang memproses input kita sebagai berikut

```python
init = 0
for i in inp:
	init = (init << 0x5) - init + ord(i)
Init == 0x2dd022
```

Untuk menghasilkan nilai init dengan panjang bit yang sama hanya diperlukan 4 karakter input (4 byte) jadi tinggal bruteforce saja.&#x20;

```python
inp = 'ABCDF'
init = 0
target = 0x2dd022
print(f"target bitlen -> {target.bit_length()}")

for i in inp:
	init = (init << 0x5) - init + ord(i)
	print(i,init.bit_length())
```

```python
# _0x474547 = (_0x474547 << 0x5) - _0x474547 + _0x4dbcb2;
from itertools import product
import string

nice = []
for inp in product(string.printable[:-6], repeat = 4):
	init = 0
	for i in inp:
		init = (init << 0x5) - init + ord(i)
	if(init == 0x2dd022):
		res = ''.join(inp)
		nice.append(res)
		print(res)
print(nice)
```

<figure><img src="https://lh7-us.googleusercontent.com/kJzv4MzG1zPVG_g2QerQrIya80uxKNAqIPjO2MIphgB810BsU_IJ5UG8S7FoLasBHKgFJeI5POArZuy0f4qFE3NGEIZEgvtOvbH__z6Mknk-85x8GPTWd2P7gQZ2VzTEdxqvBv_AQkUG9zb7OqWuc9w" alt=""><figcaption></figcaption></figure>

Ternyata ada lebih dari satu input yang valid, langsung jalankan saja pada executable target

```python
import os
from subprocess import Popen, PIPE

inp = ['arar', 'arbS', 'arc4', 'asBr', 'asCS', 'asD4', 'at#r', 'at$S', 'at%4', 'bSar', 'bSbS', 'bSc4', 'bTBr', 'bTCS', 'bTD4', 'bU#r', 'bU$S', 'bU%4', 'c4ar', 'c4bS', 'c4c4', 'c5Br', 'c5CS', 'c5D4', 'c6#r', 'c6$S', 'c6%4']
for i in inp:
		p = Popen('NoJS.exe', stdin=PIPE, stdout=PIPE) #NOTE: no shell=True here
		out = p.communicate(i.encode() + b'\n')[0]
		if(b'INTECHFEST' in out):
			print(i,out)
```

<figure><img src="https://lh7-us.googleusercontent.com/SGLv603DFOGW2gHzstkmBScP7NQkkJSSBkIJ2Yi_E7p1qy0aKPwNeWa3qcGJWmY_YdVeQCC0JaCsULJBONgWXvP_T3xUxzcEeQevRNOJGRdBYonlc9eZBJDn7ku7-Pgz5eCHqi3_8hDmvXuFGumbiWw" alt=""><figcaption></figcaption></figure>

Flag  : INTECHFEST{b98b802394faab92d1cf98c67179afda}

## VA (496 pts)

### Description

\-

### Solution

Diberikan file PE, coba jalankan file tersebut

<figure><img src="https://lh7-us.googleusercontent.com/Mh8gNZIwJaKYzBVMTU_ewgQLKWyknT1lWaopZPhU_BYMy0MLI4IDs07qn0IYoTaTiUe744vSEAOnKHlOQ1mamIkhlpbfRbR_pMg5W0wLaB8giHlSFPVGRPIyNCbzakzWrTGpQLr9tOvjwWUTcuUqmLs" alt=""><figcaption></figcaption></figure>

Program tersebut melakukan validasi flag, selanjutnya decompile dengan IDA

<figure><img src="https://lh7-us.googleusercontent.com/ohhfQUQtl0gGImPg5hXg4OlR3TodPeUHBTAZRa51nyuhTSRQqJTi9wjqs_Kdi4cjTkO_f_OXsR3-SoTKkc52MxV_-pfyJfLeRnlSd8BgDXL2_k-ndMGcQzY2DfNjIK2yTV0WG8GhJiK7EMF-PIngzmY" alt=""><figcaption></figcaption></figure>

Jadi program tersebut diobfuscate, hal pertama yang kami cari adalah dimana kode program untuk menerima input user. Setelah melakukan debugging kami menemukan letak kode untuk meminta input user yaitu pada address 0x5919AF (dynamic base address)

<figure><img src="https://lh7-us.googleusercontent.com/GD3gFSWC_u9bWtTS-xRUv_CY7xi7TqLSailoPWbFG3yT5Fvor6LP4VFbKtuNCiP18CTPhnPkV7zC9ldOQ4Y2vc-rJfB0mmls9JnZWRIdWa7pkYSftezamc6jufluRg2lEExsU2oP52h544olFH3xecg" alt=""><figcaption></figcaption></figure>

Masukkan input dan kita bisa mengetahui letak input kita yaitu pada offset 0x005943B0 (yang sudah saya rename)

<figure><img src="https://lh7-us.googleusercontent.com/r8MVHDsih6x6L1g5lLJwwobcN1uti5l9Np8lcl2l76MpqFrnGmGXn_RZKvVwEZOquQ4t9NxiHmyrWDW5597i9HPunp0_RFDWZ0NG8I_fPQLTOZsPT9oRSJNbNeHcbxGHquP-Y9DkE5sXAcU6sBH0fZI" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/YqEsxBbxKqVq160vK0zsaOMRo-0Fs9Gk_A_6XjgKmiZ3oxMeAilYWraymbq13jyvJmg56Pymif_r4gJ8r7HAx7SH5E5i2PASjnV0umLAugyW0gAW_dsy36Lj5bbR7bvQ5H2i4NW1uVRG967_pqhsmkw" alt=""><figcaption></figcaption></figure>

Selanjutnya lakukan read breakpoint pada address tersebut

<figure><img src="https://lh7-us.googleusercontent.com/fEkIf0RP3bMTv7UfK_rQDuhpY-2etsrOWf448fuOkUjZuQzMp-vjAgS6ewCR-h4KFWOyL6DQxCvtdFbRQ0bnufk2Elbe3VVqZ3RloQKwHJ235sTtwZsUgXtQRfupvb0cZdRFsXafPgcW_SgkCCx_YJM" alt=""><figcaption></figcaption></figure>

Selanjutnya continue dan akan keluar popup bahwa breakpoint kita ke trigger

<figure><img src="https://lh7-us.googleusercontent.com/cYOW87wpkfW0LSnAQ19VaC3GFjAIQGvX6ANAoSlbb5CvmsBw5mEf61ICzk4qz8aeMkfAzrtKpnvkAfEsDSu8zPCWDnnVQmGLp7LFYM9jh6xGElYL5oxK1gpNDwInIYiZKJQox00kG9GaIg9q139lMAw" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/gkxzYdtL9WE6h56ZjWpzCrdsA5KkjNmwfy3ws3YVQxd1hxaKAe5iLEi1xmBIHbDqoYqvyUrSJG0nxT51ny3OdiZTs3-5jWfluOx8t2rfR0qeZSI0jaKmq7TKP8AAzkFFGeZxfyVqR7IQkZvRg34CmdE" alt=""><figcaption></figcaption></figure>

Untuk langkah selanjutnya saya lakukan manual, yaitu mencatat setiap perbandingan/algoritma dan melakukan jump ke instruksi yang benar. Disini saya menggunakan input 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN saat proses debugnya

<figure><img src="https://lh7-us.googleusercontent.com/wlw8ONwaORgk_yAwrgdh04-ChWOa8vUKVqLMI-7zkggiL4X0WNK4_UeqxQvqLxRIo8Ifoh5FRrkX0tPDx7sPIemtG-yVXbRIL6FcDMD4lGzk376XqhF4ouCru3PPFjLP9b91F7NYkHSoSbxVZesCwPk" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/c23rtVknq_h6KlzyEd1PJXHjO5GV896Ce6sLeFKTwHsp8PvaZO_NDP3CmA1zjPbQi4uxBP42za1guQ7A97K8DOuvLArGBm2rdRKbaXu-iWQk_zKtnRC7AoeVsMvjqamyg0pd2yHxcGcPgVCEIhCuFa8" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/swMuX9UaE91taRiwgmP8x0NJyvqr7iUfQ_M_lDzHWZ1AJyv1gsRrtxvxMrjL8oIfm-WB9EjRcH7ialwDJU5s79Z3S6zRBrqRjl07WxyAUhakmJnUnzhsKsucYNWl-AZJ5n78RHPfqHtbVdAusW93OmE" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/lTtQL1lMvqcb8ZuXPGMMT9onLKshaof1oIxbYufN2EsHsOE3DNtHHnbVLjbq37DuIyrbXz7GmmPc6mYKQlLBWdDzKCl0SXkljOtAiW_wxaqJMYvhX2G8k4I5ggDAlETlfhvqBKtjN4JMv7mhCo0rWDI" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/pI2U07_NbmxIe5XaJ7PbhyvpOnnB4JE1tix83iib820K_zZup_NM9JvjlmLRoKSMvGVBd1EL3kvF2QIvE-FW67GgVpZKHA61q5_6LDUzptctbiCrD-r5hK8x9sVsdaRGqzN2plLgrjVPn5GgxDv0W5A" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/yzsnXBVHjsixDhcJfdFQD73KUuGMLrW3L_jy9jY4pu3q7eRuRRGgwS-7R-t6lDbrD2yRlnfA86CdBb48f0acegWfDEynMlYZf55UPwCwTQnTclxP4oSkxjy4fGNx8aQJFnhMkhw0RuU6v__a4UlHnI8" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/yPcofHWBDdzQcWqAPMIrC2AYSLzehMmpF5ZX-T1U3N_qKSo-giBneLxUExKGvhzKo7lyYX6I4J47IantgQCFRDSLlTBuRQ1tU4iYUWCm_A4CG7oxoOL4RW1bZ7NPp72QD042pHrzN5AjhDwBE_yZWHk" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/1eB7k97ISoYS1XulL6PVMeSKJdVaarANrEm6Q73_x-5Q5kNuYo3DIuOtktMhLtLnsm3G3gLdTTC0A4w81L3fiY_AZA1Z6H0vrWz6GiDIFMdei92GoVFaSRKcguROB4vrb_kZLFAJmO4Trod-4OPtJ18" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/F_02i39bNYwqBBRNWiZFfxDN5dL6hzVKPuSRrcFzfzdCETXIjkBKn8hICEukd4zX-qWatRBk57uSlR5xNfQJHpICbb3A7zfhlNwEYzvspR4n02vv77rOzh1BLGNyua0yxmbcggnaIFHLsQPGwTH6euU" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/QlqZypDhlyGxTO0h3XKUwTwIXHFHY5D9i61Rlc0bnfVF61rJ6cAV9WkX7ASflq6USXBJA5rjvOJ-GkA7qBPQ63jQgI9E1xoTsc2PYrDK3DsB_NfVEcHGplfEe49nNEvNuIKCFqNXgoiE1b7SX3msCKI" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/Gfj0WreUOkohssBuMFBTWCie1CYgjkvznkweKxu0Ad7B5whvH_Zfb88ZFo-Qs5VMtbXq_ZQgMrHJZpg_AM1pMsz1HUVyZX5O-kZDOrMGl7QkJMZ0v1_xmq-J9U924kIKM9gZ82p3Jq_7UV06alyPch4" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/4-q5nfue8Wf9s-MUyDQUDn1mP52uqjP2UqispLP6ufWrz_2MJuFdlVfXl_4dzrn3rSzFmoZ2FgqRpAVz51cGhHD7DF0HXADAYdNhbkZxA-qugA1R2RRIEKjFv8ZFqs33Zv5f_APkH0F1o36mEQB_NS0" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/LztIAzwZX61Qol1Y5Rs1NXBGFxUgIj5-v_wjT08Hg6NZLrBywQKZ5MOhseUFm1_v5v6qleEp_wavOAfIio6DcYGjmFbZUzCKjmBaiVliu8Be6UY7-_9g3191BfStq8_C9hZDamLinZXxnnFfXWhff7o" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/Fl19BhJlHK-4ak7COQtEnqoh9S9N2fV6L5sXJ63KiuypdytHMLs4imug_Dw-3KuGE6PGQBSyj51T9lSTnc9Bqzx7nrbyTnMEgEZ-W6waFNjvIDKspDgzxop6-saY5YNn6Mkv84jnvPKHfcbDUyo7faQ" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/wnP-_df77uHhmuoK_VulSC22qjmbCqS_n7-122mlY_84Ps3xzHabzt5VUSoFzokFNkhjk0HpTPFA8pJvsv5jWAtvVkBNGQRN9KAWWGHuQZgmdYv4W5TD4F45rBBwZjEevtny03FVkqgghP2bG71YYD4" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/tAzk6ua4g-zeRYQm1rdEDfQA473Ci5oWNBeIzAM_mLpWM5bP3LCl4fmQv8_ES3U4lO6Dgu-qrD--IeCKF5Z6qek8v2QRK3CXQZhUMZUtuAXrBnECNyY32ybmal6MYRxVpM5vFwiWPAU8n9Jwc5xYX3M" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/bzMkxyZrpSEwRvTJ21mqmm3274FnQxxs7IHD9qlqWp6DeRphcLTtG8m3wqZ3lcx7QhF8gwNdu1nyDRZf9BGCwxhif6NRAZK7PCJsoF92Yv6BilqP0qNZFEovBgYWICAD_5gEcwezIV7FSy_0VZOzG1s" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/Wnl3AR90aqS1nK3fyXdE8XHS5plkkYhaEy2GaDiSWLd6Jcqlhleo6_roOK0okKsI3UJs7MWLTzV5vEn7BUZnUovgdTZhnDM7trz65_71uK_WGQMw4ZKQHtVsEpjNqmKZmc5BBm0OsQPGInllXMvRNVM" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/94-2Wyqseo2uGjDEdr8guBtdMaq-KR0fwtdCJrtaKhb3u0XRF_R096AQUhrTq3j37Jax9kFaDf6-ctNNc0R1F3eoYUIuCsvTAfj9wg6dvLN1AaRNW7VXx40ZB1EnKDbit9L9yICqKRijSAQibPOb_X8" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/8Yzc3zB5EufM6b5RRWCI0f937c-iCszmVN0_IsAhEgz89cVTK4ozahuQw6cBbN4O8NIgaCk7H2HNA9QZzqvTHDu6CxLuOIE7pPhdvc6G0vVXmmFnms8I_qFBNhdFXcye7fl2e1onEhzQ-hq5v2JKyFw" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/sgMv-RzJOWp0B4gELxJq5mFTYHzYOEUotQJCEdjqhjqSxA1qEuXuh-vhh28BCADqqK2etbHAl5e6WKduCFsYaFQyYRmfG9UvdG0--pGAEk7qOmUJuR9Z4VKmq_boV_1uF8rn9T9k78v6AY5m1oXOX3M" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/IV7g7ZkVGrSY52EXS-oFeIIMYojo0DDdRa45Aqzv3DBucgPbfTvtoryYNQPvXFQK7kVFFc0h8AJgvK6-sXuoBPEubW8-h1zFWATTe89KThBxgiB3cGOS9YP-A6DOordlbiyvb_nTdVG88Dk02Dbgsrg" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/CoEskAensqlemqdFfkceqFHg_Nrav3KKqivkmSLJlb7Z8aR7hg9hVNOvSxFz36at6Qi39DXHyRWJ1GI1iz_JloJRV7jYdg0zkLsfeEN7K29JWE7ulmeDW-oh0BZV-h33y3gYth4otbh0_oWEVpPnnqI" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/_3qjgJd3DNNbXrr5KfJ-iCo55Br9p9Pz-XHTAtOAr6dmWzaGuEkDk8WWwew4Oyl0BEB6dOzph4_BXUnVRsH1o4sM6QglB9OQH4tEE3kxA3K2LrFTjcS7asS4X0jlLZ12LTJBSgOP205xw3ecKHJ0vig" alt=""><figcaption></figcaption></figure>

Ringkasan dari keseluruhan proses sebagai berikut

* xor 4 bytes value (0xdeadbeef, 0xcafebabe)
* xor dengan static value (0xa0)
* Pengecekan input berdasarkan index

Reverse semua proses dan tuliskan pada script python

```python
from Crypto.Util.number import *
charset = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN"

flag = ['?' for _ in range(100)]

inp = ['1', '0', 't', '7', '1', '0', 't', '1', 'S', '2', 'B', '9', '_', '8', '5', '6', 'J', '4', 'u', '5']

for i in range(0,len(inp), 2):
	flag[charset.index(inp[i+1])] = inp[i]

arr = [0x0D3,0x0C9,0x0E3,0x0FF,0x0F2,0x93,0x0D6,0x0C5,0x93]

counter = 11
for i in range(len(arr)):
	flag[counter] = chr(arr[i] ^ 0xa0)
	counter += 1

arr2 = [long_to_bytes(0x0CAFEBABE ^ 0x0A4CFE9CC)[::-1], long_to_bytes(0xACEFE1A8 ^ 0x0DEADBEEF)[::-1]]

for i in arr2:
	for j in i:
		flag[counter] = chr(j)
		counter += 1
flag[counter] = '0'
flag[counter+1] = '0'
print(''.join(flag))

```

<figure><img src="https://lh7-us.googleusercontent.com/PnjPUxZufZwoXo2Y4U3jdWHTSRHukZTadEDhiEN8VxtHyRrW4Tf_7-VgE0-zNdNc7Q0wiRu1x439KkOzk_i3OukGEkaGMlcMWR6hzEQ3eCOAmG7Xr3A2xc7CorMSdhDG0mVVjLnVNinC_mhJaHgzZPQ" alt=""><figcaption></figcaption></figure>

Ada beberapa char yang tidak ditemukan pada saat debugging namun bisa ditebak, sehingga mendapatkan flag yang valid yaitu&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/ajwAh0Epu6Bjo0tq3NLGU2QsbP0EhUj8YyNdrT1gIBw2twC5xPHuEs-_a6Xbh1Mro2yVhN0J7A-uDvO-VoQe495r9BsPjv7RpTD58xqOYWS8eYFyGGeq7_7p2cma5d7_hiORSvjJ5sv4e53NxoNENf0" alt=""><figcaption></figcaption></figure>

Flag : INTECHFEST{1tS\_Ju5t\_B4siC\_R3ve3rS1nG\_Br00}
