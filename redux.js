
// 1. dispatch and global state update, 
// redux is sync called, dispatch, then get updated global in next line
dispatch({ type: "clickedFire" });
store.getState(); // can already get new state after action dispatched
// But react setState cannot get from next line, setState is async.



// ---- redux dispatch sync simple object action ----
// step 1: reducer->redux state changed sync (can get updated value); but render did not call
this.props.dispatch({ type: CLICKED_SEND })
// step 2:
debuger; 
// render function called all after that, i think it is async, next event



// ---- redux dispatch async http/timeout action(function) actionSendAsync() ----
this.props.dispatch(actionSendAsync(somedata)); // step 1: already run the code in actionSendAsync, action BEGIN_SEND gets dispatched, reducer called, redux state gets updated syncally. but render function did not run
debuger; // step 2, 
// render function called (related to BEGIN_SEND) all after that, i think async and next event



// ---- immutable object in reducer ----
// Since Object.assign({}, state, {updated: 'a'}) only copy and merge top level, and if the propery is an object, it only copy by reference:
// 1. if property is an object
let prop1 = Object.assign({}, state.prop1);
let newState = Object.assign({}, state, { prop1 })
// 2. if property is a list, use concat/slice/filter/map/reduce to get brand new object
let list1 = state.list1.concat();
let list2 = state.list2.slice(0, state.list2.length); // begin, end
let list3 = state.list3.filter(p => true);
let list4 = state.list4.reduce(p => false);
let list5 = state.list5.map(p => p);
// 3. if property is a list, and you want both list and each element to be brand new
let list9 = state.list9.map((item) => Object.assign({}, item));
let newState = Object.assign({}, state, { list9 });


