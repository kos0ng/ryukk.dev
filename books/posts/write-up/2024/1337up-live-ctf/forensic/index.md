# Forensic

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>Logging (100 pts)</td><td>Here</td></tr><tr><td>The Puzzled Protocol (495 pts)</td><td><a href="#the-puzzled-protocol-495-pts">Here</a></td></tr></tbody></table>

## The Puzzled Protocol (495 pts)

### Description

In a world where the machines talk in codes, Two protocols clash on their invisible roads. One speaks control, the other knows the grid, Hidden among them, a secret is hide.

Modbus whispers commands to open the gate, DNP3 listens and alters its fate. Some signals are true, some meant to deceive, Only the sharp-eyed can truly perceive.

Flags are fragmented, scattered in disguise, The real one’s elusive, behind layers of lies. Find the whispers that tell the right tale, Or be lost in the noise, destined to fail.

### Solution

Given PCAP file, open it using wireshark. At first frame, we can see some suspicious data

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FM8k1XrGXwfWttlPPOYES%2Fimage.png?alt=media&amp;token=f63ef6bd-8260-4873-b341-80012cb2674a" alt=""><figcaption></figcaption></figure>

It looks like different with the others.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FLBsVSCtwHX2rFP5g5tAJ%2Fimage.png?alt=media&amp;token=a2059b95-f2d9-4e00-82a4-7d66ce5cf0a2" alt=""><figcaption></figcaption></figure>

After knowing this information, i tried to filter only packet that consist "Data" string.

```
frame contains "Data"
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F6cJwIfwjY19KxoW4Euq9%2Fimage.png?alt=media&amp;token=42a04736-6bd8-4e17-a7c8-7bc9df853c7f" alt=""><figcaption></figcaption></figure>

Copying all the values now left only guessing part. Lets decode the base64 ciphertext

```python
import base64

def dec(a):
	a = bytes.fromhex(a).split(b' ')[-1]
	a = base64.b64decode(a)
	return a

arr = ["54435020446174613a2077365044704d4f2b7736504472634f347736504476734f6a77354844724d4b65773648436d634f3177367a4470734b65773633446c773d3d"]
arr.append("54435020446174613a20773737436d634f34773666436d384f6b7770374470734f3177366e436d734f6b77373744754d4b61773662446c773d3d")
arr.append("4d6f6462757320446174613a2077365044704d4f2b7736504472634f347736504476734f6a7735484470384f6c77363744714d4f2f77376e4474634f6c77377a436d634f3477376a446f384f7577706e4474513d3d")
arr.append("54435020446174613a2077365044704d4f2b7736504472634f347736504476734f6a77354844724d4b65773648436d634f3177367a4470734b65773633446c773d3d")
arr.append("444e50332d4c696b6520446174613a2077363744704d4f3677706e4474634b5a77376e4471634b65773772436d634f31")
arr.append("444e50332d4c696b6520446174613a2077365044704d4f2b7736504472634f347736504476734f6a77354844724d4b65773648436d634f3177367a4470734b65773633446c773d3d")

for i in arr:
	print(dec(i))
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FeMU3vMLcvLEZQw6OoHlJ%2Fimage.png?alt=media&amp;token=f6c8e55e-72de-448c-8d2f-daa30b26b65d" alt=""><figcaption></figcaption></figure>

All the values consist of byte like \xc3,\xc2, etc. We know that it can be caused by the process of encoding of char in python. So lets convert it to the actual values.

