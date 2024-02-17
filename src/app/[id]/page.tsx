"use client";

export default function Page({ params }: { params: { id: string } }) {
	const { id } = params;

	const work = async () => {
		const response = await fetch(`/api?id=${id}`);
		alert("Video cut in halves!");
	};

	return (
		<div>
			<button onClick={work}>Go to work</button>
		</div>
	);
}
