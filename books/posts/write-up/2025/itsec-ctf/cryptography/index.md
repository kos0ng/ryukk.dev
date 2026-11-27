# Cryptography

<table><thead><tr><th width="347">Challenge</th><th>Topic</th></tr></thead><tbody><tr><td><a href="#ingfokan-login">Ingfokan Login</a></td><td>AES Insecure Implementation, MITM Scenario</td></tr><tr><td><a href="#venture-into-the-dungeon">Venture Into the Dungeon</a></td><td>RSA Homomorphic, multiplicative inverse, bruteforce</td></tr><tr><td><a href="#simple-rsa">Simple RSA</a></td><td>Smooth factor, fermat</td></tr></tbody></table>

## Ingfokan Login

### Description

\-

### Solution

Given code below

```python
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import hashlib
from secret import flag

class Server:
    def __init__(self):
        random = get_random_bytes(256)
        self.password = hashlib.md5(random).hexdigest()
        assert len(flag) == 16
        self.secret = (flag + get_random_bytes(48)).hex()

    def receive_challenge(self, challenge):
        self.clientChallenge = challenge

    def sendChallenge(self, receiver):
        self.challenge = get_random_bytes(16).hex() + get_random_bytes(48).hex()
        print("sending server challenge: ", self.challenge)
        receiver.receive_challenge(self, self.challenge)

    def receive_credential(self, credential):
        self.clientCredential = credential.decode()

    def calculateSessionKey(self):
        salt = b""
        iterations = 100_000
        key_length = 32
        self.calculatedKey = hashlib.pbkdf2_hmac('sha256', server.clientChallenge.encode() + self.challenge.encode() + self.password.encode(), salt, iterations, dklen=key_length)


    def computeCred(self):
        challenge = bytes.fromhex(self.clientChallenge)
        iv = challenge[:16]
        plaintext = challenge[16:]

        cipher_ecb = AES.new(self.calculatedKey, AES.MODE_ECB)
        ciphertext = bytearray()
        shift_reg = bytearray(iv)

        for byte in plaintext:
            encrypted = cipher_ecb.encrypt(bytes(shift_reg))
            keystream_byte = encrypted[0]
            cipher_byte = byte ^ keystream_byte
            ciphertext.append(cipher_byte)

            shift_reg = shift_reg[1:] + bytes([cipher_byte])

        result = bytes(ciphertext)
        self.nonce = iv
        self.credential = result.hex()

    def sendCredential(self, receiver, message):
        challenge = bytes.fromhex(message)
        plaintext = challenge
        cipher_ecb = AES.new(self.calculatedKey, AES.MODE_ECB)
        ciphertext = bytearray()
        shift_reg = bytearray(self.nonce)

        for i in range(0, len(plaintext), 16):
            block = plaintext[i:i+16]

            encrypted = cipher_ecb.encrypt(bytes(shift_reg))

            cipher_block = bytes([b ^ e for b, e in zip(block, encrypted)])
            ciphertext.extend(cipher_block)

            shift_reg = bytearray(cipher_block)

        result = bytes(ciphertext).hex()
        print("sending server credential: ", result)
        receiver.receive_credential(self, result)


    def verifyCred(self):
        if self.clientCredential == self.credential:
            print("[+] Authentication Successful.")
            return True
        else:
            print("[!] Authentication Failure!")
            return False


class Client:
    def __init__(self, username, password):
        self.username = hashlib.md5(username.encode()).hexdigest()
        self.password = hashlib.md5(password.encode()).hexdigest()
        self.randombytes = get_random_bytes(48).hex()
        self.serverChallenge = None
        self.serverCredential = None

    def sendChallenge(self, receiver):
        self.challenge = self.username + self.randombytes
        print("sending client challenge: ", self.challenge)
        receiver.receive_challenge(self, self.challenge)

    def receive_challenge(self, serverChallenge):
        self.serverChallenge = serverChallenge

    def sendCredential(self, receiver):
        print("sending client credential: ", self.credential)
        receiver.receive_credential(self, self.credential)

    def receive_credential(self, credential):
        self.serverCredential = credential.decode()

    def calculateSessionKey(self):
        salt = b""
        iterations = 100_000
        key_length = 32
        self.calculatedKey = hashlib.pbkdf2_hmac('sha256', self.challenge.encode() + self.serverChallenge.encode() + self.password.encode(), salt, iterations, dklen=key_length)

    def computeCred(self):
        challenge = bytes.fromhex(self.challenge)
        iv = challenge[:16]
        plaintext = challenge[16:]

        cipher_ecb = AES.new(self.calculatedKey, AES.MODE_ECB)
        ciphertext = bytearray()
        shift_reg = bytearray(iv)

        for byte in plaintext:
            encrypted = cipher_ecb.encrypt(bytes(shift_reg))
            keystream_byte = encrypted[0]
            cipher_byte = byte ^ keystream_byte
            ciphertext.append(cipher_byte)

            shift_reg = shift_reg[1:] + bytes([cipher_byte])

        result = bytes(ciphertext)
        self.credential = result.hex()


class Attacker:
    def __init__(self, client, server):
        self.client = client
        self.server = server

    def relay_challenge(self, receiver, challenge):
        receiver.receive_challenge(challenge)

    def receive_challenge(self, sender, challenge):
        tamp = input(f"(tamper): ")
        if tamp == "fwd":
            msg_sent = challenge
        else:
            msg_sent = tamp

        if sender == self.server:
            self.relay_challenge(self.client, msg_sent)
        elif sender == self.client:
            self.relay_challenge(self.server, msg_sent)

    def relay_credential(self, receiver, challenge):
        receiver.receive_credential(challenge)

    def receive_credential(self, sender, challenge):
        tamp = input(f"(tamper): ")
        if tamp == "fwd":
            msg_sent = challenge.encode()
        else:
            msg_sent = tamp.encode()

        if sender == self.server:
            self.relay_credential(self.client, msg_sent)
        elif sender == self.client:
            self.relay_credential(self.server, msg_sent)


if __name__ == "__main__":
    print("===HAPPY HAPPY ITSEC LOGoN PAGE==")
    username = input("Username: ")
    password = input("Password: ")

    client = Client(username, password)
    server = Server()
    attacker = Attacker(client, server)

    def begin_communication():
        while True:
            client.sendChallenge(attacker)
            server.sendChallenge(attacker)
            client.calculateSessionKey()
            server.calculateSessionKey()
            client.computeCred()
            server.computeCred()
            client.sendCredential(attacker)
            result = server.verifyCred()
            if result:
                server.sendCredential(attacker, server.clientChallenge)
                server.sendCredential(attacker, server.secret)

    begin_communication()
```

