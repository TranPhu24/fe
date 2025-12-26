"use client"
import {
  Settings,
  LogOut,
  ChevronUp,
} from "lucide-react"

import {
  Sidebar,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Cookies from "js-cookie"
import { useRouter } from "next/navigation"


export function AppSidebar() {
  const router = useRouter()


  const handleLogout = () => {
    Cookies.remove("access_token")
    router.push("/auth/login")
  }

  return (
    <Sidebar collapsible="icon" className="h-screen border-r">

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full justify-start">
                  <Settings className="h-5 w-5" />
                  <span>Cài đặt</span>
                  <ChevronUp className="ml-auto h-4 w-4 opacity-50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="top" align="end" className="w-56">
                <DropdownMenuItem
                  onSelect={handleLogout}
                  className="flex items-center gap-3 cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}