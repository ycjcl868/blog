---
title: 算法练习(Java)
---
> 先来首音乐吧！


<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=110 src="//music.163.com/outchain/player?type=0&id=519118660&auto=1&height=90"></iframe>


# 蓝桥杯练习系统

## 入门训练
一、题目：Fibonacci数列

```
问题描述
Fibonacci数列的递推公式为：Fn=Fn-1+Fn-2，其中F1=F2=1。

当n比较大时，Fn也非常大，现在我们想知道，Fn除以10007的余数是多少。

输入格式
输入包含一个整数n。
输出格式
输出一行，包含一个整数，表示Fn除以10007的余数。
说明：在本题中，答案是要求Fn除以10007的余数，因此我们只要能算出这个余数即可，而不需要先计算出Fn的准确值，再将计算的结果除以10007取余数，直接计算余数往往比先算出原数再取余简单。

样例输入
10
样例输出
55
样例输入
22
样例输出
7704
数据规模与约定
1 <= n <= 1,000,000。
```


```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] arr = new int[1000000];
        arr[1] = arr[2] = 1;
        for(int i = 3;i <= n;i++){
             arr[i] = (arr[i-1]+arr[i-2]) % 10007;
        }
        System.out.println(arr[n]);
    }
}


评测数据(输入,输出)：
(1,1)
(2,1)
(10,55)
(55,2091)
(100,6545)
(500,8907)
(999,4659)
(9999,9973)
(99999,6415)
(999999,3131)
```

二、题目：圆的面积

```
问题描述
给定圆的半径r，求圆的面积。
输入格式
输入包含一个整数r，表示圆的半径。
输出格式
输出一行，包含一个实数，四舍五入保留小数点后7位，表示圆的面积。
说明：在本题中，输入是一个整数，但是输出是一个实数。

对于实数输出的问题，请一定看清楚实数输出的要求，比如本题中要求保留小数点后7位，则你的程序必须严格的输出7位小数，输出过多或者过少的小数位数都是不行的，都会被认为错误。

实数输出的问题如果没有特别说明，舍入都是按四舍五入进行。

样例输入
4
样例输出
50.2654825
数据规模与约定
1 <= r <= 10000。
提示
本题对精度要求较高，请注意π的值应该取较精确的值。你可以使用常量来表示π，比如PI=3.14159265358979323，也可以使用数学公式来求π，比如PI=atan(1.0)*4。
```

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int r = in.nextInt();
        double area = Math.PI * r * r;
        System.out.println(String.format("%.7f",area));
    }
}

评测数据(输入,输出)：
(10,314.1592654)
(20,1256.6370614)
(40,5026.5482457)
(80,20106.1929830)
(160,80424.7719319)
(320,321699.0877276)
(640,1286796.3509104)
(1280,5147185.4036415)
(2560,20588741.6145661)
(5120,82354966.4582643)

```



三、序列求和

```
问题描述
求1+2+3+...+n的值。
输入格式
输入包括一个整数n。
输出格式
输出一行，包括一个整数，表示1+2+3+...+n的值。
样例输入
4
样例输出
10
样例输入
100
说明：有一些试题会给出多组样例输入输出以帮助你更好的做题。

一般在提交之前所有这些样例都需要测试通过才行，但这不代表这几组样例数据都正确了你的程序就是完全正确的，潜在的错误可能仍然导致你的得分较低。

样例输出
5050
数据规模与约定
1 <= n <= 1,000,000,000。
说明：请注意这里的数据规模。

本题直接的想法是直接使用一个循环来累加，然而，当数据规模很大时，这种“暴力”的方法往往会导致超时。此时你需要想想其他方法。你可以试一试，如果使用1000000000作为你的程序的输入，你的程序是不是能在规定的上面规定的时限内运行出来。

本题另一个要值得注意的地方是答案的大小不在你的语言默认的整型(int)范围内，如果使用整型来保存结果，会导致结果错误。

如果你使用C++或C语言而且准备使用printf输出结果，则你的格式字符串应该写成%I64d以输出long long类型的整数。
```

```java
import java.util.Scanner;
public class Main {
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        long n = in.nextLong();
        long sum = (n+1) * n /2;
        System.out.println(sum);

    }
}

评测数据(输入,输出)：
(,)
(,)
(,)
(,)
(,)
(,)
(,)
(,)
(,)
(,)
```

四、A+B问题

```
问题描述
输入A、B，输出A+B。
说明：在“问题描述”这部分，会给出试题的意思，以及所要求的目标。
输入格式
输入的第一行包括两个整数，由空格分隔，分别表示A、B。
说明：“输入格式”是描述在测试你的程序时，所给的输入一定满足的格式。

做题时你应该假设所给的输入是一定满足输入格式的要求的，所以你不需要对输入的格式进行检查。多余的格式检查可能会适得其反，使用你的程序错误。

在测试的时候，系统会自动将输入数据输入到你的程序中，你不能给任何提示。比如，你在输入的时候提示“请输入A、B”之类的话是不需要的，这些多余的输出会使得你的程序被判定为错误。

输出格式
输出一行，包括一个整数，表示A+B的值。
说明：“输出格式”是要求你的程序在输出结果的时候必须满足的格式。

在输出时，你的程序必须满足这个格式的要求，不能少任何内容，也不能多任何内容。如果你的内容和输出格式要求的不一样，你的程序会被判断为错误，包括你输出了提示信息、中间调试信息、计时或者统计的信息等。

样例输入
12 45
说明：“样例输入”给出了一组满足“输入格式”要求的输入的例子。

这里给出的输入只是可能用来测试你的程序的一个输入，在测试的时候，还会有更多的输入用来测试你的程序。

样例输出
57
说明：“样例输出”给出了一组满足“输出格式”要求的输出的例子。

样例输出中的结果是和样例输入中的是对应的，因此，你可以使用样例的输入输出简单的检查你的程序。

要特别指出的是，能够通过样例输入输出的程序并不一定是正确的程序，在测试的时候，会用很多组数据进行测试，而不局限于样例数据。有可能一个程序通过了样例数据，但测试的时候仍只能得0分，可能因为这个程序只在一些类似样例的特例中正确，而不具有通用性，再测试更多数据时会出现错误。

比如，对于本题，如果你写一个程序不管输入是什么都输入57，则样例数据是对的，但是测试其他数据，哪怕输入是1和2，这个程序也输出57，则对于其他数据这个程序都不正确。

数据规模与约定
-10000 <= A, B <= 10000。
说明：“数据规模与约定”中给出了试题中主要参数的范围。

这个范围对于解题非常重要，不同的数据范围会导致试题需要使用不同的解法来解决。比如本题中给的A、B范围不大，可以使用整型(int)来保存，如果范围更大，超过int的范围，则要考虑其他方法来保存大数。

有一些范围在方便的时候是在“问题描述”中直接给的，所以在做题时不仅要看这个范围，还要注意问题描述。
```

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        long a = in.nextLong();
        long b = in.nextLong();
        System.out.println(a+b);
    }
}
```

## 基础练习

### BASIC-13 数列排序
```
问题描述
　　给定一个长度为n的数列，将这个数列按从小到大的顺序排列。1<=n<=200
输入格式
　　第一行为一个整数n。
　　第二行包含n个整数，为待排序的数，每个整数的绝对值小于10000。
输出格式
　　输出一行，按从小到大的顺序输出排序后的数列。
样例输入
5
8 3 6 4 9
样例输出
3 4 6 8 9
```

```java
import java.util.Arrays;
import java.util.Scanner;

public class Main {
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int len = in.nextInt();
        int[] arr = new int[200];
        for(int i = 0;i < len;i++){
            arr[i]=in.nextInt();
        }
        Arrays.sort(arr,0,len);
        for (int j=0;j<len;j++){
            System.out.print(arr[j]+" ");
        }

    }
}
```


### BASIC-12 十六进制转八进制

```
问题描述
　　给定n个十六进制正整数，输出它们对应的八进制数。

输入格式
　　输入的第一行为一个正整数n （1<=n<=10）。
　　接下来n行，每行一个由0~9、大写字母A~F组成的字符串，表示要转换的十六进制正整数，每个十六进制数长度不超过100000。

输出格式
　　输出n行，每行为输入对应的八进制正整数。

　　【注意】
　　输入的十六进制数不会有前导0，比如012A。
　　输出的八进制数也不能有前导0。

样例输入
　　2
　　39
　　123ABC

样例输出
　　71
　　4435274

　　【提示】
　　先将十六进制数转换成某进制数，再由某进制数转换成八进制。
```


```java
法一：(先转成十进制，再转八进制，不能满分)
import java.util.Scanner;

public class Main {
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        String[] arry = new String[10];
        for(int i = 0;i < n;i++){
            String num = in.next();
            arry[i] = Long.toOctalString(Long.parseLong(num,16));
        }
        for(int i = 0;i < n;i++){
            System.out.println(arry[i]);
        }

    }
}

-----------------------------

法二：改造算法，先转二进制，再转八进制

import java.util.Scanner;

public class Main {
    public static void binaryTransform(int n, char[][] arry, String[] arryBinaryStr) {
        String[] arryOctalStr = new String[10];
        String str = "";
        for (int i = 0; i < n; i++) {
            arryBinaryStr[i] = "";
            for (int j = 0; j < arry[i].length; j++) {
                switch (arry[i][j]) {
                    case '0':
                        arryBinaryStr[i] = arryBinaryStr[i] + "0000";
                        break;
                    case '1':
                        arryBinaryStr[i] = arryBinaryStr[i] + "0001";
                        break;
                    case '2':
                        arryBinaryStr[i] = arryBinaryStr[i] + "0010";
                        break;
                    case '3':
                        arryBinaryStr[i] = arryBinaryStr[i] + "0011";
                        break;
                    case '4':
                        arryBinaryStr[i] = arryBinaryStr[i] + "0100";
                        break;
                    case '5':
                        arryBinaryStr[i] = arryBinaryStr[i] + "0101";
                        break;
                    case '6':
                        arryBinaryStr[i] = arryBinaryStr[i] + "0110";
                        break;
                    case '7':
                        arryBinaryStr[i] = arryBinaryStr[i] + "0111";
                        break;
                    case '8':
                        arryBinaryStr[i] = arryBinaryStr[i] + "1000";
                        break;
                    case '9':
                        arryBinaryStr[i] = arryBinaryStr[i] + "1001";
                        break;
                    case 'A':
                        arryBinaryStr[i] = arryBinaryStr[i] + "1010";
                        break;
                    case 'B':
                        arryBinaryStr[i] = arryBinaryStr[i] + "1011";
                        break;
                    case 'C':
                        arryBinaryStr[i] = arryBinaryStr[i] + "1100";
                        break;
                    case 'D':
                        arryBinaryStr[i] = arryBinaryStr[i] + "1101";
                        break;
                    case 'E':
                        arryBinaryStr[i] = arryBinaryStr[i] + "1110";
                        break;
                    case 'F':
                        arryBinaryStr[i] = arryBinaryStr[i] + "1111";
                        break;
                }
            }
        }
        for (int i = 0; i < n; i++) {
            if (arryBinaryStr[i].length() % 3 == 1) {
                arryBinaryStr[i] = "00" + arryBinaryStr[i];
            } else if (arryBinaryStr[i].length() % 3 == 2) {
                arryBinaryStr[i] = "0" + arryBinaryStr[i];
            }
            arryOctalStr[i] = "";
            for (int j = 0; j < arryBinaryStr[i].length() / 3; j++) {
                str = arryBinaryStr[i].substring(j * 3, j * 3 + 3);
                switch (str) {
                    case "000":
                        arryOctalStr[i] += "0";
                        break;
                    case "001":
                        arryOctalStr[i] += "1";
                        break;
                    case "010":
                        arryOctalStr[i] += "2";
                        break;
                    case "011":
                        arryOctalStr[i] += "3";
                        break;
                    case "100":
                        arryOctalStr[i] += "4";
                        break;
                    case "101":
                        arryOctalStr[i] += "5";
                        break;
                    case "110":
                        arryOctalStr[i] += "6";
                        break;
                    case "111":
                        arryOctalStr[i] += "7";
                        break;
                }
            }
        }
        for (int i = 0; i < n; i++) {
            str = arryOctalStr[i].substring(0, 1);
            if (str.equals("0")) {
                System.out.println(arryOctalStr[i].substring(1,
                        arryOctalStr[i].length()));
            } else {
                System.out.println(arryOctalStr[i]);
            }
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        char[][] arry = new char[10][100000];
        String[] arryBinaryStr = new String[10];
        String number;
        if (n >= 1 && n <= 10) {
            for (int i = 0; i < n; i++) {
                number = sc.next();
                arry[i] = number.toCharArray();
            }
            binaryTransform(n, arry, arryBinaryStr);
        }
    }
}
```


