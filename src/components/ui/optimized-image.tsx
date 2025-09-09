import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  loading?: 'lazy' | 'eager';
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  fill = false,
  sizes = "100vw",
  quality = 75,
  loading = "lazy",
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative ${!fill ? 'inline-block' : 'w-full h-full'}`}>
      <Image
        src={src}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        fill={fill}
        sizes={sizes}
        quality={quality}
        priority={priority}
        loading={loading}
        className={`
          ${className}
          ${isLoading ? 'blur-sm' : 'blur-0'}
          transition-all duration-300
        `}
        onLoadingComplete={() => setIsLoading(false)}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded" />
      )}
    </div>
  );
}

// Placeholder image component for when no image is available
export function ImagePlaceholder({ className = "", text = "Imagen" }: { className?: string; text?: string }) {
  return (
    <div className={`bg-gray-100 rounded flex items-center justify-center ${className}`}>
      <span className="text-gray-400 text-sm">{text}</span>
    </div>
  );
}

// Optimized avatar component
export function OptimizedAvatar({
  src,
  alt,
  size = 40,
  className = "",
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`relative rounded-full overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="object-cover"
        loading="lazy"
      />
    </div>
  );
}