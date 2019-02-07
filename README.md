# What is this about?
This is a prototyping playground for exploring ES6 generators. The code is not production-ready or reliable in any way, reuse for any other purpose than fiddling around is **strongly discouraged** as generators are a perfect way to shoot yourself in the foot.

# Stream
The `Stream` implementation recreates Javascript's Array methods `map()`, `filter()`, `some()`, and `every()` (besides other enhancements) using generator under the hood. This is very memory-efficient as values are produced on demand rather than created in memory upfront.
Take the following example:

```javascript
function* range(upTo) {
    for (let i = 0; i < upTo; i++) {
        yield i;
    }
}

Stream
    .from(range(1e53))
    .page(1e6, 3)
    .map(n => n ** 2)
    .toArray()
    .forEach((item, index) => console.log(`[${index}]: ${item}`));
```

which outputs

```text
[0]: 899999820000009
[1]: 899999880000004
[2]: 899999940000001
```

`range(1e53)` creates a generator producing a huge range of numbers from 0 to its upper limit, i.e. `[0, 1, 2, ...., 1e53 - 1]`. The pagination skips `(1e6 - 1) * 3` items, then taking 3 items. (So imagine this to be the 1-millionth page of size 3 of the initial range). Those three items are mapped to their squares.

Up to that point in the stream, no single value has been put to memory. It is only generators wrapping generators being wrapped by the `Stream`. Only when executing `.toArray()`, values start being produced. As every generator never holds a list, this is just CPU-intensive, but memory-efficient (as no Array needs to be in Memory anywhere).

The stream can be thought of like a pipeline values are being pulled through one by one, the pull being created by anything that wants actual values, like `stream.toArray()` or `[... stream]`. 

Another example:

```javascript
const stream = Stream
    .from(range(20))
    .filter(v => v === 3 || v === 7 || v === 9)
    .map(c => c * 2)
    .take(2);

console.log([...stream]);
```

which outputs

```text
6 14
```

If you output the stream itself:

```javascript
console.log(stream);
```

there is some nice introspection which calls are chained to the source `_iterable` and of which type it is:

```text
Stream {
  _iterable: Object [Generator] {},
  _chain: '[object Generator] > filter > map > take' }
```