# Mobile

<!-- challenge-index: f7a416bb463999d1 -->

| Challenge | Topic |
| --- | --- |
| [Quiz (100 pts)](https://github.com/intigriti/CTF/blob/main/2024/mobile/Quiz/solution/writeup%20(Mogfrat).pdf "Official solution") | Android APK, Quiz Validation |
| [Where's my APK? (499 pts) 🥉](#wheres-my-apk-499-pts) | Android App Bundle, Flutter |

*Links to GitHub open the challenge authors’ official solutions.*

<!-- /challenge-index -->

## Where's my APK? (499 pts)

### Description

Can you achieve a leet download speed?

* Note 1: Flag is not in the usual format.&#x20;
* Note 2: Only non password protected files can be opened with the app.

### Solution

Given .aab file, through googling i found a way to convert it to a single APK

* <https://stackoverflow.com/a/68752831>

```bash
brew install bundletool
bundletool build-apks --mode universal --bundle ./app-release.aab --output ./app.apks
mv app.apks app.zip
unzip app.zip
```

Through decompiling using apktool, i found that this APK is using flutter.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F7GFbObMkv7gNBW0n0403%2Fimage.png?alt=media&amp;token=441d8876-8583-4605-96b1-58bfcb7cedd2" alt=""><figcaption></figcaption></figure>

So the source code will not be in .dex file, it shuold be in libapp.so. Previously i've been read some article regarding flutter reverse engineering and i found that this tools is very useful.

* <https://github.com/worawit/blutter>

So lets use blutter on our target

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FwxnMLK6DhDUeYe9jkV86%2Fimage.png?alt=media&amp;token=61f2b4c0-0e37-4f4f-8fa4-1aea1749d0c8" alt=""><figcaption></figcaption></figure>

Now we have some information about the target. In this case i use ida script to recover the function name and object pool. Do a little modify to make the script work fully

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FcNPQteIlsg51mWk5ExG6%2Fimage.png?alt=media&amp;token=c0d64806-649b-4911-94d9-a347b547de01" alt=""><figcaption></figcaption></figure>

* change # to any value (for example \_)

After that load the script and we will see almost all functions are renamed. Lets filter the function name with cybersharing.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fr6T0H8fZFeBa3NquR2Hv%2Fimage.png?alt=media&amp;token=8a1bc4c0-41c7-413a-8ceb-73d3de4179cb" alt=""><figcaption></figcaption></figure>

Back to the application, we need to find some string to get the reference.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F424NgAZMuVVB2M88f4QE%2Fimage.png?alt=media&amp;token=b9b05f00-1072-4909-aaf4-40e799d64a18" alt=""><figcaption></figcaption></figure>

There is a string, so let's search it on the object pool.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FdJBWbWSPi6DSV8C3KSo9%2Fimage.png?alt=media&amp;token=57897206-5645-4589-816a-45d914fb509a" alt=""><figcaption></figcaption></figure>

Next, go the structures then ctrl+g and put the 0x7970 as the address.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FJy6x7bYcHrgp0q0ruxCK%2Fimage.png?alt=media&amp;token=2b6b0505-eb6f-48d9-a6fd-51c5383bfca6" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FsEqoAySbqlPW1l38fs57%2Fimage.png?alt=media&amp;token=eaa1f4ac-73ea-41f5-a5ad-cb04ad334dc2" alt=""><figcaption></figcaption></figure>

We can see that there is XREF, click it and we will see the code that use the value.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F4epzWO9UvHoWtom4WfDz%2Fimage.png?alt=media&amp;token=ed7d7a40-9d94-4c3d-8f37-866558dd5c5b" alt=""><figcaption></figcaption></figure>

Now the problem is, i cannot open any cybersharing.net/s/ URL with the application. So i decided to take a look on the AndroidManifest.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FWlFvQzZ4T8tvI7q9ZBct%2Fimage.png?alt=media&amp;token=1dce735d-9439-4308-872b-2873051fd4c4" alt=""><figcaption></figcaption></figure>

From AndroidManifest i tried to create a command to spawn the Activity including the data used.

```bash
adb shell am start -W \
    -c android.intent.category.BROWSABLE \
    -n com.et3rnos.cybersharing/.MainActivity \
    -d "https://cybersharing.net/s/630ca91826267dee"
```

Now i can continue the the next Activity.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FDR0bKEN7Nq6fdLjZ4xam%2Fimage.png?alt=media&amp;token=0676f3c7-f459-4bae-b2b5-7c451accede8" alt=""><figcaption></figcaption></figure>

We see some new information in current activity. Let's try to findout which function that show the current screen.

* cybersharing\_files\_\_FilesPageState::build\_1d3f30

We can confirm it by looking at the object used in the function, such as below

&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FRfQFEytDGdOYE3yLSHDb%2Fimage.png?alt=media&amp;token=ed801b25-10a6-4d78-a05f-8bc7b2444a64" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FhYIvKzD0ieZteBjidS7D%2Fimage.png?alt=media&amp;token=ffc4218f-06d3-4786-a965-7fb9435277fd" alt=""><figcaption></figcaption></figure>

Looking the code, i found something suspicious.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fnnz9ChjaqfRfBKWAcKDg%2Fimage.png?alt=media&amp;token=429ae1ca-33e3-46e1-8a6f-279557057b00" alt=""><figcaption></figcaption></figure>

We can see there is value 13371337 used as comparation which is not common. Through the analysis i conclude the logic below

* if value == 13371337
  * Show string @Obj\_0x3d60 -> WLGOOQNAWWPLSEA
* else
  * Show string \<speed> + MiB/s

Back to the challenge description, i also found that there is "leet" mentioned. So lets try to found another 13371337 value. Use search immediate value in IDA

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FmiRNktwrkoaXJCpPXQAK%2Fimage.png?alt=media&amp;token=e9eebcfb-89bd-4eb5-8051-f18dbca20909" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FU8NHZcTBd516E0JUzBOM%2Fimage.png?alt=media&amp;token=c3caa657-d607-46ff-a909-9f70e5951fc6" alt=""><figcaption></figcaption></figure>

There are 3 instructions that load value 13371337. Lets check each instruction

*

```
<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fsov9oewl7QGWfrm0ozAI%2Fimage.png?alt=media&amp;token=95c2ebc3-5b85-48de-be44-3fd053db8a04" alt=""><figcaption></figcaption></figure>
```

*

```
<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FBiRSLVCUbTecgwBWccS3%2Fimage.png?alt=media&amp;token=845eb88a-ba2b-4f59-805f-cc25b76a6159" alt=""><figcaption></figcaption></figure>
```

*

```
<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FGFWlryX90cP6wjvP1SQs%2Fimage.png?alt=media&amp;token=344dbfd7-6ae1-48da-86bf-182afe6aa02e" alt=""><figcaption></figcaption></figure>
```

After looking at each instruction, i've idea. The idea is patching the library so it will do the behaviour like if the value is 13371337. The easiest way to do that is by changing the B.NE to B.EQ, the problem is this is not x64 architecture so it would not that easy to change the assembly. But we've shell-storm as our savior.&#x20;

* <https://shell-storm.org/online/Online-Assembler-and-Disassembler/>

Copy the bytecode for each B.NE \<jump\_location> to the shell-storm then disassemble it.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FmY8Nqqjei6hLjrIaAVvp%2Fimage.png?alt=media&amp;token=de9bdca9-96fc-4540-996e-6dcf5d621cb8" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FzRymH9hOBeUtjqMswbj7%2Fimage.png?alt=media&amp;token=36b766ec-e0a2-4093-b110-372b8e8060b3" alt=""><figcaption></figcaption></figure>

After that copy the assembly then change from b.ne to b.eq

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F22GTC3JIu13ElhuxfdkS%2Fimage.png?alt=media&amp;token=0f49f50d-6299-4f5e-9a87-7d22c7fd1ea7" alt=""><figcaption></figcaption></figure>

Now, we've the pattern which is decrement the first byte by 1 for changing fro B.NE to B.EQ. So do that for all the rest instructions.

* &#x20;

  <figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FDLHYHw9QmbTjPMxuyKgO%2Fimage.png?alt=media&amp;token=ecd49bf2-1381-42ac-b9d6-f69f20ed68e5" alt=""><figcaption></figcaption></figure>
*

```
<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FJliIpDcB73fOcxvxYu0H%2Fimage.png?alt=media&amp;token=77e57aaf-6a9a-4957-9be2-61e3960c4447" alt=""><figcaption></figcaption></figure>
```

*

```
<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F9GNE4dM9vNYuqz9Omtym%2Fimage.png?alt=media&amp;token=d0fdb5c8-0902-490f-9172-80eaf4a1fdef" alt=""><figcaption></figcaption></figure>
```

The last step just compile the APK and sign it.

```bash
apktool b universal
cd universal/dist
uber-apk-signer --allowResign -a universal.apk
# install universal-aligned-debugSigned.apk
```

After that install the new APK and trigger the activity again.

```bash
adb shell am start -W \
    -c android.intent.category.BROWSABLE \
    -n com.et3rnos.cybersharing/.MainActivity \
    -d "https://cybersharing.net/s/630ca91826267dee"
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fhai67dZG452uoNGrWR6g%2Fimage.png?alt=media&amp;token=cad48235-ba86-49fb-8cd0-e29d2a0b3c46" alt=""><figcaption></figcaption></figure>

Now the flag will shown in the topbar.

Flag: WCLHGQOWOEQBNZALWSWDPSLQSLELA
