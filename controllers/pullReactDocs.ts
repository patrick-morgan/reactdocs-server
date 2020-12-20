import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';

import axios from 'axios';

import ReactReferenceParser from '../parsers/ReactReferenceParser';
import getDBConnection from '../db';

const reactReferenceUrl = "https://raw.githubusercontent.com/reactjs/reactjs.org/master/content/docs/reference-react.md";
const reactComponentReferenceUrl = "https://raw.githubusercontent.com/reactjs/reactjs.org/master/content/docs/reference-react-component.md";
const hooksReferenceUrl = "https://raw.githubusercontent.com/reactjs/reactjs.org/master/content/docs/hooks-reference.md";

(async () => {
  const urls = [reactReferenceUrl, reactComponentReferenceUrl, hooksReferenceUrl];

  // prepare db connection
  const db = await getDBConnection();

  const promises = [];

  for (const url of urls) {
    const data = await axios.get(url);
    const parser = new ReactReferenceParser(data.data);
    const components = parser.parse();
    promises.push(db.collection("docs").insertMany(components));
  }

  // wait for all file writes to finish
  await Promise.all(promises);
})();
