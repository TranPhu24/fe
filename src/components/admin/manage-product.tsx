"use client";

import { useEffect, useState, ChangeEvent } from "react";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from "@/lib/api/product";
import type { Product, Category, UpdateProductDto } from "@/lib/api/types";
import { getAllCategories } from "@/lib/api/category";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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
import { TrashIcon, Loader2, Upload, SlashIcon, Pencil } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";

export function ProductPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const { success, message, data } = await getAllCategories();
      if (!success) {
        toast.error(message || "Không tải được danh mục");
        return;
      }
      setCategories(data?.categories ?? []);
    } catch {
      toast.error("Lỗi tải danh mục");
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const { success, message, data } = await getProducts();
      if (!success) {
        toast.error(message || "Không tải được sản phẩm");
        return;
      }
      setProducts(data?.products ?? []);
    } catch {
      toast.error("Lỗi kết nối server");
    } finally {
      setLoadingProducts(false);
    }
  };

  const getCategoryName = (cat: string | Category | null | undefined): string => {
    if (!cat) return "Chưa chọn";
    if (typeof cat === "string") {
      const found = categories.find((c) => c._id === cat);
      return found?.name || "Đang tải...";
    }
    return (cat as Category)?.name || "Không xác định";
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setCategory("");
    setStock("");
    setImage(null);
    setImagePreview("");
    setNameError("");
    setPriceError("");
    setCategoryError("");
    setImageError("");
    setEditingProduct(null);
    setOpenDialog(false);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setPrice(product.price.toString());
    setDescription(product.description || "");
    setCategory(typeof product.category === "string" ? product.category : product.category?._id || "");
    setStock(product.stock?.toString() || "0");
    setImage(null);
    setImagePreview(product.image || "");
    setOpenDialog(true);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setImageError("");
  };

  const validateForm = () => {
    let valid = true;
    if (!name.trim()) { setNameError("Tên sản phẩm không được để trống"); valid = false; } else setNameError("");
    if (!price || Number(price) <= 0) { setPriceError("Giá phải lớn hơn 0"); valid = false; } else setPriceError("");
    if (!category) { setCategoryError("Vui lòng chọn danh mục"); valid = false; } else setCategoryError("");

    if (!editingProduct && !image && !imagePreview) {
      setImageError("Vui lòng chọn ảnh sản phẩm");
      valid = false;
    } else {
      setImageError("");
    }
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    setSubmitting(true);

    try {
      if (editingProduct) {
        const dto: UpdateProductDto = {
          name: name.trim(),
          price: Number(price),
          description,
          category,
          stock: Number(stock) || 0,
          image: image ?? undefined,
        };

        const { success, message, data } = await updateProduct(editingProduct._id, dto);

        if (!success) {
          toast.error(message || "Cập nhật thất bại");
          return;
        }

        toast.success("Cập nhật sản phẩm thành công!");
        if (data?.product) {
          setProducts((prev) =>
            prev.map((p) => (p._id === editingProduct._id ? data.product : p))
          );
        }
      } else {
        const result = await createProduct({
          name,
          price: Number(price),
          description,
          category,
          stock: Number(stock) || 0,
          image: image!,
        });

        if (!result.success) {
          toast.error(result.message || "Tạo sản phẩm thất bại");
          return;
        }

        toast.success("Tạo sản phẩm thành công!");
        await loadProducts();
      }

      resetForm();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Có lỗi xảy ra";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      const result = await deleteProduct(id);
      if (!result.success) {
        toast.error(result.message || "Xóa thất bại");
        return;
      }
      toast.success("Đã xóa sản phẩm");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      toast.error("Lỗi khi xóa sản phẩm");
    }
  };

  const filteredProducts = products.filter((p) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(query);
    const catName = getCategoryName(p.category).toLowerCase();
    return nameMatch || catName.includes(query);
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 w-full min-w-[80vw] mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản Lý Sản Phẩm</h1>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button
              className="bg-gray-700 text-white hover:bg-gray-900"
              onClick={() => {
                resetForm();
                setOpenDialog(true);
              }}
            >
              + Thêm sản phẩm
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Cập nhật thông tin sản phẩm" : "Nhập thông tin chi tiết sản phẩm"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Tên sản phẩm *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Cà phê sữa đá" />
                {nameError && <p className="text-sm text-red-500 mt-1">{nameError}</p>}
              </div>

              <div>
                <Label>Giá (VNĐ) *</Label>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="35000" />
                {priceError && <p className="text-sm text-red-500 mt-1">{priceError}</p>}
              </div>

              <div>
                <Label>Danh mục *</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 mt-1"
                  disabled={loadingCategories}
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categoryError && <p className="text-sm text-red-500 mt-1">{categoryError}</p>}
              </div>

              <div>
                <Label>Tồn kho</Label>
                <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="100" />
              </div>

              <div className="col-span-2">
                <Label>Mô tả</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>

              <div className="col-span-2">
                <Label>Ảnh sản phẩm {editingProduct ? "(Để trống nếu không thay đổi)" : "*"}</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <Image src={imagePreview} 
                    alt="Preview" 
                      width={400}
                      height={300}
                    className="mx-auto max-h-48 rounded object-cover" />
                  ) : (
                    <div className="text-gray-400">
                      <Upload className="mx-auto h-12 w-12 mb-2" />
                      <p>Kéo thả hoặc click để chọn ảnh</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-4 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-gray-700 file:text-white"
                  />
                  {imageError && <p className="text-sm text-red-500 mt-1">{imageError}</p>}
                </div>
              </div>

              <div className="col-span-2 flex justify-end gap-3">
                <Button variant="outline" onClick={resetForm}>
                  Hủy
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-gray-700 text-white hover:bg-gray-900"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang lưu...
                    </>
                  ) : editingProduct ? (
                    "Cập nhật"
                  ) : (
                    "Tạo sản phẩm"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Breadcrumb className="border-b pb-4 mb-6">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard/admin">Admin</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator><SlashIcon /></BreadcrumbSeparator>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard/admin/product/food">Sản phẩm</BreadcrumbLink></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-6">
        <Input
          placeholder="Tìm kiếm theo tên hoặc danh mục..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-md"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 w-[80px] text-left text-xs font-medium text-gray-500 uppercase">Ảnh</th>
              <th className="px-6 py-3 w-[30%] text-left text-xs font-medium text-gray-500 uppercase">Tên sản phẩm</th>
              <th className="px-6 py-3 w-[15%] text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
              <th className="px-6 py-3 w-[20%] text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
              <th className="px-6 py-3 w-[10%] text-center text-xs font-medium text-gray-500 uppercase">Tồn kho</th>
              <th className="px-6 py-3 w-[15%] text-center text-xs font-medium text-gray-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loadingProducts ? (
              [...Array(6)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4"><Skeleton className="h-12 w-12 rounded" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-full" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-full" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-full" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-full" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-8 w-full" /></td>
                </tr>
              ))
            ) : paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-gray-500 text-lg">
                  {searchQuery ? "Không tìm thấy sản phẩm nào" : "Chưa có sản phẩm nào"}
                </td>
              </tr>
            ) : (
              paginatedProducts.map((product) => (
                <tr key={product._id}>
                  <td className="px-6 py-4">
                    <Image
                      src={product.image || "/placeholder.jpg"}
                      alt={product.name}
                      width={300}
                      height={200}
                      className="h-12 w-12 object-cover rounded bg-gray-100"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium truncate">{product.name}</td>
                  <td className="px-6 py-4 truncate">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
                  </td>
                  <td className="px-6 py-4 truncate">{getCategoryName(product.category)}</td>
                  <td className="px-6 py-4 text-center">{product.stock ?? 0}</td>
                  <td className="px-6 py-4 text-center flex justify-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => startEdit(product)}>
                      <Pencil className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(product._id)}>
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded border disabled:opacity-50"
              >
                Previous
              </button>
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
              .map((page, idx, arr) => (
                <PaginationItem key={page}>
                  {idx > 0 && page - arr[idx - 1] > 1 && <span className="px-2">...</span>}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded border ${currentPage === page ? "bg-gray-800 text-white" : "hover:bg-gray-100"}`}
                  >
                    {page}
                  </button>
                </PaginationItem>
              ))}

            <PaginationItem>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded border disabled:opacity-50"
              >
                Next
              </button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}