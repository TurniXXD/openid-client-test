const openidClient = require("openid-client");
const express = require("express");
const session = require("express-session");
const morgan = require("morgan");

const discoverBankidIssuer = async () => {
	const port = 3000;
	const secret = `${Math.random()}`;
	const app = express();

	app.use(morgan("combined"));
	app.use(
		session({
			secret: secret,
			resave: false,
			saveUninitialized: false,
		})
	);

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
	const code_challenge = openidClient.generators.codeChallenge(code_verifier);

	app.get("/login", (req, res) => {
		const authorizationUrl = client.authorizationUrl({
			scope:
				"openid profile.email profile.name profile.birthnumber profile.birthdate",
			//resource: "https://oidc.sandbox.bankid.cz/auth",
			code_challenge,
			code_challenge_method: "S256",
		});

		res.redirect(authorizationUrl);
	});

	app.get("/api/auth/callback/bankid", async (req, res) => {
		console.log(req, res);
		const params = client.callbackParams(req);

		const tokenSet = await client.callback(
			`http://localhost:${port}/api/auth/callback/bankid`,
			params,
			{
				code_verifier,
			}
		);

		const userInfo = await client.userinfo(tokenSet.access_token);

		console.log("userInfo", userInfo);
		res.redirect("/");
	});

	app.get("/", () => {
		console.log("oauth client");
	});

	app.listen(port || 3000, () => {
		console.log(`Listening...\nlogin on: http://localhost:${port}/login`);
	});
};

discoverBankidIssuer();
