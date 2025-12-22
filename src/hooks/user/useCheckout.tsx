import Cookies from "js-cookie";
import { useState, useEffect } from "react"
import { getCart, } from "@/lib/api/cart"
import { createOrder, createVNPayPayment } from "@/lib/api/order"
import { getProvinces, getWardsByProvince } from "@/lib/api/location"
import { useRouter } from "next/navigation"
import { Cart, Province, Ward } from "@/lib/api/types"
import { toast } from "sonner"
export function useCheckout() {

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

    const shippingAddress = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.cityName || form.city,
      ward: form.wardName || form.ward,
      cityCode: form.city,
      wardCode: form.ward,
    };

    const res = await createOrder(
      paymentMethod,
      shippingAddress,
      form.note.trim()
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

    return{
        cart,
        loading,
        openSupport,
        setOpenSupport,
        form,
        setForm,
        paymentMethod,
        provinces,
        wards,
        loadingLocation,
        handleProvinceChange,
        handleWardChange,
        handleSubmit,
        handleLogout
    }
}