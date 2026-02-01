import { useState, useRef } from 'react';
import { Image, FileText, Mic, Send, ChevronDown, ChevronUp, Trash2, X, Download, Play, Pause } from 'lucide-react';

function SubjectTile({ subject, onAddEntry, onDeleteEntry, theme }) {
    const [description, setDescription] = useState('');
    const [attachments, setAttachments] = useState({
        image: null,
        pdf: null,
        voice: null,
    });
    const [collapsedDates, setCollapsedDates] = useState({});
    const [collapsedMonths, setCollapsedMonths] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    // File input refs
    const imageInputRef = useRef(null);
    const pdfInputRef = useRef(null);
    const voiceInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (description.trim()) {
            onAddEntry({
                description,
                attachments: { ...attachments },
            });
            setDescription('');
            setAttachments({ image: null, pdf: null, voice: null });
        }
    };

    const handleFileUpload = (file, type) => {
        if (!file) return;

        // Check file size (5MB limit for localStorage safety)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('File size exceeds 5MB limit. Please choose a smaller file.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const fileData = {
                name: file.name,
                data: reader.result,
                type: file.type,
                size: file.size,
            };
            setAttachments(prev => ({ ...prev, [type]: fileData }));
        };
        reader.readAsDataURL(file);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        handleFileUpload(file, 'image');
    };

    const handlePdfUpload = (e) => {
        const file = e.target.files[0];
        handleFileUpload(file, 'pdf');
    };

    const handleVoiceUpload = (e) => {
        const file = e.target.files[0];
        handleFileUpload(file, 'voice');
    };

    const removeAttachment = (type) => {
        setAttachments(prev => ({ ...prev, [type]: null }));
        // Reset the file input
        if (type === 'image' && imageInputRef.current) imageInputRef.current.value = '';
        if (type === 'pdf' && pdfInputRef.current) pdfInputRef.current.value = '';
        if (type === 'voice' && voiceInputRef.current) voiceInputRef.current.value = '';
    };

    const toggleDateCollapse = (date) => {
        setCollapsedDates(prev => ({ ...prev, [date]: !prev[date] }));
    };

    const toggleMonthCollapse = (month) => {
        setCollapsedMonths(prev => ({ ...prev, [month]: !prev[month] }));
    };

    // Group entries by date
    const groupedEntries = subject.entries?.reduce((groups, entry) => {
        const date = new Date(entry.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(entry);
        return groups;
    }, {}) || {};

    const dateKeys = Object.keys(groupedEntries);

    return (
        <div className="bg-white rounded-lg shadow-md h-full flex flex-col overflow-hidden">
            {/* Subject Header */}
            <div className={`p-6 bg-gradient-to-r ${theme.gradient} text-white rounded-t-lg`}>
                <h2 className="text-2xl font-bold mb-2">{subject.name}</h2>
                {subject.description && (
                    <p className="text-white/90">{subject.description}</p>
                )}
                <div className="mt-2 text-sm text-white/80">
                    Total Entries: {subject.entries?.length || 0}
                </div>
            </div>

            {/* Split Content Area */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Left Column: Entry Form */}
                <div className="w-full lg:w-1/3 border-r bg-gray-50 flex flex-col overflow-hidden">
                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        <h3 className="font-semibold mb-4 text-gray-700">Add Progress Entry</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent outline-none resize-none custom-scrollbar"
                                    placeholder="Describe what you learned or accomplished today..."
                                    rows="4"
                                    required
                                />
                            </div>

                            {/* Hidden File Inputs */}
                            <input
                                ref={imageInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <input
                                ref={pdfInputRef}
                                type="file"
                                accept="application/pdf"
                                onChange={handlePdfUpload}
                                className="hidden"
                            />
                            <input
                                ref={voiceInputRef}
                                type="file"
                                accept="audio/*,audio/webm,audio/mp3,audio/wav,audio/m4a"
                                onChange={handleVoiceUpload}
                                className="hidden"
                            />

                            {/* Attachment Buttons */}
                            <div className="flex flex-wrap gap-3 mb-4">
                                <div className="flex flex-col">
                                    <button
                                        type="button"
                                        onClick={() => imageInputRef.current?.click()}
                                        className={`
                                            flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-300
                                            ${attachments.image
                                                ? `${theme.button} text-white border-transparent`
                                                : `border-gray-300 text-gray-700 hover:border-gray-400`
                                            }
                                        `}
                                    >
                                        <Image className="w-5 h-5" />
                                        <span>Image</span>
                                    </button>
                                    {attachments.image && (
                                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                                            <span className="truncate max-w-[120px]">{attachments.image.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment('image')}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <button
                                        type="button"
                                        onClick={() => pdfInputRef.current?.click()}
                                        className={`
                                            flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-300
                                            ${attachments.pdf
                                                ? `${theme.button} text-white border-transparent`
                                                : `border-gray-300 text-gray-700 hover:border-gray-400`
                                            }
                                        `}
                                    >
                                        <FileText className="w-5 h-5" />
                                        <span>PDF</span>
                                    </button>
                                    {attachments.pdf && (
                                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                                            <span className="truncate max-w-[120px]">{attachments.pdf.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment('pdf')}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <button
                                        type="button"
                                        onClick={() => voiceInputRef.current?.click()}
                                        className={`
                                            flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-300
                                            ${attachments.voice
                                                ? `${theme.button} text-white border-transparent`
                                                : `border-gray-300 text-gray-700 hover:border-gray-400`
                                            }
                                        `}
                                    >
                                        <Mic className="w-5 h-5" />
                                        <span>Voice Note</span>
                                    </button>
                                    {attachments.voice && (
                                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                                            <span className="truncate max-w-[120px]">{attachments.voice.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment('voice')}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className={`
                                    w-full flex items-center justify-center space-x-2
                                    ${theme.button} text-white py-3 rounded-lg
                                    transition-all duration-300 hover:shadow-lg font-medium
                                `}
                            >
                                <Send className="w-5 h-5" />
                                <span>Add Entry</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Progress History */}
                <div className="w-full lg:w-2/3 flex-1 overflow-y-auto custom-scrollbar p-6">
                    <h3 className="font-semibold mb-4 text-gray-700">Progress History</h3>

                    {(!subject.entries || subject.entries.length === 0) ? (
                        <div className="text-center text-gray-500 py-8">
                            <p>No entries yet. Add your first progress entry!</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {Object.entries(
                                subject.entries.reduce((months, entry) => {
                                    const dateObj = new Date(entry.date);
                                    const monthKey = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                                    const dateKey = dateObj.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    });

                                    if (!months[monthKey]) {
                                        months[monthKey] = {};
                                    }
                                    if (!months[monthKey][dateKey]) {
                                        months[monthKey][dateKey] = [];
                                    }
                                    months[monthKey][dateKey].push(entry);
                                    return months;
                                }, {})
                            ).map(([month, dates]) => (
                                <div key={month}>
                                    <button
                                        onClick={() => toggleMonthCollapse(month)}
                                        className={`
                                            w-full flex items-center justify-between mb-3 pl-3 pr-2 py-1
                                            border-l-4 ${theme.border} text-gray-700
                                            hover:bg-gray-50 rounded-r transition-colors group
                                        `}
                                    >
                                        <h4 className="font-bold text-lg">{month}</h4>
                                        <div className="text-gray-400 group-hover:text-gray-600">
                                            {collapsedMonths[month] ? (
                                                <ChevronDown className="w-5 h-5" />
                                            ) : (
                                                <ChevronUp className="w-5 h-5" />
                                            )}
                                        </div>
                                    </button>

                                    {!collapsedMonths[month] && (
                                        <div className="space-y-4 ml-2">
                                            {Object.entries(dates).map(([date, entries]) => (
                                                <div key={date} className="border rounded-lg overflow-hidden shadow-sm">
                                                    {/* Date Header (Collapsible) */}
                                                    <button
                                                        onClick={() => toggleDateCollapse(date)}
                                                        className={`
                                                            w-full flex items-center justify-between p-3
                                                            bg-white hover:bg-gray-50 transition-colors border-b
                                                        `}
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <div className={`w-2 h-8 rounded-full bg-gradient-to-b ${theme.gradient}`} />
                                                            <div className="text-left">
                                                                <div className="font-semibold text-gray-800">{date}</div>
                                                                <div className="text-xs text-gray-500">
                                                                    {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {collapsedDates[date] ? (
                                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                                        ) : (
                                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                                        )}
                                                    </button>

                                                    {/* Entries for this date */}
                                                    {!collapsedDates[date] && (
                                                        <div className="bg-gray-50/50">
                                                            {entries.map((entry, index) => (
                                                                <EntryItem
                                                                    key={entry.id}
                                                                    entry={entry}
                                                                    onDelete={onDeleteEntry}
                                                                    isLast={index === entries.length - 1}
                                                                    onImagePreview={setImagePreview}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Image Preview Modal */}
            {imagePreview && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setImagePreview(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <button
                            onClick={() => setImagePreview(null)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// Separate component for entry items to keep the main component cleaner
function EntryItem({ entry, onDelete, isLast, onImagePreview }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const downloadPdf = (pdfData, fileName) => {
        const link = document.createElement('a');
        link.href = pdfData;
        link.download = fileName;
        link.click();
    };

    return (
        <div className={`p-4 ${!isLast ? 'border-b' : ''}`}>
            <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-500">
                    {new Date(entry.date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
                <button
                    onClick={() => onDelete(entry.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete entry"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <p className="text-gray-700 mb-3">{entry.description}</p>

            {/* Attachments Display */}
            {(entry.attachments?.image || entry.attachments?.pdf || entry.attachments?.voice) && (
                <div className="space-y-3">
                    {/* Image Attachment */}
                    {entry.attachments.image && (
                        <div className="border rounded-lg p-3 bg-blue-50">
                            <div className="flex items-center gap-2 mb-2">
                                <Image className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">{entry.attachments.image.name}</span>
                            </div>
                            <img
                                src={entry.attachments.image.data}
                                alt={entry.attachments.image.name}
                                className="max-w-full h-auto rounded cursor-pointer hover:opacity-90 transition-opacity"
                                style={{ maxHeight: '200px' }}
                                onClick={() => onImagePreview(entry.attachments.image.data)}
                            />
                        </div>
                    )}

                    {/* PDF Attachment */}
                    {entry.attachments.pdf && (
                        <div className="border rounded-lg p-3 bg-red-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-red-600" />
                                    <span className="text-sm font-medium text-red-800">{entry.attachments.pdf.name}</span>
                                </div>
                                <button
                                    onClick={() => downloadPdf(entry.attachments.pdf.data, entry.attachments.pdf.name)}
                                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Download</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Voice Note Attachment */}
                    {entry.attachments.voice && (
                        <div className="border rounded-lg p-3 bg-green-50">
                            <div className="flex items-center gap-2 mb-2">
                                <Mic className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-800">{entry.attachments.voice.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={toggleAudio}
                                    className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                                >
                                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                </button>
                                <audio
                                    ref={audioRef}
                                    src={entry.attachments.voice.data}
                                    onEnded={() => setIsPlaying(false)}
                                    className="flex-1"
                                    controls
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SubjectTile;
