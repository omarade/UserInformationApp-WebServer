const express = require('express');
const fs = require('fs');
const app = express();
const bodyParser = require('body-parser');

app.set('views', __dirname + '/src/views');
app.set('view engine', 'pug');

app.use('/', bodyParser()) //creates key-value pairs request.body in app.post, e.g. request.body.username
app.use(express.static('src/public'))

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

app.get('/search', function (req, res){
	res.render('search')
})

app.post('/search', (req, res) => {
	console.log('req.body.username in app.post("/search")')  
    //process the data..
    fs.readFile('./users.json', function(err,data){
    	if (err){
    		console.log('error')
    	}
    	let parsedData = JSON.parse(data);
    	let fullName = ""
    	let name = req.body.username
    	for(var i = 0 ; i < parsedData.length ; i++){
    		console.log('req.body.username, parsedData[i].firstname + " " + parsedData[i].lastname')
    		console.log(req.body.username, parsedData[i].firstname + " " + parsedData[i].lastname, (parsedData[i].firstname + " " + parsedData[i].lastname).length)
    		if (req.body.username === parsedData[i].firstname + " " + parsedData[i].lastname || req.body.username === parsedData[i].firstname || req.body.username === parsedData[i].lastname){		
    			console.log('req.body.username, parsedData[i].firstname + " " + parsedData[i].lastname')
    			console.log(req.body.username, parsedData[i].firstname + " " + parsedData[i].lastname)
    			fullName += parsedData[i].firstname + " " + parsedData[i].lastname
    		}
    	}
    	if(fullName === ""){
    		fullName = "Not found"
    	}    	
	    res.render('searchresult',{
	    	foundUser: fullName, 
	    	searchedUser: name
	    })		    		
    })
})

// app.get('/searchresult',function (req, res){
// 	res.render('searchresult',{foundUser: fullName, searchedUser: name})
// })	

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

app.post('/suggestionfinder', (req, res) => {	
	var typedIn = req.body.typedIn
	
	fs.readFile('./users.json', function(err,data){
    	if (err){
    		console.log('error')
    	}
    	var parsedData = JSON.parse(data)
    	var sugg = ""
    	for (var i = 0 ; i < parsedData.length; i++){
    		var slicedFirstName = parsedData[i].firstname.slice(0, typedIn.length)
    		var slicedLastName = parsedData[i].lastname.slice(0, typedIn.length)
    		
    		if(slicedFirstName === typedIn || slicedLastName === typedIn){
    			sugg = parsedData[i].firstname + " " + parsedData[i].lastname   			
    		}    		
    	}
    	if(typedIn === ""){
    		sugg = ""
    	}
    	res.send(sugg)
	})	
})

//server listens to clients (people with their browsers) who want to connect
var listener = app.listen(3000, function () {
	console.log('Example app listening on port: ' + listener.address().port);
});