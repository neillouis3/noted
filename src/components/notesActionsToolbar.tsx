"use client";

import { useEffect, useState } from "react";
import type { Key } from "react";
import {
  Button,
  Dropdown,
  Header,
  Input,
  Label,
  Modal,
  TextField,
  Toolbar,
  useOverlayState,
} from "@heroui/react";
import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import CreateNoteButton from "@/components/createNoteButton";
import Icon from "@/components/icon";
import { useNotes } from "@/contexts/notesContext";

const ALL_COLLECTIONS_ID = "all";
const toolbarClassName = "backdrop-blur-lg";

interface NotesActionsToolbarProps {
  selectedCollectionId: string;
  defaultFolderIdForNewNote: string | null;
}

export default function NotesActionsToolbar({
  selectedCollectionId,
  defaultFolderIdForNewNote,
}: NotesActionsToolbarProps) {
  const { getSelectedNote, updateNote, renameFolder, folders } = useNotes();
  const selectedNote = getSelectedNote();
  const activeFolder =
    selectedCollectionId !== ALL_COLLECTIONS_ID
      ? folders.find((folder) => folder.id === selectedCollectionId) ?? null
      : null;

  const noteRenameModal = useOverlayState();
  const collectionRenameModal = useOverlayState();
  const [noteTitle, setNoteTitle] = useState("");
  const [collectionName, setCollectionName] = useState("");

  const canRenameNote = Boolean(selectedNote);
  const canRenameCollection = Boolean(activeFolder);
  const hasRenameActions = canRenameNote || canRenameCollection;

  useEffect(() => {
    if (noteRenameModal.isOpen && selectedNote) {
      setNoteTitle(selectedNote.title);
    }
  }, [noteRenameModal.isOpen, selectedNote]);

  useEffect(() => {
    if (collectionRenameModal.isOpen && activeFolder) {
      setCollectionName(activeFolder.name);
    }
  }, [collectionRenameModal.isOpen, activeFolder]);

  const openNoteRename = () => {
    if (!selectedNote) return;
    setNoteTitle(selectedNote.title);
    noteRenameModal.open();
  };

  const openCollectionRename = () => {
    if (!activeFolder) return;
    setCollectionName(activeFolder.name);
    collectionRenameModal.open();
  };

  const handleNoteRename = () => {
    if (!selectedNote || !noteTitle.trim()) return;
    updateNote(selectedNote.id, { title: noteTitle.trim() });
    noteRenameModal.close();
  };

  const handleCollectionRename = () => {
    if (!activeFolder || !collectionName.trim()) return;
    renameFolder(activeFolder.id, collectionName);
    collectionRenameModal.close();
  };

  const handleRenameAction = (key: Key) => {
    const action = String(key);
    if (action === "rename-note") openNoteRename();
    else if (action === "rename-collection") openCollectionRename();
  };

  return (
    <>
      <Toolbar isAttached aria-label="Note actions" className={toolbarClassName}>
        <Dropdown>
          <Dropdown.Trigger>
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              aria-label="Rename note or collection"
              isDisabled={!hasRenameActions}
            >
              <Icon icon={MoreVerticalIcon} size={16} />
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Popover placement="bottom start">
            <Dropdown.Menu aria-label="Rename actions" onAction={handleRenameAction}>
              {canRenameNote ? (
                <Dropdown.Section>
                  <Header>Note</Header>
                  <Dropdown.Item id="rename-note" textValue="Rename note">
                    <Label>Rename note</Label>
                  </Dropdown.Item>
                </Dropdown.Section>
              ) : null}
              {canRenameCollection ? (
                <Dropdown.Section>
                  <Header>Collection</Header>
                  <Dropdown.Item id="rename-collection" textValue="Rename collection">
                    <Label>Rename collection</Label>
                  </Dropdown.Item>
                </Dropdown.Section>
              ) : null}
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>

        <CreateNoteButton variant="icon" defaultFolderId={defaultFolderIdForNewNote} />
      </Toolbar>

      <Modal state={noteRenameModal}>
        <Modal.Backdrop isOpen={noteRenameModal.isOpen} onOpenChange={noteRenameModal.setOpen}>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-md">
              <Modal.Header>
                <Modal.Heading className="text-md font-normal">Rename Note</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <TextField className="w-full">
                  <Label className="text-sm">Note Title</Label>
                  <Input
                    autoFocus
                    placeholder="Enter note title..."
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleNoteRename();
                    }}
                  />
                </TextField>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="tertiary" size="sm" onPress={noteRenameModal.close}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onPress={handleNoteRename}
                  isDisabled={!noteTitle.trim()}
                >
                  Save
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <Modal state={collectionRenameModal}>
        <Modal.Backdrop
          isOpen={collectionRenameModal.isOpen}
          onOpenChange={collectionRenameModal.setOpen}
        >
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-md">
              <Modal.Header>
                <Modal.Heading className="text-md font-normal">Rename Collection</Modal.Heading>
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
                      if (e.key === "Enter") handleCollectionRename();
                    }}
                  />
                </TextField>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="tertiary" size="sm" onPress={collectionRenameModal.close}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onPress={handleCollectionRename}
                  isDisabled={!collectionName.trim()}
                >
                  Save
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
