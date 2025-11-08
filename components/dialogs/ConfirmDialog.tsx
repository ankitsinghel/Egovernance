"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  confirmText?: string;
  cancelText?: string;
}

export default function DeleteConfirmDialog({
  open,
  title = "Confirm Delete",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  onClose,
  onConfirm,
  confirmText = "Delete",
  cancelText = "Cancel",
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              await onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
