import { getCropImage } from "@/lib/crop-images";

interface CropImageProps {
  cropId: string;
  className?: string;
  /** Size in pixels for the emoji fallback font (default 48) */
  emojiFontSize?: number;
}

/**
 * Renders a real crop photo if available, otherwise a
 * vibrant gradient background with a large crop emoji.
 */
export function CropImage({ cropId, className = "", emojiFontSize = 48 }: CropImageProps) {
  const data = getCropImage(cropId);

  if (data.src) {
    return (
      <img
        src={data.src}
        alt={data.alt}
        className={`object-cover w-full h-full ${className}`}
        loading="lazy"
        decoding="async"
      />
    );
  }

  // Gradient + emoji fallback
  return (
    <span
      className={`flex items-center justify-center w-full h-full select-none ${className}`}
      style={{ background: data.gradient }}
      role="img"
      aria-label={data.alt}
    >
      <span
        className="crop-emoji"
        style={{
          fontSize: emojiFontSize,
          lineHeight: 1,
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
        }}
      >
        {data.emoji}
      </span>
    </span>
  );
}
