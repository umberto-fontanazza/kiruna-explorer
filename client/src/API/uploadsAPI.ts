import { UploadType, UploadedFile } from "../utils/interfaces";
import { baseURL } from "./API";

async function getUploads(
  documentId: number,
  file?: string,
): Promise<UploadedFile[]> {
  const requestBody = { documentId: documentId, file: file };
  const response = await fetch(baseURL + `/uploads`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) {
    throw new Error("Error in fetching uploads");
  }
  const data: UploadedFile[] = await response.json();
  return data;
}

async function getOriginalResource(id: number) {
  const response = await fetch(baseURL + `/uploads/${id}`);
  if (!response.ok) {
    throw new Error("Error in fetching document original resource");
  }
  const { title, type, file } = await response.json();
  return { title, type, file };
}

async function uploadFile(
  documentsIds: number[],
  title: string,
  type: UploadType,
  file: any,
) {
  const requestBody = {
    title: title,
    type: type,
    file: file,
    documentsIds: documentsIds,
  };
  const response = await fetch(baseURL + `/uploads`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) {
    throw new Error("Error creating document");
  }
  const { id } = await response.json();
  return id;
}
