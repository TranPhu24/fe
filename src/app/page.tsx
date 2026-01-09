"use client";
import Image from "next/image";
import { Facebook, Instagram, X, Minus, Plus, Heart,  Bell, ShoppingCart, 
  User, MessageCircle, Truck, CreditCard, ShieldCheck, FlaskConical, Leaf,
  Crown, Headphones} from "lucide-react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useHomePage } from "@/hooks/user/home";


const banners = [
  "https://res.cloudinary.com/dp7acjc88/image/upload/v1765608918/foodapp/mmat8b39j0padnqpsp4r.png",
  "https://res.cloudinary.com/dp7acjc88/image/upload/v1765609022/foodapp/ouselslipeeclr2bss8m.png",
  "https://res.cloudinary.com/dp7acjc88/image/upload/v1765608971/foodapp/kjs2sscj6wdpkdnmkddr.png",
  "https://res.cloudinary.com/dp7acjc88/image/upload/v1765607909/Screenshot_2025-12-13_133738_pitczb.png",
  "https://res.cloudinary.com/dp7acjc88/image/upload/v1767955056/anh-sang-trong-thiet-ke-bep-quan-an_qap0vg.jpg",

];
export default function Home() {
  const {
    isSearchOpen,   
    setIsSearchOpen,
    openSupport,
    setOpenSupport,
    categories,
    loadingCategories,
    loadingProducts,
    openProductDetail,
    setOpenProductDetail,
    selectedProduct,
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
    notifications,
    openNotification,
    setOpenNotification,
    loadingNotifications,
    chatMessages,
    chatLoading,
    chatInput,
    setChatInput,
    handleSendChat,
    isOpen,
    setIsOpen,
    favoriteIds,
    handleToggleFavorite,
  } = useHomePage();
  
  return (
  <>
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center h-16">
        <div></div>
        <div className="flex items-center gap-6">
          <Sheet open={openNotification} onOpenChange={setOpenNotification}>
            <SheetTrigger asChild>
              <button className="relative">
                <Bell className="w-6 h-6 text-gray-700" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[480px]">
              <SheetHeader>
                <SheetTitle className="text-red-500 font-bold">THÔNG BÁO</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3 w-[350px]">
                {loadingNotifications ? (
                  <p className="text-gray-500">Đang tải thông báo...</p>
                ) : notifications.length === 0 ? (
                  <p className="text-gray-500 text-center">Không có thông báo</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
                    >
                      <p className="font-medium text-red-500">{n.title}</p>
                      <p className="text-sm text-black">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </SheetContent>
          </Sheet>
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
    <section className="w-full bg-white">
      <Carousel opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {banners.map((src, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full h-[180px] md:h-[260px] lg:h-[480px] overflow-hidden">
                <Image
                  src={src}
                  alt={`Banner ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/25" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-white/90 hover:bg-white" />
        <CarouselNext className="right-4 bg-white/90 hover:bg-white" />
      </Carousel>
    </section>

    {/* Category */}
    <nav className="bg-white sticky top-16 z-40 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-8 lg:gap-12 py-6 overflow-x-auto scrollbar-hide">
          <div className="flex-shrink-0">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="flex items-center gap-3 text-gray-700 hover:text-red-600 transition-all duration-200 whitespace-nowrap"
              aria-label="Mở/đóng tìm kiếm"
            >
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden
            ${isSearchOpen ? 'flex-1 opacity-100' : 'w-0 opacity-0'}
          `}
        >
            <div className="relative min-w-[300px] lg:min-w-[400px]">
              <input
                type="text"
                placeholder="Tìm kiếm món ăn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={isSearchOpen}
                className="w-full px-5 py-3 pl-12 pr-12 text-lg font-bold rounded-full border border-gray-300 focus:border-red-500 focus:outline-none shadow-md transition-all"
              />
              
              <button
                onClick={() => {
                  if (searchQuery) {
                    setSearchQuery("");
                  } else {
                    setIsSearchOpen(false);
                  }
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div
            className={`flex gap-10 lg:gap-12 items-center whitespace-nowrap min-w-0
              transition-all duration-300
              ${isSearchOpen ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'}
            `}
          >
              {loadingCategories ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-32 h-8 bg-gray-200 animate-pulse rounded-lg" />
                ))
              ) : (
                categories.map((c) => (
                  <a
                    key={c._id}
                    href={`#${c.name}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(c.name)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`font-bold text-lg lg:text-xl pb-4 border-b-4 transition-all duration-300 flex-shrink-0
                      ${activeCategory === c.name
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
      </div>
    </nav>

  <main className="max-w-7xl mx-auto px-4 py-8 space-y-16">
    {searchQuery.trim() !== "" ? (
      <section className="scroll-mt-32">
        <h2 className="text-2xl font-bold mb-6">
          Kết quả tìm kiếm cho &quot;{searchQuery}
          <span className="text-lg font-normal text-gray-600 ml-3">
            ({filteredProducts.length} món)
          </span>
        </h2>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl">
            <div className="mx-auto w-32 h-32 mb-6 opacity-50">
              <svg className="w-full h-full text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-xl text-gray-600 font-medium">Không tìm thấy món ăn nào</p>
            <p className="text-gray-500 mt-2">Thử dùng từ khóa khác nhé!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
                onClick={() => handleOpenProductDetail(p)}
              >
                <Image
                  src={p.image || "/placeholder.jpg"}
                  alt={p.name}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[3rem] flex items-center justify-center">
                    {p.name}
                  </h3>
                  <p className="text-red-600 font-bold mt-2 text-lg">
                    {p.price.toLocaleString()}đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    ) : (
      <>
        {productsByCategory.length === 0 && !loadingProducts ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">Chưa có sản phẩm nào</p>
          </div>
        ) : (
          productsByCategory.map(({ category, products }) => (
            <section
              key={category._id}
              id={category.name}
              data-category={category.name}
              ref={(el) => {
                sectionRefs.current[category.name] = el;
              }}
              className="scroll-mt-48"
            >
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="flex justify-center w-full max-w-4xl mx-auto">
                <h2 className="text-5xl font-extrabold text-center text-red-600 uppercase tracking-wider">
                  {category.name}
                </h2>
              </div>
              <div className="mt-6 flex items-center w-full max-w-md">
                <div className="flex-grow border-t-2 border-gray-600"></div>
                <h3 className="mx-6 text-lg font-medium text-center text-gray-700 italic">
                  {category.description}
                </h3>
                <div className="flex-grow border-t-2 border-gray-600"></div>
                </div>
            </div>
              {loadingProducts ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-xl" />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <p className="text-center text-gray-500 py-12 text-lg">
                  Chưa có sản phẩm trong danh mục này
                </p>
              ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((p) => {
                  const isFavorite = favoriteIds.includes(p._id);
                  return (
                    <div
                      key={p._id}
                      className="relative bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
                      onClick={() => handleOpenProductDetail(p)}
                    >
                      <button
                        className="absolute top-3 right-3 z-10 bg-white/90 rounded-full p-2 hover:scale-110 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(p._id, isFavorite);
                        }}
                      >
                        <Heart
                          size={20}
                          className={
                            isFavorite
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400"
                          }
                        />
                      </button>

                      <Image
                        src={p.image || "/placeholder.jpg"}
                        alt={p.name}
                        width={300}
                        height={200}
                        className="w-full h-40 object-cover"
                      />

                      <div className="p-4 text-center">
                        <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[3rem] flex items-center justify-center">
                          {p.name}
                        </h3>
                        <p className="text-red-600 font-bold mt-2 text-lg">
                          {p.price.toLocaleString()}đ
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </section>

          ))
        )}
      </>
    )}
  </main>

  <Dialog open={openProductDetail} onOpenChange={setOpenProductDetail}>
    <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-2xl shadow-2xl h-[80vh] w-full">
      <DialogTitle className="sr-only">
        {selectedProduct?.name ?? "Chi tiết sản phẩm"}
      </DialogTitle>

      <div className="relative grid grid-cols-1 md:grid-cols-2">
        <button
          type="button"
          onClick={() => setOpenProductDetail(false)}
          aria-label="Đóng"
          className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:bg-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-64 md:h-full bg-gray-100">
          <Image
            src={selectedProduct?.image || "/placeholder.jpg"}
            alt={selectedProduct?.name || "Món ăn"}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedProduct?.name}
            </h2>

            <p className="text-gray-600 leading-relaxed">
              {selectedProduct?.description ||
                "Món ăn thơm ngon, chất lượng cao cấp."}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
                aria-label="Giảm số lượng"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span className="text-xl font-bold w-12 text-center">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
                aria-label="Tăng số lượng"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-3 rounded-full shadow-xl transition-all flex items-center gap-2"
              aria-label="Thêm vào giỏ hàng"
            >
              <span>Thêm</span>
              <span>
                {(selectedProduct?.price
                  ? selectedProduct.price * quantity
                  : 0
                ).toLocaleString()}
                đ
              </span>
            </button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>

  <button
    onClick={() => setIsOpen(!isOpen)}
    className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 hover:scale-110"
  >
    {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
  </button>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 border border-gray-200">
          <div className="bg-red-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <h3 className="font-semibold text-lg">Chat với AI</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-red-700 p-1 rounded-full transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {chatMessages.length === 0 ? (
              <p className="text-center text-gray-500 mt-20">
                Hãy bắt đầu cuộc trò chuyện!
              </p>
            ) : (
              chatMessages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      m.role === 'user'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))
            )}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-2xl">
                  Đang suy nghĩ...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                disabled={chatLoading}
              />
              <button
                onClick={handleSendChat}
                disabled={chatLoading || !chatInput.trim()}
                className={`px-5 py-2 rounded-full text-white font-medium transition ${
                  chatLoading || !chatInput.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}

<section className="bg-gradient-to-b from-gray-50 to-white py-10 md:py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl font-bold text-red-600 tracking-tight">
        Không gian bếp của chúng tôi
      </h2>
      <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
        Sạch sẽ – An toàn – Chuẩn vệ sinh thực phẩm
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
      <div className="overflow-hidden rounded-2xl shadow-xl transition-transform duration-300 hover:scale-[1.03]">
        <Image
          src="https://res.cloudinary.com/dp7acjc88/image/upload/v1767955057/khong-gian-bep-quan-an_f7rznj.jpg" 
          alt="Không gian bếp"
          width={800}
          height={600}
          className="object-cover w-full h-72 md:h-80"
          priority
        />
      </div>
      <div className="overflow-hidden rounded-2xl shadow-xl transition-transform duration-300 hover:scale-[1.03]">
        <Image
          src="https://res.cloudinary.com/dp7acjc88/image/upload/v1767955056/anh-sang-trong-thiet-ke-bep-quan-an_qap0vg.jpg"
          alt="Ánh sáng"
          width={800}
          height={600}
          className="object-cover w-full h-72 md:h-80"
        />
      </div>
      <div className="overflow-hidden rounded-2xl shadow-xl transition-transform duration-300 hover:scale-[1.03]">
        <Image
          src="https://res.cloudinary.com/dp7acjc88/image/upload/v1767955056/he-thong-thong-gio-hut-mui-bep_pvgt1o.jpg"
          alt="Hệ thống thông gió"
          width={800}
          height={600}
          className="object-cover w-full h-72 md:h-80"
        />
      </div>
    </div>

    <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
      <CardContent className="p-8 md:p-10">
        <h3 className="text-3xl font-bold text-center text-red-600 mb-10">
          Chất lượng nguyên liệu
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-4 group">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-50 to-green-100 text-green-600 text-4xl shadow-md transition-transform group-hover:scale-110 duration-300">
              <ShieldCheck className="w-10 h-10">
              </ShieldCheck>
            </div>
            <h4 className="text-xl font-bold text-green-700">Tươi mỗi ngày</h4>
            <p className="text-gray-600 leading-relaxed">
              Nguyên liệu được nhập mới 100% mỗi ngày từ các nhà cung cấp uy tín, đảm bảo độ tươi ngon tối ưu.
            </p>
          </div>

          <div className="text-center space-y-4 group">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 text-4xl shadow-md transition-transform group-hover:scale-110 duration-300">
              <FlaskConical className=" w-10 h-10"></FlaskConical>
            </div>
            <h4 className="text-xl font-bold text-blue-700">Kiểm định nghiêm ngặt</h4>
            <p className="text-gray-600 leading-relaxed">
              Đạt chuẩn VSATTP, kiểm soát chất lượng từ khâu đầu vào đến chế biến với quy trình khép kín.
            </p>
          </div>

          <div className="text-center space-y-4 group">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-50 to-red-100 text-red-600 text-4xl shadow-md transition-transform group-hover:scale-110 duration-300">
              <Leaf className="h-10 w-10"></Leaf>
            </div>
            <h4 className="text-xl font-bold text-red-700">Không chất bảo quản</h4>
            <p className="text-gray-600 leading-relaxed">
              Cam kết tuyệt đối không sử dụng chất bảo quản độc hại, mang đến món ăn an toàn và tự nhiên nhất.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Badge
            variant="outline"
            className="text-sm md:text-basepx-6 py-2 border border-green-700 text-green-800 uppercase tracking-wide"
          >
            Chứng nhận VSATTP Quốc Gia
          </Badge>
        </div>
      </CardContent>
    </Card>
    <div className="text-center mb-12 mt-20">
      <h2 className="text-3xl md:text-4xl font-bold text-red-600">
        Vì sao bạn nên chọn chúng tôi?
      </h2>
      <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
        Cam kết mang đến trải nghiệm tốt nhất từ đặt hàng đến tận tay bạn
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-red-50 to-red-100 text-red-600 group-hover:scale-110 transition-transform">
            <Truck className="w-10 h-10" strokeWidth={1.8} /> 
          </div>
          <h4 className="font-bold text-xl text-gray-900 mb-2">Miễn Phí Giao Hàng</h4>
          <p className="text-gray-600 text-sm">Áp dụng cho mọi đơn từ 200.000đ trở lên</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
            <CreditCard className="w-10 h-10" strokeWidth={1.8} />
          </div>
          <h4 className="font-bold text-xl text-gray-900 mb-2">Thanh Toán COD</h4>
          <p className="text-gray-600 text-sm">Nhận hàng - Kiểm tra - Thanh toán tại nhà</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 group-hover:scale-110 transition-transform">
            <Crown className="w-10 h-10" strokeWidth={1.8} />
          </div>
          <h4 className="font-bold text-xl text-gray-900 mb-2">Ưu Đãi VIP</h4>
          <p className="text-gray-600 text-sm">Giảm giá độc quyền & quà tặng đặc biệt</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 group">
        <CardContent className="p-6 flex flex-col items-center text-center">
          <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-green-50 to-green-100 text-green-600 group-hover:scale-110 transition-transform">
            <Headphones className="w-10 h-10" strokeWidth={1.8} />
          </div>
          <h4 className="font-bold text-xl text-gray-900 mb-2">Hỗ Trợ 24/7</h4>
          <p className="text-gray-600 text-sm">Đội ngũ sẵn sàng giải đáp mọi lúc</p>
        </CardContent>
      </Card>
    </div>
  </div>
</section>

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
