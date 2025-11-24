import Image from "next/image";
import Link from "next/link";
import { Bell, ShoppingCart, User } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* HEADER */}
<header className="bg-white shadow-sm sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

    {/* Left: Address */}
    <div className="text-sm text-gray-600">
      Giao hàng tới:{" "}
      <strong className="text-black">
        WVVG+V8G, Long Bình, Tp. Biên Hòa, Đồng Nai...
      </strong>
    </div>

    {/* Right: Icons */}
    <div className="flex items-center gap-6">

      {/* Bell icon */}
      <button className="text-gray-700 text-2xl">
        <Bell className="w-6 h-6 text-gray-700" />
      </button>
      

      {/* Cart button */}
      <button className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-1">
        <span className="text-sm font-semibold text-gray-700">0</span>
        <ShoppingCart className="w-6 h-6 text-gray-700" />
      </button>

      {/* User button */}
      <button className="flex items-center gap-2 border border-red-500 text-red-600 rounded-full px-4 py-1">
        <span className="text-xl">☰</span>
        <User className="w-6 h-6 text-red-600" />
      </button>

    </div>
  </div>
</header>


      {/* BANNER */}
      <section className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="https://res.cloudinary.com/demo/image/upload/v1700000000/banner-kids.jpg"
              alt="Kids Menu"
              width={1200}
              height={500}
              className="w-full h-auto"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-6xl font-bold text-white drop-shadow-lg">
                KIDS MENU
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* MENU NAVIGATION */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-6 py-4 whitespace-nowrap">
            {[
              "BẠN SẼ THÍCH",
              "ĐỒ ĂN NHANH",
              "MÓN CHÍNH",
              "ĐỒ UỐNG",
              "COMBO",
              "KIDS MENU",
            ].map((item, idx) => (
              <Link
                key={idx}
                href="#"
                className={`font-medium text-sm pb-2 border-b-2 transition-colors ${
                  item === "BẠN SẼ THÍCH"
                    ? "text-red-600 border-red-600"
                    : "text-gray-600 border-transparent hover:text-red-600 hover:border-red-600"
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* SECTION: BẠN SẼ THÍCH */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 relative inline-block mx-auto">
            BẠN SẼ THÍCH
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-red-600 rounded-full"></span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Pizza Hải Sản Xốt Pesto",
                img: "https://res.cloudinary.com/demo/image/upload/v1700000000/pizza1.jpg",
              },
              {
                name: "Khoai Tây Chiên",
                img: "https://res.cloudinary.com/demo/image/upload/v1700000000/fries.jpg",
              },
              {
                name: "Pizza Bò",
                img: "https://res.cloudinary.com/demo/image/upload/v1700000000/pizza2.jpg",
              },
            ].map((product, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <Image
                  src={product.img}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: GIÁ DÙNG THỬ */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-6 relative inline-block mx-auto">
            GIÁ DÙNG THỬ PIZZA MỚI
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-red-600 rounded-full"></span>
          </h2>

          {/* Promo Banner */}
          <div className="mb-8">
            <Image
              src="https://res.cloudinary.com/demo/image/upload/v1700000000/promo-banner.jpg"
              alt="Giảm 50% Pizza"
              width={1200}
              height={300}
              className="w-full rounded-xl shadow-md"
            />
          </div>

          {/* Promo Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                size: "Cỡ Vừa",
                img: "https://res.cloudinary.com/demo/image/upload/v1700000000/pizza-medium.jpg",
              },
              {
                size: "Cỡ Lớn",
                img: "https://res.cloudinary.com/demo/image/upload/v1700000000/pizza-large.jpg",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative bg-white rounded-xl overflow-hidden shadow-lg"
              >
                <span className="absolute top-3 left-3 bg-yellow-400 text-black font-bold text-xs px-3 py-1 rounded-full z-10">
                  MỚI
                </span>

                <Image
                  src={item.img}
                  alt={`Pizza Bò Bulgogi ${item.size}`}
                  width={600}
                  height={400}
                  className="w-full h-64 object-cover"
                />

                <div className="p-4 text-center">
                  <div className="bg-red-600 text-white font-bold text-xl py-2 -mt-8 relative z-10 inline-block px-6 rounded-t-lg">
                    GIẢM 50%
                  </div>

                  <h3 className="font-bold text-lg mt-3">
                    PIZZA BÒ BULGOGI HÀN QUỐC
                  </h3>

                  <p className="text-sm text-gray-600 mt-1">
                    {item.size} + 1 lon Pepsi/7UP/Mirinda
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