The given problem simulates a `MITM` scenario, allowing an attacker to intercept client-server communication. Since we're setting up the client, we know the key used for AES encryption, but we don't know server's key.

In this case, we can control the `challenge` used to generate credentials. The vulnerability lies in the `lack of length checking` for `challenge`. Therefore, if we send a `17-byte challenge`, the plaintext is only 1 byte. Because the plaintext is only 1 byte and we can communicate continuously, so we can `bruteforce` that 1-byte credential.

Next, if we found valid credentials, the clientChallenge and secret (flag) will be sent to the attacker. Since we don't know the server key, so we can't decrypt as usual. However, because we can control the challenge sent to the server, we can do the following exploitation:

```python
clientChallenge = 17 bytes nullbyte
server.sendCredential(attacker, server.clientChallenge) -> E(nullbyte) ^ nullbyte = E(nullbyte)

server.sendCredential(attacker, server.secret) -> E(nullbyte) ^ secret = C
secret -> E(nullbyte) ^ nullbyte = E(nullbyte)
```

So we can leak the secret with the `C^E(nullbyte)` operation. Following is the solver we used

```python
from pwn import *

r = remote("54.254.152.24", 2025)
# r = process(["python3", "ori.py"])
r.recvuntil(b"Username: ")
r.sendline(b"asd")
r.recvuntil(b"Password: ")
r.sendline(b"asd")

for i in range(0x100):
r.recvuntil(b"(tamper): ")
r.sendline(b"00"*17)
r.recvuntil(b"(tamper): ")
r.sendline(b"00"*17)
r.recvuntil(b"(tamper): ")
r.sendline(hex(i)[2:].encode())
# print(i, r.recvline())
# print(i)
if b"Successful" in r.recvline():
print("nice")
r.recvuntil(b"server credential:  ")
server_creds = bytes.fromhex(r.recvline().decode())
r.recvuntil(b"(tamper): ")
r.sendline(b"fwd")
r.recvuntil(b"server credential:  ")
ct_flag = bytes.fromhex(r.recvline().decode())
print(xor(ct_flag, server_creds))
break
r.interactive()
```

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXfxHkO7KjiSYsyKmQm5082CBxvkCsdeBAgnWWIZGb-OPmbMe-uy2Wz8efH9WcNgmHloUDkikcg2SFpgydGvcCfhNE2Y8eRJ3tj_keaNecsiMaN4b91vXWUbOho7MCZc91y9wk9XkQ?key=NzaOQ3nlX3Qqiq5cQCdyhA" alt=""><figcaption></figcaption></figure>

