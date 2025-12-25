"use client"
import Cookies from "js-cookie";
import { useState, useEffect } from "react"
import { getCart, } from "@/lib/api/cart"
import { createOrder, createVNPayPayment } from "@/lib/api/order"
import { getProvinces, getWardsByProvince } from "@/lib/api/location"
import { getMe } from "@/lib/api/user"

import { useRouter } from "next/navigation"
import { Cart, Province, Ward } from "@/lib/api/types"
import { toast } from "sonner"
import { Bell, User, Facebook, Instagram } from "lucide-react"
import { DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from "next/link";
export function CheckoutForm() {
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [openSupport, setOpenSupport] = useState(false)

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",        
    cityName: "",    
    ward: "",       
    wardName: "",    
    address: "",
    note: "",
  })

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "VNPAY">("COD")

  const [provinces, setProvinces] = useState<Province[]>([])
  const [wards, setWards] = useState<Ward[]>([])
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [saveAddress, setSaveAddress] = useState(true);


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

      setCart(res.data?.cart || null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Lỗi tải giỏ hàng";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProvinces();
  }, []);

  const loadProvinces = async () => {
    try {
      const data = await getProvinces();
      setProvinces(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Không thể tải danh sách tỉnh/thành";
      toast.error(message);
    }
  };

  useEffect(() => {
    if (!form.city) {
      setWards([]);
      setForm(prev => ({
        ...prev,
        cityName: "",
        ward: "",
        wardName: "",
      }));
      return;
    }

    loadWards();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.city]);
  const loadWards = async () => {
    try {
      setLoadingLocation(true);

      const data = await getWardsByProvince(Number(form.city));
      setWards(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Không thể tải danh sách phường/xã";
      toast.error(message);
    } finally {
      setLoadingLocation(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);
  const fetchMe = async () => {
    const res = await getMe();

    if (!res.success || !res.data) return;

    const defaultAddress = res.data.user.addresses?.find(
      (a) => a.isDefault
    );

    if (!defaultAddress) return;

    setForm((prev) => ({
      ...prev,
      fullName: defaultAddress.fullName,
      phone: defaultAddress.phone,
      address: defaultAddress.address,
      city: defaultAddress.city,
      ward: defaultAddress.ward,
    }));
  };

  if (loading) return <p className="text-center py-10">Đang tải...</p>
  if (!cart || cart.items.length === 0)
    return <div className="text-center py-20 text-xl text-gray-600">Giỏ hàng trống</div>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName.trim()) return toast.error("Vui lòng nhập họ tên");
    if (!form.phone.trim()) return toast.error("Vui lòng nhập số điện thoại");
    if (!/^\d{9,11}$/.test(form.phone.replace(/\D/g, "")))
      return toast.error("Số điện thoại không hợp lệ");
    if (!form.city) return toast.error("Vui lòng chọn Tỉnh/Thành phố");
    if (!form.ward) return toast.error("Vui lòng chọn Phường/Xã");
    if (!form.address.trim())
      return toast.error("Vui lòng nhập địa chỉ chi tiết");

    const res = await createOrder(
      paymentMethod,
      {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        ward: form.ward,
        saveAddress, 
      },
      form.note
    );
    if (!res.success || !res.data) {
      toast.error(res.message);
      return;
    }
    const order = res.data.order;
    if (paymentMethod === "VNPAY") {
      const vnpayRes = await createVNPayPayment(order._id);

      if (!vnpayRes.success || !vnpayRes.data) {
        toast.error(vnpayRes.message || "Không thể tạo thanh toán VNPay");
        return;
      }
      window.location.href = vnpayRes.data.paymentUrl;
      return;
    }

    toast.success("Đặt hàng thành công!");
    router.push(`/dashboard/user/order/${order._id}`);
  };


  const handleProvinceChange = (code: string, name: string) => {
    setForm(prev => ({ ...prev, city: code, cityName: name, ward: "", wardName: "" }))
  }

  const handleWardChange = (code: string, name: string) => {
    setForm(prev => ({ ...prev, ward: code, wardName: name }))
  }
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
    <main className="bg-white shadow-sm sticky top-0 z-50 flex-1 pb-20">
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Thanh toán</h2>
    <div className="bg-white border rounded-xl p-6 mb-8 shadow-sm">
      <h3 className="font-semibold text-lg mb-4">Sản phẩm trong giỏ hàng</h3>

      <div className="space-y-3">
        {cart.items.map((item) => (
          <div
            key={item.product._id}
            className="flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">x {item.quantity}</p>
            </div>
            <p className="font-semibold">
              {(item.price * item.quantity).toLocaleString()} đ
            </p>
          </div>
        ))}
      </div>

      <div className="border-t mt-4 pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Tạm tính</span>
          <span>{cart.totalPrice.toLocaleString()} đ</span>
        </div>

        <div className="flex justify-between">
          <span>Giảm giá</span>
          <span className="text-green-600">
            -{cart.discount?.amount
              ? cart.discount.amount.toLocaleString()
              : 0} đ
          </span>
        </div>
      </div>


      <div className="border-t mt-4 pt-4 flex justify-between text-lg font-bold">
        <span>Tổng cộng</span>
        <span className="text-red-600">
          {(cart.finalTotal).toLocaleString()} đ
        </span>
      </div>
    </div>


      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-5">Thông tin nhận hàng</h3>

            <div className="mt-4 flex items-center gap-2">
            <input
              id="saveAddress"
              type="checkbox"
              checked={saveAddress}
              onChange={(e) => setSaveAddress(e.target.checked)}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label htmlFor="saveAddress" className="text-sm">
              Lưu địa chỉ này cho lần đặt hàng sau
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Họ và tên <span className="text-red-600">*</span></label>
              <input
                type="text"
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
                placeholder="Nguyễn Văn A"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Số điện thoại <span className="text-red-600">*</span></label>
              <input
                type="tel"
                required
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
                placeholder="0901234567"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block font-medium mb-1">Tỉnh/Thành phố <span className="text-red-600">*</span></label>
                <Select
                  value={form.city || ""}
                  onValueChange={(value) => {
                    const selected = provinces.find(
                      (p) => p.code === parseInt(value)
                    );
                    if (selected) {
                      handleProvinceChange(value, selected.name);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn tỉnh/thành" />
                  </SelectTrigger>

                  <SelectContent>
                    {provinces.map((prov) => (
                      <SelectItem
                        key={prov.code}
                        value={prov.code.toString()}
                      >
                        {prov.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

            </div>

            <div>
              <label className="block font-medium mb-1">Phường/Xã <span className="text-red-600">*</span></label>
                <Select
                  value={form.ward || ""}
                  disabled={!form.city || loadingLocation}
                  onValueChange={(value) => {
                    const selected = wards.find(
                      (w) => w.code === parseInt(value)
                    );
                    if (selected) {
                      handleWardChange(value, selected.name);
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn phường/xã" />
                  </SelectTrigger>
                  <SelectContent>
                    {wards.map((ward) => (
                      <SelectItem
                        key={ward.code}
                        value={ward.code.toString()}
                      >
                        {ward.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
          </div>

          {loadingLocation && <p className="text-sm text-gray-500 mt-2">Đang tải phường/xã...</p>}

          <div className="mt-4">
            <label className="block font-medium mb-1">Địa chỉ chi tiết <span className="text-red-600">*</span></label>

            <input
              type="text"
              required
              placeholder="Số nhà, tên đường, quận/huyện (VD: 123 Lê Lợi, Quận 1)"
              className="w-full border rounded-lg px-4 py-2"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div className="mt-4">
            <label className="block font-medium mb-1">Ghi chú (không bắt buộc)</label>
            <textarea
              rows={3}
              placeholder="Ghi chú cho người giao hàng..."
              className="w-full border rounded-lg px-4 py-2"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Phương thức thanh toán</h3>
            <Select
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as "COD" | "VNPAY")
              }
            >
              <SelectTrigger className="w-full px-4 py-3 text-base">
                <SelectValue placeholder="Chọn phương thức thanh toán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COD">Thanh toán khi nhận hàng (COD)</SelectItem>
                <SelectItem value="VNPAY">Thanh toán qua VNPay</SelectItem>
              </SelectContent>
            </Select>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl text-lg transition"
          disabled={loadingLocation}
        >
          Hoàn tất đặt hàng
        </button>
      </form>
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
  )
}