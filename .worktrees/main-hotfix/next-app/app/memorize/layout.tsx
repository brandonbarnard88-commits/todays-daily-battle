import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memorize — Today's Daily Battle",
  description:
    "Gentle KJV memory practice — hide the verse, listen slow, stay on your device.",
};

export default function MemorizeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
