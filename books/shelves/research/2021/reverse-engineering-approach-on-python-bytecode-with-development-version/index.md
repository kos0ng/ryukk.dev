# Reverse Engineering Approach on Python Bytecode with Development Version

Study case MDT4.0 Quals (ResidentSleeper)

## Preface

Most of the tools that disassembling or decompiling pyc file are not support the newest version of python, obviously with the development version. So, if there is a pyc file compiled with development version or newest version, we can use approach in this article to decompile it.

## Compiling Python with Development Version

Given a python pyc file, at first i got stuck because I didn't read the description. Thinking that the python version is 3.1.1 . After realizing that the python in question was python 3.11 (development), we tried building python from source (<https://github.com/python/cpython/>). Then we tried to import the pyc file and failed.

<figure><img src="https://lh7-us.googleusercontent.com/-FXyrowj5rcdCblKqvTN3ORAGkJtps4zRz3QVzBE8qk7Y9hdTWVPo6x4pja0hSp821J7lWhZj36xgJEcwkYsN98e4EI2ZzGd3DGncDRXDhnXR9jLWJPzTb7ivCjBeT0vQZYWZ73MwpRoK8ej-UyjTw" alt=""><figcaption></figcaption></figure>

From image above, we can see that the magic number is wrong, the magic number of the target is 0xd81, so we commit with the magic number 0xd81

```bash
git log -S "MAGIC_NUMBER = (3457)" --source --all
```

<figure><img src="https://lh7-us.googleusercontent.com/WooswYtvjCf0PBsKHyqJRIo2-_c2miUhSR0Gbyw4OuQdhgIhy4a7g9y-cjKg4D9xns5l6-XjKQZfwq93aPF9xpgJacLxwrLzqEgqgaWfp2Ni8KFmuz-KC-XYp4JCgbHxymBkCt6F-RUs70Uc0QVWag" alt=""><figcaption></figcaption></figure>

Next, checkout the commit hash. In this case, I checkout the bottom commit hash. Then pull and rebuild the python. After that, just reload the pyc file.

## Disassembling Python Bytecode

<figure><img src="https://lh7-us.googleusercontent.com/TOb-rLhLfgOC7z_UBz8Lli9tL7DaSaBkJxHxuQT84PBCllFBpRSnlD4M2-Xf88Z1q24ISBXQDkdaGPVzP2SJGxCnB38eRHwyeo7E6CJ1xXUcyJV9HDJYW2zOpsm76QWoxA3DvNLKNtgHq7e5ySwOYw" alt=""><figcaption></figcaption></figure>

It turned out to be successful, then all we need to do was disassemble the byte code with the dis library and convert the assembly to python code. Following are the disassembly results

