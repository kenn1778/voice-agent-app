declare module '@aws-sdk/client-cognito-identity' {
  export class CognitoIdentityClient {
    constructor(config: { region: string });
    send<T>(command: T): Promise<any>;
  }

  export class GetIdCommand {
    constructor(input: {
      IdentityPoolId: string;
      Logins?: Record<string, string>;
    });
  }

  export class GetCredentialsForIdentityCommand {
    constructor(input: {
      IdentityId: string;
      Logins?: Record<string, string>;
    });
  }
}