import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bihar STET Computer Science Paper-II | 100% Free Mock Test Series & CBT Portal",
  description:
    "Free online mock test series for Bihar STET Computer Science Paper-II (Classes 11-12 / PGT / उच्च माध्यमिक). Practice 899+ authentic BSEB PYQs (2023, 2024, 2025), full 150-mark CBT exam simulations, topic-wise practice tests with instant explanations, and detailed solution keys. 100% free with no login required.",
  keywords: [
    "Bihar STET Computer Science free test series",
    "Bihar STET Paper 2 free mock test",
    "STET Computer Science online test series free",
    "Bihar STET Class 11-12 Computer Science PYQ",
    "BSEB STET Paper 2 CBT mock test",
    "Bihar PGT computer science mock test",
    "Bihar STET computer science previous year questions",
    "free test series bihar stet computer science",
    "Bihar teacher vacancy computer science test series",
    "Bihar STET 2024 2025 computer science paper 2",
    "STET Computer Science syllabus 150 marks",
    "free cbt test portal bihar stet",
    "Data Structures DBMS Python Operating Systems mock test",
    "Bihar STET previous year question paper computer science",
    "alicode43 stet computer science",
  ],
  authors: [{ name: "Bihar STET Open Community", url: "https://github.com/alicode43/stet-computer-science" }],
  creator: "alicode43",
  publisher: "Bihar STET Computer Science CBT Simulator",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Bihar STET Computer Science Paper-II | 100% Free Mock Test Series & CBT Portal",
    description:
      "Practice 899+ authentic BSEB PYQs (2023, 2024, 2025) in a realistic 150-mark CBT exam environment. Full-length mock tests, topic drills, instant explanations, 100% free with no paywall.",
    url: "https://github.com/alicode43/stet-computer-science",
    siteName: "Bihar STET Computer Science CBT Simulator",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bihar STET Computer Science Paper-II | Free Mock Test Series",
    description:
      "100% Free Bihar STET Computer Science CBT Mock Test Series with 899+ official PYQs, full 150-minute exam timer, and comprehensive solutions.",
  },
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalWebPage",
  name: "Bihar STET Computer Science Paper-II Free Mock Test Series",
  description:
    "Comprehensive 100% free online mock test series and CBT examination simulator for Bihar STET Computer Science Paper-II (Classes 11-12 / PGT). Features 899 authentic BSEB previous year questions, 150-mark timed simulations, and topic-wise practice.",
  isAccessibleForFree: true,
  educationalLevel: "Senior Secondary (Classes 11-12)",
  inLanguage: ["en", "hi"],
  learningResourceType: ["Quiz", "Assessment", "Practice Problem"],
  about: [
    "Bihar STET Computer Science",
    "BSEB Teacher Eligibility Test",
    "Computer Science Mock Test",
    "Data Structures & Algorithms",
    "DBMS & SQL",
    "Python Programming",
    "Operating Systems",
    "Computer Networks",
    "Digital Electronics",
  ],
  provider: {
    "@type": "Organization",
    name: "Bihar STET Open Community",
    url: "https://github.com/alicode43/stet-computer-science",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
