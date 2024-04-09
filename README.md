# JWT Insights
Welcome to jwt-insights! This repository is dedicated to providing a deep understanding of JSON Web Tokens (JWT) and JWT Auth, along with a hands-on guide to implementing JWT generation/verification algorithms and auth process without relying on third-party libraries.

## About
**JWT** is a compact, URL-safe means of representing pieces of informations to be transferred securely between two parties — a client and a server.   

Understanding how JWT works and implementing JWT Auth mechanism from scratch can greatly enhance your knowledge of web security and auth processes.

## Table of Contents
1. [`jwt-concepts`](./jwt-concepts/README.md): An explanation of the JWT (JSON Web Tokens) concept as outlined in the [RFC 7519](https://datatracker.ietf.org/doc/html/rfc7519) standard.
2. [`jwt-impl`](./jwt-impl): Details the implementation of JWT generation and verification algorithms, including a step-by-step guide.
   - [`sign`](./jwt-impl/src/jwt/sign.ts): Code for generating a JSON Web Token.
   - [`verify`](./jwt-impl/src/jwt/verify.ts): Code for verifying the validity of a token.
   - A guide to implementing JWT signing and verification algorithms is currently being developed. 
3. [`appendix`](./appendix): Appendix.

Although a detailed guide for implementing JWT signing and verification has not been prepared yet, if you have a good understanding of the concepts from [`jwt-concepts`](./jwt-concepts/README.md), you should be able to grasp the workflow using the provided functions.

## From JWT to OAuth 2.0: Access and Refresh Token 

If you're seeking details on Access Tokens or Refresh Tokens within this document, it may come as a surprise that the JWT standard itself doesn't delve into these areas. These tokens are fundamental to the OAuth 2.0 specification, which uses JWTs for specific purposes but also introduces Access Tokens and Refresh Tokens for authorization and session management.

I'm in the process of preparing a new section, auth-insights, dedicated to explaining the concepts and implementation methods associated with the OAuth 2.0 specification. However, since this section is still under development, I encourage you to seek out external resources for immediate information. This upcoming guide will be designed to provide you with a thorough understanding of these crucial authentication and authorization protocols, expanding your knowledge beyond just JWTs.

## Contributing
Contributions to this repository are welcome! Whether it's enhancing the documentation, improving the code examples, or fixing bugs, your help is appreciated. Please feel free to fork the repository and submit pull requests.