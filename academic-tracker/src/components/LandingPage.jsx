import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle2, GraduationCap, Loader2 } from 'lucide-react';

function LandingPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

    // User theme configuration
    const userThemes = {
        Deepak: {
            color: 'deepak',
            gradient: 'from-deepak-400 to-deepak-600',
            hoverGradient: 'hover:from-deepak-500 hover:to-deepak-700',
        },
        Anjali: {
            color: 'anjali',
            gradient: 'from-anjali-400 to-anjali-600',
            hoverGradient: 'hover:from-anjali-500 hover:to-anjali-700',
        },
    };

    // Default theme for any new users
    const defaultTheme = {
        color: 'blue',
        gradient: 'from-blue-400 to-blue-600',
        hoverGradient: 'hover:from-blue-500 hover:to-blue-700',
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE}/users`);
                if (response.ok) {
                    const userNames = await response.json();
                    // Map user names to objects with theme info
                    const usersWithThemes = userNames.map(name => ({
                        name,
                        ...(userThemes[name] || defaultTheme)
                    }));
                    setUsers(usersWithThemes);
                } else {
                    setError('Failed to load users');
                }
            } catch (err) {
                setError('Cannot connect to server');
                console.error('Error fetching users:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-deepak-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading users...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-xl mb-4">{error}</p>
                    <p className="text-gray-500">Please make sure the backend server is running</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="flex justify-center mb-4">
                        <GraduationCap className="w-16 h-16 text-deepak-600" />
                    </div>
                    <h1 className="text-5xl font-bold text-gray-800 mb-3">
                        Academic Progress Tracker
                    </h1>
                    <p className="text-xl text-gray-600">
                        Track your learning journey, one achievement at a time
                    </p>
                </div>

                {/* User Selection Cards */}
                <div className="grid md:grid-cols-2 gap-8">
                    {users.map((user, index) => (
                        <button
                            key={user.name}
                            onClick={() => navigate(`/${user.name}`)}
                            className={`
                card group relative overflow-hidden
                transform transition-all duration-300
                hover:scale-105 hover:-translate-y-2
                ${index === 0 ? 'animate-fade-in' : 'animate-fade-in delay-100'}
              `}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Background Gradient on Hover */}
                            <div className={`
                absolute inset-0 bg-gradient-to-br ${user.gradient}
                opacity-0 group-hover:opacity-10 transition-opacity duration-300
              `} />

                            {/* Content */}
                            <div className="relative p-8">
                                {/* Icon */}
                                <div className={`
                  w-20 h-20 mx-auto mb-4 rounded-full
                  bg-gradient-to-br ${user.gradient}
                  flex items-center justify-center
                  transform transition-transform duration-300
                  group-hover:rotate-12 group-hover:scale-110
                `}>
                                    <UserCircle2 className="w-12 h-12 text-white" />
                                </div>

                                {/* Name */}
                                <h2 className={`
                  text-3xl font-bold mb-2
                  bg-gradient-to-r ${user.gradient}
                  bg-clip-text text-transparent
                `}>
                                    {user.name}
                                </h2>

                                {/* Description */}
                                <p className="text-gray-600 mb-4">
                                    Continue your learning journey
                                </p>

                                {/* Enter Button */}
                                <div className={`
                  inline-block px-6 py-2 rounded-full
                  bg-gradient-to-r ${user.gradient}
                  text-white font-medium
                  transform transition-all duration-300
                  group-hover:shadow-lg
                `}>
                                    Enter Dashboard →
                                </div>
                            </div>

                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white to-transparent opacity-50 rounded-bl-full" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white to-transparent opacity-50 rounded-tr-full" />
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-gray-500">
                    <p>Select your profile to get started</p>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;

