"use client";
import { useState } from "react";

const server = (path: string) => "http://localhost:3010" + path;

async function uploadFile2Stage(file: File) {
  const formData = new FormData();
  formData.append("files", file);

  try {
    const parseJsonRes = await fetch(server("/parse-json"), {
      method: "POST",
      body: formData,
    });

    const parsedJson = await parseJsonRes.json();

    const res = await fetch(server("/users"), {
      method: "POST",
      body: JSON.stringify(parsedJson),
    });

    return { data: await res.json() };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return { error: error.message };
    }

    console.error(error);
    return { error: "wtf is going on" };
  }
}

async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("files", file);

  try {
    const res = await fetch(server("/parse-users-json"), {
      method: "POST",
      body: formData,
    });

    return { data: await res.json() };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return { error: error.message };
    }

    console.error(error);
    return { error: "wtf is going on" };
  }
}

export default function Home() {
  const handleFileSubmit = async (file: File) => {
    const { data, error } = await uploadFile(file);
  };

  const handle2StageFileSubmit = async (file: File) => {
    const { data, error } = await uploadFile2Stage(file);
  };

  return (
    <main className="flex min-h-screen px-24 py-36">
      <p className="fixed left-0 text-3xl font-black uppercase tracking-widest top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
        What the hell is going on
      </p>

      <div className="w-full flex flex-col">
        <UploadFileForm
          onSubmit={handleFileSubmit}
          on2StageSubmit={handle2StageFileSubmit}
        />
      </div>
    </main>
  );
}

function UploadFileForm(props: {
  onSubmit: (file: File) => void;
  on2StageSubmit: (file: File) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("Nothing here yet");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = Array.from(e.target.files).filter(
      (file) => file.type === "text/csv" || file.type === "application/json"
    )[0];

    setFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;

      setPreview(content);
    };

    if (file.type === "text/csv" || file.type === "application/json") {
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col border border-neutral-50 rounded-md ">
      <input
        className="p-2 border-b border-neutral-50"
        type="file"
        onChange={handleFileUpload}
      />

      <pre className="p-4 h-64 overflow-y-auto">{preview}</pre>

      {file && (
        <div className="border-t border-neutral-50 p-2 flex">
          <button
            onClick={() => props.onSubmit(file)}
            className="ml-auto border-2 border-neutral-50 rounded px-2 py-1 hover:bg-neutral-50 transition-colors hover:text-neutral-950"
          >
            Submit
          </button>

          <button
            onClick={() => props.on2StageSubmit(file)}
            className="ml-auto border-2 border-neutral-50 rounded px-2 py-1 hover:bg-neutral-50 transition-colors hover:text-neutral-950"
          >
            2 Stage Submit
          </button>
        </div>
      )}
    </div>
  );
}
