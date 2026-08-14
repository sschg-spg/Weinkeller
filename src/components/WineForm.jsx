function WineForm({
  show,
  isEditing,
  onClose,
  onSave,
  newWine,
  setNewWine,
}) {
  if (!show) return null;

  function updateField(field, value) {
    setNewWine({
      ...newWine,
      [field]: value,
    });
  }

  function updateBottleLocation(bottleId, value) {
    setNewWine({
      ...newWine,
      bottles: newWine.bottles.map((bottle) =>
        bottle.id === bottleId
          ? {
              ...bottle,
              location: value,
            }
          : bottle
      ),
    });
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>
          {isEditing
            ? "🍷 Wein bearbeiten"
            : "🍷 Wein hinzufügen"}
        </h2>

        <input
          type="text"
          placeholder="Name"
          value={newWine.name}
          onChange={(e) =>
            updateField("name", e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Jahrgang"
          value={newWine.year}
          onChange={(e) =>
            updateField("year", e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Rebsorte"
          value={newWine.grape}
          onChange={(e) =>
            updateField("grape", e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Herkunft"
          value={newWine.country}
          onChange={(e) =>
            updateField("country", e.target.value)
          }
        />

        {!isEditing && (
          <input
            type="text"
            placeholder="Stellplatz, z. B. A-3-4"
            value={newWine.location}
            onChange={(e) =>
              updateField("location", e.target.value)
            }
          />
        )}

        {isEditing && (
          <div className="edit-bottles">
            <h3>📍 Stellplätze der Flaschen</h3>

            {newWine.bottles.map((bottle, index) => (
              <div
                className="edit-bottle-row"
                key={bottle.id}
              >
                <span>
                  Flasche {index + 1}
                </span>

                <input
                  type="text"
                  value={bottle.location}
                  placeholder="A-3-4"
                  onChange={(e) =>
                    updateBottleLocation(
                      bottle.id,
                      e.target.value
                    )
                  }
                />
              </div>
            ))}
          </div>
        )}

        <div className="modal-buttons">
          <button
            className="cancel"
            onClick={onClose}
          >
            Abbrechen
          </button>

          <button
            className="save"
            onClick={onSave}
          >
            {isEditing
              ? "Änderungen speichern"
              : "+ Flasche hinzufügen"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WineForm;