declare module 'svgtofont/src/utils' {
    import { PathLike } from "fs";

    export const filterSvgFiles: (svgFolderPath: PathLike) => string[];
    export const createSVG: (OPTIONS: any) => Promise<{ [key: string]: string }>;
    export const createTTF: (OPTIONS: any) => Promise<any>;
    export const createEOT: (OPTIONS: any) => Promise<any>;
    export const createWOFF: (OPTIONS: any) => Promise<any>;
    export const createWOFF2: (OPTIONS: any) => Promise<any>;
    export const copyTemplate: (inDir: PathLike, outDir: PathLike, vars: any) => Promise<any>;
    export const createHTML: (options: any) => Promise<string>;
    export const createSvgSymbol: (OPTIONS: any) => Promise<any>;
}
