// authMiddleware.js
function ensureLoggedIn(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}
export default ensureLoggedIn;