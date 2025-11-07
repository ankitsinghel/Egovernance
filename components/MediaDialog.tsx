"use client";
import { useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Cross } from "lucide-react";
import { Button } from "./ui/button";

export interface MediaDialogProps {
  src: string;
  alt?: string;
  children?: ReactNode;
}

export default function MediaDialog({ src, alt, children }: MediaDialogProps) {
  const [open, setOpen] = useState(false);

  // simple heuristic to detect media type
  const isImage = /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(src);
  const isVideo = /\.(mp4|webm|ogg)$/i.test(src);

  const isAudio = /\.(mp3|wav|ogg)$/i.test(src);
  const source = `https://srwksjrfrdwuudkuyfzz.supabase.co/storage/v1/object/public/Complaints/${src}`;
  return (
    <>
      <span className="inline-block" onClick={() => setOpen(true)}>
        {children}
      </span>

      <Dialog open={open} onOpenChange={(val: boolean) => setOpen(val)}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>{alt ?? "Media"}</DialogTitle>
          </DialogHeader>
          <div className="my-4 flex justify-center items-center">
            {isImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={source}
                alt={alt}
                className="max-h-[60vh] object-contain"
              />
            )}
            {isVideo && (
              <video controls className="max-h-[60vh]">
                <source src={source} />
                Your browser does not support the video tag.
              </video>
            )}
            {isAudio && (
              <audio controls>
                <source src={source} />
                Your browser does not support the audio element.
              </audio>
            )}
            {!isImage && !isVideo && !isAudio && (
              <a
                href={source}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600"
              >
                Open media
              </a>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              <Cross />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
