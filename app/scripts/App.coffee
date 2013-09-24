# global define
define(["Config", "Utils", "jquery", "moment", "momentlangde", "handlebars", "all"], (Config, Utils) ->
    'use strict'

    class App
        constructor: (greeting) ->
            moment.lang("de")
            @hotTemplateAction()

        hotTemplateAction: ->
            source = $("#video-mixer").html()
            template = Handlebars.compile(source)
            $element = $($.trim(template
                items: clips.items
            )}
            $("#picker").append $element


)