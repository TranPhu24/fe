"use client"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"

export function PaymentSuccessPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md w-full">
        <CheckCircle className="mx-auto w-20 h-20 text-green-500 mb-6" />

        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Thanh toán thành công
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Đơn hàng của bạn đã được thanh toán thành công qua{" "}
          <span className="font-semibold text-blue-600">VNPay</span>.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/dashboard/user/order/listorder")}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold"
          >
            Xem đơn hàng
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full border border-gray-300 py-3 rounded-xl"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  )
}
