import { useEffect, useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import WineTable from "./components/WineTable";
import WineForm from "./components/WineForm";
import "./App.css";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");

  const [wines, setWines] = useState(() => {
    const saved = localStorage.getItem("wines");

    if (saved) {
      return JSON.parse(saved).map((wine) => ({
        ...wine,
        bottles: wine.bottles || [],
        updatedAt:
          wine.updatedAt || new Date().toISOString(),
      }));
    }

    return [];
  });

  useEffect(() => {
    localStorage.setItem("wines", JSON.stringify(wines));
  }, [wines]);

  const [newWine, setNewWine] = useState({
    name: "",
    year: "",
    grape: "",
    country: "",
    location: "",
    bottles: [],
  });

  function resetForm() {
    setNewWine({
      name: "",
      year: "",
      grape: "",
      country: "",
      location: "",
      bottles: [],
    });
  }

  function locationUsed(location, ignoreIndex = null) {
    return wines.some((wine, index) => {
      if (index === ignoreIndex) {
        return false;
      }

      return (wine.bottles || []).some(
        (bottle) =>
          bottle.location.trim().toLowerCase() ===
          location.trim().toLowerCase()
      );
    });
  }

  function addWine() {
    if (
      !newWine.name.trim() ||
      !newWine.year.trim() ||
      !newWine.grape.trim() ||
      !newWine.country.trim() ||
      !newWine.location.trim()
    ) {
      alert("Bitte alle Felder ausfüllen.");
      return;
    }

    if (locationUsed(newWine.location)) {
      alert(
        `❌ Stellplatz ${newWine.location} ist bereits belegt!`
      );
      return;
    }

    const bottle = {
      id: crypto.randomUUID(),
      location: newWine.location.trim(),
    };

    const existing = wines.findIndex(
      (wine) =>
        wine.name.toLowerCase() ===
          newWine.name.trim().toLowerCase() &&
        wine.year === newWine.year.trim() &&
        wine.grape.toLowerCase() ===
          newWine.grape.trim().toLowerCase() &&
        wine.country.toLowerCase() ===
          newWine.country.trim().toLowerCase()
    );

    if (existing >= 0) {
      const updated = [...wines];

      updated[existing] = {
        ...updated[existing],
        bottles: [
          ...updated[existing].bottles,
          bottle,
        ],
        updatedAt: new Date().toISOString(),
      };

      setWines(updated);
    } else {
      setWines([
        ...wines,
        {
          name: newWine.name.trim(),
          year: newWine.year.trim(),
          grape: newWine.grape.trim(),
          country: newWine.country.trim(),
          bottles: [bottle],
          updatedAt: new Date().toISOString(),
        },
      ]);
    }

    resetForm();
    setShowForm(false);
  }

  function editWine(index) {
    const wine = wines[index];

    setNewWine({
      name: wine.name,
      year: wine.year,
      grape: wine.grape,
      country: wine.country,
      location: "",
      bottles: [...wine.bottles],
    });

    setEditIndex(index);
    setShowForm(true);
  }

  function saveEdit() {
    if (editIndex === null) {
      return;
    }

    if (
      !newWine.name.trim() ||
      !newWine.year.trim() ||
      !newWine.grape.trim() ||
      !newWine.country.trim()
    ) {
      alert("Bitte alle Felder ausfüllen.");
      return;
    }

    const locations = newWine.bottles.map(
      (bottle) =>
        bottle.location.trim().toLowerCase()
    );

    if (
      new Set(locations).size !==
      locations.length
    ) {
      alert(
        "❌ Zwei Flaschen dürfen nicht denselben Stellplatz haben."
      );
      return;
    }

    for (const bottle of newWine.bottles) {
      if (
        locationUsed(
          bottle.location,
          editIndex
        )
      ) {
        alert(
          `❌ Stellplatz ${bottle.location} ist bereits von einem anderen Wein belegt!`
        );
        return;
      }
    }

    const updated = [...wines];

    updated[editIndex] = {
      ...updated[editIndex],
      name: newWine.name.trim(),
      year: newWine.year.trim(),
      grape: newWine.grape.trim(),
      country: newWine.country.trim(),
      bottles: newWine.bottles,
      updatedAt: new Date().toISOString(),
    };

    setWines(updated);
    resetForm();
    setEditIndex(null);
    setShowForm(false);
  }

  function deleteWine(index) {
    if (
      window.confirm(
        `Möchtest du "${wines[index].name}" mit allen Flaschen löschen?`
      )
    ) {
      setWines(
        wines.filter((_, i) => i !== index)
      );
    }
  }

  function deleteBottle(
    wineIndex,
    bottleId
  ) {
    const wine = wines[wineIndex];

    const bottle = wine.bottles.find(
      (b) => b.id === bottleId
    );

    if (!bottle) {
      return;
    }

    if (
      !window.confirm(
        `Diese einzelne Flasche löschen?\n\n${wine.name}\nStellplatz: ${bottle.location}`
      )
    ) {
      return;
    }

    const updated = [...wines];

    updated[wineIndex] = {
      ...wine,
      bottles: wine.bottles.filter(
        (b) => b.id !== bottleId
      ),
      updatedAt: new Date().toISOString(),
    };

    if (
      updated[wineIndex].bottles.length === 0
    ) {
      updated.splice(wineIndex, 1);
    }

    setWines(updated);
  }

  /*
   * 🔎 VERBESSERTE SUCHE
   *
   * Die Suche durchsucht:
   * - Name
   * - Jahrgang
   * - Rebsorte
   * - Herkunft
   * - alle Stellplätze
   */
  const filteredWines = wines.filter((wine) => {
    const searchText =
      search.trim().toLowerCase();

    if (!searchText) {
      return true;
    }

    const locations = (
      wine.bottles || []
    )
      .map((bottle) => bottle.location)
      .join(" ");

    const searchableText = [
      wine.name,
      wine.year,
      wine.grape,
      wine.country,
      locations,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(
      searchText
    );
  });

  const totalBottles = wines.reduce(
    (sum, wine) =>
      sum + wine.bottles.length,
    0
  );

  return (
    <div className="app">
      <Header
        bottleCount={totalBottles}
        onAdd={() => {
          resetForm();
          setEditIndex(null);
          setShowForm(true);
        }}
      />

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <WineTable
        wines={filteredWines}
        onEdit={editWine}
        onDelete={deleteWine}
        onDeleteBottle={deleteBottle}
      />

      <WineForm
        show={showForm}
        isEditing={editIndex !== null}
        onClose={() => {
          resetForm();
          setEditIndex(null);
          setShowForm(false);
        }}
        onSave={
          editIndex !== null
            ? saveEdit
            : addWine
        }
        newWine={newWine}
        setNewWine={setNewWine}
      />
    </div>
  );
}

export default App;