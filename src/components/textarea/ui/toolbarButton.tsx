'use client';

import { Button } from '@heroui/react';
import type { ToolbarButtonProps } from '@/types/editor.types';
import Icon from '@/components/icon';

export default function ToolbarButton({
  onClick,
  isActive = false,
  icon,
  label,
}: ToolbarButtonProps) {
  return (
    <Button
      isIconOnly
      size="sm"
      variant={isActive ? 'primary' : 'ghost'}
      onPress={onClick}
      aria-label={label}
    >
      <Icon icon={icon} size={16} />
    </Button>
  );
}
