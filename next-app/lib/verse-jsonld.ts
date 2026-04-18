import { dailyVerse } from "@/lib/daily-verse";

/** Home page — rich result friendly (KJV, anxiety/parenting keywords, speakable verse). */
export function buildHomeVerseJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Today's Daily Battle",
    description:
      "A quiet place for real battles — KJV daily verse and gentle tools. No ads. No tracking.",
    inLanguage: "en",
    keywords: [
      "King James Version",
      "KJV daily verse",
      "Bible verse for anxiety",
      "Scripture for parents",
      "Christian encouragement",
      "KJV Scripture",
    ],
    about: {
      "@type": "Thing",
      name: "Daily KJV encouragement for anxiety, parenting, grief, and fear",
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".tdb-speakable-verse"],
    },
    mainEntity: {
      "@type": "Quotation",
      text: dailyVerse.text,
      name: dailyVerse.reference,
      citation: `King James Version, ${dailyVerse.reference}`,
      isPartOf: {
        "@type": "Book",
        name: "Holy Bible",
        bookEdition: "King James Version",
      },
    },
  };
}

/** Standalone Today's Verse route. */
export function buildVersePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Today's verse — ${dailyVerse.reference} (KJV)`,
    description: `King James Version daily verse: ${dailyVerse.reference}. Private, calm, no pressure.`,
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      name: "Today's Daily Battle",
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".tdb-speakable-verse"],
    },
    mainEntity: {
      "@type": "Quotation",
      text: dailyVerse.text,
      name: dailyVerse.reference,
      citation: `King James Version, ${dailyVerse.reference}`,
      isPartOf: {
        "@type": "Book",
        name: "Holy Bible",
        bookEdition: "King James Version",
      },
    },
  };
}
