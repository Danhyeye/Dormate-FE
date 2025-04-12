"use client"

import { useEffect, useState } from "react"
import {
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { logout } from "@/app/services/authService"

// Helper function to extract data from JWT token
const extractFromToken = (token: string): { name?: string; email?: string; avatar?: string } => {
  try {
    const payload = token.split('.')[1]
    const decodedPayload = atob(payload)
    const claims = JSON.parse(decodedPayload)
    return {
      name: claims.FullName || claims.fullName || claims.unique_name || claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || claims.name,
      email: claims.email || claims.Email || claims.EMAIL || claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
      avatar: claims.Avatar || claims.avatar,
    }
  } catch (error) {
    console.error("Error extracting data from token:", error)
    return {}
  }
}

export function NavUser() {
  const { isMobile } = useSidebar()
  const [user, setUser] = useState<{
    name: string
    email: string
    avatar: string
  }>({
    name: "Guest",
    email: "guest@example.com",
    avatar: "",
  })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Load user info from localStorage on component mount
    const getUserInfo = () => {
      try {
        // First check if we have a token with user info
        const token = localStorage.getItem("accessToken")
        
        let userData = { name: "Guest", email: "guest@example.com", avatar: "" }
        
        if (token) {
          // Extract user data from token
          const tokenData = extractFromToken(token)
          
          // Use token data if available
          if (tokenData.name) userData.name = tokenData.name
          if (tokenData.email) userData.email = tokenData.email
          if (tokenData.avatar) userData.avatar = tokenData.avatar
        }
        
        // Fall back to stored values if token data is incomplete
        if (userData.name === "Guest") {
          const fullName = localStorage.getItem("fullname")
          console.log("Fullname from localStorage:", fullName)
          if (fullName) userData.name = fullName
        }
        
        if (userData.email === "guest@example.com") {
          const email = localStorage.getItem("email")
          console.log("Email from localStorage:", email)
          if (email) userData.email = email
        }
        
        if (!userData.avatar) {
          const avatar = localStorage.getItem("avatar")
          if (avatar) {
            userData.avatar = avatar
          } else {
            // Generate avatar from name if no avatar is found
            userData.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`
          }
        }
        
        setUser(userData)
      } catch (error) {
        console.error("Error accessing localStorage:", error)
        // Fallback to default values on error
        setUser({
          name: "Guest",
          email: "guest@example.com", 
          avatar: ""
        })
      }
    }
    
    // Call on mount
    getUserInfo()
    
    // Listen for auth changes (triggered after login/logout)
    const handleAuthChange = () => {
      getUserInfo()
    }
    
    window.addEventListener("auth-change", handleAuthChange)
    window.addEventListener("storage", handleAuthChange)
    
    return () => {
      window.removeEventListener("auth-change", handleAuthChange)
      window.removeEventListener("storage", handleAuthChange)
    }
  }, [])

  const handleLogout = () => {
    if (isMounted) {
      // Use the logout function from authService
      logout();
      
      // Redirect to login page
      window.location.href = "/login"
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link className="flex items-center" href="/profileHost">
                <UserCircleIcon className="mr-2 h-4 w-4" />
                Hồ sơ
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <Link className="flex items-center" href="/login">
                <LogOutIcon className="mr-2 h-4 w-4" />
                Đăng xuất
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}