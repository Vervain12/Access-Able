export default function FilterButton({ onQuickSearch, queries = [] }) {
  return (
    <div className="flex flex-wrap gap-2 py-3">
      {queries.map((label) => (
        <button
          key={label}
          className="h-7 text-xs bg-white text-black dark:bg-[var(--secondary)] dark:text-white border-1 border-gray-300 px-3 py-2 my-1 rounded hover:bg-blue-700 transition flex items-center justify-center"
          onClick={() => onQuickSearch(label)}
        >
          {label.charAt(0).toUpperCase() + label.slice(1)}
        </button>
      ))}
    </div>
  );
}
