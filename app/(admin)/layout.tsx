import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/app/components/admin-sidebar";
import RoleProtection from "@/app/components/auth/RoleProtection";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dormate Admin",
  description: "Admin dashboard for Dormate",
  icons: {
    icon: "https://www.quingroup.vn/quintech.webp",
    apple: "https://www.quingroup.vn/quintech.webp",
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <main>
        <RoleProtection allowedRoles={["Admin"]} fallbackPath="/">
          <SidebarProvider>
            <AdminSidebar variant="inset" collapsible="icon"/>
            {children}
          </SidebarProvider>
        </RoleProtection>
      </main>
    </div>
  );
} 