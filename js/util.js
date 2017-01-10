function getHashParams() {
    var hashParams = {};
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&;=]+)=?([^&;]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.hash.substring(1);

    while (e = r.exec(q))
       hashParams[d(e[1])] = d(e[2]);

    return hashParams;
}

function makeGet(address, action){
  $.support.cors = true;

  $.ajax({
      type: "GET",
      dataType: "jsonp",
      url: address,
      async: false,
      success: function(data){
        action(data);
      },
      crossDomain: true
  });
}

function makePost(address, action){
  $.support.cors = true;
  $.ajaxSetup({
    crossDomain: true
  });
  $.support.cors = true;

  //$.ajax({
  //  type: "POST",
  //  dataType: "json",
  //  url: address,
  //  crossDomain : true
  //});
  //$.post(address);
  $.ajax({
    type: 'POST',
    url: address,
    dataType: 'json',
    data: {action:'unfollow'},
    traditional: true,
    success: function (data)
    {
       action(data);
    }
  });
}

function whenDefined(data, action){
  if(data() != null){
    console.log("data defined");
    console.log(data());
    action();
  }
  else{
    console.log("data undefined");
    setTimeout(function(){whenDefined(data, action)}, 100);
  }
}
