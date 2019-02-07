/* eslint-disable no-undef, valid-typeof */
/* eslint-disable no-console */
/* eslint-disable require-yield */

/**
 * Wraps an `iterable` which can be a `Generator`, an `Array`, another `Stream` instance or anything implementing
 * the `[Symbol.iterator]` protocol.
 */
class Stream {
    constructor(iterable, chain) {
        const info = () => Array.isArray(this._iterable) ? `Array[${this._iterable.length}]` : this._iterable;

        this._iterable = iterable;
        this._chain = chain || `${info()}`;
    }

    /**
     * Factory method to create a new `Stream` instance from an iterable.
     * @param iterable
     * @returns {Stream}
     */
    static from(iterable) {
        return new Stream(iterable);
    }

    /**
     * Maps all items of the stream with {function_}
     * @param function_
     * @returns {Stream}
     */
    map(function_) {
        function* map_(iterable) {
            for (let item of iterable) {
                yield function_(item);
            }
        }

        return new Stream(map_(this._iterable), this._chain + " > map")
    }

    /**
     * Filters out all items that do not satisfy {predicate}.
     * @param predicate
     * @returns {Stream}
     */
    filter(predicate) {
        function* filter_(iterable) {
            for (let item of iterable) {
                if (predicate(item)) {
                    yield item;
                }
            }
        }

        return new Stream(filter_(this._iterable), this._chain + " > filter");
    }

    /**
     * Skips the next {number} items in the stream.
     * @param number
     * @returns {Stream}
     */
    skip(number) {
        function* skip_(iterable) {
            for (let item of iterable) {
                if (number-- <= 0) {
                    yield item;
                }
            }
        }

        return new Stream(skip_(this._iterable), this._chain + " > skip");
    }

    /**
     * Takes the next {number} items from the stream.
     * @param number
     * @returns {Stream}
     */
    take(number) {
        function* take_(iterable) {
            for (let item of iterable) {
                if (number-- > 0) {
                    yield item;
                } else {
                    break;
                }
            }
        }

        return new Stream(take_(this._iterable), this._chain + " > take");
    }

    /**
     * Returns page `which` with a page size of `pageSize`.
     * This is equivalent to `Stream.skip((which - 1) * pageSize).take(pageSize)`
     * @param which
     * @param pageSize
     * @returns {Stream}
     */
    page(which, pageSize) {
        return this.skip((which - 1) * pageSize).take(pageSize);
    }

    /**
     * Checks whether at least one element in the `Stream` satisfies the `predicate`.
     * @param predicate
     * @returns {boolean}
     */
    some(predicate) {
        for (let item of this._iterable) {
            if (predicate(item)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Checks whether all elements in the `Stream` satisfy the `predicate`.
     * @param predicate
     * @returns {boolean}
     */
    every(predicate) {
        for (let item of this._iterable) {
            if (!predicate(item)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Allows interception of items going through the `Stream` at a certain point.
     * @param function_
     * @returns {Stream}
     */
    intercept(function_) {
        function* intercept_(iterable) {
            for (let item of iterable) {
                function_(item);
                yield item;
            }
        }

        return new Stream(intercept_(this._iterable), this._chain + " > intercept");
    }

    /**
     * Transforms the `Stream` to an Array, executing all generators in the chain.
     * @returns {any[]}
     */
    toArray() {
        return [...this._iterable];
    }

    * [Symbol.iterator]() {
        for (let item of this._iterable) {
            yield item;
        }
    }
}

/**
 * Repeat a single value indefinitely
 * @param value
 * @returns {IterableIterator<*>}
 */
function repeat(value) {
    return cycle([value]);
}

/**
 * Cycle an iterable indefinitely
 * @param iterable
 * @returns {IterableIterator<*>}
 */
function* cycle(iterable) {
    while (true) {
        yield iterable[0];
        iterable.push(iterable.shift());
    }
}

/**
 * Create a range from 0 up to {upTo}
 * @param upTo
 * @returns {IterableIterator<number>}
 */
function* range(upTo) {
    for (let i = 0; i < upTo; i++) {
        yield i;
    }
}

/**
 * Reverses an array
 * @param array
 * @returns {IterableIterator<*>}
 */
function* reverse(array) {
    if (!Array.isArray(array)) {
        throw TypeError("Only Arrays can be reversed");
    }

    for (let i = array.length - 1; i >= 0; i--) {
        yield array[i];
    }
}

/**
 * Counts from {start} upwards indefinitely.
 * @type {{Stream: Stream, cycle: cycle, repeat: (function(*): IterableIterator<*>), reverse: reverse, range: range}}
 */
function* count(start) {
    while (true) {
        yield start++;
    }
}


/**
 * Counts from {start} upwards indefinitely.
 * @type {{Stream: Stream, cycle: cycle, repeat: (function(*): IterableIterator<*>), reverse: reverse, range: range}}
 */
function* countdown(from) {
    while (from >= 0) {
        yield from--;
    }
}


module.exports = {
    Stream,
    cycle,
    repeat,
    reverse,
    range,
    count,
    countdown
};