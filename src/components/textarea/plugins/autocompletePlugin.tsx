'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  type MenuTextMatch,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $getNodeByKey, type TextNode } from 'lexical';
import { useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import InlineDatePicker from '../ui/inlineDatePicker';
import { formatDisplayDate, getTodayDate, getTomorrowDate } from '@/utils/dateFormatter';
import { evaluateMath } from '@/utils/mathEvaluator';

class AutocompleteOption extends MenuOption {
  key: string;
  label: string;
  value: string;

  constructor(key: string, label: string, value: string) {
    super(key);
    this.key = key;
    this.label = label;
    this.value = value;
  }
}

function mathTriggerFn(text: string): MenuTextMatch | null {
  // Suffix equals: "1+1="
  const suffixMatch = /(?:^|[\s])([\d+\-*/().\s]+=)$/.exec(text);
  if (suffixMatch) {
    const matchingString = suffixMatch[1];
    const leadOffset = suffixMatch.index + (suffixMatch[0].length - matchingString.length);
    return { leadOffset, matchingString, replaceableString: matchingString };
  }

  // Prefix equals: "=1+1"
  const prefixMatch = /(?:^|[\s])(=\s*[\d+\-*/().\s]+)$/.exec(text);
  if (prefixMatch) {
    const matchingString = prefixMatch[1];
    const leadOffset = prefixMatch.index + (prefixMatch[0].length - matchingString.length);
    return { leadOffset, matchingString, replaceableString: matchingString };
  }

  return null;
}

function extractMathExpression(matchingString: string): string | null {
  const expression = matchingString
    .replace(/^=\s*/, '')
    .replace(/=\s*$/, '')
    .trim();
  return expression || null;
}

function replaceMatchingText(
  textNode: TextNode | null,
  matchingString: string,
  replacement: string
) {
  if (!textNode) {
    return;
  }

  const content = textNode.getTextContent();
  const index = content.lastIndexOf(matchingString);
  if (index === -1) {
    return;
  }

  const newContent =
    content.slice(0, index) + replacement + content.slice(index + matchingString.length);
  textNode.setTextContent(newContent);
}

function AutocompleteMenu({
  options,
  selectedIndex,
  selectOptionAndCleanUp,
  setHighlightedIndex,
}: {
  options: AutocompleteOption[];
  selectedIndex: number | null;
  selectOptionAndCleanUp: (option: AutocompleteOption) => void;
  setHighlightedIndex: (index: number) => void;
}) {
  if (options.length === 0) {
    return null;
  }

  return (
    <div className="min-w-[220px] rounded-lg border border-border bg-background p-1 shadow-lg">
      <ul className="flex flex-col gap-0.5">
        {options.map((option, index) => (
          <li key={option.key}>
            <button
              type="button"
              className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                index === selectedIndex
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-surface-secondary'
              }`}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseDown={(event) => {
                event.preventDefault();
                selectOptionAndCleanUp(option);
              }}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AutocompletePlugin() {
  const [editor] = useLexicalComposerContext();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pendingNodeKey, setPendingNodeKey] = useState<string | null>(null);
  const [pendingMatchingString, setPendingMatchingString] = useState('');

  const dateTrigger = useBasicTypeaheadTriggerMatch('@', {
    minLength: 0,
    maxLength: 20,
  });

  const [dateQuery, setDateQuery] = useState<string | null>(null);
  const dateOptions = useMemo(() => {
    const query = (dateQuery ?? '').toLowerCase();
    const options = [
      new AutocompleteOption(
        'today',
        `Today — ${formatDisplayDate(getTodayDate())}`,
        formatDisplayDate(getTodayDate())
      ),
      new AutocompleteOption(
        'tomorrow',
        `Tomorrow — ${formatDisplayDate(getTomorrowDate())}`,
        formatDisplayDate(getTomorrowDate())
      ),
      new AutocompleteOption('pick', 'Pick a date...', ''),
    ];

    if (!query) {
      return options;
    }

    return options.filter((option) => option.label.toLowerCase().includes(query));
  }, [dateQuery]);

  const onSelectDateOption = useCallback(
    (
      option: AutocompleteOption,
      textNode: TextNode | null,
      closeMenu: () => void,
      matchingString: string
    ) => {
      if (option.key === 'pick') {
        setPendingNodeKey(textNode?.getKey() ?? null);
        setPendingMatchingString(matchingString);
        setShowDatePicker(true);
        closeMenu();
        return;
      }

      editor.update(() => {
        replaceMatchingText(textNode, matchingString, option.value);
      });
      closeMenu();
    },
    [editor]
  );

  const [mathQuery, setMathQuery] = useState<string | null>(null);
  const mathOptions = useMemo(() => {
    if (!mathQuery) {
      return [];
    }

    const result = evaluateMath(mathQuery);
    if (result === null) {
      return [];
    }

    return [new AutocompleteOption('result', `${mathQuery} = ${result}`, result)];
  }, [mathQuery]);

  const onSelectMathOption = useCallback(
    (
      option: AutocompleteOption,
      textNode: TextNode | null,
      closeMenu: () => void,
      matchingString: string
    ) => {
      editor.update(() => {
        replaceMatchingText(textNode, matchingString, option.value);
      });
      closeMenu();
    },
    [editor]
  );

  const handleDatePicked = (dateStr: string) => {
    editor.update(() => {
      const textNode = pendingNodeKey ? $getNodeByKey(pendingNodeKey) : null;
      if (textNode && 'setTextContent' in textNode) {
        replaceMatchingText(textNode as TextNode, pendingMatchingString, dateStr);
      }
    });
    setShowDatePicker(false);
    setPendingNodeKey(null);
    setPendingMatchingString('');
  };

  const renderMenu = (
    anchorElementRef: React.RefObject<HTMLElement | null>,
    {
      selectedIndex,
      selectOptionAndCleanUp,
      setHighlightedIndex,
      options,
    }: {
      selectedIndex: number | null;
      selectOptionAndCleanUp: (option: AutocompleteOption) => void;
      setHighlightedIndex: (index: number) => void;
      options: AutocompleteOption[];
    }
  ) => {
    if (!anchorElementRef.current || options.length === 0) {
      return null;
    }

    return (
      <AutocompleteMenu
        options={options}
        selectedIndex={selectedIndex}
        selectOptionAndCleanUp={selectOptionAndCleanUp}
        setHighlightedIndex={setHighlightedIndex}
      />
    );
  };

  return (
    <>
      <LexicalTypeaheadMenuPlugin
        triggerFn={dateTrigger}
        options={dateOptions}
        onQueryChange={setDateQuery}
        onSelectOption={onSelectDateOption}
        menuRenderFn={renderMenu}
      />
      <LexicalTypeaheadMenuPlugin
        triggerFn={mathTriggerFn}
        options={mathOptions}
        onQueryChange={(match) => setMathQuery(match ? extractMathExpression(match) : null)}
        onSelectOption={onSelectMathOption}
        menuRenderFn={renderMenu}
      />
      {showDatePicker &&
        createPortal(
          <InlineDatePicker
            onSelect={handleDatePicked}
            onCancel={() => {
              setShowDatePicker(false);
              setPendingNodeKey(null);
              setPendingMatchingString('');
            }}
          />,
          document.body
        )}
    </>
  );
}
