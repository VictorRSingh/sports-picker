import type { Metadata } from "next";
import "./globals.css";


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
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
