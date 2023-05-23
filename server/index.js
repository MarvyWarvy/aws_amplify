
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const db = require('./db/index');

const app = require('./app');

const PORT = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({ secret: 'mySecretKey', resave: false, saveUninitialized: false }));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(cookieParser('mySecretKey'));

app.use(passport.initialize());
app.use(passport.session());


const { User } = require('./db/models'); // Assuming you have a User model defined

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      res.send({ message: 'Username already exists' });
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10);
      await User.create({ username, password: hashedPassword });
      res.send({ message: 'User created' });
    }
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).send({ message: 'An error occurred during signup' });
  }
});


app.listen(PORT, (err) => {
  if (err) {
    console.log('server connection failed', err);
  }
  console.log(`Page running at: 127.0.0.1:${PORT}`);
});

// const app = require('./app');

// const PORT = 3001;

// app.listen(PORT, (err) => {
//   if (err) {
//     console.log('server connection failed', err);
//   }
//   console.log(`Page running at: 127.0.0.1:${PORT}`);
// });

//pasword doesnt have a default value
