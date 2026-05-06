import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prayer — Today's Daily Battle",
  description:
    "Pray privately on this device, or visit the shared wall on the main site when you are ready.",
};

export default function PrayerWallLayout({ children }: { children: React.ReactNode }) {
  return children;
}
