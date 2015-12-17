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