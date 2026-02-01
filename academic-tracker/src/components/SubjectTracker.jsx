import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import SubjectSidebar from './SubjectSidebar';
import SubjectTile from './SubjectTile';

function SubjectTracker() {
    const { currentUser, theme } = useOutletContext();
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

    // Reset selected subject when user changes
    useEffect(() => {
        setSelectedSubject(null);
        setSubjects([]);
    }, [currentUser]);

    // Load subjects from API
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await fetch(`${API_BASE}/${currentUser}/subjects`);
                if (response.ok) {
                    const data = await response.json();
                    setSubjects(data);
                    // Always select first subject after fresh fetch
                    if (data.length > 0) {
                        setSelectedSubject(data[0]);
                    } else {
                        setSelectedSubject(null);
                    }
                }
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        if (currentUser) {
            fetchSubjects();
        }
    }, [currentUser, API_BASE]);

    // Save subjects to API (Helper function)
    const saveSubjectsToApi = async (newSubjects) => {
        try {
            await fetch(`${API_BASE}/${currentUser}/subjects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSubjects),
            });
        } catch (error) {
            console.error('Error saving subjects:', error);
        }
    };

    const addSubject = async (subjectData) => {
        const newSubject = {
            id: Date.now().toString(),
            ...subjectData,
            entries: [],
            createdAt: new Date().toISOString(),
        };
        const updatedSubjects = [...subjects, newSubject];
        setSubjects(updatedSubjects);
        setSelectedSubject(newSubject);
        await saveSubjectsToApi(updatedSubjects);
    };

    const addEntry = async (entryData) => {
        if (!selectedSubject) return;

        const updatedSubjects = subjects.map(subject => {
            if (subject.id === selectedSubject.id) {
                const newEntry = {
                    id: Date.now().toString(),
                    ...entryData,
                    date: new Date().toISOString(),
                };
                return {
                    ...subject,
                    entries: [newEntry, ...subject.entries],
                };
            }
            return subject;
        });

        setSubjects(updatedSubjects);

        const updated = updatedSubjects.find(s => s.id === selectedSubject.id);
        setSelectedSubject(updated);
        await saveSubjectsToApi(updatedSubjects);
    };

    const deleteEntry = async (entryId) => {
        if (!selectedSubject) return;

        const updatedSubjects = subjects.map(subject => {
            if (subject.id === selectedSubject.id) {
                return {
                    ...subject,
                    entries: subject.entries.filter(entry => entry.id !== entryId),
                };
            }
            return subject;
        });

        setSubjects(updatedSubjects);

        const updated = updatedSubjects.find(s => s.id === selectedSubject.id);
        setSelectedSubject(updated);
        await saveSubjectsToApi(updatedSubjects);
    };

    const deleteSubject = async (subjectId) => {
        const updatedSubjects = subjects.filter(subject => subject.id !== subjectId);
        setSubjects(updatedSubjects);

        // Update API
        await saveSubjectsToApi(updatedSubjects);

        // Update selected subject
        if (selectedSubject?.id === subjectId) {
            setSelectedSubject(updatedSubjects.length > 0 ? updatedSubjects[0] : null);
        }
    };

    return (
        <div className="flex gap-6 h-[calc(100vh-120px)]">
            {/* Sidebar */}
            <SubjectSidebar
                subjects={subjects}
                selectedSubject={selectedSubject}
                onSelectSubject={setSelectedSubject}
                onAddSubject={addSubject}
                onDeleteSubject={deleteSubject}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                theme={theme}
            />

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                {selectedSubject ? (
                    <SubjectTile
                        subject={selectedSubject}
                        onAddEntry={addEntry}
                        onDeleteEntry={deleteEntry}
                        theme={theme}
                    />
                ) : (
                    <div className="card h-full flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <p className="text-xl mb-2">No subject selected</p>
                            <p className="text-sm">Add a new subject to get started</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SubjectTracker;
