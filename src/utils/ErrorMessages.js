export const errorMessages = {
  SERVER_CONNECTION_ERROR: 'Could not connect to server',
  GET_ERROR: (type) => {
    return `Could not get ${type}, please try refreshing the page`
  },
  UPDATE_ERROR: (type) => {
    return `Could not update ${type}, please try again`
  },
}
