import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar Task Manager",
  description: "Manage your tasks with a beautiful calendar interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
