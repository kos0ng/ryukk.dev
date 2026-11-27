# Reverse Engineering Game Boy

Study case NCW 2022 Final (80's)

## Preface

During the competition, my team got 1st place and i got 1st blood in this challenge. It was my first time using bgb as debugger and doing debugging on game boy. In this case i do static and dynamic analysis to solve the challenge.

## Static and Dynamic Analysis

Given a game.gb file, after searching around we found that there is an emulator with a debugger feature, namely bgb.

<figure><img src="https://lh7-us.googleusercontent.com/FFfdc2R-Ycu3nkXzzdLI5BnrXlQ1xSKzSe67byp5j5dlxeyLdLHfDWRgyACnWN1OGLZq28UPdqJV_5AAW9JKYURDO1gJnhC84EurP5jw2GZizxFUBYonXQRDpH7Neek474kyh6rfngo2g_rZK7jYRLo" alt=""><figcaption></figcaption></figure>

Load the ROM, then use the debugger feature

<figure><img src="https://lh7-us.googleusercontent.com/ZkzPOJxwNH5S40Qgu21zJ5KmvEjENeN1D-QFa7cAo_gYkLNz7c5uytWR2MCFeKfD85NWGy35KcLxXcESQEpwCA7KLnUV6yUhve0pJnfySfQIvdUlbEs0JTDx-zCJaDShk1xEWMMYcG7FInybbsOgLiM" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/F_ThIP07CdM0tKWM4m8HtDQbUuokKOEJyOsvmZXwXqr59r5ofTSw2sIETsR2_6Z_5xsuKjWGvmmNpstUC925hiG1mp1yTl0VYAEu6M3O0UVaouNptjh-zF4Iu3n9kBUmGWYKL7b8GEz1RBftxtDVt5M" alt=""><figcaption></figcaption></figure>

In this case, we also use Ghidra to decompile with the support of the GhidraBoy plugin.

<figure><img src="https://lh7-us.googleusercontent.com/LYUqUYnee06XmvjYthBiHyGT2yeexUH3jZanf8PoFa0tJ9h-nVLxhbW51haxHY8fJpF6MWTduAEsUvX5abtFltEBLRoFy7BBPgW0GqozBj85-YvFE4F-wRgzSpbqzibZq6is8dI6H_6u_-ZiIC1lSnY" alt=""><figcaption></figcaption></figure>

In function 0\_200 you can see there is a string here's your secret which seems to be related to the flag. Check the initial function when loading the game

<figure><img src="https://lh7-us.googleusercontent.com/dlsnnd-I9h-GXB4SW5wk_y0kxNfJluNNgj6JxKTAq_IBN5aUJOC5ahZ6vUwWHlFXuxvlp1GCYVHjG20yxyPMobKfI1RKLwBb-0Q9rNErfbglqVByri0Zz6h3IhCSePodnZVQGJdq1DNxDn5Yrs3EwjU" alt=""><figcaption></figcaption></figure>

There are several functions and after cross checking the function reference 0472 there is a call to 0200.

<figure><img src="https://lh7-us.googleusercontent.com/KaV77duTix7CnxKrd3ar30FA_1Iwg8fp4S3i5mx1ZDLINuHPbYkPo02TF3h-rFORIj14EvH1RqRAZhMq54yq--jZHeukl7gTdvGLY-ka09AoItt83uaoB_2osVWFACP3wRkGcAsytbkv--Ak9Mvp_b8" alt=""><figcaption></figcaption></figure>

Because we don't know how to input or change the BC DE value through the game, we use the debugger to forcefully change the register value. There are several checks, namely

```
DE&0x1 != 0 
DE >= 0x20
B + 1 == 100 
C  == 100
```

And below are the appropriate values

```
DE = 0021
BC = 6463
```

<figure><img src="https://lh7-us.googleusercontent.com/oTw87wER1lKP0iZWATNKgNDEdz5AOemQQ46ZMXDS9kKSbdL6V72hZO2F-sD5_vpXK1dUP_wMslRCuDr3Zx9wCstHJfc0c1MRrj_ypIKzIMd5Qf2u88i-yno1JQHrBPrDsCTxamwdbpJtwnVJ9phrtBg" alt=""><figcaption></figcaption></figure>

Then just continue until 0200 is called and we will get the flag

<figure><img src="https://lh7-us.googleusercontent.com/GPc_RpDECeCUstWw966FbwjcxWKElNYg9tMjbL2kr2-0ROoV9OhdfIuoUtxRdNlbNxuYRJBdzBsKNdG4cP-U7WS4bQwDALHb1JWqm26vPX1MNYX28seUzs-DVb4j0fb4DD6kqWnTAuSuMg9r-CmvDuM" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/4_-OaKL9C61PBNaRWXiDic_OOdVxEr7q2DkdvW76-oVpBD3K56U0oW05w7SjiqdbUJeAIsspjGR24rk0e5DADZDYEEVQ0VdcEEqxOExfJr8QYRBr9lHg7spkTlkkWyzCm7zTkHlWa3Xr5Flj-9I2Scg" alt=""><figcaption></figcaption></figure>

Flag : NCW22{f33ls\_0ld\_y3t\_with\_g4me\_b01z80?}
