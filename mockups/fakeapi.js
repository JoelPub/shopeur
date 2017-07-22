/**
 * Created by danieldihardja on 15/01/16.
 */
var express    	= require('express');
var bodyParser 	= require('body-parser');

var app = express();

// enable reading json post data from the request body
app.use(bodyParser.json());

//-------------------------------//
// Enable Cross Domain Requests
//-------------------------------//

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
});

//--------------------------//
// Default Entry Point
//--------------------------//

app.get('/', function(req, res) {
	res.json({message: 'Shopeur Fake API'});
});

//--------------------------//
// Login
//--------------------------//

app.post('/login', function(req, res) {
	console.log(req.body);
	res.json({success: true, token: 'AABGJJGAHJ384AJHJ676'});
});

//--------------------------//
// Signup
//--------------------------//

app.post('/signup', function(req, res) {
	console.log(req.body);
	res.json({success: true});
});


//--------------------------//
// Start the fake API
//--------------------------//

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Shopeur Fake API running on port ' + port);

