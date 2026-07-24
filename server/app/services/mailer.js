import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import ejs from "ejs";
import config from "../config/index.js";

// Create transporter using Brevo SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.mailrcld.com",
  port: 587,
  secure: false,
  auth: {
    user: config.smtp_user,
    pass: config.smtp_password,
  },
});

async function sendResetPasswordEmail(userEmail, token) {
  try {
    const templatePath = path.join(
      process.cwd(),
      "views",
      "forgot-password.ejs"
    );
    const templateString = fs.readFileSync(templatePath, "utf-8");
    const resetLink = `https://bdseducation.in/reset-password?t=${token}`;
    const htmlContent = ejs.render(templateString, {
      resetLink,
    });

    const mailOptions = {
      // from: config.smtp_from_email,
      from: '"Bds Education" <no-reply@bdseducation.in>',
      to: userEmail,
      subject: "Reset Your Password – BDS Education",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully!");
    return info;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}

async function sendResetUsernameEmail(userEmail, token) {
  try {
    const templatePath = path.join(
      process.cwd(),
      "views",
      "forgot-username.ejs"
    );
    const templateString = fs.readFileSync(templatePath, "utf-8");
    const resetLink = `https://bdseducation.in/reset-username?t=${token}`;
    const htmlContent = ejs.render(templateString, {
      resetLink,
    });

    const mailOptions = {
      // from: config.smtp_from_email,
      from: '"Bds Education" <no-reply@bdseducation.in>',
      to: userEmail,
      subject: "Reset Your Username – BDS Education",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Username reset email sent successfully!");
    return info;
  } catch (error) {
    console.error("Error sending Username reset email:", error);
    throw error;
  }
}

async function sendContactInquiryEmail(userEmail, inquiryData) {
  try {
    const templatePath = path.join(
      process.cwd(),
      "views",
      "contact-inquiry.ejs"
    );
    const templateString = fs.readFileSync(templatePath, "utf-8");

    const submittedDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const htmlContent = ejs.render(templateString, {
      name: inquiryData.name,
      email: inquiryData.email,
      phone: inquiryData.phone,
      message: inquiryData.message,
      submittedDate,
    });

    const mailOptions = {
      from: '"BDS Education" <no-reply@bdseducation.in>',
      to: userEmail,
      subject: "We Received Your Contact Inquiry – BDS Education",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Contact inquiry confirmation email sent successfully!");
    return info;
  } catch (error) {
    console.error("Error sending contact inquiry email:", error);
    throw error;
  }
}

async function sendDistributorInquiryEmail(userEmail, inquiryData) {
  try {
    const templatePath = path.join(
      process.cwd(),
      "views",
      "distributor-inquiry.ejs"
    );
    const templateString = fs.readFileSync(templatePath, "utf-8");

    const submittedDate = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const htmlContent = ejs.render(templateString, {
      first_name: inquiryData.first_name,
      last_name: inquiryData.last_name || "",
      email: inquiryData.email,
      phone: inquiryData.phone,
      city: inquiryData.city,
      message: inquiryData.message || "",
      submittedDate,
    });

    const mailOptions = {
      from: '"BDS Education" <no-reply@bdseducation.in>',
      to: userEmail,
      subject: "Your Distributor Application Received – BDS Education",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Distributor inquiry confirmation email sent successfully!");
    return info;
  } catch (error) {
    console.error("Error sending distributor inquiry email:", error);
    throw error;
  }
}

async function sendOrderConfirmationEmail(orderRecord, items) {
  try {
    const templatePath = path.join(
      process.cwd(),
      "views",
      "order-confirmation.ejs"
    );
    const templateString = fs.readFileSync(templatePath, "utf-8");

    const htmlContent = ejs.render(templateString, {
      order: orderRecord, // Your order object
      items: items, // Array with {title, item_type, qty, unitPrice}
    });

    const mailOptions = {
      from: '"BDS Education" <no-reply@bdseducation.in>',
      to: "sales@bdseducation.in",
      subject: "New Order Received – BDS Education",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("New order confirmation email sent successfully!");
    return info;
  } catch (error) {
    console.error("Error sending New order email:", error);
    throw error;
  }
}

export const mailer = {
  transporter: transporter,
  sendResetPasswordEmail: sendResetPasswordEmail,
  sendResetUsernameEmail: sendResetUsernameEmail,
  sendContactInquiryEmail: sendContactInquiryEmail,
  sendDistributorInquiryEmail: sendDistributorInquiryEmail,
  sendOrderConfirmationEmail: sendOrderConfirmationEmail,
};
