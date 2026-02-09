import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { template } = body;

        if (!template) {
            return NextResponse.json({ error: 'Template is required' }, { status: 400 });
        }

        const templatePath = path.join(process.cwd(), 'templates', 'template.latest.json');
        fs.writeFileSync(templatePath, JSON.stringify(template, null, 2));

        return NextResponse.json({ ok: true, path: 'templates/template.latest.json' });
    } catch (error) {
        console.error('Error saving template (likely read-only filesystem):', error);
        // On Vercel, this will fail. We return 500, but client now handles this gracefully.
        return NextResponse.json({ error: 'Failed to save template to disk' }, { status: 500 });
    }
}
