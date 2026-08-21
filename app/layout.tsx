import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UrbanCart Analytics Dashboard",
  description: "Static presentation dashboard for the UrbanCart analytics term project.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
