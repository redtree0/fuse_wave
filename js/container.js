var Observable = require('FuseJS/Observable');
var Fetch = require("./module/Fetch");
// console.log(Fetch);
var defaultUrl = "http://192.168.0.108/myapp/container/data/"
var data = Observable("");


var Load = require("./module/Load");


var title = this.Parameter.map(function(param) {
	return param.title;
});

var _id = this.Parameter.map(function(param) {
	return param._id;
});

var load = new Load('container');
// console.log("id");
// console.log(load.id);
var isLoading = load.getIsLoading();
var loading = function(callback){
	var ifetch = new Fetch(router, "ContainerEvent");
	ifetch.setRootUrl(defaultUrl);
	var id = (_id).value;
	// console.log(ifetch.getRootUrl());
	ifetch.getJSON(id, (result)=>{
		data.value = result;
		callback;
		// getJsonResult();
	}, (obj)=>{
		var robj = obj;
		robj.title = robj.Names[0];

		robj.clicked = function(){
				var config = {
					 _id : id,
					 data : {
					 	title: robj.title,
					 	Id : robj.Id,
						 Command : robj.Command,
						 Image : robj.Image,
						 State : robj.State,
						  Labels : JSON.stringify(robj.Labels),
						 Network : JSON.stringify(robj.NetworkSettings.Networks)
					 }
			    }
				router.push("ContainerEvent", config);
		
			};

			return robj;
	});
}

var reloadHandler = ()=>{ load.reloadHandler(loading) };

var Client = require('./module/Socketio.js');

function removeContainer(sender) {
			
	var removeitem = sender.data;

	var token = _id.value;
	var client = new Client("http://192.168.0.108", token);
	client.connect();
	client.sendEvent("RemoveContainer", [{Id : removeitem.Id}], (data)=>{
		// console.log(JSON.stringify(data));
		client.disconnect();
		reloadHandler();
	});
	
}

function createContainer(){
	// router()
	console.log("click");
	console.log(_id.value);
	var opts = { _id : _id.value };
	router.push("CreateContainer", opts);
}



module.exports = {
	// loadContainer : clicked,
	title : title,
	_id : _id,
	tdata : data,
	isLoading: isLoading,
    reloadHandler: reloadHandler,
    remove : removeContainer,
    create : createContainer
};

