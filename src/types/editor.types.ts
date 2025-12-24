export interface EditorProps {
    placeholder?: string;
    initialContent?: string;
    onChange?: (content: string) => void;
    autoFocus?: boolean;
    className?: string;
  }
  
  export interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
  }
  
  export type BlockType = 
    | 'paragraph' 
    | 'h1' 
    | 'h2' 
    | 'h3' 
    | 'h4' 
    | 'h5' 
    | 'quote' 
    | 'code' 
    | 'bullet' 
    | 'number';
  
  export type AlignmentType = 'left' | 'center' | 'right' | 'justify';
  
  export type TextFormatType = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code';