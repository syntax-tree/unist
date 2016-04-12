# ![Unist][logo]

**Uni**versal **S**yntax **T**ree.

***

**Unist** is the combination of three project, and more to come, which
are the summation of at least [two][first-retext-commit]
[years][first-remark-commit] of my work and the current epitome of that.

It’s basically a system for processing input: parsing it into a syntax tree,
transforming it by plug-ins, and compiling the tree to something else.

This document explains some terminology relating to [**retext**][retext],
[**remark**][remark], [**hast**][hast], and their related projects.

This document describes version 1.0.0 of Unist.
[Changelog »][changelog].

## Unist nodes

See [**nlcst**][nlcst] for more information on **retext** nodes,
[**mdast**][mdast] for information on **remark** nodes, and
[`hast#nodes`][hast-nodes] for information on **hast** nodes.

Subsets of Unist can define new properties on new nodes, and plug-ins
and utilities can define new [`data`][data] properties on nodes.  But,
the values on those properties **must** be JSON values: `string`,
`number`, `object`, `array`, `true`, `false`, or `null`.  This means
that the syntax tree should be able to be converted to and from JSON
and produce the same tree.  For example, in JavaScript, a tree should
be able to be passed through `JSON.parse(JSON.stringify(tree))` and
result in the same values.

### `Node`

Node represents any unit in the Unist hierarchy.  It is an abstract
class.  Interfaces inheriting from **Node** must have a `type` property,
and may have `data` or `location` properties. `type`s are defined by
their namespace.

Subsets of Unist are allowed to define properties on interfaces which
subclass Unist’s abstract interfaces.  For example, [mdast][] defines
a `link` node (subclassing [Parent][]) with a `url` property.

```idl
interface Node {
  type: string;
  data: Data?;
  position: Location?;
}
```

#### `Data`

Data represents data associated with any node.  `Data` is a scope for
plug-ins to store any information.  For example, [`remark-html`][remark-html]
uses `htmlAttributes` to let other plug-ins specify attributes added
to the compiled HTML element.

```idl
interface Data { }
```

#### `Location`

**Location** references a location of a node in a **Unist** file.
**Location** consists of a `start` and `end` position. And, if
relevant, an `indent` property.

When the value represented by a node is not present in the document
corresponding to the syntax tree, it must not have a location. These
nodes are said to be _generated_.

```idl
interface Location {
  start: Position;
  end: Position;
  indent: [uint32 >= 1]?;
}
```

#### `Position`

**Position** contains `line` and `column` set to a (1-based) integer
referencing a position in a **Unist** file.  An `offset` (0-based)
may be used.

```idl
interface Position {
  line: uint32 >= 1;
  column: uint32 >= 1;
  offset: uint32 >= 0?;
}
```

### `Parent`

Nodes containing child nodes inherit the **Parent** ([**Node**](#node))
abstract interface.

```idl
interface Parent <: Node {
    children: [Node];
}
```

### `Text`

Nodes containing a value inherit the **Text** ([**Node**](#node))
abstract interface.

```idl
interface Text <: Node {
    value: string;
}
```

## Unist files

**Unist files** are virtual files (such as [**vfile**][vfile])
representing content at a certain location.  They are not limited to
existing files.  Neither are they limited to the file-system only.

## Unist utilities

**Unist utilities** are function which work with **unist nodes**,
agnostic of **remark**, **retext**, or **hast**.

A list of **VFile**-related utilities can be found at [**vfile**][vfile].

### List of Utilties

*   [`unist-util-filter`](https://github.com/eush77/unist-util-filter)
    — Create a new Unist tree with all nodes that pass the test
    implemented by the provided function;

*   [`unist-util-find-after`](https://github.com/wooorm/unist-util-find-after)
    — Find a node after another node;

*   [`unist-util-find-all-after`](https://github.com/wooorm/unist-util-find-all-after)
    — Find nodes after another node;

*   [`unist-util-find-all-before`](https://github.com/wooorm/unist-util-find-all-before)
    — Find nodes before another node;

*   [`unist-util-find-before`](https://github.com/wooorm/unist-util-find-before)
    — Find a node before another node;

*   [`unist-util-index`](https://github.com/eush77/unist-util-index)
    — Index nodes by property or computed key;

*   [`unist-util-inspect`](https://github.com/wooorm/unist-util-inspect)
    — Node inspector;

*   [`unist-util-is`](https://github.com/wooorm/unist-util-is)
    — Check if a node passes a test

*   [`unist-util-modify-children`](https://github.com/wooorm/unist-util-modify-children)
    — Modify direct children of a parent;

*   [`unist-util-parents`](https://github.com/eush77/unist-util-parents)
    — `parent` references on nodes;

*   [`unist-util-remove`](https://github.com/eush77/unist-util-remove)
    — Remove nodes from Unist trees;

*   [`unist-util-remove-position`](https://github.com/wooorm/unist-util-remove-position)
    — Remove `position`s from a unist tree;

*   [`unist-util-select`](https://github.com/eush77/unist-util-select)
    — Select nodes with CSS-like selectors;

*   [`unist-util-visit`](https://github.com/wooorm/unist-util-visit)
    — Recursively walk over nodes;

*   [`unist-util-visit-children`](https://github.com/wooorm/unist-util-visit-children)
    — Visit direct children of a parent;

*   [`unist-builder`](https://github.com/eush77/unist-builder)
    — Helper for creating trees.

<!-- Definitions -->

[logo]: https://cdn.rawgit.com/wooorm/unist/master/logo.svg

[changelog]: https://github.com/wooorm/unist/releases

[first-retext-commit]: https://github.com/wooorm/retext/commit/8fcb1ff

[first-remark-commit]: https://github.com/wooorm/remark/commit/19585b8

[retext]: https://github.com/wooorm/retext

[remark]: https://github.com/wooorm/remark

[hast]: https://github.com/wooorm/hast

[nlcst]: https://github.com/wooorm/nlcst

[mdast]: https://github.com/wooorm/mdast

[hast-nodes]: https://github.com/wooorm/hast#nodes

[vfile]: https://github.com/wooorm/vfile

[remark-html]: https://github.com/wooorm/remark-html

[parent]: #parent

[data]: #data
