export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: Date;
}

export interface NoteContextType {
  notes: Note[];
  folders: Folder[];

  selectedNoteId: string | null;

  createNote: (title: string, folderId?: string | null) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  selectNote: (id: string | null) => void;
  moveNoteToFolder: (noteId: string, folderId: string | null) => void;
  getSelectedNote: () => Note | null;

  createFolder: (name: string) => Folder;
  renameFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
}
