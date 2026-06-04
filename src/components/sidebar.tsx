"use client";

import { useMemo, useState } from "react";
import type { Key } from "react";
import {
  Image,
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  useDisclosure,
} from "@heroui/react";
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  EllipsisVerticalIcon,
  FolderIcon,
  FolderPlusIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { useNotes } from "@/contexts/notesContext";
import type { Note } from "@/types/notes.types";
import { downloadNoteAsTxt, printNote } from "@/utils/noteExport";
import CreateNoteButton from "./createNoteButton";

export default function Sidebar() {
  const {
    notes,
    folders,
    selectedNoteId,
    selectNote,
    deleteNote,
    moveNoteToFolder,
    createFolder,
    renameFolder,
    deleteFolder,
  } = useNotes();

  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Collection create / rename modal state.
  const collectionModal = useDisclosure();
  const [collectionName, setCollectionName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);

  const query = searchQuery.toLowerCase();
  const filteredNotes = useMemo(
    () =>
      notes.filter((note) => note.title.toLowerCase().includes(query)),
    [notes, query]
  );

  const ungroupedNotes = filteredNotes.filter((n) => n.folderId === null);

  const toggleFolder = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const openCreateCollection = () => {
    setEditingFolderId(null);
    setCollectionName("");
    collectionModal.onOpen();
  };

  const openRenameCollection = (id: string, currentName: string) => {
    setEditingFolderId(id);
    setCollectionName(currentName);
    collectionModal.onOpen();
  };

  const handleCollectionSubmit = () => {
    if (!collectionName.trim()) return;
    if (editingFolderId) {
      renameFolder(editingFolderId, collectionName);
    } else {
      const folder = createFolder(collectionName);
      setExpanded((prev) => ({ ...prev, [folder.id]: true }));
    }
    setCollectionName("");
    setEditingFolderId(null);
    collectionModal.onClose();
  };

  const noteRow = (note: Note) => (
    <NoteRow
      key={note.id}
      note={note}
      isSelected={selectedNoteId === note.id}
      folders={folders}
      onSelect={() => selectNote(note.id)}
      onMove={(folderId) => moveNoteToFolder(note.id, folderId)}
      onDownload={() => downloadNoteAsTxt(note.title, note.content)}
      onPrint={() => printNote(note.title, note.content)}
      onDelete={() => deleteNote(note.id)}
    />
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

      {/* Actions */}
      <div className="mb-4 flex items-center gap-2">
        <CreateNoteButton />
        <Button
          variant="flat"
          size="sm"
          onPress={openCreateCollection}
          startContent={<FolderPlusIcon className="h-5 w-5" />}
        >
          Collection
        </Button>
      </div>

      {/* Notes + Collections */}
      <div className="flex-1 overflow-y-auto -mr-2 pr-2">
        {notes.length === 0 && folders.length === 0 ? (
          <div className="text-center py-8 text-default-400">
            <DocumentTextIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notes yet</p>
            <p className="text-xs mt-1">Click &quot;New Note&quot; to get started</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {/* Collections */}
            {folders.map((folder) => {
              const folderNotes = filteredNotes.filter(
                (n) => n.folderId === folder.id
              );
              const isOpen = expanded[folder.id] ?? false;
              return (
                <div key={folder.id}>
                  <div className="group flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-default-100">
                    <button
                      className="flex items-center gap-1.5 flex-1 min-w-0 text-left"
                      onClick={() => toggleFolder(folder.id)}
                    >
                      {isOpen ? (
                        <ChevronDownIcon className="h-3.5 w-3.5 text-default-500 shrink-0" />
                      ) : (
                        <ChevronRightIcon className="h-3.5 w-3.5 text-default-500 shrink-0" />
                      )}
                      <FolderIcon className="h-4 w-4 text-default-500 shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {folder.name}
                      </span>
                      <span className="text-xs text-default-400 shrink-0">
                        {folderNotes.length}
                      </span>
                    </button>
                    <Dropdown placement="bottom-end">
                      <DropdownTrigger>
                        <button className="p-1 hover:bg-default-200 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          <EllipsisVerticalIcon className="h-4 w-4" />
                        </button>
                      </DropdownTrigger>
                      <DropdownMenu
                        aria-label="Collection actions"
                        onAction={(key) => {
                          if (key === "rename")
                            openRenameCollection(folder.id, folder.name);
                          if (key === "delete") deleteFolder(folder.id);
                        }}
                      >
                        <DropdownItem
                          key="rename"
                          startContent={<PencilIcon className="h-4 w-4" />}
                        >
                          Rename
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          startContent={<TrashIcon className="h-4 w-4" />}
                        >
                          Delete collection
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>

                  {isOpen && (
                    <div className="ml-4 flex flex-col gap-0.5 mt-0.5">
                      {folderNotes.length > 0 ? (
                        folderNotes.map(noteRow)
                      ) : (
                        <p className="text-xs text-default-400 px-3 py-1.5">
                          Empty collection
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Ungrouped notes */}
            {ungroupedNotes.length > 0 && (
              <div className="mt-1 flex flex-col gap-0.5">
                {folders.length > 0 && (
                  <p className="text-xs uppercase tracking-wide text-default-400 px-2 pt-2 pb-1">
                    Notes
                  </p>
                )}
                {ungroupedNotes.map(noteRow)}
              </div>
            )}

            {filteredNotes.length === 0 && searchQuery && (
              <p className="text-center text-sm text-default-400 py-4">
                No notes found
              </p>
            )}
          </div>
        )}
      </div>

      {/* Create / Rename collection modal */}
      <Modal isOpen={collectionModal.isOpen} onClose={collectionModal.onClose}>
        <ModalContent>
          <ModalHeader className="text-md font-normal">
            {editingFolderId ? "Rename Collection" : "New Collection"}
          </ModalHeader>
          <ModalBody>
            <Input
              autoFocus
              label="Collection Name"
              placeholder="Enter collection name..."
              value={collectionName}
              size="sm"
              labelPlacement="outside"
              onChange={(e) => setCollectionName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCollectionSubmit();
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="light" size="sm" onPress={collectionModal.onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              size="sm"
              onPress={handleCollectionSubmit}
              isDisabled={!collectionName.trim()}
            >
              {editingFolderId ? "Save" : "Create"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

interface NoteRowProps {
  note: Note;
  isSelected: boolean;
  folders: { id: string; name: string }[];
  onSelect: () => void;
  onMove: (folderId: string | null) => void;
  onDownload: () => void;
  onPrint: () => void;
  onDelete: () => void;
}

function NoteRow({
  note,
  isSelected,
  folders,
  onSelect,
  onMove,
  onDownload,
  onPrint,
  onDelete,
}: NoteRowProps) {
  const handleAction = (key: Key) => {
    const action = String(key);
    if (action === "download") onDownload();
    else if (action === "print") onPrint();
    else if (action === "delete") onDelete();
    else if (action === "move:none") onMove(null);
    else if (action.startsWith("move:")) onMove(action.slice(5));
  };

  const moveTargets = folders.filter((f) => f.id !== note.folderId);
  const showMoveSection = note.folderId !== null || moveTargets.length > 0;

  return (
    <div
      className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
        isSelected ? "bg-default-200" : "hover:bg-default-100"
      }`}
      onClick={onSelect}
    >
      <DocumentTextIcon className="h-4 w-4 text-default-500 shrink-0" />
      <span className="text-sm truncate flex-1 min-w-0">{note.title}</span>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <button
            className="p-1 hover:bg-default-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <EllipsisVerticalIcon className="h-4 w-4" />
          </button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Note actions" onAction={handleAction}>
          <DropdownSection showDivider title="Export">
            <DropdownItem
              key="download"
              startContent={<ArrowDownTrayIcon className="h-4 w-4" />}
            >
              Download .txt
            </DropdownItem>
            <DropdownItem
              key="print"
              startContent={<PrinterIcon className="h-4 w-4" />}
            >
              Print
            </DropdownItem>
          </DropdownSection>

          {showMoveSection ? (
            <DropdownSection showDivider title="Move to collection">
              {note.folderId !== null ? (
                <DropdownItem
                  key="move:none"
                  startContent={<DocumentTextIcon className="h-4 w-4" />}
                >
                  Remove from collection
                </DropdownItem>
              ) : null}
              {moveTargets.map((f) => (
                <DropdownItem
                  key={`move:${f.id}`}
                  startContent={<FolderIcon className="h-4 w-4" />}
                >
                  {f.name}
                </DropdownItem>
              ))}
            </DropdownSection>
          ) : null}

          <DropdownSection>
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              startContent={<TrashIcon className="h-4 w-4" />}
            >
              Delete
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
