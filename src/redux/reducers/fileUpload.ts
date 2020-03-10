import { SET_FILE_UPLOADED } from "../actionTypes";
import { FileUploadStore } from "../storeTypes";

const initialState: FileUploadStore = { lastFileUploaded: -Infinity };

const fileUpload = (
  state: FileUploadStore = initialState,
  action: any
): any => {
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

export default fileUpload;
