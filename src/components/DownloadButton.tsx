"use client";

import { useState } from "react";
import MidiWriter from "midi-writer-js";
import { Track } from "midi-writer-js/build/types/chunks/track";

const DownloadButton = ({ data }: { data: Array<any> }) => {
	const [track, setTrack] = useState<Track>(() => {
		const track = new MidiWriter.Track();

		track.addEvent(
			data.map(
				(event: any) =>
					new MidiWriter.NoteEvent({
						pitch:
							event.position == "top"
								? ["C3"]
								: event.position == "bottom"
								? ["C2"]
								: ["C1"],
						duration: "4",
						tick: (Number(event.time) / 1000) * 512,
					})
			)
		);

		return track;
	});

	const download = () => {
		const uri = new MidiWriter.Writer(track).dataUri();
		const link = document.createElement("a");
		link.href = uri;
		link.download = "output.mid";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<button className="p-4 text-xl bg-sky-800/50 rounded-md" onClick={download}>
			Download MIDI
		</button>
	);
};

export default DownloadButton;
