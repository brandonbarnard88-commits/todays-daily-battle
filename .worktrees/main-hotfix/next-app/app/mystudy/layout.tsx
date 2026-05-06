import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Study — Today's Daily Battle",
  description:
    "Verses you saved on this device — local-first, KJV, no pressure. Export anytime.",
};

export default function MyStudyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
