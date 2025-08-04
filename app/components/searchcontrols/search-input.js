export default function SearchInput({ query, setQuery, onKeyDown }) {
  return (
    <div className="relative w-100">
      <input
        className="w-full h-10 pl-4 pr-2 text-black dark:text-white rounded z-0 relative focus:outline-none"
        placeholder="Search for restaurants, parks, hotels..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
}
