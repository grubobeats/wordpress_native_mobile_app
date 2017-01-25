var rootURL = "https://givemejobtoday.com";
// var rootURL = "https://biplane.ru";

$$.ajax({
    dataType: "json",
    url: rootURL + "/wp-json/wp/v2/posts?page=1",
    success: function(data) {

        var html = "<ul>";
        $$.each( data, function( key, val ) {
            // Main list
            html += '<div class="card demo-card-header-pic">' +
                    '<div style="background-image:url(' + val.ccw_thumbnail + ')" valign="bottom" class="card-header color-white no-border"></div>' +
                    '<div class="card-content">' +
                        '<div class="card-content-inner">' +
                        '<p class="card-title">' + val.title.rendered + '</p>' +
                    '<p>'+ val.excerpt.rendered +'</p>' +
                    '</div>' +
                    '</div>' +
                    '<div class="card-footer">' +
                        '<a href="#" class="link read-blog" data-id="' + val.id + '">Подробно</a>' +
                    '</div>' +
                    '</div>';
        });

        html += "</ul>";

        $$('#app').html(html);
    },
    error: function(m) {
        console.log(m)
    }
});


// Loading flag
var loading = false;

// Last loaded index
var lastIndex = $$('.list-block li').length;

// Max items to load
var maxItems = 10;


var counter = 2;
// Attach 'infinite' event handler
$$('.infinite-scroll').on('infinite', function () {

    // Exit, if loading in progress
    if (loading) return;

    // Set loading flag
    loading = true;

    // Emulate 1s loading
    setTimeout(function () {
        // Reset loading flag
        loading = false;

        if (lastIndex >= maxItems) {
            // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
            myApp.detachInfiniteScroll($$('.infinite-scroll'));
            // Remove preloader
            $$('.infinite-scroll-preloader').remove();
            return;
        }

        // Generate new items HTML
        var html = '';


        $$.ajax({
            dataType: "json",
            url: rootURL + "/wp-json/wp/v2/posts?page=" + counter,
            success: function(data) {

                $$.each( data, function( key, val ) {
                    // Main list
                    html += '<div class="card demo-card-header-pic">' +
                        '<div style="background-image:url(' + val.ccw_thumbnail + ')" valign="bottom" class="card-header color-white no-border"></div>' +
                        '<div class="card-content">' +
                        '<div class="card-content-inner">' +
                            '<p class="card-title">' + val.title.rendered + '</p>' +
                            '<p>'+ val.excerpt.rendered +'</p>' +
                        '</div>' +
                        '</div>' +
                        '<div class="card-footer">' +
                            '<a href="#" class="link read-blog" data-id="' + val.id + '">Подробно</a>' +
                        '</div>' +
                        '</div>';
                });

                if (data.length < 1) {
                    myApp.detachInfiniteScroll($$('.infinite-scroll'));
                    // Remove preloader
                    $$('.infinite-scroll-preloader').remove();
                }

                // Append new items
                $$('.list-block ul').append(html);

            },
            error: function(m) {
                console.log(m)
            }
        });

        counter++;

        // Update last loaded index
        lastIndex = $$('.list-block li').length;

    }, 1000);
});


// On clicking button to read blog post
$$(document.body).on('click', '.read-blog', function(){
    var singleBlog = new Framework7();

    $$.ajax({
        dataType: "json",
        url: rootURL + "/wp-json/wp/v2/posts/" + $$(this).data('id'),
        success: function(msg) {
            // Dynamic page
            var mainView = singleBlog.addView('.view-main'),
                newPageContent = '<div class="page" data-page="my-page">' +
                    '<div class="page-content inner-page">' +
                        '<div class="content-block-thumbnail"><img data-src="' + msg.ccw_thumbnail +  '" class="lazy lazy-fadein"></div>' +
                        '<div class="content-block-title">' + msg.title.rendered +  '</div>' +
                        '<div class="content-block content-data">' + msg.content.rendered +  '</div>' +
                    '</div>' +
                    '</div>';

            // OR using .load method if need more options
            mainView.router.load({
                content: newPageContent,
                animatePages: true
            });

            myApp.hideNavbar('.navbar');
            myApp.showToolbar('.toolbar');
            // $$('.page-content').css('padding-top', '0');
        },
        error: function(msg) {
            console.log(msg)
        }
    });
});

$$('.back').on('click', function(){
    myApp.showNavbar('.navbar');
    myApp.hideToolbar('.toolbar');
    // $$('.page-content').css('padding-top', '44px');
});