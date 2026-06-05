'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import type { EditorState } from 'lexical';
import { useRef } from 'react';
import type { EditorProps, NotesToolbarProps } from '@/types/editor.types';
import { createEditorConfig } from './config/editorConfig';
import ToolbarPlugin from './plugins/toolbarPlugin';
import EditorPlugins from './plugins/editorPlugins';
import EditorContent from './ui/editorContent';

export default function LexicalTextarea({
  placeholder = 'Start writing your note...',
  initialContent,
  onChange,
  autoFocus = false,
  className = '',
  notesToolbarProps,
}: EditorProps) {
  const initialConfig = createEditorConfig(initialContent);
  // Skip the very first onChange that fires when the editor mounts, so opening
  // a note doesn't immediately mark it as edited.
  const isFirstChange = useRef(true);

  const handleChange = (editorState: EditorState) => {
    if (isFirstChange.current) {
      isFirstChange.current = false;
      return;
    }
    onChange?.(JSON.stringify(editorState.toJSON()));
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={`flex flex-col gap-2  w-full h-screen overflow-auto ${className}`}>
        <ToolbarPlugin notesToolbarProps={notesToolbarProps} />
        <EditorContent placeholder={placeholder} />
        <EditorPlugins autoFocus={autoFocus} />
        {onChange && (
          <OnChangePlugin onChange={handleChange} ignoreSelectionChange />
        )}
      </div>
    </LexicalComposer>
  );
}