import { useState } from "react";
import "./WineTable.css";

function WineTable({ wines, onDelete, onEdit }) {
  const [openMenu, setOpenMenu] = useState(null);

  function formatDate(dateString) {
    if (!dateString) {
      return "Unbekannt";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Unbekannt";
    }

    return date.toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

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
          <th>Stückzahl</th>
          <th>Aktionen</th>
        </tr>
      </thead>

      <tbody>
        {wines.map((wine, index) => {
          const bottles = wine.bottles || [];

          return (
            <tr key={index}>
              <td>{wine.name}</td>

              <td>{wine.year}</td>

              <td>{wine.grape}</td>

              <td>{wine.country}</td>

              <td>
                <strong>{bottles.length}</strong>{" "}
                {bottles.length === 1
                  ? "Flasche"
                  : "Flaschen"}
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
                      setOpenMenu(
                        openMenu === index ? null : index
                      )
                    }
                    title="Stellplätze anzeigen"
                  >
                    ⋮
                  </button>

                  {openMenu === index && (
                    <div className="wine-menu-popup">
                      <div className="menu-title">
                        🍷 {wine.name}
                      </div>

                      <div className="menu-subtitle">
                        📍 Stellplätze
                      </div>

                      <div className="bottle-list">
                        {bottles.length === 0 ? (
                          <div className="empty-location">
                            Keine Stellplätze
                          </div>
                        ) : (
                          bottles.map((bottle, bottleIndex) => (
                            <div
                              className="bottle-location"
                              key={bottle.id || bottleIndex}
                            >
                              <span>
                                Flasche {bottleIndex + 1}
                              </span>

                              <strong>
                                📍 {bottle.location}
                              </strong>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="menu-total">
                        🍾 Gesamt:{" "}
                        <strong>{bottles.length}</strong>{" "}
                        {bottles.length === 1
                          ? "Flasche"
                          : "Flaschen"}
                      </div>

                      <div className="menu-updated">
                        🕒 Zuletzt geändert
                        <br />
                        <strong>
                          {formatDate(wine.updatedAt)}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default WineTable;