import jimp from "jimp";
import { NextRequest } from "next/server";
import { join } from "path";

const detectImage = async (path: string) => {
	const image = await jimp.read(path);
	// @ts-ignore
	await image.color([{ apply: "saturate", params: [100] }]);
	await image.contrast(1);
	const totalPixels = image.bitmap.width * image.bitmap.height;
	let reds = 0;
	let greens = 0;
	let blues = 0;
	for (let x = 0; x < image.bitmap.width; x++) {
		for (let y = 0; y < image.bitmap.height; y++) {
			const color = await image.getPixelColor(x, y);
			const hex = jimp.intToRGBA(color);
			reds += hex.r;
			greens += hex.g;
			blues += hex.b;
		}
	}

	return reds / totalPixels > 228 && greens / totalPixels < 130;
};

export async function POST(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const id = searchParams.get("id") as string;
	const frameStrings = searchParams.get("frames") as string;

	const frames = frameStrings.split(",");

	console.log("started detecting in frames", id);

	for await (const frame of frames) {
		const dir = join("./", "tmp", id, frame) + "/";

		if (await detectImage(dir + "bottom.jpg")) {
			console.log("Detected in bottom.jpg", frame);
		} else if (await detectImage(dir + "top.jpg")) {
			console.log("Detected in top.jpg", frame);
		} else {
			console.log("Not detected in", frame);
		}
	}

	console.log("finished detecting in frames", id);

	return new Response("Success", { status: 200 });
}
