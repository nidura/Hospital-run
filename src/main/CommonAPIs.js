import axios from 'axios';

const countries = require('./countries.json');

// load EmpRegistryDetails

export var loadEmpRegistryDetails = value => new Promise((resolve, reject) => {
  const obj = {
    selectedEmpRegId: value,
  };
    // axios.post(window.hrmServer + '/commonAPI/getEmployeeProfileDetailsCommonId')
  axios
    .post(`${window.hrmServer}/commonAPI/getEmpRegistryDetails`, obj)
    .then((response) => {
      if (response.data.success) {
        const empRegistryObjAr = response.data.resultEmployeeRegistryDetails;
        resolve(empRegistryObjAr);
      } else {
        reject(new Error('failed'));
      }
    })
    .catch((error) => {
      reject(error);
      console.log('loadEmpRegistryDetails err ', error);
    });
});

// load Employee Profile Details
export var loadEmployeeProfileDetails = () => new Promise((resolve, reject) => {
  const obj = {
    selectedEmpRegId: 0,
  };

  // axios.post(window.hrmServer + '/commonAPI/getEmployeeProfileDetails', obj)
  axios
    .post(`${window.hrmServer}/commonAPI/getEmployeeProfileDetails`, obj)
    .then((response) => {
      if (response.data.success) {
        const empProfileObjAr = response.data.resultEmployeeProfileDetails;
        resolve(empProfileObjAr);
      } else {
        // reject(new Error('failed'));
      }
    })
    .catch((error) => {
      // alert(error);
      reject(error);
      console.log('loadEmpProfileDetails err ', error);
    });
});

// load Employee Profile Details all
export var loadEmployeeProfileDetailsAll = () => new Promise((resolve, reject) => {
  const obj = {
    selectedEmpRegId: 0,
  };

  // axios.post(window.hrmServer + '/commonAPI/getEmployeeProfileDetails', obj)
  axios
    .post(`${window.hrmServer}/commonAPI/getEmployeeProfileDetailsAll`, obj)
    .then((response) => {
      if (response.data.success) {
        const empProfileObjAr = response.data.resultEmployeeProfileDetailsAll;
        resolve(empProfileObjAr);
      } else {
        // reject(new Error('failed'));
      }
    })
    .catch((error) => {
      // alert(error);
      reject(error);
      console.log('loadEmpProfileDetails err ', error);
    });
});

export var loadDesignationTypes = () => new Promise((resolve, reject) => {
  // axios.get(window.hrmServer + '/commonAPI/getDesignations')
  axios
    .get(`${window.hrmServer}/commonAPI/getDesignations`)
    .then((response) => {
      if (response.data.success) {
        const designationObjAr = response.data.resultEmployeeDesignations;
        resolve(designationObjAr);
      } else {
        reject(new Error('failed'));
      }
    })
    .catch((error) => {
      console.log(`designation err ${error}`);
      reject(error);
    });
});

export var loadDepartmentTypes = () => new Promise((resolve, reject) => {
  // axios.get(window.hrmServer + '/commonAPI/getDepartments')
  axios
    .get(`${window.hrmServer}/commonAPI/getDepartments`)
    .then((response) => {
      if (response.data.success) {
        const departmentObjAr = response.data.resultEmployeDepartments;
        resolve(departmentObjAr);
      } else {
        reject(new Error('failed'));
      }
    })
    .catch((error) => {
      console.log(`designation err ${error}`);
      reject(error);
    });
});

export var loadGradeTypes = () => new Promise((resolve, reject) => {
  // axios.get(window.hrmServer + '/commonAPI/getGrades')
  axios
    .get(`${window.hrmServer}/commonAPI/getGrades`)
    .then((response) => {
      if (response.data.success) {
        const gradeObjAr = response.data.resultEmployeGrades;
        resolve(gradeObjAr);
      } else {
        reject(new Error('failed'));
      }
    })
    .catch((error) => {
      console.log(`grade err ${error}`);
      reject(error);
    });
});

export var loadEmploymentTypes = () => new Promise((resolve, reject) => {
  // axios.get(window.hrmServer + '/commonAPI/getEmployments')
  axios
    .get(`${window.hrmServer}/commonAPI/getEmployments`)
    .then((response) => {
      if (response.data.success) {
        const employmentObjAr = response.data.resultEmployeEmployments;
        resolve(employmentObjAr);
      } else {
        reject(new Error('failed'));
      }
    })
    .catch((error) => {
      console.log(`grade err ${error}`);
      reject(error);
    });
});

export var loadLocationTypes = () => new Promise((resolve, reject) => {
  // axios.get(window.hrmServer + '/commonAPI/getLocations')
  axios
    .get(`${window.hrmServer}/commonAPI/getLocations`)
    .then((response) => {
      if (response.data.success) {
        const locationObjAr = response.data.resultEmployeLocations;
        resolve(locationObjAr);
      } else {
        reject(new Error('failed'));
      }
    })
    .catch((error) => {
      console.log(`location err ${error}`);
      reject(error);
    });
});

