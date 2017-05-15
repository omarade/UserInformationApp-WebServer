const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');

app.set('views', './src/views');
app.set('view engine', 'pug');

app.use('/', bodyParser()) //creates key-value pairs request.body in app.post, e.g. request.body.username

app.get('/', function (req, res) {
	fs.readFile('./users.json', function (err, data) {
		if (err) {
			console.log('error');
		}

		var parsedData = JSON.parse(data);
		console.log('users read: ' + parsedData.length + " users loaded.");

		res.render('index', {users: parsedData});
	});
});

// - route 2: renders a page that displays a form which is your search bar.
app.get('/search', function (req, res){
	res.render('search')
})

/*- route 3: takes in the post request from your form,
then displays matching users on a new page.
Users should be matched based on whether either 
their first or last name contains the input string.*/
var fullName
var name
app.post('/search', (req, res) => {
	console.log('req.body.username in app.post("/search")')
    console.log(req.body.username)
    
    //process the data..
    fs.readFile('./users.json', function(err,data){
    	if (err){
    		console.log('error')
    	}
    	var parsedData = JSON.parse(data);
    	fullName = ""
    	name = req.body.username
    	for(var i = 0 ; i < parsedData.length ; i++){
    		if (req.body.username === (parsedData[i].firstname || parsedData[i].lastname)){
    			fullName += parsedData[i].firstname.concat(" ", parsedData[i].lastname, " ");
    		}
    	}
    	if(fullName === ""){
    		fullName = "Not found"
    	}    	
	    console.log(fullName); 
	    res.redirect('/searchresult')		    		
    })
})

app.get('/searchresult',function (req, res){
	res.render('searchresult',{foundUser: fullName, searchedUser: name})
})	

/*- route 4: renders a page with three forms on it (first name, last name, and email) 
that allows you to add new users to the users.json file.*/
app.get('/adduser', function(req, res){
	res.render('adduser')
})

/*- route 5: takes in the post request from the 'create user' form, then adds the user to the users.json file. 
Once that is complete, redirects to the route that displays all your users (from part 0).*/
app.post('/adduser', function(req, res){
	var newUser = {
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email,
	}

	fs.readFile('./users.json', function(err,data){
    	if (err){
    		console.log('error')
    	}
    	var parsedData = JSON.parse(data);
    	parsedData.push(newUser)
    	var stringfiedData = JSON.stringify(parsedData)

    	fs.writeFile('./users.json', stringfiedData, function(err, data) {
    		if (err) {
        		throw err;
    		}
    		console.log("data is writen");    		
		});
    })	
	res.redirect('/')
})

//server listens to clients (people with their browsers) who want to connect
var listener = app.listen(3000, function () {
	console.log('Example app listening on port: ' + listener.address().port);
});