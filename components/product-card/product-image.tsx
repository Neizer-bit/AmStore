"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Card media. Scales to 1.03 while the card is hovered (the parent drives the
 * `hovered` prop so the whole card animates as one gesture).
 */
export function ProductImage({
  src,
  alt,
  href,
  hovered,
}: {
  src?: string;
  alt: string;
  href: string;
  hovered: boolean;
}) {
  return (
    <Link href={href} aria-label={alt} className="block">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
        {src ? (
          <motion.div
            className="absolute inset-0"
            animate={{ scale: hovered ? 1.03 : 1 }}
            transition={{ duration: 0.5, ease: [0.22, 0.61, 0.2, 1] }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        ) : (
          <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>
    </Link>
  );
}
