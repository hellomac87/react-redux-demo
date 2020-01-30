import { combineReducers, createStore, compose, applyMiddleware } from "redux";

import { all } from "redux-saga/effects";
import createSagaMiddleware from "redux-saga";

// sagas
import testSaga from "./test/saga";
import demoSaga from "./demo/saga";

// reducers
import test from "./test/ducks";
import demo from "./demo/ducks";

const rootReducer = combineReducers({
  test,
  demo
});

function* rootSaga() {
  yield all([testSaga(), demoSaga()]);
}

const configureStore = (initialState, options) => {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [sagaMiddleware];
  const enhancer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middlewares))
      : compose(
          applyMiddleware(...middlewares),
          window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : f => f
        );
  const store = createStore(rootReducer, initialState, enhancer);
  sagaMiddleware.run(rootSaga);

  return store;
};

export default configureStore;
