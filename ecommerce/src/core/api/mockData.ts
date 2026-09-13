import {
  ProductId,
  UserId,
  OrderId,
  CategoryId,
  SellerId,
  AddressId,
  ReviewId,
  toProductId,
  toUserId,
  toOrderId,
  toCategoryId,
  toSellerId,
  toAddressId,
  toReviewId,
} from "../../shared/types/branded";
import { fromMajorUnits, Money } from "../../domain/pricing/money";

export interface ProductVariant {
  id: string;
  sku: string;
  attributes: Record<string, string>; // e.g. { Color: "Titanium Black", Storage: "256GB" }
  price: Money;
  originalPrice: Money;
  stock: number;
  images: string[];
  availabilityStatus: "in_stock" | "low_stock" | "out_of_stock";
}

export interface Product {
  id: ProductId;
  title: string;
  brand: string;
  categoryId: CategoryId;
  sellerId: SellerId;
  sellerName: string;
  sellerRating: number;
  rating: number;
  reviewCount: number;
  price: Money;
  originalPrice: Money;
  discountPercentage: number;
  isPrime: boolean;
  isDeal: boolean;
  stock: number;
  images: string[];
  thumbnail: string;
  description: string;
  highlights: string[];
  specifications: Record<string, string>;
  warrantyInfo: string;
  returnPolicy: string;
  variants?: ProductVariant[];
  attributes?: Record<string, string[]>; // e.g. { Color: ["Black", "White"], Storage: ["128GB", "256GB"] }
  emiAvailable: boolean;
  emiStartingPrice?: Money;
}

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  image: string;
  itemCount: number;
  parentId?: CategoryId;
}

export interface UserAddress {
  id: AddressId;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  type: "HOME" | "WORK" | "OTHER";
}

export interface OrderItem {
  productId: ProductId;
  productTitle: string;
  productImage: string;
  variantAttributes?: Record<string, string>;
  unitPrice: Money;
  quantity: number;
  sellerId: SellerId;
  sellerName: string;
}

export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderTimelineStep {
  status: OrderStatus;
  label: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: OrderId;
  userId: UserId;
  items: OrderItem[];
  subtotal: Money;
  tax: Money;
  shippingFee: Money;
  discount: Money;
  grandTotal: Money;
  status: OrderStatus;
  shippingAddress: UserAddress;
  paymentMethod: string;
  createdAt: string;
  estimatedDeliveryDate: string;
  timeline: OrderTimelineStep[];
}

export interface Review {
  id: ReviewId;
  productId: ProductId;
  userId: UserId;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
}

// MOCK CATEGORIES
export const MOCK_CATEGORIES: Category[] = [
  {
    id: toCategoryId("cat_1"),
    name: "Electronics",
    icon: "laptop-outline",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80",
    itemCount: 1420,
  },
  {
    id: toCategoryId("cat_2"),
    name: "Mobiles & Tablets",
    icon: "phone-portrait-outline",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
    itemCount: 890,
  },
  {
    id: toCategoryId("cat_3"),
    name: "Fashion & Apparel",
    icon: "shirt-outline",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=80",
    itemCount: 3200,
  },
  {
    id: toCategoryId("cat_4"),
    name: "Home & Kitchen",
    icon: "home-outline",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&q=80",
    itemCount: 2100,
  },
  {
    id: toCategoryId("cat_5"),
    name: "Beauty & Personal Care",
    icon: "sparkles-outline",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&q=80",
    itemCount: 1750,
  },
  {
    id: toCategoryId("cat_6"),
    name: "Books & Stationeries",
    icon: "book-outline",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&q=80",
    itemCount: 940,
  },
];

