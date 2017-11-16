/*
 * Created by barnabasnomo on 11/15/17 at 8:03 AM
*/
var nowMoment = moment();
function progressBar() {
    var oAudio = document.getElementById('myaudio');
    var date = new Date(null);
    date.setSeconds(Number(oAudio.currentTime));
    document.getElementsByClassName('playing')[0].getElementsByClassName('podcast-elapsed')[0].innerText = date.toISOString().substr(11, 8);
    var new_date = new Date(null);
    new_date.setSeconds(Number(oAudio.duration));
    document.getElementsByClassName('playing')[0].getElementsByClassName('podcast-runtime')[0].innerText = new_date.toISOString().substr(11, 8);
    var myRange = document.getElementsByClassName('playing')[0].getElementsByClassName('myBar')[0];
    myRange.max = oAudio.duration;
    myRange.value = oAudio.currentTime;
}

function playAudio(domEl) {
    if (window.HTMLAudioElement) {
        try {
            var oAudio = document.getElementById('myaudio'),
                audioUrl = domEl.getElementsByClassName('audio-src')[0],
                last_post =Number(domEl.getElementsByClassName('myBar')[0].value)
            ;
            if (oAudio.src.toString() != window.location.origin.toString() + audioUrl.value.toString()) {
                oAudio.src = audioUrl.value;
                if (document.getElementsByClassName('playing')[0]) {
                    document.getElementsByClassName('playing')[0].getElementsByClassName('play-podcast')[0].classList.add('ion-play');
                    document.getElementsByClassName('playing')[0].getElementsByClassName('play-podcast')[0].classList.remove('ion-pause');

                    document.getElementsByClassName('playing')[0].classList.remove('playing');
                }

                domEl.classList.add('playing');
                oAudio.currentTime = last_post;
            }
            if (oAudio.paused) {
                domEl.getElementsByClassName('play-podcast')[0].classList.add('ion-pause');
                domEl.getElementsByClassName('play-podcast')[0].classList.remove('ion-play');
                oAudio.play();
            } else {
                domEl.getElementsByClassName('play-podcast')[0].classList.add('ion-play');
                domEl.getElementsByClassName('play-podcast')[0].classList.remove('ion-pause');
                oAudio.pause();
            }


        }
        catch (e) {
            catcher(e);
        }
    }
}


function initEvents() {
    var oAudio = document.getElementById('myaudio');
    oAudio.volume = document.getElementById('gain').value;
    document.getElementById('gain').addEventListener('input', function (e) {
        e = e || window.event;
        try {
            var oAudio = document.getElementById('myaudio');
            oAudio.volume = document.getElementById('gain').value;
        } catch (e) {
            catcher(e)
        }
    });
    var oAudio = document.getElementById('myaudio');

    oAudio.addEventListener('timeupdate', progressBar, true);
    oAudio.addEventListener('ended', function () {
        document.getElementsByClassName('playing')[0].getElementsByClassName('play-podcast')[0].classList.add('ion-play');
        document.getElementsByClassName('playing')[0].getElementsByClassName('play-podcast')[0].classList.remove('ion-pause');
    });
    // Click Handler for each
    [].forEach.call(document.getElementsByClassName('play-podcast'), function (el) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        var pane = el.parentNode.parentNode.parentElement;
        var progress = pane.getElementsByClassName('podcast-progress')[0];
        var seek = pane.getElementsByClassName('seek')[0];
        var mybar = pane.getElementsByClassName('myBar')[0];
        var mydate = pane.getElementsByClassName('podcast-date')[0];
        el.addEventListener('click', function (e) {
            if (!e) {
                e = window.event;
            }
            try {

                playAudio(pane);
            } catch (err) {
                catcher(err);
            }
        });
        mybar.addEventListener('input', function (e) {
            e = e || window.event;
            try {
                var mybar = pane.getElementsByClassName('myBar')[0];
                var oAudio = document.getElementById('myaudio'),
                    audioUrl = pane.getElementsByClassName('audio-src')[0];
                // console.log('hello')
                if (oAudio.src.toString() == window.location.origin.toString() + audioUrl.value.toString()) {
                    oAudio.currentTime = mybar.value;
                }
            } catch (e) {
                catcher(e)
            }
        });
        mydate.innerText = moment(new Date(mydate.getAttribute('data-date')).toUTCString()).format('Do MMM. YYYY');
        /*
                progress.addEventListener('click', function (e) {
                    var oAudio = document.getElementById('myaudio');
                    var progress = pane.getElementsByClassName('podcast-progress')[0];
                    if (!e) {
                        e = window.event;
                    }
                    try {
                        console.log(e);
                        oAudio.currentTime = oAudio.duration * (e.offsetX / progress.offsetWidth)
                    } catch (err) {
                        catcher(err);
                    }

                }, true);*/
    });
}

