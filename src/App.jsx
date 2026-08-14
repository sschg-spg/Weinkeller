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
      const parsedWines = JSON.parse(saved);

      return parsedWines.map((wine) => ({
        ...wine,
        bottles: wine.bottles || [],
        updatedAt: wine.updatedAt || new Date().toISOString(),
      }));
    }

    return [
      {
        name: "Grüner Veltliner",
        year: "2022",
        grape: "Grüner Veltliner",
        country: "Österreich",
        bottles: [
          {
            id: crypto.randomUUID(),
            location: "A-3-4",
          },
          {
            id: crypto.randomUUID(),
            location: "A-3-5",
          },
        ],
        updatedAt: new Date().toISOString(),
      },
      {
        name: "Chianti Classico",
        year: "2019",
        grape: "Sangiovese",
        country: "Italien",
        bottles: [
          {
            id: crypto.randomUUID(),
            location: "B-2-1",
          },
        ],
        updatedAt: new Date().toISOString(),
      },
    ];
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

  function locationIsOccupied(location, currentWineIndex = null) {
    const normalizedLocation = location.trim().toLowerCase();

    return wines.some((wine, wineIndex) => {
      if (wineIndex === currentWineIndex) {
        return false;
      }

      return (wine.bottles || []).some(
        (bottle) =>
          bottle.location.trim().toLowerCase() === normalizedLocation
      );
    });
  }

  function addWine() {
    const location = newWine.location.trim();

    if (
      !newWine.name.trim() ||
      !newWine.year.trim() ||
      !newWine.grape.trim() ||
      !newWine.country.trim() ||
      !location
    ) {
      alert("Bitte alle Felder ausfüllen.");
      return;
    }

    if (locationIsOccupied(location)) {
      alert(
        `❌ Stellplatz bereits belegt!\n\n${location}\n\nDort steht bereits ein anderer Wein.`
      );
      return;
    }

    const newBottle = {
      id: crypto.randomUUID(),
      location,
    };

    const existingIndex = wines.findIndex(
      (wine) =>
        wine.name.trim().toLowerCase() ===
          newWine.name.trim().toLowerCase() &&
        wine.year.trim().toLowerCase() ===
          newWine.year.trim().toLowerCase() &&
        wine.grape.trim().toLowerCase() ===
          newWine.grape.trim().toLowerCase() &&
        wine.country.trim().toLowerCase() ===
          newWine.country.trim().toLowerCase()
    );

    if (existingIndex !== -1) {
      const updated = [...wines];

      updated[existingIndex] = {
        ...updated[existingIndex],
        bottles: [
          ...(updated[existingIndex].bottles || []),
          newBottle,
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
          bottles: [newBottle],
          updatedAt: new Date().toISOString(),
        },
      ]);
    }

    resetForm();
    setShowForm(false);
  }

  function saveEditedWine() {
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

    const bottles = (newWine.bottles || []).map((bottle) => ({
      ...bottle,
      location: bottle.location.trim(),
    }));

    if (bottles.some((bottle) => !bottle.location)) {
      alert("Jede Flasche muss einen Stellplatz haben.");
      return;
    }

    const locations = bottles.map((bottle) =>
      bottle.location.toLowerCase()
    );

    const duplicateInsideWine =
      new Set(locations).size !== locations.length;

    if (duplicateInsideWine) {
      alert(
        "❌ Derselbe Stellplatz wurde bei mehreren Flaschen dieses Weins eingetragen."
      );
      return;
    }

    for (const bottle of bottles) {
      if (locationIsOccupied(bottle.location, editIndex)) {
        alert(
          `❌ Stellplatz bereits belegt!\n\n${bottle.location}\n\nDort steht bereits ein anderer Wein.`
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
      bottles,
      updatedAt: new Date().toISOString(),
    };

    setWines(updated);

    resetForm();
    setEditIndex(null);
    setShowForm(false);
  }

  function deleteWine(index) {
    const wine = wines[index];

    const confirmed = window.confirm(
      `Möchtest du "${wine.name}" wirklich löschen?\n\nDabei werden alle ${
        wine.bottles?.length || 0
      } Flaschen dieses Weins entfernt.`
    );

    if (!confirmed) {
      return;
    }

    setWines(wines.filter((_, i) => i !== index));
  }

  function editWine(index) {
    const wine = wines[index];

    setNewWine({
      name: wine.name,
      year: wine.year,
      grape: wine.grape,
      country: wine.country,
      location: "",
      bottles: (wine.bottles || []).map((bottle) => ({
        ...bottle,
      })),
    });

    setEditIndex(index);
    setShowForm(true);
  }

  function openAddForm() {
    setEditIndex(null);
    resetForm();
    setShowForm(true);
  }

  const filteredWines = wines.filter((wine) => {
    const text = `
      ${wine.name}
      ${wine.year}
      ${wine.grape}
      ${wine.country}
      ${(wine.bottles || []).map((bottle) => bottle.location).join(" ")}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const totalBottles = wines.reduce(
    (total, wine) => total + (wine.bottles?.length || 0),
    0
  );

  return (
    <div className="app">
      <Header
        bottleCount={totalBottles}
        onAdd={openAddForm}
      />

      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <WineTable
        wines={filteredWines}
        onDelete={deleteWine}
        onEdit={editWine}
      />

      <WineForm
        show={showForm}
        isEditing={editIndex !== null}
        onClose={() => {
          setShowForm(false);
          setEditIndex(null);
          resetForm();
        }}
        onSave={
          editIndex !== null
            ? saveEditedWine
            : addWine
        }
        newWine={newWine}
        setNewWine={setNewWine}
      />
    </div>
  );
}

export default App;