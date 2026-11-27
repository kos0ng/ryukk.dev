# Cheating Game Built with WASM

Study case NCW 2022 Quals (Flaggy Bird V2).

## Preface

During the competition my team got 1st place and i got 1st blood on this challenge. This challenge was new for me, since it required me to do cheating using [Cetus](https://github.com/Qwokka/Cetus).

## Cheating the Game with Cetus

Given URL  <http://103.167.136.123:2122/> . The game was made using Unity, I tried to analyze the assets until it was a mess (quite painful) until finally I got enlightenment with [Cetus](https://github.com/Qwokka/Cetus). The concept is the same as the cheat engine, but here it took a long time to get the score value because it had to be exactly the same to get the flag in this challenge.

<figure><img src="https://lh7-us.googleusercontent.com/EN5C5MGcPYVau6XNlLyNfSm_D4i8qTTBWwovrEyv_-qdaRHnJqXTvkAojd-RI49jnbrqykKH1eIiInYGUMhwA75ZU5gfJ5HQ8_vDxn_nRSkwCheGkrh11-_Z2hNoEB9bBKgHwBZ10A8YxGzVAL6syVI" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/-EXC1XJEYNdJYdkoTLMtDCAFqDqp23EQAA3Pgg_5p2xtA2z2EiepMNHyj8AyYMoeBFjVyX-c9mPVSxG3iN4b5XX7nJ66EnbnvFAAx4QquiiWJ5NwVGz-MRnnCKCFNIdTO-mopzXDniTpjJ00f6V59jE" alt="" width="375"><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/EBaM6oVNVJ0kYVrtgD94GhPwWnrCBlkG5tF06UqrhIVO2l_ZShccthbqMYVpFgxvlsbzoX6LwnAOLQrMjEeCWpR3falu9qKxfJAlkSsGCY0fGbbdkcZsEQO3eiuqZfTds_b048NQKiiv0plkIBxCW6s" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/075FCHRHMxQw3BqgT5GotZ7lqyZnzKX3SqufrB5yZE0w-HAAdEzW6Ppd7k7zKujAHwNLaEjiL8cyj-EAm3awRyz24pU8rvl0rC8DAj9sk7KiLY_6w0I5KF9O8-f66wai_wY02ctdklxD6rOZw9Pt13I" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/OBuFjRlZ15RyoCWA3_Fh3XDaOWfOgWKDQnwjzDzCTbfWiSiW-FrT4Xq_Gt0dZ-VGZLrjstmAodD5aj_mmrGgCmEav-fYhdrNvTw7_-waJ_449XKWBnx6XgRWXOfJWfQmgwRcrYJN0Ue20vhMIfFNfp4" alt=""><figcaption></figcaption></figure>

To get the address from the score, the method is quite easy, exactly the same as the cheat engine. So do a search for every change in the score, for example from 0 do a search 0, change to 1 do a search 1 until you get a few addresses (and always the same as our score). If this means we have found the correct score address, then add the address to the bookmarks.

<figure><img src="https://lh7-us.googleusercontent.com/CNzsLZT92Q7zwSuFwl7p4Ms0a-c_ZO-ksxROr7Iizji0BvWC7sc72TpR-CwhmRMvW6Uu6PGVQnjcFBF8q-plqKBgmmQ_-UvEnzxX-Qoo94XQ9mSzu3sKc32l13ajp6_UiSLLWATxGKfcnAuA1TwpU8k" alt=""><figcaption></figcaption></figure>

Here we get the address for the score is 0x01578e38 . At the beginning, we did an analysis of each function in the read watch but couldn't find the right one, but when we tried to do an analysis of the function that does the write, it turned out that there was a constant value that was compared.

<figure><img src="https://lh7-us.googleusercontent.com/3105FhNn-Zvt9-gV6zV-42dyT0XXqvRonC64WIp_UcJpIGvo6O2UEf5OIO3GRP_z2z64dtHX5REThSybsxFXFU8fHppEEs66WhF73tgnOZD983ZfHxmYMLwB_Byha4TzTBGKA0goJpAyRXNIaTlBCmE" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/y7oM1Ox_iiyq8cZTq9G2VF8pWFtABwQ2klzv-4ht8cCgrYS_U7HCITF8rWKcc1YT0CONQ7V3zwwNWFFT2SA2gYQa6ojwuHxc-6zZEXgTUulUdzJ6dCXvHzzCCUMWFzit7kEwX5hcWp2y_n5N9IL8BmA" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/Gez9v3GkY9vsZhknFjo-UZkn7FZBaL2_7bwjdacyDOmCTd7klGr-Jhm7ZM7qZKqFqdWzDa3vIKjT9ATxDJNPQsFRxLX0eQ5-aQYxTamMEY_I2b_STDI2Cvq6gBiz74mOfmZWXRZWRjCG_vdQqMOYhgc" alt=""><figcaption></figcaption></figure>

It appears that there is an i32.eq instruction which compares 32 bit values and when we change the score to 4207330 and continue playing to add 1 we get a flag.

<figure><img src="https://lh7-us.googleusercontent.com/SmaZQfT4Sr_pMt205Z2NQ3Ep0aE3VPbq7tXR8tgkzJ6NbxAXBS0Jej5O2wnujyLXsTnvnU_wKxOMivro_Yi-VG-qwMkeAb1nuFjquphr4PbjXHL3TaOZjLjeVQ2CtvwF6WFtvod0KNTFzDsXfZd9VNE" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/UhEn5ucWSmfYlTefwBVnhhRXWeFjdBkkxMEq2KWukpbq2xanuoDH53k7i3IXUcSRM8UonhkSL2_hvK7XTOO5uxFbSxXC183j_V15OG8gAM7gj0cpNVP8Lvib_W_ryI8WJPDDvSzpYaWtTlpJAwBh84c" alt=""><figcaption></figcaption></figure>

Flag : NCW22{sloTH\_Hekkk\_flappy\_again}
