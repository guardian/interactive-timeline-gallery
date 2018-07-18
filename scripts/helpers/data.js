var request = require('sync-request');
var fs = require('fs-extra');
var gsjson = require('google-spreadsheet-to-json');
var deasync = require('deasync');
var config = require('../config.json');
var userHome = require('user-home');
var keys = require(userHome + '/.gu/interactives.json');

var json,
    data = {regions: {}},
    conferences = [];

function fetchData(callback) {
    gsjson({
        spreadsheetId: config.data.id,
        allWorksheets: true,
        credentials: keys.google
    })
    .then(function(result) {
        callback(result);
    })
    .then(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

function setFurniture(data) {
    for (var i = 0; i < data.furniture.length; i++) {
        data[data.furniture[i].option] = data.furniture[i].value
    }

    delete data.furniture;

    return data;
}

function setSheetNames(data) {
    data = {
        'slides': data[0],
        'furniture': data[1]
    }

    return data;
}

function slidesToDates(data) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    for (var i in data.slides) {
        var dateInParts = data.slides[i].date.split('/');
        var dateInString = months[parseInt(dateInParts[1]) - 1] + ' ' + dateInParts[0] + ', ' + dateInParts[2];

        data.slides[i].date = new Date(dateInString);
        data.slides[i].shortDate = data.slides[i].date.getDate() + ' ' + months[data.slides[i].date.getMonth()].substr(0, 3);
        data.slides[i].year = dateInParts[2];
    }

    return data;
}

function calculateTimelinePosition(data) {
    var firstDate = data.slides[0].date;
    var lastDate = data.slides[data.slides.length - 1].date;

    for (var i in data.slides) {
        var date = data.slides[i].date;

        data.slides[i].position = (((date - firstDate) / (lastDate - firstDate)) * 100).toFixed(2);
        data.slides[i].isLate = 75 > data.slides[i].position ? false : true;
    }

    return data;
}

function cleanMedia(data) {
    for (var i in data.slides) {
        var url = data.slides[i].media;
        if (url && url.includes('gutools.co.uk')) {
            var crop = url.split('?crop=')[1];
                url = url.replace('gutools.co.uk', 'guim.co.uk');
                url = url.replace('http://', 'https://');
                url = url.replace('images/', '');
                url = url.split('?')[0];

            data.slides[i].media = url + '/' + crop;
        } else if (url && url.includes('.mp4')) {
            data.slides[i].isVideo = true;
        }
    }

    return data;
}

module.exports = function getData() {
    var isDone = false;

    fetchData(function(result) {
        data = result;
        data = setSheetNames(data);
        data = setFurniture(data);
        data = slidesToDates(data);
        data = calculateTimelinePosition(data);
        data = cleanMedia(data);
        isDone = true;
    });

    deasync.loopWhile(function() {
        return !isDone;
    });

    return data;
};
