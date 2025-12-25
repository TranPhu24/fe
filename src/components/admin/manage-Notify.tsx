"use client";
import { useEffect, useState } from "react";
import { SlashIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";

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

import {
  createNotification,
  deleteNotification,
  getAllNotifications,
} from "@/lib/api/notify";

import { Notification, CreateNotificationDto } from "@/lib/api/types";

export function AdminNotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<CreateNotificationDto>({
    title: "",
    message: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getAllNotifications();

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      setNotifications(res.data!.notifications);
    } catch {
      toast.error("Lỗi tải thông báo");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.title || !form.message) {
      toast.warning("Vui lòng nhập đầy đủ dữ liệu");
      return;
    }

    try {
      setSubmitting(true);
      const res = await createNotification(form);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      toast.success("Tạo thông báo thành công");
      setForm({ title: "", message: "" });
      await loadData();
    } catch {
      toast.error("Tạo thông báo thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteNotification(id);

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

  const renderList = () => (
    <div className="space-y-3 border rounded-lg p-4 shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-3">
        Danh sách thông báo
      </h2>

      <ScrollArea className="h-[500px] pr-3">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border p-4 rounded animate-pulse">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4 mt-2" />
              </div>
            ))}
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className="relative border rounded-lg p-4 bg-gray-50"
            >
              <div className="font-medium text-lg">{n.title}</div>
              <div className="text-sm text-gray-600">{n.message}</div>
              <div>
                Người gửi: <span className="text-red-500 font-medium">{n.createdBy?.username}</span>
              </div>

              <button
                onClick={() => handleDelete(n._id)}
                className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded"
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
      <h1 className="text-2xl font-bold mb-6">Quản lý thông báo</h1>

      <Breadcrumb className="border-b pb-2 mb-6">
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
            <BreadcrumbLink href="#">
              Thông báo
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4 shadow-sm bg-white space-y-4">
          <h2 className="text-lg font-semibold">Tạo thông báo mới</h2>



          <Input
            placeholder="Tiêu đề"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <Textarea
            placeholder="Nội dung thông báo"
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
            className="min-h-[120px]"
          />

          <button
            onClick={handleCreate}
            disabled={submitting}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {submitting ? "Đang tạo..." : "Tạo thông báo"}
          </button>
        </div>

        {renderList()}
      </div>
    </div>
  );
}
