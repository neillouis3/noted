'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState } from 'react';
import { $getSelection, $isRangeSelection } from 'lexical';
import { $getNearestNodeOfType } from '@lexical/utils';
import { ListNode } from '@lexical/list';
import type { BlockType } from '@/types/editor.types';

export function useToolbarState() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isHighlight, setIsHighlight] = useState(false);
  const [blockType, setBlockType] = useState<BlockType>('paragraph');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));
      setIsHighlight(selection.hasFormat('highlight'));

      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM !== null) {
        const type = element.getType();
        if (type === 'heading') {
          const tag = (element as any).getTag();
          setBlockType(tag);
        } else if (type === 'list') {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const listType = parentList ? parentList.getListType() : 'bullet';
          setBlockType(listType as BlockType);
        } else {
          setBlockType(type as BlockType);
        }
      }
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  return {
    isBold,
    isItalic,
    isUnderline,
    isStrikethrough,
    isCode,
    isHighlight,
    blockType,
    editor,
  };
}