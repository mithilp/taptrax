import { mkdir, writeFile } from "fs/promises";
import { NextRequest } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
	const bytes = await (await request.blob()).arrayBuffer();

	const id = Math.floor(100000 + Math.random() * 900000).toString();

	const buffer = Buffer.from(bytes);
	await mkdir(join("./", "tmp", id), { recursive: true });

	const path = join("./", "tmp", id, `input.mp4`);

	await writeFile(path, buffer);

	return new Response(id, { status: 200 });
}
