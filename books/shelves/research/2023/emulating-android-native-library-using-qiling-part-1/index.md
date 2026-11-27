# Emulating Android Native Library using Qiling - Part 1

Study case ADDA CTF 2022 (wonder maze)

## # Preface

During the competition my team got 2nd place on Quals and Final. It was my first time to do emulating using Qiling and it was very powerful since i didn't need to reconstruct the whole code like i did as usual.

## Analyzing APK Statically

Given APK file, decompile using jadx-gui

{% code title="" %}

```java
package com.hexagonal.wondermaze;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.scottyab.rootbeer.RootBeer;
import java.util.Timer;
import java.util.TimerTask;
import kotlin.Metadata;
import kotlin.jvm.internal.Intrinsics;

/* compiled from: MainActivity.kt */
@Metadata(d1 = {"\u00008\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010\u000e\n\u0002\b\u0002\u0018\u00002\u00020\u0001B\u0005¢\u0006\u0002\u0010\u0002J\u000e\u0010\u000b\u001a\u00020\f2\u0006\u0010\r\u001a\u00020\u000eJ\u0012\u0010\u000f\u001a\u00020\f2\b\u0010\u0010\u001a\u0004\u0018\u00010\u0011H\u0014J\u0010\u0010\u0012\u001a\u00020\f2\u0006\u0010\u0013\u001a\u00020\u0014H\u0002J\b\u0010\u0015\u001a\u00020\fH\u0002R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082\u0004¢\u0006\u0002\n\u0000R\u001c\u0010\u0005\u001a\u0004\u0018\u00010\u0006X\u0086\u000e¢\u0006\u000e\n\u0000\u001a\u0004\b\u0007\u0010\b\"\u0004\b\t\u0010\n¨\u0006\u0016"}, d2 = {"Lcom/hexagonal/wondermaze/MainActivity;", "Landroidx/appcompat/app/AppCompatActivity;", "()V", "pow", "Lcom/hexagonal/wondermaze/ProofOfWork;", "timer", "Ljava/util/Timer;", "getTimer", "()Ljava/util/Timer;", "setTimer", "(Ljava/util/Timer;)V", "checkButton", "", "view", "Landroid/view/View;", "onCreate", "savedInstanceState", "Landroid/os/Bundle;", "toast", "message", "", "updateOtp", "app_release"}, k = 1, mv = {1, 6, 0}, xi = 48)
/* loaded from: classes.dex */
public final class MainActivity extends AppCompatActivity {
    private final ProofOfWork pow = new ProofOfWork();
    private Timer timer = new Timer();

    public final Timer getTimer() {
        return this.timer;
    }

    public final void setTimer(Timer timer) {
        this.timer = timer;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // androidx.fragment.app.FragmentActivity, androidx.activity.ComponentActivity, androidx.core.app.ComponentActivity, android.app.Activity
    public void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        setContentView(R.layout.activity_main);
        if (new RootBeer(this).isRooted()) {
            finish();
            System.exit(0);
            throw new RuntimeException("System.exit returned normally, while it was supposed to halt JVM.");
        } else if ((getApplicationContext().getApplicationInfo().flags & 2) != 0) {
            finish();
            System.exit(0);
            throw new RuntimeException("System.exit returned normally, while it was supposed to halt JVM.");
        } else {
            View findViewById = findViewById(R.id.text_otp);
            Intrinsics.checkNotNullExpressionValue(findViewById, "findViewById(R.id.text_otp)");
            ((TextView) findViewById).setText(String.valueOf(this.pow.getOtpCode()));
            Timer timer = this.timer;
            if (timer == null) {
                return;
            }
            timer.scheduleAtFixedRate(new TimerTask() { // from class: com.hexagonal.wondermaze.MainActivity$onCreate$$inlined$timerTask$1
                @Override // java.util.TimerTask, java.lang.Runnable
                public void run() {
                    final MainActivity mainActivity = MainActivity.this;
                    mainActivity.runOnUiThread(new Runnable() { // from class: com.hexagonal.wondermaze.MainActivity$onCreate$1$1
                        @Override // java.lang.Runnable
                        public final void run() {
                            MainActivity.this.updateOtp();
                        }
                    });
                }
            }, 0L, 30000L);
        }
    }

    public final void checkButton(View view) {
        Intrinsics.checkNotNullParameter(view, "view");
        if (this.pow.check(((EditText) findViewById(R.id.editText_otpInput)).getText().toString())) {
            toast("Proof of work is valid!");
            Intent intent = new Intent(this, NavigationActivity.class);
            Timer timer = this.timer;
            if (timer != null) {
                timer.cancel();
            }
            this.timer = null;
            startActivity(intent);
            return;
        }
        updateOtp();
    }

    /* JADX INFO: Access modifiers changed from: private */
    public final void updateOtp() {
        this.pow.regen();
        View findViewById = findViewById(R.id.text_otp);
        Intrinsics.checkNotNullExpressionValue(findViewById, "findViewById(R.id.text_otp)");
        ((TextView) findViewById).setText(String.valueOf(this.pow.getOtpCode()));
    }

    private final void toast(String str) {
        Toast.makeText(this, str, 0).show();
    }
}
```

{% endcode %}

From code above, we can see that there are security mechanism implemented by the APK

