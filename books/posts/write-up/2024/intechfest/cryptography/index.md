# Cryptography

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>Notes Manager (113 pts)</td><td><a href="#notes-manager-113-pts">Here</a></td></tr></tbody></table>

## Notes Manager (113 pts)

### Description

\-

### Solution

Diberkan file .class, decompile dengan luyten.

```java
import java.util.Arrays;

class Coba
{
    public static int[][] multiply(final int[][] array, final int[][] array2) {
        final int length = array.length;
        final int length2;
        final int n = length2 = array2[0].length;
        final int[][] array3 = new int[length][length2];
        for (int i = 0; i < length; ++i) {
            for (int j = 0; j < length2; ++j) {
                for (int k = 0; k < n; ++k) {
                    final int[] array4 = array3[i];
                    final int n2 = j;
                    final int[] array5 = array4;
                    final int n3 = n2;
                    array5[n3] += array[i][k] * array2[k][j];
                }
            }
        }
        return array3;
    }
    
    public static int[][][] string_to_matrix(final String s) {
        final int[][][] array = new int[s.length() / 9][3][3];
        for (int i = 0; i < s.length(); i += 9) {
            final int[][] array2 = new int[3][3];
            for (int j = 0; j < 9; ++j) {
                array2[j / 3][j % 3] = s.charAt(i + j);
            }
            array[i / 9] = array2;
        }
        return array;
    }
    
    public static void main(final String[] array) {
        final int[][][] string_to_matrix = string_to_matrix("123456789");
        final int[][] multiply = multiply(string_to_matrix[0], string_to_matrix[0]);
        for (int i = 0; i < multiply.length; ++i) {
            System.out.println(Arrays.toString(multiply[i]));
        }
    }
}
```

Dapat dilihat bahwa program menerima input kita lalu mengubahnya ke bentuk matrix 3x3 dan melakukan matrix multiplication. Matrix multiplication yang dilakukan adalah matrix-i dikali matrix-0. Karena kita tahu 9 bytes pertama dari flag yaitu INTECHFES jadi lakukan matrix multiplication inverse terhadap keseluruhan nilai CT untuk mendapatkan flag. Berikut solver yang kami gunakan.

```python
base = list(b"INTECHFES")

data = "16591 16716 18720 14700 14839 16596 15681 15810 17737 23089 23142 25955 18377 18305 20521 14746 14738 16272 19214 19535 21465 22507 22778 25463 19780 19694 22182 18507 18417 20641 18043 18278 20120 21986 22215 24733 19077 19278 21221 23126 23249 26010 19701 19598 22096 17963 17903 20089 17817 17747 19921 19586 19894 22442 16831 16778 18597 13356 13482 15057 13356 13482 15057"
tmp = list(map(int, data.split(" ")))
mat = []
for i in range(0, len(tmp), 9):
    zz = []
    for j in range(i, i + 9, 3):
        z = []
        for k in range(3):
            z.append(tmp[j + k])
        zz.append(z)
    mat.append(zz)

bm = Matrix(3,3, base)
flag = b""
for i in mat:
	tmp = Matrix(i)
	res = bm.solve_left(tmp)
	for j in list(res):
		for k in j:
			flag += bytes([k])
print(flag)
```

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXe4DPUxCIu5NH8Iy1LPFwXVPPTzTNdBwNii6VqrVxDqGpPiw92LuE6O4QOv_km-OhLSGyWgjvgL38-r5Ebk3GnqgQQkvTaX0yuSpUdbPaD03Pvb0AitR7dDWenQ1VQ-rhq1_tpdUuNE_63TrM41l_ub318S?key=K_FOmU9t8UMYPP2CCSzl6g" alt=""><figcaption></figcaption></figure>

Flag: INTECHFEST{y3t\_4n0th3r\_m4tr1x\_ch4ll\_bu7\_wr1tt3n\_1n\_j4v4}
