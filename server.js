const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const mongodb = require("./data/database");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");
const port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(express.json());

app.use(session({
  secret: "secret",
  resave: false, 
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Z-Key");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
next();
});

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));  
app.use("/", require("./routes"));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/github/callback",
}, 
function(accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));  

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {  
  done(null, user);
}
);

// app.get("/", (req, res) => { res.send(req.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out")); });

// app.get('/github/callback', passport.authenticate('github', { failureRedirect: '/api-docs' ,session: false}), (req, res) => {
// req.session.user = req.user;
//   res.redirect('/');   
// });

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and node server is running on port ${port}`);
    });
  }
});
