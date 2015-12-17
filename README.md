## Tiny, ES6 EventEmitter Class


##### Installation: `npm install es6-event-emitter`
-----------

##### Usage:
```javascript
let EventEmitter = require('es2015-event-emitter');

class MyClass extends EventEmitter {}
let mc = new MyClass();

mc.listenTo(someObj, 'change', () => {});
someObj.trigger('change');
```

##### Run tests:
```npm test```


##### Notes:
This currently only works with the `--harmony` flag passed to Node.
A build step will be added shortly to make it work in ES5 environments,
even though they already have plenty of EventEmitter implementations.