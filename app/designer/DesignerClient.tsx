"use client";

import React, { useEffect, useRef, useState } from "react";
import { Designer, Template } from "@pdfme/ui";
import {
    BLANK_PDF,
    checkTemplate,
    getFontsData,
    text,
    image,
} from "@pdfme/schemas";

interface DesignerClientProps {
    initialTemplate: Template;
    font: Record<string, { data: string; fallback?: boolean }>;
}

export default function DesignerClient({
    initialTemplate,
    font,
}: DesignerClientProps) {
    const designerRef = useRef<HTMLDivElement>(null);
    const designerInstance = useRef<Designer | null>(null);
    const [status, setStatus] = useState<string>("");

    useEffect(() => {
        if (designerRef.current) {
            // Prepare plugins
            const plugins = {
                text,
                image
            };

            const designer = new Designer({
                domContainer: designerRef.current,
                template: initialTemplate,
                options: {
                    font: font,
                },
                plugins: plugins
            });
            designerInstance.current = designer;

            return () => {
                designer.destroy();
            };
        }
    }, [initialTemplate, font]);

    const handleSave = async () => {
        if (!designerInstance.current) return;
        setStatus("Saving...");
        try {
            const template = designerInstance.current.getTemplate();
            const res = await fetch("/api/templates/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ template }),
            });

            if (!res.ok) throw new Error("Failed to save");
            setStatus("Template saved successfully!");
        } catch (err) {
            console.error(err);
            setStatus("Error saving template.");
        }
    };

    const handleGenerate = async () => {
        if (!designerInstance.current) return;
        setStatus("Generating PDF...");
        try {
            // We don't need to send the template here because the server reads it from disk.
            // However, usually "Generate" in a designer context implies generating *current* design.
            // But the requirement says: 
            // "Generate PDF" -> calls a Next.js API route (server) which:
            // a) reads /templates/template.latest.json
            // So we must SAVE first or user must know to SAVE first.
            // I will auto-save before generating to make it user-friendly, OR just follow instructions strictly.
            // "Save Template" -> sends ... writes to ...
            // "Generate PDF" -> reads /templates/template.latest.json

            // Let's warn the user if they look like they haven't saved? 
            // Or just simpler: Trigger a save first, then call generate.

            // Saving first for better UX
            await handleSave();

            const res = await fetch("/api/pdf/generate", {
                method: "POST",
            });

            if (!res.ok) throw new Error("Failed to generate");

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "generated.pdf";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setStatus("PDF Generated and Downloaded!");
        } catch (err) {
            console.error(err);
            setStatus("Error generating PDF.");
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="bg-gray-100 p-4 flex items-center justify-between border-b">
                <h1 className="text-xl font-bold">PDFMe Designer (POC)</h1>
                <div className="flex gap-4 items-center">
                    <span className="text-sm font-medium text-blue-600">{status}</span>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Save Template
                    </button>
                    <button
                        onClick={handleGenerate}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                        Generate PDF
                    </button>
                </div>
            </div>
            <div ref={designerRef} className="flex-1 bg-gray-200 overflow-hidden relative" />
        </div>
    );
}
