"use client";
import Footer from "@/components/shared/Footer";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <>
        <main>{children}
        </main>
      </>
  );
}
