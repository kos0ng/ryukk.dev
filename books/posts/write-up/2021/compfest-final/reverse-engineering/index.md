# Reverse Engineering

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>WASM ROLL (228 pts)🥇</td><td><a href="#wasm-roll-228-pts">Here</a></td></tr><tr><td>Takeshi's Castle (500 pts)🥇</td><td><a href="#takeshis-castle-500-pts">Here</a></td></tr></tbody></table>

## WASM ROLL (228 pts)

### Description

\-

### Solution

Diberikan akses ke sebuah website , dimana dibuat menggunakan wasm. Jadi saya ubah ke c untuk lebih mudahnya dengan wasm2c.

<figure><img src="https://lh7-us.googleusercontent.com/c3QHSp4OtL-J9jPKI2V6DebcqgCvWdu_McO_PAwzcQ-VX91Alxf0WmaW3v0Ictfs2kiJ0E6838ouW32s94Erozk4V646rsn2CVOJT2CE_YOOf7W2IP7aqsg-5VS7OSab9jx-06pNWroH0zhYsQLZTQ" alt=""><figcaption></figcaption></figure>

Module.roll memangil fungsi f\_af9a16d2279f483ab0687076b7badd6c . Jadi cari fungsi tersebut di wasm.

<figure><img src="https://lh7-us.googleusercontent.com/uWXNYsu0rY_3KblqliasugDPJ6TVmnbfQ-w0kyufK_RREc1mDh-1tnpwMciWWIOaEqT42QbZHKQVStKeYFMA-0UDCP2Zt9qli_2WAZFiVxwJNM3D7FqcSJL68Bwlu0QnE7eptOzmkY19I9T8ROxXKw" alt=""><figcaption></figcaption></figure>

Setelah saya lakukan debugging pada browser , intinya dia bakal melakukan pengecekan terhadap rand()%2000 , jika sesuai maka dijalankanlah suatu fungsi w2c\_f405 . Sempat stuck karena berusaha mencari cara untuk mengubah local variable pada browser ternyata tidak bisa. Jadi pakai solusi lain , yaitu patching terhadap wasm. Ubah ke wat , patch , konvert ke wasm lagi. Disini saya melakukan patching yang membuat fungsi 405 dijalankan apapun hasilnya

<figure><img src="https://lh7-us.googleusercontent.com/H9FEVg_J224adsWQ-_TgObR6zYCqBbRCIZyQUNRHDp7WD3-kN8yE6M4ZdqumMTqCijvpIbCbjZvdREfHi_dWO7ovbyPi43ULVSAkvpZqhmslw6VCI6Cyv1QN6WhEPGw8m7k-sXoiu3N8X_M1drVrkQ" alt=""><figcaption></figcaption></figure>

Selanjutnya setup http server lalu buka file html di lokal yang melakukan load terhadap patched wasm. Breakpoint pada instruksi setelah call 405 dan didapatkan address dari flag, disini sempet stuck lagi karena chrome terbaru ga bisa liat memory , jadinya downgrade dan bisa dapat flagnya.

<figure><img src="https://lh7-us.googleusercontent.com/0uuSifmJ5ByzUQdkuxyep4PZV6UdWut7ZgN31H0sYNvcNvUlNmlJ9lb_qqwSEIHHoqu6pdr8MLzwM6XwhfqPhtY36zBE-wmSA4XEDwX2wz4zlWCJbMAz4P4SwXM1_vwcKNsmx4QHWUDUdcGGgbLAXA" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/8O4y75AkJW3s_dHueQvJntCHWc3UR9PEXdAM9ynRJqOf2xG9dJuppNow2h6EDu04JLvkfH--SKVlw1pMBuTDw_G0z4_rn-gZs4u8Eu1IZ6LthosN4QVxkM9XPfU1u79RCOV1sGNJDZ379Z1BGdwYgQ" alt=""><figcaption></figcaption></figure>

Flag : COMPFEST13{4H4\_4N0tH3R\_0N3\_0F\_tH3s3\_4H4\_3h3\_b7393a1f2e}

## Takeshi's Castle (500 pts)

### Description

\-

### Solution

Diberikan file elf 64 bit , selanjutnya kami lakukan decompile

