"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { useAccount } from "@/components/shell/account-provider";
import { streamLabel, StreamBadge } from "@/components/stream-badge";
import { Button } from "@/components/ui/button";
import type { CollectionSchedule, ServiceStream } from "@/lib/amcs/types";
import { cn } from "cn";

const weekdayLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const shortLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarView({
  schedules,
}: {
  schedules: Record<string, CollectionSchedule>;
}) {
  const { account } = useAccount();
  const schedule = schedules[account.id] ?? {
    weekday: 2,
    streams: account.nextCollection.streams,
  };
  const [cursor, setCursor] = useState({ year: 2026, month: 9 });

  const cells = useMemo(() => {
    const lead = new Date(cursor.year, cursor.month, 1).getDay();
    const count = new Date(cursor.year, cursor.month + 1, 0).getDate();
    return [...Array.from({ length: lead }, () => null), ...Array.from({ length: count }, (_, index) => index + 1)];
  }, [cursor]);

  const title = new Date(cursor.year, cursor.month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function shift(delta: number) {
    const next = new Date(cursor.year, cursor.month + delta, 1);
    setCursor({ year: next.getFullYear(), month: next.getMonth() });
  }

  return (
    <div>
      <PageHeader
        title="Service Calendar"
        description={`Collection for account ${account.accountNumber} is every ${weekdayLabels[schedule.weekday]}.`}
      />
      <div className="max-w-3xl rounded-xl bg-white p-4 shadow-sm ring-1 ring-foreground/10 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="icon" aria-label="Previous month" onClick={() => shift(-1)}>
              <ChevronLeft aria-hidden />
            </Button>
            <Button type="button" variant="outline" size="icon" aria-label="Next month" onClick={() => shift(1)}>
              <ChevronRight aria-hidden />
            </Button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500" aria-hidden>
          {shortLabels.map((label) => (
            <div key={label} className="py-2">
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1" role="grid" aria-label={`${title} collection calendar`}>
          {cells.map((day, index) => {
            const isPickup = day !== null && new Date(cursor.year, cursor.month, day).getDay() === schedule.weekday;
            const isToday = day === 28 && cursor.year === 2026 && cursor.month === 9;
            return (
              <div
                key={`${cursor.year}-${cursor.month}-${index}`}
                role="gridcell"
                className={cn(
                  "min-h-16 rounded-lg border border-transparent p-1 text-left sm:min-h-20",
                  day ? "bg-slate-50" : "",
                  isPickup && "border-primary/20 bg-brand-tint",
                  isToday && "ring-2 ring-primary",
                )}
                aria-label={
                  day
                    ? `${weekdayLabels[new Date(cursor.year, cursor.month, day).getDay()]} ${title.replace(/ \d{4}$/, "")} ${day}, ${cursor.year}${isPickup ? `. ${schedule.streams.map(streamLabel).join(", ")} collection` : ""}`
                    : undefined
                }
              >
                {day ? (
                  <>
                    <span className="text-sm font-medium">{day}</span>
                    {isPickup ? (
                      <span className="mt-1 flex flex-wrap gap-1">
                        {schedule.streams.map((stream) => (
                          <Dot key={stream} stream={stream} />
                        ))}
                      </span>
                    ) : null}
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium text-slate-700">Legend</p>
          {schedule.streams.map((stream) => (
            <span key={stream} className="inline-flex items-center gap-2 text-sm">
              <Dot stream={stream} />
              <StreamBadge stream={stream} />
            </span>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-5"
          onClick={() => toast.info("Calendar download is not available in this demo.")}
        >
          Add to calendar
        </Button>
      </div>
    </div>
  );
}

function Dot({ stream }: { stream: ServiceStream }) {
  const color = stream === "garbage" ? "bg-neutral-800" : stream === "recycling" ? "bg-sky-700" : "bg-primary";
  return <span className={`inline-block size-2.5 rounded-full ${color}`} aria-hidden />;
}
