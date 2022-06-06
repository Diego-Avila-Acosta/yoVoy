import { ActionType } from "./index";
import { Dispatch } from "redux";
import { Action } from "./action-Type";
import axios from "axios";

// Ejemplo de como se puede realizar las acciones

export const getEvent = () => {
    return async function (dispatch: Dispatch) {
        try {
            const event = await axios.get('http://localhost:3000/event')
            dispatch({ 
                type: ActionType.GET_ALL_EVENT, 
                payload: event.data
            })
        } catch (error) {
            console.error('Error la acciones de allEvent');
        }
    }
}

export const getSearchEvent = (name:string|number) => {
    return async function (dispatch: Dispatch) {
        try {
            const searchEvent = await axios.get(`http://localhost:3001/event?name=${name}`)
            dispatch({ 
                type: ActionType.SEARCH_EVENT, 
                payload: searchEvent.data
            })
        } catch (error) {
            console.error('Error la acciones de event');
        }
    }
}