export var loadGroupTypes = () => new Promise((resolve, reject) => {
  // axios.get(window.hrmServer + '/commonAPI/getGroups')
  axios
    .get(`${window.hrmServer}/commonAPI/getGroups`)
    .then((response) => {
      if (response.data.success) {
        const groupObjAr = response.data.resultEmployeGroups;
        resolve(groupObjAr);
      } else {
        reject(new Error('failed'));
      }
    })
    .catch((error) => {
      console.log(`location err ${error}`);
      reject(error);
    });
});

export var loadShifts = () => new Promise((resolve, reject) => {
  // axios.get(window.hrmServer + '/commonAPI/getShifts')
  axios
    .get(`${window.hrmServer}/commonAPI/getShifts`)
    .then((response) => {
      if (response.data.success) {
        const shiftObjAr = response.data.resultShifts;
        resolve(shiftObjAr);
      }
    })
    .catch((error) => {
      console.log(`shift err ${error}`);
      reject(error);
    });
});

export var loadTitles = () => new Promise((resolve, reject) => {
  // axios.get(window.hrmServer + '/commonAPI/getTitles')
  axios
    .get(`${window.hrmServer}/commonAPI/getTitles`)
    .then((response) => {
      if (response.data.success) {
        const titleObjAr = response.data.resultTitles;
        resolve(titleObjAr);
      }
    })
    .catch((error) => {
      console.log(`title err ${error}`);
      reject(error);
    });
});

export var loadMaritialStatus = () => new Promise((resolve, reject) => {
  // axios.get(window.hrmServer + '/commonAPI/getMaritalStatus')
  axios
    .get(`${window.hrmServer}/commonAPI/getMaritalStatus`)
    .then((response) => {
      if (response.data.success) {
        const maritialStatusObjAr = response.data.resultMaritialStatus;
        resolve(maritialStatusObjAr);
      }
    })
    .catch((error) => {
      console.log(`maritialStatus err ${error}`);
      reject(error);
    });
});

export var loadBanks = () => new Promise((resolve, reject) => {
  // axios.get(window.hrmServer + '/commonAPI/geBanks')
  axios
    .get(`${window.hrmServer}/commonAPI/geBanks`)
    .then((response) => {
      if (response.data.success) {
        const banksObjAr = response.data.resultBanks;
        resolve(banksObjAr);
      } else {
        reject('NO DATA FOUND !');
      }
    })
    .catch((error) => {
      console.log(`bank err ${error}`);
      reject(error);
    });
});

export var loadPayTypes = () => new Promise((resolve, reject) => {
  // axios.get(window.hrmServer + '/commonAPI/getPayTypes')
  axios
    .get(`${window.hrmServer}/commonAPI/getPayTypes`)
    .then((response) => {
      if (response.data.success) {
        const payTypesObjAr = response.data.resultPayTypes;
        resolve(payTypesObjAr);
      }
    })
    .catch((error) => {
      console.log(`payTypes err ${error}`);
      reject(error);
    });
});

export var loadTypeOfAccounts = () => new Promise((resolve, reject) => {
  // axios.get(window.hrmServer + '/commonAPI/getTypeOfAccounts')
  axios
    .get(`${window.hrmServer}/commonAPI/getTypeOfAccounts`)
    .then((response) => {
      if (response.data.success) {
        const accountTypeObjAr = response.data.resultAccountTypes;
        resolve(accountTypeObjAr);
      }
    })
    .catch((error) => {
      console.log(`accountType err ${error}`);
      reject(error);
    });
});

export var loadCountryList = () => new Promise((resolve, reject) => {
  if (countries && countries.length) {
    resolve(countries);
  } else {
    reject('Country list json error');
  }

  // axios.get('https://restcountries.eu/rest/v2/all')
  //   .then((response) => {
  //     if (response.data && response.data.length) {
  //       console.log(response.data);
  //       resolve(response.data);
  //     }
  //   }).catch((error) => {
  //     reject(error);
  //   });
});

export var loadSystemCountryList = () => new Promise((resolve, reject) => {
  axios
    .get(`${window.hrmServer}/metaData/getAllCountries`)
    .then((response) => {
      if (response.data.success) {
        const countryObjAr = response.data.result;
        resolve(countryObjAr);
      }
    })
    .catch((error) => {
      reject(error);
    });
});

export var loadProvinceList = () => new Promise((resolve, reject) => {
  axios
    .get(`${window.hrmServer}/commonAPI/getProvences`)
    .then((response) => {
      if (response.data.success) {
        const provinceObjAr = response.data.provenceList;
        resolve(provinceObjAr);
      }
    })
    .catch((error) => {
      reject(error);
    });
});

export var loadCurrencyList = () => new Promise((resolve, reject) => {
  axios
    .get(`${window.hrmServer}/metaData/getAllCurrencies`)
    .then((response) => {
      if (response.data.success) {
        const dataObj = response.data.result;
        resolve(dataObj);
      }
    })
    .catch((error) => {
      reject(error);
    });
});

