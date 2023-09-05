import { it, expect, describe } from '@jest/globals'
import Scan from '../../src/models/Scan';

describe('Scan', () => {
  describe('fromTextractResponse', () => {
    it('should filter non LINE block types', () => {
      const res = {
        Blocks: [
          { BlockType: 'LINE', Text: 'Line 1' },
          { BlockType: 'LINE', Text: 'Line 2' },
          { BlockType: 'WORD', Text: 'Line 3' },
        ],
      };

      const scan = Scan.fromTextractResponse(res);
      expect(scan.text).toBe('Line 1\nLine 2');
    });

    it('should handle empty response gracefully', () => {
      const res = {
        Blocks: [],
      };

      const scan = Scan.fromTextractResponse(res);
      expect(scan.text).toBe('');
    });
  });
});