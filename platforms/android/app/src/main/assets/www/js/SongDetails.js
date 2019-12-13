json_data = null;

var previousPage = null;
var db = null;
    
db = window.openDatabase(
    "history", "1.0", "Verlauf", 200000);
db.transaction(createDB, errorCB, successCB);


function setJsonData(data){
    previousPage = 'MainPage';
    json_data = data;
    media = JSON.parse(json_data.media);
    spotifyId = null;
    for(var i = 0;i<media.length;i++){
        if(media[i].provider == 'spotify'){
            spotifyId = media[i].native_uri.split(':')[2];
        }else if(media[i].provider == 'youtube'){
            json_data.youtube = media[i].url;
        }
    }
    
    getSpotifyData(spotifyId, json_data.title, json_data.artist);
}

function setJsonDataFromDB(id){
    //console.log(id);
    previousPage = 'History'
    var data = '';
    if (db != null) {
        db.transaction(function(tx){
            tx.executeSql('SELECT * FROM History WHERE id == ' + id, [], function(tx, results){
                data = results.rows.item(0);
                setDocValues(data);
            })
        }, errorCB);
    }
}

function getSpotifyData(songId, artist, title){
    
    if(songId){
        var url = 'https://api.spotify.com/v1/tracks/' + songId
    }else{
        var url = 'https://api.spotify.com/v1/search?q=' + artist.replace(' ', '%20') + '%20'
         + title.replace(' ', '%20') + '&type=track';
    }
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.withCredentials = true;
    xmlhttp.setRequestHeader('Authorization', 'Bearer ' + Cookies.get('Token'));
    xmlhttp.send();

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if(songId){
                var myArr = JSON.parse(this.responseText);
            }else{
                var myArr = JSON.parse(this.responseText).tracks.items[0];
            }
            
            json_data.album = myArr.album.name;
            json_data.cover = myArr.album.images[0].url;
            json_data.albumid = myArr.album.id;
            json_data.songid = myArr.id;
            json_data.artistid = myArr.artists[0].id;
            json_data.songname = myArr.name;
            setDocValues(json_data);
            addHistoryItem(json_data);
        }
    };
}

function setDocValues(data){
    console.log(data.lyrics);
    str = "<b>" + data.songname + "</b><br>" + data.artist + ' ⋅ ' + data.album;
    document.getElementById('songInfo').innerHTML = str;
    $('#albumCover').attr("src", data.cover);
    $('.btnAlbum').attr("href", 'https://open.spotify.com/album/' + data.albumid);
    $('.btnArtist').attr("href", 'https://open.spotify.com/artist/' + data.artistid);
    $('.btnPlay').attr("href", 'https://open.spotify.com/track/' + data.songid);
    $('.youtube').attr("src", data.youtube);
    document.getElementById('lyrics').textContent = data.lyrics;
    
}

function addHistoryItem(json_data){

    if (db != null) {
        db.transaction(function(tx){
            tx.executeSql('INSERT INTO History(songname, artist, album, cover, ' + 
            'songid, albumid, artistid, youtube) VALUES("' + json_data.title + '", "' + 
            json_data.artist + '", "' + json_data.album + '", "' + json_data.cover + 
             '", "' + json_data.songid + '", "' + json_data.albumid + '", "' + json_data.artistid + 
             '", "' + json_data.youtube + '")');
        });
    }
    $('#lyrics').innerText = json_data.lyrics;    
}

function createDB(tx) {
    tx.executeSql(
        'CREATE TABLE IF NOT EXISTS History (id INTEGER PRIMARY KEY, songname TEXT, artist TEXT,'
           + 'album TEXT, cover TEXT, songid TEXT, albumid TEXT, artistid TEXT, youtube TEXT)'
    );
}

function errorCB() {
    console.log("Fehler beim Erstellen der DB")
}
function successCB() {
    console.log("Erfolgreiches Erstellen")
}

$('.btnBack').click(function () {

    $('.app').load('sites/' + previousPage + '.html' , function(){
        $.getScript('js/' + previousPage + '.js');
    }); 
});


$('main').swiperight(function () {

    $('.app').load('sites/' + previousPage + '.html' , function(){
        $.getScript('js/' + previousPage + '.js');
    }); 
});
