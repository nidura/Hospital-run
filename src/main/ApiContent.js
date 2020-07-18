import axios from 'axios';

// Post API
export var postApi = (api, postDetail) => new Promise(((resolve, reject) => {
  axios.post(api, postDetail).then((response) => {
    if (response.data.success) resolve(response); else resolve(false);
  }).catch((error) => { reject(error) })
}));

// GET API
export var getApi = (api, params) => new Promise(((resolve, reject) => {
  axios.get(api, { params }).then((response) => {
    if (response.data.success) resolve(response); else { resolve(response) }
  }).catch((error) => { reject(error) })
}));
