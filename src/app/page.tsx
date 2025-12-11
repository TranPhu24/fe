"use client";

import Image from "next/image";
import { Facebook, Instagram, X, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, ShoppingCart, User } from "lucide-react";
import { toast } from "sonner";


import { Category, Product } from "@/lib/api/types";
import { getAllCategories } from "@/lib/api/category";
import { getProducts, getProduct } from "@/lib/api/product";
import { addToCart, getCart } from "@/lib/api/cart";


export default function Home() {
  const [openSupport, setOpenSupport] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [openProductDetail, setOpenProductDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [activeCategory, setActiveCategory] = useState<string>("");

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const [cartCount, setCartCount] = useState(0);


  useEffect(() => {
    loadCategories();
    loadProducts();
    loadCartData(); 
  }, []);
  useEffect(() => {
    if (openProductDetail) {
      setQuantity(1);
    }
  }, [openProductDetail]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);

      const res = await getAllCategories();
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      const categories = res.data!.categories;
      setCategories(categories);

      if (categories.length > 0) {
        setActiveCategory(categories[0].name);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Lỗi tải danh mục";
      toast.error(message);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);

      const res = await getProducts();
      if (!res.success) {
        toast.error(res.message || "Không tải được sản phẩm");
        return;
      }

      setProducts(res.data?.products ?? []);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Lỗi kết nối server";
      toast.error(message);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadProduct = async (productId: string) => {
    try {
      setLoadingProduct(true);
      setSelectedProduct(null); 

      const res = await getProduct(productId);
      if (!res.success) {
        toast.error(res.message || "Không tải được sản phẩm");
        return;
      }

      const product = res.data!.product;
      setSelectedProduct(product);
      setOpenProductDetail(true); 
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Lỗi tải sản phẩm";
      toast.error(message);
    } finally {
      setLoadingProduct(false);
    }
  };

  const loadCartData = async () => {
    const res = await getCart();
    if (res.success && res.data?.cart) {
      const total = res.data.cart.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    }
  };

  const handleOpenProductDetail = (product: Product) => {
    if (product._id) {
      loadProduct(product._id);
    } 
  };

  const handleAddToCart = async () => {
    if (!selectedProduct?._id) return;

    const res = await addToCart(selectedProduct._id, quantity);

    if (!res.success) {
      toast.error(res.message || "Không thể thêm vào giỏ hàng");
      return;
    }

    toast.success(`Đã thêm ${quantity}  ${selectedProduct.name} vào giỏ!`);

    loadCartData();

    setOpenProductDetail(false);
  };

  useEffect(() => {
  if (!categories.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cat = entry.target.getAttribute("data-category");
          if (cat) setActiveCategory(cat);
        }
      });
    },
    {
      rootMargin: "-120px 0px -60% 0px",
      threshold: 0.1,
    }
  );

  categories.forEach((c) => {
    const el = sectionRefs.current[c.name];
    if (el) observer.observe(el);
  });
  return () => observer.disconnect();
    }, [categories]);

  const productsByCategory = categories.map((c) => ({
    category: c,
    products: products.filter(
      (p) => typeof p.category === 'object' && p.category?.name === c.name
    ),
  }));
  return (
  <>
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center h-16">

        <div></div>

        <div className="flex items-center gap-6">

          <button className="text-gray-700 text-2xl">
            <Bell className="w-6 h-6 text-gray-700" />
          </button>

          <Link href="./dashboard/user/cart" className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:border-gray-400 hover:bg-gray-50 transition-all">
            <span className="text-sm font-semibold text-gray-700">
              {cartCount}
            </span>
            <ShoppingCart className="w-6 h-6 text-gray-700" />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 border border-red-500 text-red-600 rounded-full px-4 py-1  ">
              <span className="text-xl">☰</span>
              <User className="w-6 h-6 text-red-600" />
            </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 border shadow-lg rounded-xl">
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
                    href="/orders/track"
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

    {/* Category */}
    <nav className="bg-white sticky top-16 z-40 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
        <div className="flex gap-12 py-8 whitespace-nowrap relative">

          {loadingCategories ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-36 h-8 bg-gray-200 animate-pulse rounded-lg"
              />
            ))
          ) : (
            categories.map((c) => (
              <a
                key={c._id}
                href={`#${c.name}`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(c.name)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className={`font-bold text-lg lg:text-xl pb-4 border-b-4 transition-all duration-300 relative
                  ${
                    activeCategory === c.name
                      ? "text-red-600 border-red-600"
                      : "text-gray-600 border-transparent hover:text-red-600 hover:border-red-600"
                  }`}
              >
                {c.name}
              </a>
            ))
          )}
        </div>
      </div>
    </nav>


    {/*Products */}
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-16">
      
      {productsByCategory.map(({ category, products }) => (
        <section
          key={category._id}
          id={category.name}
          data-category={category.name}
          ref={(el) => {
            sectionRefs.current[category.name] = el;
          }}
          className="scroll-mt-48"
        >
          <h2 className="text-2xl font-bold mb-6">
            {category.name}
          </h2>

          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-200 animate-pulse rounded-xl"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer"
                  onClick={() => handleOpenProductDetail(p)}
                >
                  <Image
                    src={p.image || "/placeholder.jpg"}
                    alt={p.name}
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover rounded-t-xl"
                  />

                  <div className="p-4 text-center">
                    <h3 className="font-semibold line-clamp-1">
                      {p.name}
                    </h3>

                    <p className="text-red-600 font-bold mt-1">
                      {p.price.toLocaleString()}đ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </main>
    <Dialog open={openProductDetail} onOpenChange={setOpenProductDetail}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl shadow-2xl">
        <DialogTitle className="sr-only">
          {selectedProduct?.name ?? "Chi tiết sản phẩm"}
        </DialogTitle>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenProductDetail(false)}
            aria-label="Đóng"
            className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative h-80 bg-gray-100">
            <Image
              src={selectedProduct?.image || "/placeholder.jpg"}
              alt={selectedProduct?.name || "Món ăn"}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedProduct?.name}
            </h2>

            <p className="text-gray-600 leading-relaxed">
              {selectedProduct?.description || "Món ăn thơm ngon, chất lượng cao cấp."}
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
                  aria-label="Giảm số lượng"
                >
                  <Minus className="w-5 h-5" />
                </button>

                <span className="text-2xl font-bold w-16 text-center">{quantity}</span>

                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
                  aria-label="Tăng số lượng"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg px-6 py-3 rounded-full shadow-xl transition-all flex items-center gap-3"
                aria-label="Thêm vào giỏ hàng"
              >
                <span>Thêm vào giỏ hàng</span>
                <span className="font-bold">
                  • {(selectedProduct?.price ? (selectedProduct.price * quantity) : 0).toLocaleString()}đ
                </span>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    <footer className="h-20 bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-center">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full">
          <p className="text-sm">© 2025 AppFoodPL - Giao đồ ăn nhanh</p>
          
          <div className="flex items-center gap-8 text-sm">
            <a href="tel:19001822" className="hover:text-red-400 transition">
              Hotline: <span className="text-red-400 font-bold">1900 1822</span>
            </a>
            <span>|</span>
            <a href="#" className="hover:text-red-400 transition">Chính sách bảo mật</a>
            <span>|</span>
            <div className="flex gap-3">
              <Facebook className="w-5 h-5 hover:text-red-400 cursor-pointer transition" />
              <Instagram className="w-5 h-5 hover:text-red-400 cursor-pointer transition" />
            </div>
          </div>
        </div>
      </div>
    </footer>

  </>
  );
}
