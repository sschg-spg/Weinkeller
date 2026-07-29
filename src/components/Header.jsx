import "./Header.css";

function Header({ onAdd }) {
  return (
    <div className="header">
      <h1>Weinkeller</h1>

      <button onClick={onAdd}>
        + Wein hinzufügen
      </button>
    </div>
  );
}

export default Header;