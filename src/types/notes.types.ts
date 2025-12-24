export interface Note {
    id: string;
    title: string;
    content: string;
    folderId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }
  
  
  export interface NoteContextType {
    notes: Note[];

    selectedNoteId: string | null;
    createNote: (title: string, folderId?: string | null) => Note;
    updateNote: (id: string, updates: Partial<Note>) => void;
    deleteNote: (id: string) => void;
    selectNote: (id: string | null) => void;

    getSelectedNote: () => Note | null;
  }