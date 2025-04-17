const passport = require('passport');

const router = require('express').Router();

router.use('/', require('./swagger'));

// router.get('/', (req, res) => {
//     //#swagger.tags=['Hello World']
//     res.send('Welcome to the home page!');
// });

router.get("/", (req, res) => {
    res.send(
      req.session.user !== undefined
        ? `Logged in as ${req.session.user.displayName}`
        : "Logged Out"
    )
});

router.get("/auth/github", (req, res, next) => {
  passport.authenticate("github", {
    scope: ["user:email"],
    prompt: "login", // This forces re-authentication on GitHub
  })(req, res, next);
});


router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs",
    session: false,
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});



router.use('/products', require('./products'));

router.use('/orders', require('./orders'));

router.use('/customers', require('./customers'));

router.use('/reviews', require('./reviews'));

router.get('/login', passport.authenticate('github', (req, res) => {}));



module.exports = router;