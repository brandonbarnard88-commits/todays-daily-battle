import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chapter reader — Today's Daily Battle",
  description:
    "Read a full KJV chapter in a calm layout. Gentle verse notes appear when they’re in the pilot shelf.",
};

export default function ReaderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
