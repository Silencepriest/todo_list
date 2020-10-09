import axios from 'axios'

const GET_DATA = 'GET_DATA'
const initialValue = {
  data: []
}

const categoryReducer = (state = initialValue, payload) => {
  switch (payload.type) {
    case GET_DATA: {
      return { ...state, data: payload.data }
    }
    default: {
      return state
    }
  }
}

const getRequest = (data) => ({ type: GET_DATA, data })

export function getData(category) {
  return (dispatch) => {
    axios(`/api/v1/tasks/${category}`).then(({ data }) => dispatch(getRequest(data)))
  }
}

export default categoryReducer
