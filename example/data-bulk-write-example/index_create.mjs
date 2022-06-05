// yarn run bulk_create

import * as fs from "fs";
import xlsx from "node-xlsx";
import { ProductAuthentication } from "@carxparts/product-authentication-client";

// Parse a buffer
const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`./sku.xlsx`));
const data = workSheetsFromBuffer[0].data;

const option = {
  baseUrl: "", // your base url for the product authentication
  apiKey: "", // apiKey
};

const productAuth = new ProductAuthentication(option);

for (let index = 0; index < data.length; index++) {
  const element = data[index];
  const firstElement = element[0];
  console.log(`${index + 1}--${firstElement}`);
  const productData = {
    id: `${firstElement}`,
    metadata: {},
    verificationOptions: {
      min: 0,
      max: 20,
      current: 0,
    },
  };

  const returnData = await productAuth.create(productData);
  console.log(returnData);
}

console.log("DONE");
