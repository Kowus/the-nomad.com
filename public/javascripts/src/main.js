/**
 * ===================================================================
 * main js
 *
 * -------------------------------------------------------------------
 */

(function ($) {

    "use strict";

    /*---------------------------------------------------- */
    /* Preloader
    ------------------------------------------------------ */
    $(window).load(function () {

        // will first fade out the loading animation
        $("#loader").fadeOut("slow", function () {

            // will fade out the whole DIV that covers the website.
            $("#preloader").delay(300).fadeOut("slow");

        });

    });


    /*----------------------------------------------------*/
    /*	Sticky Navigation
    ------------------------------------------------------*/
    $(window).on('scroll', function () {

        var y = $(window).scrollTop(),
            topBar = $('header');

        if (y > 1) {
            topBar.addClass('sticky');
        }
        else {
            topBar.removeClass('sticky');
        }

    });


    /*-----------------------------------------------------*/
    /* Mobile Menu
 ------------------------------------------------------ */
    var toggleButton = $('.menu-toggle'),
        nav = $('.main-navigation');

    toggleButton.on('click', function (event) {
        event.preventDefault();

        toggleButton.toggleClass('is-clicked');
        nav.slideToggle();
    });

    if (toggleButton.is(':visible')) nav.addClass('mobile');

    $(window).resize(function () {
        if (toggleButton.is(':visible')) nav.addClass('mobile');
        else nav.removeClass('mobile');
    });

    $('#main-nav-wrap li a').on("click", function () {

        if (nav.hasClass('mobile')) {
            toggleButton.toggleClass('is-clicked');
            nav.fadeOut();
        }
    });


    /*----------------------------------------------------*/
    /* Highlight the current section in the navigation bar
    ------------------------------------------------------*/
    var sections = $("section"),
        navigation_links = $("#main-nav-wrap li a");

    sections.waypoint({

        handler: function (direction) {

            var active_section;

            active_section = $('section#' + this.element.id);

            if (direction === "up") active_section = active_section.prev();

            var active_link = $('#main-nav-wrap a[href="#' + active_section.attr("id") + '"]');

            navigation_links.parent().removeClass("current");
            active_link.parent().addClass("current");

        },

        offset: '25%'

    });


    /*----------------------------------------------------*/
    /* Flexslider
    /*----------------------------------------------------*/
    $(window).load(function () {

        $('#testimonial-slider').flexslider({
            namespace: "flex-",
            controlsContainer: "",
            animation: 'slide',
            controlNav: true,
            directionNav: true,
            smoothHeight: true,
            slideshowSpeed: 7000,
            animationSpeed: 600,
            randomize: false,
            touch: true
        });

    });
    $(".twitter-share-button.lesson").attr("data-url", window.location.href);

    /*----------------------------------------------------*/
    /* Smooth Scrolling
    ------------------------------------------------------*/
    $('.smoothscroll').on('click', function (e) {

        e.preventDefault();

        var target = this.hash,
            $target = $(target);

        $('html, body').stop().animate({
            'scrollTop': $target.offset().top
        }, 800, 'swing', function () {
            window.location.hash = target;
        });

    });


    /*----------------------------------------------------*/
    /*  Placeholder Plugin Settings
    ------------------------------------------------------*/

    $('input, textarea, select').placeholder();


    /*---------------------------------------------------- */
    /* Subscription
     ------------------------------------------------------ */

    $('#mc-form').submit(function (event) {
        event.preventDefault();
        var stat_message = $('.subscribe-message');
        stat_message.html('<i class="ion ion-paper-airplane" style="color: #0087cc"></i> Submitting...');
        var $form = $('#mc-form'),
            email = $form.find('#mc-email').val(),
            url = $form.attr('action'),
            posting = $.post(url, {
                email: email,
                lname: $form.find('#mc-lname').val(),
                fname: $form.find('#mc-fname').val()
            })
        ;

        posting.done(function (data) {
            switch (data.code) {
                case 0:
                    stat_message.html('<i class="ion ion-checkmark-circled" style="color: #2f9c0a"></i>' + data.message);
                    break;
                case 1:
                    stat_message.html('<i class="ion ion-android-warning"></i>' + data.message);
                    break;
            }
            console.log(data)
        }).fail(function (err) {
            stat_message.html('<i class="ion ion-heart-broken" style="color: #f15d65"></i>' + err.message);
        });

    });


    /*---------------------------------------------------- */
    /* FitVids
    ------------------------------------------------------ */
    $(".fluid-video-wrapper").fitVids();


    /*---------------------------------------------------- */
    /*	Modal Popup
    ------------------------------------------------------ */

    $('.video-link a').magnificPopup({

        type: 'inline',
        fixedContentPos: false,
        removalDelay: 200,
        showCloseBtn: false,
        mainClass: 'mfp-fade'

    });


    $('.play-store a').magnificPopup({
        type: 'inline',
        fixedContentPos: false,
        removalDelay: 200,
        showCloseBtn: false,
        mainClass: 'mfp-fade'
    });


    $(document).on('click', '.close-popup', function (e) {
        e.preventDefault();
        $.magnificPopup.close();
    });

    /*----------------------------------------------------- */
    /* Back to top
 ------------------------------------------------------- */
    var pxShow = 300; // height on which the button will show
    var fadeInTime = 400; // how slow/fast you want the button to show
    var fadeOutTime = 400; // how slow/fast you want the button to hide
    var scrollSpeed = 300; // how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or
                           // 'fast'

    // Show or hide the sticky footer button
    jQuery(window).scroll(function () {

        if (!( $("#header-search").hasClass('is-visible'))) {

            if (jQuery(window).scrollTop() >= pxShow) {
                jQuery("#go-top").fadeIn(fadeInTime);
            } else {
                jQuery("#go-top").fadeOut(fadeOutTime);
            }

        }

    });

    $('#comment-form').submit(function (event) {
        event.preventDefault();
        var $form = $('#comment-form'),
            comment = $form.find('textarea[name="comment"]').val(),
            url = $form.attr('action'),
            podcast = $form.attr('data-podcast')
        ;

        var posting = $.post(url, {
            comment: comment,
            podcast: podcast
        });
        posting.done(function (data) {
            $form.find('textarea[name="comment"]').val("");
            $('<div class="text-left comment"><div class="pull-left"><img src="" class="comment-logo"><span class="comm-user">' + data.user.displayName + '</span></div><div class="pull-right">Controls</div><hr style="width: 80%;"><div class="comment-content">' + data.content + '<br><small class="pull-right ion ion-clock"> ' + data.createdAt + '</small><hr style="clear: both; opacity: 0;"><div class="reply_zone"><input placeholder="Post a reply" class="reply-box" data-comment_id=' + data._id + '></div></div><hr style="margin-bottom: 50px;"></div>').insertBefore('#comment-form');
        });
        posting.fail(function () {
            alert("error");
        });
    });


    $('#categories').click(function () {
        $('#cat-zone').append('<div class="col-three"><div><input style="border: none; border-bottom: 1px solid #2a6495; width:80%" name="categories" placeholder="category" autofocus><span class="dismiss-category" style="font-size: x-large" onclick="$(this).parents()[1].remove()">&times;</span></div></div>');
    });

    $('.reply-box').on("keypress", function (e) {
        var $reply = $(this);
        if (e.keyCode === 13) {
            var podcast = $('[data-ser]').attr('data-ser'),
                content = $reply.val(),
                replyTo = $reply.attr('data-comment_id')
            ;

            var createReply = $.post('/podcasts/reply', {
                podcast: podcast,
                content: content,
                comment_id: replyTo
            });

            createReply.done(function (data) {
                $reply.val("");
                $('<div style="margin-left:5%;">\n' +
                    '    <div class="pull-left reply_user">\n' +
                    '        <img src="" class="comment-logo" style="width:20px; height: 20px;">\n' +
                    '        <span class="comm-user">' + data.user.displayName + '</span>\n' +
                    '    </div>\n' +
                    '    <hr style="opacity: 0;margin: 0;padding: 0;clear: both;">\n' +
                    '    <p class="reply_content">' + data.content + '</p>\n' +
                    '    <small class="pull-right ion ion-clock"> ' + data.createdAt + '</small>\n' +
                    '    <hr style="opacity: 0;margin: 0;padding: 0;clear: both;">\n' +
                    '</div>').insertBefore($reply);
                console.log(data);
            });
            createReply.fail(function () {
                alert("Couldn't create your comment.");
            });

            return false; // prevent the button click from happening
        }
    });


    // Handle Uploads

    $("#upload_image").click(function () {
        // alert("Upload!");
        var btn = $(this);
        var file_data = $("#image_box").prop("files")[0];
        if (file_data) {


            var form_data = new FormData();
            btn.attr('disabled', true);
            btn.attr('value', 'Submitting..');
            form_data.append("image", file_data);
            $.ajax({
                url: "/@admin/upload/image",
                data: form_data,
                cache: false,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (data, status, req) {
                    btn.attr('value', 'Uploaded Successfully');
                    $('#image_loc').val(data.data.Location);
                },
                error: function (req, status, error) {
                    alert("error uploading image");
                    btn.attr('disabled', false);
                    btn.attr('value', 'Try Again');
                }
            });
        } else alert('Attach an image file to upload!');
    });

    $("#upload_audio").click(function () {
        // alert("Upload!");
        var btn = $(this);
        var file_data = $("#audio_box").prop("files")[0];
        if (file_data) {
            var form_data = new FormData();
            btn.attr('disabled', true);
            btn.attr('value', 'Submitting..');
            form_data.append("audio", file_data);
            $.ajax({
                url: "/@admin/upload/audio",
                data: form_data,
                cache: false,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (data, status, req) {
                    btn.attr('value', 'Uploaded Successfully');
                    $('#audio_loc').val(data.data.Location);
                },
                error: function (req, status, error) {
                    btn.attr('disabled', false);
                    btn.attr('value', 'Try Again');
                    alert("error uploading audio");
                }
            });
        } else alert('Attach an audio file to upload!');
    });
    $('.timer').each(function () {
        $(this).text(' ' + moment(new Date($(this).attr('data-createdAt')).toUTCString()).fromNow());
    });

    $('#season-in').on('keypress', function (e) {
        var dList = $('#json-season-list'),
            season = $(this)
        ;
        $.ajax({
            url: '/api/seasons?q=title:' + season.val(),
            type: 'GET',
            success: function (data, status, req) {
                //    Get Data elements
                for (var i = 0; i < data.length; i++) {
                    if (!dList.find('option[value="' + data[i]._id + '"]').val()) {
                        dList.find('#opts').append('<option value=' + data[i]._id + '>' + data[i].title + '</option>');
                    }
                }
            }, error: function (req, status, error) {
                console.log(error);
            }

        });
    });

    /*
        $("#season-in").autocomplete({
            // source: "/api/seasons?q=title:",
            source: function (request, response) {
                $.ajax({
                    url: "/api/seasons/",
                    type: "GET",
                    data: request,  // request is the value of search input
                    success: function (data) {
                        // Map response values to fiedl label and value
                        response($.map(data, function (el) {
                            return {
                                label: el.name,
                                value: el._id,
                                tags: el.tags
                            };
                        }));
                    }
                });
            },
            minLength: 2,
            select: function (event, ui) {
                var url = ui.item.id;
                if (url != '#') {
                    location.href = '/blog/' + url;
                }
            },

            html: true, // optional (jquery.ui.autocomplete.html.js required)

            // optional (if other layers overlap autocomplete list)
            open: function (event, ui) {
                $(".ui-autocomplete").css("z-index", 1000);
            }
        });
    */

})(jQuery);