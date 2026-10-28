"use client";

import Image from "next/image";
import { useState } from "react";

export function AuthArtwork() {
  const [failed, setFailed] = useState(false);

  return (
    <div className="sticky top-0 hidden h-screen lg:block">
      <div className="relative h-full overflow-hidden bg-gradient-to-br from-[#00853F] via-[#0b7a3c] to-[#063d22]">
        {failed ? (
          <div className="flex h-full items-center justify-center px-10">
            <p className="text-5xl font-bold text-white">Recology</p>
          </div>
        ) : (
          <Image
            src="/auth-bg.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="50vw"
            onError={() => setFailed(true)}
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#063d22]/55 via-transparent to-black/10" />
      </div>
    </div>
  );
}
