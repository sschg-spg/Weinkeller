import { useState } from "react";
import "./WineTable.css";

function WineTable({ wines, onEdit, onDelete, onDeleteBottle }) {
  const [menu, setMenu] = useState(null);

  if (!wines.length) {
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
          <th>Stückzahl</th>
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

            <td>
              <strong>
                {wine.bottles.length}{" "}
                {wine.bottles.length === 1 ? "Flasche" : "Flaschen"}
              </strong>
            </td>

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

              <div className="wine-menu">
                <button
                  className="menu-btn"
                  onClick={() =>
                    setMenu(menu === index ? null : index)
                  }
                >
                  ⋮
                </button>

                {menu === index && (
                  <div className="wine-menu-popup">
                    <div className="menu-title">
                      🍷 {wine.name}
                    </div>

                    <div className="menu-subtitle">
                      📍 Stellplätze
                    </div>

                    <div className="bottle-list">
                      {wine.bottles.map((bottle, i) => (
                        <div
                          className="bottle-location"
                          key={bottle.id}
                        >
                          <span>
                            Flasche {i + 1}
                          </span>

                          <strong>
                            📍 {bottle.location}
                          </strong>

                          <button
                            className="bottle-delete-btn"
                            onClick={() =>
                              onDeleteBottle(index, bottle.id)
                            }
                          >
                            🗑
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="menu-total">
                      🍾 Gesamt: {wine.bottles.length} Flaschen
                    </div>

                    <div className="menu-updated">
                      🕐 Zuletzt geändert
                      <br />
                      <strong>
                        {wine.updatedAt
                          ? new Date(
                              wine.updatedAt
                            ).toLocaleString("de-AT")
                          : "Keine Angabe"}
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default WineTable;