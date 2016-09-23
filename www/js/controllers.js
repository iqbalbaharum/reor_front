angular.module('starter.controllers', [])

.run(function($rootScope){


  //$rootScope.checkins = LocalStorage.get('checkins', []);

  $rootScope.devices = [{

    id : 1,
    username: '@micro1',
    type: 'Microwave',
    createDate: '01/09/2016'
  },
  {

    id : 2,
    username: '@car012',
    type: 'Car',
    createDate: '11/09/2016'
  },

  {

    id : 3,
    username: '@aircond',
    type: 'Aircond',
    createDate: '21/09/2016'
  },

  ]

})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, $stateParams, $ionicPopup, $timeout, Socket, Chat, $http) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  
  $scope.data = {};
  $scope.data.message = "";
  $scope.messages = Chat.getMessages();
  var typing = false;
  var lastTypingTime;
  var TYPING_TIMER_LENGTH = 250;

  Socket.on('connect',function(){

    if(!$scope.data.username){
      var nicknamePopup = $ionicPopup.show({
      template: '<input id="usr-input" type="text" ng-model="data.username" autofocus>',
      title: 'What\'s your nickname?',
      scope: $scope,
      buttons: [{
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.username) {
              e.preventDefault();
            } else {
              return $scope.data.username;
            }
          }
        }]
      });
      nicknamePopup.then(function(username) {
        Socket.emit('add user',username);
        Chat.setUsername(username);
      });
    }

  });

  Chat.scrollBottom();

  if($stateParams.username){
    $scope.data.message = "@" + $stateParams.username;
    document.getElementById("msg-input").focus();
  } 

  var sendUpdateTyping = function(){
    if (!typing) {
      typing = true;
      Socket.emit('typing');
    }
    lastTypingTime = (new Date()).getTime();
    $timeout(function () {
      var typingTimer = (new Date()).getTime();
      var timeDiff = typingTimer - lastTypingTime;
      if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
        Socket.emit('stop typing');
        typing = false;
      }
    }, TYPING_TIMER_LENGTH);
  };

  $scope.updateTyping = function(){
    sendUpdateTyping();
  };

  $scope.messageIsMine = function(username){
    return $scope.data.username === username;
  };

  $scope.getBubbleClass = function(username){
    var classname = 'from-them';
    if($scope.messageIsMine(username)){
      classname = 'from-me';
    }
    return classname;
  };

  $scope.sendMessage = function(msg){

    Chat.sendMessage(msg);

    var newmsg = analyzeMsg(msg);

    if (newmsg != ""){
      newmsg2 = newmsg.split(",");
        
        if (newmsg2[1]=="tag"){
            console.log(newmsg2[0])
        
        //start
        var headers = {
          'Access-Control-Allow-Origin' : '*',
          'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };
           
        
         var url = 'http://default-environment.bnksf6bnuf.ap-southeast-1.elasticbeanstalk.com/reor_back/api/request.php?location=' + newmsg2[0];

        $http({
            method: 'GET',
            headers: headers,
            url: url
          }).then(function successCallback(response) {
              // this callback will be called asynchronously
              // when the response is available

              console.log(response.data);
            
            var myLocation = newmsg.replace("%20", " ");
            myLocation = myLocation.replace(",tag","");
            myLocation = myLocation.replace(",device","");
            var parking = response.data["Parking"];
            var traffic = response.data["Traffic"];
            var crowd = response.data["crowd"];

            var respond = "Location: " + myLocation;

            respond = respond + " | Parking Availability: " + parking;
            respond = respond + " | Traffic: " + traffic + " | Crowd: " + crowd;

             Chat.sendMessage(respond);

            }, function errorCallback(response) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
        });
        
        } //end if
        else if(newmsg2[1]=="device"){
            
        }
        //finish 
    }


    $scope.data.message = "";
  };

  
  var analyzeMsg = function(msg){
      //alert("hello");
      var newmsg = msg.split("<");
      var newmsg2 = msg.split("@");

      if(newmsg[1] != undefined){
        //console.log(newmsg[1]);
        newmsg = newmsg[1].split(">");
        if (newmsg[0] != undefined){
          //console.log(newmsg[0]);
         // addMessage("try");

         //$scope.data = {};

          
        var parameter = newmsg[0].replace(" ", "%20");
        //var url = "http://appsmalaya.com/melaka/output.php"

        

        /*$http.get("http://default-environment.bnksf6bnuf.ap-southeast-1.elasticbeanstalk.com/reor_back/api/request.php?location=KLCC").then(function(response){
            
            $scope.data = response.data;
            console.log($scope.data);
            
        });*/ //end of http get


        /*var myLocation = newmsg[0];
        var parking = "27%";
        var traffic = "High";

        var respond = "Location: " + myLocation;

        respond = respond + " | Parking Availability: " + parking;
        respond = respond + " | Traffic: " + traffic;*/

         return parameter + ",tag";
        }
      } else{
        var respond = "";
        return respond;
      }
      
  }




  
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('DeviceCtrl', function($scope) {
    //$scope.devices = Devices.all();


})

.controller('DeviceDetailsCtrl', function($scope, $stateParams) {
  //$scope.device = D.get($stateParams.deviceId);

 $scope.device = $scope.devices.filter(function(device){
    return device.id == $stateParams.id;
  }).pop();

})

.controller('DeviceAddCtrl', function($scope) {


})



.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
