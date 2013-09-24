require.config(
    paths:
        popcorn: "../bower_components/popcornjs"
        jquery: "../bower_components/jquery/jquery"
        jqueryui: "../bower_components/jquery/jquery-ui"
        handlebars: "../bower_components/handlebars/handlebars"
        moment: "../bower_components/momentjs/moment"
        momentlangde: "vendor/moments-lang-de"
        history: "vendor/history.js"
        bootstrap: "vendor/boostrap"
    shim:
        handlebars:
            exports: "Handlebars"
        moment:
            exports: "moment"
        momentlangde:
            deps: ["moment"]
)

require(["App"], (App) ->
    "use strict"

    app = new App("Howdy")
)
