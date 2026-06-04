'use client';

import { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react';
import { Add01Icon } from '@hugeicons/core-free-icons';
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [noteTitle, setNoteTitle] = useState('');
  const [folderId, setFolderId] = useState<string | null>(defaultFolderId);

  useEffect(() => {
    if (isOpen) setFolderId(defaultFolderId);
  }, [isOpen, defaultFolderId]);

  const handleCreate = () => {
    if (!noteTitle.trim()) return;

    createNote(noteTitle, folderId);
    setNoteTitle('');

    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  // Different button styles
  const renderButton = () => {
    switch (variant) {
      case 'icon':
        return (
          <Button
            isIconOnly
            color="primary"
            onPress={onOpen}
            aria-label="Create note"
            size="sm"
          >
            <Icon icon={Add01Icon} size={16} />
          </Button>
        );
      case 'fab':
        return (
          <Button
            color="primary"
            onPress={onOpen}
            className="fixed bottom-6 right-6 z-50 shadow-lg"
            size="sm"
            startContent={<Icon icon={Add01Icon} size={16} />}
          >
            New Note
          </Button>
        );
      default:
        return (
          <Button
            color="primary"
            onPress={onOpen}
            startContent={<Icon icon={Add01Icon} size={16} />}
            size="sm"
          >
            New Note
          </Button>
        );
    }
  };

  

  return (
    <>
      {renderButton()}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex items-center text-md font-normal gap-2">
            Create New Note
          </ModalHeader>
          <ModalBody>
            <Input
              autoFocus
              label="Note Title"
              placeholder="Enter note title..."
              value={noteTitle}
              size="sm"
              labelPlacement="outside"
              onChange={(e) => setNoteTitle(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            {folders.length > 0 && (
              <Select
                label="Collection"
                placeholder="No collection"
                size="sm"
                labelPlacement="outside"
                selectedKeys={folderId ? [folderId] : []}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string | undefined;
                  setFolderId(selected ?? null);
                }}
              >
                {folders.map((folder) => (
                  <SelectItem key={folder.id}>{folder.name}</SelectItem>
                ))}
              </Select>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose} size="sm">
              Cancel
            </Button>
            <Button 
              color="primary" 
              onPress={handleCreate}
              isDisabled={!noteTitle.trim()}
              size="sm"
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}