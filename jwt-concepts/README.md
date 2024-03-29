# JWT Concepts
## What is JWT?
JWT (JSON Web Token) is a [token](https://en.wikipedia.org/wiki/Security_token) that is used to transfer information securely between two parties — a client and a server.

## Components
JWT (JSON Web Token) is just a string, composed of three parts: **Header, Payload, and Signature** like this.
```ts
// A string formatted as 'Header.Payload.Signature', where each part is Base64URL encoded.
const token: JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLWlkIiwiaWF0IjoxNTE2MjM5MDIyfQ.z-zWuZCZf5fmK1CHZHKWy9TWadrSPnTERk_aFS23A98';

const [header, payload, signature] = token.split('.');
```

1. **Header:** This is a Base64URL encoded JSON object that describes the type of token and the hashing algorithm used for its signature. Consider it the metadata of the token.
    ```ts
    const header = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
    const unencodedHeader = {
      "alg": "HS256",
      "typ": "JWT"
    }
    ```
2. **Payload:** Here's where the main data of the token lives, also known as claims. These claims can include stuff like who issued the token, when it expires, and some user info. It's also Base64URL encoded.
    ```ts
    const payload = 'eyJzdWIiOiJ1c2VyLWlkIiwiaWF0IjoxNTE2MjM5MDIyfQ';
    const unencodedPayload = {
      "sub": "user-id",
      "iat": 1516239022,
      "exp": 1516239322,
    }
    ```
3. **Signature:** The signature is all about keeping things secure. It's created by hashing the encoded header, encoded payload, and a secret or a public/private key pair together. This step ensures that the token hasn't been tampered with during transit. It's also Base64URL encoded.
   ```ts
   const signature = 'z-zWuZCZf5fmK1CHZHKWy9TWadrSPnTERk_aFS23A98';

   const isTokenVerified = verify(header, payload, signature, secretKeyOrPublicKey);
   ```
   
## JWT Header
The header represents the metadata of the token. The following metadata are standardly used:
1. `typ`: Indicates the type of the token, which is commonly "JWT". The use of uppercase letters is recommended for compatibility with legacy systems. The `typ` value is optional and not strictly necessary unless it is impossible to determine that the token is a JWT otherwise.
2. `alg`: Describes the hashing algorithm used for signing.

## JWT Payload
The main data of the token resides here, also known as claims. A claim refers simply to a key-value pair in the payload.
```ts
type ClaimKey = string;
type ClaimValue = any;
type Payload = Record<ClaimKey, ClaimValue>;
```
### Registered Claim
These are predefined claims defined by the JWT standard.
1. `iss` (Optional): Token Issuer.
2. `sub` (Optional): The title of the token, which must be unique in the context. A user ID is typically a good choice.
3. `aud` (Optional): Identifies the intended recipients of the JWT. This claim ensures that the JWT is used only by the intended parties. If the JWT's "aud" claim does not match the identifier of the service, that service must reject the JWT. For example, if "AuthService" issues the following token
    ```ts
    {
      header: {...}
      payload: {
        "aud": "PhotoService",
        ...
      }
    }    
    ```
    then services other than "PhotoService" should reject this token.
4. `exp` (Optional): Represents the expiration time of the token. Expired tokens must be rejected. Only NumericDate values (seconds elapsed since Unix Epoch Time) are accepted.
5. `nbf` (Optional): This claim accepts only NumericDate values and can be seen as the activation date. The token can only be used after this date; otherwise, it should be rejected.
6. `iat` (Optional): Indicates the issue date using NumericDate.
7. `jti` (Optional): A claim for storing the JWT ID. It provides a unique identifier for the token itself when needed.



## JWT Signature
JWT signatures are used to verify the integrity of the header and payload, ensuring they have not been tampered with during transmission. This process allows for the validation of the token's integrity and the authenticity of the sender, thereby guaranteeing the token's reliability. The cryptographic algorithm used in this process is specified in the JWT header's alg field.

### Signing
To ensure the integrity of the header and payload, JWT combines hash algorithms with cryptographic algorithms.

1. **Hash Creation::** First, the JWT's header (Header) and payload (Payload) are combined, and then a hash function is applied according to the specified cryptographic algorithm (defined in the alg field) to generate a hash value. This hash value acts as a summary of the data, with even minor changes in the original data causing significant changes in the hash value.
2. **Encryption:**  The generated hash value is then encrypted using the user's secret key (in the case of symmetric encryption) or private key (in the case of asymmetric encryption). The outcome of this process forms the signature (Signature) part of the JWT.

### Principles and Pitfalls of Integrity Assurance
The principle of integrity assurance with hash functions lies in the fact that even minor changes to the original data result in significantly different output values. Token recipients generate a hash value from the JWT's header and payload and then compare it with the received signature for verification. In the case of asymmetric encryption, the sender's public key is used for this verification process. If the hash values match, it indicates that the data has not been tampered with. If they do not match, it is assumed that the data has been altered or the sender's identity is not valid.

It's crucial to understand that this process does not encrypt the header and payload. It is merely a procedure to ensure that they have not been manipulated, and they are still transmitted in a simple Base64URL encoded form. This means that if sensitive information is included, anyone can decode the encoded data. To achieve token-level security, Json Web Encryption (JWE) should be used to encrypt the payload.

### HS256 and RS256
When generating JWT signatures, HS256 and RS256 are among the most commonly used cryptographic algorithms.

- HS256: HMAC using SHA-256 is an algorithm that employs symmetric key encryption. In this method, a single secret key is used to encrypt and sign the message. The SHA-256 hash algorithm generates a hash value of the message, which is then combined with the secret key to produce an authentication code. This code is transmitted along with the message, and the recipient can verify the message's integrity and authenticity by regenerating the authentication code using the same secret key and comparing it to the received code. HS256 offers the advantages of simplicity, fast processing speeds, and robust security. However, careful key management is required as security can be compromised if the key is leaked.

- RS256: RSASSA-PKCS1-v1_5 using SHA-256 uses an asymmetric key encryption method. This method employs a private key to generate the message's signature and a public key for its verification. The SHA-256 hash algorithm is used to generate a hash value of the message, which is then signed with the private key. The recipient can verify the signature using the public key, thus confirming the message's integrity and the sender's authenticity. RS256 provides strong security through the use of Public Key Infrastructure (PKI) and relatively easier key management. However, it may have slower processing speeds compared to symmetric key encryption methods.

Generally, HS256 and RS256 are widely used JWT signature algorithms. In practical services, a specific algorithm should be selected considering security, performance, and flexibility. HS256, being a symmetric key algorithm, is simple and fast and may be suitable for secure communication within internal systems. On the other hand, RS256, utilizing asymmetric key encryption and Public Key Infrastructure, may be more appropriate for public APIs or authentication between services.

### The Details of Cryptographic Algorithms
The actual implementation of cryptographic algorithms involves considerable complexity and isn't crucial for grasping the concept of JWT. For most scenarios, particularly outside of commercial projects demanding bespoke cryptographic solutions, relying on established and verified libraries suffices. For example, the Node.js runtime, crafted in C++, uses [OpenSSL](https://www.openssl.org/) for its standard [crypto](https://nodejs.org/api/crypto.html) library. Due to these reasons, we do not implement cryptographic algorithms ourselves.
