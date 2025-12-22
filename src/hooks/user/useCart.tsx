import { getCart, updateCartItem, removeCartItem } from "@/lib/api/cart";
import { CartItem } from "@/lib/api/types";
import { applyDiscount, removeDiscount } from "@/lib/api/discount";
import { CartDiscount } from "@/lib/api/types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
export function useCart() {
const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSupport, setOpenSupport] = useState(false);
  const router = useRouter();
  const [discountCode, setDiscountCode] = useState("");
    const [discountData, setDiscountData] = useState<CartDiscount | null>(null);
    const [applyingDiscount, setApplyingDiscount] = useState(false);


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

        const cart = res.data?.cart;

        setCartItems(cart?.items || []);

        if (cart?.discount?.code) {
        setDiscountCode(cart.discount.code);
        setDiscountData(cart.discount);
        } else {
        setDiscountCode("");
        setDiscountData(null);
        }
    } catch (err: unknown) {
        const message =
        err instanceof Error ? err.message : "Lỗi tải giỏ hàng";
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

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }

    setApplyingDiscount(true);

    const res = await applyDiscount(discountCode.trim());

    if (!res.success || !res.data) {
      toast.error(res.message || "Không áp dụng được mã giảm giá");
      setDiscountData(null);
      setApplyingDiscount(false);
      return;
    }

    toast.success("Áp dụng mã giảm giá thành công");

    setDiscountData(res.data.discount);
    setApplyingDiscount(false);
  };

  const handleRemoveDiscount = async () => {
    const res = await removeDiscount();

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success("Đã huỷ mã giảm giá");
    setDiscountData(null);
    loadCart(); 
  };

  

    const handleLogout = () => {
      Cookies.remove("access_token")
      router.push("/auth/login")
    }

    return{
    cartItems,
    loading,
    openSupport,
    handleUpdateQuantity,
    handleRemove,
    total,
    discountCode,
    setDiscountCode,
    discountData,
    applyingDiscount,
    handleApplyDiscount,
    handleRemoveDiscount,
    setOpenSupport,
    handleLogout
    }


}
