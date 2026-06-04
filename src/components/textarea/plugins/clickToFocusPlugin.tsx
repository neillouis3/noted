'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, $getRoot, $isParagraphNode } from 'lexical';
import { useEffect } from 'react';

const CLICK_BELOW_THRESHOLD_PX = 8;

export default function ClickToFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    let removePointerListener: (() => void) | undefined;

    const unregisterRootListener = editor.registerRootListener((rootElement) => {
      removePointerListener?.();
      removePointerListener = undefined;

      if (!rootElement) return;

      const onMouseDown = (event: MouseEvent) => {
        if (event.button !== 0) return;

        const clickY = event.clientY;
        let shouldFocusBelow = false;

        editor.getEditorState().read(() => {
          const root = $getRoot();
          const lastChild = root.getLastChild();

          if (!lastChild) {
            shouldFocusBelow = true;
            return;
          }

          const dom = editor.getElementByKey(lastChild.getKey());
          if (!dom) return;

          const lastRect = dom.getBoundingClientRect();
          shouldFocusBelow = clickY > lastRect.bottom + CLICK_BELOW_THRESHOLD_PX;
        });

        if (!shouldFocusBelow) return;

        event.preventDefault();

        editor.update(() => {
          const root = $getRoot();
          const lastChild = root.getLastChild();

          if (!lastChild) {
            const paragraph = $createParagraphNode();
            root.append(paragraph);
            paragraph.select();
            return;
          }

          if (
            $isParagraphNode(lastChild) &&
            lastChild.getTextContentSize() === 0
          ) {
            lastChild.selectEnd();
            return;
          }

          const paragraph = $createParagraphNode();
          root.append(paragraph);
          paragraph.select();
        });
      };

      rootElement.addEventListener('mousedown', onMouseDown);
      removePointerListener = () =>
        rootElement.removeEventListener('mousedown', onMouseDown);
    });

    return () => {
      removePointerListener?.();
      unregisterRootListener();
    };
  }, [editor]);

  return null;
}
