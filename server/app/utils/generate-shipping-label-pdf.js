import bwipjs from "bwip-js"; // For barcode generation
import { launchBrowser } from "./launch-browser.js";
import { getPaidStamp } from "./generate-invoice-pdf.js";
import path from "path";
import fs from "fs";

export const generateShippingLabelPDF = async (labelData, isPaid) => {
  let browser;

  const logoPath = path.join(process.cwd(), "assets/logo.png");
  const logoBase64 = fs.readFileSync(logoPath).toString("base64");
  const logoSrc = `data:image/png;base64,${logoBase64}`;

  const paidStampSrc = isPaid ? getPaidStamp() : null;

  try {
    browser = await launchBrowser();

    const page = await browser.newPage();

    // Generate barcode as base64
    let barcodeBase64 = "";
    try {
      const png = await bwipjs.toBuffer({
        bcid: "code128",
        text: labelData.orderNo,
        scale: 2,
        height: 10,
        includetext: true,
        textxalign: "center",
      });
      barcodeBase64 = png.toString("base64");
    } catch (err) {
      console.warn("Barcode generation failed:", err);
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: Arial, sans-serif; 
            background: white; 
            padding: 10px;
          }
          .label-container {
            width: 100%;
            max-width: 800px;
            background: white;
            border: 2px solid #000;
            padding: 20px;
            page-break-after: always;
          }

          /* Paid Stamp */
          .paid-stamp { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.3; z-index: 10; pointer-events: none; }
          .paid-stamp img { width: 400px; height: auto; }

          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
          }

          .header h1 {
            font-size: 24px;
            font-weight: bold;
            margin: 0;
          }

          .order-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }

          .info-section {
            border: 1px solid #000;
            padding: 15px;
          }

          .section-title {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 8px;
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
          }

          .address-block {
            font-size: 13px;
            line-height: 1.6;
            word-break: break-word;
          }

          .address-block .name {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 5px;
          }

          .address-line {
            margin: 2px 0;
          }

          .city-postal {
            font-weight: bold;
            font-size: 14px;
            margin-top: 5px;
          }

          .barcode-section {
            text-align: center;
            margin: 20px 0;
            border: 1px solid #000;
            padding: 10px;
            display: none
          }

          .barcode-section img {
            max-width: 100%;
            height: auto;
          }

          .order-number {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            margin: 10px 0;
          }

          .products-section {
            border: 1px solid #000;
            padding: 15px;
            margin-bottom: 20px;
          }

          .products-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }

          .products-table th {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
            font-weight: bold;
            background-color: #f0f0f0;
          }

          .products-table td {
            border: 1px solid #000;
            padding: 8px;
          }

          .product-desc {
            font-size: 13px;
          }

          .footer {
            text-align: center;
            font-size: 12px;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #000;
          }

          @media print {
            body { margin: 0; padding: 0; }
            .label-container { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="label-container">
         ${isPaid ? `<div class="paid-stamp"><img src="${paidStampSrc}" alt="Paid"></div>` : ""}
        
          <!-- Header -->
          <div class="header">
            <h1>SHIPPING LABEL</h1>
          </div>

          <!-- Addresses -->
          <div class="order-info">
            <!-- Delivery Address -->
            <div class="info-section">
              <div class="section-title">📍 SHIP TO</div>
              <div class="address-block">
                <div class="name">${labelData.customer.name}</div>
                ${labelData.customer.address
                  .map(
                    (line) => `<div class="address-line">${line || ""}</div>`
                  )
                  .join("")}
                <div class="city-postal">${labelData.customer.city}</div>
              </div>
            </div>

            <!-- Return Address -->
            <div class="info-section">
              <div class="section-title">↩️ RETURN TO</div>
              <div class="address-block">
                <div class="name">${labelData.returnAddress.name}</div>
                ${labelData.returnAddress.address
                  .map(
                    (line) => `<div class="address-line">${line || ""}</div>`
                  )
                  .join("")}
              </div>
            </div>
          </div>

          <!-- Barcode -->
          ${
            barcodeBase64
              ? `
          <div class="barcode-section">
            <img src="data:image/png;base64,${barcodeBase64}" alt="barcode">
          </div>
          `
              : ""
          }

          <!-- Order Number -->
          <div class="order-number">Order #${labelData.orderNo}</div>

          <!-- Products -->
          <div class="products-section">
            <div class="section-title">📦 ITEMS</div>
            <table class="products-table">
              <thead>
                <tr>
                  <th style="width: 70%;">Description</th>
                  <th style="width: 30%;">Qty</th>
                </tr>
              </thead>
              <tbody>
                ${labelData.products
                  .map(
                    (product) => `
                  <tr>
                    <td class="product-desc">${product.description}</td>
                    <td style="text-align: center;">${product.qty}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: { top: 10, right: 10, bottom: 10, left: 10 },
      printBackground: true,
    });

    return pdfBuffer;
  } finally {
    if (browser) await browser.close();
  }
};
