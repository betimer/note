# react

## ---- component lifecycle (different with mount/update) ----

Mounting: created and inserted into the DOM
        constructor()
        componentWillMount()
        render()
        componentDidMount()
Updating: re-rendered caused by changes to props or state.
        componentWillReceiveProps(nextProps) 
        // this.setState() good to put in cwrp
        // cwrp only uses when state dedrives from props
        // have to change state here when component props changed, because state only inited from constructor, not updated from update case. so must re-sync state from props here
        shouldComponentUpdate(nextProps, nextState)
        componentWillUpdate(nextProps, nextState)
        render()
        componentDidUpdate(prevProps, prevState)
Unmounting: removed from the DOM
        componentWillUnmount()
https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle
https://www.tutorialspoint.com/reactjs/reactjs_component_life_cycle.htm

## ---- react process ----

1. jsx: <MyButton color="blue" shadowSize={2}>Click Me</MyButton>
2. build to js: React.createElement(MyButton, {color: 'blue', shadowSize: 2}, 'Click Me')
3. virtual DOM
4. document.createElement (render)
5. real DOM
------------------
when talking about DOM update, there are 2 steps: 
1. render -> return jsx, it's similar to a get method, no any side effect, just call it to return jsx stuff at anytime; I have tried in other places to call render(), it just return Symbol(React.element) jsx stuff.
2. paint to browser

## ---- receive props from either literature way or redux way ----

a. <MyComponent prop1={"xin"} />
b. mapStateToProps(state){ return prop2: state.xxReducer.surname }
MyComponent will get both prop1 and prop2, cannot feel the difference


## ---- setState is async function ----

// maybe next tick? react will put it in the future queue, react takes care of it.
this.setState({newAdded: "test"}); // next async js event queue
let youCannotGetIt = this.state.newAdded; // undefined


## ---- react event (SytheticEvent) ----

React uses event delegation and listens for events at the root of the application. 
React keeps track of which rendered nodes have listeners. 
The synthetic event system implements its own bubbling and calls the appropriate handlers.
That's way when I check DOM element, there is no onclick in html file
I can also see it from broswer callstack when debugger react onClick body.


## ------------ If contextTypes is defined within a component, the following lifecycle methods will receive an additional parameter, the context object:

constructor(props, context)
componentWillReceiveProps(nextProps, nextContext)
shouldComponentUpdate(nextProps, nextState, nextContext)
componentWillUpdate(nextProps, nextState, nextContext)
componentDidUpdate(prevProps, prevState, prevContext)



can I do something like redux props auto connected tag?????? <App redux-auto=true


// children always renders
// component and render props, will only renders when matches


https://github.com/chenglou/react-motion

