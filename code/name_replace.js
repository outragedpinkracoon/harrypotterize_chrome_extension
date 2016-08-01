var randomElement = function(array){ return array[Math.floor(Math.random()*array.length)]; }
var objectToValueArray = function(obj){ return Object.keys(obj).map(function(key){ return obj[key]; }) }
var isPerson = function(response){ return response._type === 'Person'; }
var replaceTagText = function(tag){ return function(search){ return function(replace){
  tag.innerText = tag.innerText.replace(search, replace);
}}}

var replaceNames = function(people, tags){
  people.forEach(function(person){
    var char = randomElement(characters); // pulled from characters.js
    tags.forEach(function(tag){
      var replaceText = replaceTagText(tag);
      replaceText(person.name)(char.full);
      replaceText(person.firstname)(char.first);
      replaceText(person.lastname)(char.last);
    });
  })
}

var extractPeopleFromCalaisResponse = function(calaisResponse){
  // Arrays are nicer to work with(and the keys are useless)
  var responses = objectToValueArray(calaisResponse);
  return responses.filter(isPerson);
}

var displayWatermark = function(tag){
  tag.innerHTML = tag.innerHTML + '<a href="http://opencalais.com"><img src="http://www.opencalais.com/wp-content/uploads/2015/07/1C_logo_250x39.png"/></a>';
}

var startNameReplacer = function(){
    var tags = [].slice.call(document.getElementsByTagName('p')); // cast p tags to an Array
    var allTagContent = tags.reduce(function(fullText, currentTag){ return fullText + ' ' + currentTag.innerText; }, '');

    var xhttp = new XMLHttpRequest();
    // API docs: http://www.opencalais.com/wp-content/uploads/folder/ThomsonReutersOpenCalaisAPIUserGuide070516.pdf
    xhttp.open("POST", 'https://api.thomsonreuters.com/permid/calais', true);
    xhttp.setRequestHeader("Content-Type", "text/raw");
    xhttp.setRequestHeader("outputFormat", "application/json");
    xhttp.setRequestHeader("x-calais-selectiveTags", "person");
    xhttp.setRequestHeader("x-ag-access-token", "iibMT4arSqDrTbztdaDPWchb1cyRA8Lc");
    xhttp.send(allTagContent);

    xhttp.onreadystatechange = function(){
        if (xhttp.readyState === 4 && xhttp.status === 200){
            var foundPeople = extractPeopleFromCalaisResponse( JSON.parse(xhttp.responseText) );
            replaceNames(foundPeople, tags);
            displayWatermark(tags[tags.length - 1]);
        }
    }
}

startNameReplacer();