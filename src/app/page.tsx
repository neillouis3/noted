"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import EditorArea from "@/components/editorArea";
import NotesActionsToolbar from "@/components/notesActionsToolbar";
import { NotesProvider, useNotes } from "@/contexts/notesContext";
import { ThemeSwitcher } from "@/components/themeSwitch";

const ALL_COLLECTIONS_ID = "all";

function HomeContent() {
  const { folders, selectedNoteId } = useNotes();
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(ALL_COLLECTIONS_ID);

  const activeFolder =
    selectedCollectionId !== ALL_COLLECTIONS_ID
      ? folders.find((folder) => folder.id === selectedCollectionId) ?? null
      : null;

  const defaultFolderIdForNewNote =
    activeFolder?.id ?? (selectedCollectionId === ALL_COLLECTIONS_ID ? null : selectedCollectionId);

  const notesToolbarProps = {
    selectedCollectionId,
    defaultFolderIdForNewNote,
  };

  return (
    <>
      {!selectedNoteId && (
        <div className="ml-80 mt-4 fixed top-0 left-0 z-10 flex max-w-[calc(100vw-22rem)] flex-wrap items-center gap-2">
          <NotesActionsToolbar {...notesToolbarProps} />
        </div>
      )}

      <div className="w-72 h-full">
        <Sidebar
          selectedCollectionId={selectedCollectionId}
          onSelectedCollectionChange={setSelectedCollectionId}
        />
      </div>

      <div className="flex-1">
        <div className="fixed top-0 right-0 z-10 mr-4 mt-4">
          <ThemeSwitcher />
        </div>
        <EditorArea notesToolbarProps={notesToolbarProps} />
      </div>
    </>
  );
}

export default function Home() {
  return (
    <div className="w-full h-screen p-4 overflow-y-hidden flex flex-row">
      <NotesProvider>
        <HomeContent />
      </NotesProvider>
    </div>
  );
}
