"use client";

import { useEffect, useMemo, useState } from "react";
import type { Key } from "react";
import {
  Button,
  Dropdown,
  Header,
  Input,
  Label,
  Modal,
  SearchField,
  Separator,
  Tabs,
  TextField,
  useOverlayState,
} from "@heroui/react";
import {
  Note01Icon,
  MoreVerticalIcon,
  Folder01Icon,
  Add01Icon,
  Download01Icon,
  PrinterIcon,
  Delete02Icon,
  PencilEdit01Icon,
} from "@hugeicons/core-free-icons";
import { useNotes } from "@/contexts/notesContext";
import type { Note } from "@/types/notes.types";
import { downloadNoteAsTxt, printNote } from "@/utils/noteExport";
import CreateNoteButton from "./createNoteButton";
import Icon from "./icon";

const sidebarIconClass = "shrink-0 text-muted";
const ALL_COLLECTIONS_ID = "all";

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
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(ALL_COLLECTIONS_ID);
  const collectionModal = useOverlayState();
  const [collectionName, setCollectionName] = useState("");
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);

  const query = searchQuery.toLowerCase();
  const filteredNotes = useMemo(
    () => notes.filter((note) => note.title.toLowerCase().includes(query)),
    [notes, query]
  );

  const displayedNotes = useMemo(() => {
    if (folders.length === 0) {
      return filteredNotes;
    }

    if (selectedCollectionId === ALL_COLLECTIONS_ID) {
      return filteredNotes.filter((note) => note.folderId === null);
    }

    return filteredNotes.filter((note) => note.folderId === selectedCollectionId);
  }, [filteredNotes, folders.length, selectedCollectionId]);

  const activeFolder =
    selectedCollectionId !== ALL_COLLECTIONS_ID
      ? folders.find((folder) => folder.id === selectedCollectionId) ?? null
      : null;

  const defaultFolderIdForNewNote =
    activeFolder?.id ?? (selectedCollectionId === ALL_COLLECTIONS_ID ? null : selectedCollectionId);

  useEffect(() => {
    if (
      selectedCollectionId !== ALL_COLLECTIONS_ID &&
      !folders.some((folder) => folder.id === selectedCollectionId)
    ) {
      setSelectedCollectionId(ALL_COLLECTIONS_ID);
    }
  }, [folders, selectedCollectionId]);

  const openCreateCollection = () => {
    setEditingFolderId(null);
    setCollectionName("");
    collectionModal.open();
  };

  const openRenameCollection = () => {
    if (!activeFolder) return;
    setEditingFolderId(activeFolder.id);
    setCollectionName(activeFolder.name);
    collectionModal.open();
  };

  const handleCollectionSubmit = () => {
    if (!collectionName.trim()) return;

    if (editingFolderId) {
      renameFolder(editingFolderId, collectionName);
    } else {
      const folder = createFolder(collectionName);
      setSelectedCollectionId(folder.id);
    }

    setCollectionName("");
    setEditingFolderId(null);
    collectionModal.close();
  };

  const handleDeleteCollection = () => {
    if (!activeFolder) return;
    deleteFolder(activeFolder.id);
    setSelectedCollectionId(ALL_COLLECTIONS_ID);
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
    <div className="w-72 bg-background text-foreground flex flex-col h-[calc(100vh-2rem)] border border-border rounded-lg p-4 fixed top-0 left-0 z-10 ml-4 mt-4">
      <div className="mb-4">
        <SearchField
          fullWidth
          aria-label="Search notes"
          value={searchQuery}
          onChange={setSearchQuery}
          variant="secondary"
        >
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Search notes..." />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
      </div>

      <div className="mb-4">
        <CreateNoteButton defaultFolderId={defaultFolderIdForNewNote} />
      </div>

      {folders.length > 0 && (
        <div className="mb-3 flex items-center gap-1 min-w-0">
          <Button
            isIconOnly
            size="sm"
            variant="secondary"
            aria-label="Create collection"
            className="shrink-0"
            onPress={openCreateCollection}
          >
            <Icon icon={Add01Icon} size={16} />
          </Button>

          <div className="min-w-0 flex-1 overflow-x-auto no-scrollbar">
            <Tabs
              selectedKey={selectedCollectionId}
              onSelectionChange={(key) => setSelectedCollectionId(String(key))}
              variant="secondary"
            >
              <Tabs.ListContainer className="min-w-0">
                <Tabs.List className="flex-nowrap">
                  <Tabs.Tab id={ALL_COLLECTIONS_ID}>All</Tabs.Tab>
                  {folders.map((folder) => (
                    <Tabs.Tab key={folder.id} id={folder.id}>
                      <span className="truncate max-w-[88px]">{folder.name}</span>
                    </Tabs.Tab>
                  ))}
                  <Tabs.Indicator />
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>
          </div>

          {activeFolder && (
            <Dropdown>
              <Dropdown.Trigger>
                <Button
                  isIconOnly
                  size="sm"
                  variant="ghost"
                  aria-label="Collection options"
                  className="shrink-0"
                >
                  <Icon icon={MoreVerticalIcon} size={16} className={sidebarIconClass} />
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Popover placement="bottom end">
                <Dropdown.Menu
                  aria-label="Collection actions"
                  onAction={(key) => {
                    if (key === "rename") openRenameCollection();
                    if (key === "delete") handleDeleteCollection();
                  }}
                >
                  <Dropdown.Item id="rename" textValue="Rename">
                    <Icon icon={PencilEdit01Icon} className={sidebarIconClass} />
                    <Label>Rename</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="delete" textValue="Delete collection" variant="danger">
                    <Icon icon={Delete02Icon} className={sidebarIconClass} />
                    <Label>Delete collection</Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          )}
        </div>
      )}

      {folders.length === 0 && (
        <div className="mb-3">
          <Button
            isIconOnly
            size="sm"
            variant="secondary"
            aria-label="Create collection"
            onPress={openCreateCollection}
          >
            <Icon icon={Add01Icon} size={16} />
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto -mr-2 pr-2 text-sm">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-muted">
            <Icon icon={Note01Icon} size={48} className="mx-auto mb-2 opacity-50" />
            <p>No notes yet</p>
            <p className="text-muted mt-1">Click &quot;New Note&quot; to get started</p>
          </div>
        ) : displayedNotes.length > 0 ? (
          <div className="flex flex-col gap-0.5">{displayedNotes.map(noteRow)}</div>
        ) : searchQuery ? (
          <p className="text-center text-muted py-4">No notes found</p>
        ) : (
          <p className="text-center text-muted py-4">
            {activeFolder ? "Empty collection" : "No notes in this view"}
          </p>
        )}
      </div>

      <Modal state={collectionModal}>
        <Modal.Backdrop
          isOpen={collectionModal.isOpen}
          onOpenChange={collectionModal.setOpen}
        >
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-md">
              <Modal.Header>
                <Modal.Heading className="text-md font-normal">
                  {editingFolderId ? "Rename Collection" : "New Collection"}
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <TextField className="w-full">
                  <Label className="text-sm">Collection Name</Label>
                  <Input
                    autoFocus
                    placeholder="Enter collection name..."
                    value={collectionName}
                    onChange={(e) => setCollectionName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCollectionSubmit();
                    }}
                  />
                </TextField>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="tertiary" size="sm" onPress={collectionModal.close}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onPress={handleCollectionSubmit}
                  isDisabled={!collectionName.trim()}
                >
                  {editingFolderId ? "Save" : "Create"}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
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
  const moveMenuItems = [
    ...(note.folderId !== null
      ? [{ key: "move:none", label: "Remove from collection", kind: "remove" as const }]
      : []),
    ...moveTargets.map((f) => ({
      key: `move:${f.id}`,
      label: f.name,
      kind: "folder" as const,
    })),
  ];

  return (
    <div
      className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-sm ${
        isSelected ? "bg-surface-tertiary" : "hover:bg-surface-secondary"
      }`}
      onClick={onSelect}
    >
      <Icon icon={Note01Icon} className={sidebarIconClass} />
      <span className="truncate flex-1 min-w-0">{note.title}</span>
      <Dropdown>
        <Dropdown.Trigger>
          <button
            className="p-1 hover:bg-surface-tertiary rounded opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <Icon icon={MoreVerticalIcon} className={sidebarIconClass} />
          </button>
        </Dropdown.Trigger>
        <Dropdown.Popover placement="bottom end">
          <Dropdown.Menu aria-label="Note actions" onAction={handleAction}>
            <Dropdown.Section>
              <Header>Export</Header>
              <Dropdown.Item id="download" textValue="Download .txt">
                <Icon icon={Download01Icon} className={sidebarIconClass} />
                <Label>Download .txt</Label>
              </Dropdown.Item>
              <Dropdown.Item id="print" textValue="Print">
                <Icon icon={PrinterIcon} className={sidebarIconClass} />
                <Label>Print</Label>
              </Dropdown.Item>
            </Dropdown.Section>

            {showMoveSection ? (
              <>
                <Separator />
                <Dropdown.Section>
                  <Header>Move to collection</Header>
                  {moveMenuItems.map((item) => (
                    <Dropdown.Item key={item.key} id={item.key} textValue={item.label}>
                      <Icon
                        icon={item.kind === "remove" ? Note01Icon : Folder01Icon}
                        className={sidebarIconClass}
                      />
                      <Label>{item.label}</Label>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Section>
              </>
            ) : null}

            <Separator />
            <Dropdown.Section>
              <Dropdown.Item id="delete" textValue="Delete" variant="danger">
                <Icon icon={Delete02Icon} className={sidebarIconClass} />
                <Label>Delete</Label>
              </Dropdown.Item>
            </Dropdown.Section>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
    </div>
  );
}