// MOCK PRODUCTS
export const MOCK_PRODUCTS: Product[] = [
  {
    id: toProductId("prod_1"),
    title: "Apple iPhone 16 Pro Max (256 GB) - Natural Titanium",
    brand: "Apple",
    categoryId: toCategoryId("cat_2"),
    sellerId: toSellerId("seller_apple"),
    sellerName: "Apple Authorized Store",
    sellerRating: 4.9,
    rating: 4.8,
    reviewCount: 3420,
    price: fromMajorUnits(1199.99),
    originalPrice: fromMajorUnits(1299.99),
    discountPercentage: 8,
    isPrime: true,
    isDeal: true,
    stock: 45,
    thumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80",
    ],
    description: "iPhone 16 Pro Max. Forged in titanium and featuring the groundbreaking A18 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
    highlights: [
      "FORGED IN TITANIUM — iPhone 16 Pro Max has a strong and light aerospace-grade titanium design.",
      "ADVANCED DISPLAY — The 6.9-inch Super Retina XDR display with ProMotion ramps up refresh rates to 120Hz.",
      "GAME-CHANGING A18 PRO CHIP — A Pro-class GPU makes mobile games feel so immersive.",
      "POWERFUL PRO CAMERA SYSTEM — 48MP Main camera with 5x Telephoto optical zoom.",
    ],
    specifications: {
      Display: "6.9-inch Super Retina XDR OLED",
      Processor: "A18 Pro chip with 6-core GPU",
      "Main Camera": "48MP Fusion Camera",
      Battery: "Up to 33 hours video playback",
      "Connector Type": "USB-C (supports USB 3)",
    },
    warrantyInfo: "1 Year Apple Care Limited Warranty",
    returnPolicy: "7 Days Replacement Guarantee",
    attributes: {
      Color: ["Natural Titanium", "Desert Titanium", "Black Titanium", "White Titanium"],
      Storage: ["256GB", "512GB", "1TB"],
    },
    variants: [
      {
        id: "var_1_1",
        sku: "IP16PM-256-NAT",
        attributes: { Color: "Natural Titanium", Storage: "256GB" },
        price: fromMajorUnits(1199.99),
        originalPrice: fromMajorUnits(1299.99),
        stock: 25,
        images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80"],
        availabilityStatus: "in_stock",
      },
      {
        id: "var_1_2",
        sku: "IP16PM-512-NAT",
        attributes: { Color: "Natural Titanium", Storage: "512GB" },
        price: fromMajorUnits(1399.99),
        originalPrice: fromMajorUnits(1499.99),
        stock: 12,
        images: ["https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80"],
        availabilityStatus: "in_stock",
      },
      {
        id: "var_1_3",
        sku: "IP16PM-1TB-BLK",
        attributes: { Color: "Black Titanium", Storage: "1TB" },
        price: fromMajorUnits(1599.99),
        originalPrice: fromMajorUnits(1699.99),
        stock: 5,
        images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80"],
        availabilityStatus: "low_stock",
      },
    ],
    emiAvailable: true,
    emiStartingPrice: fromMajorUnits(99.99),
  },
  {
    id: toProductId("prod_2"),
    title: "Sony WH-1000XM5 Wireless Industry Leading Noise Canceling Headphones",
    brand: "Sony",
    categoryId: toCategoryId("cat_1"),
    sellerId: toSellerId("seller_sony"),
    sellerName: "Sony Official Store",
    sellerRating: 4.8,
    rating: 4.7,
    reviewCount: 1890,
    price: fromMajorUnits(348.00),
    originalPrice: fromMajorUnits(399.99),
    discountPercentage: 13,
    isPrime: true,
    isDeal: true,
    stock: 120,
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
    ],
    description: "Industry-leading noise cancellation optimized to you. Magnificent sound quality engineered to perfection with HD Noise Canceling Processor QN1.",
    highlights: [
      "Industry-leading noise cancellation with 8 microphones and Auto NC Optimizer",
      "Magnificent sound quality, engineered to perfection with the new Integrated Processor V1",
      "Crystal clear hands-free calling with 4 beamforming microphones",
      "Up to 30-hour battery life with quick charging (3 min charge for 3 hours of playback)",
    ],
    specifications: {
      "Battery Life": "30 Hours",
      "Noise Cancellation": "Active Noise Cancelling (ANC)",
      Weight: "250g",
      Bluetooth: "Version 5.2",
    },
    warrantyInfo: "1 Year Sony Warranty",
    returnPolicy: "14 Days Return Policy",
    attributes: {
      Color: ["Black", "Silver", "Midnight Blue"],
    },
    emiAvailable: true,
    emiStartingPrice: fromMajorUnits(29.00),
  },
  {
    id: toProductId("prod_3"),
    title: "Apple MacBook Pro 16-inch M3 Max (36GB RAM, 1TB SSD) - Space Black",
    brand: "Apple",
    categoryId: toCategoryId("cat_1"),
    sellerId: toSellerId("seller_apple"),
    sellerName: "Apple Authorized Store",
    sellerRating: 4.9,
    rating: 4.9,
    reviewCount: 950,
    price: fromMajorUnits(3499.00),
    originalPrice: fromMajorUnits(3699.00),
    discountPercentage: 5,
    isPrime: true,
    isDeal: false,
    stock: 18,
    thumbnail: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
    ],
    description: "The 16-inch MacBook Pro blast ahead with M3 Max, an monstrously advanced chip that brings massive performance and capability for demanding workflows.",
    highlights: [
      "SUPERCHARGED BY M3 MAX — 14-core CPU and 30-core GPU for insane rendering speed",
      "UP TO 22 HOURS BATTERY LIFE — Go all day thanks to the power-efficient design of Apple silicon",
      "BRILLIANT PRO DISPLAY — The 16.2-inch Liquid Retina XDR display features Extreme Dynamic Range",
    ],
    specifications: {
      Processor: "Apple M3 Max 14-Core",
      RAM: "36GB Unified Memory",
      Storage: "1TB Superfast SSD",
      Display: "16.2\" Liquid Retina XDR 120Hz",
    },
    warrantyInfo: "1 Year Apple Limited Warranty",
    returnPolicy: "7 Days Replacement Guarantee",
    emiAvailable: true,
    emiStartingPrice: fromMajorUnits(291.00),
  },
  {
    id: toProductId("prod_4"),
    title: "Samsung Galaxy S24 Ultra 5G AI Smartphone (512GB) - Titanium Gray",
    brand: "Samsung",
    categoryId: toCategoryId("cat_2"),
    sellerId: toSellerId("seller_samsung"),
    sellerName: "Samsung Official Flagship",
    sellerRating: 4.8,
    rating: 4.7,
    reviewCount: 2100,
    price: fromMajorUnits(1299.99),
    originalPrice: fromMajorUnits(1419.99),
    discountPercentage: 8,
    isPrime: true,
    isDeal: true,
    stock: 60,
    thumbnail: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
    ],
    description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, unleash whole new levels of creativity, productivity and possibility.",
    highlights: [
      "Circle to Search with Google — Effortlessly look up anything on screen without switching apps",
      "200MP Camera System with ProVisual Engine for astounding low light detail",
      "Built-in S Pen lets you write, tap and navigate with precision",
    ],
    specifications: {
      Display: "6.8\" Dynamic AMOLED 2X 120Hz",
      Processor: "Snapdragon 8 Gen 3 for Galaxy",
      "Main Camera": "200MP + 50MP + 12MP + 10MP",
      Battery: "5000mAh Super Fast Charging",
    },
    warrantyInfo: "1 Year Samsung Warranty",
    returnPolicy: "7 Days Replacement Guarantee",
    emiAvailable: true,
    emiStartingPrice: fromMajorUnits(108.00),
  },
  {
    id: toProductId("prod_5"),
    title: "Nike Air Max 270 Men's Running Shoes - Black/White",
    brand: "Nike",
    categoryId: toCategoryId("cat_3"),
    sellerId: toSellerId("seller_nike"),
    sellerName: "Nike Direct Outlet",
    sellerRating: 4.7,
    rating: 4.6,
    reviewCount: 1420,
    price: fromMajorUnits(149.99),
    originalPrice: fromMajorUnits(170.00),
    discountPercentage: 12,
    isPrime: true,
    isDeal: false,
    stock: 85,
    thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    ],
    description: "Nike's first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270. The design draws inspiration from Air Max icons.",
    highlights: [
      "Large Max Air unit delivers responsive cushioning",
      "Neoprene stretch bootie structure creates a snug fit",
      "Durable rubber outsole provides excellent traction",
    ],
    specifications: {
      Material: "Knit Mesh upper",
      Sole: "Rubber with Max Air Unit",
      Closure: "Lace-up",
    },
    warrantyInfo: "6 Months Brand Warranty",
    returnPolicy: "30 Days Easy Return",
    attributes: {
      Size: ["8", "9", "10", "11"],
      Color: ["Red/Black", "White/Black"],
    },
    emiAvailable: false,
  },
];

