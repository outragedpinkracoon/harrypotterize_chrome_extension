var objectToValueArray = function(obj){ return Object.keys(obj).map(function(key){ return obj[key]; }) }
var isPerson = function(response){ return response._type === 'Person'; }
var getFirstName = function(fullName){ return fullName.split(' ')[0] }
var getLastName = function(fullName){ return fullName.split(' ')[1] }
var randomElement = function(array){
  if(array.length){
    return array.splice(Math.floor(Math.random()*array.length), 1)[0]; 
  } else {
    return null;
  }
}
var replaceTagText = function(tag){ return function(search){ return function(replace){
  tag.innerText = tag.innerText.replace(search, replace);
}}}

var replaceNamesInTags = function(tags){ return function(people){ return function(personMap){ return function(peopleKey){ return function(mapKey){ 
  tags.forEach(function(tag){
    var replaceText = replaceTagText(tag);
    people.forEach(function(person){
      if(!personMap[person.name]){ return; } // skip this itteration if the person isn't mapped
      replaceText( person[peopleKey] )( personMap[person.name][mapKey] );
    })
  });
}}}}}

var extractPeopleFromCalaisResponse = function(calaisResponse){
  // Arrays are nicer to work with(and the keys are useless)
  var responses = objectToValueArray(calaisResponse);
  return responses.filter(isPerson).map(function(person){
     // The name field can sometimes not match the first or last name field so we create additioal ones to try replacements with later
    person.getFirst = getFirstName(person.name);
    person.getLast = getLastName(person.name);
    return person;
  });
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
            var personMap = foundPeople.reduce(function(map, person){
              map[person.name] = randomElement(characters); // pulled from characters.js;
              return map;
            }, {});
            
            var replaceNames = replaceNamesInTags(tags)(foundPeople)(personMap);
            replaceNames('name')('full');
            replaceNames('firstname')('first');
            replaceNames('lastname')('last');
            replaceNames('getFirst')('first');
            replaceNames('getLast')('last');

            displayWatermark(tags[tags.length - 1]);
        }
    }
}

startNameReplacer();