### BASIC-11 十六进制转十进制

```
问题描述
　　从键盘输入一个不超过8位的正的十六进制数字符串，将它转换为正的十进制数后输出。
　　注：十六进制数中的10~15分别用大写的英文字母A、B、C、D、E、F表示。
样例输入
FFFF
样例输出
65535
```

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String num = in.next();
//        System.out.println(Integer.valueOf(num,16));
        System.out.println(Long.parseLong(num,16));
    }
}
```

### BASIC-10 十进制转十六进制

```
问题描述
　　十六进制数是在程序设计时经常要使用到的一种整数的表示方式。它有0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F共16个符号，分别表示十进制数的0至15。十六进制的计数方法是满16进1，所以十进制数16在十六进制中是10，而十进制的17在十六进制中是11，以此类推，十进制的30在十六进制中是1E。
　　给出一个非负整数，将它表示成十六进制的形式。
输入格式
　　输入包含一个非负整数a，表示要转换的数。0<=a<=2147483647
输出格式
　　输出这个整数的16进制表示
样例输入
30
样例输出
1E
```

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        String num = in.next();
        System.out.println(Long.toHexString(Long.parseLong(num,10)).toUpperCase());
    }
}
```


### BASIC-9 特殊回文数

```
问题描述
　　123321是一个非常特殊的数，它从左边读和从右边读是一样的。
　　输入一个正整数n， 编程求所有这样的五位和六位十进制数，满足各位数字之和等于n 。
输入格式
　　输入一行，包含一个正整数n。
输出格式
　　按从小到大的顺序输出满足条件的整数，每个整数占一行。
样例输入
52
样例输出
899998
989989
998899
数据规模和约定
　　1<=n<=54。
```

```java
import java.util.Arrays;
import java.util.Scanner;

public class Main {
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int sum = in.nextInt();
        StringBuffer str = new StringBuffer();

        // 取前三位
        for(int i = 1;i < 10;i++){
            for(int j = 0;j < 10;j++){
                for(int k = 0;k < 10;k++){
                    if(i*2 + j*2 + k*2 == sum){
                        str.append(i*100000+j*10000+k*1000+k*100+j*10+i);
                        str.append(',');

                    }
                    if(i*2+j*2+k == sum){
                        str.append(i*10000+j*1000+k*100+j*10+i);
                        str.append(',');
                    }
                }
            }
        }


        // 以,转成字符串数组
        String[] strArr = str.toString().split(",");
        // 将字符串数组转成int数组
        int[] intArr = new int[strArr.length];
        for(int m = 0;m < intArr.length;m++){
            intArr[m] = Integer.parseInt(strArr[m]);
        }

        // 排序
        Arrays.sort(intArr);

        // 打印
        for(int i = 0;i < intArr.length;i++){
            System.out.println(intArr[i]);
        }
    }
}
```


### BASIC-8 回文数

```
问题描述
　　1221是一个非常特殊的数，它从左边读和从右边读是一样的，编程求所有这样的四位十进制数。
输出格式
　　按从小到大的顺序输出满足条件的四位十进制数。

```

```java
import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.Scanner;

public class Main {
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);

        StringBuffer str = new StringBuffer();



        for(int i = 1;i < 10;i++){
            for(int j = 0;j < 10;j++){
                for(int k = 0;k < 10;k++){
                    for(int n = 0;n < 10;n++){
                        if(i==n && j==k){
                            str.append(i*1000+j*100+k*10+n);
                            str.append(",");
                        }
                    }
                }
            }
        }

        String[] strArr = str.toString().split(",");
        int[] intArr = new int[strArr.length];
        for(int m = 0;m < intArr.length;m++){
            intArr[m] = Integer.parseInt(strArr[m]);
        }

        Arrays.sort(intArr);

        for(int i = 0;i < intArr.length;i++){
            System.out.println(intArr[i]);
        }
    }
}
```


### BASIC-7 特殊的数字


```
问题描述
　　153是一个非常特殊的数，它等于它的每位数字的立方和，即153=1*1*1+5*5*5+3*3*3。编程求所有满足这种条件的三位十进制数。
输出格式
　　按从小到大的顺序输出满足条件的三位十进制数，每个数占一行。
```


```java
import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.Scanner;

public class Main {
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        StringBuffer str = new StringBuffer();


        for(int i = 1;i < 10;i++){
            for(int j = 0;j < 10;j++){
                for(int m = 0;m < 10;m++){
                    if((i*100 + j*10 + m) == (i*i*i+j*j*j+m*m*m)){
                        str.append(i*100 + j*10 + m);
                        str.append(",");
                    }
                }
            }
        }

        String[] strArr = str.toString().split(",");
        int[] intArr = new int[strArr.length];
        for(int i = 0;i < intArr.length;i++){
            intArr[i] = Integer.parseInt(strArr[i]);
        }

        Arrays.sort(intArr);
        for(int j = 0;j < intArr.length;j++){
            System.out.println(intArr[j]);
        }
    }
}

```


### BASIC-6 杨辉三角形

```
问题描述
杨辉三角形又称Pascal三角形，它的第i+1行是(a+b)i的展开式的系数。

　　
它的一个重要性质是：三角形中的每个数字等于它两肩上的数字相加。

　　
下面给出了杨辉三角形的前4行：

　　
   1

　　
  1 1

　　
 1 2 1

　　
1 3 3 1

　　
给出n，输出它的前n行。

输入格式
输入包含一个数n。

输出格式
输出杨辉三角形的前n行。每一行从这一行的第一个数开始依次输出，中间使用一个空格分隔。请不要在前面输出多余的空格。
样例输入
4
样例输出
1
1 1
1 2 1
1 3 3 1
数据规模与约定
1 <= n <= 34。
```

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[][] arr = new int[35][35];

        // 将最左边的一列全赋值为1
        for(int i = 1;i < arr.length;i++){
            arr[i][1] = 1;
        }



        // 计算出从2-n 列的值
        for(int i = 2;i <= n;i++){
            for(int j = 2;j <= i;j++){
                arr[i][j] = arr[i-1][j-1]+arr[i-1][j];
            }
        }

        for(int i = 1;i <= n;i++){
            for(int j = 1;j <= n;j++){
                if(arr[i][j]!=0){
                    System.out.print(arr[i][j]+" ");
                }

            }
            System.out.println("");

        }
    }
}
```




### BASIC-5 查找整数

```
问题描述
给出一个包含n个整数的数列，问整数a在数列中的第一次出现是第几个。

输入格式
第一行包含一个整数n。

第二行包含n个非负整数，为给定的数列，数列中的每个数都不大于10000。

第三行包含一个整数a，为待查找的数。

输出格式
如果a在数列中出现了，输出它第一次出现的位置(位置从1开始编号)，否则输出-1。
样例输入
6
1 9 4 8 3 9
9
样例输出
2
数据规模与约定
1 <= n <= 1000。
```


```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] arr = new int[n];

        for(int i = 0;i < n;i++){
            arr[i] = in.nextInt();
        }

        int search = in.nextInt();
        boolean flag = false;
        for(int j = 0;j < n;j++){
            if(arr[j] == search){
                flag = true;
                System.out.println(j+1);
                break;
            }

        }
        if(!flag){
            System.out.println(-1);
        }
    }
}
```

### BASIC-4 数列特征

```
问题描述
给出n个数，找出这n个数的最大值，最小值，和。

输入格式
第一行为整数n，表示数的个数。

第二行有n个数，为给定的n个数，每个数的绝对值都小于10000。

输出格式
输出三行，每行一个整数。第一行表示这些数中的最大值，第二行表示这些数中的最小值，第三行表示这些数的和。
样例输入
5
1 3 -2 4 5
样例输出
5
-2
11
数据规模与约定
1 <= n <= 10000。
```

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] arr = new int[n];

        for(int i = 0;i < arr.length;i++){
            arr[i] = in.nextInt();
        }

        int max = arr[0];
        int min = arr[0];
        int sum = 0;

        for(int i = 0;i < arr.length;i++){
            sum += arr[i];
            if(max < arr[i]){
                max = arr[i];
            }
            if(min > arr[i]){
                min = arr[i];
            }
        }

        System.out.println(max);
        System.out.println(min);
        System.out.println(sum);
    }
}
```


### BASIC-3 字母图形

