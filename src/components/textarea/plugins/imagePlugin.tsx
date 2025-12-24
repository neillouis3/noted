'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapNodeInElement } from '@lexical/utils';
import {
  $createParagraphNode,
  $insertNodes,
  $isRootOrShadowRoot,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  type LexicalCommand,
  type LexicalEditor,
} from 'lexical';
import { useEffect } from 'react';
import { $createImageNode, ImageNode } from '../nodes/imageNode';

export type InsertImagePayload = {
  altText: string;
  src: string;
};

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand('INSERT_IMAGE_COMMAND');

export function InsertImageDialog({
  activeEditor,
  onClose,
}: {
  activeEditor: LexicalEditor;
  onClose: () => void;
}) {
  const handleInsertImage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const src = formData.get('src') as string;
    const altText = formData.get('altText') as string;

    if (src) {
      activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        altText: altText || 'Image',
        src,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Insert Image</h3>
        <form onSubmit={handleInsertImage} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Image URL
            </label>
            <input
              type="text"
              name="src"
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-default-300 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Alt Text (Optional)
            </label>
            <input
              type="text"
              name="altText"
              placeholder="Description of the image"
              className="w-full px-3 py-2 border border-default-300 rounded-lg"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-default-300 rounded-lg hover:bg-default-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600"
            >
              Insert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ImagePlugin(): React.ReactElement | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagePlugin: ImageNode not registered on editor');
    }

    return editor.registerCommand<InsertImagePayload>(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const imageNode = $createImageNode(payload);
        $insertNodes([imageNode]);
        if ($isRootOrShadowRoot(imageNode.getParentOrThrow())) {
          $wrapNodeInElement(imageNode, $createParagraphNode).selectEnd();
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}