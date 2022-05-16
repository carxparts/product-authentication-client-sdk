# Introduction

Product authentication client package for verifying the authorized product

# How to install

```bash
npm install @carxparts/product-authentication-client
or
yarn add @carxparts/product-authentication-client
```

# Example

## CommonJS/ES6 Uses

```js
// import { ProductAuthenticationClient } from '@carxparts/product-authentication-client';
const {
  ProductAuthentication,
} = require("@carxparts/product-authentication-client");

(async () => {
  const option = {
    userName: "", // your user name for the product authentication
    baseUrl: "", // your base url for the product authentication
  };

  const pda = new ProductAuthentication(option);
  const data = await pda.verify("3fa85f64-5717-4562-b3fc-2c963f66afa6");
  console.log(data);
})();
```

## HTML Uses

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="[script-link]"></script>
  </head>
  <body>
    <h1>Test Html</h1>
  </body>
  <script>
    const option = {
      userName: "", // this is required
      baseUrl: "", // this is required
    };

    const pda = new carxparts.ProductAuthentication(option);
    pda
      .verify("3fa85f64-5717-4562-b3fc-2c963f66afa6")
      .then((response) => {
        console.log("response", response);
      })
      .catch((error) => {
        console.error("catch error", error);
      });
  </script>
</html>
```
