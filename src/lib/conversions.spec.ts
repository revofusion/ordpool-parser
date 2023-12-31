import { OP_FALSE, OP_IF, OP_PUSHBYTES_3 } from '../inscription-parser.service.helper';
import {
  binaryStringToBase64,
  byteArrayToHex,
  hexToUint8Array,
  uint8ArrayToSingleByteChars,
  utf16StringToUint8Array,
  utf8BytesToUtf16String,
} from './conversions';

describe('Base64 encoding and decoding', () => {

  it('binaryStringToBase64 should correctly encode a basic ASCII string', () => {
    const input = 'Hello World';
    const expectedOutput = 'SGVsbG8gV29ybGQ='; // Base64 encoded string of 'Hello World'
    expect(binaryStringToBase64(input)).toEqual(expectedOutput);
  });

  it('binaryStringToBase64 should correctly encode an UTF-8 encoded string containing special characters', () => {
    const utf8String = 'obð¤cpfp';
    const expectedOutput = 'b2Lwn6SdY3BmcA==';
    expect(binaryStringToBase64(utf8String)).toEqual(expectedOutput);
  });

});

describe('Conversions between UTF-8 encoded data and UTF-16 encoded strings', () => {

  it('uint8ArrayToSingleByteChars should return the expected UTF-8 encoded string', () => {

    // UTF-8 Encoding: UTF-8 is a variable-length encoding system for Unicode,
    // capable of representing every character in the Unicode character set.
    // It uses one to four 8-bit bytes.
    const utf8EncodedBytes = new Uint8Array([111, 98, 240, 159, 164, 157, 99, 112, 102, 112]); //  'ob🤝cpfp';

    // Convert Uint8Array to a 'binary' string
    const utf8String: string = uint8ArrayToSingleByteChars(utf8EncodedBytes);

    expect(utf8String).toEqual('obð¤cpfp');
  });

  it('a conversion from UTF-16 to UTF-8 is really what I think it is', () => {

    // UTF-16 Encoding: JavaScript strings are internally represented in UTF-16,
    // where each character can be either 1 or 2 code units (16 bits each).
    const input = 'ob🤝cpfp';

    // UTF-8 Encoding: UTF-8 is a variable-length encoding system for Unicode,
    // capable of representing every character in the Unicode character set.
    // It uses one to four 8-bit bytes.
    const binaryData = utf16StringToUint8Array(input);
    expect(binaryData).toEqual(new Uint8Array([111, 98, 240, 159, 164, 157, 99, 112, 102, 112]));
  });

  it('utf8BytesToUtf16String decodes back to UTF-16', () => {

    // UTF-8 Encoding: UTF-8 is a variable-length encoding system for Unicode,
    // capable of representing every character in the Unicode character set.
    // It uses one to four 8-bit bytes.
    const binaryData = new Uint8Array([111, 98, 240, 159, 164, 157, 99, 112, 102, 112]);

    // Convert Uint8Array to a binary string
    const normalUtf16String = utf8BytesToUtf16String(binaryData);

    expect(normalUtf16String).toEqual('ob🤝cpfp');
  });
});

describe('hexToUint8Array', () => {

  it('should convert a simple hex string to an Uint8Array', () => {
    const orangeColorFromBitcoinLogo = 'ff9900';
    const result = hexToUint8Array(orangeColorFromBitcoinLogo);
    expect(result).toEqual(new Uint8Array([255, 153, 0])); // RGB (255, 153, 0)
  });

  it('should convert the inscriptionMark 0063036f7264 hex string to an Uint8Array', () => {
    const hexString = '0063036f7264';
    const result = hexToUint8Array(hexString);
    expect(result).toEqual(new Uint8Array([OP_FALSE, OP_IF, OP_PUSHBYTES_3, 0x6f, 0x72, 0x64]));
  });

  it('should throw an error for an empty string', () => {
    const hexString = '';
    expect(() => hexToUint8Array(hexString)).toThrow('Input string is empty. Hex string expected.');
  });
});

describe('byteArrayToHex', () => {

  it('should correctly convert a byte array to a hexadecimal string', () => {
    const byteArray = new Uint8Array([0x01, 0xAB, 0x3F]);
    const expectedHex = '01ab3f';
    expect(byteArrayToHex(byteArray)).toEqual(expectedHex);
  });

  it('should correctly convert a byte array with the inscription mark to a hexadecimal string', () => {
    const byteArray = new Uint8Array([OP_FALSE, OP_IF, OP_PUSHBYTES_3, 0x6f, 0x72, 0x64]);
    const expectedHex = '0063036f7264';
    expect(byteArrayToHex(byteArray)).toEqual(expectedHex);
  });

  it('should handle an empty byte array', () => {
    const byteArray = new Uint8Array([]);
    const expectedHex = '';
    expect(byteArrayToHex(byteArray)).toEqual(expectedHex);
  });

  it('should handle a single byte correctly', () => {
    const byteArray = new Uint8Array([0x00]);
    const expectedHex = '00';
    expect(byteArrayToHex(byteArray)).toEqual(expectedHex);
  });

  it('should pad single digit hex values with a leading zero', () => {
    const byteArray = new Uint8Array([0x1, 0x2, 0xA]);
    const expectedHex = '01020a';
    expect(byteArrayToHex(byteArray)).toEqual(expectedHex);
  });

  // Additional tests can be added here, for example, testing with larger arrays.
});
