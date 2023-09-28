import Task from './Task';

class ScannedNote {
  constructor(props, FILE_NAME_TOKEN = 'file name', FOLDER_TOKEN = 'folder', TASK_TOKEN = '#', DUE_DATE_TOKEN = "@") {
    this.FILE_NAME_TOKEN = FILE_NAME_TOKEN.toLowerCase();
    this.FOLDER_TOKEN = FOLDER_TOKEN.toLowerCase();
    this.TASK_TOKEN = TASK_TOKEN.toLowerCase();
    this.DUE_DATE_TOKEN = DUE_DATE_TOKEN.toLowerCase();
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
    return this.splitText.filter(s => !s.toLowerCase().startsWith(this.FILE_NAME_TOKEN))
      .filter(s => !s.toLowerCase().startsWith(this.FOLDER_TOKEN))
      .filter(s => !s.startsWith(this.TASK_TOKEN))
      .join('\n');
  }

  get fileName() {
    const matchingLine = this.splitText.find(line => {
      const lower = line.toLowerCase();
      return lower.startsWith(this.FILE_NAME_TOKEN);
    });
    if (!matchingLine) {
      return `Tabs - ${new Date().toDateString()}`;
    }
    return `${matchingLine.match(/:\s*(.+)/)[1]} ${new Date().toDateString()}`;
  }

  get folder() {
    const matchingLine = this.splitText.find(line => {
      const lower = line.toLowerCase();
      return lower.startsWith(this.FOLDER_TOKEN);
    });
    if (!matchingLine) {
      return 'Unsorted';
    }
    return matchingLine.match(/:\s*(.+)/)[1];
  }

  get tasks() {
    return this.splitText.map(line => {
      if (line.startsWith(this.TASK_TOKEN)) {
        return Task.fromScannedText(line, this.TASK_TOKEN, this.DUE_DATE_TOKEN)
      }
    }).filter(t => t);
  }
}

export default ScannedNote;