import PDFDocument from "pdfkit";
import { htmlToText } from "html-to-text";

export function generateArticlePdf(res, {
    title,
    content,
    authorEmail,
    createdAt
}) {
    const doc = new PDFDocument({
        size: "A4",
        margins: {
            top: 50,
            bottom: 50,
            left: 50,
            right: 50
        }
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${title.replace(/\s+/g, "_")}.pdf"`
    );

    doc.pipe(res);

    doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text(title, { align: "center" });

    doc.moveDown(1.5);

    doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("gray")
        .text(`Author: ${authorEmail || "Unknown"}`);
    
    if (createdAt) {
        doc.text(`Created at: ${new Date(createdAt).toLocaleString()}`);
    }

    doc.moveDown(1);
    doc.fillColor("black");

    const plainText = htmlToText(content, {
        wordwrap: 100
    });

    doc
        .fontSize(12)
        .font("Helvetica")
        .text(plainText, {
            align: "left",
            lineGap: 4
        });

    doc.end();
}
