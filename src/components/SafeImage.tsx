import { ImgHTMLAttributes, useEffect, useState } from "react";

const FALLBACK_IMAGE = "/products/product-placeholder.svg";

export default function SafeImage({
  src,
  alt,
  onError,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const [resolvedSrc, setResolvedSrc] = useState(src || FALLBACK_IMAGE);

  useEffect(() => {
    setResolvedSrc(src || FALLBACK_IMAGE);
  }, [src]);

  return (
    <img
      {...props}
      src={resolvedSrc}
      alt={alt}
      onError={(event) => {
        if (resolvedSrc !== FALLBACK_IMAGE) {
          setResolvedSrc(FALLBACK_IMAGE);
        }
        onError?.(event);
      }}
    />
  );
}
