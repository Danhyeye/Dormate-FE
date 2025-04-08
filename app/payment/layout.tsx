import type { Metadata } from "next";
import Navbar from "@/app/components/TopNav";
import Footer from "@/app/components/Footer";
import { ToastProvider, ToastViewport } from "@/components/ui/toast";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Thanh toán",
  description: "Thanh toán",
  icons: {
    icon: [
      {
        url: "/images/logo-amora-stay.png",
        href: "/images/logo-amora-stay.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased font-sans`}>
        <ToastProvider>
          <Navbar />
          <main className="py-20">{children}</main>
          <Footer />
          <ToastViewport />
        </ToastProvider>
      </body>
    </html>
  );
}
