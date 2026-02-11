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
    const [inputData, setInputData] = useState<string>(JSON.stringify(
        {
            "doc_title": "ใบเสนอราคาต้นฉบับ",
            "doc_type": "QT-2026-0001",
            "comp_name": "Goatie.ai Co., Ltd.",
            "comp_address_1": "99/9 ถนนสุขุมวิท แขวงคลองตันเหนือ",
            "comp_address_2": "เขตวัฒนา กรุงเทพมหานคร 10110",
            "tel": "โทร: 02-000-0000",
            "comp_tax_id": "0105566123456",
            "cust_name": "บริษัท ลูกค้าทดสอบ จำกัด",
            "table_item": [
                [
                    "1",
                    "รายการที่ 1: ค่าพัฒนา Bulk Transfer (Split 1.9%)",
                    "1",
                    "4000.00",
                    "4000.00"
                ],
                [
                    "2",
                    "รายการที่ 2: ค่าติดตั้ง/ตั้งค่าเริ่มต้นระบบ",
                    "1",
                    "1500.00",
                    "1500.00"
                ],
                [
                    "3",
                    "รายการที่ 3: ปรับปรุงหน้า Admin (UI/UX + Validation)",
                    "1",
                    "1200.00",
                    "1200.00"
                ],
                [
                    "4",
                    "รายการที่ 4: เพิ่ม API Endpoint สำหรับ Bulk Transfer",
                    "1",
                    "1800.00",
                    "1800.00"
                ],
                [
                    "5",
                    "รายการที่ 5: เพิ่ม Log/Audit Trail การโอนเงิน",
                    "1",
                    "900.00",
                    "900.00"
                ],
                [
                    "6",
                    "รายการที่ 6: เพิ่ม Report สรุปรายการโอน (Export ได้)",
                    "1",
                    "1100.00",
                    "1100.00"
                ],
                [
                    "7",
                    "รายการที่ 7: ทดสอบระบบ (Unit/Integration) + UAT Support",
                    "1",
                    "1300.00",
                    "1300.00"
                ],
                [
                    "8",
                    "รายการที่ 8: Deploy ขึ้น Production + ตรวจสอบหลังใช้งาน",
                    "1",
                    "1000.00",
                    "1000.00"
                ],
                [
                    "9",
                    "รายการที่ 9: เอกสารประกอบการใช้งาน (คู่มือย่อ)",
                    "1",
                    "700.00",
                    "700.00"
                ],
                [
                    "10",
                    "รายการที่ 10: สำรองเวลาแก้ไขจุกจิก (Buffer)",
                    "1",
                    "500.00",
                    "500.00"
                ]
            ],
            "amount": "300.00",
            "vat": "21.00",
            "net_total": "321.00",
            "baht_text": "สามร้อยยี่สิบเอ็ดบาทถ้วน",
            "bank": "กสิกรไทย",
            "bank_code": "123-4-56789-0",
            "bank_name": "Goatie.ai Co., Ltd."
        }
        , null, 2));

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
