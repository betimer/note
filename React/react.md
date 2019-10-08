# react

## ---- Component life cycles (different with mount/update) ----

http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/

### Mounting: created and inserted into the DOM

    constructor()
    componentWillMount()
    static getDerivedStateFromProps(props, state)
    render()
    componentDidMount()

### Updating: re-rendered caused by changes to props or state.

    UNSAFE_componentWillReceiveProps(nextProps)
        // will be deprecated
        // this.setState() will not cause this to run, only fires when parent re-render
        // this.setState() good to put in cwrp
        // cwrp only uses when state derives from props
        // have to change state here when component props changed, because state only initialized from constructor, not updated from update case. so must re-sync state from props here
    static getDerivedStateFromProps(props, state)
        // this will be fired every render (no matter props changes, or after setState())
    shouldComponentUpdate(nextProps, nextState)
        // if do not rewrite, default is "true" every time props or state gets changed
    UNSAFE_componentWillUpdate(nextProps, nextState) // will be deprecated
    render()
    getSnapshotBeforeUpdate()
    componentDidUpdate(prevProps, prevState)

### Unmounting: removed from the DOM

    componentWillUnmount()

https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle
https://www.tutorialspoint.com/reactjs/reactjs_component_life_cycle.htm

## ---- react process ----

Building and first time rendering:

1. jsx: <MyButton color="blue" shadowSize={2}>Click Me</MyButton>
2. build to js: React.createElement(MyButton, {color: 'blue', shadowSize: 2}, 'Click Me')
3. virtual DOM
4. document.createElement (render)
5. real DOM

## Re-render and DOM update

when talking about Dom 2 types:

- virtualDom (linked to `Component.render()`)
- browserDom (Real DOM manipulation)

1. React Component.render() just return jsx/virtualDom. This will be called any time the component's `props` or `state` gets changed (Unless you manually optimized `shouldComponentUpdate`). It's just a get method without any side effect, just call it to return jsx stuff at anytime; I have tried in other places to call render(), it just return Symbol(React.element) jsx stuff.

2. Real DOM render: React gets virtualDom. Then, React will compare if the new virtualDom is different current virtualDom (that may be the reason why using this.setState instead of change directly, because React needs to create a new virtualDom to compare the existing virtualDom). After comparing (React Reconciliation), if React finds it is different, then React will paint to real browserDom. This is all up to React controlled

## ---- this.props and this.state ----

this.props should be given by parent Component, and should not be changed within it.
this.state is internal managed state, which gets and sets within it. Parent will not see it.

### ---- receive props from either literature way or redux way ----

- <MyComponent prop1={"xin"} />
- mapStateToProps(state){ return prop2: state.xxReducer.surname }

MyComponent will get both this.props.prop1 and this.props.prop2, and cannot feel the difference

### ---- setState is async function ----

// maybe next tick? react will put it in the future queue, react takes care of it.
this.setState({newAdded: "test"}); // next async js event queue
let youCannotGetIt = this.state.newAdded; // undefined

## ---- React event (SytheticEvent) ----

React uses event delegation and listens for events at the root of the application.
React keeps track of which rendered nodes have listeners.
The synthetic event system implements its own bubbling and calls the appropriate handlers.
That's way when I check DOM element, there is no onclick in html file.
I can also see it from broswer callstack when debugger react onClick body.

## ---- React event with 'this' issue

React SytheticEvent will change the 'this' context, that's why we see a lot of this.func1 = this.func1.bind(this);

Here is one of the all possible react function invoking: 
https://stackblitz.com/edit/react-handling-event (https://codesandbox.io/s/k5q98q25j5)
https://reactjs.org/docs/handling-events.html

## ---- React ref ----

Refs provide a way to access DOM nodes or React elements created in the render method.

e.g. Parent has 2 children: input + button. Once button gets clicked, want input to be focused (https://reactjs.org/docs/refs-and-the-dom.html)

```js
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.textInput.current.focus();
  }

  render() {
    // tell React that we want to associate the <input> ref
    // with the `textInput` that we created in the constructor
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />

        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

2 ways to pass refer:

1. a `ref` attribute to child created by `createRef()` in parent
2. Callback Refs: a `ref` function which accept element

```js
this.textInput1 = React.createRef();
this.textInput2 = null;

this.setTextInputRef = element => {
    this.textInput2 = element;
};

render(){
    return (
        <div ref={this.textInput1}></div>
        <div ref={this.setTextInputRef} ></div>
    )
}
```

So if child wants to access parent, parent can just pass itself or its callBack into props; if parent wants to access its child, then parent needs to create myRef and pass `ref` property when rendering the child.

## ------------ If contextTypes is defined within a component, the following lifecycle methods will receive an additional parameter, the context object

constructor(props, context)
componentWillReceiveProps(nextProps, nextContext)
shouldComponentUpdate(nextProps, nextState, nextContext)
componentWillUpdate(nextProps, nextState, nextContext)
componentDidUpdate(prevProps, prevState, prevContext)

can I do something like redux props auto connected tag?????? <App redux-auto=true

// children always renders
// component and render props, will only renders when matches

https://github.com/chenglou/react-motion

## Stateless Component, PureComponent and Component

// Stateless usually can just write simple function instead of class
var Stateless1 = (props) => return <label>I am {this.props.name}</label>;
class Stateless1 extends React.Component {
    render () { return <label>I am {this.props.name}</label>; }
}

Stateless Component will still re-render every time its parent re-renders, same as normal Component.

PureComponent will not re-render if its props not gets changed (if state changes inside it, not check yet, but should be a separate topic, as we talking about parent re-render, and state change should re-render). So for this case, PureComponent improve better performance than functional Stateless Component

## React Best Practice and Hints

1. define inline function within render is bad, (e.g. <button onClick={() => this.setState({count: count + 1})}>), since a new lambaba function will be created each time render() gets called. (Also it's not good for React to compare 2 virtual Dom, since it's one props of Component)

2. 2 ways to overcome upper problem:
    - write `this.handleClick = this.handleClick.bind(this)` in the `constructor()`
    - declaring a class **Instance Property**(ES2016) with a **fat arrow** (This syntax needs help of babel) (This method, it seems babel will move the function into the constructor similar as `this.handleClick2`)

    ```js
    class CounterButton extends Component {
        constructor(){
            this.handleClick1 = this.handleClick1.bind(this);
            this.handleClick2 = () => this.setState({count: this.state.count + 1});
        }

        handleClick1(){
            this.setState({count: this.state.count + 1});
        }

        state = {count: 0} // experimental feature

        handleClick3 = () // experimental feature
          => this.setState({count: this.state.count + 1});

        render() {
            return <button type='button' onClick={this.handleClick}>Increment: {count}</button>;
        }
    }
    ```

3. Render list and its keys, it's good to add `key` when rendering the list. (Suppose, first element gets deleted, without `key` react may render the whole list again; but with render, it's easy to know that the first one gets deleted)

```js
{list.map(item => <div key={item.id}>{item.name}</div>)}
{list.map((item, index) => <div key={index}>{item.name}</div>)}
```

4. 