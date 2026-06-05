'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  TextField,
  useOverlayState,
} from '@heroui/react';
import { PencilEdit02Icon } from '@hugeicons/core-free-icons';
import Icon from '@/components/icon';
import { useNotes } from '@/contexts/notesContext';

interface CreateNoteButtonProps {
  variant?: 'button' | 'icon' | 'fab';
  defaultFolderId?: string | null;
}

export default function CreateNoteButton({
  variant = 'button',
  defaultFolderId = null,
}: CreateNoteButtonProps) {
  const { createNote, folders } = useNotes();
  const modalState = useOverlayState();
  const [noteTitle, setNoteTitle] = useState('');
  const [folderId, setFolderId] = useState<string | null>(defaultFolderId);

  useEffect(() => {
    if (modalState.isOpen) {
      setFolderId(defaultFolderId);
    }
  }, [modalState.isOpen, defaultFolderId]);

  const handleCreate = () => {
    if (!noteTitle.trim()) return;

    createNote(noteTitle, folderId);
    setNoteTitle('');
    modalState.close();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  const renderButton = () => {
    switch (variant) {
      case 'icon':
        return (
          <Button
            isIconOnly
            variant="ghost"
            onPress={modalState.open}
            aria-label="Create note"
            size="sm"
          >
            <Icon icon={PencilEdit02Icon} size={16} />
          </Button>
        );
      case 'fab':
        return (
          <Button
            variant="primary"
            onPress={modalState.open}
            className="fixed bottom-6 right-6 z-50 shadow-lg"
            size="sm"
          >
            <Icon icon={PencilEdit02Icon} size={16} />
            New Note
          </Button>
        );
      default:
        return (
          <Button variant="primary" onPress={modalState.open} size="sm">
            <Icon icon={PencilEdit02Icon} size={16} />
            New Note
          </Button>
        );
    }
  };

  return (
    <>
      {renderButton()}

      <Modal state={modalState}>
        <Modal.Backdrop isOpen={modalState.isOpen} onOpenChange={modalState.setOpen}>
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-md">
              <Modal.Header>
                <Modal.Heading className="text-md font-normal">Create New Note</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="flex flex-col gap-4">
                <TextField className="w-full">
                  <Label className="text-sm">Note Title</Label>
                  <Input
                    autoFocus
                    placeholder="Enter note title..."
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </TextField>

                {folders.length > 0 && (
                  <Select
                    placeholder="No collection"
                    selectedKey={folderId ?? undefined}
                    onSelectionChange={(key) => setFolderId(key ? String(key) : null)}
                  >
                    <Label className="text-sm">Collection</Label>
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {folders.map((folder) => (
                          <ListBox.Item key={folder.id} id={folder.id} textValue={folder.name}>
                            {folder.name}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="tertiary" onPress={modalState.close} size="sm">
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onPress={handleCreate}
                  isDisabled={!noteTitle.trim()}
                  size="sm"
                >
                  Create
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
