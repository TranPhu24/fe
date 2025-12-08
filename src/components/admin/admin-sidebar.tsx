"use client"

import {
  Home,
  Users,
  Package,
  Settings,
  LogOut,
  ChevronUp,
  ChevronDown,   // thêm để hiển thị mũi tên khi mở/đóng
  FolderOpen,
  Tag,
  Boxes,
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"

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
    icon: Package,
    subItems: [
      {
        title: "Quản lý mặt hàng",
        url: "/dashboard/admin/product/food",
        icon: Boxes,
      },
      {
        title: "Quản lý loại",
        url: "/dashboard/admin/product/category",
        icon: Tag,
      },
    ],
  },
]

export function AppSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [openProductMenu, setOpenProductMenu] = useState(true) 

  const handleLogout = () => {
    Cookies.remove("access_token")
    router.push("/auth/login")
  }

  return (
    <Sidebar collapsible="icon" className="h-screen border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl text-black-1000">
            Trang Quản Trị Viên
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                // Kiểm tra xem có submenu không
                if (item.subItems) {
                  const isActive = item.subItems.some(
                    (sub) => pathname === sub.url || pathname.startsWith(`${sub.url}/`)
                  )

                  return (
                    <Collapsible
                      key={item.title}
                      open={openProductMenu}
                      onOpenChange={setOpenProductMenu}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            isActive={isActive}
                            className="w-full justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="h-5 w-5" />
                              <span>{item.title}</span>
                            </div>
                            <ChevronDown className="h-4 w-4 opacity-50 transition-transform group-data-[state=open]/collapsible]:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems.map((sub) => {
                              const isSubActive =
                                pathname === sub.url || pathname.startsWith(`${sub.url}/`)

                              return (
                                <SidebarMenuSubItem key={sub.title}>
                                  <SidebarMenuSubButton asChild isActive={isSubActive}>
                                    <Link href={sub.url} className="flex items-center gap-3">
                                      <sub.icon className="h-4 w-4" />
                                      <span>{sub.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              )
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                }

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