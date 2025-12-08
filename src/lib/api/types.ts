export type ApiResponse<T = void> =
  | { success: true; message: string; data: T }
  | { success: false; message: string; data?: undefined };

export type UserRole = "user" | "employee" | "admin";


//auth
export interface DecodedToken {
  sub: string;
  role: UserRole;
  exp: number;
  iat?: number;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface SendOTPDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  password: string;
  otp: number;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  message?: string;
}

// admin
//employee
export interface CreateEmployeeDto {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface Employee {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  role: "employee";
  createdBy?: string;
}

// category

export interface Category {
  _id: string;
  name: string;
  description?: string;

}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

// food
// types/product.ts
export interface CategoryRef {
  _id: string
  name: string
}

export interface Product {
  _id: string
  name: string
  price: number
  image: string
  description: string
  category: string | CategoryRef
  stock: number

}

export interface CreateProductDto {
  name: string
  price: number
  description: string
  category: string
  stock: number
  image: File 
}

export interface UpdateProductDto {
  name?: string
  price?: number
  description?: string
  category?: string
  stock?: number
  image?: File | null 
}
