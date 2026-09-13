import App from "../src/app/App";
import { formatMoney, fromMajorUnits } from "../src/domain/pricing/money";

describe("Application Root Smoke Test", () => {
  it("should export App component successfully", () => {
    expect(App).toBeDefined();
  });

  it("should initialize domain pricing correctly at app bootstrap", () => {
    const money = fromMajorUnits(99.99, "USD");
    expect(formatMoney(money)).toBe("$99.99");
  });
});
