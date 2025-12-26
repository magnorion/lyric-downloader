const LyricService = require("../service/lyric.service");
const { parseFile } = require("music-metadata");
const fs = require("fs");
const path = require("path");

class LyricController {

    readDirRecursive = async (dirPath) => {
        const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
        let results = [];

        // Verifica se existe algum .mp3 na pasta atual
        const hasMp3 = entries.some(
            entry => entry.isFile() && entry.name.toLowerCase().endsWith('.mp3')
        );

        if (hasMp3) {
            results.push(dirPath);
        }

        // Percorre subpastas
        for (const entry of entries) {
            if (entry.isDirectory()) {
                const subDirPath = path.join(dirPath, entry.name);
                const subResults = await this.readDirRecursive(subDirPath);
                results = results.concat(subResults);
            }
        }

        return results;
    }


    async fileExists(filePath) {
        try {
            await fs.promises.access(filePath, fs.constants.F_OK);
            return true;
        } catch (error) {
            return false;
        }
    }

    async getLyric() {
        const service = new LyricService();
        const paths = await this.readDirRecursive(process.env.MUSIC_DIR || "./public/music");

        if (paths.length === 0) {
            console.log("🚫 No .mp3 files found in the specified directory.");
            return;
        }
        
        for await (const filePath of paths) {
            fs.readdir(filePath, (err, files) => {
                if (err) {
                    console.error("😵‍💫 Error reading directory:", err);
                    return;
                }

                files.forEach(async (file) => {
                    try {
                        const MUSIC_REGEX = /\.(mp3|flac|ogg|opus|m4a|aac|wav|aiff?|ape|alac)$/i;
                        if (MUSIC_REGEX.test(file) === false) {
                            return;
                        }

                        const lrcFileName = `${filePath}/${file.replace(/\.[^/.]+$/, "")}.lrc`;
                        console.log(`👉 Processing file: ${file}`);
                        

                        if (await this.fileExists(lrcFileName)) {
                            console.log(`⚠️ Lyrics already exist for ${file}`);
                            return;
                        }

                        const metadata = await parseFile(`${filePath}/${file}`);
                        
                        const track_name = metadata.common.title || "";
                        const artist_name = metadata.common.artists?.[0] || "";
                        const album_name = metadata.common.album || "";
                        const duration = Math.floor(metadata.format.duration) || 0;

                        // add a small delay to avoid rate limiting
                        await new Promise(resolve => setTimeout(resolve, 2000));

                        const lrclibData = await service.getLyric(track_name, artist_name, album_name, duration);
                        const { syncedLyrics } = lrclibData;

                        if (syncedLyrics) {
                            fs.writeFileSync(lrcFileName, syncedLyrics, "utf8");
                            console.log(`👌 Lyrics saved to ${lrcFileName}`);
                        } else {
                            console.log(`🚫 No synced lyrics found for ${file}`);
                        }

                    } catch (error) {
                        console.error(`😵‍💫 Error processing file ${file}:`, error);
                    }
                });
            });
        }
    }
}

module.exports = LyricController;
