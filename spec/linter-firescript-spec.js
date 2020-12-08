'use babel';

import * as path from 'path';

const goodPath = path.join(__dirname, 'fixtures/success.fire');
const badPath = path.join(__dirname, 'fixtures/failed.fire');

describe('The jsonlint provider for Linter', () => {
  const { lint } = require('../lib/index.js').provideLinter();

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => Promise.all([
      atom.packages.activatePackage('linter-firescript'),
      atom.packages.activatePackage('language-firescript')
    ]));
  });

  describe('checks failing path and', () => {
    let editor = null;
    beforeEach(() => {
      waitsForPromise(() => atom.workspace.open(badPath).then((openEditor) => {
        editor = openEditor;
      }));
    });

    it('finds at least one message', () => {
      waitsForPromise(() => lint(editor).then((messages) => {
        expect(messages.length).toBeGreaterThan(0);
      }));
    });
  });

  it('finds nothing wrong with a valid file', () => {
    waitsForPromise(() => atom.workspace.open(goodPath).then((editor) => {
      lint(editor).then((messages) => {
        expect(messages.length).toEqual(0);
      });
    }));
  });
});
