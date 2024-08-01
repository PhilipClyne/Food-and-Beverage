const { getAccessToken } = require('../config/kiotvietAPI');

const authenticate = async (req, res) => {
    try {
        const token = await getAccessToken();
        res.json({ accessToken: token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    authenticate
};
