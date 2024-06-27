import { server } from "@src/utils";

export async function parseJson(file: File) {
  const formData = new FormData();
  formData.append("files", file);

  try {
    const res = await fetch(server("/parse-json"), {
      method: "POST",
      body: formData,
    });

    const { data } = await res.json();

    return { data };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return { error: error.message };
    }

    console.error(error);
    return { error: "wtf is going on" };
  }
}
