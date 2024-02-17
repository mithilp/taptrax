"use client";

export default function Page({ params }: { params: { id: string } }) {
	const { id } = params;

	const work = async () => {
		// cut video in halves
		await fetch(`/api/halves?id=${id}`, { method: "POST" });

		// get audio spikes
		const spikes = [3129, 5203];
		await fetch(`/api/frames?id=${id}&frames=${spikes.join(",")}`, {
			method: "POST",
		});

		alert("Got frames!");
	};

	return (
		<div>
			<button onClick={work}>Go to work</button>
		</div>
	);
}