```nasm
>>> dis.dis(test)
Disassembly of o:
  4       	0 LOAD_GLOBAL          	0 (int)
          	2 LOAD_GLOBAL          	1 (time)
          	4 LOAD_METHOD          	1 (time)
          	6 CALL_METHOD          	0
          	8 CALL_FUNCTION        	1
         	10 STORE_FAST           	1 (y)

  5      	12 LOAD_GLOBAL          	1 (time)
         	14 LOAD_METHOD          	2 (sleep)
         	16 LOAD_CONST           	1 (1)
         	18 CALL_METHOD          	1
         	20 POP_TOP

  6      	22 LOAD_GLOBAL          	0 (int)
         	24 LOAD_GLOBAL          	1 (time)
         	26 LOAD_METHOD          	1 (time)
         	28 CALL_METHOD          	0
         	30 CALL_FUNCTION        	1
         	32 STORE_FAST           	2 (z)

  7      	34 LOAD_FAST            	0 (x)
         	36 LOAD_FAST            	2 (z)
         	38 BINARY_ADD
         	40 LOAD_FAST            	1 (y)
         	42 BINARY_SUBTRACT
         	44 RETURN_VALUE

Disassembly of oo:
 10       	0 LOAD_GLOBAL          	0 (int)
          	2 LOAD_GLOBAL          	1 (time)
          	4 LOAD_METHOD          	1 (time)
          	6 CALL_METHOD          	0
          	8 CALL_FUNCTION        	1
         	10 STORE_FAST           	1 (y)

 11      	12 LOAD_GLOBAL          	1 (time)
         	14 LOAD_METHOD          	2 (sleep)
         	16 LOAD_CONST           	1 (1)
         	18 CALL_METHOD          	1
         	20 POP_TOP

 12      	22 LOAD_GLOBAL          	0 (int)
         	24 LOAD_GLOBAL          	1 (time)
         	26 LOAD_METHOD          	1 (time)
         	28 CALL_METHOD          	0
         	30 CALL_FUNCTION        	1
         	32 STORE_FAST           	2 (z)

 13      	34 LOAD_FAST            	0 (x)
         	36 LOAD_FAST            	1 (y)
         	38 BINARY_ADD
         	40 LOAD_FAST            	2 (z)
         	42 BINARY_SUBTRACT
         	44 RETURN_VALUE

Disassembly of ooo:
 16       	0 LOAD_FAST            	0 (x)
          	2 POP_JUMP_IF_FALSE   	12 (to 24)

 17 	>>	4 LOAD_GLOBAL          	0 (o)
          	6 LOAD_FAST            	1 (y)
          	8 CALL_FUNCTION        	1
         	10 STORE_FAST           	1 (y)

 18      	12 LOAD_GLOBAL          	1 (oo)
         	14 LOAD_FAST            	0 (x)
         	16 CALL_FUNCTION        	1
         	18 STORE_FAST           	0 (x)

 16      	20 LOAD_FAST            	0 (x)
         	22 POP_JUMP_IF_TRUE     	2 (to 4)

 19 	>>   24 LOAD_FAST            	1 (y)
         	26 RETURN_VALUE

Disassembly of oooo:
 22       	0 LOAD_FAST            	1 (y)
          	2 POP_JUMP_IF_FALSE   	12 (to 24)

 23 	>>	4 LOAD_GLOBAL          	0 (oo)
          	6 LOAD_FAST            	0 (x)
          	8 CALL_FUNCTION        	1
         	10 STORE_FAST           	0 (x)

 24      	12 LOAD_GLOBAL          	0 (oo)
         	14 LOAD_FAST            	1 (y)
         	16 CALL_FUNCTION        	1
         	18 STORE_FAST           	1 (y)

 22      	20 LOAD_FAST            	1 (y)
         	22 POP_JUMP_IF_TRUE     	2 (to 4)

 25 	>>   24 LOAD_FAST            	0 (x)
         	26 RETURN_VALUE

Disassembly of ooooo:
 28       	0 LOAD_FAST            	0 (x)
          	2 LOAD_CONST           	1 (0)
          	4 COMPARE_OP           	4 (>)
          	6 POP_JUMP_IF_FALSE   	22 (to 44)

 29 	>>	8 LOAD_GLOBAL          	0 (oooo)
         	10 LOAD_FAST            	0 (x)
         	12 LOAD_FAST            	1 (y)
         	14 CALL_FUNCTION        	2
         	16 LOAD_CONST           	1 (0)
         	18 COMPARE_OP           	0 (<)
         	20 POP_JUMP_IF_FALSE   	13 (to 26)

 30      	22 LOAD_FAST            	0 (x)
         	24 RETURN_VALUE

 32 	>>   26 LOAD_GLOBAL          	0 (oooo)
         	28 LOAD_FAST            	0 (x)
         	30 LOAD_FAST            	1 (y)
         	32 CALL_FUNCTION        	2
         	34 STORE_FAST           	0 (x)

 28      	36 LOAD_FAST            	0 (x)
         	38 LOAD_CONST           	1 (0)
         	40 COMPARE_OP           	4 (>)
         	42 POP_JUMP_IF_TRUE     	4 (to 8)

 33 	>>   44 LOAD_FAST            	0 (x)
         	46 RETURN_VALUE

Disassembly of oooooo:
 36       	0 LOAD_CONST           	1 (0)
          	2 STORE_FAST           	2 (z)

 37       	4 LOAD_FAST            	0 (x)
          	6 POP_JUMP_IF_FALSE   	15 (to 30)

 38 	>>	8 LOAD_GLOBAL          	0 (ooo)
         	10 LOAD_FAST            	2 (z)
         	12 LOAD_FAST            	1 (y)
         	14 CALL_FUNCTION        	2
         	16 STORE_FAST           	2 (z)

 39      	18 LOAD_GLOBAL          	1 (oo)
         	20 LOAD_FAST            	0 (x)
         	22 CALL_FUNCTION        	1
         	24 STORE_FAST           	0 (x)

 37      	26 LOAD_FAST            	0 (x)
         	28 POP_JUMP_IF_TRUE     	4 (to 8)

 40 	>>   30 LOAD_FAST            	2 (z)
         	32 RETURN_VALUE

Disassembly of ooooooo:
 43       	0 LOAD_CONST           	1 (1)
          	2 STORE_FAST           	2 (z)

 44       	4 LOAD_FAST            	1 (y)
          	6 POP_JUMP_IF_FALSE   	15 (to 30)

 45 	>>	8 LOAD_GLOBAL          	0 (oooooo)
         	10 LOAD_FAST            	2 (z)
         	12 LOAD_FAST            	0 (x)
         	14 CALL_FUNCTION        	2
         	16 STORE_FAST           	2 (z)

 46      	18 LOAD_GLOBAL          	1 (oo)
         	20 LOAD_FAST            	1 (y)
         	22 CALL_FUNCTION        	1
         	24 STORE_FAST           	1 (y)

 44      	26 LOAD_FAST            	1 (y)
         	28 POP_JUMP_IF_TRUE     	4 (to 8)

 47 	>>   30 LOAD_FAST            	2 (z)
         	32 RETURN_VALUE

>>>

```

