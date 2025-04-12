import type { Metadata } from "next";
import Navbar from "@/app/components/TopNav";
import Footer from "@/app/components/Footer";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Dormate - Danh sách phòng",
  description: "Xem và tìm kiếm danh sách phòng trọ phù hợp",
  icons: {
    icon: [
      {
        url: "/images/logo.jpg",
        href: "/images/logo.jpg",
      },
    ],
  },
};

export default function PostsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
}
