import React from 'react';
import DesignerClient from './DesignerClient';
import { getFontsBase64 } from '@/lib/pdfme_fonts';
import fs from 'fs';
import path from 'path';
import { Template, BLANK_PDF } from '@pdfme/common';

const DEFAULT_TEMPLATE: Template = {
    basePdf: BLANK_PDF,
    schemas: [
        [
            {
                "name": "doc_title",
                "type": "text",
                "position": { "x": 10, "y": 10 },
                "width": 100,
                "height": 10,
                "content": "Quote"
            },
            {
                "name": "company_name_th",
                "type": "text",
                "position": { "x": 10, "y": 25 },
                "width": 100,
                "height": 10,
                "content": "Company Name"
            },
            {
                "name": "customer_name_th",
                "type": "text",
                "position": { "x": 10, "y": 40 },
                "width": 100,
                "height": 10,
                "content": "Customer Name"
            },
            {
                "name": "total_amount",
                "type": "text",
                "position": { "x": 10, "y": 55 },
                "width": 50,
                "height": 10,
                "content": "0.00"
            },
            {
                "name": "note_th",
                "type": "text",
                "position": { "x": 10, "y": 70 },
                "width": 150,
                "height": 20,
                "content": "Note"
            }
        ]
    ]
};

export default async function DesignerPage() {
    const fonts = await getFontsBase64();

    let initialTemplate = DEFAULT_TEMPLATE;
    const templatePath = path.join(process.cwd(), 'templates', 'template.latest.json');

    if (fs.existsSync(templatePath)) {
        try {
            const fileContent = fs.readFileSync(templatePath, 'utf-8');
            initialTemplate = JSON.parse(fileContent);
        } catch (e) {
            console.error("Failed to parse existing template, using default.", e);
        }
    }

    return <DesignerClient initialTemplate={initialTemplate} font={fonts} />;
}
