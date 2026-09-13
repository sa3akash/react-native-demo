import {
  createMoney,
  fromMajorUnits,
  toMajorUnits,
  formatMoney,
  addMoney,
  subtractMoney,
  multiplyMoney,
} from "../../src/domain/pricing/money";

describe("Money Financial Domain Calculations", () => {
  it("should create money correctly from minor units", () => {
    const money = createMoney(12999, "USD"); // $129.99
    expect(money.amount).toBe(12999);
    expect(money.currency).toBe("USD");
    expect(toMajorUnits(money)).toBe(129.99);
  });

  it("should convert from major units accurately", () => {
    const money = fromMajorUnits(1199.99, "USD");
    expect(money.amount).toBe(119999);
    expect(formatMoney(money)).toBe("$1,199.99");
  });

  it("should add money amounts without floating point errors", () => {
    const a = fromMajorUnits(10.15, "USD");
    const b = fromMajorUnits(20.35, "USD");
    const sum = addMoney(a, b);
    expect(sum.amount).toBe(3050);
    expect(formatMoney(sum)).toBe("$30.50");
  });

  it("should subtract money amounts cleanly", () => {
    const a = fromMajorUnits(100.00, "USD");
    const b = fromMajorUnits(25.50, "USD");
    const diff = subtractMoney(a, b);
    expect(diff.amount).toBe(7450);
    expect(formatMoney(diff)).toBe("$74.50");
  });

  it("should multiply money by scalar and round correctly", () => {
    const price = fromMajorUnits(19.99, "USD");
    const total = multiplyMoney(price, 3); // $59.97
    expect(total.amount).toBe(5997);
    expect(formatMoney(total)).toBe("$59.97");
  });
});
