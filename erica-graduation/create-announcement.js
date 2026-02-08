const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } = require('docx');
const fs = require('fs');

const doc = new Document({
  sections: [{
    properties: {
      page: {
        margin: {
          top: 1440,    // 1 inch
          right: 1440,
          bottom: 1440,
          left: 1440,
        },
      },
    },
    children: [
      // Top spacer
      new Paragraph({ text: "", spacing: { after: 600 } }),
      new Paragraph({ text: "", spacing: { after: 600 } }),
      
      // Decorative line
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "─────────────────────────",
            font: "Georgia",
            size: 24,
            color: "8B7355",
          }),
        ],
        spacing: { after: 400 },
      }),
      
      // Announcement header
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "WITH PRIDE AND JOY",
            font: "Georgia",
            size: 22,
            color: "666666",
            characterSpacing: 60,
          }),
        ],
        spacing: { after: 200 },
      }),
      
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "we announce the graduation of",
            font: "Georgia",
            size: 24,
            italics: true,
            color: "555555",
          }),
        ],
        spacing: { after: 500 },
      }),
      
      // Graduate name - the star
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "Erica Pullens",
            font: "Georgia",
            size: 56,
            bold: true,
            color: "2C3E50",
          }),
        ],
        spacing: { after: 500 },
      }),
      
      // Degree
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "Associate Degree in Business Management",
            font: "Georgia",
            size: 28,
            color: "444444",
          }),
        ],
        spacing: { after: 200 },
      }),
      
      // School
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "Pearl River Community College",
            font: "Georgia",
            size: 26,
            italics: true,
            color: "666666",
          }),
        ],
        spacing: { after: 600 },
      }),
      
      // Decorative separator
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "✦",
            font: "Georgia",
            size: 28,
            color: "8B7355",
          }),
        ],
        spacing: { after: 600 },
      }),
      
      // Ceremony details header
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "COMMENCEMENT CEREMONY",
            font: "Georgia",
            size: 20,
            color: "666666",
            characterSpacing: 40,
          }),
        ],
        spacing: { after: 300 },
      }),
      
      // Date
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "Wednesday, May 7, 2025",
            font: "Georgia",
            size: 26,
            color: "333333",
          }),
        ],
        spacing: { after: 100 },
      }),
      
      // Time
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "9:30 in the morning",
            font: "Georgia",
            size: 24,
            italics: true,
            color: "555555",
          }),
        ],
        spacing: { after: 300 },
      }),
      
      // Location
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "PRCC Football Stadium",
            font: "Georgia",
            size: 24,
            color: "444444",
          }),
        ],
        spacing: { after: 200 },
      }),
      
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "Poplarville, Mississippi",
            font: "Georgia",
            size: 22,
            italics: true,
            color: "666666",
          }),
        ],
        spacing: { after: 600 },
      }),
      
      // Bottom decorative line
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "─────────────────────────",
            font: "Georgia",
            size: 24,
            color: "8B7355",
          }),
        ],
        spacing: { after: 400 },
      }),
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('/root/.openclaw/workspace/erica-graduation/Erica_Pullens_Graduation_Announcement.docx', buffer);
  console.log('✓ Document created: Erica_Pullens_Graduation_Announcement.docx');
});
