# Mobile

<!-- challenge-index: b49f5fec5ab03ee2 -->

| Challenge | Topic |
| --- | --- |
| [MyVault (50 pts)](#myvault-50-pts) | Android, AES, PIN Recovery |
| [Brave (499 pts)](#brave-499-pts) | Android, Frida, Environment Checks |
| [Tracer (500 pts)](#tracer-500-pts) | iOS, Firebase |

<!-- /challenge-index -->

## MyVault (50 pts)

### Description

Welcome to our secure vault !

### Solution

Given APK file, decompile using jadx-gui.

```java
package com.tarek.myvault;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import d.m;
import i.c;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;

/* loaded from: classes.dex */
public class MainActivity extends m {
    @Override // androidx.fragment.app.u, androidx.activity.k, v.g, android.app.Activity
    public final void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        setContentView(R.layout.activity_main);
        File file = new File(getCacheDir() + "/vault.enc");
        if (file.exists()) {
            return;
        }
        try {
            InputStream open = getAssets().open("vault.enc");
            byte[] bArr = new byte[open.available()];
            open.read(bArr);
            open.close();
            FileOutputStream fileOutputStream = new FileOutputStream(file);
            fileOutputStream.write(bArr);
            fileOutputStream.close();
            ((Button) findViewById(R.id.btnSubmit)).setOnClickListener(new c(this, (EditText) findViewById(R.id.editTextOTP), 2));
        } catch (Exception e3) {
            throw new RuntimeException(e3);
        }
    }
}

```

Looking at MainActivity, we can see that there is a read process for file "vault.env" on cache directory. After that there is a call to function c with editTextOTP as argument. editTextOTP is input field which is OTP on main screen when we open the APK.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FZbq23q6msjcTRhv9jiTL%2Fimage.png?alt=media&amp;token=651ab934-6bf2-4842-b62f-1a6be2cb6464" alt="" width="375"><figcaption></figcaption></figure>

{% code title="i/c.java" %}

```java
----snippet-----
public /* synthetic */ c(KeyEvent.Callback callback, Object obj, int i3) {
        this.f2015a = i3;
        this.f2017c = callback;
        this.f2016b = obj;
    }
@Override // android.view.View.OnClickListener
    public final void onClick(View view) {
        String str;
        int i3 = this.f2015a;
        Object obj = this.f2017c;
        Object obj2 = this.f2016b;
        switch (i3) {
            case 0:
                ((g.c) obj2).a();
                return;
            case 1:
                c4 c4Var = (c4) obj;
                Window.Callback callback = c4Var.f2031k;
                if (callback != null && c4Var.f2032l) {
                    callback.onMenuItemSelected(0, (h.a) obj2);
                    return;
                }
                return;
            default:
                String obj3 = ((EditText) obj2).getText().toString();
                MainActivity mainActivity = (MainActivity) obj;
                mainActivity.getClass();
                try {
                    String sb = new StringBuilder(obj3).reverse().toString();
                    File file = new File(mainActivity.getCacheDir(), "vault.txt");
                    File file2 = new File(mainActivity.getCacheDir(), "vault.enc");
                    SecretKeySpec secretKeySpec = new SecretKeySpec((obj3 + sb + obj3 + sb).getBytes(), "AES");
                    Cipher cipher = Cipher.getInstance("AES");
                    cipher.init(2, secretKeySpec);
                    FileInputStream fileInputStream = new FileInputStream(file2);
                    byte[] bArr = new byte[(int) file2.length()];
                    fileInputStream.read(bArr);
                    byte[] doFinal = cipher.doFinal(bArr);
                    FileOutputStream fileOutputStream = new FileOutputStream(file);
                    fileOutputStream.write(doFinal);
                    fileInputStream.close();
                    fileOutputStream.close();
                    str = "Congrats!";
                } catch (Exception unused) {
                    str = "Incorrect OTP";
                }
                Toast.makeText(mainActivity, str, 0).show();
                return;
        }
    }
----snippet-----
```

{% endcode %}

Looking at onclick listener on c class. We can see that it will decrypt vault.enc if the third argument is 2 (default switch case). To decrypt the file, we know all the needed data which are

* Algorithm -> AES ECB
* Key -> processed from input (OTP)
  * OTP + reverse(OTP) + OTP + reverse(OTP)
  * e.g OTP = 1234
    * key == 1234432112344321
* Encrypted data -> dump from cache dir

Cache dir is located in /data/data/your.application.package/cache based on this [reference](https://stackoverflow.com/questions/13599383/context-getcachedir-and-environment-getcondownloadcachedirectory-android). Our target application has package name com.tarek.myvault, so below is our final command to dump the file.

```bash
adb pull /data/data/com.tarek.myvault/cache/vault.enc
```

After getting the file, since we dont know the valid OTP we can bruteforce it locally.&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FTYe3NmsmZXXB2XcDVJvz%2Fimage.png?alt=media&amp;token=cbac1f0f-16bc-4a16-a298-7ce01f92c53e" alt="" width="375"><figcaption></figcaption></figure>

Length of OTP is 4, so we can just bruteforce it and validate if there is flag format then print it.

```python
from Crypto.Cipher import AES
from itertools import product
import string

list_char = string.digits

ct = open("vault.enc", "rb").read()

for i in product(list_char, repeat=4):
	tmp = ''.join(i)
	key = tmp + tmp[::-1]
	key += key
	cipher = AES.new(key.encode(), AES.MODE_ECB)
	pt = cipher.decrypt(ct)
	if(b"0xL4ugh" in pt):
		print(key, pt)
		break
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FrwiLlhBEjQDuqo1bjOvE%2Fimage.png?alt=media&amp;token=a90ba7d6-bd2b-4635-90a5-68d73ad40bba" alt=""><figcaption></figcaption></figure>

Flag :  0xL4ugh{Y0u\_Ar3\_FoRceR\_Like\_A\_H0uRc3}

## Brave (499 pts)

### Description

Only brave players can win :)

### Solution

At first, i installed the APK on emulator, then opened it

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FwOXWcnJktQ9xTtSys7Yh%2Fimage.png?alt=media&amp;token=06b62424-4589-43b4-8f1b-a5aa9d9dfc3b" alt="" width="375"><figcaption></figcaption></figure>

As we can see on image above, when i try to open it on emulator it show toast with text "Bad env". So lets try to decompile it using jadx-gui.

```java
package com.tarek.brave;

import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Base64;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;
import androidx.constraintlayout.widget.ConstraintLayout;
import c4.c;
import com.tarek.brave.MainActivity;
import d.j;
import d.k;
import d.l;
import d4.a;
import f3.e;
import f3.f;
import f3.i;
import h.a0;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.function.Consumer;
import java.util.function.Function;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import k3.g0;
import k3.k0;
import k3.n;
import p3.g;
import y2.h;

/* loaded from: classes.dex */
public class MainActivity extends l {

    /* renamed from: x  reason: collision with root package name */
    public static final /* synthetic */ int f1998x = 0;

    /* renamed from: v  reason: collision with root package name */
    public String f1999v;

    /* renamed from: w  reason: collision with root package name */
    public a f2000w;

    static {
        System.loadLibrary("brave");
    }

    public MainActivity() {
        this.f101e.f6069b.c("androidx:appcompat", new j(this));
        k(new k(this));
    }

    public native boolean brave();

    /* JADX WARN: Type inference failed for: r0v12, types: [java.lang.Object, java.util.function.Function] */
    @Override // androidx.fragment.app.u, androidx.activity.o, v.k, android.app.Activity
    public final void onCreate(Bundle bundle) {
        e a6;
        super.onCreate(bundle);
        KeyEvent.Callback callback = null;
        boolean z5 = false;
        View inflate = getLayoutInflater().inflate(R.layout.activity_main, (ViewGroup) null, false);
        if (inflate instanceof ViewGroup) {
            ViewGroup viewGroup = (ViewGroup) inflate;
            int childCount = viewGroup.getChildCount();
            int i5 = 0;
            while (true) {
                if (i5 >= childCount) {
                    break;
                }
                KeyEvent.Callback findViewById = viewGroup.getChildAt(i5).findViewById(R.id.sample_text);
                if (findViewById != null) {
                    callback = findViewById;
                    break;
                }
                i5++;
            }
        }
        TextView textView = (TextView) callback;
        if (textView != null) {
            ConstraintLayout constraintLayout = (ConstraintLayout) inflate;
            this.f2000w = new a(constraintLayout, textView);
            setContentView(constraintLayout);
            TextView textView2 = (TextView) this.f2000w.f2273b;
            boolean brave = brave();
            if (!brave && Build.getRadioVersion() == null) {
                if (brave || Build.getRadioVersion() != null) {
                    Toast.makeText(this, "Bad env", 0).show();
                    textView2.setText("You are't brave enough, go away from here...!");
                    int i6 = 20 / 0;
                    System.exit(0);
                }
                textView2.setText("Are you brave?");
            } else {
                Toast.makeText(this, "Bad env", 0).show();
                textView2.setText("You are't brave enough, go away from here...!");
                int i7 = 20 / 0;
                System.exit(0);
            }
            final String sharealike = sharealike();
            CompletableFuture completableFuture = new CompletableFuture();
            h d5 = h.d();
            d5.b();
            String str = d5.f6087c.f6100c;
            if (str == null) {
                d5.b();
                if (d5.f6087c.f6104g != null) {
                    StringBuilder sb = new StringBuilder("https://");
                    d5.b();
                    str = androidx.activity.h.m(sb, d5.f6087c.f6104g, "-default-rtdb.firebaseio.com");
                } else {
                    throw new RuntimeException("Failed to get FirebaseDatabase instance: Can't determine Firebase Database URL. Be sure to include a Project ID in your configuration.");
                }
            }
            synchronized (e.class) {
                if (!TextUtils.isEmpty(str)) {
                    d5.b();
                    f fVar = (f) d5.f6088d.a(f.class);
                    x2.e.s(fVar, "Firebase Database component is not present.");
                    n3.h d6 = n3.k.d(str);
                    if (d6.f4441b.isEmpty()) {
                        a6 = fVar.a(d6.f4440a);
                    } else {
                        throw new RuntimeException("Specified Database URL '" + str + "' is invalid. It should point to the root of a Firebase Database but it includes a path: " + d6.f4441b.toString());
                    }
                } else {
                    throw new RuntimeException("Failed to get FirebaseDatabase instance: Specify DatabaseURL within FirebaseApp or from your getInstance() call.");
                }
            }
            synchronized (a6) {
                if (a6.f2691c == null) {
                    a6.f2689a.getClass();
                    a6.f2691c = n.a(a6.f2690b, a6.f2689a);
                }
            }
            k3.l lVar = a6.f2691c;
            k3.f fVar2 = k3.f.f4095d;
            p3.f fVar3 = p3.f.f4708f;
            if (fVar2.isEmpty()) {
                n3.l.b("Flag");
            } else {
                n3.l.a("Flag");
            }
            k3.f e5 = fVar2.e(new k3.f("Flag"));
            f3.j jVar = new f3.j(lVar, e5);
            g0 g0Var = new g0(lVar, new a0(jVar, new c(completableFuture, 0), 19), new g(e5, jVar.f2701c));
            k0 k0Var = k0.f4127b;
            synchronized (k0Var.f4128a) {
                try {
                    List list = (List) k0Var.f4128a.get(g0Var);
                    if (list == null) {
                        list = new ArrayList();
                        k0Var.f4128a.put(g0Var, list);
                    }
                    list.add(g0Var);
                    if (!g0Var.f4109f.b()) {
                        g0 g0Var2 = new g0(g0Var.f4107d, g0Var.f4108e, g.a(g0Var.f4109f.f4714a));
                        List list2 = (List) k0Var.f4128a.get(g0Var2);
                        if (list2 == null) {
                            list2 = new ArrayList();
                            k0Var.f4128a.put(g0Var2, list2);
                        }
                        list2.add(g0Var);
                    }
                    g0Var.f4106c = true;
                    n3.k.c(!g0Var.f4104a.get());
                    if (g0Var.f4105b == null) {
                        z5 = true;
                    }
                    n3.k.c(z5);
                    g0Var.f4105b = k0Var;
                } catch (Throwable th) {
                    throw th;
                }
            }
            lVar.g(new i(jVar, g0Var, 1));
            completableFuture.thenAccept(new Consumer() { // from class: c4.a
                @Override // java.util.function.Consumer
                public final void accept(Object obj) {
                    String str2;
                    String str3 = sharealike;
                    MainActivity mainActivity = MainActivity.this;
                    mainActivity.f1999v = (String) obj;
                    try {
                        SecretKeySpec secretKeySpec = new SecretKeySpec(str3.getBytes(), "AES");
                        Cipher cipher = Cipher.getInstance("AES");
                        cipher.init(1, secretKeySpec);
                        str2 = Base64.encodeToString(cipher.doFinal(mainActivity.f1999v.getBytes()), 0);
                    } catch (Exception e6) {
                        e6.printStackTrace();
                        str2 = null;
                    }
                    SharedPreferences.Editor edit = mainActivity.getSharedPreferences("brave", 0).edit();
                    edit.putString("brave", str2);
                    edit.apply();
                }
            }).exceptionally((Function<Throwable, ? extends Void>) new Object());
            return;
        }
        throw new NullPointerException("Missing required view with ID: ".concat(inflate.getResources().getResourceName(R.id.sample_text)));
    }

    public native String sharealike();
}

```

We can see that there is branch based on native library function return and getRadioVersion return.

```java
----snippet----
if (!brave && Build.getRadioVersion() == null) {
    if (brave || Build.getRadioVersion() != null) {
----snippet----
```

Those branch will create toast "Bad env" if condition like below

| brave | getRadioVersion | result  |
| ----- | --------------- | ------- |
| True  | True            | Bad env |
| True  | False           | Bad env |
| False | False           | Bad env |
| False | True            | Good    |

So we need to get brave value as False and getRadioVersion == null as True to pass the bad env check. In this case we can use frida to manipulate return value of each function. To make the debugging process easier, we can change string value showed on toast by patching the smali. Decompile the APK first

```
apktool d brave.apk
```

Change string value for each "Bad env"

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FaC3R5pdiI1x5gCignMsO%2Fimage.png?alt=media&amp;token=f3c05216-1e4e-485b-acb7-35790061fea2" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FWMM00WQC2i9vZfD4BJgE%2Fimage.png?alt=media&amp;token=c0e603fe-9fd9-4d0a-8022-b1fa43a6838b" alt=""><figcaption></figcaption></figure>

During the recompilation process, we will facing issue like image below

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FefHNj9w21nmvScH6ePi5%2Fimage.png?alt=media&amp;token=b0eeaa1d-3797-49d6-91f9-741efe45d5d7" alt=""><figcaption></figcaption></figure>

To fix this issue, we can replace all @android value in colors.xml with @\*android based on this [reference](https://github.com/iBotPeaches/Apktool/issues/810#issuecomment-315260259). After that just recompile and it will be successful.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FrYZuVedpvzlFWjTFj3cj%2Fimage.png?alt=media&amp;token=d8b37dca-159b-446c-b138-74f396e9213c" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fi6dECv5Z4j4iLI6nueGG%2Fimage.png?alt=media&amp;token=91b77a70-0e62-48e8-8727-51a1073dfa0c" alt=""><figcaption></figcaption></figure>

Sign the APK using uber-apk-signer using command below and then install the signed version (brave-aligned-debugSigned.apk).

```bash
java -jar uber-apk-signer-1.2.1.jar --allowResign -a brave/dist/brave.apk
```

When i tried to hook the function using my script, it didn't show "Bad env 1" or "Bad env 2".

{% code title="" %}

```javascript
function changesValue() {
	Java.perform(function() 
 		{ 		
 		var class_name = Java.use("android.os.Build")
 		class_name.getRadioVersion.implementation = function(){
 			console.log("getRadioVersion called")
 			return null
 		}
 	})
}

setImmediate(changesValue);
```

{% endcode %}

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fbz0EmEYNlYpt7qVDXLXl%2Fimage.png?alt=media&amp;token=672c0b4e-8809-4d8d-9e49-9bf49cc328da" alt="" width="375"><figcaption></figcaption></figure>

From image above, we can conclude that there is another "checking", searching in decompiled directory from apktool we found there is "Bad Env" string on library.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FU6BvfUD3alaNcFNnTcEO%2Fimage.png?alt=media&amp;token=f8d65b66-a2a6-4d47-a6ed-f0513701b9c6" alt=""><figcaption></figcaption></figure>

Since my emulator use aarch64, i will patch library on arm64-v8a directory. In this case we can use decompiler like ghidra or ida to decompile then patch the function.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FCzzwHgnEculoa8bey9ap%2Fimage.png?alt=media&amp;token=e2614210-4725-4a8b-a1b7-114ba4ac0cad" alt="" width="375"><figcaption><p>Search "Bad Env" string</p></figcaption></figure>

Check the call reference, we will get into Java\_com\_tarek\_brave\_MainActivity\_brave function.

```c
__int64 __fastcall Java_com_tarek_brave_MainActivity_brave(__int64 a1, __int64 a2)
{
  FILE *v4; // x0
  FILE *v5; // x21
  __int64 v6; // x21
  __int64 v7; // x22
  __int64 v8; // x0
  __int64 v9; // x20
  __int64 v10; // x0
  char s[512]; // [xsp+8h] [xbp-208h] BYREF
  __int64 v13; // [xsp+208h] [xbp-8h]

  v13 = *(_QWORD *)(_ReadStatusReg(ARM64_SYSREG(3, 3, 0xD, 0, 2)) + 40);
  if ( (isDeviceRooted() & 1) != 0 )
  {
LABEL_6:
    v6 = (*(__int64 (__fastcall **)(__int64, const char *))(*(_QWORD *)a1 + 48LL))(a1, "android/widget/Toast");
    v7 = (*(__int64 (__fastcall **)(__int64, __int64, const char *, const char *))(*(_QWORD *)a1 + 904LL))(
           a1,
           v6,
           "makeText",
           "(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;");
    v8 = (*(__int64 (__fastcall **)(__int64, const char *))(*(_QWORD *)a1 + 1336LL))(a1, "Bad Env");
    v9 = _JNIEnv::CallStaticObjectMethod(a1, v6, v7, a2, v8, 1LL);
    v10 = (*(__int64 (__fastcall **)(__int64, __int64, const char *, const char *))(*(_QWORD *)a1 + 264LL))(
            a1,
            v6,
            "show",
            "()V");
    _JNIEnv::CallVoidMethod(a1, v9, v10);
    exit(0);
  }
  v4 = fopen("/proc/self/maps", "r");
  if ( v4 )
  {
    v5 = v4;
    while ( fgets(s, 512, v5) )
    {
      if ( strstr(s, "frida") )
        goto LABEL_6;
    }
    fclose(v5);
  }
  return 0LL;
}
```

We can see that there is checking of rooted device and frida. To bypass this i implemented patching like below

* isDeviceRooted
  \*

  ```
  <figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FNNDMYJVb1HCy5P7lamLd%2Fimage.png?alt=media&amp;token=79955d41-9ec2-4a68-8d06-067ad5d174d7" alt=""><figcaption></figcaption></figure>
  ```

  * My emulator has access to /system/xbin/su and there is possibility that it has access to another related root binary. To bypass this, the easy way is just make the comparation invalid, for example changing from CMP W0, #0 to CMP W0, #4
  *

  ```
  <figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FkJzz85P2fJcOezaxbKBE%2Fimage.png?alt=media&amp;token=ba6fcd12-8ceb-4e36-9636-fc8a38a3029b" alt=""><figcaption></figcaption></figure>
  ```

  * `1F 10 00 71 E0 17 9F 1A FD 7B C1 A8 C0 03 5F D6`
* Frida check

  * It only check string frida, to bypass this we just need to change "frida" to any random string that doesn't exist for example "fridb"
  *

  ```
  <figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FOL24IzChOlCPCkHiPzqN%2Fimage.png?alt=media&amp;token=3200b3a4-5313-46b2-a486-a1b101058f8f" alt="" width="375"><figcaption></figcaption></figure>
  ```

Recompile the APK and run the frida again, we will get valid text which is "are you brave?". In this case we don't need to bypass the brave return, since it failed to detect rooted device and frida after we patch the library.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FoLfU9QOBYgVnIbdbSklI%2Fimage.png?alt=media&amp;token=66cdaf14-d63c-4b63-9722-c4531e76f977" alt=""><figcaption></figcaption></figure>

From the MainActivity, there is some process of string initialization. To check that our flow is correct, we can try to dump the string builder process

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FNWjeMNXn3oLkLruXiPIw%2Fimage.png?alt=media&amp;token=15c5ac3b-507c-402d-9ab6-7c5bddf7584e" alt=""><figcaption></figcaption></figure>

{% code title="change\_ret.js" %}

```javascript
function changesValue() {
	Java.perform(function() 
 		{ 		
 		var class_name = Java.use("android.os.Build")
 		class_name.getRadioVersion.implementation = function(){
 			console.log("getRadioVersion called")
 			return null
 		}
 		 
 		const StringBuilder = Java.use('java.lang.StringBuilder');
  		const ctor = StringBuilder.$init.overload('java.lang.String');
  		ctor.implementation = function (arg) {
    		let partial = '';
    		const result = ctor.call(this, arg);
    		if (arg !== null) {
    		  partial = arg.toString().replace('\n', '');
    		}
    		console.log('new StringBuilder("' + partial + '");');
    		return result;
  		};
  		
  		console.log('[+] new StringBuilder(java.lang.String) hooked');
  
  		const toString = StringBuilder.toString;
  		toString.implementation = function () {
    		const result = toString.call(this);
    		let partial = '';
    		if (result !== null) {
    		  partial = result.toString().replace('\n', '');
    		}
    		console.log('StringBuilder.toString(); => ' + partial);
    		return result;
	  	};
  		console.log('[+] StringBuilder.toString() hooked');
 	})
}

setImmediate(changesValue);
```

{% endcode %}

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FTMKJWEFLsE0CoFNT5v6S%2Fimage.png?alt=media&amp;token=a6cfb586-ed29-4289-b8d2-1b275c5c4031" alt=""><figcaption></figcaption></figure>

As we can see, that there is /Flag access through firebase and from the string builder we can also get the firebase endpoint.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FGu538SxppDQxfUaov4CA%2Fimage.png?alt=media&amp;token=4d3fb791-4c12-4ca9-a10f-8ae05275232f" alt=""><figcaption></figcaption></figure>

Author said that it is intended that /Flag is permission denied, since we are on the correct flow so basically the APK step has been done. Next step is doing exploitation on firebase. Searching firebase endpoint on decompiled directory, we found below information

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FUCEs2Bbigihjwptjb310%2Fimage.png?alt=media&amp;token=91ea2c9f-4f51-40d9-9f99-6bbefab55ac1" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FfxHqGB4Ru5rM2OQ59D2s%2Fimage.png?alt=media&amp;token=577b1e55-360b-4279-a164-55fef3a2dde0" alt=""><figcaption></figcaption></figure>

Actually, in this case all of the data required to access firebase database written on strings.xml. By using those data, i tried to access the firebase database.&#x20;

```javascript
{
"projectId": "my-ctf-2e70b",
"appId": "1:713169998830:android:ee341ad82ed5dd924534ff"
"apiKey": "AIzaSyD3Z8qvgV-XdvDaeX-hnM8sOHXPhV_vIsw",
"databaseURL": "https://my-ctf-2e70b-default-rtdb.firebaseio.com",
"authDomain": "my-ctf-2e70b-default-rtdb.firebaseapp.com",
"storageBucket": "my-ctf-2e70b.appspot.com",
}
```

To get the flag, using those data we just need to signin anonymously based on this [reference](https://firebase.google.com/docs/auth/web/anonymous-auth).&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FmRrQzsVHcrZm5x30ZI0O%2Fimage.png?alt=media&amp;token=f7772d15-e02e-41c9-91d0-4fa30a4c26ac" alt=""><figcaption></figcaption></figure>

Flag : 0xL4ugh{Ohhh!\_F3n\_t3s\_t1c!}

## Tracer (500 pts)

### Description

Believe me, just think out of the box XxXDdd

### Solution

ipa file basically like apk, we can rename it to .zip then unzip it.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F1sqd7SYYhvLe3I4jfUTO%2Fimage.png?alt=media&amp;token=23266d7c-802c-49c1-bb6b-ab67163d6054" alt=""><figcaption></figcaption></figure>

Because 2 challenges before are related to firebase, in this challenge i tried to search firebase string just to make sure that maybe this challenge related to firebase also.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FypSAuUaKcNOUgcxu8BSs%2Fimage.png?alt=media&amp;token=256b9230-4f6b-4ec7-b520-0059a8e32f74" alt=""><figcaption></figcaption></figure>

From image above, we can see that there is firebase string inside tracer file which is the main binary of the application. On the same directory, there is GoogleService-Info.plist file and when i tried to search about it i [found](https://firebase.google.com/docs/ios/setup?hl=en) that the file is related to firebase account. Opening the plist file using xcode i got below information

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FjhNQQaNWfV5766ZoWTHh%2Fimage.png?alt=media&amp;token=1b2e8f1f-ced1-408d-93ff-46d5f4ae6768" alt=""><figcaption></figcaption></figure>

We know that storage bucket URL moslty also project id. So the next step is trying to access firebase project through URL. One of the well known firebase vulnerability is publicly access .json endpoint, so trying that endpoint we got the flag

```
https://ios-83c2f-default-rtdb.firebaseio.com/.json
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FmcOMyA5HyV3ozIqAfK02%2Fimage.png?alt=media&amp;token=28f77996-3461-4b76-9789-088590a6fe38" alt=""><figcaption></figcaption></figure>

Flag : 0xL4ugh{J4st\_f0r\_w3rm\_Up\_XXxDD}
