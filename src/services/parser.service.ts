import { ReceiptData } from '../types/receipt.js';
import { logger } from '../config/logger.js';

export class ReceiptParser {
  parse(rawText: string): ReceiptData {
    logger.info('[Parser] Parsing receipt data...');

    const data: ReceiptData = {
      rawText,
    };

    const totalMatch = rawText.match(/(?:total|monto total|neto|pagar)[:\s]*\$?\s?([\d,]+\.?\d*)/i);
    const subtotalMatch = rawText.match(/(?:subtotal|sub-total)[:\s]*\$?\s?([\d,]+\.?\d*)/i);
    const taxMatch = rawText.match(/(?:tax|iva|impuesto|itbms)[:\s]*\$?\s?([\d,]+\.?\d*)/i);
    const taxPercentMatch = rawText.match(/([\d.]+)%/);
    const lines = rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 3);
    const invoiceMatch = rawText.match(
      /(?:invoice|factura|recibo|ticket|inv)\s*[#:]?\s*([a-z0-9-]+)/i
    );
    const dateMatch = rawText.match(/(\d{1,4}[/-]\d{1,2}[/-]\d{1,4})/);

    if (totalMatch) {
      data.amount = parseFloat(totalMatch[1].replace(/,/g, ''));
    }
    if (subtotalMatch) {
      data.subtotalAmount = parseFloat(subtotalMatch[1].replace(/,/g, ''));
    }
    if (taxMatch) {
      data.taxAmount = parseFloat(taxMatch[1].replace(/,/g, ''));
    }
    if (taxPercentMatch) {
      data.taxPercentage = parseFloat(taxPercentMatch[1]);
    }
    if (lines.length > 0) {
      data.vendorName = lines[0];
    }
    if (invoiceMatch) {
      data.invoiceNumber = invoiceMatch[1];
    }
    if (dateMatch) {
      data.date = dateMatch[1];
    }
    return data;
  }
}
