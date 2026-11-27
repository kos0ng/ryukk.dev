# Misc

<table><thead><tr><th width="347">Challenge</th><th>Link</th></tr></thead><tbody><tr><td>(s)tri(pes)angle love (120 pts)</td><td><a href="#s-tri-pes-angle-love-120-pts">Here</a></td></tr><tr><td>Berhitung! (260 pts)</td><td><a href="#berhitung-260-pts">Here</a></td></tr><tr><td>One Time Credentials (380 pts)</td><td><a href="#one-time-credentials-380-pts">Here</a></td></tr></tbody></table>

## (s)tri(pes)angle love (120 pts)

### Description

\-

### Solution

Diberikan screenshot sebagai berikut

<figure><img src="https://lh7-us.googleusercontent.com/0Gb5j0lUle0D12eH7fVrquFF6gOW_G9HQxC1xU_HEjOUu5pILKPMI_45GR_rhqrYuWQ0aCSf0aJYt47Y9wXYrDdW2ys3GnEfymWyzYQ86mj8GnFqzZ-NEdPadHVzT3L5Gzicv3wqEIEYPiRfMtuPefY" alt="" width="375"><figcaption></figcaption></figure>

Tulis ulang pesan yang dikirimkan oleh alesha yang terlihat seperti url pada instagram. Akses instagram, lalu pilih salah satu post dan ternyata formatnya mirip jadi tinggal tambahkan saja dengan <https://www.instagram.com/p/> sehingga menjadi <https://www.instagram.com/p/CwkCHG8SuMH/> .

<figure><img src="https://lh7-us.googleusercontent.com/kBrstt08n3kxXKX831tfM-ckpLeQVPzObLkpOki-J8omUu73fFyvv9bF2IFQyRnLSIRfdMe3eue9LzLspFLKJNaJV9AaCvqVAFdTJiu4s4K4RCZxh0C8h8irhydycebbVfw28qHKjuEB5aDJGSGHG3U" alt="" width="375"><figcaption></figcaption></figure>

Terdapat username spotify lalu search username tersebut di spotify. Klik bagian following dan kemudian cek manual masing-masing akun yang difollow. User Caltimurti terlihat mencurigakan, lihat followingnya ada 2 user yang bukan artis yaitu Joosph dan janethseame.

<figure><img src="https://lh7-us.googleusercontent.com/ySJ3gJKQRkmMQJn3LIV1AnXb30u3g16WOenCtgovKx_alr_0DCDcJii29zte4__Ll-v1ZkyX6VorWUbEV37MtCUCgGUt6_-mH8VOgTstODlY724-GBb6-1Ae8wjj0u7rAOOZ8klu0NsgZek5qM0TZvw" alt="" width="375"><figcaption></figcaption></figure>

Selanjutnya klik masing-masing profil dan didapatkan ada 2 gambar yang terlihat seperti foto couple (berdampingan) pada masing-masing akun

<figure><img src="https://lh7-us.googleusercontent.com/eLTJPizEDlF7UXH1atUAhz0bOG3LisekO00ntwzR5Y-h7RvxZg7Azl2BnTWt8mgLMwmazMOoiA6VGpPgQfPNRUmVe3W23jA2xrjRiXH4IMMOQ9fxC_vH5KD9JPnEiZk2GJiTP4N7LRvXb118lVmcU_c" alt="" width="375"><figcaption></figcaption></figure>

<figure><img src="https://lh7-us.googleusercontent.com/D3a6ygeMw46_YL7d_DK8y8ghlwED3-rJvGdMg50jA3fjWL_D9vkPz53XKnEfYpNl-RToeN_CHj4W2oENvZdIGezOAVHnqWe7iE7M01XYHRvxpIzaRv2_eo6uQQRMCTDN3C4b3nlQu8KIV6DHncASDjY" alt="" width="375"><figcaption></figcaption></figure>

Selanjutnya tinggal submit username sesuai format

Flag : IFEST23{Joosph\_janethseame}

## Berhitung! (260 pts)

### Description

\-

### Solution

Diberikan dokuman dengan isi sebagai berikut

<figure><img src="https://lh7-us.googleusercontent.com/b1iqBBOwUX809nEOXFQTwjOEwD2zCHXo3gp7yVWCTVTbOCJsQKcxNZ-VcPzXoDrrHTPedp5dkfzvxw6-OPQZlvh-a5Rc6MwlijKPe0aOJRvVSWTeiTJuxfLT2jBicuZ_hg6-GW6_HZ5HgSnEO4zsaU0" alt=""><figcaption></figcaption></figure>

