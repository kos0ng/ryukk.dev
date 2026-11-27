# Misc

<!-- challenge-index: efd0ab7f667f5838 -->

| Challenge | Topic |
| --- | --- |
| [leaving soon (406 pts)](#leaving-soon-406-pts) | Network Forensics, Video Reconstruction |

<!-- /challenge-index -->

## leaving soon (406 pts)

### Description

My friend wanted to rewatch this cool miniseries on Catflix but it looks like they removed it. Can you help him recover all episodes from the network capture?

### Solution

My solver during the competition.

```python
import glob
import re
import requests
import os

def get_key(pssh):
	burp0_url = "https://cdrm-project.com:443/"
	burp0_headers = {"Sec-Ch-Ua": "\"Not-A.Brand\";v=\"99\", \"Chromium\";v=\"124\"", "Sec-Ch-Ua-Platform": "\"macOS\"", "Sec-Ch-Ua-Mobile": "?0", "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.118 Safari/537.36", "Content-Type": "application/json", "Accept": "*/*", "Origin": "https://cdrm-project.com", "Sec-Fetch-Site": "same-origin", "Sec-Fetch-Mode": "cors", "Sec-Fetch-Dest": "empty", "Referer": "https://cdrm-project.com/", "Accept-Encoding": "gzip, deflate, br", "Accept-Language": "en-US,en;q=0.9", "Priority": "u=1, i", "Connection": "close"}
	burp0_json={"Cookies": "", "Data": "", "Headers": "", "JSON": "", "License URL": "https://proxy.uat.widevine.com/proxy", "Proxy": "", "PSSH": pssh}
	resp = requests.post(burp0_url, headers=burp0_headers, json=burp0_json)
	return resp.json()["Message"]

def split_key(data):
	key = []
	for i in data.split("\n"):
		key.append(i.split(":")[-1])
	return key


fmt = "ffmpeg -decryption_key {} -i {} -codec copy {}"
for i in glob.glob("mpd/*"):
	fn = i
	print(fn)
	tmp_fn = fn.split("/")[-1].split(".")[0]
	fn_video = f"video/{tmp_fn}_video.mp4"
	f = open(fn, "r").read()
	found = re.findall(r"<cenc:pssh>(.*?)</cenc:pssh>", f)[0]
	resp = get_key(found)
	list_key = split_key(resp)
	for j in list_key:
		fn_dec = f"dec/{tmp_fn}_video_{j}.mp4"
		# print(fn_dec)
		tmp_command = fmt.format(j, fn_video, fn_dec)
		os.system(tmp_command)
```

For detailed writeup, take a look on SKSD official writeup.
