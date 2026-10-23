import { useState } from "react";

interface ImagePlaceholderProps {
  label: string;
  src?: string | null;
  className?: string;
}

export function ImagePlaceholder({ label, src, className = "" }: ImagePlaceholderProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const displaySrc = src && src !== failedSrc ? src : null;

  return (
    <figure className={`relative overflow-hidden bg-gradient-to-br from-warm-cream to-brand/10 ${className}`}>
      {displaySrc ? (
        <img
          src={displaySrc}
          alt={label}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setFailedSrc(displaySrc)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-4 text-center">
          <span className="text-sm font-semibold text-brand-dark">{label}</span>
          <span className="text-xs text-ink-muted">Image placeholder</span>
        </div>
      )}

      <figcaption className="absolute inset-x-0 bottom-0 truncate bg-white/90 px-3 py-2 text-xs font-semibold text-ink">
        {label}
      </figcaption>
    </figure>
  );
}
