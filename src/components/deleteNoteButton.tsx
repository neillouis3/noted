'use client';

import { Button, Modal, useOverlayState } from '@heroui/react';
import { Delete02Icon } from '@hugeicons/core-free-icons';
import Icon from '@/components/icon';
import { useNotes } from '@/contexts/notesContext';

interface DeleteNoteButtonProps {
  noteId: string;
  noteName?: string;
  variant?: 'button' | 'icon' | 'dropdown';
  onDeleted?: () => void;
}

function DeleteConfirmModal({
  state,
  displayName,
  onConfirm,
}: {
  state: ReturnType<typeof useOverlayState>;
  displayName: string;
  onConfirm: () => void;
}) {
  return (
    <Modal state={state}>
      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-md">
            <Modal.Header>
              <Modal.Heading>Delete Note</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p>
                Are you sure you want to delete <strong>{displayName}</strong>?
              </p>
              <p className="text-sm text-muted mt-2">This action cannot be undone.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="tertiary" onPress={state.close}>
                Cancel
              </Button>
              <Button variant="danger" onPress={onConfirm}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default function DeleteNoteButton({
  noteId,
  noteName,
  variant = 'icon',
  onDeleted,
}: DeleteNoteButtonProps) {
  const { deleteNote, notes } = useNotes();
  const modalState = useOverlayState();

  const note = notes.find((n) => n.id === noteId);
  const displayName = noteName || note?.title || 'this note';

  const handleDelete = () => {
    deleteNote(noteId);
    modalState.close();
    onDeleted?.();
  };

  if (variant === 'dropdown') {
    return (
      <>
        <div onClick={modalState.open} className="w-full">
          Delete
        </div>
        <DeleteConfirmModal
          state={modalState}
          displayName={displayName}
          onConfirm={handleDelete}
        />
      </>
    );
  }

  const renderButton = () => {
    if (variant === 'icon') {
      return (
        <Button
          isIconOnly
          variant="danger-soft"
          onPress={modalState.open}
          aria-label="Delete note"
        >
          <Icon icon={Delete02Icon} size={16} />
        </Button>
      );
    }

    return (
      <Button variant="danger-soft" onPress={modalState.open}>
        <Icon icon={Delete02Icon} size={16} />
        Delete
      </Button>
    );
  };

  return (
    <>
      {renderButton()}
      <DeleteConfirmModal
        state={modalState}
        displayName={displayName}
        onConfirm={handleDelete}
      />
    </>
  );
}
