/**
 * Syntactic units in unist syntax trees are called nodes.
 */
export interface Node {
  /**
   * the variant of a node.
   */
  type!: string;

  /**
   * information from the ecosystem.
   */
  data?: Data;

  /**
   * location of a node in a source document.
   * must not be present if a node is generated.
   */
  position?: Position;
}

/**
 * location of a node in a source file.
 */
export interface Position {
  /**
   * place of the first character of the parsed source region.
   */
  start: Point;

  /**
   * place of the first character after the parsed source region.
   */
  end: Point;

  /**
   * start column at each index (plus start line) in the source region, for elements that span multiple lines.
   */
  indent: number;
}

/**
 * one place in a source file.
 */
export interface Point {
  /**
   * line in a source file.
   * 1-indexed integer.
   */
  line: number;

  /**
   * column in a source file.
   * 1-indexed integer.
   */
  column: number;

  /**
   * character in a source file.
   * 0-indexed integer.
   */
  offset: number;
}

/**
 * information associated by the ecosystem with the node.
 * space is guaranteed to never be specified by unist or specifications implementing unist.
 */
export interface Data {
  [key: string]: unknown;
}

/**
 * Nodes containing other nodes.
 */
export interface Parent extends Node {
  /**
   * list representing the children of a node.
   */
  children: Node[];
}

/**
 * Nodes containing a value
 */
export interface Literal extends Node {
  /**
   * any value
   */
  value: unknown;
}
