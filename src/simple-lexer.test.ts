import { assertEquals, assertStrictEquals } from "@std/assert";

import { SimpleLexer } from "./simple-lexer.ts";

Deno.test("SimpleLexer.prototype.tokenize()", () => {
    const lexer = new SimpleLexer({
        tokens: {
            "whitespace": /\s+/v,
            "openBrace": "{",
            "closeBrace": "}",
            "openBracket": "[",
            "closeBracket": "]",
            "comma": ",",
            "colon": ":",
            "null": "null",
            "boolean": /true|false/v,
            "number": /-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][\-+]?[0-9]+)?/v,
            "string": /"(?:[^"\\]|\\(?:["\\\/bfnrt]|u[0-9A-Fa-f]{4}))*"/v,
        },
    });

    const input = [
        "{",
        '    "version": 1',
        "}",
    ].join("\n");

    const result = [...lexer.tokenize(input)];

    assertEquals(result, [
        {
            type: "openBrace",
            image: "{",
            startOffset: 0,
            nextOffset: 1,
        },
        {
            type: "whitespace",
            image: "\n    ",
            startOffset: 1,
            nextOffset: 6,
        },
        {
            type: "string",
            image: '"version"',
            startOffset: 6,
            nextOffset: 15,
        },
        {
            type: "colon",
            image: ":",
            startOffset: 15,
            nextOffset: 16,
        },
        {
            type: "whitespace",
            image: " ",
            startOffset: 16,
            nextOffset: 17,
        },
        {
            type: "number",
            image: "1",
            startOffset: 17,
            nextOffset: 18,
        },
        {
            type: "whitespace",
            image: "\n",
            startOffset: 18,
            nextOffset: 19,
        },
        {
            type: "closeBrace",
            image: "}",
            startOffset: 19,
            nextOffset: 20,
        },
    ]);
});

Deno.test("SimpleLexer correctly sets 'ignoreCase' flag", async (t) => {
    await t.step("no option specified", () => {
        const lexer = new SimpleLexer({
            tokens: {
                word: /\w+/,
                space: " ",
            }
        });

        assertStrictEquals(lexer.matchPattern().flags, "y");
    })

    await t.step("ignoreCase: false", () => {
        const lexer = new SimpleLexer({
            tokens: {
                word: /\w+/,
                space: " ",
            },
            ignoreCase: false
        });

        assertStrictEquals(lexer.matchPattern().flags, "y");
    })

    await t.step("ignoreCase: true", () => {
        const lexer = new SimpleLexer({
            tokens: {
                word: /\w+/,
                space: " ",
            },
            ignoreCase: true
        });

        assertStrictEquals(lexer.matchPattern().flags, "iy");
    });

    await t.step("ignoreCase flag in token pattern has no effect", () => {
        const lexer = new SimpleLexer({
            tokens: {
                word: /\w+/i,
                space: " ",
            }
        });

        assertStrictEquals(lexer.matchPattern().flags, "y");
    });
});

Deno.test("SimpleLexer correctly sets Unicode flag", async (t) => {
    await t.step("first RegExp pattern has no Unicode flags", () => {
        const lexer = new SimpleLexer({
            tokens: {
                "aaa": "aaa",
                "bbb": "bbb",
                "ccc": "ccc",
                word: /\w+/,
                space: " ",
            },
        });

        assertStrictEquals(lexer.matchPattern().flags, "y");
    });

    await t.step('first RegExp pattern uses "u" flag', () => {
        const lexer = new SimpleLexer({
            tokens: {
                "aaa": "aaa",
                "bbb": "bbb",
                "ccc": "ccc",
                word: /\w+/u,
                space: " ",
            },
        });

        assertStrictEquals(lexer.matchPattern().flags, "uy");
    });

    await t.step('first RegExp pattern uses "v" flag', () => {
        const lexer = new SimpleLexer({
            tokens: {
                "aaa": "aaa",
                "bbb": "bbb",
                "ccc": "ccc",
                word: /\w+/v,
                space: " ",
            },
        });

        assertStrictEquals(lexer.matchPattern().flags, "vy");
    });

    await t.step("unicodeFlag: null", () => {
        const lexer = new SimpleLexer({
            tokens: {
                "aaa": "aaa",
                "bbb": "bbb",
                "ccc": "ccc",
                word: /\w+/v,
                space: " ",
            },
            unicodeFlag: null,
        });

        assertStrictEquals(lexer.matchPattern().flags, "y");
    });

    await t.step('unicodeFlag: "u"', () => {
        const lexer = new SimpleLexer({
            tokens: {
                "aaa": "aaa",
                "bbb": "bbb",
                "ccc": "ccc",
                word: /\w+/v,
                space: " ",
            },
            unicodeFlag: "u",
        });

        assertStrictEquals(lexer.matchPattern().flags, "uy");
    });

    await t.step('unicodeFlag: "v"', () => {
        const lexer = new SimpleLexer({
            tokens: {
                "aaa": "aaa",
                "bbb": "bbb",
                "ccc": "ccc",
                word: /\w+/v,
                space: " ",
            },
            unicodeFlag: "v",
        });

        assertStrictEquals(lexer.matchPattern().flags, "vy");
    });
});
