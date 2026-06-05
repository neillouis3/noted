"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import EditorArea from "@/components/editorArea";
import NotesActionsToolbar from "@/components/notesActionsToolbar";
import { NotesProvider, useNotes } from "@/contexts/notesContext";
import { ThemeSwitcher } from "@/components/themeSwitch";

const ALL_COLLECTIONS_ID = "all";

function HomeContent() {
  const { folders } = useNotes();
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(ALL_COLLECTIONS_ID);

  const activeFolder =
    selectedCollectionId !== ALL_COLLECTIONS_ID
      ? folders.find((folder) => folder.id === selectedCollectionId) ?? null
      : null;

  const defaultFolderIdForNewNote =
    activeFolder?.id ?? (selectedCollectionId === ALL_COLLECTIONS_ID ? null : selectedCollectionId);

  return (
    <>
      <div className="fixed top-4 left-4 z-20">
        <NotesActionsToolbar
          selectedCollectionId={selectedCollectionId}
          defaultFolderIdForNewNote={defaultFolderIdForNewNote}
        />
      </div>

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
        <EditorArea />
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
