'use client';

import { Button } from '@heroui/react';
import type { ToolbarButtonProps } from '@/types/editor.types';

export default function ToolbarButton({ 
  onClick, 
  isActive = false, 
  icon: Icon, 
  label 
}: ToolbarButtonProps) {
  return (
    <Button
      isIconOnly
      size="sm"
      variant={isActive ? 'solid' : 'light'}
      color={isActive ? 'primary' : 'default'}
      onClick={onClick}
      aria-label={label}
      
    >
      <Icon className="w-4 h-4"/>
    </Button>
  );
}