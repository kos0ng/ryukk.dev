# Reverse Engineering Erlang BEAM File

Study case Cyber Jawara 2021 Quals (Laser)

## Preface

BEAM is the filename extension of bytecode compiled from library ([ERL](https://filext.com/file-extension/ERL)) and header ([HRL](https://filext.com/file-extension/HRL)) files written in Erlang programming language using BEAM compiler. It can be executed by the BEAM virtual machine bundled with the official Erlang development environment ([source](https://filext.com/file-extension/BEAM)). During the competition, there is not much information about how to decompile BEAM file. So my approach is by disassembling the file then reconstructing it using another programming language.

## Disassembling BEAM File

Given an Erlang BEAM file, here i try to run it using escript but it failed.

<figure><img src="https://lh7-us.googleusercontent.com/GJVjRHOhnq9ffw39HgXPZpJ1WnH800TIjKHM8mHNWTQHaJz3zkMTmPdJd8R2fibFiIT7P4znwOZA7DifdNEenXb8lPqFw1QMxKc5hUdkFDXTOxR3lcQAJzeljWgmWxGpkaRHCGPh4hngG399qCgW0A" alt=""><figcaption></figcaption></figure>

So i do it statically. Using iex i try to print the IR from the file

```erlang
f = '/home/kosong/ctf/cj2021/Elixir.Laser.beam'
result = :beam_lib.chunks(f,[:abstract_code])
{:ok,{_,[{:abstract_code,{_,ac}}]}} = result
IO.puts :erl_prettypr.format(:erl_syntax.form_list(ac))
```

Below is the result

```erlang
-file("laser.exs", 1).

-module('Elixir.Laser').

-compile([no_auto_import]).

-export(['__info__'/1, check/0, encode/1, pm/3, pm/4]).

-spec '__info__'(attributes |
             	compile |
             	functions |
             	macros |
             	md5 |
             	exports_md5 |
             	module |
             	deprecated) -> any().

'__info__'(module) -> 'Elixir.Laser';
'__info__'(functions) ->
	[{check, 0}, {encode, 1}, {pm, 3}, {pm, 4}];
'__info__'(macros) -> [];
'__info__'(exports_md5) ->
	<<"°\005~%\016ÅR#^#\036'º0G\004">>;
'__info__'(Key = attributes) ->
	erlang:get_module_info('Elixir.Laser', Key);
'__info__'(Key = compile) ->
	erlang:get_module_info('Elixir.Laser', Key);
'__info__'(Key = md5) ->
	erlang:get_module_info('Elixir.Laser', Key);
'__info__'(deprecated) -> [].

check() ->
	_x@1 =
    	3459404460943523163254271348153144371070159528291008865566114300831214033811548691214722511128971126113695372016894585887708082061664121191004298682055360432912894446034706169753526843287539574022510293152921462924428286794778675493716818132569233923899254164473241675168214415964486463826672545742099903,
	_y@1 =
    	318826904244914170021964584538977419627137766398998831981586330108720813552602423830296674585316414199064291190257063329205210442233156670920367908547032145699413492870865770711769918679580392299413686963996744092446987066435822747098373054050337084402326230449695167696917530621139445512712841734335568,
	_p@1 = 1 bsl 16,
	_p@2 = _p@1 + 1,
	'Elixir.IO':puts(<<"Laser Flag Checker">>),
	_flag@1 = 'Elixir.String':trim('Elixir.IO':read(stdio,
                                                	line)),
	case
    	'Elixir.Laser':pm('Elixir.Laser':encode('Elixir.String':graphemes(_flag@1)),
                      	_p@2,
                      	_x@1)
        	== _x@1 - _y@1
    	of
    	true -> 'Elixir.IO':puts(<<"Correct!">>);
    	false ->
        	case true of
            	true -> 'Elixir.IO':puts(<<"Incorrect!">>);
            	false -> erlang:error(cond_clause)
        	end
	end.

encode([_head@1 | _tail@1]) ->
	encode(_tail@1) +
    	(binary:first(_head@1) bsl erlang:length(_tail@1) * 8);
encode([]) -> 0.

pm(_n@1, _k@1, _m@1) -> pm(_n@1, _k@1, _m@1, 1).

pm(_, 0, _, _r@1) -> _r@1;
pm(_n@1, _k@1, _m@1, _r@1) ->
	_r@2 = case _k@1 rem 2 == 1 of
           	false -> _r@1;
           	true -> _r@1 * _n@1 rem _m@1
       	end,
	_n@2 = _n@1 * _n@1 rem _m@1,
	_k@2 = _k@1 div 2,
	pm(_n@2, _k@2, _m@1, _r@2).

```

After that, analyze the whole IR code.

```
pm -> pow(m,e,n)
bsl -> shift left
graphemes -> string to list char

encode
arr[0]*(2**24) + arr[1]*(2**16) + arr[2]*(2**8) + arr[3]= x
Untuk decode tinggal di mod  2**8 aja untuk dapatkan last char , selanjutnya kurangi dengan last char lalu bagi dengan 2**8. Dan ulangi sampai nilai x <= 0.
arr[0]*(2**24) + arr[1]*(2**16) + arr[2]*(2**8) = x - arr[3]
arr[0]*(2**16) + arr[1]*(2**8) + arr[2] =( x - arr[3] )/ 2**8
```

## Reconstructing the Whole Code

Untuk rsa gunakan factordb untuk mendapatkan faktor prime dari n , ternyata multi prime cman ada prime yang cukup besar ( weird ) yang menyusun nilai n , padahal yang lainnnya nilainya kecil , kami coba hilangkan dan berhasil mendapatkan flag. Berikut solver yang kami gunakan

For RSA part, use factordb to get the prime factors of n, it turns out that it has more than two prime factors. One of the factor has much different than the other number, so removing it made the RSA decrypt process succesful. Below is the solver i use

```python
from Crypto.Util.number import *

factor = [8883963797,
9312576787,
9864787187,
10965930293,
11279137189,
11824459483,
11924202263,
12139150253,
12405130123,
12580269851,
13227411217,
13370635781,
13898961539,
14433479449,
14984854631,
15975600409,
16593548737,
16733116537,
16755272693]
y = 318826904244914170021964584538977419627137766398998831981586330108720813552602423830296674585316414199064291190257063329205210442233156670920367908547032145699413492870865770711769918679580392299413686963996744092446987066435822747098373054050337084402326230449695167696917530621139445512712841734335568
n = 1
phi = 1
for i in factor:
    n *= i
    phi *= (i-1)
# print(n==3459404460943523163254271348153144371070159528291008865566114300831214033811548691214722511128971126113695372016894585887708082061664121191004298682055360432912894446034706169753526843287539574022510293152921462924428286794778675493716818132569233923899254164473241675168214415964486463826672545742099903)
c = n - y
d = inverse((1<<16)+1,phi)
enc = pow(c,d,n)
res = []
while enc>0:
    tmp = enc%(2**8)
    res.append(tmp)
    enc -= tmp
    enc /= 2**8
flag = ""
for i in res[::-1]:
    flag += chr(i)
print(flag)

```

Flag : CJ2021{welp\_it\_is\_a\_beam\_multi-prime\_rsa\_because\_i\_ran\_out\_of\_idea}
