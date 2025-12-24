// Main components
export { default as LexicalTextarea } from './editor';

// Plugins
export { default as ToolbarPlugin } from './plugins/toolbarPlugin';
export { default as EditorPlugins } from './plugins/editorPlugins';

// UI components
export { default as EditorContent } from './ui/editorContent';
export { default as ToolbarButton } from './ui/toolbarButton';
export { default as ToolbarDivider } from './ui/toolbarDivider';

// Config
export { editorNodes, onError, createEditorConfig } from './config/editorConfig';
export { default as EditorTheme } from './config/editorTheme';

// Re-export from other directories
export { useToolbarState } from '@/hooks/useToolbarState';
export * from '../../handlers/editorFormatHandlers';
export * from '@/types/editor.types';