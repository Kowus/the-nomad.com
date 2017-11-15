/*
 * Created by barnabasnomo on 11/15/17 at 8:03 AM
*/

function progressBar() {
    var oAudio = document.getElementById('myaudio');
    var elapsedTime = Math.round(oAudio.currentTime);
    var prog = document.getElementsByClassName('playing')[0].getElementsByClassName('podcast-elapsed-bar')[0];
    var pld = document.getElementsByClassName('playing')[0].getElementsByClassName('played-position')[0];
    var seek =document.getElementsByClassName('playing')[0].getElementsByClassName('seek')[0];
    var pWidth = (elapsedTime / oAudio.duration) * 100;
    prog.style.width = pWidth + "%";
    seek.style.left = pWidth -50 +"%";
    pld.value = elapsedTime;
}

function playAudio(domEl) {
    if (window.HTMLAudioElement) {
        try {
            var oAudio = document.getElementById('myaudio'),
                audioUrl = domEl.getElementsByClassName('audio-src')[0]
            ;
            if (oAudio.src.toString() != window.location.origin.toString()+audioUrl.value.toString()) {
                oAudio.src = audioUrl.value;
                if(document.getElementsByClassName('playing')[0]) {
                    document.getElementsByClassName('playing')[0].getElementsByClassName('play-podcast')[0].classList.add('ion-play');
                    document.getElementsByClassName('playing')[0].getElementsByClassName('play-podcast')[0].classList.remove('ion-pause');
                    document.getElementsByClassName('playing')[0].classList.remove('playing');
                }
                domEl.classList.add('playing');
                oAudio.currentTime = Number(domEl.getElementsByClassName('played-position')[0].value)
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

    oAudio.addEventListener('timeupdate', progressBar, true);
    oAudio.addEventListener('ended',function () {
        var prog = document.getElementsByClassName('playing')[0].getElementsByClassName('podcast-elapsed-bar')[0];
        var seek =document.getElementsByClassName('playing')[0].getElementsByClassName('seek')[0];
        document.getElementsByClassName('playing')[0].getElementsByClassName('play-podcast')[0].classList.add('ion-play');
        document.getElementsByClassName('playing')[0].getElementsByClassName('play-podcast')[0].classList.remove('ion-pause');
        var pWidth = 0;
        prog.style.width = pWidth + "%";
        seek.style.left = pWidth -50 +"%";
    });
    // Click Handler for each
    [].forEach.call(document.getElementsByClassName('play-podcast'), function (el) {
        var pane = el.parentNode.parentNode.parentElement;
        var progress = pane.getElementsByClassName('podcast-progress')[0];
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

        progress.addEventListener('click', function (e) {
            var oAudio = document.getElementById('myaudio');
            var progress = pane.getElementsByClassName('podcast-progress')[0];
            if (!e) {
                e = window.event;
            }
            try {
                oAudio.currentTime = oAudio.duration * (e.offsetX / progress.offsetWidth)
            } catch (err) {
                catcher(err);
            }

        },true)

    });
}

function catcher(e) {
    if (window.console && console.error("Error: " + e)) ;
}

window.addEventListener("DOMContentLoaded", initEvents, false);