const { randomInt } = require("../random");

describe("random.js", () => {
  describe("randomInt", () => {
    it("should return a random integer between 1 and 100 on default", () => {
      const result = randomInt();

      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(100);
    });

    it("should return a random integer between 10 and 20", () => {
      const result = randomInt(10, 20);

      expect(result).toBeGreaterThanOrEqual(10);
      expect(result).toBeLessThanOrEqual(20);
    });

    it("should return a random integer between 1000 and 2000", () => {
      const result = randomInt(1000, 2000);

      expect(result).toBeGreaterThanOrEqual(1000);
      expect(result).toBeLessThanOrEqual(2000);
    });

    it("should return NaN on Infinity", () => {
      const result = randomInt(-Infinity, Infinity);

      expect(result).toBeNaN();
    });

    it("should throw an error if the minimum value is greater than the maximum value", () => {
      expect(() => randomInt(100, 10)).toThrow(
        "The minimum value cannot be greater than the maximum value."
      );
    });

    it("should throw an error if the value is not a number", () => {
      expect(() => randomInt("a", "b")).toThrow("The value must be a number.");
    });
  });
});
