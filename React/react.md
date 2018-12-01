# react

## ---- component lifecycle (different with mount/update) ----

### Mounting: created and inserted into the DOM

    constructor()
    componentWillMount()
    render()
    componentDidMount()

### Updating: re-rendered caused by changes to props or state.

    componentWillReceiveProps(nextProps) // will be deprecated
    // this.setState() good to put in cwrp
    // cwrp only uses when state dedrives from props
    // have to change state here when component props changed, because state only initialized from constructor, not updated from update case. so must re-sync state from props here
    shouldComponentUpdate(nextProps, nextState)
    componentWillUpdate(nextProps, nextState) // will be deprecated
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

## Re-render and DOM update:

when talking about Dom 2 types: virtualDom (tree of React elements) & browserDom

1. render() just return jsx/virtualDom, it's just a get method without any side effect, just call it to return jsx stuff at anytime; I have tried in other places to call render(), it just return Symbol(React.element) jsx stuff.

2. after render(), React gets virtualDom. Then, React will compare if the new virtualDom is different current virtualDom (that may be the reason why using this.setState instead of change directly, because React needs to create a new virtualDom to compare the existing virtualDom)

3. After comparing (React Reconciliation), if React finds it is different, then React will paint to real browserDom

## ---- receive props from either literature way or redux way ----

a. <MyComponent prop1={"xin"} />

b. mapStateToProps(state){ return prop2: state.xxReducer.surname }
MyComponent will get both this.props.prop1 and this.props.prop2, and cannot feel the difference

## ---- setState is async function ----

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

## PureComponent and Stateless Component

var Stateless1 = (props) => return <label>I am {this.props.name}</label>;
class Stateless1 extends React.Component {
    render () { return <label>I am {this.props.name}</label>; }
}

Stateless Component will still re-render every time its parent re-renders, same as normal Component.
PureComponent will not re-render if its props not gets changed (if state changes inside it, not check yet, but should be a separate topic, as we talking about parent re-render)

