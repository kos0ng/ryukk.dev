# Reverse Engineering

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>Broken Shop 🏬 (320 pts)</td><td><a href="#broken-shop-320-pts">Here</a></td></tr><tr><td>isHeReact? (380 pts)</td><td><a href="#ishereact-380-pts">Here</a></td></tr><tr><td>Broken PM (400 pts)</td><td><a href="#broken-pm-400-pts">Here</a></td></tr></tbody></table>

## Broken Shop 🏬 (320 pts)

### Description

\-

### Solution

Diberikan file PE, buka dengan ida. Terdapat beberapa fungsi yang dibuat oleh probset, ubah variable yang menyimpan fungsi untuk mempermudah tracing

<figure><img src="https://lh7-us.googleusercontent.com/A67kaL1Kytwt5fxfzOPvmJZcbgFhKdQfH2yhliIZb9jNQL7Mcs_8-VVSSjt-J7CLASKvLqzXgrZ2yylz9UUoAcE9XvSadX7tj7KMlEFQeCm_0Ryu6PK2WmUShVSoo08ETvxclhxa1taEJRawH1pZYZI" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/OU0xvI8ULYZZIz0LaZkLm9DUoIqGubAMAxnZfFR0Oo6fRRZu14d39VlRifljFsOE47nXGtdKQzLyESUDM1IkY8Zp1CKvLvJo-7AW-wVaNEYrEm35nvmvSS6_7FRfGDVC3MKT2AoBwqV1p0SZtPTnl_E" alt=""><figcaption></figcaption></figure>

Diketahui bahwa func4 merupakan fungsi flag, karena uang kita 0 dan hanya bisa menambah 1 setiap klik maka cara paling mudah adalah bypass validasi pengecekan uang.&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/ol3LDC4djhgOVgTTo1YEBEDGDF1641G_gTcTU93bCjmVjH3y4npngVKX5iBKAG1fTiAU6GCR_K1L-K76NCc4rbYdOFy7Kmj8P7yWrEywBtJF8ZL-sti9QO66OWEVfnjgUa-4al9aIe-M_zUwyEnH_t0" alt=""><figcaption></figcaption></figure>

Run program lalu ubah nilai esi == ebx pada breakpoint 0xf89f8d

<figure><img src="https://lh7-us.googleusercontent.com/pN1bs52gs6VW_0VYv5xgNDnCMSl7-DoQtdCO1OWShLub7vQCzs9E1Xaak0qCMNTS_WlPSB6Ia1ajwK9x_voZLnyXNblCgo2ebCQeDlBIlgZq9z40vC9CTlZ-s_A6mYgDBQ4lkctwFghlz9Mj_30aF2k" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/-lGkAGiDVZ7L5YMXfnDUWxBP-3o_nkpczaEsg4lRQSR_aoE7DLm92GdB3FMsjYPPhOTDuYdcHwmBOfi01VcwikKZyX8Ur8BhNUev9JOpvpFYRI3KQZGDvzfzdk6zhEirSjgtIXLJogMU9qWujTinWYw" alt=""><figcaption></figcaption></figure>

Lalu lanjutkan

<figure><img src="https://lh7-us.googleusercontent.com/di74-CGolZPJURWSDFJRCVxo3N1Ab55kcENyV7aY4UarboFafr7CxdFHoFgfHs8Na6oxhcLCLBUlHcJTqqkc2Ro8G9ayaKB3PVibvmHVHkiIGbatp_c161ZbwZSGnCdPrHLl3uZP56eVqch4bMArp5k" alt=""><figcaption></figcaption></figure>

Flag : IFEST23{4r3\_y0u\_Ch4n9e\_7H3\_V4lu3}

## isHeReact? (380 pts)

### Description

\-

### Solution

Diberikan APK yang dibuat dengan react native, lakukand extract terhadap file apk dan dapatkan index.android.bundle pada assets.

<figure><img src="https://lh7-us.googleusercontent.com/V7aY5tnsS_tpq5FkwQc301KlocH1FuYoSfKSODxyvfEQbQ8eODABAx1Z5PMbfEvEHls08MEnrVxsV8-AF_NGlIHVrFh_g1kMdJd25CkhUA3KPd_sY2TWNYZ9sO8eHQ47V0MEhnkyiT0BreS_m7DzGiY" alt=""><figcaption></figcaption></figure>

Diketahui bahwa file tersebut merupakan hermes javascript bytecode, cari di internet untuk cara decompilenya dan didapatkan repo berikut <https://github.com/P1sec/hermes-dec> . Lakukan decompile dengan hermes-dec.

<figure><img src="https://lh7-us.googleusercontent.com/ArCiqhbudEpBt3ZpiZb-UM77gLpQk47RO0S_SV5Q16VR4whfIcDw87NH2pZ5pXMIWK2hWcD2VMx0OPRhjECFK7unzB5bdweiFXU8U3o_BpofINVJF_ECwvdrJYV9kBD6KzlYwUU38xvixuinBP4bADI" alt=""><figcaption></figcaption></figure>

Saat menjalan APK diketahui bahwa terdapat output “flag value is false” ketika menginputkan nilai random. Jadi cari string tersebut

<figure><img src="https://lh7-us.googleusercontent.com/6LSdL43EHGgk8dy0o9bNif1BiWhn2y7HvOlNZErLCmZhikA8bHwrPxPT_dyxDm62GNKXHNXMPP-qp5g74RLgmQjzWefy5bS5B90sGLikpWYo0oCssfL9HMHp0O9XQoJW1FpaMxRxaEtTTBRNR03eevM" alt=""><figcaption></figcaption></figure>

Setelah didapatkan cek baris kode sebelumnya yang melakukan validasi. Diketahui terdapat beberapa ciphertext yang memiliki format Salted\_\_ (sama seperti keluaran dari openssl). Scroll keatas lagi dan didapatkan potongan kode berikut

