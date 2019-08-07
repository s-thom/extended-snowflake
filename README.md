# extended-snowflake

An ID generation library, based on [Twitter's Snowflake](https://github.com/twitter/snowflake/tree/snowflake-2010) design. It also splits the instance ID into instance/worker, the [same way Discord](https://discordapp.com/developers/docs/reference#snowflakes) does.

Like a normal Snowflake, the IDs are roughly sortable. A generic String sort will group IDs to the millisecond, which is the same as a normal Snowflake.

```
+--------------------+-------------------------------------------------------------+
|     Extension      |                      Twitter Snowflake                      |
+---------+----------+--------+-----------------+-----------+------------+---------+
| 8 bits  | 8 bits   | 1 bit  | 41 bits         | 5 bits    | 5 bits     | 12 bits |
+---------+----------+--------+-----------------+-----------+------------+---------+
| Version | Epoch ID | Unused | #ms since epoch | Worker ID | Process ID | Counter |
+---------+----------+--------+-----------------+-----------+------------+---------+
```

It's really just a couple of bytes in front of a normal Snowflake. The extension defines two variables:

* **Version**  
  * Defined in this version to be `0xA0`.
  * Must start with a "letter" in hex, for easy checking between an extended Snowflake and a normal one
* **Epoch ID**  
  * Number from `0`-`255`
  * Timestamp epochs start on the first millisecond of 1st of January of the year calculated from this number
  * Epoch year calculated by: `(<Epoch ID> * 50) + 2000`
  * Examples:  
    * `0` -> Year 2000
    * `1` -> Year 2050
    * `2` -> Year 2100
    * `255` -> Year 14,750
  * This means IDs shouldn't be generated past the year 14799, and I honestly think we'll have better ID generation before then.

In addition, the **Unused** bit is defined to always be `0`.

## What problems is this solving?

### 41 bits of timestamp only gives ~70 years of IDs

Yes, 70 years is a long time, but it has a limit that's within your users' lifetimes. This library increases the time limit significantly, with a definition for how it may be extended in the future.

### Javascript doesn't do 64 bit integers

Because all numbers in Javascript are doubles Twitter had to modify their API to return string versions of their IDs as well as the number. [Browser support for BigInt](https://caniuse.com/#feat=bigint) is growing, and there are polyfills, but it just feels weird having to polyfill integers just so you can use an ID. To solve this, this library only deals in Strings.

## Future feature proposals

* `0xA1` Use the unused bit from the Twitter snowflake to increase timestamp size. Double epoch interval to 100 years.
* `????` Variable sized fields

## TODO in this repository

* [ ] More languages
* [ ] Unit tests (how to? Need help deciding how to test)
