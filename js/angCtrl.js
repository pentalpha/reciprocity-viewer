userInfoApp.controller("mainController", ['$scope', function($scope){
  userInfoInit($scope);
}]);

function userInfoInit(scope){
  scope.profilePicUrl='https://placeholdit.imgix.net/~text?txtsize=24&txt=profile_pic&w=150&h=150';
  scope.tryUnf = function(x){
    tryUnfollow(x);
  };
  scope.userName = "userName";
  scope.userNFollowers='X';
  scope.userNFollowing='Y';
  scope.userReciprocity='Y';
  whenDefined(getUserData, function(){
    scope.profilePicUrl = getUserData().profile_picture;
    scope.userName = getUserData().username;
    scope.userNFollowers = getUserData().counts.followed_by;
    scope.userNFollowing = getUserData().counts.follows;
    scope.userReciprocity = getUserData().counts.followed_by / getUserData().counts.follows;
    scope.$apply();
  });
  scope.users = [];
  whenDefined(getUnfollowers, function(){
    console.log("updating users to unfollow");
    //scope.users = getUnfollowers();
    var people  = getUnfollowers();
    for(i = 0; i < people.length; i++){
      aUser = {
        "username": people[i].username,
        "profile_picture": people[i].profile_picture,
        "id": people[i].id,
        "index" : i,
        "action" : "Unfollow"
      }
      scope.users.push(aUser);
    }
    console.log(scope.users);
    scope.$apply();
  });
}


userInfoApp.controller("listController", ['$scope', function($scope){
  console.log("updating users to unfollow?");
  //populateUsersList($scope);
}]);

/*function populateUsersList(scope){
  console.log("updating users to unfollow?2");
  scope.users = [{"username": "kevin",
        "profile_picture": "http://images.ak.instagram.com/profiles/profile_3_75sq_1325536697.jpg",
        "full_name": "Kevin Systrom",
        "id": "3"
  },
  {"username": "kevin",
        "profile_picture": "http://images.ak.instagram.com/profiles/profile_3_75sq_1325536697.jpg",
        "full_name": "Kevin Systrom",
        "id": "3"
  }
  ];
  console.log(scope.users);
  whenDefined(getUnfollowers, function(){
    console.log("updating users to unfollow");
    scope.users = getUnfollowers();
    console.log(scope.users);
    scope.$apply();
  });
}*/
