'use client';

import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';

interface EditorContentProps {
  placeholder?: string;
}

export default function EditorContent({ 
  placeholder = 'Start typing...' 
}: EditorContentProps) {
  const placeholderElement = (
    <div className="absolute top-4 left-4 pt-12 text-default-400 text-sm pointer-events-none select-none">
      {placeholder}
    </div>
  );

  return (
    <div className="relative pt-12 min-h-[calc(100vh-5rem)]">
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className="min-h-[calc(100vh-5rem)] px-4 py-4 outline-none resize-none text-sm"
            aria-placeholder={placeholder}
            placeholder={placeholderElement}
          />
        }
        placeholder={placeholderElement}
        ErrorBoundary={() => null}
      />
    </div>
  );
}