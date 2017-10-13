var Observable = require('FuseJS/Observable');
var Client = require('./module/Socketio.js');

var result = Observable("");
var command = Observable();

var _id = this.Parameter.map(function(param) {
	return param._id;
});
var Id = this.Parameter.map(function(param) {
	return param.Id;
});


var client = null;
function connect(){
	var token = {
	    query: {
	          token : _id.value
	    },
	    secure : true
	 }
	
	client = new Client("http://192.168.0.108", token);
	client.listen('AttachStderr', function(data) {
        result.value = (String(data));
    });
    client.listen('AttachStdout', function(data) {
    	if(data === undefined){
       		 result.value += "";
    	}else {
       		 result.value += (String(data));
    	}
    });
    client.listen('AttachEnable', function() {

    });
	return containerEvent("AttachContainer");

}

function disconnect(){
	if(client !== null){
		client.disconnect();
	}
}

function containerEvent(event){
	return client.sendEvent(event, Id.value, (data)=>{
		// console.log(JSON.stringify(data));
		if(data === true){
			result.value = "" ;
		}else {
			result.value = data.error;
		}
	})
}


function enterClicked(){
	// result.value = command.value;
	// console.log(command.value);
	if(client !== null){
	// console.log(command);
		if(command.value === "clear"){
			result.value = "";
			command.value = "";
			client.sendEvent('AttachStdin', "");
			return;
		}
		client.sendEvent('AttachStdin', command.value);
		command.value = "";
	}
}

module.exports = {
	enterClicked : enterClicked,
	result : result,
	command : command,
	Id : Id,
	_id : _id,
	connect : connect,
	disconnect : disconnect
};
