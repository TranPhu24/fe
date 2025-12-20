"use client";

import { useState, useEffect } from "react";
import { SlashIcon, TrashIcon } from "lucide-react";

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
} from "@/components/ui/select";


import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import {
  createDiscount,
  getAllDiscounts,
} from "@/lib/api/discount";

import { Discount, CreateDiscountDTO } from "@/lib/api/types";

export function DiscountPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<CreateDiscountDTO>({
    code: "",
    type: "percentage",
    value: 0,
    minOrderValue: 0,
    usageLimit: 0,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const res = await getAllDiscounts();
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      setDiscounts(res.data!.discounts);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Lỗi tải mã giảm giá";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDiscount = async () => {
    if (!form.code || !form.startDate || !form.endDate) {
      toast.warning("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      setSubmitting(true);

      const payload: CreateDiscountDTO = {
        ...form,
        code: form.code.toUpperCase(),
        value: form.type === "freeship" ? undefined : form.value,
      };

      const res = await createDiscount(payload);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success("Tạo mã giảm giá thành công");

      setForm({
        code: "",
        type: "percentage",
        value: 0,
        minOrderValue: 0,
        usageLimit: 0,
        startDate: "",
        endDate: "",
      });

      await loadData();
    } catch {
      toast.error("Tạo mã giảm giá thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const renderDiscountList = () => (
    <div className="space-y-3 border rounded-lg p-4 shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-3">
        Danh sách mã giảm giá
      </h2>

      <ScrollArea className="h-[500px] pr-3">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 shadow animate-pulse space-y-2"
              >
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          discounts.map((d) => (
            <div
              key={d._id}
              className="relative border rounded-lg p-4 bg-gray-50"
            >
              <div className="font-medium">
                {d.code} ({d.type})
              </div>

              <div className="text-sm text-gray-600">
                {d.type === "percentage" && `Giảm ${d.value}%`}
                {d.type === "fixed" && `Giảm ${d.value}đ`}
                {d.type === "freeship" && "Miễn phí vận chuyển"}
              </div>

              <div className="text-xs text-gray-500 mt-1">
                Đã dùng: {d.usedCount}
                {d.usageLimit ? ` / ${d.usageLimit}` : ""}
              </div>

              <button
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-100 transition"
              >
                <TrashIcon className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );

  return (
    <div className="p-6 w-full min-w-[80vw] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý mã giảm giá</h1>
      </div>

      <Breadcrumb className="border-b border-gray-200 pb-2 mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin">
              Trang chủ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin/discount">
              Mã giảm giá
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="text-lg font-semibold mb-3">
            Tạo mã giảm giá
          </h2>

          <Input
            placeholder="Mã giảm giá (VD: SALE20%)"
            value={form.code}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value })
            }
          />

        <Select
        value={form.type}
        onValueChange={(value) =>
            setForm({
            ...form,
            type: value as "percentage" | "fixed" | "freeship",
            })
        }
        >
        <SelectTrigger className="w-full">
            <SelectValue placeholder="Chọn loại giảm giá" />
        </SelectTrigger>

        <SelectContent>
            <SelectItem value="percentage">Giảm %</SelectItem>
            <SelectItem value="fixed">Giảm tiền</SelectItem>
            <SelectItem value="freeship">Free ship</SelectItem>
        </SelectContent>
        </Select>


          {form.type !== "freeship" && (
            <Input
              type="number"
              placeholder="Giá trị giảm"
              value={form.value}
              onChange={(e) =>
                setForm({ ...form, value: Number(e.target.value) })
              }
            />
          )}

          <Input
            type="number"
            placeholder="Giá trị đơn hàng tối thiểu"
            value={form.minOrderValue}
            onChange={(e) =>
              setForm({
                ...form,
                minOrderValue: Number(e.target.value),
              })
            }
          />

          <Input
            type="number"
            placeholder="Giới hạn lượt dùng"
            value={form.usageLimit}
            onChange={(e) =>
              setForm({
                ...form,
                usageLimit: Number(e.target.value),
              })
            }
          />

          <Input
            type="date"
            value={form.startDate}
            onChange={(e) =>
              setForm({ ...form, startDate: e.target.value })
            }
          />

          <Input
            type="date"
            value={form.endDate}
            onChange={(e) =>
              setForm({ ...form, endDate: e.target.value })
            }
          />

          <button
            onClick={handleAddDiscount}
            disabled={submitting}
            className="bg-black hover:bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {submitting ? "Đang tạo..." : "Tạo mã giảm giá"}
          </button>
        </div>

        {renderDiscountList()}
      </div>
    </div>
  );
}
