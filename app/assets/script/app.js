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

    var PRIORITY_URL = 'https://newsroom.psba.qld.gov.au/services/PostFeed.svc/GetPosts/GetPosts/1095';
    var PRIORITY_LIMIT = 3;
    var ANNOUNCEMENTS_URL = 'https://newsroom.psba.qld.gov.au/services/PostFeed.svc/GetPosts/GetPosts/0';
    var ANNOUNCEMENTS_LIMIT = 8;
    var TIME_DELAY = 300;
    var USE_MOCKS = false;
    var TOTAL = 8;

    // react component
    var NewsFeed = React.createClass({
        getInitialState: function () {
            return {
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

        getPriorityFeed: function () {
            //console.log('XDomainRequest: ', 'XDomainRequest' in window);
            // reset state
            this.setState(this.getInitialState());
            var component = this;
            // request feed
            $.ajax({
                type: 'GET',
                url: this.props.url.priority,
                contentType: 'application/json; charset=utf-8',
                crossDomain: true,
                dataType: 'jsonp',
                jsonp: 'callback',
                async: false,
                timeout: 10000 // timeout after 10 seconds
            }).done(function ( jqXHR ) {
                component.setComponentState( jqXHR );
            }).fail(function ( jqXHR, textStatus ) {
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
                } else {
                    console.log('Uncaught Error.n' + jqXHR.responseText);
                }
                component.setState({
                    error: true,
                    loading: false
                });
            });
        },

        getAnnouncementsFeed: function () {
            var component = this;
            // request feed
            $.ajax({
                type: 'GET',
                url: this.props.url.announcements,
                contentType: 'application/json; charset=utf-8',
                crossDomain: true,
                dataType: 'jsonp',
                jsonp: 'callback',
                async: false,
                timeout: 10000 // timeout after 10 seconds
            }).done(function ( jqXHR ) {
                component.setComponentState( jqXHR );
            }).fail(function ( jqXHR, textStatus ) {
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
                } else {
                    console.log('Uncaught Error.n' + jqXHR.responseText);
                }
                component.setState({
                    error: true,
                    loading: false
                });
            });
        },

        setComponentState: function (response) {
            var key = (!this.state.json.priority) ? 'priority' : 'announcements';
            var data = {};
            if (this.props.mock) {
                data = Mocks.getNews[ key ](true);
            } else {
                data = response;
            }

            if (!this.state.json.priority) {
                // change mocks format
                var trigger = (data.hasOwnProperty('GetPostsResult')) ? !!data['GetPostsResult'].length : !!data.length;
                this.setState({
                    error: false,
                    loading: true,
                    emergency: trigger,
                    json: {
                        priority: data, // append these news items
                        announcements: null
                    }
                });
                this.getAnnouncementsFeed();

            }
            else {
                this.setState({
                    loading: false,
                    json: {
                        priority: this.state.json.priority,
                        announcements: data // append these news items
                    }
                });
                this.handleFeedData();
            }
        },

        handleFeedData: function () {
            if (!!Object.keys(this.state.json).length) {
                var catImages = Mocks.getCategoryImages();
                var cleanJson = this.cleanFeedItems();
                var feedItems = this.parseFeedItems(cleanJson, catImages);
                // if feed items length is true && data items length is not false (true)
                if (!!feedItems.length && !this.state.data.items) {
                    this.setState({
                        priority: this.props.priority,
                        // prepend these priority items
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

            $.each(json, function (key, value) {
                channel[key] = (value.hasOwnProperty('GetPostsResult')) ? value['GetPostsResult'] : value;
            });

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
                                item.image = images[ item.category ] || images[ 'default' ]; // get image
                                item.link = (item.link.contains('http:')) || item.link.replace(/http:/g, 'https:');
                                item.id = count;
                                result.push(item);
                                count++;
                            }
                        });
                    } else {
                        var item = list[0];
                        item.description = $.unescapifyHTML(item.description);
                        // get image
                        //value.image = component.getImageCategory( value.category );
                        item.image = images[ item.category ] || images[ 'default' ];
                        item.link = (item.link.contains('http:')) && item.link.replace(/http:/g, 'https:');
                        item.id = count;
                        result.push(item);
                        count++;
                    }
                }
                count++;
            });

            // splice the array depending on the parameters
//            if (result.length > this.props.total) {
//                result.splice(0, result.length - this.props.total);
//            }

            return result;
        },

        componentDidMount: function () {
            this.getPriorityFeed();
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
                        React.DOM.p({}, 'There was an error loading the news feed.')
                    )
                    : (!!this.state.data.items) ?
                    React.DOM.div({ className: 'list' }, // use 'list'
                        this.state.data.items.map(function (item) {
                            return (
                                React.DOM.div({ className: 'section', key: 'slide' + item.id },
                                    // images no longer required
                                    /*React.DOM.a({ href: item.link, target: '_blank' },
                                        React.DOM.span({ className: 'feature' },
                                            React.DOM.img({ height: 189, width: 373, alt: item.image.alt, src: item.image.src })
                                        )
                                    ),*/
                                    React.DOM.h3({},
                                      React.DOM.a({ href: item.link, target: '_blank' }, item.title )
                                    ),
                                    React.DOM.div({ className: 'feature-content' },
                                        //React.DOM.p({}, item.description),
                                        React.DOM.p({dangerouslySetInnerHTML: {__html: item.description}}),
                                        React.DOM.p({ className: 'more' },
                                            React.DOM.a({ href: item.link, title: 'Read more about: ' + item.title, target: '_blank' }, 'More...')
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
            url: {
                priority: PRIORITY_URL,
                announcements: ANNOUNCEMENTS_URL
            },
            limit: {
                priority: PRIORITY_LIMIT,
                announcements: ANNOUNCEMENTS_LIMIT
            },
            total: TOTAL,
            mock: USE_MOCKS
        }), $slider.get(0));
    });

}(jQuery, qg.swe, React, Date, Mocks));
