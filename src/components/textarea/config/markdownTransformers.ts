import { TRANSFORMERS, UNORDERED_LIST } from '@lexical/markdown';

// Keep markdown shortcuts (headings, bold, etc.) but not "- " → bullet lists.
export const NOTE_MARKDOWN_TRANSFORMERS = TRANSFORMERS.filter(
  (transformer) => transformer !== UNORDERED_LIST
);
