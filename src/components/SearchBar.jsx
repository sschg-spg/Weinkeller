import "./SearchBar.css";

function SearchBar({ search, setSearch }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="🔍 Wein suchen..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;