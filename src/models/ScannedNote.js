import Task from './Task';

const FILE_NAME_TOKENS = ['title', 'file name'];
const FOLDER_TOKEN = 'folder';
const TASK_TOKEN = '#';

class ScannedNote {
  constructor(props) {
    this.text = props.text;
  }
  

  static fromTextractResponse(res) {
    const lines = res.Blocks
      .filter(r => r.BlockType === 'LINE')
      .map(b => b.Text);
    const text = lines.join('\n');
    return new ScannedNote({
      text,
    });
  }

  get splitText() {
    return this.text.split(/\r?\n/).map(a => a.trim());
  }

  get body() {
    return this.splitText.filter(s => !s.toLowerCase().startsWith(FILE_NAME_TOKENS[0]))
      .filter(s => !s.toLowerCase().startsWith(FILE_NAME_TOKENS[1]))
      .filter(s => !s.toLowerCase().startsWith(FOLDER_TOKEN))
      .filter(s => !s.startsWith(TASK_TOKEN))
      .join('\n');
  }

  get fileName() {
    const matchingLine = this.splitText.find(line => {
      const lower = line.toLowerCase();
      return lower.startsWith(FILE_NAME_TOKENS[0]) || lower.startsWith(FILE_NAME_TOKENS[1]);
    });
    if(!matchingLine) {
      return `Tabs - ${new Date().toUTCString()}`;
    }
    return matchingLine.match(/:\s*(.+)/)[1];
  }

  get folder() {
    const matchingLine = this.splitText.find(line => {
      const lower = line.toLowerCase();
      return lower.startsWith(FOLDER_TOKEN);
    });
    if(!matchingLine) {
      return 'Unsorted';
    }
    return matchingLine.match(/:\s*(.+)/)[1];
  }

  get tasks() {
    return this.splitText.map(line => {
      if(line.startsWith(TASK_TOKEN)) {
        return Task.fromScannedText(line)
      }
    }).filter(t => t);
  }
}

export default ScannedNote;