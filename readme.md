# ![Unist][logo]

**Uni**versal **S**yntax **T**ree.

***

**Unist** is the combination of three syntax trees, and more to come:
[**mdast**][mdast] with [**remark**][remark] for markdown, [**nlcst**][nlcst]
with [**retext**][retext] for prose, and [**hast**][hast] with
[**rehype**][rehype] for HTML.

This document explains some terminology relating to [**unified**][unified] and
[**vfile**][vfile] as well.

This document may not be released. See [releases][] for released
documents. The latest released version is [`1.1.0`](https://github.com/syntax-tree/unist/releases/tag/1.1.0).

## Table of Contents

*   [Unist nodes](#unist-nodes)
    *   [Node](#node)
    *   [Parent](#parent)
    *   [Text](#text)
*   [Glossary](#glossary)
*   [Unist files](#unist-files)
*   [Unist utilities](#unist-utilities)
    *   [List of Utilities](#list-of-utilities)
*   [Contribute](#contribute)
*   [Acknowledgments](#acknowledgments)
*   [License](#license)

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
and may have `data` or `position` properties.  The value of node [type][]s
are defined by their namespace.

Subsets of Unist are allowed to define properties on interfaces which
extend Unist’s abstract interfaces.  For example, [mdast][] defines
**Link** ([Parent][]) with a `url` property.

```idl
interface Node {
  type: string;
  data: Data?;
  position: Position?;
}
```

#### `Data`

Data represents data associated with any node.  `Data` is a scope for
plug-ins to store any information.  For example, [`remark-html`][remark-html]
uses `hProperties` to let other plug-ins specify properties added to the
compiled HTML element.

```idl
interface Data { }
```

#### `Position`

**Position** references a range consisting of two points in a [Unist
file][file].  **Position** consists of a `start` and `end` point.
And, if relevant, an `indent` property.

When the value represented by a node is not present in the document
corresponding to the syntax tree at the time of reading, it must not
have positional information.  These nodes are said to be _generated_.

```idl
interface Position {
  start: Point;
  end: Point;
  indent: [uint32 >= 1]?;
}
```

#### `Point`

**Point** references a point consisting of two indices in a
[Unist file][file]: `line` and `column`, set to 1-based integers.  An
`offset` (0-based) may be used.

```idl
interface Point {
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

## Glossary

###### Tree

A **tree** is a node and all of its [descendants][descendant] (if any).

###### Child

Node X is **child** of node Y, if Y’s `children` include X.

###### Parent

Node X is **parent** of node Y, if Y is a [child][] of X.

###### Index

The **index** of a [child][] is its number of preceding [siblings][sibling], or
`0` if it has none.

###### Sibling

Node X is a **sibling** of node Y, if X and Y have the same
[parent][parent-term] (if any).

The **previous sibling** of a [child][] is its **sibling** at its [index][]
minus 1.

The **next sibling** of a [child][] is its **sibling** at its [index][]
plus 1.

###### Root

The **root** of an object is itself, if without [parent][parent-term] or the
**root** of its [parent][parent-term].

The **root** of a [tree][] is any node in that [tree][] without
[parent][parent-term].

###### Descendant

Node X is **descendant** of node Y, if X is a [child][] of Y, or if X is a
[child][] of node Z that is a **descendant** of Y.

An **inclusive descendant** is a node or one of its **descendants**.

###### Ancestor

Node X is an **ancestor** of node Y, if Y is a [descendant][] of X.

An **inclusive ancestor** is a node or one of its **ancestors**.

###### Head

The **head** of a node is its first [child][] (if any).

###### Tail

The **tail** of a node is its last [child][] (if any).

###### Type

The **type** of a node is the value of its `type` property.

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
    — Assert Unist nodes
*   [`unist-util-filter`](https://github.com/eush77/unist-util-filter)
    — Create a new tree with all nodes that pass the given function
*   [`unist-util-find`](https://github.com/blahah/unist-util-find)
    — Find a node by condition
*   [`unist-util-find-after`](https://github.com/syntax-tree/unist-util-find-after)
    — Find a node after another node
*   [`unist-util-find-all-after`](https://github.com/syntax-tree/unist-util-find-all-after)
    — Find nodes after another node or index
*   [`unist-util-find-all-before`](https://github.com/syntax-tree/unist-util-find-all-before)
    — Find nodes before another node or index
*   [`unist-util-find-all-between`](https://github.com/mrzmmr/unist-util-find-all-between)
    — Find nodes between two nodes or positions
*   [`unist-util-find-before`](https://github.com/syntax-tree/unist-util-find-before)
    — Find a node before another node
*   [`unist-util-flatmap`](https://gitlab.com/staltz/unist-util-flatmap)
    — Create a new tree by expanding a node into many
*   [`unist-util-generated`](https://github.com/syntax-tree/unist-util-generated)
    — Check if a node is generated
*   [`unist-util-index`](https://github.com/eush77/unist-util-index)
    — Index nodes by property or computed key
*   [`unist-util-inspect`](https://github.com/syntax-tree/unist-util-inspect)
    — Node inspector
*   [`unist-util-is`](https://github.com/syntax-tree/unist-util-is)
    — Check if a node passes a test
*   [`unist-util-map`](https://github.com/azu/unist-util-map)
    — Create a new tree by mapping nodes
*   [`unist-util-modify-children`](https://github.com/syntax-tree/unist-util-modify-children)
    — Modify direct children of a parent
*   [`unist-util-parents`](https://github.com/eush77/unist-util-parents)
    — `parent` references on nodes
*   [`unist-util-position`](https://github.com/syntax-tree/unist-util-position)
    — Get positional info of nodes
*   [`unist-util-remove`](https://github.com/eush77/unist-util-remove)
    — Remove nodes from Unist trees
*   [`unist-util-remove-position`](https://github.com/syntax-tree/unist-util-remove-position)
    — Remove positional info from a unist tree
*   [`unist-util-select`](https://github.com/eush77/unist-util-select)
    — Select nodes with CSS-like selectors
*   [`unist-util-source`](https://github.com/syntax-tree/unist-util-source)
    — Get the source of a value (node or position) in a file
*   [`unist-util-stringify-position`](https://github.com/syntax-tree/unist-util-stringify-position)
    — Stringify a node, position, or point
*   [`unist-util-visit`](https://github.com/syntax-tree/unist-util-visit)
    — Recursively walk over nodes
*   [`unist-util-visit-parents`](https://github.com/syntax-tree/unist-util-visit-parents)
    — Recursively walk over nodes, with a stack of parents
*   [`unist-util-visit-children`](https://github.com/syntax-tree/unist-util-visit-children)
    — Visit direct children of a parent
*   [`unist-util-visit-all-after`](https://github.com/mrzmmr/unist-util-visit-all-after)
    — Visit nodes after another node
*   [`unist-builder`](https://github.com/eush77/unist-builder)
    — Helper for creating trees
*   [`unist-builder-blueprint`](https://github.com/eush77/unist-builder-blueprint)
    — Convert Unist trees to unist-builder notation

## Contribute

**unist** is built by people just like you!  Check out
[`contributing.md`][contributing] for ways to get started.

This project has a [Code of Conduct][coc].  By interacting with this repository,
organisation, or community you agree to abide by its terms.

Want to chat with the community and contributors?  Join us in [Gitter][chat]!

Have an idea for a cool new utility or tool?  That’s great!  If you want
feedback, help, or just to share it with the world you can do so by creating
an issue in the [`syntax-tree/ideas`][ideas] repository!

## Acknowledgments

The initial release of this project was authored by
[**@wooorm**](https://github.com/wooorm).

Special thanks to [**@eush77**](https://github.com/eush77) for their work,
ideas, and incredibly valuable feedback!

Thanks to [**@azu**](https://github.com/azu),
[**@blahah**](https://github.com/blahah),
[**@gibson042**](https://github.com/gibson042),
[**@jlevy**](https://github.com/jlevy), and
[**@mrzmmr**](https://github.com/mrzmmr) for contributing commits since!

## License

[CC-BY-4.0][license] © [Titus Wormer][author]

<!-- Definitions -->

[logo]: https://cdn.rawgit.com/syntax-tree/unist/b2943b1/logo.svg

[releases]: https://github.com/syntax-tree/unist/releases

[retext]: https://github.com/retextjs/retext

[remark]: https://github.com/remarkjs/remark

[rehype]: https://github.com/rehypejs/rehype

[hast]: https://github.com/syntax-tree/hast

[nlcst]: https://github.com/syntax-tree/nlcst

[mdast]: https://github.com/syntax-tree/mdast

[unified]: https://github.com/unifiedjs/unified

[vfile]: https://github.com/vfile/vfile

[remark-html]: https://github.com/remarkjs/remark-html

[parent]: #parent

[data]: #data

[file]: #unist-files

[contributing]: contributing.md

[coc]: code-of-conduct.md

[ideas]: https://github.com/syntax-tree/ideas

[chat]: https://gitter.im/syntax-tree/Lobby

[license]: https://creativecommons.org/licenses/by/4.0/

[author]: http://wooorm.com

[descendant]: #descendant

[child]: #child

[sibling]: #sibling

[parent-term]: #parent-1

[index]: #index

[tree]: #tree

[type]: #type
