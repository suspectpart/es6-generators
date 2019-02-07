/* eslint-disable no-undef */

const {
    count,
    reverse,
    repeat,
    cycle,
    range,
    countdown,
    Stream
} = require('./lib');
const assert = require('assert');

describe("Stream", () => {
    it("maps items", () => {
        // Arrange
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const expected = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100];

        // System under Test
        const stream = new Stream(items);

        // Act
        const mapped = stream.map(i => i ** 2);

        // Assert
        assert.deepEqual([...mapped], expected);
    });

    it("filters items", () => {
        // Arrange
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const expected = [6, 7, 8, 9, 10];

        // System under Test
        const stream = new Stream(items);

        // Act
        const filtered = stream.filter(i => i > 5);

        // Assert
        assert.deepEqual([...filtered], expected);
    });

    it("succeeds matching some", () => {
        // Arrange
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        // System under Test
        const stream = new Stream(items);

        // Act
        const hasSome = stream.some(i => i > 5);

        // Assert
        assert(hasSome);
    });

    it("fails matching some", () => {
        // Arrange
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        // System under Test
        const stream = new Stream(items);

        // Act
        const hasSome = stream.some(i => i > 10);

        // Assert
        assert(!hasSome);
    });

    it("succeeds matching every", () => {
        // Arrange
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        // System under Test
        const stream = new Stream(items);

        // Act
        const every = stream.every(i => i < 11);

        // Assert
        assert(every);
    });

    it("converts to Array", () => {
        // Arrange
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        // System under Test
        const stream = new Stream(items);

        // Act
        const array = stream.toArray();

        // Assert
        assert.deepEqual(items, array);
    });

    it("fails matching every", () => {
        // Arrange
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

        // System under Test
        const stream = new Stream(items);

        // Act
        const every = stream.every(i => i < 10);

        // Assert
        assert(!every);
    });

    it("skips elements", () => {
        // Arrange
        const iterable = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const expected = [3, 4, 5, 6, 7, 8, 9, 10];

        // System Under Test
        const stream = Stream.from(iterable);

        // Act
        const skipped = stream.skip(3);

        // Assert
        assert.deepEqual([...skipped], expected)

    });

    it("paginates", () => {
        // Arrange
        const iterable = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const expected = [6, 7, 8];

        // System Under Test
        const stream = Stream.from(iterable);

        // Act
        const page = stream.page(3, 3);

        // Assert
        assert.deepEqual([...page], expected)

    });

    it("chains calls", () => {
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const expected = [11, 13, 15];

        // Act
        const result = Stream
            .from(items)
            .filter(i => i > 4)
            .filter(i => i < 8)
            .map(i => i * 2)
            .map(i => i + 1)
            .toArray();

        // Assert
        assert.deepEqual(result, expected);
    });

    it("intercepts items", () => {
        // Arrange
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const expected = [6, 7, 8, 9, 10];
        const inspected = [];

        const stream = Stream
            .from(items)
            .filter(i => i > 5);

        // Act
        stream.intercept(i => inspected.push(i)).toArray();

        // Assert
        assert.deepEqual(inspected, expected);
    })
});

describe("cycle", () => {
    it("works with no elements", () => {
        // Arrange
        const iterable = [];

        // System under test
        const c = cycle(iterable);

        // Assert
        assert.deepEqual(c.next().value, undefined);
        assert.deepEqual(c.next().value, undefined);
        assert.deepEqual(c.next().value, undefined);
    });

    it("works with one element", () => {
        // Arrange
        const iterable = [1];

        // System under test
        const c = cycle(iterable);

        // Assert
        assert.deepEqual(c.next().value, 1);
        assert.deepEqual(c.next().value, 1);
        assert.deepEqual(c.next().value, 1);
    });

    it("works with many elements", () => {
        // Arrange
        const iterable = [1, 2, 3];

        // System under test
        const c = cycle(iterable);

        // Assert
        assert.deepEqual(c.next().value, 1);
        assert.deepEqual(c.next().value, 2);
        assert.deepEqual(c.next().value, 3);
        assert.deepEqual(c.next().value, 1);
        assert.deepEqual(c.next().value, 2);
        assert.deepEqual(c.next().value, 3);
    });
});

describe("repeat", () => {
    it('works with strings', function () {
        // Arrange
        const value = "yes";

        // System under test
        const r = repeat(value);

        // Assert
        assert.deepEqual(r.next().value, value);
        assert.deepEqual(r.next().value, value);
        assert.deepEqual(r.next().value, value);
        assert.deepEqual(r.next().value, value);
        assert.deepEqual(r.next().value, value);
    });
});

describe("reverse", () => {
    it('reverses a list', function () {
        // Arrange
        const iterable = [1, 2, 3, 4, 5];
        const expected = [5, 4, 3, 2, 1];

        // System under test
        const reversed = reverse(iterable);

        // Assert
        assert.deepEqual([...reversed], expected);
    });

    it('fails to reverse anything other than lists', function () {
        // Arrange
        const generator = function* () {
        };

        const s = reverse(generator);

        // Assert
        assert.throws(() => [...s], {name: "TypeError"})
    });
});

describe("range", () => {
    it('ranges', function () {
        // Arrange
        const upTo = 5;
        const expected = [0, 1, 2, 3, 4];

        // System under test
        const range_ = range(upTo);

        // Assert
        assert.deepEqual([...range_], expected);
    });
});

describe("count", () => {
    it('counts', function () {
        // Arrange
        const start = 5;

        // System under test
        const c = count(start);

        // Assert
        assert.equal(c.next().value, 5);
        assert.equal(c.next().value, 6);
        assert.equal(c.next().value, 7);
        assert.equal(c.next().value, 8);
        assert.equal(c.next().value, 9);
    });
});


describe("countdown", () => {
    it('counts down', function () {
        // Arrange
        const from = 5;
        const expected = [5, 4, 3, 2, 1, 0];

        // System under test
        const countdown_ = countdown(from);

        // Assert
        assert.deepEqual([...countdown_], expected);
    });
});