import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glare AR - Try any look instantly",
  description: "Try any look in AR instantly. Upload a photo or use live camera. Works with any phone.",
  keywords: "AR, augmented reality, nail art, beauty, virtual try-on",
  openGraph: {
    title: "Glare AR",
    description: "Try any look in AR instantly",
    url: "https://glarear.art",
    siteName: "Glare AR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/phone_17_pro_max.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/texture.av1.mp4" as="fetch" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