Flag: ITSEC{i\_l1ke\_1t\_b3tter}<br>

## Venture Into the Dungeon

### Description

\-

### Solution

Given code below

```python
# !/usr/bin/env python3
from Crypto.Util.number import getPrime, bytes_to_long, inverse
from secrets import FLAG

assert FLAG.startswith(b'ITSEC{') and FLAG.endswith(b'}')

class Dungeon:
    def __init__(self, key_len: int = 1024):
        while True:
            try:
                p,q = getPrime(key_len//2), getPrime(key_len//2)
                self.n = p*q
                self.e = 0x10001
                et = (p-1)*(q-1)
                self._d = inverse(self.e, et)
                break
               
            except ValueError:
                continue
   
    def sloth(self, m: int) -> int:
        return pow(m, self.e, self.n)

    def shadow(self, c: int) -> int:
        p = pow(c, self._d, self.n)
        total_bits = p.bit_length()
        top_mask = ((1 << 128) - 1) << (total_bits - 128)
        bottom_mask = (1 << 128) - 1
        mask = top_mask | bottom_mask
        return p & mask

if __name__ == '__main__':
    Aid = Dungeon(1024)
    mystery = Aid.sloth(bytes_to_long(FLAG))

    print("""
You take your first cautious steps inside, and the echo of your boots fills the silence. The corridors twist like the roots of some massive, underground tree, until the path splits into a dimly lit chamber where two odd figures wait. There's a tablet between these to figures.
""")
    print(f"mystery: {mystery}")
    print(f"n: {Aid.n}")

    for _ in range(2014):
        print("What will you do")
        print('1. speak "the weight of sloth"')
        print('2. speak "the toll of secrets"')
        print("3. turn back and run")
        menu = ""
        while menu not in ["1","2","3"]:
            menu = input("(1|2|3): ")

        if menu == "1":
            userInput = ""
            userInput = input("...: ")
            if userInput.isdigit() and int(userInput) == bytes_to_long(FLAG):
                print("...Huh. You're still alive. Figures.")
                print("Well... guess you didn't really need me after all. Good job, I guess.")
                break
            print("...")

        elif menu == "2":
            userInput = ""
            while not userInput.isdigit():
                userInput = input("payment: ")
           
            if int(userInput) < 1:
                print("Coin? Trinkets? Do you take me for a merchant?")
                print("Offer me coin again, and I will offer you silence.")
                continue
            if int(userInput) % mystery == 0:
                print("Secrets weigh more than gold. They stain more than blood. I do not want your glittering junk-bring me something that whispers. Something that hurts to say.")
                continue
            decrypted = Aid.shadow(int(userInput))

            print(f"(whisper): {decrypted}")
       
        elif menu == "3":
            print("Running already? How predictable...")
            break
```

So, we're given a mystery variable, which is the ciphertext of the flag (RSA). We're also provided with a service to decrypt the ciphertext, but we can't provide a multiplication of the ciphertext. Furthermore, the decryption result is masked in the middle.

The idea to solve the challenge is to `pad` (0x100) the plaintext using the `homomorphic` properties of RSA. So, by utilize padding, we get a total of `31 bytes` of flags (16 bytes upper, 15 bytes lower).

```python
from pwn import *
from Crypto.Util.number import *

# context.log_level = 'debug'

r = remote("52.77.234.0", 20256)
r.recvuntil(b"mystery: ")
ct = int(r.recvline().strip())
r.recvuntil(b"n: ")
n = int(r.recvline().strip())
e = 0x10001

r.recvuntil(b": ")
r.sendline(b"2")
r.recvuntil(b": ")

pad = pow(256, e, n)
new_ct = ct * pad
new_ct %= n

r.sendline(str(new_ct).encode())
r.recvuntil(b"(whisper): ")

ct2 = int(r.recvline().strip())

print(long_to_bytes(ct2))

r.interactive()
```

Based on the output, we also know the flag length is 40 bytes, leaving 9 bytes unknown. At this point, we try another approach, using a `multiplicative inverse`. However, we need to ensure that the value we provide divides the ciphertext. To obtain a list of prime values that divide the ciphertext, we can `bruteforce` the service and use the output length as validation.

