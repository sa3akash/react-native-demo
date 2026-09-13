import { Money, formatMoney as domainFormatMoney } from "../../domain/pricing/money";
import { logger } from "../logger/logger";
import { storageAdapter } from "../storage/storageAdapter";

export type SupportedLocale = "en" | "bn" | "es" | "ar" | "hi" | "ja" | "de";
export type TextDirection = "ltr" | "rtl";

export interface LocaleMetadata {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  direction: TextDirection;
  defaultCurrency: string;
  dateFormat: string;
}

export const SUPPORTED_LOCALES: Record<SupportedLocale, LocaleMetadata> = {
  en: { code: "en", name: "English", nativeName: "English", direction: "ltr", defaultCurrency: "USD", dateFormat: "MM/DD/YYYY" },
  bn: { code: "bn", name: "Bengali", nativeName: "বাংলা", direction: "ltr", defaultCurrency: "BDT", dateFormat: "DD/MM/YYYY" },
  es: { code: "es", name: "Spanish", nativeName: "Español", direction: "ltr", defaultCurrency: "EUR", dateFormat: "DD/MM/YYYY" },
  ar: { code: "ar", name: "Arabic", nativeName: "العربية", direction: "rtl", defaultCurrency: "SAR", dateFormat: "DD/MM/YYYY" },
  hi: { code: "hi", name: "Hindi", nativeName: "हिन्दी", direction: "ltr", defaultCurrency: "INR", dateFormat: "DD/MM/YYYY" },
  ja: { code: "ja", name: "Japanese", nativeName: "日本語", direction: "ltr", defaultCurrency: "JPY", dateFormat: "YYYY/MM/DD" },
  de: { code: "de", name: "German", nativeName: "Deutsch", direction: "ltr", defaultCurrency: "EUR", dateFormat: "DD.MM.YYYY" },
};

export type TranslationNamespace =
  | "common"
  | "nav"
  | "auth"
  | "cart"
  | "checkout"
  | "products"
  | "orders"
  | "profile"
  | "reviews"
  | "errors";

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

export type LocaleChangeListener = (locale: SupportedLocale, isRTL: boolean) => void;

class EnterpriseI18nEngine {
  private currentLocale: SupportedLocale = "en";
  private fallbackLocale: SupportedLocale = "en";
  private loadedBundles: Map<string, TranslationDictionary> = new Map();
  private listeners: Set<LocaleChangeListener> = new Set();
  private isInitialized = false;

