const axios = require('axios');
const config = require('./token');

const getAccessToken = async () => {
    const params = new URLSearchParams();
    params.append('scope', 'PublicApi.Access.FNB');
    params.append('grant_type', 'client_credentials');
    params.append('client_id', config.clientId);
    params.append('client_secret', config.clientSecret);

    try {
        const response = await axios.post(config.tokenEndpoint, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        console.log("Access token response: ", response.data); // Thêm logging để kiểm tra response
        return response.data.access_token;
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message); // Thêm logging để kiểm tra lỗi chi tiết
        throw new Error('Failed to get access token');
    }
};

module.exports = {
    getAccessToken
};
