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
            touch: true,
        });

    });


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

    $('input, textarea, select').placeholder()


    /*---------------------------------------------------- */
    /* ajaxchimp
     ------------------------------------------------------ */

    // Example MailChimp url: http://xxx.xxx.list-manage.com/subscribe/post?u=xxx&id=xxx
    var mailChimpURL = 'http://facebook.us8.list-manage.com/subscribe/post?u=cdb7b577e41181934ed6a6a44&amp;id=e65110b38d'

    $('#mc-form').ajaxChimp({

        language: 'es',
        url: mailChimpURL

    });

    // Mailchimp translation
    //
    //  Defaults:
    //	 'submit': 'Submitting...',
    //  0: 'We have sent you a confirmation email',
    //  1: 'Please enter a value',
    //  2: 'An email address must contain a single @',
    //  3: 'The domain portion of the email address is invalid (the portion after the @: )',
    //  4: 'The username portion of the email address is invalid (the portion before the @: )',
    //  5: 'This email address looks fake or invalid. Please enter a real email address'

    $.ajaxChimp.translations.es = {
        'submit': 'Submitting...',
        0: '<i class="fa fa-check"></i> We have sent you a confirmation email',
        1: '<i class="fa fa-warning"></i> You must enter a valid e-mail address.',
        2: '<i class="fa fa-warning"></i> E-mail address is not valid.',
        3: '<i class="fa fa-warning"></i> E-mail address is not valid.',
        4: '<i class="fa fa-warning"></i> E-mail address is not valid.',
        5: '<i class="fa fa-warning"></i> E-mail address is not valid.'
    }


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
    var scrollSpeed = 300; // how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'

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
            $('<div class="text-left comment"><div class="pull-left"><img src="" class="comment-logo"><span class="comm-user">'+data.user.displayName+'</span></div><div class="pull-right">Controls</div><hr style="width: 80%;"><div class="comment-content">'+data.content+ '<br><small class="pull-right ion ion-clock"> '+data.createdAt+'</small></div><hr style="margin-bottom: 50px;"></div>').insertBefore('#comment-form');
            console.log(data)
        });
        posting.fail(function () {
            alert("error");
        })
    });


    $('#categories').click(function () {
        $('#cat-zone').append('<div class="col-three"><div><input style="border: none; border-bottom: 1px solid #2a6495; width:80%" name="categories" placeholder="category" autofocus><span class="dismiss-category" style="font-size: x-large" onclick="$(this).parents()[1].remove()">&times;</span></div></div>');
    });

    $('.reply-box').on("keypress", function(e) {
        var $reply= $(this);
        if (e.keyCode == 13) {
            console.log($reply);
$('<p>'+$reply.val()+'</p>').insertBefore($reply)


            return false; // prevent the button click from happening
        }
    });



    // Handle Uploads

    $("#upload_image").click(function () {
        // alert("Upload!");
        var btn = $(this);
        var file_data = $("#image_box").prop("files")[0];
        if(file_data) {


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
                        $('#image_loc').val(data.data.Location)
                },
                error: function (req, status, error) {
                    alert("error uploading image");
                    btn.attr('disabled', false);
                    btn.attr('value', 'Try Again');
                }
            });
        }else alert('Attach an image file to upload!')
    });

    $("#upload_audio").click(function () {
        // alert("Upload!");
        var btn = $(this);
        var file_data = $("#audio_box").prop("files")[0];
        if(file_data) {
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
                        $('#audio_loc').val(data.data.Location)
                },
                error: function (req, status, error) {
                    btn.attr('disabled', false);
                    btn.attr('value', 'Try Again');
                    alert("error uploading audio");
                }
            });
        }else alert('Attach an audio file to upload!')
    });

})(jQuery);