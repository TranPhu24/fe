"use client";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { X, Minus, Plus, ChevronRight, Facebook, Instagram, ShoppingCart, User, Bell } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import { getCart, updateCartItem, removeCartItem } from "@/lib/api/cart";
import { CartItem } from "@/lib/api/types";

export function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSupport, setOpenSupport] = useState(false);
  const router = useRouter();
  useEffect(() => {
    loadCart();
  }, []);

    const loadCart = async () => {
    try {
        setLoading(true);

        const res = await getCart();

        if (!res.success) {
        toast.error(res.message || "Không thể tải giỏ hàng");
        return;
        }
        toast.success(res.message);
    setCartItems(res.data?.cart?.items || []);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Lỗi tải giỏ hàng";
        toast.error(message);
    } finally {
        setLoading(false);
    }
    };
  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;

    const res = await updateCartItem(productId, quantity);
    if (!res.success) {
      toast.error("Không cập nhật được số lượng");
      return;
    }

    loadCart();
  };

  const handleRemove = async (productId: string) => {
    const res = await removeCartItem(productId);

    if (!res.success) {
      toast.error("Không thể xóa sản phẩm");
      return;
    }

    toast.success("Đã xóa khỏi giỏ hàng");
    loadCart();
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  
    const handleLogout = () => {
      Cookies.remove("access_token")
      router.push("/auth/login")
    }

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center h-16">
                  <div >
                  </div>
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

    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">Giỏ hàng của tôi</h1>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center justify-center gap-4">
            <ShoppingCart size={200} className="text-gray-400" />
            <p className="text-3xl text-gray-600">Giỏ hàng trống</p>
            <p className="text-xl">Giỏ hàng của bạn trông hơi trống. Tại sao không thử một vài món của chúng tôi</p>
              <Link
                href="/"
                className="inline-block mt-4 px-6 py-3 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition shadow-md"
                >
                  Đi đặt món ngay
              </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-8 items-start">
          <div className="w-full">
            <ScrollArea className="h-[calc(100vh-265px)] w-full rounded-xl border bg-gray-50/50"> 
              <div className="space-y-4 p-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-sm border hover:shadow transition"
                  >
                    <Image
                      src={item.product.image || "/placeholder.jpg"}
                      width={70}
                      height={70}
                      alt={item.product.name}
                      className="rounded-lg object-cover flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0"> 
                      <h3 className="font-semibold text-base truncate">
                        {item.product.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border hover:bg-gray-100 flex items-center justify-center transition disabled:opacity-50"
                        disabled={item.quantity === 1}
                      >
                        <Minus size={16} />
                      </button>

                      <span className="w-12 text-center font-bold text-base">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border hover:bg-gray-100 flex items-center justify-center transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-base text-red-600 whitespace-nowrap">
                        {(item.product.price * item.quantity).toLocaleString()} đ
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemove(item.product._id)}
                      className="text-gray-400 hover:text-red-600 transition ml-2"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border flex justify-between items-center">
              <span className="font-semibold">Voucher</span>

              <div className="flex items-center gap-2 text-red-600 font-medium cursor-pointer">
                <span>Chọn hoặc nhập mã</span>
                <ChevronRight size={20} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h3 className="font-bold text-lg mb-5">Chi tiết thanh toán</h3>

              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{total.toLocaleString()} đ</span>
                </div>

                <div className="flex justify-between">
                  <span>Giảm giá</span>
                  <span className="text-green-600">-0 đ</span>
                </div>

                <div className="flex justify-between">
                  <span>Phí giao hàng</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
              </div>

              <div className="border-t pt-4 mt-5">
                <div className="flex justify-between text-xl font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-red-600">
                    {total.toLocaleString()} đ
                  </span>
                </div>
              </div>
              <Link
                href="./order"
                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold text-lg py-4 rounded-xl transition shadow-lg text-center block"
              >
                Thanh toán ngay
              </Link>
            </div>
          </div>

        </div>
      )}
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
