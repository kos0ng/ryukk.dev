# Misc

<!-- challenge-index: e8ce30d7b5848984 -->

| Challenge | Topic |
| --- | --- |
| [Super Mario 16 (50 pts)](#super-mario-16-50-pts) | Move, Smart Contract Logic |

<!-- /challenge-index -->

## Super Mario 16 (50 pts)

### Description

Do you like playing Super Mario Bros?

### Solution

Given an archive, lets take a look at framework/challenge/sources/router.move

<pre class="language-rust" data-line-numbers><code class="lang-rust">module challenge::router {
    use aptos_framework::signer;
    use aptos_framework::object::{Object, ExtendRef, Self};
    #[resource_group(scope = global)]
    struct MushroomWorld {}

    #[resource_group_member(group = challenge::router::MushroomWorld)]
    struct Config has key {
        game: address,
        extend_ref: ExtendRef,
        wrapper: address,
    }

    #[resource_group_member(group = challenge::router::MushroomWorld)]
    struct Peach has key {
        kidnapped: bool
    }

    #[resource_group_member(group = challenge::router::MushroomWorld)]
    struct Bowser has key {
        hp: u8
    }

    #[resource_group_member(group = challenge::router::MushroomWorld)]
    struct Mario has key {
        hp: u8
    }

    struct Start has key {}

    public entry fun initialize(account: &#x26;signer) acquires Bowser {
        let account_address = signer::address_of(account);
        assert!(account_address == @challenger, 0);

        let constructor_ref = &#x26;object::create_object(account_address);
        let sender_object_signer = &#x26;object::generate_signer(constructor_ref);
        let extend_ref = object::generate_extend_ref(constructor_ref);

        let constructor_ref_wrapper =
            &#x26;object::create_object(signer::address_of(sender_object_signer));
        let object_wrapper_signer = &#x26;object::generate_signer(constructor_ref_wrapper);

        move_to(object_wrapper_signer, Peach { kidnapped: true });
        move_to(object_wrapper_signer, Bowser { hp: 0 });
        move_to(object_wrapper_signer, Mario { hp: 0 });

        let bowser = object::address_to_object&#x3C;Bowser>(signer::address_of(
                object_wrapper_signer));

        move_to(account,
            Config {
                game: signer::address_of(sender_object_signer),
                extend_ref: extend_ref,
                wrapper: signer::address_of(object_wrapper_signer)
            });
<strong>        set_hp(sender_object_signer, bowser, 254);
</strong>
    }

    public fun set_hp(_account: &#x26;signer, bowser_obj: Object&#x3C;Bowser>, hp: u8) acquires Bowser {
        let bowser = borrow_global_mut&#x3C;Bowser>(object::object_address(&#x26;bowser_obj));
        bowser.hp = hp

    }

    public fun start_game(account: &#x26;signer): address {
        let account_address = signer::address_of(account);
        assert!(!exists&#x3C;Start>(account_address), 1);
        move_to(account, Start {});
        let constructor_ref = &#x26;object::create_object(account_address);
        let sender_object_signer = &#x26;object::generate_signer(constructor_ref);

<strong>        move_to(sender_object_signer, Mario { hp: 0 });
</strong>        object::address_from_constructor_ref(constructor_ref)

    }

    public fun train_mario(account: &#x26;signer, mario_obj: Object&#x3C;Mario>) acquires Mario {
        let account_address = signer::address_of(account);
        assert!(object::owner(mario_obj) == account_address, 2);
        let mario = borrow_global_mut&#x3C;Mario>(object::object_address(&#x26;mario_obj));

<strong>        mario.hp = mario.hp + 2;
</strong>    }

    public fun battle(account: &#x26;signer, mario_obj: Object&#x3C;Mario>) acquires Config, Bowser, Mario, Peach {
        let account_address = signer::address_of(account);
        let mario = borrow_global&#x3C;Mario>(object::object_address(&#x26;mario_obj));

        let config = borrow_global&#x3C;Config>(@challenger);
        let game_address = config.game;
        let wrapper_signer = &#x26;object::generate_signer_for_extending(&#x26;config.extend_ref);
        let bowser = borrow_global&#x3C;Bowser>(config.wrapper);

        if (mario.hp >= bowser.hp) {
            let peach = borrow_global_mut&#x3C;Peach>(config.wrapper);
            peach.kidnapped = false;
        } else {
            object::burn(account, mario_obj);
            if (mario.hp == bowser.hp) {
                //oh really close, take my mario and try again
                let wrapper_signer = &#x26;object::generate_signer_for_extending(&#x26;config.extend_ref);
                let my_mario_obj = object::address_to_object&#x3C;Mario>(config.wrapper);
                object::transfer(wrapper_signer, my_mario_obj, account_address);
            }
        }
    }

    #[view]
    public fun get_game(): address acquires Config {
        borrow_global&#x3C;Config>(@challenger).game
    }

    #[view]
    public fun get_wrapper(): address acquires Config {
        borrow_global&#x3C;Config>(@challenger).wrapper
    }

    public entry fun is_solved(_account: &#x26;signer) acquires Config, Peach {
        let peach = borrow_global&#x3C;Peach>(get_wrapper());
        assert!(!peach.kidnapped, 4);
    }
}
</code></pre>

In this case to get the flag we need to make the peach.kidnapped == false. peach.kidnapped will be false if mario.hp greater or equal than bowser.hp. In line 56 we can see that the bower.hp is 254 and the hp variable size is u8 so the maximum value is 255. Mario hp at initialization is 0, we know it from line 73. To level up the mario hp we can utilize train\_mario function. Because bower.hp is 254 and maximum hp value is 255 so we need to train mario exactly until its hp is 254 because the increment of mario hp is +2 (line 83). Last, lets put the approach in framework-solve/solve/sources/module.move

```rust
module solution::exploit {
    use aptos_framework::signer;
    use challenge::router::{Mario, get_game, start_game, train_mario, battle};
    use aptos_framework::object::{Self};

    public entry fun solve(account: &signer) {
        let mario_address = start_game(account);
        let mario_obj = object::address_to_object<Mario>(mario_address);
        let i = 0;
        while (i < 127) {
            train_mario(account, mario_obj);
            i = i + 1;
        };
        battle(account, mario_obj);
    }
}
```

Flag:&#x20;
