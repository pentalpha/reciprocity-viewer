var uri;
var query;
var parsedURI;
var appID = "d0fe42d7fa044cd683c662941f4908c2";
var appAuthedPage = "https://pentalpha.github.io/reciprocity-viewer/";
var appAuthedPageLocal = "https://localhost:3000";
var instaGetSelfURL = "https://api.instagram.com/v1/users/self/?access_token=";
var instaGetFollowingURL = "https://api.instagram.com/v1/users/self/follows?access_token=";
var instaGetFollowersURL = "https://api.instagram.com/v1/users/self/followed-by?access_token=";
var token;
var userData;
var followers;
var following;
var unfollowers;
var userName;
function getUserData(){
  return userData;
}
function getUserName(){
  return userData.username;
}
function getFollowing(){
  return following;
}
function getFollowers(){
  return followers;
}
function getUnfollowers(){
  return unfollowers;
}

function jsMain(){
  updateURLVars();
  //getToken();
  if(tokenInFrags() || tokenInQuery()){
    if(tokenInFrags()){
      token = tokenFromFrags();
    }else{
      token = tokenFromQuery();
    }
    requireGetUserData();
    requireGetFollowing();
    requireGetFollowers();
  }else{
    goRequireToken();
  }
}

function updateURLVars(){
  uri = new URI();
  parsedURI = URI.parse(uri.toString());
  query = parsedURI["query"];
}

function tokenInFrags(){
  if (parsedURI["fragment"] != null){
    var frags = getHashParams();
    if(frags["access_token"] != null){
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
}

function tokenInQuery(){
  var parsedQuery = URI.parseQuery(query);
  return (parsedQuery["code"] != null);
}

function tokenFromFrags(){
  var frags = getHashParams();
  return frags["access_token"];
}

function tokenFromQuery(){
  var parsedQuery = URI.parseQuery(query);
  return parsedQuery["code"];
}

function goRequireToken(){
  var newURI = "https://api.instagram.com/oauth/authorize/?";
  newURI+="client_id=" + appID;
  if(uri.toString().includes("localhost")){
    newURI+="&redirect_uri=" + appAuthedPageLocal;
  }else{
    newURI+="&redirect_uri=" + appAuthedPage;
  }
  newURI+="&response_type=token";
  newURI+="&scope=basic+public_content+follower_list+relationships";

  window.location = newURI;
}

function requireGetUserData(){
  console.log("token is " + token);
  res = makeGet(instaGetSelfURL + token, updateUserData);
}

function requireGetFollowing(){
  console.log("token is " + token);
  makeGet(instaGetFollowingURL + token, updateFollowing);
}

function requireGetFollowers(){
  console.log("token is " + token);
  makeGet(instaGetFollowersURL + token, updateFollowers);
}

function updateFollowing(data){
  following = data.data;
  console.log("there are " + following.length + " people you are following.");
  whenDefined(getFollowers, function(){
    console.log("populating unfollowers array");
    populateUnfollowers();
  });
}

function updateFollowers(data){
  followers = data.data;
  console.log("there are " + followers.length + " followers.");
}

function updateUserData(data){
  userData = data.data;
  userName = userData.username;
  console.log(userData.username);
}

function populateUnfollowers(){
  var people = [];
  var isFollower;
  var i;
  var j;
  for(i = 0; i < following.length; i++){
    notFollower = true;
    for(j = 0; j < followers.length; j++){
      if(followers[j].id == following[i].id){
        notFollower = false;
      }
    }
    if(notFollower){
      people.push(following[i]);
    }
  }
  unfollowers = people;
  console.log("there are " + unfollowers.length + " unfollowers.");
  console.log(unfollowers);
}

function tryUnfollow(i){
  console.log("trying to unfollow " + unfollowers[i].username);
  var url = "https://api.instagram.com/v1/users/";
  url += unfollowers[i].id;
  url += "/relationship";
  url += "?access_token=" + token;
  makePost(url, successUnfollow);
}

function successUnfollow(data){
  console.log("unfollowed");
}

function getUnfollowFunc(i){
  return "tryUnfollow(" + i + ")";
}

function updateList(){
  window.location.reload()
}

/*function getToken(){
  if(query == null){
    console.log("No query on the url");
    if(parsedURI["fragment"] != null){
      var frags = getHashParams();
      token = frags["access_token"];
    }else{
      goRequireToken();
    }
  }else{
    var parsedQuery = URI.parseQuery(query);
    var code = parsedQuery["code"];
    if(code == null){
      console.log("no code on query");
      goRequireToken();
    }else{
      console.log("token is " + code);
      token = code;
    }
  }
}*/