```
问题描述
利用字母可以组成一些美丽的图形，下面给出了一个例子：

ABCDEFG

BABCDEF

CBABCDE

DCBABCD

EDCBABC

这是一个5行7列的图形，请找出这个图形的规律，并输出一个n行m列的图形。

输入格式
输入一行，包含两个整数n和m，分别表示你要输出的图形的行数的列数。
输出格式
输出n行，每个m个字符，为你的图形。
样例输入
5 7
样例输出
ABCDEFG
BABCDEF
CBABCDE
DCBABCD
EDCBABC
数据规模与约定
1 <= n, m <= 26。
```

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int row = in.nextInt();
        int columns = in.nextInt();
        String str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        char[] chr = str.toCharArray();

        for(int i = 0;i < row;i++){
            if (i < columns) {
                for(int k = i;k > 0;k--){
                    System.out.print(chr[k]);
                }
            }else{
                for(int k = i;k >= i-columns+1;k--){
                    System.out.print(chr[k]);

                }
            }

            for(int j = 0;j < columns-i ;j++){
                System.out.print(chr[j]);
            }
            System.out.println("");
        }


    }
}
```


### BASIC-2 01字串

```
问题描述
对于长度为5位的一个01串，每一位都可能是0或1，一共有32种可能。它们的前几个是：

00000

00001

00010

00011

00100

请按从小到大的顺序输出这32种01串。

输入格式
本试题没有输入。
输出格式
输出32行，按从小到大的顺序每行一个长度为5的01串。
样例输出
00000
00001
00010
00011
<以下部分省略>
```

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args){
        for(int i = 0;i < 32;i++){
            /**
             * Long.parseLong(str)  Integer.parseInt(str)  将字符串转成数字
             * String.valueOf(num)  将数字转字符串
             */
            System.out.println(String.format("%05d",Long.parseLong(Long.toBinaryString(i))));
        }
    }
}
```


### BASIC-1 闰年判断

```
问题描述
给定一个年份，判断这一年是不是闰年。

当以下情况之一满足时，这一年是闰年：

1. 年份是4的倍数而不是100的倍数；

2. 年份是400的倍数。

其他的年份都不是闰年。

输入格式
输入包含一个整数y，表示当前的年份。
输出格式
输出一行，如果给定的年份是闰年，则输出yes，否则输出no。
说明：当试题指定你输出一个字符串作为结果（比如本题的yes或者no，你需要严格按照试题中给定的大小写，写错大小写将不得分。

样例输入
2013
样例输出
no
样例输入
2016
样例输出
yes
数据规模与约定
1990 <= y <= 2050。
```

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int year = in.nextInt();

        if((year%4 == 0 && year%100 !=0) || (year%400 == 0)){
            System.out.println("yes");
        }else {
            System.out.println("no");

        }
    }
}
```


### BASIC-30 阶乘计算

```
问题描述
　　输入一个正整数n，输出n!的值。
　　其中n!=1*2*3*…*n。
算法描述
　　n!可能很大，而计算机能表示的整数范围有限，需要使用高精度计算的方法。使用一个数组A来表示一个大整数a，A[0]表示a的个位，A[1]表示a的十位，依次类推。
　　将a乘以一个整数k变为将数组A的每一个元素都乘以k，请注意处理相应的进位。
　　首先将a设为1，然后乘2，乘3，当乘到n时，即得到了n!的值。
输入格式
　　输入包含一个正整数n，n<=1000。
输出格式
　　输出n!的准确值。
样例输入
10
样例输出
3628800
```

```java
法一：
import java.math.BigInteger;
import java.util.Scanner;

public class Main {
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        BigInteger a = BigInteger.valueOf(n);
        BigInteger b = BigInteger.ONE;
        BigInteger s = BigInteger.ONE;
        for(BigInteger i = BigInteger.ONE;i.compareTo(a)<=0;i=i.add(b)){
            s=s.multiply(i);
        }
        System.out.println(s);
    }
}

法二：
import java.util.Scanner;
public class Main {
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if (n > 1000)
            return;
        int sum[] = new int[10000];
        for (int i = 0; i < sum.length; i++) {
            sum[i] = 0;
        }
        sum[0] = 1;
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j < sum.length; j++) {
                sum[j] = sum[j] * i;
            }
            for (int k = 0; k < sum.length; k++) {
                if (sum[k] >= 10) {
                    int kinwei = sum[k] / 10;
                    sum[k + 1] += kinwei;
                    sum[k] = sum[k] % 10;
                }
            }
        }
        int flag = 1;
        for (int i = sum.length - 1; i >= 0; i--) {
            if (flag == 1) {
                if (sum[i] != 0)
                    flag = 0;
            }
            if (flag == 0) {
                System.out.print(sum[i]);
            }
        }
    }
}
```

### BASIC-29 高精度加法

```
问题描述
　　输入两个整数a和b，输出这两个整数的和。a和b都不超过100位。
算法描述
　　由于a和b都比较大，所以不能直接使用语言中的标准数据类型来存储。对于这种问题，一般使用数组来处理。
　　定义一个数组A，A[0]用于存储a的个位，A[1]用于存储a的十位，依此类推。同样可以用一个数组B来存储b。
　　计算c = a + b的时候，首先将A[0]与B[0]相加，如果有进位产生，则把进位（即和的十位数）存入r，把和的个位数存入C[0]，即C[0]等于(A[0]+B[0])%10。然后计算A[1]与B[1]相加，这时还应将低位进上来的值r也加起来，即C[1]应该是A[1]、B[1]和r三个数的和．如果又有进位产生，则仍可将新的进位存入到r中，和的个位存到C[1]中。依此类推，即可求出C的所有位。
　　最后将C输出即可。
输入格式
　　输入包括两行，第一行为一个非负整数a，第二行为一个非负整数b。两个整数都不超过100位，两数的最高位都不是0。
输出格式
　　输出一行，表示a + b的值。
样例输入
20100122201001221234567890
2010012220100122
样例输出
20100122203011233454668012
```

```java
import java.math.BigInteger;
import java.util.Scanner;
public class Main {
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        BigInteger a = in.nextBigInteger();
        BigInteger b = in.nextBigInteger();
        System.out.println(a.add(b));
    }
}
```


### BASIC-28 Huffuman树

```
问题描述
　　Huffman树在编码中有着广泛的应用。在这里，我们只关心Huffman树的构造过程。
　　给出一列数{pi}={p0, p1, …, pn-1}，用这列数构造Huffman树的过程如下：
　　1. 找到{pi}中最小的两个数，设为pa和pb，将pa和pb从{pi}中删除掉，然后将它们的和加入到{pi}中。这个过程的费用记为pa + pb。
　　2. 重复步骤1，直到{pi}中只剩下一个数。
　　在上面的操作过程中，把所有的费用相加，就得到了构造Huffman树的总费用。
　　本题任务：对于给定的一个数列，现在请你求出用该数列构造Huffman树的总费用。

　　例如，对于数列{pi}={5, 3, 8, 2, 9}，Huffman树的构造过程如下：
　　1. 找到{5, 3, 8, 2, 9}中最小的两个数，分别是2和3，从{pi}中删除它们并将和5加入，得到{5, 8, 9, 5}，费用为5。
　　2. 找到{5, 8, 9, 5}中最小的两个数，分别是5和5，从{pi}中删除它们并将和10加入，得到{8, 9, 10}，费用为10。
　　3. 找到{8, 9, 10}中最小的两个数，分别是8和9，从{pi}中删除它们并将和17加入，得到{10, 17}，费用为17。
　　4. 找到{10, 17}中最小的两个数，分别是10和17，从{pi}中删除它们并将和27加入，得到{27}，费用为27。
　　5. 现在，数列中只剩下一个数27，构造过程结束，总费用为5+10+17+27=59。
输入格式
　　输入的第一行包含一个正整数n（n<=100）。
　　接下来是n个正整数，表示p0, p1, …, pn-1，每个数不超过1000。
输出格式
　　输出用这些数构造Huffman树的总费用。
样例输入
5
5 3 8 2 9
样例输出
59
```

```java
import java.lang.reflect.Array;
import java.util.Arrays;
import java.util.Scanner;
public class Main {
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] arr = new int[n];
        for(int i = 0;i < n;i++){
            arr[i] = in.nextInt();
        }
        int sum = 0;

        int i=0;
        for(;i+1<arr.length;){
            Arrays.sort(arr);
            int temp = arr[i] + arr[i+1];
            arr[i+1] = temp;
            sum+=temp;
            // [i+1,arr.length-1]
            arr = Arrays.copyOfRange(arr,i+1,arr.length);
        }
        System.out.println(sum);
    }
}
```

### BASIC-27 2n皇后问题

```
问题描述
　　给定一个n*n的棋盘，棋盘中有一些位置不能放皇后。现在要向棋盘中放入n个黑皇后和n个白皇后，使任意的两个黑皇后都不在同一行、同一列或同一条对角线上，任意的两个白皇后都不在同一行、同一列或同一条对角线上。问总共有多少种放法？n小于等于8。
输入格式
　　输入的第一行为一个整数n，表示棋盘的大小。
　　接下来n行，每行n个0或1的整数，如果一个整数为1，表示对应的位置可以放皇后，如果一个整数为0，表示对应的位置不可以放皇后。
输出格式
　　输出一个整数，表示总共有多少种放法。
样例输入
4
1 1 1 1
1 1 1 1
1 1 1 1
1 1 1 1
样例输出
2
样例输入
4
1 0 1 1
1 1 1 1
1 1 1 1
1 1 1 1
样例输出
0
```


```java
import java.util.Scanner;

public class Main {
    static int n;
    static int[] w_place;
    static int[] b_place;
    static int[][] arr;

    static int result=0;

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);

        n = in.nextInt();
        w_place = new int[n];
        b_place = new int[n];
        arr = new int[n][n];

        // 输入矩阵
        for(int i = 0;i < n;i++){
            for(int j = 0;j < n;j++){
                arr[i][j] = in.nextInt();
            }
        }

        // 递归回溯
        backdate(0);
        System.out.println(result);
    }

    // 递归回溯
    public static void backdate(int i){
        if(i>n-1){
            result++;
            return;
        }

        // 处理第i个白皇后
        for(int w = 0;w < n;w++){
            if(checkWhite(i,w)){
                w_place[i] = w;
                arr[i][w] = 0;
                // 处理第i个黑皇后(第i个白皇后有位置放时，才考虑第i个黑皇后)
                for(int b = 0;b < n;b++){
                    if(checkBlack(i,b)){
                        b_place[i] = b;
                        arr[i][b] = 0;
                        // 递归
                        backdate(i+1);

                        // 回溯
                        arr[i][b] = 1;
                    }
                }
                arr[i][w] = 1;
            }

        }
    }
    // 白皇后
    public static boolean checkWhite(int i,int j){
        if(arr[i][j] == 0){
            return false;
        }
        for(int k = 0;k < i;k++){
            if(j==w_place[k] || Math.abs(i-k) == Math.abs(j-w_place[k])){
                return false;
            }
        }
        return true;
    }

    // 黑皇后
    public static boolean checkBlack(int i,int j){
        if (arr[i][j] == 0){
            return false;
        }
        for(int k = 0;k < i;k++){
            if(j == b_place[k] || Math.abs(i-k) == Math.abs(j-b_place[k])){
                return false;
            }
        }
        return true;
    }
}
```

### BASIC-26 报时助手

```
问题描述
　　给定当前的时间，请用英文的读法将它读出来。
　　时间用时h和分m表示，在英文的读法中，读一个时间的方法是：
　　如果m为0，则将时读出来，然后加上“o'clock”，如3:00读作“three o'clock”。
　　如果m不为0，则将时读出来，然后将分读出来，如5:30读作“five thirty”。
　　时和分的读法使用的是英文数字的读法，其中0~20读作：
　　0:zero, 1: one, 2:two, 3:three, 4:four, 5:five, 6:six, 7:seven, 8:eight, 9:nine, 10:ten, 11:eleven, 12:twelve, 13:thirteen, 14:fourteen, 15:fifteen, 16:sixteen, 17:seventeen, 18:eighteen, 19:nineteen, 20:twenty。
　　30读作thirty，40读作forty，50读作fifty。
　　对于大于20小于60的数字，首先读整十的数，然后再加上个位数。如31首先读30再加1的读法，读作“thirty one”。
　　按上面的规则21:54读作“twenty one fifty four”，9:07读作“nine seven”，0:15读作“zero fifteen”。
输入格式
　　输入包含两个非负整数h和m，表示时间的时和分。非零的数字前没有前导0。h小于24，m小于60。
输出格式
　　输出时间时刻的英文。
样例输入
0 15
样例输出
zero fifteen
```

```java
import java.util.Scanner;

