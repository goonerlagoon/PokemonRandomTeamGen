import React, { useState } from "react";
import axios from "axios";

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
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Random Pokémon Team Generator</h1>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          {selectedTypes.map((type, index) => (
            <select
              key={index}
              value={type}
              onChange={(e) => handleTypeChange(index, e.target.value)}
              style={{
                padding: "10px",
                margin: "5px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
              }}
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

        <button
          onClick={generateRandomTypes}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          I'm Feeling Lucky
        </button>

        <button
          onClick={fetchTeam}
          disabled={loading || selectedTypes.some((type) => type === "")}
          style={{
            padding: "10px 20px",
            backgroundColor: loading || selectedTypes.some((type) => type === "") ? "#ccc" : "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: loading || selectedTypes.some((type) => type === "") ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Generating Team..." : "Generate Team"}
        </button>
      </div>

      {error && (
        <div style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {team.length > 0 ? (
        <div style={{ textAlign: "center" }}>
          <h2 style={{ color: "#007bff" }}>Your Random Pokémon Team</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {team.map((pokemon, index) => (
              <li
                key={index}
                style={{
                  margin: "10px 0",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  backgroundColor: "#f9f9f9",
                }}
              >
                <strong>{pokemon.name}</strong>
                {pokemon.types && (
                  <p>
                    Types:{" "}
                    <span style={{ color: "#6c757d" }}>
                      {pokemon.types.join(", ")}
                    </span>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !loading && <p style={{ textAlign: "center" }}>No team generated yet.</p>
      )}
    </div>
  );
}

export default App;
