import PDFDocument from "pdfkit";
import fs from "fs";

export function generateCertificate(
  { learnerName, courseTitle, completionDate, instructorName, logoPath },
  stream
) {
  const doc = new PDFDocument({ size: "A4", layout: "landscape", margin: 50 });

  doc.pipe(stream);
  doc.font("Courier-Bold");
  // Add border
  doc.rect(25, 25, doc.page.width - 50, doc.page.height - 50).stroke("#4CAF50");

  // Add logo
  if (logoPath && fs.existsSync(logoPath)) {
    doc.image(logoPath, doc.page.width - 200, 40, { width: 170 });
  }

  // Add certificate title
  doc
    .moveDown(4)
    .fontSize(60)
    .fillColor("#4CAF50")
    .text("CERTIFICATE", { align: "center" })
    .moveDown(0.2)
    .fontSize(25)
    .text("OF COMPLETION", {
      align: "center",
    })
    .moveDown(0.5);

  // Add learner's name
  doc
    .fontSize(20)
    .fillColor("#000000")
    .text(`This certificate is presented to`, { align: "center" })
    .moveDown(0.5);

  doc
    .fontSize(30)
    .fillColor("#4CAF50")
    .text(learnerName, { align: "center" })
    .moveDown(0.5);

  // Add course title
  doc
    .fontSize(20)
    .fillColor("#000000")
    .text(`for the completion of the course`, { align: "center" })
    .moveDown(0.5);

  doc
    .fontSize(24)
    .fillColor("#4CAF50")
    .text(courseTitle, { align: "center", underline: true })
    .moveDown(1);

  // Add completion date and instructor name
  doc
    .fontSize(16)
    .fillColor("#000000")
    .text(`Date of Completion: ${completionDate}`, { align: "center" })
    .moveDown(0.5);

  // Add signatures
  const signatureY = doc.page.height - 140;

  doc
    .fontSize(16)
    .text("_________________________", 100, signatureY, { align: "left" })
    .text("MR.NOURI khaireddine", 120, signatureY + 20)
    .text(`REPRÉSENTANT`, 140, signatureY + 50, { align: "left" });

  doc
    .fontSize(16)
    .text("_________________________", doc.page.width - 300, signatureY, {
      align: "right",
    })
    .text(instructorName, doc.page.width - 250, signatureY + 20)
    .text(`FORMATEUR`, doc.page.width - 250, signatureY + 50, {
      align: "center",
    });

  doc.end();
}
