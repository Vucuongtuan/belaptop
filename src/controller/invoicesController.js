const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const { exec } = require("child_process");
const { promisify } = require("util");
const { Invoice } = require("../models");
const nodemailer = require("nodemailer");
const execPromise = promisify(exec);
const otpGenerator = require("otp-generator");

const getInvoices = async (req, res) => {
  try {
    const { name, userId, total, phone, email, address, listProduct } =
      req.body;
  } catch (err) {
    console.error(err);
    return res.redirect("/invoices?error=1");
  }
};
const createToPdf = async (
  userId,
  total,
  name,
  phone,
  address,
  email,
  listProduct
) => {
  try {
    const invoice = {
      userId,
      total,
      name,
      phone,
      address,
      email,
      listProduct,
    };
    const ip = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    // Generate the PDF file
    const pdfPath = `./src/assets/invoicePDF/${userId}_${ip}.pdf`;

    // await fs.createWriteStream(path.dirname(pdfPath), {
    //   recursive: true,
    // });
    await generatePDF(invoice, pdfPath);

    // Save the invoice to the database
    const pdf = `${process.env.BASE_URL}/invoicePDF/${userId}_${ip}.pdf`;

    const a = await Invoice.create({
      userId,
      total,
      name,
      phone,
      address,
      email,
      pdf,
      listProduct,
    });
    const fileName = `${userId}_${ip}.pdf`;
    return await sendInvoiceEmail(a._id, email, name, fileName, pdf);
  } catch (err) {
    console.log("====================================");
    console.log(err);
    console.log("====================================");
  }
};
const sendInvoiceEmail = async (id, email, name, fileName, pdfUrl) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.AUTH_EMAIL_SEND_OTP,
        pass: process.env.AUTH_PASS_SEND_OTP,
      },
    });
    console.log("====================================");
    console.log(2);
    console.log("====================================");
    // const get = await Invoice.findOne({ _id: id });
    const mailOptions = {
      from: process.env.AUTH_EMAIL_SEND_OTP,
      to: email,
      subject: "Your Invoice",
      text: `Ấn vào link để xem hóa đơn: ${pdfUrl}`,
      //   attachments: [
      //     {
      //       filename: `${fileName}.pdf`,
      //       path: pdfUrl,
      //     },
      //   ],
    };

    return await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Error sending invoice email:", err);
    throw err;
  }
};
const generatePDF = (invoice, pdfPath) => {
  new Promise((resolve, reject) => {
    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(18).text(`Invoice for ${invoice.name}`);
    doc.moveDown();

    invoice.listProduct.forEach((item, index) => {
      doc
        .fontSize(14)
        .text(
          `${index + 1} . ${item.name} - $${
            typeof item.total === "string"
              ? `${item.total.replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND`
              : `${item.total
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND`
          }`
        );
    });

    doc.moveDown();
    doc
      .fontSize(16)
      .text(
        `Total: ${invoice.total
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} VND`
      );

    doc.end();
    doc.on("finish", resolve);

    doc.on("error", reject);
  });
  return;
};
module.exports = { getInvoices, createToPdf };
