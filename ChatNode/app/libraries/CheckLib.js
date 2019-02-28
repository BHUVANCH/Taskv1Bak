trim = (x) => {
    let value = String(x);
    return value.replace(/^\s+|\s+$/gm, '');
}

isEmpty = (result) => {
if (result == undefined || result == null || result == '' || trim(result) === '' || result.length === 0) {
    return true
} else {
    return false;
}

}

module.exports = {
    isEmpty: isEmpty
}