* root checking using well known library named rootbeer&#x20;
* debugging check using FLAG\_DEBUGGABLE and getApplicationInfo
  * <https://www.appknox.com/blog/anti-debugging-techniques>
  * [https://developer.android.com/reference/android/content/pm/ApplicationInfo](https://developer.android.com/reference/android/content/pm/ApplicationInfo#FLAG_DEBUGGABLE)

So if we run APK not in rooted device and without debug it, we will go to OTP section. if our OTP valid, we will go to the maze section (NavigationActivity.class) which is the main scene in this case.

{% code title="com/google/hexagonal/wondermaze/NavigationActivity.java" %}

```java
package com.hexagonal.wondermaze;

import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import com.scottyab.rootbeer.RootBeer;
import java.util.Timer;
import java.util.TimerTask;
import kotlin.Metadata;
import kotlin.jvm.internal.Intrinsics;

/* compiled from: NavigationActivity.kt */
@Metadata(d1 = {"\u0000.\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0005\n\u0002\u0018\u0002\n\u0000\u0018\u00002\u00020\u0001B\u0005¢\u0006\u0002\u0010\u0002J\u000e\u0010\u000b\u001a\u00020\f2\u0006\u0010\r\u001a\u00020\u000eJ\u000e\u0010\u000f\u001a\u00020\f2\u0006\u0010\r\u001a\u00020\u000eJ\u000e\u0010\u0010\u001a\u00020\f2\u0006\u0010\r\u001a\u00020\u000eJ\u000e\u0010\u0011\u001a\u00020\f2\u0006\u0010\r\u001a\u00020\u000eJ\u0012\u0010\u0012\u001a\u00020\f2\b\u0010\u0013\u001a\u0004\u0018\u00010\u0014H\u0014R\u000e\u0010\u0003\u001a\u00020\u0004X\u0082\u0004¢\u0006\u0002\n\u0000R\u001c\u0010\u0005\u001a\u0004\u0018\u00010\u0006X\u0086\u000e¢\u0006\u000e\n\u0000\u001a\u0004\b\u0007\u0010\b\"\u0004\b\t\u0010\n¨\u0006\u0015"}, d2 = {"Lcom/hexagonal/wondermaze/NavigationActivity;", "Landroidx/appcompat/app/AppCompatActivity;", "()V", "game", "Lcom/hexagonal/wondermaze/Game;", "timer", "Ljava/util/Timer;", "getTimer", "()Ljava/util/Timer;", "setTimer", "(Ljava/util/Timer;)V", "moveDown", "", "view", "Landroid/view/View;", "moveLeft", "moveRight", "moveUp", "onCreate", "savedInstanceState", "Landroid/os/Bundle;", "app_release"}, k = 1, mv = {1, 6, 0}, xi = 48)
/* loaded from: classes.dex */
public final class NavigationActivity extends AppCompatActivity {
    private final Game game = new Game();
    private Timer timer = new Timer();

    public final Timer getTimer() {
        return this.timer;
    }

    public final void setTimer(Timer timer) {
        this.timer = timer;
    }

    /* JADX INFO: Access modifiers changed from: protected */
    @Override // androidx.fragment.app.FragmentActivity, androidx.activity.ComponentActivity, androidx.core.app.ComponentActivity, android.app.Activity
    public void onCreate(Bundle bundle) {
        super.onCreate(bundle);
        setContentView(R.layout.activity_navigation);
        if (new RootBeer(this).isRooted()) {
            finish();
            System.exit(0);
            throw new RuntimeException("System.exit returned normally, while it was supposed to halt JVM.");
        } else if ((getApplicationContext().getApplicationInfo().flags & 2) != 0) {
            finish();
            System.exit(0);
            throw new RuntimeException("System.exit returned normally, while it was supposed to halt JVM.");
        } else {
            View findViewById = findViewById(R.id.playerX);
            Intrinsics.checkNotNullExpressionValue(findViewById, "findViewById(R.id.playerX)");
            View findViewById2 = findViewById(R.id.playerY);
            Intrinsics.checkNotNullExpressionValue(findViewById2, "findViewById(R.id.playerY)");
            ((TextView) findViewById).setText(String.valueOf(this.game.getPlayer().getX()));
            ((TextView) findViewById2).setText(String.valueOf(this.game.getPlayer().getY()));
            Timer timer = this.timer;
            if (timer == null) {
                return;
            }
            timer.scheduleAtFixedRate(new TimerTask() { // from class: com.hexagonal.wondermaze.NavigationActivity$onCreate$$inlined$timerTask$1
                @Override // java.util.TimerTask, java.lang.Runnable
                public void run() {
                    final NavigationActivity navigationActivity = NavigationActivity.this;
                    navigationActivity.runOnUiThread(new Runnable() { // from class: com.hexagonal.wondermaze.NavigationActivity$onCreate$1$1
                        @Override // java.lang.Runnable
                        public final void run() {
                            Game game;
                            game = NavigationActivity.this.game;
                            game.getMaze().makeMaze();
                        }
                    });
                }
            }, 300000L, 300000L);
        }
    }

    public final void moveLeft(View view) {
        Intrinsics.checkNotNullParameter(view, "view");
        View findViewById = findViewById(R.id.playerX);
        Intrinsics.checkNotNullExpressionValue(findViewById, "findViewById(R.id.playerX)");
        TextView textView = (TextView) findViewById;
        if (this.game.moveLeft(this)) {
            textView.setText(String.valueOf(this.game.getPlayer().getX()));
        }
    }

    public final void moveRight(View view) {
        Intrinsics.checkNotNullParameter(view, "view");
        View findViewById = findViewById(R.id.playerX);
        Intrinsics.checkNotNullExpressionValue(findViewById, "findViewById(R.id.playerX)");
        TextView textView = (TextView) findViewById;
        if (this.game.moveRight(this)) {
            textView.setText(String.valueOf(this.game.getPlayer().getX()));
        }
    }

    public final void moveUp(View view) {
        Intrinsics.checkNotNullParameter(view, "view");
        View findViewById = findViewById(R.id.playerY);
        Intrinsics.checkNotNullExpressionValue(findViewById, "findViewById(R.id.playerY)");
        TextView textView = (TextView) findViewById;
        if (this.game.moveUp(this)) {
            textView.setText(String.valueOf(this.game.getPlayer().getY()));
        }
    }

    public final void moveDown(View view) {
        Intrinsics.checkNotNullParameter(view, "view");
        View findViewById = findViewById(R.id.playerY);
        Intrinsics.checkNotNullExpressionValue(findViewById, "findViewById(R.id.playerY)");
        TextView textView = (TextView) findViewById;
        if (this.game.moveDown(this)) {
            textView.setText(String.valueOf(this.game.getPlayer().getY()));
        }
    }
}
```

{% endcode %}

Navigation class will create maze through this code

```java
----snippet----
game.getMaze().makeMaze()
----snippet----
```

Now, take a look on Game class

{% code title="com/google/hexagonal/wondermaze/Game.java" %}

```java
package com.hexagonal.wondermaze;

import android.content.Context;
import android.view.View;
import android.widget.Toast;
import java.security.SecureRandom;
import java.util.concurrent.TimeUnit;
import kotlin.Metadata;
import kotlin.jvm.internal.Intrinsics;
import nl.dionsegijn.konfetti.core.Party;
import nl.dionsegijn.konfetti.core.Position;
import nl.dionsegijn.konfetti.core.emitter.Emitter;
import nl.dionsegijn.konfetti.xml.KonfettiView;

/* compiled from: Game.kt */
@Metadata(d1 = {"\u00008\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\b\n\u0000\n\u0002\u0018\u0002\n\u0002\b\t\n\u0002\u0010\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0003\n\u0002\u0010\u000b\n\u0002\b\u0006\u0018\u00002\u00020\u0001B\u0005¢\u0006\u0002\u0010\u0002J\t\u0010\u0012\u001a\u00020\bH\u0086 J\u0010\u0010\u0013\u001a\u00020\u00142\u0006\u0010\u0015\u001a\u00020\u0016H\u0002J\t\u0010\u0017\u001a\u00020\bH\u0086 J\t\u0010\u0018\u001a\u00020\bH\u0086 J\u000e\u0010\u0019\u001a\u00020\u001a2\u0006\u0010\u0015\u001a\u00020\u0016J\u000e\u0010\u001b\u001a\u00020\u001a2\u0006\u0010\u0015\u001a\u00020\u0016J\u000e\u0010\u001c\u001a\u00020\u001a2\u0006\u0010\u0015\u001a\u00020\u0016J\u000e\u0010\u001d\u001a\u00020\u001a2\u0006\u0010\u0015\u001a\u00020\u0016J\u0010\u0010\u001e\u001a\u00020\u00142\u0006\u0010\u0015\u001a\u00020\u0016H\u0002J\u000e\u0010\u001f\u001a\u00020\u00142\u0006\u0010\u0015\u001a\u00020\u0016R\u0010\u0010\u0003\u001a\u0004\u0018\u00010\u0004X\u0082\u000e¢\u0006\u0002\n\u0000R\u0010\u0010\u0005\u001a\u0004\u0018\u00010\u0004X\u0082\u000e¢\u0006\u0002\n\u0000R\u0010\u0010\u0006\u001a\u0004\u0018\u00010\u0004X\u0082\u000e¢\u0006\u0002\n\u0000R\u000e\u0010\u0007\u001a\u00020\bX\u0082\u000e¢\u0006\u0002\n\u0000R\u0011\u0010\t\u001a\u00020\n¢\u0006\b\n\u0000\u001a\u0004\b\u000b\u0010\fR\u001e\u0010\u000e\u001a\u00020\u00042\u0006\u0010\r\u001a\u00020\u0004@BX\u0086\u000e¢\u0006\b\n\u0000\u001a\u0004\b\u000f\u0010\u0010R\u000e\u0010\u0011\u001a\u00020\bX\u0082D¢\u0006\u0002\n\u0000¨\u0006 "}, d2 = {"Lcom/hexagonal/wondermaze/Game;", "", "()V", "check1", "Lcom/hexagonal/wondermaze/Cell;", "check2", "check3", "checkc", "", "maze", "Lcom/hexagonal/wondermaze/Maze;", "getMaze", "()Lcom/hexagonal/wondermaze/Maze;", "<set-?>", "player", "getPlayer", "()Lcom/hexagonal/wondermaze/Cell;", "size", "checkDeviceHealth", "checkPosition", "", "context", "Landroid/content/Context;", "checkRoot", "getSystemTime", "moveDown", "", "moveLeft", "moveRight", "moveUp", "runChecks", "wallHit", "app_release"}, k = 1, mv = {1, 6, 0}, xi = 48)
/* loaded from: classes.dex */
public final class Game {
    private Cell check1;
    private Cell check2;
    private Cell check3;
    private int checkc;
    private final Maze maze;
    private Cell player;
    private final int size = 40;

    public final native int checkDeviceHealth();

    public final native int checkRoot();

    public final native int getSystemTime();

    public Game() {
        Maze maze = new Maze(40, 40);
        this.maze = maze;
        this.player = new Cell(0, 0);
        this.check1 = new Cell(0, 0);
        this.check2 = new Cell(0, 0);
        this.check3 = new Cell(0, 0);
        System.loadLibrary("native-lib");
        SecureRandom secureRandom = new SecureRandom();
        this.player.setX(secureRandom.nextInt(40));
        this.player.setY(secureRandom.nextInt(40));
        Cell cell = this.check1;
        if (cell != null) {
            cell.setX(secureRandom.nextInt(40));
        }
        Cell cell2 = this.check1;
        if (cell2 != null) {
            cell2.setY(secureRandom.nextInt(40));
        }
        Cell cell3 = this.check2;
        if (cell3 != null) {
            cell3.setX(secureRandom.nextInt(40));
        }
        Cell cell4 = this.check2;
        if (cell4 != null) {
            cell4.setY(secureRandom.nextInt(40));
        }
        Cell cell5 = this.check3;
        if (cell5 != null) {
            cell5.setX(secureRandom.nextInt(40));
        }
        Cell cell6 = this.check3;
        if (cell6 != null) {
            cell6.setY(secureRandom.nextInt(40));
        }
        maze.makeMaze();
    }

    public final Maze getMaze() {
        return this.maze;
    }

    public final Cell getPlayer() {
        return this.player;
    }

    public final void wallHit(Context context) {
        Intrinsics.checkNotNullParameter(context, "context");
        Toast.makeText(context, "YOU HIT A WALL", 0).show();
    }

    public final boolean moveLeft(Context context) {
        Intrinsics.checkNotNullParameter(context, "context");
        Boolean bool = this.maze.cellAt(this.player.getX(), this.player.getY()).getWalls().get('W');
        Intrinsics.checkNotNull(bool);
        if (!bool.booleanValue()) {
            Cell cell = this.player;
            cell.setX(cell.getX() - 1);
            checkPosition(context);
            return true;
        }
        wallHit(context);
        return false;
    }

    public final boolean moveRight(Context context) {
        Intrinsics.checkNotNullParameter(context, "context");
        Boolean bool = this.maze.cellAt(this.player.getX(), this.player.getY()).getWalls().get('E');
        Intrinsics.checkNotNull(bool);
        if (!bool.booleanValue()) {
            Cell cell = this.player;
            cell.setX(cell.getX() + 1);
            checkPosition(context);
            return true;
        }
        wallHit(context);
        return false;
    }

    public final boolean moveUp(Context context) {
        Intrinsics.checkNotNullParameter(context, "context");
        Boolean bool = this.maze.cellAt(this.player.getX(), this.player.getY()).getWalls().get('N');
        Intrinsics.checkNotNull(bool);
        if (!bool.booleanValue()) {
            Cell cell = this.player;
            cell.setY(cell.getY() - 1);
            checkPosition(context);
            return true;
        }
        wallHit(context);
        return false;
    }

    public final boolean moveDown(Context context) {
        Intrinsics.checkNotNullParameter(context, "context");
        Boolean bool = this.maze.cellAt(this.player.getX(), this.player.getY()).getWalls().get('S');
        Intrinsics.checkNotNull(bool);
        if (!bool.booleanValue()) {
            Cell cell = this.player;
            cell.setY(cell.getY() + 1);
            checkPosition(context);
            return true;
        }
        wallHit(context);
        return false;
    }

    private final void checkPosition(Context context) {
        boolean z = false;
        if (this.check1 != null) {
            int x = this.player.getX();
            Cell cell = this.check1;
            if (cell != null && x == cell.getX()) {
                int y = this.player.getY();
                Cell cell2 = this.check1;
                if (cell2 != null && y == cell2.getY()) {
                    this.checkc++;
                    this.check1 = null;
                    runChecks(context);
                    return;
                }
            }
        }
        if (this.check2 != null) {
            int x2 = this.player.getX();
            Cell cell3 = this.check2;
            if (cell3 != null && x2 == cell3.getX()) {
                int y2 = this.player.getY();
                Cell cell4 = this.check2;
                if (cell4 != null && y2 == cell4.getY()) {
                    this.checkc++;
                    this.check2 = null;
                    runChecks(context);
                    return;
                }
            }
        }
        if (this.check3 != null) {
            int x3 = this.player.getX();
            Cell cell5 = this.check3;
            if (cell5 != null && x3 == cell5.getX()) {
                int y3 = this.player.getY();
                Cell cell6 = this.check3;
                if (cell6 != null && y3 == cell6.getY()) {
                    z = true;
                }
                if (z) {
                    this.checkc++;
                    this.check3 = null;
                    runChecks(context);
                }
            }
        }
    }

    private final void runChecks(Context context) {
        int i = this.checkc;
        if (i == 1) {
            checkDeviceHealth();
        } else if (i == 2) {
            checkRoot();
        } else if (i != 3) {
        } else {
            View findViewById = ((NavigationActivity) context).findViewById(R.id.konfettiView);
            Intrinsics.checkNotNullExpressionValue(findViewById, "context as NavigationAct…ewById(R.id.konfettiView)");
            ((KonfettiView) findViewById).start(new Party(0, 0, 0.0f, 0.0f, 0.0f, null, null, null, 0L, false, new Position.Relative(0.5d, 0.2d), 0, null, new Emitter(5L, TimeUnit.SECONDS).perSecond(30), 7167, null));
            getSystemTime();
        }
    }
}
```

{% endcode %}

We can see that there is no flag printed, but there are some suspicious function called from native library.&#x20;

```java
---snippet----
public final native int checkDeviceHealth();

public final native int checkRoot();

public final native int getSystemTime();
---snippet----

System.loadLibrary("native-lib");

---snippet----
```

## Analyzing Native Library Statically

Now, open native-lib file on lib/x86\_64/libnative-lib.so.&#x20;

```c
__int64 checkDeviceHealth()
{
  FILE *v0; // rax
  FILE *v1; // rbx
  unsigned int v2; // ebp
  _DWORD v4[23]; // [rsp+0h] [rbp-1E8h] BYREF
  char v5[28]; // [rsp+5Ch] [rbp-18Ch]
  _BYTE v6[60]; // [rsp+78h] [rbp-170h] BYREF
  _BYTE v7[60]; // [rsp+B4h] [rbp-134h] BYREF
  __int128 v8[2]; // [rsp+F0h] [rbp-F8h] BYREF
  __int128 v9[4]; // [rsp+110h] [rbp-D8h] BYREF
  __int128 v10[4]; // [rsp+150h] [rbp-98h] BYREF
  __int128 v11[4]; // [rsp+190h] [rbp-58h] BYREF
  unsigned __int64 v12; // [rsp+1D0h] [rbp-18h]

  v12 = __readfsqword(0x28u);
  qmemcpy(v11, "b31a146b28eb20ac4b292126c8e6a2da78f375fc5f65c5a7da5e96b72219", 60);
  qmemcpy(v10, "1a05015b4acfb5de6e3ed2fc608e166bfa2e7f80cee6bcee94811b318571", 60);
  qmemcpy(v9, "97454897ba8bffad02d63aac47ab9b6213dd0ee7392ffb6a71cbb259ee2b", 60);
  qmemcpy(v4, "801e4e26f366e98fc46628016a4d27196431e92be90aa4b82d37e4eb8ee0", 60);
  *(_OWORD *)&v4[15] = v11[0];
  *(_OWORD *)&v4[19] = v11[1];
  *(_OWORD *)v5 = v11[2];
  *(_OWORD *)&v5[12] = *(__int128 *)((char *)&v11[2] + 12);
  qmemcpy(v6, "1a05015b4acfb5de6e3ed2fc608e166bfa2e7f80cee6bcee", 48);
  *(_OWORD *)&v6[44] = *(__int128 *)((char *)&v10[2] + 12);
  *(_OWORD *)&v7[44] = *(__int128 *)((char *)&v9[2] + 12);
  qmemcpy(v7, "97454897ba8bffad02d63aac47ab9b6213dd0ee7392ffb6a", 48);
  qmemcpy(v8, "5354fb689acee76fc19", 19);
  v0 = fopen("/data/data/com.hexagonal.wondermaze/gamestate.txt", "w");
  if ( v0 )
  {
    v1 = v0;
    v2 = 0;
    fprintf(v0, "%s\n", (const char *)v4);
    fclose(v1);
  }
  else
  {
    printf("Error");
    return (unsigned int)-1;
  }
  return v2;
}
```

```c
__int64 Java_com_hexagonal_wondermaze_Game_checkRoot()
{
  FILE *v0; // rax
  FILE *v1; // rbx
  char v3; // [rsp+0h] [rbp-118h] BYREF
  __m128 v4; // [rsp+1h] [rbp-117h]
  __m128 v5; // [rsp+11h] [rbp-107h]
  __m128 v6; // [rsp+21h] [rbp-F7h]
  __m128 v7; // [rsp+31h] [rbp-E7h]
  __m128 v8; // [rsp+41h] [rbp-D7h]
  __m128 v9; // [rsp+51h] [rbp-C7h]
  __m128 v10; // [rsp+61h] [rbp-B7h]
  __m128 v11; // [rsp+71h] [rbp-A7h]
  __m128 v12; // [rsp+81h] [rbp-97h]
  __m128 v13; // [rsp+91h] [rbp-87h]
  __m128 v14; // [rsp+A1h] [rbp-77h]
  __m128 v15; // [rsp+B1h] [rbp-67h]
  __m128 v16; // [rsp+C1h] [rbp-57h]
  __m128 v17; // [rsp+D1h] [rbp-47h]
  __m128 v18; // [rsp+E1h] [rbp-37h]
  __m128 v19; // [rsp+F1h] [rbp-27h]
  char v20; // [rsp+101h] [rbp-17h]
  char v21; // [rsp+102h] [rbp-16h]
  unsigned __int64 v22; // [rsp+108h] [rbp-10h]

  v22 = __readfsqword(0x28u);
  memcpy(&v3, &unk_BB0, 0x103uLL);
  v3 = 56;
  v4 = _mm_xor_ps(v4, (__m128)xmmword_AC0);
  v5 = _mm_xor_ps(v5, (__m128)xmmword_AC0);
  v6 = _mm_xor_ps(v6, (__m128)xmmword_AC0);
  v7 = _mm_xor_ps(v7, (__m128)xmmword_AC0);
  v8 = _mm_xor_ps(v8, (__m128)xmmword_AC0);
  v9 = _mm_xor_ps(v9, (__m128)xmmword_AC0);
  v10 = _mm_xor_ps(v10, (__m128)xmmword_AC0);
  v11 = _mm_xor_ps(v11, (__m128)xmmword_AC0);
  v12 = _mm_xor_ps(v12, (__m128)xmmword_AC0);
  v13 = _mm_xor_ps(v13, (__m128)xmmword_AC0);
  v14 = _mm_xor_ps(v14, (__m128)xmmword_AC0);
  v15 = _mm_xor_ps(v15, (__m128)xmmword_AC0);
  v16 = _mm_xor_ps(v16, (__m128)xmmword_AC0);
  v17 = _mm_xor_ps(v17, (__m128)xmmword_AC0);
  v18 = _mm_xor_ps(v18, (__m128)xmmword_AC0);
  v19 = _mm_xor_ps(v19, (__m128)xmmword_AC0);
  v20 ^= 0xFu;
  v21 ^= 0xFu;
  v0 = fopen("/data/data/com.hexagonal.wondermaze/gamestate.txt", "a");
  if ( v0 )
  {
    v1 = v0;
    fprintf(v0, "%s\n", &v3);
    fclose(v1);
    return 1LL;
  }
  else
  {
    printf("Error");
    return 0xFFFFFFFFLL;
  }
}
```

```c
__int64 getSystemTime()
{
  FILE *v0; // r15
  char v1; // al
  __int128 v2; // xmm1
  __int128 v3; // xmm2
  __int128 v4; // xmm3
  _BYTE v6[100]; // [rsp+0h] [rbp-138h] BYREF
  _DWORD v7[37]; // [rsp+64h] [rbp-D4h] BYREF
  __int64 v8[8]; // [rsp+F8h] [rbp-40h] BYREF

  v8[3] = __readfsqword(0x28u);
  v0 = fopen("/data/data/com.hexagonal.wondermaze/gamestate.txt", "a");
  v1 = 47;
  v2 = xmmword_9D0;
  v3 = xmmword_9C0;
  v4 = xmmword_A60;
  while ( 1 )
  {
    switch ( v1 )
    {
      case 'a':
        *(_OWORD *)&v7[25] = v2;
        *(_OWORD *)&v7[29] = v3;
        *(_OWORD *)&v7[33] = v4;
        qmemcpy(v8, "3c91ddc4651", 11);
        v1 = 99;
        break;
      case 'b':
      case 'e':
      case 'f':
      case 'g':
      case 'h':
      case 'i':
      case 'j':
      case 'k':
      case 'l':
      case 'm':
      case 'n':
        continue;
      case 'c':
        printf("HAHAHAHAHAH");
        v4 = xmmword_A60;
        v3 = xmmword_9C0;
        v2 = xmmword_9D0;
        v1 = 111;
        break;
      case 'd':
        qmemcpy(
          v7,
          "d28952c3eed826dc8be352fa37e5096d09911a7b8a1ccdafe5931483e3ccb17c6b979b5267fd5ca9d438b0aa849283451298",
          100);
        v1 = 97;
        break;
      case 'o':
        printf("THIS IS NO WAY TO LIVE: %d", 88164LL);
        if ( v0 )
        {
          fprintf(v0, "%s\n", v6);
          fclose(v0);
          return 1LL;
        }
        else
        {
          printf("Error");
          return 0xFFFFFFFFLL;
        }
      default:
        if ( v1 == 47 )
        {
          qmemcpy(
            v6,
            "803ac8879fa6560e1b366d151e642b162ef78a59c567afc2b9e206873345fe0f0b52ebbc3355a77745c392f0ec7bdd71e209",
            sizeof(v6));
          v1 = 100;
        }
        break;
    }
  }
}
```

## Creating Emulation for Native Library (x86\_64)

Actually we can reconstruct all of those code, but it should be easier to just "emulate" it. To emulate it we can utilize Qiling framework. Basically it was something like running assembly from start address until end address and define the value of register if needed. Lets try on checkDeviceHealth function first

* checkDeviceHealth
  * There is no argument required
  * Start address located at 0x1190
    \*

    ```
    <figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2F19ehrZOFtsoqH2v5GNr4%2Fimage.png?alt=media&amp;token=21ddbbe9-f902-46e5-9a29-dfdfa67226b2" alt=""><figcaption></figcaption></figure>
    ```
  * Values that we need to dump stored on v4 or third argument (rdx) on \_fprintf.&#x20;
    * &#x20;

      <figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2FCtpKzKTTqxKk461JJGA6%2Fimage.png?alt=media&amp;token=eec4662e-16d2-4f49-ab3c-c4e088cfa686" alt=""><figcaption></figcaption></figure>
    * So end address could be 0x13d3 since it is the latest "values" processing before writing file initialization
    * Values stored on rsp, so at the end of the code we need to dump rsp values

```python
from qiling import Qiling

ql = Qiling(['./libnative-lib.so'], '.')
ql.mem.map(0, 0x1000) # for FS:0x28
BASE = ql.loader.load_address

def device_native():
    ql.run(BASE+0x1190, BASE+0x13D3)
    rsp = ql.arch.regs.rsp
    address = rsp
    size = 259
    res = ql.mem.read(address, size)
    return bytes.fromhex('0'+res.decode())

print(device_native())
```

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2FWqWGqzqmIqdEURX8Qd9K%2Fimage.png?alt=media&amp;token=ca20bd26-2210-4535-a158-6396b219a8ea" alt=""><figcaption></figcaption></figure>

Next, we try to emulate Java\_com\_hexagonal\_wondermaze\_Game\_checkRoot.

* Java\_com\_hexagonal\_wondermaze\_Game\_checkRoot
  * There is no argument required
  * Start address located at 0x1870
    \*

    ```
    <figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2FDsQeCExawdzyegrAeQfh%2Fimage.png?alt=media&amp;token=26fa10b5-0667-422d-baea-1d51c15933c1" alt=""><figcaption></figcaption></figure>
    ```
  * Implement custom memcpy
    * copy array values to rsp
  * End address located at 0x19c6&#x20;
    \*

    ```
    <figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2Fl1fzGeYnaJjjoD1gkgzr%2Fimage.png?alt=media&amp;token=c3800dfe-ba30-41e5-ba24-ecbeb8d15292" alt=""><figcaption></figcaption></figure>
    ```

    * Values stored on rsp

```python
from qiling import Qiling
from qiling.const import QL_VERBOSE, QL_INTERCEPT

ql = Qiling(['./libnative-lib.so'], '.')
ql.mem.map(0, 0x1000) # for FS:0x28
BASE = ql.loader.load_address

def memcpy_root(ql):
    rsp = ql.arch.regs.rsp
    data = [
    0x37, 0x3F, 0x3D, 0x3B, 0x37, 0x39, 0x6E, 0x3E, 0x39, 0x6C, 
    0x6C, 0x3F, 0x6D, 0x69, 0x37, 0x3E, 0x6B, 0x69, 0x3A, 0x3F, 
    0x3B, 0x3A, 0x3E, 0x3B, 0x38, 0x3B, 0x3D, 0x36, 0x3F, 0x6C, 
    0x3F, 0x69, 0x3B, 0x6E, 0x6C, 0x39, 0x39, 0x3C, 0x38, 0x3D, 
    0x3D, 0x6C, 0x39, 0x6B, 0x3F, 0x6D, 0x38, 0x6E, 0x36, 0x3B, 
    0x6B, 0x3A, 0x6A, 0x3D, 0x39, 0x6C, 0x6D, 0x6B, 0x6E, 0x3A, 
    0x3B, 0x6B, 0x3E, 0x3A, 0x3E, 0x69, 0x3C, 0x36, 0x6C, 0x3C, 
    0x3A, 0x38, 0x3E, 0x3C, 0x69, 0x36, 0x6A, 0x6C, 0x3A, 0x6A, 
    0x39, 0x3B, 0x6A, 0x3A, 0x3A, 0x6E, 0x3E, 0x39, 0x3B, 0x6A, 
    0x6E, 0x3E, 0x6E, 0x3A, 0x37, 0x3D, 0x36, 0x38, 0x69, 0x3A, 
    0x37, 0x6B, 0x6A, 0x6C, 0x36, 0x38, 0x39, 0x3B, 0x3C, 0x3B, 
    0x37, 0x39, 0x6D, 0x3F, 0x39, 0x6D, 0x6E, 0x36, 0x69, 0x6E, 
    0x3B, 0x37, 0x69, 0x69, 0x3C, 0x39, 0x6D, 0x6A, 0x3B, 0x3C, 
    0x6E, 0x3D, 0x6D, 0x6C, 0x3B, 0x69, 0x38, 0x3B, 0x3B, 0x3A, 
    0x3A, 0x37, 0x6A, 0x3F, 0x6E, 0x6B, 0x3D, 0x3E, 0x69, 0x3C, 
    0x69, 0x37, 0x6A, 0x6A, 0x6E, 0x6B, 0x36, 0x6C, 0x3A, 0x6C, 
    0x38, 0x37, 0x3B, 0x6E, 0x6B, 0x3B, 0x6A, 0x36, 0x3F, 0x36, 
    0x3C, 0x3C, 0x38, 0x69, 0x6B, 0x6C, 0x6B, 0x69, 0x6E, 0x37, 
    0x3B, 0x3A, 0x36, 0x6B, 0x69, 0x6D, 0x38, 0x6B, 0x3C, 0x37, 
    0x36, 0x36, 0x38, 0x37, 0x6B, 0x37, 0x3E, 0x3C, 0x3E, 0x6A, 
    0x36, 0x3A, 0x37, 0x6A, 0x3A, 0x6C, 0x3B, 0x6B, 0x3B, 0x39, 
    0x6B, 0x39, 0x36, 0x39, 0x3E, 0x6B, 0x69, 0x3C, 0x6D, 0x38, 
    0x6B, 0x6D, 0x6C, 0x3E, 0x36, 0x3C, 0x3C, 0x3B, 0x3F, 0x38, 
    0x6E, 0x69, 0x6C, 0x36, 0x6A, 0x3E, 0x39, 0x6C, 0x38, 0x37, 
    0x38, 0x6B, 0x3A, 0x6C, 0x3D, 0x3F, 0x6E, 0x6B, 0x6E, 0x3F, 
    0x3C, 0x69, 0x3C, 0x6B, 0x6A, 0x6D, 0x6E, 0x3D, 0x6D]
    ql.mem.write(rsp, bytes(data))
    ql.arch.regs.write("rip", BASE+0x146d)

def root_native():
    ql.hook_address(memcpy_root, BASE+0x1468)
    ql.run(BASE+0x1440, BASE+0x1596)
    rsp = ql.arch.regs.rsp
    address = rsp
    size = 259
    res = ql.mem.read(address, size)
    return bytes.fromhex('0'+res.decode())

print(root_native())
```

Last function we need to emulate is getSystemTime

* getSystemTime
  * There is no argument required
  * Start address located at 0x1640
    \*

    ```
    <figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2FJ1L8eWZj86OG6kShmi6k%2Fimage.png?alt=media&amp;token=28768412-27f0-417e-ba92-2623d233d3d6" alt=""><figcaption></figcaption></figure>
    ```
  * Since fopen and printf not used, we can skip those functions by setting rip value
    * hook at 0x176d
      * change rip to 0x1772
    * hook at 0x166d
      * change rip to 0x1672
  * End address located at 0x17f2&#x20;
    \*

    ```
    <figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2FV4L6T2MxnLdmWyVaqVc7%2Fimage.png?alt=media&amp;token=95143a75-69c4-401e-b938-bb546281d560" alt=""><figcaption></figcaption></figure>
    ```

    * Values stored on rsp

```python
from qiling import Qiling

ql = Qiling(['./libnative-lib.so'], '.')
ql.mem.map(0, 0x1000) # for FS:0x28
BASE = ql.loader.load_address

def skip_fopen_time(ql):
    new_rip = BASE+0x1672
    ql.arch.regs.write("rip", new_rip)

def skip_printf_time(ql):
    new_rip = BASE+0x1772
    ql.arch.regs.write("rip", new_rip)

def time_native():
    ql.hook_address(skip_fopen_time, BASE+0x166d)
    ql.hook_address(skip_printf_time, BASE+0x176d)
    ql.run(BASE+0x1640, BASE+0x17f2)
    rsp = ql.arch.regs.rsp
    address = rsp
    size = 259
    res = ql.mem.read(address, size)
    return bytes.fromhex('0'+res.decode())

print(time_native())
```

Putting all function together and got the flag

```python
from qiling import Qiling
from qiling.const import QL_VERBOSE, QL_INTERCEPT

ql = Qiling(['./libnative-lib.so'], '.')
ql.mem.map(0, 0x1000) # for FS:0x28
BASE = ql.loader.load_address

def device_native():
    ql.run(BASE+0x1190, BASE+0x13D3)
    rsp = ql.arch.regs.rsp
    address = rsp
    size = 259
    res = ql.mem.read(address, size)
    return bytes.fromhex('0'+res.decode())

def memcpy_root(ql):
    rsp = ql.arch.regs.rsp
    data = [
    0x37, 0x3F, 0x3D, 0x3B, 0x37, 0x39, 0x6E, 0x3E, 0x39, 0x6C, 
    0x6C, 0x3F, 0x6D, 0x69, 0x37, 0x3E, 0x6B, 0x69, 0x3A, 0x3F, 
    0x3B, 0x3A, 0x3E, 0x3B, 0x38, 0x3B, 0x3D, 0x36, 0x3F, 0x6C, 
    0x3F, 0x69, 0x3B, 0x6E, 0x6C, 0x39, 0x39, 0x3C, 0x38, 0x3D, 
    0x3D, 0x6C, 0x39, 0x6B, 0x3F, 0x6D, 0x38, 0x6E, 0x36, 0x3B, 
    0x6B, 0x3A, 0x6A, 0x3D, 0x39, 0x6C, 0x6D, 0x6B, 0x6E, 0x3A, 
    0x3B, 0x6B, 0x3E, 0x3A, 0x3E, 0x69, 0x3C, 0x36, 0x6C, 0x3C, 
    0x3A, 0x38, 0x3E, 0x3C, 0x69, 0x36, 0x6A, 0x6C, 0x3A, 0x6A, 
    0x39, 0x3B, 0x6A, 0x3A, 0x3A, 0x6E, 0x3E, 0x39, 0x3B, 0x6A, 
    0x6E, 0x3E, 0x6E, 0x3A, 0x37, 0x3D, 0x36, 0x38, 0x69, 0x3A, 
    0x37, 0x6B, 0x6A, 0x6C, 0x36, 0x38, 0x39, 0x3B, 0x3C, 0x3B, 
    0x37, 0x39, 0x6D, 0x3F, 0x39, 0x6D, 0x6E, 0x36, 0x69, 0x6E, 
    0x3B, 0x37, 0x69, 0x69, 0x3C, 0x39, 0x6D, 0x6A, 0x3B, 0x3C, 
    0x6E, 0x3D, 0x6D, 0x6C, 0x3B, 0x69, 0x38, 0x3B, 0x3B, 0x3A, 
    0x3A, 0x37, 0x6A, 0x3F, 0x6E, 0x6B, 0x3D, 0x3E, 0x69, 0x3C, 
    0x69, 0x37, 0x6A, 0x6A, 0x6E, 0x6B, 0x36, 0x6C, 0x3A, 0x6C, 
    0x38, 0x37, 0x3B, 0x6E, 0x6B, 0x3B, 0x6A, 0x36, 0x3F, 0x36, 
    0x3C, 0x3C, 0x38, 0x69, 0x6B, 0x6C, 0x6B, 0x69, 0x6E, 0x37, 
    0x3B, 0x3A, 0x36, 0x6B, 0x69, 0x6D, 0x38, 0x6B, 0x3C, 0x37, 
    0x36, 0x36, 0x38, 0x37, 0x6B, 0x37, 0x3E, 0x3C, 0x3E, 0x6A, 
    0x36, 0x3A, 0x37, 0x6A, 0x3A, 0x6C, 0x3B, 0x6B, 0x3B, 0x39, 
    0x6B, 0x39, 0x36, 0x39, 0x3E, 0x6B, 0x69, 0x3C, 0x6D, 0x38, 
    0x6B, 0x6D, 0x6C, 0x3E, 0x36, 0x3C, 0x3C, 0x3B, 0x3F, 0x38, 
    0x6E, 0x69, 0x6C, 0x36, 0x6A, 0x3E, 0x39, 0x6C, 0x38, 0x37, 
    0x38, 0x6B, 0x3A, 0x6C, 0x3D, 0x3F, 0x6E, 0x6B, 0x6E, 0x3F, 
    0x3C, 0x69, 0x3C, 0x6B, 0x6A, 0x6D, 0x6E, 0x3D, 0x6D]
    ql.mem.write(rsp, bytes(data))
    ql.arch.regs.write("rip", BASE+0x146d)

def root_native():
    ql.hook_address(memcpy_root, BASE+0x1468)
    ql.run(BASE+0x1440, BASE+0x1596)
    rsp = ql.arch.regs.rsp
    address = rsp
    size = 259
    res = ql.mem.read(address, size)
    return bytes.fromhex('0'+res.decode())

def skip_fopen_time(ql):
    new_rip = BASE+0x1672
    ql.arch.regs.write("rip", new_rip)

def skip_printf_time(ql):
    new_rip = BASE+0x1772
    ql.arch.regs.write("rip", new_rip)

def time_native():
    ql.hook_address(skip_fopen_time, BASE+0x166d)
    ql.hook_address(skip_printf_time, BASE+0x176d)
    ql.run(BASE+0x1640, BASE+0x17f2)
    rsp = ql.arch.regs.rsp
    address = rsp
    size = 259
    res = ql.mem.read(address, size)
    return bytes.fromhex('0'+res.decode())

arr = [root_native(),time_native(),device_native()]

flag = ""
for i in range(len(arr[0])):
    flag += chr(arr[0][i]^arr[1][i]^arr[2][i])
print(flag[::-1])
```

<figure><img src="https://479888236-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FSbHHLkH4CgRwZEsWg50y%2Fuploads%2Fg0lyP9yXDudWbcCkedDj%2Fimage.png?alt=media&amp;token=54ef0f3b-9c3a-444f-9e2d-bacf994669fd" alt=""><figcaption></figcaption></figure>

Flag : ctf{Th3P4thKe3p5Ch4ng1n9}
