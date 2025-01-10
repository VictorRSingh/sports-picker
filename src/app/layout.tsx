import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";

export const metadata: Metadata = {
  title: "Sports Prediction App",
  description: "Created by Victor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased h-full w-full`}>
        <div className="max-h-20 w-full sticky top-0">
          <Navbar />
        </div>
        <div className="flex flex-grow h-[calc(100vh_-_80px)] w-full">{children}</div>
      </body>
    </html>
  );
}