  // Primary Synchronous Built-in Translations (Initial Boot Core Bundle)
  private static readonly coreTranslations: Record<SupportedLocale, Record<string, TranslationDictionary>> = {
    en: {
      common: {
        appName: "Amazon Commerce",
        search: "Search Amazon...",
        addToCart: "Add to Cart",
        buyNow: "Buy Now",
        checkout: "Proceed to Checkout",
        deliverTo: "Deliver to {location}",
        inStock: "In Stock ({count} available)",
        inStock_one: "Only 1 item left in stock - order soon",
        inStock_other: "In Stock ({count} available)",
        outOfStock: "Currently Unavailable",
        price: "Price",
        rating: "Rating",
        seller: "Seller: {name}",
        prime: "Prime",
        freeDelivery: "FREE Delivery by {date}",
        saveForLater: "Save for Later",
        retry: "Retry",
        save: "Save",
        cancel: "Cancel",
        loading: "Loading...",
      },
      nav: {
        home: "Home",
        categories: "Categories",
        search: "Search",
        cart: "Cart",
        account: "Account",
        orders: "Orders",
        wishlist: "Wishlist",
        settings: "Settings",
      },
      cart: {
        shoppingCart: "Shopping Cart",
        subtotal: "Subtotal ({count} items):",
        subtotal_one: "Subtotal (1 item):",
        subtotal_other: "Subtotal ({count} items):",
        taxEstimate: "Estimated Tax",
        shippingEstimate: "Shipping Fee",
        grandTotal: "Grand Total",
        proceedToCheckout: "Proceed to Checkout ({count} items)",
      },
      checkout: {
        stepAddress: "1. Shipping Address",
        stepDelivery: "2. Delivery Method",
        stepPayment: "3. Payment Method",
        stepReview: "4. Order Review",
        placeOrder: "Place Your Order",
      },
    },
    bn: {
      common: {
        appName: "অ্যামাজন কমার্স",
        search: "অ্যামাজনে খুঁজুন...",
        addToCart: "কার্টে যোগ করুন",
        buyNow: "এখনই কিনুন",
        checkout: "চেকআউট করুন",
        deliverTo: "ডেলিভারি: {location}",
        inStock: "স্টকে আছে ({count}টি উপলব্ধ)",
        inStock_one: "মাত্র ১টি স্টকে আছে - দ্রুত অর্ডার করুন",
        inStock_other: "স্টকে আছে ({count}টি উপলব্ধ)",
        outOfStock: "স্টকে নেই",
        price: "মূল্য",
        rating: "রেটিং",
        seller: "বিক্রেতা: {name}",
        prime: "প্রাইম",
        freeDelivery: "ফ্রি ডেলিভারি {date} এর মধ্যে",
        saveForLater: "পরে কেনার জন্য রাখুন",
        retry: "পুনরায় চেষ্টা করুন",
        save: "সংরক্ষণ",
        cancel: "বাতিল",
        loading: "লোড হচ্ছে...",
      },
      nav: {
        home: "হোম",
        categories: "ক্যাটাগরি",
        search: "সার্চ",
        cart: "কার্ট",
        account: "অ্যাকাউন্ট",
        orders: "অর্ডারসমূহ",
        wishlist: "উইশলিস্ট",
        settings: "সেটিংস",
      },
      cart: {
        shoppingCart: "শপিং কার্ট",
        subtotal: "মোট মূল্য ({count}টি আইটেম):",
        subtotal_one: "মোট মূল্য (১টি আইটেম):",
        subtotal_other: "মোট মূল্য ({count}টি আইটেম):",
        taxEstimate: "আনুমানিক ট্যাক্স",
        shippingEstimate: "ডেলিভারি চার্জ",
        grandTotal: "সর্বমোট",
        proceedToCheckout: "চেকআউট করুন ({count}টি আইটেম)",
      },
      checkout: {
        stepAddress: "১. ডেলিভারি ঠিকানা",
        stepDelivery: "২. ডেলিভারি পদ্ধতি",
        stepPayment: "৩. পেমেন্ট পদ্ধতি",
        stepReview: "৪. অর্ডার রিভিউ",
        placeOrder: "অর্ডার কনফার্ম করুন",
      },
    },
    es: {
      common: {
        appName: "Amazon Commerce",
        search: "Buscar en Amazon...",
        addToCart: "Agregar al carrito",
        buyNow: "Comprar ahora",
        checkout: "Proceder al pago",
        deliverTo: "Enviar a {location}",
        inStock: "En stock ({count} disponibles)",
        inStock_one: "Solo queda 1 en stock",
        inStock_other: "En stock ({count} disponibles)",
        outOfStock: "No disponible",
        price: "Precio",
        rating: "Calificación",
        seller: "Vendedor: {name}",
        prime: "Prime",
        freeDelivery: "Envío GRATIS el {date}",
        saveForLater: "Guardar para más tarde",
        retry: "Reintentar",
        save: "Guardar",
        cancel: "Cancelar",
        loading: "Cargando...",
      },
      nav: {
        home: "Inicio",
        categories: "Categorías",
        search: "Buscar",
        cart: "Carrito",
        account: "Cuenta",
        orders: "Pedidos",
        wishlist: "Deseos",
        settings: "Ajustes",
      },
      cart: {
        shoppingCart: "Carrito de compras",
        subtotal: "Subtotal ({count} productos):",
        subtotal_one: "Subtotal (1 producto):",
        subtotal_other: "Subtotal ({count} productos):",
        taxEstimate: "Impuesto estimado",
        shippingEstimate: "Costo de envío",
        grandTotal: "Total general",
        proceedToCheckout: "Proceder al pago ({count} productos)",
      },
      checkout: {
        stepAddress: "1. Dirección de envío",
        stepDelivery: "2. Método de envío",
        stepPayment: "3. Método de pago",
        stepReview: "4. Revisar pedido",
        placeOrder: "Realizar pedido",
      },
    },
    ar: {
      common: {
        appName: "أمازون كوميرس",
        search: "البحث في أمازون...",
        addToCart: "إضافة إلى العربة",
        buyNow: "الشراء الآن",
        checkout: "متابعة الشراء",
        deliverTo: "التوصيل إلى {location}",
        inStock: "متوفر ({count})",
        outOfStock: "غير متوفر حالياً",
        price: "السعر",
        rating: "التقييم",
        seller: "البائع: {name}",
        prime: "برايم",
        freeDelivery: "توصيل مجاني بحلول {date}",
        saveForLater: "حفظ لوقت لاحق",
        retry: "إعادة المحاولة",
        save: "حفظ",
        cancel: "إلغاء",
        loading: "جاري التحميل...",
      },
      nav: {
        home: "الرئيسية",
        categories: "الأقسام",
        search: "بحث",
        cart: "العربة",
        account: "حسابي",
        orders: "طلباتي",
        wishlist: "قائمة الأمنيات",
        settings: "الإعدادات",
      },
      cart: {
        shoppingCart: "عربة التسوق",
        subtotal: "المجموع الفرعي ({count} سلعة):",
        taxEstimate: "الضريبة المقدرة",
        shippingEstimate: "الشحن",
        grandTotal: "المجموع الإجمالي",
        proceedToCheckout: "متابعة الشراء ({count} سلعة)",
      },
      checkout: {
        stepAddress: "١. عنوان التوصيل",
        stepDelivery: "٢. طريقة التوصيل",
        stepPayment: "٣. طريقة الدفع",
        stepReview: "٤. مراجعة الطلب",
        placeOrder: "إتمام الطلب",
      },
    },
    hi: { common: {}, nav: {}, cart: {}, checkout: {} },
    ja: { common: {}, nav: {}, cart: {}, checkout: {} },
    de: { common: {}, nav: {}, cart: {}, checkout: {} },
  };

