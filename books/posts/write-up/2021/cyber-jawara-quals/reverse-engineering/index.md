# Reverse Engineering

<!-- challenge-index: 07ddd3809952a228 -->

| Challenge | Topic |
| --- | --- |
| [crac (475 pts)](#crac-475-pts) | CRC32, Incremental Validation |
| [Waze (951 pts)](#waze-951-pts) | WebAssembly, Maze Solving |
| [goba (997 pts)](#goba-997-pts) | Game Boy Advance, XOR |
| [Laser (1000 pts)](/notes/research/2021/reverse-engineering-erlang-beam-file/) | Erlang, BEAM Bytecode |
| [math (1000 pts)](#math-1000-pts) | Haskell, Polynomial Arithmetic |

<!-- /challenge-index -->

## crac (475 pts)

### Description

\-

### Solution

Diberikan file elf 64 bit , selanjutnya kami decompile file tersebut

<figure><img src="https://lh7-us.googleusercontent.com/MrRonPVy7-U-K3PrMw1bVI6MEEpFP8hCVpGBbWZ1DJ1MVM_Wl0f21rRhg0qmEdKyXdj4ybJ4F7cO-cEBALbo_CK4Chv4tsxNS_7XDsgAse1MxNuRjB5kE2YRt1biAbYm3SJI9TxUsXguVGA6H5F4eQ" alt=""><figcaption></figcaption></figure>

Terlihat bahwa terdapat pengecekan untuk input secara incremental , jadi mulai dari 1 byte , 2 byte, 3 byte, dst. Untuk crac sendiri merupakan fungsi hash ( modified crc32 ) . Jadi disini kita bisa melakukan brute per 1 byte , dengan cara membandingkan hasil hash karakter 1 byte ditambah dengan jumlah hash sebelumnya. Berikut solver yang kami gunakan

```python
def crac(inp):
    v6 = 0x0FFFFFFFF
    for i in range(1):
   	 v2 = ord(inp)
   	 v6 = (v6 << 8) ^ crc32table[(v6&0xff) ^ v2]
    return v6&0xffffffff

v7 = [0 for i in range(44)]
v7[0] = 2009983258;
v7[1] = -858652113;
v7[2] = 1619716985;
v7[3] = -87704163;
v7[4] = -1904302361;
v7[5] = 763000442;
v7[6] = -1284382804;
v7[7] = 1898624059;
v7[8] = 902842582;
v7[9] = -164310526;
v7[10] = -1707846004;
v7[11] = -1459290214;
v7[12] = -2081962952;
v7[13] = 1644928353;
v7[14] = 1467199401;
v7[15] = 1715755191;
v7[16] = 172219713;
v7[17] = -823561764;
v7[18] = -1446234502;
v7[19] = 1665531826;
v7[20] = 988275193;
v7[21] = 747696632;
v7[22] = 996252422;
v7[23] = 647028051;
v7[24] = 469299099;
v7[25] = 717854889;
v7[26] = 540125937;
v7[27] = 111021957;
v7[28] = -1432513521;
v7[29] = 923985515;
v7[30] = 1172541305;
v7[31] = 994812353;
v7[32] = 426736362;
v7[33] = -195936376;
v7[34] = -1379137344;
v7[35] = -1430900250;
v7[36] = 1868285569;
v7[37] = 2116841359;
v7[38] = 627771596;
v7[39] = -439381512;
v7[40] = -491144418;
v7[41] = -1486925895;
v7[42] = 1696080968;
v7[43] = 76105928;
crc32table = [0x0, 0x4c11db7, 0x9823b6e, 0xd4326d9, 0x130476dc, 0x17c56b6b, 0x1a864db2, 0x1e475005, 0x2608edb8, 0x22c9f00f, 0x2f8ad6d6, 0x2b4bcb61, 0x350c9b64, 0x31cd86d3, 0x3c8ea00a, 0x384fbdbd, 0x4c11db70, 0x48d0c6c7, 0x4593e01e, 0x4152fda9, 0x5f15adac, 0x5bd4b01b, 0x569796c2, 0x52568b75, 0x6a1936c8, 0x6ed82b7f, 0x639b0da6, 0x675a1011, 0x791d4014, 0x7ddc5da3, 0x709f7b7a, 0x745e66cd, 0x9823b6e0, 0x9ce2ab57, 0x91a18d8e, 0x95609039, 0x8b27c03c, 0x8fe6dd8b, 0x82a5fb52, 0x8664e6e5, 0xbe2b5b58, 0xbaea46ef, 0xb7a96036, 0xb3687d81, 0xad2f2d84, 0xa9ee3033, 0xa4ad16ea, 0xa06c0b5d, 0xd4326d90, 0xd0f37027, 0xddb056fe, 0xd9714b49, 0xc7361b4c, 0xc3f706fb, 0xceb42022, 0xca753d95, 0xf23a8028, 0xf6fb9d9f, 0xfbb8bb46, 0xff79a6f1, 0xe13ef6f4, 0xe5ffeb43, 0xe8bccd9a, 0xec7dd02d, 0x34867077, 0x30476dc0, 0x3d044b19, 0x39c556ae, 0x278206ab, 0x23431b1c, 0x2e003dc5, 0x2ac12072, 0x128e9dcf, 0x164f8078, 0x1b0ca6a1, 0x1fcdbb16, 0x18aeb13, 0x54bf6a4, 0x808d07d, 0xcc9cdca, 0x7897ab07, 0x7c56b6b0, 0x71159069, 0x75d48dde, 0x6b93dddb, 0x6f52c06c, 0x6211e6b5, 0x66d0fb02, 0x5e9f46bf, 0x5a5e5b08, 0x571d7dd1, 0x53dc6066, 0x4d9b3063, 0x495a2dd4, 0x44190b0d, 0x40d816ba, 0xaca5c697, 0xa864db20, 0xa527fdf9, 0xa1e6e04e, 0xbfa1b04b, 0xbb60adfc, 0xb6238b25, 0xb2e29692, 0x8aad2b2f, 0x8e6c3698, 0x832f1041, 0x87ee0df6, 0x99a95df3, 0x9d684044, 0x902b669d, 0x94ea7b2a, 0xe0b41de7, 0xe4750050, 0xe9362689, 0xedf73b3e, 0xf3b06b3b, 0xf771768c, 0xfa325055, 0xfef34de2, 0xc6bcf05f, 0xc27dede8, 0xcf3ecb31, 0xcbffd686, 0xd5b88683, 0xd1799b34, 0xdc3abded, 0xd8fba05a, 0x690ce0ee, 0x6dcdfd59, 0x608edb80, 0x644fc637, 0x7a089632, 0x7ec98b85, 0x738aad5c, 0x774bb0eb, 0x4f040d56, 0x4bc510e1, 0x46863638, 0x42472b8f, 0x5c007b8a, 0x58c1663d, 0x558240e4, 0x51435d53, 0x251d3b9e, 0x21dc2629, 0x2c9f00f0, 0x285e1d47, 0x36194d42, 0x32d850f5, 0x3f9b762c, 0x3b5a6b9b, 0x315d626, 0x7d4cb91, 0xa97ed48, 0xe56f0ff, 0x1011a0fa, 0x14d0bd4d, 0x19939b94, 0x1d528623, 0xf12f560e, 0xf5ee4bb9, 0xf8ad6d60, 0xfc6c70d7, 0xe22b20d2, 0xe6ea3d65, 0xeba91bbc, 0xef68060b, 0xd727bbb6, 0xd3e6a601, 0xdea580d8, 0xda649d6f, 0xc423cd6a, 0xc0e2d0dd, 0xcda1f604, 0xc960ebb3, 0xbd3e8d7e, 0xb9ff90c9, 0xb4bcb610, 0xb07daba7, 0xae3afba2, 0xaafbe615, 0xa7b8c0cc, 0xa379dd7b, 0x9b3660c6, 0x9ff77d71, 0x92b45ba8, 0x9675461f, 0x8832161a, 0x8cf30bad, 0x81b02d74, 0x857130c3, 0x5d8a9099, 0x594b8d2e, 0x5408abf7, 0x50c9b640, 0x4e8ee645, 0x4a4ffbf2, 0x470cdd2b, 0x43cdc09c, 0x7b827d21, 0x7f436096, 0x7200464f, 0x76c15bf8, 0x68860bfd, 0x6c47164a, 0x61043093, 0x65c52d24, 0x119b4be9, 0x155a565e, 0x18197087, 0x1cd86d30, 0x29f3d35, 0x65e2082, 0xb1d065b, 0xfdc1bec, 0x3793a651, 0x3352bbe6, 0x3e119d3f, 0x3ad08088, 0x2497d08d, 0x2056cd3a, 0x2d15ebe3, 0x29d4f654, 0xc5a92679, 0xc1683bce, 0xcc2b1d17, 0xc8ea00a0, 0xd6ad50a5, 0xd26c4d12, 0xdf2f6bcb, 0xdbee767c, 0xe3a1cbc1, 0xe760d676, 0xea23f0af, 0xeee2ed18, 0xf0a5bd1d, 0xf464a0aa, 0xf9278673, 0xfde69bc4, 0x89b8fd09, 0x8d79e0be, 0x803ac667, 0x84fbdbd0, 0x9abc8bd5, 0x9e7d9662, 0x933eb0bb, 0x97ffad0c, 0xafb010b1, 0xab710d06, 0xa6322bdf, 0xa2f33668, 0xbcb4666d, 0xb8757bda, 0xb5365d03, 0xb1f740b4]
import string
flag = ""
for j in range(len(v7)):
    x = v7[j]&0xffffffff
    for i in string.printable[:-6]:
   	 if(j==0):
   		 tmp_check = crac(i)
   	 else:
   		 tmp_check = crac(i) + v7[j-1]
   	 tmp_check &= 0xffffffff
   	 if(tmp_check==x):
   		 flag += i
   		 break
    print(flag)

```

Flag : CJ2021{this\_one\_should\_be\_easy\_enough\_right}

## Waze (951 pts)

### Description

\-

### Solution

Diberikan akses ke suatu website yang merupakan web assembly.

<figure><img src="https://lh7-us.googleusercontent.com/mPa9nEGjC7xhsd3rJ1DLKXggOKoj_pJVlcgE6u3sVyCbRWcjAg8Gd5kiLyJSPeLewOOdmMdsj3UmZ0w9WVVSSNCCUXg1ftMpKuE1mqjLf2elM-Xge5ob-aD9Apt6VQPK0MJMPn5j9oJfmtMIUUr6sA" alt=""><figcaption></figcaption></figure>

Terlihat bahwa kita diharuskan mencapai finish dengan koordinat 126,127 dengan koordinat start 1,0. Pada setiap langkah terdapat pengecekan valid move , fungsi ini bisa kita gunakan untuk memetakan block pada maze. Selanjutnya tinggal implement bfs untuk mendapatkan shortest path first menuju koordinat finish. Berikut script yang kami gunakan untuk melakukan mapping terhadap maze.

Sebelumnya decompile dulu wasm dengan wasm2c.

```c
#include <stdio.h>
#include <stdlib.h>

/* Uncomment this to define fac_init and fac_Z_facZ_ii instead. */
/* #define WASM_RT_MODULE_PREFIX fac_ */

#include "waze.h"

int main(int argc, char** argv) {
  init();
  for (int y = 0; y < 128 ; ++y)
  {
	for (int x = 0; x < 128; ++x)
	{
  	u32 result = Z_valid_moveZ_iii(x,y);
  	if(result){
    	printf("0, ");
  	}
  	else{
    	printf("1, ");
  	}
	}
	printf("\n");
  }

  return 0;
}

```

Selanjutnya tinggal menerapkan bfs untuk mendapatkan shortest path first

```python
a = [[]] # output from previous script
start = 0,1
end = 127,126

def make_step(k):
  for i in range(len(m)):
	for j in range(len(m[i])):
  	if m[i][j] == k:
    	if i>0 and m[i-1][j] == 0 and a[i-1][j] == 0:
      		m[i-1][j] = k + 1
    	if j>0 and m[i][j-1] == 0 and a[i][j-1] == 0:
      		m[i][j-1] = k + 1
    	if i<len(m)-1 and m[i+1][j] == 0 and a[i+1][j] == 0:
      		m[i+1][j] = k + 1
    	if j<len(m[i])-1 and m[i][j+1] == 0 and a[i][j+1] == 0:
       		m[i][j+1] = k + 1

m = []
for i in range(len(a)):
	m.append([])
	for j in range(len(a[i])):
    	m[-1].append(0)
i,j = start
m[i][j] = 1

k = 0
while m[end[0]][end[1]] == 0:
	k += 1
	make_step(k)


i, j = end
k = m[i][j]
the_path = [(i,j)]
while k > 1:
  if i > 0 and m[i - 1][j] == k-1:
  	i, j = i-1, j
	the_path.append((i, j))
	k-=1
  elif j > 0 and m[i][j - 1] == k-1:
	i, j = i, j-1
	the_path.append((i, j))
	k-=1
  elif i < len(m) - 1 and m[i + 1][j] == k-1:
	i, j = i+1, j
	the_path.append((i, j))
	k-=1
  elif j < len(m[i]) - 1 and m[i][j + 1] == k-1:
	i, j = i, j+1
	the_path.append((i, j))
	k -= 1

the_path = the_path[::-1]
payload = ""
for i in range(0,len(the_path)-1):
    if(i==0):
    	init = the_path[i]
    else:
    	y = the_path[i][0]-init[0]
    	x = the_path[i][1]-init[1]
    	if(y==1):
    		payload += 's'
    	elif(y==-1):
    		payload += 'w'
    	if(x==1):
    		payload += 'd'
    	elif(x==-1):
    		payload += 'a'
    	init = the_path[i]
print(payload)
```

Terakhir , untuk mendapatkan flag kami melakukan perubahan pada index.js , yaitu dengan memasukkan payload dari script sebelumnya.

```javascript
import init, {valid_move, get_flag} from "./waze.js";

const _ = init("./waze_bg.wasm");
let button = ""
let coord = {x: 1, y: 0}
let finish = {x: 126, y: 127}

document.addEventListener('keydown', press)
function press(e){
  console.log(button);
  console.log(get_flag(button));
  var data = "ssddwdddddsddddsssssddddsddsssdsddddsddwddddwdwdddssdddddddsssdsddwddddsddddsssddddssssdssssddddwddwddddddddddddsddddsddsdddssddddwddwwwwdddddddwddwwwwwwwwwwwdwdddddssaassassssssdsdsdsdddsssssdssssssdsssdssssssassssdsssssassssssssdddsssdsdsdsssssasssssdssddsssssdssssdsssssdddsssddssdssasssssssssaaasassssssassdddddssssddssss";
  for (var i = 0; i < data.length; i++) {
  if (data[i] =='w' /* w */) {
    
	if (valid_move(coord.x, coord.y - 1)) {
    	button += 'w'
    	coord.y -= 1
    	if (coord.x == finish.x && coord.y == finish.y) { alert(get_flag(button)) }
	}
  }
  if (data[i]== 'd' /* d */) {
    
	if (valid_move(coord.x + 1, coord.y)) {
    	button += 'd'
    	coord.x += 1
    	if (coord.x == finish.x && coord.y == finish.y) { alert(get_flag(button)) }
	}
  }
  if (data[i] == 's' /* s */) {
    
	if (valid_move(coord.x, coord.y + 1)) {
    	button += 's'
    	coord.y += 1
    	if (coord.x == finish.x && coord.y == finish.y) { alert(get_flag(button)) }
	}
  }
  if (data[i]=='a') {
    
	if (valid_move(coord.x - 1, coord.y)) {
    	button += 'a'
    	coord.x -= 1
    	if (coord.x == finish.x && coord.y == finish.y) { alert(get_flag(button)) }
	}
  }
  if (e.keyCode === 82) /* r */{
  	button = ""
  	coord = {x: 1, y: 0}
  }
  console.log(coord);
}
console.log(coord);
  }
```

<figure><img src="https://lh7-us.googleusercontent.com/VFN7fSmH-hueR2LHmslDpHTeFa9fY1mO38UQZPa2RvDp2dA4yXPe9T0t2JcfrG1xQ3fBhJnNUMinli4mSBThvQATZABB8xoeQEoWIKeEJA0pV4_S7A29fkWV5O1Z6DMb6qdnf7AkO1F38BppCRtxvA" alt=""><figcaption></figcaption></figure>

Tekan key random untuk mentrigger looping , kemudian diakhir tekan “s” untuk mendapatkan flag.

Flag : CJ2021{web\_assembly\_will\_always\_a-maze-d\_me}

## goba (997 pts)

### Description

\-

### Solution

Diberikan file gba , disini kami melakukan decompile menggunakan ghidra dengan bantuan ghidragba. Cukup stuck lama karena mengira bahwa cheat yang dimaksud adalah melakukan patching, ternyata setelah melihat pada fungsi lain kami menemukan ada semacam cheat yang sudah disediakan dari gbanya :)  ( fungsi FUN\_080001b4 ).&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/gUeimA8qcoc5Xw3oA9r2oHlfQIm3GQzG4DoEFgW2lfd8Sx1whNGTqWuBOFEBHaDfv_pfPPm6et4JY70ikMVCN8JLj1UoSWGCCJsxQYiiwbg-7uJEfekLYxNiUQvVfJN-jR3k0l7ao57aGOLTUZD8Cg" alt=""><figcaption></figcaption></figure>

Disini ada 2 cara , melakukan mapping keyinput ( harus cepat mengetiknya sepertinya ) , yang kedua adalah mencari nilai DAT\_03007b74 dan mendapatkan flagnya. Diawal saya coba melakukan mapping , tapi seperti yang saya bilang sebelumnya sepertinya harus cepat mengetikkan cheatnya agar bisa menghasilkan flag, karena input panjang jadinya gagal deh. Berikut script mapping yang kami gunakan.

```python
# known = {895:"down",959:"up",991:"left",1007:"right",511:"LSHOULDER",767:"RSHOULDER",1022:"A",1021:"B",1015:"START",1019:"SELECTx"}
known = {895:"DOWN",959:"UP",991:"LEFT",1007:"RIGHT",511:"Q",767:"E",1022:"Z",1021:"X",1015:"V",1019:"B"}
z = [0x3f7,0x37f,0x3df,0x3ef,0x3fd,0x3fd,0x3bf,0x2ff,0x3bf,0x3fd,0x3df,0x3fe,0x3bf,0x37f,0x3df,0x2ff,0x2ff,0x37f,0x2ff,0x37f,0x1ff,0x37f,0x2ff,0x2ff,0x1ff,0x3df,0x3fb,0x1ff,0x3df,0x37f,0x1ff,0x3fe,0x3f7,0x3df,0x3fd,0x3f7,0x3f7,0x3fe,0x3ef,0x2ff,0x3fd,0x3ef,0x3ef,0x37f,0x3fe,0x3df,0x2ff,0x2ff,0x3ef]
for j,i in enumerate(z):
    print(j,known[i])
```

Selanjutnya cara kedua, ini ngeselin , karena sudah kelelahan akhirnya yang harusnya 0x7fff saya tulis 0x7ffff , debugging lama karena bingung salahnya dimana hingga akhirnya sadar. Untuk value DAT\_03007b74 sendiri bisa menggunakan memory viewer untuk mendapatkannya.

<figure><img src="https://lh7-us.googleusercontent.com/VruJdFOnXRK8SAdiEiNkgXS79B7d40FErB5DmFwLbZfyUIWPDZHnhrqoWNA8jSq40X21-vBdMwTgDVXH602e2YESMxv_4y0sGm-oDMbhFsCU9onsmB66NWZPn2MQcIUgBNU4GPqQwpjGywnH3kEoOQ" alt=""><figcaption></figcaption></figure>

Value initial dari DAT\_03007b74 adalah 0x1337. Selanjutnya tinggal generate flag, berikut script yang kami gunakan. Sebelumnya ada miss juga di value 0x14 yang saya tulis 0x1 , kesalahan waktu parsing data.

```python
add = [-9,0x7f,-0x21,-0x11,-3,-3,0xbf,-1,0xbf,-3,-0x21,-2,0xbf,0x7f,-0x21,-1,-1,0x7f,-1,0x7f,-1,0x7f,-1,-1,-1,-0x21,-5,-1,-0x21,0x7f,-1,-2,-9,-0x21,-3,-9,-9,-2,-0x11,-1,-3,-0x11,-0x11,0x7f,-2,-0x21,-1,-1,-0x11]
xor = [0x9e,0x41,0x73,0xb8,0x88,0xa6,0x1b,0x3f,0x9f,0x45,0x19,0x88,0xcf,0xe8,0x44,0xb2,0xe8,0x9f,0x4e,0x96,8,0xe2,9,0x91,0xdb,0xde,0x7b,0xc1,0xda,0xee,5,0x5b,0x99,0x54,0xd6,0x54,9,0xf8,0x1e,0x11,0x42,0x1d,0x18,0x18,0x14,9,0x11,0x2d,0xe3]
key = []
flag = ""
x = 0x1337
# print(hex(x))
# x = 0x3ee6
# x = (x * 0x000343fd + 0x269ec3)
# print(hex(x))
# x = (x >> 0x10 )&0x7ffff
# print(hex(x))
for i in range(len(add)):
    x = (x * 0x000343fd + 0x269ec3)
    x = (x >> 0x10 ) &0x7fff
    # print(hex(x))
    # print(x&0xff)
    flag += chr((((x&0xff)+add[i])^xor[i])&0xff)
print(flag)

```

Flag : CJ2021{in\_reversing\_cheating\_is\_always\_an\_option}

## math (1000 pts)

### Description

\-

### Solution

Diberikan file haskell, diawal tidak bisa menjalankan karena tidak ada libdary libffi.so.6 , disini saya mendownload libffi.so.6 dari repo ubuntu 19 ( os saya ubuntu 20 )

<http://mirrors.kernel.org/ubuntu/pool/main/libf/libffi/libffi6_3.2.1-8_amd64.deb>

Diawal berusaha decompile dengan IDA namun stuck , akhirnya kami menemukan hsdecomp ( <https://github.com/gereeter/hsdecomp> ) . Jadi lakukan decompile dengan hsdecomp tersebut

```haskell
Main_main_closure = >>= $fMonadIO getLine (\s2Z4_info_arg_0 -> putStr (show $fShowBool (== ($fEq[] $fEqChar) s2Z4_info_arg_0 (++ (rtv_info (S# 0)) (++ (rtv_info (S# 1)) (++ (rtv_info (S# 2)) (++ (rtv_info (S# 3)) (++ (rtv_info (S# 4)) (++ (rtv_info (S# 5)) (++ (rtv_info (S# 6)) (++ (rtv_info (S# 7)) (++ (rtv_info (S# 8)) (++ (rtv_info (S# 9)) (++ (rtv_info (S# 10)) (++ (rtv_info (S# 11)) (++ (rtv_info (S# 12)) (++ (rtv_info (S# 13)) (++ (rtv_info (S# 14)) (++ (rtv_info (S# 15)) (++ (rtv_info (S# 16)) (++ (rtv_info (S# 17)) (++ (rtv_info (S# 18)) (++ (rtv_info (S# 19)) (++ (rtv_info (S# 20)) (++ (rtv_info (S# 21)) (++ (rtv_info (S# 22)) (++ (rtv_info (S# 23)) (++ (rtv_info (S# 24)) (++ (rtv_info (S# 25)) (++ (rtv_info (S# 26)) (++ (rtv_info (S# 27)) (++ (rtv_info (S# 28)) (++ (rtv_info (S# 29)) (++ (rtv_info (S# 30)) (++ (rtv_info (S# 31)) (++ (rtv_info (S# 32)) (++ (rtv_info (S# 33)) (++ (rtv_info (S# 34)) (++ (rtv_info (S# 35)) (++ (rtv_info (S# 36)) (++ (rtv_info (S# 37)) (++ (rtv_info (S# 38)) (++ (rtv_info (S# 39)) (++ (rtv_info (S# 40)) (++ (rtv_info (S# 41)) (++ (rtv_info (S# 42)) (++ (rtv_info (S# 43)) (++ (rtv_info (S# 44)) (++ (rtv_info (S# 45)) (++ (rtv_info (S# 46)) (++ (rtv_info (S# 47)) (++ (rtv_info (S# 48)) (++ (rtv_info (S# 49)) (++ (rtv_info (S# 50)) (++ (rtv_info (S# 51)) (++ (rtv_info (S# 52)) (++ (rtv_info (S# 53)) (++ (rtv_info (S# 54)) (++ (rtv_info (S# 55)) (++ (rtv_info (S# 56)) (++ (rtv_info (S# 57)) (++ (rtv_info (S# 58)) (++ (rtv_info (S# 59)) (++ (rtv_info (S# 60)) (++ (rtv_info (S# 61)) (++ (rtv_info (S# 62)) (++ (rtv_info (S# 63)) (++ (rtv_info (S# 64)) (++ (rtv_info (S# 65)) (++ (rtv_info (S# 66)) (++ (rtv_info (S# 67)) (++ (rtv_info (S# 68)) (++ (rtv_info (S# 69)) (++ (rtv_info (S# 70)) (++ (rtv_info (S# 71)) (++ (rtv_info (S# 72)) (++ (rtv_info (S# 73)) (++ (rtv_info (S# 74)) (++ (rtv_info (S# 75)) (++ (rtv_info (S# 76)) (++ (rtv_info (S# 77)) (++ (rtv_info (S# 78)) (++ (rtv_info (S# 79)) (++ (rtv_info (S# 80)) (++ (rtv_info (S# 81)) (++ (rtv_info (S# 82)) (++ (rtv_info (S# 83)) (++ (rtv_info (S# 84)) (++ (rtv_info (S# 85)) (++ (rtv_info (S# 86)) (++ (rtv_info (S# 87)) (++ (rtv_info (S# 88)) (++ (rtv_info (S# 89)) (++ (rtv_info (S# 90)) (rtv_info (S# 91))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))

rtv_info = \rtv_info_arg_0 -> : (chr (fromInteger $fNumInt (mod $fIntegralInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (+ $fNumInteger (* $fNumInteger (S# 190) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 91))) (* $fNumInteger (S# 12) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 90)))) (* $fNumInteger (S# 160) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 89)))) (* $fNumInteger (S# 56) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 88)))) (* $fNumInteger (S# 96) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 87)))) (* $fNumInteger (S# 169) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 86)))) (* $fNumInteger (S# 143) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 85)))) (* $fNumInteger (S# 58) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 84)))) (* $fNumInteger (S# 59) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 83)))) (* $fNumInteger (S# 103) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 82)))) (* $fNumInteger (S# 16) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 81)))) (* $fNumInteger (S# 163) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 80)))) (* $fNumInteger (S# 38) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 79)))) (* $fNumInteger (S# 178) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 78)))) (* $fNumInteger (S# 5) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 77)))) (* $fNumInteger (S# 168) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 76)))) (* $fNumInteger (S# 146) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 75)))) (* $fNumInteger (S# 72) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 74)))) (* $fNumInteger (S# 205) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 73)))) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 72))) (* $fNumInteger (S# 3) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 71)))) (* $fNumInteger (S# 48) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 70)))) (* $fNumInteger (S# 76) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 69)))) (* $fNumInteger (S# 58) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 68)))) (* $fNumInteger (S# 5) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 67)))) (* $fNumInteger (S# 12) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 66)))) (* $fNumInteger (S# 151) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 65)))) (* $fNumInteger (S# 225) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 64)))) (* $fNumInteger (S# 17) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 63)))) (* $fNumInteger (S# 149) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 62)))) (* $fNumInteger (S# 218) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 61)))) (* $fNumInteger (S# 215) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 60)))) (* $fNumInteger (S# 37) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 59)))) (* $fNumInteger (S# 201) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 58)))) (* $fNumInteger (S# 213) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 57)))) (* $fNumInteger (S# 14) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 56)))) (* $fNumInteger (S# 88) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 55)))) (* $fNumInteger (S# 208) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 54)))) (* $fNumInteger (S# 101) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 53)))) (* $fNumInteger (S# 141) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 52)))) (* $fNumInteger (S# 228) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 51)))) (* $fNumInteger (S# 23) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 50)))) (* $fNumInteger (S# 127) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 49)))) (* $fNumInteger (S# 116) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 48)))) (* $fNumInteger (S# 126) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 47)))) (* $fNumInteger (S# 246) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 46)))) (* $fNumInteger (S# 77) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 45)))) (* $fNumInteger (S# 191) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 44)))) (* $fNumInteger (S# 184) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 43)))) (* $fNumInteger (S# 144) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 42)))) (* $fNumInteger (S# 115) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 41)))) (* $fNumInteger (S# 136) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 40)))) (* $fNumInteger (S# 222) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 39)))) (* $fNumInteger (S# 180) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 38)))) (* $fNumInteger (S# 64) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 37)))) (* $fNumInteger (S# 165) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 36)))) (* $fNumInteger (S# 138) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 35)))) (* $fNumInteger (S# 233) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 34)))) (* $fNumInteger (S# 34) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 33)))) (* $fNumInteger (S# 242) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 32)))) (* $fNumInteger (S# 136) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 31)))) (* $fNumInteger (S# 130) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 30)))) (* $fNumInteger (S# 187) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 29)))) (* $fNumInteger (S# 12) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 28)))) (* $fNumInteger (S# 8) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 27)))) (* $fNumInteger (S# 63) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 26)))) (* $fNumInteger (S# 15) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 25)))) (* $fNumInteger (S# 53) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 24)))) (* $fNumInteger (S# 240) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 23)))) (* $fNumInteger (S# 55) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 22)))) (* $fNumInteger (S# 183) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 21)))) (* $fNumInteger (S# 148) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 20)))) (* $fNumInteger (S# 100) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 19)))) (* $fNumInteger (S# 245) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 18)))) (* $fNumInteger (S# 103) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 17)))) (* $fNumInteger (S# 19) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 16)))) (* $fNumInteger (S# 184) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 15)))) (* $fNumInteger (S# 217) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 14)))) (* $fNumInteger (S# 47) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 13)))) (* $fNumInteger (S# 53) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 12)))) (* $fNumInteger (S# 187) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 11)))) (* $fNumInteger (S# 14) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 10)))) (* $fNumInteger (S# 239) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 9)))) (* $fNumInteger (S# 82) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 8)))) (* $fNumInteger (S# 230) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 7)))) (* $fNumInteger (S# 188) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 6)))) (* $fNumInteger (S# 85) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 5)))) (* $fNumInteger (S# 149) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 4)))) (* $fNumInteger (S# 11) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 3)))) (* $fNumInteger (S# 54) (^ $fNumInteger $fIntegralInteger rtv_info_arg_0 (S# 2)))) (* $fNumInteger (S# 154) rtv_info_arg_0)) (S# 67)) (S# 251)))) []
```

Selanjutnya tinggal rapikan dan didapatkan hasil perapian sebagai berikut

```
((190)*rtv_info_arg_0) ^ ( 91)
((12)*rtv_info_arg_0) ^ ( 90)
((160)*rtv_info_arg_0) ^ ( 89)
((56)*rtv_info_arg_0) ^ ( 88)
((96)*rtv_info_arg_0) ^ ( 87)
((169)*rtv_info_arg_0) ^ ( 86)
((143)*rtv_info_arg_0) ^ ( 85)
((58)*rtv_info_arg_0) ^ ( 84)
((59)*rtv_info_arg_0) ^ ( 83)
((103)*rtv_info_arg_0) ^ ( 82)
((16)*rtv_info_arg_0) ^ ( 81)
((163)*rtv_info_arg_0) ^ ( 80)
((38)*rtv_info_arg_0) ^ ( 79)
((178)*rtv_info_arg_0) ^ ( 78)
((5)*rtv_info_arg_0) ^ ( 77)
((168)*rtv_info_arg_0) ^ ( 76)
((146)*rtv_info_arg_0) ^ ( 75)
((72)*rtv_info_arg_0) ^ ( 74)
((205)*rtv_info_arg_0) ^ ( 73)
((1)rtv_info_arg_0) ^ ( 72)
((3)*rtv_info_arg_0) ^ ( 71)
((48)*rtv_info_arg_0) ^ ( 70)
((76)*rtv_info_arg_0) ^ ( 69)
((58)*rtv_info_arg_0) ^ ( 68)
((5)*rtv_info_arg_0) ^ ( 67)
((12)*rtv_info_arg_0) ^ ( 66)
((151)*rtv_info_arg_0) ^ ( 65)
((225)*rtv_info_arg_0) ^ ( 64)
((17)*rtv_info_arg_0) ^ ( 63)
((149)*rtv_info_arg_0) ^ ( 62)
((218)*rtv_info_arg_0) ^ ( 61)
((215)*rtv_info_arg_0) ^ ( 60)
((37)*rtv_info_arg_0) ^ ( 59)
((201)*rtv_info_arg_0) ^ ( 58)
((213)*rtv_info_arg_0) ^ ( 57)
((14)*rtv_info_arg_0) ^ ( 56)
((88)*rtv_info_arg_0) ^ ( 55)
((208)*rtv_info_arg_0) ^ ( 54)
((101)*rtv_info_arg_0) ^ ( 53)
((141)*rtv_info_arg_0) ^ ( 52)
((228)*rtv_info_arg_0) ^ ( 51)
((23)*rtv_info_arg_0) ^ ( 50)
((127)*rtv_info_arg_0) ^ ( 49)
((116)*rtv_info_arg_0) ^ ( 48)
((126)*rtv_info_arg_0) ^ ( 47)
((246)*rtv_info_arg_0) ^ ( 46)
((77)*rtv_info_arg_0) ^ ( 45)
((191)*rtv_info_arg_0) ^ ( 44)
((184)*rtv_info_arg_0) ^ ( 43)
((144)*rtv_info_arg_0) ^ ( 42)
((115)*rtv_info_arg_0) ^ ( 41)
((136)*rtv_info_arg_0) ^ ( 40)
((222)*rtv_info_arg_0) ^ ( 39)
((180)*rtv_info_arg_0) ^ ( 38)
((64)*rtv_info_arg_0) ^ ( 37)
((165)*rtv_info_arg_0) ^ ( 36)
((138)*rtv_info_arg_0) ^ ( 35)
((233)*rtv_info_arg_0) ^ ( 34)
((34)*rtv_info_arg_0) ^ ( 33)
((242)*rtv_info_arg_0) ^ ( 32)
((136)*rtv_info_arg_0) ^ ( 31)
((130)*rtv_info_arg_0) ^ ( 30)
((187)*rtv_info_arg_0) ^ ( 29)
((12)*rtv_info_arg_0) ^ ( 28)
((8)*rtv_info_arg_0) ^ ( 27)
((63)*rtv_info_arg_0) ^ ( 26)
((15)*rtv_info_arg_0) ^ ( 25)
((53)*rtv_info_arg_0) ^ ( 24)
((240)*rtv_info_arg_0) ^ ( 23)
((55)*rtv_info_arg_0) ^ ( 22)
((183)*rtv_info_arg_0) ^ ( 21)
((148)*rtv_info_arg_0) ^ ( 20)
((100)*rtv_info_arg_0) ^ ( 19)
((245)*rtv_info_arg_0) ^ ( 18)
((103)*rtv_info_arg_0) ^ ( 17)
((19)*rtv_info_arg_0) ^ ( 16)
((184)*rtv_info_arg_0) ^ ( 15)
((217)*rtv_info_arg_0) ^ ( 14)
((47)*rtv_info_arg_0) ^ ( 13)
((53)*rtv_info_arg_0) ^ ( 12)
((187)*rtv_info_arg_0) ^ ( 11)
((14)*rtv_info_arg_0) ^ ( 10)
((239)*rtv_info_arg_0) ^ ( 9)
((82)*rtv_info_arg_0) ^ ( 8)
((230)*rtv_info_arg_0) ^ ( 7)
((188)*rtv_info_arg_0) ^ ( 6)
((85)*rtv_info_arg_0) ^ ( 5)
((149)*rtv_info_arg_0) ^ ( 4)
((11)*rtv_info_arg_0) ^ ( 3)
((54)*rtv_info_arg_0) ^ ( 2)
((154)rtv_info_arg_0)))
( 67))
( 251
```

Terlihat bahwa untuk masing-masing operasi pernghubungnya adalah + jadi lakukan penggabunngan dengan + , kemudian diakhir ada operasi mod dengan 251. Selanjutnya karena terlihat berbentuk polynomial jadi tinggal lakukan translate dengan memasukkan nilai rtv\_info\_arg\_0 dari 0 sampai 92.

```python
equation = '(190*x ^  91+12*x ^  90+160*x ^  89+56*x ^  88+96*x ^  87+169*x ^  86+143*x ^  85+58*x ^  84+59*x ^  83+103*x ^  82+16*x ^  81+163*x ^  80+38*x ^  79+178*x ^  78+5*x ^  77+168*x ^  76+146*x ^  75+72*x ^  74+205*x ^  73+1*x ^  72+3*x ^  71+48*x ^  70+76*x ^  69+58*x ^  68+5*x ^  67+12*x ^  66+151*x ^  65+225*x ^  64+17*x ^  63+149*x ^  62+218*x ^  61+215*x ^  60+37*x ^  59+201*x ^  58+213*x ^  57+14*x ^  56+88*x ^  55+208*x ^  54+101*x ^  53+141*x ^  52+228*x ^  51+23*x ^  50+127*x ^  49+116*x ^  48+126*x ^  47+246*x ^  46+77*x ^  45+191*x ^  44+184*x ^  43+144*x ^  42+115*x ^  41+136*x ^  40+222*x ^  39+180*x ^  38+64*x ^  37+165*x ^  36+138*x ^  35+233*x ^  34+34*x ^  33+242*x ^  32+136*x ^  31+130*x ^  30+187*x ^  29+12*x ^  28+8*x ^  27+63*x ^  26+15*x ^  25+53*x ^  24+240*x ^  23+55*x ^  22+183*x ^  21+148*x ^  20+100*x ^  19+245*x ^  18+103*x ^  17+19*x ^  16+184*x ^  15+217*x ^  14+47*x ^  13+53*x ^  12+187*x ^  11+14*x ^  10+239*x ^  9+82*x ^  8+230*x ^  7+188*x ^  6+85*x ^  5+149*x ^  4+11*x ^  3+54*x ^  2+154*x+67)%251'
equation = equation.replace('^', '**')
flag = ''
for x in range(92):
    y = eval(equation)
    flag += chr(y)
print(flag)
```

Flag : CJ2021{how\_can\_haskell\_not\_be\_the\_programming\_language\_that\_all\_mathematicians\_should\_learn}
