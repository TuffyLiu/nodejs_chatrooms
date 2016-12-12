var http=require('http');
var fs=require('fs');//内置的path模块提供了与文件系统路径相关的功能
var path=require('path');
var mime=require('mime');
var cache={};

//404 error
function send404(response){
	response.writeHead(404,{'Content-Type':'text/plain'});
	response.write('Error 404:resource not found.');
	response.end();
}
//get file data
function sendFile(response,filePath,fileContents){
	response.writeHead(
		200,
		{'Content-Type':mime.lookup(path.basename(filePath))}
	);
	response.end(fileContents);
}
//get static file
function serveStatic(response,cache,absPath){
	if(cache[absPath]){
		sendFile(response,absPath,cache[absPath]);
	}else{
		fs.exists(absPath,function(exists){
			if(exists){
				fs.readFile(absPath,function(err,data){
					if(err){
						send404(response);
					}else{
						cache[absPath]=data;
						sendFile(response,absPath,data);
					}
				});
			}else{
				send404(response);
			}

		});
	}
}

//create Server
var server=http.createServer(function(request,response){
	var filePath=false;
	if(request.url=='/'){
		filePath='public/index.html';
	}else{
		filePath='public'+request.url;
	}
	var absPath='./'+filePath;
	serveStatic(response,cache,absPath);
});

//listen
server.listen(3000,function(){
	console.log("server listening on port 3000.");
});

var chatServer=require('./lib/chat_server');
chatServer.listen(server);

