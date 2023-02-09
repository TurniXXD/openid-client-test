const passport = require("passport");
const express = require("express");
//const oauth2 = require("passport-oauth2");
const morgan = require("morgan");
const oauth2 = require("passport-openid-oauth20").Strategy;

const port = 3000;

passport.use(
	new oauth2.Strategy(
		{
			clientID: "154e0e43-ac97-4210-b83c-c97d79e25520",
			clientSecret:
				"AJh7V3PFYY8CLm1mU_r9x4EnsT74gpHJseWCBMyGicDht0HDNEV8MikuvvN_TiJ0jzIv_Hmerlj-veo_H2ri_T0",
			authorizationURL: "https://oidc.sandbox.bankid.cz/auth",
			tokenURL: "https://oidc.sandbox.bankid.cz/token",
			userProfileURL: "https://oidc.sandbox.bankid.cz/profile",
			//userInfoURL: "https://oidc.sandbox.bankid.cz/userinfo",
			callbackURL: `http://localhost:${port}/api/auth/callback/bankid`,
			// pkce: true,
			// state: true,
			scope:
				"openid profile.email profile.name profile.birthnumber profile.birthdate",
		},
		(accessToken, results, profile, cb) => {
			// User.findOrCreate({ exampleId: profile.id }, function (err, user) {
			// 	console.log("kek_error: ", err);
			// 	return cb(err, user);
			// });
			console.log("kek_ac: ", accessToken);
			console.log("\nkek_res: ", results);
			console.log("\nkek_profile: ", profile);
		}
	)
);

console.log("passport", passport);

const app = express();

app.use(morgan("combined"));

app.get(
	"/login",
	passport.authenticate("openid-oauth20", {
		prompt: "login",
		response_type: "code id_token",
	}),
	(req, res) => {
		// Successful authentication, redirect home.
		console.log(req, res);
		res.redirect("/");
	}
);

app.get(
	"/api/auth/callback/bankid",
	passport.authenticate("openid-oauth20", { failureRedirect: "/login" }),
	(req, res) => {
		// Successful authentication, redirect home.
		res.redirect("/");
	}
);

app.listen(port || 3000, () => {
	console.log(`Listening...\nlogin on: http://localhost:${port}/login`);
});