public class Main {

    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        int h = in.nextInt();
        int m = in.nextInt();

        String hour,minite;
        String[] arr = {"zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen","twenty"};

        if(h<0 || h>24 || m<0 || h>60){
            return;
        }


        if(h<=20 && h>=0){
            for(int i = 0;i < arr.length;i++){
                if(h == i){
                    System.out.print(arr[i]);
                }
            }
        }else if(h>20){
            for(int i = 0;i < arr.length;i++){
                if(h%10 == i){
                    System.out.print(arr[20]+" "+arr[i]);
                }
            }
        }

        System.out.print(" ");

        String temp = "";
        switch (m/10){
            case 2:temp = "twenty";break;
            case 3:temp = "thirty";break;
            case 4:temp = "forty";break;
            case 5:temp = "fifty";break;
        }
        if(m<=20){
            for(int i = 0;i < arr.length;i++){
                if(m == i){
                    if(m == 0){
                        System.out.print("o'clock");
                    }else{
                        System.out.print(arr[i]);
                    }

                }
            }
        }else{
            for(int i = 0;i < arr.length;i++){
                if(m%10 == i){
                    System.out.print(temp+" "+arr[i]);
                }

            }
        }

    }

}
```

### BASIC-25 回形取数

```
问题描述
　　回形取数就是沿矩阵的边取数，若当前方向上无数可取或已经取过，则左转90度。一开始位于矩阵左上角，方向向下。
输入格式
　　输入第一行是两个不超过200的正整数m, n，表示矩阵的行和列。接下来m行每行n个整数，表示这个矩阵。
输出格式
　　输出只有一行，共mn个数，为输入矩阵回形取数得到的结果。数之间用一个空格分隔，行末不要有多余的空格。
样例输入
3 3
1 2 3
4 5 6
7 8 9
样例输出
1 4 7 8 9 6 3 2 5
样例输入
3 2
1 2
3 4
5 6
样例输出
1 3 5 6 4 2
```

运行一直超时，改用了下C语言
```java
import java.util.Scanner;//回形取数

public class Main {

    public static void main(String[] args) {
        Scanner input=new Scanner(System.in);
        int m=input.nextInt(),n=input.nextInt();
        int arr[][]=new int[m][n];
        for(int i=0;i<m;i++){
            for(int j=0;j<n;j++){
                arr[i][j]=input.nextInt();
            }
        }
        int i=0,j=0;
        for (i = 0; i < (n + 1) / 2 && i < (m + 1) / 2; i++)
        {
            for (j = i; j < m - i; j++)
                System.out.print(arr[j][i]+" ");
            for (j = i + 1; j < n - i; j++)
                System.out.print(arr[m - i - 1][j]+" ");
            if (n - i - 1 > i)/*（当n为奇数时最后一次循环只有左一列的数据。）
                                前面每进一次循环都读了对称的两列数据，前面i-1次循环读了2i个数据（i从0开始）在这次判断之前又读了一列数据
                                所以判断有没有对称的右列数据只要判断n-2*i-1是否大于0（等价于n - i - 1 > i）  */
                for (j = m - i - 2; j >= i; j--)
                    System.out.print( arr[j][n - i - 1]+" ");
            if (m - i - 1 > i)
                for (j = n - i - 2; j > i; j--)
                    System.out.print( arr[i][j]+" ");
        }
    }
}
```

```c
#include <stdio.h>

int main()
{
    int i, j, m, n;
    int a[200][200];
    scanf("%d%d", &m, &n);
    for (i = 0; i < m; i++)
        for (j = 0; j < n; j++)
            scanf("%d", &a[i][j]);

    for (i = 0; i < (n + 1) / 2 && i < (m + 1) / 2; i++)
    {
        for (j = i; j < m - i; j++)
            printf("%d ", a[j][i]);
        for (j = i + 1; j < n - i; j++)
            printf("%d ", a[m - i - 1][j]);
        if (n - i - 1 > i)
            for (j = m - i - 2; j >= i; j--)
                printf("%d ", a[j][n - i - 1]);
        if (m - i - 1 > i)
            for (j = n - i - 2; j > i; j--)
                printf("%d ", a[i][j]);
    }
    return 0;
}
```


### BASIC-24 龟兔赛跑预测

```
问题描述
　　话说这个世界上有各种各样的兔子和乌龟，但是研究发现，所有的兔子和乌龟都有一个共同的特点——喜欢赛跑。于是世界上各个角落都不断在发生着乌龟和兔子的比赛，小华对此很感兴趣，于是决定研究不同兔子和乌龟的赛跑。他发现，兔子虽然跑比乌龟快，但它们有众所周知的毛病——骄傲且懒惰，于是在与乌龟的比赛中，一旦任一秒结束后兔子发现自己领先t米或以上，它们就会停下来休息s秒。对于不同的兔子，t，s的数值是不同的，但是所有的乌龟却是一致——它们不到终点决不停止。
　　然而有些比赛相当漫长，全程观看会耗费大量时间，而小华发现只要在每场比赛开始后记录下兔子和乌龟的数据——兔子的速度v1（表示每秒兔子能跑v1米），乌龟的速度v2，以及兔子对应的t，s值，以及赛道的长度l——就能预测出比赛的结果。但是小华很懒，不想通过手工计算推测出比赛的结果，于是他找到了你——清华大学计算机系的高才生——请求帮助，请你写一个程序，对于输入的一场比赛的数据v1，v2，t，s，l，预测该场比赛的结果。
输入格式
　　输入只有一行，包含用空格隔开的五个正整数v1，v2，t，s，l，其中(v1,v2<=100;t<=300;s<=10;l<=10000且为v1,v2的公倍数)
输出格式
　　输出包含两行，第一行输出比赛结果——一个大写字母“T”或“R”或“D”，分别表示乌龟获胜，兔子获胜，或者两者同时到达终点。
　　第二行输出一个正整数，表示获胜者（或者双方同时）到达终点所耗费的时间（秒数）。
样例输入
10 5 5 2 20
样例输出
D
4
样例输入
10 5 5 1 20
样例输出
R
3
样例输入
10 5 5 3 20
样例输出
T
4
```

```java

法一：
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int vr = in.nextInt();
        int vt = in.nextInt();
        int t = in.nextInt();
        int s = in.nextInt();
        int l = in.nextInt();

        int ttime = l / vt; // 乌龟的时间固定
        int cnttime= 0;     // 记录时间，相当于时钟
        int lent = 0;   // 乌龟的路程
        int lenr = 0;   // 兔子的路程
        int breaktime = 0;  // 兔子休息的时间
        int flag = 0;   // flag==0表示兔子不在休息，flag==1表示兔子正在休息
        while (lenr<l && lent<l){   // 兔子和乌龟都没到终点
            if(flag == 0 && lenr-lent<t || (flag==1 && breaktime>=s)){  // 兔子不休息的条件
                lenr = lenr+vr;
                flag=0;
                breaktime=0;
            }else{  // 兔子休息时
                flag = 1;
                breaktime++;
            }
            // 乌龟
            lent = lent+vt;
            cnttime++;
        }

        if(lent>=l && lenr < l){    // 乌龟win
            System.out.println("T");
        }else if(lent<l && lenr >= l){
            System.out.println("R");
        }else{
            System.out.println("D");
        }

        System.out.println(cnttime);
    }
}


-------------------------------------

法二：import java.util.Scanner;

public class Main {
    public static int v1;
    public static int v2;
    public static int t;
    public static int s;
    public static int l;
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        v1 = in.nextInt();
        v2 = in.nextInt();
        t = in.nextInt();
        s = in.nextInt();
        l = in.nextInt();
        run(0,0,0,0);
    }

    /**
     * 细化成一秒一秒的，
     * @param times 经过的秒数
     * @param rl    兔子经过的距离
     * @param tl    乌龟经过的距离
     * @param sLeft 兔子休息剩余时间
     */
    public static void run(int times,int rl,int tl,int sLeft){
        if(sLeft == 0){
            if(rl - tl>=t){
                // 这一秒直接用掉，告诉下一次还剩多少秒
                sLeft = s-1;
            }else {
                rl+=v1;
            }
        }else {
            // 兔子这一秒需要休息
            sLeft--;
        }

        tl+=v2;
        times++;

        if(rl==l && tl == l){
            System.out.println("D");
            System.out.println(times);
            return;
        }
        if(rl==l&&tl!=l){
            System.out.println("R");
            System.out.println(times);
            return;
        }
        if(rl!=l&&tl==l){
            System.out.println("T");
            System.out.println(times);
            return;
        }
        run(times,rl,tl,sLeft);
    }
}
```

### BASIC-23 芯片测试

```
问题描述
　　有n（2≤n≤20）块芯片，有好有坏，已知好芯片比坏芯片多。
　　每个芯片都能用来测试其他芯片。用好芯片测试其他芯片时，能正确给出被测试芯片是好还是坏。而用坏芯片测试其他芯片时，会随机给出好或是坏的测试结果（即此结果与被测试芯片实际的好坏无关）。
　　给出所有芯片的测试结果，问哪些芯片是好芯片。
输入格式
　　输入数据第一行为一个整数n，表示芯片个数。
　　第二行到第n+1行为n*n的一张表，每行n个数据。表中的每个数据为0或1，在这n行中的第i行第j列（1≤i, j≤n）的数据表示用第i块芯片测试第j块芯片时得到的测试结果，1表示好，0表示坏，i=j时一律为1（并不表示该芯片对本身的测试结果。芯片不能对本身进行测试）。
输出格式
　　按从小到大的顺序输出所有好芯片的编号
样例输入
3
1 0 1
0 1 0
1 0 1
样例输出
1 3
```

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[][] arr = new int[n][n];
        boolean[][] flag = new boolean[n][n];
        for(int i = 0;i < n;i++){
            for(int j = 0;j < n;j++){
                arr[i][j] = in.nextInt();
            }
        }

        for(int j = 0;j < n;j++){
            int sum = 0;
            for(int i = 0;i < n;i++){
                sum+=arr[i][j];
            }
            if(sum>(n/2)){
                System.out.print(j+1+" ");
            }
        }
    }
}
```

