repeatDependencyExists=!0;var iterator={};function parseRepeats(){var repeatElements=document.getElementsByTagName("mvc-repeat");for(var repeatElement of repeatElements){var iteratorName=repeatElement.getAttribute("iterator"),iterableExpression=repeatElement.getAttribute("iterable"),iterable=eval(iterableExpression),originalHTML=repeatElement.innerHTML;for(var index in repeatElement.innerHTML="",iterable){var re=new RegExp("(iterator\\s*\\[\\s*'?\"?"+iteratorName+"'?\"?\\s*])|iterator."+iteratorName,"g");repeatElement.innerHTML+=originalHTML.replace(re,iterableExpression+"["+index+"]")}repeatElement.dataset.originalHtml=escapeHandlebarsFromString(originalHTML)}}function handleChangedArrays(a,b,c,d){if(Array.isArray(c)&&(a[b]=void 0===a[b]?[]:a[b],a[b].length!==c.length))for(var e of document.getElementsByTagName("mvc-repeat")){var f=e.getAttribute("iterable"),g=f.lastIndexOf(".")+1,h=f.substring(g,f.length);if(b===h){a[b]=new Proxy(c,d),e.innerHTML=unescapeHandlebarsFromString(e.dataset.originalHtml),parseRepeats();var i=e.innerHTML;console.log("currentHTML:",i),e.innerHTML=parseHandlebarsInString(0,e.innerHTML)}}}String.prototype.replaceAll=function(a,b){var c=this;return c.replace(new RegExp(a,"g"),b)};function escapeHandlebarsFromString(a){return a.replaceAll("{{","~{{")}function unescapeHandlebarsFromString(a){return a.replaceAll("~{{","{{")}function parseHandlebarsInString(startingPosition,string){let indexOfOpeningHandlebar=string.indexOf("{{",startingPosition);var isEscapedHandlebar="~"===string.charAt(indexOfOpeningHandlebar-1);if(-1!==indexOfOpeningHandlebar){if(isEscapedHandlebar)return parseHandlebarsInString(indexOfOpeningHandlebar+1,string);let valueOfExpression,endOfExpression=string.indexOf("}}",indexOfOpeningHandlebar),expression=string.substring(indexOfOpeningHandlebar+2,endOfExpression);try{valueOfExpression=eval(expression)}catch(a){console.warn("Gracefully failing, expression evaluation error",a),valueOfExpression=""}void 0===valueOfExpression&&(valueOfExpression="");let newElement="<span class='mvc' data-original-expression='"+expression+"'>"+valueOfExpression.toString()+"</span>";return string=string.substring(0,indexOfOpeningHandlebar)+newElement+string.substring(endOfExpression+2,string.length),parseHandlebarsInString(0,string)}return string}