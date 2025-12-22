"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Category, Product } from "@/lib/api/types";
import { getAllCategories } from "@/lib/api/category";
import { getProducts, getProduct } from "@/lib/api/product";
import { addToCart, getCart } from "@/lib/api/cart";
export function useHomePage() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [openSupport, setOpenSupport] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [openProductDetail, setOpenProductDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loadingProduct, setLoadingProduct] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const [activeCategory, setActiveCategory] = useState<string>("");

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const router = useRouter();

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

  useEffect(() => {
  if (searchQuery.trim() === "") {
    setFilteredProducts([]);
    return;
  }

  const query = searchQuery.toLowerCase().trim();
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query)
  );

  setFilteredProducts(filtered);
}, [searchQuery, products]);

  const handleLogout = () => {
    Cookies.remove("access_token")
    router.push("/auth/login")
  }
    return {
    isSearchOpen,   
    setIsSearchOpen,
    openSupport,
    setOpenSupport,
    categories,
    products,
    loadingCategories,
    loadingProducts,
    openProductDetail,
    setOpenProductDetail,
    selectedProduct,
    loadingProduct,
    quantity,
    setQuantity,
    activeCategory,
    sectionRefs,
    cartCount,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    productsByCategory,
    handleOpenProductDetail,
    handleAddToCart,
    handleLogout,
    
}
}