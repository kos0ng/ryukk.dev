# Reverse Engineering

<table><thead><tr><th width="347">Challenge</th><th>Topic</th></tr></thead><tbody><tr><td><a href="#yet-another-maze-437-pts">Yet-another-maze (437 pts)</a></td><td>Unity Game</td></tr><tr><td><a href="#magic_in_packets-500-pts">magic_in_packets (500 pts) 🥇</a></td><td>eBPF, XDP, VM, z3, Control Flow Obfuscation</td></tr></tbody></table>

## Yet-another-maze (437 pts)

### Description

Yet another simple maze!

Four buttons are hidden within its walls. The flag will appear when all of them are activated.

### Solution

Through unzipping the archive we can see that the challenge made with unity. Logic of the game are stored in `GameAssembly.dll` and we can utilize [il2cppdumper](https://github.com/Perfare/Il2CppDumper/releases/tag/v6.7.46) to recover the function name and struct from global-metadata.dat and apply it on pseudocode of GameAssembly.dll.

* Create `Dump` directory first
* Run command below

```powershell
.\Il2CppDumper.exe ..\..\yet-another-maze\GameAssembly.dll ..\..\yet-another-maze\yet-another-maze_Data\il2cpp_data\Metadata\global-metadata.dat .\Dump
```

Open GameAssembly.dll in IDA and load script `ida_with_struct_py3.py` then

* Choose `script.json` from .\Dump directory
* Choose `il2cpp.h` from .\Dump directory

After script running completely we can see many functions renamed, for a reference we can decompile `Assembly-CSharp.dll` in directory .\Dump\DummyDll using `dnSpy`.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FHEG4S4Kg5nV10ymbXgwj%2Fimage.png?alt=media&amp;token=0adc3426-3d06-4966-9591-c3df3423a6bf" alt=""><figcaption></figcaption></figure>

In ida we can see the pseudocode for each function, for example for function Awake in `GameManager` class.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FIwbYXLzF2RAzxikklcxX%2Fimage.png?alt=media&amp;token=49b1f83e-0c00-44af-9940-2d2c6bb43224" alt=""><figcaption></figcaption></figure>

Through running the game and from the title we know that the game is about maze, in this case player put in a maze and need to find something in a maze which later we know that we need to find a `button` and `press` it.

Lets take a look on level file by [UABEA](https://github.com/nesrak1/UABEA) and click on `View Scene`.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FyDsoQXLtQAJ488S1d7iL%2Fimage.png?alt=media&amp;token=f76c7600-216a-4e5c-84ff-f6023c02351f" alt=""><figcaption></figcaption></figure>

Expanding the `m_LocalPosition` in Button Object we can see the coordinate of the Button

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FVnCd3FtiizYJmM6akeXM%2Fimage.png?alt=media&amp;token=9c39193a-c4fb-4059-872c-2d2d3abc3645" alt=""><figcaption></figcaption></figure>

Back to IDA, take a look XREF on function `GameManager_CalculateSHA256`.&#x20;

```c
void __stdcall GameManager__OnButtonPressed(
        GameManager_o *this,
        UnityEngine_Vector3_o *buttonPosition,
        const MethodInfo *method)
{
  float v3; // xmm0_4
  System_String_o *previousHash; // rsi
  System_String_o *v6; // rdi
  System_String_o *v7; // rbx
  System_String_o *v8; // rax
  System_String_o *v9; // rax
  System_String_o *v10; // rdi
  System_String_o *v11; // rbx
  System_String_o *v12; // rax
  struct System_String_o *v13; // rax
  __int64 v14; // rdx
  __int64 v15; // r8
  int v16; // eax
  __int64 v17; // rdx
  __int64 v18; // r8
  __int64 v19; // rdx
  __int64 v20; // r8
  UnityEngine_Object_o *flagText; // rbx
  UnityEngine_Component_o *v22; // rcx
  UnityEngine_GameObject_o *gameObject; // rax
  struct TMPro_TextMeshProUGUI_o *v24; // rbx
  System_String_o *v25; // rax

  if ( System_String__IsNullOrEmpty(this->fields.previousHash, 0i64) )
  {
    v10 = System_Single__ToString(v3, 0i64);
    v11 = System_Single__ToString(v3, 0i64);
    v12 = System_Single__ToString(v3, 0i64);
    v9 = System_String__Concat_6448928912(v10, v11, v12, 0i64);
  }
  else
  {
    previousHash = this->fields.previousHash;
    v6 = System_Single__ToString(v3, 0i64);
    v7 = System_Single__ToString(v3, 0i64);
    v8 = System_Single__ToString(v3, 0i64);
    v9 = System_String__Concat_6448927536(previousHash, v6, v7, v8, 0i64);
  }
  v13 = GameManager__CalculateSHA256(this, v9, 0i64);
  this->fields.previousHash = v13;
  sub_18016E9A0(&this->fields.previousHash, v13);
  v16 = this->fields.buttonsPressedCount + 1;
  this->fields.buttonsPressedCount = v16;
  if ( v16 >= this->fields.totalButtons )
  {
    if ( !byte_180F57C43 )
    {
      sub_18016F610(&UnityEngine_Object_TypeInfo, v14, v15);
      sub_18016F610(&StringLiteral_2654, v17, v18);
      sub_18016F610(&StringLiteral_5332, v19, v20);
      byte_180F57C43 = 1;
    }
    flagText = (UnityEngine_Object_o *)this->fields.flagText;
    if ( !UnityEngine_Object_TypeInfo->_2.cctor_finished )
      il2cpp_runtime_class_init();
    if ( UnityEngine_Object__op_Inequality(flagText, 0i64, 0i64) )
    {
      v22 = (UnityEngine_Component_o *)this->fields.flagText;
      if ( !v22
        || (gameObject = UnityEngine_Component__get_gameObject(v22, 0i64)) == 0i64
        || (UnityEngine_GameObject__SetActive(gameObject, 1, 0i64),
            v24 = this->fields.flagText,
            v25 = System_String__Concat_6448928912(
                    (System_String_o *)StringLiteral_2654,
                    this->fields.previousHash,
                    (System_String_o *)StringLiteral_5332,
                    0i64),
            !v24) )
      {
        sub_18016F7F0(v22);
      }
      ((void (__fastcall *)(struct TMPro_TextMeshProUGUI_o *, System_String_o *, const MethodInfo *))v24->klass->vtable._66_set_text.methodPtr)(
        v24,
        v25,
        v24->klass->vtable._66_set_text.method);
    }
    UnityEngine_Cursor__set_lockState(0, 0i64);
    UnityEngine_Cursor__set_visible(1, 0i64);
  }
}
```

From code above we can see that there is a process of converting some value to string, append it previous hash, and hash it using `SHA256`. After that it will check count of pressed button and total button then if count of pressed button greater it will show flag. Now we need to know the value of data before it hashed, to do that we can debug the program.

To debug the program we need to set the executable to yet-another-maze.exe, change it on `Debugger > process options > Application`. Set breakpoint on `0x1801D8C0C`, instruction on that address is executed if we press `e` in game.&#x20;

Scrolling down on the same function (`PlayerInteraction_Update`)&#x20;

```c
if ( UnityEngine_Physics__Raycast_6452081552(&v25, &v24, &v26, interactionDistance, 0i64) )
    {
      collider = (UnityEngine_Component_o *)UnityEngine_RaycastHit__get_collider(&v26, 0i64);
      if ( !collider )
        goto LABEL_24;
      Component_object = UnityEngine_Component__GetComponent_object_(
                           collider,
                           (const MethodInfo_23BDA0 *)Method_UnityEngine_Component_GetComponent_ButtonController___);
      if ( !UnityEngine_Object_TypeInfo->_2.cctor_finished )
        il2cpp_runtime_class_init();
      if ( UnityEngine_Object__op_Inequality((UnityEngine_Object_o *)Component_object, 0i64, 0i64) )
      {
        if ( !Component_object )
          goto LABEL_24;
        if ( !byte_7FFA2D277C41 )
        {
          sub_7FFA2C48F610(&Method_UnityEngine_Component_GetComponent_Renderer___, v17);
          sub_7FFA2C48F610(&GameManager_TypeInfo, v18);
          byte_7FFA2D277C41 = 1;
        }
        if ( !LOBYTE(Component_object[2].klass) )
        {
          LOBYTE(Component_object[2].klass) = 1;
          v19 = UnityEngine_Component__GetComponent_object_(
                  (UnityEngine_Component_o *)Component_object,
                  Method_UnityEngine_Component_GetComponent_Renderer___);
          if ( v19 )
          {
            UnityEngine_Renderer__set_sharedMaterial(
              (UnityEngine_Renderer_o *)v19,
              (UnityEngine_Material_o *)Component_object[3].klass,
              0i64);
            v20 = UnityEngine_Component__get_transform((UnityEngine_Component_o *)Component_object, 0i64);
            if ( v20 )
            {
              v21 = UnityEngine_Transform__get_position(&v24, v20, 0i64);
              playerCamera = (UnityEngine_Component_o *)GameManager_TypeInfo->static_fields->instance;
              if ( playerCamera )
              {
                v22 = *(_QWORD *)&v21->fields.x;
                v23 = v21->fields.z;
                *(_QWORD *)&v25.fields.x = v22;
                v25.fields.z = v23;
                GameManager__OnButtonPressed((GameManager_o *)playerCamera, &v25, 0i64);
                return;
              }
            }
          }
LABEL_24:
          sub_7FFA2C48F7F0(playerCamera);
        }
      }
    }
```

Code above basically check if we collide with an object and that object is a button object it will continue the process (calling `GameManager__OnButtonPressed`). Previously we've been looking at function GameManager\_\_OnButtonPressed that create hash and showing flag if all button has been pressed. So, we can utilize this process to find what string is hashed. Following is the idea to hit `GameManager__OnButtonPressed`&#x20;

* &#x20;Need to make `Component_object` is valid button object
  * We can do this by getting address of actual button component object by setting up breakpoint at `ButtonController$$Start+34`&#x20;
* Debug it to make sure `GameManager__OnButtonPressed`
  * To make debugging easier, press e while hitting a collider like a wall so we don't need to bypass the `collider` check
  * Setting up breakpoint at `PlayerInteraction$$Update+198`

During debugging process we got following values (address of button object) at breakpoint  `ButtonController$$Start+34`&#x20;

* 0000026EC1304980
* 0000026EC1304940
* 0000026EC1304900
* 0000026EC13048C0

If the execution hit breakpoint at `PlayerInteraction$$Update+198` , set rax value with one of value of button object we got, for example 0000026EC1304980. In address `PlayerInteraction$$Update+1F3` , set IP to `PlayerInteraction$$Update+1F5` then continue step in and we will hit instruction that call `GameManager__OnButtonPressed`.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F7i7B7JICLU6Igum6WFf9%2Fimage.png?alt=media&amp;token=e5f92ed6-e56a-4fe1-8844-9286bd8adb5f" alt=""><figcaption></figcaption></figure>

Next, setup breakpoint at `GameManager$$OnButtonPressed+B8` and continue the process. In second argument we can see a pointer that store value of plaintext which is `257.29461586.2037`  and from level 0 we can see that the those value is produced from the position of `Button_Object_3`

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FogYxG7yyzOkzqS8cDZk5%2Fimage.png?alt=media&amp;token=9990b8ff-ad85-41fe-b26a-739d4eac4f5a" alt=""><figcaption></figcaption></figure>

By looking at the result of hash in rax after calling the function we can see that it match with our SHA256 implementation

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FScM5FhXYZimMg3KxngGE%2Fimage.png?alt=media&amp;token=8bb6ed5e-aca8-4309-b8e2-658d965fc721" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FwnEK79rtZuhooR6m7Nwo%2Fimage.png?alt=media&amp;token=4843f8c0-f53c-4376-a83e-0133d1436ec2" alt=""><figcaption></figcaption></figure>

Let's continue to next step which is trying to press another button. Do the same flow but with different address of button object which is `0000026EC1304940`. Now we can see that the hash value is appended with a next coordinate value.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FXxJrkvRiqXaS8TKoTjFv%2Fimage.png?alt=media&amp;token=1d3fb438-70d8-4dcd-89ea-2782ae358903" alt=""><figcaption></figcaption></figure>

Continue the execution and we will see the new hash value which is same with our SHA256 implementation.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FYM700sz45rTS4zoLCqZR%2Fimage.png?alt=media&amp;token=4bff0437-8d3f-4b3c-8e7d-249f7af51569" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FyYNLdYp2SvbLHBLsZhBJ%2Fimage.png?alt=media&amp;token=bc569012-80a3-497d-a9ec-ef090a7634b4" alt=""><figcaption></figcaption></figure>

If we look at coordinate value we can see that the coordinate is the coordinate for `Button_Object_1`. With this information we can reconstruct the actual hash with correct order which is 1,2,3, and 4. Following is my script to solve the challenge.

```python
import hashlib

def conv(a1):
	return str(float(f"{a1:.7g}"))

button = [{} for i in range(5)]

button[2]['x'] = 31.07088
button[2]['y'] = 1
button[2]['z'] = 1953.2948

button[1]['x'] = 2036.4781
button[1]['y'] = 1
button[1]['z'] = 1974.1917

button[4]['x'] = 1155.5647
button[4]['y'] = 1
button[4]['z'] = 298.97897

button[3]['x'] = 257.29465
button[3]['y'] = 1
button[3]['z'] = 586.20374

button_order = [1, 2, 3, 4]

prev_hash = ""
for i in button_order:
	pt = prev_hash + conv(button[i]['x']) + str(button[i]['y']) + conv(button[i]['z'])
	h = hashlib.sha256(pt.encode()).hexdigest()
	prev_hash = h

print(f"DEAD{{{prev_hash}}}")
```

Flag: DEAD{d1b6b7f78e983bb6089645be5111e3b4626a93b3b2ee810092c9abefc0a462b1}

## magic\_in\_packets (500 pts) 🥇

### Description

This is ebee, the ultimate packet processor for ya

### Solution

Given 2 files as following

* ebee - ELF 64-bit LSB pie executable, x86-64
* prog.o - ELF 64-bit LSB relocatable, eBPF, version 1 (SYSV), not stripped

Lets decompile the ebee file using IDA, from main function we know how to run the executable

```bash
Usage: %s <ifname> <bpf_obj_file>\n
```

`bpf_obj_file` should be prog.o but what is ifname? take a look on function `sub_40102` below

<pre class="language-c"><code class="lang-c">__int64 __fastcall sub_40102(float a1, double a2, __int64 a3, __int64 a4)
{
  sigaction act; // [rsp+10h] [rbp-D0h] BYREF
  int v6; // [rsp+ACh] [rbp-34h]
  __int64 v7; // [rsp+B0h] [rbp-30h]
  int map_fd_by_name; // [rsp+B8h] [rbp-28h]
  int v9; // [rsp+BCh] [rbp-24h]
  __int64 v11; // [rsp+C8h] [rbp-18h]
  __int64 v12; // [rsp+D0h] [rbp-10h]
  char *ifname; // [rsp+D8h] [rbp-8h]

  ifname = *(char **)(a4 + 8);
  v12 = *(_QWORD *)(a4 + 16);
<strong>  dword_71878 = if_nametoindex(ifname);
</strong>  dword_7187C = 0;
  if ( dword_71878 )
  {
    memset(&#x26;act, 0, sizeof(act));
    act.sa_handler = (__sighandler_t)sub_3FFFD;
    sigaction(2, &#x26;act, 0LL);
    sigaction(15, &#x26;act, 0LL);
<strong>    v11 = bpf_object__open(v12);
</strong>    if ( v11 )
    {
      if ( (unsigned int)bpf_object__load(v11) )
      {
        perror("bpf_object__load");
        std::operator&#x3C;&#x3C;&#x3C;std::char_traits&#x3C;char>>(&#x26;std::cerr, "failed to load the eBPF program\n");
        return 1LL;
      }
<strong>      else if ( bpf_object__find_program_by_name(v11, (__int64)"check_packets") )
</strong>      {
        v9 = bpf_program(a1, a2);
        if ( v9 >= 0 )
        {
<strong>          if ( (unsigned int)bpf_xdp_attach((unsigned int)dword_71878, (unsigned int)v9, (unsigned int)dword_7187C, 0LL) )
</strong>          {
            std::operator&#x3C;&#x3C;&#x3C;std::char_traits&#x3C;char>>(&#x26;std::cerr, "failed to attach the program to network interface\n");
            return 1LL;
          }
          else
          {
            map_fd_by_name = bpf_object__find_map_fd_by_name(v11, "ebee_map");
            if ( map_fd_by_name >= 0 )
            {
              v7 = ring_buffer__new((unsigned int)map_fd_by_name, sub_40076, 0LL, 0LL);
              if ( v7 )
              {
                while ( 1 )
                {
                  v6 = ring_buffer__consume(v7);
                  if ( v6 &#x3C; 0 )
                    break;
                  sleep(1u);
                }
                std::operator&#x3C;&#x3C;&#x3C;std::char_traits&#x3C;char>>(&#x26;std::cerr, "ring_buffer__consume error\n");
                return 0LL;
              }
              else
              {
                std::operator&#x3C;&#x3C;&#x3C;std::char_traits&#x3C;char>>(&#x26;std::cerr, "failed to create the ring buffer\n");
                return 1LL;
              }
            }
            else
            {
              perror("bpf_object__find_map_fd_by_name");
              std::operator&#x3C;&#x3C;&#x3C;std::char_traits&#x3C;char>>(&#x26;std::cerr, "failed to find the file descriptor of ebee_map\n");
              return 1LL;
            }
          }
        }
        else
        {
          perror("bpf_program__fd");
          std::operator&#x3C;&#x3C;&#x3C;std::char_traits&#x3C;char>>(
            &#x26;std::cerr,
            "failed to retrieve the file descriptor of the eBPF program\n");
          return 1LL;
        }
      }
      else
      {
        std::operator&#x3C;&#x3C;&#x3C;std::char_traits&#x3C;char>>(&#x26;std::cerr, "failed to open the XDP program\n");
        return 1LL;
      }
    }
    else
    {
      std::operator&#x3C;&#x3C;&#x3C;std::char_traits&#x3C;char>>(&#x26;std::cerr, "failed to open the eBPF object file\n");
      return 1LL;
    }
  }
  else
  {
    perror("if_nametoindex");
    return 1LL;
  }
}
</code></pre>

* `ifname` passed to `if_nametoindex`, so ifname is network interface name.
  * We can see list of interface name by using linux command such as ifconfig, ip a, etc
* bpf program (prog.o) loaded and then the ebee program will find `check_packets` function
* ebee will attach function `check_packets` to network interface that we passed before through argument
* `check_packets` will process packet that has been sent to the interface and then ebee program will check if there is `ebeep_map`
  * if yes, it will create new ring buffer and execute the callback function which is `sub_40076`

So we need to know what check\_packets do first, we can dump the instruction using `llvm-objdump`

```bash
llvm-objdump -S --no-show-raw-insn prog.o
```

```nasm
prog.o: file format elf64-bpf

Disassembly of section xdp:

0000000000000000 <check_packets>:
;   void *data_end = (void *)(long)ctx->data_end;
       0:       r2 = *(u32 *)(r1 + 0x4)
;   void *data = (void *)(long)ctx->data;
       1:       r1 = *(u32 *)(r1 + 0x0)
;   if (data + ip_header_offset > data_end) {
       2:       r7 = r1
       3:       r7 += 0xe
;   if (data + ip_header_offset > data_end) {
       4:       if r7 > r2 goto +0x5e <check_packets+0x318>
;   unsigned short h_proto = eth->h_proto;
       5:       r1 = *(u16 *)(r1 + 0xc)
;   if (h_proto != htons(ETH_P_IP)) {
       6:       if r1 != 0x8 goto +0x5c <check_packets+0x318>
       7:       r1 = 0x14
       8:       r3 = r7
       9:       r3 += r1
;   if ((void *)&ip_header[1] > data_end) {
      10:       if r3 > r2 goto +0x58 <check_packets+0x318>
;   if (ip_header->protocol != IPPROTO_UDP) {
      11:       r1 = *(u8 *)(r7 + 0x9)
      12:       if r1 != 0x11 goto +0x56 <check_packets+0x318>
;   struct udphdr *udp = (void *)ip_header + ip_header->ihl * 4;
      13:       r1 = *(u8 *)(r7 + 0x0)
      14:       r1 <<= 0x2
      15:       r1 &= 0x3c
;   struct udphdr *udp = (void *)ip_header + ip_header->ihl * 4;
      16:       r7 += r1
;   if ((void *)(udp + 1) > data_end) {
      17:       r6 = r7
      18:       r6 += 0x8
;   if ((void *)(udp + 1) > data_end) {
      19:       if r6 > r2 goto +0x4f <check_packets+0x318>
;   unsigned short port = __builtin_bswap16(udp->dest);
      20:       r8 = *(u16 *)(r7 + 0x2)
;   if (payload + 20 <= (unsigned char *)data_end) {
      21:       r1 = r7
      22:       r1 += 0x1c
;   if (payload + 20 <= (unsigned char *)data_end) {
      23:       if r1 > r2 goto +0x4b <check_packets+0x318>
;         bpf_ringbuf_reserve(&ebee_map, sizeof(struct ebee_event), 0);
      24:       r1 = 0x0 ll
      26:       r2 = 0x18
      27:       r3 = 0x0
      28:       call 0x83
;     if (!evt) {
      29:       if r0 != 0x0 goto +0x5 <check_packets+0x118>
;       bpf_printk("failed to allocate memory for the ring buffer");
      30:       r1 = 0x0 ll
      32:       r2 = 0x2e
      33:       call 0x6
;       return XDP_PASS;
      34:       goto +0x40 <check_packets+0x318>
      35:       r8 = be16 r8
      36:       r1 = 0x14
;     evt->size = 20;
      37:       *(u32 *)(r0 + 0x14) = r1
;     if ((payload[6] ^ port) == 8143) {
      38:       r1 = *(u8 *)(r7 + 0xe)
      39:       r8 ^= r1
      40:       if r8 != 0x1fcf goto +0x37 <check_packets+0x300>
;       if (((payload[7] + payload[8]) != 130) &&
      41:       r2 = *(u8 *)(r7 + 0xf)
      42:       r1 = *(u8 *)(r7 + 0x10)
      43:       r3 = r1
      44:       r3 += r2
;       if (((payload[7] + payload[8]) != 130) &&
      45:       if r3 == 0x82 goto +0x2 <check_packets+0x180>
      46:       r1 -= r2
      47:       if r1 != 0x1a goto +0x30 <check_packets+0x300>
;       if (payload[10] != 95) {
      48:       r1 = *(u8 *)(r7 + 0x12)
      49:       if r1 != 0x5f goto +0x2e <check_packets+0x300>
;       if ((payload[9] + payload[10]) != 163) {
      50:       r1 = *(u8 *)(r7 + 0x11)
      51:       if r1 != 0x44 goto +0x2c <check_packets+0x300>
;       __builtin_memcpy(evt->payload, payload, 20);
      52:       r1 = *(u8 *)(r6 + 0x13)
      53:       *(u8 *)(r0 + 0x13) = r1
      54:       r1 = *(u8 *)(r6 + 0x12)
      55:       *(u8 *)(r0 + 0x12) = r1
      56:       r1 = *(u8 *)(r6 + 0x11)
      57:       *(u8 *)(r0 + 0x11) = r1
      58:       r1 = *(u8 *)(r6 + 0x10)
      59:       *(u8 *)(r0 + 0x10) = r1
      60:       r1 = *(u8 *)(r6 + 0xf)
      61:       *(u8 *)(r0 + 0xf) = r1
      62:       r1 = *(u8 *)(r6 + 0xe)
      63:       *(u8 *)(r0 + 0xe) = r1
      64:       r1 = *(u8 *)(r6 + 0xd)
      65:       *(u8 *)(r0 + 0xd) = r1
      66:       r1 = *(u8 *)(r6 + 0xc)
      67:       *(u8 *)(r0 + 0xc) = r1
      68:       r1 = *(u8 *)(r6 + 0xb)
      69:       *(u8 *)(r0 + 0xb) = r1
      70:       r1 = *(u8 *)(r6 + 0xa)
      71:       *(u8 *)(r0 + 0xa) = r1
      72:       r1 = *(u8 *)(r6 + 0x9)
      73:       *(u8 *)(r0 + 0x9) = r1
      74:       r1 = *(u8 *)(r6 + 0x8)
      75:       *(u8 *)(r0 + 0x8) = r1
      76:       r1 = *(u8 *)(r6 + 0x7)
      77:       *(u8 *)(r0 + 0x7) = r1
      78:       r1 = *(u8 *)(r6 + 0x6)
      79:       *(u8 *)(r0 + 0x6) = r1
      80:       r1 = *(u8 *)(r6 + 0x5)
      81:       *(u8 *)(r0 + 0x5) = r1
      82:       r1 = *(u8 *)(r6 + 0x4)
      83:       *(u8 *)(r0 + 0x4) = r1
      84:       r1 = *(u8 *)(r6 + 0x3)
      85:       *(u8 *)(r0 + 0x3) = r1
      86:       r1 = *(u8 *)(r6 + 0x2)
      87:       *(u8 *)(r0 + 0x2) = r1
      88:       r1 = *(u8 *)(r6 + 0x1)
      89:       *(u8 *)(r0 + 0x1) = r1
      90:       r1 = *(u8 *)(r6 + 0x0)
      91:       *(u8 *)(r0 + 0x0) = r1
;       bpf_ringbuf_submit(evt, 0);
      92:       r1 = r0
      93:       r2 = 0x0
      94:       call 0x84
;       return XDP_PASS;
      95:       goto +0x3 <check_packets+0x318>
;     bpf_ringbuf_discard(evt, 0);
      96:       r1 = r0
      97:       r2 = 0x0
      98:       call 0x85
; }
      99:       r0 = 0x2
     100:       exit
```

We can see the original code as following

```c
   void *data_end = (void *)(long)ctx->data_end;
   void *data = (void *)(long)ctx->data;
   if (data + ip_header_offset > data_end) {
   if (data + ip_header_offset > data_end) {
   unsigned short h_proto = eth->h_proto;
   if (h_proto != htons(ETH_P_IP)) {
   if ((void *)&ip_header[1] > data_end) {
   if (ip_header->protocol != IPPROTO_UDP) {
   struct udphdr *udp = (void *)ip_header + ip_header->ihl * 4;
   struct udphdr *udp = (void *)ip_header + ip_header->ihl * 4;
   if ((void *)(udp + 1) > data_end) {
   if ((void *)(udp + 1) > data_end) {
   unsigned short port = __builtin_bswap16(udp->dest);
   if (payload + 20 <= (unsigned char *)data_end) {
   if (payload + 20 <= (unsigned char *)data_end) {
         bpf_ringbuf_reserve(&ebee_map, sizeof(struct ebee_event), 0);
     if (!evt) {
       bpf_printk("failed to allocate memory for the ring buffer");
       return XDP_PASS;
     evt->size = 20;
     if ((payload[6] ^ port) == 8143) {
       if (((payload[7] + payload[8]) != 130) &&
       if (((payload[7] + payload[8]) != 130) &&
       if (payload[10] != 95) {
       if ((payload[9] + payload[10]) != 163) {
       __builtin_memcpy(evt->payload, payload, 20);
       bpf_ringbuf_submit(evt, 0);
       return XDP_PASS;
     bpf_ringbuf_discard(evt, 0);
 }
```

* Ensure that the packet use UDP protocol
* Ensure that the length of payload <= 20
* And some packet validation as following
  * payload\[6] ^ port == 8143
  * payload\[7] + payload\[8] == 130
  * payload\[9] + payload\[10] == 163
  * payload\[10] == 96

We can easily found value for packet validation by hand, let's create script to send the packet.

{% code title="client.py" %}

```python
import socket

class PacketSender:
    def __init__(self, target_ip: str):
        self.target_ip = target_ip
        
    def send_packet(self, payload: bytes):        
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.sendto(payload, (self.target_ip, self.target_port))
            sock.close()
            
        except Exception as e:
            print(f"Err: {e}")
    
    def create_payload(self, target_port: int) -> bytes:
        self.target_port = target_port
        length = 20
        payload = bytearray(length)

        payload[0] = ord('A')
        payload[1] = ord('B')
        payload[2] = ord('C')
        payload[3] = ord('D')

        payload[4] = ord('E')
        payload[5] = ord('F')
        
        # payload[6] ^ target_port == 8143
        payload[6] = target_port ^ 8143
        
        # payload[7] + payload[8] == 130
        payload[7] = ord('A')
        payload[8] = 130 - payload[7]
        
        # payload[10] == 95
        # payload[9] + payload[10] == 163
        payload[10] = 95  # 0x5f
        payload[9] = 163 - payload[10]
        
        # junk for now
        for i in range(11, length):
            payload[i] = ord('A') + i - 11
        
        return bytes(payload)
    
target_ip = "192.168.137.250"
target_port = 8000

sender = PacketSender(target_ip)
payload = sender.create_payload(target_port)
sender.send_packet(payload)
```

{% endcode %}

Setup breakpoint at callback function and run the program (use root privilege)

```bash
gef➤  pie b 0x40076
gef➤  pie run ens33 prog.o
```

After running `client.py`, program will hit breakpoint at `callback function`. So for the next step we can focus on callback function. Callback function is complicated, my first approach is to find instruction that make the return false or compare instruction. From several function called in beginning of function we notice that there is `LLVM` and `JIT` initialization, so there will be dynamic code compilation and execution. To make writeup easier to read i'll divide the validation on several part.

* a1 = input

#### First Validation

<pre class="language-c"><code class="lang-c">  storage = maybe_get_storage((__int64)v25);
  val_from_a1 = get_val_from_a1(storage);
  sub_9717((__int64)v27, val_from_a1);
  v5 = maybe_get_storage((__int64)v25);
  v6 = get_val_from_a1(v5);
  sub_9844((__int64)v27, v6);
  v7 = maybe_get_storage((__int64)v25);
  v8 = get_val_from_a1(v7);
  sub_9971((__int64)v27, v8);
  v411 = "nekochan";
  dest = calloc(1uLL, a2);
  for ( i = 0; i &#x3C;= 3; ++i )
<strong>    *((_BYTE *)dest + i) = *(_BYTE *)(i + 4LL + input) ^ *(_BYTE *)(i + input);
</strong>  v9 = maybe_get_storage((__int64)v25);
  v10 = get_val_from_a1(v9);
  if ( (unsigned int)crc32(v10, (__int64)dest, 4u) != 0xFEB9A9BE )
    var_fail_1 = 1;
</code></pre>

First validation will do xor process for input\[:4] and input\[4:8] then it will hash the result using crc32. Then crc32 hash will be compared with `0xFEB9A9BE`. Following is `crc32` function

<pre class="language-c"><code class="lang-c">__int64 __fastcall crc32(__int64 a1, __int64 plaintext, unsigned int a3)
{
  __int64 v3; // r8
  __int64 v4; // r9
  std::runtime_error *exception; // rbx
  __int64 v8; // [rsp+28h] [rbp-48h] BYREF
  _BYTE v9[16]; // [rsp+30h] [rbp-40h] BYREF
  const char *v10[3]; // [rsp+40h] [rbp-30h] BYREF
  __int64 (__fastcall *v11)(__int64, _QWORD); // [rsp+58h] [rbp-18h]

  sub_10BCC(v10, "t1");
  sub_14024((__int64)v9, a1, (__int64)v10[0], (__int64)v10[1], v3, v4);
  v8 = *(_QWORD *)sub_1BEAC((__int64)v9);
  sub_19E48((__int64)v9);
  if ( !check_null(&#x26;v8) )
  {
    exception = (std::runtime_error *)__cxa_allocate_exception(0x10uLL);
    std::runtime_error::runtime_error(exception, "nah");
    __cxa_throw(
      exception,
      (struct type_info *)&#x26;`typeinfo for'std::runtime_error,
      (void (*)(void *))&#x26;std::runtime_error::~runtime_error);
  }
  v11 = (__int64 (__fastcall *)(__int64, _QWORD))get_asm((__int64)&#x26;v8);
<strong>  return v11(plaintext, a3);
</strong>}
</code></pre>

&#x20;So there is lookup process for specific code in JIT by using key `t1` and we know that the code will be in `v11` since v11 is called in above function. Setting up breakpoint on `0x96DA` and step in.

```bash
gef➤  pie b 0x96DA
```

Looks like the code are obfuscated

```nasm
gef➤  x/20i $pc
=> 0x7fffeffcd000:      endbr64
   0x7fffeffcd004:      push   rbp
   0x7fffeffcd005:      mov    rbp,rsp
   0x7fffeffcd008:      sub    rsp,0x20
   0x7fffeffcd00c:      movabs rax,0x48ffff08ebd82667
   0x7fffeffcd016:      xor    eax,eax
   0x7fffeffcd018:      jmp    0x7fffeffcd011
   0x7fffeffcd01a:      call   0x80002a788867
   0x7fffeffcd01f:      (bad)
   0x7fffeffcd020:      jmp    0x7fffeffcd02a
   0x7fffeffcd022:      (bad)
   0x7fffeffcd023:      dec    DWORD PTR [rax+0x31]
   0x7fffeffcd026:      shr    bl,0xf7
   0x7fffeffcd029:      call   0x7fff796b8876
   0x7fffeffcd02e:      jae    0x7fffeffcd01b
   0x7fffeffcd030:      or     bh,bh
   0x7fffeffcd032:      dec    DWORD PTR [rax+0x31]
   0x7fffeffcd035:      shr    bl,0xf7
   0x7fffeffcd038:      call   0x7fffc6618885
   0x7fffeffcd03d:      cmps   DWORD PTR ds:[rsi],DWORD PTR es:[rdi]
```

Previously i've been facing control flow obfuscation about `tail call` and `dead code`, and `binary ninja` can automatically defeat it. So i decide to dump the whole instruction and opening it in binary ninja.

{% code title="dump.py" %}

```python
#!/usr/bin/python3

class SolverEquation(gdb.Command):
    def __init__ (self):
        super (SolverEquation, self).__init__ ("dump-file",gdb.COMMAND_OBSCURE)

    def invoke (self, arg, from_tty):
        start = 0x7fffeffcd000
        end = 0x7fffeffcd646
        filename = "func1.bin"
        gdb.execute(f"dump binary memory {filename} {start} {end}")

def addr2num(addr):
    try:
        return int(addr)
    except:
        return long(addr)

SolverEquation()
```

{% endcode %}

Call it using following command

```bash
gef➤  source dump.py
gef➤  dump-file
```

Following is decompiled result from binary ninja

```c
-------------SNIPPET-------------
0000017b            (uint8_t)rdx_2 = var_28[(int64_t)var_10];
000001b7            var_c ^= (uint32_t)(uint8_t)rdx_2;
000001ba            int32_t var_14_1 = 7;
000001d0            *(uint32_t*)rcx_2 = 2;
000001d0            
00000218            while (true)
00000218            {
00000218                void* rcx_4 = &rsp[-2];
0000021c                rsp = rcx_4;
0000022e                *(uint32_t*)rcx_4 = 1;
00000252                int32_t rsi_2;
00000252                
00000252                while (true)
00000252                {
00000252                    rsi_2 = *(uint32_t*)rcx_4;
00000252                    
00000266                    if (!rsi_2)
00000266                        goto label_3bc;
00000266                    
0000043f                    if (rsi_2 == 1)
00000478                        *(uint32_t*)rcx_4 = 2;
0000043f                    else
0000043f                    {
00000448                        if (rsi_2 != 2)
00000448                            break;
00000448                        
000004d1                        if (var_14_1 < 0)
00000535                            *(uint32_t*)rcx_4 = 0;
000004d1                        else
000004f1                            *(uint32_t*)rcx_4 = 3;
0000043f                    }
00000252                }
00000252                
0000044f                if (rsi_2 != 3)
0000044f                    break;
0000044f                
000002f7                var_c = var_c >> 1 ^ ((0 - (var_c & 1)) & 0xedb88320);
00000309                *(uint32_t*)rcx_4 = 2;
0000035a                var_14_1 = (var_14_1 ^ 0xffffffff) + ((var_14_1 & 0xffffffff) << 1);
00000218            }
00000218            
000003bc        label_3bc:
000003bc            var_10 = (var_10 ^ 1) + ((var_10 & 1) << 1);
000000ed        }
00000004    }
```

From the constant and operation we can see that it is `crc32` function, we can confirm it by checking the output from `v11` call and our `crc32` function

```python
from pwn import xor
import zlib

inp = b"ABCDEF\x8fA"
print(hex(zlib.crc32(xor(inp[:4], inp[4:8]))))
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Ff5Mpft5m48YfdMs1xhec%2Fimage.png?alt=media&amp;token=6933252d-9060-4adc-8368-0c4162610167" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FRkFAKOJ6chNPndAeGTwo%2Fimage.png?alt=media&amp;token=45d2bb1b-9f82-4a29-a923-b799fd7264cc" alt=""><figcaption></figcaption></figure>

From the first 8 bytes value we don't know the actual value but we only know the hash of xored first 4 bytes and second 4 bytes. We can `bruteforce` 4 bytes actually but it still the result of xored value so i decide to continue the execution to see next validation.

```bash
gef➤  pie b 0x9CC1
gef➤  c
gef➤  set $eax=0xfeb9a9be
```

#### Second Validation

Scrolling down callback function we will see following of code

<pre class="language-c"><code class="lang-c">-------------SNIPPET-------------
  memcpy(dest, (const void *)input, 6uLL);
  v11 = maybe_get_storage((__int64)v25);
  v12 = get_val_from_a1(v11);
  v13 = sub_8EEB(v12);
  v14 = maybe_get_storage((__int64)v25);
  v15 = get_val_from_a1(v14);
<strong>  sub_8FEC((__int64)v24, v15, (__int64)dest, v13, 6u);
</strong><strong>  if ( !sub_8B52(v24) )
</strong>    var_fail_1 = 1;
  if ( var_fail_1 )
  {
    v16 = (std::runtime_error *)__cxa_allocate_exception(0x10uLL);
    std::runtime_error::runtime_error(v16, "nahh");
    __cxa_throw(
      v16,
      (struct type_info *)&#x26;`typeinfo for'std::runtime_error,
      (void (*)(void *))&#x26;std::runtime_error::~runtime_error);
  }
-------------SNIPPET-------------
</code></pre>

Second validation lies at function `sub_8FEC` and `sub_8B52`.

```c
__int64 __fastcall sub_8FEC(__int64 a1, __int64 a2, __int64 a3, __int64 a4, unsigned int a5)
{
  std::runtime_error *exception; // rbx
  void (__fastcall *v6)(__int64, __int64, __int64, _QWORD); // rbx
  __int64 v7; // rax
  __int64 v12; // [rsp+38h] [rbp-48h] BYREF
  _BYTE v13[16]; // [rsp+40h] [rbp-40h] BYREF
  _QWORD v14[3]; // [rsp+50h] [rbp-30h] BYREF
  __int64 v15; // [rsp+68h] [rbp-18h]

  *(_OWORD *)a1 = 0LL;
  *(_QWORD *)(a1 + 16) = 0LL;
  sub_1C11E(a1, (int)a5);
  sub_10BCC(v14, "t2");
  sub_14024(v13, a2, v14[0], v14[1]);
  v12 = *(_QWORD *)sub_1BEAC(v13);
  sub_19E48(v13);
  if ( (unsigned __int8)check_null(&v12) != 1 )
  {
    exception = (std::runtime_error *)__cxa_allocate_exception(0x10uLL);
    std::runtime_error::runtime_error(exception, "nah");
    __cxa_throw(
      exception,
      (struct type_info *)&`typeinfo for'std::runtime_error,
      (void (*)(void *))&std::runtime_error::~runtime_error);
  }
  v15 = get_asm(&v12);
  v6 = (void (__fastcall *)(__int64, __int64, __int64, _QWORD))v15;
  v7 = sub_185AE(a1);
  v6(a4, a3, v7, a5);
  return a1;
}
```

So the JIT code will be on v6, breakpoint at `0x9107` and dump the code.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FQGG0muiJCEaOn6WJp2Nu%2Fimage.png?alt=media&amp;token=32eeadb0-697b-4f80-ab74-52006bc692a3" alt=""><figcaption></figcaption></figure>

From the argument we also can see that it process first 6 bytes value and looking at the instruction it looks like calling another function. So for this code i decide to dump specific region of memory, run `vmmap` command and we can see following address (near `rbx` value)

```
-------------SNIPPET-------------
0x00007ffff0213000 0x00007ffff0214000 0x0000000000000000 r-x
-------------SNIPPET-------------
```

Dump it using the previous script (dump.py)

```python
start = 0x00007ffff0213000
end = 0x00007ffff0214000
filename = "func2.bin"
```

Open it using binary ninja

```c
-------------SNIPPET-------------
000003c3                int32_t rcx_1 = *(arg6 - 0x14)
0000040c                char* rdx_1
0000040c                rdx_1.b = (*(arg6 - 0x20))[sx.q(*(arg6 - 0xc))]
0000041e                uint32_t rdx_2 = zx.d(rdx_1.b)
00000438                int32_t rsi_4 = (rcx_1 ^ rdx_2) + ((rcx_1 & rdx_2) << 1)
00000486                int64_t rcx_5
00000486                rcx_5.b =
00000486                    (*(arg6 - 0x30))[sx.q(mods.dp.d(sx.q(*(arg6 - 0xc)), *(arg6 - 0x24)))]
00000498                int32_t rax_24 = sx.d(rcx_5.b)
000004cd                *(arg6 - 0x14) =
000004cd                    mods.dp.d(sx.q((rsi_4 ^ rax_24) + ((rsi_4 & rax_24) << 1)), 0x100)
00000533                j_sub_4(*(arg6 - 0x20) + sx.q(*(arg6 - 0xc)), 
00000533                    *(arg6 - 0x20) + sx.q(*(arg6 - 0x14)))
00000538                *arg5 = 2
0000056b                int32_t rcx_10 = *(arg6 - 0xc)
00000598                *(arg6 - 0xc) = (rcx_10 ^ 1) + ((rcx_10 & 1) << 1)
00000328                rcx = *(arg6 - 0xc)
0000034c                int32_t* rsp
0000034c                arg5 = &rsp[-4]
00000350                rsp = arg5
00000353                *arg5 = 1
-------------SNIPPET-------------
```

Function looks like obfuscated `rc4`, to make sure we can set hardware breakpoint on our input and continue the execution.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FPSk8njpNijjC3VE56pvv%2Fimage.png?alt=media&amp;token=dadbaf72-3e00-483f-b4ac-89b9a0533811" alt=""><figcaption></figcaption></figure>

```
gef➤  rwatch *0x55555577ba10
Hardware read watchpoin`t 13: *0x55555577ba10
gef➤  c
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FNE8YDU6ucLEkFuXAvOpI%2Fimage.png?alt=media&amp;token=2384c2a7-8189-4741-b8bd-199c3b361a44" alt=""><figcaption></figcaption></figure>

Setup new breakpoint at `0x8C3F` and continue the process and we can see that the value compared is the xored value of previous instruction (`xor ecx, eax`).

By repeating the same process with different value of input we can see that the `ecx` value still same this indicating that the keystream is static. From this information we can get the correct plaintext by xoring plaintext, ciphertext, and compare values.

```
gef➤  pie b 0x8C3F
gef➤  c
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fp0LWzgAqex0RoAgYw8hd%2Fimage.png?alt=media&amp;token=b141dee8-a6b8-4c71-b95f-501b7e275289" alt=""><figcaption></figcaption></figure>

```python
>>> long_to_bytes(0xfdde33974f4f ^ 0xffa823a03c64 ^ bytes_to_long(b"ABCDEF"[::-1]))[::-1]
b'j1tT3D'
```

Now we know the first 6 bytes value is `j1tT3D`. In first validation it process first 8 bytes and until this step only 2 bytes are unknown so we can bruteforce those 2 bytes.

```python
import zlib
import string

payload = [0 for _ in range(8)]
payload[0] = ord('j')
payload[1] = ord('1')
payload[2] = ord('t')
payload[3] = ord('T')
payload[4] = ord('3')
payload[5] = ord('D')

result = [0 for _ in range(4)]

for i in string.printable[:-6]:
	for j in string.printable[:-6]:
		payload[6] = ord(i)
		payload[7] = ord(j)
		result[0] = payload[0] ^ payload[4] 
		result[1] = payload[1] ^ payload[5] 
		result[2] = payload[2] ^ payload[6] 
		result[3] = payload[3] ^ payload[7] 
		if zlib.crc32(bytes(result)) == 0xFEB9A9BE:
			print(bytes(payload))
```

We got the valid 8 bytes which is `j1tT3D_4` . Because we know the value of payload\[6] which is 95 so we can get the correct target\_port which is 8143^95 == 8080. Until this step we already found following value `j1tT3D_4ND_` .

#### Third Validation

Third validation more complicated than first and second validation, following is the code

```c
  memcpy(dest, (const void *)(input + 11), 9uLL);// last check
  initialize_func(v23);
  v29 = 150;
  sub_1C322((__int64)v28, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v29);// or
  process_func_1(v23, (__int64)v28);
  std::string::~string(v28);
  v31 = 96;
  sub_1C322((__int64)v30, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v31);
  process_func_1(v23, (__int64)v30);
  std::string::~string(v30);
  v409 = &v33;
  sub_1410A((__int64)v32, (__int64)"5066f217-6223-487e-8e05-96eb1229a680", (__int64)&v33);
  process_func_1(v23, (__int64)v32);
  std::string::~string(v32);
  v35 = 150;
  sub_1C322((__int64)v34, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v35);
  process_func_1(v23, (__int64)v34);
  std::string::~string(v34);
  v37 = 96;
  sub_1C322((__int64)v36, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v37);
  process_func_1(v23, (__int64)v36);
  std::string::~string(v36);
  v408 = &v39;
  sub_1410A((__int64)v38, (__int64)"439b9ed2-ce85-4880-b8aa-9e2081c76769", (__int64)&v39);
  process_func_1(v23, (__int64)v38);
  std::string::~string(v38);
  v407 = &v41;
  sub_1410A((__int64)v40, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v41);
  process_func_1(v23, (__int64)v40);
  std::string::~string(v40);
  v43 = 5;
  sub_1C322((__int64)v42, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v43);
  process_func_1(v23, (__int64)v42);
  std::string::~string(v42);
  v45 = 6;
  sub_1C322((__int64)v44, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v45);
  process_func_1(v23, (__int64)v44);
  std::string::~string(v44);
  v406 = &v47;
  sub_1410A((__int64)v46, (__int64)"5066f217-6223-487e-8e05-96eb1229a680", (__int64)&v47);
  process_func_1(v23, (__int64)v46);
  std::string::~string(v46);
  v49 = 5;
  sub_1C322((__int64)v48, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v49);
  process_func_1(v23, (__int64)v48);
  std::string::~string(v48);
  v51 = 6;
  sub_1C322((__int64)v50, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v51);
  process_func_1(v23, (__int64)v50);
  std::string::~string(v50);
  v405 = &v53;
  sub_1410A((__int64)v52, (__int64)"439b9ed2-ce85-4880-b8aa-9e2081c76769", (__int64)&v53);
  process_func_1(v23, (__int64)v52);
  std::string::~string(v52);
  v404 = &v55;
  sub_1410A((__int64)v54, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v55);
  process_func_1(v23, (__int64)v54);
  std::string::~string(v54);
  sub_1C3DA(v56, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", dest);
  process_func_1(v23, (__int64)v56);
  std::string::~string(v56);
  v403 = &v58;
  sub_1410A((__int64)v57, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v58);
  process_func_1(v23, (__int64)v57);
  std::string::~string(v57);
  sub_1C3DA(v59, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", (char *)dest + 1);
  process_func_1(v23, (__int64)v59);
  std::string::~string(v59);
  v61 = -10;
  sub_1C322((__int64)v60, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v61);
  process_func_1(v23, (__int64)v60);
  std::string::~string(v60);
  v402 = &v63;
  sub_1410A((__int64)v62, (__int64)"470f2241-b469-468b-afeb-d5e5309ca6c8", (__int64)&v63);
  process_func_1(v23, (__int64)v62);
  std::string::~string(v62);
  sub_1C3DA(v64, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", (char *)dest + 1);
  process_func_1(v23, (__int64)v64);
  std::string::~string(v64);
  v66 = -10;
  sub_1C322((__int64)v65, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v66);
  process_func_1(v23, (__int64)v65);
  std::string::~string(v65);
  v401 = &v68;
  sub_1410A((__int64)v67, (__int64)"5066f217-6223-487e-8e05-96eb1229a680", (__int64)&v68);
  process_func_1(v23, (__int64)v67);
  std::string::~string(v67);
  v70 = 2;
  sub_1C322((__int64)v69, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v70);
  process_func_1(v23, (__int64)v69);
  std::string::~string(v69);
  v400 = &v72;
  sub_1410A((__int64)v71, (__int64)"48cc495b-5b7a-443c-abf9-9b0ae63bd723", (__int64)&v72);
  process_func_1(v23, (__int64)v71);
  std::string::~string(v71);
  v399 = &v74;
  sub_1410A((__int64)v73, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v74);
  process_func_1(v23, (__int64)v73);
  std::string::~string(v73);
  v76 = 72;
  sub_1C322((__int64)v75, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v76);
  process_func_1(v23, (__int64)v75);
  std::string::~string(v75);
  v398 = &v78;
  sub_1410A((__int64)v77, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v78);
  process_func_1(v23, (__int64)v77);
  std::string::~string(v77);
  v397 = &v80;
  sub_1410A((__int64)v79, (__int64)"57479ca5-787a-420f-b374-9eb0108deb64", (__int64)&v80);
  process_func_1(v23, (__int64)v79);
  std::string::~string(v79);
  v396 = &v82;
  sub_1410A((__int64)v81, (__int64)"57219a35-4dc4-4f5a-aaab-f17bad611232", (__int64)&v82);
  process_func_1(v23, (__int64)v81);
  std::string::~string(v81);
  sub_1C3DA(v83, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", (char *)dest + 1);
  process_func_1(v23, (__int64)v83);
  std::string::~string(v83);
  v85 = -2;
  sub_1C322((__int64)v84, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v85);
  process_func_1(v23, (__int64)v84);
  std::string::~string(v84);
  v395 = &v87;
  sub_1410A((__int64)v86, (__int64)"470f2241-b469-468b-afeb-d5e5309ca6c8", (__int64)&v87);
  process_func_1(v23, (__int64)v86);
  std::string::~string(v86);
  sub_1C3DA(v88, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", (char *)dest + 1);
  process_func_1(v23, (__int64)v88);
  std::string::~string(v88);
  v90 = -2;
  sub_1C322((__int64)v89, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v90);
  process_func_1(v23, (__int64)v89);
  std::string::~string(v89);
  v394 = &v92;
  sub_1410A((__int64)v91, (__int64)"5066f217-6223-487e-8e05-96eb1229a680", (__int64)&v92);
  process_func_1(v23, (__int64)v91);
  std::string::~string(v91);
  v94 = 2;
  sub_1C322((__int64)v93, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v94);
  process_func_1(v23, (__int64)v93);
  std::string::~string(v93);
  v393 = &v96;
  sub_1410A((__int64)v95, (__int64)"48cc495b-5b7a-443c-abf9-9b0ae63bd723", (__int64)&v96);
  process_func_1(v23, (__int64)v95);
  std::string::~string(v95);
  v392 = &v98;
  sub_1410A((__int64)v97, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v98);
  process_func_1(v23, (__int64)v97);
  std::string::~string(v97);
  v100 = 200;
  sub_1C322((__int64)v99, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v100);
  process_func_1(v23, (__int64)v99);
  std::string::~string(v99);
  v391 = &v102;
  sub_1410A((__int64)v101, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v102);
  process_func_1(v23, (__int64)v101);
  std::string::~string(v101);
  v390 = &v104;
  sub_1410A((__int64)v103, (__int64)"57479ca5-787a-420f-b374-9eb0108deb64", (__int64)&v104);
  process_func_1(v23, (__int64)v103);
  std::string::~string(v103);
  v389 = &v106;
  sub_1410A((__int64)v105, (__int64)"57219a35-4dc4-4f5a-aaab-f17bad611232", (__int64)&v106);
  process_func_1(v23, (__int64)v105);
  std::string::~string(v105);
  v108 = 11;
  sub_1C322((__int64)v107, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v108);
  process_func_1(v23, (__int64)v107);
  std::string::~string(v107);
  sub_1C3DA(v109, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", (char *)dest + 2);
  process_func_1(v23, (__int64)v109);
  std::string::~string(v109);
  v111 = 11;
  sub_1C322((__int64)v110, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v111);
  process_func_1(v23, (__int64)v110);
  std::string::~string(v110);
  v388 = &v113;
  sub_1410A((__int64)v112, (__int64)"439b9ed2-ce85-4880-b8aa-9e2081c76769", (__int64)&v113);
  process_func_1(v23, (__int64)v112);
  std::string::~string(v112);
  sub_1C3DA(v114, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", (char *)dest + 2);
  process_func_1(v23, (__int64)v114);
  std::string::~string(v114);
  v116 = 11;
  sub_1C322((__int64)v115, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v116);
  process_func_1(v23, (__int64)v115);
  std::string::~string(v115);
  v387 = &v118;
  sub_1410A((__int64)v117, (__int64)"5066f217-6223-487e-8e05-96eb1229a680", (__int64)&v118);
  process_func_1(v23, (__int64)v117);
  std::string::~string(v117);
  v386 = &v120;
  sub_1410A((__int64)v119, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v120);
  process_func_1(v23, (__int64)v119);
  std::string::~string(v119);
  v385 = &v122;
  sub_1410A((__int64)v121, (__int64)"1f6683a7-4478-494e-9e9f-f679491b5344", (__int64)&v122);
  process_func_1(v23, (__int64)v121);
  std::string::~string(v121);
  sub_1C3DA(v123, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", (char *)dest + 3);
  process_func_1(v23, (__int64)v123);
  std::string::~string(v123);
  v125 = -50;
  sub_1C322((__int64)v124, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v125);
  process_func_1(v23, (__int64)v124);
  std::string::~string(v124);
  v384 = &v127;
  sub_1410A((__int64)v126, (__int64)"470f2241-b469-468b-afeb-d5e5309ca6c8", (__int64)&v127);
  process_func_1(v23, (__int64)v126);
  std::string::~string(v126);
  sub_1C3DA(v128, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", (char *)dest + 3);
  process_func_1(v23, (__int64)v128);
  std::string::~string(v128);
  v130 = -50;
  sub_1C322((__int64)v129, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v130);
  process_func_1(v23, (__int64)v129);
  std::string::~string(v129);
  v383 = &v132;
  sub_1410A((__int64)v131, (__int64)"5066f217-6223-487e-8e05-96eb1229a680", (__int64)&v132);
  process_func_1(v23, (__int64)v131);
  std::string::~string(v131);
  v134 = 2;
  sub_1C322((__int64)v133, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v134);
  process_func_1(v23, (__int64)v133);
  std::string::~string(v133);
  v382 = &v136;
  sub_1410A((__int64)v135, (__int64)"48cc495b-5b7a-443c-abf9-9b0ae63bd723", (__int64)&v136);
  process_func_1(v23, (__int64)v135);
  std::string::~string(v135);
  v381 = &v138;
  sub_1410A((__int64)v137, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v138);
  process_func_1(v23, (__int64)v137);
  std::string::~string(v137);
  v140 = 10;
  sub_1C322((__int64)v139, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v140);
  process_func_1(v23, (__int64)v139);
  std::string::~string(v139);
  v142 = 5;
  sub_1C322((__int64)v141, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v142);
  process_func_1(v23, (__int64)v141);
  std::string::~string(v141);
  v380 = &v144;
  sub_1410A((__int64)v143, (__int64)"48cc495b-5b7a-443c-abf9-9b0ae63bd723", (__int64)&v144);
  process_func_1(v23, (__int64)v143);
  std::string::~string(v143);
  v379 = &v146;
  sub_1410A((__int64)v145, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v146);
  process_func_1(v23, (__int64)v145);
  std::string::~string(v145);
  v148 = 20;
  sub_1C322((__int64)v147, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v148);
  process_func_1(v23, (__int64)v147);
  std::string::~string(v147);
  sub_1C3DA(v149, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", (char *)dest + 4);
  process_func_1(v23, (__int64)v149);
  std::string::~string(v149);
  v378 = &v151;
  sub_1410A((__int64)v150, (__int64)"1f6683a7-4478-494e-9e9f-f679491b5344", (__int64)&v151);
  process_func_1(v23, (__int64)v150);
  std::string::~string(v150);
  v153 = 5;
  sub_1C322((__int64)v152, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v153);
  process_func_1(v23, (__int64)v152);
  std::string::~string(v152);
  v155 = 4;
  sub_1C322((__int64)v154, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v155);
  process_func_1(v23, (__int64)v154);
  std::string::~string(v154);
  v377 = &v157;
  sub_1410A((__int64)v156, (__int64)"48cc495b-5b7a-443c-abf9-9b0ae63bd723", (__int64)&v157);
  process_func_1(v23, (__int64)v156);
  std::string::~string(v156);
  v376 = &v159;
  sub_1410A((__int64)v158, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v159);
  process_func_1(v23, (__int64)v158);
  std::string::~string(v158);
  v161 = 40;
  sub_1C322((__int64)v160, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v161);
  process_func_1(v23, (__int64)v160);
  std::string::~string(v160);
  v163 = 31;
  sub_1C322((__int64)v162, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v163);
  process_func_1(v23, (__int64)v162);
  std::string::~string(v162);
  v165 = 29;
  sub_1C322((__int64)v164, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v165);
  process_func_1(v23, (__int64)v164);
  std::string::~string(v164);
  v375 = &v167;
  sub_1410A((__int64)v166, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v167);
  process_func_1(v23, (__int64)v166);
  std::string::~string(v166);
  sub_1C3DA(v168, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", (char *)dest + 5);
  process_func_1(v23, (__int64)v168);
  std::string::~string(v168);
  v170 = 100;
  sub_1C322((__int64)v169, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v170);
  process_func_1(v23, (__int64)v169);
  std::string::~string(v169);
  v374 = &v172;
  sub_1410A((__int64)v171, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v172);
  process_func_1(v23, (__int64)v171);
  std::string::~string(v171);
  v373 = &v174;
  sub_1410A((__int64)v173, (__int64)"1f6683a7-4478-494e-9e9f-f679491b5344", (__int64)&v174);
  process_func_1(v23, (__int64)v173);
  std::string::~string(v173);
  v372 = &v176;
  sub_1410A((__int64)v175, (__int64)"1f6683a7-4478-494e-9e9f-f679491b5344", (__int64)&v176);
  process_func_1(v23, (__int64)v175);
  std::string::~string(v175);
  v178 = 116;
  sub_1C322((__int64)v177, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v178);
  process_func_1(v23, (__int64)v177);
  std::string::~string(v177);
  v371 = &v180;
  sub_1410A((__int64)v179, (__int64)"57479ca5-787a-420f-b374-9eb0108deb64", (__int64)&v180);
  process_func_1(v23, (__int64)v179);
  std::string::~string(v179);
  v370 = &v182;
  sub_1410A((__int64)v181, (__int64)"57219a35-4dc4-4f5a-aaab-f17bad611232", (__int64)&v182);
  process_func_1(v23, (__int64)v181);
  std::string::~string(v181);
  v184 = -13;
  sub_1C322((__int64)v183, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v184);
  process_func_1(v23, (__int64)v183);
  std::string::~string(v183);
  v186 = 15;
  sub_1C322((__int64)v185, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v186);
  process_func_1(v23, (__int64)v185);
  std::string::~string(v185);
  v188 = 51;
  sub_1C322((__int64)v187, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v188);
  process_func_1(v23, (__int64)v187);
  std::string::~string(v187);
  v369 = &v190;
  sub_1410A((__int64)v189, (__int64)"470f2241-b469-468b-afeb-d5e5309ca6c8", (__int64)&v190);
  process_func_1(v23, (__int64)v189);
  std::string::~string(v189);
  v368 = &v192;
  sub_1410A((__int64)v191, (__int64)"1f6683a7-4478-494e-9e9f-f679491b5344", (__int64)&v192);
  process_func_1(v23, (__int64)v191);
  std::string::~string(v191);
  v367 = &v194;
  sub_1410A((__int64)v193, (__int64)"57479ca5-787a-420f-b374-9eb0108deb64", (__int64)&v194);
  process_func_1(v23, (__int64)v193);
  std::string::~string(v193);
  v366 = &v196;
  sub_1410A((__int64)v195, (__int64)"57219a35-4dc4-4f5a-aaab-f17bad611232", (__int64)&v196);
  process_func_1(v23, (__int64)v195);
  std::string::~string(v195);
  v198 = 10;
  sub_1C322((__int64)v197, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v198);
  process_func_1(v23, (__int64)v197);
  std::string::~string(v197);
  v200 = 500;
  sub_1C322((__int64)v199, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v200);
  process_func_1(v23, (__int64)v199);
  std::string::~string(v199);
  v365 = &v202;
  sub_1410A((__int64)v201, (__int64)"7aaf6c46-6861-4dcf-b530-4b6937d4aaeb", (__int64)&v202);
  process_func_1(v23, (__int64)v201);
  std::string::~string(v201);
  v204 = 2;
  sub_1C322((__int64)v203, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v204);
  process_func_1(v23, (__int64)v203);
  std::string::~string(v203);
  v364 = &v206;
  sub_1410A((__int64)v205, (__int64)"48cc495b-5b7a-443c-abf9-9b0ae63bd723", (__int64)&v206);
  process_func_1(v23, (__int64)v205);
  std::string::~string(v205);
  v208 = 9;
  sub_1C322((__int64)v207, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v208);
  process_func_1(v23, (__int64)v207);
  std::string::~string(v207);
  v363 = &v210;
  sub_1410A((__int64)v209, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v210);
  process_func_1(v23, (__int64)v209);
  std::string::~string(v209);
  v362 = &v212;
  sub_1410A((__int64)v211, (__int64)"57479ca5-787a-420f-b374-9eb0108deb64", (__int64)&v212);
  process_func_1(v23, (__int64)v211);
  std::string::~string(v211);
  v361 = &v214;
  sub_1410A((__int64)v213, (__int64)"57219a35-4dc4-4f5a-aaab-f17bad611232", (__int64)&v214);
  process_func_1(v23, (__int64)v213);
  std::string::~string(v213);
  v216 = 77;
  sub_1C322((__int64)v215, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v216);
  process_func_1(v23, (__int64)v215);
  std::string::~string(v215);
  v360 = &v218;
  sub_1410A((__int64)v217, (__int64)"57479ca5-787a-420f-b374-9eb0108deb64", (__int64)&v218);
  process_func_1(v23, (__int64)v217);
  std::string::~string(v217);
  v359 = &v220;
  sub_1410A((__int64)v219, (__int64)"57219a35-4dc4-4f5a-aaab-f17bad611232", (__int64)&v220);
  process_func_1(v23, (__int64)v219);
  std::string::~string(v219);
  sub_1C3DA(v221, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", (char *)dest + 6);
  process_func_1(v23, (__int64)v221);
  std::string::~string(v221);
  sub_1C3DA(v222, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", (char *)dest + 7);
  process_func_1(v23, (__int64)v222);
  std::string::~string(v222);
  v224 = 2;
  sub_1C322((__int64)v223, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v224);
  process_func_1(v23, (__int64)v223);
  std::string::~string(v223);
  v226 = 4;
  sub_1C322((__int64)v225, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v226);
  process_func_1(v23, (__int64)v225);
  std::string::~string(v225);
  v358 = &v228;
  sub_1410A((__int64)v227, (__int64)"7aaf6c46-6861-4dcf-b530-4b6937d4aaeb", (__int64)&v228);
  process_func_1(v23, (__int64)v227);
  std::string::~string(v227);
  v357 = &v230;
  sub_1410A((__int64)v229, (__int64)"48cc495b-5b7a-443c-abf9-9b0ae63bd723", (__int64)&v230);
  process_func_1(v23, (__int64)v229);
  std::string::~string(v229);
  v356 = &v232;
  sub_1410A((__int64)v231, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v232);
  process_func_1(v23, (__int64)v231);
  std::string::~string(v231);
  v234 = 186;
  sub_1C322((__int64)v233, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v234);
  process_func_1(v23, (__int64)v233);
  std::string::~string(v233);
  v355 = &v236;
  sub_1410A((__int64)v235, (__int64)"57479ca5-787a-420f-b374-9eb0108deb64", (__int64)&v236);
  process_func_1(v23, (__int64)v235);
  std::string::~string(v235);
  v354 = &v238;
  sub_1410A((__int64)v237, (__int64)"57219a35-4dc4-4f5a-aaab-f17bad611232", (__int64)&v238);
  process_func_1(v23, (__int64)v237);
  std::string::~string(v237);
  sub_1C3DA(v239, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", (char *)dest + 6);
  process_func_1(v23, (__int64)v239);
  std::string::~string(v239);
  sub_1C3DA(v240, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", (char *)dest + 6);
  process_func_1(v23, (__int64)v240);
  std::string::~string(v240);
  v353 = &v242;
  sub_1410A((__int64)v241, (__int64)"439b9ed2-ce85-4880-b8aa-9e2081c76769", (__int64)&v242);
  process_func_1(v23, (__int64)v241);
  std::string::~string(v241);
  sub_1C3DA(v243, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", (char *)dest + 6);
  process_func_1(v23, (__int64)v243);
  std::string::~string(v243);
  sub_1C3DA(v244, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", (char *)dest + 6);
  process_func_1(v23, (__int64)v244);
  std::string::~string(v244);
  v352 = &v246;
  sub_1410A((__int64)v245, (__int64)"5066f217-6223-487e-8e05-96eb1229a680", (__int64)&v246);
  process_func_1(v23, (__int64)v245);
  std::string::~string(v245);
  v351 = &v248;
  sub_1410A((__int64)v247, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v248);
  process_func_1(v23, (__int64)v247);
  std::string::~string(v247);
  sub_1C3DA(v249, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", (char *)dest + 8);
  process_func_1(v23, (__int64)v249);
  std::string::~string(v249);
  v350 = &v251;
  sub_1410A((__int64)v250, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v251);
  process_func_1(v23, (__int64)v250);
  std::string::~string(v250);
  v253 = 300;
  sub_1C322((__int64)v252, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v253);
  process_func_1(v23, (__int64)v252);
  std::string::~string(v252);
  v255 = -32;
  sub_1C322((__int64)v254, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v255);
  process_func_1(v23, (__int64)v254);
  std::string::~string(v254);
  v349 = &v257;
  sub_1410A((__int64)v256, (__int64)"470f2241-b469-468b-afeb-d5e5309ca6c8", (__int64)&v257);
  process_func_1(v23, (__int64)v256);
  std::string::~string(v256);
  v259 = 300;
  sub_1C322((__int64)v258, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v259);
  process_func_1(v23, (__int64)v258);
  std::string::~string(v258);
  v261 = -32;
  sub_1C322((__int64)v260, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v261);
  process_func_1(v23, (__int64)v260);
  std::string::~string(v260);
  v348 = &v263;
  sub_1410A((__int64)v262, (__int64)"5066f217-6223-487e-8e05-96eb1229a680", (__int64)&v263);
  process_func_1(v23, (__int64)v262);
  std::string::~string(v262);
  v265 = 2;
  sub_1C322((__int64)v264, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v265);
  process_func_1(v23, (__int64)v264);
  std::string::~string(v264);
  v347 = &v267;
  sub_1410A((__int64)v266, (__int64)"48cc495b-5b7a-443c-abf9-9b0ae63bd723", (__int64)&v267);
  process_func_1(v23, (__int64)v266);
  std::string::~string(v266);
  v346 = &v269;
  sub_1410A((__int64)v268, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v269);
  process_func_1(v23, (__int64)v268);
  std::string::~string(v268);
  v345 = &v271;
  sub_1410A((__int64)v270, (__int64)"57479ca5-787a-420f-b374-9eb0108deb64", (__int64)&v271);
  process_func_1(v23, (__int64)v270);
  std::string::~string(v270);
  v344 = &v273;
  sub_1410A((__int64)v272, (__int64)"57219a35-4dc4-4f5a-aaab-f17bad611232", (__int64)&v273);
  process_func_1(v23, (__int64)v272);
  std::string::~string(v272);
  sub_1C3DA(v274, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", (char *)dest + 6);
  process_func_1(v23, (__int64)v274);
  std::string::~string(v274);
  v276 = 5;
  sub_1C322((__int64)v275, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v276);
  process_func_1(v23, (__int64)v275);
  std::string::~string(v275);
  v343 = &v278;
  sub_1410A((__int64)v277, (__int64)"48cc495b-5b7a-443c-abf9-9b0ae63bd723", (__int64)&v278);
  process_func_1(v23, (__int64)v277);
  std::string::~string(v277);
  sub_1C3DA(v279, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", (char *)dest + 7);
  process_func_1(v23, (__int64)v279);
  std::string::~string(v279);
  v281 = 20;
  sub_1C322((__int64)v280, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v281);
  process_func_1(v23, (__int64)v280);
  std::string::~string(v280);
  v342 = &v283;
  sub_1410A((__int64)v282, (__int64)"48cc495b-5b7a-443c-abf9-9b0ae63bd723", (__int64)&v283);
  process_func_1(v23, (__int64)v282);
  std::string::~string(v282);
  v341 = &v285;
  sub_1410A((__int64)v284, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v285);
  process_func_1(v23, (__int64)v284);
  std::string::~string(v284);
  sub_1C3DA(v286, 5LL, "{} {}", "172ed1de-9170-4783-b033-dec4596e5ada", (char *)dest + 8);
  process_func_1(v23, (__int64)v286);
  std::string::~string(v286);
  v288 = 2;
  sub_1C322((__int64)v287, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v288);
  process_func_1(v23, (__int64)v287);
  std::string::~string(v287);
  v340 = &v290;
  sub_1410A((__int64)v289, (__int64)"48cc495b-5b7a-443c-abf9-9b0ae63bd723", (__int64)&v290);
  process_func_1(v23, (__int64)v289);
  std::string::~string(v289);
  v339 = &v292;
  sub_1410A((__int64)v291, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v292);
  process_func_1(v23, (__int64)v291);
  std::string::~string(v291);
  v294 = 100;
  sub_1C322((__int64)v293, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v294);
  process_func_1(v23, (__int64)v293);
  std::string::~string(v293);
  v296 = 1000;
  sub_1C322((__int64)v295, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v296);
  process_func_1(v23, (__int64)v295);
  std::string::~string(v295);
  v338 = &v298;
  sub_1410A((__int64)v297, (__int64)"439b9ed2-ce85-4880-b8aa-9e2081c76769", (__int64)&v298);
  process_func_1(v23, (__int64)v297);
  std::string::~string(v297);
  v300 = 100;
  sub_1C322((__int64)v299, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v300);
  process_func_1(v23, (__int64)v299);
  std::string::~string(v299);
  v302 = 1000;
  sub_1C322((__int64)v301, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v302);
  process_func_1(v23, (__int64)v301);
  std::string::~string(v301);
  v337 = &v304;
  sub_1410A((__int64)v303, (__int64)"5066f217-6223-487e-8e05-96eb1229a680", (__int64)&v304);
  process_func_1(v23, (__int64)v303);
  std::string::~string(v303);
  v306 = -1;
  sub_1C322((__int64)v305, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v306);
  process_func_1(v23, (__int64)v305);
  std::string::~string(v305);
  v336 = &v308;
  sub_1410A((__int64)v307, (__int64)"48cc495b-5b7a-443c-abf9-9b0ae63bd723", (__int64)&v308);
  process_func_1(v23, (__int64)v307);
  std::string::~string(v307);
  v335 = &v310;
  sub_1410A((__int64)v309, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v310);
  process_func_1(v23, (__int64)v309);
  std::string::~string(v309);
  v312 = 692;
  sub_1C322((__int64)v311, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v312);
  process_func_1(v23, (__int64)v311);
  std::string::~string(v311);
  v334 = &v314;
  sub_1410A((__int64)v313, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v314);
  process_func_1(v23, (__int64)v313);
  std::string::~string(v313);
  v316 = 2;
  sub_1C322((__int64)v315, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v316);
  process_func_1(v23, (__int64)v315);
  std::string::~string(v315);
  v318 = 80;
  sub_1C322((__int64)v317, 5LL, (__int64)"{} {}", (__int64)"172ed1de-9170-4783-b033-dec4596e5ada", (__int64)&v318);
  process_func_1(v23, (__int64)v317);
  std::string::~string(v317);
  v333 = &v320;
  sub_1410A((__int64)v319, (__int64)"7aaf6c46-6861-4dcf-b530-4b6937d4aaeb", (__int64)&v320);
  process_func_1(v23, (__int64)v319);
  std::string::~string(v319);
  v332 = &v322;
  sub_1410A((__int64)v321, (__int64)"1783f882-67bc-40b7-93a2-892961497772", (__int64)&v322);
  process_func_1(v23, (__int64)v321);
  std::string::~string(v321);
  v331 = &v324;
  sub_1410A((__int64)v323, (__int64)"57479ca5-787a-420f-b374-9eb0108deb64", (__int64)&v324);
  process_func_1(v23, (__int64)v323);
  std::string::~string(v323);
  v330 = &v326;
  sub_1410A((__int64)v325, (__int64)"57219a35-4dc4-4f5a-aaab-f17bad611232", (__int64)&v326);
  process_func_1(v23, (__int64)v325);
  std::string::~string(v325);
  if ( (unsigned __int8)check_null_2(v23) )
  {
    v17 = (std::runtime_error *)__cxa_allocate_exception(0x10uLL);
    std::runtime_error::runtime_error(v17, "nahh");
    __cxa_throw(
      v17,
      (struct type_info *)&`typeinfo for'std::runtime_error,
      (void (*)(void *))&std::runtime_error::~runtime_error);
  }
```

We already know first 11 bytes of input and only **9 bytes left**. Looking at several function i notice that last validation use `VM` to process our input. Lets take a look on process\_func\_1 (`sub_39EEA`)

<pre class="language-c"><code class="lang-c">__int64 __fastcall sub_39EEA(_BYTE *a1, __int64 a2)
{
  __int64 v2; // rax
  void *exception; // rbx
  __int64 v4; // rax
  __int64 v5; // rax
  __int64 v6; // rax
  std::runtime_error *v7; // rbx
  std::runtime_error *v8; // rbx
  std::runtime_error *v9; // rbx
  __int64 v11; // [rsp+18h] [rbp-E8h] BYREF
  __int64 v12; // [rsp+20h] [rbp-E0h] BYREF
  int v13; // [rsp+2Ch] [rbp-D4h] BYREF
  __int64 v14; // [rsp+30h] [rbp-D0h] BYREF
  __int64 v15; // [rsp+38h] [rbp-C8h] BYREF
  _BYTE v16[32]; // [rsp+40h] [rbp-C0h] BYREF
  _BYTE v17[24]; // [rsp+60h] [rbp-A0h] BYREF
  __int64 v18; // [rsp+78h] [rbp-88h] BYREF
  _BYTE v19[36]; // [rsp+80h] [rbp-80h] BYREF
  int v20; // [rsp+A4h] [rbp-5Ch] BYREF
  int v21; // [rsp+A8h] [rbp-58h] BYREF
  int v22; // [rsp+ACh] [rbp-54h] BYREF
  __int64 (__fastcall *v23)(_QWORD, _QWORD); // [rsp+B0h] [rbp-50h]
  unsigned int v24; // [rsp+B8h] [rbp-48h]
  unsigned int v25; // [rsp+BCh] [rbp-44h]
  unsigned int v26; // [rsp+C0h] [rbp-40h]
  unsigned int v27; // [rsp+C4h] [rbp-3Ch]
  __int64 (__fastcall *v28)(_QWORD, _QWORD); // [rsp+C8h] [rbp-38h]
  unsigned int v29; // [rsp+D0h] [rbp-30h]
  unsigned int v30; // [rsp+D4h] [rbp-2Ch]
  unsigned __int8 (__fastcall *v31)(_QWORD, _QWORD); // [rsp+D8h] [rbp-28h]
  bool v32; // [rsp+E7h] [rbp-19h]
  int v33; // [rsp+E8h] [rbp-18h]
  int v34; // [rsp+ECh] [rbp-14h]

  sub_40581(v17, a2);
  v2 = sub_3A66A(v17, 0LL);
  std::string::basic_string(v16, v2);
  v15 = sub_3A8BC(a1 + 1288, v16);
  v18 = sub_1BC36(a1 + 1288);
  if ( (unsigned __int8)sub_1BC50(&#x26;v15, &#x26;v18) )
  {
    exception = __cxa_allocate_exception(0x10uLL);
    std::operator+&#x3C;char>(v19, "unexpected error", v16);
    std::runtime_error::runtime_error(exception, v19);
    std::string::~string(v19);
    __cxa_throw(
      exception,
      (struct type_info *)&#x26;`typeinfo for'std::runtime_error,
      (void (*)(void *))&#x26;std::runtime_error::~runtime_error);
  }
  v34 = *(_DWORD *)(sub_3A8E2(&#x26;v15) + 32);
  v33 = sub_3A68A(v17);
  if ( v33 == 3 )
  {
    v14 = sub_3A534(a1, v16);
    v4 = sub_3A66A(v17, 1LL);
    v25 = sub_3A4EA(v4, 0LL, 10LL);
    v5 = sub_3A66A(v17, 2LL);
    v24 = sub_3A4EA(v5, 0LL, 10LL);
    v23 = (__int64 (__fastcall *)(_QWORD, _QWORD))get_asm(&#x26;v14);
<strong>    v13 = v23(v25, v24);
</strong>    sub_3A90C(a1 + 8, &#x26;v13);
    goto LABEL_27;
  }
  if ( v33 == 2 )
  {
    if ( v34 == 13 )
    {
      v6 = sub_3A66A(v17, 1LL);
      v20 = sub_3A4EA(v6, 0LL, 10LL);
      sub_3A932(a1 + 8, &#x26;v20);
    }
    goto LABEL_27;
  }
  if ( v33 != 1 )
    goto LABEL_27;
  if ( v34 == 14 )
  {
    sub_3A980(a1 + 8);
    goto LABEL_27;
  }
  if ( v34 > 14 )
  {
LABEL_26:
    v9 = (std::runtime_error *)__cxa_allocate_exception(0x10uLL);
    std::runtime_error::runtime_error(v9, "unexpected error");
    __cxa_throw(
      v9,
      (struct type_info *)&#x26;`typeinfo for'std::runtime_error,
      (void (*)(void *))&#x26;std::runtime_error::~runtime_error);
  }
  if ( v34 == 12 )
  {
    v32 = *(_DWORD *)sub_3A966(a1 + 8) != 0;
    sub_3A980(a1 + 8);
    if ( !v32 )
      *a1 = 1;
  }
  else
  {
    if ( v34 > 12 )
      goto LABEL_26;
    if ( v34 > 8 )
    {
      if ( v34 != 9 )
        goto LABEL_26;
      v12 = sub_3A534(a1, v16);
      v31 = (unsigned __int8 (__fastcall *)(_QWORD, _QWORD))get_asm(&#x26;v12);
      if ( !v31 )
      {
        v7 = (std::runtime_error *)__cxa_allocate_exception(0x10uLL);
        std::runtime_error::runtime_error(v7, "unexpected error");
        __cxa_throw(
          v7,
          (struct type_info *)&#x26;`typeinfo for'std::runtime_error,
          (void (*)(void *))&#x26;std::runtime_error::~runtime_error);
      }
      v30 = *(_DWORD *)sub_3A966(a1 + 8);
      sub_3A980(a1 + 8);
      v29 = *(_DWORD *)sub_3A966(a1 + 8);
      sub_3A980(a1 + 8);
<strong>      v21 = v31(v30, v29);
</strong>      sub_3A932(a1 + 8, &#x26;v21);
    }
    else
    {
      if ( v34 &#x3C; 0 )
        goto LABEL_26;
      v11 = sub_3A534(a1, v16);
      v28 = (__int64 (__fastcall *)(_QWORD, _QWORD))get_asm(&#x26;v11);
      if ( !v28 )
      {
        v8 = (std::runtime_error *)__cxa_allocate_exception(0x10uLL);
        std::runtime_error::runtime_error(v8, "unexpected error");
        __cxa_throw(
          v8,
          (struct type_info *)&#x26;`typeinfo for'std::runtime_error,
          (void (*)(void *))&#x26;std::runtime_error::~runtime_error);
      }
      v27 = *(_DWORD *)sub_3A966(a1 + 8);
      sub_3A980(a1 + 8);
      v26 = *(_DWORD *)sub_3A966(a1 + 8);
      sub_3A980(a1 + 8);
<strong>      v22 = v28(v27, v26);
</strong>      sub_3A932(a1 + 8, &#x26;v22);
    }
  }
LABEL_27:
  std::string::~string(v16);
  return sub_1A6A4(v17);
}
</code></pre>

There are three lines of code that i highlighted, those code calling function from JIT code. From callback function we can see also that when an instruction constructed using uuid and some value it will call `process_func_1` function which is calling JIT code. So i decide to dump the `JIT code` and dump the `call sequence` of it.

{% code title="helper1.py" %}

```python
#!/usr/bin/python3
import string
import json
import re

class CallSequenceConverter:
    def __init__(self):
        self.address_map = {}
        self.operations = {
            'lea': 'ADD',      # lea eax,[rdi+rsi*1] -> ADD
            'sub': 'SUB',      # sub eax,esi -> SUB
            'imul': 'MUL',     # imul eax,esi -> MUL
            'sarx': 'SAR',     # sarx eax,edi,esi -> SAR
            'xor': 'XOR',      # xor eax,esi -> XOR
            'and': 'AND',      # and eax,esi -> AND
            'or': 'OR',        # or eax,esi -> OR
            'cmp': 'CMP',      # cmp edi,esi; sete al -> CMP
            'idiv': 'DIV',     # idiv esi -> DIV
            'shlx': 'SHL'      # shlx eax,edi,esi -> SHL
        }
    
    def parse_assembly(self, assembly_text):
        lines = assembly_text.strip().split('\n')
        current_function_base = None
        
        for line in lines:
            line = line.strip()
            if not line or line.startswith(';'):
                continue
            
            match = re.match(r'0x([0-9a-fA-F]+):\s+(.+)', line)
            if match:
                address = match.group(1).lower()
                instruction = match.group(2).strip()
                full_address = f"0x{address}"
                
                if 'endbr64' in instruction:
                    current_function_base = full_address
                    continue
                
                if any(skip in instruction for skip in ['nop', 'ret', 'cdq']):
                    continue
                
                if current_function_base:
                    for op_name in self.operations:
                        if op_name in instruction:
                            self.address_map[current_function_base] = self.operations[op_name]
                            break

    def calculate_result(self, operation, arg1, arg2):
        if isinstance(arg1, str):
            arg1 = int(arg1)
        if isinstance(arg2, str):
            arg2 = int(arg2)
        
        if operation == 'ADD':
            return (arg1 + arg2) & 0xFFFFFFFF
        elif operation == 'SUB':
            return (arg1 - arg2) & 0xFFFFFFFF
        elif operation == 'MUL':
            return (arg1 * arg2) & 0xFFFFFFFF
        elif operation == 'XOR':
            return arg1 ^ arg2
        elif operation == 'AND':
            return arg1 & arg2
        elif operation == 'OR':
            return arg1 | arg2
        elif operation == 'CMP':
            return 1 if arg1 == arg2 else 0
        elif operation == 'DIV':
            return arg1 // arg2 if arg2 != 0 else 0
        elif operation == 'SAR':
            if arg1 & 0x80000000:
                return ((arg1 | 0xFFFFFFFF00000000) >> arg2) & 0xFFFFFFFF
            else:
                return (arg1 >> arg2) & 0xFFFFFFFF
        elif operation == 'SHL':
            return (arg1 << arg2) & 0xFFFFFFFF
        else:
            return 0
    
    def convert_arrays_to_equation_format(self, addresses_array, arguments_array):
        assert len(addresses_array) == len(arguments_array)
        
        equations = []
        for address, args in zip(addresses_array, arguments_array):
            if len(args) != 2:
                continue
            
            arg1, arg2 = args
            
            if not address.startswith('0x'):
                address = f"0x{address}"
            address = address.lower()
            
            if address in self.address_map:
                operation = self.address_map[address]
                result = self.calculate_result(operation, arg1, arg2)
                arg1 = hex(arg1)
                arg2 = hex(arg2)
                result = hex(result)
                
                if operation == 'ADD':
                    equation = f"({arg1} + {arg2}) = {result}"
                elif operation == 'SUB':
                    equation = f"({arg1} - {arg2}) = {result}"
                elif operation == 'MUL':
                    equation = f"({arg1} * {arg2}) = {result}"
                elif operation == 'XOR':
                    equation = f"({arg1} ^ {arg2}) = {result}"
                elif operation == 'AND':
                    equation = f"({arg1} & {arg2}) = {result}"
                elif operation == 'OR':
                    equation = f"({arg1} | {arg2}) = {result}"
                elif operation == 'CMP':
                    equation = f"({arg1} == {arg2}) = {result}"
                    if result == 0:
                        equation += f" ({arg1} ≠ {arg2})"
                elif operation == 'DIV':
                    equation = f"({arg1} / {arg2}) = {result}"
                elif operation == 'SAR':
                    equation = f"({arg1} >> {arg2}) = {result}"
                elif operation == 'SHL':
                    equation = f"({arg1} << {arg2}) = {result}"
                else:
                    equation = f"{operation}({arg1}, {arg2}) = {result}"
                
                equations.append(equation)
        
        return equations

def write_payload(data):
    f = open("payload.txt", "wb")
    f.write(bytes(data))
    f.close()

def write_to_file(data):
    with open('out.txt', 'w') as f:
        f.write(json.dumps(data))

class SolverEquation(gdb.Command):
    def __init__ (self):
        super (SolverEquation, self).__init__ ("solve-equation",gdb.COMMAND_OBSCURE)

    def invoke (self, arg, from_tty):
        arch = gdb.selected_frame().architecture()
        list_addr = []
        list_arg = []
        counter = 0
        while True:
            current_pc = addr2num(gdb.selected_frame().read_register("pc"))
            if current_pc == 0x555555561f46:
                break
            
            rcx = addr2num(gdb.selected_frame().read_register("rcx"))
            rdi = addr2num(gdb.selected_frame().read_register("rdi"))
            rsi = addr2num(gdb.selected_frame().read_register("rsi"))

            if counter == 0:
                base = rcx - 0x50
                func = gdb.execute(f"x/100i {base}", to_string=True)

            list_addr.append(hex(rcx))
            list_arg.append([rdi, rsi])
            gdb.execute("c")
            counter += 1
        
        converter = CallSequenceConverter()
        converter.parse_assembly(func)
     
        results = converter.convert_arrays_to_equation_format(list_addr, list_arg)
        for result in results:
            print(result)

def addr2num(addr):
    try:
        return int(addr)
    except:
        return long(addr)

def parse(f):
    f = f.split("\n")
    result = []
    for i in f:
        tmp = i.split("\t")
        for j in range(1,len(tmp)):
            result.append(tmp[j])
    return result

SolverEquation()
```

{% endcode %}

Set breakpoint at those 3 JIT code call in process\_func\_1

```bash
gef➤  pie b 0x3A0CD
gef➤  pie b 0x3A281
gef➤  pie b 0x3A3E7
gef➤  pie b 0xDF46
gef➤  source helper1.py
gef➤  solve-equation
```

We will get the following output

```python
(0x60 & 0x96) = 0x0
(0x60 | 0x96) = 0xf6
(0xf6 + 0x0) = 0xf6
(0x6 & 0x5) = 0x4
(0x6 | 0x5) = 0x7
(0x7 + 0x4) = 0xb
(0x41 + 0xb) = 0x4c
(0xfffffff6 ^ 0x42) = 0xffffffb4
(0xfffffff6 & 0x42) = 0x42
(0x2 * 0x42) = 0x84
(0x84 + 0xffffffb4) = 0x38
(0x48 + 0x38) = 0x80
(0x80 == 0x4c) = 0x0
(0xfffffffe ^ 0x42) = 0xffffffbc
(0xfffffffe & 0x42) = 0x42
(0x2 * 0x42) = 0x84
(0x84 + 0xffffffbc) = 0x40
(0xc8 + 0x40) = 0x108
(0x108 == 0xf6) = 0x0
(0xb | 0x43) = 0x4b
(0xb & 0x43) = 0x3
(0x3 + 0x4b) = 0x4e
(0x4e - 0xb) = 0x43
(0xffffffce ^ 0x44) = 0xffffff8a
(0xffffffce & 0x44) = 0x44
(0x2 * 0x44) = 0x88
(0x88 + 0xffffff8a) = 0x12
(0x5 * 0xa) = 0x32
(0x32 + 0x12) = 0x44
(0x45 - 0x14) = 0x31
(0x4 * 0x5) = 0x14
(0x14 + 0x31) = 0x45
(0x1d + 0x1f) = 0x3c
(0x64 + 0x46) = 0xaa
(0xaa - 0x3c) = 0x6e
(0x6e - 0x28) = 0x46
(0x74 == 0x46) = 0x0
(0x33 ^ 0xf) = 0x3c
(0x3c - 0xfffffff3) = 0x49
(0x49 == 0x45) = 0x0
(0x1f4 / 0xa) = 0x32
(0x2 * 0x32) = 0x64
(0x9 + 0x64) = 0x6d
(0x6d == 0x44) = 0x0
(0x4d == 0x43) = 0x0
(0x4 / 0x2) = 0x2
(0x2 * 0x48) = 0x90
(0x90 + 0x47) = 0xd7
(0xba == 0xd7) = 0x0
(0x47 | 0x47) = 0x47
(0x47 & 0x47) = 0x47
(0x47 + 0x47) = 0x8e
(0x49 + 0x8e) = 0xd7
(0xffffffe0 ^ 0x12c) = 0xfffffecc
(0xffffffe0 & 0x12c) = 0x120
(0x2 * 0x120) = 0x240
(0x240 + 0xfffffecc) = 0x10c
(0x10c == 0xd7) = 0x0
(0x5 * 0x47) = 0x163
(0x14 * 0x48) = 0x5a0
(0x5a0 + 0x163) = 0x703
(0x2 * 0x49) = 0x92
(0x92 + 0x703) = 0x795
(0x3e8 | 0x64) = 0x3ec
(0x3e8 & 0x64) = 0x60
(0xffffffff * 0x60) = 0xffffffa0
(0xffffffa0 + 0x3ec) = 0x38c
(0x2b4 + 0x38c) = 0x640
(0x50 / 0x2) = 0x28
(0x28 + 0x640) = 0x668
(0x668 == 0x795) = 0x0
```

By using three different input (last 9 bytes) we can ensure which one is static value and which one is variable. Because there are only few operation, i decided to convert it by hand and solve it using `z3`. Following is my final script

```python
from z3 import *
import string

inp = [BitVec("x{}".format(i), 32) for i in range(9)]

s = Solver()

for i in inp:
    s.add(z3.Or(*[ord(j) == i for j in string.printable[:-6]]))

s.add((inp[0] + 11) == (((inp[1] & 4294967286) * 2) + (inp[1] ^ 4294967286) + 72) & 0xff)
s.add((((inp[1] & 4294967294) * 2) + (inp[1] ^ 4294967294) + 200) & 0xff == 246)
s.add((inp[5] + 100) - 60 - 40 == 116)
s.add((inp[4] - 20) + 20 == 73)
s.add((((inp[3] & 4294967246) * 2) + (inp[3] ^ 4294967246) + 50) & 0xff == 109)
s.add((inp[2] | 11) + (inp[2] & 11) - 11 == 77)
s.add(inp[6] + (inp[7] * 2) == 186)
s.add((inp[6] | inp[6]) + (inp[6] & inp[6]) + inp[8] == 268)
s.add((inp[6] * 5) + (inp[7] * 20) + (inp[8] * 2) == 1640)
print(s.check())

model = s.model()
# print(model)
flag = b""
for i in inp:
    try:
    	flag += bytes([model[i].as_long()])
    except Exception as e:
    	flag += b"?"

known = "DEAD{j1tT3D_4ND_"
print(known + flag.decode() + "}")
```

Flag: DEAD{j1tT3D\_4ND\_c0MmItT3d}
