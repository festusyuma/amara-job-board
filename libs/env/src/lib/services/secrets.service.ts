import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { Injectable } from '@nestjs/common';
import { z, ZodNever, ZodObject, ZodRawShape } from 'zod';

@Injectable()
export class SecretsService extends SecretsManagerClient {
  constructor() {
    super();
  }

  async loadSecret<T extends ZodObject<ZodRawShape> | ZodNever>(
    secretName: string,
    schema = z.never() as T
  ): Promise<z.infer<typeof schema>> {
    const secretsRes = await this.send(
      new GetSecretValueCommand({ SecretId: secretName })
    );

    return schema.parse(JSON.parse(secretsRes.SecretString ?? '{}'));
  }

  async loadSecrets(secretNames: (string | undefined)[]) {
    const parsedSecrets = {};
    const secretsPromise: Promise<unknown>[] = [];

    for (const secret in secretNames) {
      if (!secretNames[secret]) continue;

      secretsPromise.push(
        this.send(
          new GetSecretValueCommand({ SecretId: secretNames[secret] })
        ).then((res) => JSON.parse(res.SecretString ?? '{}'))
      );
    }

    const fetchedSecretsRes = await Promise.allSettled(secretsPromise);
    for (const secretRes of fetchedSecretsRes) {
      if (secretRes.status === 'fulfilled') {
        Object.assign(parsedSecrets, secretRes.value);
      } else {
        console.error(secretRes.reason);
      }
    }

    return parsedSecrets;
  }
}
