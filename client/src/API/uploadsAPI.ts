import { Upload, UploadType } from "../utils/interfaces";
import { baseURL } from "./API";

async function getUploads(
  documentId?: number,
  file?: string,
): Promise<Upload[]> {
  const params = new URLSearchParams();
  if (documentId !== undefined) {
    params.append("documentId", documentId.toString());
  }
  if (file) params.append("file", file);
  const response = await fetch(baseURL + `/uploads?` + params.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Error in fetching uploads");
  }
  const data: Upload[] = await response.json();
  return data;
}

async function getUploadById(uploadId: number): Promise<Upload> {
  const response = await fetch(baseURL + `/uploads/${uploadId}`);
  if (!response.ok) {
    throw new Error("Error in fetching upload by id");
  }

  const {
    id,
    title,
    type,
    file,
  }: { id: number; title: string; type: UploadType; file: string } =
    await response.json();

  return {
    id,
    title,
    type,
    file,
  };
}

async function getBindedDocuments(uploadId: number): Promise<number[]> {
  const queryParams = "?bindedDocumentIds=include";
  const response = await fetch(baseURL + `/uploads/${uploadId}${queryParams}`);
  if (!response.ok) {
    throw new Error("Error in fetching binded documents");
  }
  const res = await response.json();
  console.log(res);
  return res.bindedDocumentIds;
}

async function addUpload(
  title: string,
  type: UploadType,
  file: string,
  documentsIds?: number[],
): Promise<number> {
  const requestBody = {
    title: title,
    type: type,
    documentIds: documentsIds,
    file: file,
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
    throw new Error("Error creating upload");
  }
  const { id } = await response.json();
  return id;
}

async function editUpload(
  uploadId: number,
  title?: string,
  bindDocumentIds?: number[],
  decoupleDocumentIds?: number[],
): Promise<void> {
  const requestBody = { title, bindDocumentIds, decoupleDocumentIds };
  const response = await fetch(baseURL + `/uploads/${uploadId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) {
    throw new Error("Error creating upload");
  }
}

export const updateUploadLinks = async (
  id: number,
  bindDocumentIds?: number[],
  decoupleDocumentIds?: number[],
): Promise<void> => {
  try {
    const requestBody = { bindDocumentIds, decoupleDocumentIds };
    const response = await fetch(baseURL + `/uploads/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      throw new Error("Error linking documents to upload");
    }
  } catch (error) {
    throw new Error("Error linking documents to upload: " + error);
  }
};

async function deleteUpload(uploadId: number): Promise<void> {
  const response = await fetch(baseURL + `/uploads/${uploadId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Something went wrong deleting the Upload file");
  }
}

export const uploadAPI = {
  getUploads,
  getUploadById,
  getBindedDocuments,
  addUpload,
  editUpload,
  deleteUpload,
  updateUploadLinks,
};
