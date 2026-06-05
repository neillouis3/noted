'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  COMMAND_PRIORITY_HIGH,
  KEY_ENTER_COMMAND,
  KEY_TAB_COMMAND,
  type TextNode,
} from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import InlineDatePicker from '../ui/inlineDatePicker';
import { formatDisplayDate, getTodayDate, getTomorrowDate } from '@/utils/dateFormatter';
import { evaluateMath } from '@/utils/mathEvaluator';

type SuggestionKind = 'math' | 'date';

interface Suggestion {
  kind: SuggestionKind;
  nodeKey: string;
  matchingString: string;
  ghostText: string;
  tabReplacement: string;
  shiftEnterReplacement: string;
  openDatePicker?: boolean;
}

interface GhostPosition {
  top: number;
  left: number;
}

function mathMatchAtCursor(text: string): { matchingString: string; expression: string } | null {
  const suffixMatch = /(?:^|[\s])([\d+\-*/().\s]+=)$/.exec(text);
  if (suffixMatch) {
    const matchingString = suffixMatch[1];
    const expression = matchingString.replace(/=\s*$/, '').trim();
    return expression ? { matchingString, expression } : null;
  }

  const prefixMatch = /(?:^|[\s])(=\s*[\d+\-*/().\s]+)$/.exec(text);
  if (prefixMatch) {
    const matchingString = prefixMatch[1];
    const expression = matchingString.replace(/^=\s*/, '').trim();
    return expression ? { matchingString, expression } : null;
  }

  return null;
}

function dateMatchAtCursor(text: string): { matchingString: string; query: string } | null {
  const match = /@(\w*)$/.exec(text);
  if (!match) {
    return null;
  }

  return { matchingString: match[0], query: match[1].toLowerCase() };
}

function replaceMatchingText(
  textNode: TextNode,
  matchingString: string,
  replacement: string
) {
  const content = textNode.getTextContent();
  const index = content.lastIndexOf(matchingString);
  if (index === -1) {
    return;
  }

  const newContent =
    content.slice(0, index) + replacement + content.slice(index + matchingString.length);
  textNode.setTextContent(newContent);

  const cursor = index + replacement.length;
  textNode.select(cursor, cursor);
}

function getDateSuggestion(query: string): Suggestion | null {
  const options = [
    {
      key: 'today',
      label: 'today',
      value: formatDisplayDate(getTodayDate()),
    },
    {
      key: 'tomorrow',
      label: 'tomorrow',
      value: formatDisplayDate(getTomorrowDate()),
    },
    {
      key: 'pick',
      label: 'date',
      value: '',
      openDatePicker: true,
    },
  ];

  const match = options.find(
    (option) => option.label.startsWith(query) || option.key.startsWith(query)
  );

  if (!match) {
    return null;
  }

  const isComplete = query === match.label || query === match.key;
  const completion = match.label.startsWith(query) ? match.label.slice(query.length) : '';

  let ghostText: string;
  if (match.openDatePicker) {
    ghostText = completion || 'date';
  } else if (isComplete) {
    ghostText = match.value;
  } else {
    ghostText = completion || match.label;
  }

  return {
    kind: 'date',
    nodeKey: '',
    matchingString: `@${query}`,
    ghostText,
    tabReplacement: match.value,
    shiftEnterReplacement: match.value,
    openDatePicker: match.openDatePicker,
  };
}

function getMathSuggestion(
  matchingString: string,
  expression: string
): Suggestion | null {
  const result = evaluateMath(expression);
  if (result === null) {
    return null;
  }

  const endsWithEquals = /=\s*$/.test(matchingString);
  const shiftEnterReplacement = endsWithEquals
    ? `${matchingString}${result}`
    : `${expression}=${result}`;

  return {
    kind: 'math',
    nodeKey: '',
    matchingString,
    ghostText: result,
    tabReplacement: result,
    shiftEnterReplacement,
  };
}

