var Observable = require('FuseJS/Observable');
var Fetch = require("./module/Fetch");
var data = Observable("");

var _id = this.Parameter.map(function(param) {
	// console.log("_id");
	// console.log(param._id);
	return param._id;
});


var items = Observable();
var image = Observable();
// var items = Observable({name: "Start"}, {name: "Stop"}, {name : "Pause"}, {name : "Unpause"}, {name : "Kill"});


function loadImage(){
	var defaultUrl = "http://192.168.0.108/myapp/image/data/"

	var ifetch = new Fetch();
	ifetch.setRootUrl(defaultUrl);
	var id = (_id.value);
	// console.log(id.value);
	// console.log(ifetch.getRootUrl());
	ifetch.getJSON(id, (result)=>{
		var image = result;
		items.clear();
		image.forEach((value, index)=>{
			// console.log(JSON.stringify(value) + "----"+ index);
			console.log(JSON.stringify(value.RepoTags[0]) + "----"+ index);
			items.add({name : value.RepoTags[0]});
		})
	});
}

var selected = Observable();

onSelected();

function onSelected(arg) {
	if(arg == null ){
		selected.value = "event"
		return ;
	}
	else {
		var event = arg.data.name;
		
		selected.value = event;
	}
	console.log(arg.data.name)
		//console.log(menu.Selected);
}
var Client = require('./module/Socketio.js');
var config = require("./module/Config");
var name = Observable();
var cmd = Observable();
cmd.value = "/bin/bash";

function createContainer(){

	var data =  {
		Image : selected.value,
		name : name.value,
		Cmd : cmd.value
	}
	var opts = config.setContainer(data, {}, {});
	// console.log(JSON.stringify(config.getContainer()));

	var container = config.getContainer();
	var token = _id.value;
	var client = new Client("http://192.168.0.108", token);
	client.connect();
	client.sendEvent("CreateContainer", container, (data)=>{
		// console.log(JSON.stringify(data));
		client.disconnect();
		router.goBack();
	});
	
}



module.exports = {
	_id : _id,
	loadImage : loadImage,
	items : items,
	onSelected : onSelected,
	selected : selected,
	create : createContainer,
	name : name,
	cmd : cmd
};
