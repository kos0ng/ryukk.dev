# Reverse Engineering

<!-- challenge-index: dce3b1f66bdfe656 -->

| Challenge | Topic |
| --- | --- |
| [Void (100 pts)](#void-100-pts) | Whitespace, JavaScript |
| [Yet another crackme (100 pts)](#yet-another-crackme-100-pts) | Xamarin, Android Assemblies |
| [Baby Cracker (100 pts)](#baby-cracker-100-pts) | Constraint Solving, Z3 |
| [Cyp.ress (200 pts)](#cypress-200-pts) | Python Bytecode, AES |
| [Flag Checker (200 pts)](#flag-checker-200-pts) | Input Validation, Brute Force |
| [ISA 101 (200 pts)](#isa-101-200-pts) | Custom ISA, System Calls |
| [Morph (300 pts)](#morph-300-pts) | Code Decompression, Z3 |
| [Black Magic (400 pts) 🥇](#black-magic-400-pts) | CPython Internals, Bytecode Analysis |
| [Bashed! (500 pts)](#bashed-500-pts) | Bash Obfuscation, SHA-1 |

<!-- /challenge-index -->

## Void (100 pts)

### Description

I made a simple webpage that checks whether the flag is correct... Wait, where are the flag-checking functions?

### Solution

Given access to URL <https://c09-void.hkcert24.pwnable.hk/>, take a look on the page source.

&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Ff3ZcmphiqudvlyV5EL5h%2Fimage.png?alt=media&amp;token=1bcc2f5d-7f0a-414a-97e8-28a467a778e6" alt=""><figcaption></figcaption></figure>

Looks like there are a bunch of whitespace and we see some readable code in the end of the HTML

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FW8cEuT9zNqpUqX85oQ5I%2Fimage.png?alt=media&amp;token=ef450f1f-9ae6-4d80-8c78-8b15aaec57b2" alt=""><figcaption></figcaption></figure>

We can see that there is eval(f) in the end, so my assumption is it will exec the javascript code. To get the executed code we can try to change eval to console.log then take a look on console browser.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FGdTnVb1Ok2UJwnO3WMO0%2Fimage.png?alt=media&amp;token=a74b66c3-b82f-4c3b-8ff6-b4515ad211ef" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F9DoNOGWRbV3EOk7yt1h7%2Fimage.png?alt=media&amp;token=86441cf3-f4ef-4702-93d7-5fb9b63b8d38" alt=""><figcaption></figcaption></figure>

Flag: hkcert24{j4v4scr1p7\_1s\_n0w\_alm0s7\_y3t\_4n0th3r\_wh173sp4c3\_pr09r4mm1n9\_l4ngu4g3}

## Yet another crackme (100 pts)

### Description

Yet another crackme. To begin, download the attachment and install it on your android device.

### Solution

Given APK file, decopmile it using JADX-GUI.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FCrhIEborU0HQUMeXgf0I%2Fimage.png?alt=media&amp;token=32736471-896e-465c-a882-2db0c6c4a443" alt=""><figcaption></figcaption></figure>

Looking at the directory structure we found "xamarin", so i assume that it use xamarin as the tech stack. In directory resources from JADX-GUI export, i found that there is assemblies directory that we can utilize to get the Xamarin DLL. Tool that i used to do the unpack is <https://github.com/jakev/pyxamstore>.&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F61u1lXItvAUrp8cX2wqg%2Fimage.png?alt=media&amp;token=18919070-f690-45e5-acf8-5431746788aa" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FGtUjjVoOXtrAPyaLwv7m%2Fimage.png?alt=media&amp;token=7d4f8c72-d0d5-46d7-ba64-75b4e9e81070" alt=""><figcaption></figcaption></figure>

Through the out directory we found that there is CrackMe.dll, open it using dnspy.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F2mI3RlcoaFMsjyDKpcN1%2Fimage.png?alt=media&amp;token=6582aba7-c34c-4264-8f97-4fb5273c7ad3" alt=""><figcaption></figcaption></figure>

In MainPage class there is function onCounterClicked that will call checkFlag function. If the return True it will shows correct flag, so lets take a look on checkFlag function.

```csharp
		private bool checkFlag(string f)
		{
			int[] array = new int[]
			{
				9, 10, 11, 12, 13, 32, 33, 34, 35, 36,
				37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
				47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
				57, 58, 59, 60, 61, 62, 63, 64, 65, 66,
				67, 68, 69, 70, 71, 72, 73, 74, 75, 76,
				77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
				87, 88, 89, 90, 91, 92, 93, 94, 95, 96,
				97, 98, 99, 100, 101, 102, 103, 104, 105, 106,
				107, 108, 109, 110, 111, 112, 113, 114, 115, 116,
				117, 118, 119, 120, 121, 122, 123, 124, 125, 126
			};
			int[] array2 = new int[]
			{
				58, 38, 66, 88, 78, 39, 80, 125, 64, 106,
				48, 49, 98, 32, 42, 59, 126, 93, 33, 56,
				112, 120, 60, 117, 111, 45, 87, 35, 10, 68,
				61, 77, 11, 55, 121, 74, 107, 104, 65, 63,
				46, 110, 34, 41, 102, 97, 81, 12, 47, 51,
				103, 89, 115, 75, 54, 92, 90, 76, 113, 122,
				114, 52, 72, 70, 50, 94, 91, 73, 84, 95,
				36, 82, 124, 53, 108, 101, 9, 13, 44, 96,
				67, 85, 116, 123, 100, 37, 43, 119, 71, 105,
				118, 69, 99, 79, 86, 109, 62, 83, 40, 57
			};
			ulong[] array3 = new ulong[] { 16684662107559623091UL, 13659980421084405632UL, 11938144112493055466UL, 17764897102866017993UL, 11375978084890832581UL, 14699674141193569951UL };
			ulong num = 14627333968358193854UL;
			int num2 = 8;
			Dictionary<int, int> dictionary = new Dictionary<int, int>();
			for (int i = 0; i < array.Length; i++)
			{
				dictionary[array[i]] = array2[i];
			}
			StringBuilder stringBuilder = new StringBuilder();
			foreach (char c in f)
			{
				stringBuilder.Append((char)dictionary[(int)c]);
			}
			int num3 = num2 - f.Length % num2;
			string text = stringBuilder.ToString() + new string('\u0001', num3);
			List<ulong> list = new List<ulong>();
			for (int k = 0; k < text.Length - 1; k += num2)
			{
				ulong num4 = BitConverter.ToUInt64(Encoding.ASCII.GetBytes(text.Substring(k, num2)), 0);
				list.Add(num4);
			}
			List<ulong> list2 = new List<ulong>();
			foreach (ulong num5 in list)
			{
				ulong num6 = num ^ num5;
				list2.Add(num6);
			}
			for (int l = 0; l < array3.Length; l++)
			{
				if (array3[l] != list2[l])
				{
					return false;
				}
			}
			return true;
		}
```

Above code do the following steps

* Create dictionary using static values
* Add padding to the input
* Map the input (char) and append it  to a string builder.
* Convert the input string to integer 8 bytes
* Xor each 8 bytes and compare it

All the process above can be reversed, so the solution is by reversing the algorithm. Below is the script we use to solve the challenge

```python
from Crypto.Util.number import *

array = [9, 10, 11, 12, 13, 32, 33, 34, 35, 36,
				37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
				47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
				57, 58, 59, 60, 61, 62, 63, 64, 65, 66,
				67, 68, 69, 70, 71, 72, 73, 74, 75, 76,
				77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
				87, 88, 89, 90, 91, 92, 93, 94, 95, 96,
				97, 98, 99, 100, 101, 102, 103, 104, 105, 106,
				107, 108, 109, 110, 111, 112, 113, 114, 115, 116,
				117, 118, 119, 120, 121, 122, 123, 124, 125, 126
]

array2 = [58, 38, 66, 88, 78, 39, 80, 125, 64, 106,
				48, 49, 98, 32, 42, 59, 126, 93, 33, 56,
				112, 120, 60, 117, 111, 45, 87, 35, 10, 68,
				61, 77, 11, 55, 121, 74, 107, 104, 65, 63,
				46, 110, 34, 41, 102, 97, 81, 12, 47, 51,
				103, 89, 115, 75, 54, 92, 90, 76, 113, 122,
				114, 52, 72, 70, 50, 94, 91, 73, 84, 95,
				36, 82, 124, 53, 108, 101, 9, 13, 44, 96,
				67, 85, 116, 123, 100, 37, 43, 119, 71, 105,
				118, 69, 99, 79, 86, 109, 62, 83, 40, 57
]

array3 = [16684662107559623091, 13659980421084405632, 11938144112493055466, 17764897102866017993, 11375978084890832581, 14699674141193569951 ]
num = 14627333968358193854

dictionary = {}

for i in range(len(array)):
	dictionary[array2[i]] = array[i]

dictionary[1] = 0


tmp = []
for i in array3:
	tmp.append(long_to_bytes(i ^ num)[::-1])

flag = b""
for i in tmp:
	for j in i:
		flag += bytes([(dictionary[j])])

print(flag)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FAyRQqz5tguGk5bzczzFH%2Fimage.png?alt=media&amp;token=320fb241-4455-4f51-b40f-e85f62b42036" alt=""><figcaption></figcaption></figure>

Flag: hkcert24{f0r3v3r\_r3m3mb3r\_x4m4r1n\_2024-5-1}

## Baby Cracker (100 pts)

### Description

For those who never tried even the simplest reverse, this is for you! Check the guide to experiment how simple reverse works!

For experience player, this is just a simple crackme, not worth your attention, maybe go to solve some 5-stars :)

### Solution

Given ELF file, open it using IDA.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F4V9sn6WQPMK0EXpw2IT1%2Fimage.png?alt=media&amp;token=304dc7c4-f582-46e0-ac8c-8ab53cc669e1" alt=""><figcaption></figcaption></figure>

We can see that there is two validation. First validation is by using arithmetic operator (addition and multiplication) and the second validation is using logic operator (xor). The details of each validation are as follows

* First validation
  * 4 bytes validation, can be solved using z3 or bruteforce
* Second validation
  * 28 bytes validation (flag value after hkcert24{, we know it from the strstr function and haystack\[i+9])
  * Can be solved by reversing the flow (just do the xor)

```python
from z3 import *
import string

def all_smt(s, initial_terms):
    def block_term(s, m, t):
        s.add(t != m.eval(t, model_completion=True))
    def fix_term(s, m, t):
        s.add(t == m.eval(t, model_completion=True))
    def all_smt_rec(terms):
        if sat == s.check():
           m = s.model()
           yield m
           for i in range(len(terms)):
               s.push()
               block_term(s, m, terms[i])
               for j in range(i):
                   fix_term(s, m, terms[j])
               yield from all_smt_rec(terms[i:])
               s.pop()   
    yield from all_smt_rec(list(initial_terms))

a = bytes.fromhex("CE21DB64D150E01B0D3EFB0A522F949DAFB1586B8AEEC1F0FC190AE3E91ED04A62F247A8200BD36C1C1C565B9BB34D3DCE8380C0E67EE809BD14C447A1F62FD1315C1E10D12AE05345FE8558A6AD03CC104BD394FE62854E4A2735E2940F499186D780354C67C3AA3C67E83FE46723DE8E2D462536E1F3907D0FB9148CE7B6A61A9080798535FD518C10E93F32CC4BB542DEF55713C8099B4D1984915F9D773031C7288D1DF471E4D1A30C0759AA0DAD163540B9286AB54C245A8DA6A6C456DDC09BBFCCDE0C5BC175DD77BBF62B431D1303AD73A3AC4DEAA52FC23E4A1AF56572E54A10108CFB100A4D7971F6C7805464B002AAD87C3953ECADB44E2FEBE04700")
b = bytes.fromhex("BD10B650BD35BF787F0A98611F1CCBA9F0D96C05EEACB8989D773CBC812EA0793D8B77DD7F6FE3022B433868A8D7120AA1DCF5F38321DC67DA669B77D3A955E26E3A2E628E5E886236A1E72D91F23293677BBDF0CD10DA7F2C78568AA0382EE1B188B0471304F7C46314DB0CBB134BEFBB722414598390A40969CC7AE29E8C8F69A1ED4DE950A232FE248A547FFF14811DB6C139778A70F32C77B2CE37AD07036EBE18F84290418AE6FC62346ACE529A796A358A4D3581224328D296D49B2CEE9FFD8FBE817833F0068215CEC17472426433C31790DE12DBC370A1567E2D921545BA7A624FEFCF7E553E4A42A9B3E86551EF609BB71E5A6798CBC1204192DA6E00")

flag = b"hkcert24{"
for i in range(28):
    flag += bytes([a[i] ^ b[i]])

haystack = [BitVec("x{}".format(i), 8) for i in range(5)]

s = Solver()

list_char = string.printable[:-6]
for i in haystack:
    s.add(z3.Or(*[ord(j) == i for j in list_char]))

v6 = 5
s.add(haystack[v6 - 1] == ord('}'))
s.add(haystack[v6 - 2] == ord('1'))
s.add(haystack[v6 - 5] + haystack[v6 - 4] + haystack[v6 - 3] == 300)
s.add(2 * haystack[v6 - 5] + haystack[v6 - 4] + 2 * haystack[v6 - 3] == 496)
s.add(haystack[v6 - 5] + 3 * haystack[v6 - 4] + haystack[v6 - 3] == 508 )

for model in all_smt(s, haystack):
    tmp_flag = b""
    for i in haystack:
        try:
            tmp_flag += bytes([model[i].as_long()])
        except Exception as e:
            tmp_flag += b"?"
    print(flag + tmp_flag)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FJoYZ1K5UgmX6ZrwTcv4r%2Fimage.png?alt=media&amp;token=95d11d40-5ef8-4e26-b776-136d0c57fe84" alt=""><figcaption></figcaption></figure>

There are so many valid solution but we still able to guess the actual one.

Flag: hkcert24{s1m4le\_cr4ckM3\_4\_h4ndByhan6\_cha1}

## Cyp.ress (200 pts)

### Description

You will get sser.pyc when you reverse the title. Now reverse it back for me.

### Solution

### Solution

Given pyc file, tried to decompile using pycdc but it failed. Lets use pycdas instead

```python
sser.cpython-312.pyc (Python 3.12)
[Code]
    File Name: sser.py
    Object Name: <module>
    Qualified Name: <module>
    Arg Count: 0
    Pos Only Arg Count: 0
    KW Only Arg Count: 0
    Stack Size: 6
    Flags: 0x00000000
    [Names]
        'os'
        'requests'
        'Crypto.Cipher'
        'AES'
        'hashlib'
        'get_nonce'
        'input'
        'encode'
        'flag'
        'nonce'
        'post'
        'hex'
        'r'
        'bytes'
        'fromhex'
        'text'
        'c0'
        'sha256'
        'digest'
        'key'
        'iv'
        'new'
        'MODE_CFB'
        'cipher'
        'encrypt'
        'c1'
        'print'
    [Locals+Names]
    [Constants]
        0
        None
        (
            'AES'
        )
        [Code]
            File Name: sser.py
            Object Name: get_nonce
            Qualified Name: get_nonce
            Arg Count: 0
            Pos Only Arg Count: 0
            KW Only Arg Count: 0
            Stack Size: 4
            Flags: 0x00000003 (CO_OPTIMIZED | CO_NEWLOCALS)
            [Names]
                'os'
                'urandom'
                'hashlib'
                'sha256'
                'digest'
            [Locals+Names]
                'nonce'
            [Constants]
                None
                16
                b'pow/'
                3
                b'\x00\x00\x00'
            [Disassembly]
                0       RESUME                          0
                2       NOP
                4       LOAD_GLOBAL                     1: NULL + os
                14      LOAD_ATTR                       2: urandom
                34      LOAD_CONST                      1: 16
                36      CALL                            1
                44      STORE_FAST                      0: nonce
                46      LOAD_GLOBAL                     5: NULL + hashlib
                56      LOAD_ATTR                       6: sha256
                76      LOAD_CONST                      2: b'pow/'
                78      LOAD_FAST                       0: nonce
                80      BINARY_OP                       0 (+)
                84      CALL                            1
                92      LOAD_ATTR                       9: digest
                112     CALL                            0
                120     LOAD_CONST                      0: None
                122     LOAD_CONST                      3: 3
                124     BINARY_SLICE
                126     LOAD_CONST                      4: b'\x00\x00\x00'
                128     COMPARE_OP                      40 (==)
                132     POP_JUMP_IF_FALSE               2 (to 138)
                134     LOAD_FAST                       0: nonce
                136     RETURN_VALUE
                138     JUMP_BACKWARD                   68 (to 4)
        'What is the flag?> '
        'https://c12-cypress.hkcert24.pwnable.hk/'
        'nonce'
        (
            'json'
        )
        b'key/'
        16
        b'iv/'
        '🙆🙅'
    [Disassembly]
        0       RESUME                          0
        2       LOAD_CONST                      0: 0
        4       LOAD_CONST                      1: None
        6       IMPORT_NAME                     0: os
        8       STORE_NAME                      0: os
        10      LOAD_CONST                      0: 0
        12      LOAD_CONST                      1: None
        14      IMPORT_NAME                     1: requests
        16      STORE_NAME                      1: requests
        18      LOAD_CONST                      0: 0
        20      LOAD_CONST                      2: ('AES',)
        22      IMPORT_NAME                     2: Crypto.Cipher
        24      IMPORT_FROM                     3: AES
        26      STORE_NAME                      3: AES
        28      POP_TOP
        30      LOAD_CONST                      0: 0
        32      LOAD_CONST                      1: None
        34      IMPORT_NAME                     4: hashlib
        36      STORE_NAME                      4: hashlib
        38      LOAD_CONST                      4: 'What is the flag?> '
        40      CALL_INTRINSIC_1                1 (INTRINSIC_PRINT)
        42      POP_TOP
        44      LOAD_CONST                      3: <CODE> get_nonce
        46      MAKE_FUNCTION                   0
        48      STORE_NAME                      5: get_nonce
        50      PUSH_NULL
        52      LOAD_NAME                       6: input
        54      BUILD_STRING                    0
        56      CALL                            1
        64      LOAD_ATTR                       15: encode
        84      CALL                            0
        92      STORE_NAME                      8: flag
        94      PUSH_NULL
        96      LOAD_NAME                       5: get_nonce
        98      CALL                            0
        106     STORE_NAME                      9: nonce
        108     PUSH_NULL
        110     LOAD_NAME                       1: requests
        112     LOAD_ATTR                       20: post
        132     LOAD_CONST                      5: 'https://c12-cypress.hkcert24.pwnable.hk/'
        134     LOAD_CONST                      6: 'nonce'
        136     LOAD_NAME                       9: nonce
        138     LOAD_ATTR                       23: hex
        158     CALL                            0
        166     BUILD_MAP                       1
        168     KW_NAMES                        7: ('json',)
        170     CALL                            2
        178     STORE_NAME                      12: r
        180     LOAD_NAME                       13: bytes
        182     LOAD_ATTR                       29: fromhex
        202     LOAD_NAME                       12: r
        204     LOAD_ATTR                       30: text
        224     CALL                            1
        232     STORE_NAME                      16: c0
        234     PUSH_NULL
        236     LOAD_NAME                       4: hashlib
        238     LOAD_ATTR                       34: sha256
        258     LOAD_CONST                      8: b'key/'
        260     LOAD_NAME                       9: nonce
        262     BINARY_OP                       0 (+)
        266     CALL                            1
        274     LOAD_ATTR                       37: digest
        294     CALL                            0
        302     LOAD_CONST                      1: None
        304     LOAD_CONST                      9: 16
        306     BINARY_SLICE
        308     STORE_NAME                      19: key
        310     PUSH_NULL
        312     LOAD_NAME                       4: hashlib
        314     LOAD_ATTR                       34: sha256
        334     LOAD_CONST                      10: b'iv/'
        336     LOAD_NAME                       9: nonce
        338     BINARY_OP                       0 (+)
        342     CALL                            1
        350     LOAD_ATTR                       37: digest
        370     CALL                            0
        378     LOAD_CONST                      1: None
        380     LOAD_CONST                      9: 16
        382     BINARY_SLICE
        384     STORE_NAME                      20: iv
        386     PUSH_NULL
        388     LOAD_NAME                       3: AES
        390     LOAD_ATTR                       42: new
        410     LOAD_NAME                       19: key
        412     LOAD_NAME                       3: AES
        414     LOAD_ATTR                       44: MODE_CFB
        434     LOAD_NAME                       20: iv
        436     CALL                            3
        444     STORE_NAME                      23: cipher
        446     LOAD_NAME                       23: cipher
        448     LOAD_ATTR                       49: encrypt
        468     LOAD_NAME                       8: flag
        470     CALL                            1
        478     STORE_NAME                      25: c1
        480     PUSH_NULL
        482     LOAD_NAME                       26: print
        484     LOAD_CONST                      11: '🙆🙅'
        486     LOAD_NAME                       16: c0
        488     LOAD_NAME                       25: c1
        490     COMPARE_OP                      55 (!=)
        494     BINARY_SUBSCR
        498     CALL                            1
        506     POP_TOP
        508     RETURN_CONST                    1: None
```

The algorithm is not complex, so we can easility understand it. The program tried to send nonce to the server then the nonce will be used as the base value for generating key and iv same as in  client side. The generated key and iv will be used to do encryption with AES MODE\_CFB and in the end the ciphertext will be validated with the value from server. So the easy way we can hook the data in request function and AES function.&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FNNLUXZRr3a3lorTHZ6Ts%2Fimage.png?alt=media&amp;token=ebc58bf3-bc48-476c-a694-06d47dcf4ff7" alt=""><figcaption></figcaption></figure>

First, modify code in requests library to printout the ciphertext (flag)

<pre class="language-python" data-title="python3.12/site-packages/requests/api.py"><code class="lang-python">def post(url, data=None, json=None, **kwargs):
    r"""Sends a POST request.

    :param url: URL for the new :class:`Request` object.
    :param data: (optional) Dictionary, list of tuples, bytes, or file-like
        object to send in the body of the :class:`Request`.
    :param json: (optional) A JSON serializable Python object to send in the body of the :class:`Request`.
    :param \*\*kwargs: Optional arguments that ``request`` takes.
    :return: :class:`Response &#x3C;Response>` object
    :rtype: requests.Response
    """
<strong>    res = request("post", url, data=data, json=json, **kwargs)
</strong><strong>    print(res.text)
</strong>    return res
</code></pre>

Second, modufy code in AES to dump the key and iv

<pre class="language-python" data-title="python3.12/site-packages/Crypto/Cipher/AES.py"><code class="lang-python">def new(key, mode, *args, **kwargs):
<strong>    print("key",key)
</strong><strong>    print("mode",mode)
</strong><strong>    print("args",*args)
</strong>    kwargs["add_aes_modes"] = True
    return _create_cipher(sys.modules[__name__], key, mode, *args, **kwargs)
</code></pre>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FZ9fLuIAwabo378YoIrSN%2Fimage.png?alt=media&amp;token=6e228fc6-c65e-48f7-942a-d178410e74ba" alt=""><figcaption></figcaption></figure>

```python
from Crypto.Cipher import AES

ct = bytes.fromhex("9517ef893189dd9eb5bc6d3e83f6fd40bc7f098ac152cb0d313cd174fa937bc70bbe707bf37fc2d4956d7add77a49cf2704c246e072b7a5f5d6331ce2a73146b18")
key = b'f0\nN\x18\xf4\xc7g\x1e\xfe\x9d6%\xf0Zj'
iv = b'\x8e{\x10\xcdl\x987Q\x03S\xc7:\x1b\xe0\xda\xc0'
cipher = AES.new(key, AES.MODE_CFB, iv)
print(cipher.decrypt(ct))
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FS6c6xVKXZU80gj2Ry5lH%2Fimage.png?alt=media&amp;token=7843045c-0e7c-4ee1-a879-7febfbaf443c" alt=""><figcaption></figcaption></figure>

Flag: hkcert24{y0u\_c4n\_h00k\_func710ns\_t0\_35c4p3\_fr0m\_r3v3r5e\_3n9e3r1n9}

## Flag Checker (200 pts)

### Description

Wonton noodles are called 'small minced', rice is called 'handsome', so what was the flag called? Don't worry, I've written a program to help you check if it's right.

### Solution

Given ELF file, open it using IDA.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FgfI2lPIWuGXxd0LBokso%2Fimage.png?alt=media&amp;token=76b0ea8a-edb3-4ebd-82d0-f83875f1b2aa" alt=""><figcaption></figcaption></figure>

Another flag checker, the algorithm should be in sub\_1392.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FaW45GoIXDRVJQme77rpw%2Fimage.png?alt=media&amp;token=8f54a08a-a713-4346-845c-d65f0992c5a2" alt=""><figcaption></figcaption></figure>

The important function is on sub\_12EF, because it will process our input then the return value will be processed by modulo then comparation. Lets take a look on sub\_12EF

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F7XeNuxKlfu1j9GuAJWUy%2Fimage.png?alt=media&amp;token=c626a7b2-ea9e-4bb0-a7b5-e7e2451b4e00" alt=""><figcaption></figcaption></figure>

It looks like multiplication function, we can validate it by changing the argument during debugging.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FpCMIPgrxA3SmCmdsdkdn%2Fimage.png?alt=media&amp;token=43e02b86-d4a7-46df-aab8-9b6794e78707" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FQHRG28EtqhCESci0EZbN%2Fimage.png?alt=media&amp;token=55d2ded7-0217-4b0d-a410-c2158f742eee" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F9u2t2CWS0foMP9LYMflS%2Fimage.png?alt=media&amp;token=6747bf73-c569-46dc-924e-2847cdeb61b5" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FgSCQmXOwn1tNUdChJ57H%2Fimage.png?alt=media&amp;token=eddef4ab-92cc-4525-8c1c-b53b1ba689bb" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FwetGs7zKCMPzWsUtp46b%2Fimage.png?alt=media&amp;token=b3687b1b-20fa-4041-beab-0ab28fff4af2" alt=""><figcaption></figcaption></figure>

Now we know the logic, the next step just recreate the algorithm then brute it. Because it is only 4 bytes so it will not take long times to do bruteforce.

```python
import string
from itertools import product
from Crypto.Util.number import *
import tqdm

unk_4420 = [0xee0f9df9, 0xc4e73ead, 0xd09b50ef, 0x9f758e2b, 0xc7d7db0b, 0x9dbe2a69, 0xe38a352b, 0xca1fffff, 0xf125338f, 0xf5fee2fb, 0xbb5851d7, 0x999b4abd, 0xa1c55209, 0xf4ca133b, 0xe8e26fa5, 0xc32dda41, 0xdd6982fb, 0xfc5f4d91, 0xa0037abb, 0xa113b9dd, 0xc93308f3, 0x9448ea39, 0xb2ff73ad, 0x86c0a263, 0x8b0c8427, 0xe1c1771d, 0xce477441, 0xe86f3df9, 0xec65e2bd, 0xeb800149, 0xa37f8b1d, 0xc7639133]
unk_4020 = [0x89e216c7, 0x8bba1f53, 0xeedac203, 0xa3a18665, 0x94ed1363, 0xf962506f, 0xd9ce8aaf, 0xb1375ea5, 0xb5f3a527, 0x864090e5, 0x8b69129d, 0xe93765cb, 0xe69d6f8f, 0xef102543, 0xbf72b95b, 0xb92fc919, 0xbb5f04b1, 0xd6db2593, 0xaf09d917, 0xe6cacc41, 0xf6e60f6f, 0xc11f4cb5, 0xf7617ab7, 0xfa6a6b91, 0xb45d2387, 0x83e969c3, 0xb21505b3, 0xc7455743, 0xcbbb1795, 0xc5b265ad, 0xd65d3205, 0xef73c749]
unk_4220 = [0x34455a43, 0x1490eb26, 0x72151d59, 0x39ad5153, 0x49f794e0, 0x2cb40abd, 0x80bed156, 0x855cc82f, 0x900b909a, 0x6372d3fd, 0x352d899e, 0x2981bcb2, 0x27b68bfd, 0x64a2dd3a, 0x3db5729d, 0x805016d6, 0x97acee3, 0x17c89862, 0x9f4002a9, 0x9964c05, 0xdb22b70c, 0xba1db04a, 0xc0066755, 0xb3f68f9, 0x899942f8, 0xa10d428, 0x235acde2, 0x679d88d, 0x17e5e57, 0xaab78154, 0x5f922062, 0xa72b4fd]


flag = [b'?' for _ in range(100)]

for i in tqdm.tqdm(product(string.printable[:-6], repeat=4)):
	val = bytes_to_long(''.join(i).encode())
	for j in range(0, len(unk_4420), 2):
		tmp_val = (val * unk_4420[j]) % unk_4020[j]
		if tmp_val in unk_4220:
			index_val = unk_4220.index(tmp_val)
			tmp_val_2 = (val * unk_4420[j+1]) % unk_4020[j+1]
			if tmp_val_2 == unk_4220[index_val + 1]:
				flag[j//2] = ''.join(i).encode()

print(b''.join(flag))
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FzV7HTVcA0mYQQLflzG38%2Fimage.png?alt=media&amp;token=21c10c18-7753-4abe-a860-3701b7a1fc30" alt=""><figcaption></figcaption></figure>

Flag: hkcert24{51mpl3\_l1n34r\_c0n6ru3nc35\_50lv3d\_w17h\_cr7\_65894851}

## ISA 101 (200 pts)

### Description

If you haven't tried our last year's ISA challenges, they are back this year with some changes here and there!

This is a challenge to help you get along with the web interface debug environment, which combines as an debugger, an interpreter and challenge connections!

Check the [step by step guide](https://hackmd.io/@blackb6a/hkcert-ctf-2024-i-en-8381451153faac4a) to see how to use the frontend and explanation of what this really is! You will try out one of the hardcore reversing method: dealing with assembly and understand them directly!

Here is the [full documentation](https://hackmd.io/@blackb6a/bauhinia-isa) if you need more references.

Check out the ISH fullchain series after this!

* Challenge: [https://c58a-ish-1.hkcert24.pwnable.hk?id=3](https://c58a-ish-1.hkcert24.pwnable.hk/?id=3)
* Playground: [https://c58b-ish-2.hkcert24.pwnable.hk?id=1](https://c58b-ish-2.hkcert24.pwnable.hk/?id=1)

### Solution

Given custom asm file, open it using text editor. We can use the playground to debug the program

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FGBERrYVmFiXinCcrRyeo%2Fimage.png?alt=media&amp;token=c36d8e39-f9b5-4706-b251-8ee8e156fe65" alt=""><figcaption></figcaption></figure>

The objective of this challenge is executing flag binary. From the syscall table, we know which one the instruction that receive our input.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FI49itwxPZ87Y0ZgBegrz%2Fimage.png?alt=media&amp;token=110c7fe5-d305-4642-a32d-5eb010b59469" alt=""><figcaption></figcaption></figure>

Set breakpoint on 87 (after syscall input), then analyze until XOR instruction that processed our input.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FYF68OVIAGMbc2V5JVnfh%2Fimage.png?alt=media&amp;token=40a3eeb5-9e2e-4e03-864f-fcddfb6354ad" alt=""><figcaption></figcaption></figure>

From the debugger we can see that our input (stored at R6) will be xored with R7. R7 values originated from R5, lets take a look on value on R5

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FsT8saMss03dXDHQsShhV%2Fimage.png?alt=media&amp;token=3ce0f669-c523-4c97-b8da-b6e39ef20496" alt=""><figcaption></figcaption></figure>

We can also see those values in push instruction on the assembly.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Finzzvy6IarAacfZ7Tezs%2Fimage.png?alt=media&amp;token=51acc8e3-66e1-4192-b621-d4980d9ec25a" alt=""><figcaption></figcaption></figure>

So our input will be xored with those static keys and then will be executed as a command. To generate valid command we just need to do the xor with those static keys, below is our script to generate the valid commands.

```python
from Crypto.Util.number import *
from pwn import xor

a = [0xb146f66e,0x2fd8b7c1,0x95e11585,0xcf39fb28,0xb3accf4c,0xdb22a8cb,0xe21f60cd,0xb660d0fe,0x8be89ec9,0x241bd185,0x161d7e99,0xbf3a7f64,0xea7454ee,0x2e04ce47,0x18b25e16,0x2295643e,0x49f8d91f,0x3f541ea6,0x113d8a6f,0x38726ccc,0x2e27be68,0xd4e398ea,0x7fcba040,0xeec775f5,0x478ff266,0x718a3507,0x536edeba,0xf0efb119,0x9efdd1c2,0x977b4203,0x2ceeda0d,0xfdc086ff,0x2303c15a,0x3c9d30a1,0x193f231b,0x1a06a63f,0x5c829f5,0x49c872b8,0x92bcbdad,0xa9a5a84e,0xb16969c,0xb58b3659,0x642069c9,0x9c37ba69,0x623277a4,0x17b6f65c,0xa6a21506,0x15881c76,0x96ed9c50,0x21226b56,0xd8890218,0xca6eddde,0x9a18e395,0x936f6277,0xaf23d230,0x88d9666a,0xff591d2f,0xce454872,0xf3391e9f,0x4ddd147f,0x404bcc99,0x5becacfd,0x1d9f2f1,0xc833a241]
a = a[::-1]
key = b""
for i in a:
	key += long_to_bytes(i)[::-1]

command = b"ls\x00\x00"
print(xor(command, key[:len(command)]).hex())
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FjjqDGzZcHHhUH3j4WgDv%2Fimage.png?alt=media&amp;token=9fdbac96-6001-4b89-891f-aab4964be4b3" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FK5pG7t6kqi6YtoUjVRG5%2Fimage.png?alt=media&amp;token=85c16d27-3372-48b5-927f-101fb82fc096" alt=""><figcaption></figcaption></figure>

```python
from Crypto.Util.number import *
from pwn import xor

a = [0xb146f66e,0x2fd8b7c1,0x95e11585,0xcf39fb28,0xb3accf4c,0xdb22a8cb,0xe21f60cd,0xb660d0fe,0x8be89ec9,0x241bd185,0x161d7e99,0xbf3a7f64,0xea7454ee,0x2e04ce47,0x18b25e16,0x2295643e,0x49f8d91f,0x3f541ea6,0x113d8a6f,0x38726ccc,0x2e27be68,0xd4e398ea,0x7fcba040,0xeec775f5,0x478ff266,0x718a3507,0x536edeba,0xf0efb119,0x9efdd1c2,0x977b4203,0x2ceeda0d,0xfdc086ff,0x2303c15a,0x3c9d30a1,0x193f231b,0x1a06a63f,0x5c829f5,0x49c872b8,0x92bcbdad,0xa9a5a84e,0xb16969c,0xb58b3659,0x642069c9,0x9c37ba69,0x623277a4,0x17b6f65c,0xa6a21506,0x15881c76,0x96ed9c50,0x21226b56,0xd8890218,0xca6eddde,0x9a18e395,0x936f6277,0xaf23d230,0x88d9666a,0xff591d2f,0xce454872,0xf3391e9f,0x4ddd147f,0x404bcc99,0x5becacfd,0x1d9f2f1,0xc833a241]
a = a[::-1]
key = b""
for i in a:
	key += long_to_bytes(i)[::-1]

command = b"exec printflag_19876bc2\x00"
print(xor(command, key[:len(command)]).hex())
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FRW2hjJf2yTGgOlKbBXlz%2Fimage.png?alt=media&amp;token=9272e166-6ba2-471b-a2f3-2e41fde4afc9" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FbmUT3fAYcuUbsrof2cHJ%2Fimage.png?alt=media&amp;token=8bd439cf-8253-4058-aade-23e8b9323159" alt=""><figcaption></figcaption></figure>

Flag: hkcert24{x0r\_1n\_isa\_r04d\_t0\_fullch41n!!!}

## Morph (300 pts)

### Description

Binary sometimes mixed together, just like fried rice or bibimbap.

### Solution

Given ELF file, open it using IDA.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fo1zLJhkwuW9hU4xJEYAx%2Fimage.png?alt=media&amp;token=39f557f7-e02f-43b0-8db0-62633c5f9824" alt=""><figcaption></figcaption></figure>

From code above we can see that there is decompress function and verify\_\* function. Lets take a look on decompress function

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fmjz4Wz1er4bUyUt54eDv%2Fimage.png?alt=media&amp;token=1ebce0b7-9c78-4a87-bf37-a4c3944d6373" alt=""><figcaption></figcaption></figure>

Then take a look on verify\_0 function

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F8O6pKh3TNThIiCggjEPZ%2Fimage.png?alt=media&amp;token=28915cf0-995a-4522-8e25-9136967612e1" alt=""><figcaption></figcaption></figure>

So decompress function will do xor with key and size based on the argument. After the function has been decompressed it will be called to verify our input. Lets try to apply decryption to verify\_0 to take a look on the logic of input validation.

```python
from idaapi import *
import idc

def patch(addr, length, key):
	for i in range(length):
		val = get_bytes(addr+i, 1)
		new_val = val[0] ^ key
		patch_byte(addr+i, new_val)
	ida_bytes.del_items(addr, 0, length)
	create_insn(addr)
	add_func(addr, addr + length)

def get_val(prev_addr):
	print(prev_addr)
	insn = insn_t()
	k = ""
	size = ""
	verif_addr = ""
	for addr in prev_addr[::-1]:
		tmp = idc.print_operand(addr, 0)
		if tmp == "edx":
			k = int(idc.print_operand(addr, 1).replace("h", ""),16)
			break
		elif tmp == "esi":
			size = int(idc.print_operand(addr, 1).replace("h", ""),16)
		elif tmp == "rax":
			verif_addr = get_name_ea(0, idc.print_operand(addr, 1))
	return verif_addr, size, k



dict = {}
addr = 0x25B07B 
insn = insn_t()
prev_addr = []
final_arr = []
while addr < 0x000000000025BC4B:
	prev_addr.append(addr)
	size = decode_insn(insn, addr)
	tmp = idc.print_operand(addr, 0)
	if "_Z10decompressPcic" ==  tmp:
		print("nice", addr)
		verif_addr, length, k = get_val(prev_addr)
		patch(verif_addr, length, k)
	addr += size
print(final_arr)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FJtf5oqYLF5XbHMGOEUVy%2Fimage.png?alt=media&amp;token=9d452f25-9c8e-4370-b7d8-0d1407e9f070" alt=""><figcaption></figcaption></figure>

The verify function validate several index of our input and looks like there is a pattern that we can use to dump all the constraints. Below is the flow to dump all constraints

* Decrypt the function
* Find constraints format (index and correct value)

```python
from idaapi import *
import idc

def patch(addr, length, key):
	for i in range(length):
		val = get_bytes(addr+i, 1)
		new_val = val[0] ^ key
		patch_byte(addr+i, new_val)
	ida_bytes.del_items(addr, 0, length)
	create_insn(addr)
	add_func(addr, addr + length)

def get_constraints(addr, length):
	arr = []
	start_address = addr
	while start_address < (addr + length):
		print(hex(start_address))
		create_insn(start_address)
		insn = insn_t()
		size = decode_insn(insn, start_address)
		inst = idc.print_insn_mnem(start_address)
		if inst == "mov":
			tmp = idc.print_operand(start_address, 0)
			if tmp == "esi":
				val = idc.print_operand(start_address, 1)
				val = int(val.replace("h", ""),16)
				arr.append(val)
		elif inst == "cmp":
			val = idc.print_operand(start_address, 1)
			val = int(val.replace("h", ""),16)
			arr.append(val)
			break
		start_address += size
	return arr



def get_val(prev_addr):
	print(prev_addr)
	insn = insn_t()
	k = ""
	size = ""
	verif_addr = ""
	for addr in prev_addr[::-1]:
		tmp = idc.print_operand(addr, 0)
		if tmp == "edx":
			k = int(idc.print_operand(addr, 1).replace("h", ""),16)
			break
		elif tmp == "esi":
			size = int(idc.print_operand(addr, 1).replace("h", ""),16)
		elif tmp == "rax":
			verif_addr = get_name_ea(0, idc.print_operand(addr, 1))
	return verif_addr, size, k

dict = {}
addr = 0x25B07B 
insn = insn_t()
prev_addr = []
final_arr = []
while addr < 0x000000000025BC4B:
	prev_addr.append(addr)
	size = decode_insn(insn, addr)
	tmp = idc.print_operand(addr, 0)
	if "_Z10decompressPcic" ==  tmp:
		print("nice", addr)
		verif_addr, length, k = get_val(prev_addr)
		patch(verif_addr, length, k)
		final_arr.append(get_constraints(verif_addr, length))
		prev_addr = []
	addr += size
print(final_arr)
```

After that put the output to z3 format

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FMLUXznAtBjnATYMfju3r%2Fimage.png?alt=media&amp;token=cf67df92-429a-4f66-a8f4-c59bebf9fa6b" alt=""><figcaption></figcaption></figure>

```python
from z3 import *
import string

list_char = string.printable[:-6]

inp = [BitVec("x{}".format(i), 8) for i in range(55)]

data = [[48, 49, 88], [14, 15, 93], [11, 12, 10], [51, 52, 70], [42, 43, 100], [12, 13, 57], [37, 38, 54], [21, 22, 9], [26, 27, 87], [1, 2, 8], [7, 8, 79], [22, 23, 56], [49, 50, 27], [45, 46, 30], [40, 41, 49], [29, 30, 28], [44, 45, 30], [19, 20, 72], [53, 54, 78], [39, 40, 106], [10, 11, 95], [46, 47, 50], [6, 7, 6], [38, 39, 92], [3, 4, 23], [23, 24, 60], [35, 36, 4], [13, 14, 50], [8, 9, 8], [41, 42, 94], [2, 3, 6], [20, 21, 95], [18, 19, 31], [47, 48, 89], [52, 53, 65], [5, 6, 70], [25, 26, 84], [50, 51, 67], [15, 16, 84], [30, 31, 88], [17, 18, 87], [28, 29, 43], [4, 5, 6], [0, 1, 3], [9, 10, 64], [31, 32, 111], [33, 34, 28], [27, 28, 108], [43, 44, 11], [24, 25, 83], [36, 37, 106], [32, 33, 43], [16, 17, 85], [34, 35, 89]]

s = Solver()
for i in data:
	s.add(inp[i[0]] ^ inp[i[1]] == i[2])

for i in inp:
    s.add(z3.Or(*[ord(j) == i for j in list_char]))

known = b"hkcert24{"
for i in range(len(known)):
	s.add(known[i] == inp[i])

s.add(inp[54] == ord('}'))

print(s.check())

model = s.model()

flag = b""
for i in inp:
    try:
    	flag += bytes([model[i].as_long()])
    except Exception as e:
    	flag += b"?"

print(flag)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FFktjNBDhhZ6XzWyP4HfY%2Fimage.png?alt=media&amp;token=8399f76b-6261-4a34-9367-57c00dd71b3c" alt=""><figcaption></figcaption></figure>

Flag: hkcert24{s3lf\_m0d1fy1ng\_c0d3\_th0\_th15\_i5\_n0T\_A\_m4lw4r3}

## Black Magic (400 pts)

### Description

It seems university students often plays Black Magic. It should be the first time tuning (meaning: guessing, telepath, shamanism, mind-reading) for many people.

Many language contains some black magic within. To those python expert: do you really know Python deep within? Time to tune what Python is thinking!

### Solution

Given pyc file with the environment (docker). At first i tried to decompile using pycdc and it failed.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F1OGs3RWnooAr1AIOazWj%2Fimage.png?alt=media&amp;token=f288a9fb-60d3-425c-96d2-89a8fc1cf2c9" alt=""><figcaption></figcaption></figure>

Next, i tried to do disasm using pycdas and it works!

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FWY1co9C19HrmfEw0ChH3%2Fimage.png?alt=media&amp;token=7abf9754-ca1a-45d3-87cf-71ca3fa68d7f" alt=""><figcaption></figcaption></figure>

We can see that it has around 10k lines of code and it would be painful if we just do it statically. During the competition i've an idea to do dump information from several opcode that will be executed. During the competition i did several modification until i found the opcode that give much information.&#x20;

We can see that there is STORE\_DEREF and BINARY\_SUBSCR, STORE\_DEREF basically storing value to variable and BINARY\_SUBSCR is getting i-th value from a variable. I decided to dump the pyobject on those opcodes.

<pre class="language-c" data-title="Python/generated_cases.c.h" data-line-numbers><code class="lang-c">------SNIPPET------
TARGET(BINARY_SUBSCR) {
            PREDICTED(BINARY_SUBSCR);
            static_assert(INLINE_CACHE_ENTRIES_BINARY_SUBSCR == 1, "incorrect cache size");
            PyObject *sub = stack_pointer[-1];
            PyObject *container = stack_pointer[-2];
            PyObject *res;
            
<strong>            PyObject* repr = PyObject_Repr(sub);
</strong><strong>            PyObject* str = PyUnicode_AsEncodedString(repr, "utf-8", "~E~");
</strong><strong>            const char *bytes = PyBytes_AS_STRING(str);
</strong><strong>            printf("\nSUBSCR: %s\n", bytes);
</strong><strong>            Py_XDECREF(repr);
</strong><strong>            Py_XDECREF(str);
</strong>
<strong>            PyObject* repr2 = PyObject_Repr(container);
</strong><strong>            PyObject* str2 = PyUnicode_AsEncodedString(repr2, "utf-8", "~E~");
</strong><strong>            const char *bytes2 = PyBytes_AS_STRING(str2);
</strong><strong>            printf("CONTAINER: %s\n", bytes2);
</strong><strong>            Py_XDECREF(repr2);
</strong><strong>            Py_XDECREF(str2);
</strong>
            #line 403 "Python/bytecodes.c"
            #if ENABLE_SPECIALIZATION
            _PyBinarySubscrCache *cache = (_PyBin
------SNIPPET------        
TARGET(STORE_DEREF) {
            PyObject *v = stack_pointer[-1];

<strong>            PyObject* repr = PyObject_Repr(v);
</strong><strong>            PyObject* str = PyUnicode_AsEncodedString(repr, "utf-8", "~E~");
</strong><strong>            const char *bytes = PyBytes_AS_STRING(str);
</strong><strong>            printf("\nSTORE_DEREF: %s\n", bytes);
</strong><strong>            Py_XDECREF(repr);
</strong><strong>            Py_XDECREF(str);
</strong>
            #line 1471 "Python/bytecodes.c"
            PyObject *cell = GETLOCAL(oparg);
            PyObject *oldobj = PyCell_GET(cell);


            PyCell_SET(cell, v);
            Py_XDECREF(oldobj);
            #line 2001 "Python/generated_cases.c.h"
            STACK_SHRINK(1);
            DISPATCH();
        }
------SNIPPET------
</code></pre>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FelWHDIRR1bT9uezvjUEL%2Fimage.png?alt=media&amp;token=ad5caf89-65f6-4f7b-acde-48a247d67a14" alt=""><figcaption></figcaption></figure>

We see some pattern, string 'input' generated from locals that has been converted to a string such as index 18 == i, index 4 == n, and etc.

Now, we need to find out how those 18,4,45,2,91 values generated. Take a look on the opcode

```python
        0       LOAD_LOCALS
        2       FORMAT_VALUE                    1 (FVC_STR)
        4       BUILD_TUPLE                     0
        6       GET_LEN
        8       SWAP                            2
        10      POP_TOP
        12      UNARY_INVERT
        14      UNARY_NEGATIVE
        16      BUILD_TUPLE                     0
        18      GET_LEN
        20      SWAP                            2
        22      POP_TOP
        24      UNARY_INVERT
        26      UNARY_NEGATIVE
        28      BINARY_OP                       3 (<<)
        32      BUILD_TUPLE                     0
        34      GET_LEN
        36      SWAP                            2
        38      POP_TOP
        40      UNARY_INVERT
        42      UNARY_NEGATIVE
        44      BINARY_OP                       3 (<<)
        48      BUILD_TUPLE                     0
        50      GET_LEN
        52      SWAP                            2
        54      POP_TOP
        56      UNARY_INVERT
        58      UNARY_NEGATIVE
        60      BINARY_OP                       3 (<<)
        64      BUILD_TUPLE                     0
        66      GET_LEN
        68      SWAP                            2
        70      POP_TOP
        72      UNARY_INVERT
        74      UNARY_NEGATIVE
        76      BINARY_OP                       0 (+)
        80      BUILD_TUPLE                     0
        82      GET_LEN
        84      SWAP                            2
        86      POP_TOP
        88      UNARY_INVERT
        90      UNARY_NEGATIVE
        92      BINARY_OP                       3 (<<)
        96      BINARY_SUBSCR
        100     STORE_DEREF                     7 <INVALID>
```

There are several operation such as + and <<. So lets dump the pyobject again.

<pre class="language-c" data-title="Python/generated_cases.c.h" data-line-numbers><code class="lang-c">TARGET(BINARY_OP) {
            PREDICTED(BINARY_OP);
            static_assert(INLINE_CACHE_ENTRIES_BINARY_OP == 1, "incorrect cache size");
            PyObject *rhs = stack_pointer[-1];
            PyObject *lhs = stack_pointer[-2];

<strong>            if(strcmp(Py_TYPE(lhs)->tp_name, "int") == 0 ){
</strong><strong>                PyObject* repr = PyObject_Repr(lhs);
</strong><strong>                PyObject* str = PyUnicode_AsEncodedString(repr, "utf-8", "~E~");
</strong><strong>                const char *bytes = PyBytes_AS_STRING(str);
</strong><strong>                printf("\nLHS: %s\n", bytes);
</strong><strong>                Py_XDECREF(repr);
</strong><strong>                Py_XDECREF(str);
</strong><strong>            }
</strong>
<strong>            if(strcmp(Py_TYPE(rhs)->tp_name, "int") == 0 ){
</strong><strong>                PyObject* repr2 = PyObject_Repr(rhs);
</strong><strong>                PyObject* str2 = PyUnicode_AsEncodedString(repr2, "utf-8", "~E~");
</strong><strong>                const char *bytes2 = PyBytes_AS_STRING(str2);
</strong><strong>                printf("RHS: %s\n", bytes2);
</strong><strong>                Py_XDECREF(repr2);
</strong><strong>                Py_XDECREF(str2);
</strong><strong>            }
</strong>

            PyObject *res;
            #line 3377 "Python/bytecodes.c"
            #if ENABLE_SPECIALIZATION
            _PyBinaryOpCache *cache = (_PyBinaryOpCache *)next_instr;
            if (ADAPTIVE_COUNTER_IS_ZERO(cache->counter)) {
                next_instr--;
                _Py_Specialize_BinaryOp(lhs, rhs, next_instr, oparg, &#x26;GETLOCAL(0));
                DISPATCH_SAME_OPARG();
            }
            STAT_INC(BINARY_OP, deferred);
            DECREMENT_ADAPTIVE_COUNTER(cache->counter);
            #endif  /* ENABLE_SPECIALIZATION */
            assert(0 &#x3C;= oparg);
            assert((unsigned)oparg &#x3C; Py_ARRAY_LENGTH(binary_ops));
            assert(binary_ops[oparg]);
            res = binary_ops[oparg](lhs, rhs);
            #line 4671 "Python/generated_cases.c.h"
            Py_DECREF(lhs);
            Py_DECREF(rhs);
            #line 3392 "Python/bytecodes.c"
            if (res == NULL) goto pop_2_error;
            #line 4676 "Python/generated_cases.c.h"
            STACK_SHRINK(1);
<strong>            printf("OP: %x\n", oparg);
</strong>            stack_pointer[-1] = res;
            next_instr += 1;
            DISPATCH();
        }
-------------------
 TARGET(BINARY_SUBSCR) {
            PREDICTED(BINARY_SUBSCR);
            static_assert(INLINE_CACHE_ENTRIES_BINARY_SUBSCR == 1, "incorrect cache size");
            PyObject *sub = stack_pointer[-1];
            PyObject *container = stack_pointer[-2];
            PyObject *res;
            
            #line 403 "Python/bytecodes.c"
            #if ENABLE_SPECIALIZATION
            _PyBinarySubscrCache *cache = (_PyBinarySubscrCache *)next_instr;
            if (ADAPTIVE_COUNTER_IS_ZERO(cache->counter)) {
                next_instr--;
                _Py_Specialize_BinarySubscr(container, sub, next_instr);
                DISPATCH_SAME_OPARG();
            }
            STAT_INC(BINARY_SUBSCR, deferred);
            DECREMENT_ADAPTIVE_COUNTER(cache->counter);
            #endif  /* ENABLE_SPECIALIZATION */
            res = PyObject_GetItem(container, sub);
            #line 570 "Python/generated_cases.c.h"
            Py_DECREF(container);
            Py_DECREF(sub);
            #line 415 "Python/bytecodes.c"
            if (res == NULL) goto pop_2_error;
            #line 575 "Python/generated_cases.c.h"
            STACK_SHRINK(1);

<strong>            PyObject* repr = PyObject_Repr(res);
</strong><strong>            PyObject* str = PyUnicode_AsEncodedString(repr, "utf-8", "~E~");
</strong><strong>            const char *bytes = PyBytes_AS_STRING(str);
</strong><strong>            printf("\nSUBSCR_RESULT: %s\n", bytes);
</strong><strong>            Py_XDECREF(repr);
</strong><strong>            Py_XDECREF(str);
</strong>
            stack_pointer[-1] = res;
            next_instr += 1;
            DISPATCH();
        }
----------------------
</code></pre>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FPCjZ435cVbr95Hbphghh%2Fimage.png?alt=media&amp;token=53624064-f092-4ea5-abc4-7deffd402f16" alt=""><figcaption></figcaption></figure>

The first BINARY\_SUBSCR result is 'i' and there are 5 operations before the BINARY\_SUBSCR. 4 operations shift left and one operation addition. So we can conclude that 3 is shiftleft and 0 is addition. Now lets examine how value 1 generated.

```python
        32      BUILD_TUPLE                     0
        34      GET_LEN
        36      SWAP                            2
        38      POP_TOP
        40      UNARY_INVERT
        42      UNARY_NEGATIVE
```

Above opcode create value 1 and we can reconstruct it like below code in python

```python
>>> -~(len(()))
1
```

And then for each operation we know that it will process value on top of stack, so basically for the first generated index we can reconstruct like below

```python
>>> (((((1<<1)<<1)<<1)+1)<<1)
18
```

Now we can parse the opcode with this information, but there are another two problem left as below

* my locals() return slightly different value
  * we can use the docker to printout the same locals() like the flag server
* I tried to parse based on BINARY\_OP, FORMAT\_VALUE, and COMPARE\_OP instruction the there are several different pattern
  * there is pattern to generate value 0 like below
    \*

    ```
    <figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fdc9w6XpN5P6JgwAJgRe5%2Fimage.png?alt=media&amp;token=b2eb4dd0-4fe0-439e-a0fc-8ee02b997517" alt=""><figcaption></figcaption></figure>
    ```

    * So i put identifier/new line as BINARY\_OP (??) in the dumped opcode
  * there is pattern to generate value 1 like below
    \*

    ```
    <figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FAO1YP9TOhShTu3VsuC01%2Fimage.png?alt=media&amp;token=a46566e4-e11c-49ef-bb1c-de725cafd7eb" alt=""><figcaption></figcaption></figure>
    ```

    * So i put identifier/new line as BINARY\_OP (?) in the dumped opcode
  * Not all values derived from locals()
    * Some of the opcode contains UNARY\_NOT instruction before FORMAT\_VALUE which means that the value will be derived from "True"
      \*

      ```
      <figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F7cMZNfX877xOdGE75j7S%2Fimage.png?alt=media&amp;token=342d3464-0ca7-419d-a34c-ed7d6baebb71" alt=""><figcaption></figcaption></figure>
      ```
    * If there is no UNARY\_NOT so the value will be derived from "False"

Lets solve the first issue which is printout the locals, change the run.sh in the src directory to below code

```bash
#!/bin/sh

python /app/src/lol.py
```

Create lol.py and put below code (somehow the first&#x20;

```python
input()
print(locals())
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FiXPIQPpREezUaYEzcrYb%2Fimage.png?alt=media&amp;token=36d03ae8-7466-4d49-9850-4f731b01a83c" alt=""><figcaption></figcaption></figure>

Now we have the locals(), change the \_\_file\_\_ value to /app/src/a.pyc and change SourceFileLoader to SourcelessFileLoader. Then create a parser and got the flag

* <https://gist.github.com/kos0ng/910b3e8d78534b1329a78f1330c28119> (dump2.asm)

```python

def conv(arr):
	init = 1
	for j in arr:
		if j == "<<":
			init <<= 1
		elif j == "+":
			init += 1
		elif j == "?":
			init += 0
		elif j == "??":
			init -= 1
	return init



f = open("dump2.asm", "r").read().split("\n")


LOAD_LOCALS = "{'__name__': '__main__', '__doc__': None, '__package__': None, '__loader__': <_frozen_importlib_external.SourcelessFileLoader object at 0x7fffff0ff650>, '__spec__': None, '__annotations__': {}, '__builtins__': <module 'builtins' (built-in)>, '__file__': '/app/src/a.pyc', '__cached__': None}"
UNARY_NOT = "True"
UNARY_NOT_NEG = "False"

# print(len(LOAD_LOCALS))

tmp_opr = []
arr_const = []
var_arr = []
comp_index = []
for i in range(len(f)):
	if "BINARY_OP" in f[i]:
		tmp_opr.append(f[i].split(" ")[-1][1:-1])
	elif "STORE_DEREF" in f[i]:
		if tmp_opr == []:
			continue
		# print(tmp_opr, conv(tmp_opr))
		arr_const.append(conv(tmp_opr))
		tmp_opr = []
	elif "FORMAT_VALUE" in f[i]:
		var_check = (f[i-1].split(" ")[-1])
		if var_check == "UNARY_NOT":
			# print(var_check)
			if "UNARY_NEGATIVE" in f[i-2]:
				var_arr.append("UNARY_NOT_NEG")
			else:
				var_arr.append(var_check)
		else:
			var_arr.append(var_check)
	elif "COMPARE_OP" in f[i]:
		comp_index.append(conv(tmp_opr))
		tmp_opr = []

for i in range(len(var_arr)):
	# print(var_arr[i], arr_const[i])
	if var_arr[i] == "LOAD_LOCALS":
		print(i+1, LOAD_LOCALS[arr_const[i]], var_arr[i] , arr_const[i])
	elif var_arr[i] == "UNARY_NOT":
		print(i+1, UNARY_NOT[arr_const[i]], var_arr[i],  arr_const[i])
	elif var_arr[i] == "UNARY_NOT_NEG":
		print(i+1, UNARY_NOT_NEG[arr_const[i]], var_arr[i],  arr_const[i])
	else:
		# print("UNKNOWN", arr_const[i])
		print(i+1, arr_const[i], var_arr[i])
		# exit()
```

```python
1 i LOAD_LOCALS 18
2 n LOAD_LOCALS 4
3 p LOAD_LOCALS 45
4 u UNARY_NOT 2
5 t LOAD_LOCALS 91
6 h LOAD_LOCALS 278
7 k LOAD_LOCALS 48
8 c LOAD_LOCALS 30
9 e UNARY_NOT 3
10 r UNARY_NOT 1
11 t LOAD_LOCALS 91
12 2 (<<)
13 4 (<<)
14 { LOAD_LOCALS 0
15 u UNARY_NOT 2
16 _ LOAD_LOCALS 2
17 r UNARY_NOT 1
18 _ LOAD_LOCALS 2
19 r UNARY_NOT 1
20 3 (+)
21 4 (<<)
22 l UNARY_NOT_NEG 2
23 _ LOAD_LOCALS 2
24 p LOAD_LOCALS 45
25 y LOAD_LOCALS 267
26 7 (+)
27 h LOAD_LOCALS 278
28 0 (??)
29 n LOAD_LOCALS 4
30 1 (?)
31 c LOAD_LOCALS 30
32 _ LOAD_LOCALS 2
33 b LOAD_LOCALS 94
34 y LOAD_LOCALS 267
35 4 (<<)
36 3 (+)
37 c LOAD_LOCALS 30
38 0 (??)
39 d LOAD_LOCALS 28
40 3 (+)
41 _ LOAD_LOCALS 2
42 m LOAD_LOCALS 6
43 4 (<<)
44 s UNARY_NOT_NEG 3
45 t LOAD_LOCALS 91
46 3 (+)
47 r UNARY_NOT 1
48 } LOAD_LOCALS 191
49 y LOAD_LOCALS 267
50 o LOAD_LOCALS 29
51 u UNARY_NOT 2
52   LOAD_LOCALS 12
53 p LOAD_LOCALS 45
54 a UNARY_NOT_NEG 1
55 s UNARY_NOT_NEG 3
56 s UNARY_NOT_NEG 3
57 e UNARY_NOT 3
58 d LOAD_LOCALS 28
```

Last, just construct the flag

Flag: hkcert24{u\_r\_r34l\_py7h0n1c\_by43c0d3\_m4st3r}

## Bashed! (500 pts)

### Description

The program has only one meaningful function, and the function is less than 500 bytes long. What's hard understanding it?

### Solution

Given .sh file, it is obfuscated and use some emojy as the identifier.

```bash
#!/bin/bash

FLAG=$1
GALF=1

if ! [[ "$FLAG" =~ ^[0-9A-Za-z_{}]{87}$ ]]; then echo 💔; exit 0; fi
function 🌚() { echo $(printf "%d" "'$1"); }
function 🌝() { echo $(printf "%x" "$1"); }
function 🍋() {
    u=$(echo -n ${FLAG:$(($(🌚 $1)-$(🌚 👂))):$(($(🌚 $2)-$(🌚 👂)))} | sha1sum);
    if [[ ${u:1:1} == $(🌝 $(($(🌚 $3)-$(🌚 👂)))) ]];
        then wget https://c22-bashed.hkcert24.pwnable.hk/$4.sh -O $(basename $0) >/dev/null 2>&1; GALF=$((GALF*$(🌚 $6)));
        else wget https://c22-bashed.hkcert24.pwnable.hk/$5.sh -O $(basename $0) >/dev/null 2>&1; GALF=$((GALF*$(🌚 $7)));
    fi;
}
function 👂() { 🍋 $1 $5 $2 $3 $7 $6 $4; }
function 👃() { 🍋 $5 $6 $4 $7 $3 $2 $1; }
function 👄() { 🍋 $5 $6 $2 $4 $3 $1 $7; }
function 👅() { 🍋 $7 $5 $3 $6 $2 $1 $4; }
function 👆() { 🍋 $5 $3 $7 $1 $4 $2 $6; }
function 👇() { 🍋 $6 $3 $2 $1 $7 $5 $4; }
function 👈() { 🍋 $3 $6 $5 $1 $7 $2 $4; }
----------
👜 👧 👌 👂 💕 👅 👶 💆  
👯 👂 👄 👴 👂 👅 👉 👳 \
👾 👑 👃 💈 👠 👮 👼 👳  
👬 👗 👴 👆 👭 👏 👅 👸  
👖 👽 👮 👓 👤 👋 👄 👯 \
👩 👃 💍 👸 👇 👘 👿 👂  
👍 👅 👙 👣 👄 💖 👓 👂  


if [[ "$GALF" -ne 0 ]]; then echo ❤️; else echo 💔; fi
```

To trace the actual code, we can utilize -x argument in bash.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FYLPV4H1XDqxRvsyv7ihq%2Fimage.png?alt=media&amp;token=cc862f27-12b8-49d1-975c-9e96b4090c03" alt=""><figcaption></figcaption></figure>

So the code actually did the process like below

* sha1(input\[x:y]).hexdigest()\[1] == z, return a if true else return b

We can validate it also through sending multiple different flags.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F6hv4mWqkHOIlOOuNBp5d%2Fimage.png?alt=media&amp;token=e4aa8307-fe8c-41d5-ad6b-22095f75afad" alt=""><figcaption></figcaption></figure>

\*above dump is output from the solver script (so ignore the wget because it has been patched to always return true"

```python
>>> import hashlib
>>> hashlib.sha1(b"Gd").hexdigest()[1]
'd'
>>> hashlib.sha1(b"ut").hexdigest()[1]
'7'
```

"Gd" and "ut" is on the same index, which is 47,48. Through analysis by trying to send the first valid comparation, i also found that if the input is correct it will use fifth emoji and if it is wrong it will use the sixth emoji as the downloaded file. For example

```
+ 👚 👣 👺 👅 👳 👱 👄 👂
+ 🍋 👱 👄 👅 👺 👣 👳 👂

if [[ 3 == 3 ]] -> wget https://c22-bashed.hkcert24.pwnable.hk/👺.sh -O tmp.sh
if [[ 4 == 3 ]] -> wget https://c22-bashed.hkcert24.pwnable.hk/👣.sh -O tmp.sh
```

The code downloaded from valid input and invalid input is different, so we need to download the valid file (valid input). To make the program always return a valid code i patch the .sh file to always download the correct file.

<pre class="language-bash" data-line-numbers><code class="lang-bash">if ! [[ "$FLAG" =~ ^[0-9A-Za-z_{}]{87}$ ]]; then echo 💔; exit 0; fi
function 🌚() { echo $(printf "%d" "'$1"); }
function 🌝() { echo $(printf "%x" "$1"); }
function 🍋() {
    u=$(echo -n ${FLAG:$(($(🌚 $1)-$(🌚 👂))):$(($(🌚 $2)-$(🌚 👂)))} | sha1sum);
    if [[ ${u:1:1} == $(🌝 $(($(🌚 $3)-$(🌚 👂)))) ]];
        then wget https://c22-bashed.hkcert24.pwnable.hk/$4.sh -O $(basename $0) >/dev/null 2>&#x26;1; GALF=$((GALF*$(🌚 $6)));
<strong>        else wget https://c22-bashed.hkcert24.pwnable.hk/$4.sh -O $(basename $0) >/dev/null 2>&#x26;1; GALF=$((GALF*$(🌚 $6)));
</strong><strong>    fi;exit;
</strong>}
</code></pre>

* Modify line 8 to get the file same as the correct comparation
* add exit, because we know the process is self replace so we need to do a modification to make the program run continously when we do a patch on each validation process

Now our solver will be looks like below

* patch the program so it will download the correct code
* if the comparation contain more than 1 byte value it will always false, so skip the patch process
* run for 3 different input and create a last script to parse the debug information generated&#x20;

```python
from pwn import *
import os

context.log_level = 'error'

def write_true_exit(prev_data, check_var):
	f = open("tmp.sh", "r").read()
	start = f.index("fi;")
	out_data = f[:start+3] + "exit\n" + f[start+4:]
	target = "wget https://c22-bashed.hkcert24.pwnable.hk/$5.sh -O $(basename $0) >/dev/null 2>&1; GALF=$((GALF*$(🌚 $7)));"

	assert "${u:1:1}" in out_data
	assert target in out_data
	
	print(f"{check_var=}")
	if check_var:
		out_data = out_data.replace(target, "wget https://c22-bashed.hkcert24.pwnable.hk/$4.sh -O $(basename $0) >/dev/null 2>&1; GALF=$((GALF*$(🌚 $6)));")
	
	if prev_data != "":
		tmp_data = out_data.split("\n")
		index_val = ""
		for i in range(103, len(out_data)):
			# print(prev_data)
			if prev_data[:15] in tmp_data[i]:
				length = len(prev_data)
				length += 1
				index_val = i + (length // 16)
				print(length, index_val)
				break
		new_data = '\n'.join(tmp_data[:103])
		new_data += "\n"
		new_data += '\n'.join(tmp_data[index_val:])
		out_data = new_data

	outf = open("tmp.sh", "w")
	outf.write(out_data)
	outf.close()

def check_cmp(prev_data):
	f = open("tmp.sh", "r").read()
	start = f.index("fi;")
	out_data = f[:start+3] + "exit\n" + f[start+4:]
	out_data = out_data.replace("$(basename $0)", "$(basename $0)x")

	if prev_data != "":
		tmp_data = out_data.split("\n")
		index_val = ""
		for i in range(103, len(out_data)):
			# print(prev_data)
			if prev_data[:15] in tmp_data[i]:
				length = len(prev_data)
				length += 1
				index_val = i + (length // 16)
				print(length, index_val)
				break
		new_data = '\n'.join(tmp_data[:103])
		new_data += "\n"
		new_data += '\n'.join(tmp_data[index_val:])
		out_data = new_data

	outf = open("tmp.shx", "w")
	outf.write(out_data)
	outf.close()

def count_cmp(data):
	tmp = data.split(" == ")
	a1 = tmp[0].split("[ ")[-1]
	a2 = tmp[1].split(" ]")[0]
	print("count_cmp",a1, a2)
	if len(a2) > 1:
		return False
	return True


def get_prev(data):
	tmp_data = data.split("\n")
	for j in range(len(tmp_data)):
		if "GALF=" in tmp_data[j]:
			return tmp_data[j+2][2:]

# inp = "hkcert24{0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZQWERTYUIOPASDFG}"
# inp = "}GFDSAPOIUYTREWQZYXWVUTSRQPONMLKJIHGFEDCBAzyxwvutsrqponmlkjihgfedcba9876543210{42treckh"
inp = "C5NnSxm32TPznxXOtS185Pr5sue2VKvNSMEdw{RO7eWYO{nGdHEmE5Klpg81G9IAZVuQkPh3njceH{MrnJryu{w"

debug_data = open("dump", "a")

prev_data = ""
target = 214
for _ in range(target):
	print(_, prev_data)
	check_cmp(prev_data)
	r = process(["bash", "-x", "tmp.shx", inp])
	tmp_debug = r.recvall().decode()
	r.close()

	check_var = count_cmp(tmp_debug)
	
	write_true_exit(prev_data, check_var)
	
	r = process(["bash", "-x", "tmp.sh", inp])
	tmp_debug = r.recvall().decode()
	r.close()
	
	prev_data = get_prev(tmp_debug)
	debug_data.write(tmp_debug)
	print()

debug_data.close()
```

For the last script, it does the following flow

* Parse the data to get the actual index and value compared
* Brute to get the list of possible value (too much possibility)
* Reduce the possibility by check it recursively with the value next to it

```python
import hashlib
from itertools import product
import string


def parse_index_cmp(f, inp):
	cmp_val = []
	inp_val = []

	for i in range(len(f)):
		if "echo -n" in f[i]:
			inp_val.append(f[i].split(" ")[-1].replace("'", ""))
		elif  "==" in f[i]:
			cmp_val.append(f[i].split("==")[-1].split(" ")[1])

	list_index = []
	for i in inp_val:
		index_val = inp.index(i)
		length = len(i)
		list_index.append([index_val, length])
	return list_index, cmp_val

def find_all(target, data):
	arr_index = []
	for i in range(len(data)):
		if target == data[i:i+len(target)]:
			arr_index.append(i)
	return arr_index

def find_intersection(arr1, arr2, arr3):
    set1 = set(arr1)
    set2 = set(arr2)
    set3 = set(arr3)
    result = list(set1.intersection(set2, set3))
    
    return result

def brute_char(tmp_found, length, check_val):
	arr_found = []
	if tmp_found == []:
		for i in product(string.printable[:-6], repeat=length):
			p = ''.join(i).encode()
			tmp_val = hashlib.sha1(p).hexdigest()
			if tmp_val[1] == check_val:
				arr_found.append(p)
	else:
		for p in tmp_found:
			tmp_val = hashlib.sha1(p[:length]).hexdigest()
			if tmp_val[1] == check_val:
				arr_found.append(p)
	return arr_found

def get_flag(arr, target_range):
	for i in range(target_range):
		tmp1 = arr[i]
		tmp2 = arr[i+1]
		new_arr = []
		new_arr_2 = []
		if len(tmp1[0]) != 1:
			for j in tmp1:
				for k in tmp2:
					if check_char(k.decode()):
						if len(tmp1[0]) == 2:
							if j[1] == k[0]:
								if k not in new_arr:
									new_arr.append(k)
								if j not in new_arr_2:
									new_arr_2.append(j)
						elif len(tmp1[0]) == 3:
							if len(tmp2[0]) == 1:
								if j[1] == k[0]:
									if k not in new_arr:
										new_arr.append(k)
									if j not in new_arr_2:
										new_arr_2.append(j)
							else:
								if j[1:3] == k[:2]:
									if k not in new_arr:
										new_arr.append(k)
									if j not in new_arr_2:
										new_arr_2.append(j)
			arr[i+1] = new_arr
			arr[i] = new_arr_2
	return arr

def check_char(target):
	list_char = string.ascii_uppercase + string.digits + string.ascii_lowercase + "_{}"
	return all(c in list_char for c in target)


f = open("dump4", "r").read().split("\n")
inp = "hkcert24{0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZQWERTYUIOPASDFG}"
f2 = open("dump5", "r").read().split("\n")
inp2 = inp[::-1]
f3 = open("dump6", "r").read().split("\n")
inp3 = "C5NnSxm32TPznxXOtS185Pr5sue2VKvNSMEdw{RO7eWYO{nGdHEmE5Klpg81G9IAZVuQkPh3njceH{MrnJryu{w"

list_index_1, cmp_val_1 = parse_index_cmp(f, inp)
list_index_2, cmp_val_2 = parse_index_cmp(f2, inp2)
list_index_3, cmp_val_3 = parse_index_cmp(f3, inp3)

assert cmp_val_1 == cmp_val_2
assert cmp_val_1 == cmp_val_3

fix_list_index = []
for i in range(len(list_index_1)):
	if (list_index_1[i] != list_index_2[i]) or (list_index_2[i] != list_index_3[i]) or (list_index_3[i] != list_index_1[i]):

		val = inp[list_index_1[i][0]:list_index_1[i][0] + list_index_1[i][1]]
		arr_index_1 = find_all(val, inp)

		val = inp2[list_index_2[i][0]:list_index_2[i][0] + list_index_2[i][1]]
		arr_index_2 = find_all(val, inp2)

		val = inp3[list_index_3[i][0]:list_index_3[i][0] + list_index_3[i][1]]
		arr_index_3 = find_all(val, inp3)

		inter = find_intersection(arr_index_1, arr_index_2, arr_index_3)
		if len(inter) != 1:
			print(arr_index_1)
			print(arr_index_2)
			print(arr_index_3)
			exit()
		fix_list_index.append([inter[0], list_index_1[i][1]])
	else:
		fix_list_index.append(list_index_1[i])

d = {}

for i in range(len(fix_list_index)):
	if fix_list_index[i][0] not in d:
		d[fix_list_index[i][0]] = [[fix_list_index[i][1], i]]
	else:
		d[fix_list_index[i][0]].append([fix_list_index[i][1], i])

sorted_d = dict(sorted(d.items()))

all_found = []
for i in range(87):
	tmp_found = []
	for tmp_val in sorted_d[i]:
		if tmp_val[0] == 3:
			if len(cmp_val_1[tmp_val[1]]) == 1:
				tmp_found = brute_char(tmp_found, 3, cmp_val_1[tmp_val[1]])

	for tmp_val in sorted_d[i]:
		if tmp_val[0] == 2:
			if len(cmp_val_1[tmp_val[1]]) == 1:
				tmp_found = brute_char(tmp_found, 2, cmp_val_1[tmp_val[1]])

	for tmp_val in sorted_d[i]:
		if tmp_val[0] == 1:
			if len(cmp_val_1[tmp_val[1]]) == 1:
				tmp_found = brute_char(tmp_found, 1, cmp_val_1[tmp_val[1]])
	all_found.append(tmp_found)

target_range = 86
for _ in range(10):
	all_found = get_flag(all_found, target_range)

for i in all_found:
	print(i)
```

* dump4, dump5, and dump6 is the output from debug file from previous script

```python
[b'hkc']
[b'kce']
[b'cer']
[b'er']
[b'rt2']
[b't2']
[b'24']
[b'4{s']
[b'{s3']
[b's3']
[b'33m']
[b'3m']
[b'm1c', b'm1n', b'm1o', b'm1J', b'mya', b'mNd', b'mNi']
[b'1', b'y', b'N']
[b'n9l']
[b'9ly']
[b'ly']
[b'y_b']
[b'_b3']
[b'b3g']
[b'3g1']
[b'g19']
[b'19n']
[b'9n_']
[b'n_b']
[b'_b4']
[b'b4s']
[b'4sh']
[b'sh_']
[b'h_s']
[b'_sc']
[b'scj', b'scr', b'scE', b'scV']
[b'c']
[b'r1p']
[b'1p']
[b'p7s']
[b'7s_']
[b's_']
[b'_c0']
[b'c0']
[b'0u1']
[b'u1d']
[b'1d_']
[b'd_b']
[b'_b3']
[b'b3_']
[b'3_']
[b'_d4']
[b'd4n']
[b'4n9']
[b'n93']
[b'93r']
[b'3r0', b'3rw', b'3ry', b'3rC']
[b'r']
[b'0us', b'0u{']
[b'us4', b'us_', b'u{d', b'u{D', b'u{T']
[b's', b'{']
[b'_wh']
[b'wh3']
[b'h3']
[b'3n_']
[b'n_7']
[b'_7']
[b'7h3']
[b'h3']
[b'3y_']
[b'y_4']
[b'_4r']
[b'4r3']
[b'r3_']
[b'3_s']
[b'_s3']
[b's3']
[b'3l']
[b'lf_']
[b'f_m']
[b'_m0']
[b'm0d']
[b'0d1']
[b'd1']
[b'1f']
[b'fy1']
[b'y1n']
[b'1n9']
[b'n9d', b'n9e', b'n9i', b'n9n', b'n9o', b'n9p', b'n9H', b'n9X', b'n9}']
[b'9']
[b'q', b'C', b'S', b'T', b'U', b'W', b'/', b'}']
```

Now just reconstruct the flag, it is not hard because the flag is readable .

Flag: hkcert24{s33m1n9ly\_b3g19n\_b4sh\_scr1p7s\_c0u1d\_b3\_d4n93r0us\_wh3n\_7h3y\_4r3\_s3lf\_m0d1fy1n9}