<figure><img src="https://lh7-us.googleusercontent.com/oP677iPAwCnA4O15-5qUygojQtrQ2d0xvMpOiggMcH6ca38V0oR1v7OFKlbzeA43vky0vlqIbzJhkbI00eTLPw-5ql3LjINeQaLxW7zlFV8Hn04NZfZTRARjEgFyISlIwJmsezSMyRFmlDCkElDz1Q" alt=""><figcaption></figcaption></figure>

Terdapat pengecekan debugger di awal yaitu menggunakan ptrace , bypass pengecekan tersebut dengan fake library.&#x20;

```c
long ptrace(int request, int pid, void *addr, void *data) {
    return 0;
}
```

Ketika saya coba run programnya , hasilnya sama persis dengan judul , yaitu benteng takeshi.&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/4_VzrVwshf8EcN-csW53AM8lxJvYLHYp-MB1A9NJRoa7piboFcTq3zJyASeXl3W1o-GYX68C0CUhbfz4cKUGxEW2xxsOgLvtx9tW4X2hTdhybbiASo6uRggz5wrmuJVhPry8mBwHbTY7DzuFi7Mt_Q" alt=""><figcaption></figcaption></figure>

Jadi kemungkinan perpindahan yang bisa kita lakukan yaitu 1,2,3,4,5,6 . Tujuan dari kita sendiri ada di baris 18 kolom -2 . Berikut saya tandai X

<figure><img src="https://lh7-us.googleusercontent.com/25AxzP5jDUhwyPJUYY-v5lG0vMvL8fXRxD98EDosKCOFsSOPzXhC-8dLmmFlX1COBYbTLMPZOBDqp_3Juznovam-9V1XKjZ4-1E3LWXzlzVlkyOC8WVF4VpMYLov2J0GHgi7mm40BK4_JyQWSM9hjA" alt=""><figcaption></figcaption></figure>

Di awal saya coba lakukan patching terhadap fungsi yang memanggil meet demon , gampangnya ketika menghasilkan meet demon maka dia akan diam di tempat. Kode yang saya ubah ada di address 0x221C.

<figure><img src="https://lh7-us.googleusercontent.com/Hx2-vXmewWkv-l04YeMpN3jXg58tDtUSgMJGts9E1DFPuzTPXXLDLIDE_OV4B1j2BqJE8Z_9rBLnYFY1Bf-qyVTGLRaqojxERVS268svi-fhfETCaDo1XwtHf7fxMfRBybBcbNM_YA2tzmKDdH8khg" alt=""><figcaption></figcaption></figure>

Namun tetap saja kita harus memainkannya , dan jumlah step juga tetap bertambah. Jadi saya pakai solusi lainnya yaitu bruteforce semua kemungkinan pintu , disini saya menyadari satu hal , yaitu ada beberapa kemungkinan untuk menuju ke X , cara paling cepat adalah dengan menerapkan algoritma dfs, namun disini saya tidak , saya melakukannya semi automated tapi sudah cukup cepat dikarenakan kemungkinannya tidak terlalu banyak. x

<figure><img src="https://lh7-us.googleusercontent.com/y2g0prE4WNGmnmlFuWqTUciQLzvdzXYfrRwGa-tg1ky9esuqOB-zOgpC1Hx1mAiUz5Ocse94dp2qdLa7z6KNWMm6cju7hBZM-AaftRc8vZo0MkmWkp-pR0SK551-UZVglzCk472APR18oF0I7WnrHg" alt=""><figcaption></figcaption></figure>

Untuk pengecekannya sendiri cukup simple , intinya return dari pemanggilan rdx disimpan ke array lalu lakukan hal yang sama ketika ditampilkannya prize, yaitu kurangi index ke-i dengan i-1 dimana i mulai dari 1.

<figure><img src="https://lh7-us.googleusercontent.com/oZQ7oSDKEpmQ9Us3VwLWJzpMIZQpY4h3KpRi68caIUMyABtzapjNYrZs-WiUCRrMmRz8-iuUr0qfqtwr72ni009iIswqii725_6KIEzoNpyeDoGhHMt_J0lDoFrNO9e-1-wOu-7tWNuXCVAbVtR9ug" alt=""><figcaption></figcaption></figure>

&#x20;Di awal saya coba lakukan automated bruteforce dengan script berikut

