const express = require('express');
var session = require( "express-session" );
var passport = require( "passport" );
var MediaWikiStrategy = require( "passport-mediawiki-oauth" ).OAuthStrategy;
var config = require( "./config" );
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const initRouters = require("./routers/routers");
const connection = require("./db");

const app = express();
const PORT = 3001;
var router = express.Router();

app.use(cors());
app.use(express.json());

initRouters(app);


//----- DATABASE ROUTES -----

/**
 * Endpoint to save streak data into the database.
 * @name POST/saveStreak
 * @function
 * @memberof app
 * @param {string} username - The username associated with the streak.
 * @param {string} category - The category of the streak ('investigación', 'deporte', 'música').
 * @param {number} streak - The streak value to be saved.
 * @returns {string} Success message or error message if parameters are incorrect.
 */
app.post('/saveStreak', (req, res) => {
	const { username, category, streak } = req.body;
	if (Object.keys(req.body).length !== 3) {
		console.error('Error saving streak: Incorrect number of parameters');
		res.status(500).send('Error saving streak: Incorrect number of parameters');
		return;
	}

	const validCategories = ['investigación', 'deporte', 'música'];
	if (!validCategories.includes(category)) {
		console.error('Error saving streak: Invalid category');
		res.status(500).send('Error saving streak: Invalid category');
		return;
	}

	const query = 'INSERT INTO rachas (username, category, streak) VALUES (?, ?, ?)';
	connection.query(query, [username, category, streak], (err, result) => {
	if (err) {
		console.error('Error saving streak:', err);
		res.status(500).send('Error saving streak');
		return;
	}

	res.send('Racha guardada');
	});
});
  
/**
 * Endpoint to fetch streaks for a specific user from the database.
 * @name GET/getStreaks/:username
 * @function
 * @memberof app
 * @param {string} username - The username to fetch streaks for.
 * @returns {Object[]} Array of streak objects ordered by streak value.
 */
app.get('/getStreaks/:username', (req, res) => {
	const { username } = req.params;
	const query = 'SELECT * FROM rachas WHERE username = ? ORDER BY streak DESC';
	connection.query(query, [username], (err, results) => {
		if (err) {
		console.error('Error fetching streaks:', err);
		res.status(500).send('Error fetching streaks');
		return;
		}
		res.send(results);
	});
});

/**
 * Endpoint to fetch all streaks from the database.
 * @name GET/getAllStreaks
 * @function
 * @memberof app
 * @returns {Object[]} Array of all streak objects ordered by streak value.
 */
app.get('/getAllStreaks', (req, res) => {
	const query = 'SELECT * FROM rachas ORDER BY streak DESC';
	connection.query(query, (err, results) => {
	  if (err) {
		console.error('Error fetching all streaks:', err);
		res.status(500).send('Error fetching all streaks');
		return;
	  }
	  res.send(results);
	});
});



//------- OAUTH SETUP -------

app.use(express.static(path.join(__dirname, 'public')));

app.use( session( {
    secret: config.session_secret,
	saveUninitialized: true,
	resave: true
}) );

app.use( passport.initialize() );
app.use( passport.session() );
app.use( "/", router );

/**
 * MediaWiki OAuth Strategy configuration for Passport.
 * @name MediaWikiStrategy
 * @memberof app
 * @instance
 */
passport.use( new MediaWikiStrategy(
    {
		consumerKey: config.consumer_key,
		consumerSecret: config.consumer_secret
	},
	function ( token, tokenSecret, profile, done ) {
		profile.oauth = {
			consumer_key: config.consumer_key,
			consumer_secret: config.consumer_secret,
			token: token,
			token_secret: tokenSecret
		};
		saveData(profile);
		return done( null, profile );
	}
) );

/**
 * Saves user data to a JSON file.
 * @name saveData
 * @function
 * @memberof app
 * @param {Object} data - The user data to save.
 */
const saveData = (data) => {
	const jsonData = JSON.stringify(data);
	const filePath = path.join(__dirname, 'public', 'data.json');

	fs.writeFile(filePath, jsonData, (err) => {
		if (err) {
			console.error('Error writing file:', err);
			return;
		}
		console.log('Data written to file');
	});
}

/**
 * Serialize user object into the session.
 * @name serializeUser
 * @function
 * @memberof app
 * @param {Function} done - Callback function.
 */
passport.serializeUser(	function ( user, done ) {
	done( null, user );
} );

/**
 * Deserialize user object from the session.
 * @name deserializeUser
 * @function
 * @memberof app
 * @param {Function} done - Callback function.
 */
passport.deserializeUser( function ( obj, done ) {
	done( null, obj );
} );

router.get( "/", function ( req, res ) {
	res.render( "index", {
		user: req.session.user,
		url: req.baseUrl
	} );
} );

router.get( "/login", function ( req, res ) {
	res.redirect( req.baseUrl + "/auth/mediawiki/callback" );
} );
 

router.get( "/auth/mediawiki/callback", function( req, res, next ) {
	passport.authenticate( "mediawiki", function( err, user ) {
		if ( err ) {
			return next( err );
		}

		if ( !user ) {
			return res.redirect( req.baseUrl + "/login" );
		}

		req.session.user = user;
		//if everything ok to home
        res.redirect( "http://localhost:3000" );
		
	} )( req, res, next );
} );

router.get( "/logout" , function ( req, res ) {

	delete req.session.user;
	res.redirect("http://localhost:3000" );

} );


router.get("/checkAuth", function(req, res) {
	if (req.session.user) {
	  res.json({ authenticated: true }); 
	} else {
	  res.json({ authenticated: false });
	}
});



const server = app.listen(PORT, () => {
    console.log("Listening on port 3001");
})

module.exports = {app, server}
