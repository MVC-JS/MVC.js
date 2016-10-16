repeatDependencyExists = true;
//Define iterator in the global scope
var iterator = {};


//todo: fix bug with same og expression for all of dem
//todo: fix bug where if you do app.users[0] = "bob" it doesn't update the mvc-repeat

function parseRepeats() {
    var repeatElements = document.getElementsByClassName("mvc-repeat");
    for (var repeatElement of repeatElements) {
        var iteratorName = repeatElement.getAttribute("iterator");
        var iterableExpression = repeatElement.getAttribute("iterable");
        var iterable = eval(iterableExpression);
        var expression = parseHandlebar(repeatElement.innerHTML);

        //add the original expression as a data attribute so we can use it to regenerate the repeat if the array changes
        repeatElement.dataset.originalExpression = expression;

        //delete the handlebar expression
        repeatElement.innerHTML = "";

        for (var index in iterable) {
            iterator[iteratorName] = iterable[index];
            var newElement = document.createElement("div");
            newElement.className = "mvc";
            newElement.innerHTML = eval(expression);

            var thingToReplaceWith = iterableExpression + "[" + index + "]";

            //replacements for iterator.iteratorName syntax
            var result1 = expression.replace("iterator." + iteratorName, thingToReplaceWith);

            //replacements for iterator[iteratorName] syntax
            var start = expression.indexOf("iterator[");
            var end = expression.indexOf("]", start);
            newElement.dataset.originalExpression = replaceBetweenIndexes(start, end, result1, thingToReplaceWith);

            repeatElement.appendChild(newElement);
        }
    }
}

function handleChangedArrays(target, property, value, handler) {
    if(Array.isArray(value)){

        if(target[property] === undefined){
            //initialize it to an empty array if it was never defined (initialized)
            target[property] = []
        }

        target[property] = target[property] !== undefined ? target[property] : [];
        if(target[property].length !== value.length){
            for(var repeatElement of document.getElementsByClassName("mvc-repeat")){
                var iterable = repeatElement.getAttribute("iterable");
                var indexOfPeriod = iterable.lastIndexOf(".") + 1;
                var propertyOfIterable = iterable.substring(indexOfPeriod, iterable.length);

                if(property === propertyOfIterable){
                    repeatElement.innerHTML = "{{"+repeatElement.dataset.originalExpression+"}}";
                    //preform the set operation
                    //since the property is being set to a new object, return that object as a proxy with the new value and the current handler
                    target[property] = new Proxy(value, handler);
                    parseRepeats();
                }
            }
        }
    }
}

/**
 * Parses a handlebar expression
 * @param {string} string
 * @returns {string}
 */
function parseHandlebar(string) {
    let indexOfOpeningHandlebar = string.indexOf("{{");
    let startOfExpression = indexOfOpeningHandlebar + 2;
    let endOfExpression = string.indexOf("}}", indexOfOpeningHandlebar);

    return string.substring(startOfExpression, endOfExpression);
}

/**
 *
 * @param {number} start
 * @param {number} end
 * @param {string} string
 * @param {string}replacement
 */
function replaceBetweenIndexes(start, end, string, replacement){
    return string.substring(0, start) + replacement + string.substring(end + 1, string.length);
}