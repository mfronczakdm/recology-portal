"use client";

import { useEffect } from "react";
import { ensureCloudSdk } from "@/lib/sitecore/track-account";

/** Starts Cloud SDK once so the sc_cid cookie exists before registration. */
export function CloudSdkInit() {
  useEffect(() => {
    void ensureCloudSdk();
  }, []);

  return null;
}
