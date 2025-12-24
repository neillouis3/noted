"use client";

import { useState } from "react";
import {
  Image,
  Input,
  Listbox,
  ListboxItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { useNotes } from "@/contexts/notesContext";
import CreateNoteButton from "./createNoteButton";

export default function Sidebar() {
  const {
    notes,
    selectedNoteId,
    selectNote,
    deleteNote,
  } = useNotes();

  const [searchQuery, setSearchQuery] = useState("");

  // Filter notes by search
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-72 bg-background text-foreground flex flex-col h-[calc(100vh-2rem)] border border-default-200 rounded-lg p-4 fixed top-0 left-0 z-10 ml-4 mt-4 ">
      {/* Header */}
      <div className="flex flex-row gap-4 items-center mb-4">
        <Image
          src="/logo.png"
          alt="Navigate"
          width={48}
          height={48}
          className="rounded-lg"
        />
        <h1 className="text-sm font-semibold">Noted</h1>
        
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<MagnifyingGlassIcon className="h-4 w-4" />}
          className="w-full"
          size="sm"
        />
      </div>

      {/* New Note Button */}
      <div className="mb-4">
        <CreateNoteButton />
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.length > 0 ? (
          <Listbox
            aria-label="Notes"
            variant="flat"
            selectionMode="single"
            selectedKeys={selectedNoteId ? [selectedNoteId] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;
              selectNote(selected);
            }}
          >
            {filteredNotes.map((note) => (
              <ListboxItem
                key={note.id}
                startContent={
                  <DocumentTextIcon className="h-4 w-4 text-default-500" />
                }
                endContent={
                  <Dropdown>
                    <DropdownTrigger>
                      <button
                        className="p-1 hover:bg-default-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <EllipsisVerticalIcon className="h-4 w-4" />
                      </button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Note actions">
                      <DropdownItem
                        key="delete"
                        className="text-danger"
                        color="danger"
                        onPress={() => deleteNote(note.id)}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                }
                className="group"
                textValue={note.title}
              >
                <span className="text-sm truncate">{note.title}</span>
              </ListboxItem>
            ))}
          </Listbox>
        ) : (
          <div className="text-center py-8 text-default-400">
            <DocumentTextIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              {searchQuery ? "No notes found" : "No notes yet"}
            </p>
            <p className="text-xs mt-1">Click "New Note" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}