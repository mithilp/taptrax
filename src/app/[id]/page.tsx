"use client";

import MidiWriter from "midi-writer-js";

export default function Page({ params }: { params: { id: string } }) {
	const { id } = params;

	const work = async () => {
		// cut video in halves
		await fetch(`/api/halves?id=${id}`, { method: "POST" });

		// get audio spikes
		const spikes = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];
		await fetch(`/api/frames?id=${id}&frames=${spikes.join(",")}`, {
			method: "POST",
		});

		const response = await fetch(
			`/api/detect?id=${id}&frames=${spikes.join(",")}`,
			{
				method: "POST",
			}
		);
		const json = await response.json();
		console.log(json);

		const track = new MidiWriter.Track();

		track.addEvent(
			json.map(
				({ time, position }: { time: string; position: string }) =>
					new MidiWriter.NoteEvent({
						pitch:
							position == "top" ? ["C1"] : position == "bottom" ? ["C2"] : "C3",
						duration: "4",
						tick: (Number(time) / 1000) * 512,
					})
			)
		);

		const output = new MidiWriter.Writer(track).dataUri();

		const link = document.createElement("a");
		link.download = "output.mid";
		link.href = output;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div>
			<button onClick={work}>Go to work</button>
		</div>
	);
}
