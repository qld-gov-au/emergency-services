/* globals jQuery, qg, xml2json, React, Date, Mocks */
/* jshint expr:true, unused:false, newcap:false, sub: true */

if (!String.prototype.contains) {
    String.prototype.contains = function (arg) {
        'use strict';
        return !!~this.indexOf(arg);
    };
}

(function ($, swe, React, Date, Mocks) {
    'use strict';

    var TOTAL = 8;
    var TIME_DELAY = 300;
    var USE_MOCKS = false;
    var LIMIT_PRIORITY = 3;
    var LIMIT_ANNOUNCEMENTS = 8;
    var XML_PRIORITY_URL = 'https://newsroom.psba.qld.gov.au/rss/1095';
    var XML_ANNOUNCEMENTS_URL = 'https://newsroom.psba.qld.gov.au/rss/0';
    var JSON_PRIORITY_URL = 'https://newsroom.psba.qld.gov.au/services/PostFeed.svc/GetPosts/GetPosts/1095';
    var JSON_ANNOUNCEMENTS_URL = 'https://newsroom.psba.qld.gov.au/services/PostFeed.svc/GetPosts/GetPosts/0';

    // react component
    var NewsFeed = React.createClass({
        getInitialState: function () {
            return {
                method: null,
                loading: true,
                error: false,
                emergency: false,
                json: {
                    priority: null,
                    announcements: null
                },
                data: {
                    items: null,
                    images: null
                }
            };
        },

        consoleLogObject: function (val) {
            if (typeof val === 'object') {
                for (var x in val) {
                    if (val.hasOwnProperty(x)) {
                        console.log(typeof val[x]);
                        if (typeof val[x] === 'object') {
                            var str = JSON.stringify(val[x]);
                            console.log(x + ': ', str);
                        } else {
                            console.log(x + ': ', val[x]);
                        }
                    }
                }
            }
        },

        getLoadMethod: function () {
            // reset state
            this.setState(this.getInitialState());
            // check IE value
            var isIE = this.checkBrowserVersion();
            var load = (isIE) ? 'jsonp' : 'xml';
            // set state
            this.setState({
                method: load
            });
            // get priority feed
            this.getPriorityFeed();
        },

        checkBrowserVersion: function () {
            var browser = null,
                ieVersion = null;
            // check if browser supports documentMode
            if (document.documentMode) { // as of IE8
                browser = 'IE';
                ieVersion = document.documentMode;
            }
            // return boolean
            return (ieVersion >= 8 && ieVersion <= 10);
        },

        jqxhrErrors: function (jqXHR, textStatus) {
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
            // set state
            this.setState({
                error: true,
                loading: false
            });
        },

        jqxhrXML: function (endPoint) {
            var component = this;
            // request feed
            $.ajax({
                url: endPoint,
                type: 'GET',
                // async: false,
                dataType: ($.browser.msie) ? 'text' : 'xml',
                // contentType: 'text/xml',
                timeout: 10000 // timeout after 10 seconds
            }).done(function ( jqXHR ) {
                // did we get RSS?
                if ( jqXHR.documentElement.tagName === 'rss' ) {
                    component.setComponentState( jqXHR );
                }  else {
                    // probably redirected to a HTML error
                    component.jqxhrErrors(jqXHR, 'not-rss');
                }
            }).fail(function ( jqXHR, textStatus, errorThrown ) {
                component.jqxhrErrors(jqXHR, textStatus);
            });
        },

        jqxhrJSON: function (endPoint) {
            var component = this;
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
                component.setComponentState( jqXHR );
            }).fail(function ( jqXHR, textStatus ) {
                component.jqxhrErrors(jqXHR, textStatus);
            });
        },

        getPriorityFeed: function () {
            // log state
            // this.consoleLogObject(this.state);
            if (this.state.method === 'xml') {
                this.jqxhrXML(this.props.xml.priority);
            } else {
                this.jqxhrJSON(this.props.json.priority);
            }
        },

        getAnnouncementsFeed: function () {
            if (this.state.method === 'xml') {
                this.jqxhrXML(this.props.xml.announcements);
            } else {
                this.jqxhrJSON(this.props.json.announcements);
            }
        },

        setComponentState: function (response) {
            var data = {};
            var key = (!this.state.json.priority) ? 'priority' : 'announcements';
            // if using mocks then grab dummy data
            if (this.props.mock) {
                data = Mocks.getNews[key](true);
            } else {
                data = (this.state.method === 'xml') ? $.xml2json(response) : response;
            }
            // if no priority items set
            if (!this.state.json.priority) {
                // set emergency trigger
                var trigger = null;
                if (this.state.method === 'xml') {
                    trigger = (data.hasOwnProperty('#document')) ? !!data['#document'].rss.channel.item : !!data.length;
                } else {
                    trigger = (data.hasOwnProperty('GetPostsResult')) ? !!data['GetPostsResult'].length : !!data.length;
                }
                // set state
                this.setState({
                    error: false,
                    loading: true,
                    emergency: trigger,
                    json: {
                        priority: data, // set news items
                        announcements: null
                    }
                });
                // get announcements feed
                this.getAnnouncementsFeed();
            } else {
                // set state
                this.setState({
                    loading: false,
                    json: {
                        priority: this.state.json.priority,
                        announcements: data // set news items
                    }
                });
                // handle our data set
                this.handleFeedData();
            }

        },

        handleFeedData: function () {
            // check if object has keys
            if (!!Object.keys(this.state.json).length) {
                var catImages = Mocks.getCategoryImages();
                var cleanJson = this.cleanFeedItems();
                var feedItems = this.parseFeedItems(cleanJson, catImages);
                // if feed items length is true && data items length is not false (true)
                if (!!feedItems.length && !this.state.data.items) {
                    // set state
                    this.setState({
                        data: {
                            images: catImages,
                            items: feedItems
                        }
                    });
                }
            }
        },

        cleanFeedItems: function () {
            var stringify = JSON.stringify(this.state.json);
            var replace = stringify.replace(/(<script.*?>.*?<\/script>)/g, '').replace(/(<iframe.*?>.*?<\/iframe>)/g, '');
            return JSON.parse(replace);
        },

        parseFeedItems: function (json, images) {
            var result = [],
                channel = {},
                component = this,
                count = 0;
            // if we need xml, then use a different object to json
            if (this.state.method === 'xml') {
                $.each(json, function (key, value) {
                    var data = (value.hasOwnProperty('#document')) ? value['#document'].rss.channel : value;
                    if (!!data.item) {
                        channel[key] = [];
                        if (!!data.item.length) {
                            $.each(data.item, function (x, item) {
                                channel[key].push(item);
                            });
                        } else {
                            channel[key].push(data.item);
                        }
                    }
                });
            } else {
                $.each(json, function (key, value) {
                    channel[key] = (value.hasOwnProperty('GetPostsResult')) ? value['GetPostsResult'] : value;
                });
            }

            // are there any items!?
            if (!Object.keys(channel).length) {
                return [];
            }

            // set an array from each item and escape the content
            $.each(channel, function (key, list) {
                // set an array from each item and escape the content
                if (!!list.length) {
                    if (list.length >= 1) {
                        // loop through
                        $.each(list, function (index, item) {
                            if (count <= component.props.limit[key]) {
                                item.description = $.unescapifyHTML(item.description);
                                // get image
                                // item.image = images[ item.category ] || images[ 'default' ]; // get image
                                item.link = (item.link.contains('http:')) && item.link.replace(/http:/g, 'https:');
                                item.id = count;
                                result.push(item);
                                count++;
                            }
                        });
                    } else {
                        var item = list[0];
                        item.description = $.unescapifyHTML(item.description);
                        // get image
                        // item.image = component.getImageCategory( value.category );
                        item.image = images[ item.category ] || images[ 'default' ];
                        item.link = (item.link.contains('http:')) && item.link.replace(/http:/g, 'https:');
                        item.id = count;
                        result.push(item);
                        count++;
                    }
                }
                count++;
            });

            return result;
        },

        componentDidMount: function () {
            this.getLoadMethod();
            // setInterval(this.getFeed, this.props.pollInterval);
        },

        componentDidUpdate: function () {
            if (this.state.data.items) {
                var $slides = $('.slide-runner');
                var $parent = $slides.parents('.announcements');
                var component = this;
                // position slides
                if (this.state.emergency) {
                    $('body').addClass('emergency-state');
                    $('h1', '#content').first().after($parent);
                } else {
                    $('body').removeClass('emergency-state');
                    $('#asides').after($parent);
                }

                // set up slides and controls
                $slides.each(function (key) {
                    var $this = $(this);
                    window.setTimeout(function () {
                        $this.slideRunner({
                            key: key,
                            grouping: 3,                         // the grouping for responsive view (default is 3)
                            timeout: 6,                          // the timeout for autoplay (in seconds)
                            easing: 'linear',                    // the easing setting (jQuery easing plugin)
                            controlsPosition: 'above',           // the position of the controls (above or below)
                            autoplay: !component.state.emergency,// the trigger for autoplay
                            fluid: true                          // the trigger for fluid width
                        });
                    }, TIME_DELAY);
                });
                var onResizeSlides = function () {
                    $slides.each(function () {
                        $(this).slideRunner().setResize();
                    });
                };
                $(window).smartresize(onResizeSlides);
            }
        },

        render: function () {
            return (
                (!!this.state.loading) ?
                    React.DOM.div({ className: 'status info' },
                        React.DOM.h2({}, 'Loading…'),
                        React.DOM.p({}, 'Please wait while we fetch the news.')
                    )
                    : (!!this.state.error) ?
                    React.DOM.div({ className: 'status info' },
                        React.DOM.h2({}, 'Error'),
                        React.DOM.p({}, 'There was an error loading the news feed.'),
                        React.DOM.p({},
                            React.DOM.a({ href: 'https://newsroom.psba.qld.gov.au/', target: '_self' }, 'Go to the Queensland Fire and Emergency Services Newsroom' )
                        )
                    )
                    : (!!this.state.data.items) ?
                    React.DOM.div({ className: 'list' }, // use 'list'
                        this.state.data.items.map(function (item) {
                            return (
                                React.DOM.div({ className: 'section', key: 'slide' + item.id },
                                    // images no longer required
                                    /*React.DOM.a({ href: item.link, target: '_self' },
                                        React.DOM.span({ className: 'feature' },
                                            React.DOM.img({ height: 189, width: 373, alt: item.image.alt, src: item.image.src })
                                        )
                                    ),*/
                                    React.DOM.h3({},
                                      React.DOM.a({ href: item.link, target: '_self' }, item.title )
                                    ),
                                    React.DOM.div({ className: 'feature-content' },
                                        //React.DOM.p({}, item.description),
                                        React.DOM.p({dangerouslySetInnerHTML: {__html: item.description}}),
                                        React.DOM.p({ className: 'more' },
                                            React.DOM.a({ href: item.link, title: 'Read more about: ' + item.title, target: '_self' }, 'More...')
                                        )
                                    )
                                )
                                );
                        })
                    )
                    // no data
                    : React.DOM.div({ className: 'status info' },
                    React.DOM.h2({}, 'No news'),
                    React.DOM.p({}, 'Please check back later.')
                )
                );

        }
    });

    // onReady
    $(function () {
        // set jquery objects
        var $slider = $('.slide-runner');
        // render components
        React.renderComponent(NewsFeed({
            xml: {
                priority: XML_PRIORITY_URL,
                announcements: XML_ANNOUNCEMENTS_URL
            },
            json: {
                priority: JSON_PRIORITY_URL,
                announcements: JSON_ANNOUNCEMENTS_URL
            },
            limit: {
                priority: LIMIT_PRIORITY,
                announcements: LIMIT_ANNOUNCEMENTS
            },
            total: TOTAL,
            mock: USE_MOCKS
        }), $slider.get(0));
    });

}(jQuery, qg.swe, React, Date, Mocks));
