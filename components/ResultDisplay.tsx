import React, { useState } from 'react';
import { DownloadIcon, CopyIcon, ClearIcon, CheckCircleIcon } from './icons/Icons';

interface ResultDisplayProps {
    fileName: string;
    text: string;
    onDownload: () => void;
    onClear: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ fileName, text, onDownload, onClear }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="bg-gray-900/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Extracted text from:</p>
                <p className="font-semibold truncate">{fileName}</p>
            </div>
            <div className="relative">
                <textarea
                    readOnly
                    value={text}
                    className="w-full h-80 p-4 bg-gray-900 border border-gray-600 rounded-md font-mono text-base resize-y focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    aria-label="Extracted Text"
                />
                <button
                    onClick={handleCopy}
                    className="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 p-2 rounded-md transition-colors"
                    aria-label="Copy text"
                >
                    {copied ? <CheckCircleIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
                </button>
            </div>
            <div className="flex justify-end gap-4">
                <button
                    onClick={onClear}
                    className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 font-bold py-2 px-4 rounded-full transition-colors"
                >
                    <ClearIcon className="w-5 h-5" />
                    Process Another
                </button>
                <button
                    onClick={onDownload}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 font-bold py-2 px-4 rounded-full transition-colors"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Download as PDF
                </button>
            </div>
        </div>
    );
};