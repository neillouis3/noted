'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Note, NoteContextType } from '@/types/notes.types';

const NotesContext = createContext<NoteContextType | undefined>(undefined);



export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // Create a new note
  const createNote = useCallback((title: string, folderId: string | null = null): Note => {
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
  }, []);

  // Update an existing note
  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date() }
          : note
      )
    );
  }, []);

  // Delete a note
  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
  }, [selectedNoteId]);

  // Select a note
  const selectNote = useCallback((id: string | null) => {
    setSelectedNoteId(id);
  }, []);

  

  // Move note to different folder
  const moveNoteToFolder = useCallback((noteId: string, folderId: string | null) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === noteId ? { ...note, folderId, updatedAt: new Date() } : note
      )
    );
  }, []);

  

  // Get currently selected note
  const getSelectedNote = useCallback((): Note | null => {
    return notes.find((note) => note.id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  const value: NoteContextType = {
    notes,

    selectedNoteId,
    createNote,
    updateNote,
    deleteNote,
    selectNote,

  

    getSelectedNote,
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