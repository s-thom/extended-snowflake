# extended-snowflake, Javascript implementation

## [View on NPM](https://www.npmjs.com/package/extended-snowflake)

## [View on GitHub](https://github.com/s-thom/extended-snowflake)

You'll also find the full README there.

## Javascript Info

* Zero dependencies
* Tiny: ~1kB

### Usage

```js
import {ExtSnowflakeGenerator} from 'extended-snowflake';

// Create generator using an instance ID
const generator = new ExtSnowflakeGenerator(0);

const snowflake = generator.next();

// --- ---

// If using worker + process instead of instance ID:
import {ExtSnowflakeGenerator, combineWorkerProcess} from 'extended-snowflake';

const generator = new ExtSnowflakeGenerator(combineWorkerProcess(0, 0));
```

### Version History

```
2.1.0
  Added unit tests
  Fixed bugs with higher values
2.0.0
  Imports changed, so incrementing major version
  Generator now uses single instance ID, added function to turn worker+process into instance ID
1.0.1
  Fixed bug with string padding
1.0.0
  Initial release
```

## General Info

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
