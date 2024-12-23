import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const availableTypes = [
  "Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison",
  "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark",
  "Steel", "Fairy",
];

function App() {
  const [selectedTypes, setSelectedTypes] = useState(Array(6).fill(""));
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTypeChange = (index, value) => {
    const updatedTypes = [...selectedTypes];
    updatedTypes[index] = value;
    setSelectedTypes(updatedTypes);
  };

  const generateRandomTypes = () => {
    const shuffled = [...availableTypes].sort(() => 0.5 - Math.random());
    setSelectedTypes(shuffled.slice(0, 6));
  };

  const fetchTeam = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:4000/random-team", {
        params: { types: selectedTypes.join(",") },
      });
      setTeam(response.data.team);
    } catch (err) {
      console.error("Error fetching team:", err.message);
      setError("Failed to fetch a random team. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1 className="header">Random Pokémon Team Generator</h1>

      <div className="selector-container">
        <div className="dropdown-container">
          {selectedTypes.map((type, index) => (
            <select
              key={index}
              value={type}
              onChange={(e) => handleTypeChange(index, e.target.value)}
              className="dropdown"
            >
              <option value="">Choose...</option>
              {availableTypes.map((typeOption) => (
                <option key={typeOption} value={typeOption}>
                  {typeOption}
                </option>
              ))}
            </select>
          ))}
        </div>

        <div className="button-container">
          <button onClick={generateRandomTypes} className="pink-button">
            I'm Feeling Lucky
          </button>
          <button
            onClick={fetchTeam}
            disabled={loading || selectedTypes.some((type) => type === "")}
            className={`blue-button ${
              loading || selectedTypes.some((type) => type === "")
                ? "disabled-button"
                : ""
            }`}
          >
            {loading ? "Generating Team..." : "Generate Team"}
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {team.length > 0 ? (
        <div className="team-container">
          {team.map((pokemon, index) => (
            <div key={index} className="pokemon-card">
              <div className="card-content">
                <img
                  src={`https://play.pokemonshowdown.com/sprites/ani/${pokemon.name.toLowerCase()}.gif`}
                  alt={pokemon.name}
                  className="sprite"
                />
                <p className="pokemon-name">{pokemon.name}</p>
                {pokemon.types && (
                  <p className="pokemon-types">{pokemon.types.join(", ")}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="no-team-text">No team generated yet.</p>
      )}
    </div>
  );
}

export default App;
