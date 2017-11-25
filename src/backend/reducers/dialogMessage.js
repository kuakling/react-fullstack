export default function reducer(state, action) {
  switch (action.type) {
    case 'DIALOG_MESSAGE_SHOW': 
      return {
        ...action.detail
      }
      break;

    case 'DIALOG_MESSAGE_HIDE': 
      return {}
      break;
    

    default: return state
  }
}