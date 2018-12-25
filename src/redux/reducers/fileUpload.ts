import { SET_FILE_UPLOADED } from "../actionTypes";

const initialState = { lastFileUploaded: -Infinity };

const fileUpload = (state: any = initialState, action: any): any => {
    switch (action.type) {
        case SET_FILE_UPLOADED: {
            return {
                ...state,
                lastFileUploaded: action.payload
            };
        }
        default: {
            return state;
        }
    }
};

export const getLastFileUploaded = (store: any) => {
    return store.lastFileUploaded;
}

export default fileUpload;
