# Mobile

<!-- challenge-index: d9e4d7dfc36ccecc -->

| Challenge | Topic |
| --- | --- |
| [baby-jni (139 pts)🥈](#baby-jni-139-pts) | Android JNI, Memory Inspection |
| [Intention (400 pts)](#intention-400-pts) | Android Intents |
| [Image Converter (484 pts)](#image-converter-484-pts) | Android Intents, Shared Preferences |
| OTA (todo) | Mobile Security |

*Unlinked challenges do not have a published write-up here.*

<!-- /challenge-index -->

## baby-jni (139 pts)

### Description

\-

### Solution

Diberikan file APK dan source code

<figure><img src="https://lh7-us.googleusercontent.com/tH7ysftDRDKZwURRUHwdvgQQyyDfYjWOQ8qGQaq5lqgr5WMNUy2xKKLmPnH5-uq3h-idHWb7ntoguV6eElfOdQgJx2FRO4MDK6REEZVVxv2LQpgSYEXlG0lat7kntAfRRs4-amX8SszZt4ZME09wYoQ" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/l7kakjCutiHznHSYAG06u1bXBYkCBGLrTZRdldrGpBJ0LqhB1HSusKM2WkVFptiqeLgaGI3lYt4wJDXnMAf9PiAHR01xFfbMOfEqQ-T077Ld_wexs4S_b0U90q9vwNPLydxHSfalF48ZJuk7_pFpa9Q" alt=""><figcaption></figcaption></figure>

Jadi intinya flag disimpan pada library baby jni dan hanya ditampilkan address dari variable env dan result. Disini kita bisa gunakan jnitrace (<https://github.com/chame1eon/jnitrace>) untuk melihat data yang digunakan oleh fungsi-fungsi dari JNI dan salah satunya adalah NewStringUTF(flag).&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/-nOq9_FQxO2WzbG5HLY5zydMSh-lUkoO-lm0xrI_U5CBzP6TOOuQm-EZlZC4mHlCD0HeZIuCCzmSzLeu_Npz79tu50npulJMlDO7N96NJqF8j91f4MoAiCqYqqg4PRCHl2vOoSS7QYdWfytwKH4VlYQ" alt=""><figcaption></figcaption></figure>

Flag : INTECHFEST{Th1S\_w4S\_Ju5t\_a\_w4rM\_Up\_M0b1l3\_Ch4LL\_\_\_N0w\_Ar3\_Y0u\_R3adY\_f0r\_th3\_R3aL\_m0b1L3\_ChaLL?!}

## Intention (400 pts)

### Description

\-

### Solution

Diberikan file APK, lakukan decompile

<figure><img src="https://lh7-us.googleusercontent.com/Erzxqq16TFzfUj-FwALtzBAtJbRScSORsiCEoknEux5wACE9KdxtQpZBE_3VEBC4SS7pQmQhwAFcic5Av3x-UXIKttR-lJGEfrViLpi4VVqp1LdWhgzYDZR9UOvrp_R5zVAwxROqQtJQWItDEjISKqA" alt=""><figcaption></figcaption></figure>

Pada MainActivity dapat diketahui bahwa ketika dilakukan klik terhadap button flag\_sender maka akan dijalankan SecondActivity.&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/VpEYqHXRvAb6A3RDlhUCZKG_R0N5vxG28CbioFwull0ik56iA0cNRQ-TlPPn-63je9EEGvXJUddI1vzr6XT33F4p2XvEeyIPQYd16U2ONlggUL4PMOzmpd68xzIpJ8dAhEw4T2qrVshlgAtEmjlrU9A" alt=""><figcaption></figcaption></figure>

Pada SecondActivity dapat diketahui bahwa terdapat proses penambahan extra data dengan key flag menggunakan intent. Jadi malicious apk yang akan kita buat bertujuan untuk melakukan leak terhadap value dari key flag pada intent dengan . Caranya adalah dengan menjalankan SecondActivity dengan intent karena activity tersebut memiliki atribut exported=true

<figure><img src="https://lh7-us.googleusercontent.com/CRAOezQ4kfC4CPOgGlEvLtGQCIVHC4VhUZV7UTX2MREQlNcmpmv__yjouv4T1G2Pah97VEv_lAbLurHEghP6JJXB4efpc6BKUDmLGCPxyM-Fz0M-G7y0dJb5kX7Q5GvfAScahYpoalaovyV33xTQ2Q4" alt=""><figcaption></figcaption></figure>

Berikut potongan kode dari APK yang kami buat

<figure><img src="https://lh7-us.googleusercontent.com/6WPmju4MmdMg_xWEVyhC9fyuW6BUNLLUJaUOiFLT09waIK-VbjnTYaDvFYe_B_qzHw99gN8peyJFCOtrftazkNjAhxW_x_fgsJkcn1I8rJpwfNFcNUWqE5m27hfANWMsra6QBaTDUgMnajv0d5DUmgc" alt=""><figcaption></figcaption></figure>

Dimana kami menambahkan textView pada layout untuk menampilkan flag yang dileak, jadi ketika activity dijalankan kemudian akan dilakukan listen pada fungsi onActivityResykt dan jika resultCode == 0 (setResut == 0 pada APK target) maka akan diset flag pada textView.

<figure><img src="https://lh7-us.googleusercontent.com/5w8AKEdDyi2M_Yqew2--3-fUqA4hFPfXBE8tkn8ztMHEfASm0IBZXeP3C4_x8VosOwzqEfJMzV-BddR6KsI2AJf_tap3siYjapOPa6K9McZk_76Th262EZ0Nqa4Ss-LDoYoJNTjFspFj8ke7PNF_Woc" alt=""><figcaption></figcaption></figure>

Selanjutnya tinggal kirim APK dan dapat flagnya

<figure><img src="https://lh7-us.googleusercontent.com/7KIc8eIUkL_NlD9iA4ARC3Rf9YhGM159GnvyKxHc3YWqjx6BOiGF_02ue3c9vdNJb--UG-yQOSLJezl88Xuotk09O4lXp559VUs-U7v3IUGrbUoaQv9xcSQOgPW9eXaS1xuN4QzRVnnpDk-8CTnMUMU" alt=""><figcaption></figcaption></figure>

APK dapat diunduh pada link berikut <https://drive.google.com/drive/folders/1X28MNhUWQyQNv-AMSn7JTwG5zjIpZBw3?usp=sharing>&#x20;

Flag : INTECHFEST{MaL1c10u5\_1nt3nt10n}

## Image Converter (484 pts)

### Description

\-

### Solution

Diberikan file APK, lakukan decompile

<figure><img src="https://lh7-us.googleusercontent.com/V6Do-oVEAw0eWDIb79DgUGZclAbQG8ydhROEDmzh-Xpwsgx0d1O6Wb9BKn2F1RDEmKVO2Ti4vwT8JL93QgkQSvgrT5ZagAhWlO-iRj85ifHeQoitPWy3Qoh046jZZbydFv24Ab4GN-6oqtUtVvc_YMc" alt=""><figcaption></figcaption></figure>

Pada MainActivity diketahui bahwa flag disimpan pada shared preference. Pada android, shared preference disimpan sebagai file yaitu pada directory /data/data/\<package\_name>/shared\_prefs/\<package\_name>.xml.

<figure><img src="https://lh7-us.googleusercontent.com/pLRx1KEjuYoqly6-Jf5scAec8hT6-Nhr8QN1R3gRZ3_d2OWMhGmyCDM_U2TsKSb9vBX9zbZtkYCvSwxS63Njnk60XpElArM2meDu3Cfl8VAyE_33EeihUXWfSiRrggjUEsJWcmMsMwVdcdqafWDNI74" alt=""><figcaption></figcaption></figure>

Selanjutnya dapat kita lihat bahwa requestCode 133337 akan membaca file image dan mengubahnya ke bentuk base64. Disini kita bisa melakukan leak terhadap file flag dengan cara memaksa APK target membaca file flag (shared preference) ketika menggunakan action android.intent.action.PICK. Berikut potongan kode dari aplikasi yang kami buat

<figure><img src="https://lh7-us.googleusercontent.com/BFzBIchqSIhUpL7JDCZyYnjzPIB1V8JOKVZRhjQHQTgnUxYdssJwATLIN8pjKpom1Vy2gPZ6quMbxYpcHuH1J9FAIHdmi_a18Ec_AD4SE1ZEBbR4SD2kusQ60Q-fPsBNS_GlUWzykDHG6Rer2AkjC_8" alt=""><figcaption></figcaption></figure>

Intent-filter akan membuat aplikasi kita (malicious apk) tampil ketika dijalankan activity action pick.&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/ZJfywF4BdEljHL7BHnwzH19SpBMfftMINFqkVCGjx7_Msy5HmojeRp4D7ZfPHfZSN7oqxIFbrW9XDtNBgMumzzKqrMyNuMSoGzViLNdQeyh_3qmwevREI1660ufJvnJgu44TBvKEMIYl_-TyXLnWl2Y" alt=""><figcaption></figcaption></figure>

Selanjutnya tinggal kirim APK ke target

<figure><img src="https://lh7-us.googleusercontent.com/btqvjDSybActZI3XSrEjWMu1I5B_5WRdTC-LlZVv8luDgCoXoLjhHI2iBAzSnVDGuEVIFKn9nLPkb8JCuyxG2qeZAY8DMXgIbucEaPz89YXrYzsKW_aaffi8EOP13wYsYf99kntemFGeWw7j-xz8rRk" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/91KUIdAMRkle8hOo63FCixRMOCut48vkjDrc8JVjTcIK6rRNs7JDPyhGMFr6BNxuzBHwpgJyuadgAZUkaKo5sqdRxSq4EEwCUZ9GR7THquXhF4jSzcT1gK48lSZNFYgT4uWMdufFnmzbUKUnUo8PbVs" alt=""><figcaption></figcaption></figure>

Lakukan base64 decode dan dapat flag

<figure><img src="https://lh7-us.googleusercontent.com/r1Fp8zBW_34WUiyYXXQrxSXbo4_iyvFLr3n5VO6Ud6LHJ-wpL9aT6uDVFW61dJkQjCgenxiIm-grfE5Jo6ie9EX1S_MaUeqsnyXx1EgR2pU9mP-4KsnIg5gbAD2e-4Mn8w0idGg0U1WbBamGqb_4ruw" alt=""><figcaption></figcaption></figure>

File APK dapat diunduh pada link berikut <https://drive.google.com/drive/folders/1X28MNhUWQyQNv-AMSn7JTwG5zjIpZBw3?usp=sharing>&#x20;

Flag : INTECHFEST{c3rN1fi3d\_1nt3nt\_f0rg3r}