### BASIC-22 FJ的字符串

```
问题描述
　　FJ在沙盘上写了这样一些字符串：
　　A1 = “A”
　　A2 = “ABA”
　　A3 = “ABACABA”
　　A4 = “ABACABADABACABA”
　　… …
　　你能找出其中的规律并写所有的数列AN吗？
输入格式
　　仅有一个数：N ≤ 26。
输出格式
　　请输出相应的字符串AN，以一个换行符结束。输出中不得含有多余的空格或换行、回车符。
样例输入
3
样例输出
ABACABA
```

```java
import java.util.Scanner;

public class Main {
    /**
     1* A
     2* A B A
     3* ABA C ABA
     4* ABACABA D ABACABA
     5* ABACABADABACABA E ABACABADABACABA
     */
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        System.out.println(an(n));
    }

    public static String an(int n){
        String abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        char[] a = abc.toCharArray();
        if(n == 1){
            return String.valueOf(a[0]);
        }
        return an(n-1)+a[n-1]+an(n-1);
    }
}
```

### BASIC-21 Sine之舞

```
问题描述
　　最近FJ为他的奶牛们开设了数学分析课，FJ知道若要学好这门课，必须有一个好的三角函数基本功。所以他准备和奶牛们做一个“Sine之舞”的游戏，寓教于乐，提高奶牛们的计算能力。
　　不妨设
　　An=sin(1–sin(2+sin(3–sin(4+...sin(n))...)
　　Sn=(...(A1+n)A2+n-1)A3+...+2)An+1
　　FJ想让奶牛们计算Sn的值，请你帮助FJ打印出Sn的完整表达式，以方便奶牛们做题。
输入格式
　　仅有一个数：N<201。
输出格式
　　请输出相应的表达式Sn，以一个换行符结束。输出中不得含有多余的空格或换行、回车符。
样例输入
3
样例输出
((sin(1)+3)sin(1–sin(2))+2)sin(1–sin(2+sin(3)))+1
```

```java
import java.util.Scanner;

public class Main {
    /**
     * a1 = sin(1)+1
     * a2 = (sin(1)+2)sin(1-sin(2))+1
     * a3 = (sin(1)+3)(sin(1-sin(2))+2)sin(1-sin(2+sin(3)))+1
     *
     * ((sin(1)+3)  sin(1–sin(2))+2)  sin(1–sin(2+sin(3)))  +1
     */
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String[] arr = new String[201];
        String s="";
        int n = in.nextInt();

        for(int i = 0;i < n;i++){
            if(i == 0){
                arr[i] = "sin(1";
                continue;
            }
            arr[i] = arr[i-1];
            if(i % 2 == 1){
                arr[i] += "-";
            }else{
                arr[i] += "+";
            }
            arr[i] += "sin(";
            arr[i] += (char)(i+'1');
        }

        for(int i = 0;i < n;i++){
            for(int j = 0;j <= i ;j++){
                arr[i] += ")";
            }
        }

        for(int i = 2;i <= n;i++){
            s += "(";
        }

        for(int i = n-1;i >= 1;i--){
            s += arr[n-1-i];
            s += "+";
            s += (char)(i+1+'0');
            s += ")";
        }

        s += arr[n-1];
        s += "+1";
        System.out.println(s);
    }
}
```

### BASIC-20 数的读法

```
问题描述
　　Tom教授正在给研究生讲授一门关于基因的课程，有一件事情让他颇为头疼：一条染色体上有成千上万个碱基对，它们从0开始编号，到几百万，几千万，甚至上亿。
　　比如说，在对学生讲解第1234567009号位置上的碱基时，光看着数字是很难准确的念出来的。
　　所以，他迫切地需要一个系统，然后当他输入12 3456 7009时，会给出相应的念法：
　　十二亿三千四百五十六万七千零九
　　用汉语拼音表示为
　　shi er yi san qian si bai wu shi liu wan qi qian ling jiu
　　这样他只需要照着念就可以了。
　　你的任务是帮他设计这样一个系统：给定一个阿拉伯数字串，你帮他按照中文读写的规范转为汉语拼音字串，相邻的两个音节用一个空格符格开。
　　注意必须严格按照规范，比如说“10010”读作“yi wan ling yi shi”而不是“yi wan ling shi”，“100000”读作“shi wan”而不是“yi shi wan”，“2000”读作“er qian”而不是“liang qian”。
输入格式
　　有一个数字串，数值大小不超过2,000,000,000。
输出格式
　　是一个由小写英文字母，逗号和空格组成的字符串，表示该数的英文读法。
样例输入
1234567009
样例输出
shi er yi san qian si bai wu shi liu wan qi qian ling jiu
```

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String str = in.next();
        int numbers = Integer.parseInt(str);
        String[] shuzi = {"ling", "yi", "er", "san", "si", "wu", "liu", "qi", "ba", "jiu", "shi", "shi yi", "shi er", "shi san", "shi si", "shi wu", "shi liu", "shi qi", "shi ba", "shi jiu", "er shi"};


        int one = numbers / 100000000;
        int two = numbers / 10000 - one * 10000;
        int three = numbers % 10000;

        // 亿位
        if(one > 0){  // 1-20
            int first = one / 10;
            int second = one % 10;
            if(first == 0 && second == 2){
                System.out.print("ling");
            }else{
                System.out.print(shuzi[one]);
            }

            System.out.print(" yi ");

        }

        // 万位
        if(two > 0){
            int first = two / 1000;
            int secone = (two / 100) % 10;
            int third = (two / 10) % 10;
            int forth = two % 10;

            if(first > 0){
                System.out.print(shuzi[first] + " qian ");
            }

            if(secone > 0){
                System.out.print(shuzi[secone]+" bai ");
            }

            if(first!=0 && (secone==0 || third==0) && forth!=0){
                System.out.print("ling ");
            }

            if(third>0){
                if(third == 1){
                    System.out.print("shi ");
                }else{
                    System.out.print(shuzi[third]+" shi ");
                }

            }

            if(forth>0){
                if(first==0 && secone==0 && third==0 && forth==2){
                    System.out.print("liang");
                }else{
                    System.out.print(shuzi[forth]);
                }

            }
            System.out.print(" wan ");
        }

        // 十位
        if(three>0){
            int first = three / 1000;
            int secone = (three / 100) % 10;
            int third = (three / 10) % 10;
            int forth = three % 10;

            if(first>0){
                System.out.print(shuzi[first]+" qian ");
            }
            if(secone>0){
                System.out.print(shuzi[secone]+" bai ");
            }

            if((secone==0 || third==0) && forth!=0){
                System.out.print("ling ");
            }

            if(third>0){
                if(third == 1){
                    System.out.print("shi ");
                }else{
                    System.out.print(shuzi[third]+" shi ");
                }
            }
            if(forth>0){
                System.out.print(shuzi[forth]);
            }
        }
    }
}
```


### BASIC-19 完美的代价

```
问题描述
　　回文串，是一种特殊的字符串，它从左往右读和从右往左读是一样的。小龙龙认为回文串才是完美的。现在给你一个串，它不一定是回文的，请你计算最少的交换次数使得该串变成一个完美的回文串。
　　交换的定义是：交换两个相邻的字符
　　例如mamad
　　第一次交换 ad : mamda
　　第二次交换 md : madma
　　第三次交换 ma : madam (回文！完美！)
输入格式
　　第一行是一个整数N，表示接下来的字符串的长度(N <= 8000)
　　第二行是一个字符串，长度为N.只包含小写字母
输出格式
　　如果可能，输出最少的交换次数。
　　否则输出Impossible
样例输入
5
mamad
样例输出
3
```

```java
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        while (scanner.hasNext()) {
            int n = Integer.parseInt(scanner.nextLine());

            String str = scanner.nextLine();
            char[] chs = str.toCharArray();

            int[] count = new int[26];
            char ch = '0';
            int oddchar = 0;

            for (int j = 0; j < chs.length; j++) {
                int index = chs[j] - 'a';
                count[index]++;
            }

            for (int i = 0; i < 26; i++) {
                if (count[i] % 2 != 0) {
                    oddchar++;
                    ch = (char) (i + 'a');
                }
            }

            if (oddchar > 1) {
                System.out.println("Impossible");
            } else {
                int result = exchange(chs, n, ch);
                System.out.println(result);
            }
        }
    }

    private static int exchange(char[] chs, int n, char ch) {
        int count = 0, i, j, k;
        for (i = 0; i < n / 2; i++) {
            if (chs[i] == ch) {
                for (j = i; j < n - i - 1; j++) {
                    if (chs[j] == chs[n - i - 1]) {
                        break;
                    }
                }

                count += j - i;

                for (k = j; k > i; k--) {
                    chs[k] = chs[k - 1];
                }
                chs[i] = chs[n - i - 1];

            } else {
                for (j = n - i - 1; j >= i; j--) {
                    if (chs[j] == chs[i]) {
                        break;
                    }
                }

                count += n - i - 1 - j;

                for (k = j; k < n - i - 1; k++) {
                    chs[k] = chs[k + 1];
                }
                chs[n - i - 1] = chs[i];
            }
        }
        return count;
    }
}
```


### BASIC-18 矩形面积交

```
问题描述
　　平面上有两个矩形，它们的边平行于直角坐标系的X轴或Y轴。对于每个矩形，我们给出它的一对相对顶点的坐标，请你编程算出两个矩形的交的面积。
输入格式
　　输入仅包含两行，每行描述一个矩形。
　　在每行中，给出矩形的一对相对顶点的坐标，每个点的坐标都用两个绝对值不超过10^7的实数表示。
输出格式
　　输出仅包含一个实数，为交的面积，保留到小数后两位。
样例输入
1 1 3 3
2 2 4 4
样例输出
1.00
```

```java
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        double[] area1 = new double[4];
        double[] area2 = new double[4];

        for(int i = 0;i < 4;i++){
            area1[i] = in.nextDouble();
        }
        for(int j = 0;j < 4;j++){
            area2[j] = in.nextDouble();
        }

        double[] z = new double[4];
        // x1
        z[0] = Math.max(Math.min(area1[0],area1[2]),Math.min(area2[0],area2[2]));
        // y1
        z[1] = Math.max(Math.min(area1[1],area1[3]),Math.min(area2[1],area2[3]));
        // x2
        z[2] = Math.min(Math.max(area1[0],area1[2]),Math.max(area2[0],area2[2]));
        // y2
        z[3] = Math.min(Math.max(area1[1],area1[3]),Math.max(area2[1],area2[3]));

        if(z[3]>z[1] && z[2]>z[0]){
            double sum = (z[2] - z[0]) * (z[3] - z[1]);
            System.out.println(String.format("%.2f",sum));
        }else{
            System.out.println("0.00");
        }
    }
}
```

### BASIC-17 矩阵乘法

```
问题描述
　　给定一个N阶矩阵A，输出A的M次幂（M是非负整数）
　　例如：
　　A =
　　1 2
　　3 4
　　A的2次幂
　　7 10
　　15 22
输入格式
　　第一行是一个正整数N、M（1<=N<=30, 0<=M<=5），表示矩阵A的阶数和要求的幂数
　　接下来N行，每行N个绝对值不超过10的非负整数，描述矩阵A的值
输出格式
　　输出共N行，每行N个整数，表示A的M次幂所对应的矩阵。相邻的数之间用一个空格隔开
样例输入
2 2
1 2
3 4
样例输出
7 10
15 22
```

```java
import java.util.Scanner;

