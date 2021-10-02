import { openFileButton, saveFileButton, openDirButton, newFileButton, newDirButton, textarea } from "./gui.js";
import { readFile, writeFile, openDir, createNewFileHandleInDir, createNewDirHandleInDir } from "./filesystem.js";

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