```python
from pwn import *
from Crypto.Util.number import *
import sympy

r = remote("52.77.234.0", 20256)
r.recvuntil(b"mystery: ")
ct = int(r.recvline().strip())
r.recvuntil(b"n: ")
n = int(r.recvline().strip())

divisor = []
last_prime = 2
e = 0x10001

while True:
	try:
		r.recvuntil(b": ")
		r.sendline(b"2")
		r.recvuntil(b": ")
	except Exception as err:
		r.close()
		r = remote("52.77.234.0", 20256)
		r.recvuntil(b"mystery: ")
		ct = int(r.recvline().strip())
		r.recvuntil(b"n: ")
		n = int(r.recvline().strip())
		r.recvuntil(b": ")
		r.sendline(b"2")
		r.recvuntil(b": ")
	
	inv = pow(last_prime, -1, n)
	new_ct = ct * pow(inv, e, n)
	new_ct %= n

	r.sendline(str(new_ct).encode())
	r.recvuntil(b"(whisper): ")
	ct2 = int(r.recvline().strip())

	tmp = long_to_bytes(ct2)
	print(f"{last_prime=}")
	if len(tmp) <= 40:
		divisor.append(last_prime)
		print(divisor)

	last_prime = sympy.nextprime(last_prime)
	
r.interactive()
```

From the bruteforce script above, we get 3 small prime values, which are `[7, 263, 21839]`. Next, modify the previous script to perform a multiplicative inverse.

```python
from pwn import *
from Crypto.Util.number import *

# context.log_level = 'debug'

r = remote("52.77.234.0", 20256)
r.recvuntil(b"mystery: ")
ct = int(r.recvline().strip())
r.recvuntil(b"n: ")
n = int(r.recvline().strip())
e = 0x10001

r.recvuntil(b": ")
r.sendline(b"2")
r.recvuntil(b": ")

divisor = 7 * 7 * 263 * 21839
inv = inverse(divisor, n)
new_ct = ct * pow(inv, e, n)
new_ct %= n

r.sendline(str(new_ct).encode())
r.recvuntil(b"(whisper): ")

ct2 = int(r.recvline().strip())

print(long_to_bytes(ct2 * divisor))

r.interactive()
```

From script above we got following output

```
b'ITSEC{Secrets_do>\xf198\x0fi\xde\x0e_buried_forever}'
```

Here we know the upper 16 bytes and the lower 16 bytes, leaving 8 bytes in the middle unknown. But what we need to remember, here we have a value of `281439193^-1 * m` and the masked value is only 36 bits. `36 bits` is very feasible for bruteforce, but if we use gmp, bruteforce takes a long time on my laptop. So the idea is to reduce the possibility by `checking printable strings` in 36 bits `bruteforce` and then checking with the `RSA encryption operation`, following is the script we use

