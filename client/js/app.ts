/// <reference path="../../server/all.d.ts" />
var template_message = Handlebars.compile($("#message-template").html());
var template_chat = Handlebars.compile($("#user-template").html());
$('#messages').append(template_message({username: 'John Do1', message: 'SAlut mec1'}));
$('#messages').append(template_message({username: 'John Do2', message: 'SAlut mec2'}));
$('#messages').append(template_message({username: 'John Do3', message: 'SAlut mec3'}));


$('#users').append(template_chat({username: 'John Do1'}));
$('#users').append(template_chat({username: 'John Do2'}));
$('#users').append(template_chat({username: 'John Do3'}));

