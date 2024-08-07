const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Permettre les requêtes cross-origin pour faciliter les tests

// Route pour obtenir les informations de l'utilisateur
app.get('/api/user/:username/:tag', async (req, res) => {
  const { username, tag } = req.params;
  try {
    const response = await axios.get(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${tag}`, {
      headers: { 'X-Riot-Token': process.env.RIOT_API_KEY }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.message });
  }
});

// Route pour obtenir les informations de l'utilisateur en mode spectateur (partie en cours)
app.get('/spec/puuid/:puuid', async (req, res) => {
  const { puuid } = req.params;
  try { 
    const response = await axios.get(`https://euw1.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/${puuid}`, {
      headers: { 'X-Riot-Token': process.env.RIOT_API_KEY }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.message });
  }
});

// Route pour obtenir les informations de l'utilisateur avec puuid
app.get('/api/user/puuid/:puuid', async (req, res) => {
  const { puuid } = req.params;
  try {
    const response = await axios.get(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/${puuid}`, {
      headers: { 'X-Riot-Token': process.env.RIOT_API_KEY }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.message });
  }
});

// Route pour obtenir les informations du dernier match de l'utilisateur
app.get('/api/match/puuid/:puuid', async (req, res) => {
  const { puuid } = req.params;
  try {
    const response = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=1`, {
      headers: { 'X-Riot-Token': process.env.RIOT_API_KEY }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.message });
  }
});
// Route pour obtenir les informations du dernier match de l'utilisateur

app.get('/api/match/:matchId', async (req, res) => {
  const { matchId } = req.params;
  try {
    const response = await axios.get(`https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}`, {
      headers: { 'X-Riot-Token': process.env.RIOT_API_KEY }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.message });
  }
});

// Route pour obtenir les informations des maitrises d'un champion pour un utilisateur
app.get('/api/champion-mastery/:puuid/:championId', async (req, res) => {
  const { puuid, championId } = req.params;
  try {
    const response = await axios.get(`https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/by-champion/${championId}`, {
      headers: { 'X-Riot-Token': process.env.RIOT_API_KEY }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

