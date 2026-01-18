const axios = require('axios');

class LyricService {
    apiUrl = process.env.API_URL;

    async getLyric(track_name, artist_name, album_name, duration) {
        let response = null;
        try {
            console.log(`Service: getting lyric for: ${track_name}`);

            new Promise(resolve => setTimeout(resolve, 1500));

            const response = await axios.get(`${this.apiUrl}/api/get`, {
                params: {
                    track_name,
                    artist_name,
                    album_name,
                    duration
                }
            });
            

            if (response.data && (response.data.syncedLyrics || response.data.plainLyrics)) {
                response = response.data;
            }
        } catch (error) {
            console.error("😵‍💫 Error fetching lyrics", {track_name, artist_name, album_name, duration});
            console.error("Service Error details from server: ", error.message);
        }

        return response;
    }
}

module.exports = LyricService;