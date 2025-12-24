'use client';

import { useMemo, useState } from 'react';
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
import { PlusIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { useNotes } from '@/contexts/notesContext';


interface CreateNoteButtonProps {
  variant?: 'button' | 'icon' | 'fab';
  defaultFolderId?: string | null;
}

export default function CreateNoteButton({
  variant = 'button',
  defaultFolderId = null,
}: CreateNoteButtonProps) {
  const { createNote, } = useNotes();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [noteTitle, setNoteTitle] = useState('');


  const handleCreate = () => {
    if (!noteTitle.trim()) return;
    
    createNote(noteTitle);
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
            <PlusIcon className="h-5 w-5" />
          </Button>
        );
      case 'fab':
        return (
          <Button
            color="primary"
            onPress={onOpen}
            className="fixed bottom-6 right-6 z-50 shadow-lg"
            size="sm"
            startContent={<PlusIcon className="h-5 w-5" />}
          >
            New Note
          </Button>
        );
      default:
        return (
          <Button
            color="primary"
            onPress={onOpen}
            startContent={<PlusIcon className="h-5 w-5" />}
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