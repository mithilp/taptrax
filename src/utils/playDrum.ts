"use client";

import { DrumMachine } from "smplr";

const context = new AudioContext();

const drumMachine = new DrumMachine(context, { instrument: "TR-808" });
drumMachine.output.setVolume(127);

const playDrum = (music: Array<{ position: string; time: number }>) => {
	const now = context.currentTime;
	for (let i = 0; i < music.length; i++) {
		setTimeout(() => {
			drumMachine.start({
				note:
					music[i].position == "top"
						? "snare"
						: music[i].position == "bottom"
						? "kick"
						: "hihat-close",
			});
		}, music[i].time);
	}
};

export default playDrum;
