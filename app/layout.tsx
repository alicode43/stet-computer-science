import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bihar STET Computer Science Paper-II | CBT Test Portal",
  description:
    "Official CBT Mock Test Platform for Bihar STET Computer Science (Classes 11-12) Paper-II. Full 150-mark Mocks, Topic-Wise Tests, Official PYQs (2023, 2024, 2025), Timed Exam Simulation, and Instant Explanations.",
  keywords: [
    "Bihar STET",
    "STET Computer Science",
    "Paper II",
    "Classes 11-12",
    "Mock Test",
    "PYQ",
    "Bihar Teacher Examination",
    "BSEB",
    "CBT Test",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
