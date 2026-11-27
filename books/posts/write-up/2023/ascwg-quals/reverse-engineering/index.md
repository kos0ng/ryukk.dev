# Reverse Engineering

<!-- challenge-index: 8ddbefe5d6c9da8c -->

| Challenge | Topic |
| --- | --- |
| [Amber (600 pts)](#amber-600-pts) | Anti-Debugging, RC4 |
| [Awaken (900 pts)](#awaken-900-pts) | Assembly, Bytewise Brute Force |
| [Guess The Flag (900 pts)](#guess-the-flag-900-pts) | ELF Initialization, GDB |

<!-- /challenge-index -->

## Amber (600 pts)

### Description

\-

### Solution

Given PE file, open it using IDA.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fhm8tnA1qFKXYbwdWVb0Q%2Fimage.png?alt=media&amp;token=cef6a16d-ed37-4029-a31b-7d8a9472002c" alt=""><figcaption></figcaption></figure>

Main function not detected, but it still easy to find since start function is common start function.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FkRPb8EQfo7sg6xt8hLV1%2Fimage.png?alt=media&amp;token=5bc4808a-ca78-4035-ab94-568437856791" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FvkeXV2UaPaxGSNDv5q6r%2Fimage.png?alt=media&amp;token=37748418-44dd-4d4e-abf6-5447f39b35ab" alt=""><figcaption></figcaption></figure>

So sub\_401530 is main function, set breakpoint on that function. Set breakpoint at 0x0040165F and step instruction to enter the function.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FYQJxhsGFR0LVZFjRBUwJ%2Fimage.png?alt=media&amp;token=fef9c243-7074-4e49-8896-e11722c6af7e" alt=""><figcaption></figcaption></figure>

* call near ptr unk\_1E7210
  \*

  ```
  <figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FZ6LAkd3OfEFkmUEhALFr%2Fimage.png?alt=media&amp;token=a5338431-1c6c-4fbf-b966-32904927e605" alt=""><figcaption></figcaption></figure>
  ```

  * edx+4 == 0x1e000d
    * So function unk\_1E7210 do self modification by doing some operation such as substract, xor, rol, and add.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FIl96Ey5jsS5FnMM2ew2H%2Fimage.png?alt=media&amp;token=44d4a6ce-bfb8-4da5-81d8-59b7e99cb5e7" alt=""><figcaption></figcaption></figure>

From image above we can see that the code is different after mov edi,edi. Lets disassemble again code after mov edi,edi by pressing c on address 0x1e000d.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FMPkvEQk1fBr32TIju80l%2Fimage.png?alt=media&amp;token=73baacc0-52d8-4795-89aa-89664889adb8" alt=""><figcaption></figcaption></figure>

Continue the process by stepping instruction we will get into looping at 0x1e0028.&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FUa05lH7kwKDHxoRFy6mz%2Fimage.png?alt=media&amp;token=14677767-9e48-4fe1-8d11-d8e82ec1194f" alt=""><figcaption></figcaption></figure>

Loop instruction will do looping until ecx is 0. So we can said that it will overwrite value until 0x1e0029 (edx + 0x17). If we set breakpoint on those address the debugger will error, so the idea is set hardware breakpoint on 0x1e002a and continue the process.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FKlzi8aH4G1Vhjg1F1a5W%2Fimage.png?alt=media&amp;token=5a8dd16c-a044-4fe0-a1b4-e1b1dc7f68af" alt=""><figcaption></figcaption></figure>

Now the values start from 0x1e002a are different again.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FySN4GJhAPzWhO282naig%2Fimage.png?alt=media&amp;token=0d013415-b290-405e-990d-309c50ee887e" alt=""><figcaption></figcaption></figure>

Scrolling down i saw valid PE file, dump it using IDC.

```c
auto fname      = "C:\\Users\\Intel NUC\\ctf\\ascwg\\amber\\dump_pe.exe";
auto address    = 0x01E0031;
auto size       = 0x71df;
auto file= fopen(fname, "wb");

savefile(file, 0, address, size);
fclose(file);
```

dump\_pe.exe actually a valid PE and consist of some functions but since it written dynamically there are some imported function not detected. So i choose to continue current debugginer. Disassemble code again and do step instruction again.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FHvtbskjbBOalbwYTGIJL%2Fimage.png?alt=media&amp;token=4412a46b-ef11-41a8-a0d4-5c731a56b4c9" alt=""><figcaption></figcaption></figure>

Continue the process until call near ptr unk\_1e7031.&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FlwvlFk9nPVA9vjtzacpk%2Fimage.png?alt=media&amp;token=72d3ad27-c534-4962-8ba7-c51f11398291" alt=""><figcaption></figcaption></figure>

* sub\_1E717C: resolve function based on hash value

After manually check what function called, here is the summary

```nasm
debug078:001E7059 call    sub_1E717C      ; virtual alloc, 2C39DFECh
debug078:001E70D9 call    sub_1E7143      ; LoadLibrary, 0E2E6A091h
debug078:001E70E3 call    sub_1E70F1      ; GetProcAddress, 0A18B0B38h
```

Next, set breakpoint on last instruction on sub\_1F7033 (0x01F7177).

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FnriuwH5tZohNn7HtiHTs%2Fimage.png?alt=media&amp;token=198c9433-e799-4f8e-9152-4e61273694bd" alt=""><figcaption></figcaption></figure>

Step into sub\_1f71fd again and set breakpoint on 0x01F720E.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fco8UgMNNL2ayO5vaVfuz%2Fimage.png?alt=media&amp;token=f5c8ffb7-fe95-4aa2-9f09-c6f5da3f82f7" alt=""><figcaption></figcaption></figure>

Step into on call edi and do step over so we will not get into call unk\_7FE71CB2.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FmCf0fMzZRPkkqpnQqy9B%2Fimage.png?alt=media&amp;token=b8a17adf-851c-4f88-b8eb-5e0d8465a05f" alt=""><figcaption></figcaption></figure>

Now we are on start function of new executable sub\_7FE71737.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fz0Eg5cfgzRo4fRy1bg91%2Fimage.png?alt=media&amp;token=b3249eab-3f48-4d16-8c8d-a8f1d649cac6" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F6mhMow6SvJWERBZ27viO%2Fimage.png?alt=media&amp;token=cfeab92f-d036-4e8b-b3fa-c786244f1487" alt=""><figcaption></figcaption></figure>

Again, we can find which one main function by manually validating it.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fl93JfBkru7DQOtDNAIsr%2Fimage.png?alt=media&amp;token=4954e78a-2d6a-4cc0-8f04-7e5e1d299d0a" alt=""><figcaption></figcaption></figure>

Set breakpoint on new main function then continue the program.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fhgvyd3ncoYRLgcfu8RNz%2Fimage.png?alt=media&amp;token=0d799062-4a35-44e9-8a8e-f753589b2aeb" alt=""><figcaption></figcaption></figure>

Rename all function. Original function name can be found by double click the address.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FQfMmqV8tQyA5FjJMifnU%2Fimage.png?alt=media&amp;token=4f6d5e1a-5f79-4ae0-9327-75ae1b1aa1e4" alt=""><figcaption></figcaption></figure>

{% code title="main function" %}

```c
int sub_7FE7134E()
{
  char v0; // bl
  int v1; // ebx
  char v2; // al
  int CurrentProcess; // eax
  int LibraryW; // eax
  int (__stdcall *v5)(int, char *); // edi
  int (__stdcall *ProcAddress)(int, _DWORD, int *, int, int *); // esi
  int v7; // eax
  char v8; // al
  void (__stdcall *v9)(wchar_t *, _DWORD); // esi
  int v10; // eax
  void (__stdcall *v11)(int); // esi
  int CurrentThread; // eax
  char v13; // al
  unsigned int v14; // kr00_4
  unsigned __int64 v15; // rax
  unsigned __int64 v16; // rax
  void (__thiscall *func_kernel32_QueryPerformanceCounter)(int, __int64 *); // esi
  int v18; // ecx
  bool v19; // sf
  bool v20; // cc
  int (__thiscall *func_kernel32_GetTickCount)(int); // esi
  char v22; // al
  int TickCount; // edi
  int v24; // ecx
  _BYTE *ciphertext; // [esp+30h] [ebp-80h]
  int v27[6]; // [esp+34h] [ebp-7Ch] BYREF
  __int64 v28; // [esp+4Ch] [ebp-64h] BYREF
  __int64 v29; // [esp+54h] [ebp-5Ch] BYREF
  int v30; // [esp+5Ch] [ebp-54h] BYREF
  int v31; // [esp+60h] [ebp-50h] BYREF
  int length[4]; // [esp+64h] [ebp-4Ch] BYREF
  char v33; // [esp+74h] [ebp-3Ch]
  char v34; // [esp+75h] [ebp-3Bh]
  int v35; // [esp+76h] [ebp-3Ah]
  char v36; // [esp+7Ah] [ebp-36h]
  int v37; // [esp+7Bh] [ebp-35h]
  int v38; // [esp+7Fh] [ebp-31h]
  int v39; // [esp+83h] [ebp-2Dh]
  int v40; // [esp+87h] [ebp-29h]
  int v41; // [esp+8Bh] [ebp-25h]
  int v42; // [esp+8Fh] [ebp-21h]
  __int16 v43; // [esp+93h] [ebp-1Dh]
  int key; // [esp+98h] [ebp-18h] BYREF
  int key2; // [esp+9Ch] [ebp-14h]
  int key3; // [esp+A0h] [ebp-10h]
  int key4; // [esp+A4h] [ebp-Ch]
  __int16 key5; // [esp+A8h] [ebp-8h]

  ciphertext = (_BYTE *)ucrtbase_malloc_(192);
  length[0] = 0x966FB0FA;
  length[1] = 0xEA1A5D26;
  key2 = 0;
  length[2] = 0xB957D429;
  length[3] = 0xBC71485;
  v33 = 0x64;
  key3 = 0;
  v35 = 0xD90954E9;
  v37 = 0x3A6DBCD1;
  v38 = 0xA9C0CC4D;
  key4 = 0;
  v39 = 0x309EAB99;
  v40 = 0x443FF4C2;
  v41 = 0xE914B72D;
  key5 = 0;
  v0 = 0x63;
  v34 = 0x1E;
  v36 = 0x63;
  v42 = 0x37317856;
  v43 = 0xEA;
  v31 = 0;
  key = (unsigned __int8)(102 - (kernel32_IsDebuggerPresent_() != 0));
  if ( (unsigned __int8)*(_DWORD *)&NtCurrentPeb()->BeingDebugged )
    v0 = 50;
  BYTE1(key) = v0;
  v1 = 0;
  v31 = 0;
  v2 = 102;
  if ( (NtCurrentPeb()->NtGlobalFlag & 0x70) != 0 )
    v2 = 97;
  v31 = 0;
  BYTE2(key) = v2;
  CurrentProcess = kernel32_GetCurrentProcess_();
  kernel32_CheckRemoteDebuggerPresent_(CurrentProcess, &v31);
  v30 = 0;
  HIBYTE(key) = (v31 != 0) + 48;
  memset(v27, 0, sizeof(v27));
  LibraryW = kernel32_LoadLibraryW_(aNtdllDll);
  v5 = (int (__stdcall *)(int, char *))kernel32_GetProcAddress_;
  if ( LibraryW != -1
    && LibraryW
    && (ProcAddress = (int (__stdcall *)(int, _DWORD, int *, int, int *))kernel32_GetProcAddress_(
                                                                           LibraryW,
                                                                           aNtqueryinforma)) != 0 )
  {
    v7 = kernel32_GetCurrentProcess_();
    if ( ProcAddress(v7, 0, v27, 24, &v30) >= 0 && v27[1] )
      v8 = (*(_BYTE *)(v27[1] + 2) == 0) + 54;
    else
      v8 = (char)ciphertext;
  }
  else
  {
    v8 = 0;
  }
  v9 = (void (__stdcall *)(wchar_t *, _DWORD))user32_FindWindowW_;
  LOBYTE(key2) = v8;
  user32_FindWindowW_(aX86, 0);
  v9(aId, 0);
  BYTE1(key2) = 49;
  v10 = kernel32_LoadLibraryW_(aNtdllDll);
  if ( v10 != -1 && v10 && (v11 = (void (__stdcall *)(int))v5(v10, aNtsetinformati)) != 0 )
  {
    CurrentThread = kernel32_GetCurrentThread_(17, 0, 0);
    v11(CurrentThread);
    v13 = 50;
  }
  else
  {
    v13 = 0;
  }
  BYTE2(key2) = v13;
  HIBYTE(key2) = anti_debug_1();
  v14 = __readeflags();
  LOBYTE(key3) = ((v14 & 0x100) == 0) + 51;
  v15 = __rdtsc();
  HIDWORD(v28) = HIDWORD(v15);
  v30 = v15;
  v16 = __rdtsc();
  HIDWORD(v29) = HIDWORD(v16);
  v31 = v16;
  func_kernel32_QueryPerformanceCounter = (void (__thiscall *)(int, __int64 *))kernel32_QueryPerformanceCounter_;
  BYTE1(key3) = ((int)v16 - v30 <= (int)&unk_10000) + 56;
  kernel32_QueryPerformanceCounter_(&v28);
  func_kernel32_QueryPerformanceCounter(-16 * v18, &v29);
  v19 = (((unsigned __int64)(v29 - v28) >> 32) & 0x80000000) != 0i64;
  v20 = v29 < v28 || (unsigned __int64)(v29 - v28) >> 32 == 0;
  HIDWORD(v29) = (unsigned __int64)(v29 - v28) >> 32;
  if ( !v19 && (!v20 || (unsigned int)(v29 - v28) > 0x1E) )
    v1 = 1;
  func_kernel32_GetTickCount = (int (__thiscall *)(int))kernel32_GetTickCount_;
  v22 = 98;
  if ( !v1 )
    v22 = 52;
  BYTE2(key3) = v22;
  TickCount = kernel32_GetTickCount_(v14);
  HIBYTE(key3) = (unsigned int)(func_kernel32_GetTickCount(-16 * v24) - TickCount) > 0x1E ? 99 : 101;
  LOBYTE(key4) = func_closehandle();
  BYTE1(key4) = return_const_1();
  BYTE2(key4) = return_const_2();
  HIBYTE(key4) = return_const_3();
  LOBYTE(key5) = return_const_4();
  return RC4((const char *)&key, (int)length, ciphertext);
}
```

{% endcode %}

{% code title="func\_closehandle" %}

```nasm
debug078:7FE7109A sub_7FE7109A    proc near               ; CODE XREF: sub_7FE7134E+29E↓p
debug078:7FE7109A ; __unwind { // sub_7FE71F70
debug078:7FE7109A                 push    8
debug078:7FE7109C                 push    offset unk_7FE73598
debug078:7FE710A1                 call    sub_7FE71F70
debug078:7FE710A6                 xor     esi, esi
debug078:7FE710A8 ;   __try { // __except at 7FE710BC
debug078:7FE710A8                 mov     [ebp-4], esi
debug078:7FE710AB                 push    0BEEFh          ; hObject
debug078:7FE710B0                 call    CloseHandle_
debug078:7FE710B6                 jmp     short loc_7FE710C2
debug078:7FE710B8 ; ---------------------------------------------------------------------------
debug078:7FE710B8 ;   __except filter // owned by 7FE710A8
debug078:7FE710B8                 xor     eax, eax
debug078:7FE710BA                 inc     eax
debug078:7FE710BB                 retn
debug078:7FE710BC ; ---------------------------------------------------------------------------
debug078:7FE710BC ;   __except(7FE710B8) // owned by 7FE710A8
debug078:7FE710BC                 mov     esp, [ebp-18h]
debug078:7FE710BF                 xor     esi, esi
debug078:7FE710C1                 inc     esi
debug078:7FE710C1 ;   } // starts at 7FE710A8
debug078:7FE710C2
debug078:7FE710C2 loc_7FE710C2:                           ; CODE XREF: sub_7FE7109A+1C↑j
debug078:7FE710C2                 mov     dword ptr [ebp-4], 0FFFFFFFEh
debug078:7FE710C9                 xor     eax, eax
debug078:7FE710CB                 test    esi, esi
debug078:7FE710CD                 setnz   al
debug078:7FE710D0                 add     eax, 64h ; 'd'
debug078:7FE710D3                 mov     ecx, [ebp-10h]
debug078:7FE710D6                 mov     large fs:0, ecx
debug078:7FE710DD                 pop     ecx
debug078:7FE710DE                 pop     edi
debug078:7FE710DF                 pop     esi
debug078:7FE710E0                 pop     ebx
debug078:7FE710E1                 leave
debug078:7FE710E2                 retn
```

{% endcode %}

{% code title="return\_const\_1" %}

```nasm
debug078:7FE710E3 ; __unwind { // sub_7FE71F70
debug078:7FE710E3                 push    8
debug078:7FE710E5                 push    offset unk_7FE735B8
debug078:7FE710EA                 call    sub_7FE71F70
debug078:7FE710EF                 xor     eax, eax
debug078:7FE710F1                 inc     eax
debug078:7FE710F2 ;   __try { // __except at 7FE71103
debug078:7FE710F2                 and     dword ptr [ebp-4], 0
debug078:7FE710F6                 pushf
debug078:7FE710F7                 or      [esp+0Ch+var_B], 1
debug078:7FE710FC                 popf
debug078:7FE710FD                 jmp     short loc_7FE71108
debug078:7FE710FF ; ---------------------------------------------------------------------------
debug078:7FE710FF ;   __except filter // owned by 7FE710F2
debug078:7FE710FF                 xor     eax, eax
debug078:7FE71101                 inc     eax
debug078:7FE71102                 retn
debug078:7FE71103 ; ---------------------------------------------------------------------------
debug078:7FE71103 ;   __except(7FE710FF) // owned by 7FE710F2
debug078:7FE71103                 mov     esp, [ebp-18h]
debug078:7FE71106                 xor     eax, eax
debug078:7FE71106 ;   } // starts at 7FE710F2
debug078:7FE71108
debug078:7FE71108 loc_7FE71108:                           ; CODE XREF: sub_7FE710E3+1A↑j
debug078:7FE71108                 mov     dword ptr [ebp-4], 0FFFFFFFEh
debug078:7FE7110F                 neg     eax
debug078:7FE71111                 sbb     eax, eax
debug078:7FE71113                 add     eax, 33h ; '3'
debug078:7FE71116                 mov     ecx, [ebp-10h]
debug078:7FE71119                 mov     large fs:0, ecx
debug078:7FE71120                 pop     ecx
debug078:7FE71121                 pop     edi
debug078:7FE71122                 pop     esi
debug078:7FE71123                 pop     ebx
debug078:7FE71124                 leave
debug078:7FE71125                 retn
```

{% endcode %}

{% code title="return\_const\_2" %}

```nasm
debug078:7FE71126 sub_7FE71126    proc near               ; CODE XREF: sub_7FE7134E+2AE↓p
debug078:7FE71126 ; __unwind { // sub_7FE71F70
debug078:7FE71126                 push    8
debug078:7FE71128                 push    offset unk_7FE735D8
debug078:7FE7112D                 call    sub_7FE71F70
debug078:7FE71132                 xor     ecx, ecx
debug078:7FE71134                 inc     ecx
debug078:7FE71135 ;   __try { // __except at 7FE71140
debug078:7FE71135                 and     dword ptr [ebp-4], 0
debug078:7FE71139                 int     3               ; Trap to Debugger
debug078:7FE7113A                 jmp     short loc_7FE71145
debug078:7FE7113C ; ---------------------------------------------------------------------------
debug078:7FE7113C ;   __except filter // owned by 7FE71135
debug078:7FE7113C                 xor     eax, eax
debug078:7FE7113E                 inc     eax
debug078:7FE7113F                 retn
debug078:7FE71140 ; ---------------------------------------------------------------------------
debug078:7FE71140 ;   __except(7FE7113C) // owned by 7FE71135
debug078:7FE71140                 mov     esp, [ebp-18h]
debug078:7FE71143                 xor     ecx, ecx
debug078:7FE71143 ;   } // starts at 7FE71135
debug078:7FE71145
debug078:7FE71145 loc_7FE71145:                           ; CODE XREF: sub_7FE71126+14↑j
debug078:7FE71145                 mov     dword ptr [ebp-4], 0FFFFFFFEh
debug078:7FE7114C                 xor     eax, eax
debug078:7FE7114E                 test    ecx, ecx
debug078:7FE71150                 setnz   al
debug078:7FE71153                 add     eax, 61h ; 'a'
debug078:7FE71156                 mov     ecx, [ebp-10h]
debug078:7FE71159                 mov     large fs:0, ecx
debug078:7FE71160                 pop     ecx
debug078:7FE71161                 pop     edi
debug078:7FE71162                 pop     esi
debug078:7FE71163                 pop     ebx
debug078:7FE71164                 leave
debug078:7FE71165                 retn
```

{% endcode %}

{% code title="return\_const\_3" %}

```nasm
debug078:7FE711AC sub_7FE711AC    proc near               ; CODE XREF: sub_7FE7134E+2B6↓p
debug078:7FE711AC ; __unwind { // sub_7FE71F70
debug078:7FE711AC                 push    8
debug078:7FE711AE                 push    offset unk_7FE73618
debug078:7FE711B3                 call    sub_7FE71F70
debug078:7FE711B8                 xor     ecx, ecx
debug078:7FE711BA                 inc     ecx
debug078:7FE711BB ;   __try { // __except at 7FE711C8
debug078:7FE711BB                 and     dword ptr [ebp-4], 0
debug078:7FE711BF                 int     2Dh             ; Windows NT - debugging services: eax = type
debug078:7FE711C1                 nop
debug078:7FE711C2                 jmp     short loc_7FE711CD
debug078:7FE711C4 ; ---------------------------------------------------------------------------
debug078:7FE711C4 ;   __except filter // owned by 7FE711BB
debug078:7FE711C4                 xor     eax, eax
debug078:7FE711C6                 inc     eax
debug078:7FE711C7                 retn
debug078:7FE711C8 ; ---------------------------------------------------------------------------
debug078:7FE711C8 ;   __except(7FE711C4) // owned by 7FE711BB
debug078:7FE711C8                 mov     esp, [ebp-18h]
debug078:7FE711CB                 xor     ecx, ecx
debug078:7FE711CB ;   } // starts at 7FE711BB
debug078:7FE711CD
debug078:7FE711CD loc_7FE711CD:                           ; CODE XREF: sub_7FE711AC+16↑j
debug078:7FE711CD                 mov     dword ptr [ebp-4], 0FFFFFFFEh
debug078:7FE711D4                 push    33h ; '3'
debug078:7FE711D6                 pop     eax
debug078:7FE711D7                 push    31h ; '1'
debug078:7FE711D9                 pop     edx
debug078:7FE711DA                 test    ecx, ecx
debug078:7FE711DC                 cmovnz  eax, edx
debug078:7FE711DF                 mov     ecx, [ebp-10h]
debug078:7FE711E2                 mov     large fs:0, ecx
debug078:7FE711E9                 pop     ecx
debug078:7FE711EA                 pop     edi
debug078:7FE711EB                 pop     esi
debug078:7FE711EC                 pop     ebx
debug078:7FE711ED                 leave
debug078:7FE711EE                 retn
```

{% endcode %}

{% code title="return\_const\_4" %}

```nasm
debug078:7FE71126 sub_7FE71126    proc near               ; CODE XREF: sub_7FE7134E+2AE↓p
debug078:7FE71126 ; __unwind { // sub_7FE71F70
debug078:7FE71126                 push    8
debug078:7FE71128                 push    offset unk_7FE735D8
debug078:7FE7112D                 call    sub_7FE71F70
debug078:7FE71132                 xor     ecx, ecx
debug078:7FE71134                 inc     ecx
debug078:7FE71135 ;   __try { // __except at 7FE71140
debug078:7FE71135                 and     dword ptr [ebp-4], 0
debug078:7FE71139                 int     3               ; Trap to Debugger
debug078:7FE7113A                 jmp     short loc_7FE71145
debug078:7FE7113C ; ---------------------------------------------------------------------------
debug078:7FE7113C ;   __except filter // owned by 7FE71135
debug078:7FE7113C                 xor     eax, eax
debug078:7FE7113E                 inc     eax
debug078:7FE7113F                 retn
debug078:7FE71140 ; ---------------------------------------------------------------------------
debug078:7FE71140 ;   __except(7FE7113C) // owned by 7FE71135
debug078:7FE71140                 mov     esp, [ebp-18h]
debug078:7FE71143                 xor     ecx, ecx
debug078:7FE71143 ;   } // starts at 7FE71135
debug078:7FE71145
debug078:7FE71145 loc_7FE71145:                           ; CODE XREF: sub_7FE71126+14↑j
debug078:7FE71145                 mov     dword ptr [ebp-4], 0FFFFFFFEh
debug078:7FE7114C                 xor     eax, eax
debug078:7FE7114E                 test    ecx, ecx
debug078:7FE71150                 setnz   al
debug078:7FE71153                 add     eax, 61h ; 'a'
debug078:7FE71156                 mov     ecx, [ebp-10h]
debug078:7FE71159                 mov     large fs:0, ecx
debug078:7FE71160                 pop     ecx
debug078:7FE71161                 pop     edi
debug078:7FE71162                 pop     esi
debug078:7FE71163                 pop     ebx
debug078:7FE71164                 leave
debug078:7FE71165                 retn
```

{% endcode %}

```c
int __fastcall RC4(const char *key, int length, _BYTE *ciphertext)
{
  signed int v3; // esi
  int v4; // edi
  int i; // eax
  int v6; // ecx
  unsigned __int8 v7; // bl
  int v10; // [esp+18h] [ebp-108h]
  char keystream[256]; // [esp+1Ch] [ebp-104h] BYREF

  v3 = strlen(key);
  v4 = 0;
  for ( i = 0; i < 256; ++i )
    keystream[i] = i;
  v6 = 0;
  v10 = 0;
  do
  {
    v7 = keystream[v6];
    v4 = (v7 + key[v6 % v3] + v4) % 256;
    keystream[v10] = keystream[v4];
    v6 = v10 + 1;
    keystream[v4] = v7;
    v10 = v6;
  }
  while ( v6 < 256 );
  RC4_enc((int)keystream, length, ciphertext);
  return 0;
}
```

Function func\_closehandle, return\_const\_1 - return\_const\_4 basically do try catch with anti debug mechanism. The possibility of the value returned only two, if there is no exception will be A and if there is exception will be B. So we can conclude that it is possible to brute it. At the end we need to find the correct key and ciphertext to get the flag through RC4 decryption. Because there are so many anti debug check, the easy way to solve it just by bruteforcing all possibility (key, key2, key3, key4, key5). key-key5 actually one key (contiguous memory location/no null byte between variable location), it divided to 5 variables because decompiler mechanism.&#x20;

```python
from Crypto.Cipher import ARC4
from itertools import product

list_key = [[] for i in range(17)]

# key
list_key[0] = [0x66, 0x65]
list_key[1] = [0x63, 0x32]
list_key[2] = [0x66, 0x61]
list_key[3] = [0x30, 0x31]

# key2
list_key[4] = [0x36, 0x37]
list_key[5] = [0x31]
list_key[6] = [0x32, 0x0]
list_key[7] = [0x62, 0x61]

# key3
list_key[8] = [0x33, 0x34]
list_key[9] = [0x38, 0x39]
list_key[10] = [0x62, 0x34]
list_key[11] = [0x63, 0x65]

# key4
list_key[12] = [0x64, 0x65]
list_key[13] = [0x33, 0x34]
list_key[14] = [0x61, 0x62]
list_key[15] = [0x31, 0x33]

# key5
list_key[16] = [0x61, 0x62]

ct = "FA B0 6F 96 26 5D 1A EA 29 D4 57 B9 85 14 C7 0B 64 1E E9 54 09 D9 63 D1 BC 6D 3A 4D CC C0 A9 99 AB 9E 30 C2 F4 3F 44 2D B7 14 E9 56 78 31 37 EA"
ct = [int(i, 16) for i in ct.split(" ")] 
ct = bytes(ct)

for i in product(*list_key):
	tmp_key = bytes(i)
	cipher = ARC4.new(bytes(tmp_key))
	pt = cipher.decrypt(ct)
	if b"ASCWG" in pt:
		print(tmp_key, pt)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FkCybiKRSwjA2t3aHIDmT%2Fimage.png?alt=media&amp;token=32dd03c5-665e-4947-b49b-01ca87f57a79" alt=""><figcaption></figcaption></figure>

Flag: ASCWG{What\_A\_ReverseEngineering\_Beast\_13337\_-\_-}

## Awaken (900 pts)

### Description

Given assembly code below

```nasm
.LC0:
        .string "Enter The Flag:"
.LC1:
        .string "%s"
.LC2:
        .string "Wrong Flag"
.LC3:
        .string "Correct Flag"
flag_check():
        push    rbp
        mov     rbp, rsp
        sub     rsp, 464
        mov     QWORD PTR [rbp-112], 0
        mov     QWORD PTR [rbp-104], 0
        mov     QWORD PTR [rbp-96], 0
        mov     QWORD PTR [rbp-88], 0
        mov     QWORD PTR [rbp-80], 0
        mov     QWORD PTR [rbp-72], 0
        mov     QWORD PTR [rbp-64], 0
        mov     QWORD PTR [rbp-56], 0
        mov     QWORD PTR [rbp-48], 0
        mov     QWORD PTR [rbp-40], 0
        mov     QWORD PTR [rbp-32], 0
        mov     QWORD PTR [rbp-24], 0
        mov     DWORD PTR [rbp-16], 0
        mov     edi, OFFSET FLAT:.LC0
        call    puts
        lea     rax, [rbp-112]
        mov     rsi, rax
        mov     edi, OFFSET FLAT:.LC1
        mov     eax, 0
        call    __isoc99_scanf
        movabs  rax, -871222578553387942
        movabs  rdx, -3456440840989770153
        mov     QWORD PTR [rbp-368], rax
        mov     QWORD PTR [rbp-360], rdx
        movabs  rax, -6917285895965957581
        movabs  rdx, 2096695603964784419
        mov     QWORD PTR [rbp-352], rax
        mov     QWORD PTR [rbp-344], rdx
        movabs  rax, 4501421280245125089
        movabs  rdx, -5989732096912246845
        mov     QWORD PTR [rbp-336], rax
        mov     QWORD PTR [rbp-328], rdx
        movabs  rax, -7641474145812966946
        movabs  rdx, 5943263215614115999
        mov     QWORD PTR [rbp-320], rax
        mov     QWORD PTR [rbp-312], rdx
        movabs  rax, 3346881274156629838
        movabs  rdx, -4046563652848771978
        mov     QWORD PTR [rbp-304], rax
        mov     QWORD PTR [rbp-296], rdx
        movabs  rax, 1600213061547397258
        movabs  rdx, -7907006450299616387
        mov     QWORD PTR [rbp-288], rax
        mov     QWORD PTR [rbp-280], rdx
        movabs  rax, 2641250925692849876
        movabs  rdx, 5764027888120773659
        mov     QWORD PTR [rbp-272], rax
        mov     QWORD PTR [rbp-264], rdx
        movabs  rax, -2708211178971868809
        movabs  rdx, -1437889653997315907
        mov     QWORD PTR [rbp-256], rax
        mov     QWORD PTR [rbp-248], rdx
        movabs  rax, -1790267167538066993
        movabs  rdx, 6751799815650390725
        mov     QWORD PTR [rbp-240], rax
        mov     QWORD PTR [rbp-232], rdx
        movabs  rax, -7155949167227380485
        movabs  rdx, -240513889820188763
        mov     QWORD PTR [rbp-224], rax
        mov     QWORD PTR [rbp-216], rdx
        movabs  rax, 8430573516374475283
        movabs  rdx, 7014569824855873983
        mov     QWORD PTR [rbp-208], rax
        mov     QWORD PTR [rbp-200], rdx
        movabs  rax, -1194317526320485479
        movabs  rdx, -2635243135622213470
        mov     QWORD PTR [rbp-192], rax
        mov     QWORD PTR [rbp-184], rdx
        movabs  rax, 3816607778456458796
        movabs  rdx, 7739645478794557909
        mov     QWORD PTR [rbp-176], rax
        mov     QWORD PTR [rbp-168], rdx
        movabs  rax, 2239858223738625365
        movabs  rdx, 6262919446888351940
        mov     QWORD PTR [rbp-160], rax
        mov     QWORD PTR [rbp-152], rdx
        movabs  rax, 5359968574739497219
        movabs  rdx, -5945185636638990574
        mov     QWORD PTR [rbp-144], rax
        mov     QWORD PTR [rbp-136], rdx
        movabs  rax, 4289602485438450409
        movabs  rdx, -4136753309120802266
        mov     QWORD PTR [rbp-128], rax
        mov     QWORD PTR [rbp-120], rdx
        movabs  rax, 3689636007142570038
        movabs  rdx, 7149575679097845041
        mov     QWORD PTR [rbp-400], rax
        mov     QWORD PTR [rbp-392], rdx
        movabs  rax, 3544442000607754086
        movabs  rdx, 58494055442021
        mov     QWORD PTR [rbp-390], rax
        mov     QWORD PTR [rbp-382], rdx
        movabs  rax, -6712584965997026559
        movabs  rdx, 5818345077617353901
        mov     QWORD PTR [rbp-464], rax
        mov     QWORD PTR [rbp-456], rdx
        movabs  rax, -1172694937141806812
        movabs  rdx, -4970398359911696349
        mov     QWORD PTR [rbp-448], rax
        mov     QWORD PTR [rbp-440], rdx
        movabs  rax, -7528756344694355204
        movabs  rdx, -880185776627970324
        mov     QWORD PTR [rbp-432], rax
        mov     QWORD PTR [rbp-424], rdx
        mov     WORD PTR [rbp-416], -4294
        mov     BYTE PTR [rbp-1], 0
        mov     BYTE PTR [rbp-2], 0
        mov     BYTE PTR [rbp-9], 0
        mov     DWORD PTR [rbp-8], 0
        jmp     .L2
.L7:
        mov     eax, DWORD PTR [rbp-8]
        cdqe
        movzx   eax, BYTE PTR [rbp-112+rax]
        mov     BYTE PTR [rbp-9], al
        movzx   eax, BYTE PTR [rbp-9]
        cdqe
        movzx   eax, BYTE PTR [rbp-368+rax]
        mov     BYTE PTR [rbp-1], al
        mov     ecx, DWORD PTR [rbp-8]
        movsx   rax, ecx
        imul    rax, rax, 715827883
        shr     rax, 32
        mov     edx, eax
        sar     edx, 2
        mov     eax, ecx
        sar     eax, 31
        sub     edx, eax
        mov     eax, edx
        add     eax, eax
        add     eax, edx
        sal     eax, 3
        sub     ecx, eax
        mov     edx, ecx
        movsx   rax, edx
        movzx   eax, BYTE PTR [rbp-400+rax]
        mov     BYTE PTR [rbp-2], al
        mov     ecx, DWORD PTR [rbp-8]
        movsx   rax, ecx
        imul    rax, rax, 715827883
        shr     rax, 32
        mov     edx, eax
        sar     edx, 2
        mov     eax, ecx
        sar     eax, 31
        sub     edx, eax
        mov     eax, edx
        add     eax, eax
        add     eax, edx
        sal     eax, 3
        sub     ecx, eax
        mov     edx, ecx
        mov     eax, edx
        and     eax, 1
        test    eax, eax
        je      .L3
        not     BYTE PTR [rbp-2]
.L3:
        movzx   eax, BYTE PTR [rbp-2]
        xor     BYTE PTR [rbp-1], al
        movzx   eax, BYTE PTR [rbp-1]
        cdqe
        movzx   eax, BYTE PTR [rbp-368+rax]
        mov     BYTE PTR [rbp-1], al
        movzx   eax, BYTE PTR [rbp-1]
        and     eax, 1
        test    eax, eax
        je      .L4
        xor     BYTE PTR [rbp-1], 66
.L4:
        not     BYTE PTR [rbp-1]
        mov     eax, DWORD PTR [rbp-8]
        cdqe
        movzx   eax, BYTE PTR [rbp-464+rax]
        cmp     BYTE PTR [rbp-1], al
        je      .L5
        mov     edi, OFFSET FLAT:.LC2
        mov     eax, 0
        call    printf
        mov     eax, 1
        jmp     .L8
.L5:
        add     DWORD PTR [rbp-8], 1
.L2:
        cmp     DWORD PTR [rbp-8], 49
        jle     .L7
        mov     edi, OFFSET FLAT:.LC3
        mov     eax, 0
        call    printf
        mov     eax, 0
.L8:
        leave
        ret
```

### Solution

Since the assembly code not too long we can reconstruct the code to another programming language such as python. Here is my implementation on python

```python
from Crypto.Util.number import *
import string


def mov(addr, value, size):
        value = value & (2**(size*8) - 1)        
        memory[addr:addr+size] = list(long_to_bytes(value)[::-1].rjust(size, b"\x00"))

def get(addr, size):
        return bytes_to_long(bytes(memory[addr:addr+size]))

def not_op(value, size):
        return ~value & (2**(size*8) - 1)

rbp = 500
memory =  [0 for _ in range(1000)]

mov(rbp-112, 0, 8)
mov(rbp-104, 0, 8)
mov(rbp-96, 0, 8)
mov(rbp-88, 0, 8)
mov(rbp-80, 0, 8)
mov(rbp-72, 0, 8)
mov(rbp-64, 0, 8)
mov(rbp-56, 0, 8)
mov(rbp-48, 0, 8)
mov(rbp-40, 0, 8)
mov(rbp-32, 0, 8)
mov(rbp-24, 0, 8)
mov(rbp-16, 0, 8)

rax = 0xf3e8cbae4506845a
rdx = 0xd008415e3da6fe57
mov(rbp-368, rax, 8)
mov(rbp-360, rdx, 8)
rax = 0xa000dd2081212233
rdx = 0x1d18f58b0471af23
mov(rbp-352, rax, 8)
mov(rbp-344, rdx, 8)
rax = 0x3e7842ce09650fe1
rdx = 0xace032648fca37c3
mov(rbp-336, rax, 8)
mov(rbp-328, rdx, 8)
rax = 0x95f407c02a7c91de
rdx = 0x527ab667e553409f
mov(rbp-320, rax, 8)
mov(rbp-312, rdx, 8)
rax = 0x2e7282c94b833f4e
rdx = 0xc7d7b7cc1ef11c76
mov(rbp-304, rax, 8)
mov(rbp-296, rdx, 8)
rax = 0x1635194d1a79108a
rdx = 0x9244ab86cd2b437d
mov(rbp-288, rax, 8)
mov(rbp-280, rdx, 8)
rax = 0x24a79bb914980ed4
rdx = 0x4ffdf0d33ae23c1b
mov(rbp-272, rax, 8)
mov(rbp-264, rdx, 8)
rax = 0xda6a80480ca3d177
rdx = 0xec0b96fa5b47d8bd
mov(rbp-256, rax, 8)
mov(rbp-248, rdx, 8)
rax = 0xe727b17f11d949cf
rdx = 0x5db33628e663b2c5
mov(rbp-240, rax, 8)
mov(rbp-232, rdx, 8)
rax = 0x9cb0f62570a8dcfb
rdx = 0xfca985e439b85fa5
mov(rbp-224, rax, 8)
mov(rbp-216, rdx, 8)
rax = 0x74ff69f230510213
rdx = 0x6158c21746b559bf
mov(rbp-208, rax, 8)
mov(rbp-200, rdx, 8)
rax = 0xef6cee899ea4eb99
rdx = 0xdb6dbc548c7390a2
mov(rbp-192, rax, 8)
mov(rbp-184, rdx, 8)
rax = 0x34f7508da1e3d62c
rdx = 0x6b68be8e7b01f9d5
mov(rbp-176, rax, 8)
mov(rbp-168, rdx, 8)
rax = 0x1f15932fed2d9d55
rdx = 0x56ea5c0df8aa88c4
mov(rbp-160, rax, 8)
mov(rbp-152, rdx, 8)
rax = 0x4a626f05389ac103
rdx = 0xad7e75299460df12
mov(rbp-144, rax, 8)
mov(rbp-136, rdx, 8)
rax = 0x3b87babbb4310ae9
rdx = 0xc6974cc8666ed226
mov(rbp-128, rax, 8)
mov(rbp-120, rdx, 8)
                
rax = 0x3334386664393836
rdx = 0x6338653337663531
mov(rbp-400, rax, 8)
mov(rbp-392, rdx, 8)
rax = 0x3130633865333766
rdx = 0xaaaa353335656665
mov(rbp-390, rax, 8)
mov(rbp-382, rdx, 8)

rax = 0xa2d81b89c91ea301 
rdx = 0x50beea056c0664ad 
mov(rbp-464, rax, 8)
mov(rbp-456, rdx, 8)
rax = 0xefb9c02af9c37924 
rdx = 0xbb059906a5477823 
mov(rbp-448, rax, 8)
mov(rbp-440, rdx, 8)
rax = 0x97847bfe5a064afc 
rdx = 0xf3c8f3b317bd0eec 
mov(rbp-432, rax, 8)
mov(rbp-424, rdx, 8)
mov(rbp-416, 0xef3a, 2)  

inp = b"ASCWG{aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa}"

for i in range(len(inp)):
        mov(rbp-112+i, inp[i] ,1)

mod_val = 24

while True:
        counter = get(rbp-8, 4)
        if(counter == len(inp)):
                break
        
        eax = get(rbp-8, 4)
        eax = get(rbp-112+eax, 1)
        mov(rbp-9, eax, 1)
        eax = get(rbp-9, 1)
        eax = get(rbp-368+eax, 1)
        mov(rbp-1, eax, 1)
                        
        ecx = get(rbp-8, 4)
        rax = ecx
        rax = rax % mod_val
        
        eax = get(rbp-400+rax, 1)
        mov(rbp-2, eax, 1)
                        
        ecx = get(rbp-8, 4)
        rax = ecx
        eax = rax % mod_val
        
        eax &= 1
        if(eax != 0):
                tmp = get(rbp-2, 1)
                tmp = not_op(tmp, 1)
                mov(rbp-2, tmp, 1)
        
        eax = get(rbp-2, 1)
        tmp = get(rbp-1, 1)
        eax ^= tmp
        mov(rbp-1, eax, 1)
        eax = get(rbp-368+eax, 1)
        mov(rbp-1, eax, 1)
        eax = get(rbp-1, 1)
        
        eax &= 1
        if(eax != 0):
                tmp = get(rbp-1, 1)
                tmp ^= 66
                mov(rbp-1, tmp, 1)
        
        tmp = get(rbp-1, 1)
        tmp = not_op(tmp, 1)
        mov(rbp-1, tmp, 1)
        eax = get(rbp-8, 4)
        eax = get(rbp-464+eax, 1)
        tmp = get(rbp-1, 1)
        if(tmp == eax):
                mov(rbp-8, counter + 1, 4)
        else:
                print("wrong")
                break

if(get(rbp-8, 4) == 50):
        print("nice")
```

We can see that the input processed each one byte so basically we can do bruteforce one byte to get the valid flag. Here is modified code i used to do bruteforce

```python
from Crypto.Util.number import *
import string

def mov(addr, value, size):
        value = value & (2**(size*8) - 1)        
        memory[addr:addr+size] = list(long_to_bytes(value)[::-1].rjust(size, b"\x00"))

def get(addr, size):
        return bytes_to_long(bytes(memory[addr:addr+size]))

def not_op(value, size):
        return ~value & (2**(size*8) - 1)

memory =  [0 for _ in range(1000)]

rbp = 500

mod_val = 24

memory =  [0 for _ in range(1000)]
flag = ""
for lol in range(50):
        init_length = len(flag)
        for x in string.printable[:-6]:

                mov(rbp-112, 0, 8)
                mov(rbp-104, 0, 8)
                mov(rbp-96, 0, 8)
                mov(rbp-88, 0, 8)
                mov(rbp-80, 0, 8)
                mov(rbp-72, 0, 8)
                mov(rbp-64, 0, 8)
                mov(rbp-56, 0, 8)
                mov(rbp-48, 0, 8)
                mov(rbp-40, 0, 8)
                mov(rbp-32, 0, 8)
                mov(rbp-24, 0, 8)
                mov(rbp-16, 0, 8)
                
                mov(rbp-112+lol, ord(x) ,1)
                mov(rbp-8, lol, 4)
                
                rax = 0xf3e8cbae4506845a
                rdx = 0xd008415e3da6fe57
                mov(rbp-368, rax, 8)
                mov(rbp-360, rdx, 8)
                rax = 0xa000dd2081212233
                rdx = 0x1d18f58b0471af23
                mov(rbp-352, rax, 8)
                mov(rbp-344, rdx, 8)
                rax = 0x3e7842ce09650fe1
                rdx = 0xace032648fca37c3
                mov(rbp-336, rax, 8)
                mov(rbp-328, rdx, 8)
                rax = 0x95f407c02a7c91de
                rdx = 0x527ab667e553409f
                mov(rbp-320, rax, 8)
                mov(rbp-312, rdx, 8)
                rax = 0x2e7282c94b833f4e
                rdx = 0xc7d7b7cc1ef11c76
                mov(rbp-304, rax, 8)
                mov(rbp-296, rdx, 8)
                rax = 0x1635194d1a79108a
                rdx = 0x9244ab86cd2b437d
                mov(rbp-288, rax, 8)
                mov(rbp-280, rdx, 8)
                rax = 0x24a79bb914980ed4
                rdx = 0x4ffdf0d33ae23c1b
                mov(rbp-272, rax, 8)
                mov(rbp-264, rdx, 8)
                rax = 0xda6a80480ca3d177
                rdx = 0xec0b96fa5b47d8bd
                mov(rbp-256, rax, 8)
                mov(rbp-248, rdx, 8)
                rax = 0xe727b17f11d949cf
                rdx = 0x5db33628e663b2c5
                mov(rbp-240, rax, 8)
                mov(rbp-232, rdx, 8)
                rax = 0x9cb0f62570a8dcfb
                rdx = 0xfca985e439b85fa5
                mov(rbp-224, rax, 8)
                mov(rbp-216, rdx, 8)
                rax = 0x74ff69f230510213
                rdx = 0x6158c21746b559bf
                mov(rbp-208, rax, 8)
                mov(rbp-200, rdx, 8)
                rax = 0xef6cee899ea4eb99
                rdx = 0xdb6dbc548c7390a2
                mov(rbp-192, rax, 8)
                mov(rbp-184, rdx, 8)
                rax = 0x34f7508da1e3d62c
                rdx = 0x6b68be8e7b01f9d5
                mov(rbp-176, rax, 8)
                mov(rbp-168, rdx, 8)
                rax = 0x1f15932fed2d9d55
                rdx = 0x56ea5c0df8aa88c4
                mov(rbp-160, rax, 8)
                mov(rbp-152, rdx, 8)
                rax = 0x4a626f05389ac103
                rdx = 0xad7e75299460df12
                mov(rbp-144, rax, 8)
                mov(rbp-136, rdx, 8)
                rax = 0x3b87babbb4310ae9
                rdx = 0xc6974cc8666ed226
                mov(rbp-128, rax, 8)
                mov(rbp-120, rdx, 8)
                
                rax = 0x3334386664393836
                rdx = 0x6338653337663531
                mov(rbp-400, rax, 8)
                mov(rbp-392, rdx, 8)
                rax = 0x3130633865333766
                rdx = 0xaaaa353335656665
                mov(rbp-390, rax, 8)
                mov(rbp-382, rdx, 8)

                rax = 0xa2d81b89c91ea301
                rdx = 0x50beea056c0664ad
                mov(rbp-464, rax, 8)
                mov(rbp-456, rdx, 8)
                rax = 0xefb9c02af9c37924
                rdx = 0xbb059906a5477823
                mov(rbp-448, rax, 8)
                mov(rbp-440, rdx, 8)
                rax = 0x97847bfe5a064afc
                rdx = 0xf3c8f3b317bd0eec
                mov(rbp-432, rax, 8)
                mov(rbp-424, rdx, 8)
                mov(rbp-416, 0xef3a, 2)

                counter = get(rbp-8, 4)
                eax = get(rbp-8, 4)
                eax = get(rbp-112+eax, 1)
                mov(rbp-9, eax, 1)
                eax = get(rbp-9, 1)
                eax = get(rbp-368+eax, 1)
                mov(rbp-1, eax, 1)
                
                ecx = get(rbp-8, 4)
                rax = ecx
                rax = rax % mod_val

                eax = get(rbp-400+rax, 1)
                mov(rbp-2, eax, 1)
                
                ecx = get(rbp-8, 4)
                rax = ecx
                eax = rax % mod_val

                eax &= 1
                if(eax != 0):
                        tmp = get(rbp-2, 1)
                        tmp = not_op(tmp, 1)
                        mov(rbp-2, tmp, 1)

                eax = get(rbp-2, 1)
                tmp = get(rbp-1, 1)
                eax ^= tmp
                mov(rbp-1, eax, 1)
                eax = get(rbp-368+eax, 1)
                mov(rbp-1, eax, 1)
                eax = get(rbp-1, 1)
                eax &= 1
                if(eax != 0):
                        tmp = get(rbp-1, 1)
                        tmp ^= 66
                        mov(rbp-1, tmp, 1)

                tmp = get(rbp-1, 1)
                tmp = not_op(tmp, 1)
                mov(rbp-1, tmp, 1)
                eax = get(rbp-8, 4)
                eax = get(rbp-464+eax, 1)
                tmp = get(rbp-1, 1)
                if(tmp == eax):
                        flag += x
                        break
        if(len(flag) == init_length):
                flag += '!' # track error
print(flag)
```

Flag: ASCWG{What\_do\_you\_see\_before\_it\_is\_over?\_998bd0d4}

## Guess The Flag (900 pts)

### Description

Given ELF 64 bit file

### Solution

When we open the main function it show something like fake validation because it always return wrong key

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FkEX6Sidmpza6bNPcLSlv%2Fimage.png?alt=media&amp;token=05faa339-3fa5-4f6b-8dc6-1b5ab0042171" alt=""><figcaption></figcaption></figure>

So the next step, i checked the `init_array` to see whether there is suspicious function called before actual `main` function.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FEjTfqp55OeqIZKn6j2i3%2Fimage.png?alt=media&amp;token=09bd37d6-7630-4870-a823-7b9278790c02" alt=""><figcaption></figcaption></figure>

We can see on image above that there is `function_main` `(0x13A1)` in `init_array`.&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FnXnCoeJICWzwZBe10XiB%2Fimage.png?alt=media&amp;token=2e3f5625-95ec-479a-892e-cad1ac9dd890" alt=""><figcaption></figcaption></figure>

There are puts and `scanf` on that function and we can implement the xor process to knowing the value printed out.

```python
from Crypto.Util.number import *

a = [0xF1EDB9EBFCEDF7DC, 0xEDFCEBFAFCEAB9FC, 0x99B9A3B9E0FCF2B9]
res = b""
for i in a:
	tmp = long_to_bytes(i)[::-1]
	for j in tmp:
		res += bytes([j^0x99])
print(res)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FItRjTnkbtLkeZnU46Ref%2Fimage.png?alt=media&amp;token=06285b0c-9855-4aa7-acf7-0fe4e3ed815a" alt=""><figcaption></figcaption></figure>

We can confirm that the printed out string is same like in actual main function. Then, we just need to set breakpoint on that address to make sure that our input actually processed on `0x13A1` not in `main` function.

```c
...
 if ( !pid )
  {
    v0 = mmap(0LL, 0x6D0uLL, 7, 34, -1, 0LL);
    v17 = (void (__fastcall *)(_QWORD))v0;
    *v0 = byte_4080[0];
    v0[217] = byte_4080[217];
    qmemcpy(
      (void *)((unsigned __int64)(v0 + 1) & 0xFFFFFFFFFFFFFFF8LL),
      (const void *)((char *)byte_4080 - ((char *)v0 - ((unsigned __int64)(v0 + 1) & 0xFFFFFFFFFFFFFFF8LL))),
      8LL * ((((_DWORD)v0 - (((_DWORD)v0 + 8) & 0xFFFFFFF8) + 1744) & 0xFFFFFFF8) >> 3));
    ptrace(PTRACE_TRACEME, 0LL, 0LL, 0LL);
    v16 = v17;
    v17(v7);                                    // pass our input as argument
    exit(0);
  }
...
```

Function `v17` processed our input and the function created during runtime. `Opcode` of function `v17` stored on `0x4080`.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FvwkL607dm6xpoloLzfuC%2Fimage.png?alt=media&amp;token=b4bc66c0-f0f5-45df-84e3-daa4b56a7c80" alt=""><figcaption></figcaption></figure>

We can directly convert the opcode to instruction by pressing `c` in `IDA`.&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FAz1zlSNzet7OnfABlttG%2Fimage.png?alt=media&amp;token=7b336251-7450-4ae7-9b8f-5daff12a4dbc" alt=""><figcaption></figcaption></figure>

function `loc_408B` xoring the byte on index `i` with index `i-1` then stored it on `i` (basically like self modifying code). We can reimplement the function to make the rest instruction valid.&#x20;

```python
from Crypto.Util.number import *

f = open("Guess_The_Flag", "rb").read()

def decrypt(data):
	tmp = list(data)
	for i in range(len(data)-1, 36, -1):
		tmp[i] = tmp[i-1]^tmp[i]
	return tmp

def encrypt(data):
	tmp = list(data)
	for i in range(36, len(data)-1):
		tmp[i+1] = tmp[i]^tmp[i+1]
	return tmp

index = f.index(b"\x49\x89\xf9\x4d\x31\xe4")

length = 1744
ori = f[index:index+length]
data = decrypt(ori)

result = list(f)
result[index:index+length] = data
out = open("lol_patched", "wb") 
out.write(bytes(result))
out.close()
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FWKftWaUr4jUYZ0nVc0PD%2Fimage.png?alt=media&amp;token=9064cc17-4657-4259-a7f7-53e90e0b6e70" alt=""><figcaption></figcaption></figure>

Opening new binary, now we can convert the opcode to valid instruction on address `0x40be`. On address `0x40bc` we can see that there is instruction `ud2`, basically this instruction trigger crash `child process` to back to `parent process` inside while looping `(0x1ba1).` There are also another instructions that trigger the same condition such as `sys_kill` and `int 3` (as shown in image below)

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FridQOPt9kXdauuSAWt1w%2Fimage.png?alt=media&amp;token=86490792-3a7a-4c8e-a71e-a36312f117e3" alt=""><figcaption></figcaption></figure>

During the competition i do `debugging` and modified some function name inside while looping to make it easier to do static analysis.

```python
...
  while ( 1 )
  {
    result = waitpid(pid, &stat_loc, 0);
    if ( result == -1 )
      break;
    switch ( stat_loc >> 8 )
    {
      case 5:
        ptrace(PTRACE_GETREGS, (unsigned int)pid, 0LL, v9);
        v18 = ptrace(PTRACE_PEEKTEXT, (unsigned int)pid, v14, 0LL) & 0xFFFFFFFF00000000LL | 0x90909090;
        v12 = (unsigned __int8)rol_func(v12, v13);
        ptrace(PTRACE_SETREGS, (unsigned int)pid, 0LL, v9);
        break;
      case 4:
        ptrace(PTRACE_GETREGS, (unsigned int)pid, 0LL, v9);
        v1 = ptrace(PTRACE_PEEKTEXT, (unsigned int)pid, v14, 0LL);
        LOWORD(v1) = 0;
        v18 = v1 | 0x9090;
        ptrace(PTRACE_POKETEXT, (unsigned int)pid, v14, v1 | 0x9090);
        ptrace(PTRACE_GETREGS, (unsigned int)pid, 0LL, v9);
        v12 = (unsigned __int8)ror_func(v12, v13);
        ptrace(PTRACE_SETREGS, (unsigned int)pid, 0LL, v9);
        break;
      case 8:
        ptrace(PTRACE_GETREGS, (unsigned int)pid, 0LL, v9);
        v12 = (unsigned __int8)add_func(v12, v13);
        ptrace(PTRACE_SETREGS, (unsigned int)pid, 0LL, v9);
        v18 = ptrace(PTRACE_PEEKTEXT, (unsigned int)pid, v14, 0LL) & 0xFFFFFFFFFF000000LL | 0x909090;
        ptrace(PTRACE_POKETEXT, (unsigned int)pid, v14, v18);
        break;
      case 11:
        ptrace(PTRACE_GETREGS, (unsigned int)pid, 0LL, v9);
        v12 = (unsigned __int8)xor_func(v12, v13);
        ptrace(PTRACE_SETREGS, (unsigned int)pid, 0LL, v9);
        v18 = ptrace(PTRACE_PEEKTEXT, (unsigned int)pid, v14, 0LL) & 0xFFFFFFFF00000000LL | 0x90909090;
        ptrace(PTRACE_POKETEXT, (unsigned int)pid, v14, v18);
        v18 = ptrace(PTRACE_PEEKTEXT, (unsigned int)pid, v14 + 4, 0LL) & 0xFFFFFFFF00000000LL | 0x90909090;
        ptrace(PTRACE_POKETEXT, (unsigned int)pid, v14 + 4, v18);
        break;
      case 31:
        ptrace(PTRACE_GETREGS, (unsigned int)pid, 0LL, v9);
        v18 = ptrace(PTRACE_PEEKTEXT, (unsigned int)pid, v14, 0LL) & 0xFFFFFFFF00000000LL | 0x90909090;
        output_func((unsigned __int8)v11);
      case 18:
        ptrace(PTRACE_GETREGS, (unsigned int)pid, 0LL, v9);
        v12 = (unsigned __int8)xor_rol(v10, v13);
        ptrace(PTRACE_SETREGS, (unsigned int)pid, 0LL, v9);
        break;
      case 28:
        ptrace(PTRACE_GETREGS, (unsigned int)pid, 0LL, v9);
        v12 = (unsigned __int8)xor_ror(v10, v13);
        ptrace(PTRACE_SETREGS, (unsigned int)pid, 0LL, v9);
        break;
      default:
        if ( (stat_loc & 0x7F) == 0 || stat_loc >> 8 == 17 )
        {
          *(_QWORD *)v3 = 0xCEB9EABEEDF8F1CDLL; // weird out
          *(_QWORD *)&v3[5] = 0x99FDEBF0FCCEB9EALL;
          for ( j = 0; j <= 12; ++j )
            v3[j] ^= 0x99u;
          puts(v3);
        }
        break;
    }
    ptrace(PTRACE_CONT, (unsigned int)pid, 0LL, 0LL);
  }
...
```

We can see that there are some `ptrace` function called inside while looping with different first argument which are&#x20;

* `PTRACE_GETREGS`
* `PTRACE_SETREGS`
* `PTRACE_PEEKTEXT`
* `PTRACE_POKETEXT`

Next step i did was tracing those `ptrace` call including dump all the argument by utilizing `preload` library.

```c
#define _GNU_SOURCE

#include <stdio.h>
#include <unistd.h>
#include <dlfcn.h>
#include <sys/ptrace.h>
#include <sys/types.h>
#include <stdarg.h>
#include <sys/utsname.h>
#include <sys/stat.h>
#include <stdlib.h>

FILE* pFile2;

long int ptrace(enum __ptrace_request __request, ...){
    pid_t caller = getpid();
    va_list list;
    va_start(list, __request);
    pid_t pid = va_arg(list, pid_t);
    void* addr = va_arg(list, void*);
    void* data = va_arg(list, void*);
    long int (*orig_ptrace)(enum __ptrace_request __request, pid_t pid, void *addr, void *data);
    orig_ptrace = dlsym(RTLD_NEXT, "ptrace");
    long int result = orig_ptrace(__request, pid, addr, data);

    if (__request == PTRACE_PEEKTEXT){
        fprintf(pFile2, "PEEK (0x%lx , 0x%lx),\n", (unsigned long)addr, (unsigned long)data);
    }
    else if (__request == PTRACE_POKETEXT){
        fprintf(pFile2, "POKE (0x%lx , 0x%lx),\n", (unsigned long)addr, (unsigned long)data);
    }
    else if (__request == PTRACE_GETREGS){
        unsigned long rip = *((unsigned long*)data + 16);
        fprintf(pFile2, "GETREGS: rip: 0x%lx\n", rip);
    }
    else if (__request == PTRACE_SETREGS){
        unsigned long rip = *((unsigned long*)data + 16);
        fprintf(pFile2, "SETREGS: rip: 0x%lx\n", rip);
    }
    return result;
}

__attribute__((constructor)) static void setup(void) {
    printf("hello\n");
    pFile2 = fopen("./log.txt", "a");
}
```

Compile the source code using command below

```bash
gcc -shared -fPIC ptrace_hook.c -ldl -o ptrace_hook.so
```

After that just run binary like command below then there you can see the trace result on `log.txt`

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FwbVYME3pBM9ZuacpJOGW%2Fimage.png?alt=media&amp;token=97327e33-c5e4-4f6c-8658-b33d95e09636" alt=""><figcaption></figcaption></figure>

```python
GETREGS: rip: 0x7f68f899503c
PEEK (0x7f68f899503c , 0x0),
POKE (0x7f68f899503c , 0xe33045c1ff499090),
GETREGS: rip: 0x7f68f899503c
SETREGS: rip: 0x7f68f899503c
GETREGS: rip: 0x7f68f8995079
SETREGS: rip: 0x7f68f8995079
GETREGS: rip: 0x7f68f899509b
PEEK (0x7f68f899509b , 0x0),
SETREGS: rip: 0x7f68f899509b
GETREGS: rip: 0x7f68f89950bd
PEEK (0x7f68f89950bd , 0x0),
SETREGS: rip: 0x7f68f89950bd
GETREGS: rip: 0x7f68f89950f8
SETREGS: rip: 0x7f68f89950f8
GETREGS: rip: 0x7f68f8995119
SETREGS: rip: 0x7f68f8995119
PEEK (0x7f68f8995119 , 0x0),
POKE (0x7f68f8995119 , 0x90909090),
PEEK (0x7f68f899511d , 0x0),
POKE (0x7f68f899511d , 0x45c1ff4990909090),
GETREGS: rip: 0x7f68f8995143
PEEK (0x7f68f8995143 , 0x0),
SETREGS: rip: 0x7f68f8995143
GETREGS: rip: 0x7f68f899516a
SETREGS: rip: 0x7f68f899516a
PEEK (0x7f68f899516a , 0x0),
POKE (0x7f68f899516a , 0x3045c1ff49909090),
GETREGS: rip: 0x7f68f899518f
PEEK (0x7f68f899518f , 0x0),
SETREGS: rip: 0x7f68f899518f
GETREGS: rip: 0x7f68f89951b6
SETREGS: rip: 0x7f68f89951b6
PEEK (0x7f68f89951b6 , 0x0),
POKE (0x7f68f89951b6 , 0x3045c1ff49909090),
GETREGS: rip: 0x7f68f89951da
PEEK (0x7f68f89951da , 0x0),
POKE (0x7f68f89951da , 0xe33045c1ff499090),
GETREGS: rip: 0x7f68f89951da
SETREGS: rip: 0x7f68f89951da
GETREGS: rip: 0x7f68f8995217
SETREGS: rip: 0x7f68f8995217
GETREGS: rip: 0x7f68f8995252
SETREGS: rip: 0x7f68f8995252
GETREGS: rip: 0x7f68f899528d
SETREGS: rip: 0x7f68f899528d
GETREGS: rip: 0x7f68f89952c8
SETREGS: rip: 0x7f68f89952c8
GETREGS: rip: 0x7f68f89952e9
SETREGS: rip: 0x7f68f89952e9
PEEK (0x7f68f89952e9 , 0x0),
POKE (0x7f68f89952e9 , 0x90909090),
PEEK (0x7f68f89952ed , 0x0),
POKE (0x7f68f89952ed , 0x45c1ff4990909090),
GETREGS: rip: 0x7f68f899532c
SETREGS: rip: 0x7f68f899532c
GETREGS: rip: 0x7f68f899534d
SETREGS: rip: 0x7f68f899534d
PEEK (0x7f68f899534d , 0x0),
POKE (0x7f68f899534d , 0x90909090),
PEEK (0x7f68f8995351 , 0x0),
POKE (0x7f68f8995351 , 0x45c1ff4990909090),
GETREGS: rip: 0x7f68f8995376
PEEK (0x7f68f8995376 , 0x0),
POKE (0x7f68f8995376 , 0xe33045c1ff499090),
GETREGS: rip: 0x7f68f8995376
SETREGS: rip: 0x7f68f8995376
GETREGS: rip: 0x7f68f8995399
PEEK (0x7f68f8995399 , 0x0),
POKE (0x7f68f8995399 , 0xe33045c1ff499090),
GETREGS: rip: 0x7f68f8995399
SETREGS: rip: 0x7f68f8995399
GETREGS: rip: 0x7f68f89953d6
SETREGS: rip: 0x7f68f89953d6
GETREGS: rip: 0x7f68f89953f7
PEEK (0x7f68f89953f7 , 0x0),
POKE (0x7f68f89953f7 , 0xe33045c1ff499090),
GETREGS: rip: 0x7f68f89953f7
SETREGS: rip: 0x7f68f89953f7
GETREGS: rip: 0x7f68f899541a
SETREGS: rip: 0x7f68f899541a
PEEK (0x7f68f899541a , 0x0),
POKE (0x7f68f899541a , 0x90909090),
PEEK (0x7f68f899541e , 0x0),
POKE (0x7f68f899541e , 0x45c1ff4990909090),
GETREGS: rip: 0x7f68f8995443
PEEK (0x7f68f8995443 , 0x0),
POKE (0x7f68f8995443 , 0xe33045c1ff499090),
GETREGS: rip: 0x7f68f8995443
SETREGS: rip: 0x7f68f8995443
GETREGS: rip: 0x7f68f8995466
PEEK (0x7f68f8995466 , 0x0),
POKE (0x7f68f8995466 , 0xe33045c1ff499090),
GETREGS: rip: 0x7f68f8995466
SETREGS: rip: 0x7f68f8995466
GETREGS: rip: 0x7f68f89954a3
SETREGS: rip: 0x7f68f89954a3
GETREGS: rip: 0x7f68f89954ca
SETREGS: rip: 0x7f68f89954ca
PEEK (0x7f68f89954ca , 0x0),
POKE (0x7f68f89954ca , 0x3045c1ff49909090),
GETREGS: rip: 0x7f68f89954ee
SETREGS: rip: 0x7f68f89954ee
PEEK (0x7f68f89954ee , 0x0),
POKE (0x7f68f89954ee , 0x90909090),
PEEK (0x7f68f89954f2 , 0x0),
POKE (0x7f68f89954f2 , 0x45c1ff4990909090),
GETREGS: rip: 0x7f68f8995531
SETREGS: rip: 0x7f68f8995531
GETREGS: rip: 0x7f68f8995553
PEEK (0x7f68f8995553 , 0x0),
SETREGS: rip: 0x7f68f8995553
GETREGS: rip: 0x7f68f899557a
SETREGS: rip: 0x7f68f899557a
PEEK (0x7f68f899557a , 0x0),
POKE (0x7f68f899557a , 0x3045c1ff49909090),
GETREGS: rip: 0x7f68f89955a4
SETREGS: rip: 0x7f68f89955a4
PEEK (0x7f68f89955a4 , 0x0),
POKE (0x7f68f89955a4 , 0x3045c1ff49909090),
GETREGS: rip: 0x7f68f89955e2
SETREGS: rip: 0x7f68f89955e2
GETREGS: rip: 0x7f68f8995603
SETREGS: rip: 0x7f68f8995603
PEEK (0x7f68f8995603 , 0x0),
POKE (0x7f68f8995603 , 0x90909090),
PEEK (0x7f68f8995607 , 0x0),
POKE (0x7f68f8995607 , 0x45c1ff4990909090),
GETREGS: rip: 0x7f68f899562c
SETREGS: rip: 0x7f68f899562c
PEEK (0x7f68f899562c , 0x0),
POKE (0x7f68f899562c , 0x90909090),
PEEK (0x7f68f8995630 , 0x0),
POKE (0x7f68f8995630 , 0x45c1ff4990909090),
GETREGS: rip: 0x7f68f899566f
SETREGS: rip: 0x7f68f899566f
GETREGS: rip: 0x7f68f8995690
PEEK (0x7f68f8995690 , 0x0),
POKE (0x7f68f8995690 , 0xe33045c1ff499090),
GETREGS: rip: 0x7f68f8995690
SETREGS: rip: 0x7f68f8995690
GETREGS: rip: 0x7f68f89956b3
PEEK (0x7f68f89956b3 , 0x0),
POKE (0x7f68f89956b3 , 0xe33045c1ff499090),
GETREGS: rip: 0x7f68f89956b3
SETREGS: rip: 0x7f68f89956b3
GETREGS: rip: 0x7f68f89956c7
PEEK (0x7f68f89956c7 , 0x0),
```

Based on the trace log, the binary doing self modification again by modify its next instruction and back to that instruction to continue the process. Besides that it also take value on some register then processed it on parent process. The first thing i do was patching the actual opcode (from `POKETEXT` ptrace) to the binary so we can get the all valid instruction.

```python
from Crypto.Util.number import *

f = open("patched", "rb").read()

def decrypt(data):
	tmp = list(data)
	for i in range(len(data)-1, 36, -1):
		tmp[i] = tmp[i-1]^tmp[i]
	return tmp

def encrypt(data):
	tmp = list(data)
	for i in range(36, len(data)-1):
		tmp[i+1] = tmp[i]^tmp[i+1]
	return tmp


index = f.index(b"\x49\x89\xf9\x4d\x31\xe4")

addr_patch = [
(0x7f93df5a403c , 0xe33045c1ff499090),
(0x7f93df5a4119 , 0x90909090),
(0x7f93df5a411d , 0x45c1ff4990909090),
(0x7f93df5a416a , 0x3045c1ff49909090),
(0x7f93df5a41b6 , 0x3045c1ff49909090),
(0x7f93df5a41da , 0xe33045c1ff499090),
(0x7f93df5a42e9 , 0x90909090),
(0x7f93df5a42ed , 0x45c1ff4990909090),
(0x7f93df5a434d , 0x90909090),
(0x7f93df5a4351 , 0x45c1ff4990909090),
(0x7f93df5a4376 , 0xe33045c1ff499090),
(0x7f93df5a4399 , 0xe33045c1ff499090),
(0x7f93df5a43f7 , 0xe33045c1ff499090),
(0x7f93df5a441a , 0x90909090),
(0x7f93df5a441e , 0x45c1ff4990909090),
(0x7f93df5a4443 , 0xe33045c1ff499090),
(0x7f93df5a4466 , 0xe33045c1ff499090),
(0x7f93df5a44ca , 0x3045c1ff49909090),
(0x7f93df5a44ee , 0x90909090),
(0x7f93df5a44f2 , 0x45c1ff4990909090),
(0x7f93df5a457a , 0x3045c1ff49909090),
(0x7f93df5a45a4 , 0x3045c1ff49909090),
(0x7f93df5a4603 , 0x90909090),
(0x7f93df5a4607 , 0x45c1ff4990909090),
(0x7f93df5a462c , 0x90909090),
(0x7f93df5a4630 , 0x45c1ff4990909090),
(0x7f93df5a4690 , 0xe33045c1ff499090),
(0x7f93df5a46b3 , 0xe33045c1ff499090),
]

base = 140273084153856

length = 1744
ori = f[index:index+length]
data = decrypt(ori)

for i in addr_patch:
	tmp_index = i[0]-base
	repl = list(long_to_bytes(i[1]))[::-1]
	data[tmp_index:tmp_index+len(repl)] = repl

for i in range(len(data)):
	if(data[i] == 0xcc):
		data[i] = 0x90

result = list(f)
result[index:index+length] = data
out = open("lol_patched", "wb") 
out.write(bytes(result))
out.close()
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FdzSWfBRgEh18TIkrbo61%2Fimage.png?alt=media&amp;token=6c0eeab3-ea3e-4b71-a118-7938cbb9eadb" alt=""><figcaption></figcaption></figure>

Next, after getting the correct instruction we need to what values passed to the parent process. Set breakpoint   on address that call `fork` function

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FZ1lAkPyXJbIzw2kaoPjU%2Fimage.png?alt=media&amp;token=c3f1135b-cbed-4f05-b422-66e2681155bf" alt=""><figcaption></figcaption></figure>

To dive in child process we need to change `follow-fork-mode` to `child`

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FvzR8yB8xLLBKCOd75EmT%2Fimage.png?alt=media&amp;token=93d1d2b0-d8d3-4923-9169-f264e9fd1260" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fi6SPnaiyHQf64K6IoOQk%2Fimage.png?alt=media&amp;token=9cf8eb6a-2085-489b-865c-72e40352b3b0" alt=""><figcaption></figcaption></figure>

On call `rdx` we need to step instruction to know what values will be&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FGO78YiW7uQR0d6dqhUTZ%2Fimage.png?alt=media&amp;token=bf8d813a-d3aa-456c-9a7f-c96e96d035e0" alt=""><figcaption></figcaption></figure>

Okay, so in the last instruction before back to the parent process there are 3 register that have values.&#x20;

```python
r10 = 0x1c
r11 = 0x41
r12 = 0x14
```

Now, we back again to parent process and check which instruction processed those values.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FbVZnfeGPbU0Y7eK3E1gP%2Fimage.png?alt=media&amp;token=b44c64b8-d66b-4f5b-a768-3fe9afad27be" alt=""><figcaption></figcaption></figure>

As we can see on image above that the first values processed on parent process is same like in child process. During the competition, my approach is  parsing the instruction using `gdb` scripting. Here is the script i used to parse the instruction

```python
#!/usr/bin/python3

class SolverEquation(gdb.Command):
    def __init__ (self):
        super (SolverEquation, self).__init__ ("solve-equation",gdb.COMMAND_OBSCURE)

    def invoke (self, arg, from_tty):
        gdb.execute("pie del")
        list_bp = ["0x1616", "0x171a", "0x179b", "0x187f", "0x1a0b", "0x1a5b", "0x1ad8"]
        list_instr = []
        for i in list_bp:
            gdb.execute(f"pie b {i}")
        gdb.execute("pie run < inp.txt")
        list_pc = []
        for _ in range(44):
            pc = addr2num(gdb.selected_frame().read_register("pc"))
            pc = pc - 0x0000555555554000
            list_pc.append(pc)
            gdb.execute("c")
        print(list_pc)

def parse(f):
    f = f.split("\n")
    result = []
    for i in f:
        tmp = i.split("\t")
        for j in range(1,len(tmp)):
            result.append(int(tmp[j],16))
    return result

def addr2num(addr):
    try:
        return int(addr)  # Python 3
    except:
        return long(addr) # Python 2
SolverEquation()
```

There are some invalid instruction on result but it obvious and we can clear it manually. After getting valid instruction then i created `vm` for those instructions. Since the validation processed our values each byte we can easiy bruteforce it to get the flag.

```python
import string

rol = lambda val, r_bits, max_bits: \
    (val << r_bits%max_bits) & (2**max_bits-1) | \
    ((val & (2**max_bits-1)) >> (max_bits-(r_bits%max_bits)))
 
ror = lambda val, r_bits, max_bits: \
    ((val & (2**max_bits-1)) >> r_bits%max_bits) | \
    (val << (max_bits-(r_bits%max_bits)) & (2**max_bits-1))
 
# from lol_patched elf
array_r12b = [0x0C9,0x0CF,0x2A,0x0D3,0x74,0x32,0x0FA,0x0CB,0x1E,0x0A,0x4F,0x93,0x0EF,0x0DC,0x36,0x62,0x0F0,0x4B,0x65,0x0BF,0x5A,0x82,0x93,0x0F,0x73,0x74,0x1A,0x0EB,0x0BD,0x6F,0x0EB,0x98,0x0A,0x0C9,0x0B2,0x0E5,0x0A8,0x93]
array_r10 = [0x1C,0x6,0x15,0x8,0x25,0x10,0x1B,0x24,0x9,0x0D,0x16,0x4,0x3,0x26,0x4,0x23,0x18,0x27,0x0D,0x17,0x4,0x26,0x1B,0x22,0x14,0x22,0x6,0x0F,0x1D,0x12,0x20,0x6,0x13,0x25,0x1D,0x12,0x10,0x0A]

# from gdb scripting
list_pc = [5914, 6872, 5654, 5654, 6872, 6271, 5654, 6043, 5654, 6043, 5914, 6872, 6747, 6747, 6747, 6271, 6872, 6271, 5914, 5914, 6747, 5914, 6271, 5914, 5914, 6747, 6043, 6271, 6872, 5654, 6043, 6043, 6872, 6271, 6271, 6872, 5914, 5914]

r13 = 0
inp = b""
flag = ""

for i in range(len(list_pc)):
	for j in string.printable[:-6]:
		pc = list_pc[i]
		curr_r12b = array_r12b[i]
		curr_r12b = rol(curr_r12b, 5, 8)
		curr_r12b ^= 0x2d
		curr_r11b = ord(j)
		curr_r10 = array_r10[i]
		if(pc == 0x1616):
			curr_r11b = rol(curr_r11b, curr_r10, 8)
		elif(pc == 0x171a):
			curr_r11b = ror(curr_r11b, curr_r10, 8)
		elif(pc == 0x179b):
			curr_r11b = (curr_r11b + curr_r10)&0xff
		elif(pc == 0x187f):
			curr_r11b = (curr_r11b ^ curr_r10)&0xff
		elif(pc == 0x1a5b):
			result = (curr_r10 ^ 65)&0xff
			curr_r11b = rol(curr_r11b, result, 8)&0xff 
		elif(pc == 0x1ad8):
			result = (curr_r10 ^ 68)&0xff
			curr_r11b = ror(curr_r11b, result, 8)&0xff
		else:
			print("????")
		tmp_res = curr_r11b ^ curr_r12b
		if(tmp_res == 0):
			flag += j
			r13 |= tmp_res
print(flag)
```

Flag: ASCWG{N0w\_1\_4m\_B3c0m3\_D34th\_500861fd8}
