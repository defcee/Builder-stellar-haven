import { useEffect, useRef, useState, type ChangeEvent } from "react";

interface ImagePlaceholderProps {
  label: string;
  src?: string | null;
  className?: string;
}

export function ImagePlaceholder({ label, src, className = "" }: ImagePlaceholderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (uploadedUrl) URL.revokeObjectURL(uploadedUrl);
    };
  }, [uploadedUrl]);

  const displaySrc = uploadedUrl ?? src ?? null;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !file.type.startsWith("image/")) return;
    setUploadedUrl(URL.createObjectURL(file));
  }

  return (
    <figure className={`relative overflow-hidden bg-gradient-to-br from-warm-cream to-brand/10 ${className}`}>
      {displaySrc ? (
        <img src={displaySrc} alt={label} className="h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-4 text-center">
          <span className="text-sm font-semibold text-brand-dark">{label}</span>
          <span className="text-xs text-ink-muted">Image placeholder</span>
        </div>
      )}

      <figcaption className="absolute inset-x-0 bottom-0 truncate bg-white/90 px-3 py-2 text-xs font-semibold text-ink">
        {label}
      </figcaption>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="absolute right-2 top-2 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand-dark shadow-card hover:bg-brand/5 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
      >
        {uploadedUrl ? "Replace image" : "Upload image"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        aria-label={`Upload image for ${label}`}
        className="hidden"
      />
    </figure>
  );
}
