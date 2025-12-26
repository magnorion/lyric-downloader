const axios = require('axios');

class LyricService {
    apiUrl = process.env.API_URL;

    getLyric(track_name, artist_name, album_name, duration) {
        return axios.get(`${this.apiUrl}/api/get`, {
            params: {
                track_name,
                artist_name,
                album_name,
                duration
            }
        }).then(response => {
            return response.data;
        }).catch(error => {
            console.error("Error fetching lyrics:", error);
            throw error;
        });
    }
}

module.exports = LyricService;