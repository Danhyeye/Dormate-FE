"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getUserRole, isAuthenticated } from "@/app/services/authService";

interface RoleProtectionProps {
  allowedRoles: string[];
  children: ReactNode;
  fallbackPath?: string;
}

export default function RoleProtection({ 
  allowedRoles, 
  children, 
  fallbackPath = "/" 
}: RoleProtectionProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  
  useEffect(() => {
    const checkUserRole = () => {
      try {
        // Check if user is authenticated
        if (!isAuthenticated()) {
          router.push("/login");
          return;
        }
        
        // Get user role from auth service
        const userRole = getUserRole();
        
        if (userRole && allowedRoles.includes(userRole)) {
          setHasAccess(true);
        } else {
          console.log("User doesn't have the required role, redirecting...");
          router.push(fallbackPath);
        }
      } catch (error) {
        console.error("Error checking role:", error);
        router.push(fallbackPath);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserRole();
  }, [allowedRoles, router, fallbackPath]);
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Checking access...</span>
      </div>
    );
  }
  
  return hasAccess ? <>{children}</> : null;
} 