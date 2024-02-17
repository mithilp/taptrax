import { writeFile, mkdir } from "fs/promises";
import { redirect } from "next/navigation";
import { join } from "path";

export default function ServerUploadPage() {
	async function upload(data: FormData) {
		"use server";

		const id = Math.floor(100000 + Math.random() * 900000).toString();

		const file: File | null = data.get("file") as unknown as File;
		if (!file) {
			throw new Error("No file uploaded");
		}

		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		await mkdir(join("./", "tmp", id), { recursive: true });

		const path = join("./", "tmp", id, `input.mp4`);

		await writeFile(path, buffer);

		return redirect(`/${id}`);
	}

	return (
		<main>
			<h1>Upload Video</h1>
			<form action={upload}>
				<input type="file" accept="video/mp4" name="file" />
				<button type="submit">Upload</button>
			</form>
		</main>
	);
}
