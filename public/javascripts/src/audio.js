/*
 * Created by barnabasnomo on 11/15/17 at 8:03 AM
*/
var nowMoment = moment();

function progressBar() {
    if (document.getElementsByClassName('playing')[0]) {
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
    } else {
        var oAudio = document.getElementById('myaudio');
        var date = new Date(null);
        date.setSeconds(Number(oAudio.currentTime));
        var myRange = document.getElementById('stat_bar');
        myRange.max = oAudio.duration;
        myRange.value = oAudio.currentTime;
    }
}

function playAudio(domEl) {
    if (window.HTMLAudioElement) {
        try {
            var oAudio = document.getElementById('myaudio'),
                audioUrl = domEl.getElementsByClassName('audio-src')[0],
                last_post = Number(domEl.getElementsByClassName('myBar')[0].value)
            ;
            if (oAudio.src.toString() != audioUrl.value.toString()) {
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
    var audioURL = null;
    var play_button = null;
    var single = null;
    if (document.getElementById('dompe')) {
        audioURL = document.getElementById('dompe').value;
    }

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
    if (audioURL != null) {
        oAudio.src = audioURL;
    }

    if (document.getElementById('play_stat')) {
        play_button = document.getElementById('play_stat');
    }
    if (play_button != null) {
        play_button.addEventListener('click', function (e) {
            e = e || window.event;
            try {
                var play_button = document.getElementById('play_stat');
                var oAudio = document.getElementById('myaudio');
                if (oAudio.paused) {
                    play_button.classList.add('ion-pause');
                    play_button.classList.remove('ion-play');
                    oAudio.play();
                } else {
                    play_button.classList.add('ion-play');
                    play_button.classList.remove('ion-pause');
                    oAudio.pause();
                }
            } catch (error) {
                if (window.console && console.error("Error: " + error)) ;
            }
        });
    }
    if (document.getElementById('stat_bar')) {
        single = document.getElementById('stat_bar');
        single.addEventListener('input', function (e) {
            e = e || window.event;
            try {
                var single = document.getElementById('stat_bar');
                var oAudio = document.getElementById('myaudio');

                oAudio.currentTime = single.value;

            } catch (e) {
                catcher(e)
            }
        });
    }

    oAudio.addEventListener('timeupdate', progressBar, true);
    if (document.getElementsByClassName('playing')) {
        oAudio.addEventListener('ended', function () {
            document.getElementsByClassName('playing')[0].getElementsByClassName('play-podcast')[0].classList.add('ion-play');
            document.getElementsByClassName('playing')[0].getElementsByClassName('play-podcast')[0].classList.remove('ion-pause');
        });
    }
    // Click Handler for each
    [].forEach.call(document.getElementsByClassName('play-podcast'), function (el) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        var pane = el.parentNode.parentNode.parentElement;
        var progress = pane.getElementsByClassName('podcast-progress')[0];
        var seek = pane.getElementsByClassName('seek')[0];
        var mybar = pane.getElementsByClassName('myBar')[0];
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
                if (oAudio.src.toString() == audioUrl.value.toString()) {
                    oAudio.currentTime = mybar.value;
                }
            } catch (e) {
                catcher(e)
            }
        });
    });


    [].forEach.call(document.getElementsByClassName("podcast-date"), function (el) {
        el.innerText = moment(new Date(el.getAttribute('data-date')).toUTCString()).format('Do MMM. YYYY');
    });

}

window.addEventListener("DOMContentLoaded", initEvents, false);

function catcher(e) {
    if (window.console && console.error("Error: " + e)) ;
}