import { ProductId, OrderId, CategoryId } from "../../shared/types/branded";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  OtpVerification: { phoneOrEmail: string };
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  ProductDetailsScreen: { productId: ProductId };
  CategoryProductsScreen: { categoryId: CategoryId; categoryName: string };
};

export type CategoriesStackParamList = {
  CategoriesScreen: undefined;
  CategoryProductsScreen: { categoryId: CategoryId; categoryName: string };
  ProductDetailsScreen: { productId: ProductId };
};

export type SearchStackParamList = {
  SearchScreen: undefined;
  SearchResultsScreen: { query: string };
  ProductDetailsScreen: { productId: ProductId };
};

export type CartStackParamList = {
  CartScreen: undefined;
  AddressSelectionScreen: undefined;
  DeliverySelectionScreen: undefined;
  PaymentSelectionScreen: undefined;
  OrderReviewScreen: undefined;
  OrderConfirmationScreen: { orderId: OrderId };
};

export type OrdersStackParamList = {
  OrderListScreen: undefined;
  OrderDetailsScreen: { orderId: OrderId };
  OrderTrackingScreen: { orderId: OrderId };
};

export type AccountStackParamList = {
  ProfileScreen: undefined;
  AddressListScreen: undefined;
  AddEditAddressScreen: { addressId?: string };
  WishlistScreen: undefined;
  ReviewListScreen: undefined;
  WriteReviewScreen: { productId: ProductId };
  SettingsScreen: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  CategoriesTab: undefined;
  SearchTab: undefined;
  CartTab: undefined;
  AccountTab: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  App: undefined;
};
