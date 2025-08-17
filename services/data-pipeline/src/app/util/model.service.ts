import { EnvService } from '@amara/helpers/util';
import { GoogleGenAI } from '@google/genai';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ModelService {
  private ai: GoogleGenAI;

  constructor(private env: EnvService) {
    this.ai = new GoogleGenAI({
      apiKey: this.env.get('GEMINI_KEY'),
    });
  }

  async generateJson<T>(content: string) {
    const res = await this.ai.models.generateContent({
      contents: content,
      model: 'gemini-2.5-flash-lite',
    });

    Logger.log(res);

    const text = res.text;
    if (!text) throw new Error('unable to generate');

    const jsonString = res.text.replace(/```json\n|\n```/g, '').trim();
    return JSON.parse(jsonString) as T;
  }

  async generateText(content: string | string[]) {
    const res = await this.ai.models.generateContent({
      contents: content,
      model: 'gemini-2.5-flash-lite',
    });

    Logger.log(res);

    const text = res.text;
    if (!text) throw new Error('unable to generate');

    return res.text.trim();
  }
}