```cpp
#include <iostream>
#include <thread>
#include <vector>
#include <mutex>
#include <atomic>
#include <iomanip>
#include <string>
#include <chrono>
#include <cstring>

struct BigInt {
    uint64_t data[8];
    int size;
   
    BigInt() : size(0) {
        memset(data, 0, sizeof(data));
    }
   
    BigInt(uint64_t val) : size(val ? 1 : 0) {
        memset(data, 0, sizeof(data));
        if (val) data[0] = val;
    }
   
    void set_from_hex(const char* hex) {
        memset(data, 0, sizeof(data));
        size = 0;
       
        int len = strlen(hex);
        int word_idx = 0;
       
        for (int i = len - 1; i >= 0 && word_idx < 8; i -= 16) {
            uint64_t word = 0;
            int start = (i >= 15) ? i - 15 : 0;
           
            for (int j = start; j <= i; j++) {
                char c = hex[j];
                uint64_t digit;
                if (c >= '0' && c <= '9') digit = c - '0';
                else if (c >= 'a' && c <= 'f') digit = c - 'a' + 10;
                else if (c >= 'A' && c <= 'F') digit = c - 'A' + 10;
                else continue;
               
                word = (word << 4) | digit;
            }
           
            data[word_idx++] = word;
            if (word) size = word_idx;
        }
    }
   
    BigInt operator+(const BigInt& other) const {
        BigInt result;
        result.size = std::max(size, other.size);
        uint64_t carry = 0;
       
        for (int i = 0; i < 8; i++) {
            uint64_t a = (i < size) ? data[i] : 0;
            uint64_t b = (i < other.size) ? other.data[i] : 0;
            uint64_t sum = a + b + carry;
           
            result.data[i] = sum;
            carry = (sum < a) ? 1 : 0;
           
            if (result.data[i] && i >= result.size) {
                result.size = i + 1;
            }
        }
       
        return result;
    }
   
    BigInt operator<<(int bits) const {
        if (bits == 0) return *this;
       
        BigInt result;
        int word_shift = bits / 64;
        int bit_shift = bits % 64;
       
        if (word_shift >= 8) return result;
       
        for (int i = 0; i < size && i + word_shift < 8; i++) {
            if (bit_shift == 0) {
                result.data[i + word_shift] = data[i];
            } else {
                result.data[i + word_shift] |= data[i] << bit_shift;
                if (i + word_shift + 1 < 8) {
                    result.data[i + word_shift + 1] = data[i] >> (64 - bit_shift);
                }
            }
        }
       
        for (int i = 7; i >= 0; i--) {
            if (result.data[i]) {
                result.size = i + 1;
                break;
            }
        }
       
        return result;
    }
   
    BigInt operator*(uint64_t multiplier) const {
        BigInt result;
        uint64_t carry = 0;
       
        for (int i = 0; i < size && i < 7; i++) {
            __uint128_t prod = (__uint128_t)data[i] * multiplier + carry;
            result.data[i] = (uint64_t)prod;
            carry = prod >> 64;
        }
       
        if (carry && size < 8) {
            result.data[size] = carry;
        }
       
        for (int i = 7; i >= 0; i--) {
            if (result.data[i]) {
                result.size = i + 1;
                break;
            }
        }
       
        return result;
    }
   
    void to_bytes(unsigned char* bytes, int& byte_count) const {
        byte_count = 0;
        for (int i = 0; i < size; i++) {
            uint64_t word = data[i];
            for (int j = 0; j < 8; j++) {
                bytes[byte_count++] = word & 0xFF;
                word >>= 8;
                if (byte_count >= 64) return;
            }
        }
    }
};

class BruteForcer {
private:
    BigInt known_high, known_low;
    static constexpr uint64_t KNOWN_MULTIPLIER = 281439193;
    static constexpr uint64_t MAX_X = 0xfffffffffull;
    static constexpr int K = 128;
   
    static constexpr char PRINTABLE_CHARS[] =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        "!\"#$'-@^_{|}";
   
    std::mutex output_mutex;
    std::atomic<uint64_t> progress_counter{0};
   
    bool is_printable[256];
   
    void init_values() {
        known_high.set_from_hex("45f0f5f1b3a44336b8f40e37f1f6257f00000000000000000000000000000000000000000");
       
        known_low.set_from_hex("eb38d051dd66b16998604b2d8305c945");
       
        // Initialize printable lookup
        std::memset(is_printable, false, sizeof(is_printable));
        for (char c : PRINTABLE_CHARS) {
            if (c != '\0') {
                is_printable[(unsigned char)c] = true;
            }
        }
    }
   
    int check_printable_suffix(const BigInt& value) {
        unsigned char bytes[64];
        int byte_count;
        value.to_bytes(bytes, byte_count);
       
        if (byte_count == 0) return 0;
       
        int counter = 0;
        for (int i = byte_count - 1; i >= 0; i--) {
            if (is_printable[bytes[i]]) {
                counter++;
            } else {
                break;
            }
        }
       
        return counter;
    }
   
    void extract_suffix(const BigInt& value, int length, std::string& result) {
        result.clear();
        if (length == 0) return;
       
        unsigned char bytes[64];
        int byte_count;
        value.to_bytes(bytes, byte_count);
       
        int start = std::max(0, byte_count - length);
        for (int i = byte_count - 1; i >= start; i--) {
            result += (char)bytes[i];
        }
    }
   
    void worker_thread(uint64_t start, uint64_t end, int thread_id) {
        std::string suffix_str;
        uint64_t local_progress = 0;
       
        for (uint64_t x = start; x < end; x++) {
            BigInt x_big(x);
            BigInt x_shifted = x_big << K;
            BigInt m = known_high + x_shifted + known_low;
           
            BigInt result = m * KNOWN_MULTIPLIER;
           
            int length = check_printable_suffix(result);
           
            if (length == 40) {
                extract_suffix(result, length, suffix_str);
               
                std::lock_guard<std::mutex> lock(output_mutex);
                std::cout << "Thread " << thread_id
                        << ": 0x" << std::hex << x
                        << " -> \"" << suffix_str
                        << "\" (length: " << std::dec << length << ")\n";
            }
           
            local_progress++;
            if (local_progress % 100000 == 0) {
                progress_counter.fetch_add(100000);
            }
        }
       
        progress_counter.fetch_add(local_progress % 100000);
    }
   
public:
    BruteForcer() {
        init_values();
    }
   
    void run_bruteforce() {
        auto start_time = std::chrono::high_resolution_clock::now();
       
        unsigned int num_threads = std::thread::hardware_concurrency();
        if (num_threads == 0) num_threads = 8;
       
        std::cout << "Starting brute force with " << num_threads << " threads...\n";
        std::cout << "Target range: 0x0 to 0x" << std::hex << MAX_X << std::dec << "\n";
       
        std::vector<std::thread> threads;
        uint64_t range_per_thread = (MAX_X + 1) / num_threads;
       
        for (unsigned int i = 0; i < num_threads; i++) {
            uint64_t start = i * range_per_thread;
            uint64_t end = (i == num_threads - 1) ? MAX_X + 1 : (i + 1) * range_per_thread;
           
            threads.emplace_back(&BruteForcer::worker_thread, this, start, end, i);
        }
       
        std::thread progress_thread([this, start_time]() {
            while (true) {
                std::this_thread::sleep_for(std::chrono::seconds(10));
                uint64_t current_progress = progress_counter.load();
                auto current_time = std::chrono::high_resolution_clock::now();
                auto elapsed = std::chrono::duration_cast<std::chrono::seconds>(
                    current_time - start_time).count();
               
                if (elapsed > 0) {
                    double rate = static_cast<double>(current_progress) / elapsed;
                    double percentage = (static_cast<double>(current_progress) / (MAX_X + 1)) * 100;
                   
                    std::cout << "Progress: " << std::fixed << std::setprecision(4)
                            << percentage << "% (" << current_progress
                            << " / " << (MAX_X + 1) << ") at "
                            << std::setprecision(0) << rate << " ops/sec\n";
                }
            }
        });
        progress_thread.detach();
       
        for (auto& thread : threads) {
            thread.join();
        }
       
        auto end_time = std::chrono::high_resolution_clock::now();
        auto total_time = std::chrono::duration_cast<std::chrono::seconds>(
            end_time - start_time).count();
       
        std::cout << "\nBrute force completed in " << total_time << " seconds.\n";
        std::cout << "Total operations: " << (MAX_X + 1) << "\n";
        if (total_time > 0) {
            std::cout << "Average rate: " << ((MAX_X + 1) / total_time) << " ops/sec\n";
        }
    }
};

int main() {
   
    BruteForcer bruteforcer;
    bruteforcer.run_bruteforce();
   
    return 0;
}
```

