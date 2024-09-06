

function setUserToken(acessToken, username) {
    localStorage.setItem('appUser', JSON.stringify({ acessToken, username }));
}

function getUser() {
    const appUser = localStorage.getItem('appUser');
    if (!appUser) return null;

    const data = JSON.parse(appUser);

    return {
        acessToken: data.acessToken,
        username: data.username
    }
}

function userLogoff() {
    localStorage.removeItem('appUser');
    window.location.href = '/';
}

function getDeviceId() {
    let deviceId = sessionStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
            });
        sessionStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
}


function makeRequest(method, url, data = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method.toUpperCase(), url, true);

        const user = getUser();

        if (user?.acessToken) {
            headers['Authorization'] = `bearer  ${user.acessToken}`;
        }

        for (const key in headers) {
            if (headers.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }

        xhr.responseType = 'json';

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr?.response);
            }
        };

        xhr.onerror = () => {
            reject(new Error('Network error'));
        };

        if (data) {
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }
    });
}