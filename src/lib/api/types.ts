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


//cart
export interface CartItem {
  product: Product
  quantity: number
  price: number
}

export interface Cart {
  _id: string
  user: string
  items: CartItem[]
  totalQuantity: number
  totalPrice: number
}

export interface OrderItem {
  product: string;       
  name: string;
  image: string;
  price: number;
  quantity: number;
}
export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  ward: string;
}

type PaymentMethod = "COD" | "VNPAY";

type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "shipping"
  | "completed"
  | "cancelled";

type CancelledBy = "user" | "employee" | "admin";
export interface Order {
  _id: string;

  user: string; 

  items: OrderItem[];

  shippingAddress: ShippingAddress;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  orderStatus: OrderStatus;

  handledBy?: string | null;

  confirmedAt?: string | null;
  preparingAt?: string | null;
  shippingAt?: string | null;
  completedAt?: string | null;

  cancelledBy?: CancelledBy | null;
  cancelReason?: string;
  cancelledAt?: string | null;

  shippingFee: number;
  discount: number;

  totalPrice: number;
  finalTotal: number;

  createdAt: string;
  updatedAt: string;
}

export interface Province {
  code: number
  name: string
  division_type: string
  codename: string
  phone_code: number
}

export interface Ward {
  code: number
  name: string
  division_type: string
  codename: string
  district_code: number  
}