// MOCK ADDRESSES
export const MOCK_ADDRESSES: UserAddress[] = [
  {
    id: toAddressId("addr_1"),
    fullName: "Shakil Ahmed",
    phone: "+880 1712 345678",
    addressLine1: "House 42, Road 11, Block D",
    addressLine2: "Banani",
    city: "Dhaka",
    state: "Dhaka Division",
    postalCode: "1213",
    country: "Bangladesh",
    isDefault: true,
    type: "HOME",
  },
  {
    id: toAddressId("addr_2"),
    fullName: "Shakil Ahmed (Work)",
    phone: "+880 1819 987654",
    addressLine1: "Tech Tower, Level 8, Gulshan Avenue",
    city: "Dhaka",
    state: "Dhaka Division",
    postalCode: "1212",
    country: "Bangladesh",
    isDefault: false,
    type: "WORK",
  },
];

// MOCK REVIEWS
export const MOCK_REVIEWS: Review[] = [
  {
    id: toReviewId("rev_1"),
    productId: toProductId("prod_1"),
    userId: toUserId("user_101"),
    userName: "Alex Johnson",
    rating: 5,
    title: "Incredible battery life and blazing speed!",
    comment: "Upgraded from iPhone 13 Pro. The camera and battery performance are night and day. The Natural Titanium color looks super sleek in person.",
    createdAt: "2026-07-28",
    isVerifiedPurchase: true,
    helpfulCount: 42,
  },
  {
    id: toReviewId("rev_2"),
    productId: toProductId("prod_1"),
    userId: toUserId("user_102"),
    userName: "Sarah Miller",
    rating: 5,
    title: "Best mobile camera system bar none",
    comment: "The 5x optical zoom lens takes breathtaking landscape and portrait shots. Worth every single cent.",
    createdAt: "2026-08-01",
    isVerifiedPurchase: true,
    helpfulCount: 18,
  },
];

