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
	await new Promise((r) => setTimeout(r, 2000));

	const searchParams = request.nextUrl.searchParams;
	const id = searchParams.get("id") as string;
	const frameStrings = searchParams.get("frames") as string;

	const frames = frameStrings.split(",");

	console.log("started detecting in frames", id);

	const final = [];

	for await (const time of frames) {
		const dir = join("./", "tmp", id, time) + "/";

		if (await detectImage("./" + dir + "bottom.jpg")) {
			console.log("Detected in bottom.jpg", time);
			final.push({
				time: time,
				position: "bottom",
			});
		} else if (await detectImage("./" + dir + "top.jpg")) {
			console.log("Detected in top.jpg", time);
			final.push({
				time: time,
				position: "top",
			});
		} else {
			console.log("Not detected in", time);
		}
	}

	console.log("finished detecting in frames", final);

	return new Response(JSON.stringify(final), { status: 200 });
}
