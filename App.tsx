// Add declaration for jspdf and jszip from CDN
declare const jspdf: any;
declare const JSZip: any;

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { FileUpload } from './components/FileUpload';
import { BulkResultDisplay, Result } from './components/BulkResultDisplay';
import { extractTextFromPdf } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';

const App: React.FC = () => {
    const [files, setFiles] = useState<File[] | null>(null);
    const [results, setResults] = useState<Result[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleFilesSelect = async (selectedFiles: File[]) => {
        const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
        if (pdfFiles.length === 0) {
            setError('Please select at least one PDF file.');
            return;
        }
        
        setFiles(pdfFiles);
        setError(null);
        setResults(null);
        setIsLoading(true);
        setLoadingMessage(`Extracting text from ${pdfFiles.length} PDF(s)... This may take a moment.`);

        try {
            const processingPromises = pdfFiles.map(async (file) => {
                const base64Data = await fileToBase64(file);
                const text = await extractTextFromPdf({
                    mimeType: file.type,
                    data: base64Data
                });
                return { fileName: file.name, text };
            });

            const newResults = await Promise.all(processingPromises);
            setResults(newResults);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred during processing.');
            setResults(null); // Clear partial results on error
        } finally {
            setIsLoading(false);
        }
    };

    const createPdfBlob = (text: string): Blob => {
        const { jsPDF } = jspdf;
        const doc = new jsPDF();
        doc.setFontSize(14);
        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        const usableWidth = pageWidth - margin * 2;
        const lines = doc.splitTextToSize(text, usableWidth);
        doc.text(lines, margin, margin);
        return doc.output('blob');
    };
    
    const handleDownloadSinglePdf = (text: string, fileName: string) => {
        const { jsPDF } = jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(14);
        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        const usableWidth = pageWidth - margin * 2;
        
        const lines = doc.splitTextToSize(text, usableWidth);
        doc.text(lines, margin, margin);
        
        doc.save(`${fileName.replace('.pdf', '')}_extracted.pdf`);
    };

    const handleDownloadAllAsZip = async () => {
        if (!results) return;
        
        setLoadingMessage('Creating ZIP file...');
        setIsLoading(true);

        try {
            const zip = new JSZip();
            results.forEach(result => {
                const pdfBlob = createPdfBlob(result.text);
                const newFileName = `${result.fileName.replace('.pdf', '')}_extracted.pdf`;
                zip.file(newFileName, pdfBlob);
            });
            
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(zipBlob);
            link.download = 'pdf_extracts.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
        } catch(err) {
            setError(err instanceof Error ? err.message : 'Could not create ZIP file.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setFiles(null);
        setResults(null);
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

        if (results) {
            return (
                <BulkResultDisplay
                    results={results}
                    onDownloadSingle={handleDownloadSinglePdf}
                    onDownloadAll={handleDownloadAllAsZip}
                    onClear={handleClear}
                />
            );
        }

        return <FileUpload onFileSelect={handleFilesSelect} disabled={isLoading} />;
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