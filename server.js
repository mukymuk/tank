#!/usr/local/bin/node

var sys = require("sys");
var my_http = require("http");  

function requestListener(request,response)
{
	sys.puts("I got kicked");  
	response.writeHead(200,{"Content-Type": "text/html"});  
	response.write("Hello World"); 
	response.write("<button type=\"button\">Click Me!</button>"); 
	response.end();  
}

my_http.createServer( requestListener ).listen(8080);
  
sys.puts("Server Running on 8080");  
