import { createSlice } from "@reduxjs/toolkit"
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
// import logger from "redux-logger";



const initialState = {
    notes:[]
}


export const notesSlice = createSlice({
    name:"notes",
    initialState,
    reducers:{
        create:{
            reducer:(state,action) => {
                state.notes.push(action.payload)
            }
        },
        DeleteNote: (state) => {
            state.notes.splice(0, state.length);
        },

       
    }
})
export const userSlice = createSlice({
    name:"users",
    initialState:{
        users:[]
   },
    reducers:{
        create:{
            reducer:(state,action) => {
                state.users.push(action.payload)
            }
        }
    }
})

export const { create: AddUser } = userSlice.actions;
export const { create: AddNote,DeleteNote } = notesSlice.actions;
const reducer = {
    notes: notesSlice.reducer,
    users:userSlice.reducer,
};
const middleware = [...getDefaultMiddleware()];
export default configureStore({
  reducer,
  middleware
});