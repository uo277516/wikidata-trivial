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


//-----BASE DE DATOS

//Guardar racha
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
  
//Rachas por usuario
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

//Todas las rachas
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


  


//-------OAUTH

app.use(express.static(path.join(__dirname, 'public')));

  

app.use( session( {
    secret: config.session_secret,
	saveUninitialized: true,
	resave: true
}) );

app.use( passport.initialize() );
app.use( passport.session() );

console.log(config.session_secret);



app.use( "/", router );


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
		//console.log(profile);
		saveData(profile);
		return done( null, profile );
	}
) );

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

passport.serializeUser(	function ( user, done ) {
	done( null, user );
} );

passport.deserializeUser( function ( obj, done ) {
	done( null, obj );
} );

router.get( "/", function ( req, res ) {
	res.render( "index", {
		//user: req && req.session && req.session.user,
		user: req.session.user,
		url: req.baseUrl
	} );
} );

router.get( "/login", function ( req, res ) {
	res.redirect( req.baseUrl + "/auth/mediawiki/callback" );
} );
 

router.get( "/auth/mediawiki/callback", function( req, res, next ) {
	console.log("hola");
	passport.authenticate( "mediawiki", function( err, user ) {
		if ( err ) {
			return next( err );
		}

		if ( !user ) {
			return res.redirect( req.baseUrl + "/login" );
		}

		req.session.user = user;
        console.log(req.session.user);
		//SI todo va bien ya redirijo a home
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


//-----


const server = app.listen(PORT, () => {
    console.log("Listening on port 3001");
})

module.exports = {app, server}
