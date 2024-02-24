/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("node:fs/promises");

const sourcePath = "src";
const targetPath = "test";

async function mirror() {
    async function exists(f) {
        try {
            let a = await fs.stat(f);
            return a.isDirectory();
        } catch (err) {
            return false;
        }
    }

    // Certifique-se de que o diretório de destino exista
    if (!(await exists(targetPath))) {
        fs.mkdir(targetPath).catch(console.error);
    }

    const newReg = new RegExp(/\.(js|json|ts)$/i);

    fs.readdir(sourcePath)
        .then((files) => {
            const folders = files.filter((item) => !newReg.test(item));
            folders.forEach((items) => {
                fs.mkdir(`${targetPath}/${items}`)
                    .then(() => console.log("criado com sucesso as pasta: " + items))
                    .catch((err) => console.error(err));
            });
        })
        .catch(console.error);
}

mirror();
