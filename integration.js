// Parameter
var updateInterval = 1;

// Global variables
var baseUrl     = window.location.protocol + "//" + window.location.host;
var id          = 0;
var prevTime    = 0;

var songTitle   = "",
    artistName  = "",
    albumTitle  = "",
    artUrl      = "",
    duration    = 0,
    position    = 0,
    volume      = 0;
    playbackStatus = mellowplayer.PlaybackStatus.STOPPED;

/**
 * Contact the Kodi server
 *
 * @param string   Method
 * @param array    Array of parameters
 * @param function Callback function on success
 */
function sendQuery(method, params, onComplete) {
    var query = {
        "jsonrpc": "2.0",
        "id": id,
        "method": method,
        "params": params
    };
    id++;

    var xhttp = new XMLHttpRequest();

    if(onComplete) {
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                onComplete(this.responseText);
            }
        };
    }

    xhttp.open("GET", baseUrl + "/jsonrpc?request=" + JSON.stringify(query), true);
    xhttp.send();
}

/**
 * Update function
 */
function update() {

    // Check if an update should be made
    if( new Date()/1000 - prevTime > updateInterval ) {
        prevTime = new Date()/1000;

        // Get song info
        var listProperties = ["title", "album", "artist", "duration", "thumbnail"];
        sendQuery("Player.GetItem", {"playerid": 0, "properties": listProperties}, function(data) {

            // Parse the json
            var json = JSON.parse(data).result;

            // Set the properties
            if(json.item.type != "unknown") {
                songTitle  = json.item.title;
                albumTitle = json.item.album;
                artistName = json.item.artist[0];
                duration   = json.item.duration;
                artUrl     = baseUrl + "/image/" + encodeURI(json.item.thumbnail);

            } else {
                songTitle  = "";
                albumTitle = "";
                artistName = "";
                duration   = 0;
                artUrl     = "";
            }

        });

        // Get volume
        sendQuery("Application.GetProperties", {"properties": ["volume"]}, function(data) {

            // Parse the json
            json = JSON.parse(data).result;

            // Set the volume
            volume = json.volume/100;
        });

        // Get position and status
        sendQuery("Player.GetProperties", {"playerid":0, "properties": ["time", "speed"] }, function(data) {

            // Parse the json
            json = JSON.parse(data).result;

            // Set the position
            position = json.time.hours * 3600 + json.time.minutes * 60 + json.time.seconds;

            // Set the status
            switch(json.speed) {
                case 1:
                    playbackStatus = mellowplayer.PlaybackStatus.PLAYING;
                    break;

                default:
                    if( songTitle != "" )
                        playbackStatus = mellowplayer.PlaybackStatus.PAUSED;

                    else
                        playbackStatus = mellowplayer.PlaybackStatus.STOPPED;
            }
        });
    }

    return {
        "playbackStatus": playbackStatus,
        "volume": volume,
        "duration": duration,
        "position": position,
        "songId": getHashCode(songTitle),
        "songTitle": songTitle,
        "artistName": artistName,
        "albumTitle": albumTitle,
        "artUrl": artUrl,

        "canSeek": true,
        "canGoNext": true,
        "canGoPrevious": true,
        "canAddToFavorites": false,
        "isFavorite": false
    };
}

function play() {
    sendQuery('Player.PlayPause', {"playerid": 0});
}

function pause() {
    sendQuery('Player.PlayPause', {"playerid": 0});
}

function goNext() {
    sendQuery('Player.GoTo', {"playerid": 0, "to": "next"});
}

function goPrevious() {
    sendQuery('Player.GoTo', {"playerid": 0, "to": "previous"});
}

// Volume float 0-1
function setVolume(newVolume) {
    volume = newVolume;
    sendQuery('Application.SetVolume', {'volume': Math.floor(newVolume*100)});
}

// Position in seconds
function seekToPosition(newPosition) {
    position = newPosition;
    sendQuery('Player.Seek', {
        "playerid": 0, "value": {
            "hours": Math.floor(newPosition/3600) %60,
            "milliseconds": 0,
            "minutes": Math.floor(newPosition/60) %60,
            "seconds": position %60
        }
    });
}

function addToFavorites() {}
function removeFromFavorites() {}
