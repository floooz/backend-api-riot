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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
