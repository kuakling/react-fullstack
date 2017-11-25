export function swCropper2Jcrop(state){
  // 34.22-8.67-82.44-81
  const { data, naturalWidth, naturalHeight } = state
  const arr = [
    parseFloat(((data.x * 100) / naturalWidth).toFixed(2)),
    parseFloat(((data.y * 100) / naturalHeight).toFixed(2)),
  ]
  arr[2] = parseFloat((((data.width * 100) / naturalWidth) + arr[0]).toFixed(2))
  arr[3] = parseFloat((((data.height * 100) / naturalHeight) + arr[1]).toFixed(2))

  const offset = arr.join('-')
  // console.log(offset)
  return offset
}

export function jcropOffset(offsetString){
  const arr = offsetString.split('-').map(Number)
  const jcropValue = {
    x: arr[0],
    y: arr[1],
    width: arr[2],
    height: arr[3] || null
  }
  return jcropValue
  // this.setCropperState(jcropValue)
}

export function swJcrop2Cropper(jcropValue, img) {
  const data = {
    x: parseFloat(((jcropValue.x * img.width) / 100).toFixed(2)),
    y: parseFloat(((jcropValue.y * img.height) / 100).toFixed(2)),
  }
  data.width = ((jcropValue.width * img.width) / 100) - data.x
  data.height = ((jcropValue.height * img.height) / 100) - data.y

  return data
}

// setCropperState = (jcropValue) => {
//   const img = new Image()
//   img.src = this.userImageUrl
//   img.onload = () => {
//     const data = {
//       x: parseFloat(((jcropValue.x * img.width) / 100).toFixed(2)),
//       y: parseFloat(((jcropValue.y * img.height) / 100).toFixed(2)),
//     }
//     data.width = ((jcropValue.width * img.width) / 100) - data.x
//     data.height = ((jcropValue.height * img.height) / 100) - data.y
//     // console.log(data)
//     this.setState({ 
//       data,
//       naturalWidth: img.width,
//       naturalHeight: img.height,
//     })
//   };
// }