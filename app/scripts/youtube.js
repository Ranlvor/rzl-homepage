/* global moment: false */
$(document).ready(function() {
    'use strict';

    var lsErr = 'Leider konnten keine Videos geladen werden. Bitte versuch es später noch einmal.';
    moment.locale('de');

    function render(v) {
        if (v.length === 0) {
            return;
        }

        // newest video is teasered
        var lsTime = moment(v[0].snippet.publishedAt).format('LL');
        $('<h3 style="margin-top:0">' + v[0].snippet.title + '</h3><p><i class="glyphicon glyphicon-time"></i><span style="font-style: italic; color: #8e8e8e"> hochgeladen: ' + lsTime + '</span><p>' + v[0].snippet.description + '</p><p><em>weiter zu <a href="https://youtu.be/' + v[0].snippet.resourceId.videoId + '">Youtube</a></em></p>')
            .appendTo('#youtube-main-descr');
        $('<iframe width="560" height="315" src="//www.youtube.com/embed/' + v[0].snippet.resourceId.videoId + '?hd=1&autohide=1&showinfo=0" frameborder="0" allowfullscreen></iframe>')
            .appendTo('#youtube-main');

        if (v.length < 2) {
            return;
        }

        for (var i = 1; i < v.length; i++) {
            lsTime = moment(v[i].snippet.publishedAt).format('LL');
            var row = $('<div class="row" style="margin:1.5em; margin-left: 0">');
            $('<div class="col-lg-4 col-md-4 col-sm-12 col-sx-12" id="youtube-item-thumb"><img src="' + v[i].snippet.thumbnails.high.url + '" /></div>')
                .appendTo(row);
            $('<div class="col-lg-8 col-md-8 col-sm-12 col-sx-12" id="youtube-item-descr"><h3 style="margin-top:0">' + v[i].snippet.title + '</h3><p><i class="glyphicon glyphicon-time"></i><span style="font-style: italic; color: #8e8e8e"> hochgeladen: ' + lsTime + '</span><p>' + v[i].snippet.description + '</p><p><em>weiter zu <a href="https://youtu.be/' + v[i].snippet.resourceId.videoId + '">Youtube</a></em></p></div>')
                .appendTo(row);
            row.appendTo('#youtube-archive');
        }
    }

    $.getJSON('https://content.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=UUG0GYTzLZNbITXIO63mjWlQ&key=AIzaSyBlDy9ypeC0AshIzQ2FhFTEU1502OUomXg&callback=?')
        .always(function() {
            $('#loading').hide();
        })
        .fail(function() {
            $('#youtube-hidden').empty().html(lsErr).addClass('bg-danger').show();
        })
        .done(function(d) {
            console.log(d);
            if (d.hasOwnProperty('error')) {
                $('#youtube-hidden').empty().html(lsErr).addClass('bg-danger').show();
                console.error('could not get JSONP from youtube API:', d);
                return;
            }
            $('#youtube-hidden').show();
            render(d.items);
        });
});
