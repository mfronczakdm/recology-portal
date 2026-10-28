"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "cn";

export function Logo({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        className,
      )}
    >
      {failed ? (
        <span className="text-2xl font-bold tracking-tight text-primary">Recology</span>
      ) : (
        <Image
          src="/recology-logo.png"
          alt="Recology"
          width={220}
          height={48}
          priority
          className="h-8 w-auto max-w-[42vw] object-contain object-left sm:h-9 sm:max-w-none"
          onError={() => setFailed(true)}
        />
      )}
    </Link>
  );
}
