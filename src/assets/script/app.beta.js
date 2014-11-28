/* globals jQuery, qg, xml2json, React, Date, Mocks, Handlebars */
/* jshint expr:true, unused:false, newcap:false, sub: true */

if (!String.prototype.contains) {
    String.prototype.contains = function (arg) {
        'use strict';
        return !!~this.indexOf(arg);
    };
}

qg.swe.emergency = (function ($, swe, Date, Mocks) {
    'use strict';

    // jquery objects
    var $parent = $('.announcements');
    var $slides = $parent.find('.emergency-feed');

    var template = {
        loading: $('#loading-template').html(),
        error: $('#error-template').html(),
        list: $('#list-template').html()
    };

    // parameters
    var TOTAL = 8;
    var TIME_DELAY = 300;
    var JSON_KEY = 'GetPostsResult';
    var PRIORITY_URL = 'https://newsroom.psba.qld.gov.au/services/PostFeed.svc/GetPosts/GetPosts/1095';
    var ANNOUNCEMENTS_URL = 'https://newsroom.psba.qld.gov.au/services/PostFeed.svc/GetPosts/GetPosts/0';

    var app = {
        init: function () {
            // properties
            this.props = {
                mocks: false,
                loading: true,
                error: false,
                emergency: false,
                json: {
                    priority: null,
                    standard: null
                },
                data: {
                    items: null,
                    images: null
                }
            };

            // set template
            this.show.loading();
            // get data
            this.data.priority();
        },
        get: {
            json: function (endPoint) {
                // request feed
                $.ajax({
                    type: 'GET',
                    url: endPoint,
                    contentType: 'application/json; charset=utf-8',
                    crossDomain: true,
                    dataType: 'jsonp',
                    jsonp: 'callback',
                    // async: false,
                    timeout: 10000 // timeout after 10 seconds
                }).done(function ( jqXHR ) {
                    app.set.state(jqXHR);
                }).fail(function ( jqXHR, textStatus ) {
                    app.get.errors(jqXHR, textStatus);
                });
            },
            errors: function (jqXHR, textStatus) {
                // log errors
                if (jqXHR.status === 0) {
                    console.log('No connection. Verify Network.');
                } else if (jqXHR.status === 404) {
                    console.log('Requested page not found. [404]');
                } else if (jqXHR.status === 500) {
                    console.log('Internal Server Error [500].');
                } else if (textStatus === 'parsererror') {
                    console.log('Requested JSON parse failed.');
                } else if (textStatus === 'timeout') {
                    console.log('Time out error.');
                } else if (textStatus === 'abort') {
                    console.log('Ajax request aborted.');
                } else if (textStatus === 'not-rss') {
                    console.log('Invalid RSS');
                } else {
                    console.log('Uncaught error: ' + jqXHR.responseText);
                }
                // set props
                app.props.error = true;
                app.props.loading = false;
            },
            images: function () {

            }
        },
        set: {
            state: function(response) {
                // set data key
                var key = (!app.props.json.priority) ? 'priority' : 'standard';
                // if using mocks then grab dummy data
                var data = app.props.mock ? Mocks.getNews[key](true) : (response.hasOwnProperty(JSON_KEY)) && response[JSON_KEY];
                // if no priority items set
                if (!app.props.json.priority) {
                    // set emergency trigger
                    var trigger = !!data.length;
                    // set props
                    app.props.error = false;
                    app.props.loading = true;
                    app.props.emergency = trigger;
                    app.props.json.priority = data;
                    // get standard feed
                    app.data.standard();
                    // set position of feed
                    app.set.position();
                } else {
                    // set props
                    app.props.loading = false;
                    app.props.json.standard = data;
                    // handle our data set
                    app.data.handle();
                }
            },
            position: function () {
                // position slides
                if (app.props.emergency) {
                    $('body').addClass('emergency-state');
                    $('h1', '#content').first().after($parent);
                } else {
                    $('body').removeClass('emergency-state');
                    $('#asides').after($parent);
                }
            },
            date: function (pubDate) {
                var date = Date.parse(pubDate);
                return {
                    timestamp: date.getTime(),
                    formattedDate: date.toString('d MMMM yyyy, h.mm') + ((date.toString('HH') >= 12) ? 'pm' : 'am')
                };
            },
            plugin: function () {
                // set up slides and controls
                $slides.addClass('slide-runner').each(function (key) {
                    var $this = $(this);
                    $this.slideRunner({
                        key: key,
                        grouping: 3,                         // the grouping for responsive view (default is 3)
                        timeout: 6,                          // the timeout for autoplay (in seconds)
                        easing: 'linear',                    // the easing setting (jQuery easing plugin)
                        controlsPosition: 'above',           // the position of the controls (above or below)
                        autoplay: !app.props.emergency,      // the trigger for autoplay
                        fluid: true                          // the trigger for fluid width
                    });
                });
                var onResizeSlides = function () {
                    $slides.each(function () {
                        $(this).slideRunner().setResize();
                    });
                };
                $(window).smartresize(onResizeSlides);
            }
        },
        data: {
            priority: function () {
                app.get.json(PRIORITY_URL);
            },
            standard: function () {
                app.get.json(ANNOUNCEMENTS_URL);
            },
            handle: function () {
                // check if object has keys
                if (!!app.props.json.priority || !!app.props.json.standard) {
                    var images = Mocks.getCategoryImages();
                    var clean = app.data.clean();
                    var items = app.data.parse(clean, images);
                    // if feed items length is true && data items length is not false (true)
                    if (!!Object.keys(items).length && !app.props.data.items) {
                        app.props.data.images = images;
                        app.props.data.items = items;
                        app.show.list();
                    } else {
                        app.show.error();
                    }
                }
            },
            clean: function () {
                var stringify = JSON.stringify(app.props.json);
                var replace = stringify.replace(/(<script.*?>.*?<\/script>)/g, '').replace(/(<iframe.*?>.*?<\/iframe>)/g, '');
                return JSON.parse(replace);
            },
            parse: function(clean, images) {
                // create a single object
                var object = {};
                // run some formatting
                $.each($.extend({}, clean.priority, clean.standard), function (key, item) {
                    // set timestamp, etc
                    var date = app.set.date(item.pubDate);
                    var index = date.timestamp;
                    if (!object.hasOwnProperty(index)) {
                        object[index] = {
                            title: item.title,
                            description: $.unescapifyHTML(item.description),
                            link: (item.link.contains('http:')) ? item.link.replace(/http:/g, 'https:') : item.link,
                            image: null //images[ item.category ] || images[ 'default' ] // get image
                        };
                        $.extend(object[index], date);
                    }
                });
                var array = $.map(object, function(value) {
                    return [value];
                });
                return (array.length > TOTAL) ? array.slice(0, TOTAL) : array;
            }
        },
        show: {
            list: function () {
                if (!app.props.error && !!app.props.data.items) {
                    var wrapper = {items: app.props.data.items};
                    var populate = Handlebars.compile(template.list);
                    $slides.empty().append(populate(wrapper)).trigger('x-height-change');
                    app.set.plugin();
                }
            },
            error: function (message) {
                var wrapper = {error: message};
                var populate = Handlebars.compile(template.error);
                $slides.empty().append(populate(wrapper)).trigger('x-height-change');
            },
            loading: function () {
                $slides.empty().append(template.loading).trigger('x-height-change');
            }
        }
    };

    return app;

}(jQuery, qg.swe, Date, Mocks));