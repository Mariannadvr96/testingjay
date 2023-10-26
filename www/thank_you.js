frappe.ready( function () {
    $( ".navbar" ).hide()
    $( ".web-footer" ).hide()

    $( "#home" ).click( function () {
        window.location = "/get-quote";
    } );
} );