Below is the main code

```nasm
1       	0 LOAD_CONST           	0 (0)
          	2 LOAD_CONST           	1 (None)
          	4 IMPORT_NAME          	0 (time)
          	6 STORE_NAME           	0 (time)

  3       	8 LOAD_CONST           	2 (<code object o at 0x7f228a965480, file "/vidner/ctf/MDT4.0/ResidentSleeper/main.py", line 3>)
         	10 LOAD_CONST           	3 ('o')
         	12 MAKE_FUNCTION        	0
         	14 STORE_NAME           	1 (o)

  9      	16 LOAD_CONST           	4 (<code object oo at 0x7f228a9653b0, file "/vidner/ctf/MDT4.0/ResidentSleeper/main.py", line 9>)
         	18 LOAD_CONST           	5 ('oo')
         	20 MAKE_FUNCTION        	0
         	22 STORE_NAME           	2 (oo)

 15      	24 LOAD_CONST           	6 (<code object ooo at 0x7f228a964030, file "/vidner/ctf/MDT4.0/ResidentSleeper/main.py", line 15>)
         	26 LOAD_CONST           	7 ('ooo')
         	28 MAKE_FUNCTION        	0
         	30 STORE_NAME           	3 (ooo)

 21      	32 LOAD_CONST           	8 (<code object oooo at 0x7f228a965210, file "/vidner/ctf/MDT4.0/ResidentSleeper/main.py", line 21>)
         	34 LOAD_CONST           	9 ('oooo')
         	36 MAKE_FUNCTION        	0
         	38 STORE_NAME           	4 (oooo)

 27      	40 LOAD_CONST          	10 (<code object ooooo at 0x7f228a967ec0, file "/vidner/ctf/MDT4.0/ResidentSleeper/main.py", line 27>)
         	42 LOAD_CONST          	11 ('ooooo')
         	44 MAKE_FUNCTION        	0
         	46 STORE_NAME           	5 (ooooo)

 35      	48 LOAD_CONST          	12 (<code object oooooo at 0x7f228a967df0, file "/vidner/ctf/MDT4.0/ResidentSleeper/main.py", line 35>)
         	50 LOAD_CONST          	13 ('oooooo')
         	52 MAKE_FUNCTION        	0
         	54 STORE_NAME           	6 (oooooo)

 42      	56 LOAD_CONST          	14 (<code object ooooooo at 0x7f228a967d20, file "/vidner/ctf/MDT4.0/ResidentSleeper/main.py", line 42>)
         	58 LOAD_CONST          	15 ('ooooooo')
         	60 MAKE_FUNCTION        	0
         	62 STORE_NAME           	7 (ooooooo)

 49      	64 LOAD_CONST          	16 (41112103283917454486815351235592327750374606035364044904549786274063940500127292129160130088437242562481317271189704486250001660426794590582864352227824456128689637487544130634094989889803617277872004527925565683665094776622973455646820937787984427925613799066535224419374804782266448060220993813820053243675)
         	66 STORE_NAME           	8 (oooooooo)

 50      	68 LOAD_CONST          	17 (49055846290687805589158795284169955186003140166818839775297319448161328190770535718316637707483970867603461316372533744727151938299159549355276552654913927710154241593918902015076315192209259927814405830919750754546429796521409464169008657592288491314559772134501302569826363470684991963998829111760097216407)
         	70 STORE_NAME           	9 (ooooooooo)

 51      	72 LOAD_CONST          	18 (127936210364424549429821523171517394019980015404715824125177994973005788640383955087499452254735549802030603246825712570014658333047295783286446583948948234379098538102325710783116368091018566261160603678092049794942482571488382808621635324536834018443229997397877174133031157238744716246832002317602389875961)
         	74 STORE_NAME          	10 (oooooooooo)

 53      	76 LOAD_NAME           	11 (__name__)
         	78 LOAD_CONST          	19 ('__main__')
         	80 COMPARE_OP           	2 (==)
         	82 POP_JUMP_IF_FALSE   	66 (to 132)

 54      	84 LOAD_NAME           	12 (print)
         	86 LOAD_NAME           	13 (bytes)
         	88 LOAD_METHOD         	14 (fromhex)
         	90 LOAD_NAME           	15 (hex)
         	92 LOAD_NAME            	5 (ooooo)
         	94 LOAD_NAME            	7 (ooooooo)
         	96 LOAD_NAME            	8 (oooooooo)
         	98 LOAD_NAME            	8 (oooooooo)
        	100 CALL_FUNCTION        	2
        	102 LOAD_NAME           	10 (oooooooooo)
        	104 CALL_FUNCTION        	2
        	106 CALL_FUNCTION        	1
        	108 LOAD_CONST          	20 (2)
        	110 LOAD_CONST           	1 (None)
        	112 BUILD_SLICE          	2
        	114 BINARY_SUBSCR
        	116 CALL_METHOD          	1
        	118 LOAD_METHOD         	16 (decode)
        	120 LOAD_CONST          	21 ('utf-8')
        	122 CALL_METHOD          	1
        	124 CALL_FUNCTION        	1
        	126 POP_TOP
        	128 LOAD_CONST           	1 (None)
        	130 RETURN_VALUE

 53 	>>  132 LOAD_CONST           	1 (None)
        	134 RETURN_VALUE
```