function resolveSuggestion(textNode: TextNode, anchorOffset: number): Suggestion | null {
  const textBeforeCursor = textNode.getTextContent().slice(0, anchorOffset);

  const mathMatch = mathMatchAtCursor(textBeforeCursor);
  if (mathMatch) {
    const suggestion = getMathSuggestion(mathMatch.matchingString, mathMatch.expression);
    if (suggestion) {
      return { ...suggestion, nodeKey: textNode.getKey() };
    }
  }

  const dateMatch = dateMatchAtCursor(textBeforeCursor);
  if (dateMatch) {
    const suggestion = getDateSuggestion(dateMatch.query);
    if (suggestion) {
      return {
        ...suggestion,
        nodeKey: textNode.getKey(),
        matchingString: dateMatch.matchingString,
      };
    }
  }

  return null;
}

export default function AutocompletePlugin() {
  const [editor] = useLexicalComposerContext();
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [ghostPosition, setGhostPosition] = useState<GhostPosition | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pendingReplace, setPendingReplace] = useState<{
    nodeKey: string;
    matchingString: string;
  } | null>(null);

  const updateSuggestion = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
        setSuggestion(null);
        return;
      }

      const anchorNode = selection.anchor.getNode();
      if (!$isTextNode(anchorNode)) {
        setSuggestion(null);
        return;
      }

      const nextSuggestion = resolveSuggestion(anchorNode, selection.anchor.offset);
      setSuggestion(nextSuggestion);
    });
  }, [editor]);

  const updateGhostPosition = useCallback(() => {
    if (!suggestion) {
      setGhostPosition(null);
      return;
    }

    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) {
      setGhostPosition(null);
      return;
    }

    const range = domSelection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    if (rect.width === 0 && rect.height === 0) {
      setGhostPosition(null);
      return;
    }

    setGhostPosition({
      top: rect.top,
      left: rect.right + 2,
    });
  }, [suggestion]);

  const applySuggestion = useCallback(
    (mode: 'tab' | 'shiftEnter') => {
      if (!suggestion) {
        return;
      }

      if (mode === 'tab' && suggestion.openDatePicker) {
        setPendingReplace({
          nodeKey: suggestion.nodeKey,
          matchingString: suggestion.matchingString,
        });
        setShowDatePicker(true);
        setSuggestion(null);
        return;
      }

      const replacement =
        mode === 'tab' ? suggestion.tabReplacement : suggestion.shiftEnterReplacement;

      editor.update(() => {
        const node = $getNodeByKey(suggestion.nodeKey);
        if (!node || !$isTextNode(node)) {
          return;
        }

        replaceMatchingText(node, suggestion.matchingString, replacement);
      });

      setSuggestion(null);
    },
    [editor, suggestion]
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateSuggestion();
        });
      }),
      editor.registerCommand(
        KEY_TAB_COMMAND,
        (event) => {
          if (!suggestion) {
            return false;
          }

          event.preventDefault();
          applySuggestion('tab');
          return true;
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (event) => {
          if (!event?.shiftKey || !suggestion || suggestion.openDatePicker) {
            return false;
          }

          event.preventDefault();
          applySuggestion('shiftEnter');
          return true;
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [editor, suggestion, applySuggestion, updateSuggestion]);

  useEffect(() => {
    updateGhostPosition();

    const handleReposition = () => updateGhostPosition();
    window.addEventListener('scroll', handleReposition, true);
    window.addEventListener('resize', handleReposition);

    return () => {
      window.removeEventListener('scroll', handleReposition, true);
      window.removeEventListener('resize', handleReposition);
    };
  }, [suggestion, updateGhostPosition]);

  const handleDatePicked = (dateStr: string) => {
    if (pendingReplace) {
      editor.update(() => {
        const node = $getNodeByKey(pendingReplace.nodeKey);
        if (node && $isTextNode(node)) {
          replaceMatchingText(node, pendingReplace.matchingString, dateStr);
        }
      });
    }

    setShowDatePicker(false);
    setPendingReplace(null);
  };

  return (
    <>
      {suggestion &&
        ghostPosition &&
        createPortal(
          <span
            className="fixed pointer-events-none select-none text-sm text-muted/70 whitespace-pre"
            style={{
              top: ghostPosition.top,
              left: ghostPosition.left,
            }}
          >
            {suggestion.ghostText}
          </span>,
          document.body
        )}
      {showDatePicker &&
        createPortal(
          <InlineDatePicker
            onSelect={handleDatePicked}
            onCancel={() => {
              setShowDatePicker(false);
              setPendingReplace(null);
            }}
          />,
          document.body
        )}
    </>
  );
}