public class Main {
    /**
     *
     * 1 2 3
     * 3 4 4
     * 5 6 7
     * a[0][0] * a[0][0] + a[0][1] * a[1][0] + a[0][2] * a[2][0]
     * a[0][0] * a[0][1] + a[0][1] * a[1][1] + a[0][2] * a[2][1]
     * a[0][0] * a[0][2] + a[0][1] * a[1][2] + a[0][2] * a[2][2]
     * a[1][0]*a[0][0] + a[1][1] * a[1][0]
     * a[1][0]*a[0][1] + a[1][1] * a[1][1]
     *
     *
     */

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int m = in.nextInt();
        int[][] matrix = new int[n][n];
        int[][] temp = new int[n][n];
        int[][] b = new int[n][n];

        for(int a = 0;a < n;a++){
            for(int c = 0;c < n;c++){
                matrix[a][c] = in.nextInt();
                temp[a][c] = matrix[a][c];
            }
        }

        // 考虑m=0的情况
        if(m==0){
            for(int i = 0;i < n;i++){
                for(int j = 0;j < n;j++){
                    if(i!=j){
                        System.out.print("0 ");
                    }else{
                        System.out.print("1 ");
                    }
                }
                System.out.println("");
            }
            return;
        }

        for(int k = 0;k < m-1;k++){

            for(int i = 0;i < n;i++){
                for(int j = 0;j < n;j++){
                    // 总共有几项相加
                    int c = n;
                    while (c>0){
                        b[i][j] += temp[i][c-1] * matrix[c-1][j];
                        c--;
                    }

                }
            }

            for(int i = 0;i < n;i++){
                for(int j = 0;j < n;j++){
                    // 将前面计算出的矩阵合成
                    temp[i][j] = b[i][j];
                    b[i][j] = 0;
                }
            }


        }

        for(int i = 0;i < n;i++){
            for(int j = 0;j < n;j++){
                System.out.print(temp[i][j]+" ");
            }
            System.out.println("");

        }
    }
}
```



### BASIC-14 时间转换

```
问题描述
　　给定一个以秒为单位的时间t，要求用“<H>:<M>:<S>”的格式来表示这个时间。<H>表示时间，<M>表示分钟，而<S>表示秒，它们都是整数且没有前导的“0”。例如，若t=0，则应输出是“0:0:0”；若t=3661，则输出“1:1:1”。
输入格式
　　输入只有一行，是一个整数t（0<=t<=86399）。
输出格式
　　输出只有一行，是以“<H>:<M>:<S>”的格式所表示的时间，不包括引号。
样例输入
0
样例输出
0:0:0
样例输入
5436
样例输出
1:30:36
```

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int sum = in.nextInt();

        int hour = sum /3600;
        int minute = (sum - hour * 3600) /60;
        int second = sum - hour*3600 - minute*60;

        System.out.println(hour+":"+minute+":"+second);

    }
}
```

### BASIC-15 字符串对比

```
问题描述
　　给定两个仅由大写字母或小写字母组成的字符串(长度介于1到10之间)，它们之间的关系是以下4中情况之一：
　　1：两个字符串长度不等。比如 Beijing 和 Hebei
　　2：两个字符串不仅长度相等，而且相应位置上的字符完全一致(区分大小写)，比如 Beijing 和 Beijing
　　3：两个字符串长度相等，相应位置上的字符仅在不区分大小写的前提下才能达到完全一致（也就是说，它并不满足情况2）。比如 beijing 和 BEIjing
　　4：两个字符串长度相等，但是即使是不区分大小写也不能使这两个字符串一致。比如 Beijing 和 Nanjing
　　编程判断输入的两个字符串之间的关系属于这四类中的哪一类，给出所属的类的编号。
输入格式
　　包括两行，每行都是一个字符串
输出格式
　　仅有一个数字，表明这两个字符串的关系编号
样例输入
BEIjing
beiJing
样例输出
3
```

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String str = in.next();
        String str2 = in.next();
        char[] strArr = str.toCharArray();

        if(str.length() != str2.length()){
            System.out.println(1);
            return;
        }else{
            if(str.equals(str2)){
                // 情况2
                System.out.println(2);
                return;
            }
            if(str.toLowerCase().equals(str2.toLowerCase())){
                System.out.println(3);
            }else{
                System.out.println(4);
            }
        }
    }
}
```

### BASIC-16 分解质因数

```
问题描述
　　求出区间[a,b]中所有整数的质因数分解。
输入格式
　　输入两个整数a，b。
输出格式
　　每行输出一个数的分解，形如k=a1*a2*a3...(a1<=a2<=a3...，k也是从小到大的)(具体可看样例)
样例输入
3 10
样例输出
3=3
4=2*2
5=5
6=2*3
7=7
8=2*2*2
9=3*3
10=2*5
提示
　　先筛出所有素数，然后再分解。
数据规模和约定
　　2<=a<=b<=10000
```

```java
import java.util.Scanner;

public class Main {
    public static void fenjie(int num){
        for(int i = 2;i <= num;i++){
            if(i == num){
                System.out.print(i);
                return;
            }
            if(num>i && (num%i==0)){
                System.out.print(i+"*");
                fenjie(num/i);
                break;
            }
        }

    }
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int left = in.nextInt();
        int right = in.nextInt();


        for(int i = left;i <= right;i++){
            System.out.print(i+"=");
            fenjie(i);
            System.out.println("");
        }
    }
}
```

## 算法训练

### ALGO-1 区间k大数查询

```
问题描述
给定一个序列，每次询问序列中第l个数到第r个数中第K大的数是哪个。

输入格式
第一行包含一个数n，表示序列长度。

第二行包含n个正整数，表示给定的序列。

第三个包含一个正整数m，表示询问个数。

接下来m行，每行三个数l,r,K，表示询问序列从左往右第l个数到第r个数中，从大往小第K大的数是哪个。序列元素从1开始标号。

输出格式
总共输出m行，每行一个数，表示询问的答案。
样例输入
5
1 2 3 4 5
2
1 5 2
2 3 2
样例输出
4
2
数据规模与约定
对于30%的数据，n,m<=100；

对于100%的数据，n,m<=1000；

保证k<=(r-l+1)，序列中的数<=106。
```

```java
import java.util.Arrays;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int[] arr = new int[n];
        int[] arrOld = new int[n];
        for(int i = 0;i < n;i++){
            arr[i] = in.nextInt();
            arrOld[i] = arr[i];
        }
        int m = in.nextInt();

        int[] result = new int[m];
        for(int i = 0;i < m;i++){
            int first = in.nextInt();
            int last = in.nextInt();
            int index = in.nextInt();
            int[] newArr;
            newArr = Arrays.copyOfRange(arr,first-1,last);
            arrSort(newArr);
            result[i] = newArr[index-1];
        }

        for(int i = 0;i < result.length;i++){
            System.out.println(result[i]);
        }
    }
    // 冒泡排序
    public static void arrSort(int[] arr){
        for(int i = 0;i < arr.length;i++){
            for(int j = i+1;j < arr.length;j++){
                if(arr[i]<arr[j]){
                    int temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }

    }
}
```

### ALGO-2  最大最小公倍数

```
问题描述
已知一个正整数N，问从1~N中任选出三个数，他们的最小公倍数最大可以为多少。

输入格式
输入一个正整数N。

输出格式
输出一个整数，表示你找到的最小公倍数。
样例输入
9
样例输出
504
数据规模与约定
1 <= N <= 106。
```


```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        long n = in.nextInt();
        long result = 0;
        if(n<=2){
            // 2
            result = n;
        }else if(n%2 == 1){
            // 3
            result = n*(n-1)*(n-2);
        }else if(n%3 == 0){
            // 6 5 4 3 2 1
            result = (n-1)*(n-2)*(n-3);
        }else{
            // 8 7 6 5 4 3 2 1
            result = n*(n-1)*(n-3);
        }
        System.out.println(result);
    }
}
```

### ALGO-3  K好数

```
问题描述
如果一个自然数N的K进制表示中任意的相邻的两位都不是相邻的数字，那么我们就说这个数是K好数。求L位K进制数中K好数的数目。例如K = 4，L = 2的时候，所有K好数为11、13、20、22、30、31、33 共7个。由于这个数目很大，请你输出它对1000000007取模后的值。

输入格式
输入包含两个正整数，K和L。

输出格式
输出一个整数，表示答案对1000000007取模后的值。
样例输入
4 2
样例输出
7
数据规模与约定
对于30%的数据，KL <= 106；

对于50%的数据，K <= 16， L <= 10；

对于100%的数据，1 <= K,L <= 100。
```


```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int k = in.nextInt();
        int l = in.nextInt();
        int num[][] = new int[l][k];

        for(int i = 0;i < k;i++){
            num[0][i] = 1;
        }

        for(int i = 1;i < l;i++){
            for(int j = 0;j < k;j++){
                for(int x = 0;x < k;x++){
                    if (x!=j-1&&x!=j+1) {
                        num[i][j] += num[i-1][x];
                        num[i][j] %= 1000000007;
                    }
                }
            }
        }

        int output = 0;
        for(int i = 1;i < k;i++){
            output += num[l-1][i];
            output %= 1000000007;
        }
        System.out.println(output);

    }
}
```

### ALGO-4  结点选择

```
问题描述
有一棵 n 个节点的树，树上每个节点都有一个正整数权值。如果一个点被选择了，那么在树上和它相邻的点都不能被选择。求选出的点的权值和最大是多少？

输入格式
第一行包含一个整数 n 。

接下来的一行包含 n 个正整数，第 i 个正整数代表点 i 的权值。

接下来一共 n-1 行，每行描述树上的一条边。

