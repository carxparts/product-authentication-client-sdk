// yarn bulk_generate

import QRCode from "qrcode";
import fs from "fs";
import xlsx from "node-xlsx";
import path from "path";

function mkdirp(filepath) {
  var dirname = path.dirname(filepath);

  if (!fs.existsSync(dirname)) {
    mkdirp(dirname);
  }

  fs.mkdirSync(filepath);
}

const XLSX_PATH = "./sku.xlsx";

const QRCODE_IMG_DIR = "qrcode";
mkdirp(QRCODE_IMG_DIR); // making sure the directory exists

const BASE_URL =
  "https://www.hajeeautomobiles.com/product/auth"; // don't give the last slash

// Parse a buffer
const workSheetsFromBuffer = xlsx.parse(fs.readFileSync(XLSX_PATH));
const data = workSheetsFromBuffer[0].data;

const qropts = {
  errorCorrectionLevel: "H",
  type: "terminal",
  quality: 0.95,
  margin: 1,
  color: {
    dark: "#0148a2",
    light: "#FFF",
  },
};
for (let index = 0; index < data.length; index++) {
  const element = data[index];
  const firstElement = element[0];
  console.log(firstElement);
  const text = `${BASE_URL}/${firstElement}`;
  const fileName = `${QRCODE_IMG_DIR}/${firstElement}.png`;

  const qrcode = await QRCode.toDataURL(text, qropts);
  fs.writeFileSync(
    fileName,
    qrcode.replace(/^data:image\/png;base64,/, ""),
    "base64"
  );
}

console.log("DONE");

/* *
 * example code 2
 */

// import { toCanvas } from "qrcode";
// import fs from "fs";
// import pkg from "canvas";
// const { createCanvas, loadImage } = pkg;
// async function create(dataForQRcode, center_image, width, cwidth) {
//   const canvas = createCanvas(width, width);
//   toCanvas(canvas, dataForQRcode, {
//     errorCorrectionLevel: "H",
//     margin: 1,
//     color: {
//       dark: "#000000",
//       light: "#ffffff",
//     },
//   });

//   const ctx = canvas.getContext("2d");
//   const img = await loadImage(center_image);
//   const center = (width - cwidth) / 2;
//   ctx.drawImage(img, center, center, cwidth, cwidth);
//   return canvas.toDataURL("image/png");
// }

// const qrCode = await create(
//   "https://www.google.com/",
//   "https://firebasestorage.googleapis.com/v0/b/growthfilepractice.appspot.com/o/Logo.png?alt=media&token=209b47f8-d10b-454d-bbfe-627c9a43da0a&fbclid=IwAR1LIIa8Jfcl_AJH4YvWauNVH1E-TQDQ6DNCPcQoTHK_qxPLqSb2I330jww",
//   150,
//   50
// );

// fs.writeFileSync(
//   "./qrcode.png",
//   qrCode.replace(/^data:image\/png;base64,/, ""),
//   "base64"
// );

// console.log(qrCode);
