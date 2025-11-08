"use client";
import { useState, ReactNode } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Cross, Download } from "lucide-react";
import { Button } from "../ui/button";

export interface MediaDialogProps {
  src: string;
  alt?: string;
  children?: ReactNode;
}

export default function MediaDialog({ src, alt, children }: MediaDialogProps) {
  const [open, setOpen] = useState(false);
  const downloadFile = (url: string, filename: string) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  };
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
              <div className="relative w-full max-h-[60vh] h-[60vh]">
                <Image
                  src={source}
                  alt={alt ?? "media"}
                  fill
                  style={{ objectFit: "contain" }}
                  loading="lazy"
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
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
              onClick={() => downloadFile(source, alt || "file")}
            >
              <Download />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
