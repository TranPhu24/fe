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

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "@/lib/api/category";

import { Category, CreateCategoryDto } from "@/lib/api/types";

export  function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<CreateCategoryDto>({
    name: "",
    description: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const res = await getAllCategories();
      if (!res.success) {
        toast.error(res.message);
        return;
      }

      setCategories(res.data!.categories);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Lỗi tải danh mục";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };


  const handleAddCategory = async () => {
    if (!form.name || !form.description) {
      toast.warning("Vui lòng nhập đầy đủ tên và mô tả");
      return;
    }

    try {
      setSubmitting(true);

      const res = await createCategory(form);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success("Thêm danh mục thành công");
      setForm({ name: "", description: "" });

      await loadData();
    } catch {
      toast.error("Thêm danh mục thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteCategory(id);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success("Xoá danh mục thành công");
      await loadData();
    } catch {
      toast.error("Xoá danh mục thất bại");
    }
  };


  const renderCategoryList = () => (
    <div className="space-y-3 border rounded-lg p-4 shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-3">Danh sách danh mục hiện có</h2>

      <ScrollArea className="h-[500px] pr-3">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-4 shadow animate-pulse space-y-2"
              >
                <Skeleton className="h-4 bg-gray-200 rounded w-1/2" />
                <Skeleton className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat._id}
              className="relative border rounded-lg p-4 bg-gray-50"
            >
              <div className="font-medium">{cat.name}</div>
              <div className="text-sm text-gray-500">{cat.description}</div>

              <button
                onClick={() => handleDelete(cat._id)}
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
        <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
      </div>

      <Breadcrumb className="border-b border-gray-200 pb-2 mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <SlashIcon />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin/product/category">
              Danh mục
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4 border rounded-lg p-4 shadow-sm bg-white">
          <h2 className="text-lg font-semibold mb-3">Thêm danh mục mới</h2>

          <div>
            <label className="block mb-1 font-medium">Tên danh mục</label>
            <Input
              placeholder="Nhập tên danh mục"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Mô tả</label>
            <Textarea
              placeholder="Nhập mô tả"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="min-h-[120px]"
            />
          </div>

          <button
            onClick={handleAddCategory}
            disabled={submitting}
            className="bg-black hover:bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {submitting ? "Đang thêm..." : "Thêm danh mục"}
          </button>
        </div>

        {renderCategoryList()}
      </div>
    </div>
  );
}
