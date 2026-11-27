# Network

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>sums-up (282 pts)</td><td><a href="#sums-up-282-pts">Here</a></td></tr><tr><td>secure-communications (450 pts)</td><td><a href="#secure-communications-450-pts">Here</a></td></tr></tbody></table>

## sums-up (282 pts)

### Description

Our SOC analysts saw some strange DNS traffic. Wanted you to figure out what was exfiltated , can you check it and sum it up ?

### Solution

Given PCAP file, open it using wireshark. Looking at each packet i found suspicious printable characters.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FDxh07iHhlSsirOUDDSyg%2Fimage.png?alt=media&amp;token=733db8f1-3710-409c-8cb0-1928e4dcac2c" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FhW5zry03p8xOFNeP4nUl%2Fimage.png?alt=media&amp;token=bf344772-09ab-41a5-a126-e279f95c175c" alt=""><figcaption></figcaption></figure>

If we go to next packet we will see printable character at the same location. Those printable character are stored at Checksum identifier on each packet. To simplify the process, i apply checksum as column then export the packets.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fd7kfq0NRXCHbVPG66oBi%2Fimage.png?alt=media&amp;token=456ac37a-4b04-421c-8bfa-30c7a0c424f0" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FcGzHv8H8skimRwSImX9m%2Fimage.png?alt=media&amp;token=f323a869-8b51-460c-a431-f367c07b81e2" alt=""><figcaption></figcaption></figure>

Last, just create simple script to get the checksum value.

```python
import string

f = open("exported.csv", "r").read()
flag = b""
for i in f.split("\n"):
	try:
		flag += bytes([int(i.split('","Standard query')[0].split('"')[-1], 16)])
	except Exception as e:
		continue
print(flag)
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FnB0qHKW0u6aLvWeEoOoh%2Fimage.png?alt=media&amp;token=8e9013c4-5ee8-4138-adc9-58202aa2f14e" alt=""><figcaption></figcaption></figure>

Flag: ctf{4cp\_4nd\_4dp\_ch3cksum5\_4r3\_3v1l\_pr00v3\_m3\_wr0ng\_jhunidr}

## secure-communications (450 pts)

### Description

We captured some pretty bizzare looking communications, but part of them are encrypted.

Can you help?

Flag Format: CTF{sha256}

### Solution

Given PCAP file, open it using wireshark. We can see that there are TLS/HTTPS packets and HTTP packets.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FlryjpaPdSgEdPebKcjlX%2Fimage.png?alt=media&amp;token=5aa4b2e0-78ee-4867-ba38-816b7ea599fc" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FOJRMr2ayyosO1SMMdDhd%2Fimage.png?alt=media&amp;token=17f9b80f-02f1-4784-b61a-914ae679f567" alt=""><figcaption></figcaption></figure>

Lets take a look on one of HTTP request

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FcMAvTC0zOaVd6B6I7BSd%2Fimage.png?alt=media&amp;token=81013eb6-b42b-480a-866c-ab9ff50cf38f" alt=""><figcaption></figcaption></figure>

From HTTP request above we can see that it switch the protocol to websocket and we can see websocket packet on the same TCP stream.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FrvQ4YLkoguieELiLP0Jk%2Fimage.png?alt=media&amp;token=a669f588-2403-4f81-9b1f-78f4be1ef860" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FNIK1a6Ervq7n6W4jjFcE%2Fimage.png?alt=media&amp;token=c37de935-8b92-440f-860f-7137d764eb66" alt=""><figcaption></figcaption></figure>

Sorting the packet, i tried to inspect packet based on its kind.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FUn7b0XWTbrfLmmPD6GcF%2Fimage.png?alt=media&amp;token=edc78a26-3ecc-4c35-98ce-6a7846269e26" alt=""><figcaption></figcaption></figure>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FbECv2jDssE05D9GZzKir%2Fimage.png?alt=media&amp;token=1257f0d5-f617-40b8-9c8f-3e0ca96dd5ff" alt=""><figcaption></figcaption></figure>

There are two interesting data, private key and ssl-keys log. At first i tried to add private key but nothing happen.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FtLo3JR5SkKFvPatAaiwC%2Fimage.png?alt=media&amp;token=d0665077-fe4b-472f-aba6-014957efd645" alt=""><figcaption></figcaption></figure>

So the next step is try to add ssl-keys.log to Preferences > Protocols > TLS > (Pre)-Master-Secret log filename.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F5lOT9TSFrNoW72dG3E6k%2Fimage.png?alt=media&amp;token=15571231-806b-48a8-8882-78ec2e8253de" alt=""><figcaption></figcaption></figure>

Take a look on recorded packets again, there are some TLS packets decrypted and there is one packet (frame 1631) that consist of another part of the ssl-keys.log.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FfGhA7GH8LOf9jW8sHX8B%2Fimage.png?alt=media&amp;token=c9497308-1fae-491a-b8c3-843eb8143862" alt=""><figcaption></figcaption></figure>

Next, combine that data and store on new file (new-keys.log). After that change the (Pre)-Master-Secret log to the new new-keys.log

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FoElW042hoRbSsXq2q0Tx%2Fimage.png?alt=media&amp;token=b2db4795-5253-4044-86db-d4cfcb625511" alt=""><figcaption></figcaption></figure>

Inspecting each packet again and you'll see flag at frame 557.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FNZKHyivvZ2t9SQMtXlIr%2Fimage.png?alt=media&amp;token=6684a5e2-628b-4ab4-abf5-33253d3a9a99" alt=""><figcaption></figcaption></figure>

Flag: CTF{ec4a9fda046b09e2dce095f772262c766a857ac041c9cf3745cdd2a76a8b5819}
