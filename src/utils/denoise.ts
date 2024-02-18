import { exec } from "child_process";

const denoise = async (input: string, output: string) => {
	return new Promise((resolve, reject) => {
		exec(
			`ffmpeg \
    -i ${input} \
    -filter:a "afftdn=nr=90:nf=-20:tn=0" \
    -c:a pcm_s16le \
   	${output}`,
			(error: any) => {
				if (error) {
					reject(error);
					console.error(error);
				} else {
					resolve("done");
				}
			}
		);
	});
};

export default denoise;

// usage example
// denoise("taps.wav", "denoise.wav").then((res) => {
// 	let buffer = fs.readFileSync("denoise.wav");
// 	let result = wav.decode(buffer);
// let sampleRate = result.sampleRate;
// let channelData = result.channelData[0];
// let times = [];
// let count = 1;
// for (let i = 1; i < channelData.length; i++) {
// 	if (Math.abs(channelData[i]) < 0.95) {
// 		channelData[i] = 0;
// 	}
// 	if (channelData[i] < 0 && channelData[i - 1] == 0) {
// 		console.log(i / sampleRate);
// 		if (times.length == 0) {
// 			times.push(i / sampleRate);
// 		} else if (i / sampleRate - times[count - 1] > 0.07) {
// 			times.push(i / sampleRate);
// 			count++;
// 		}
// 	}
// }
// console.log(times);
// return times;
// });
