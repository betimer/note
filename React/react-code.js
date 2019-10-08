
// --------------------------------------------------------------------------------
// ---- add more porps to children (from composition) ----
// specially useful in compound component
// this.props.children (just data passed from outside)
// not sure if I must use React.Children.map + React.cloneElement, can I use only ES6?
class SomeComponent extends React.Component {
  render() {
    const { children } = this.props;
    const childrenUpdated = React.Children.map(children,
      child => React.cloneElement(
        child, {
          activeValue: this.state.activeValue, // 'fm'
          isSelect2: this.state.activeValue == child.props.value, // this is even simpler
          onActivate: () => this.updateValue(child.props.value), // what is that???
          onActivate2: () => this.setState({ activeValue: child.props.value })
        }));

    return (
      <div>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
        {childrenUpdated}
      </div>
    );
  }
}




// --------------------------------------------------------------------------------
// ---- usage of react context, coupling name from outside and inside component----
class Grandfather extends React.Component {
  static childContextTypes = {
    grandfatherClick: React.PropTypes.func.isRequired
  }
  getChildContext() {
    return {
      grandfatherClick: this.handleClick
    }
  }
}

class Grandchild extends React.Component {
  static contextTypes = {
    grandfatherClick: React.PropTypes.func.isRequired
  }

  render() {
    return <button onClick={this.context.grandfatherClick}></button>;
  }
}




// --------------------------------------------------------------------------------
// -------------- exmaple of setState in componetWillReceiveProps
function componetWillReceiveProps(nextProps) {
  // because of component mounted, state after constructor (init) will out sync, so do this:
  if (nextProps.isOpen != this.state.isOpen)
    this.setState({ isOpen: nextProps.isOpen });
}




// ------------------------------------------------------------------------------
// higher-order component: a function that takes a component and returns a new component.
// magic of react-redux: higher-order component + context in <Provider>
ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('app'))

// var connected = connect(mapStateToProps)(oldComponent)
const connect = (mapStateToProps) => {
  return (Comp) => {
    return class extends React.Component {
      static contextTypes = { miniStore: React.PropTypes.object }

      componentDidMount() {
        this.context.miniStore.subscribe(() => {
          // const miniState = this.context.miniStore.getState();
          // const childProps = mapStateToProps(miniState);

          // const pppp = mapStateToProps(this.connext.miniStore.getState());
          // debugger;
          // this.setState(this.context.miniStore.getState()) 
          this.forceUpdate();
        });
      }

      render() {
        const pppp = mapStateToProps(this.context.miniStore.getState());
        pppp.dispatch = this.context.miniStore.dispatch;
        // debugger;
        return <Comp {...pppp} />; // shortcuts to add props to other React Component
      }
    }
  }
}

class Provider extends React.Component {
  // context store
  static childContextTypes = { miniStore: React.PropTypes.object }

  getChildContext() {
    return {
      // miniStore: this.state
      miniStore: this.props.store
    }
  }

  render() {
    return <div>{this.props.children}</div>
  }
}




// --------------------------------------------------------------------------------
// -------- render props; render children (very similar approach)
// Case: ShareComponent maintains location of mouse, and a few components relay its value to render
class ShareComponent extends React.Component {
  state = { xx: 1, yy: 2 }
  // control state by itself
  render() {
    return this.props.renderProps(this.state.xx, this.state.yy);
    // if render children, will be:
    // return this.props.children(this.state.xx, this.state.yy);
  }
}

function ExampleRenderProps() {
  return <ShareComponent renderProps={(x, y) => (
    <h1>{x + y}</h1>
  )} />
}

function ExampleRenderChildren() {
  return <ShareComponent>
    {(x, y) => (<h1>{x + y}</h1>)}
  </ShareComponent>;
}
