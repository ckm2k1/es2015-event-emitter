## Tiny, ES6 EventEmitter Class


##### Installation: `npm install es6-event-emitter`
-----------

##### Usage:
```javascript
class MyClass extends EventEmitter {}
let mc = new MyClass();

mc.listenTo(someObj, 'change', () => {});
someObj.trigger('change');
```

#### Run tests
```npm test```