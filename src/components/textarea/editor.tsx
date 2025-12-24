'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import type { EditorProps } from '@/types/editor.types';
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
}: EditorProps) {
  const initialConfig = createEditorConfig(initialContent);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={`flex flex-col gap-2  w-full h-screen overflow-auto ${className}`}>
        <ToolbarPlugin />
        <EditorContent placeholder={placeholder} />
        <EditorPlugins autoFocus={autoFocus} />
      </div>
    </LexicalComposer>
  );
}