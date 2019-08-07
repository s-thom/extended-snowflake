# extended-snowflake

An ID generation library, based on [Twitter's Snowflake](https://github.com/twitter/snowflake/tree/snowflake-2010) design. It also splits the instance ID into instance/worker, the [same way Discord](https://discordapp.com/developers/docs/reference#snowflakes) does.

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


## What problems is this solving?

### 41 bits of timestamp only gives ~70 years of IDs

Yes, 70 years is a long time, but it has a limit that's within your users' lifetimes. This library increases the time limit significantly, with a definition for how it may be extended in the future.

### Javascript doesn't do 64 bit integers

[Browser support for BigInt](https://caniuse.com/#feat=bigint) is growing, and there are polyfills, but it just feels weird having to polyfill integers just so you can use an ID. Because all numbers in Javascript are doubles Twitter had to modify their API to return string versions of their IDs as well as the number. To solve this, this library only deals in Strings.
