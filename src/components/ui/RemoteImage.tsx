import Image from "next/image";
import { cn } from "@/lib/utils";

type RemoteImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function RemoteImage({
  src,
  alt,
  width,
  height,
  className,
  priority,
  sizes,
}: RemoteImageProps) {
  if (!src) return null;

  const isLocal = src.startsWith("/") && !src.startsWith("//");

  if (isLocal) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(className)}
      priority={priority}
      sizes={sizes}
      unoptimized={!src.includes("supabase.co")}
    />
  );
}
