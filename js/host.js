var Observable = require('FuseJS/Observable');
var Fetch = require("./module/Fetch");
var Load = require("./module/Load");
// console.log(Fetch);
var data = Observable("");

// Load.prototype.loading = function(callback){
// 	console.log("first");
// 	var ifetch = new Fetch(router, "Container");
	
// 	ifetch.getJSON("settings/data.json", (result)=>{

// 		if((result.value).hasOwnProperty("err")){
// 			data.value = {title : "NOT FOUND"};
// 		}else {
// 			data.value = result;
// 		}
// 		callback;
// 	});

// }

	var load = new Load("host");
	console.log("id");
	console.log(load.id);
	var isLoading = load.getIsLoading();
	var loading = function(callback){
		var ifetch = new Fetch(router, "Container");
	
		ifetch.getJSON("settings/data.json", (result)=>{

			if((result.value).hasOwnProperty("err")){
				data.value = {title : "NOT FOUND"};
			}else {
				data.value = result;
			}
			callback;
		});
	}

	var reloadHandler = ()=>{ load.reloadHandler(loading) };



module.exports = {
	tdata : data,
	isLoading: isLoading,
    reloadHandler: reloadHandler
};
