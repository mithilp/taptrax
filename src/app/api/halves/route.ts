import { exec } from "child_process";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const id = searchParams.get("id") as string;

	console.log("start cutting into halves", id);

	const convertVideo = async () => {
		console.log("converting video into 2 halves", id);

		return new Promise((resolve, reject) => {
			exec(
				`ffmpeg -i ${process
					.cwd()
					.replace(
						" ",
						"\\ "
					)}/tmp/${id}/input.mp4 -filter_complex "[0]crop=iw:ih/2:0:0[top];[0]crop=iw:ih/2:0:oh[bottom]" -map "[top]" ${process
					.cwd()
					.replace(" ", "\\ ")}/tmp/${id}/top.mp4 -map "[bottom]" ${process
					.cwd()
					.replace(" ", "\\ ")}/tmp/${id}/bottom.mp4`,
				(error) => {
					if (error) {
						reject(error);
						console.error(error);
					} else {
						console.log("Video cropped successfully");
						resolve("Video cropped successfully");
					}
				}
			);
		});
	};

	await convertVideo();

	console.log("done cutting into halves", id);

	return new Response("Success", { status: 200 });
}
