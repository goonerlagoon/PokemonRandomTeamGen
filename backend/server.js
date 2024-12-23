const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 4000;

// URL of the hosted pokedex.json file on GitHub
const POKEDEX_URL = "https://play.pokemonshowdown.com/data/pokedex.json";

// Middleware
app.use(
  cors({
    origin: "https://pokemon-random-team-gen.vercel.app", // Replace with your actual frontend URL
    credentials: true,
  })
);
app.use(express.json());

// Cache for Pokémon data
let pokedexCache = null;

// Fetch the Pokémon data dynamically
const fetchPokedexData = async () => {
  if (!pokedexCache) {
    try {
      const response = await axios.get(POKEDEX_URL);
      pokedexCache = response.data;
      console.log("Pokedex data fetched successfully.");
    } catch (error) {
      console.error("Error fetching Pokedex data:", error.message);
      throw new Error("Failed to fetch Pokedex data.");
    }
  }
  return pokedexCache;
};

// Helper Function to Group Pokémon by Type
const groupPokemonByType = (pokedex) => {
  const typeGroups = {};

  Object.values(pokedex).forEach((pokemon) => {
    if (pokemon.types && Array.isArray(pokemon.types)) {
      pokemon.types.forEach((type) => {
        if (!typeGroups[type]) {
          typeGroups[type] = [];
        }
        typeGroups[type].push(pokemon);
      });
    }
  });

  return typeGroups;
};

// Generate a Random Pokémon Team Based on User-Selected Types
const generateTeamBasedOnTypes = (types, typeGroups) => {
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

// API Endpoint for Random Team
app.get("/random-team", async (req, res) => {
  const types = req.query.types ? req.query.types.split(",") : [];
  if (types.length !== 6) {
    return res
      .status(400)
      .json({ error: "Exactly 6 types must be provided in the query." });
  }

  try {
    const pokedex = await fetchPokedexData();
    const typeGroups = groupPokemonByType(pokedex);
    const team = generateTeamBasedOnTypes(types, typeGroups);
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
