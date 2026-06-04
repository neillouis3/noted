'use client';

import {
  UndoIcon,
  RedoIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  TextStrikethroughIcon,
  SourceCodeIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyCenterIcon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  QuoteDownIcon,
  Heading01Icon,
  Heading02Icon,
  Heading03Icon,
  Image01Icon,
} from '@hugeicons/core-free-icons';
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
          icon={UndoIcon}
          label="Undo"
        />
        <ToolbarButton
          onClick={() => redoCommand(editor)}
          icon={RedoIcon}
          label="Redo"
        />

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => formatText(editor, 'bold')}
          isActive={isBold}
          icon={TextBoldIcon}
          label="Bold"
        />
        <ToolbarButton
          onClick={() => formatText(editor, 'italic')}
          isActive={isItalic}
          icon={TextItalicIcon}
          label="Italic"
        />
        <ToolbarButton
          onClick={() => formatText(editor, 'underline')}
          isActive={isUnderline}
          icon={TextUnderlineIcon}
          label="Underline"
        />
        <ToolbarButton
          onClick={() => formatText(editor, 'strikethrough')}
          isActive={isStrikethrough}
          icon={TextStrikethroughIcon}
          label="Strikethrough"
        />
        <ToolbarButton
          onClick={() => formatText(editor, 'code')}
          isActive={isCode}
          icon={SourceCodeIcon}
          label="Code"
        />
        
        <HighlightColorPicker editor={editor} isActive={isHighlight} />

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => formatHeading(editor, 'h1', blockType)}
          isActive={blockType === 'h1'}
          icon={Heading01Icon}
          label="Heading 1"
        />
        <ToolbarButton
          onClick={() => formatHeading(editor, 'h2', blockType)}
          isActive={blockType === 'h2'}
          icon={Heading02Icon}
          label="Heading 2"
        />
        <ToolbarButton
          onClick={() => formatHeading(editor, 'h3', blockType)}
          isActive={blockType === 'h3'}
          icon={Heading03Icon}
          label="Heading 3"
        />

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => formatBulletList(editor, blockType)}
          isActive={blockType === 'bullet'}
          icon={LeftToRightListBulletIcon}
          label="Bullet List"
        />
        <ToolbarButton
          onClick={() => formatNumberedList(editor, blockType)}
          isActive={blockType === 'number'}
          icon={LeftToRightListNumberIcon}
          label="Numbered List"
        />
        <ToolbarButton
          onClick={() => formatQuote(editor, blockType)}
          isActive={blockType === 'quote'}
          icon={QuoteDownIcon}
          label="Quote"
        />

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => setShowImageDialog(true)}
          icon={Image01Icon}
          label="Insert Image"
        />

        <ToolbarDivider />

        <ToolbarButton
          onClick={() => formatAlignment(editor, 'left')}
          icon={TextAlignLeftIcon}
          label="Align Left"
        />
        <ToolbarButton
          onClick={() => formatAlignment(editor, 'center')}
          icon={TextAlignCenterIcon}
          label="Align Center"
        />
        <ToolbarButton
          onClick={() => formatAlignment(editor, 'right')}
          icon={TextAlignRightIcon}
          label="Align Right"
        />
        <ToolbarButton
          onClick={() => formatAlignment(editor, 'justify')}
          icon={TextAlignJustifyCenterIcon}
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
