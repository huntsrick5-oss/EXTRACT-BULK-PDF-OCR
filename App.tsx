// Add declaration for jspdf from CDN
declare const jspdf: any;

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { FileUpload } from './components/FileUpload';
import { ResultDisplay } from './components/ResultDisplay';
import { extractTextFromPdf } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = async (selectedFile: File) => {
        if (selectedFile.type !== 'application/pdf') {
            setError('Please select a PDF file.');
            return;
        }
        setFile(selectedFile);
        setError(null);
        setExtractedText(null);
        setIsLoading(true);
        setLoadingMessage(`Processing ${selectedFile.name}...`);

        try {
            const base64Data = await fileToBase64(selectedFile);
            const text = await extractTextFromPdf({
                mimeType: selectedFile.type,
                data: base64Data
            });
            setExtractedText(text);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred during processing.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPdf = () => {
        if (!extractedText || !file) return;

        // Use jsPDF to create a new PDF
        const { jsPDF } = jspdf;
        const doc = new jsPDF();
        
        // Set a larger font size for better readability
        doc.setFontSize(14);

        const margin = 15; // in mm
        const pageWidth = doc.internal.pageSize.getWidth();
        const usableWidth = pageWidth - margin * 2;
        
        // Add the extracted text to the PDF, with automatic line wrapping
        const lines = doc.splitTextToSize(extractedText, usableWidth);
        doc.text(lines, margin, margin);

        // Trigger download
        doc.save(`${file.name.replace('.pdf', '')}_extracted.pdf`);
    };

    const handleClear = () => {
        setFile(null);
        setExtractedText(null);
        setError(null);
        setIsLoading(false);
    };

    const renderContent = () => {
        if (isLoading) {
            return <Loader message={loadingMessage} />;
        }
        
        if (error) {
            return (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                    <button onClick={handleClear} className="ml-4 underline">Try again</button>
                </div>
            );
        }

        if (extractedText && file) {
            return (
                <ResultDisplay
                    fileName={file.name}
                    text={extractedText}
                    onDownload={handleDownloadPdf}
                    onClear={handleClear}
                />
            );
        }

        return <FileUpload onFileSelect={handleFileSelect} disabled={isLoading} />;
    };

    return (
        <div className="bg-gray-900 min-h-screen text-white font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
            <div className="w-full max-w-2xl mx-auto flex flex-col space-y-8">
                <Header />
                <main className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default App;