const DocumentService = require('../services/document.service');

describe('DocumentService', () => {
  let documentService;
  
  beforeEach(() => {
    documentService = new DocumentService();
  });
  
  describe('_ensureDirectoryExists', () => {
    it('should create directory if it does not exist', async () => {
      // Mock fs.mkdir
      const mockMkdir = jest.fn().mockResolvedValue(undefined);
      documentService._ensureDirectoryExists = jest.fn().mockImplementation(async (directory) => {
        return mockMkdir(directory, { recursive: true });
      });
      
      await documentService._ensureDirectoryExists('test-dir');
      expect(mockMkdir).toHaveBeenCalledWith('test-dir', { recursive: true });
    });
    
    it('should handle EEXIST error', async () => {
      // Mock fs.mkdir with EEXIST error
      const mockError = { code: 'EEXIST' };
      const mockMkdir = jest.fn().mockRejectedValue(mockError);
      documentService._ensureDirectoryExists = jest.fn().mockImplementation(async (directory) => {
        try {
          return await mockMkdir(directory, { recursive: true });
        } catch (error) {
          if (error.code !== 'EEXIST') {
            throw error;
          }
        }
      });
      
      await expect(documentService._ensureDirectoryExists('test-dir')).resolves.not.toThrow();
      expect(mockMkdir).toHaveBeenCalledWith('test-dir', { recursive: true });
    });
  });
  
  describe('_saveFile', () => {
    it('should save file correctly', async () => {
      // Mock file streams
      const mockReadStream = {
        pipe: jest.fn(),
        on: jest.fn().mockImplementation((event, callback) => {
          return mockReadStream;
        })
      };
      
      const mockWriteStream = {
        on: jest.fn().mockImplementation((event, callback) => {
          if (event === 'finish') {
            callback();
          }
          return mockWriteStream;
        })
      };
      
      // Mock fs functions
      const mockCreateReadStream = jest.fn().mockReturnValue(mockReadStream);
      const mockCreateWriteStream = jest.fn().mockReturnValue(mockWriteStream);
      
      // Replace fs functions with mocks
      const fs = require('fs');
      const originalCreateReadStream = fs.createReadStream;
      const originalCreateWriteStream = fs.createWriteStream;
      fs.createReadStream = mockCreateReadStream;
      fs.createWriteStream = mockCreateWriteStream;
      
      // Test _saveFile
      await documentService._saveFile('source.txt', 'destination.txt');
      
      // Restore original fs functions
      fs.createReadStream = originalCreateReadStream;
      fs.createWriteStream = originalCreateWriteStream;
      
      // Assertions
      expect(mockCreateReadStream).toHaveBeenCalledWith('source.txt');
      expect(mockCreateWriteStream).toHaveBeenCalledWith('destination.txt');
      expect(mockReadStream.pipe).toHaveBeenCalledWith(mockWriteStream);
    });
  });
  
  describe('_deleteFile', () => {
    it('should delete file correctly', async () => {
      // Mock fs.unlink
      const mockUnlink = jest.fn().mockResolvedValue(undefined);
      documentService._deleteFile = jest.fn().mockImplementation(async (filePath) => {
        return mockUnlink(filePath);
      });
      
      await documentService._deleteFile('test-file.txt');
      expect(mockUnlink).toHaveBeenCalledWith('test-file.txt');
    });
    
    it('should handle ENOENT error', async () => {
      // Mock fs.unlink with ENOENT error
      const mockError = { code: 'ENOENT' };
      const mockUnlink = jest.fn().mockRejectedValue(mockError);
      documentService._deleteFile = jest.fn().mockImplementation(async (filePath) => {
        try {
          return await mockUnlink(filePath);
        } catch (error) {
          if (error.code !== 'ENOENT') {
            throw error;
          }
        }
      });
      
      await expect(documentService._deleteFile('test-file.txt')).resolves.not.toThrow();
      expect(mockUnlink).toHaveBeenCalledWith('test-file.txt');
    });
  });
});
