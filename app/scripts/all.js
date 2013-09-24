define(['jquery', 'jqueryui'], function(){
    'use strict'

console.log('all')
var inMixer = ['zur-tagesordnung', 'bittere-cdu'];

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
            console.log(renderMixer)
            // var videos = {};
            // videos['items'] = [];
            // $.each( inMixer, function(i, value) {

            //     var tmp = clips['items'][value];
            //     tmp['index'] = i+1;
            //     //console.log(tmp)
            //     videos['items'].push(tmp);
            // });
            // var template = Handlebars.compile(videoTemplate);
            // $('.mixer #sortable').html(template(videos));
            // return;
        }

        function renderPicker(){
            // var template = Handlebars.compile(pickerTemplate);

            // $('.picker').append(template(clips));
            console.log('renderPicker')
        }

        // getting down to business
        // render some stuff
        //renderMixer();
        //renderPicker();


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
    //             // Popcorn playback
    //         var skeleton = $('#skeleton').html();
    //         var $videos = $('.vids');

    //         $.each(clips['items'], function(k, v) {
    // // todo: needs to work off actual mixer

    //             $el = $(skeleton);
    //             $el.prop('id', k);
    //             $videos.append($el);
    //             v.$el = $el;
    //             //console.log($videos, v.$el)
    //             // popcorn for every video
    //             v.popcorn = Popcorn.youtube('#' + k, 'http://www.youtube.com/watch?autoplay=0&v=' + v.yt);
    //          //console.log('something',v.$el.show());
    //             v.popcorn.pause();
    //             v.popcorn.autoplay(false);
    //             v.popcorn.on('loadedmetadata', function() {
    //               v.popcorn.currentTime(v.in);

    //             });
    //             //console.log(v, $el)
    //         });
        // }


        // function playback(sequence, doneCallback) {
        //     console.log(sequence)
        //     var next = sequence[0];
        //     var v = clips['items'][next];

        //     v.$el.show();
        //     // //v.pc.currentTime();
        //     //v.popcorn.unmute();
        //     v.popcorn.play(v.in);

        //     v.popcorn.cue(v.out, function() {
        //         v.popcorn.pause();
        //         v.$el.hide();
        //         var rem = sequence.slice(1);
        //         console.log(rem.length, sequence)
        //         if (!rem.length) doneCallback();
        //         playback(rem, doneCallback);
        //     });
        // }

        // /placeClips();

        //window.playback = playback;
})