import { i18n, SUPPORTED_LOCALES } from "../../src/core/i18n/i18n";
import { fromMajorUnits } from "../../src/domain/pricing/money";

describe("Enterprise i18n Engine", () => {
  it("should initialize with default English locale", () => {
    expect(i18n.getLocale()).toBe("en");
    expect(i18n.isRTL()).toBe(false);
  });

  it("should translate simple keys in English", () => {
    expect(i18n.t("common.appName")).toBe("Amazon Commerce");
    expect(i18n.t("common.addToCart")).toBe("Add to Cart");
  });

  it("should support parameter interpolation", () => {
    const text = i18n.t("common.seller", { name: "Apple Authorized" });
    expect(text).toBe("Seller: Apple Authorized");
  });

  it("should support pluralization rules", () => {
    const single = i18n.t("common.inStock", { count: 1 });
    expect(single).toContain("1 item left");

    const multiple = i18n.t("common.inStock", { count: 15 });
    expect(multiple).toContain("15 available");
  });

  it("should switch locale dynamically to Bengali and format RTL/LTR correctly", async () => {
    await i18n.setLocale("bn");
    expect(i18n.getLocale()).toBe("bn");
    expect(i18n.t("common.appName")).toBe("অ্যামাজন কমার্স");

    // Reset back to English
    await i18n.setLocale("en");
  });

  it("should format currency localized strings", () => {
    const money = fromMajorUnits(1299.99, "USD");
    const formatted = i18n.formatCurrency(money);
    expect(formatted).toBe("$1,299.99");
  });
});
