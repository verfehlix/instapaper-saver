var fs = require('fs');
var request = require('request');
var prompt = require('prompt');

var promptSchema = {
    properties: {
      email: {
        required: true
      },
      password: {
        required: true,
        hidden: true
      },
      filePath: {
        required: true
      }
    }
};

console.log("*------------------------------------------------------------------------------------------------*");
console.log("|                               I N S T A P A P E R   S A V E R                                  |");
console.log("| Enter your instapaper email, password and path to a text file to add multiple urls at once!    |");
console.log("|            (Path should be relative, each line in the file should contain one URL)             |");
console.log("*------------------------------------------------------------------------------------------------*");


prompt.get(promptSchema, function (err, result) {
    if (err) { return; }

    console.log("-------------------------------------------------------------------------------------------------")

    handleUserInput(result.email, result.password, result.filePath);

});


var handleUserInput = function(email, password, filePath) {

    var urlArray = fs.readFileSync(filePath).toString().split("\n");

    urlArray.map(el => addBookmarkToInstapaper(email, password, el) );
    
}

var addBookmarkToInstapaper = function(email, password, bookMarkUrl) {
    // Configure the request
    var options = {
        url: 'https://www.instapaper.com/api/add',
        method: 'POST',
        form: {
            'username': email, 
            'password': password,
            'url': bookMarkUrl 
        }
    }

    // Start the request
    request(options, function (err, response, body) {
        if(err) throw err;

        console.log(bookMarkUrl);

        switch (response.statusCode) {
            case 201:
                console.log("201 - This URL has been successfully added to this Instapaper account.")
                break;
            case 400:
                console.log("400 - Bad request or exceeded the rate limit. Probably missing a required parameter, such as url.")

                break;
            case 403:
                console.log("403 - Invalid email or password.")
                break;
            case 500:
                console.log("500 - The service encountered an error. Please try again later.")
                break;
            default:
                console.log(response.statusCode + " - Error? Body: " + body);
        }

        console.log("-------------------------------------------------------------------------------------------------")

    })
}