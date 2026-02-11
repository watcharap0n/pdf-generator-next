import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { generate } from '@pdfme/generator';
import { text, image, table, line } from '@pdfme/schemas';
import { getFonts } from '@/lib/pdfme_fonts';

export async function POST(req: NextRequest) {
    try {
        // Check for template and inputs from request body
        let inputs;
        let template;

        try {
            const body = await req.json();
            if (body && body.inputs) {
                inputs = Array.isArray(body.inputs) ? body.inputs : [body.inputs];
            }
            if (body && body.template) template = body.template;
        } catch (e) {
            // No body or invalid JSON
        }

        if (!template) {
            const templatePath = path.join(process.cwd(), 'templates', 'template.latest.json');
            if (fs.existsSync(templatePath)) {
                template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
            } else {
                return NextResponse.json({ error: 'Template not found and not provided in request.' }, { status: 404 });
            }
        }

        if (!inputs) {
            const dataPath = path.join(process.cwd(), 'data', 'sample.input.json');
            if (!fs.existsSync(dataPath)) {
                return NextResponse.json({ error: 'Sample data not found and no input provided.' }, { status: 404 });
            }
            inputs = [JSON.parse(fs.readFileSync(dataPath, 'utf-8'))];
        }

        const font = await getFonts();
        const plugins = { text, image, table, line };

        // @ts-ignore
        const pdf = await generate({ template, inputs, plugins, options: { font } });

        // Return PDF buffer directly without saving to disk (stateless for Vercel)
        return new NextResponse(pdf, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=generated.pdf',
            },
        });

    } catch (error) {
        console.error('Error generating PDF:', error);
        return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
    }
}