输出格式
输出一个整数，代表选出的点的权值和的最大值。
样例输入
5
1 2 3 4 5
1 2
1 3
2 4
2 5
样例输出
12
样例说明
选择3、4、5号点，权值和为 3+4+5 = 12 。
数据规模与约定
对于20%的数据， n <= 20。

对于50%的数据， n <= 1000。

对于100%的数据， n <= 100000。

权值均为不超过1000的正整数。
```

```java

```

### ALGO-42 送分啦

```
问题描述
　　这题想得分吗？想，请输出“yes”；不想，请输出“no”。
输出格式
　　输出包括一行，为“yes”或“no”。
```

```java
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        System.out.println("yes");
    }
}
```



### ALGO-90 出现次数最多的整数

```
　　﻿问题描述
　　编写一个程序，读入一组整数，这组整数是按照从小到大的顺序排列的，它们的个数N也是由用户输入的，最多不会超过20。然后程序将对这个数组进行统计，把出现次数最多的那个数组元素值打印出来。如果有两个元素值出现的次数相同，即并列第一，那么只打印比较小的那个值。
　　输入格式：第一行是一个整数N，N £ 20；接下来有N行，每一行表示一个整数，并且按照从小到大的顺序排列。
　　输出格式：输出只有一行，即出现次数最多的那个元素值。
输入输出样例
样例输入
5
100
150
150
200
250
样例输出
150
```

```java
import java.util.Arrays;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        if(n <= 0){
            return;
        }
        int[] num = new int[n];
        int[] arr = new int[1000];

        for(int i = 0;i < n;i++){
            num[i] = in.nextInt();
            arr[num[i]]++;
        }
        Arrays.sort(num);

        int min = num[0];
        int max = num[n-1];
        int temp = arr[min];
        int index = min;
        for(int i = min;i <= max;i++){
            if(arr[i]>temp){
                temp = arr[i];
                index = i;
            }
        }

        System.out.println(index);

    }


}
```




### ALGO-84 大小写转换

```
问题描述
　　编写一个程序，输入一个字符串（长度不超过20），然后把这个字符串内的每一个字符进行大小写变换，即将大写字母变成小写，小写字母变成大写，然后把这个新的字符串输出。
　　输入格式：输入一个字符串，而且这个字符串当中只包含英文字母，不包含其他类型的字符，也没有空格。
　　输出格式：输出经过转换后的字符串。
输入输出样例
样例输入
AeDb
样例输出
aEdB
```

```java
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String str = in.next();
        char[] strArr = str.toCharArray();

        for(int i = 0;i < strArr.length;i++){
            int ascii = (int)strArr[i];
            if(ascii >= 97 && ascii <= 122){
                // 小写
                ascii-=32;
            }else if(ascii >= 65 && ascii <= 90){
                // 大写
                ascii+=32;
            }
            System.out.print((char) ascii);
        }
    }
}
```


### ALGO-87  字串统计

```
问题描述
　　给定一个长度为n的字符串S，还有一个数字L，统计长度大于等于L的出现次数最多的子串（不同的出现可以相交），如果有多个，输出最长的，如果仍然有多个，输出第一次出现最早的。
输入格式
　　第一行一个数字L。
　　第二行是字符串S。
　　L大于0，且不超过S的长度。
输出格式
　　一行，题目要求的字符串。

　　输入样例1：
　　4
　　bbaabbaaaaa

　　输出样例1：
　　bbaa

　　输入样例2：
　　2
　　bbaabbaaaaa

　　输出样例2：
　　aa
数据规模和约定
　　n<=60
　　S中所有字符都是小写英文字母。
提示
　　枚举所有可能的子串，统计出现次数，找出符合条件的那个
```

```java
import java.util.Arrays;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int L = in.nextInt();
        String S = in.next();

        if(L <=0 || L>S.length()){
            return;
        }

        int num = -1;
        String str = "";
        String temp = "";
        for(int k=0;k<S.length()-L;k++) {
            int l=L+k;
            for(int i=0;i<S.length()-l;i++) {
                temp=S.substring(i, i+l);
                int count=0;
                for(int j=0;j<S.length()-l;j++) {
                    if(temp.equals(S.substring(j, j+l)))
                        count++;
                }
                if(num<=count) {
                    if(num==count) {
                        if(str.length()<temp.length())
                            str=temp;
                    }
                    else {
                        num=count;
                        str=temp;
                    }
                }
            }
        }
        System.out.println(str);
    }
}
```




### ALGO-95 2的次幂表示

```
问题描述
　　任何一个正整数都可以用2进制表示，例如：137的2进制表示为10001001。
　　将这种2进制表示写成2的次幂的和的形式，令次幂高的排在前面，可得到如下表达式：137=2^7+2^3+2^0
　　现在约定幂次用括号来表示，即a^b表示为a（b）
　　此时，137可表示为：2（7）+2（3）+2（0）
　　进一步：7=2^2+2+2^0 （2^1用2表示）
　　3=2+2^0
　　所以最后137可表示为：2（2（2）+2+2（0））+2（2+2（0））+2（0）
　　又如：1315=2^10+2^8+2^5+2+1
　　所以1315最后可表示为：
　　2（2（2+2（0））+2）+2（2（2+2（0）））+2（2（2）+2（0））+2+2（0）
输入格式
　　正整数（1<=n<=20000）
输出格式
　　符合约定的n的0，2表示（在表示中不能有空格）
样例输入
137
样例输出
2(2(2)+2+2(0))+2(2+2(0))+2(0)
样例输入
1315
样例输出
2(2(2+2(0))+2)+2(2(2+2(0)))+2(2(2)+2(0))+2+2(0)
提示
　　用递归实现会比较简单，可以一边递归一边输出
```

```java

```

### ALGO-97 排序

```
问题描述
　　编写一个程序，输入3个整数，然后程序将对这三个整数按照从大到小进行排列。
　　输入格式：输入只有一行，即三个整数，中间用空格隔开。
　　输出格式：输出只有一行，即排序后的结果。
　　输入输出样例
样例输入
9 2 30
样例输出
30 9 2
```

```java
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int[] arr = new int[3];

        for(int i = 0;i < arr.length;i++){
            arr[i] = in.nextInt();
        }

        for(int i = 0;i < arr.length;i++){
            for(int j = i+1;j < arr.length;j++){
                if(arr[i]<arr[j]){
                    int temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }

        for(int i = 0;i < arr.length;i++){
            System.out.print(arr[i]+" ");
        }


    }
}
```



### ALGO-101 图形显示

```
问题描述
　　编写一个程序，首先输入一个整数，例如5，然后在屏幕上显示如下的图形（5表示行数）：
　　* * * * *
　　* * * *
　　* * *
　　* *
　　*
```

```java
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int row = in.nextInt();
        for(int i = 1;i <= row;i++){
            for(int j = 0;j < row-i+1;j++){
                System.out.print("* ");
            }
            System.out.println("");
        }
    }
}
```



### ALGO-156 表达式计算

```
问题描述
　　输入一个只包含加减乖除和括号的合法表达式，求表达式的值。其中除表示整除。
输入格式
　　输入一行，包含一个表达式。
输出格式
　　输出这个表达式的值。
样例输入
1-2+3*(4-5)
样例输出
-4
数据规模和约定
　　表达式长度不超过100，表达式运算合法且运算过程都在int内进行。
```


```java

```





## 历届试题

### PREV-1  核桃的数量

```
问题描述
小张是软件项目经理，他带领3个开发组。工期紧，今天都在加班呢。为鼓舞士气，小张打算给每个组发一袋核桃（据传言能补脑）。他的要求是：

1. 各组的核桃数量必须相同

2. 各组内必须能平分核桃（当然是不能打碎的）

3. 尽量提供满足1,2条件的最小数量（节约闹革命嘛）

输入格式
输入包含三个正整数a, b, c，表示每个组正在加班的人数，用空格分开（a,b,c<30）
输出格式
输出一个正整数，表示每袋核桃的数量。
样例输入1
2 4 5
样例输出1
20
样例输入2
3 1 1
样例输出2
3
```

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int a = in.nextInt();
        int b = in.nextInt();
        int c = in.nextInt();

        int result = 0;
        for(int i = 1;i < 100;i++){
            if(i%a == 0 && i%b == 0 && i%c == 0){
                result=i;
                break;
            }
        }
        System.out.println(result);
    }


}
```



### PREV-2  打印十字图

```
问题描述
小明为某机构设计了一个十字型的徽标（并非红十字会啊），如下所示：

..$$$$$$$$$$$$$..
..$...........$..
$$$.$$$$$$$$$.$$$
$...$.......$...$
$.$$$.$$$$$.$$$.$
$.$...$...$...$.$
$.$.$$$.$.$$$.$.$
$.$.$...$...$.$.$
$.$.$.$$$$$.$.$.$
$.$.$...$...$.$.$
$.$.$$$.$.$$$.$.$
$.$...$...$...$.$
$.$$$.$$$$$.$$$.$
$...$.......$...$
$$$.$$$$$$$$$.$$$
..$...........$..
..$$$$$$$$$$$$$..
对方同时也需要在电脑dos窗口中以字符的形式输出该标志，并能任意控制层数。

输入格式
一个正整数 n (n<30) 表示要求打印图形的层数。
输出格式
对应包围层数的该标志。
样例输入1
1
样例输出1
..$$$$$..
..$...$..
$$$.$.$$$
$...$...$
$.$$$$$.$
$...$...$
$$$.$.$$$
..$...$..
..$$$$$..
样例输入2
3
样例输出2
..$$$$$$$$$$$$$..
..$...........$..
$$$.$$$$$$$$$.$$$
$...$.......$...$
$.$$$.$$$$$.$$$.$
$.$...$...$...$.$
$.$.$$$.$.$$$.$.$
$.$.$...$...$.$.$
$.$.$.$$$$$.$.$.$
$.$.$...$...$.$.$
$.$.$$$.$.$$$.$.$
$.$...$...$...$.$
$.$$$.$$$$$.$$$.$
$...$.......$...$
$$$.$$$$$$$$$.$$$
..$...........$..
..$$$$$$$$$$$$$..
提示
请仔细观察样例，尤其要注意句点的数量和输出位置。
```

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        int low,row,center;
        low = row = 4*(n-1)+9;
        int [][]array = new int[low][row];

        for(int i = 0;i < low;i++){
            for(int j = 0;j < row;j++){
                array[i][j] = '.';
            }
        }
        center = row/2;
        for(int i = center-2;i <= center+2;i++){
            array[center][i] = '$';
            array[i][center] = '$';
        }
        for(int m = 0;m < n;m++){
            for(int i = center-2-2*m;i < (center+3+2*m);i++){
                array[center-(4+m*2)][i] = '$';
                array[center+(4+m*2)][i] = '$';
                array[i][center-(4+m*2)] = '$';
                array[i][center+(4+m*2)] = '$';
            }
        }

        for(int m = 0;m < n;m++){
            for(int i = center-3-2*m;i <= center+3+2*m;i++){
                array[center-(2+2*m)][i] = '$';
                array[center+(2+2*m)][i] = '$';
                array[i][center-(2+2*m)] = '$';
                array[i][center+(2+2*m)] = '$';
            }
            array[center-(2+2*m)][center-(1+2*m)] = '.';
            array[center-(2+2*m)][center+(1+2*m)] = '.';
            array[center-(1+2*m)][center-(2+2*m)] = '.';
            array[center-(1+2*m)][center+(2+2*m)] = '.';
            array[center+(1+2*m)][center-(2+2*m)] = '.';
            array[center+(1+2*m)][center+(2+2*m)] = '.';
            array[center+(2+2*m)][center-(1+2*m)] = '.';
            array[center+(2+2*m)][center+(1+2*m)] = '.';
        }

        for(int i = 0;i < low;i++){
            for(int j = 0;j < row;j++){
                System.out.print((char)array[i][j]);
            }
            System.out.println("");
        }
    }
}
```

### PREV-3  带分数

```
问题描述
100 可以表示为带分数的形式：100 = 3 + 69258 / 714。

