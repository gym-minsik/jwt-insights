# jwt-impl
JWT 생성/검증 알고리즘 구현체와 해당 구현체를 직접 구현해보는 과정을 기술합니다.

## Modeling: Base64URL
먼저 우리가 구현해야할 것은 object -> Base64URL 인코딩연산과 Base64URL -> object 디코딩 연산입니다. 이는 Node.js 표준 라이브러리가 제공하므로 매우 쉽게 구현할 수 있습니다.
1. `object`를 Base64URL 형태로 인코딩하는 함수  
해당 함수는 `object`를 먼저 JSON 문자열 형태로 변환합니다. Javascript 문자열은 UTF-16 인코딩을 갖고 있는데 좀 더 호환성이 높은 utf-8로 인코딩환 후 Base64URL로 인코딩합니다.
    ```ts
    export function encodeBase64Url(target: object) {
      const str = JSON.stringify(target);

      return Buffer.from(str, 'utf8').toString('base64url');
    }
    ```
2. Base64URL로 인코딩된 문자열을 Javascript 문자열로 디코딩하는 함수  
해당 함수는 Base64URL를 디코딩하여 UTF-8 문자열을 획득한 후 Javascript 문자열인 UTF-16으로 인코딩하는 과정을 수행합니다.
    ```ts
    export function decodeBase64Url(str: string) {
      return Buffer.from(str, 'base64url').toString('utf8');
    }
    ```
### 왜 중간에 UTF-8로 인코딩 하나요?
1. **더 높은 호환성**: UTF-8은 웹과 인터넷 표준에서 가장 널리 지원되는 인코딩 방식입니다. 인터넷 상의 대부분 데이터와 프로토콜이 UTF-8 인코딩을 기본으로 사용하기 때문에, UTF-8로 인코딩된 데이터는 거의 모든 웹 브라우저와 서버, API 간에 문제 없이 교환될 수 있습니다. 반면, UTF-16은 특정 애플리케이션에서는 널리 사용되지만, 웹 전송과 관련하여 UTF-8만큼의 광범위한 호환성을 제공하지 않습니다.

2. **효율적인 스토리지**: UTF-8은 ASCII 문자에 대해 1바이트만 사용하여, 영어와 같은 ASCII 기반 텍스트의 저장 공간을 매우 효율적으로 사용합니다. 대다수의 인터넷 데이터가 영어로 이루어져 있기 때문에, UTF-8은 네트워크 전송과 데이터 저장 측면에서 상대적으로 효율적입니다. UTF-16은 모든 문자에 대해 최소 2바이트를 사용하기 때문에, ASCII 문자를 저장할 때 더 많은 공간을 차지합니다.

데이터 전송의 효율성, 그리고 보편적인 호환성 측면에서는 UTF-8이 더 우세한 선택입니다. 위의 함수 구현에서도 봤듯이 UTF-8로 인코딩된 문자열은 각 언어가 사용하는 인코딩에 맞게 변환하면 됩니다. 만약 UTF-8을 기본 인코딩으로 사용하는 언어라면 해당 변환 과정이 필요없습니다.
따라서, 웹 기반 애플리케이션과 데이터 교환에서 UTF-8 인코딩을 선호하는 것이 일반적입니다. 

## Modeling: Cryptographic
우리가 JWT 생성/검증시 사용할 알고리즘은 HS256과 RS256 총 2개가 있습니다. 

### HS256
HS256은 SHA-256 해시 알고리즘을 활용한 HMAC(Hash-based Message Authentication Code) 암호화된 서명 생성 및 검증 알고리즘입니다. 자연어라 어려운데 기계어인 코드로 표현 하면:
1. 서명 (sign)  
무결성이 보장되어야하는 `message`를 위한 Authentication Code를 생성합니다. 여기서 주의점은 `message`를 암호화하지 않는다는 것입니다. 생성된 인증 코드는 `message`가 조작되었는지 확인하는 용도로만 사용됩니다.
    ```ts
    function signHS256(
      message: string;
      key: string;
    ): string {
      const hashedMessage = hashUsingSHA256(message);
      return generateMAC(hashedMessage, key);
    }

    const messageAuthenticationCode = signHS256('I love you.', 'secret-key');
    ```
2. 검증 (verify)  
Authentication Code를 이용해 `message`의 무결성을 검증합니다.
    ```ts
    function verifyHS256(
      message: string;
      key: string;
      messageAuthenticationCode: string
    ): boolean {
      return messageAuthenticationCode === signHS256(message, key);
    }

    verifyHS256('I love you', 'key', signHS256('I love you', 'key')) // true
    ```

