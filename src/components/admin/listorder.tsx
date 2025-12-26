"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getAllOrders,
} from "@/lib/api/order";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Order, OrderStatus, PaymentStatus } from "@/lib/api/types";
import {SlashIcon} from "lucide-react";

const statusMap: Record<OrderStatus,{ label: string; color: string }> = {
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
  const [orderStatusFilter, setOrderStatusFilter] =useState<OrderStatus | "all">("all");
  const [paymentStatusFilter, setPaymentStatusFilter] =useState<PaymentStatus | "all">("all");
  const [dateFilter, setDateFilter] = useState<string>(""); 

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

    const filteredOrders = orders.filter((order) => {
        const matchOrderStatus =
        orderStatusFilter === "all" ||
        order.orderStatus === orderStatusFilter;

    const matchPaymentStatus =
        paymentStatusFilter === "all" ||
        order.paymentStatus === paymentStatusFilter;

    const matchDate =
        !dateFilter ||
        new Date(order.createdAt).toISOString().slice(0, 10) === dateFilter;

    return matchOrderStatus && matchPaymentStatus && matchDate;
});

  if (loading) {
    return <p className="text-center py-10">Đang tải đơn hàng...</p>;
  }

  return (
    <>
      <div className="p-6 w-full min-w-[80vw] mx-auto">
        <h1 className="text-2xl font-bold">
          Danh sách đơn hàng
        </h1>

        <Breadcrumb className="border-b border-gray-200 pb-2 mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin/report">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator><SlashIcon /></BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin/order">Đơn hàng</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
        <div className="flex flex-wrap gap-4 items-center">
            <Select
              value={orderStatusFilter}
              onValueChange={(value) =>
                setOrderStatusFilter(value as OrderStatus | "all")
              }
            >
              <SelectTrigger className="border rounded-lg px-3 py-2 text-sm w-56">
                <SelectValue placeholder="Tất cả trạng thái đơn" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  Tất cả trạng thái đơn
                </SelectItem>

                {Object.entries(statusMap).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={paymentStatusFilter}
              onValueChange={(value) =>
                setPaymentStatusFilter(value as PaymentStatus | "all")
              }
            >
              <SelectTrigger className="border rounded-lg px-3 py-2 text-sm w-60">
                <SelectValue placeholder="Tất cả trạng thái thanh toán" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  Tất cả trạng thái thanh toán
                </SelectItem>

                {Object.entries(paymentStatusMap).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
                />
      </div>
      <p className="text-sm text-gray-500 my-4">
        Hiển thị{" "}
        <span className="text-red-600 font-bold">
            {filteredOrders.length}{" "} </span>
        đơn hàng
      </p>
       {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow p-6 space-y-4 my-4"
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
                    Tổng tiền: <span className="text-red-600">{order.finalTotal.toLocaleString()}đ</span>
                </span>
            </div>
            <div className="font-semibold">
                <span
                className={`px-2 py-1 rounded text-sm 
                ${paymentStatusMap[order.paymentStatus].color}`}>
                {paymentStatusMap[order.paymentStatus].label}
                </span>
            </div>

          </div>
        ))}
      </div>
    </>
  );
}
