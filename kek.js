const openidClient = require("openid-client");
const passport = require("passport");
const openidConnect = require("passport-openidconnect");
const express = require("express");
const session = require("express-session");

//const oauth2 = require("passport-oauth2");
const morgan = require("morgan");
const oauth2 = require("passport-openid-oauth20").Strategy;

const port = 3000;
const discoverBankidIssuer = async () => {
	// const code_verifier = openidClient.generators.codeVerifier();
	// const code_challenge = openidClient.generators.codeChallenge(code_verifier);

	// client.authorizationUrl({
	// 	scope:
	// 		"openid profile.email profile.name profile.birthnumber profile.birthdate",
	// 	resource: "https://oidc.sandbox.bankid.cz/auth",
	// 	code_challenge,
	// 	code_challenge_method: "S256",
	// });

	// const params = client.callbackParams(req);
	// const tokenSet = await client.callback(
	// 	`http://localhost:${port}/api/auth/callback/bankid`,
	// 	params,
	// 	{ code_verifier }
	// );
	// console.log("received and validated tokens %j", tokenSet);
	// console.log("validated ID Token claims %j", tokenSet.claims());
	// const userinfo = await client.userinfo(access_token);
	// console.log("userinfo %j", userinfo);
	// client.authorizationUrl;
	// passport.use(
	// 	new openidConnect.Strategy(
	// 		{
	// 			//client,
	// 			issuer:
	// 				"https://oidc.sandbox.bankid.cz/.well-known/openid-configuration",
	// 			clientID: "154e0e43-ac97-4210-b83c-c97d79e25520",
	// 			clientSecret:
	// 				"AJh7V3PFYY8CLm1mU_r9x4EnsT74gpHJseWCBMyGicDht0HDNEV8MikuvvN_TiJ0jzIv_Hmerlj-veo_H2ri_T0",
	// 			authorizationURL: "https://oidc.sandbox.bankid.cz/auth",
	// 			tokenURL: "https://oidc.sandbox.bankid.cz/token",
	// 			//userProfileURL: "https://oidc.sandbox.bankid.cz/profile",
	// 			userInfoURL: "https://oidc.sandbox.bankid.cz/userinfo",
	// 			callbackURL: `http://localhost:${port}/api/auth/callback/bankid`,
	// 			// pkce: true,
	// 			// state: true,
	// 			// sessionKey: 'very-secret-secret',
	// 			scope:
	// 				"openid profile.email profile.name profile.birthnumber profile.birthdate",
	// 			// params: {
	// 			// 	scope:
	// 			// 		"openid profile.email profile.name profile.birthnumber profile.birthdate",
	// 			// },
	// 		},
	// 		function verify(issuer, profile, cb) {
	// 			console.log("user", issuer, profile);
	// 			return cb(null, profile);
	// 		},
	// 		function (accessToken) {
	// 			console.log("kek", accessToken);
	// 			return cb(null, accessToken);
	// 		}
	// 	)
	// );

  const secret = `${Math.random()}`

	const app = express();

	app.use(morgan("combined"));
	app.use(
		session({
			secret: secret,
			resave: false,
			saveUninitialized: false,
		})
	);
	// app.get(
	// 	"/login",
	// 	passport.authenticate("openidconnect", {
	// 		successRedirect: "/",
	// 		//failureRedirect: "/login",
	// 		prompt: "login",
	// 		//response_type: "code token",
	// 	}),
	// 	async (req, res) => {
	// 		// const params = client.callbackParams(req);
	// 		// const tokenSet = await client.callback(
	// 		//   `http://localhost:${port}/api/auth/callback/bankid`,
	// 		//   params,
	// 		//   { code_verifier }
	// 		// );
	// 		// console.log("received and validated tokens %j", tokenSet);
	// 		// console.log("validated ID Token claims %j", tokenSet.claims());
	// 		// const userinfo = await client.userinfo(access_token);
	// 		// console.log('userinfo %j', userinfo);
	// 		console.log("login", req, res);
	// 		res.redirect("/");
	// 	}
	// );

	const bankidIssuer = await openidClient.Issuer.discover(
		"https://oidc.sandbox.bankid.cz/.well-known/openid-configuration"
	);
	console.log(
		"Discovered issuer %s %O",
		bankidIssuer.issuer,
		bankidIssuer.metadata
	);

	const client = new bankidIssuer.Client({
		client_id: "154e0e43-ac97-4210-b83c-c97d79e25520",
		client_secret:
			"AJh7V3PFYY8CLm1mU_r9x4EnsT74gpHJseWCBMyGicDht0HDNEV8MikuvvN_TiJ0jzIv_Hmerlj-veo_H2ri_T0",
		redirect_uris: [`http://localhost:${port}/api/auth/callback/bankid`],
		//response_types: ["code", "token"],
		id_token_signed_response_alg: "PS512",
	});

  const code_verifier = openidClient.generators.codeVerifier();
  const code_challenge =
    openidClient.generators.codeChallenge(code_verifier);

	app.get(
		"/login",
		// passport.authenticate("openidconnect", {
		// 	successRedirect: "/",
		// 	//failureRedirect: "/login",
		// 	prompt: "login",
		// 	//response_type: "code token",
		// }),
		(req, res) => {
			const authorizationUrl = client.authorizationUrl({
				scope:
					"openid profile.email profile.name profile.birthnumber profile.birthdate",
				//resource: "https://oidc.sandbox.bankid.cz/auth",
				code_challenge,
				code_challenge_method: "S256",
			});

			res.redirect(authorizationUrl);
		}
	);

	app.get("/api/auth/callback/bankid", async (req, res) => {
		console.log(req, res);
		const params = client.callbackParams(req);
		const tokenSet = await client.callback(
			`http://localhost:${port}/api/auth/callback/bankid`,
			params,
			{ code_verifier }
		);
		console.log("received and validated tokens %j", tokenSet);

		//console.log("validated ID Token claims %j", tokenSet.claims());
		// const userinfo = client.userinfo('access_token');
		// console.log("userinfo %j", userinfo);
		// const params = client.callbackParams(req);
		// const tokenSet = client.callback(
		// 	`http://localhost:${port}/api/auth/callback/bankid`,
		// 	params,
		// 	{ code_verifier }
		// );
		// console.log("received and validated tokens %j", tokenSet);
		// console.log("validated ID Token claims %j", tokenSet.claims());
		const userinfo = client.userinfo(tokenSet.access_token);
		console.log("userinfo %j", userinfo);

		// Successful authentication, redirect home.
		console.log("callback");
		//res.redirect("/");
	});

	app.listen(port || 3000, () => {
		console.log(`Listening...\nlogin on: http://localhost:${port}/login`);
	});
	//return bankidIssuer
};

discoverBankidIssuer();
