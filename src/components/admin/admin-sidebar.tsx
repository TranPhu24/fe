"use client"

import {
  Home,
  Users,
  Package,
  Settings,
  LogOut,
  ChevronUp,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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

import Link from "next/link"
import { usePathname } from "next/navigation"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

const menuItems = [
  {
    title: "Trang chủ",
    url: "/dashboard/admin",
    icon: Home,
  },
  {
    title: "Quản lý tài khoản",
    url: "/dashboard/admin/account",
    icon: Users,
  },
  {
    title: "Quản lý sản phẩm",
    url: "/dashboard/admin/product",
    icon: Package,
  },
]

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    Cookies.remove("access_token")
    router.push("/auth/login")
  }

  return (
    <Sidebar collapsible="icon" className="h-screen border-r">
      {/* Header */}

      {/* Main Menu */}
      <SidebarContent>
        <SidebarGroup>
                    <SidebarGroupLabel className="text-xl text-black-1000">Trang Quản Trị Viên</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive =
                  pathname === item.url || pathname.startsWith(`${item.url}/`)

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer - Cài đặt & Đăng xuất */}
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