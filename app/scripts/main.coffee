require.config(
    paths:
        jquery: "../bower_components/jquery/jquery"
        jqueryui: "../bower_components/jquery-ui/jqueryui"
        handlebars: "../bower_components/handlebars/handlebars"
        historyjs: "vendor/jquery.history"
        popcorn: "vendor/popcorn-complete"
        bootstrap: "../bower_components/bootstrap/dist/js/bootstrap"
        text: "vendor/requirejs-plugins/text"
        hb: "vendor/requirejs-plugins/hb"
    shim:
        handlebars:
            exports: "Handlebars"
        historyjs:
            exports: "History"
            deps: [
                "jquery"
            ]
        bootstrap:
            deps: [
                "jquery"
            ]
)

require(["App"], (App) ->
    "use strict"

    app = new App()
)
