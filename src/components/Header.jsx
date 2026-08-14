import "./Header.css";

function Header({ onAdd, bottleCount }) {
  return (
    <div className="header">
        <div>
            <h1>Weinkeller</h1>

            <p className="bottle-count">
                🍷 Insgesamt {bottleCount} Flasche{bottleCount === 1 ? "" : "n"}
            </p>
        </div>

        <button className="add-button" onClick={onAdd}>
            + Wein hinzufügen
        </button>
    </div>
);
}

export default Header;