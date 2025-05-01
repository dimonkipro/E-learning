import PDFDocument from "pdfkit";

export function generateCertificate(
  { learnerName, courseTitle, completionDate, instructorName },
  stream
) {
  const doc = new PDFDocument();

  doc.pipe(stream);

  // Add certificate title
  doc
    .fontSize(24)
    .text("Certificate of Completion", { align: "center" })
    .moveDown(2);

  // Add learner's name
  doc
    .fontSize(20)
    .text(`This is to certify that`, { align: "center" })
    .moveDown(1);

  doc
    .fontSize(28)
    .text(learnerName, { align: "center", underline: true })
    .moveDown(1);

  // Add course title
  doc
    .fontSize(20)
    .text(`has successfully completed the course`, { align: "center" })
    .moveDown(1);

  doc
    .fontSize(24)
    .text(courseTitle, { align: "center", underline: true })
    .moveDown(2);

  // Add completion date and instructor name
  doc
    .fontSize(16)
    .text(`Date of Completion: ${completionDate}`, { align: "center" })
    .moveDown(1);

  doc
    .fontSize(16)
    .text(`Instructor: ${instructorName}`, { align: "center" })
    .moveDown(2);

  // Add a signature placeholder
  doc
    .fontSize(16)
    .text("_________________________", { align: "center" })
    .text("Signature", { align: "center" });

  doc.end();
}
