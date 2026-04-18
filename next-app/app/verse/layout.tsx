import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Today's Verse — Today's Daily Battle",
  description: "KJV daily verse — gentle, private, unhurried.",
};

export default function VerseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
