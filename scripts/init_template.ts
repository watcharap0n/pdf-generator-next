import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';

async function createTemplate() {
    // Create a new PDFDocument
    const pdfDoc = await PDFDocument.create();

    // Add a blank page to the document
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size

    // Add some content to avoid "missing Contents" error or optimization issues
    page.drawText(' ', { x: 0, y: 0, size: 1 });

    // Serialize the PDFDocument to base64
    const pdfBase64 = await pdfDoc.saveAsBase64({ dataUri: true });

    const template = {
        basePdf: pdfBase64,
        schemas: [
            {
                "doc_title": {
                    "type": "text",
                    "position": { "x": 10, "y": 10 },
                    "width": 100,
                    "height": 10,
                    "content": "This is a test"
                },
                "company_name_th": {
                    "type": "text",
                    "position": { "x": 10, "y": 25 },
                    "width": 100,
                    "height": 10,
                    "content": "Comp Name"
                },
                "customer_name_th": {
                    "type": "text",
                    "position": { "x": 10, "y": 40 },
                    "width": 100,
                    "height": 10,
                    "content": "Cust Name"
                },
                "total_amount": {
                    "type": "text",
                    "position": { "x": 10, "y": 55 },
                    "width": 50,
                    "height": 10,
                    "content": "0.00"
                },
                "note_th": {
                    "type": "text",
                    "position": { "x": 10, "y": 70 },
                    "width": 150,
                    "height": 20,
                    "content": "Note"
                }
            }
        ]
    };

    const templatePath = path.join(process.cwd(), 'templates', 'template.latest.json');
    fs.writeFileSync(templatePath, JSON.stringify(template, null, 2));
    console.log("Template saved to", templatePath);
}

createTemplate().catch(err => console.error(err));
