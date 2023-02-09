"use strict";
exports.__esModule = true;
var express_1 = require("express");
var morgan_1 = require("morgan");
var cookie_parser_1 = require("cookie-parser");
var express_session_1 = require("express-session");
var passport_1 = require("passport");
var passport_oauth2_1 = require("passport-oauth2");
// Passport session setup.
//
//   For persistent logins with sessions, Passport needs to serialize users into
//   and deserialize users out of the session. Typically, this is as simple as
//   storing the user ID when serializing, and finding the user by ID when
//   deserializing.
passport_1["default"].serializeUser(function (user, done) {
    // done(null, user.id);
    done(null, user);
});
passport_1["default"].deserializeUser(function (id, done) {
    // Users.findById(obj, done);
    console.log("odkekovano", id);
    //done(null, user);
});
// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
//   See http://passportjs.org/docs/configure#verify-callback
var bankIdStrategy = {
    name: "bankid",
    authenticate: function () { }
};
passport_1["default"].use(new passport_oauth2_1.Strategy(
// Use the API access settings stored in ./config/auth.json. You must create
// an OAuth 2 client ID and secret at: https://console.developers.google.com
{
    authorizationURL: "https://oidc.sandbox.bankid.cz/auth",
    tokenURL: "https://oidc.sandbox.bankid.cz/token",
    clientID: "a050751e-3d19-491f-8257-6258cd9efd55",
    clientSecret: "a130ef33a4265c72863ca88d26df9194031ff5d3193bcec50043f6b8d70b579f7b8d7546a04dc1c5f107dadaeca157428269b1ede16e0cfccc5fb8c35b8c8968"
}, function (accessToken, refreshToken, profile, verified) {
    // Typically you would query the database to find the user record
    // associated with this Google profile, then pass that object to the `done`
    // callback.
    console.log("kek_fetched", accessToken, refreshToken, profile);
    return "done(null, profile);";
}));
// Express 4 boilerplate
var app = (0, express_1["default"])();
app.set("view engine", "hbs");
app.use((0, morgan_1["default"])("dev"));
app.use((0, cookie_parser_1["default"])());
app.use((0, express_session_1["default"])({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
}));
app.use(passport_1["default"].initialize());
app.use(passport_1["default"].session());
app.use(express_1["default"].static(__dirname + "/public"));
// Application routes
app.get("/", function (req, res) {
    res.render("index", {
        user: req.user
    });
});
app.get("/login", function (req, res) {
    res.render("login", {
        user: req.user
    });
});
// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get("/auth", passport_1["default"].authenticate(bankIdStrategy));
// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get("/auth/callback", passport_1["default"].authenticate("bankid", {
    failureRedirect: "/login"
}), function (req, res) {
    // Authenticated successfully
    res.redirect("/");
});
app.get("/account", ensureAuthenticated, function (req, res) {
    res.render("account", {
        user: req.user
    });
});
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});
app.listen(process.env.PORT || 3333, function () {
    console.log("Listening...");
});
// Simple route middleware to ensure user is authenticated.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}
