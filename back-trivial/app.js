const express = require('express');
var session = require( "express-session" );
var passport = require( "passport" );
var MediaWikiStrategy = require( "passport-mediawiki-oauth" ).OAuthStrategy;
var config = require( "./config" );
const fs = require('fs');
const path = require('path');

const cors = require('cors');
const initRouters = require("./routers/routers");


const app = express();
const PORT = 3001;
var router = express.Router();

app.use(cors());
app.use(express.json());

initRouters(app);


//-------




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
		//res.redirect( req.baseUrl +"/" );  //localhost:3001
		//SI todo va bien ya redirijo a game
        res.redirect( "http://localhost:3000/game" );
		

		/*req.logIn( user, function( err ) {
			if ( err ) {
				console.log("aqui?");
				return next( err );
			}
			req.session.user = user;
			console.log(req.session.user);
			res.redirect( req.baseUrl + "/" );
		} );*/
	} )( req, res, next );
} );

router.get( "/logout" , function ( req, res ) {

	delete req.session.user;
	res.redirect( req.baseUrl + "/" );

	deleteUser();
} );

router.get("/checkAuth", function ( req, res ) {
	if (req.session.user) {
		res.sendStatus(200);
	} else {
		res.sendStatus(400);
	}
}) ;


//Esto sobra cuando haga logout basta con q donde lo llama ponga localStorage.removeItem("user");
//metodo para eliminar usuario cada vez que se lanza y cuando hago logout
const deleteUser = () => {
	const filePath = __dirname + '/public/data.json';
	if (fs.existsSync(filePath)) {
	//si existe lo borro
	try {
		fs.unlinkSync(filePath);
		console.log('El archivo fue eliminado exitosamente.');
	} catch (error) {
		console.error('Error al eliminar el archivo:', error);
	}
	} else {
	console.log('El archivo no existe.');
	}
}


//-----


app.listen(PORT, () => {
    console.log("Listening on port 3001");
})
deleteUser();
