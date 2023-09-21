import ScannedNote from '../../src/models/ScannedNote';
import Task from '../../src/models/Task';

const mockedDate = new Date('2023-09-12T12:00:00');

jest.spyOn(global, 'Date').mockImplementation(() => mockedDate);

describe('ScannedNote', () => {
  describe('fromTextractResponse', () => {
    it('should filter non LINE block types', () => {
      const res = {
        Blocks: [
          { BlockType: 'LINE', Text: 'Line 1' },
          { BlockType: 'LINE', Text: 'Line 2' },
          { BlockType: 'WORD', Text: 'Line 3' },
        ],
      };

      const scannedNote = ScannedNote.fromTextractResponse(res);
      expect(scannedNote.text).toBe('Line 1\nLine 2');
    });

    it('should handle empty response gracefully', () => {
      const res = {
        Blocks: [],
      };

      const scannedNote = ScannedNote.fromTextractResponse(res);
      expect(scannedNote.text).toBe('');
    });
  });

  describe('splitText', () => {
    it('should return the text split by new lines', () => {
      const scannedNote = new ScannedNote({
        text: 'Hello\nMy\nName\nIs\nSlim\nShady'
      });
      expect(scannedNote.splitText).toEqual(['Hello', 'My', 'Name', 'Is', 'Slim', 'Shady']);
    });

    it('should trim whitespace from each line', () => {
      const scannedNote = new ScannedNote({
        text: 'Hello  \n My \n  Name  \nIs  \n Slim\nShady '
      });
      expect(scannedNote.splitText).toEqual(['Hello', 'My', 'Name', 'Is', 'Slim', 'Shady']);
    });
  });

  describe('fileName', () => {
    it('should return the file name when a line is found to start with title:', () => {
      const scannedNote = new ScannedNote({
        text: 'title: my file name\nMy\nName\nIs\nSlim\nShady'
      });
      expect(scannedNote.fileName).toEqual('my file name Tue Sep 12 2023');
    });

    it('should return the file name when a line is found to start with file name:', () => {
      const scannedNote = new ScannedNote({
        text: 'file name: my file name\nMy\nName\nIs\nSlim\nShady'
      });
      expect(scannedNote.fileName).toEqual('my file name Tue Sep 12 2023');
    });

    it('should find the file name even when case is upper', () => {
      const scannedNote = new ScannedNote({
        text: 'TITLE: my file name\nMy\nName\nIs\nSlim\nShady'
      });
      expect(scannedNote.fileName).toEqual('my file name Tue Sep 12 2023');
    });

    it('should strip the file name of all white space', () => {
      const scannedNote = new ScannedNote({
        text: 'TITLE:             my file name          \nMy\nName\nIs\nSlim\nShady'
      });
      expect(scannedNote.fileName).toEqual('my file name Tue Sep 12 2023');
    });

    it('should find the file name when the file name is in the middle of the text', () => {
      const scannedNote = new ScannedNote({
        text: 'Hello\n TITLE: my file name \nMy\nName\nIs\nSlim\nShady'
      });
      expect(scannedNote.fileName).toEqual('my file name Tue Sep 12 2023');
    });

    it('should return a default file name when no match is found', () => {
      const scannedNote = new ScannedNote({
        text: 'Hello\nMy\nName\nIs\nSlim\nShady'
      });
      expect(scannedNote.fileName).toEqual(expect.stringContaining('Tabs -'));
    });
  });

  describe('folder', () => {
    it('should return the folder when a line is found to start with folder:', () => {
      const scannedNote = new ScannedNote({
        text: 'folder: my folder\nMy\nName\nIs\nSlim\nShady'
      });
      expect(scannedNote.folder).toEqual('my folder');
    });

    it('should find the folder even when case is upper', () => {
      const scannedNote = new ScannedNote({
        text: 'FOLDER: my folder\nMy\nName\nIs\nSlim\nShady'
      });
      expect(scannedNote.folder).toEqual('my folder');
    });

    it('should strip the folder of all white space', () => {
      const scannedNote = new ScannedNote({
        text: 'folder:             my folder          \nMy\nName\nIs\nSlim\nShady'
      });
      expect(scannedNote.folder).toEqual('my folder');
    });

    it('should find the folder when the folder is in the middle of the text', () => {
      const scannedNote = new ScannedNote({
        text: 'Hello\n folder: my folder \nMy\nName\nIs\nSlim\nShady'
      });
      expect(scannedNote.folder).toEqual('my folder');
    });

    it('should return a default folder when no match is found', () => {
      const scannedNote = new ScannedNote({
        text: 'Hello\nMy\nName\nIs\nSlim\nShady'
      });
      expect(scannedNote.folder).toEqual('Unsorted');
    });
  });

  describe('tasks', () => {
    it('should return all tasks when lines are found to start with #', () => {
      const scannedNote = new ScannedNote({
        text: 'Hello\n# My @ 13/12/2023\nName\n# Is @ 12/12/2023\nSlim\nShady'
      });
      expect(scannedNote.tasks).toEqual([
        new Task({ name: 'My', dueDate: '13/12/2023' }),
        new Task({ name: 'Is', dueDate: '12/12/2023' }),
      ]);
    });

    it('should return an empty array when no lines are found to start with #', () => {
      const scannedNote = new ScannedNote({
        text: 'Hello\nMy @ 13/12/2023\nName\nIs @ 12/12/2023\nSlim\nShady'
      });
      expect(scannedNote.tasks).toEqual([]);
    });

    it('should return tasks with no due date when lines do not have @ token', () => {
      const scannedNote = new ScannedNote({
        text: 'Hello\n# My\nName\n# Is\nSlim\nShady'
      });
      expect(scannedNote.tasks).toEqual([
        new Task({ name: 'My' }),
        new Task({ name: 'Is' }),
      ]);
    });
  });
  
  describe('body', () => {
    it('should strip all tokens', () => {
      const scannedNote = new ScannedNote({
        text: `Title: My Title
        Folder: my/folder/notes
        # My @ 13/09/2023
        Name
        # Is @ 12/08/2021
        Slim
        Shady`
      });
      expect(scannedNote.body).toEqual('Name\nSlim\nShady')
    })
  })
});