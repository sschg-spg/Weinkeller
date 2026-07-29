function WineForm({
  show,
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

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>
          {newWine.name ? "Wein bearbeiten" : "Neuen Wein hinzufügen"}
        </h2>

        <input
          type="text"
          placeholder="Name"
          value={newWine.name}
          onChange={(e) => updateField("name", e.target.value)}
        />

        <input
          type="text"
          placeholder="Jahrgang"
          value={newWine.year}
          onChange={(e) => updateField("year", e.target.value)}
        />

        <input
          type="text"
          placeholder="Rebsorte"
          value={newWine.grape}
          onChange={(e) => updateField("grape", e.target.value)}
        />

        <input
          type="text"
          placeholder="Herkunft"
          value={newWine.country}
          onChange={(e) => updateField("country", e.target.value)}
        />

        <input
          type="text"
          placeholder="Lagerort"
          value={newWine.location}
          onChange={(e) => updateField("location", e.target.value)}
        />

        <div className="modal-buttons">
          <button className="cancel" onClick={onClose}>
            Abbrechen
          </button>

          <button className="save" onClick={onSave}>
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}

export default WineForm;