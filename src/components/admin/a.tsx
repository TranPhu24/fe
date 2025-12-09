"use client";

import Image from "next/image";
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
import { getProducts } from "@/lib/api/product";

export default function Home() {
  const [openSupport, setOpenSupport] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [activeCategory, setActiveCategory] = useState<string>("");

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await getAllCategories();
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      setCategories(res.data!.categories);
      if (res.data!.categories.length > 0) {
        setActiveCategory(res.data!.categories[0].name);
      }
    } catch {
      toast.error("Lỗi tải danh mục");
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const { success, message, data } = await getProducts();
      if (!success) {
        toast.error(message || "Không tải được sản phẩm");
        return;
      }
      setProducts(data?.products ?? []);
    } catch {
      toast.error("Lỗi kết nối server");
    } finally {
      setLoadingProducts(false);
    }
  };

  /* ================= SCROLL SPY ================= */
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

  /* ================= GROUP PRODUCTS ================= */
  const productsByCategory = categories.map((c) => ({
    category: c,
    products: products.filter(
      (p) => p.category?.name === c.name
    ),
  }));

  /* ================= RENDER ================= */
  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

          <div></div>

          <div className="flex items-center gap-6">

            <button className="text-gray-700 text-2xl">
              <Bell className="w-6 h-6 text-gray-700" />
            </button>

            <button className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-1">
              <span className="text-sm font-semibold text-gray-700">0</span>
              <ShoppingCart className="w-6 h-6 text-gray-700" />
            </button>

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

          <p className="text-center text-gray-700 text-sm mt-6 leading-relaxed">
            Bạn có muốn gọi đến <strong>1900 1822</strong> không?
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

      {/* ================= MENU NAV ================= */}
      <nav className="bg-white sticky top-[64px] z-40 border-b">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-6 py-4 whitespace-nowrap">
            {loadingCategories &&
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-24 h-5 bg-gray-200 animate-pulse rounded" />
              ))}

            {!loadingCategories &&
              categories.map((c) => (
                <a
                  key={c._id}
                  href={`#${c.name}`}
                  className={`font-medium text-sm pb-2 border-b-2 transition-colors
                    ${
                      activeCategory === c.name
                        ? "text-red-600 border-red-600"
                        : "text-gray-600 border-transparent hover:text-red-600 hover:border-red-600"
                    }`}
                >
                  {c.name}
                </a>
              ))}
          </div>
        </div>
      </nav>

      {/* ================= PRODUCTS ================= */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-14">
        {productsByCategory.map(({ category, products }) => (
          <section
            key={category._id}
            id={category.name}
            data-category={category.name}
            ref={(el) => (sectionRefs.current[category.name] = el)}
            className="scroll-mt-40"
          >
            <h2 className="text-2xl font-bold mb-6">
              {category.name}
            </h2>

            {loadingProducts ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white rounded-xl shadow hover:shadow-lg transition"
                  >
                    <Image
                      src={p.image || "/placeholder.jpg"}
                      alt={p.name}
                      width={300}
                      height={200}
                      className="w-full h-40 object-cover rounded-t-xl"
                    />
                    <div className="p-4 text-center">
                      <h3 className="font-semibold">{p.name}</h3>
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

      {/* ================= SUPPORT DIALOG ================= */}
      <Dialog open={openSupport} onOpenChange={setOpenSupport}>
        <DialogContent className="max-w-sm rounded-2xl p-6">
          <DialogTitle>Hỗ trợ khách hàng</DialogTitle>
          <p>Bạn có muốn gọi 1900 1822 không?</p>
        </DialogContent>
      </Dialog>
    </>
  );
}
