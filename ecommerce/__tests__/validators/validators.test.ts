import { loginSchema, registerSchema, addressSchema, reviewSchema } from "../../src/shared/validators";

describe("Validation Schemas", () => {
  describe("loginSchema", () => {
    it("should validate correct login inputs", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "secretpassword",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const result = loginSchema.safeParse({
        email: "notanemail",
        password: "secretpassword",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("addressSchema", () => {
    it("should validate valid address input", () => {
      const result = addressSchema.safeParse({
        fullName: "Shakil Ahmed",
        phone: "+8801712345678",
        addressLine1: "House 42, Road 11",
        city: "Dhaka",
        state: "Dhaka",
        postalCode: "1213",
        country: "Bangladesh",
        type: "HOME",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("reviewSchema", () => {
    it("should validate rating between 1 and 5", () => {
      const valid = reviewSchema.safeParse({
        rating: 5,
        title: "Great product!",
        comment: "This product exceeded all my expectations.",
      });
      expect(valid.success).toBe(true);

      const invalid = reviewSchema.safeParse({
        rating: 6,
        title: "Bad rating",
        comment: "Too high",
      });
      expect(invalid.success).toBe(false);
    });
  });
});
