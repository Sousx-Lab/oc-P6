
/**
 * @param {string} email 
 * @returns {boolean}
 */
exports.isEmail = (email) => {
    if(typeof email !== "string"){
        return false;
    }
    return new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email);
}

/**
 * The regex is CNIL compliance and check if eight characters minimum, 
 * at least one uppercase letter, one lowercase letter and one number
 * @param {string} password
 * @returns {boolean}
 */
exports.isValidPassword = (password) => {

    return new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/).test(password);
}

/**
 * @param {any} value 
 * @returns {boolean}
 */
exports.isEmpty = (value = '') => {
    return  new RegExp(/^\s+$|^$/gi).test(value);
}

