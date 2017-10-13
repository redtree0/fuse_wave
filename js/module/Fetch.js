var Observable = require('FuseJS/Observable');

// var data = [];

var Fetch = function(router, subPage){
	this.rootUrl = "http://192.168.0.108/myapp/";
	this.data = Observable('');
	this.router = router;
	this.subPage = subPage;
};

Fetch.prototype.getRootUrl = function(){
	return this.rootUrl;
}

Fetch.prototype.setRootUrl = function(rootUrl){
	this.rootUrl = rootUrl;
}

Fetch.prototype.getResult = function(){
	return this.data;
}

Fetch.prototype.setDefault = function(){
	this.data = Observable();
}


Fetch.prototype.apiFetch = function(path, options, callback, mapFn) {
	var self = this;
	var url = encodeURI(self.getRootUrl() + path);
	console.log(url);
	if(options === undefined) {
		options = {};
	}
	// If a body is provided, serialize it as JSON and set the Content-Type header
	if(options.body !== undefined) {
		options = Object.assign({}, options, {
			body: JSON.stringify(options.body),
			headers: Object.assign({}, options.headers, {
				"Content-Type": "application/json"
			}),
			credentials: 'include' 
		});
	}

	if(mapFn === undefined){
		mapFn = function(obj){
			var robj = obj;
		 	robj.title = robj.ip;
		 	
		 	robj.clicked = function(){
				router.push(subPage, { title: robj.title, _id : robj._id  });
				router.getRoute(function(route) {
					console.log("FETC");
					console.log(route[0]);
					console.log(route[1]);
					console.log(route[2]);
					console.log(route[3]);
				   route.forEach((val, i)=>{
				   		console.log(val + "  ---- "+ i);
				   });
				    // and so on
				})
			};

			return robj;
		}
	}
	var router = self.router;
	var subPage = self.subPage;
	// Fetch the resource and parse the response as JSON
	return fetch(url, options)
		.then(function(response) { return response.json(); })
		.then(function(responseObject) { 
		 	if(router){
		 		
		 		var tmp = responseObject.map(mapFn);

		 		 self.data.replaceAll(tmp);
		 		 // data = (tmp);
		 	}else {
		 		 self.data.replaceAll(responseObject);
		 	}
	
		 	return callback(self.data);

	    })
	    .catch((err)=>{
	    	if(err){
	    		console.log("err" + err);
	    		self.data.replaceAll([{ err : "NOT FOUND"}]);
	    		return callback(self.data);
	    	}
	    });
}

Fetch.prototype.getJSON = function(path, callback, mapFn) {
	// return apiFetch("settings/data.json");
	return this.apiFetch(path, {}, callback, mapFn);
}

// module.exports = {
// 	Fetch : Fetch
// };
module.exports = Fetch;