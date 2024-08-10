const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require("cors");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3000;



mongoose.connect('mongodb://localhost:27017/userauth')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));


const userSchema = new mongoose.Schema({
  googleId: String,
  displayName: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));


const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

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
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists in our database
    let user = await User.findOne({ googleId: profile.id });
    
    if (!user) {
      // If user doesn't exist, create a new user
      user = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        // Add any other fields you want to save
      });
      await user.save();
    }
    
    // Return the user
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Serialize user information into the session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user information from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
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
app.get('/profile', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the user profile' });
  }
});

app.get('/logout', (req, res) => {
  req.logout(function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error during logout' });
    }
    res.redirect('http://localhost:5173/'); // Redirect to your frontend homepage
  });
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