<figure><img src="https://lh7-us.googleusercontent.com/VwiTP5mNZn2xbmn4ygVLEfuNTrXolM20IqRXE2vU2OriP1cdOmXxbdu8KGYzbRCJp7JfJWGX08yZoMQuACTcdb_87XDMSl5Tsl0i7Sfkh7XUgEbzOCgR2dhs2VuGycccYSHjJBBBRaofnAdkPbduBoA" alt=""><figcaption></figcaption></figure>

Terlihat bahwa terdapat fungsi aes decrypt dari crypto js dan key juga terlihat. Jadi tinggal decrypt dengan crypto-js

```javascript
var CryptoJS = require("crypto-js");

ciphertext = 'U2FsdGVkX18dMk/GIJL1qy3QhrPWtNxuUW/yG+qoW0PGmYIB8+R74+E8YLcZ+lY3';

var bytes  = CryptoJS.AES.decrypt(ciphertext, 'Th!5-SeCr3t-K3y!');
var originalText = bytes.toString(CryptoJS.enc.Utf8);

console.log(originalText);
```

<figure><img src="https://lh7-us.googleusercontent.com/sA1E5ek1fxJWEUdnsZDa9y5-MEsH_5Wl9wRf2aRwm9f2nYXI4npN8I4o1x9CA1E2SrwYTJ_z1oU_Wjp_AUGo2ar2Xq-l-MOrMoMzaoe8pC7ttESQrMu8kMmPB5p_s1zKHGs1v_9Vb7s_eoIeEStG2Ys" alt=""><figcaption></figcaption></figure>

Flag : IFEST23{s1Mp13\_f14G\_yUP\_8f3d8a}

## Broken PM (400 pts)

### Description

\-

### Solution

Diberikan APK, lakukan decompile dengan JADX-GUI.

<figure><img src="https://lh7-us.googleusercontent.com/9RPe6WfBPsaNBw2Ujid_vNdYUSrcVZUgu9pr6AIAJFiQ7Xny5gJ2i9uF0S0CrElQCArzEZATWit-aPJM8nCn0Gqmcp6qLq8O1AJz3FHkj1Vs9J0evtEq6ikgO_k6UdUfXuQOfbd7BUUIo3Hyzb7PiKk" alt=""><figcaption></figcaption></figure>

Pada Home.java terdapat pengecekan emulator dan rooted device.&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/5GrSZF0A2GCOsU7ENQAh48p0qFXyB1WcmVq0NYCILpWbcpZBTtFYaCtQTZUheyKnvCkr61ss4dMgMsi1YxBv1P8DcQdTEC9u-vBHBJDxX1xNcXuw-yIXZXdXdbes9RjIJdC9dYWxTnC05ulW7kUTyoQ" alt=""><figcaption></figcaption></figure>

Pada ifestaccount terdapat pemanggilan flag jika location sesuai. Langkah yang kami lakukan pertama adalah melakukan patch terhadap smali untuk melakukan bypass terhadap rooted device, entah kenapa deteksi emulator tidak mendeteksi emulator saya (avd).&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/hEQoCvwphrHIgg03B4SHDB4ierFn8bjo_rxF9Ofn2lKAOl4KBCVuEflULCRzARWDSkcJhd8_jHe5_oxLJ2Er--JxSXrJ7t8lZEeF-06PXYKmVULq6_weNRb4IpDTK7TqJAIzohaUJRCeQdwlewdauK8" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/IhZ6FrPVcsc4vth7Yrvb3oiabixBqHE7gLB3wWVzJppjNMCp-70cb6ry4_4GXeJaaLOkcn-ttP4_PwJTr_LuX2fDD_y3CTxx2V9BtYHlMdqnYUUC7w5wx0I4Cu8AXpj1OIf5jAvCaCADp_5lOPYxd1k" alt=""><figcaption></figcaption></figure>

Pada masing-masing smali di Home$n smali ubah pengecekan menjadi if-nez. Selanjutnya compile kembali dengan “apktool b SecureApp” dan sign dengan uber signer. Setelah di sign selanjutnya tinggal gunakan frida untuk trigger pemanggilan terhadap getFlag saat salah satu fungsi di trigger dimana disini kami trigger getflag ketika fungsi doubleToDigitArray dijalankan. Berikut script yang kami gunakan

```javascript
//frida -U -f com.ifest.passmanager -l hook.js
Java.perform(function x() { 

    var tmp = Java.use("com.ifest.passmanager.utils.NumberingUtils");
    var zz = Java.use('com.ifest.passmanager.utils.GetFlagUtils');
    tmp.doubleToDigitArray.implementation = function (x) {
        console.log("doubleToDigitArray(" + x + ")");
        var ret_value = this.doubleToDigitArray(248568);
        var currentApplication = Java.use('android.app.ActivityThread').currentApplication();
        var context = currentApplication.getApplicationContext();
        console.log(zz.$new().retrieveData(context));
        console.log("ret(" + ret_value + ")");
        return ret_value;
    }
});
```

<figure><img src="https://lh7-us.googleusercontent.com/5yuk_KuRMFo6HE-2liD1ItAwpYfJ9wMDK2DMV3MH5feo9EawpINVr9WwTiQUAbXiXZXubYx2lJdR5TUYgP_3qc8tVXRf5pY42v9dfm65IVZgJaUrDmN1atLtJT2GACX3LrLjqnxjUc5A7qd4Yw0Y54Y" alt="" width="375"><figcaption></figcaption></figure>

Flag : IFEST23{Wh4T\_d0\_Y0u\_Th1Nk\_4B0u7\_th15\_4pP\_1t\_S0\_5eCuR3\_R19hT}
