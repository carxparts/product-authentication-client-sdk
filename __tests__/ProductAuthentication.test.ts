import { ProductAuthentication } from "../src/index";

// before test you need to initialize this values
const BASE_URL = "";
const USERNAME = "";
const API_KEY = "";

describe("ProductAuthentication", () => {
  it("should be defined", () => {
    expect(ProductAuthentication).toBeDefined();
  });

  it("should not verify product because username is empty", async () => {
    const option = {
      baseUrl: BASE_URL,
      userName: "",
    };
    const productAuthenticationDefinition = new ProductAuthentication(option);
    await expect(
      productAuthenticationDefinition.verify("product_id")
    ).rejects.toThrow("User Name is required");
  });

  it("should not verify product because base url is empty", async () => {
    const option = {
      baseUrl: "",
      userName: "testUserName",
    };
    const productAuthenticationDefinition = new ProductAuthentication(option);
    await expect(
      productAuthenticationDefinition.verify("product_id")
    ).rejects.toThrow("Base Url is required");
  });

  it("should not verify product because base url is not valid", async () => {
    const option = {
      baseUrl: "sadasdasdwasd",
      userName: "testUserName",
    };
    const productAuthenticationDefinition = new ProductAuthentication(option);
    await expect(
      productAuthenticationDefinition.verify("product_id")
    ).rejects.toThrow("Base Url is not valid");
  });

  it("should not verify product because base url does not have protocol", async () => {
    const option = {
      baseUrl: "example.com/prod",
      userName: "testUserName",
    };
    const productAuthenticationDefinition = new ProductAuthentication(option);
    await expect(
      productAuthenticationDefinition.verify("product_id")
    ).rejects.toThrow(
      "Base Url is not valid. Example: https://example.com/prod"
    );
  });

  it("should not verify product because username & product id not valid", async () => {
    const option = {
      baseUrl: BASE_URL,
      userName: "testUserName",
    };
    const productAuthenticationDefinition = new ProductAuthentication(option);
    const result = await productAuthenticationDefinition.verify("product_id");

    // sample output
    // {
    //   success: false,
    //   message: 'Product is not genuine',
    //   data: { errorCode: 101, message: 'PRODUCT_NOT_FOUND', details: [] }
    // }
    expect(result.success).toBe(false);
    expect(result.message).toBe("Product is not genuine");
  });

  it("should not create product because api key not given", async () => {
    const option = {
      baseUrl: BASE_URL,
      apiKey: "",
    };

    const insertedData = {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    };

    const productAuthenticationDefinition = new ProductAuthentication(option);
    await expect(
      productAuthenticationDefinition.create(insertedData)
    ).rejects.toThrow("Api key is required");
  });

  it("should not create product because not valid api key", async () => {
    const option = {
      baseUrl: BASE_URL,
      apiKey: "testApiKey",
    };

    const insertedData = {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    };

    const productAuthenticationDefinition = new ProductAuthentication(option);
    const result = await productAuthenticationDefinition.create(insertedData);

    // sample output
    // { success: false, message: 'Forbidden', data: {} }

    expect(result.success).toBe(false);
    expect(result.message).toBe("Forbidden");
  });

  it("should create product", async () => {
    const option = {
      baseUrl: BASE_URL,
      apiKey: API_KEY,
    };

    const insertedData = {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    };

    const productAuthenticationDefinition = new ProductAuthentication(option);
    const result = await productAuthenticationDefinition.create(insertedData);

    // sample output
    // {
    //   success: true,
    //   message: 'Product created successfully',
    //   data: { message: 'Created successfully' }
    // }

    expect(result.success).toBe(true);
    expect(result.message).toBe("Product created successfully");
  });

  it("should create/update product with options value", async () => {
    const option = {
      baseUrl: BASE_URL,
      apiKey: API_KEY,
    };

    const insertedData = {
      id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      verificationOptions: {
        min: 1,
        max: 10,
        current: 9,
      },
    };

    const productAuthenticationDefinition = new ProductAuthentication(option);
    const result = await productAuthenticationDefinition.create(insertedData);

    // sample output
    // {
    //   success: true,
    //   message: 'Product created successfully',
    //   data: { message: 'Created successfully' }
    // }

    expect(result.success).toBe(true);
    expect(result.message).toBe("Product created successfully");
  });

  it("should verify product", async () => {
    const option = {
      baseUrl: BASE_URL,
      userName: USERNAME,
    };
    const productAuthenticationDefinition = new ProductAuthentication(option);
    const result = await productAuthenticationDefinition.verify(
      "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    );

    // sample output
    // {
    //   success: true,
    //   message: 'Product is genuine',
    //   data: {
    //     message: 'SUCCESS',
    //     metadata: { createdAt: 1652002466598, name: 'test' }
    //   }
    // }

    expect(result.success).toBe(true);
    expect(result.message).toBe("Product is genuine");
  });

  it("should not verify product because maximum validation reached", async () => {
    const option = {
      baseUrl: BASE_URL,
      userName: USERNAME,
    };
    const productAuthenticationDefinition = new ProductAuthentication(option);
    const result = await productAuthenticationDefinition.verify(
      "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    );

    // sample output
    // {
    //   success: false,
    //   message: 'Product verification maximum limit reached',
    //   data: { errorCode: 102, message: 'MAX_LIMIT_EXCEEDED', details: [] }
    // }

    expect(result.success).toBe(false);
    expect(result.message).toBe("Product verification maximum limit reached");
  });
});
