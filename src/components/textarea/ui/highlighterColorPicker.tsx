'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { HIGHLIGHT_COLORS, type HighlightColor, applyHighlightColor } from '../plugins/highlightPlugin';
import type { LexicalEditor } from 'lexical';

interface HighlightColorPickerProps {
  editor: LexicalEditor;
  isActive: boolean;
}

export default function HighlightColorPicker({ editor, isActive }: HighlightColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState<HighlightColor>('yellow');

  const handleColorSelect = (color: HighlightColor) => {
    setSelectedColor(color);
    applyHighlightColor(editor, color);
    setShowPicker(false);
  };

  const handleRemoveHighlight = () => {
    applyHighlightColor(editor, null);
    setShowPicker(false);
  };

  const colorLabels: Record<HighlightColor, string> = {
    yellow: 'Yellow',
    green: 'Green',
    blue: 'Blue',
    pink: 'Pink',
    purple: 'Purple',
    orange: 'Orange',
    red: 'Red',
    gray: 'Gray',
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(!showPicker)}
        className={`
          flex items-center gap-1 px-2 py-1.5 rounded
          ${isActive ? 'bg-primary text-white' : 'hover:bg-default-100'}
        `}
        aria-label="Highlight Color"
      >
        <div className={`w-4 h-4 rounded border border-default-300 ${HIGHLIGHT_COLORS[selectedColor]}`} />
        <ChevronDownIcon className="w-3 h-3" />
      </button>

      {showPicker && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowPicker(false)}
          />
          <div className="absolute top-full mt-1 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-default-200 p-2 z-20 min-w-[160px]">
            <div className="text-xs font-medium text-default-600 mb-2 px-2">
              Highlight Color
            </div>
            <div className="space-y-1">
              {(Object.keys(HIGHLIGHT_COLORS) as HighlightColor[]).map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-default-100 text-left"
                >
                  <div className={`w-5 h-5 rounded border border-default-300 ${HIGHLIGHT_COLORS[color]}`} />
                  <span className="text-sm">{colorLabels[color]}</span>
                </button>
              ))}
              <div className="border-t border-default-200 my-1" />
              <button
                onClick={handleRemoveHighlight}
                className="w-full px-2 py-1.5 rounded hover:bg-default-100 text-left text-sm text-danger"
              >
                Remove Highlight
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}