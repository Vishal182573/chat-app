"use client";
import { UserProvider } from "@/global/userContext";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
        <main>{children}
        </main>
    </UserProvider>
  );
}