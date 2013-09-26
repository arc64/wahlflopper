define([
        "data/Clips",
        "hb!templates/Video.html",
        "hb!templates/Picker.html",
        "jquery",
        "popcorn",
        "historyjs",
        "jqueryui/sortable"
    ],
    function(
        Clips,
        VideoTemplate,
        PickerTemplate
    ) {
        $(function() {
            // History State
            History.Adapter.bind(window,'statechange',function(){
                var State = History.getState();
            });

            var oGetVars = [];

            function buildValue(sValue) {
                if (/^\s*$/.test(sValue)) { return null; }
                if (/^(true|false)$/i.test(sValue)) { return sValue.toLowerCase() === "true"; }
                if (isFinite(sValue)) { return parseFloat(sValue); }
                if (isFinite(Date.parse(sValue))) { return new Date(sValue); }
                return sValue;
            }

            if (window.location.search.length > 1) {
              for (var aItKey, nKeyId = 0, aCouples = window.location.search.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
                aItKey = aCouples[nKeyId].split("=");

                oGetVars.push[buildValue(unescape(aItKey[1]))]
                oGetVars[unescape(aItKey[0])] = aItKey.length > 1 ? buildValue(unescape(aItKey[1])) : null;
              }
            }

        console.log(oGetVars);
            // data for videos
            var defaultMixer = ['zur-tagesordnung', 'bittere-cdu'];

            var inMixer = [];

            var uriParams = location.search;
            // var newParam = $.extend({}, inMixer);
            // History.pushState(newParam, "wahlflopper", $.param(newParam));

            console.log('location', uriParams);
            if(uriParams) {
                console.log('location', uriParams);
                //iMixer = params
            } else {
                inMixer = defaultMixer;
            }

            var clips = {'items':{
                'zur-tagesordnung': {
                id: 'zur-tagesordnung',
                title: 'zur Tagesordnung übergehen',
                yt: 'gMp2D9rBiSc',
                in: 233,
                out: 240
              },
              'bittere-cdu': {
                id: 'bittere-cdu',
                title: 'eine bittere Niederlage',
                yt: 'I-3G0ylRriQ',
                in: 22,
                out: 29
              },
              'jfk-bin-ein-berliner': {
                id: 'jfk-bin-ein-berliner',
                title: 'ich bin ein Berliner',
                yt: 'hH6nQhss4Yc',
                in: 21,
                out: 23.5
              },
              'ruckrede': {
                id: 'ruckrede',
                title: 'liebgewonnene Besitzstände',
                yt: 'FhHrzWvd-Js',
                in: 0,
                out: 2.5
              },
              'herzchen': {
                id: 'herzchen',
                title: 'sozialdemokratische Herzen',
                yt: '8FZIlXVhWIk',
                in: 90.5,
                out: 96.5
              },
              'umfassend': {
                id: 'umfassend',
                title: 'eindeutig und umfassend',
                yt: 'wKA7GwTuVJA',
                in: 32.5,
                out: 40.5
              },
              'angieschmerz': {
                id: 'angieschmerz',
                title: 'schmerzt natürlich sehr',
                yt: 'rR35QbUS1WU',
                in: 48,
                out: 55
              },
              'mickey': {
                id: 'mickey',
                title: 'Knockout! ',
                yt: 'kT_pS_4OO7E',
                in: 234,
                out: 240
              },
              'hauptstadtchefin': {
                id: 'hauptstadtchefin',
                title: 'als ZDF-Hauptstadtchefin',
                yt: 'ssHU_-wpsMo',
                in: 263,
                out: 266.5
              }
            }};

            // some method madness
            function removeItemFromMixer(id) {
                inMixer = $.grep(inMixer, function(e){ return e != id; });
                $('body').data('videoid', id).removeClass('inMixer');
            }

            function addItemToMixer(id, index) {
                inMixer.splice(index, 0, id);
                // console.log(inMixer)
                $('body').data('videoid', id).addClass('inMixer');
            }

            function getItem(id) {
                return $.grep(inMixer, function(e){ return e == id; });
            }

            function renderMixer(){
                var videos = {};
                videos['items'] = [];
                $.each( inMixer, function(i, value) {

                    var tmp = clips['items'][value];
                    tmp['index'] = i+1;
                    //console.log(tmp)
                    videos['items'].push(tmp);
                });
                var template = VideoTemplate;
                $('.mixer #sortable').html(template(videos));
                return;
            }

            function renderModal(){
                var template = Handlebars.compile(modalTemplate);
                $('body').append(template({})); // todo: put in real videos
                return;
            }

            function renderPicker(){
                var template = PickerTemplate;

                $('.picker').append(template(clips));
            }

            // getting down to business
            // render some stuff
            renderMixer();
            renderPicker();
            //renderModal();

            // event heaven
            $('.mixer').delegate( ".close", "click", function(e) {
                vId = $(this).closest('.video').data('videoid');
                removeItemFromMixer(vId);
                renderMixer();
                //updateURI();
            });

            $('.picker').delegate( ".add", "click", function(e) {
                vId = $(this).closest('.video').data('videoid');
                addItemToMixer(vId, inMixer.length);
                renderMixer();

                //updateURI();
            });

            $('.play-btn').click(function(){
                console.log('play');
                playback(inMixer, function(){console.log('we are done')});
            });

            // Sort the items in the picker
            $( "#sortable" ).sortable({
                placeholder: "video videoPlaceholder col-2 col-sm-2 col-lg-2 panel panel-default",
                revert: true,
                forcePlaceholderSize: true,
                axis: "x",
                stop: function(event, ui) {
                    var id = ui.item.data('videoid');
                    var item = getItem(id);
                    console.log('remove', id)
                    removeItemFromMixer(id);
                    console.log('add', id, item[0], ui.item.index())
                    addItemToMixer(id, item[0], ui.item.index());
                },
                start: function (e, ui) {
                    $(ui.placeholder).css("height", $(ui.item.children()).height()+"px")
                }
            });

            $( "#sortable" ).disableSelection();

            // function placeClips() {
                    // Popcorn playback
                var skeleton = $('#skeleton').html();
                var $videos = $('.vids');

                $.each(clips['items'], function(k, v) {
        // todo: needs to work off actual mixer

                    var $el = $(skeleton);
                    $el.prop('id', k);
                    $videos.append($el);
                    v.$el = $el;
                    //console.log($videos, v.$el)
                    // popcorn for every video
                    v.popcorn = Popcorn.youtube('#' + k, 'http://www.youtube.com/watch?autoplay=0&v=' + v.yt);
                 //console.log('something',v.$el.show());
                    v.popcorn.pause();
                    v.popcorn.autoplay(false);
                    v.popcorn.on('loadedmetadata', function() {
                      v.popcorn.currentTime(v.in);

                    });
                    //console.log(v, $el)
                });
            // }


            function playback(sequence, doneCallback) {
                console.log(sequence)
                var next = sequence[0];
                var v = clips['items'][next];

                v.$el.show();
                // //v.pc.currentTime();
                //v.popcorn.unmute();
                v.popcorn.play(v.in);

                v.popcorn.cue(v.out, function() {
                    v.popcorn.pause();
                    v.$el.hide();
                    var rem = sequence.slice(1);
                    console.log(rem.length, sequence)
                    if (!rem.length) doneCallback();
                    playback(rem, doneCallback);
                });
            }

            // /placeClips();

            window.playback = playback;

        });
    }
);

