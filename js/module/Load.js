var Observable = require('FuseJS/Observable');

var isLoading = Observable(false);
var Load = function(id){
	// this.isLoading = Observable(false);
	this.id = id;
}

Load.prototype.getIsLoading = function(){
	// return this.isLoading;
	return isLoading;
}

// Load.prototype.loading = function(callback){

// }

Load.prototype.reloadHandler = function(loading){
	var self = this;
	console.log("reload");
	// self.isLoading.value = true;
	isLoading.value = true;
	// self.loading(setTimeout(self.endLoading, 1000));
	loading(setTimeout(self.endLoading, 1000));
}

Load.prototype.endLoading = function(){
	var self = this;
	console.log("finished");
	// self.isLoading.value = false;
	isLoading.value = false;
}

module.exports = Load;