And it turns out there are still a lot of results, but it's quite fast for bruteforce,  it takes only `216` seconds.

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXeOgzCyhPcI3FMEu8_UhuwomGPrPc-TAxyc3kC_sT1aFqBVnuuIIHOeIGsmnLTRMVipYae0qv7a5wC8f-n8SKjNzhEuC-G1u6p9ycHs46bGw0XsDt0590chValIiyYrYAGXlUfmvQ?key=c3e_Ogduzon_K-QvFEHtTg" alt=""><figcaption></figcaption></figure>

So for the last step, just validate the output above with RSA encryption operation.

```python
from Crypto.Util.number import *
import tqdm

f = open("dump", "rb").read().split(b"\n")

e = 65537
n = 63686795902568024374944372787412597132007625574475098565707727144618302077570247392305129229218512259862339300716424676585013339748967983263997816560648507138498671031314175191176311229996512263412506264600871330817568860857008302796040565216525599417563357681462219055575638465029437873378710588138739427113
ct = 8717065237987492848661920003758342953305428888421425914846537078966524119341118366703749570869577952286020776960623751663747114868989732824248215682588528870349912550410298201993986186072379913809132388074560699148498631553476414636997390299946544788942652394762555484334049857638184796200285667185588259991

for i in tqdm.tqdm(f):
pt = i.split(b" -> \"")[-1].split(b"\" (")[0]
if pow(bytes_to_long(pt), e, n) == ct:
print(pt)
break
```

<figure><img src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXf7jPoi4F1PngJW8Y6pMRfsGHeyMlTFe2evYSZoMBbHEFMT2hSFvwEuZ7kY2rHvSaTE4zPIfqv21ehNQhDkEj3hcemL3HxE4aUiO2aeydpnna4AfFeKAXe7snhOY401a4XBbxBmBw?key=c3e_Ogduzon_K-QvFEHtTg" alt=""><figcaption></figcaption></figure>

