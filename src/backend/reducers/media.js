// import { Drawer } from 'react-md'

// // export function updateMedia() {
// //   const { mobile, tablet, desktop } = Drawer.getCurrentMedia(Drawer.defaultProps)
// //   return { type: 'UPDATE_MEDIA', payload: { media: { mobile, tablet, desktop } } };
// // }

// export function updateMedia() {
//   const { mobile, tablet, desktop } = Drawer.getCurrentMedia(Drawer.defaultProps)
//   let device = 'desktop';
//   if (mobile) {
//     device = 'mobile';
//   } else if (tablet) {
//     device = 'tablet';
//   }
//   return {
//     mobile,
//     tablet,
//     desktop,
//     device,
//   }
// }
const minWidth = {
  mobile: 767,
  tablet: 768,
  desktop: 1025
}

export function updateMedia() {
  const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
  let mobile = false,
      tablet = false,
      desktop = false,
      device = 'desktop'
  if (w <= minWidth.mobile) {
    mobile = true
    device = 'mobile'
  } else if(w <= minWidth.tablet) {
    mobile = true
    device = 'tablet'
  }else{
    desktop = true
  }

  return {
    mobile,
    tablet,
    desktop,
    device
  }
}

export default function reducer(state, action) {
  if (action.type === 'UPDATE_MEDIA') {
    return { ...state, ...action.payload.media };
  }
  return state;
}