window.addEventListener("DOMContentLoaded", initEvents, false);



// Audio Context
/*

// Create an AudioContext instance for this sound
var audioContext = new (window.AudioContext || window.webkitAudioContext)();


// Create a buffer for the incoming sound content
var source = audioContext.createBufferSource();
// Create the XHR which will grab the audio contents
var request = new XMLHttpRequest();
var cur_url = null;
window.addEventListener("DOMContentLoaded", initEvents, false);
var gainNode = audioContext.createGain();


function initEvents() {

    document.getElementById('gain').addEventListener('input',function (e) {
        e = e || window.event;
        try{
            gainNode.gain.value = document.getElementById('gain').value;
        }catch (e){
            catcher(e)
        }
    });

    [].forEach.call(document.getElementsByClassName('play-podcast'), function (el) {
        var pane = el.parentNode.parentNode.parentElement;
        el.addEventListener('click', function (e) {
            if (!e) {
                e = window.event;
            }
            try {


                playAudio(pane)


            } catch (err) {
                catcher(err);
            }
        });
    });

}


function playAudio(domEl) {
    if (audioContext) {
        try {

            var audioUrl = domEl.getElementsByClassName('audio-src')[0];
            if (cur_url != audioUrl.value.toString()) {
                cur_url = audioUrl.value;
                if (document.getElementsByClassName('playing')[0]) {
                    document.getElementsByClassName('playing')[0].getElementsByClassName('play-podcast')[0].classList.add('ion-play');
                    document.getElementsByClassName('playing')[0].getElementsByClassName('play-podcast')[0].classList.remove('ion-pause');

                    document.getElementsByClassName('playing')[0].classList.remove('playing');
                }

                        domEl.getElementsByClassName('play-podcast')[0].classList.add('ion-pause');
                        domEl.getElementsByClassName('play-podcast')[0].classList.remove('ion-play');
                // Set the audio file src here
                request.open('GET', cur_url, true);
                request.onload = function () {
                    // Decode the audio once the require is complete
                    audioContext.decodeAudioData(request.response, function (buffer) {
                        source.buffer = buffer;
                        // Connect the audio to source (multiple audio buffers can be connected!)
                        source.connect(gainNode);
                        gainNode.connect(audioContext.destination);
                        // Simple setting for the buffer
                        source.loop = true;
                        // Play the sound!
                        source.start(0);
                        console.log(source)
                    }, function (e) {
                        console.log('Audio error! ', e);
                    });
                };
                // Send the request which kicks off
                request.send();
                // Setting the responseType to arraybuffer sets up the audio decoding
                request.responseType = 'arraybuffer';

            }else {
                if (audioContext.state === 'running') {
                    audioContext.suspend().then(function () {
                        domEl.getElementsByClassName('play-podcast')[0].classList.add('ion-play');
                        domEl.getElementsByClassName('play-podcast')[0].classList.remove('ion-pause');
                    });
                } else if (audioContext.state === 'suspended') {
                    audioContext.resume().then(function () {
                        domEl.getElementsByClassName('play-podcast')[0].classList.add('ion-pause');
                        domEl.getElementsByClassName('play-podcast')[0].classList.remove('ion-play');
                    });
                }
            }
            domEl.classList.add('playing');

        }
        catch (e) {
            catcher(e);
        }
    } else {
        alert("Your browser cannot play this audio file. Please consider using another browser or upgrading your current version!");
    }
}




*/
function catcher(e) {
    if (window.console && console.error("Error: " + e)) ;
}