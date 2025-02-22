export const TabNavigation = ({ tabs, activeTab, onTabChange }) => (
    <nav className="flex-1 flex flex-row">
        {Object.entries(tabs).map(([key, label]) => (
            <button
                key={key}
                className={`flex-1 py-4 font-semibold transition-colors hover:bg-green-600 hover:text-white ${activeTab === key ? "text-green-600 border-b-2 border-green-600" : "text-white"
                    }`}
                onClick={() => onTabChange(key)}
            >
                {label}
            </button>
        ))}
    </nav>
);