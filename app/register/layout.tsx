import type { Metadata } from "next";
import Navbar from "@/app/components/TopNav";
import Footer from "@/app/components/Footer";
import "@/app/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Đăng ký",
  icons: {
    icon: [
      {
        url: "/images/logo-amora-stay.png",
        href: "/images/logo-amora-stay.png",
      },
    ],
  },
};

export default function RegisterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${inter.className} mt-16`}>
      <Navbar />
      <main className="py-20">{children}</main>
      <Footer />
    </div>
  );
}
