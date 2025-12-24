import type { LexicalEditor } from 'lexical';
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode, type HeadingTagType } from '@lexical/rich-text';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { $createCodeNode } from '@lexical/code';
import type { TextFormatType, AlignmentType, BlockType } from '@/types/editor.types';

export function formatText(editor: LexicalEditor, format: TextFormatType) {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
}

export function toggleHighlight(editor: LexicalEditor) {
  editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'highlight');
}

export function formatAlignment(editor: LexicalEditor, alignment: AlignmentType) {
  editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
}

export function formatHeading(
  editor: LexicalEditor, 
  headingSize: HeadingTagType, 
  currentBlockType: BlockType
) {
  if (currentBlockType !== headingSize) {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  }
}

export function formatQuote(editor: LexicalEditor, currentBlockType: BlockType) {
  if (currentBlockType !== 'quote') {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  }
}

export function formatCodeBlock(editor: LexicalEditor, currentBlockType: BlockType) {
  if (currentBlockType !== 'code') {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createCodeNode());
      }
    });
  }
}

export function formatBulletList(editor: LexicalEditor, currentBlockType: BlockType) {
  if (currentBlockType !== 'bullet') {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  } else {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  }
}

export function formatNumberedList(editor: LexicalEditor, currentBlockType: BlockType) {
  if (currentBlockType !== 'number') {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  } else {
    editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
  }
}

export function undoCommand(editor: LexicalEditor) {
  editor.dispatchCommand(UNDO_COMMAND, undefined);
}

export function redoCommand(editor: LexicalEditor) {
  editor.dispatchCommand(REDO_COMMAND, undefined);
}