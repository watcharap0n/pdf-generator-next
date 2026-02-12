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
            "doc_title": "ใบเสนอราคา",
            "comp_name": "บริษัท โกทีเอไอ เทคโนโลยี จำกัด",

            "table_item": [
                ["1", "พัฒนา Backend API (FastAPI + AWS)", "1", "50,000.00", "50,000.00"],
                ["2", "พัฒนา Frontend Dashboard (Next.js)", "1", "35,000.00", "35,000.00"],
                ["3", "เชื่อมต่อ LINE Profile + ระบบอัปโหลดรูป", "1", "20,000.00", "20,000.00"],
                ["4", "Deploy ขึ้น AWS (EC2 + S3 + CloudFront)", "1", "18,000.00", "18,000.00"],
                ["5", "ปรับปรุงประสิทธิภาพและ Security Hardening", "1", "12,000.00", "12,000.00"],
                ["6", "จัดทำเอกสารระบบและคู่มือการใช้งาน", "1", "8,000.00", "8,000.00"],
                ["7", "ฝึกอบรมทีมงาน 1 วัน", "1", "5,000.00", "5,000.00"],
                ["8", "ค่าบำรุงรักษาระบบ 1 เดือน", "1", "2,000.00", "2,000.00"]
            ],

            "comp_logo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAF/gL+ZxL5WQAAAABJRU5ErkJggg==",

            "doc_no": "QUT-2026-0021",
            "line_header_separator": "rendered_header_line",

            "label_cust_section": "ลูกค้า",
            "baht_text": "(หนึ่งแสนหกหมื่นห้าร้อยบาทถ้วน)",

            "label_comp_bank_name": "ธนาคาร",
            "label_sign_cust": "ผู้รับสินค้า/บริการ",

            "stamp_image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwAE5QL+ZxL5WQAAAABJRU5ErkJggg==",

            "sign_cust_name": "นายสมชาย ใจดี",

            "label_subtotal": "รวมเป็นเงิน",
            "label_vat_amount": "ภาษีมูลค่าเพิ่ม",
            "label_total": "จำนวนเงินรวมทั้งสิ้น",

            "label_baht_1": "บาท",
            "label_baht_2": "บาท",
            "label_baht_3": "บาท",

            "subtotal": "150,000.00",
            "vat_amount": "10,500.00",
            "total": "160,500.00",

            "line_total_separator": "rendered_total_line",
            "label_payment_section": "ช่องทางการชำระเงิน",

            "line_cust_sign": "signature_line_customer",
            "line_cust_date_sign": "date_line_customer",

            "label_sign_comp": "ผู้อนุมัติ",

            "line_comp_sign": "signature_line_company",
            "line_comp_date_sign": "date_line_company",

            "label_made_by": "สร้างโดย Goatie.ai",

            "comp_address_1": "99/1 ถนนสุขุมวิท",
            "comp_address_2": "แขวงคลองตัน เขตวัฒนา กรุงเทพฯ 10110",

            "comp_tax_id": "0-1055-59876-54-3",
            "label_comp_tax_id": "เลขประจำตัวผู้เสียภาษี",

            "comp_phone": "02-888-9999",
            "label_comp_phone": "โทร",

            "cust_name": "บริษัท ไทยดิจิทัล โซลูชั่น จำกัด",
            "cust_address_1": "88/8 ถนนรัชดาภิเษก",
            "cust_address_2": "แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400",

            "cust_tax_id": "0-1055-61234-56-7",
            "label_cust_tax_id": "เลขประจำตัวผู้เสียภาษี",

            "cust_phone": "081-234-5678",
            "label_cust_phone": "โทร",

            "doc_date": "11 กุมภาพันธ์ 2569",

            "comp_bank_name": "ธนาคารกสิกรไทย",
            "label_comp_bank_account_no": "เลขที่บัญชี",
            "comp_bank_account_no": "123-4-56789-0",

            "label_comp_bank_account_name": "ชื่อบัญชี",
            "comp_bank_account_name": "บริษัท โกทีเอไอ เทคโนโลยี จำกัด",

            "doc_title_original": "(ต้นฉบับ)",

            "label_doc_no": "เลขที่เอกสาร",
            "label_doc_date": "วันที่",

            "sign_comp_name": "นายวชรพล วีระบริรักษ์",

            "label_sign_cust_date": "วันที่",
            "label_sign_comp_date": "วันที่",

            "label_withholding": "ภาษีหัก ณ ที่จ่าย",
            "withholding_amount": "(4,500.00)",

            "label_baht_4": "บาท"
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
