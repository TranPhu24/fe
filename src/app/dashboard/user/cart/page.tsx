import { CartPage } from "@/components/user/cart"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Để full width trên desktop, vẫn đẹp trên mobile */}
      <div className="mx-auto w-full max-w-5xl px-4">
        <CartPage />
      </div>
    </div>
  )
}