// MOCK ORDERS
export const MOCK_ORDERS: Order[] = [
  {
    id: toOrderId("ord_1001"),
    userId: toUserId("usr_active"),
    items: [
      {
        productId: toProductId("prod_2"),
        productTitle: "Sony WH-1000XM5 Wireless Headphones",
        productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        unitPrice: fromMajorUnits(348.00),
        quantity: 1,
        sellerId: toSellerId("seller_sony"),
        sellerName: "Sony Official Store",
      },
    ],
    subtotal: fromMajorUnits(348.00),
    tax: fromMajorUnits(17.40),
    shippingFee: fromMajorUnits(0),
    discount: fromMajorUnits(0),
    grandTotal: fromMajorUnits(365.40),
    status: "OUT_FOR_DELIVERY",
    shippingAddress: MOCK_ADDRESSES[0]!,
    paymentMethod: "Credit Card (Visa ending 4242)",
    createdAt: "2026-08-07T10:30:00Z",
    estimatedDeliveryDate: "2026-08-10",
    timeline: [
      { status: "PLACED", label: "Order Placed", timestamp: "Aug 07, 10:30 AM", completed: true, current: false },
      { status: "CONFIRMED", label: "Order Confirmed", timestamp: "Aug 07, 11:15 AM", completed: true, current: false },
      { status: "PACKED", label: "Packed & Prepared", timestamp: "Aug 08, 02:00 PM", completed: true, current: false },
      { status: "SHIPPED", label: "In Transit with Courier", timestamp: "Aug 09, 08:30 AM", completed: true, current: false },
      { status: "OUT_FOR_DELIVERY", label: "Out for Delivery", timestamp: "Aug 09, 02:15 PM", completed: true, current: true },
      { status: "DELIVERED", label: "Delivered", completed: false, current: false },
    ],
  },
];
