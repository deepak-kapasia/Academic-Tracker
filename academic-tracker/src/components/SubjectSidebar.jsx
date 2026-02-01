import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react';

function SubjectSidebar({
    subjects,
    selectedSubject,
    onSelectSubject,
    onAddSubject,
    onDeleteSubject,
    isCollapsed,
    onToggleCollapse,
    theme,
}) {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name.trim()) {
            onAddSubject(formData);
            setFormData({ name: '', description: '' });
            setShowModal(false);
        }
    };

    const handleDelete = (e, subject) => {
        e.stopPropagation();
        const entryCount = subject.entries?.length || 0;
        const message = entryCount > 0
            ? `Are you sure you want to delete "${subject.name}"? This will delete all ${entryCount} ${entryCount === 1 ? 'entry' : 'entries'}.`
            : `Are you sure you want to delete "${subject.name}"?`;

        if (window.confirm(message)) {
            onDeleteSubject(subject.id);
        }
    };

    return (
        <>
            {/* Sidebar */}
            <div
                className={`
          bg-white rounded-lg shadow-md transition-all duration-300 overflow-hidden
          ${isCollapsed ? 'w-16' : 'w-80'}
        `}
            >
                {/* Header */}
                <div className={`p-4 bg-gradient-to-r ${theme.gradient} text-white flex items-center justify-between`}>
                    {!isCollapsed && (
                        <h3 className="font-bold text-lg">Subjects</h3>
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

                {/* Subject List */}
                <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                    {!isCollapsed && subjects.length === 0 && (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No subjects yet. Add one to get started!
                        </div>
                    )}

                    {subjects.map((subject) => (
                        <div
                            key={subject.id}
                            className={`
                                relative border-b transition-all duration-200
                                ${selectedSubject?.id === subject.id
                                    ? `${theme.button} text-white`
                                    : 'bg-white hover:bg-gray-50'
                                }
                            `}
                        >
                            <button
                                onClick={() => onSelectSubject(subject)}
                                className={`w-full text-left p-4 ${isCollapsed ? 'px-2' : 'pr-12'}`}
                            >
                                {isCollapsed ? (
                                    <div className="text-center font-bold text-lg">
                                        {subject.name[0].toUpperCase()}
                                    </div>
                                ) : (
                                    <div>
                                        <h4 className="font-semibold">{subject.name}</h4>
                                        {subject.description && (
                                            <p className={`text-sm mt-1 ${selectedSubject?.id === subject.id ? 'text-white/80' : 'text-gray-600'
                                                }`}>
                                                {subject.description}
                                            </p>
                                        )}
                                        <p className={`text-xs mt-1 ${selectedSubject?.id === subject.id ? 'text-white/60' : 'text-gray-400'
                                            }`}>
                                            {subject.entries?.length || 0} entries
                                        </p>
                                    </div>
                                )}
                            </button>

                            {/* Delete Button */}
                            {!isCollapsed && (
                                <button
                                    onClick={(e) => handleDelete(e, subject)}
                                    className={`
                                        absolute top-4 right-4 p-1.5 rounded transition-colors
                                        ${selectedSubject?.id === subject.id
                                            ? 'text-white/80 hover:text-white hover:bg-white/20'
                                            : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                        }
                                    `}
                                    title="Delete subject"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add Subject Button */}
                {!isCollapsed && (
                    <div className="p-4 border-t">
                        <button
                            onClick={() => setShowModal(true)}
                            className={`
                w-full flex items-center justify-center space-x-2
                ${theme.button} text-white py-2 rounded-lg
                transition-all duration-300 hover:shadow-lg
              `}
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Subject</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Add Subject Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Add New Subject</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent outline-none"
                                    placeholder="e.g., Mathematics, Physics"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-opacity-50 focus:border-transparent outline-none resize-none"
                                    placeholder="Brief description of the subject"
                                    rows="3"
                                />
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
                                    Add Subject
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default SubjectSidebar;
