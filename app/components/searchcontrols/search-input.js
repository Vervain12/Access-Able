export default function SearchInput({ query, setQuery, onKeyDown }) {
  return (
    <input
      style={{
        width: 1000,
        height: 40,
        marginBottom: 16,
        borderRadius: 8,
        border: "1px solid #ddd",
        padding: 8,
        color: "black",
        marginLeft: 10,
        backgroundColor: "white",
      }}
      placeholder="Enter query"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={onKeyDown}
    />
  );
}
