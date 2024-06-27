"use client";
import {
  addUsers,
  addUsersFromFile,
  combineParseJsonAndAddUsers,
  parseJson,
} from "@src/services";
import { useState } from "react";

export default function Home() {
  const [serverResponse, setUploadedUsers] = useState(
    "Nothing from server yet"
  );

  const handleFileSubmit = async (file: File) => {
    const { data, error } = await addUsersFromFile(file);
    setUploadedUsers(JSON.stringify(data || error, null, 2));
  };

  const handle2StageFileSubmit = async (file: File) => {
    const { data, error } = await parseJson(file);

    if (data) {
      const { data: _data, error: _error } = await addUsers(data);

      if (_data) {
        setUploadedUsers(JSON.stringify(_data, null, 2));
      } else if (_error) {
        setUploadedUsers(JSON.stringify(_error, null, 2));
      }
    } else {
      console.error(error);
      setUploadedUsers(JSON.stringify(error, null, 2));
    }
  };

  const handle2StageFileSubmitIn1Fnc = async (file: File) => {
    const { data, error } = await combineParseJsonAndAddUsers(file);

    setUploadedUsers(JSON.stringify(data || error, null, 2));
  };

  return (
    <main className="flex min-h-screen px-24 py-36">
      <p className="fixed left-0 text-3xl font-black uppercase tracking-widest top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
        What the hell is going on
      </p>

      <div className="w-full flex flex-col gap-2">
        <UploadFileForm
          onSubmit={handleFileSubmit}
          on2StageSubmit={handle2StageFileSubmit}
          on2StageSubmitIn1Fnc={handle2StageFileSubmitIn1Fnc}
        />

        <div className="flex flex-col border border-neutral-50 rounded-md">
          <span className="p-2 border-b border-neutral-50">
            Server Response:
          </span>
          <pre className="p-2">{serverResponse}</pre>
        </div>
      </div>
    </main>
  );
}

function UploadFileForm(props: {
  onSubmit: (file: File) => void;
  on2StageSubmit: (file: File) => void;
  on2StageSubmitIn1Fnc: (file: File) => void;
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
        <div className="border-t border-neutral-50 p-2 flex justify-end gap-2">
          <button
            onClick={() => props.onSubmit(file)}
            className="border-2 border-neutral-50 rounded px-2 py-1 hover:bg-neutral-50 transition-colors hover:text-neutral-950"
          >
            Submit
          </button>

          <button
            onClick={() => props.on2StageSubmit(file)}
            className="border-2 border-neutral-50 rounded px-2 py-1 hover:bg-neutral-50 transition-colors hover:text-neutral-950"
          >
            2 Stage Submit
          </button>

          <button
            onClick={() => props.on2StageSubmitIn1Fnc(file)}
            className="border-2 border-neutral-50 rounded px-2 py-1 hover:bg-neutral-50 transition-colors hover:text-neutral-950"
          >
            2 Stage Submit In 1 Fnc
          </button>
        </div>
      )}
    </div>
  );
}
