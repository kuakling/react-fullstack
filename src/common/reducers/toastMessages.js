export default function reducer(state, action) {
  switch (action.type) {
    case 'TOAST_MESSAGE_ADD': 
      const toasts = [
        ...state,
        action.detail
      ]
      // console.log(toasts)
      return toasts
      break;

    case 'TOAST_MESSAGE_DISMISS': 
      const [, ...toastsSlided] = state 
      // console.log(toastsSlided)
      return toastsSlided
      break;
    

    default: return state
  }
}