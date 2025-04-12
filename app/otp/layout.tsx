import type { Metadata } from "next";
import Navbar from "@/app/components/TopNav";
import Footer from "@/app/components/Footer";
import "@/app/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OTP",
  description: "OTP",
  icons: {
    icon: [
      {
        url: "/images/logo-amora-stay.png",
        href: "/images/logo-amora-stay.png",
      },
    ],
  },
};

export default function OtpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={inter.className}>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
