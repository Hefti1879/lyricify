
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // ... Code EFZ
        loadMainPage();
        //
    }
};

app.initialize();

function loadMainPage(){
  if(Cookies.get('Token') && Cookies.get('Token') != "undefined"){
    $('.app').load('sites/MainPage.html' , function(){
      $.getScript('js/MainPage.js');
  }); 
  } 
}

var client_id = '1cfd9c133d344ba08bb7d98dfe17ec4d';
var redirect_uri = 'http://localhost:8000/index.html'; // Your redirect uri


$('.btnLogin').click(function(){
    //window.location.href = "sites/MainPage.html";
    const hash = window.location.hash
    .substring(1)
    .split('&')
    .reduce(function (initial, item) {
      if (item) {
        var parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
      }
      return initial;
    }, {});
    window.location.hash = '';
    
    // Set token
    let _token = hash.access_token;
    
    const authEndpoint = 'https://accounts.spotify.com/authorize';
    
    // Replace with your app's client ID, redirect URI and desired scopes
    const scopes = [
      'user-top-read',
      'playlist-read-private',
      'user-library-read',
      'playlist-modify-public',
      'user-library-modify',
      'playlist-modify-private',
      'playlist-read-collaborative'
    ];
    
    // If there is no token, redirect to Spotify authorization
    if (!_token) {
      window.location = `${authEndpoint}?response_type=token&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scopes.join('%20')}`;
    }

    //_token = window.location.hash.access_token;

    window.location.hash = "";

    Cookies.set("Token", _token);

    loadMainPage();
});