// Course list
export var loadCourseList = () => new Promise((resolve, reject) => {
  axios
    .get(`${window.hrmServer}/trainingSetup/getAllCourses`)
    .then((response) => {
      if (response.data.success) {
        const dataObj = response.data.result;
        resolve(dataObj);
      }
    })
    .catch((error) => {
      reject(error);
    });
});

// Delivery method
export var loadTrainingDeliveryMethodList = () => new Promise((resolve, reject) => {
  axios
    .get(`${window.hrmServer}/trainingSetup/getTrainingSessionDelivery`)
    .then((response) => {
      if (response.data.success) {
        const dataObj = response.data.result;
        resolve(dataObj);
      }
    })
    .catch((error) => {
      reject(error);
    });
});

// attendance type
export var loadTrainingAttendanceTypeList = () => new Promise((resolve, reject) => {
  axios
    .get(`${window.hrmServer}/trainingSetup/getTrainingSessionAttendanceType`)
    .then((response) => {
      if (response.data.success) {
        const dataObj = response.data.result;
        resolve(dataObj);
      }
    })
    .catch((error) => {
      reject(error);
    });
});

// Training Session
export var loadTrainingSessionList = () => new Promise((resolve, reject) => {
  axios
    .get(`${window.hrmServer}/trainingSetup/getAllTrainingSession`)
    .then((response) => {
      if (response.data.success) {
        const dataObj = response.data.result;
        resolve(dataObj);
      }
    })
    .catch((error) => {
      reject(error);
    });
});

// Employee training session status
export var loadTrainingEmployeeSessionStatusList = () => new Promise((resolve, reject) => {
  axios
    .get(`${window.hrmServer}/trainingSetup/getTrainingEmployeeSessionStatus`)
    .then((response) => {
      if (response.data.success) {
        const dataObj = response.data.result;
        resolve(dataObj);
      }
    })
    .catch((error) => {
      reject(error);
    });
});

// Employee nationality details
export var loadNationality = () => new Promise((resolve, reject) => {
  axios
    .get(`${window.hrmServer}/commonAPI/getNationality`)
    .then((response) => {
      if (response.data.success) {
        const nationalityObjAr = response.data.resultNationality;
        resolve(nationalityObjAr);
      }
    })
    .catch((error) => {
      console.log(`nationality err ${error}`);
      reject(error);
    });
});

export const getAllRoles = () => new Promise((resolve, reject) => {
  const url1 = `${window.authServer}/roles/getAllRoles`;
  const request = axios.get(url1);

  request
    .then((response) => {
      if (!response.error && response.data.success) {
        resolve(response.data.permissionNames);
        // return response.data.permissionNames;
      } else {
        reject(new Error('response error'));
      }
    })
    .catch((error) => {
      reject(error);
    });
});

export var getAllUsers = () => new Promise((resolve, reject) => {
  const url1 = `${window.authServer}/user/getAllUsers`;
  const request = axios.get(url1);
  request
    .then((response) => {
      if (!response.error && response.data.success) {
        resolve(response.data.users);
      } else {
        reject(new Error('response error'));
      }
    })
    .catch((error) => {
      reject(error);
    });
});

export var loadReligionList = () => new Promise((resolve, reject) => {
  axios
    .get(`${window.hrmServer}/commonAPI/getReligions`)
    .then((response) => {
      if (response.data.success) {
        const religionObjAr = response.data.result;
        resolve(religionObjAr);
      }
    })
    .catch((error) => {
      reject(error);
    });
});

export var loadRadioChannelList = () => new Promise((resolve, reject) => {
  axios
    .get(`${window.hrmServer}/commonAPI/getRadioChannel`)
    .then((response) => {
      if (response.data.success) {
        const radioChannelObjAr = response.data.result;
        resolve(radioChannelObjAr);
      }
    })
    .catch((error) => {
      reject(error);
    });
});

export var loadTvChannelList = () => new Promise((resolve, reject) => {
  axios
    .get(`${window.hrmServer}/commonAPI/getTvChannel`)
    .then((response) => {
      if (response.data.success) {
        const tvChannelObjAr = response.data.result;
        resolve(tvChannelObjAr);
      }
    })
    .catch((error) => {
      reject(error);
    });
});

export var loadDistricts = () => new Promise((resolve, reject) => {
  axios
    .get(`${window.invServer}/commonAPI/getDistricts`)
    .then((response) => {
      if (response.data.success) {
        const districtsObjAr = response.data.result;
        resolve(districtsObjAr);
      }
    })
    .catch((error) => {
      reject(error);
    });
});

export var loadCitiesByDistrictId = id => new Promise((resolve, reject) => {
  axios
    .get(`${window.invServer}/commonAPI/getCities/${id}`)
    .then((response) => {
      if (response.data.success) {
        const citiesObjAr = response.data.result;
        // console.log(response.data);
        resolve(citiesObjAr);
      }
    })
    .catch((error) => {
      reject(error);
    });
});
