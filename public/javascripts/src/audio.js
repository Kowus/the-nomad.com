/*
 * Created by barnabasnomo on 11/15/17 at 8:03 AM
*/
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
                last_post = Number(domEl.getElementsByClassName('myBar')[0].value),
                p_id = domEl.getAttribute('data-identifier')
            ;
            if (oAudio.src.toString() != audioUrl.value.toString()) {

                var xhttp = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        domEl.getElementsByClassName('plays')[0].innerHTML = JSON.parse(this.response).curr_played;
                    }
                };
                xhttp.open("POST", "/podcasts/play", true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send("_id=" + p_id);


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
    var alr_played = false;
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
                if (alr_played === false) {
                    var p_id = document.getElementById('played').getAttribute('data-identifier');
                    var xhttp = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
                    xhttp.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            document.getElementById('played').innerText = JSON.parse(this.response).curr_played;
                        }
                    };
                    xhttp.open("POST", "/podcasts/play", true);
                    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhttp.send("_id=" + p_id);
                    alr_played = true;
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
            alr_played = false;
            try {
                document.getElementsByClassName('playing')[0].getElementsByClassName('play-podcast')[0].classList.add('ion-play');
                document.getElementsByClassName('playing')[0].getElementsByClassName('play-podcast')[0].classList.remove('ion-pause');
            } catch (err) {
                catcher(err)
            }
            try {
                document.getElementById('play_stat').classList.remove('ion-pause');
                document.getElementById('play_stat').classList.add('ion-play');
            } catch (err) {
                catcher(err)
            }
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


    [].forEach.call(document.getElementsByClassName('comment'), function (el) {
        // console.log(el.getAttribute('data-_id'));
        var p_id = el.getAttribute('data-_id');
        var xhttp = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var comment = JSON.parse(this.response).comment;
                el.getElementsByClassName('comment-logo')[0].setAttribute('src',comment.user.profile_picture||'/favicon.png');
                el.getElementsByClassName('comm-user')[0].innerHTML = comment.user.displayName;
                el.getElementsByClassName('comment-content')[0].innerHTML = comment.content+"<br><small class=\"pull-right createdAt\">"+moment(new Date(comment.createdAt).toUTCString()).fromNow()+"</small>";
                // el.getElementsByClassName('createdAt')[0].innerHTML = comment.createdAt;
                    //
            }
        };
        var commUrl = "/podcasts/comment?obj_id=" + p_id;
        xhttp.open("GET", commUrl, true);
        xhttp.send();
    });
}

window.addEventListener("DOMContentLoaded", initEvents, false);

function catcher(e) {
    if (window.console && console.error("Error: " + e)) ;
}