import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";
import {
  COMPANY_NAME,
  COMPANY_ADDRESS,
  COMPANY_EMAIL,
  COMPANY_SUPPORT_CONTACT,
  COMPANY_GSTIN,
} from "../config/invoiceConfig.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONT_PATH = path.join(__dirname, "../assets/fonts/Geist-Regular.ttf");

// Disables ligature substitution (e.g. "fi" -> a single glyph) so copy-pasted/extracted
// text from the PDF stays correct (without this, "Profile" extracts as "Profle").
const NO_LIGATURES = { features: ["-liga", "-rlig", "-clig", "-dlig"] };

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function formatINR(amount) {
  return `Rs. ${Number(amount).toLocaleString("en-IN")}`;
}

/**
 * Writes a complete invoice into an already-created PDFDocument and ends it.
 * Caller owns the stream lifecycle (typically `doc.pipe(res)` before calling this).
 *
 * Uses a single embedded TTF (Geist Regular) for every piece of text, rather than
 * pdfkit's built-in "Helvetica"/"Helvetica-Bold". Those built-in fonts are NOT embedded
 * in the PDF — they're standard-14 references that each PDF viewer substitutes with its
 * own font (typically Arial on Windows). pdfkit measures text width against the real
 * Helvetica's metrics, but the viewer renders with the substitute font's slightly
 * different metrics — especially divergent between regular and bold weights — so
 * right-aligned columns can drift out of alignment depending on the viewer, even though
 * the underlying coordinate math is correct. Embedding one real font file makes the
 * measured width and the rendered glyphs come from the exact same data in every viewer,
 * which removes that drift entirely. Visual hierarchy is done with size/color instead of
 * a second (bold) weight, since only the regular weight is bundled.
 */
export function renderInvoicePdf(doc, { purchase, user }) {
  const left = 50;
  const right = 545;

  doc.registerFont("Body", FONT_PATH);
  doc.font("Body");

  // Right-aligns `text` (at the document's current font size/color) so its right edge
  // always lands exactly at `edge`. Safe because every text element in this document
  // uses the same embedded font, so widthOfString always matches the rendered glyphs.
  const drawRightEdge = (text, y, edge) => {
    const textWidth = doc.widthOfString(text, NO_LIGATURES);
    doc.text(text, edge - textWidth, y, { lineBreak: false, ...NO_LIGATURES });
  };
  const drawRight = (text, y) => drawRightEdge(text, y, right); // flush to the page margin
  const drawRightCol = (text, y) => drawRightEdge(text, y, right - 10); // table amount column
  const t = (text, x, y, opts = {}) => doc.text(text, x, y, { ...NO_LIGATURES, ...opts });

  // ── Header: wordmark + company block ────────────────────────────────────
  doc.fontSize(22).fillColor("#6366f1");
  t(COMPANY_NAME, left, 50);
  doc.fontSize(9).fillColor("#555555");
  t(COMPANY_ADDRESS, left, 78);
  t(COMPANY_EMAIL, left, 91);
  t(COMPANY_SUPPORT_CONTACT, left, 104);
  if (COMPANY_GSTIN) t(`GSTIN: ${COMPANY_GSTIN}`, left, 117);

  doc.fontSize(16).fillColor("#111111");
  drawRight("INVOICE", 50);
  doc.fontSize(10).fillColor("#333333");
  drawRight(`Invoice No: ${purchase.invoiceNumber}`, 75);
  drawRight(`Date: ${formatDate(purchase.createdAt)}`, 89);
  drawRight(`Payment Status: ${purchase.paymentStatus}`, 103);

  doc.moveTo(left, 140).lineTo(right, 140).strokeColor("#dddddd").stroke();

  // ── Billed to ────────────────────────────────────────────────────────────
  doc.fontSize(12).fillColor("#111111");
  t("Billed To", left, 155);
  doc.fontSize(10).fillColor("#333333");
  t(user.fullName, left, 172);
  t(user.email, left, 186);
  if (user.profile?.personal?.mobileNumber) {
    t(user.profile.personal.mobileNumber, left, 200);
  }

  // ── Line item table ──────────────────────────────────────────────────────
  let y = 240;
  doc.rect(left, y, right - left, 24).fill("#6366f1");
  doc.fontSize(10).fillColor("#ffffff");
  t("Description", left + 10, y + 7);
  drawRightCol("Amount", y + 7);
  y += 24;

  const row = (label, value, opts = {}) => {
    doc.fontSize(10).fillColor(opts.color || "#111111");
    t(label, left + 10, y);
    drawRightCol(value, y);
    y += 20;
  };

  row(`${purchase.courseTitle} (${purchase.courseTier})`, formatINR(purchase.originalPrice));
  if (purchase.couponCode) {
    row(`Coupon Applied: ${purchase.couponCode}`, `- ${formatINR(purchase.discountAmount)}`, { color: "#16a34a" });
  }
  if (purchase.gstAmount > 0) {
    row(`GST (${purchase.gstRate}%)`, formatINR(purchase.gstAmount));
  }

  doc.moveTo(left, y + 4).lineTo(right, y + 4).strokeColor("#dddddd").stroke();
  y += 14;

  doc.fontSize(13).fillColor("#111111");
  t("Total Paid", left + 10, y);
  drawRightCol(formatINR(purchase.finalAmount), y);
  y += 36;

  // ── Payment details ──────────────────────────────────────────────────────
  doc.fontSize(12).fillColor("#111111");
  t("Payment Details", left, y);
  y += 18;
  doc.fontSize(10).fillColor("#333333");
  t(`Razorpay Payment ID: ${purchase.razorpayPaymentId}`, left, y); y += 15;
  t(`Razorpay Order ID: ${purchase.razorpayOrderId}`, left, y); y += 15;
  t(`Purchase Date: ${formatDate(purchase.createdAt)}`, left, y);

  // ── Footer ───────────────────────────────────────────────────────────────
  doc.fontSize(8).fillColor("#999999");
  t(
    `This is a computer-generated invoice and does not require a signature. For support, contact ${COMPANY_SUPPORT_CONTACT} or ${COMPANY_EMAIL}.`,
    left,
    750,
    { width: right - left, align: "center" }
  );

  doc.end();
}
