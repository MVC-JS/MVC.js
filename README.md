# MVC.js
**The problem with other MVC frameworks is that they're always either too heavy, too slow, bloated or overly complicated.**

  While Angular.js was relatively easy, it was over bloated with features and abstractions and was an extremely heavy dependency. Angular 2 and React aim to solve these issues, but they have a sharper learning curve and over complicate everything. 
  
  MVC.js aims to solve all of these problems. MVC.js uses modern ES6 features to make the framework extremely lightweight, performant, and most of all easy to use. 

# Ease of Use
Creating an MVC object with data binding is extremely easy!

**JavaScript**
```javascript
var app = new MVC();

app.name = "Google"
```
**HTML**
```html
{{app.name}} is an amazing company...
```
**Result:**
```html
Google is an amazing company...
```
It's that easy to create a data bound object! Whenever you change the object, your HTML automatically gets updated with the new data.

# Technologies
The cool part about MVC.js, is it allows you to put put any valid JavaScript expressions inside the {{}}. Also MVC.js uses [ES6 Proxy Set Traps](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to allow for instantaneous updates of your HTML. This comes with another benefit - Since ES6 provides an easy way for MVC.js to watch for changes in your objects, the code required is extremely small.

# Size and Speed
MVC.js's core and repeat module combined are 17 TIMES smaller than the Angular core. No more slow load times while loading the giant angular dependency. The minified MVC.js core takes less than 10ms to load on a standard Wifi connection!

# Getting Started
The easiest way to get started is to download the minified files. Then include the dependencies you want above you script

After downloading the files:
```html
<!--Core-->
<script src="core.js"/>
<!--Other Modules-->
<script src="repeat.js"/>
```
That's it, you can now use MVC.js and all it's amazing features!

# Modules
The various modules allow you to add features of MVC.js that you need, when you need them. For example if you want something similar to ng-repeat, you can include the repeat module and you use the MVC.js's repeat module. The modular aspect of the framework keeps it extremely lightweight and ensures that you only have to take what you need.

# Support
You might be asking your self, "How can MVC.js use ES6 features without transpiling to ES5?" 

Well the answer is simple, browsers have caught up! As of this writting, most major features of ES6, incuding those used in the framework, are supported by the latest versions of all major browsers: Chrome, Firefox, Opera, Safari and Microsoft Edge!

### Useful Links
[A full ES6 Compatibility Table] (https://kangax.github.io/compat-table/es6/)
<br>
[A table of browser support for ES6 Proxies - The core ES6 feature behind MVC.js](http://caniuse.com/#feat=proxy)
