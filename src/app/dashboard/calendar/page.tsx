import type { Metadata } from "next";
import { CalendarView } from "@/components/dashboard/calendar-view";
import { getServiceCalendar } from "@/lib/amcs/client";

export const metadata: Metadata = { title: "Service Calendar" };

export default async function CalendarPage() {
  const schedules = await getServiceCalendar();
  return <CalendarView schedules={schedules} />;
}
