// import { ProductAuthentication } from "../lib/js";
const { ProductAuthentication } = require("../lib/js");

(async () => {
  const option = {
    userName: "", // your user name for the product authentication
    baseUrl: "", // your base url for the product authentication
  };

  const pda = new ProductAuthentication(option);
  const data = await pda.verify("3fa85f64-5717-4562-b3fc-2c963f66afa6");
  console.log(data);
})();
