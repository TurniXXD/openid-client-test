import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport, { Strategy as PassportStrategy } from "passport";
import { Strategy, VerifyCallback } from "passport-oauth2";

// // Passport session setup.
// //
// //   For persistent logins with sessions, Passport needs to serialize users into
// //   and deserialize users out of the session. Typically, this is as simple as
// //   storing the user ID when serializing, and finding the user by ID when
// //   deserializing.
// passport.serializeUser((user: any, done: any) => {
// 	// done(null, user.id);
// 	done(null, user);
// });

// passport.deserializeUser((id: any, done: any) => {
// 	// Users.findById(obj, done);
// 	console.log("odkekovano", id);
// 	//done(null, user);
// });

// // Use the GoogleStrategy within Passport.
// //   Strategies in Passport require a `verify` function, which accept
// //   credentials (in this case, an accessToken, refreshToken, and Google
// //   profile), and invoke a callback with a user object.
// //   See http://passportjs.org/docs/configure#verify-callback

// const bankIdStrategy: PassportStrategy = {
// 	name: "bankid",
// 	authenticate() {},
// };

// passport.use(
// 	new Strategy(
// 		// Use the API access settings stored in ./config/auth.json. You must create
// 		// an OAuth 2 client ID and secret at: https://console.developers.google.com
// 		{
// 			authorizationURL: "https://oidc.sandbox.bankid.cz/auth",
// 			tokenURL: "https://oidc.sandbox.bankid.cz/token",
// 			clientID: "154e0e43-ac97-4210-b83c-c97d79e25520",
// 			clientSecret:
// 				"AJh7V3PFYY8CLm1mU_r9x4EnsT74gpHJseWCBMyGicDht0HDNEV8MikuvvN_TiJ0jzIv_Hmerlj-veo_H2ri_T0",
// 			//callbackURL: 'http://localhost:3000/auth/example/callback',
// 		},
// 		(
// 			accessToken: string,
// 			refreshToken: string,
// 			profile: any,
// 			verified: VerifyCallback
// 		) => {
// 			// Typically you would query the database to find the user record
// 			// associated with this Google profile, then pass that object to the `done`
// 			// callback.
// 			console.log("kek_fetched", accessToken, refreshToken, profile);
// 			return "done(null, profile);";
// 		}
// 	)
// );

// // Express 4 boilerplate

// var app = express();
// app.set("view engine", "hbs");

// app.use(logger("dev"));
// app.use(cookieParser());
// app.use(
// 	session({
// 		secret: "keyboard cat",
// 		resave: false,
// 		saveUninitialized: false,
// 	})
// );

// app.use(passport.initialize());
// app.use(passport.session());

// app.use(express.static(__dirname + "/public"));

// // Application routes

// app.get("/", (req: any, res: any) => {
// 	res.render("index", {
// 		user: req.user,
// 	});
// });

// app.get("/login", (req: any, res: any) => {
// 	res.render("login", {
// 		user: req.user,
// 	});
// });

// // GET /auth/google
// //   Use passport.authenticate() as route middleware to authenticate the
// //   request.  The first step in Google authentication will involve
// //   redirecting the user to google.com.  After authorization, Google
// //   will redirect the user back to this application at /auth/google/callback
// app.get("/auth", passport.authenticate(bankIdStrategy));

// // GET /auth/google/callback
// //   Use passport.authenticate() as route middleware to authenticate the
// //   request.  If authentication fails, the user will be redirected back to the
// //   login page.  Otherwise, the primary route function function will be called,
// //   which, in this example, will redirect the user to the home page.
// app.get(
// 	"/auth/callback",
// 	passport.authenticate("bankid", {
// 		failureRedirect: "/login",
// 	}),
// 	(req: any, res: any) => {
// 		// Authenticated successfully
// 		res.redirect("/");
// 	}
// );

// app.get("/account", ensureAuthenticated, (req: any, res: any) => {
// 	res.render("account", {
// 		user: req.user,
// 	});
// });

// app.get("/logout", (req: any, res: any) => {
// 	req.logout();
// 	res.redirect("/");
// });

// app.listen(process.env.PORT || 3333, function () {
// 	console.log("Listening...");
// });

// // Simple route middleware to ensure user is authenticated.
// function ensureAuthenticated(req: any, res: any, next: any) {
// 	if (req.isAuthenticated()) {
// 		return next();
// 	}
// 	res.redirect("/login");
// }

passport.use(
	new Strategy(
		{
			authorizationURL: "https://oidc.sandbox.bankid.cz/auth",
			tokenURL: "https://oidc.sandbox.bankid.cz/token",
			clientID: "154e0e43-ac97-4210-b83c-c97d79e25520",
			clientSecret:
				"AJh7V3PFYY8CLm1mU_r9x4EnsT74gpHJseWCBMyGicDht0HDNEV8MikuvvN_TiJ0jzIv_Hmerlj-veo_H2ri_T0",
			callbackURL: "http://localhost:3000/auth/callback",
      scope: "openid profile.email profile.name profile.birthnumber profile.birthdate"
		},
		function (accessToken, refreshToken, profile, cb) {
			// User.findOrCreate({ exampleId: profile.id }, function (err, user) {
			// 	console.log("kek_error: ", err);
			// 	return cb(err, user);
			// });
      console.log("kek: ", accessToken, refreshToken, profile, cb);
		}
	)
);

console.log("passport", passport)

const app = express();

app.use(morgan("combined"));

app.get("/login", passport.authenticate("oauth2"), (req, res) => {
	// Successful authentication, redirect home.
  console.log(req, res)
	res.redirect("/");
});

app.get(
	"/auth/callback",
	passport.authenticate("oauth2", { failureRedirect: "/login" }),
	(req, res) => {
		// Successful authentication, redirect home.
		res.redirect("/");
	}
);

app.listen(process.env.PORT || 3000, function () {
	console.log("Listening...\nlogin on: http://localhost:3000/login");
});

