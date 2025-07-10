// components/searchcontrols/quick-search-buttons.jsx

export default function FilterButton({ onQuickSearch }) {
    // If we want to add recent searches to the buttons, this list would be how
  const predefinedQueries = ["restaurants", "parks", "fast food"];

  return (
    <div className="flex flex-wrap gap-2 py-2 px-4">
      {predefinedQueries.map((label) => (
        <button
          key={label}
          className="h-7 text-xs bg-white text-black border-1 border-gray-300 px-3 py-2 rounded hover:bg-blue-700 transition flex items-center justify-center"
          onClick={() => onQuickSearch(label)}
        >
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </button>
      ))}
    </div>
  );
}
