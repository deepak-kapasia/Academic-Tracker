import { Clock, Trash2 } from 'lucide-react';

function TimelineView({ date, onUpdateLog, theme }) {
    const handleInputChange = (hour, value) => {
        onUpdateLog(hour, value);
    };

    const formatDisplayDate = (dateString) => {
        const dateObj = new Date(dateString + 'T00:00:00');
        return dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
        <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
            {/* Header */}
            <div className={`p-6 bg-gradient-to-r ${theme.gradient} text-white rounded-t-lg`}>
                <div className="flex items-center space-x-3">
                    <Clock className="w-8 h-8" />
                    <div>
                        <h2 className="text-2xl font-bold">{formatDisplayDate(date.date)}</h2>
                        <p className="text-white/90">24-Hour Activity Log</p>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="space-y-4">
                    {hours.map((hour) => {
                        const hourLabel = hour.toString().padStart(2, '0') + ':00';
                        const nextHourLabel = ((hour + 1) % 24).toString().padStart(2, '0') + ':00';

                        return (
                            <div key={hour} className="flex gap-4 items-start group">
                                {/* Time Label */}
                                <div className="flex-shrink-0 w-24">
                                    <div className={`
                    text-sm font-semibold ${theme.text}
                    bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent
                  `}>
                                        {hourLabel}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        to {nextHourLabel}
                                    </div>
                                </div>

                                {/* Timeline Line */}
                                <div className="flex-shrink-0 flex flex-col items-center pt-1">
                                    <div className={`
                    w-3 h-3 rounded-full
                    ${date.logs[hour]?.trim() !== ''
                                            ? `bg-gradient-to-br ${theme.gradient}`
                                            : 'bg-gray-300'
                                        }
                    transition-all duration-300
                    group-hover:scale-125
                  `} />
                                    {hour < 23 && (
                                        <div className={`
                      w-0.5 h-16
                      ${date.logs[hour]?.trim() !== ''
                                                ? `bg-gradient-to-b ${theme.gradient} opacity-30`
                                                : 'bg-gray-200'
                                            }
                    `} />
                                    )}
                                </div>

                                {/* Input Area */}
                                <div className="flex-1 pb-4">
                                    <div className="relative">
                                        <textarea
                                            value={date.logs[hour] || ''}
                                            onChange={(e) => handleInputChange(hour, e.target.value)}
                                            placeholder={`What did you do during ${hourLabel}?`}
                                            className="
                      w-full px-4 py-3 border-2 border-gray-200 rounded-lg
                      focus:border-opacity-50 focus:ring-2 focus:ring-opacity-30
                      outline-none resize-none custom-scrollbar
                      transition-all duration-300
                      hover:border-gray-300
                      focus:shadow-md
                      pr-10
                    "
                                            rows="3"
                                        />
                                        {/* Delete Button */}
                                        {date.logs[hour]?.trim() !== '' && (
                                            <button
                                                onClick={() => handleInputChange(hour, '')}
                                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors bg-white/80 rounded-full p-1"
                                                title="Clear entry"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Character count */}
                                    {date.logs[hour]?.trim() !== '' && (
                                        <div className="text-xs text-gray-400 mt-1 text-right">
                                            {date.logs[hour].length} characters
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Completion Summary */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                            Daily Log Progress
                        </span>
                        <span className={`text-sm font-bold ${theme.text}`}>
                            {date.logs.filter(log => log.trim() !== '').length}/24 hours logged
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r ${theme.gradient} transition-all duration-500`}
                            style={{
                                width: `${(date.logs.filter(log => log.trim() !== '').length / 24) * 100}%`
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TimelineView;
