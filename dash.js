const express = require("express");
const passport = require("passport");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const url = require("url");
const ejs = require('ejs');
const Strategy = require("passport-discord").Strategy;
const bodyParser = require("body-parser");
const app = express();
let port = process.env.port || 3000;

module.exports = async (client) => {
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new Strategy({
  clientID: "BOT_ID",
  clientSecret: "BOT_SECRET",
  callbackURL: "domain/auth/callback",
  scope: ["identify", "guilds"]
},
  (accessToken, refreshToken, profile, done) => { 
  process.nextTick(() => done(null, profile));
  })
);

  app.use(session({
    store: new MemoryStore({ checkPeriod: 86400000 }),
    secret: "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
    resave: false,
    saveUninitialized: false,
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use('/css', express.static(`views/assets/css`));
app.use('/js', express.static(`views/assets/js`));
app.set('view engine', 'ejs');

  const checkAuth = (req, res, next) => {
   
    if (req.isAuthenticated()) return next();
  
    req.session.backURL = req.url;
   
    res.redirect("/login");
  }

  app.get("/login", (req, res, next) => {
  
    if (req.session.backURL) {
      req.session.backURL = req.session.backURL;  
    } else if (req.headers.referer) {
      const parsed = url.parse(req.headers.referer);
      if (parsed.hostname === app.locals.domain) {
        req.session.backURL = parsed.path;
      }
    } else {
      req.session.backURL = "/";
    }
    next();
  },
  passport.authenticate("discord"));

 
  app.get("/auth/callback", passport.authenticate("discord", { failureRedirect: "/" }),  (req, res) => {
   
    if (req.session.backURL) {
      const url = req.session.backURL;
      req.session.backURL = null;
      res.redirect(url);
    } else {
      res.redirect("/");
    }
  });

  app.get('/', function(req, res) {
  res.render("index", { 
    bot: client.user,
    user: client,
    member: req.user,
    title: 'GHOST DEV DASHBOARD', 
    desc: 'discord.gg/delimine' 
  });
});

  app.get("/auth/logout", function (req, res) { 
    req.session.destroy(() => {
      req.logout();  
      res.redirect("/");
    });
  });


app.listen(port, () => console.log('site 3000 portuyla açık!'));
};

