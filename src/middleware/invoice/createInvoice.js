const fs = require("fs");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const path = require("path");
const vietnameseFontPath = path.join(__dirname, "font-times-new-roman.ttf");
function generateHeader(doc) {
  doc
    .image("src\\assets\\public\\logo.png", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("Laptop_TC Inc.", 110, 57)
    .fontSize(10)
    .text("Nam Định", 200, 65, { align: "right" })
    .moveDown();
}
function generateCustomerInformation(doc, invoice) {
  const shipping = invoice;
  doc
    .text(`Hóa đơn số: ${invoice.userId + Date()}`, 50, 200)
    .text(`Ngày khởi tạo hóa đơn: ${new Date()}`, 50, 215)
    .text(
      `Tổng tiền: ${invoice.total
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} VND`,
      50,
      130
    )

    .text(shipping.name, 300, 200)
    .text(`Phone: ${shipping.phone}`, 300, 130)
    .text(shipping.address, 300, 215)
    .moveDown();
}
function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
  doc
    .fontSize(10)
    .text(c1, 50, y)
    .text(c2, 150, y)
    .text(c3, 280, y, { width: 90, align: "right" })
    .text(c4, 370, y, { width: 90, align: "right" })
    .text(c5, 0, y, { align: "right" });
}
function generateInvoiceTable(doc, invoice) {
  let i,
    invoiceTableTop = 330;

  for (i = 0; i < invoice.listProduct.length; i++) {
    const item = invoice.listProduct[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      i,
      item.name,
      item.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "VND"
    );
  }
}
function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Payment is due within 15 days. Thank you for your business.",
      50,
      780,
      { align: "center", width: 500 }
    );
}
function createInvoice(invoice, path) {
  let doc = new PDFDocument({ margin: 50, font: vietnameseFontPath });
  doc.font(vietnameseFontPath);
  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);

  doc.end();
  doc.pipe(fs.createWriteStream(path));
  return "success";
}
async function sendEmailWithAttachment(invoice, path) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.AUTH_EMAIL_SEND_OTP,
        pass: process.env.AUTH_PASS_SEND_OTP,
      },
    });

    let mailOptions = {
      from: process.env.AUTH_EMAIL_SEND_OTP,
      to: invoice.email,
      subject: "Invoice",
      text: "Invoice",
      attachments: [
        {
          filename: `/invoice-pdf/hoa_don_${invoice.userId}.pdf`,
          path: path,
          contentType: "application/pdf",
        },
      ],
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
}

const createInvoiceAndSendEmail = async (req, res, next) => {
  try {
    const { userId, listProduct, name, email, phone, address, total } =
      req.body;
    const invoice = {
      userId,
      listProduct,
      name,
      email,
      phone,
      address,
      total,
    };
    const invoicePath = `./src/assets/invoicePDF/hoa_don_${userId}.pdf`;
    const create = createInvoice(invoice, invoicePath);
    if (create === "success") {
      await sendEmailWithAttachment(invoice, invoicePath);

      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Lỗi xử lý vui lòng thử lại sau" });
  }
};
module.exports = {
  createInvoice,
  createInvoiceAndSendEmail,
};
