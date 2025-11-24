import React, { useState } from 'react';
import { DownloadIcon, CopyIcon, CheckCircleIcon, ChevronDownIcon } from './icons/Icons';

interface ResultAccordionItemProps {
    fileName: string;
    text: string;
    onDownload: () => void;
    initiallyOpen?: boolean;
}

export const ResultAccordionItem: React.FC<ResultAccordionItemProps> = ({ fileName, text, onDownload, initiallyOpen = false }) => {
    const [isOpen, setIsOpen] = useState(initiallyOpen);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left"
                aria-expanded={isOpen}
            >
                <span className="font-semibold truncate pr-4">{fileName}</span>
                <div className="flex items-center gap-4">
                     <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            
            {isOpen && (
                 <div className="p-4 border-t border-gray-700">
                    <div className="relative">
                        <textarea
                            readOnly
                            value={text}
                            className="w-full h-60 p-3 bg-gray-900 border border-gray-600 rounded-md font-mono text-sm resize-y focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            aria-label={`Extracted Text for ${fileName}`}
                        />
                         <div className="absolute top-3 right-3 flex flex-col gap-2">
                            <button
                                onClick={handleCopy}
                                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-md transition-colors"
                                aria-label="Copy text"
                                title="Copy text"
                            >
                                {copied ? <CheckCircleIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
                            </button>
                             <button
                                onClick={onDownload}
                                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-md transition-colors"
                                aria-label="Download as PDF"
                                title="Download as PDF"
                            >
                                <DownloadIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
