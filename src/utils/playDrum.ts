"use client";

const playDrum = (music: Array<{ position: string; time: number }>) => {
	for (let i = 0; i < music.length; i++) {
		setTimeout(() => {
			const audio = new Audio(
				music[i].position == "top"
					? "/snare.wav"
					: music[i].position == "bottom"
					? "/kick.wav"
					: "/hat.wav"
			);
			audio.play();
		}, music[i].time);
	}
};

export default playDrum;
