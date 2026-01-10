"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {createDiscount,deleteDiscount,getAllDiscounts,} from "@/lib/api/discount";
import { Discount, CreateDiscountDTO } from "@/lib/api/types";
export function useDiscount() {

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

    const handleDelete = async (id: string) => {
      try {
        const res = await deleteDiscount(id);
  
        if (!res.success) {
          toast.error(res.message);
          return;
        }
  
        toast.success("Xóa thông báo thành công");
        await loadData();
      } catch {
        toast.error("Xóa thông báo thất bại");
      }
    };
    return {
    discounts,
    loading,
    form,
    setForm,
    submitting,
    handleAddDiscount,
    handleDelete,
  }
}
