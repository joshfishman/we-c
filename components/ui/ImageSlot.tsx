type Props = {
  src?: string | null;
  alt?: string | null;
  /** Placeholder hint shown when no image is set (mirrors the original "drop a photo" slots). */
  placeholder?: string;
  tinaField?: string;
  className?: string;
};

/**
 * Renders an image, or a branded gradient placeholder when empty.
 * Editors set the image in TinaCMS; until then the placeholder hint shows.
 */
export function ImageSlot({
  src,
  alt,
  placeholder = "Add an image in the editor",
  tinaField,
  className,
}: Props) {
  return (
    <div
      className={`imgSlot${className ? ` ${className}` : ""}`}
      data-tina-field={tinaField}
    >
      {src ? <img src={src} alt={alt || ""} /> : <span>{placeholder}</span>}
    </div>
  );
}
