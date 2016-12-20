# ![Unist][logo]

**Uni**versal **S**yntax **T**ree.

***

**Unist** is the combination of three project, and more to come, which
are the summation of at least [two][first-retext-commit]
[years][first-remark-commit] of my work and the current epitome of that.

It’s a system for processing input: parsing it into a syntax tree,
transforming it through plug-ins, and compiling the tree to something
else.

This document explains some terminology relating to [**retext**][retext],
[**remark**][remark], [**rehype**][rehype], and their related projects.

This document may not be released. See [releases][] for released
documents.

## Table of Contents

*   [Unist nodes](#unist-nodes)
    *   [Node](#node)
    *   [Parent](#parent)
    *   [Text](#text)
*   [Unist files](#unist-files)
*   [Unist utilities](#unist-utilities)
    *   [List of Utilities](#list-of-utilities)

## Unist nodes

Subsets of Unist can define new properties on new nodes, and plug-ins
and utilities can define new [`data`][data] properties on nodes.  But,
the values on those properties **must** be JSON values: `string`,
`number`, `object`, `array`, `true`, `false`, or `null`.  This means
that the syntax tree should be able to be converted to and from JSON
and produce the same tree.  For example, in JavaScript, a tree should
be able to be passed through `JSON.parse(JSON.stringify(tree))` and
result in the same values.

See [**nlcst**][nlcst] for more information on **retext** nodes,
[**mdast**][mdast] for information on **remark** nodes, and
[**hast**][hast] for information on **rehype** nodes.

### `Node`

A Node represents any unit in the Unist hierarchy.  It is an abstract
interface.  Interfaces extending **Node** must have a `type` property,
and may have `data` or `location` properties.  `type`s are defined by
their namespace.

Subsets of Unist are allowed to define properties on interfaces which
extend Unist’s abstract interfaces.  For example, [mdast][] defines
**Link** ([Parent][]) with a `url` property.

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

**Location** references a range consisting of two points in a [Unist
file][file].  **Location** consists of a `start` and `end` position.
And, if relevant, an `indent` property.

When the value represented by a node is not present in the document
corresponding to the syntax tree at the time of reading, it must not
have a location.  These nodes are said to be _generated_.

```idl
interface Location {
  start: Position;
  end: Position;
  indent: [uint32 >= 1]?;
}
```

#### `Position`

**Position** references a point consisting of two indices in a
[Unist file][file]: `line` and `column`, set to 1-based integers.  An
`offset` (0-based) may be used.

```idl
interface Position {
  line: uint32 >= 1;
  column: uint32 >= 1;
  offset: uint32 >= 0?;
}
```

### `Parent`

Nodes containing other nodes (said to be **children**) extend the
abstract interface **Parent** ([**Node**](#node)).

```idl
interface Parent <: Node {
  children: [Node];
}
```

### `Text`

Nodes containing a value extend the abstract interface **Text**
([**Node**](#node)).

```idl
interface Text <: Node {
  value: string;
}
```

## Unist files

**Unist files** are virtual files (such as [**vfile**][vfile])
representing documents at a certain location.  They are not limited to
existing files, nor to the file-system.

## Unist utilities

**Unist utilities** are functions which work with **unist nodes**,
agnostic of **remark**, **retext**, or **rehype**.

A list of **vfile**-related utilities can be found at [**vfile**][vfile].

### List of Utilities

*   [`unist-util-assert`](https://github.com/syntax-tree/unist-util-assert)
    — Assert Unist nodes;
*   [`unist-util-filter`](https://github.com/eush77/unist-util-filter)
    — Create a new tree with all nodes that pass the given function;
*   [`unist-util-find`](https://github.com/blahah/unist-util-find)
    — Find a node by condition;
*   [`unist-util-find-after`](https://github.com/syntax-tree/unist-util-find-after)
    — Find a node after another node;
*   [`unist-util-find-all-after`](https://github.com/syntax-tree/unist-util-find-all-after)
    — Find nodes after another node;
*   [`unist-util-find-all-before`](https://github.com/syntax-tree/unist-util-find-all-before)
    — Find nodes before another node;
*   [`unist-util-find-before`](https://github.com/syntax-tree/unist-util-find-before)
    — Find a node before another node;
*   [`unist-util-generated`](https://github.com/syntax-tree/unist-util-generated)
    — Check if a node is generated;
*   [`unist-util-index`](https://github.com/eush77/unist-util-index)
    — Index nodes by property or computed key;
*   [`unist-util-inspect`](https://github.com/syntax-tree/unist-util-inspect)
    — Node inspector;
*   [`unist-util-is`](https://github.com/syntax-tree/unist-util-is)
    — Check if a node passes a test
*   [`unist-util-map`](https://github.com/azu/unist-util-map)
    — Create a new tree by mapping nodes;
*   [`unist-util-modify-children`](https://github.com/syntax-tree/unist-util-modify-children)
    — Modify direct children of a parent;
*   [`unist-util-parents`](https://github.com/eush77/unist-util-parents)
    — `parent` references on nodes;
*   [`unist-util-position`](https://github.com/syntax-tree/unist-util-position)
    — Get the position of nodes;
*   [`unist-util-remove`](https://github.com/eush77/unist-util-remove)
    — Remove nodes from Unist trees;
*   [`unist-util-remove-position`](https://github.com/syntax-tree/unist-util-remove-position)
    — Remove `position`s from a unist tree;
*   [`unist-util-select`](https://github.com/eush77/unist-util-select)
    — Select nodes with CSS-like selectors;
*   [`unist-util-source`](https://github.com/syntax-tree/unist-util-source)
    — Get the source of a value (node, location);
*   [`unist-util-stringify-position`](https://github.com/syntax-tree/unist-util-stringify-position)
    — Stringify a node, location, or position;
*   [`unist-util-visit`](https://github.com/syntax-tree/unist-util-visit)
    — Recursively walk over nodes;
*   [`unist-util-visit-parents`](https://github.com/syntax-tree/unist-util-visit-parents)
    — Recursively walk over nodes, with a stack of parents;
*   [`unist-util-visit-children`](https://github.com/syntax-tree/unist-util-visit-children)
    — Visit direct children of a parent;
*   [`unist-builder`](https://github.com/eush77/unist-builder)
    — Helper for creating trees.

<!-- Definitions -->

[logo]: https://cdn.rawgit.com/syntax-tree/unist/76af1b6/logo.svg

[releases]: https://github.com/syntax-tree/unist/releases

[first-retext-commit]: https://github.com/wooorm/retext/commit/8fcb1ff

[first-remark-commit]: https://github.com/wooorm/remark/commit/19585b8

[retext]: https://github.com/wooorm/retext

[remark]: https://github.com/wooorm/remark

[rehype]: https://github.com/wooorm/rehype

[hast]: https://github.com/syntax-tree/hast

[nlcst]: https://github.com/syntax-tree/nlcst

[mdast]: https://github.com/syntax-tree/mdast

[vfile]: https://github.com/vfile/vfile

[remark-html]: https://github.com/wooorm/remark-html

[parent]: #parent

[data]: #data

[file]: #unist-files
