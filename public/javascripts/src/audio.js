/*
 * Created by barnabasnomo on 11/15/17 at 8:03 AM
*/

function progressBar() {
    var oAudio = document.getElementById('myaudio');
    var elapsedTime = Math.round(oAudio.currentTime);
    var prog = document.getElementsByClassName('playing')[0].getElementsByClassName('podcast-elapsed-bar')[0];
    var seek =document.getElementsByClassName('playing')[0].getElementsByClassName('seek')[0];
    var pWidth = (elapsedTime / oAudio.duration) * 100;
    prog.style.width = pWidth + "%";
    seek.style.left = pWidth -50 +"%";
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
                    document.getElementsByClassName('playing')[0].classList.remove('playing');
                }
                domEl.classList.add('playing');
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

    // Click Handler for each
    [].forEach.call(document.getElementsByClassName('play-podcast'), function (el) {
        el.addEventListener('click', function (e) {
            if (!e) {
                e = window.event;
            }
            try {
                var pane = el.parentNode.parentNode.parentElement;
                playAudio(pane);
            } catch (err) {
                catcher(err);
            }
        })
    });
}

function catcher(e) {
    if (window.console && console.error("Error: " + e)) ;
}

window.addEventListener("DOMContentLoaded", initEvents, false);