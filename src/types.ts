// ADF Type Definitions

export interface ADFNode {
  type: string;
  content?: ADFNode[];
  text?: string;
  marks?: Mark[];
  attrs?: Record<string, any>;
}

export interface ADFDocument extends ADFNode {
  type: 'doc';
  version: number;
  content: ADFNode[];
}

export interface Mark {
  type: string;
  attrs?: Record<string, any>;
}

// Block Node Types
export type BlockNodeType =
  | 'doc'
  | 'paragraph'
  | 'heading'
  | 'bulletList'
  | 'orderedList'
  | 'listItem'
  | 'taskList'
  | 'taskItem'
  | 'codeBlock'
  | 'blockquote'
  | 'rule'
  | 'table'
  | 'tableRow'
  | 'tableHeader'
  | 'tableCell'
  | 'panel'
  | 'mediaSingle'
  | 'mediaGroup'
  | 'media'
  | 'expand'
  | 'nestedExpand'
  | 'decisionList'
  | 'decisionItem'
  | 'blockCard'
  | 'multiBodiedExtension'
  | 'extensionFrame';

// Inline Node Types
export type InlineNodeType =
  | 'text'
  | 'hardBreak'
  | 'mention'
  | 'emoji'
  | 'date'
  | 'status'
  | 'inlineCard';

// Mark Types
export type MarkType =
  | 'strong'
  | 'em'
  | 'code'
  | 'strike'
  | 'underline'
  | 'link'
  | 'subsup'
  | 'textColor'
  | 'border';

export interface ConversionContext {
  listDepth: number;
  inTable: boolean;
  orderedListCounters: number[];
}