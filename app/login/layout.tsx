import type { Metadata } from "next";
import Navbar from "@/app/components/TopNav";
import Footer from "@/app/components/Footer";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Dormate - Đăng nhập",
  description: "Đăng nhập vào tài khoản của bạn",
  icons: {
    icon: [
      {
        url: "/images/logo-amora-stay.png",
        href: "/images/logo-amora-stay.png",
      },
    ],
  },
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mt-16">
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  );
}
