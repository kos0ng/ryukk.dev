# Reverse Engineering

<!-- challenge-index: 1b269d67415a910e -->

| Challenge | Topic |
| --- | --- |
| [Count the Flag but Easier (331 pts)🥇](#count-the-flag-but-easier-331-pts) | Assembly, Control Flow |
| [Reinvent the Wheel (499 pts)🥇](#reinvent-the-wheel-499-pts) | Anti-Debugging, GDB |
| [Flaggy Bird V2 (500 pts)🥇](/notes/research/2022/cheating-game-built-with-wasm/) | Unity, WebAssembly |

<!-- /challenge-index -->

## Count the Flag but Easier (331 pts)

### Description

\-

### Solution

Diberikan file txt, berikut isinya

```nasm
fungsi():
        push    rbp
        mov     rbp, rsp
        mov     DWORD PTR [rbp-4], 20
        mov     DWORD PTR [rbp-8], 10
        mov     DWORD PTR [rbp-12], 20
        mov     eax, DWORD PTR [rbp-4]
        imul    eax, DWORD PTR [rbp-8]
        lea     ecx, [rax+2]
        mov     eax, DWORD PTR [rbp-12]
        mov     edx, eax
        sal     eax, 2
        sub     edx, eax
        lea     eax, [rcx+rdx]
        mov     DWORD PTR [rbp-16], eax
        sal     DWORD PTR [rbp-16], 20
        cmp     DWORD PTR [rbp-16], 100000000
        jg      .L2
        mov     eax, DWORD PTR [rbp-16]
        lea     edx, [rax+3]
        test    eax, eax
        cmovs   eax, edx
        sar     eax, 2
        mov     DWORD PTR [rbp-16], eax
        jmp     .L3
.L2:
        cmp     DWORD PTR [rbp-16], 100000000
        jle     .L4
        cmp     DWORD PTR [rbp-16], 500000000
        jg      .L4
        mov     eax, DWORD PTR [rbp-16]
        lea     edx, [rax+7]
        test    eax, eax
        cmovs   eax, edx
        sar     eax, 3
        mov     DWORD PTR [rbp-16], eax
        jmp     .L3
.L4:
        mov     eax, DWORD PTR [rbp-16]
        mov     edx, eax
        shr     edx, 31
        add     eax, edx
        sar     eax
        mov     DWORD PTR [rbp-16], eax
.L3:
        nop
        pop     rbp
        ret

```

Tujuannya jelas, jadi mencari tahu nilai akhir dari fungsi(). Disini kami lakukan konversi secara menual, karena kode assemblynya terhitung pendek. Berikut hasil konversi dari asm ke python

```python
rbp_4 = 20
rbp_8 = 10
rbp_12 = 20
eax = rbp_4
eax *= rbp_8
ecx = eax + 2
eax = rbp_12
edx = eax
eax <<= 2
edx -= eax
eax = ecx + edx
rbp_16 = eax
rbp_16 <<= 20
if(rbp_16 > 100000000):
	#L2
	if(rbp_16 <= 100000000):
		#L4
		eax = rbp_16
		edx = eax
		edx >>= 31
		eax += edx
		eax >>= 1
		rbp_16 = eax
	elif(rbp_16>500000000):
		eax = rbp_16
		edx = eax
		edx >>= 31
		eax += edx
		eax >>= 1
		rbp_16 = eax
	eax = rbp_16
	edx = eax+7
	eax >>= 3
	rbp_16 = eax
else:
	eax = rbp_16
	edx = eax + 3
	eax >>= 2
	rbp_16 = eax
print(rbp_16)

```

<figure><img src="https://lh7-us.googleusercontent.com/6HCY0LGTRZdevSGfEQOYqIUqbsiq_uxADKp8ioBnghSFZKLtIxVnBLVF0Tuy6JvwQAGj5TV8F5OWZmOWD0Lhe__y9og4YaF9AHTatGI_BP8a4GvHe4rl5lSukYR4EJQFhMbknlaqvHZMPq8Alr_hT8o" alt=""><figcaption></figcaption></figure>

Flag : NCW22{18612224}

## Reinvent the Wheel (499 pts)

### Description

\-

### Solution

Diberikan file elf 64 bit. Kami membukanya menggunakan IDA

<figure><img src="https://lh7-us.googleusercontent.com/LA7h51AfgTixW5UDPirR45z9JylhZuCzUtoWalogawn6rNIzLsHQ40vNzBPyW3DB6e78j4k1GeV3KXRBJpaIVU5wMmSJHuh3iGMoTHIh-WNdWaXpwwQlf-LDdoPIuAs-W6Are0QDsUJuZqHDfnMl9BM" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/xKeogoBK2t74pfWa5LBsGZLNuZwHrmrQuBt3aVho3f-TxVXIg-S_h0axny-E2nFZpR7aZ0T3xirPuRXg8af69PwmkcPuwoYqXZ9XSR2wavAp6qNerai8kImew_nC6s0CavndwhXf1xYEIMeKdkhZm0k" alt=""><figcaption></figcaption></figure>

Pada start terlihat ada pemanggilan fungsi init dan fungsi init mengeksekusi fungsi anti debug

<figure><img src="https://lh7-us.googleusercontent.com/07MLJ1e2OtsLwaUenXxXS-Ek9la6nk3jEtwYLwkWYvXi8Sb_o5tvdigYyBET4X-bKfJyEfBuMsBn_WD08KN6XfKl9BxA0vOvOojN89NSPRq9mEn3XNhgjev3R1LA80WPOk7p4sOv5xA6X0-CldT4OPc" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/UtNPWR0VH6YpzZfCZuVP4DSVskbzQOy97oYHLMNW04R_AJ9bkdEnJw4wuS7JjgvP5JrI6_uDggBd-qSaLIMyvI_HsR560JOWIzBPfVBiKnAv4D8njcolChR1ZxTkrcUzrvidI0L_xAm04YdK3ENMy7s" alt=""><figcaption></figcaption></figure>

Jadi lakukan bypass terhadap pengecekan debug tersebut ketika melakukan dynamic analysis dengan gdb.

<figure><img src="https://lh7-us.googleusercontent.com/82kJyaSMqbqYAnwlZeNqxLcqMWDeMnEDdyTdT6c9bcu0lGn2t8Euy_yU9pJr6UGgOmPkuMzfOOFHEcNcsni9CjKXrn3-bMC-qD47gRERNWRyn2jMk-iX_fUKO2ULxAnqqIDdUhbADMAjBANndtYfKvU" alt=""><figcaption></figcaption></figure>

Setelah bypass maka kita akan masuk ke fungsi main.

<figure><img src="https://lh7-us.googleusercontent.com/5KXgbxoGuz4EgQEmBa4V0qWRK0QsZ0CBgogbvDQ__7srOGhs0JbVxwUdzK95D1e3pupUvO5PaX0m1-XYTLTlxB_GsSh_Uyyt33DK1DZUb0VhPq-MtMNspRs-BRZp6dmzLyjgOQ-hH_MEXJxUt3CDVtU" alt=""><figcaption></figcaption></figure>

Terlihat pada IDA terdapat anti dissasembly pada fungsi main. Maka kita perlu lakukan sedikit dynamic analysis untuk ini.&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/QmEI02KRvmdziBj3HCb1LA4X1-8afsqwvCEzKBITqyF8mWne0-dPY4WoCZ8uWCBJF0d-IJihjOw8p8EG3p6oGy0Q7mf3YhwtZc5kZLF38OYr3KyShSFcaoRTBPVpvEyARsW24PRxbBG2uo6uyWaNxGI" alt=""><figcaption></figcaption></figure>

Setelah masuk fungsi main lakukan next instruction sampai masuk ke alamat yang tidak bisa disassembly pada IDA. Jika sudah, cek instruksi pertama kali yang bisa di disassembly pada main (GDB) di alamat yang tidak bisa di disassembly pada IDA.&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/WXU8klij32zVTtcNXtgtsuUwoQ1sMZugynRkzco83hQgtFnYdXxE2eT-s-9QcvODXj73naBFkQa9cKW0fq74lh1A7Wux_hXxYBEG3Q7ldgPvOUBNjkbPGjIxFVhXofE7JwYMuTaxanBP64D5czF5Q3E" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/RkHK5aI82BiVZTXnL37TSEvtf47ymHhWpKa0Qgg9k7u3EbylHuAJkNoeyIJYjdSxi9pbY2bQGC51LxjK2eqr74CX8MeFfKa3uoS5pxRsjo3C5_YFLGfRJu38qrBcE0wbboynit6K7eBrC5HiWIs_BhI" alt=""><figcaption></figcaption></figure>

Terlihat pada 0x5555555553f6 sudah bisa didissassembly dengan benar, maka convert ke assembly mulai dari address tersebut lalu create new function pada address tersebut.

<figure><img src="https://lh7-us.googleusercontent.com/zF05an3i5fpllDkECLnyYvg7NmhX3mQvHxCglmX4X6MDKKx4REzKSU2N1kt5-nnqLYbGgWXe9o8x9Vhwe9zvX4qdzYmSFOtSpheRwBGlGeJmv3DuZ7p6PSvNDkZwA7u1kWBCnEwr-M1FM_sLXDjJysA" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/6OUDtgW9PzsrnL3wqWZgNqdH3lWtV9P55GjvoP_gvirrrtoBWQFsiN2uTHzp66me1k-v_fvM5B-848nVqpHpYeZ83VUlsSRDxZH_mOAr2dN2FN5o28MFseRRrizw1JnUW53CY9Q6jhynQkXT2DbZmjY" alt=""><figcaption></figcaption></figure>

Langkah selanjutnya analisis fungsi pengecekan, terlihat bahwa terdapat fungsi swap yang dilakukan pada algoritma diatas. Jadi karena algoritmanya hanya swap, maka kita bisa lakukan pemetaan dengan cara menginputkan nilai yang berbeda sebesar 30 bytes dan set breakpoint pada 0x017CE .&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/ddvnL_An03JAgiT448IplQCnZiMBOQz6wczlA-eJGk8sIJbur-j7E-YwxZYzp1T30e_4GL4Y3Q_8pxR3EtWJGjBRw_ziCAqjwWZF61W9u_gYBnPkch6WagVmIaNS01szTyacyT7lVutiz3aKor95eCc" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/YDFolUEPtYSVPyZhviDE7Kw6mi4SDeRlbmx-pAjn9KSsbT8bosQduBu0lAQvD3x5T3NHUVRnNuF_a7iiQfWa7_-ytWdtiIRu1rQsJ6wI5533tHb3Oz1rIpWO94yYcshvmsGqYLK2oNdaF1GlfPrJKcE" alt=""><figcaption></figcaption></figure>

Berikut solver yang kami gunakan untuk mendapatkan input yang valid.

```python
import string

ori = string.printable[:0x1e]
mapp = "stcdefgh01stcdefgh012345ijklmn45ijklmn6789abopqr"

ct = "ss_is_beusss_is_beuse_sttter_isttter_iring_h_gue"
index = []
flag = [0 for i in range(0x1e)]
for i in mapp:
	index.append(ori.index(i))
for i in range(len(ct)):
	flag[index[i]] = ct[i]
print(''.join(flag))
```

<figure><img src="https://lh7-us.googleusercontent.com/VyDSs6y7QbA2R5V1vSMDZhNSLjd0Bl597XY5i1rHBECDGHs7HTHxF5HUXmJL60DZi2o_8CmYOZdvhfnb_ksU3J1k1V4hE0KhWSo4PX2pB7jrm_hTXUYQrHj51Q5NExVvzokeOhhnL-EbNp7oGoe4pPQ" alt=""><figcaption></figcaption></figure>

Flag : NCW22{use\_string\_h\_is\_better\_i\_guess}
