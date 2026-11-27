# Forensic

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>SM WHAT?! (360 pts)</td><td><a href="#sm-what-360-pts">Here</a></td></tr></tbody></table>

## SM WHAT?! (360 pts)

### Description

An attacker managed to gain foothold in our network, but we managed to capture the connection to our server. Analyze the file and identify the tool used to connect, the service it connected to, its IP address, and the shared resources folder.

Flag format: TFCCTF{tool\_service\_ip\_share}

Example: TFCCTF{ntlmrelayx\_rdp\_192.168.0.1\_logs$}

Note: The flag is in all lowercase (except for TFCCTF).

### Solution

Download the artifact which is evtx file. Use EvtxECmd to parse the evtx file and open it using TimelineExplorer. One of the objective is finding the share name so my assumption is the service attacked related to SMB. So lets try to search string "share" in TimelineExplorer.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FqlN2YRTrx1BWRgF7jLh2%2Fimage.png?alt=media&amp;token=98ba1f60-94f4-477a-b569-0126f219d0ca" alt=""><figcaption></figcaption></figure>

From the result we know that there are access to SMB in 04/26/2021 so we can narrow the date to 04/26/2021. Double click one of the data we will know the information about share folder accessed.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FMH0oglcJFQbZ9gNl2BrO%2Fimage.png?alt=media&amp;token=7af260bc-5d12-4000-8c88-38240f554470" alt=""><figcaption></figcaption></figure>

The sharename is ADMIN$ and the remote IP Address is 10.23.123.11, delete the filter and group it by date. Try to find event before the shared folder accessed.

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FHtQ5uF1Ic4aN0mkGDf1c%2Fimage.png?alt=media&amp;token=7c6b6931-d4fd-486c-a2b3-af7fb3349c42" alt=""><figcaption></figcaption></figure>

Looking at event above that line i saw suspicious executable information&#x20;

&#x20;

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2F0MkGeutCHoIChx3pb4y4%2Fimage.png?alt=media&amp;token=95172fe1-7a24-4c04-aee7-700f16b600aa" alt=""><figcaption></figcaption></figure>

Gather some information from above command line in github i found some code that consist of "cmd.exe /Q /c cd "

* <https://github.com/search?q=%22cmd.exe+%2FQ+%2Fc+cd+%22&type=code>

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2FqS1u6L5WrCaGCo6GT5gW%2Fimage.png?alt=media&amp;token=d77f3e0d-72d5-4909-b08a-f12b33304e95" alt=""><figcaption></figcaption></figure>

We can see that the tools used is wmiexec, now we've all the data but it still failed when i submit TFCCTF{wmiexec\_smb\_10.23.123.11\_admin$}. The only IP address existing in the time near incident other than 10.23.123.11 is 127.0.0.1. Changing the IP address to 127.0.0.1 we found the correct flag.

Flag: TFCCTF{wmiexec\_smb\_127.0.0.1\_admin$}
