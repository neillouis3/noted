'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import type { Note, Folder, NoteContextType } from '@/types/notes.types';

const NotesContext = createContext<NoteContextType | undefined>(undefined);

const STORAGE_KEY = 'noted:data:v1';

interface PersistedShape {
  notes: Note[];
  folders: Folder[];
  selectedNoteId: string | null;
}

// Restore notes/folders from localStorage, reviving Date fields.
function loadFromStorage(): PersistedShape | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedShape;
    const notes = (parsed.notes ?? []).map((n) => ({
      ...n,
      createdAt: new Date(n.createdAt),
      updatedAt: new Date(n.updatedAt),
    }));
    const folders = (parsed.folders ?? []).map((f) => ({
      ...f,
      createdAt: new Date(f.createdAt),
    }));
    return {
      notes,
      folders,
      selectedNoteId: parsed.selectedNoteId ?? null,
    };
  } catch {
    return null;
  }
}

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state once on mount.
  useEffect(() => {
    const data = loadFromStorage();
    if (data) {
      setNotes(data.notes);
      setFolders(data.folders);
      setSelectedNoteId(data.selectedNoteId);
    }
    setHydrated(true);
  }, []);

  // Persist whenever data changes (after initial hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload: PersistedShape = { notes, folders, selectedNoteId };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore quota / serialization errors.
    }
  }, [notes, folders, selectedNoteId, hydrated]);

  const createNote = useCallback(
    (title: string, folderId: string | null = null): Note => {
      const newNote: Note = {
        id: Date.now().toString(),
        title: title.trim() || 'Untitled Note',
        content: '',
        folderId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setNotes((prev) => [...prev, newNote]);
      setSelectedNoteId(newNote.id);
      return newNote;
    },
    []
  );

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
      )
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    setSelectedNoteId((current) => (current === id ? null : current));
  }, []);

  const selectNote = useCallback((id: string | null) => {
    setSelectedNoteId(id);
  }, []);

  const moveNoteToFolder = useCallback(
    (noteId: string, folderId: string | null) => {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === noteId
            ? { ...note, folderId, updatedAt: new Date() }
            : note
        )
      );
    },
    []
  );

  const getSelectedNote = useCallback((): Note | null => {
    return notes.find((note) => note.id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  const createFolder = useCallback((name: string): Folder => {
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name: name.trim() || 'New Collection',
      createdAt: new Date(),
    };
    setFolders((prev) => [...prev, newFolder]);
    return newFolder;
  }, []);

  const renameFolder = useCallback((id: string, name: string) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === id
          ? { ...folder, name: name.trim() || folder.name }
          : folder
      )
    );
  }, []);

  // Deleting a folder keeps its notes but moves them back to "ungrouped".
  const deleteFolder = useCallback((id: string) => {
    setFolders((prev) => prev.filter((folder) => folder.id !== id));
    setNotes((prev) =>
      prev.map((note) =>
        note.folderId === id ? { ...note, folderId: null } : note
      )
    );
  }, []);

  const value: NoteContextType = {
    notes,
    folders,
    selectedNoteId,
    createNote,
    updateNote,
    deleteNote,
    selectNote,
    moveNoteToFolder,
    getSelectedNote,
    createFolder,
    renameFolder,
    deleteFolder,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
