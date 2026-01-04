const axios = require('axios');

class LyricService {
    apiUrl = process.env.API_URL;

    async getLyric(track_name, artist_name, album_name, duration) {
        try {
            const response = await axios.get(`${this.apiUrl}/api/get`, {
                params: {
                    track_name,
                    artist_name,
                    album_name,
                    duration
                }
            });
            return response.data;
        } catch (error) {
            console.error("😵‍💫 Error fetching lyrics", {track_name, artist_name, album_name, duration});
            throw error;
        }
    }
}

module.exports = LyricService;