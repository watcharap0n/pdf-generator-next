"use client";

import React, { useEffect, useRef, useState } from "react";
import { Designer } from "@pdfme/ui";
import { Template } from "@pdfme/common";
import {
    text,
    image,
    table,
    line,
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
    const [inputData, setInputData] = useState<string>(JSON.stringify({
        "doc_title": "ใบเสนอราคา",
        "company_name_th": "บริษัท ทดสอบ จำกัด",
        "customer_name_th": "ลูกค้า: คุณเคน",
        "total_amount": "15,000.00",
        "note_th": "หมายเหตุ: กรุณาชำระเงินภายใน 7 วัน"
    }, null, 2));

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        if (designerRef.current) {
            // Prepare plugins
            const plugins = {
                text,
                image,
                table,
                line
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

    const handleExportTemplate = () => {
        if (!designerInstance.current) return;
        const template = designerInstance.current.getTemplate();
        const blob = new Blob([JSON.stringify(template, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "template.json";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setStatus("Template Exported!");
    };

    const handleGenerate = async () => {
        if (!designerInstance.current) return;
        setStatus("Generating PDF...");
        try {
            // Auto-save removed for stateless/Vercel deployment to avoid 500 errors.
            // User should use "Export Template" to save their work locally.

            let parsedInput = {};
            try {
                parsedInput = JSON.parse(inputData);
            } catch (e) {
                alert("Invalid JSON in input data");
                setStatus("Error: Invalid JSON input");
                return;
            }

            const template = designerInstance.current.getTemplate();

            const res = await fetch("/api/pdf/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    template,
                    inputs: [parsedInput]
                })
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
        <div className="flex bg-gray-100 h-screen overflow-hidden">
            {/* Sidebar for Data Input */}
            <div
                className={`bg-white border-r shadow-sm z-10 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-0 overflow-hidden'}`}
            >
                <div className="w-80 h-full flex flex-col p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Input Data</h2>
                    </div>
                    <textarea
                        className="flex-1 w-full border rounded p-2 font-mono text-sm resize-none mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        placeholder="Enter JSON data here..."
                    />
                    <div className="text-xs text-gray-500 mb-2">
                        Edit the JSON above to test dynamic data injection.
                    </div>
                </div>
            </div>

            {/* Main Designer Area */}
            <div className="flex-1 flex flex-col h-screen">
                <div className="bg-white p-4 flex items-center justify-between border-b shadow-sm z-20">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 transition"
                            title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
                        >
                            {isSidebarOpen ? "❮" : "❯"}
                        </button>
                        <h1 className="text-xl font-bold text-gray-800">PDFMe Designer (POC)</h1>
                    </div>
                    <div className="flex gap-3 items-center">
                        <span className="text-sm font-medium text-blue-600 mr-2">{status}</span>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition font-medium"
                        >
                            Save
                        </button>
                        <button
                            onClick={handleExportTemplate}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition font-medium"
                        >
                            Export JSON
                        </button>
                        <button
                            onClick={handleGenerate}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium shadow-sm"
                        >
                            Generate PDF
                        </button>
                    </div>
                </div>
                <div ref={designerRef} className="flex-1 bg-gray-100 overflow-hidden relative" />
            </div>
        </div>
    );
}
