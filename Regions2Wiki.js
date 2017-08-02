var regions = require('./regions.json');
var request = require('request');

var regionsWiki = regions;
var noWiki = [];

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

for (i = 0; i < regions.features.length; i++) {
  var name = regions.features[i].properties.name.toProperCase();
  requestWiki(name, i);
}

function requestWiki(name, i) {
  var url = ['https://en.wikipedia.org/w/api.php?action=query&prop=extracts&redirects=1&format=json&titles=', name].join('');
  request({
    uri: url,
    method: "GET",
    followRedirect: true,
  },
  function(error, response, body) {
    if (response.statusCode == 200) {
      body = JSON.parse(body);
      if (body.query.pages['-1']) {
        console.log(name, 'bad')
        noWiki.push(name);
        addWikiName(i, '');
      } else {
        addWikiName(i, name);
      }
    } else {
      addWikiName(i, '');
    }
    if (i == regions.features.length - 1) {
      console.log(regionsWiki);
    }
  })
}

function addWikiName(i, name) {
  regionsWiki.features[i].properties.wikiName = name;
  // if (i == regions.features.length - 1) {
  //   console.log(regionsWiki);
  // }
}
