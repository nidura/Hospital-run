import axios from 'axios';

export var getUserGridSettings = (ID_USER, GRID_NAME) => new Promise(((resolve, reject) => {
  console.log('getUserGridSettings');

  axios.post(`${window.authServer}/userSettings/getGridSettingOfUser`, { ID_USER, GRID_NAME })
    .then((response) => {
      if (response.data.success && response.data.gridColumns) {
        const gridColumns = response.data.gridColumns;
        const pageSize = response.data.pageSize;
        resolve({ gridColumns, pageSize });
      } else {
        reject(new Error('Setting not found'));
      }
    }).catch((error) => {
      console.log(`getUserGridSettings err ${error}`);
      reject(error)
    });
}));

export var saveUserGridSettings = (ID_USER, GRID_NAME, COL_ARRAY, PAGE_SIZE) => new Promise(((resolve, reject) => {
  console.log('saveUserGridSettings', ID_USER, GRID_NAME, COL_ARRAY);

  axios.post(`${window.authServer}/userSettings/saveUserSettingsOfUser`, {
    ID_USER, GRID_NAME, COL_ARRAY, PAGE_SIZE,
  })
    .then((response) => {
      if (response.data.success) {
        resolve('SUCCESS');
      } else {
        reject(new Error('save failed'));
      }
    }).catch((error) => {
      console.log(`getUserGridSettings err ${error}`);
      reject(error)
    });
}));
