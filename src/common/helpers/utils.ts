import * as CryptoJS from 'crypto-js';

export const encryptPassword = (password: string): string => {
    const encryptedPassword = CryptoJS.MD5(password).toString();
    return encryptedPassword;
};

export const getExceptionMessage = (error): string => {
    let message: string;

    if (error?.response?.data?.message) message = error.response.data.message;
    else if (error?.response?.data?.Message)
        message = error.response.data.Message;
    else if (error?.response?.message) message = error.response.message;
    else if (error?.message) message = error.message;

    if (!message) {
        return 'Error';
    } else if (Array.isArray(message) || typeof message === 'object') {
        return JSON.stringify(message);
    }
    return message;
};