```python
import base64

def dec(a):
	a = bytes.fromhex(a).split(b' ')[-1]
	a = base64.b64decode(a)
	a = a.decode()
	act_val = []
	for i in a:
		act_val.append(ord(i))
	return act_val

arr = ["54435020446174613a2077365044704d4f2b7736504472634f347736504476734f6a77354844724d4b65773648436d634f3177367a4470734b65773633446c773d3d"]
arr.append("54435020446174613a20773737436d634f34773666436d384f6b7770374470734f3177366e436d734f6b77373744754d4b61773662446c773d3d")
arr.append("4d6f6462757320446174613a2077365044704d4f2b7736504472634f347736504476734f6a7735484470384f6c77363744714d4f2f77376e4474634f6c77377a436d634f3477376a446f384f7577706e4474513d3d")
arr.append("54435020446174613a2077365044704d4f2b7736504472634f347736504476734f6a77354844724d4b65773648436d634f3177367a4470734b65773633446c773d3d")
arr.append("444e50332d4c696b6520446174613a2077363744704d4f3677706e4474634b5a77376e4471634b65773772436d634f31")
arr.append("444e50332d4c696b6520446174613a2077365044704d4f2b7736504472634f347736504476734f6a77354844724d4b65773648436d634f3177367a4470734b65773633446c773d3d")

for i in arr:
	print(dec(i))
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fr6Qga23oan7NyyoEPba0%2Fimage.png?alt=media&amp;token=15b2759f-2cff-435a-ad95-4f89442d4de6" alt=""><figcaption></figcaption></figure>

Continue the guessing,  we know the format flag which is "INTIGRITI{", lets do some known operation such as xor, sub, add, etc.

```python
def dec(a):
	a = bytes.fromhex(a).split(b' ')[-1]
	a = base64.b64decode(a)
	a = a.decode()
	act_val = []
	for i in a:
		act_val.append(ord(i))
	return act_val

arr = ["54435020446174613a2077365044704d4f2b7736504472634f347736504476734f6a77354844724d4b65773648436d634f3177367a4470734b65773633446c773d3d"]
arr.append("54435020446174613a20773737436d634f34773666436d384f6b7770374470734f3177366e436d734f6b77373744754d4b61773662446c773d3d")
arr.append("4d6f6462757320446174613a2077365044704d4f2b7736504472634f347736504476734f6a7735484470384f6c77363744714d4f2f77376e4474634f6c77377a436d634f3477376a446f384f7577706e4474513d3d")
arr.append("54435020446174613a2077365044704d4f2b7736504472634f347736504476734f6a77354844724d4b65773648436d634f3177367a4470734b65773633446c773d3d")
arr.append("444e50332d4c696b6520446174613a2077363744704d4f3677706e4474634b5a77376e4471634b65773772436d634f31")
arr.append("444e50332d4c696b6520446174613a2077365044704d4f2b7736504472634f347736504476734f6a77354844724d4b65773648436d634f3177367a4470734b65773633446c773d3d")

known = b"INTIGRITI{"
for i in arr:
	tmp = []
	tmp2 = dec(i)
	for j in range(len(known)):
		tmp.append(known[j] ^ tmp2[j])
	print(tmp)
	break
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FD6oVXnHXz0Hl7undy4Ht%2Fimage.png?alt=media&amp;token=5fedc79a-3f6d-48c0-b988-4e3f59090d31" alt=""><figcaption></figcaption></figure>

Uh, look suspicious. Looks like we found the valid key and valid operation. Lets implement the algorithm for all values.

```python
import base64

def dec(a):
	a = bytes.fromhex(a).split(b' ')[-1]
	a = base64.b64decode(a)
	a = a.decode()
	act_val = []
	for i in a:
		act_val.append(ord(i) ^ 170)
	return act_val

arr = ["54435020446174613a2077365044704d4f2b7736504472634f347736504476734f6a77354844724d4b65773648436d634f3177367a4470734b65773633446c773d3d"]
arr.append("54435020446174613a20773737436d634f34773666436d384f6b7770374470734f3177366e436d734f6b77373744754d4b61773662446c773d3d")
arr.append("4d6f6462757320446174613a2077365044704d4f2b7736504472634f347736504476734f6a7735484470384f6c77363744714d4f2f77376e4474634f6c77377a436d634f3477376a446f384f7577706e4474513d3d")
arr.append("54435020446174613a2077365044704d4f2b7736504472634f347736504476734f6a77354844724d4b65773648436d634f3177367a4470734b65773633446c773d3d")
arr.append("444e50332d4c696b6520446174613a2077363744704d4f3677706e4474634b5a77376e4471634b65773772436d634f31")
arr.append("444e50332d4c696b6520446174613a2077365044704d4f2b7736504472634f347736504476734f6a77354844724d4b65773648436d634f3177367a4470734b65773633446c773d3d")

# known = b"INTIGRITI{"

for i in arr:
	print(bytes(dec(i)))
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FHMSfFX3RMRvfncDqHIjb%2Fimage.png?alt=media&amp;token=91d22534-7031-46c8-a28b-6680cc8a6cb4" alt=""><figcaption></figcaption></figure>

Flag: INTIGRITI{MODBUS\_OV3RRID3\_DNP3\_3SC4P3\_T3RM1N4L\_C0NTR0L}
