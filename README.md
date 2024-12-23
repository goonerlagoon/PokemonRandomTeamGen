# Random Pokémon Team Generator

A retro-themed web application to generate Pokémon teams based on selected or random types. Users can save their teams with custom names to a database and view the saved list. 

Here's a live version of it: https://pokemon-random-team-gen.vercel.app/

---

## Features

- Select up to six Pokémon types to generate a custom team.
- "I'm Feeling Lucky" button for random team generation.
- Save generated teams with custom names to a database.
- View a list of saved teams directly in the app.
- Retro arcade-inspired design with animated transitions.

---

## Technologies Used

### Frontend
- **React**: JavaScript library for building user interfaces.
- **CSS**: Custom styles with retro arcade fonts and themes.
- **Axios**: HTTP client for API requests.

### Backend
- **Node.js**: Server runtime environment.
- **Express.js**: Backend framework for building APIs.
- **MongoDB**: NoSQL database for storing saved teams.

### Other Tools
- **Pokémon Showdown API**: Source for Pokémon data.

---

## Installation and Setup

### Prerequisites
Ensure you have the following installed on your system:
- **Node.js**: [Download here](https://nodejs.org/)
- **MongoDB**: [Download here](https://www.mongodb.com/try/download/community)
- **Git**: [Download here](https://git-scm.com/)

### Clone the Repository
```bash
git clone https://github.com/yourusername/random-pokemon-team-generator.git
cd random-pokemon-team-generator

## Backend
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file in the backend directory and add the following:
# .env file
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/pokemon-teams

# Start the backend server
npm start

## Frontend
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend application
npm start

# Open your browser at http://localhost:3000

