import { transporter } from "./nodemailer.config.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  SUCCESS_ENROLLMENT_EMAIL_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

// Define your sender email address (you can also set this via env vars)
const sender = process.env.EMAIL_SENDER;

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const html = VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationToken
    );
    const info = await transporter.sendMail({
      from: sender,
      to: email,
      subject: "Vérifiez votre adresse email",
      html,
    });
    console.log("Verification Email sent successfully", info);
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error(`Error sending verification email: ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const html = WELCOME_EMAIL_TEMPLATE.replace("{name}", name);

    const info = await transporter.sendMail({
      from: sender,
      to: email,
      subject: "Bienvenue à E-ghazala",
      html,
    });
    console.log("Welcome Email sent successfully", info);
  } catch (error) {
    console.error("Error sending welcome email", error);
    throw new Error(`Error sending welcome email: ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace(
      "{resetURL}",
      resetURL
    );
    const info = await transporter.sendMail({
      from: sender,
      to: email,
      subject: "Réinitialisez votre mot de passe",
      html,
    });
    console.log("Password reset email sent successfully", info);
  } catch (error) {
    console.error("Error sending password reset email", error);
    throw new Error(`Error sending password reset email: ${error}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    const info = await transporter.sendMail({
      from: sender,
      to: email,
      subject: "Réinitialisation du mot de passe réussie",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
    console.log("Password reset success email sent successfully", info);
  } catch (error) {
    console.error("Error sending password reset success email", error);
    throw new Error(`Error sending password reset success email: ${error}`);
  }
};

export const sendEnrollmentStatus = async (email, name, courseTitle, status) => {
  try {
    const statusMap = {
      approved: "approuvé",
      pending: "en attente",
      rejected: "refusé",
    };
    const statusFr = statusMap[status] || status;
    const html = SUCCESS_ENROLLMENT_EMAIL_TEMPLATE.replace("{name}", name)
      .replace("{courseTitle}", courseTitle)
      .replace("{status}", statusFr);

    const info = await transporter.sendMail({
      from: sender,
      to: email,
      subject: "Statut de votre inscription",
      html,
    });
    console.log(`Enrollment (${status}) email sent to ${email}`, info.envelope);
  } catch (error) {
    console.error("Error sending enrollment approvement email", error);
    throw new Error(`Error sending enrollment approvement email: ${error}`);
  }
};
