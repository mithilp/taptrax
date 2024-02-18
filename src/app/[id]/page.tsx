import PlayButton from "@/components/PlayButton";
import DownloadButton from "@/components/DownloadButton";
import { readFile } from "fs/promises";

const getData = async (id: string) => {
	const file = await readFile(`../tmp/${id}/detections.json`, "utf-8");
	const detections = JSON.parse(file);
	return detections;
};

export default async function Page({ params }: { params: { id: string } }) {
	const data = await getData(params.id);

	return (
		<div>
			<PlayButton data={data} />

			<DownloadButton data={data} />
		</div>
	);
}
