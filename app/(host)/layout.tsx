import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import RoleProtection from "@/app/components/auth/RoleProtection";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dormate",
  icons: {
    icon: "https://www.quingroup.vn/quintech.webp",
    apple: "https://www.quingroup.vn/quintech.webp",
  },
};

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  
    return (
      <div>
        <main>
          <RoleProtection allowedRoles={["Landlord"]} fallbackPath="/">
            <SidebarProvider>
              <AppSidebar variant="inset" collapsible="icon"/>
              {children}
            </SidebarProvider>
          </RoleProtection>
        </main>
      </div>
    );
  }