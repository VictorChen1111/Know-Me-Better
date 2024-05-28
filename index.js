const express = require('express');
require('dotenv').config();
const session = require('express-session');
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Set the views directory and view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Instagram OAuth URL
const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;

// Middleware for parsing request bodies and managing sessions
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));


// Route for the login page
app.get('/', (req, res) => {
    res.render('login', { instagramAuthUrl: instagramAuthUrl });
});

// Instagram OAuth callback route
app.get('/auth/instagram/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.send('No code provided');
    }

    // Prepare parameters for exchanging the code for an access token
    const params = new URLSearchParams();
    params.append('client_id', process.env.INSTAGRAM_APP_ID);
    params.append('client_secret', process.env.INSTAGRAM_APP_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', process.env.REDIRECT_URI);
    params.append('code', code);
    
    try {
        // Exchange the code for an access token
        const response = await axios.post('https://api.instagram.com/oauth/access_token', params.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = response.data.access_token;
        req.session.accessToken = accessToken;
        res.redirect('/instagram-content');
    } catch (error) {
        console.error('Error fetching Instagram tokens:', error.response ? error.response.data : error);
        res.status(500).send('Authentication failed');
    }
});

// Route to fetch and display Instagram content
app.get('/instagram-content', async (req, res) => {
    if (!req.session.accessToken) return res.status(401).redirect('/');

    try {
        // Fetch user's media from Instagram
        const mediaResponse = await axios.get(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,username,timestamp&access_token=${req.session.accessToken}`);
        const mediaData = mediaResponse.data.data;

        // Render the content view with the fetched media data
        res.render('content', { content: mediaData });
    } catch (error) {
        console.error('Failed to fetch Instagram media or generate content', error);
        res.status(500).send('Failed to load content');
    }
});

// Route to handle logout and destroy session
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to destroy the session');
        }
        res.redirect('/');
    });
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
