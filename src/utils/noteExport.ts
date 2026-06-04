// Utilities for turning a stored note (a serialized Lexical editor state)
// into plain text and exporting it via download or print.

interface SerializedNode {
  type?: string;
  text?: string;
  children?: SerializedNode[];
}

// Block-level node types that should be separated by a line break.
const BLOCK_TYPES = new Set([
  'paragraph',
  'heading',
  'quote',
  'listitem',
  'code',
]);

function nodeToText(node: SerializedNode): string {
  if (typeof node.text === 'string') return node.text;

  const childText = (node.children ?? []).map(nodeToText).join('');

  if (node.type && BLOCK_TYPES.has(node.type)) {
    return `${childText}\n`;
  }
  return childText;
}

/**
 * Convert a stored note content string into plain text.
 * The content is expected to be a JSON-serialized Lexical editor state,
 * but we gracefully fall back to returning the raw string otherwise.
 */
export function extractPlainText(content: string): string {
  if (!content) return '';
  try {
    const parsed = JSON.parse(content) as { root?: SerializedNode };
    if (!parsed.root) return content;
    return nodeToText(parsed.root).replace(/\n{3,}/g, '\n\n').trim();
  } catch {
    return content;
  }
}

function safeFileName(title: string): string {
  const base = title.trim() || 'note';
  return base.replace(/[^a-z0-9\-_ ]/gi, '').replace(/\s+/g, '_');
}

/** Trigger a browser download of the given note as a .txt file. */
export function downloadNoteAsTxt(title: string, content: string) {
  const text = extractPlainText(content);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${safeFileName(title)}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Open the browser print dialog with a clean rendering of the note. */
export function printNote(title: string, content: string) {
  const text = extractPlainText(content);
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <meta charset="utf-8" />
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 720px;
            margin: 48px auto;
            padding: 0 24px;
            color: #1a1a1a;
            line-height: 1.6;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 24px;
            border-bottom: 1px solid #e5e5e5;
            padding-bottom: 12px;
          }
          pre {
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: inherit;
            font-size: 15px;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        <pre>${escapeHtml(text)}</pre>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  // Give the new window a tick to render before printing.
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}
