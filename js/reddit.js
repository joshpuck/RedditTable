

//setup and request json
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://www.reddit.com/r/politics.json?limit=1000');
xhr.responseType = 'json';
xhr.send();

// onload is "new" and is just readyState === 4
xhr.onload = function() {
  var risingJSON = xhr.response;
  var statusHTML = '<ul>';
  var time = new Date().getTime();

  for(var i=0 ; i < risingJSON['data']['children'].length; i++) {
      var title = risingJSON['data']['children'][i]['data'].title ;
      var score = risingJSON['data']['children'][i]['data'].score ;

      // reddit stores utc in seconds but getTime is in milliseconds
      var age = Math.round(((time/1000) - risingJSON['data']['children'][i]['data'].created_utc) / 60) ;

      //round to nearest .1 (10*hot/10=hot)
      var hot = Math.round(10*(score / age)) / 10;

      // add list element
      statusHTML += `<li>${hot} (${score}score / ${age}m) ${title}</li>`;
  }

  statusHTML += '</ul>';
  document.getElementById('rising').innerHTML = statusHTML;
};
