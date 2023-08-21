class Scan {
  constructor(props) {
    this.text = props.text;
    this.createdAt = props.createdAt;
  }

  static fromTextractResponse(res) {
    const lines = res.Blocks
      .filter(r => r.BlockType === 'LINE')
      .map(b => b.Text);
    const text = lines.join('\n');
    return new Scan({
      text,
      createdAt: new Date(),
    });
  }
}

export default Scan;