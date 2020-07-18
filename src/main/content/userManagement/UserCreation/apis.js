import axios from 'axios';

export var updateRole = (userId, roleId) => new Promise(function (resolve, reject) {

    axios.post(window.authServer + '/user/changeRole', {
        userId : userId,
        roleId: roleId
    })
        .then(response => {
            if (response.data.success) {
                resolve('success');
            } else {
                reject(new Error('failed'));
            }

        }).catch(function (error) {
            console.log("changeRole err ", error);
            reject(error)
        });
});

export var getLocations = () => new Promise(function (resolve, reject) {

    axios.get(window.systemServer + '/location/getLocations')
        .then(response => {
            if (response.data.success && response.data.locations) {
                resolve(response.data.locations);
            } else {
                reject(new Error('failed'));
            }

        }).catch(function (error) {
            console.log("changeRole err ", error);
            reject(error)
        });
});
