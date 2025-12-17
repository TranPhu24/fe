"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
//import * as XLSX from "xlsx";

import { getAllEmployees, createEmployee, deleteEmployee } from "@/lib/api/admin";
import type { Employee } from "@/lib/api/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

import { SlashIcon, TrashIcon, Loader2 } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function AccountForm() {
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const result = await getAllEmployees();

      if (result.success && result.data?.employees) {
        const filtered = result.data.employees.filter((emp: Employee) => emp.role === "employee");
        setEmployees(filtered);
      } else {
        toast.error(result.message || "Không thể tải danh sách nhân viên");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Lỗi tải nhân viên";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (value: string) => {
    if (!value) return "Email không được để trống";
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value)) return "Email không hợp lệ";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Mật khẩu không được để trống";
    if (value.length < 6) return "Mật khẩu phải ít nhất 6 ký tự";
    return "";
  };

  const handleAddEmployee = async () => {
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);

    setEmailError(eErr);
    setPasswordError(pErr);

    if (eErr || pErr) {
      toast.error("Vui lòng kiểm tra thông tin!");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createEmployee({
        username: username,
        email: email,
        password,
        phone: phone || undefined,
      });

      if (!result.success) {
        toast.error(result.message || "Tạo nhân viên thất bại");
        return;
      }

      toast.success("Tạo nhân viên thành công!");

      setUsername("");
      setEmail("");
      setPassword("");
      setPhone("");

      await loadData();
    } catch {
      toast.error("Có lỗi xảy ra khi tạo nhân viên");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn chắc chắn muốn xóa?")) return;

    try {
      const result = await deleteEmployee(id);

      if (!result.success) {
        toast.error(result.message || "Xóa thất bại");
        return;
      }

      toast.success("Đã xóa nhân viên");
      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch {
      toast.error("Lỗi khi xóa nhân viên");
    }
  };

  /*const handleImportExcel = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      toast.error("File phải là Excel (.xlsx hoặc .xls)");
      return;
    }

    try {
      setLoading(true);

      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);

    type EmployeeRow = {
      username?: string;
      email?: string;
      password?: string;
      phone?: string;
    };

    for (const row of data as EmployeeRow[]) {
    await createEmployee({
      username: row.username?.trim() ?? "",
      email: row.email?.trim() ?? "",
      password: row.password || "123456",
      phone: row.phone ?? "",
    });

    }
      toast.success("Import Excel thành công!");
      await loadEmployees();
    } catch {
      toast.error("Lỗi đọc file Excel");
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };
*/
  const filteredEmployees = employees.filter(
    (emp) =>
      emp.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / usersPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

    return (
    <div className="p-6 w-full min-w-[80vw] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản Lý Nhân Viên</h1>

        <div className="flex gap-4">
          {/* Dialog Thêm Nhân Viên */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gray-700 text-white hover:bg-gray-900">
                + Thêm nhân viên
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Tạo nhân viên mới</DialogTitle>
                <DialogDescription>
                  Tạo tài khoản nhân viên cho hệ thống
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Username *</Label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="nguyenvana"
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(validateEmail(e.target.value));}}
                    placeholder="abc@company.com"
                  />
                  {emailError && (
                  <p className="text-sm text-red-500">{emailError}</p>
                )}
                </div>
                <div>
                  <Label>Mật khẩu *</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value);
                    setPasswordError(validatePassword(e.target.value));}
                    }
                    placeholder="Mật khẩu mặc định: 123456"
                  />
                  {passwordError && (
                  <p className="text-sm text-red-500">{passwordError}</p>
                )}
                </div>
                <div>
                  <Label>Số điện thoại</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0901234567"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={handleAddEmployee}
                    disabled={submitting}
                    className="bg-gray-700 text-white hover:bg-gray-900"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      "Tạo nhân viên"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* 
          <Button asChild className="bg-gray-700 text-white hover:bg-gray-900">
            <label className="cursor-pointer">
              Nhập từ Excel
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleImportExcel}
              />
            </label>
          </Button>
          */}

        </div>
      </div>

      <Breadcrumb className="border-b border-gray-200 pb-2 mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator><SlashIcon /></BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/admin/account">Nhân viên</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="Tìm kiếm theo username hoặc email..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-md"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden mb-8">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID (8 ký tự cuối)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SĐT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-8 w-16" /></td>
                </tr>
              ))
            ) : paginatedEmployees.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-500">
                  {searchQuery ? "Không tìm thấy nhân viên nào" : "Chưa có nhân viên nào"}
                </td>
              </tr>
            ) : (
              paginatedEmployees.map((emp) => (
                <tr key={emp._id}>
                  <td className="px-6 py-4 text-sm font-mono text-gray-600">
                    {emp._id.slice(-8)}
                  </td>
                  <td className="px-6 py-4 font-medium">{emp.username}</td>
                  <td className="px-6 py-4">{emp.email}</td>
                  <td className="px-6 py-4">{emp.phone || "-"}</td>
                  <td className="px-6 py-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(emp._id)}
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination>
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              className={`px-3 py-2 rounded-md border ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Previous
            </button>
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              if (page === 1 || page === totalPages) return true;
              if (Math.abs(page - currentPage) <= 1) return true;
              return false;
            })
            .map((page, i, arr) => {
              const prev = arr[i - 1];

              return (
                <PaginationItem key={page}>
                  {prev && page - prev > 1 && (
                    <span className="px-3 select-none">…</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-md border ${
                      currentPage === page
                        ? "bg-gray-800 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                </PaginationItem>
              );
            })}
          <PaginationItem>
            <button
              onClick={() =>
                currentPage < totalPages && setCurrentPage(currentPage + 1)
              }
              className={`px-3 py-2 rounded-md border ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

    </div>
  );
}
