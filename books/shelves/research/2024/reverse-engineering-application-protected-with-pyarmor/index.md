# Reverse Engineering Application Protected with Pyarmor

Study case pyarmor obfuscation on windows, linux, and macos environment

## Preface

I decided to write about my approach to analyzing application protected with pyarmor. The interesting fact is i've encountered many application protected with pyarmor in windows, linux, macos and i analyze all of them with different approach.&#x20;

## Approaches

| Technique                                | Study Case                                                                                                                    |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Stomping Python Builtin Function**     | [TFCCTF 2024 - McKnight](#study-case-tfcctf-2024-mcknight)                                                                    |
|                                          | [BlackHat MEA 2023 - Can you break the armor?](#study-case-blackhat-mea-2023-can-you-break-the-armor)                         |
|                                          | [Further Exploration #1](#further-exploration-1)                                                                              |
|                                          | [Further Exploration #2](#further-exploration-2)                                                                              |
| **Injecting Python Code during Runtime** | [Flare-On 9 - Challenge 11, Utilizing PyInjector (Windows)](#study-case-flare-on-9-challenge-11-utilizing-pyinjector-windows) |
|                                          | XXXXX, Utilizing PyInjector (Linux)                                                                                           |
| **Modifying Python Executable**          | [TFCCTF 2024 - McKnight, Dumping Object Code](#study-case-tfcctf-2024-mcknight-dumping-object-code)                           |
|                                          | [TFCCTF 2024 - McKnight, Tracing OP\_CODE](#study-case-tfcctf-2024-mcknight-tracing-op_code)                                  |

### Stomping Python Builtin Function

* Tested on: Linux, MacOS, Windows

#### Study Case: TFCCTF 2024 - McKnight

Given python file that run pyarmor, we recognize it from the code

```python
from pytransform import pyarmor_runtime
pyarmor_runtime()
__pyarmor__(__name__, __file__, <DATA>)
```

There are also another files given such as in image below

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2F1TvRnG4jgJByOxYsJhtX%2Fimage.png?alt=media&amp;token=37ad2397-81eb-401f-af51-d6e91f048b54" alt=""><figcaption></figcaption></figure>

When we run the program it will give us output like below

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2FvUIr5Z8dQTuVETeZ2zFK%2Fimage.png?alt=media&amp;token=5964545d-b388-4b92-8c66-af05a42f7ecd" alt=""><figcaption></figcaption></figure>

One of the possible function used by the program to printout the usage string is "print" which is builtin function from python. So basically if we define our print function it will replace the print function used by the program. Lets try with simple code

```python
import pprint

def print(x):
    pprint.pp("[X] Injected : " + x)

code = open('/home/kosong/ctf/tfc/re/mcknight/hasher.py','rb').read()
exec(code)
```

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2F0Ef6kXf75439bTnLvz17%2Fimage.png?alt=media&amp;token=8bb5be94-8677-45c7-b131-73abf28a2d2b" alt=""><figcaption></figcaption></figure>

We can see that we've successfully injected our python code. Now what we can do? since we can inject our python code we can do some information gathering. Lets try with calling global function.

```python
import pprint

def print(x):
    pprint.pp("[X] Injected")
    pprint.pp(globals())

code = open('/home/kosong/ctf/tfc/re/mcknight/hasher.py','rb').read()
exec(code)
```

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2FcxOb8twTj07NVqJlOuvf%2Fimage.png?alt=media&amp;token=4f556f55-c968-447a-aafe-d6fad50525e7" alt=""><figcaption></figcaption></figure>

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2FCaFHANDLkWeozgUKY0GO%2Fimage.png?alt=media&amp;token=232be5ff-3136-46e4-b6bf-6897e3ceafaa" alt=""><figcaption></figcaption></figure>

Know we have information about function and variable available in protected code, lets try to call all of them.

* Call calc\_line function, to see whats argument should be passed (if needed)

```python
import pprint

def print(x):
    pprint.pp("[X] Injected")
    calc_line()

code = open('/home/kosong/ctf/tfc/re/mcknight/hasher.py','rb').read()
exec(code)
```

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2FRpndkYWeRwTvOqlLStgD%2Fimage.png?alt=media&amp;token=c37bf541-da03-4a79-8e5a-eba663b492ee" alt=""><figcaption></figcaption></figure>

* Call hash function, to see whats argument should be passed (if needed)

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2Fbn9slEQPHGy8p8ck8XDb%2Fimage.png?alt=media&amp;token=b8e1cc10-90c4-4f67-b911-21c88e2aa367" alt=""><figcaption></figcaption></figure>

Now we know what argument should be passed, lets try to pass some data based on known information (trial and error will be enough)

```python
import pprint

def print(x):
    pprint.pp("[X] Injected")
    password = "ABCD"
    pprint.pp(calc_line(0, password.encode()))
    pprint.pp(hash(password))

code = open('/home/kosong/ctf/tfc/re/mcknight/hasher.py','rb').read()
exec(code)
```

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2FEVrQLBvZFeodb2gS4D5f%2Fimage.png?alt=media&amp;token=a44abaf9-fa35-408b-a566-c28918f07869" alt=""><figcaption></figcaption></figure>

So using this approach we can call any function inside the protected code, what about getting the "plaintext" code? Lets try using dis

```python
import pprint
import dis

def print(x):
    pprint.pp("[X] Injected")
    pprint.pp(dis.dis(calc_line))

code = open('/home/kosong/ctf/tfc/re/mcknight/hasher.py','rb').read()
exec(code)
```

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2FePoRb5SEOX2aLb7dJOdF%2Fimage.png?alt=media&amp;token=73b245a4-3534-4d21-a88a-2945b925e2a1" alt=""><figcaption></figcaption></figure>

It failed, but if we take a look on the partial disassembled code it looks like still protected with pyarmor. Also the error shown message "IndexError: tuple index out of range", so it looks like something missing with the list of name (wether variable or function). Lets try another approach to disassembly the code, one of the approach we can use is by utilizing function attribute in python which is \`\_\_code\_\_\`.

```python
import pprint
import dis

def print(x):
    pprint.pp("[X] Injected")
    pprint.pp(dis.dis(calc_line.__code__.co_code))

code = open('/home/kosong/ctf/tfc/re/mcknight/hasher.py','rb').read()
exec(code) 
```

```python
'[X] Injected'
          0 JUMP_ABSOLUTE            9 (to 18)
          2 NOP
          4 NOP
    >>    6 POP_BLOCK
          8 LOAD_GLOBAL              4 (4)
         10 CALL_FUNCTION            0
         12 POP_TOP
         14 RETURN_VALUE
         16 NOP
    >>   18 LOAD_GLOBAL              3 (3)
         20 CALL_FUNCTION            0
         22 POP_TOP
         24 NOP
         26 NOP
         28 NOP
         30 SETUP_FINALLY           25 (to 82)
         32 UNPACK_EX               68
         34 BINARY_XOR
         36 <226>                  176
         38 <175>                   61
         40 RAISE_VARARGS          255
         42 ROT_FOUR
         44 DELETE_NAME            244 (244)
         46 <188>                  156
         48 <188>                   25
         50 RAISE_VARARGS          177
         52 MAP_ADD                 72
         54 DELETE_NAME            231 (231)
         56 CONTAINS_OP             70
         58 <37>
         60 <226>                  182
         62 <167>                   60
         64 <225>                  248
         66 <255>                   67
         68 WITH_EXCEPT_START
         70 <236>                  156
         72 <214>                   11
         74 RAISE_VARARGS          176
         76 <168>                   86
         78 DELETE_NAME            228 (228)
         80 JUMP_ABSOLUTE            3 (to 6)
    >>   82 LOAD_GLOBAL              4 (4)
         84 CALL_FUNCTION            0
         86 POP_TOP
         88 RERAISE                  0
         90 RETURN_VALUE
         92 NOP
         94 NOP
         96 NOP
         98 <199>                   31
        100 ROT_THREE
        102 BINARY_OR
        104 GET_ITER
        106 DICT_MERGE              74
        108 ROT_N                   97
        110 <230>                  205
        112 <255>                  192
```

We got output above and it still looks like protected by pyarmor. Until this step we know that direct disassembly will be fail, lets try another approach by enumerating available attribute in python function.

```python
import pprint
import dis

def print(x):
    pprint.pp("[X] Injected")
    pprint.pp(calc_line.__code__.co_varnames)
    pprint.pp(calc_line.__code__.co_names)

code = open('/home/kosong/ctf/tfc/re/mcknight/hasher.py','rb').read()
exec(code)
```

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2FMZKQunI4X3Hyad8L9zlw%2Fimage.png?alt=media&amp;token=286e5b85-217c-40b2-9adc-c9f38801f2f7" alt=""><figcaption></figcaption></figure>

```python
import pprint
import dis

def print(x):
    pprint.pp("[X] Injected")
    pprint.pp(calc_line.__code__.co_consts)
    pprint.pp(hash.__code__.co_consts)

code = open('/home/kosong/ctf/tfc/re/mcknight/hasher.py','rb').read()
exec(code)
```

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2FQcZeVvA9wES5c1O873Zu%2Fimage.png?alt=media&amp;token=d4325415-3544-47ca-9e69-5bec492a218d" alt=""><figcaption></figcaption></figure>

If the code is not much complex we can do educated guess to know the algorithm. For example we know that there is loop in the code and there is usage of coeffs variable.

```python
import pprint
import dis

def print(x):
    pprint.pp("[X] Injected")
    pprint.pp(coeffs)
    for i in range(2):
        pprint.pp(calc_line(i, b"A"))
        pprint.pp(calc_line(i, b"B"))
        pprint.pp(calc_line(i, b"AB"))
        pprint.pp(calc_line(i, b"ABC"))

code = open('/home/kosong/ctf/tfc/re/mcknight/hasher.py','rb').read()
exec(code)
```

```python
[[203, 25, 183, 185, 103, 131, 156, 181, 12, 99, 166, 37, 160, 118, 75, 106, 39],
 [25, 183, 185, 103, 131, 156, 181, 12, 99, 166, 37, 160, 118, 75, 106, 39, 80],
 [183, 185, 103, 131, 156, 181, 12, 99, 166, 37, 160, 118, 75, 106, 39, 80, 1],
 [185, 103, 131, 156, 181, 12, 99, 166, 37, 160, 118, 75, 106, 39, 80, 1, 195],
 [103, 131, 156, 181, 12, 99, 166, 37, 160, 118, 75, 106, 39, 80, 1, 195, 92],
 [131, 156, 181, 12, 99, 166, 37, 160, 118, 75, 106, 39, 80, 1, 195, 92, 142],
 [156, 181, 12, 99, 166, 37, 160, 118, 75, 106, 39, 80, 1, 195, 92, 142, 239],
 [181, 12, 99, 166, 37, 160, 118, 75, 106, 39, 80, 1, 195, 92, 142, 239, 56],
 [12, 99, 166, 37, 160, 118, 75, 106, 39, 80, 1, 195, 92, 142, 239, 56, 84],
 [99, 166, 37, 160, 118, 75, 106, 39, 80, 1, 195, 92, 142, 239, 56, 84, 208],
 [166, 37, 160, 118, 75, 106, 39, 80, 1, 195, 92, 142, 239, 56, 84, 208, 251],
 [37, 160, 118, 75, 106, 39, 80, 1, 195, 92, 142, 239, 56, 84, 208, 251, 219],
 [160, 118, 75, 106, 39, 80, 1, 195, 92, 142, 239, 56, 84, 208, 251, 219, 5],
 [118, 75, 106, 39, 80, 1, 195, 92, 142, 239, 56, 84, 208, 251, 219, 5, 248],
 [75, 106, 39, 80, 1, 195, 92, 142, 239, 56, 84, 208, 251, 219, 5, 248, 172],
 [106, 39, 80, 1, 195, 92, 142, 239, 56, 84, 208, 251, 219, 5, 248, 172, 161],
 [39, 80, 1, 195, 92, 142, 239, 56, 84, 208, 251, 219, 5, 248, 172, 161, 105]]
13195
13398
14845
27106
1625
1650
13703
26098
```

Lets analyze each output

```python
0, A -> 13195 -> 203 * ord('A')
0, B -> 13398 -> 203 * ord('B')
0, AB -> 14845 -> 203 * ord('A') + 25 * ord('B')
0, ABC -> 27106 -> 203 * ord('A') + 25 * ord('B') + 183 * ord('C')
1, A -> 1625 -> 25 * ord('A')
1, B -> 1650 -> 25 * ord('B')
1, AB -> 13703 -> 25 * ord('A') + 183* ord('B')
1, ABC -> 26098 -> 25 * ord('A') + 183* ord('B') + 185 * ord('C')
```

The result from our educated guess is the operation from calc\_line is matrix multiplication so until this step we've been successfully reversed calc\_line function. But what about hash function? it will be harder than calc\_line since it call calc\_line function and again we need to do some educated guess for it.

#### Study Case: BlackHat MEA 2023 - Can you break the armor?

Given python file protected with pyarmor file with directory below

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2FxXGXO4Ozde06scunxPiZ%2Fimage.png?alt=media&amp;token=db60a8a4-ce5b-4c27-8658-e01ed5369fc3" alt=""><figcaption></figcaption></figure>

lf we run run.py it will give nothing, but if we use python run.py with argument it will show the output like below

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2F2XuDs2gOlbqWGIQxN8xR%2Fimage.png?alt=media&amp;token=c127749b-7d01-4adb-9033-befc963dd3f8" alt=""><figcaption></figcaption></figure>

We can see that there is print function also called, so lets stomp it again.

```python
import pprint

def print(x):
    pprint.pp("[X] Injected")
    pprint.pp(globals())
    exit()

code = open('/home/kosong/ctf/bhmea/re/armor/player/run.py','rb').read()
exec(code)
```

Because there is self deletion we need to overcome it by calling exit at first print.&#x20;

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2Fe9LnXcigFVYpF269M7bS%2Fimage.png?alt=media&amp;token=c996ff73-38f5-45c8-89aa-5e585abd3fef" alt=""><figcaption></figcaption></figure>

Looks like there is only main function, because we know that it will be failed if we disassembly the main function because it is protected with pyarmor lets gather some information from \`\_\_code\_\_\`.&#x20;

```python
import pprint
import dis

def print(x):
    pprint.pp("[X] Injected")
    pprint.pp(main.__code__.co_consts)
    exit()

code = open('/home/kosong/ctf/bhmea/re/armor/player/run.py','rb').read()
exec(code)
```

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2FxsuvSuj1pRsnc7x9ywav%2Fimage.png?alt=media&amp;token=7fd7f7cb-b4b2-4fa5-8c20-d6e713bfdb6f" alt=""><figcaption></figcaption></figure>

So looks like there is inner function inside main function, lets try to disassembly those inner functions.

```python
import pprint
import dis

def print(x):
    pprint.pp("[X] Injected")
    pprint.pp(dis.dis(main.__code__.co_consts[5]))
    exit()

code = open('/home/kosong/ctf/bhmea/re/armor/player/run.py','rb').read()
exec(code)
```

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2FFT4vZLrTh2gMsJpr3dRZ%2Fimage.png?alt=media&amp;token=b85445e6-5869-4dfd-a270-8869001c8e66" alt=""><figcaption></figcaption></figure>

Looks like it successfully disassembled, lets loop all the code object.

```python
import pprint
import dis

def print(x):
    pprint.pp("[X] Injected")
    for i in range(100):
        try:
            pprint.pp(dis.dis(main.__code__.co_consts[i]))
        except Exception as e:
            continue
    exit()

code = open('/home/kosong/ctf/bhmea/re/armor/player/run.py','rb').read()
exec(code)
```

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2FOcdLeK7b7PtkFbMzILUA%2Fimage.png?alt=media&amp;token=9d553b34-7ae1-4ff8-a226-04196d4c832b" alt=""><figcaption></figcaption></figure>

Nice, looks like until this step we've been successfully got the flag by disassembling inner function by looking at the constants.&#x20;

#### Further Exploration #1

Because we managed to get inside the protected code we can use the unpacker with `method 2` from this [repository](https://github.com/Svenskithesource/PyArmor-Unpacker/tree/main). If we directly run the code it will failed, but by looking at the structure we can slightly modified the code so it will work with our runner.py

```python
import pprint
import dis
import inspect
import marshal
import os
import struct
import subprocess
import sys
import types
import typing
from functools import wraps
from pathlib import Path

import opcode

LOAD_GLOBAL = opcode.opmap["LOAD_GLOBAL"]
RETURN_OPCODE = opcode.opmap["RETURN_VALUE"].to_bytes(
    2, byteorder="little"
)  # Convert to bytes so it can be added to bytes easier later on
SETUP_FINALLY = opcode.opmap["SETUP_FINALLY"]
EXTENDED_ARG = opcode.opmap["EXTENDED_ARG"]
OPCODE_SIZE = 2  # can differ in older/newer versions
JUMP_FORWARD = opcode.opmap["JUMP_FORWARD"]

# All absolute jumps
JUMP_ABSOLUTE = opcode.opmap.get("JUMP_ABSOLUTE")
CONTINUE_LOOP = opcode.opmap.get("CONTINUE_LOOP")
POP_JUMP_IF_FALSE = opcode.opmap.get("POP_JUMP_IF_FALSE")
POP_JUMP_IF_TRUE = opcode.opmap.get("POP_JUMP_IF_TRUE")
JUMP_IF_FALSE_OR_POP = opcode.opmap.get("JUMP_IF_FALSE_OR_POP")
JUMP_IF_TRUE_OR_POP = opcode.opmap.get("JUMP_IF_TRUE_OR_POP")

absolute_jumps = [
    JUMP_ABSOLUTE,
    CONTINUE_LOOP,
    POP_JUMP_IF_FALSE,
    POP_JUMP_IF_TRUE,
    JUMP_IF_FALSE_OR_POP,
    JUMP_IF_TRUE_OR_POP,
]
# TODO more documentation

code_attrs = [  # ordered correctly by types.CodeType type creation
    "co_argcount",
    "co_posonlyargcount",
    "co_kwonlyargcount",
    "co_nlocals",
    "co_stacksize",
    "co_flags",
    "co_code",
    "co_consts",
    "co_names",
    "co_varnames",
    "co_filename",
    "co_name",
    "co_firstlineno",
    "co_lnotab",
    "co_freevars",
    "co_cellvars",
]

if sys.version_info.major < 3 or (
    sys.version_info.major == 3 and sys.version_info.minor < 8
):
    code_attrs.remove("co_posonlyargcount")

double_jump = (
    True if sys.version_info.major == 3 and sys.version_info.minor >= 10 else False
)


def get_magic():
    if sys.version_info >= (3, 4):
        from importlib.util import MAGIC_NUMBER

        return MAGIC_NUMBER
    else:
        import imp

        return imp.get_magic()


MAGIC_NUMBER = get_magic()


started_exiting = False


def calculate_extended_args(
    arg: int,
):  # This function will calculate the necessary extended_args needed
    """
    EXTENDED_ARG logic:
    - Its opcode shifts left by 8, and adds it to the next opcode
    - There are a maximum of 3 EXTENDED_ARGs for one opcode because
      the first of those will be shifted 3 times for a total of
      24 bits shifted. This fits exactly in the 32-bit integer boundaries.
    """
    extended_args = []
    new_arg = arg
    if arg > 255:
        extended_arg = arg >> 8
        while True:
            if extended_arg > 255:
                extended_args.append(extended_arg & 255)
                extended_arg >>= 8
            else:
                extended_args.append(extended_arg)
                extended_args.reverse() # reverse because we appended in the order
                                        # of most recent EXTENDED_ARG (the one closest to
                                        # the actual opcode) to the least recent EXTENDED_ARG
                                        # (the one farthest from the actual opcode)
                break

        new_arg = arg & 255
    return extended_args, new_arg


def execute_code_obj(obj: types.CodeType):
    def a():
        pass

    a.__code__ = obj

    number_of_regular_arguments = obj.co_argcount
    if sys.version_info.major > 3 or (
        sys.version_info.major == 3 and sys.version_info.minor > 7
    ):
        args = [i for i in range(obj.co_posonlyargcount)]
        number_of_regular_arguments -= obj.co_posonlyargcount
    else:
        args = []

    kwargs = {obj.co_varnames[-i]: i for i in range(obj.co_kwonlyargcount)}
    args.extend([i for i in range(number_of_regular_arguments - obj.co_kwonlyargcount)])

    try:
        a(*args, **kwargs)
    except:
        pass


def find_first_opcode(co: bytes, op_code: int):
    for i in range(0, len(co), 2):
        if co[i] == op_code:
            return i
    raise ValueError("Could not find the opcode")


def get_arg_bytes(co: bytes, op_code_index: int) -> bytearray:
    """
    This function calculate the argument of a call while considering the EXTENDED_ARG opcodes that may come before that
    """
    result = bytearray()
    result.append(co[op_code_index + 1])

    checked_opcode = op_code_index - 2
    while checked_opcode >= 0 and co[checked_opcode] == EXTENDED_ARG:
        result.insert(0, co[checked_opcode + 1])
        checked_opcode -= 2
    return result


def calculate_arg(co: bytes, op_code_index: int) -> int:
    return int.from_bytes(get_arg_bytes(co, op_code_index), "big")

def get_flags(flags):
    names = []
    for i in range(32):
        flag = 1<<i
        if flags & flag:
            names.append(flag)
            flags ^= flag
            if not flags:
                break

    return names

def flag_to_num(flags, exclude=[]):
    real = 0
    for flag in flags:
        if flag not in exclude:
            real ^= flag

    return real

def remove_async(flags: int) -> int:
    flag_lst = get_flags(flags)
    return flag_to_num(flag_lst, [128, 256, 512]) # all coroutine flags

def handle_under_armor(obj: types.CodeType):
    # TODO make handling EXTENDED_ARG a function
    i = find_first_opcode(obj.co_code, JUMP_FORWARD)
    jumping_arg = i + calculate_arg(obj.co_code, i)
    if double_jump:
        jumping_arg *= 2

    load_armor = jumping_arg + find_first_opcode(obj.co_code[jumping_arg:], LOAD_GLOBAL)

    pop_index = load_armor + 4

    obj = copy_code_obj(
        obj,
        co_code=obj.co_code[:pop_index] + RETURN_OPCODE + obj.co_code[pop_index + 2 :],
    )
    old_freevars = obj.co_freevars
    old_flags = obj.co_flags

    obj = copy_code_obj(obj, co_freevars=(), co_flags=remove_async(old_flags))

    try:
        execute_code_obj(obj)
    except Exception as e:
        pprint.pp(e)

    obj = copy_code_obj(obj, co_code=obj.co_code, co_freevars=old_freevars, co_flags=old_flags)

    new_names = tuple(n for n in obj.co_names if n != "__armor__")
    return copy_code_obj(obj, co_code=obj.co_code[:jumping_arg], co_names=new_names)


def output_code(obj):
    if isinstance(obj, types.CodeType):
        obj = copy_code_obj(
            obj,
            co_names=tuple(output_code(name) for name in obj.co_names),
            co_varnames=tuple(output_code(name) for name in obj.co_varnames),
            co_freevars=tuple(output_code(name) for name in obj.co_freevars),
            co_cellvars=tuple(output_code(name) for name in obj.co_cellvars),
            co_consts=tuple(output_code(name) for name in obj.co_consts),
        )

        # TODO I think there is a bug here because the prints are really weird.
        if "pytransform" in obj.co_freevars:
            #  obj.co_name not in ["<lambda>", 'check_obfuscated_script', 'check_mod_pytransform']:
            pass
        elif "__armor__" in obj.co_names:
            # TODO I don't know when a function uses __armor__ but we should find it and add tests
            obj = handle_under_armor(obj)

        elif "__armor_enter__" in obj.co_names:
            obj = handle_armor_enter(obj)
        else:
            pass
    return obj


def handle_armor_enter(obj: types.CodeType):

    load_enter_function = b"".join(
        i.to_bytes(1, byteorder="big")
        for i in [LOAD_GLOBAL, obj.co_names.index("__armor_enter__")]
    )
    pop_top_start = obj.co_code.find(load_enter_function) + 4

    load_exit_function = b"".join(
        i.to_bytes(1, byteorder="big")
        for i in [LOAD_GLOBAL, obj.co_names.index("__armor_exit__")]
    )
    fake_exit = obj.co_code.find(load_exit_function) - 2

    new_code = (
        obj.co_code[:pop_top_start] + RETURN_OPCODE + obj.co_code[pop_top_start + 2 :]
    )  # replace the pop_top after __pyarmor_enter__ to return
    old_freevars = obj.co_freevars
    old_flags = obj.co_flags

    obj = copy_code_obj(obj, co_code=new_code, co_freevars=(), co_flags=remove_async(old_flags))

    try:
        execute_code_obj(obj)
    except Exception as e:
        pprint.pp(e)

    obj = copy_code_obj(obj, co_code=obj.co_code, co_freevars=old_freevars, co_flags=old_flags)
    names = tuple(
        n for n in obj.co_names if not n.startswith("__armor")
    )  # remove the pyarmor functions
    raw_code = obj.co_code

    try_start = find_first_opcode(obj.co_code, SETUP_FINALLY)

    size = calculate_arg(obj.co_code, try_start)
    if double_jump:
        size *= 2
    raw_code = raw_code[: try_start + size]

    raw_code = raw_code[try_start + 2 :]
    raw_code += (
        RETURN_OPCODE  # add return # TODO this adds return none to everything? what?
    )

    raw_code = bytearray(raw_code)
    i = 0
    while i < len(raw_code):
        op = raw_code[i]
        if op in absolute_jumps:
            argument = calculate_arg(raw_code, i)

            while raw_code[i-2] == EXTENDED_ARG: # Remove the preceding extended arguments, we add our custom ones later on
                raw_code.pop(i-2) # opcode
                raw_code.pop(i-2) # arguments

                i -= 2
                op = raw_code[i]

            if double_jump:
                argument *= 2

            if argument == fake_exit:
                raw_code[i] = opcode.opmap[
                    "RETURN_VALUE"
                ]  # Got to use this because the variable is converted to bytes
                continue

            new_arg = argument - (try_start + 2)

            extended_args, new_arg = calculate_extended_args(new_arg)

            for extended_arg in extended_args:
                raw_code.insert(i, EXTENDED_ARG)
                raw_code.insert(
                    i + 1, extended_arg if not double_jump else extended_arg // 2
                )
                i += 2

            raw_code[i + 1] = new_arg if not double_jump else new_arg // 2

        i += 2

    raw_code = bytes(raw_code)

    return copy_code_obj(obj, co_names=names, co_code=raw_code)


def _pack_uint32(val):
    """Convert integer to 32-bit little-endian bytes"""
    return struct.pack("<I", val)


def code_to_bytecode(code, mtime=0, source_size=0):
    """
    Serialise the passed code object (PyCodeObject*) to bytecode as a .pyc file
    The args mtime and source_size are inconsequential metadata in the .pyc file.
    """

    # Add the magic number that indicates the version of Python the bytecode is for
    #
    # The .pyc may not decompile if this four-byte value is wrong. Either hardcode the
    # value for the target version (eg. b'\x33\x0D\x0D\x0A' instead of MAGIC_NUMBER)
    # or see trymagicnum.py to step through different values to find a valid one.
    data = bytearray(MAGIC_NUMBER)

    # Handle extra 32-bit field in header from Python 3.7 onwards
    # See: https://www.python.org/dev/peps/pep-0552
    if sys.version_info >= (3, 7):
        # Blank bit field value to indicate traditional pyc header
        data.extend(_pack_uint32(0))

    data.extend(_pack_uint32(int(mtime)))

    # Handle extra 32-bit field for source size from Python 3.2 onwards
    # See: https://www.python.org/dev/peps/pep-3147/
    if sys.version_info >= (3, 2):
        data.extend(_pack_uint32(source_size))

    data.extend(marshal.dumps(code))

    return data


def orig_or_new(func):
    sig = inspect.signature(func)
    kwarg_params = list(sig.parameters.keys())

    @wraps(func)
    def wrapee(orig, **kwargs):
        binding = sig.bind_partial(**kwargs)
        new_kwargs = binding.arguments
        for k in kwarg_params:
            if k not in new_kwargs:
                new_kwargs[k] = getattr(orig, k)
        return func(**new_kwargs)

    # add the original_object to the signature of the function
    orig_params = list(sig.parameters.values())
    orig_params.insert(
        0, inspect.Parameter("original_object", inspect.Parameter.POSITIONAL_ONLY)
    )
    sig.replace(parameters=orig_params)
    wrapee.__signature__ = sig
    return wrapee


def array_to_params(names_array):
    return [
        inspect.Parameter(name, inspect.Parameter.KEYWORD_ONLY, default=None)
        for name in names_array
    ]


def sig_from_array(names_array):
    def decor(f):
        sig = inspect.Signature(parameters=array_to_params(names_array))

        @wraps(f)
        def wrappe(**kwargs):
            bound = sig.bind(**kwargs)
            bound.apply_defaults()
            return f(**bound.kwargs)

        wrappe.__signature__ = sig
        return wrappe

    return decor


@orig_or_new
@sig_from_array(code_attrs)
def copy_code_obj(**kwargs):
    """
    create a copy of code object with different paramters.
    If a parameter is None then the default is the previous code object values
    """
    args = [kwargs[name] for name in code_attrs]
    return types.CodeType(*args)


def marshal_to_pyc(file_path: typing.Union[str, Path], code: types.CodeType):
    file_path = str(file_path)
    pyc_code = code_to_bytecode(code)
    with open(file_path, "wb") as f:
        f.write(pyc_code)


def print(x):
    pprint.pp("[X] Injected")
    for frame in sys._current_frames().values(): # runner.py
        frame = frame.f_back # <frozen>
    code = frame.f_code
    code = output_code(code)
    pprint.pp(code.co_filename)
    filename = code.co_filename.replace("<frozen ", "").replace(">", "")
    pprint.pp(filename)
    if filename.endswith(".pyc"):
        pass
    elif filename.endswith(".py"):
        filename += "c"
    else:
        filename += ".pyc"
    pprint.pp(filename)
    DUMP_DIR = Path("./dump")
    DUMP_DIR.mkdir(exist_ok=True)
    marshal_to_pyc(DUMP_DIR / filename, code)

tmp = open('/home/kosong/ctf/tfc/re/mcknight/hasher.py','rb').read()
exec(tmp)
```

Run code above and we will get dump/hasher.pyc, then use pycdc to decompile the code.

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2FuIwYqmZSqtj87Kntf3c0%2Fimage.png?alt=media&amp;token=c180d8f7-497c-47db-82e2-049259718c52" alt=""><figcaption></figcaption></figure>

```python
# Source Generated with Decompyle++
# File: hasher.pyc (Python 3.10)

import sys
import lzma
FLAG_LEN = 17

nums = [ 203, 99, 1, 219, 19, 54, 46, 170, 180, 120, 22, 249, 236, 87, 27, 223, 81, 252, 232, 66, 241, 61, 235, 40, 217, 74, 145, 196, 7, 131, 75, 56, 105, 134, 48, 49, 149, 127, 73, 65, 70, 45, 53, 121, 198, 193, 207, 138, 32, 0, 132, 122, 10, 210, 189, 44, 164, 25, 166, 195, 5, 47, 157, 20, 119, 247, 199, 97, 152, 14, 148, 124, 123, 36, 30, 76, 58, 192, 110, 178, 175, 202, 155, 23, 50, 168, 156, 106, 84, 186, 197, 95, 140, 79, 43, 15, 244, 125, 205, 3, 234, 212, 13, 182, 233, 255, 71, 163, 254, 150, 26, 90, 33, 109, 183, 37, 92, 248, 167, 9, 173, 91, 107, 133, 253, 88, 31, 220, 153, 83, 55, 141, 62, 101, 28, 242, 112, 52, 89, 6, 17, 135, 211, 181, 39, 208, 209, 85, 158, 69, 137, 229, 93, 231, 226, 41, 114, 42, 215, 108, 68, 77, 18, 177, 246, 191, 64, 86, 190, 218, 102, 185, 160, 142, 172, 171, 237, 238, 245, 59, 146, 213, 151, 113, 139, 144, 230, 143, 98, 8, 194, 29, 221, 115, 34, 82, 11, 57, 78, 214, 12, 80, 251, 111, 184, 162, 224, 201, 4, 206, 204, 227, 38, 169, 130, 67, 116, 128, 35, 187, 51, 216, 126, 96, 147, 72, 100, 174, 103, 118, 239, 161, 188, 129, 240, 222, 16, 24, 243, 228, 165, 2, 200, 225, 104, 60, 21, 159, 117, 94, 176, 154, 250, 63, 179, 136]

def generator(cnt):
    coeffs = []
    for i in range(cnt):
        aux = []
        for j in range(cnt):
            aux.append(nums[(i + j) * 1337 % 256])
        coeffs.append(aux)
    return coeffs

coeffs = generator(FLAG_LEN)

def calc_line(k, password):
    rez = 0
    for i in range(len(password)):
        rez += password[i] * coeffs[k][i]
    return rez


def hash(password):
    password = password.encode()
    rez = []
    for i in range(FLAG_LEN):
        rez.append(calc_line(i, password))
    final = []
    for k in range(FLAG_LEN):
        aux = 0
        for i in range(FLAG_LEN):
            aux += coeffs[i][i] * rez[k] ** i
        final.append(aux)
    data = 'X'.join((lambda .0: [ str(i) for i in .0 ])(final))
    data = lzma.compress(data.encode())
    return data


def protect_pytransform():
    import pytransform
    
    def assert_builtin(func):
        type = ''.__class__.__class__
        builtin_function = type(''.join)
        if type(func) is not builtin_function:
            raise RuntimeError('%s() is not a builtin' % func.__name__)

    
    def check_obfuscated_script():
[1]    41468 segmentation fault  /Users/kosong/tools/pycdc/pycdc hasher.pyc
```

#### Further Exploration #2

After taking a look on method 3, this approach basically did the same approach with method 3 but by utilizing builtin function called by the protected code instead of hooking marshal.loads using sysaudit.

### Injecting Python Code during Runtime

* Tested on: Windows

#### Study Case: Flare-On 9 - Challenge 11, Utilizing PyInjector (Windows)

For this approach we can use method 2 from this [repository](https://github.com/Svenskithesource/PyArmor-Unpacker/tree/main). &#x20;

#### Study Case: XXXXX, Utilizing PyInjector (Linux)

#### Study Case: XXXXX, Utilizing PyInjector (MacOS x64)

#### Study Case: XXXXX, Utilizing PyInjector (MacOS aarch64)

**---To Be Updated---**

### Modifying Python Executable

* Tested on: Linux

#### Study Case: TFCCTF 2024 - McKnight, Dumping Object Code

#### Study Case: TFCCTF 2024 - McKnight, Tracing OP\_CODE

**---To Be Updated---**

## Conclusion

**---To Be Updated---**

## References

* <https://github.com/Svenskithesource/PyArmor-Unpacker/tree/main>
* <https://github.com/levanvn/FLARE-ON9-Chal11_Unpacking-Pyarmor?tab=readme-ov-file>
