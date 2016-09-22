angular.module('starter.services', [])

.factory('Socket', function(socketFactory){
  var myIoSocket = io.connect('http://chat.socket.io:80');
  mySocket = socketFactory({
    ioSocket: myIoSocket
  });
  return mySocket;
})

.factory('Users', function(){
    var usernames = [];
    usernames.numUsers = 0;

    return {
      getUsers: function(){
        return usernames;
      },
      addUsername: function(username){
        usernames.push(username);
      },
      deleteUsername: function(username){
        var index = usernames.indexOf(username);
        if(index != -1){
          usernames.splice(index, 1);
        }
      },
      setNumUsers: function(data){
        usernames.numUsers = data.numUsers;
      }
  };
})

.factory('Chat', function($ionicScrollDelegate, Socket, Users){

  var username;
  var users = {};
  users.numUsers = 0;

  var messages = [];
  var TYPING_MSG = '. . .';

  var Notification = function(username,message){
    var notification          = {};
    notification.username     = username;
    notification.message      = message;
    notification.notification = true;
    return notification;
  };

  Socket.on('login', function (data) {
    Users.setNumUsers(data);
  });

  Socket.on('new message', function(msg){
      addMessage(msg);
  });

  Socket.on('typing', function (data) {
    var typingMsg = {
      username: data.username,
      message: TYPING_MSG
    };
    addMessage(typingMsg);
  });

  Socket.on('stop typing', function (data) {
    removeTypingMessage(data.username);
  });

  Socket.on('user joined', function (data) {
    var msg = data.username + ' joined';
    var notification = new Notification(data.username,msg);
    addMessage(notification);
    Users.setNumUsers(data);
    Users.addUsername(data.username);
  });

  Socket.on('user left', function (data) {
    var msg = data.username + ' left';
    var notification = new Notification(data.username,msg);
    addMessage(notification);
    Users.setNumUsers(data);
    Users.deleteUsername(data.username);
  });

  var scrollBottom = function(){
    $ionicScrollDelegate.resize();
    $ionicScrollDelegate.scrollBottom(true);
  };



  var addMessage = function(msg){
    msg.notification = msg.notification || false;
    messages.push(msg);

    analyzeMsg(msg);


    scrollBottom();
  };

  var analyzeMsg = function(msg){
      //alert("hello");
      var newmsg = msg.split("<");

      if(newmsg[1] != undefined){
        //console.log(newmsg[1]);
        newmsg = newmsg[1].split(">");
        if (newmsg[0] != undefined){
          //console.log(newmsg[0]);
         // addMessage("try");

        var respond = "Location: Mid Valley\n";
        respond = respond + " Availability: 27%"

         return respond;
        }
      } else{
        var respond = "";
        return respond;
      }
      



      /*for (var i=0; i<newmsg.length;i++){
        
        if((newmsg[i].indexOf('<') > -1) && (newmsg[i].indexOf('>') > -1)){
            console.log("true");
        }
        
      }*/

      //console.log(newmsg[0]);

      //var n = msg.indexOf("<");
      //var j = msg.indexOf(">");

      //var newmsg = msg.substr(n+1,(j-n))
      
      /*for (var i=0; i<newmsg.length;i++){
        console.log(newmsg[i]);
      }*/
  }

  var removeTypingMessage = function(usr){
    for (var i = messages.length - 1; i >= 0; i--) {
      if(messages[i].username === usr && messages[i].message.indexOf(TYPING_MSG) > -1){
        messages.splice(i, 1);
        scrollBottom();
        break;
      }
    }
  };

  return {
    getUsername: function(){
      return username;
    },
    setUsername: function(usr){
      username = usr;
    },
    getMessages: function() {
      return messages;
    },
    sendMessage: function(msg){
      messages.push({
        username: username,
        message: msg
      });
      scrollBottom();

     var myMsg = analyzeMsg(msg);

     if (myMsg != ""){
        //console.log(myMsg); 
        //myMsg = ;
        messages.push({
        username: username,
        message: myMsg
      });
     }

      //var checkMsg = analyzeMsg(msg);

      Socket.emit('new message', msg);
    },
    scrollBottom: function(){
      scrollBottom();
    }
  };
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
/*
.factory('Devices', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var devices = [{

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

  ];

  return {
    all: function() {
      return devices;
    },
    remove: function(device) {
      devices.splice(devices.indexOf(device), 1);
    },
    get: function(id) {
      for (var i = 0; i < devices.length; i++) {
        if (devices[i].id === parseInt(id)) {
          return devices[i];
        }
      }
      return null;
    }
  };
});*/