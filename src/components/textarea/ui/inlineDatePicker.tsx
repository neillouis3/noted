'use client';

import type { DateValue } from '@internationalized/date';
import { getLocalTimeZone, today } from '@internationalized/date';
import { Button } from '@heroui/react';
import { useState } from 'react';
import HeroDatePicker from '@/components/heroDatePicker';
import { formatDateValue } from '@/utils/dateFormatter';

interface InlineDatePickerProps {
  onSelect: (formattedDate: string) => void;
  onCancel: () => void;
}

export default function InlineDatePicker({ onSelect, onCancel }: InlineDatePickerProps) {
  const [value, setValue] = useState<DateValue>(today(getLocalTimeZone()));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onCancel}
    >
      <div
        className="bg-background border border-border rounded-xl p-4 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <HeroDatePicker label="Pick a date" value={value} onChange={setValue} />
        <div className="flex gap-2 mt-4 justify-end">
          <Button variant="tertiary" size="sm" onPress={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onPress={() => onSelect(formatDateValue(value))}>
            Insert
          </Button>
        </div>
      </div>
    </div>
  );
}
