import { openFileButton, saveFileButton, openDirButton, newFileButton, newDirButton, textarea } from "./gui.js";
import { readFile, writeFile } from "./filesystem.js";

openFileButton.addEventListener('click', showFileContent)
saveFileButton.addEventListener('click', () => writeFileContent(textarea.value))
openDirButton.addEventListener('click', openDir)
newFileButton.addEventListener('click', createNewFileHandleInDir)
newDirButton.addEventListener('click', createNewDirHandleInDir)

async function showFileContent() {
  const content = await readFile()
  textarea.value = content
}

async function writeFileContent(data) {
  await writeFile(data)
}
// file and directory handles are serializable; you can save them into IndexedDb or postMessage() between tabs or windows of same top-level origin; to remember last opened files when app is reopened, without showing a picker again.

async function openDir() {
  const dirHandle = await window.showDirectoryPicker()
  for await (const entry of dirHandle.values()) {
    console.log(entry.kind, entry.name)
  }
  return dirHandle
}

async function createNewFileHandleInDir(dirHandle, fileName, { create = true }) {
  const fileHandle = await dirHandle.getFileHandle(fileName, { create })
  return fileHandle
}

async function createNewDirHandleInDir(dirHandle, dirName, { create = true }) {
  const newDirHandle = await dirHandle.getDirectoryHandle(dirName, { create })
  return newDirHandle
}

async function removeFromDir(dirHandle, fileOrDirName, { recursive = false }) {
  return await dirHandle.removeEntry(fileOrDirName, { recursive })
}

// resolves the file handle to a file name array ["Documents", "my-document.org"]
async function resolveFileHandleInDir(dirHandle, fileHandle) {
  const path = await dirHandle.resolve(fileHandle)
  return path
}