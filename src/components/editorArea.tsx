'use client';

import { useCallback } from 'react';
import { Note01Icon } from '@hugeicons/core-free-icons';
import Icon from '@/components/icon';
import LexicalTextarea from '@/components/textarea/editor';
import { useNotes } from '@/contexts/notesContext';

export default function EditorArea() {
  const { getSelectedNote, updateNote } = useNotes();
  const note = getSelectedNote();

  const handleChange = useCallback(
    (content: string) => {
      if (note) {
        updateNote(note.id, { content });
      }
    },
    [note, updateNote]
  );

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-default-400">
        <Icon icon={Note01Icon} size={64} className="mb-4 opacity-40" />
        <p className="text-sm">Select a note or create a new one to start writing.</p>
      </div>
    );
  }

  return (
    <LexicalTextarea
      // Remount the editor when switching notes so the new content loads.
      key={note.id}
      initialContent={note.content}
      onChange={handleChange}
      autoFocus
    />
  );
}
