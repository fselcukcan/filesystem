import { get, set } from 'https://unpkg.com/idb-keyval@5.0.2/dist/esm/index.js';
import { verifyPermission } from "./filesystem-permissions.js";

export async function readFile() {
  let fileHandle // = await get('file')
  if (!fileHandle) {
    [fileHandle] = await window.showOpenFilePicker()
    // await set('file', fileHandle);
  }
  if (!(await verifyPermission(fileHandle, true))) {
    return
  }
  const file = await fileHandle.getFile()
  const text = await file.text()
  return text
}

export async function writeFile(data) {
  let fileHandle = await get('file')
  if (!fileHandle) {
    const options = {
      id: 'saveText',
      startIn: 'desktop',
      suggestedName: 'Untitled Text.txt',
      types: [
        {
          description: 'Text Files',
          accept: {
            'text/plain': ['.txt', '.org'],
          },
        },
      ],
    };
    [fileHandle] = await window.showSaveFilePicker(options)
    await set('file', fileHandle);
  }
  if (!(await verifyPermission(fileHandle, true))) {
    return
  }
  const writable = await fileHandle.createWritable();
  await writable.write(data);
  await writable.close();
  // const response = await fetch(url);
  // await response.body.pipeTo(writable);
  return fileHandle
}

export async function openDir() {
  const dirHandle = await window.showDirectoryPicker()
  for await (const entry of dirHandle.values()) {
    console.log(entry.kind, entry.name)
  }
  return dirHandle
}

export async function createNewFileHandleInDir(dirHandle, fileName, { create = true }) {
  const fileHandle = await dirHandle.getFileHandle(fileName, { create })
  return fileHandle
}

export async function createNewDirHandleInDir(dirHandle, dirName, { create = true }) {
  const newDirHandle = await dirHandle.getDirectoryHandle(dirName, { create })
  return newDirHandle
}

export async function removeFromDir(dirHandle, fileOrDirName, { recursive = false }) {
  return await dirHandle.removeEntry(fileOrDirName, { recursive })
}

// resolves the file handle to a file name array ["Documents", "my-document.org"]
export async function resolveFileHandleInDir(dirHandle, fileHandle) {
  const path = await dirHandle.resolve(fileHandle)
  return path
}