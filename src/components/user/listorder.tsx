"use client";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import { getMyOrders } from "@/lib/api/order"; 
import { Order, OrderStatus,PaymentStatus } from "@/lib/api/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Bell, User, Facebook, Instagram } from "lucide-react";
import Link from "next/link";

export  function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
    const [openSupport, setOpenSupport] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);

        const res = await getMyOrders();

        if (!res.success) {
          toast.error(res.message || "Không tải được đơn hàng");
          return;
        }
        setOrders(res.data?.orders || []);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Lỗi tải đơn hàng";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);
  const statusMap: Record<OrderStatus, { label: string; color: string }> = {
  pending: { 
    label: "Chờ xác nhận", 
    color: "bg-yellow-100 text-yellow-700" 
  },
  confirmed: { 
    label: "Đã xác nhận", 
    color: "bg-blue-100 text-blue-700" 
  },
  preparing: { 
    label: "Đang chuẩn bị", 
    color: "bg-purple-100 text-purple-700" 
  },
  shipping: { 
    label: "Đang giao", 
    color: "bg-orange-100 text-orange-700" 
  },
  completed: { 
    label: "Hoàn thành", 
    color: "bg-green-100 text-green-700" 
  },
  cancelled: { 
    label: "Đã hủy", 
    color: "bg-red-100 text-red-700" 
  },
};
  const paymentStatusMap : Record<PaymentStatus, { label: string; color: string }>={
    paid: {
      label: "Đã thanh toán",
      color: "bg-green-100 text-green-700",
    },
    pending: {
      label: "Chờ thanh toán",
      color: "bg-yellow-100 text-yellow-700",
    },
    failed: {
      label: "Thanh toán thất bại",
      color: "bg-red-100 text-red-700",
    },
    refunded:{
      label: "Hoàn tiền",
      color: "bg-gray-100 text-black-700"
    }
  };

  if (loading) return <p className="text-center py-10">Đang tải đơn hàng...</p>;
  if (orders.length === 0) return <p className="text-center py-10">Bạn chưa có đơn hàng nào.</p>;
      const handleLogout = () => {
      Cookies.remove("access_token")
      router.push("/auth/login")
    }
  return (
    <>
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center h-16">
        <div></div>
        <div className="flex items-center gap-6">
          <button className="text-gray-700 text-2xl">
            <Bell className="w-6 h-6 text-gray-700" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 border border-red-500 text-red-600 rounded-full px-4 py-1  ">
              <span className="text-xl">☰</span>
              <User className="w-6 h-6 text-red-600" />
            </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 border shadow-lg rounded-xl">
                <DropdownMenuItem asChild>
                  <Link
                    href="/"
                    className="w-full rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 focus:outline-none transition-all duration-200"
                  >
                    Trang chủ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/auth/login"
                    className="w-full rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 focus:outline-none transition-all duration-200"
                  >
                    Đăng nhập
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/auth/register"
                    className="w-full rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 focus:outline-none transition-all duration-200"
                  >
                    Đăng ký
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/user/order/listorder"
                    className="w-full rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 focus:outline-none transition-all duration-200"
                  >
                    Theo dõi đơn hàng
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setOpenSupport(true)}
                  className="w-full rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600 focus:outline-none cursor-pointer transition-all duration-200"
                >
                  Hỗ trợ khách hàng
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none transition-all duration-200 cursor-pointer"
                  >
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    <Dialog open={openSupport} onOpenChange={setOpenSupport}>
      <DialogContent className="max-w-sm rounded-2xl p-2">
        <div className="text-center -mt-2">
          <DialogTitle className="text-lg font-bold leading-tight">
            Hỗ trợ khách hàng
          </DialogTitle>
          <div className="w-12 h-1 bg-red-600 rounded-full mx-auto mt-2" />
        </div>

      <p className="text-center text-gray-700 text-base mt-6 leading-relaxed">
        Bạn có muốn gọi đến <strong>1900 1822 </strong>không?
      </p>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <button
            type="button"
            onClick={() => setOpenSupport(false)}
            className="w-full py-3.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = "tel:19001822";
            }}
            className="w-full py-3.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-md"
          >
            Gọi ngay
          </button>
        </div>
      </DialogContent>
    </Dialog>
    </header>


    <main className="bg-white shadow-sm sticky top-0 z-50 flex-1 pb-24">
    <div className="max-w-3xl mx-auto space-y-6">
      {orders.map(order => (
        <div key={order._id} className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">
              Đơn hàng: <span className="text-red-500"> {order._id.slice(-6)}</span>
            </h2>
            <span className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="border-t border-b divide-y">
            {order.items.map(item => (
              <div
                key={item.product}
                className="flex justify-between items-center py-2"
              >
                <span>{item.name} × {item.quantity}</span>
                <span className="font-medium">
                  {(item.price * item.quantity).toLocaleString()}đ
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-4">
            <span className="font-semibold text-gray-800">
              Tổng: {order.finalTotal.toLocaleString()}đ
            </span>
            <button
              onClick={() => router.push(`/dashboard/user/order/${order._id}`)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
            >
              Theo dõi đơn hàng
            </button>
          </div>

      <div className="mt-2 flex items-center gap-2 font-semibold">
        <span
          className={`px-2 py-1 rounded text-sm ${statusMap[order.orderStatus].color}`}>
          {statusMap[order.orderStatus].label}
        </span>
        <span
          className={`px-2 py-1 rounded text-sm ${paymentStatusMap[order.paymentStatus].color}`}>
          {paymentStatusMap[order.paymentStatus].label}
        </span>
      </div>
        </div>
      ))}
    </div>
    </main>
        <footer className="fixed bottom-0 left-0 right-0 h-20 bg-gray-900 text-gray-300 border-t border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
            <p className="text-sm hidden sm:block">
            © 2025 AppFoodPL - Giao đồ ăn nhanh
            </p>
            <p className="text-xs sm:hidden">
            © 2025 AppFoodPL
            </p>
            <div className="flex items-center gap-4 md:gap-8 text-sm">
            <Link 
                href="tel:19001822" 
                className="hover:text-red-400 transition whitespace-nowrap"
            >
                Hotline: <span className="text-red-400 font-bold">1900 1822</span>
            </Link>
            <span className="hidden md:inline text-gray-600">|</span>
            <Link
                href="" 
                className="hover:text-red-400 transition hidden md:inline"
            >
                Chính sách bảo mật
            </Link>
            <span className="hidden md:inline text-gray-600">|</span>
            <div className="flex items-center gap-4">
                <Facebook className="w-5 h-5 hover:text-red-400 cursor-pointer transition" />
                <Instagram className="w-5 h-5 hover:text-red-400 cursor-pointer transition" />
            </div>
            </div>
        </div>
    </footer>

    </>
  );
}
