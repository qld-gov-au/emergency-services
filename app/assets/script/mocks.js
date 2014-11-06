/* jshint expr:true, unused:false */

// TODO if franchise needs to be able to maintain this list
// move into a JSON file the franchise can maintain
// e.g. /emergency/assets/images/newsroom/image-categories.json
// must allow JSON in FTP drop-off and deployments (or use open data?)
var Mocks = {
    getCategoryImages: function () {
        'use strict';
        return {
            'Bushfire Warnings': {
                src: '/emergency/assets/images/newsroom/bushfire.jpg',
                alt: 'Bushfire warning'
            },
            'cyclone': {
                src: '/emergency/assets/images/newsroom/cyclone.jpg',
                alt: 'Cyclone warning'
            },
            'flood': {
                src: '/emergency/assets/images/newsroom/flood.jpg',
                alt: 'Flood warning'
            },
            'High priority': {
                src: '/emergency/assets/images/newsroom/priority.jpg',
                alt: 'HIGH PRIORITY'
            },
            'default': {
                src: '/emergency/assets/images/newsroom/default.jpg',
                alt: 'News item'
            }
        };
    },
    getNews: {
        priority: function (hasItems) {
            'use strict';
            // mock data
            // http://newsroom.psba.qld.gov.au/rss/1095

            var feed = {
                rss: {
                    channel: {
                        'title': 'RSS Feed newsroom.psba.qld.gov.au/ : High Priority',
                        'link': 'http://newsroom.psba.qld.gov.au:80',
                        'description': 'Queensland Fire and Emergency Services',
                        'language': 'eng',
                        'lastBuildDate': 'Wed, 08 Oct 2014 05:50:21 GMT',
                        'item': []
                    }
                }
            };

            var feedItems = [
                {
                    'title': 'ADVICE message for bushfire at Midge Point (south of Proserpine) as at 1pm, Wednesday, 1 October',
                    'description': 'As at 1pm, a large bushfire fire is burning near Conder Parade, Midge Point (south of Proserpine). Multiple fire crews are working to contain the blaze and more crews are responding. The fire, which broke out around 11am',
                    'link': 'http://newsroom.psba.qld.gov.au:80/Content/State-News/04-Bushfire-Warnings/Article/ADVICE-message-for-bushfire-at-Midge-Point-south-of-Proserpine-as-at-1pm-Wednesday-1-October/1020/1086/2559',
                    'category': 'High Priority'
                },
                {
                    'title': 'CANCELLATION of ADVICE message for bushfire at Midge Point (south of Proserpine) as at 5.10pm, Wednesday, 1 October',
                    'description': 'Please be advised the ADVICE message for a bushfire at Midge Point has now been cancelled.&amp;nbsp;The below information is now current.&amp;nbsp;Multiple Queensland Fire and Emergency Services (QFES) crews remain',
                    'link': 'http://newsroom.psba.qld.gov.au:80/Content/State-News/04-Bushfire-Warnings/Article/CANCELLATION-of-ADVICE-message-for-bushfire-at-Midge-Point-south-of-Proserpine-as-at-5-10pm-Wednesday-1-October/1020/1086/2562',
                    'category': 'High Priority'
                },
                {
                    'title': 'Auxiliary Firefighters: a one-of-a-kind part time job - Innisfail, Kurrimine Beach, Bramston Beach, Cardwell, Tully, Mission Beach and El Arish',
                    'description': 'Do you live or work within a reasonable distance of the Innisfail, Kurrimine Beach, Bramston Beach, Cardwell, Tully, Mission Beach or El Arish Fire and Rescue Stations and have what it takes to keep your community safe? Queensland Fire and Emergency Services (QFES) would like to hear from you.&amp;nbsp;&lt;br /&gt; &lt;br /&gt; QFES Innisfail Area Director Robert Herbohn said auxiliary firefighters provided an efficient and effective service to the communities they served in the preservation of life, property and the environment.',
                    'link': 'http://newsroom.psba.qld.gov.au:80/Content/Default/2-Breaking-Update/Article/Auxiliary-Firefighters-a-one-of-a-kind-part-time-job-Innisfail-Kurrimine-Beach-Bramston-Beach-Cardwell-Tully-Mission-Beach-and-El-Arish/-3/1095/2492',
                    'category': 'High Priority'
                },
                {
                    'title': 'Waterford West - grassfire as at 4:30pm, Monday 29 September 2014',
                    'description': 'Waterford West - grassfire as at 4:30pm, Monday 29 September 2014&amp;nbsp;&lt;br /&gt;&lt;br /&gt;Queensland Fire and Emergency Services (QFES), Rural Fire Service Queensland (RFSQ) and Logan City Council fire crews are currently on scene at a grassfire burning within the boundaries of Logan Reserve Road, Beutel Street, Moffatt Road and McGrath Street, Waterford West. The fire broke out around 3:20pm today and is not threatening any property at this time. Firefighters are conducting fire suppression to extinguish the fire and are currently conducting property protection near the housing estate at the end of Moffatt Road. A large smoke haze may affect the Waterford West area, and residents are advised to close doors and windows and keep medication on hand if suffering from a respiratory illness. Smoke may affect visibility and motorists are reminded to drive to conditions and be mindful of emergency services personnel operating in the area. If residents feel their property is under threat they are advised to call Triple Zero (000) immediately.&amp;nbsp;',
                    'link': 'http://newsroom.psba.qld.gov.au:80/Content/Default/2-Breaking-Update/Article/Waterford-West-grassfire-as-at-4-30pm-Monday-29-September-2014/-3/1095/2493',
                    'category': 'High Priority'
                }
            ];

            if (hasItems) {
                feed.rss.channel.item = feedItems;
            }

            return feedItems;
        },
        announcements: function (hasItems) {
            'use strict';
            // mock data
            // http://newsroom.psba.qld.gov.au/RSS/0

            var feed = {
                rss: {
                    channel: {
                        'title': 'RSS Feed newsroom.psba.qld.gov.au/ : All Categories',
                        'link': 'http://newsroom.psba.qld.gov.au:80',
                        'description': 'Queensland Fire and Emergency Services',
                        'language': 'eng',
                        'lastBuildDate': 'Wed, 08 Oct 2014 05:50:21 GMT',
                        'item': []
                    }
                }
            };

            var feedItems = [
                {
                    'title': 'TEST Bushfire Warning',
                    'description': '<script>alert("Boo!");</script> THE FOLLOWING INFORMATION MUST BE BROADCAST VERBATIM: Queensland Fire and Emergency Services (QFES) is advising residents in the vicinity of LOCATION to finalise their bushfire plans.',
                    'link': 'http://newsroom.psba.qld.gov.au:80/Content/State-News/3-Bushfire-Warnings/Article/TEST-Bushfire-Warning/1020/1086/2474',
                    'category': 'Bushfire Warnings'
                },
                {
                    'title': 'Word paste',
                    'description': 'The Jaguar XE redefines the concept of the sports saloon and will be the driver&amp;rsquo;s car in its class. Its lightweight construction, streamlined styling, luxurious interior and outstanding ride',
                    'link': 'http://newsroom.psba.qld.gov.au:80/Content/State-News/3-Bushfire-Warnings/Article/Word-paste/1020/1086/2523',
                    'category': 'Bushfire Warnings'
                },
                {
                    'title': 'Auxiliary Firefighters: a one-of-a-kind part time job - Innisfail, Kurrimine Beach, Bramston Beach, Cardwell, Tully, Mission Beach and El Arish',
                    'description': 'Do you live or work within a reasonable distance of the Innisfail, Kurrimine Beach, Bramston Beach, Cardwell, Tully, Mission Beach or El Arish Fire and Rescue Stations and have what it takes to keep your community safe? Queensland Fire and Emergency Services (QFES) would like to hear from you.&amp;nbsp;&lt;br /&gt; &lt;br /&gt; QFES Innisfail Area Director Robert Herbohn said auxiliary firefighters provided an efficient and effective service to the communities they served in the preservation of life, property and the environment.',
                    'link': 'http://newsroom.psba.qld.gov.au:80/Content/Default/2-Breaking-Update/Article/Auxiliary-Firefighters-a-one-of-a-kind-part-time-job-Innisfail-Kurrimine-Beach-Bramston-Beach-Cardwell-Tully-Mission-Beach-and-El-Arish/-3/1095/2492',
                    'category': 'Breaking Update'
                },
                {
                    'title': 'Waterford West - grassfire as at 4:30pm, Monday 29 September 2014',
                    'description': 'Waterford West - grassfire as at 4:30pm, Monday 29 September 2014&amp;nbsp;&lt;br /&gt;&lt;br /&gt;Queensland Fire and Emergency Services (QFES), Rural Fire Service Queensland (RFSQ) and Logan City Council fire crews are currently on scene at a grassfire burning within the boundaries of Logan Reserve Road, Beutel Street, Moffatt Road and McGrath Street, Waterford West. The fire broke out around 3:20pm today and is not threatening any property at this time. Firefighters are conducting fire suppression to extinguish the fire and are currently conducting property protection near the housing estate at the end of Moffatt Road. A large smoke haze may affect the Waterford West area, and residents are advised to close doors and windows and keep medication on hand if suffering from a respiratory illness. Smoke may affect visibility and motorists are reminded to drive to conditions and be mindful of emergency services personnel operating in the area. If residents feel their property is under threat they are advised to call Triple Zero (000) immediately.&amp;nbsp;',
                    'link': 'http://newsroom.psba.qld.gov.au:80/Content/Default/2-Breaking-Update/Article/Waterford-West-grassfire-as-at-4-30pm-Monday-29-September-2014/-3/1095/2493',
                    'category': 'Breaking Update'
                },
                {
                    'title': 'TEST Bushfire Warning',
                    'description': 'THE FOLLOWING INFORMATION MUST BE BROADCAST VERBATIM: Queensland Fire and Emergency Services (QFES) is advising residents in the vicinity of LOCATION to finalise their bushfire plans.',
                    'link': 'http://newsroom.psba.qld.gov.au:80/Content/State-News/3-Bushfire-Warnings/Article/TEST-Bushfire-Warning/1020/1086/2474',
                    'category': 'Bushfire Warnings'
                },
                {
                    'title': 'Word paste',
                    'description': 'The Jaguar XE redefines the concept of the sports saloon and will be the driver&amp;rsquo;s car in its class. Its lightweight construction, streamlined styling, luxurious interior and outstanding ride',
                    'link': 'http://newsroom.psba.qld.gov.au:80/Content/State-News/3-Bushfire-Warnings/Article/Word-paste/1020/1086/2523',
                    'category': 'Bushfire Warnings'
                },
                {
                    'title': 'Auxiliary Firefighters: a one-of-a-kind part time job - Innisfail, Kurrimine Beach, Bramston Beach, Cardwell, Tully, Mission Beach and El Arish',
                    'description': 'Do you live or work within a reasonable distance of the Innisfail, Kurrimine Beach, Bramston Beach, Cardwell, Tully, Mission Beach or El Arish Fire and Rescue Stations and have what it takes to keep your community safe? Queensland Fire and Emergency Services (QFES) would like to hear from you.&amp;nbsp;&lt;br /&gt; &lt;br /&gt; QFES Innisfail Area Director Robert Herbohn said auxiliary firefighters provided an efficient and effective service to the communities they served in the preservation of life, property and the environment.',
                    'link': 'http://newsroom.psba.qld.gov.au:80/Content/Default/2-Breaking-Update/Article/Auxiliary-Firefighters-a-one-of-a-kind-part-time-job-Innisfail-Kurrimine-Beach-Bramston-Beach-Cardwell-Tully-Mission-Beach-and-El-Arish/-3/1095/2492',
                    'category': 'Breaking Update'
                },
                {
                    'title': 'Waterford West - grassfire as at 4:30pm, Monday 29 September 2014',
                    'description': 'Waterford West - grassfire as at 4:30pm, Monday 29 September 2014&amp;nbsp;&lt;br /&gt;&lt;br /&gt;Queensland Fire and Emergency Services (QFES), Rural Fire Service Queensland (RFSQ) and Logan City Council fire crews are currently on scene at a grassfire burning within the boundaries of Logan Reserve Road, Beutel Street, Moffatt Road and McGrath Street, Waterford West. The fire broke out around 3:20pm today and is not threatening any property at this time. Firefighters are conducting fire suppression to extinguish the fire and are currently conducting property protection near the housing estate at the end of Moffatt Road. A large smoke haze may affect the Waterford West area, and residents are advised to close doors and windows and keep medication on hand if suffering from a respiratory illness. Smoke may affect visibility and motorists are reminded to drive to conditions and be mindful of emergency services personnel operating in the area. If residents feel their property is under threat they are advised to call Triple Zero (000) immediately.&amp;nbsp;',
                    'link': 'http://newsroom.psba.qld.gov.au:80/Content/Default/2-Breaking-Update/Article/Waterford-West-grassfire-as-at-4-30pm-Monday-29-September-2014/-3/1095/2493',
                    'category': 'Breaking Update'
                }
            ];

            if (hasItems) {
                feed.rss.channel.item = feedItems;
            }

            return feedItems;
        }
    }
};