import type {
  Address,
  Cart as ApiCart,
  PaymentConfirmation as ApiPaymentConfirmation,
  PaymentIntent as ApiPaymentIntent,
  Review as ApiReview,
  TaxEstimate,
  TaxEstimateSimple,
  User,
  UserAddress,
} from '@/lib/api/types';

export type FieldErrors<TFieldKey extends string = string> = Partial<Record<TFieldKey, string>>;

export interface ActionResult<TData = undefined, TFieldKey extends string = string> {
  success: boolean;
  data?: TData;
  error?: string;
  message?: string;
  fieldErrors?: FieldErrors<TFieldKey>;
  redirectTo?: string;
}

export type ActionState<TData = undefined, TFieldKey extends string = string> =
  | ActionResult<TData, TFieldKey>
  | null;

export type FormDataOrObject<T extends object> = FormData | T;

export type Cart = ApiCart;
export type Review = ApiReview;
export type PaymentIntent = ApiPaymentIntent;
export type PaymentConfirmation = ApiPaymentConfirmation;
export type TaxEstimateResult = TaxEstimate | TaxEstimateSimple;
export type ShippingAddress = Address;
export type UserProfile = User;
export type UserAddressList = UserAddress[];

export interface BillingAddress {
  street: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
}

export interface ReviewImage {
  id: string;
  src: string;
  alt?: string;
}

export interface CartCountData {
  count: number;
}

export interface CapturedCartEmailData {
  email: string;
}
