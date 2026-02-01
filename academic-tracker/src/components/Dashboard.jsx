import { useEffect } from 'react';
import { useParams, useNavigate, Outlet, NavLink } from 'react-router-dom';
import { BookOpen, Calendar, LogOut } from 'lucide-react';

const defaultTheme = {
    primary: 'blue',
    gradient: 'from-blue-500 to-blue-700',
    bgGradient: 'from-blue-50 to-indigo-50',
    text: 'text-blue-700',
    border: 'border-blue-300',
    button: 'bg-blue-600 hover:bg-blue-700',
    buttonOutline: 'border-blue-600 text-blue-600 hover:bg-blue-50',
};

const themes = {
    Deepak: {
        primary: 'deepak',
        gradient: 'from-deepak-500 to-deepak-700',
        bgGradient: 'from-deepak-50 to-blue-50',
        text: 'text-deepak-700',
        border: 'border-deepak-300',
        button: 'bg-deepak-600 hover:bg-deepak-700',
        buttonOutline: 'border-deepak-600 text-deepak-600 hover:bg-deepak-50',
    },
    Anjali: {
        primary: 'anjali',
        gradient: 'from-anjali-500 to-anjali-700',
        bgGradient: 'from-anjali-50 to-purple-50',
        text: 'text-anjali-700',
        border: 'border-anjali-300',
        button: 'bg-anjali-600 hover:bg-anjali-700',
        buttonOutline: 'border-anjali-600 text-anjali-600 hover:bg-anjali-50',
    },
};

function Dashboard() {
    const { user } = useParams();
    const navigate = useNavigate();
    const currentUser = user || '';
    const theme = themes[currentUser] || defaultTheme;

    useEffect(() => {
        if (!user) navigate('/', { replace: true });
    }, [user, navigate]);

    return (
        <div className={`min-h-screen bg-gradient-to-br ${theme.bgGradient}`}>
            {/* Top Navigation Bar */}
            <nav className={`bg-white shadow-md sticky top-0 z-50`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* User Info */}
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}>
                                <span className="text-white font-bold text-lg">
                                    {currentUser[0]}
                                </span>
                            </div>
                            <div>
                                <h2 className={`font-bold ${theme.text}`}>
                                    {currentUser}'s Dashboard
                                </h2>
                                <p className="text-xs text-gray-500">Track your progress</p>
                            </div>
                        </div>

                        {/* View Toggle Buttons */}
                        <div className="flex items-center space-x-2">
                            <NavLink
                                to={`/${currentUser}/subjects`}
                                end
                                className={({ isActive }) =>
                                    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                                        isActive ? `${theme.button} text-white shadow-md` : `border-2 ${theme.buttonOutline}`
                                    }`
                                }
                            >
                                <BookOpen className="w-5 h-5" />
                                <span className="hidden sm:inline">Subject Progress</span>
                            </NavLink>

                            <NavLink
                                to={`/${currentUser}/dailylog`}
                                className={({ isActive }) =>
                                    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                                        isActive ? `${theme.button} text-white shadow-md` : `border-2 ${theme.buttonOutline}`
                                    }`
                                }
                            >
                                <Calendar className="w-5 h-5" />
                                <span className="hidden sm:inline">24-Hour Log</span>
                            </NavLink>

                            {/* Logout Button */}
                            <button
                                onClick={() => navigate('/')}
                                className="ml-4 p-2 text-gray-600 hover:text-red-600 transition-colors duration-300"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Outlet context={{ currentUser, theme }} />
            </main>
        </div>
    );
}

export default Dashboard;
