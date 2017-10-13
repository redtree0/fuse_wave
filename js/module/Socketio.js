var Observable = require('FuseJS/Observable');
var io = require('./socket.io-1.4.5.js');

var clientsocket = (function clientsocket(url, token) {
  this.url = url;
  this.token =  {
        query: {
            token : token
        },
    secure : true
  };

  this.socket = io(url, token); // client socket 정보
  var socket = this.socket;
  if(!socket.connected){
     socket.on('connect', function () { console.log("socket connected"); });
     socket.on('disconnect', function () { console.log("socket disconnected"); });
  }
});


(function() {
  

    /** @method  - sendEvent
    *  @description 소켓 데이터 송신 함수
    *  @param {String} eventName - 소켓 이벤트 명
    *  @param {Object} data - json data
    *  @param {Function} callback - 콜백 함수
    *  @return {Function} socket.emit - 소켓 송신
    */
    // this.sendEvent = function (doComplete, eventName, data, callback) {
    //     var self = this;
    //     var socket =  self.socket;

    //     // console.log(socket);
    //     console.log("do event %s , data %s", eventName, data);

    //     // self.$body.spinStart();

    //     ///// socket.emit (eventName, data, callback)
    //     //// eventName 소켓 이벤트 명
    //     //// data 서버로 보낼 데이터
    //     //// callback 서버에서 다시 클라이언트로 보낸 데이터를 받은 후 실행할 콜백 함수
    //     return socket.emit(eventName, data, (data)=>{
    //       console.log("do back");
    //         if(doComplete){
    //           self.completeEvent(data); /// 소켓 완료 후 실행 함수
    //         }
    //         if(typeof callback === "function"){
    //           callback(data);
    //         }
    //     });
    // };

   this.sendEvent = function (eventName, data, callback) {
        var self = this;
        var socket =  self.socket;

        // console.log(socket);
        console.log(eventName);
        console.log(data);

        return socket.emit(eventName, data, (data)=>{

            if(typeof callback === "function"){
              callback(data);
            }
        });
    };
   this.connect = function(){
        var self = this;
        self.socket = io(self.url, self.token); 
    };
    /// 소켓 완료 후 실행 함수 , 바깥에서 기능에 맞게 Overwrite
    this.disconnect = function(){
        var self = this;
        var socket =  self.socket;
        return socket.disconnect();
    };


    this.getToken = function(){
        var self = this;
        var socket =  self.socket;
        return socket.query.token;
    };


    this.deleteListener = function(eventName){
      var self = this;
      var socket =  self.socket;
      socket.removeListener(eventName);
    }

    /** @method  - listen
    *  @description 소켓 데이터 수신 함수
    *  @param {String} eventName - 소켓 이벤트 명
    *  @param {Function} callback - 콜백 함수
    *  @return {Function} socket.on - 소켓 수신
    */
    this.listen = function (eventName, callback) {
        var socket =  this.socket;
        console.log("listen " + eventName);
        ///// socket.on (eventName, callback)
        //// eventName 소켓 이벤트 명
        //// callback 데이터 받을 시 실행 콜백 함수
        return socket.on(eventName, callback);
    };
}).call(clientsocket.prototype);


module.exports = clientsocket;