  constructor() {
    this.initFromStorage();
  }

  /**
   * Asynchronous Initialization restoring saved language preference from local storage
   */
  public async initFromStorage(): Promise<void> {
    try {
      const savedLocale = storageAdapter.getString("user_locale") as SupportedLocale | null;
      if (savedLocale && savedLocale in SUPPORTED_LOCALES) {
        this.currentLocale = savedLocale;
      }
      this.isInitialized = true;
      logger.info(`[i18n] Engine initialized with locale: ${this.currentLocale}`);
    } catch (error) {
      logger.error("[i18n] Failed to restore saved locale", error);
    }
  }

  /**
   * Change current active app locale dynamically
   */
  public async setLocale(locale: SupportedLocale): Promise<void> {
    if (!SUPPORTED_LOCALES[locale]) {
      logger.warn(`[i18n] Unsupported locale attempted: ${locale}`);
      return;
    }

    this.currentLocale = locale;
    storageAdapter.setString("user_locale", locale);

    const isRTL = this.isRTL();
    logger.info(`[i18n] Locale changed to ${locale} (RTL: ${isRTL})`);

    // Notify registered listeners
    this.listeners.forEach((listener) => listener(locale, isRTL));
  }

  public getLocale(): SupportedLocale {
    return this.currentLocale;
  }

  public getMetadata(): LocaleMetadata {
    return SUPPORTED_LOCALES[this.currentLocale] ?? SUPPORTED_LOCALES.en;
  }

  public isRTL(): boolean {
    return this.getMetadata().direction === "rtl";
  }

