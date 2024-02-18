import { readFile } from "fs/promises";
import wav from "node-wav";

const getPeaks = async (input: string) => {
	const buffer = await readFile(input);
	const result = wav.decode(buffer);
	let sampleRate = result.sampleRate;
	let channelData = result.channelData[0];
	let times = [];
	let count = 1;
	let highest = 0;
	for (let j = 1; j < channelData.length; j++) {
		if (Math.abs(channelData[j]) > highest) {
			highest = Math.abs(channelData[j]);
		}
	}

	for (let i = 1; i < channelData.length; i++) {
		if (Math.abs(channelData[i]) < 0.5 * highest) {
			channelData[i] = 0;
		}
		if (channelData[i] < 0 && channelData[i - 1] == 0) {
			if (times.length == 0) {
				times.push(Math.floor((i / sampleRate) * 1000));
			} else if (i / sampleRate - times[count - 1] > 0.07) {
				times.push(Math.floor((i / sampleRate) * 1000));
				count++;
			}
		}
	}

	console.log(times);
	return times;
};

export default getPeaks;
