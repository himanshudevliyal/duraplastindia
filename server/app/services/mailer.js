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
    const resetLink = `www.duraplastindia.com/reset-password?t=${token}`;
    const htmlContent = ejs.render(templateString, {
      resetLink,
    });

    const mailOptions = {
      // from: config.smtp_from_email,
      from: '"duraplastindia" <no-reply@bdseducation.in>',
      to: userEmail,
      subject: "Reset Your Password – duraplastindia",
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
    const resetLink = `https://www.duraplastindia.com/reset-username?t=${token}`;
    const htmlContent = ejs.render(templateString, {
      resetLink,
    });

    const mailOptions = {
      // from: config.smtp_from_email,
      from: '"duraplastindia" <no-reply@bdseducation.in>',
      to: userEmail,
      subject: "Reset Your Username – duraplastindia",
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
      from: '"duraplastindia" <no-reply@bdseducation.in>',
      to: userEmail,
      subject: "We Received Your Contact Inquiry – duraplastindia",
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
      from: '"duraplastindia" <no-reply@bdseducation.in>',
      to: userEmail,
      subject: "Your Distributor Application Received – duraplastindia",
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
      from: '"duraplastindia" <no-reply@bdseducation.in>',
      to: "sales@bdseducation.in",
      subject: "New Order Received – duraplastindia",
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

// Distributor enquiry: 1) notification to admin(s), 2) confirmation to applicant.
// Mail is skipped (not an error) when SMTP creds are not configured.
async function sendDistributorEnquiryEmails(enquiry) {
  if (!config.smtp_user || !config.smtp_password) {
    console.warn("SMTP not configured - distributor enquiry mail skipped");
    return;
  }

  const render = (file, data) =>
    ejs.render(
      fs.readFileSync(path.join(process.cwd(), "views", file), "utf-8"),
      data,
    );

  const submittedDate = new Date().toLocaleString("en-GB", {
    dateStyle: "long",
    timeStyle: "short",
  });
  const fromEmail = config.smtp_from_email || config.smtp_user;
  const from = `"${config.company_name}" <${fromEmail}>`;
  const data = { ...enquiry, submittedDate, company: config.company_name };

  const jobs = [];

  if (config.distributor_notify_email.length) {
    jobs.push(
      transporter.sendMail({
        from,
        to: config.distributor_notify_email,
        replyTo: enquiry.email,
        subject: `New Distributor Enquiry - ${enquiry.company_name} (${enquiry.country})`,
        html: render("distributor-enquiry-admin.ejs", data),
      }),
    );
  }

  jobs.push(
    transporter.sendMail({
      from,
      to: enquiry.email,
      subject: `We received your distributor enquiry - ${config.company_name}`,
      html: render("distributor-enquiry-confirmation.ejs", data),
    }),
  );

  const results = await Promise.allSettled(jobs);
  results.forEach((r) => {
    if (r.status === "rejected")
      console.error("Distributor enquiry mail failed:", r.reason);
  });
}

export const mailer = {
  sendDistributorEnquiryEmails: sendDistributorEnquiryEmails,
  transporter: transporter,
  sendResetPasswordEmail: sendResetPasswordEmail,
  sendResetUsernameEmail: sendResetUsernameEmail,
  sendContactInquiryEmail: sendContactInquiryEmail,
  sendDistributorInquiryEmail: sendDistributorInquiryEmail,
  sendOrderConfirmationEmail: sendOrderConfirmationEmail,
};
