var Observable = require('FuseJS/Observable');
var Client = require('./module/Socketio.js');
var result = Observable();
var Fetch = require("./module/Fetch");
var Load = require("./module/Load");


var _id = this.Parameter.map(function(param) {
	return param._id;
});

var title = this.Parameter.map(function(param) {
	return param.title;
});

// var data = Observable;
var data = this.Parameter.map(function(param) {
	console.log("Parm")
	console.log(JSON.stringify(param.data));
	return param.data;
});



function containerEvent(event){
	var client = null;

	function connect(){

		var token = _id.value;
		client = new Client("http://192.168.0.108", token);
		client.connect();
	}

	function disconnect(){
		if(client !== null){
			console.log("Event");
			client.disconnect();
		}
	}

	connect();

	return client.sendEvent(event, [{Id : data.value.Id}], (data)=>{
		console.log(JSON.stringify(data));
		if(data.state === true){
			result.value = "작업완료" ;
			setTimeout(reloadHandler, 1000)
		}else {
			result.value = data.msg;
		}
		disconnect();
	})
}


// console.log(data);
function goTerminal(){
	// console.log(JSON.stringify({Id : Id, _id : _id});
	router.push("Terminal", {Id : data.value.Id, _id : _id.value})
}

var items = Observable({name: "Start"}, {name: "Stop"}, {name : "Pause"}, {name : "Unpause"}, {name : "Kill"});


var selected = Observable();

function selectContainerEvent(event){

	function start(){
	return containerEvent("StartContainer");
	}

	function stop(){
		return containerEvent("StopContainer");
	}

	function pause(){
		return containerEvent("PauseContainer");
	}

	function unpause(){
		return containerEvent("UnpauseContainer");
	}

	function kill(){
		return containerEvent("KillContainer");
	}

	switch(event){
		case 'Start':
			start();	
			break;
		case 'Stop' :
			stop();
			break;
		case 'Pause' :
			pause();
			break;
		case 'Unpause':
			unpause();
			break;
		case 'Kill' :
			kill();
			break;
		default :
			console.log("default");
	}
}

onSelected();

function onSelected(arg) {
	if(arg == null ){
		selected.value = "event"
		return ;
	}
	else {
		var event = arg.data.name;
		
		selected.value = event;
		selectContainerEvent(event);
	}
		//console.log(menu.Selected);
}

var load = new Load("host");

var isLoading = load.getIsLoading();

var loading = function(callback){
	var defaultUrl = "http://192.168.0.108/myapp/container/data/";

	console.log("TESTST");
	var ifetch = new Fetch();
	ifetch.setRootUrl(defaultUrl);
	var hostId = (_id).value;
	var containerId = data.value.Id;
	ifetch.getJSON(hostId +"/" + containerId, (result)=>{
		// console.log(JSON.stringify(result.value));
		// console.log(result.value.Names[0]);
		console.log(JSON.stringify(data));
		data = result.value;
		// console.log(JSON.stringify(data.value));
		// console.log(Object.keys(data.value).toString());
		data.title = result.value.Names[0];
		// console.log(Object.keys(data.value).toString());
		// console.log(JSON.stringify(data.value.title));
		// console.log(JSON.stringify(result.value.Labels));
		data.Network = JSON.stringify(result.value.NetworkSettings.Networks);
		data.Labels = JSON.stringify(result.value.Labels);

		callback;
	});
}	

var reloadHandler = ()=>{ load.reloadHandler(loading) };


module.exports = {
	title : title,
	_id : _id,
	goTerminal : goTerminal,

	result : result,
	data : data,
	items : items,
	selected: selected,
	onSelected: onSelected,
	isLoading: isLoading,
    reloadHandler: reloadHandler
};

