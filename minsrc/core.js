var repeatDependencyExists=!1,MVC=new Proxy(function(){},{construct:function(){var handler={set:function(target,property,value){target[property]="object"==typeof value?new Proxy(value,handler):value;for(var element of document.getElementsByClassName("mvc")){var originalExpression=element.dataset.originalExpression;originalExpression.includes(property)&&(element.innerHTML=eval(originalExpression))}}};return new Proxy({},handler)}});window.addEventListener("load",function(){for(0<document.getElementsByClassName("mvc-repeat").length&&console.error("MVC.js: mvc-repeat element exists, but repeat.js dependency missing");!0;){let indexOfOpeningHandlebar=document.body.innerHTML.indexOf("{{");if(-1===indexOfOpeningHandlebar)break;else{let endOfExpression=document.body.innerHTML.indexOf("}}",indexOfOpeningHandlebar),expression=document.body.innerHTML.substring(indexOfOpeningHandlebar+2,endOfExpression),valueOfExpression;try{valueOfExpression=eval(expression)}catch(a){console.warn("Gracefully failing, expression evaluation error",a),valueOfExpression=""}valueOfExpression===void 0&&(valueOfExpression="");let newElement="<span class='mvc' data-original-expression='"+expression+"'>"+valueOfExpression.toString()+"</span>";document.body.innerHTML=document.body.innerHTML.substring(0,indexOfOpeningHandlebar)+newElement+document.body.innerHTML.substring(endOfExpression+2,document.body.innerHTML.length)}}MVC.onload!==void 0&&MVC.onload()}),String.prototype.includes||(String.prototype.includes=function(a,b){"use strict";return"number"!=typeof b&&(b=0),!(b+a.length>this.length)&&-1!==this.indexOf(a,b)});