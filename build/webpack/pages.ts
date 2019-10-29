import * as glob from 'glob';
import * as path from 'path';
import * as HtmlPlugin from 'html-webpack-plugin';


const pages = new Array<string>();

const entries = new Object();
const htmls = new Array<HtmlPlugin>();

entries['main'] = path.resolve(`./src/main.js`);

htmls.push(
    new HtmlPlugin({
        filename: 'index.html',
        showErrors: true,
        excludeChunks: pages
    })
)



export default {
    entries,
    htmls
}

