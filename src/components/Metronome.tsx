"use client";

import { useEffect } from "react";

const Metronome = () => {
	useEffect(() => {
		let myInterval = setInterval(() => {
			const audio = new Audio("/metronome.mp3");

			audio.volume = 0.1;

			audio.play();
		}, 62.5 * 8);
		return () => {
			clearInterval(myInterval);
		};
	});

	return "";
};

export default Metronome;
