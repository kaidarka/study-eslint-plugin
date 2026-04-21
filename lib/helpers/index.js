function isPathRelative(path) {
    return path.startsWith("./") || path.startsWith("../") || path === ".";
}

module.exports = {
    isPathRelative,
};