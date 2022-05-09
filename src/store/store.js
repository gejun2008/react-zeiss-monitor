import React from "react";

export const initialState = {
    updateEvent: {}
}
export const reducer = (state = { updateEvent: {} }, action) => {
    switch (action.type) {
        case 'UPDATE_EVENT':
            return {
                ...state,
                updateEvent: action.data || {}
            };
        default:
            return state;
    }
};

export const Context = React.createContext();