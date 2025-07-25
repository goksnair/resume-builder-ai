import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';

const ResumeAnalysis = ({ score, details, commentary, improvements }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getScoreColor = (value) => {
        if (value >= 80) return 'text-green-500';
        if (value >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const truncatedDetails = details?.length > 100 ? details.slice(0, 97) + '...' : details;
    const truncatedCommentary = commentary?.length > 100 ? commentary.slice(0, 97) + '...' : commentary;

    return (
        <div className="bg-gray-900/80 p-6 rounded-lg shadow-xl text-gray-100">
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                    <div className="cursor-pointer">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-100">Resume Analysis</h3>
                            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                                {score}%
                            </span>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-medium text-gray-200 mb-1">Details:</h4>
                                <p className="text-gray-300 text-sm">{truncatedDetails}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-200 mb-1">Commentary:</h4>
                                <p className="text-gray-300 text-sm">{truncatedCommentary}</p>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-200 mb-1">Improvements:</h4>
                                <p className="text-gray-300 text-sm">
                                    {improvements?.length || 0} suggestions available
                                </p>
                            </div>
                        </div>
                    </div>
                </DialogTrigger>

                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 text-gray-100 border-gray-700">
                    <DialogHeader>
                        <DialogTitle className="flex justify-between items-center">
                            <span>Detailed Resume Analysis</span>
                            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                                Score: {score}%
                            </span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-100">Analysis Details</h3>
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-gray-300 whitespace-pre-wrap">{details}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-100">Expert Commentary</h3>
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-gray-300 whitespace-pre-wrap">{commentary}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-gray-100">
                                Improvement Suggestions ({improvements?.length || 0})
                            </h3>
                            <div className="space-y-3">
                                {improvements?.map((improvement, index) => (
                                    <div key={index} className="bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm font-medium text-blue-400">
                                                Suggestion #{index + 1}
                                            </span>
                                            {improvement.lineNumber && (
                                                <span className="text-xs text-gray-500">
                                                    Line: {improvement.lineNumber}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-300">{improvement.suggestion}</p>
                                    </div>
                                ))}
                                {(!improvements || improvements.length === 0) && (
                                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                                        <p className="text-gray-400">No specific improvement suggestions available.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" className="bg-gray-800 text-gray-100 border-gray-600 hover:bg-gray-700">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ResumeAnalysis;
