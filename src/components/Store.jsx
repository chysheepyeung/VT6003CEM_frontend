import React from 'react'
import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {

  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

function reducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, userInfo: action.payload };
        case 'REGISTER':
            return { ...state, userInfo: action.payload };
        case 'LOGOUT':
            return { ...state,userInfo: null};
        default:
            return state;
    }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
