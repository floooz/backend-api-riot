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

// Route pour récupérer le rank d'un joueur
app.get('/api/rank/:username/:tag', async (req, res) => {
  const { username, tag } = req.params;
  try {
    const info_account = await axios.get(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/${tag}`, {
      headers: { 'X-Riot-Token': process.env.RIOT_API_KEY }
    });
    const info_summ = await axios.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${info_account.data.puuid}`, {
      headers: { 'X-Riot-Token': process.env.RIOT_API_KEY }
    });
    const rank_summ = await axios.get(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${info_summ.data.id}`, {
      headers: { 'X-Riot-Token': process.env.RIOT_API_KEY }
    });

    for (let i = 0; i < rank_summ.data.length; i++) {
      if (rank_summ.data[i].queueType === "RANKED_SOLO_5x5") {
        res.json(rank_summ.data[i]);
        return;
      } else {
        res.json({ error: "No ranked solo queue found." });
      }
    }
    
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).json({ error: error.message });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(500).json({ error: "No response received from the server." });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({ error: error.message });
    }
  }
});





app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

