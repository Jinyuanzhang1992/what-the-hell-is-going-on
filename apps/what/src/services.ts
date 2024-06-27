const server = (path: string) => "http://localhost:3010" + path;

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

export async function addUsers(users: any) {
  try {
    const res = await fetch(server("/users"), {
      method: "POST",
      body: JSON.stringify(users),
      headers: {
        "Content-Type": "application/json",
      },
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

export async function combineParseJsonAndAddUsers(file: File) {
  const formData = new FormData();
  formData.append("files", file);

  try {
    const parsedJsonRes = await fetch(server("/parse-json"), {
      method: "POST",
      body: formData,
    });

    const { data } = await parsedJsonRes.json();
    const usersString = JSON.stringify(data);

    const res = await fetch(server("/users"), {
      method: "POST",
      body: usersString,
      headers: {
        "Content-Type": "application/json",
      },
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

export async function addUsersFromFile(file: File) {
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
