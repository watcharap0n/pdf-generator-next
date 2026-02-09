import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { generate } from '@pdfme/generator';
import { getFonts } from '@/lib/pdfme_fonts';

export async function POST(req: NextRequest) {
    try {
        const templatePath = path.join(process.cwd(), 'templates', 'template.latest.json');
        const dataPath = path.join(process.cwd(), 'data', 'sample.input.json');

        if (!fs.existsSync(templatePath)) {
            return NextResponse.json({ error: 'Template not found. Please save a template first.' }, { status: 404 });
        }

        if (!fs.existsSync(dataPath)) {
            return NextResponse.json({ error: 'Sample data not found.' }, { status: 404 });
        }

        const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
        const inputs = [JSON.parse(fs.readFileSync(dataPath, 'utf-8'))];

        const font = await getFonts();

        // @ts-ignore
        const pdf = await generate({ template, inputs, options: { font } });


        const outPath = path.join(process.cwd(), 'out', 'generated.pdf');
        fs.writeFileSync(outPath, pdf);

        const fileBuffer = fs.readFileSync(outPath);

        return new NextResponse(fileBuffer, {
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
