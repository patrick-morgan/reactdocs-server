import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';

import axios from 'axios';

import ReactReferenceParser from '../parsers/ReactReferenceParser';

const reactReferenceUrl = "https://raw.githubusercontent.com/reactjs/reactjs.org/master/content/docs/reference-react.md";
const reactComponentReferenceUrl = "https://raw.githubusercontent.com/reactjs/reactjs.org/master/content/docs/reference-react-component.md";
const hooksReferenceUrl = "https://raw.githubusercontent.com/reactjs/reactjs.org/master/content/docs/hooks-reference.md";

(async () => {
  const urls = [reactReferenceUrl, reactComponentReferenceUrl, hooksReferenceUrl];

  // prepare directory
  const dirPath = `${__dirname}/../../docs`;
  const dirExists = existsSync(dirPath);
  if (!dirExists) {
    await mkdir(dirPath);
  }

  const promises = [];

  for (const url of urls) {
    const data = await axios.get(url);
    const parser = new ReactReferenceParser(data.data);
    const components = parser.parse();
    for (const component of components) {
      const json = JSON.stringify(component, null, 2);
      const filename = component.name;
      promises.push(writeFile(`${dirPath}/${filename}.json`, json));
    }
  }

  // wait for all file writes to finish
  await Promise.all(promises);
})();
