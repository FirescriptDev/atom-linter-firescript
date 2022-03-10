'use babel';

import { FirescriptLinter } from 'firescript-linter';
import { FirescriptParser } from 'firescript-parser';

export function activate() {
  require('atom-package-deps').install('linter-firescript');
}

export function provideLinter() {
  const parser = new FirescriptParser();
  const linter = new FirescriptLinter();
  return {
    name: 'Firescript Linter',
    grammarScopes: ['source.fire'],
    scope: 'file',
    lintsOnChange: true,
    lint: (editor) => {
      const path = editor.getPath();
      const text = editor.getText();

      parser.filename = path;
      linter.filename = path;

      try {
        parser.parse(text);
        const fst = parser.parse(text);
        const res = linter.lint(fst);

        if (res.status === 'failed') {
          return Promise.resolve(res.exceptions.map((item) => ({
            severity: 'error',
            excerpt: item.message,
            location: {
              file: path,
              position: [
                [item.location[0] - 1, item.location[1] - 1],
                [item.location[2] - 1, item.location[3] - 1]
              ]
            }
          })));
        }
      } catch (err) {
        console.error('FirescriptLintError', err)
        const { message, line = 0, column = 0 } = err;

        return Promise.resolve([{
          severity: 'error',
          excerpt: message,
          location: {
            file: path,
            position: [
              [line - 1, column - 1],
              [line - 1, column]
            ]
          }
        }]);
      }

      return Promise.resolve([]);
    }
  };
}
