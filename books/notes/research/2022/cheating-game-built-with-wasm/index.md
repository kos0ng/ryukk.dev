# Cheating Game Built with WASM

Study case NCW 2022 Quals (Flaggy Bird V2).

## Preface

During the competition my team got 1st place and i got 1st blood on this challenge. This challenge was new for me, since it required me to do cheating using [Cetus](https://github.com/Qwokka/Cetus).

## Cheating the Game with Cetus

Given URL  <http://103.167.136.123:2122/> . The game was made using Unity, I tried to analyze the assets until it was a mess (quite painful) until finally I got enlightenment with [Cetus](https://github.com/Qwokka/Cetus). The concept is the same as the cheat engine, but here it took a long time to get the score value because it had to be exactly the same to get the flag in this challenge.

<figure><img src="images/44cf96ce9c67e07dd0652987.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/e7bd1bfd1f5b05482fa78784.png" alt="" width="375"><figcaption></figcaption></figure>

<figure><img src="images/859c3f2d10df5b15d4be88a1.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/ba55d9b3d89e038419150934.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/46a16bf2f250e2dda24d1ffb.png" alt=""><figcaption></figcaption></figure>

To get the address from the score, the method is quite easy, exactly the same as the cheat engine. So do a search for every change in the score, for example from 0 do a search 0, change to 1 do a search 1 until you get a few addresses (and always the same as our score). If this means we have found the correct score address, then add the address to the bookmarks.

<figure><img src="images/e743e305f85058cafd3e886b.png" alt=""><figcaption></figcaption></figure>

Here we get the address for the score is 0x01578e38 . At the beginning, we did an analysis of each function in the read watch but couldn't find the right one, but when we tried to do an analysis of the function that does the write, it turned out that there was a constant value that was compared.

<figure><img src="images/8804f79fca86470819312b46.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/4b7178c41b95d6c1fee9ae3e.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/00137bf96d63586c318e224f.png" alt=""><figcaption></figcaption></figure>

It appears that there is an i32.eq instruction which compares 32 bit values and when we change the score to 4207330 and continue playing to add 1 we get a flag.

<figure><img src="images/b1c3d0b5d3b1f63abfcbe48c.png" alt=""><figcaption></figcaption></figure>

<figure><img src="images/8537c3faa1133e3726e37825.png" alt=""><figcaption></figcaption></figure>

Flag : NCW22{sloTH\_Hekkk\_flappy\_again}
