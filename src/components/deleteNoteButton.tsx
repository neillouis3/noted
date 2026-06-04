'use client';

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';
import { Delete02Icon } from '@hugeicons/core-free-icons';
import Icon from '@/components/icon';
import { useNotes } from '@/contexts/notesContext';

interface DeleteNoteButtonProps {
  noteId: string;
  noteName?: string;
  variant?: 'button' | 'icon' | 'dropdown';
  onDeleted?: () => void;
}

export default function DeleteNoteButton({
  noteId,
  noteName,
  variant = 'icon',
  onDeleted,
}: DeleteNoteButtonProps) {
  const { deleteNote, notes } = useNotes();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const note = notes.find((n) => n.id === noteId);
  const displayName = noteName || note?.title || 'this note';

  const handleDelete = () => {
    deleteNote(noteId);
    onClose();
    onDeleted?.();
  };

  // For dropdown usage (no button, just trigger)
  if (variant === 'dropdown') {
    return (
      <>
        <div onClick={onOpen} className="w-full">
          Delete
        </div>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>Delete Note</ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to delete <strong>{displayName}</strong>?
              </p>
              <p className="text-sm text-default-500">This action cannot be undone.</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="danger" onPress={handleDelete}>
                Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }

  // Button variants
  const renderButton = () => {
    if (variant === 'icon') {
      return (
        <Button
          isIconOnly
          color="danger"
          variant="light"
          onPress={onOpen}
          aria-label="Delete note"
        >
          <Icon icon={Delete02Icon} size={16} />
        </Button>
      );
    }

    return (
      <Button
        color="danger"
        variant="light"
        onPress={onOpen}
        startContent={<Icon icon={Delete02Icon} size={16} />}
      >
        Delete
      </Button>
    );
  };

  return (
    <>
      {renderButton()}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Delete Note</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to delete <strong>{displayName}</strong>?
            </p>
            <p className="text-sm text-default-500">This action cannot be undone.</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}