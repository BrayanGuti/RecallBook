import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // metadataBase: new URL("https://recallbook.app"),
  title: "RecallBook — Recuerda lo que lees",
  description:
    "Convierte las ideas clave de tus libros favoritos en sesiones cortas e interactivas de Active Recall.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "RecallBook — Recuerda lo que lees",
    description:
      "Convierte las ideas clave de tus libros favoritos en sesiones cortas e interactivas de Active Recall.",
    type: "website",
    siteName: "RecallBook",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RecallBook — Aprende y recuerda lo que lees",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RecallBook — Recuerda lo que lees",
    description:
      "Convierte las ideas clave de tus libros favoritos en sesiones cortas e interactivas de Active Recall.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
