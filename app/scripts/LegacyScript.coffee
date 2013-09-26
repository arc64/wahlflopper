# global define
define([
    "data/Clips"
    "hb!templates/Video.html"
    "hb!templates/Picker.html"
    "jquery"
    "popcorn"
    "historyjs"
    "jqueryui/sortable"
], (
    Clips
    VideoTemplate
    PickerTemplate
) ->
    'use strict'
    
    $(() ->
        buildValue = (sValue) ->
            return null  if /^\s*$/.test(sValue)
            return sValue.toLowerCase() is "true"  if /^(true|false)$/i.test(sValue)
            return parseFloat(sValue)  if isFinite(sValue)
            return new Date(sValue)  if isFinite(Date.parse(sValue))
            sValue
        History.Adapter.bind window, "statechange", ->
            State = History.getState()

        oGetVars = []
        if window.location.search.length > 1
            aItKey = undefined
            nKeyId = 0
            aCouples = window.location.search.substr(1).split("&")
            
            while nKeyId < aCouples.length
                aItKey = aCouples[nKeyId].split("=")
                oGetVars.push[buildValue(unescape(aItKey[1]))]
                oGetVars[unescape(aItKey[0])] = (if aItKey.length > 1 then buildValue(unescape(aItKey[1])) else null)
                nKeyId++
            
        console.log oGetVars
        defaultMixer = [ "zur-tagesordnung", "bittere-cdu" ]
        inMixer = []
        uriParams = location.search
        console.log "location", uriParams
        if uriParams
            console.log "location", uriParams
        else
            inMixer = defaultMixer
          
        removeItemFromMixer = (id) ->
            inMixer = $.grep(inMixer, (e) ->
                e isnt id
            )
            $("body").data("videoid", id).removeClass "inMixer"
        addItemToMixer = (id, index) ->
            inMixer.splice index, 0, id
            $("body").data("videoid", id).addClass "inMixer"
        getItem = (id) ->
            $.grep inMixer, (e) ->
                e is id
        renderMixer = ->
            videos = {}
            videos["items"] = []
            $.each inMixer, (i, value) ->
                tmp = Clips["items"][value]
                tmp["index"] = i + 1
                videos["items"].push tmp

            template = VideoTemplate
            $(".mixer #sortable").html template(videos)
            return
        renderModal = ->
            template = Handlebars.compile(modalTemplate)
            $("body").append template({})
            return
        renderPicker = ->
            template = PickerTemplate
            $(".picker").append template(Clips)
            
        renderMixer()
        renderPicker()
        $(".mixer").delegate ".close", "click", (e) ->
            vId = $(this).closest(".video").data("videoid")
            removeItemFromMixer vId
            renderMixer()

        $(".picker").delegate ".add", "click", (e) ->
            vId = $(this).closest(".video").data("videoid")
            addItemToMixer vId, inMixer.length
            renderMixer()

        $(".play-btn").click ->
            console.log "play"
            playback inMixer, ->
                console.log "we are done"
                
        $("#sortable").sortable
            placeholder: "video videoPlaceholder col-2 col-sm-2 col-lg-2 panel panel-default"
            revert: true
            forcePlaceholderSize: true
            axis: "x"
            stop: (event, ui) ->
                id = ui.item.data("videoid")
                item = getItem(id)
                console.log "remove", id
                removeItemFromMixer id
                console.log "add", id, item[0], ui.item.index()
                addItemToMixer id, item[0], ui.item.index()
            start: (e, ui) ->
                $(ui.placeholder).css "height", $(ui.item.children()).height() + "px"

        $("#sortable").disableSelection()
        
        # Popcorn playback
        skeleton = $('#skeleton').html()
        $videos = $('.vids')

        $.each Clips['items'], (k, v) ->
            # todo: needs to work off actual mixer
            $el = $(skeleton)
            $el.prop('id', k)
            $videos.append($el)
            v.$el = $el
            # popcorn for every video
            v.popcorn = Popcorn.youtube('#' + k, 'http://www.youtube.com/watch?autoplay=0&v=' + v.yt)
            v.popcorn.pause()
            v.popcorn.autoplay(false)
            v.popcorn.on 'loadedmetadata', () ->
                v.popcorn.currentTime(v.in)
                


            playback = (sequence, doneCallback) ->
                console.log(sequence)
                next = sequence[0]
                v = Clips['items'][next]

                v.$el.show()
                # v.pc.currentTime()
                # v.popcorn.unmute()
                v.popcorn.play(v.in)

                v.popcorn.cue v.out, () ->
                    v.popcorn.pause()
                    v.$el.hide()
                    em = sequence.slice(1)
                    console.log(rem.length, sequence)
                    if not rem.length
                        doneCallback()
                    playback(rem, doneCallback)

            # placeClips();

            window.playback = playback
    )
)
