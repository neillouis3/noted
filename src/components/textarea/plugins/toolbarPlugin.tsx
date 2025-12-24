'use client';

import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeBracketIcon,
  Bars3BottomLeftIcon,
  Bars3Icon,
  Bars3BottomRightIcon,
  Bars4Icon,
  ListBulletIcon,
  NumberedListIcon,
  PaperClipIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import ToolbarButton from '../ui/toolbarButton';
import ToolbarDivider from '../ui/toolbarDivider';
import HighlightColorPicker from '../ui/highlighterColorPicker';
import { useToolbarState } from '@/hooks/useToolbarState';
import {
  formatText,
  formatAlignment,
  formatHeading,
  formatQuote,
  formatBulletList,
  formatNumberedList,
  undoCommand,
  redoCommand,
} from '@/handlers/editorFormatHandlers';
import { InsertImageDialog } from './imagePlugin';

export default function ToolbarPlugin() {
  const {
    isBold,
    isItalic,
    isUnderline,
    isStrikethrough,
    isCode,
    isHighlight,
    blockType,
    editor,
  } = useToolbarState();

  const [showImageDialog, setShowImageDialog] = useState(false);

  return (
    <>
      <div className=" backdrop-blur-lg flex flex-wrap items-center gap-1 border border-default-200 w-fit p-1 rounded-lg ml-80 mt-4 fixed top-0 left-0 z-10">
        <ToolbarButton
          onClick={() => undoCommand(editor)}
          icon={ArrowUturnLeftIcon}
          label="Undo"
        />
        <ToolbarButton
          onClick={() => redoCommand(editor)}
          icon={ArrowUturnRightIcon}
          label="Redo"
        />

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => formatText(editor, 'bold')}
          isActive={isBold}
          icon={BoldIcon}
          label="Bold"
        />
        <ToolbarButton
          onClick={() => formatText(editor, 'italic')}
          isActive={isItalic}
          icon={ItalicIcon}
          label="Italic"
        />
        <ToolbarButton
          onClick={() => formatText(editor, 'underline')}
          isActive={isUnderline}
          icon={UnderlineIcon}
          label="Underline"
        />
        <ToolbarButton
          onClick={() => formatText(editor, 'strikethrough')}
          isActive={isStrikethrough}
          icon={StrikethroughIcon}
          label="Strikethrough"
        />
        <ToolbarButton
          onClick={() => formatText(editor, 'code')}
          isActive={isCode}
          icon={CodeBracketIcon}
          label="Code"
        />
        
        <HighlightColorPicker editor={editor} isActive={isHighlight} />

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => formatHeading(editor, 'h1', blockType)}
          isActive={blockType === 'h1'}
          icon={H1Icon}
          label="Heading 1"
        />
        <ToolbarButton
          onClick={() => formatHeading(editor, 'h2', blockType)}
          isActive={blockType === 'h2'}
          icon={H2Icon}
          label="Heading 2"
        />
        <ToolbarButton
          onClick={() => formatHeading(editor, 'h3', blockType)}
          isActive={blockType === 'h3'}
          icon={H3Icon}
          label="Heading 3"
        />

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => formatBulletList(editor, blockType)}
          isActive={blockType === 'bullet'}
          icon={ListBulletIcon}
          label="Bullet List"
        />
        <ToolbarButton
          onClick={() => formatNumberedList(editor, blockType)}
          isActive={blockType === 'number'}
          icon={NumberedListIcon}
          label="Numbered List"
        />
        <ToolbarButton
          onClick={() => formatQuote(editor, blockType)}
          isActive={blockType === 'quote'}
          icon={PaperClipIcon}
          label="Quote"
        />

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => setShowImageDialog(true)}
          icon={PhotoIcon}
          label="Insert Image"
        />

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => formatAlignment(editor, 'left')}
          icon={Bars3BottomLeftIcon}
          label="Align Left"
        />
        <ToolbarButton
          onClick={() => formatAlignment(editor, 'center')}
          icon={Bars3Icon}
          label="Align Center"
        />
        <ToolbarButton
          onClick={() => formatAlignment(editor, 'right')}
          icon={Bars3BottomRightIcon}
          label="Align Right"
        />
        <ToolbarButton
          onClick={() => formatAlignment(editor, 'justify')}
          icon={Bars4Icon}
          label="Align Justify"
        />
      </div>

      {showImageDialog && (
        <InsertImageDialog
          activeEditor={editor}
          onClose={() => setShowImageDialog(false)}
        />
      )}
    </>
  );
}