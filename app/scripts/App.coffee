# global define
define(["Config", "Utils", "jquery", "moment", "momentlangde", "handlebars", "all"], (Config, Utils) ->
    'use strict'

    class App
        constructor: (greeting) ->
            moment.lang("de")

            defaultMixer = ['zur-tagesordnung', 'bittere-cdu']

            vids = @addAllToMixer(defaultMixer)

            @mixerTemplateAction(vids)
            @pickerTemplateAction()

        pickerTemplateAction: ->
            source = $("#video-picker").html()
            template = Handlebars.compile(source)
            $element = $($.trim(template
                items: clips.items
            ))
            $("#picker").append $element

        mixerTemplateAction: (ids) ->
            videos = {}
            # videos['items'] = []
            # $.each( inMixer, function(i, value) {

            #     var tmp = clips['items'][value];
            #     tmp['index'] = i+1;

            #     videos['items'].push(tmp);
            # });

            # var template = Handlebars.compile(videoTemplate);
            # $('.mixer #sortable').html(template(videos));


            source = $("#video-mixer").html()
            template = Handlebars.compile(source)
            $element = $($.trim(template
                items: ids
            ))
            $("#mixer ul").html $element


        addAllToMixer: (ids) ->
            $.each (ids, addToMixer (item, mixer.length) ->

            )

        addToMixer: (id, index) ->
            inMixer.splice(index, 0, id);
            $('body').data('videoid', id).addClass('inMixer');



)