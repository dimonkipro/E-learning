import PDFDocument from "pdfkit";

export function generateCertificate(
  { learnerName, courseTitle, completionDate, instructorName },
  stream
) {
  const doc = new PDFDocument({
    layout: "landscape",
    size: "A4",
  });

  // Helper to move to next line
  function jumpLine(doc, lines) {
    for (let index = 0; index < lines; index++) {
      doc.moveDown();
    }
  }
  doc.pipe(stream);

  doc.rect(0, 0, doc.page.width, doc.page.height).fill("#eeeee4");

  doc.fontSize(10);

  // Margin
  const distanceMargin = 18;

  doc
    .fillAndStroke("#3A4454")
    .lineWidth(20)
    .lineJoin("round")
    .rect(
      distanceMargin,
      distanceMargin,
      doc.page.width - distanceMargin * 2,
      doc.page.height - distanceMargin * 2
    )
    .stroke();

  // Header
  const maxWidth = 180;
  const maxHeight = 100;

  // Logo
  doc.image(
    "../backend/uploads/Logo.png",
    doc.page.width / 2 - maxWidth / 2,
    25,
    {
      fit: [maxWidth, maxHeight],
      align: "center",
    }
  );

  // Stamp
  doc.image("../backend/uploads/stamp.png", doc.page.width / 2 - 150, 400, {
    align: "center",
    width: 300,
  });

  jumpLine(doc, 5);

  doc
    .font("Courier-Bold")
    .fontSize(12)
    .fill("#021c27")
    .text("Société Laghazala du désert formations et services", {
      align: "center",
    });

  jumpLine(doc, 2);

  // Content
  doc
    .font("Courier-Bold")
    .fontSize(35)
    .fill("#021c27")
    .text("CERTIFICATE OF COMPLETION", {
      align: "center",
    });

  jumpLine(doc, 1);

  doc
    .font("Courier-Bold")
    .fontSize(14)
    .fill("#021c27")
    .text("This certificate is proudly presented to", {
      align: "center",
    });

  jumpLine(doc, 2);

  doc.font("Courier-Bold").fontSize(26).fill("#021c27").text(learnerName, {
    align: "center",
  });

  jumpLine(doc, 1);

  doc
    .font("Courier-Bold")
    .fontSize(16)
    .fill("#021c27")
    .text(`For the successful completion of the course " ${courseTitle} ".`, {
      align: "center",
    });

  jumpLine(doc, 1);
  doc
    .font("Courier")
    .fontSize(14)
    .fill("#021c27")
    .text(`Date of Completion: ${completionDate}`, {
      align: "center",
    });

  jumpLine(doc, 7);

  doc.lineWidth(1);

  // Signatures
  const lineSize = 174;
  const signatureHeight = 470;

  doc.fillAndStroke("#021c27");
  doc.strokeOpacity(0.2);

  const endLine1 = 128 + lineSize;

  const startLine2 = endLine1 + 32;
  const endLine2 = startLine2 + lineSize;

  const startLine3 = endLine2 + 32;
  const endLine3 = startLine3 + lineSize;

  // Director Signature
  doc
    .moveTo(startLine3, signatureHeight)
    .lineTo(endLine3, signatureHeight)
    .stroke();

  doc.image(
    "../backend/uploads/signature1.png",
    doc.page.width / 2 + 145,
    425,
    {
      align: "center",
      width: 130,
    }
  );

  doc
    .font("Courier-Bold")
    .fontSize(16)
    .fill("#021c27")
    .text("MR.NOURI khaireddine", startLine3, signatureHeight + 10, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: "center",
    });

  doc
    .font("Courier")
    .fontSize(12)
    .fill("#021c27")
    .text("Director", startLine3, signatureHeight + 45, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: "center",
    });

  jumpLine(doc, 4);

  doc.end();
}

// https://medium.com/@eduardoqgomes/creating-a-certificate-template-with-pdfkit-in-node-js-dd843e09e6cf
