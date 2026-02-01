import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, ChevronDown, X, Trash2 } from 'lucide-react';

function DateSidebar({
    dates,
    selectedDate,
    onSelectDate,
    onAddDate,
    onDeleteDate,
    isCollapsed,
    onToggleCollapse,
    theme,
}) {
    const [showModal, setShowModal] = useState(false);
    const [selectedDateInput, setSelectedDateInput] = useState('');
    // Initialize with current month expanded
    const [expandedMonths, setExpandedMonths] = useState({
        [new Date().getMonth()]: true
    });

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const toggleMonth = (index) => {
        setExpandedMonths(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleAddDateClick = (e, monthIndex) => {
        e.stopPropagation(); // Prevent toggling the month when clicking add
        const year = new Date().getFullYear();
        // Default to the first day of the month, or today if it's the current month
        let day = '01';
        const today = new Date();
        if (monthIndex === today.getMonth() && year === today.getFullYear()) {
            day = String(today.getDate()).padStart(2, '0');
        }

        const month = String(monthIndex + 1).padStart(2, '0');
        setSelectedDateInput(`${year}-${month}-${day}`);
        setShowModal(true);

        // Ensure the month is expanded
        setExpandedMonths(prev => ({ ...prev, [monthIndex]: true }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedDateInput) {
            onAddDate(selectedDateInput);
            setSelectedDateInput('');
            setShowModal(false);
        }
    };

    const formatDisplayDate = (dateString) => {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric'
        });
    };

    // Group dates by month
    const datesByMonth = Array(12).fill(null).map(() => []);
    if (Array.isArray(dates)) {
        dates.forEach(dateObj => {
            if (!dateObj || !dateObj.date) return;
            const d = new Date(dateObj.date);
            if (!isNaN(d.getTime())) {
                const month = d.getMonth();
                if (month >= 0 && month < 12) {
                    datesByMonth[month].push(dateObj);
                }
            }
        });
    }

    // Sort dates within each month (descending)
    datesByMonth.forEach(group => {
        group.sort((a, b) => new Date(b.date) - new Date(a.date));
    });

    return (
        <>
            {/* Sidebar */}
            <div
                className={`
          bg-white rounded-lg shadow-md transition-all duration-300 overflow-hidden flex flex-col
          ${isCollapsed ? 'w-16' : 'w-80'}
        `}
            >
                {/* Header */}
                <div className={`p-4 bg-gradient-to-r ${theme.gradient} text-white flex items-center justify-between shrink-0`}>
                    {!isCollapsed && (
                        <h3 className="font-bold text-lg">2026 Log</h3>
                    )}
                    <button
                        onClick={onToggleCollapse}
                        className="p-1 hover:bg-white/20 rounded transition-colors"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-5 h-5" />
                        ) : (
                            <ChevronLeft className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Month List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {monthNames.map((monthName, index) => {
                        const monthDates = datesByMonth[index];
                        const isExpanded = expandedMonths[index];
                        const hasDates = monthDates.length > 0;

                        if (isCollapsed) {
                            return hasDates ? (
                                <div key={index} className="p-2 text-center border-b text-xs font-bold text-gray-500">
                                    {monthName.substring(0, 3)}
                                </div>
                            ) : null;
                        }

                        return (
                            <div key={index} className="border-b last:border-b-0">
                                {/* Month Header */}
                                <div
                                    onClick={() => toggleMonth(index)}
                                    className={`
                                        w-full flex items-center justify-between p-3 cursor-pointer
                                        hover:bg-gray-50 transition-colors
                                        ${isExpanded ? 'bg-gray-50' : ''}
                                    `}
                                >
                                    <div className="flex items-center space-x-2">
                                        <h4 className={`font-semibold ${hasDates ? 'text-gray-800' : 'text-gray-400'}`}>
                                            {monthName}
                                        </h4>
                                        {hasDates && (
                                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                                                {monthDates.length}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {isExpanded ? (
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Dates List (Collapsible) */}
                                {isExpanded && (
                                    <div className="bg-gray-50/50 shadow-inner">
                                        {/* Add Date Button Inside Month */}
                                        <button
                                            onClick={(e) => handleAddDateClick(e, index)}
                                            className={`
                                                w-full flex items-center justify-center p-2 mb-1
                                                text-sm text-gray-500 hover:text-green-600 hover:bg-green-50
                                                transition-colors border-b border-gray-100
                                            `}
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            Add Date
                                        </button>

                                        {monthDates.length === 0 ? (
                                            <div className="p-3 text-center text-gray-400 text-sm italic">
                                                No dates logged
                                            </div>
                                        ) : (
                                            monthDates.map((date) => {
                                                const filledHours = date.logs.filter(log => log.trim() !== '').length;
                                                return (
                                                    <div
                                                        key={date.id}
                                                        role="button"
                                                        tabIndex={0}
                                                        onClick={() => onSelectDate(date)}
                                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectDate(date); } }}
                                                        className={`
                                                            w-full flex items-center gap-2 px-4 py-3 border-b border-gray-100 last:border-0 pl-8 cursor-pointer
                                                            transition-all duration-200
                                                            ${selectedDate?.id === date.id
                                                                ? `${theme.button} text-white`
                                                                : 'hover:bg-white hover:shadow-sm'
                                                            }
                                                        `}
                                                    >
                                                        <div className="flex-1 flex justify-between items-center min-w-0">
                                                            <span className="font-medium">{formatDisplayDate(date.date)}</span>
                                                            <span className={`text-xs shrink-0 ml-2 ${selectedDate?.id === date.id ? 'text-white/80' : 'text-gray-400'}`}>
                                                                {filledHours}/24h
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDeleteDate?.(date);
                                                            }}
                                                            className={`p-1.5 rounded transition-colors shrink-0 ${
                                                                selectedDate?.id === date.id
                                                                    ? 'hover:bg-white/20 text-white'
                                                                    : 'hover:bg-red-50 text-gray-400 hover:text-red-600'
                                                            }`}
                                                            title="Delete date"
                                                            aria-label="Delete date"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Quick Add Today (Optional, maybe keep it fixed at bottom?) */}
                {/* Removing the generic "Add Date" button since we have per-month add now */}
            </div>

            {/* Add Date Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Add New Date</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Date
                                </label>
                                <input
                                    type="date"
                                    value={selectedDateInput}
                                    onChange={(e) => setSelectedDateInput(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent outline-none"
                                    required
                                    autoFocus
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Select a date to create a 24-hour log
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-6 py-2 ${theme.button} text-white rounded-lg transition-all duration-300`}
                                >
                                    Add Date
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default DateSidebar;
