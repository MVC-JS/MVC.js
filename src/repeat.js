repeatDependencyExists = true;

//Define iterator in the global scope
var iterator = {};

/**
 * Parse all "mvc-repeat"s
 */
function parseRepeats() {
    var repeatElements = document.getElementsByTagName("mvc-repeat");
    for (var repeatElement of repeatElements) {
        var iteratorName = repeatElement.getAttribute("iterator");
        var iterableExpression = repeatElement.getAttribute("iterable");
        var iterable = eval(iterableExpression);
        var originalHTML = repeatElement.innerHTML;

        repeatElement.innerHTML = "";

        for(var index in iterable){
            var re = new RegExp("(iterator\\s*\\[\\s*\'?\"?"+iteratorName+"\'?\"?\\s*])|iterator."+iteratorName, "g");
            repeatElement.innerHTML += originalHTML.replace(re, iterableExpression+"["+index+"]");
        }

        repeatElement.dataset.originalHtml = escapeHandlebarsFromString(originalHTML);
    }
}

/**
 * Handle array "set" operation's data binding
 * @param target
 * @param property
 * @param value
 * @param handler
 */
function handleChangedArrays(target, property, value, handler) {

    if(Array.isArray(value)){

        //initialize the target[property] to an empty array if it was never defined (initialized)
        target[property] = target[property] !== undefined ? target[property] : [];

        if(target[property].length !== value.length){
            for(var repeatElement of document.getElementsByTagName("mvc-repeat")){
                var iterable = repeatElement.getAttribute("iterable");
                var indexOfPeriod = iterable.lastIndexOf(".") + 1;
                var propertyOfIterable = iterable.substring(indexOfPeriod, iterable.length);

                if(property === propertyOfIterable){
                    //preform the set operation
                    //since the property is being set to a new object, return that object as a proxy with the new value and the current handler
                    target[property] = new Proxy(value, handler);

                    repeatElement.innerHTML = unescapeHandlebarsFromString(repeatElement.dataset.originalHtml);

                    parseRepeats();

                    var currentHTML = repeatElement.innerHTML;

                    console.log('currentHTML:', currentHTML);

                    repeatElement.innerHTML = parseHandlebarsInString(0, repeatElement.innerHTML);

                    //console.log('parseHandlebarsInString(0, repeatElement.innerHTML);:', parseHandlebarsInString(0, currentHTML));
                }
            }
        }
    }
}

/**
 * Replaces all occurrences of "search" with replacement
 * @param search
 * @param replacement
 * @returns {string}
 */
String.prototype.replaceAll = function(search, replacement) {
    var string = this; //this is the prototype... so "this" refers to the string the function is called upon
    return string.replace(new RegExp(search, 'g'), replacement);
};

/**
 * Escapes all the handlebars from a string with escaped handlebar "~{{"
 * @param {String} string
 * @returns {String}
 */
function escapeHandlebarsFromString(string){
    return string.replaceAll("{{","~{{");
}

/**
 * Unescapes all the handlebars from a string with escaped handlebar "~{{"
 * @param {String} string
 * @returns {String}
 */
function unescapeHandlebarsFromString(string){
    return string.replaceAll("~{{","{{");
}

/**
 * Parses all the handlebars in a string
 * @param {Number} startingPosition
 * @param {String} string
 * @returns {String}
 */
function parseHandlebarsInString(startingPosition, string) {
    let indexOfOpeningHandlebar = string.indexOf("{{", startingPosition);

    var isEscapedHandlebar = string.charAt(indexOfOpeningHandlebar - 1) === "~";

    if (indexOfOpeningHandlebar !== -1) {
        if(isEscapedHandlebar){
            //call the function recursively, from the next position after the current opening handlebar
            return parseHandlebarsInString(indexOfOpeningHandlebar + 1, string)
        }else{
            let startOfExpression = indexOfOpeningHandlebar + 2;
            let endOfExpression = string.indexOf("}}", indexOfOpeningHandlebar);

            let expression = string.substring(startOfExpression, endOfExpression);

            let valueOfExpression;
            try {
                valueOfExpression = eval(expression);
            } catch (err) {
                //if expression is undefined, or there are any other problems evaluating, gracefully fail
                console.warn("Gracefully failing, expression evaluation error", err);
                valueOfExpression = "";
            }

            if (valueOfExpression === undefined) {
                valueOfExpression = "";
            }

            let newElement = "<span class='mvc' data-original-expression='" + expression + "'>" + valueOfExpression.toString() + "</span>";

            string = string.substring(0, indexOfOpeningHandlebar) + newElement + string.substring(endOfExpression + 2, string.length);

            //recursive from the beginning
            return parseHandlebarsInString(0, string);
        }
    }

    return string;
}