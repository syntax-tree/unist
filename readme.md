# ![Unist](https://cdn.rawgit.com/wooorm/unist/master/logo.svg)

**Unist** (**uni**versal **s**yntax **t**ree) is the combination of three project, and more
to come, which are the summation of at least [two](https://github.com/wooorm/retext/commit/8fcb1ff4874d1891791280d63125d27ed29b58a8)
[years](https://github.com/wooorm/remark/commit/19585b8) of my work and the
current epitome of that.

It’s basically a system for processing input: parsing it into a syntax tree,
transforming it by plug-ins, and compiling the tree to something else.

This document explains some terminology relating to
[**retext**](https://github.com/wooorm/retext),
[**remark**](https://github.com/wooorm/remark), [**hast**](https://github.com/wooorm/hast),
and their related projects.

## Unist nodes

**Unist nodes**:

*   must have a `type` property set to a to its namespace semantic
    `string`;

*   may have either a `value` property set to a `string` or a `children`
    property set to an array of zero or more `Unist` nodes;

*   may have a `data` property set to a `JSON.stringify`able object;

*   may have a `position` property set to a an object containing `start` and
    `end`, both of which contain an object with `line` and `column` set
    to an integer referencing their respective (1-based) line and column
    in the input file. Both may have an `offset` property set to its
    index from the beginning of the input.
    The object at `position` may additionally have an `indent` property
    set to an array of integers higher than 0 (not including), in which
    case the node represents content which spans multiple lines prefixed
    with content which is not part of the node.
    If a node represents something not available in the original input, it
    must not have a `position`.

See [**nlcst**](https://github.com/wooorm/nlcst) for more information
on **retext** nodes, [**mdast**](https://github.com/wooorm/mdast)
for information on **remark** nodes, and [`hast#nodes`](https://github.com/wooorm/hast#nodes)
for information on **hast** nodes.

## Unist files

**Unist files** are virtual files (such as [**vfile**](https://github.com/wooorm/vfile))
representing content at a certain location. They are not limited to existing
files. Neither are they limited to the file-system only.

## Unist utilities

**Unist utilities** are function which work with **unist nodes** or **unist files**, agnostic
of **remark**, **retext**, or **hast**.

A list of **VFile**-related utilities can be found at [**vfile**](https://github.com/wooorm/vfile).

### Unist node utilties

*   [`unist-util-find-after`](https://github.com/wooorm/unist-util-find-after)
    — Find a node after another node;

*   [`unist-util-find-all-after`](https://github.com/wooorm/unist-util-find-all-after)
    — Find nodes after another node;

*   [`unist-util-find-all-before`](https://github.com/wooorm/unist-util-find-all-before)
    — Find nodes before another node;

*   [`unist-util-find-before`](https://github.com/wooorm/unist-util-find-before)
    — Find a node before another node;

*   [`unist-util-inspect`](https://github.com/wooorm/unist-util-inspect)
    — Node inspector;

*   [`unist-util-is`](https://github.com/wooorm/unist-util-is)
    — Check if a node passes a test

*   [`unist-util-modify-children`](https://github.com/wooorm/unist-util-modify-children)
    — Modify direct children of a parent;

*   [`unist-util-parents`](https://github.com/eush77/unist-util-parents)
    — `parent` references on nodes;

*   [`unist-util-select`](https://github.com/eush77/unist-util-select)
    — Select nodes with CSS-like selectors;

*   [`unist-util-visit`](https://github.com/wooorm/unist-util-visit)
    — Recursively walk over nodes;

*   [`unist-util-visit-children`](https://github.com/wooorm/unist-util-visit-children)
    — Visit direct children of a parent;

*   [`unist-builder`](https://github.com/eush77/unist-builder)
    — Helper for creating trees.
