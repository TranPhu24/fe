"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from "@/lib/api/order";
import { Order, OrderStatus, PaymentStatus } from "@/lib/api/types";

const statusMap: Record<
  OrderStatus,
  { label: string; color: string }
> = {
  pending: {
    label: "Chờ xác nhận",
    color: "bg-yellow-100 text-yellow-700",
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "bg-blue-100 text-blue-700",
  },
  preparing: {
    label: "Đang chuẩn bị",
    color: "bg-purple-100 text-purple-700",
  },
  shipping: {
    label: "Đang giao",
    color: "bg-orange-100 text-orange-700",
  },
  completed: {
    label: "Hoàn thành",
    color: "bg-green-100 text-green-700",
  },
  cancelled: {
    label: "Đã huỷ",
    color: "bg-red-100 text-red-700",
  },
};

const updatabeStatusMap: OrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "shipping",
  "completed",
];
  const paymentStatusMap : Record<PaymentStatus, { label: string; color: string }>={
    paid: {
      label: "Đã thanh toán",
      color: "bg-green-100 text-green-700",
    },
    pending: {
      label: "Chờ thanh toán",
      color: "bg-yellow-100 text-yellow-700",
    },
    failed: {
      label: "Thanh toán thất bại",
      color: "bg-red-100 text-red-700",
    },
    refunded:{
      label: "Hoàn tiền",
      color: "bg-gray-100 text-black-700"
    }
  };
export function EmployeeOrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  /* cancel dialog */
  const [openCancel, setOpenCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
    try {
        setLoading(true);
        const res = await getAllOrders();
        if (!res.success) {
        toast.error(res.message || "Không tải được đơn hàng");
        return;
        }
        setOrders(res.data?.orders || []);
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Lỗi tải đơn hàng";
        toast.error(message);
    } finally {
        setLoading(false);
    }
    };

  const handleUpdateStatus = async (
    orderId: string,
    status: OrderStatus
  ) => {
    setUpdatingId(orderId);

    const res = await updateOrderStatus(orderId, status);

    if (res.success) {
      toast.success("Cập nhật trạng thái thành công");
      loadOrders();
    } else {
      toast.error(res.message);
    }

    setUpdatingId(null);
  };

  const handleConfirmCancel = async () => {
    if (!selectedOrderId || !cancelReason.trim()) {
      toast.error("Vui lòng nhập lý do huỷ");
      return;
    }

    const res = await cancelOrder(selectedOrderId, cancelReason);

    if (res.success) {
      toast.success("Đã huỷ đơn hàng");
      setOpenCancel(false);
      setCancelReason("");
      setSelectedOrderId(null);
      loadOrders();
    } else {
      toast.error(res.message);
    }
  };

  if (loading) {
    return <p className="text-center py-10">Đang tải đơn hàng...</p>;
  }

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">
          Cập nhật trạng thái đơn hàng
        </h1>

        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow p-6 space-y-4"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <p className="font-semibold">
                  Đơn hàng:{" "}
                  <span className="text-red-600">
                    {order._id.slice(-6)}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  <b>Thời gian đặt:</b> {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                    <b>Họ tên người nhận:</b> {order.shippingAddress.fullName}{" "}
                </p>
                <p className="text-sm text-gray-500">
                    <b>Số điện thoại:</b> {order.shippingAddress.phone}{" "}
                </p>

                <p className="text-sm text-gray-500">
                <b>Địa chỉ nhận hàng:</b> {order.shippingAddress.address},{" "}
                {order.shippingAddress.ward},{" "}
                {order.shippingAddress.city}
                </p>

              </div>

              <div className="flex items-center gap-3">
                {order.orderStatus !== "completed" &&
                  order.orderStatus !== "cancelled" && (
                    <select
                      value={order.orderStatus}
                      disabled={updatingId === order._id}
                      onChange={(e) =>
                        handleUpdateStatus(
                          order._id,
                          e.target.value as OrderStatus
                        )
                      }
                      className="border rounded-lg px-3 py-2 text-sm"
                    >
                      <option value={order.orderStatus} disabled>
                        {statusMap[order.orderStatus].label}
                      </option>

                      {updatabeStatusMap.filter(
                        (s) => s !== order.orderStatus
                      ).map((status) => (
                        <option key={status} value={status}>
                          {statusMap[status].label}
                        </option>
                      ))}
                    </select>
                  )}

                {(order.orderStatus === "pending" ||
                  order.orderStatus === "confirmed") && (
                  <button
                    onClick={() => {
                      setSelectedOrderId(order._id);
                      setOpenCancel(true);
                    }}
                    className="px-4 py-2 text-sm rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    Huỷ đơn
                  </button>
                )}
              </div>
            </div>

            <div className="border-t pt-3 space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.product}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t pt-3 font-semibold">
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${
                  statusMap[order.orderStatus].color
                }`}
              >
                {statusMap[order.orderStatus].label}
              </span>
                <span className="font-semibold">
                    Tổng tiền: {order.finalTotal.toLocaleString()}đ
                </span>
            </div>
            <div className="font-semibold">
                <span
                className={`px-2 py-1 rounded text-sm 
                ${paymentStatusMap[order.paymentStatus].color}`}>
                {paymentStatusMap[order.paymentStatus].label}
                </span>
            </div>

            {updatingId === order._id && (
              <p className="text-sm text-gray-500">
                Đang cập nhật trạng thái...
              </p>
            )}
          </div>
        ))}
      </div>

      <Dialog open={openCancel} onOpenChange={setOpenCancel}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogTitle className="text-lg font-bold">
            Huỷ đơn hàng
          </DialogTitle>

          <p className="text-sm text-gray-600 mt-2">
            Vui lòng nhập lý do huỷ đơn
          </p>

          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="w-full mt-4 border rounded-lg p-3 text-sm resize-none"
            rows={3}
            placeholder="Ví dụ: Khách yêu cầu huỷ, hết món..."
          />

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setOpenCancel(false)}
              className="flex-1 py-2 border rounded-lg"
            >
              Đóng
            </button>

            <button
              onClick={handleConfirmCancel}
              className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Xác nhận huỷ
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
