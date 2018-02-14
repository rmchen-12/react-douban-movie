import { connect } from 'react-redux'
import viewDecorator from './viewDecorator'
import actionCreator from './actionCreator'

function generateViewWithFetch({
  pageName,
  moduleName,
  API,
  fetchParams,
  view,
  doesCache = false
}) {
  let fetchAPIdata = (URL, outerFetchParams) => {
    return actionCreator({
      pageName,
      moduleName,
      URL,
      outerFetchParams,
      doesCache
    })
  }

  const composeRequest = (inputAPI, inputParams = {}) => {
    let requestPara = ''
    let APItoFill = inputAPI.indexOf('?') >= 0 ? inputAPI : inputAPI + '?'
    Object.keys(inputParams).forEach((key) => {
      if (APItoFill.indexOf(':' + key) >= 0) {
        let reg = new RegExp(`:${key}`)
        APItoFill = APItoFill.replace(reg, inputParams[key])
      } else {
        if (APItoFill[APItoFill.length - 1] === '?') {
          requestPara += key + '=' + inputParams[key]
        } else {
          requestPara += '&' + key + '=' + inputParams[key]
        }
      }
    })
    let composedRequest = requestPara ? APItoFill + requestPara : APItoFill
    return composedRequest
  }

  let connected = connect((state, ownProps) => {
    let currState = pageName ? state[pageName][moduleName] : state[moduleName]
    return {
      API: API,
      isLoading: typeof currState.isLoading === 'undefined' ? true : currState.isLoading,
      payload: currState.payload,
    }
  }, (dispatch, ownProps) => {
    return {
      // backup if use other API
      fetchData: (fetchAPI, params) => {
        let url = composeRequest(fetchAPI, params)
        dispatch(fetchAPIdata(
          url, fetchParams))
      },
      fetchByParams: (params) => {
        let url = composeRequest(API, params)
        dispatch(fetchAPIdata(
          url, fetchParams))
      }
    }
  })(viewDecorator(view))

  return connected
}

export default generateViewWithFetch