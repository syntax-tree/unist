# ![unist][logo]

**Uni**versal **S**yntax **T**ree.

* * *

**unist** is a specification for syntax trees.
It has a big [ecosystem of utilities][list-of-utilities] in JavaScript for
working with these trees.
It’s implemented by several other specifications.

This document may not be released.
See [releases][] for released documents.
The latest released version is [`2.0.0`][release].

## Table of Contents

*   [Introduction](#introduction)
    *   [Syntax tree](#syntax-tree)
    *   [Where this specification fits](#where-this-specification-fits)
*   [Nodes](#nodes)
    *   [Node](#node)
    *   [Parent](#parent)
    *   [Literal](#literal)
*   [Glossary](#glossary)
*   [Tree traversal](#tree-traversal)
*   [Utilities](#utilities)
    *   [List of Utilities](#list-of-utilities)
*   [References](#references)
*   [Contribute](#contribute)
*   [Acknowledgments](#acknowledgments)
*   [License](#license)

## Introduction

This document defines a general-purpose format for syntax trees.
Development of unist started in July 2015.
This specification is written in a [Web IDL][webidl]-like grammar.

### Syntax tree

Syntax trees are representations of source code or even natural language.
These trees are abstractions that make it possible to analyse, transform,
and generate code.

Syntax trees [come in two flavours][abstract-vs-concrete-trees]:

*   **concrete syntax trees**: structures that represent every detail (such
    as white-space in white-space insensitive languages)
*   **abstract syntax trees**: structures that only represent details relating
    to the syntactic structure of code (such as ignoring whether a double or
    single quote was used in languages that support both, such as JavaScript).

This specification can express both abstract and concrete syntax trees.

### Where this specification fits

unist is not intended to be self-sufficient.
Instead, it is expected that other specifications implement unist and extend
it to express language specific nodes.
For example, see projects such as [**mdast**][mdast] (for markdown),
[**hast**][hast] (for HTML), and [**nlcst**][nlcst] (for natural language).

unist relates to [JSON][] in that compliant syntax trees can be expressed
completely in JSON.
However, unist is not limited to JSON and can be expressed in other data
formats, such as [XML][].

unist relates to [JavaScript][] in that it has a rich [ecosystem of
utilities][list-of-utilities] for working with compliant syntax trees in
JavaScript.
The five most used utilities combined are downloaded ten million times each
month.
However, unist is not limited to JavaScript and can be used in other
programming languages.

unist relates to the [unified][], [remark][], [rehype][], and [retext][]
projects in that unist syntax trees are used throughout their ecosystems.

unist relates to the [vfile][] project in that it accepts unist nodes for
its message store, and that vfile can be a source [_file_][term-file] of a
syntax tree.

## Nodes

Syntactic units in unist syntax trees are called nodes, and implement the
[**Node**][dfn-node] interface.

### `Node`

```idl
interface Node {
  type: string
  data: Data?
  position: Position?
}
```

The `type` field is a non-empty string representing the variant of a node.
This field can be used to determine the [_type_][term-type] a node implements.

The `data` field represents information from the ecosystem.
The value of the `data` field implements the [**Data**][dfn-data] interface.

The `position` field represents the location of a node in a source document.
The value of the `position` field implements the [**Position**][dfn-position]
interface.
The `position` field must not be present if a node is
[_generated_][term-generated].

Specifications implementing unist are encouraged to define more fields.
Ecosystems can define fields on [**Data**][dfn-data].

Any value in unist **must** be expressible in JSON values: `string`, `number`,
`object`, `array`, `true`, `false`, or `null`.
This means that the syntax tree should be able to be converted to and from JSON
and produce the same tree.
For example, in JavaScript, a tree can be passed through
`JSON.parse(JSON.stringify(tree))` and result in the same tree.

#### `Position`

```idl
interface Position {
  start: Point
  end: Point
  indent: [number >= 1]?
}
```

**Position** represents the location of a node in a source [_file_][term-file].

The `start` field of **Position** represents the place of the first character
of the parsed source region.
The `end` field of **Position** represents the place of the first character
after the parsed source region, whether it exists or not.
The value of the `start` and `end` fields implement the [**Point**][dfn-point]
interface.

The `indent` field of **Position** represents the start column at each index
(plus start line) in the source region, for elements that span multiple lines.

If the syntactic unit represented by a node is not present in the source
[_file_][term-file] at the time of parsing, the node is said to be
[_generated_][term-generated] and it must not have positional information.

For example, if the following value was represented as unist:

```markdown
alpha
bravo
```

…the first word (`alpha`) would start at line `1`, column `1`, offset `0`, and
end at line `1`, column `6`, offset `5`.
The line feed would start at line `1`, column `6`, offset `5`, and end at line
`2`, column `1`, offset `6`.
The last word (`bravo`) would start at line `2`, column `1`, offset `6`, and
end at line `2`, column `6`, offset `11`.

#### `Point`

```idl
interface Point {
  line: number >= 1
  column: number >= 1
  offset: number >= 0?
}
```

**Point** represents one place in a source [_file_][term-file].

The `line` field (1-indexed integer) represents a line in a source file.
The `column` field (1-indexed integer) represents a column in a source file.
The `offset` field (0-indexed integer) represents a character in a source file.

The term character means a (UTF-16) code unit which is defined in the
[Web IDL][webidl] specification.

#### `Data`

```idl
interface Data { }
```

**Data** represents information associated by the ecosystem with the node.

This space is guaranteed to never be specified by unist or specifications
implementing unist.

### `Parent`

```idl
interface Parent <: Node {
  children: [Node]
}
```

Nodes containing other nodes (said to be [_children_][term-child]) extend the
abstract interface **Parent** ([**Node**][dfn-node]).

The `children` field is a list representing the children of a node.

### `Literal`

```idl
interface Literal <: Node {
  value: any
}
```

Nodes containing a value extend the abstract interface **Literal**
([**Node**][dfn-node]).

The `value` field can contain any value.

## Glossary

###### Tree

A **tree** is a node and all of its [_descendants_][term-descendant] (if any).

###### Child

Node X is **child** of node Y, if Y’s `children` include X.

###### Parent

Node X is **parent** of node Y, if Y is a [_child_][term-child] of X.

###### Index

The **index** of a [_child_][term-child] is its number of preceding
[_siblings_][term-sibling], or `0` if it has none.

###### Sibling

Node X is a **sibling** of node Y, if X and Y have the same
[_parent_][term-parent] (if any).

The **previous sibling** of a [_child_][term-child] is its **sibling** at its
[_index_][term-index] minus 1.

The **next sibling** of a [_child_][term-child] is its **sibling** at its
[_index_][term-index] plus 1.

###### Root

The **root** of a node is itself, if without [_parent_][term-parent], or the
**root** of its [_parent_][term-parent].

The **root** of a [_tree_][term-tree] is any node in that [_tree_][term-tree]
without [_parent_][term-parent].

###### Descendant

Node X is **descendant** of node Y, if X is a [_child_][term-child] of Y, or if
X is a [_child_][term-child] of node Z that is a **descendant** of Y.

An **inclusive descendant** is a node or one of its **descendants**.

###### Ancestor

Node X is an **ancestor** of node Y, if Y is a [_descendant_][term-descendant]
of X.

An **inclusive ancestor** is a node or one of its **ancestors**.

###### Head

The **head** of a node is its first [_child_][term-child] (if any).

###### Tail

The **tail** of a node is its last [_child_][term-child] (if any).

###### Leaf

A **leaf** is a node with no [_children_][term-child].

###### Branch

A **branch** is a node with one or more [_children_][term-child].

###### Generated

A node is **generated** if it does not have [_positional
information_][term-positional-info].

###### Type

The **type** of a node is the value of its `type` field.

###### Positional information

The **positional information** of a node is the value of its `position` field.

###### File

A **file** is a source document that represents the original file that was
parsed to produce the syntax tree.
[_Positional information_][term-positional-info] represents the place of a node
in this file.
Files are provided by the host environment and not defined by unist.

For example, see projects such as [**vfile**][vfile].

###### Preorder

In **preorder** (**NLR**) is [depth-first][traversal-depth] [tree
traversal][traversal] that performs the following steps for each node _N_:

1.  **N**: visit _N_ itself
2.  **L**: traverse [_head_][term-head] (then its _next sibling_, recursively
    moving forward until reaching _tail_)
3.  **R**: traverse [_tail_][term-tail]

###### Postorder

In **postorder** (**LRN**) is [depth-first][traversal-depth] [tree
traversal][traversal] that performs the following steps for each node _N_:

1.  **L**: traverse [_head_][term-head] (then its _next sibling_, recursively
    moving forward until reaching _tail_)
2.  **R**: traverse [_tail_][term-tail]
3.  **N**: visit _N_ itself

## Tree traversal

**Tree traversal** is a common task when working with a [_tree_][term-tree] to
search it.
Tree traversal is typically either _breadth-first_ or _depth-first_.

In the following examples, we’ll work with this tree:

```ascii
                 +---+
                 | A |
                 +-+-+
                   |
             +-----+-----+
             |           |
           +-+-+       +-+-+
           | B |       | F |
           +-+-+       +-+-+
             |           |
    +-----+--+--+        |
    |     |     |        |
  +-+-+ +-+-+ +-+-+    +-+-+
  | C | | D | | E |    | G |
  +---+ +---+ +---+    +---+
```

###### Breadth-first traversal

**Breadth-first traversal** is visiting a node and all its
[_siblings_][term-sibling] to broaden the search at that level, before
traversing [_children_][term-child].

For the syntax tree defined in the diagram, a breadth-first traversal first
searches the root of the tree (**A**), then its children (**B** and **F**), then
their children (**C**, **D**, **E**, and **G**).

###### Depth-first traversal

Alternatively, and more commonly, **depth-first traversal** is used.
The search is first deepened, by traversing [_children_][term-child], before
traversing [_siblings_][term-sibling].

For the syntax tree defined in the diagram, a depth-first traversal first
searches the root of the tree (**A**), then one of its children (**B** or
**F**), then their children (**C**, **D**, and **E**, or **G**).

For a given node _N_ with [_children_][term-child], a **depth-first traversal**
performs three steps, simplified to only binary trees (every node has
[_head_][term-head] and [_tail_][term-tail], but no other children):

*   **N**: visit _N_ itself
*   **L**: traverse [_head_][term-head]
*   **R**: traverse [_tail_][term-tail]

These steps can be done in any order, but for non-binary trees, **L** and **R**
occur together.
If **L** is done before **R**, the traversal is called _left-to-right_
traversal, otherwise it is called _right-to-left_ traversal.
In the case of non-binary trees, the other children between _head_ and _tail_
are processed in that order as well, so for _left-to-right_ traversal, first
_head_ is traversed (**L**), then its _next sibling_ is traversed, etcetera,
until finally _tail_ (**R**) is traversed.

Because **L** and **R** occur together for non-binary trees, we can produce four
types of orders: NLR, NRL, LRN, RLN.

NLR and LRN (the two _left-to-right_ traversal options) are most commonly used
and respectively named [_preorder_][term-preorder] and
[_postorder_][term-postorder].

For the syntax tree defined in the diagram, _preorder_ and _postorder_ traversal
thus first search the root of the tree (**A**), then its head (**B**), then its
children from left-to-right (**C**, **D**, and then **E**).
After all [_descendants_][term-descendant] of **B** are traversed, its next
sibling (**F**) is traversed and then finally its only child (**G**).

## Utilities

**Utilities** are functions that work with nodes.

There are several projects that deal with nodes from specifications
implementing unist:

*   [mdast utilities](https://github.com/syntax-tree/mdast#list-of-utilities)
*   [hast utilities](https://github.com/syntax-tree/hast#list-of-utilities)
*   [nlcst utilities](https://github.com/syntax-tree/nlcst#list-of-utilities)

### List of Utilities

*   [`unist-util-assert`](https://github.com/syntax-tree/unist-util-assert)
    — Assert nodes
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
    — Remove nodes from trees
*   [`unist-util-remove-position`](https://github.com/syntax-tree/unist-util-remove-position)
    — Remove positional info from trees
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
    — Convert trees to `unist-builder` notation

## References

*   **JavaScript**
    [ECMAScript Language Specification][javascript].
    Ecma International.
*   **JSON**
    [The JavaScript Object Notation (JSON) Data Interchange Format][json],
    T. Bray.
    IETF.
*   **XML**
    [Extensible Markup Language][xml],
    T. Bray, J. Paoli, C. Sperberg-McQueen, E. Maler, F. Yergeau.
    W3C.
*   **Web IDL**
    [Web IDL][webidl],
    C. McCormack.
    W3C.

## Contribute

**unist** is built by people just like you!
Check out [`contributing.md`][contributing] for ways to get started.

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

Want to chat with the community and contributors?
Join us in [spectrum][chat]!

Have an idea for a cool new utility or tool?
That’s great!
If you want feedback, help, or just to share it with the world you can do so by
creating an issue in the [`syntax-tree/ideas`][ideas] repository!

## Acknowledgments

The initial release of this project was authored by
[**@wooorm**](https://github.com/wooorm).

Special thanks to [**@eush77**](https://github.com/eush77) for their work,
ideas, and incredibly valuable feedback!

Thanks to [**@anandthakker**](https://github.com/anandthakker),
[**@anko**](https://github.com/anko),
[**@arobase-che**](https://github.com/arobase-che),
[**@azu**](https://github.com/azu),
[**@BarryThePenguin**](https://github.com/BarryThePenguin),
[**@ben-eb**](https://github.com/ben-eb),
[**@blahah**](https://github.com/blahah),
[**@ChristianMurphy**](https://github.com/ChristianMurphy),
[**@derhuerst**](https://github.com/derhuerst),
[**@dozoisch**](https://github.com/dozoisch),
[**@eush77**](https://github.com/eush77),
[**@fazouane-marouane**](https://github.com/fazouane-marouane),
[**@gibson042**](https://github.com/gibson042),
[**@ikatyang**](https://github.com/ikatyang),
[**@izumin5210**](https://github.com/izumin5210),
[**@jasonLaster**](https://github.com/jasonLaster),
[**@JDvorak**](https://github.com/JDvorak),
[**@jlevy**](https://github.com/jlevy),
[**@justjake**](https://github.com/justjake),
[**@kmck**](https://github.com/kmck),
[**@kt3k**](https://github.com/kt3k),
[**@KyleAMathews**](https://github.com/KyleAMathews),
[**@muraken720**](https://github.com/muraken720),
[**@mrzmmr**](https://github.com/mrzmmr),
[**@nwtn**](https://github.com/nwtn),
[**@rhysd**](https://github.com/rhysd),
[**@Rokt33r**](https://github.com/Rokt33r),
[**@Sarah-Seo**](https://github.com/Sarah-Seo),
[**@sethvincent**](https://github.com/sethvincent),
[**@simov**](https://github.com/simov),
[**@staltz**](https://github.com/staltz),
[**@tmcw**](https://github.com/tmcw),
and
[**@vhf**](https://github.com/vhf),
for contributing to unist and related projects!

## License

Copyright © [Titus Wormer][author].
This work is licensed under a
[Creative Commons Attribution 4.0 International License][license].

<!-- Definitions -->

[logo]: https://raw.githubusercontent.com/syntax-tree/unist/b187eb7/logo.svg?sanitize=true

[releases]: https://github.com/syntax-tree/unist/releases

[contributing]: contributing.md

[coc]: code-of-conduct.md

[ideas]: https://github.com/syntax-tree/ideas

[chat]: https://spectrum.chat/unified/syntax-tree

[license]: https://creativecommons.org/licenses/by/4.0/

[author]: http://wooorm.com

[release]: https://github.com/syntax-tree/unist/releases/tag/2.0.0

[abstract-vs-concrete-trees]: https://eli.thegreenplace.net/2009/02/16/abstract-vs-concrete-syntax-trees/

[dfn-node]: #node

[dfn-position]: #position

[dfn-point]: #point

[dfn-data]: #data

[term-tree]: #tree

[term-preorder]: #preorder

[term-postorder]: #postorder

[term-child]: #child

[term-parent]: #parent-1

[term-index]: #index

[term-sibling]: #sibling

[term-descendant]: #descendant

[term-head]: #head

[term-tail]: #tail

[term-generated]: #generated

[term-type]: #type

[term-positional-info]: #positional-information

[term-file]: #file

[traversal]: #tree-traversal

[traversal-depth]: #depth-first-traversal

[list-of-utilities]: #list-of-utilities

[webidl]: https://heycam.github.io/webidl/

[json]: https://tools.ietf.org/html/rfc7159

[xml]: https://www.w3.org/TR/xml/

[javascript]: https://www.ecma-international.org/ecma-262/9.0/index.html

[hast]: https://github.com/syntax-tree/hast

[nlcst]: https://github.com/syntax-tree/nlcst

[mdast]: https://github.com/syntax-tree/mdast

[unified]: https://github.com/unifiedjs/unified

[remark]: https://github.com/remarkjs/remark

[rehype]: https://github.com/rehypejs/rehype

[retext]: https://github.com/retextjs/retext

[vfile]: https://github.com/vfile/vfile
