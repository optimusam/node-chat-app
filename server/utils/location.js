let genLocation = function (from, locationURL) {
    return {from, locationURL, createdAt: new Date().getTime()}
}
module.exports = genLocation;