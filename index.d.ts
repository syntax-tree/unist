export interface Node {
  type: string;
  data?: Data;
  position?: Position;
}

export interface Position {
  start: Point;
  end: Point;
  indent: number;
}

export interface Point {
  line: number;
  column: number;
  offset: number;
}

export interface Data {
  [key: string]: unknown;
}

export interface Parent extends Node {
  children: Node[];
}

export interface Literal extends Node {
  value: unknown;
}
