import { hello } from "../src/index";

describe("ProductAuthentication", () => {
  it("should hello", async () => {
    expect(hello()).toBe("Hello World");
  });
});
