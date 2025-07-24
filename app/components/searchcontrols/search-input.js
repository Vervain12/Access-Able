export default function SearchInput({ query, setQuery, onKeyDown }) {
  return (
    <div className="relative w-90">
      <input
        className="w-full h-10 pl-8 pr-2 text-black dark:text-white rounded z-0 relative border-1 border-gray-300"
        placeholder="Search for restaurants, parks, hotels..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <div className="absolute left-1 top-9/30 -translate-y-4/10 transform text-gray-500 pointer-events-none z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11 4a7 7 0 015.657 11.313l4.243 4.243a1 1 0 01-1.414 1.414l-4.243-4.243A7 7 0 1111 4z"
          />
        </svg>
      </div>
    </div>
  );
}
