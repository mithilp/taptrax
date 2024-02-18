import { readFile, writeFile } from "fs/promises";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const id = searchParams.get("id") as string;

	const frameStrings = searchParams.get("frames") as string;
	const frames = frameStrings.split(",");

	console.log("started adding spacebars", id);

	const og_detections = await readFile(`../tmp/${id}/detections.json`, "utf-8");
	const detections = JSON.parse(og_detections);

	for (const time of frames) {
		detections.push({ time: time, type: "spacebar" });
	}

	await writeFile(`../tmp/${id}/detections.json`, JSON.stringify(detections));

	console.log("done adding spacebars", id);

	return new Response("Success", { status: 200 });
}