Jadi intinya kita diharuskan mencari sequence dengan total terbesar pada suatu matrix. Disini kami menggunakan algoritma DFS tanpa mencatat visited path dengan delapan arah (karena bisa diagonal) dengan catatan nilai yang berdampingan sequential. Berikut solver yang kami gunakan&#x20;

```python
from pwn import *

def dfs(matrix , row, col, result): # vanilla dfs
    global max_values
    directions = [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (-1, 1), (1, -1), (1, 1)]

    rows, cols = len(matrix), len(matrix[0])

    curr_val = matrix[row][col]

    for dr, dc in directions:
        newRow, newCol = row + dr, col + dc
        if 0 <= newRow < rows and 0 <= newCol < cols:
            new_val = matrix[newRow][newCol]
            if(curr_val+1 == new_val):
                result += new_val
                dfs(matrix , newRow, newCol, result)
            else:
                if(result > max_values):
                    max_values = result

context.log_level = 'error'
while True:
    r = remote("103.152.242.235", 26693)
    for _ in range(10):
        r.recvline()
        zz = r.recvline()
        print(_, zz)
        if(b'sedih' in zz):
            r.close()
            break
        rows = 50
        cols = 50
        matrix = []
        for i in range(50):
            matrix.append(list(map(int,r.recvline().strip().decode().split(' '))))
            if(i == 0):
                print(matrix[0])
        max_values = -1
        
        for i in range(rows):
            for j in range(cols):
                startRow, startCol = i, j
                dfs(matrix, startRow, startCol, matrix[startRow][startCol])
        
        r.sendline(str(max_values).encode())
        
    # r.interactive()

```

<figure><img src="https://lh7-us.googleusercontent.com/JXuI5pIL-7F7dKDTrbDR2Pq0a7-Amf5ytqehusOPsHtjP8N-hZqisdZ4cXsqeMkueHSyL00JFEMC9OYrbe27Ovy0s_YuFNFW7t0wQQu-Yz1x3DL8ObjRy9vngZJPAwRZ_Ikz-pDH_Nlf5hLwn5wc3dE" alt=""><figcaption></figcaption></figure>

Flag : IFEST23{if\_CP\_Enjoyer\_exist\_why\_dont\_CTF\_Enjoyer\_exist}

## One Time Credentials (380 pts)

### Description

\-

### Solution

Diberikan contract, abi, dan URL RPC. Dari abi dapat diketahui bahwa setiap fungsi yang ada tidak memerlukan input, jadi tinggal panggil saja. Setelah melihat flow dari nc kami ketahui bahwa ini seperti OTP, generate random credentials untuk login lalu masukkan OTP. Semua data tinggal panggil saja pada contract yang disediakan. Berikut solver yang kami gunakan

```python
from web3 import Web3

node_url = "https://eth-sepolia.g.alchemy.com/v2/SMfUKiFXRNaIsjRSccFuYCq8Q3QJgks8"

web3 = Web3(Web3.HTTPProvider(node_url))

abi = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"getEverything","outputs":[{"internalType":"uint256","name":"otp","type":"uint256"},{"internalType":"string","name":"passphrase","type":"string"},{"internalType":"string","name":"decryptedFlag","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getIdentity","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOTP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPassphrase","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"help","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"}]'


caller = "0xF8dF23AFf40338c42aE9693f6242a0Ee24E5eDac"
private_key = "aff00a764af83a30cf3bcbb4667c5fcec6bf7830147b73b2b8b07d6ae09f60cc"  # To sign the transaction

contract_address = "0x22420C6261054E5A5d5277fFcE0993D8223e5ccd"


contract = web3.eth.contract(address=contract_address, abi=abi)
print(contract.functions.help().call())
print(contract.functions.getEverything().call())
```

<figure><img src="https://lh7-us.googleusercontent.com/7MoM9MvPLPq0Q9Aq7XvFTaxbgnR9TOjtg21uXIZ14fCxnCamTbInxHrO2zO7rJ3F_RDLIEuGFFchjLS9B6x5WXjszJWNakbV7pH9N6nns3AYdtpkXWKloAjD4rsG9kmZKVgSwch0H7TxKWDgP_OnXhU" alt=""><figcaption></figcaption></figure>

Flag : IFEST23{2ddafab8af0fd9bb86cb0680238b1717fd1b2a22d46fff9a4a1767b0c39c7716}
