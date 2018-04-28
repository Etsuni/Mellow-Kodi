function update() {
    return {
        "playbackStatus": getState(),
        "canSeek": false,
        "canGoNext": true,
        "canGoPrevious": true,
        "canAddToFavorites": false,
        "volume": 0.4,
        "duration": getDuration(),
        "position": getPosition(),
        "songId": 0,
        "songTitle": getTitle(),
        "artistName": getArtistName(),
        "albumTitle": "",
        "artUrl": getArtwork(),
        "isFavorite": false
    };
}

function play() {
    eventFire(document.getElementsByClassName('control-play')[0], 'click');
}

function pause() {
    eventFire(document.getElementsByClassName('control-play')[0], 'click');
}

function goNext() {
    eventFire(document.getElementsByClassName('control-next')[0], 'click');
}

function goPrevious() {
    eventFire(document.getElementsByClassName('control-prev')[0], 'click');
}

function getTitle() {
    var element = document.getElementsByClassName('playing-title')[0];

    if(element)
        return element.innerText;

    return "";
}

function getArtistName() {
    var element = document.getElementsByClassName('playing-subtitle')[0];

    if(element)
        return element.innerText;

    return "";
}

function getVolume() {
    var field = document.getElementsByClassName('volume')[0].getElementsByClassName('noUi-origin')[0];

    if(field)
        return parseFloat( field.style.left ) / 100;

    return 0;
}

function getDuration() {
    var field = document.getElementsByClassName('playing-time-duration')[0];

    if(field) {
        var array = field.innerText.split(':');

        if(array.length == 1)
            return parseInt(array[0]);

        else if(array.length == 2)
            return parseInt(array[0])*60 + parseInt(array[1]);

        else
            return parseInt(array[0])*3600 + parseInt(array[1])*60 + parseInt(array[2]);
    }

    return 0;
}

function getPosition() {
    var field = document.getElementsByClassName('playing-time-current')[0];

    if(field) {
        var array = field.innerText.split(':');

        if(array.length == 1)
            return parseInt(array[0]);

        else if(array.length == 2)
            return parseInt(array[0])*60 + parseInt(array[1]);

        else
            return parseInt(array[0])*3600 + parseInt(array[1])*60 + parseInt(array[2]);
    }

    return 0;
}

function getArtwork() {
    var baseUrl = window.location.href.split('#')[0];
    var field = document.getElementsByClassName('playing-thumb')[0];

    return baseUrl + field.style['background-image'].replace('url(\"', '').replace('\")', '');
}

// volume float 0-1
function setVolume(volume) {
    var data = [
        {
            "id": 1000,
            "jsonrpc": 2.0,
            "method": "Application.setVolume",
            "params": [
                volume*100
            ]
        }
    ];

    $.post("http://192.168.0.25:8080/jsonrpc?Application.SetVolume", data, function(data, status){
        console.log("Data: " + data + "\nStatus: " + status);
    });
}

// position in seconds
function seekToPosition(position) {
    //document.getElementsByClassName('playing-progress')[0].getElementsByClassName('noUi-origin')[0].
}

/**
 * Get the playing state
 */
function getState() {
    // Playing
    if( document.getElementsByClassName('kodi-playing')[0] )
        return mellowplayer.PlaybackStatus.PLAYING;

    // Paused
    if( document.getElementsByClassName('kodi-paused')[0] )
        return mellowplayer.PlaybackStatus.PAUSED;

    // Stopped
    return mellowplayer.PlaybackStatus.STOPPED;
}

/**
 * Send an event
 */
function eventFire(el, etype){
    if (el.fireEvent) {
        el.fireEvent('on' + etype);
    } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
    }
}

function addToFavorites() {}
function removeFromFavorites() {}
