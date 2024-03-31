import { encodeBase64Url } from './encode-base64-url';

describe('encodeBase64Url', () => {
  it('should correctly encode a simple object to a Base64URL string', () => {
    const obj = { hello: 'world' };
    const encoded = encodeBase64Url(obj);
    const expected = Buffer.from(JSON.stringify(obj)).toString('base64url');
    expect(encoded).toBe(expected);
  });

  it('should correctly encode a complex nested object', () => {
    const obj = {
      user: {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        roles: ['admin', 'user'],
        profile: {
          age: 30,
          interests: ['coding', 'reading'],
        },
      },
    };
    const encoded = encodeBase64Url(obj);
    const expected = Buffer.from(JSON.stringify(obj)).toString('base64url');
    expect(encoded).toBe(expected);
  });

  it('should correctly encode special characters within string values', () => {
    const obj = { message: '¡Hola, Mundo! ¿Cómo estás?' };
    const encoded = encodeBase64Url(obj);
    const expected = Buffer.from(JSON.stringify(obj)).toString('base64url');
    expect(encoded).toBe(expected);
  });
});
