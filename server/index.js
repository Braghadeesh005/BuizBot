const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require("cors")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:5173', // Your client URL
    credentials: true
  }));
// Replace with your Google Client ID and Secret
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Configure session middleware
app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: true
}));

// Initialize Passport and restore authentication state
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport with Google Strategy
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://laptop-483nic2i.tail7526d.ts.net/auth/google/callback' // Update this to match your Tailscale URL
},
(accessToken, refreshToken, profile, done) => {
  // Save user profile information in session
  return done(null, profile);
}));

// Serialize user information into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user information from the session
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Route to start Google authentication
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Route to handle callback after authentication
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.redirect('http://localhost:5173/home');
  }
);

// Route to display user profile
app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.json(req.user);
});

// Route for the home page
app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

// Route for POST data
app.post('/data', (req, res) => {
  const { name, age } = req.body;
  if (name && age) {
    res.json({ message: `Received data for ${name}, age ${age}` });
  } else {
    res.status(400).json({ error: 'Missing name or age' });
  }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });