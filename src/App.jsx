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
      return JSON.parse(saved);
    }

    return [
      {
        name: "Grüner Veltliner",
        year: "2022",
        grape: "Grüner Veltliner",
        country: "Österreich",
        location: "Regal A1",
      },
      {
        name: "Chianti Classico",
        year: "2019",
        grape: "Sangiovese",
        country: "Italien",
        location: "Regal B2",
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
  });

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

    if (editIndex === null) {
      setWines([...wines, newWine]);
    } else {
      const updated = [...wines];
      updated[editIndex] = newWine;
      setWines(updated);
      setEditIndex(null);
    }

    setNewWine({
      name: "",
      year: "",
      grape: "",
      country: "",
      location: "",
    });

    setShowForm(false);
  }

  function deleteWine(index) {
    setWines(wines.filter((_, i) => i !== index));
  }

  function editWine(index) {
    setNewWine(wines[index]);
    setEditIndex(index);
    setShowForm(true);
  }

  const filteredWines = wines.filter((wine) => {
    const text = `${wine.name} ${wine.year} ${wine.grape} ${wine.country} ${wine.location}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div className="app">
      <Header
        onAdd={() => {
          setEditIndex(null);

          setNewWine({
            name: "",
            year: "",
            grape: "",
            country: "",
            location: "",
          });

          setShowForm(true);
        }}
      />

      <SearchBar search={search} setSearch={setSearch} />

      <WineTable
        wines={filteredWines}
        onDelete={deleteWine}
        onEdit={editWine}
      />

      <WineForm
        show={showForm}
        onClose={() => {
          setShowForm(false);
          setEditIndex(null);
        }}
        onSave={addWine}
        newWine={newWine}
        setNewWine={setNewWine}
      />
    </div>
  );
}

export default App;