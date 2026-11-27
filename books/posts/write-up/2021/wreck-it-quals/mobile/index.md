# Mobile

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>Ezhax</td><td><a href="#ezhax">Here</a></td></tr><tr><td>Otherxide</td><td><a href="#otherxide">Here</a></td></tr></tbody></table>

## Ezhax

### Description

\-

### Solution

Diberikan file apk , disini kami langsung membukanya menggunakan jadx-gui lalu menyimpan source beserta resourcenya juga.

Pada class MainActivity terdapat method menarik yaitu onClick

<figure><img src="https://lh7-us.googleusercontent.com/CVXiIfO4ek6MXLh0i3LCzSlLr6zmS-zjXttWrgEpIlcrHPi0THJFQbeH3WAe7vl3YTrcDKh53AenRZgQcmqywXGaYIfY0NlmS9-xBApUfHo-iSMTl0A0sogn7qtRGKVKT_VKOOigntqOiGIU47_ZLg" alt=""><figcaption></figcaption></figure>

Pada method tersebut dilakukan pengecekan login , kemudian akan ada suatu sharedpreference dengan nama FLAG yang di set dengan value yaitu variable v pada class MainActivity

```java
public byte[] v = {49, 53, 66, 68, 53, 65, 50, 67, 48, 56, 48, 66, 66, 48, 55, 54, 49, 52, 48, 53, 68, 52, 57, 69, 57, 49, 51, 54, 67, 48, 52, 69, 48, 68, 67, 55, 50, 65, 48, 49, 69, 68, 69, 48, 50, 57, 69, 53, 51, 52, 69, 52, 50, 69, 70, 54, 68, 66, 54, 50, 65, 50, 50, 55};
```

Pada class DashboardActivity terdapat method oncreate yang menggunakan sharedpreference flag yang di set tadi dan memanggil method a

<figure><img src="https://lh7-us.googleusercontent.com/Qc-h1mj1Z2Sa0jLZv52HXuX58b5XnllPTx-T_XeHmcISPG9oqnl2LAmqJApHbDnvdwTnifQedC1kuikrVwX_d0Pkkm51v_2k3o-2epUahsudRml1YFZ8TyCRyKylM165TOoOiDjTtxNhQTltXZ7bCA" alt=""><figcaption></figcaption></figure>

Jadi selajutnya kami coba buka method a

<figure><img src="https://lh7-us.googleusercontent.com/NNCIrd0bH8-prZ1L6Q13lPp12Xs7mT3et8Rv5w07tIbAgmqqYHMXOOJ5jxmM657ywf1ozEogF2vZXOo-u2VB_XkmwpNNPyXMQg-V5CDK1aT_Kcqri1jJnf62dSGnaymt_Ne7fvs50vv0yxz8rMLbLg" alt=""><figcaption></figcaption></figure>

Pada method a dilakukan decrypt menggunakan AES , jadi disini kami tinggal menyalin kode tersebut untuk melakukan decrypt terhadap encrypted text. Berikut script yang kami gunakan

```java
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
class Coba{
    public static final byte[] a = {99, 108, 107, 105, 110, 103, 116, 102, 112, 97, 105, 114, 122, 101, 103, 103};
    public static void main(String[] args) {
   	 System.out.println(a("15BD5A2C080BB0761405D49E9136C04E0DC72A01EDE029E534E42EF6DB62A227"));
    }

    public static String a(String str) {
    	int length = str.length() / 2;
    	byte[] bArr = new byte[length];
    	for (int i = 0; i < length; i++) {
        	int i2 = i * 2;
        	bArr[i] = Integer.valueOf(str.substring(i2, i2 + 2), 16).byteValue();
    	}
    	try{
   		 SecretKeySpec secretKeySpec = new SecretKeySpec(a, "AES");
    	Cipher instance = Cipher.getInstance("AES");
    	instance.init(2, secretKeySpec);
    	return new String(instance.doFinal(bArr));
    	}
    	catch (Exception e) {
   		 return "";
    	}
	}
}
```

<figure><img src="https://lh7-us.googleusercontent.com/rfZ4F-BlZWicqgmy-u6zaCM2S1ramP8rAZJrcEIYjboQKAeTlH3aDn7qvvxLMO75BBffBh6QL4ybaO8tLv90JsilfZ7AuJvcmfS5DvkjYoOEk8PrdSetpTFLe9buCAgXjiwoHKBcgVLjx7rN0HlrZQ" alt=""><figcaption></figcaption></figure>

Flag : WRECKIT{m0bil3\_eZ\_Reves3}

## Otherxide

### Description

\-

### Solution

Diberikan file apk disini kami langsung membukanya menggunakan jadx.

Pada class MainActivity terdapat pemanggilan method yang menarik karena melibatkan native library yaitu xide