  public subscribe(listener: LocaleChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Main Translation Resolver with Pluralization & Interpolation
   */
  public t(keyPath: string, params?: Record<string, string | number>): string {
    const count = params?.count;

    // 1. Check for Pluralization suffix key if count is provided
    if (typeof count === "number") {
      const pluralSuffix = this.getPluralSuffix(count, this.currentLocale);
      const pluralKey = `${keyPath}_${pluralSuffix}`;
      const pluralResolved = this.resolveRawKey(pluralKey);
      if (pluralResolved) {
        return this.interpolate(pluralResolved, params);
      }
    }

    // 2. Resolve normal key
    const rawValue = this.resolveRawKey(keyPath);
    if (!rawValue) {
      // 3. Fallback to default locale
      const fallbackValue = this.resolveRawKeyFromLocale(keyPath, this.fallbackLocale);
      if (fallbackValue) {
        return this.interpolate(fallbackValue, params);
      }
      return keyPath;
    }

    return this.interpolate(rawValue, params);
  }

  private resolveRawKey(keyPath: string): string | null {
    return (
      this.resolveRawKeyFromLocale(keyPath, this.currentLocale) ??
      this.resolveRawKeyFromLoadedBundles(keyPath, this.currentLocale)
    );
  }

  private resolveRawKeyFromLocale(keyPath: string, locale: SupportedLocale): string | null {
    const localeDicts = EnterpriseI18nEngine.coreTranslations[locale];
    if (!localeDicts) return null;

    const parts = keyPath.split(".");
    let curr: unknown = localeDicts;

    for (const p of parts) {
      if (curr && typeof curr === "object" && p in curr) {
        curr = (curr as Record<string, unknown>)[p];
      } else {
        return null;
      }
    }

    return typeof curr === "string" ? curr : null;
  }

  private resolveRawKeyFromLoadedBundles(keyPath: string, locale: SupportedLocale): string | null {
    const bundleKey = `${locale}:${keyPath.split(".")[0]}`;
    const bundle = this.loadedBundles.get(bundleKey);
    if (!bundle) return null;

    const parts = keyPath.split(".").slice(1);
    let curr: unknown = bundle;

    for (const p of parts) {
      if (curr && typeof curr === "object" && p in curr) {
        curr = (curr as Record<string, unknown>)[p];
      } else {
        return null;
      }
    }

    return typeof curr === "string" ? curr : null;
  }

  /**
   * Cardinal Pluralization Suffix Resolver
   */
  private getPluralSuffix(count: number, locale: SupportedLocale): "zero" | "one" | "two" | "few" | "many" | "other" {
    try {
      const pr = new Intl.PluralRules(locale);
      return pr.select(count) as any;
    } catch {
      return count === 1 ? "one" : "other";
    }
  }

  /**
   * Parameter Interpolation ({key} replacement)
   */
  private interpolate(template: string, params?: Record<string, string | number>): string {
    if (!params) return template;
    let result = template;
    Object.entries(params).forEach(([pKey, pVal]) => {
      result = result.replace(new RegExp(`{\\s*${pKey}\\s*}`, "g"), String(pVal));
    });
    return result;
  }

  // --- Enterprise Localized Value Formatters ---

  /**
   * Localized Currency Formatter
   */
  public formatCurrency(money: Money): string {
    return domainFormatMoney(money);
  }

  /**
   * Localized Number Formatter (e.g. 1,000.00 vs 1.000,00)
   */
  public formatNumber(val: number, options?: Intl.NumberFormatOptions): string {
    try {
      return new Intl.NumberFormat(this.currentLocale, options).format(val);
    } catch {
      return val.toString();
    }
  }

  /**
   * Localized Date Formatter
   */
  public formatDate(date: Date | string | number, options?: Intl.DateTimeFormatOptions): string {
    try {
      const d = typeof date === "object" ? date : new Date(date);
      return new Intl.DateTimeFormat(this.currentLocale, options ?? { dateStyle: "medium" }).format(d);
    } catch {
      return String(date);
    }
  }
}

export const i18n = new EnterpriseI18nEngine();
export const t = (key: string, params?: Record<string, string | number>): string => i18n.t(key, params);