```python
#!/usr/bin/python3
import string
class SolverEquation(gdb.Command):
	def __init__ (self):
    	super (SolverEquation, self).__init__ ("solve-equation",gdb.COMMAND_OBSCURE)

	def invoke (self, arg, from_tty):
    	zz = 2
    	while zz!=37:
        	check = zz
        	f = open("data.txt","r").read()
        	data = ["1","2","3","4","5","6"]
        	for x in data:
            	cnt = 0
            	tmp = f+x
            	g = open("data.txt","w")
            	g.write(tmp)
            	g.close()
            	gdb.execute("r < data.txt")
            	arr = []
            	for i in range(zz):
                	try:
                    	val = addr2num(gdb.selected_frame().read_register("eax"))
                    	arr.append(val)
                    	gdb.execute("c")
                    	if(i>0):
                        	# print(arr)
                        	if(chr((arr[i]-arr[i-1])&0xff) in string.printable[:-6]):
                            	cnt += 1
                	except Exception as e:
                    	print(e)
            	# print(arr)
            	if(cnt==zz-1):
                	fl = ""
                	for z in range(1,len(arr)):
                    	fl += chr((arr[z] - arr[z-1])&0xff)
                	if(fl=="COMPFESTd"):
                    	continue
                	elif(fl=="COMPFEST{"):
                    	continue
                	elif(fl=="COMPFEST13{hEy_YoU"):
                    	continue
                	zz += 1
                	print(z,fl)
                	break
        	if(zz==check):
            	print(z,fl)
            	break

def addr2num(addr):
	try:
    	return int(addr)&0xffffffffffffffff  # Python 3
	except:
    	return long(addr) # Python 2
SolverEquation()

```

Namun seperti yang saya bilang bahwa ada beberapa kemungkinan lain , jadi disini saya lanjutkan dengan semi automated.

```python
#!/usr/bin/python3
import string
temp_arr = []
class SolverEquation(gdb.Command):
	def __init__ (self):
    	super (SolverEquation, self).__init__ ("solve-equation",gdb.COMMAND_OBSCURE)

	def invoke (self, arg, from_tty):
    	global temp_arr
    	f = open("data.txt","r").read()
    	data = ["1","2","3","4","5","6"]
    	zz = len(f)+1
    	for x in data:
        	tmp = f + x
        	g = open("data.txt","w")
        	g.write(tmp)
        	g.close()
        	gdb.execute("r < data.txt")
        	arr = []
        	for i in range(zz):
            	try:
                	val = addr2num(gdb.selected_frame().read_register("eax"))
                	arr.append(val)
                	gdb.execute("c")
            	except Exception as e:
                	print(e)
        	temp_arr.append(arr)
    	for i,j in enumerate(temp_arr):
        	tmp = ""
        	for x in range(1,len(j)):
            	try:
                	tmp += chr((j[x]-j[x-1])&0xff)
            	except Exception as e:
                	tmp += '?'
        	try:
            	print(data[i],j,tmp)
        	except Exception as e:
            	print(tmp)
def addr2num(addr):
	try:
    	return int(addr)&0xffffffffffffffff  # Python 3
	except:
    	return long(addr) # Python 2
SolverEquation()

```

Ya caranya dengan tentukan sendiri kemungkinan flag yang tepat , namun jika kita salah ngga perlu harus benar benar mengulang , ingat benteng takeshi , jadi misal kita menuju ruang x lewat y , setelah dari x ternyata jalan yang mungkin hanya melalui a dan b. Maka jika kita ke ruang x melalui z nantinya dari x juga lewat a dan b untuk ke target akhir. Berikut hasil akhir dari percobaan saya

<figure><img src="https://lh7-us.googleusercontent.com/aI7-j3eC1yTiCSTlWrnl5sLR-_nSaS1M3lLKKCV5MXlB-hi6BFGcdxTFSD5GAyBg8_SvTKwjdHxRKHVZrdtkc4dc06pV8tnp-TAXOsDk4SQwhrY1NidrZz2wHQD5WjLfYPvRykuFLYVtKpzTms0-vw" alt=""><figcaption></figcaption></figure>

data.txt

```
5656654345616131111216655551121166616
```

Flag : COMPFEST13{M1s50ldTvSh0w\_29478c7c2f}
