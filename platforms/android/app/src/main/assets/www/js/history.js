var db = null;
var wert = "";

db = window.openDatabase(
    "history", "1.0", "Verlauf", 200000);

if (db != null) {
    db.transaction(createDB, errorCB, successCB);
    displayHistory();
    $('#historyTemplate').hide();
}

/**
 * @description Zeigt alle Datensätze aus der History an
 */
function displayHistory() {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM History', [], function (tx, results) {

            var template = $('#historyTemplate').html();
            $('#historyContainer').html('');

            var rows = results['rows'];
            for (var i = rows.length - 1; i >= 0; i--) {
                var new_panel = Mustache.to_html(template, rows[i]);
                $('#historyContainer').append(new_panel);
                if(rows[i].cover != 'undefined'){
                    $('#img' + rows[i].id).attr("src", rows[i].cover);
                }
            }


            $('.historyItem').swipeleft(function (e, touch) {

                button = e.currentTarget.getElementsByClassName('btnDelete')[0];
                pic = e.currentTarget.getElementsByClassName('pic')[0];

                showDeleteButton(button, pic);
            });

            $('.historyItem').tap(function (e, touch) {

                button = e.currentTarget.getElementsByClassName('btnDelete')[0];
                pic = e.currentTarget.getElementsByClassName('pic')[0];
                if (e.target.id.startsWith("btnDelete")) {
                    deleteHistoryItem(e.target);
                    displayHistory();
                } else if (e.target.id.startsWith("btnDetails")){
                    loadSongDetails(e.target);
                } else if (button.style.display != "none") {
                    showDeleteButton(pic, button);
                }

            });

        }, errorCB);
    });
}

/**
 * @description Erstellt Datenbank falls nicht existent
 * @param {} tx 
 */

function createDB(tx) {
    tx.executeSql(
        'CREATE TABLE IF NOT EXISTS History (id INTEGER PRIMARY KEY, songname TEXT, artist TEXT, album TEXT, cover TEXT, songid TEXT, albumid TEXT, artistid TEXT, youtube TEXT)'
    );
}

/**
 * @description Zeigt btnDelete an
 * @param {*} showElement 
 * @param {*} hideElement 
 */

function showDeleteButton(showElement, hideElement) {

    showElement.style.display = "block";
    hideElement.style.display = "none";
    //target.getElementsByClassName('circle')[0].setAttribute("class", "");
}

/**
 * @description Löscht Song aus der Datenbank
 * @param {*} target Das Element des Songs
 */

function deleteHistoryItem(target) {
    id = target.id.substr(9);
    db.transaction(function (tx) {
        tx.executeSql('DELETE FROM History WHERE id == ' + id);
    }, errorCB);
}

/**
 * @description WIrd bei einem Fehler in der Datenbearbeitung aufgerufen
 */
function errorCB() {
    console.log("Fehler beim Erstellen der DB")
}
function successCB() {

}

$('.btnBack').click(function () {

    $('.app').load('sites/MainPage.html' , function(){
        $.getScript('js/MainPage.js');
    }); 
});


$('main').swiperight(function () {

    $('.app').load('sites/MainPage.html' , function(){
        $.getScript('js/MainPage.js');
    }); 
});

/**
  * @description Lädt die SongDetailsseite
  * @param {*} target Das Songelement
  */
function loadSongDetails(target){
    id = target.id.substr(10);
    $('.app').load('sites/SongDetails.html' , function(){
        $.getScript('js/SongDetails.js', function(){
            setJsonDataFromDB(id);
        });  
    });   
}