import "./WineTable.css";

function WineTable({ wines, onDelete, onEdit }) {
  if (wines.length === 0) {
    return (
      <div className="no-wines">
        <h3>🍷 Keine Weine gefunden.</h3>
      </div>
    );
  }

  return (
    <table className="wine-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Jahrgang</th>
          <th>Rebsorte</th>
          <th>Herkunft</th>
          <th>Lagerort</th>
          <th>Aktionen</th>
        </tr>
      </thead>

      <tbody>
        {wines.map((wine, index) => (
          <tr key={index}>
            <td>{wine.name}</td>
            <td>{wine.year}</td>
            <td>{wine.grape}</td>
            <td>{wine.country}</td>
            <td>{wine.location}</td>

            <td className="actions">
              <button
                className="edit-btn"
                onClick={() => onEdit(index)}
              >
                ✏️ Bearbeiten
              </button>

              <button
                className="delete-btn"
                onClick={() => onDelete(index)}
              >
                🗑 Löschen
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default WineTable;