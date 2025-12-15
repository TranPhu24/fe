"use client";
import Cookies from "js-cookie";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrderById, cancelOrder } from "@/lib/api/order";
import { toast } from "sonner";
import { Truck, Package, CreditCard, CheckCircle, FileText } from "lucide-react";
import { Order, OrderItem } from "@/lib/api/types";
import { Bell, User, Facebook, Instagram } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";
export function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
    const [openSupport, setOpenSupport] = useState(false);

    const loadOrder = useCallback(async () => {
    if (!id) return;

    try {
        setLoading(true);

        const res = await getOrderById(id as string);

        if (!res.success) {
        toast.error(res.message || "Không tải được đơn hàng");
        return;
        }

        setOrder(res.data?.order || null);
    } catch (err: unknown) {
        const message =
        err instanceof Error ? err.message : "Không tải được đơn hàng";
        toast.error(message);
    } finally {
        setLoading(false);
    }
    }, [id]);

    useEffect(() => {
    loadOrder();
    }, [loadOrder]);


  if (loading) {
    return <p className="text-center py-20">Đang tải đơn hàng...</p>;
  }

  if (!order) return null;

    const formatTime = (date?: string | Date | null) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
    };


  const getTimelineData = (status: string) => {
    const createdAt = order.createdAt;
    const confirmedAt = order.confirmedAt 
    const preparingAt = order.preparingAt 
    const shippingAt = order.shippingAt 
    const completedAt = order.completedAt 

    let currentStep = 0;

    switch (status) {
        case "pending":
        currentStep = 0;
        break;

        case "confirmed":
        currentStep = 1;
        break;

        case "preparing":
        currentStep = 2;
        break;

        case "shipping":
        currentStep = 3;
        break;

        case "completed":
        currentStep = 4;
        break;

        case "cancelled":
        return {
            currentStep: -1,
            steps: [],
        };
        default:
        currentStep = 0;
    }
    const steps = [
      {
        label: "Đơn Hàng Đã Đặt",
        sub: formatTime(createdAt), 
      },
      {
        label: "Duyệt Đơn",
        sub: formatTime(confirmedAt),
      },
      {
        label: "Đang Chuẩn Bị",
        sub: formatTime(preparingAt) ,
      },
      {
        label: "Đang Giao",
        sub: formatTime(shippingAt),
      },
      {
        label: "Đã Nhận Hàng",
        sub: formatTime(completedAt),
      },
    ];

    return { currentStep, steps };
  };

  const { currentStep, steps } = order.orderStatus === "cancelled"
    ? { currentStep: -1, steps: [] }
    : getTimelineData(order.orderStatus);

  const icons = [FileText, CreditCard, Package, Truck, CheckCircle];
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
      <h1 className="text-2xl font-bold text-center mb-4">
        Đơn hàng:
        <span className="text-red-600"> {order._id.slice(-6)} </span>
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold mb-6 text-center">Theo dõi trạng thái đơn hàng</h2>
        
        <div className="relative">
          <div className="absolute top-8 left-0 right-0 h-1 bg-gray-300 -z-10">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{
                width: currentStep >= 0 ? `${(currentStep / (steps.length - 1)) * 100}%` : "0%",
              }}
            />
          </div>

          <div className="flex justify-between relative">
            {steps.map((step, index) => {
              const Icon = icons[index];
              const isCompleted = index < currentStep;
              const isActive = index === currentStep;
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted || isActive
                        ? "bg-green-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    <Icon size={28} />
                  </div>
                  <div className="mt-3 w-32">
                    <p
                      className={`font-medium text-sm ${
                        isCompleted || isActive ? "text-green-600" : "text-gray-600"
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.sub ? (
                      <p className="text-xs text-gray-500 mt-1">{step.sub}</p>
                    ) : (
                      <p className="text-xs text-gray-400 mt-1">—</p> 
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {order.orderStatus === "cancelled" && (
          <p className="text-center mt-6 text-red-600 font-semibold">
            Đơn hàng đã bị huỷ
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="font-bold mb-4">Địa chỉ giao hàng</h2>
        <p className="text-lg">Họ tên người nhận: <b>{order.shippingAddress.fullName}</b></p>
        <p className="text-lg">Sô điện thoại: <b>{order.shippingAddress.phone}</b></p>
        <p className="text-lg"> Địa chỉ nhận hàng: <b>{order.shippingAddress.address}, {order.shippingAddress.city}</b></p>
    </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-bold mb-4">Sản phẩm</h2>
        {order.items.map((item: OrderItem) => (
          <div
            key={item.product}
            className="flex justify-between py-2 border-b last:border-none"
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <span className="font-medium">
              {(item.price * item.quantity).toLocaleString()}đ
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-6 space-y-2">
        <h2 className="font-bold mb-4">Thanh toán</h2>
        <p className="text-lg">Tạm tính: <b>{order.totalPrice.toLocaleString()}đ</b></p>
        <p className="text-lg">Phí ship: <b>{order.shippingFee.toLocaleString()}đ</b></p>
        <p className="text-lg">Thanh toán: <b>{order.paymentMethod}</b></p>
        <p className="text-lg">Tổng cộng: <span className="text-red-600"><b>{order.finalTotal.toLocaleString()}đ</b></span></p>
      </div>

      {order.orderStatus === "pending" && (
        <button
          onClick={async () => {
            const res = await cancelOrder(order._id);
            if (res.success) {
              toast.success("Đã huỷ đơn hàng");
              loadOrder();
            } else {
              toast.error(res.message);
            }
          }}
          className="w-full bg-gray-200 hover:bg-gray-300 rounded-xl py-3 font-semibold"
        >
          Huỷ đơn
        </button>
      )}

      <button
        onClick={() => router.push("/")}
        className="w-full bg-red-600 text-white rounded-xl py-3 font-semibold"
      >
        Quay về trang cá nhân
      </button>
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