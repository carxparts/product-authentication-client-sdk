// yarn run bulk_verify

import * as fs from "fs";
import xlsx from "node-xlsx";
import { ProductAuthentication } from "@carxparts/product-authentication-client";

// Parse a buffer
const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(`./sku.xlsx`));
const data = workSheetsFromBuffer[0].data;

const option = {
  userName: "", // your user name for the product authentication
  baseUrl: "", // your base url for the product authentication
};

const productAuth = new ProductAuthentication(option);

for (let index = 0; index < data.length; index++) {
  const element = data[index];
  const firstElement = element[0];
  console.log(firstElement);
  const productData = `${firstElement}`;

  const returnData = await productAuth.verify(productData);
  console.log(returnData);
}

console.log("DONE");
