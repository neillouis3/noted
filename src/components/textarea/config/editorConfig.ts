import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ImageNode } from '../nodes/imageNode';
import type { Klass, LexicalNode } from 'lexical';
import theme from './editorTheme';

export const editorNodes: Array<Klass<LexicalNode>> = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  AutoLinkNode,
  LinkNode,
  ImageNode,
];

export function onError(error: Error) {
  console.error('Lexical Editor Error:', error);
}

export function createEditorConfig(initialContent?: string) {
  return {
    namespace: 'NotesEditor',
    theme,
    onError,
    nodes: editorNodes,
    editorState: initialContent,
  };
}