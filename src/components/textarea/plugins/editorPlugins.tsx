'use client';

import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { NOTE_MARKDOWN_TRANSFORMERS } from '../config/markdownTransformers';
import ClickToFocusPlugin from './clickToFocusPlugin';
import AutocompletePlugin from './autocompletePlugin';

interface EditorPluginsProps {
  autoFocus?: boolean;
}

export default function EditorPlugins({ autoFocus = false }: EditorPluginsProps) {
  return (
    <>
      <HistoryPlugin />
      {autoFocus && <AutoFocusPlugin />}
      <ListPlugin />
      <LinkPlugin />
      <TabIndentationPlugin />
      <ClickToFocusPlugin />
      <AutocompletePlugin />
      <MarkdownShortcutPlugin transformers={NOTE_MARKDOWN_TRANSFORMERS} />
    </>
  );
}