Flag: ITSEC{Secrets\_don't\_stay\_buried\_forever}

## Simple RSA

### Description

\-

### Solution

Given following data

```python
n=46014922953495823590792625328453518537759942907385288519972078748310115766076552700510034869862113134248890854832840744264858628129833098791884587479017453857115837697620445597251303101376348636616052018461298256839495151809137245487519880704838153895045646394408937224134545491323473393082791677399084623521903889071358476406581797209920917897120552647085367045771350369928714101952885552482344272084295440750349944373207286646963542000298850932632533690423253410522645569134022639503146287927023894946464828496242988631752199042717365408818100180895221911662249505805008325089437657448443933868958820817910558471293
e=268435459
c=11314339403359567780692601069815710743165402544988203918151340837645606912959402641126954145280660570762982247771917542719878231291766614862358489243957964439916749413680930944615063921439539055825420053337614980961682681555035169099974121913924178155258600619452395067299085627896352720005233379231312709290583412444031184554596453797817161128552414571518324581806767819754389759232708355060229677061961742874649289853359807929735947675898971334344822872967188360102835994032157447342986467879631904720037815396636573047116651469718152143887897849178164454377805656650083129515711040911387971255712009611360895624486
```

and following hints

```
If you pay attention to the bit length of N, instead of the typical 2048, it is 2049, which also happens to have prime factor of 3 x 683. From this, you can suspect, N=pqr, where each prime is 683 bits.
It becomes more obvious once you recover one of the prime: you'll have 683 bits x 1366 bits. Doesn't that 1366-bit number look like it could be 683 bits x 683 bits?
This is NOT blind guessing, you just need to apply heuristics on common techniques against the likeliest vulnerable parameter out of just 3 parameters :)
But, to make this more enjoyable, I can tell you that: one of them is smooth, and the other two are close to each other. 
```

From hints above we can know that n is `2049 bits` and each factor is `683 bits`. One factor is smooth and two others are close to each other. From the hints we've following idea

* Find `smooth` factor first, let's call it p
  * There are several methods can be used, such as pollard p-1 and williams p+1
* After found p, for qr we can use `fermat factorization` because it is close each other

```python
from math import gcd, isqrt, log
from Crypto.Util.number import isPrime

def primegen():
    yield 2; yield 3; yield 5; yield 7; yield 11; yield 13
    ps = primegen() # yay recursion
    p = next(ps) and next(ps)
    q, sieve, n = p**2, {}, 13
    while True:
        if n not in sieve:
            if n < q: yield n
            else:
                _next, step = q + 2*p, 2*p
                while _next in sieve: _next += step
                sieve[_next] = step
                p = next(ps)
                q = p**2
        else:
            step = sieve.pop(n)
            _next = n + step
            while _next in sieve: _next += step
            sieve[_next] = step
        n += 2
 
def williams_pp1(n):
    counter = 0
    if isPrime(n) : return n
    while True:
        v = counter
        for p in primegen():
            e = int(log(isqrt(n), p))
            if e == 0: break
            for _ in range(e): 
                # Multiplies along a Lucas sequence modulo n
                v1, v2 = v, (v**2 - 2) % n
                for bit in bin(p)[3:]: 
                    if bit == "0" :
                        v1, v2 = ((v1**2 - 2) % n, (v1*v2 - v) % n)  
                    else :
                        v1, v2 = ((v1*v2 - v) % n, (v2**2 - 2) % n)
                v = v1
            g = gcd(v - 2, n)
            if 1 < g < n: 
                if gcd(n, g) != 1 :
                    n = n//g
                    print(f'factor found :{g}')
                    return g
            if g == n: break
        counter += 1
        v = counter

def fermat(qr):
    a = isqrt(qr)
    if a * a < qr:
        a += 1
    while True:
        b2 = a*a - qr
        b = isqrt(b2)
        if b * b == b2:
            q = a - b
            r = a + b
            return min(q, r), max(q, r)
        a += 1

n = 46014922953495823590792625328453518537759942907385288519972078748310115766076552700510034869862113134248890854832840744264858628129833098791884587479017453857115837697620445597251303101376348636616052018461298256839495151809137245487519880704838153895045646394408937224134545491323473393082791677399084623521903889071358476406581797209920917897120552647085367045771350369928714101952885552482344272084295440750349944373207286646963542000298850932632533690423253410522645569134022639503146287927023894946464828496242988631752199042717365408818100180895221911662249505805008325089437657448443933868958820817910558471293
p = williams_pp1(n)
qr = n//p

# fermat
q,r = fermat(qr)

assert p * q * r == n
assert isPrime(p)
assert isPrime(q)
assert isPrime(r)

print(f"{p=}")
print(f"{q=}")
print(f"{r=}")
```

```python
p=29906591200427337732911827072306735167220533638105041589288730085906918226500842262342281681121437656595725298762299785960877825391734892091466219947376910976262750495524303991050545210767665126091584077823
q=39225265555453163684571837057806618968140394621048907860106615643309928660700514537844938872455024259489200649787364179300558013475196956357648939428682825826489818804581118189132839176455636948201665355867
r=39225265555453163684571837057806618968140394621048907860106615643309928660700514537844938872455024259489200649787364179300558013475196956357648939428682825826489818804581118189132839176455636948248494778873
```

When we try to do the decryption it failed and when we check the exponent we know that the exponent divides phi(n).

```python
phi = (p-1) * (q-1) * (r-1)
print("d",inverse(e, phi), phi % e) # d 1 0
```

Because of that, we need to check that which factor of phi can be `divided` by e and we found that q-1 is divided e. So the idea constructing m by only utilizing factor p and r

$$
d\_p \equiv e^{-1} \pmod{p-1}, \quad
d\_r \equiv e^{-1} \pmod{r-1}\\
$$

Then compute `mp` and `mr`

$$
m\_p \equiv c^{d\_p} \pmod{p}\\
m\_r \equiv c^{d\_r} \pmod{r}
$$

And we can construct m using `CRT`

$$
m \equiv m\_p \pmod{p}\\
m \equiv m\_r \pmod{r}
$$

Following is our final script to solve the challenge

```python
from math import gcd, isqrt, log
from Crypto.Util.number import *
import libnum

def primegen():
    yield 2; yield 3; yield 5; yield 7; yield 11; yield 13
    ps = primegen() # yay recursion
    p = next(ps) and next(ps)
    q, sieve, n = p**2, {}, 13
    while True:
        if n not in sieve:
            if n < q: yield n
            else:
                _next, step = q + 2*p, 2*p
                while _next in sieve: _next += step
                sieve[_next] = step
                p = next(ps)
                q = p**2
        else:
            step = sieve.pop(n)
            _next = n + step
            while _next in sieve: _next += step
            sieve[_next] = step
        n += 2
 
def williams_pp1(n):
    counter = 0
    if isPrime(n) : return n
    while True:
        v = counter
        for p in primegen():
            e = int(log(isqrt(n), p))
            if e == 0: break
            for _ in range(e): 
                # Multiplies along a Lucas sequence modulo n
                v1, v2 = v, (v**2 - 2) % n
                for bit in bin(p)[3:]: 
                    if bit == "0" :
                        v1, v2 = ((v1**2 - 2) % n, (v1*v2 - v) % n)  
                    else :
                        v1, v2 = ((v1*v2 - v) % n, (v2**2 - 2) % n)
                v = v1
            g = gcd(v - 2, n)
            if 1 < g < n: 
                if gcd(n, g) != 1 :
                    n = n//g
                    print(f'factor found :{g}')
                    return g
            if g == n: break
        counter += 1
        v = counter

def fermat(qr):
    a = isqrt(qr)
    if a * a < qr:
        a += 1
    while True:
        b2 = a*a - qr
        b = isqrt(b2)
        if b * b == b2:
            q = a - b
            r = a + b
            return min(q, r), max(q, r)
        a += 1

e = 268435459
c = 11314339403359567780692601069815710743165402544988203918151340837645606912959402641126954145280660570762982247771917542719878231291766614862358489243957964439916749413680930944615063921439539055825420053337614980961682681555035169099974121913924178155258600619452395067299085627896352720005233379231312709290583412444031184554596453797817161128552414571518324581806767819754389759232708355060229677061961742874649289853359807929735947675898971334344822872967188360102835994032157447342986467879631904720037815396636573047116651469718152143887897849178164454377805656650083129515711040911387971255712009611360895624486
n = 46014922953495823590792625328453518537759942907385288519972078748310115766076552700510034869862113134248890854832840744264858628129833098791884587479017453857115837697620445597251303101376348636616052018461298256839495151809137245487519880704838153895045646394408937224134545491323473393082791677399084623521903889071358476406581797209920917897120552647085367045771350369928714101952885552482344272084295440750349944373207286646963542000298850932632533690423253410522645569134022639503146287927023894946464828496242988631752199042717365408818100180895221911662249505805008325089437657448443933868958820817910558471293
p = williams_pp1(n)
qr = n//p

q,r = fermat(qr)

assert p * q * r == n
assert isPrime(p)
assert isPrime(q)
assert isPrime(r)

print(f"{p=}")
print(f"{q=}")
print(f"{r=}")

dp = inverse(e, p - 1)
dr = inverse(e, r - 1)

mp = pow(c, dp, p)
mr = pow(c, dr, r)

print(long_to_bytes(libnum.solve_crt([mp, mr], [p, r])))
```

<figure><img src="https://329253018-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FIYUhWFsdATjBxpgp6f6z%2Fuploads%2Fev6Zbcro7Za8a2yZfcuJ%2Fimage.png?alt=media&amp;token=71223677-dd01-4f77-8f50-bfce030ee382" alt=""><figcaption></figcaption></figure>

Flag: ITSEC{tH4Ts\_WhY\_M4th\_iS\_Be4UTiFuL\_&\_iMPoRt4nt!!!}
