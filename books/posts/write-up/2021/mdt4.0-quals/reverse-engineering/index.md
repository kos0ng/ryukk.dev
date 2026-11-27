# Reverse Engineering

<!-- challenge-index: 3398bff515359af3 -->

| Challenge | Topic |
| --- | --- |
| [5Head (700 pts)](#5head-700-pts) | Self-Extracting Archive, JavaScript |
| [ResidentSleeper (700 pts)](/notes/research/2021/reverse-engineering-approach-on-python-bytecode-with-development-version/) | CPython, Bytecode Disassembly |

<!-- /challenge-index -->

## 5Head (700 pts)

### Description

\-

### Solution

Diberikan file exe yang cukup besar , kemudian kami lakukan static analysis pada file exe tersebut.

<figure><img src="https://lh7-us.googleusercontent.com/YS32WGK9ojd8C7wDr54xlfJ-b3mvxZKELQTNxa5_5RXrBqoFJiF49HOZ-3OtAqBbL-S91uTQSxaBWW2avH8aPvaEC_F3h1BtfmXvX5IBsr2wpEQYYLjoQ-PQa2fvXYHPnuYbTENKK4-IjnliXSdBKA" alt=""><figcaption></figcaption></figure>

Terlihat pada fungsi main terdapat mapping terhadap file dengan nama “winrarsfxmappingfile.tmp” , kemudian kami coba lakukan pencarian terhadap string tersebut dan ternyata pada kasus njRat terdapat algoritma yang sama dan melakukan write file untuk second stage executable ke Local\Temp\RarSFX1 ( <https://menshaway.blogspot.com/2021/03/njrat-malware.html> ). Jadi saat kami menjalankan file kami coba cek direktori tersebut dan didapatkan file exe . Disaat yang bersamaan kami juga melakukan dynamic analysis cuman pas cek direktori tersebut ternyata ada file 5head.exe yang dibuat dengan electronjs , jadi kami lanjut analisis file pada direktori tersebut.

<figure><img src="https://lh7-us.googleusercontent.com/KEjG9SpqhgnQ8P0gajjzmP4ET_C7OLO2RNRhmWL1ODc-9gHdrBiI6JVeGDuciVKYFnR7iGi2tx099dkuHSnCfZpoLKbtjjNiZb5CizsZXLLhvUMzouTQm504ZTzG-wQprTHDIFm2k4o-_8Ge-SmoMw" alt=""><figcaption></figcaption></figure>

Berdasarkan informasi yang kami dapat , file asar dapat dikembalikan ke source code lagi , yaitu dengan melakukan unpack pada file asar tersebut ( <https://github.com/jonmest/How-To-Tamper-With-Any-Electron-Application> ).

```bash
npx asar extract electron.asar zz
```

<figure><img src="https://lh7-us.googleusercontent.com/2rAk2yIsTH8KwfBhxwpne3448rqxXKovwSM0L4mEAcGTz0SAqHwj53wStpzpM90CTg6ZtMSQ1QjzP0SOhy9t3ygKJ3uaK3zq4MeGG0Gr5EumDaq6yYLIdx4LNpkum58pJpDCHRAoNwTFZGxIxQ818A" alt=""><figcaption></figcaption></figure>

Sayangnya saat mencari informasi kami tidak mendapatkan sesuatu yang penting, yang kami ketahui pasti disini saat menjalankan file terdapat tombol authenticate dan pada direktori resources/app terdapat index.html dengan tombol serupa.&#x20;

<figure><img src="https://lh7-us.googleusercontent.com/48Xlnthbz06zgpjtmuYiI1VhtWD6b6xoMYLpDs6sTkrAvpspY4j_bkNmhajSEh89jg6caqaD8ecVWsCbr6gxuRdMd_E2xIODa19wVUhM41YKngSjI-Bt-XYK6HCkNeUFpKdKnuo5TUqUHyZP-2uEdA" alt=""><figcaption></figcaption></figure>

Kemudian kami lakukan view page source dan terdapat obfuscated javascript , lakukan deobfuscate secara otomatis + manual.

```javascript
(function (_0x232502, _0x5780ec) {
	var _0x373e7a = _0x2e17,
    	_0x5b03a2 = _0x232502();
	while (!![]) {
    	try {
        	var _0x8fb4af = parseInt(_0x373e7a(0x108)) / 0x1 + -parseInt(_0x373e7a(0xf6)) / 0x2 * (parseInt(_0x373e7a(0x107)) / 0x3) + -parseInt(_0x373e7a(0xff)) / 0x4 * (parseInt(_0x373e7a(0x10e)) / 0x5) + parseInt(_0x373e7a(0x112)) / 0x6 * (parseInt(_0x373e7a(0x10b)) / 0x7) + parseInt(_0x373e7a(0x116)) / 0x8 * (parseInt(_0x373e7a(0x101)) / 0x9) + -parseInt(_0x373e7a(0xfe)) / 0xa + parseInt(_0x373e7a(0x119)) / 0xb;
        	if (_0x8fb4af === _0x5780ec) break;
        	else _0x5b03a2['push'](_0x5b03a2['shift']());
    	} catch (_0x9d5378) {
        	_0x5b03a2['push'](_0x5b03a2['shift']());
    	}
	}
}(_0x4c76, 0x1ca78), $(() => {
	var _0x235351 = _0x2e17;
	const {
    	dialog: _0x351ae9
	} = require(_0x235351(0x115))[_0x235351(0x10c)];

	function _0x576184(_0x41f016) {
    	var _0x15505d = _0x235351,
        	_0x21957f = [],
        	_0x37ee7d = _0x41f016[0x0],
        	_0x5ed340 = 0x1;
    	for (let _0x47321e = 0x1; _0x47321e < _0x41f016["length"]; _0x47321e++) {
        	_0x41f016[_0x47321e] == _0x37ee7d ? _0x5ed340 += 0x1 : (_0x21957f['push']((_0x5ed340 << 0x8) + _0x37ee7d), _0x5ed340 = 0x1, _0x37ee7d = _0x41f016[_0x47321e]);
    	}
    	return _0x21957f["push"]((_0x5ed340 << 0x8) + _0x37ee7d), _0x21957f;
	}
	Array[_0x235351(0x104)][_0x235351(0xfd)] = function (_0x5b3778) {
    	var _0x245291 = _0x235351;
    	return this[_0x245291(0x10a)] == _0x5b3778['length'] && this['every'](function (_0x50f5ec, _0x1e70fb) {
        	return _0x50f5ec == _0x5b3778[_0x1e70fb];
    	});
	}, navigator['mediaDevices']['getUserMedia']({
    	'video': !![]
	})[_0x235351(0x113)](_0x208b8b => {
    	var _0x416f04 = _0x235351;
    	document[_0x416f04(0x100)](_0x416f04(0x10d))[_0x416f04(0xf9)] = _0x208b8b;
    	const _0x35515c = _0x208b8b['getVideoTracks']()[0x0];
    	imageCapture = new ImageCapture(_0x35515c);
	})[_0x235351(0xfc)](_0x37a226 => ChromeSamples[_0x235351(0x102)](_0x37a226));

	function _0x541cd2() {
    	var _0x136884 = _0x235351;
    	imageCapture[_0x136884(0xf7)]()['then'](_0x175ed3 => {
        	var _0x582dcb = _0x136884,
            	_0x38c882 = document["getElementById"]('canvas'),
            	_0x1b8450 = _0x38c882["getContext"]('2d');
        	_0x1b8450[_0x582dcb(0x111)](_0x175ed3, 0x0, 0x0);
        	var _0x2e8a8e = _0x1b8450["getImageData"](0x0, 0x0, _0x175ed3["width"], _0x175ed3['height']);
        	const _0x583cf8 = ['data_here'],
            	_0x39e92e = _0x576184(_0x2e8a8e['data']);
        	_0x39e92e['equals'](_0x583cf8) ? _0x351ae9[_0x582dcb(0x103)]({
            	'title': _0x582dcb(0x117),
            	'buttons': [_0x582dcb(0xfa)],
            	'type': _0x582dcb(0x105),
            	'message': 'ACCESS GRANTED'
        	}) : _0x351ae9['showMessageBox']({
            	'title': _0x582dcb(0x110),
            	'buttons': [_0x582dcb(0xfa)],
            	'type': _0x582dcb(0x106),
            	'message': _0x582dcb(0x109)
        	});
    	})[_0x136884(0xfc)](_0x1f29ef => ChromeSamples[_0x136884(0x102)](_0x1f29ef));
	}
	$('#authenticate-toggle')['on']('click', _0x1f3bad => {
    	_0x541cd2();
	});
}));

function _0x2e17(_0xb9b6ae, _0x3d6586) {
	var _0x4c76c0 = _0x4c76();
	return _0x2e17 = function (_0x2e17be, _0x345950) {
    	_0x2e17be = _0x2e17be - 0xf6;
    	var _0xb79306 = _0x4c76c0[_0x2e17be];
    	return _0xb79306;
	}, _0x2e17(_0xb9b6ae, _0x3d6586);
}

function _0x4c76() {
	var _0x4d4265 = ['remote', 'video', '67615LYtPxd', 'width', '3Head', 'drawImage', '486vBjUrn', 'then', 'data', 'electron', '8yHRUlm', '5Head', 'getImageData', '379533PmqVUc', 'push', '208138PxuhFk', 'grabFrame', 'getContext', 'srcObject', 'Dismiss', 'getElementById', 'catch', 'equals', '1026850dGfjrv', '16DpnOsz', 'querySelector', '662058NldxdO', 'log', 'showMessageBox', 'prototype', 'info', 'warning', '3xjldJW', '111389jMesAy', 'ACCESS DENIED', 'length', '13720YgMwsB'];
	_0x4c76 = function () {
    	return _0x4d4265;
	};
	return _0x4c76();
}.toString()
```

Intinya kode tersebut melakukan pengambilan gambar melalui kamera ( grabframe ) lalu dilakukan encoding pada fungsi \_0x576184 dan dilakukan pembandingan dengan variable\_0x583cf8 . Selanjutnya kami lakukan analisis pada fungsi \_0x576184 .&#x20;

```javascript
function _0x576184(_0x41f016) {
    	var _0x15505d = _0x235351,
        	_0x21957f = [],
        	_0x37ee7d = _0x41f016[0x0],
        	_0x5ed340 = 0x1;
    	for (let _0x47321e = 0x1; _0x47321e < _0x41f016["length"]; _0x47321e++) {
        	_0x41f016[_0x47321e] == _0x37ee7d ? _0x5ed340 += 0x1 : (_0x21957f['push']((_0x5ed340 << 0x8) + _0x37ee7d), _0x5ed340 = 0x1, _0x37ee7d = _0x41f016[_0x47321e]);
    	}
    	return _0x21957f["push"]((_0x5ed340 << 0x8) + _0x37ee7d), _0x21957f;
	}
```

Fungsi tersebut intinya melakukan perkalian banyaknya nilai yang sama dengan 2\*\*8 lalu menambahkan nilai tersebut ke hasil perkalian sebelumnya. Jadi untuk mendapatkan nilai dan banyaknya nilai tersebut bisa dengan melakukan bruteforce pengurangan terhadap data kemudian di modulo dengan 2\*\*8 , jika hasilnya nilai pengurangannya adalah nilai yang kita cari. Untuk mendapatkan banyaknya bilangan tinggal membagi hasil pengurangan tersebut dengan 2\*\*8. Berikut script helper yang kami gunakan untuk melakukan generate value tiap pixelnya

```python
arr = [array_0x583cf8]
f = open("pix.txt","w")
for i in arr:
    for j in range(0xff+1):
   	 if((i-j)%2**8==0):
   		 length = (i-j)/2**8
   		 val = str(j)
   		 f.write((val+",")*length)
f.close()
```

Selanjutnya kami melakukan write ke image menggunakan javascript ( write pada canvas ), dan menebak nilai width dan height , setelah mencoba coba sampai ke tahap mencoba widthxheight dari common monitor resolution kami mendapatkan gambar yang dapat dilihat string flagnya

```html
<!DOCTYPE html>
<html>
<body>

<canvas id="myCanvas" width="1000" height="4000" style="border:1px solid #d3d3d3;">
Your browser does not support the HTML5 canvas tag.</canvas>

<script>
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var z = 710;
const imageData = ctx.createImageData(1280,1024);
const arrData = [value_pix_txt];
for (let i = 0; i < imageData.data.length; i += 4) {
  imageData.data[i + 0] = arrData[i];  // R value
  imageData.data[i + 1] = arrData[i+1];	// G value
  imageData.data[i + 2] = arrData[i+2];  // B value
  imageData.data[i + 3] = arrData[i+3];  // A value
}
ctx.putImageData(imageData, 20, 20);
</script>

</body>
</html>
```

<figure><img src="https://lh7-us.googleusercontent.com/c3UR8RsIEcBmSvc7ZBQ5OIy2sJUXoZIsRZwKZZ2qvz05wAihubRDKxZuwy6XJEW6wI2l_YgNaesWvGJ794-KV7Av_yNh5MgfK9L5r0AQnijXXJ_F3jFE279ksLekEXyV2bNkqGfJQXGCZdSaQLgZ0Q" alt=""><figcaption></figcaption></figure>

Flag : MDT4.0{bypassed\_face\_recognition\_wannabe\_app\_with\_my\_5Head}
