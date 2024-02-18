"use client";

import { DrumMachine } from "smplr";

const context = new AudioContext();

const drumMachine = new DrumMachine(context, { instrument: "TR-808" });
drumMachine.output.setVolume(127);
const playDrum = (music: Array<{ position: string; start: number }>) => {
	console.log(context.currentTime + 5);

	const now = context.currentTime;
	for (let i = 0; i < music.length; i++) {
		console.log(music[i].position);
		drumMachine.start({
			note:
				music[i].position == "top"
					? "snare"
					: music[i].position == "bottom"
					? "kick"
					: "hihat-close",
			time: now + music[i].start / 1000,
		});
	}
};

export default playDrum;
