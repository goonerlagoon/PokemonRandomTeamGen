const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 4000;

// Load pokedex data
const pokedexPath = path.join(__dirname, "data", "pokedex.json");
if (!fs.existsSync(pokedexPath)) {
  console.error("pokedex.json file not found in the data directory.");
  process.exit(1);
}

const pokedex = JSON.parse(fs.readFileSync(pokedexPath, "utf-8"));

// Group Pokémon by type
let typeGroups = {};

const groupPokemonByType = () => {
  const groups = {};

  Object.values(pokedex).forEach((pokemon) => {
    if (pokemon.types && Array.isArray(pokemon.types)) {
      pokemon.types.forEach((type) => {
        if (!groups[type]) {
          groups[type] = [];
        }
        groups[type].push({
          num: pokemon.num,
          name: pokemon.name,
          types: pokemon.types,
        });
      });
    }
  });

  return groups;
};

// Initialize type groups
try {
  typeGroups = groupPokemonByType();
  console.log("Available Pokémon types:", Object.keys(typeGroups));
} catch (error) {
  console.error("Error grouping Pokémon by type:", error.message);
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Generate a Random Pokémon Team Based on User-Selected Types
const generateTeamBasedOnTypes = (types) => {
  const team = [];

  for (const type of types) {
    const normalizedType = type.trim();
    if (normalizedType && typeGroups[normalizedType] && typeGroups[normalizedType].length > 0) {
      const randomPokemon =
        typeGroups[normalizedType][
          Math.floor(Math.random() * typeGroups[normalizedType].length)
        ];
      team.push(randomPokemon);
    } else {
      throw new Error(`No Pokémon available for type: ${type}`);
    }
  }

  return team;
};

// API Endpoints
app.get("/random-team", (req, res) => {
  const types = req.query.types ? req.query.types.split(",") : [];
  if (types.length !== 6) {
    return res
      .status(400)
      .json({ error: "Exactly 6 types must be provided in the query." });
  }

  try {
    const team = generateTeamBasedOnTypes(types);
    res.json({ team });
  } catch (error) {
    console.error("Error generating random team:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server started successfully at http://localhost:${PORT}`);
});
