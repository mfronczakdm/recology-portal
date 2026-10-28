import type { ServiceStream } from "@/lib/amcs/types";
import { Badge } from "@/components/ui/badge";

const styles: Record<ServiceStream, string> = {
  garbage: "border-transparent bg-neutral-800 text-white",
  recycling: "border-transparent bg-sky-700 text-white",
  compost: "border-transparent bg-primary text-white",
};

const labels: Record<ServiceStream, string> = {
  garbage: "Garbage",
  recycling: "Recycling",
  compost: "Compost",
};

export function StreamBadge({ stream }: { stream: ServiceStream }) {
  return <Badge className={styles[stream]}>{labels[stream]}</Badge>;
}

export function streamLabel(stream: ServiceStream) {
  return labels[stream];
}
