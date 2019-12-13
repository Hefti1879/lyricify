$('.btnRecord').click(function () {
    var xmlhttp = new XMLHttpRequest();
    var url = 'https://api.audd.io/?url=https://audd.tech/example1.mp3&return=lyrics,spotify';

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            console.log(myArr);
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    
});

$('.btnHistory').click(function (){
    $('.app').load('sites/History.html' , function(){
        $.getScript('js/history.js');
    }); 
});

$('main').swipeleft(function (){

    //event.stopImmediatePropagation();

    $('.app').load('sites/History.html' , function(){
        $.getScript('js/history.js');
    }); 
});

$('.btnSearch').click(function(){

    searchValue = document.getElementById('searchInput').value; 

    var xmlhttp = new XMLHttpRequest();
    var url = 'https://api.audd.io/findLyrics/?q=' + searchValue.replace(" ", "%20") + 
    '&return=lyrics,spotify&api_token=fedf53397ff5a0fdbc00c59513222b28';

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            
            if(myArr.error == undefined){
                loadSongDetails(myArr.result[0]);
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();

});
 /**
  * @description Lädt die SongDetailsseite
  * @param {*} data Das Json mit den Songdaten
  */
function loadSongDetails(data){
    $('.app').load('sites/SongDetails.html' , function(){
        $.getScript('js/SongDetails.js', function(){
            setJsonData(data);
        });  
    });   
}