## Reconstructing Python Code

Converting one by one function and validate it by disassembling our created function. Below is the result of the whole opcode conversion

```python
   import dis
   import time

    def o(x):
   	 y = int(time.time())
   	 time.sleep(1)
   	 z = int(time.time())
   	 return x+z-y

    def oo(x):
   	 y = int(time.time())
   	 time.sleep(1)
   	 z = int(time.time())
   	 return x + y - z

    def ooo(x,y):
   	 while(x):
   		 y = o(y)
   		 x = oo(x)
   	 return y

    def oooo(x,y):
   	 while(y):
   		 x = oo(x)
   		 y = oo(y)
   	 return x

    def ooooo(x,y):
   	 while x>0:
   		 if(oooo(x,y)<0):
   			 return x
   		 else:
   			 x = oooo(x,y)
   	 return x

    def oooooo(x,y):
   	 z = 0
   	 while x:
   		 z = ooo(z,y)
   		 x = oo(x)
   	 return z

    def ooooooo(x,y):
   	 z = 1
   	 while y:
   		 z = oooooo(z,x)
   		 y = oo(y)
   	 return z

    oooooooo = 41112103283917454486815351235592327750374606035364044904549786274063940500127292129160130088437242562481317271189704486250001660426794590582864352227824456128689637487544130634094989889803617277872004527925565683665094776622973455646820937787984427925613799066535224419374804782266448060220993813820053243675
    ooooooooo = 49055846290687805589158795284169955186003140166818839775297319448161328190770535718316637707483970867603461316372533744727151938299159549355276552654913927710154241593918902015076315192209259927814405830919750754546429796521409464169008657592288491314559772134501302569826363470684991963998829111760097216407
    oooooooooo = 127936210364424549429821523171517394019980015404715824125177994973005788640383955087499452254735549802030603246825712570014658333047295783286446583948948234379098538102325710783116368091018566261160603678092049794942482571488382808621635324536834018443229997397877174133031157238744716246832002317602389875961
    print(bytes.fromhex(hex(ooooo(ooooooo(oooooooo,oooooooo),oooooooooo))[2:]).decode('utf-8'))

    # print(dis.dis(main))

```

Selanjutnya analisis fungsi tersebut dan diketahui bahwa inti dari kode program tersebut adalah melakukan dekripsi dari algoritma rsa ( pow(c,d,n) ) . Jadi tinggal jalankan kode berikut untuk mendapatkan flag

Next, analyze the function and it is known that the core of the program code is to decrypt the RSA algorithm which is pow(c, d, n). So just run the following code to get the flag

```python
>>> c = 41112103283917454486815351235592327750374606035364044904549786274063940500127292129160130088437242562481317271189704486250001660426794590582864352227824456128689637487544130634094989889803617277872004527925565683665094776622973455646820937787984427925613799066535224419374804782266448060220993813820053243675
>>> d = 49055846290687805589158795284169955186003140166818839775297319448161328190770535718316637707483970867603461316372533744727151938299159549355276552654913927710154241593918902015076315192209259927814405830919750754546429796521409464169008657592288491314559772134501302569826363470684991963998829111760097216407
>>> n = 127936210364424549429821523171517394019980015404715824125177994973005788640383955087499452254735549802030603246825712570014658333047295783286446583948948234379098538102325710783116368091018566261160603678092049794942482571488382808621635324536834018443229997397877174133031157238744716246832002317602389875961
>>> hex(pow(c,d,n))[2:-1].decode('hex')
```

<figure><img src="https://lh7-us.googleusercontent.com/bklhsHdVCdV5FkJCH0FAM7dnIqler3inelzAy7YOTVCEwMRc8DShBX_TZlm5VTpVaATnU1bU9MAWLL-KRSO61s31fS56OkX9L5Dq5yAmwucJGor0i9lfZdlqgFy9q7kgVxOF_qHwU4BjD8Q2iq8Ncg" alt=""><figcaption></figcaption></figure>

Flag : MDT4.0{sekian\_lama\_kamu\_menunggu\_untuk\_kedatanganku}
