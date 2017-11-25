export const inputErrors = (items) => {
  const errors = {}
  items.map((item) => {
    errors[item.field] = {
      message: item.message
    }
  })
  return errors
}