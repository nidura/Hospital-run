import axios from 'axios';

export var updatePassword = (userId, newPassword, currentPassword) => new Promise(function (resolve, reject) {

    axios.post(window.authServer + '/user/changePassword', {
        userId : userId,
        newPassword: newPassword,
        currentPassword: currentPassword,
    })
        .then(response => {
            if (response.data.success) {
                resolve('success');
            } else {
                reject(new Error('failed'));
            }

        }).catch(function (error) {
            console.log("location err ", error);
            reject(error)
        });
});
