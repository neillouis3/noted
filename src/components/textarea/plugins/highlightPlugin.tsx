'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { useEffect, useState } from 'react';

export const HIGHLIGHT_COLORS = {
  yellow: 'bg-yellow-200',
  green: 'bg-green-200',
  blue: 'bg-blue-200',
  pink: 'bg-pink-200',
  purple: 'bg-purple-200',
  orange: 'bg-orange-200',
  red: 'bg-red-200',
  gray: 'bg-gray-200',
} as const;

export type HighlightColor = keyof typeof HIGHLIGHT_COLORS;

export function applyHighlightColor(editor: any, color: HighlightColor | null) {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const nodes = selection.getNodes();
      
      nodes.forEach((node) => {
        const element = editor.getElementByKey(node.getKey());
        if (element) {
          // Remove all existing highlight colors
          Object.values(HIGHLIGHT_COLORS).forEach((colorClass) => {
            element.classList.remove(colorClass);
          });
          
          // Add new color if provided
          if (color) {
            element.classList.add(HIGHLIGHT_COLORS[color]);
          }
        }
      });
    }
  });
}

export default function HighlightPlugin() {
  const [editor] = useLexicalComposerContext();
  
  return null;
}