<figure><img src="https://lh7-us.googleusercontent.com/1EU0jveAr-zyt8Xuby7uvHvIN0bYkTR7lmtyNnBoRBDUMxwPvo5-Wz2nxkn3uoRSy1J9TUKbeksIgA3Sqfyul3OoSCh_pkCmbivR39c9nWxH-RquDaeHJNIGGMe61SBU0gLo6AkQHFhmxacB0ll_Tg" alt=""><figcaption></figcaption></figure>

Setelah kami telusuri ternyata pada class flags dilakukan pemanggilan terhadap fungsi flag yang didapat dari hasil load terhadap dex. File dex sendiri didapat dari fungsi wrt yang dilakukan pemanggilan dari native library. Jadi disini saya coba buka native library tersebut lalu mengambil file dex nya dan konversi file dex ke jar lalu membukanya dengan jd gui. Terakhir tinggal analisis fungsi decrypt dari flag dan terapkan pada kode java yang dibuat sendiri.

<figure><img src="https://lh7-us.googleusercontent.com/zao5nr0qkw6dZVCoCbT8zMbp-XbYTMS0I2XKy9fVS8Po3Rq_BqPCIHpb4V_i6OLTJrBvEVB5clR5iXkCJpUuiR0MsoL5VvTMYjiHZxMDGBwdasSqjXhckKVIVvzeg4rWkOK4X64wwlEtjQYM3muPGg" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/8s4aWlqGm9oVHOVIJsIxFmOp2_LRI1mXUyO5_ruTUEE9nkyJDenuyKrvFaRfEVyZ7U8UEul4EpsdqYd1KvtHOcVAxf2zxLCeqWqoZILZ9XfvtZtpGo46nrzzpQ8ZbRUv-G3FoOwq-vhbJlo3kLxCaw" alt=""><figcaption></figcaption></figure>

Extract dengan python

```python
f = open("libxide.so","rb").read()
out = open("flags.jar","wb")
out.write(f[0xB66B0:0xB6EFD])
```

<figure><img src="https://lh7-us.googleusercontent.com/lrufSA7huKrYAaivHloOtJdURhrEtE6KDpKf9n0ZLKCF2pSGmLXKRypzree0KL3B35tJEpRCr7OAVOvoAfSAPW5M8rGzDbMgldLUjod2AA6pDqgy4z_e0Dzf1UOyRZWkZuA1XOzEU0QMcOHkF3ihCA" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/2a2UHFqH43e1rmYy-Z-YhbjQNwLtSmUPuOM_21POce8dGXZYHC3djBpwaFnLLLDx8Fg7ywepHkGaQeQuQLjGaCnNUliBycLmfsbqQzneLEVjRz7sBbgfCwj7dsaECfIcz3ufjGIGF5TyRZlc9vwM_w" alt=""><figcaption></figcaption></figure>

&#x20;Berikut script yang kami gunakan untuk melakukan decrypt

```java
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

class OtherXide{
      private static byte[] key;
 
  private static SecretKeySpec secretKey;
    public static void main(String[] args) {
   	 String  paramString = d("18u+W+Mw782qr9tQDXXUgWjPPqwFpf5nZ4naKbPzmSM=", "P4t1entisk03nTji");
   	 System.out.println(paramString);
    }

    public static String d(String paramString1, String paramString2) {
	try {
  	setKey(paramString2);
  	Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");
  	cipher.init(2, secretKey);
  	return new String(cipher.doFinal(Base64.getDecoder().decode(paramString1)));
	} catch (Exception exception) {
  	System.out.println("Error while decrypting: " + exception.toString());
  	return null;
	}
  }
 
  public static void setKey(String paramString) {
	try {
  	key = paramString.getBytes("UTF-8");
  	key = MessageDigest.getInstance("SHA-1").digest(key);
  	key = Arrays.copyOf(key, 16);
  	secretKey = new SecretKeySpec(key, "AES");
  	return;
	} catch (NoSuchAlgorithmException noSuchAlgorithmException) {
  	noSuchAlgorithmException.printStackTrace();
  	return;
	} catch (UnsupportedEncodingException unsupportedEncodingException) {
  	unsupportedEncodingException.printStackTrace();
  	return;
	}
  }
}
```

<figure><img src="https://lh7-us.googleusercontent.com/P_IPRqJfJ1IXQOOcwpXEn8vjvPhzEwMtEWa1TcO2UCdE3oxpLeug7BNJYy1FCxflm9kFZvB9N9R4ZFNHyLGGOt0FAQx9bvNMGV062VIVEPXTIZhsGkfeCM_UgL68_kSVqbxRKJNyqoyK79AMXcUw5Q" alt=""><figcaption></figcaption></figure>

Flag : WRECKIT{J4r\_Lar1\_5aaT\_rUnT1me}