还可以表示为：100 = 82 + 3546 / 197。

注意特征：带分数中，数字1~9分别出现且只出现一次（不包含0）。

类似这样的带分数，100 有 11 种表示法。

输入格式
从标准输入读入一个正整数N (N<1000*1000)

输出格式
程序输出该数字用数码1~9不重复不遗漏地组成带分数表示的全部种数。

注意：不要求输出每个表示，只统计有多少表示法！

样例输入1
100
样例输出1
11
样例输入2
105
样例输出2
6
```

```java

```

-------------------------------




# 剑指Offer


## 二维数组中的查找

```
在一个二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。
4 4
1 2 8 9
2 4 9 12
4 7 10 13
6 8 11 15
7
true
```


```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int row = in.nextInt();
        int column = in.nextInt();
        int[][] arr = new int[row][column];

        for(int i = 0;i < row;i++){
            for(int j = 0;j < column;j++){
                arr[i][j] = in.nextInt();
            }
        }

        int target = in.nextInt();

        boolean flag = Find(target,arr);
        System.out.println(flag);

    }

    public static boolean Find(int target, int [][] array){
        int rows = array.length;
        int columns = array[0].length;
        boolean found = false;

        if (rows>0 && columns >0) {
            int row = 0;
            int column = columns - 1;
            while (row < rows && column >= 0){
                if(array[row][column] == target){
                    found = true;
                    break;
                }else if(array[row][column]>target){
                    column--;
                }else {
                    row++;
                }
            }
        }
        return found;
    }
}
```


## 替换空格

```
请实现一个函数，将一个字符串中的空格替换成“%20”。例如，当字符串为We Are Happy.则经过替换之后的字符串为We%20Are%20Happy。
```

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        StringBuffer s1 = new StringBuffer(in.next());
        System.out.println(replaceSpace(s1));

    }
    public static String replaceSpace(StringBuffer str) {
        String s = str.toString();
        return s.replaceAll(" ","%20");
    }
}
```

## 从尾到头打印链表

```
输入一个链表，从尾到头打印链表每个节点的值。
```

```java
// 法一：
/**
*    public class ListNode {
*        int val;
*        ListNode next = null;
*
*        ListNode(int val) {
*            this.val = val;
*        }
*    }
*
*/
import java.util.ArrayList;
public class Solution {
    ArrayList<Integer> arrayList = new ArrayList<Integer>();
    public ArrayList<Integer> printListFromTailToHead(ListNode listNode) {
        if(listNode!=null){
            this.printListFromTailToHead(listNode.next);
            arrayList.add(listNode.val);
        }
        return arrayList;

    }
}

// 法二：
/**
*    public class ListNode {
*        int val;
*        ListNode next = null;
*
*        ListNode(int val) {
*            this.val = val;
*        }
*    }
*
*/
import java.util.ArrayList;
import java.util.Stack;
public class Solution {
    public ArrayList<Integer> printListFromTailToHead(ListNode listNode) {
        Stack<Integer> stack = new Stack<>();
        while (listNode!=null){
            stack.push(listNode.val);
            listNode = listNode.next;
        }
        ArrayList<Integer> list = new ArrayList<>();
        while (!stack.isEmpty()){
            list.add(stack.pop());
        }
        return list;

    }
}
```


## 重建二叉树

```
输入某二叉树的前序遍历和中序遍历的结果，请重建出该二叉树。假设输入的前序遍历和中序遍历的结果中都不含重复的数字。例如输入前序遍历序列{1,2,4,7,3,5,6,8}和中序遍历序列{4,7,2,1,5,3,8,6}，则重建二叉树并返回。
```

```java
/**
 * Definition for binary tree
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
import java.util.Arrays;
public class Solution {
    public TreeNode reConstructBinaryTree(int[] pre,int[] in){
       if(pre.length == 0||in.length == 0){
            return null;
        }
        TreeNode node = new TreeNode(pre[0]);
        for(int i = 0; i < in.length; i++){
            if(pre[0] == in[i]){
                node.left = reConstructBinaryTree(Arrays.copyOfRange(pre, 1, i+1), Arrays.copyOfRange(in, 0, i));
                node.right = reConstructBinaryTree(Arrays.copyOfRange(pre, i+1, pre.length), Arrays.copyOfRange(in, i+1,in.length));
            }
        }
        return node;
    }
}
```

## 用两个栈实现队列
```
用两个栈来实现一个队列，完成队列的Push和Pop操作。 队列中的元素为int类型。
```

```java
import java.util.Stack;

public class Solution {
    Stack<Integer> stack1 = new Stack<Integer>();
    Stack<Integer> stack2 = new Stack<Integer>();

    public void push(int node){
        stack1.push(node);
    }
    public int pop(){
        while (!stack1.empty()){
            stack2.push(stack1.pop());
        }
        int first = stack2.pop();
        // 再压回来
        while (!stack2.empty()){
            stack1.push(stack2.pop());
        }
        return first;
    }
}
```

## 旋转数组的最小数字

```
把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转。
输入一个非递减排序的数组的一个旋转，输出旋转数组的最小元素。
例如数组{3,4,5,1,2}为{1,2,3,4,5}的一个旋转，该数组的最小值为1。
NOTE：给出的所有元素都大于0，若数组大小为0，请返回0。
```

```java
// 二分法
public static int minNumberInRotateArray(int[] array){
    int low = 0;
    int high = array.length - 1;
    int mid = low;
    while (low < high){
        if(high - low == 1){
            mid = high;
            break;
        }
        mid = (low+high) / 2;
        if(array[mid] >= array[low]){
            low = mid;
        }else if(array[mid] <= array[high]){
            high = mid;
        }
    }
    return array[mid];
}
```


## 斐波那契数列

```
大家都知道斐波那契数列，现在要求输入一个整数n，请你输出斐波那契数列的第n项。
n<=39
```

```java
public int Fibonacci(int n) {
    int[] result = {0,1};
    if(n<2){
        return result[n];
    }
    int fibNMinuxOne = 0;
    int fibNMinuxTwo = 1;
    int sum = 0;
    for(int i = 2;i <= n;i++){
        sum = fibNMinuxOne + fibNMinuxTwo;
        fibNMinuxOne = fibNMinuxTwo;
        fibNMinuxTwo = sum;
    }
    return sum;
}
```

## 互联网公司面试笔试题

```
(2012年腾讯实习生笔试 加分题)
给定一数组a[N]，我们希望构造数组b [N]，其中b[j]=a[0]*a[1]…a[N-1] / a[j]，在构造过程中，不允许使用除法：

要求O（1）空间复杂度和O（n）的时间复杂度；
除遍历计数器与a[N] b[N]外，不可使用新的变量（包括栈临时变量、堆空间和全局静态变量等）；
实现程序（主流编程语言任选）实现并简单描述。
```

```java
public class Main {

    public static void main(String[] args) {
        /*
        b[0] = a[1] * a[2] * a[3] * a[4]
        b[1] = a[0] * a[2] * a[3] * a[4]
        b[2] = a[0] * a[1] * a[3] * a[4]
        b[3] = a[0] * a[1] * a[2] * a[4]
        b[4] = a[0] * a[1] * a[2] * a[3]
         */
        final int MAX = 5;
        int[] a = {1,2,3,4,5};
        int[] b = new int[MAX];
        b[0] = 1;

        System.out.println("数组A:");
        printArr(a,MAX);

        /*
        b[0] = 1
        b[1] = a[0]
        b[2] = a[0] * a[1]
        b[3] = a[0] * a[1] * a[2]
        b[4] = a[0] * a[1] * a[2] * a[3]
         */
        for(int i = 1;i < MAX;i++){
            b[i] = b[i-1] * a[i-1];
        }

        /*
        b[4] = b[4] * b[0] = a[0]*a[1]*a[2]*a[3], b[0] = a[4]
        b[3] = b[3] * b[0] = a[0]*a[1]*a[2]*a[4], b[0] = a[4]*a[3]
        b[2] = b[2] * b[0] = a[0]*a[1]*a[3]*a[4], b[0] = a[4]*a[3]*a[2]
        b[1] = b[1] * b[0] = a[0]*a[2]*a[3]*a[4]

         */
        for(int i = MAX - 1;i >= 1;i--){
            b[i] *= b[0];
            b[0] *= a[i];
        }

        System.out.println("数组B: ");
        printArr(b,MAX);


    }
    public static void printArr(int[] arr,int MAX){
        for(int i=0;i<MAX;i++){
            System.out.print(arr[i]+" ");
        }
        System.out.println();
    }
}
```

```
构造回文
题目描述

给定一个字符串s，你可以从中删除一些字符，使得剩下的串是一个回文串。如何删除才能使得回文串最长呢？输出需要删除的字符个数。
输入描述:输入数据有多组，每组包含一个字符串s，且保证:1<=s.length<=1000.
输出描述:对于每组数据，输出一个整数，代表最少需要删除的字符个数。
输入例子:
abcdagoogle+

输出例子:
22
```

```java
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        Scanner in  = new Scanner(System.in);
        while (in.hasNext()){
            String str = in.next();
            String reStr = new StringBuffer(str).reverse().toString();
            char[] c1 = str.toCharArray();
            char[] c2 = reStr.toCharArray();
            int n = str.length();
            int[][] dp = new int[n+1][n+1];

            for(int i = 0;i < n;i++){
                for(int j = 0;j < n;j++){
                    if(c1[i] == c2[j]){
                        dp[i+1][j+1] = dp[i][j] + 1;
                    }else{
                        dp[i+1][j+1] = Math.max(dp[i][j+1],dp[i+1][j]);
                    }

                }
            }
            System.out.println(n - dp[n][n]);

        }


    }



}

```
