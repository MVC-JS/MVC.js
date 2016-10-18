//allows us to make repeat.js as an optional dependency, and only call its functions if this variable is set to true by the dependency
var repeatDependencyExists = false;

//a proxy is basically a fake object that let's you listen for cool events like set, read, and construct
var MVC = new Proxy(function () {}, {
    //create a "fake" constructor that allows me to return the set trapped proxy
    construct: function () { //when the "fake" constructor is called (using the new keyword)
        //return a Proxy instance that has a set trap
        //which means it will call a function when ever something is written to that proxy

        var handler = {
            set: function (target, property, value) {

                //console.log("handling set", property, ":", value);

                if(repeatDependencyExists){
                    handleChangedArrays(target, property, value, handler);
                }

                if (typeof value === "object") {
                    //if the property is set to a new object, return that object as a proxy with the current handler
                    target[property] = new Proxy(value, handler);
                } else {
                    //actually write to the object
                    target[property] = value;
                }

                for (var element of document.getElementsByClassName("mvc")) {

                    var originalExpression = element.dataset.originalExpression;

                    //revalue any expression that uses this property
                    if (originalExpression.includes(property)) {
                        element.innerHTML = eval(originalExpression);
                    }
                }
            }
        };
        return new Proxy({}, handler);
    }
});

window.addEventListener("load", function () {

    //repeat.js dependency is optional, so check if it exists before using it
    if(repeatDependencyExists){
        parseRepeats();
    }else{
        //repeat.js dependency missing, check if any mvc-repeat elements exist and give an error if they do
        if(document.getElementsByClassName("mvc-repeat").length > 0){
            console.error("MVC.js: mvc-repeat element exists, but repeat.js dependency missing")
        }
    }

    parseHandlebarsInBody(0);

    //Done, call the onload event function if exists (it is optional to consume it)
    if(MVC.onload !== undefined){
        MVC.onload();
    }
});

/**
 * Recursively parses all handlebars
 */
function parseHandlebarsInBody(startingPosition) {
    let indexOfOpeningHandlebar = document.body.innerHTML.indexOf("{{", startingPosition);

    var isEscapedHandlebar = document.body.innerHTML.charAt(indexOfOpeningHandlebar - 1) === "~";

    if (indexOfOpeningHandlebar !== -1) {
        if(isEscapedHandlebar){
            //call the function recursively, from the next position after the current opening handlebar
            parseHandlebarsInBody(indexOfOpeningHandlebar + 1)
        }else{
            let startOfExpression = indexOfOpeningHandlebar + 2;
            let endOfExpression = document.body.innerHTML.indexOf("}}", indexOfOpeningHandlebar);

            let expression = document.body.innerHTML.substring(startOfExpression, endOfExpression);

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

            document.body.innerHTML = document.body.innerHTML.substring(0, indexOfOpeningHandlebar) + newElement + document.body.innerHTML.substring(endOfExpression + 2, document.body.innerHTML.length);

            //recursive from the beginning
            parseHandlebarsInBody(0);
        }
    }
}


//Polyfill for String.prototype.includes
if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}