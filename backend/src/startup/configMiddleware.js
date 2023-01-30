import path,{dirname}from "path"
import {fileURLToPath}from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const configMiddleware=(express,app)=>{
    app.use(express.json());
    app.use(express.urlencoded({extended:true}))
    app.use(express.static(path.join("public")))
}