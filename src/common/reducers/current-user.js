export default function reducer(state, action) {
  switch (action.type) {
    case 'CURRENT_USER_SET': 
      return {
        ...action.user
      }
      break;

    case 'CURRENT_USER_UNSET': 
      return null
      break;
    

    default: return state
  }
}