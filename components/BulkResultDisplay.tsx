import React from 'react';
import { ResultAccordionItem } from './ResultAccordionItem';
import { ClearIcon, DownloadIcon } from './icons/Icons';

export interface Result {
    fileName: string;
    text: string;
}

interface BulkResultDisplayProps {
    results: Result[];
    onDownloadSingle: (text: string, fileName: string) => void;
    onDownloadAll: () => void;
    onClear: () => void;
}

export const BulkResultDisplay: React.FC<BulkResultDisplayProps> = ({ results, onDownloadSingle, onDownloadAll, onClear }) => {
    return (
        <div className="flex flex-col space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-200">Extraction Results</h2>
                <p className="text-gray-400">Found text in {results.length} file(s).</p>
            </div>

            <div className="space-y-2">
                {results.map((result, index) => (
                    <ResultAccordionItem
                        key={result.fileName}
                        fileName={result.fileName}
                        text={result.text}
                        onDownload={() => onDownloadSingle(result.text, result.fileName)}
                        initiallyOpen={index === 0}
                    />
                ))}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-gray-700">
                <button
                    onClick={onClear}
                    className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 font-bold py-2 px-4 rounded-full transition-colors w-full sm:w-auto"
                >
                    <ClearIcon className="w-5 h-5" />
                    Process More
                </button>
                <button
                    onClick={onDownloadAll}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 font-bold py-2 px-4 rounded-full transition-colors w-full sm:w-auto"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Download All as ZIP
                </button>
            </div>
        </div>
    );
};