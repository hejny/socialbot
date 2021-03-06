import { ConfigChecker } from 'configchecker';
import dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '..', '.env') });

const config = ConfigChecker.from(process.env);

export const PORT = config.get('PORT').number().default(9977).value;
export const TOKEN = config.get('TOKEN').value;

export const PUPPETEER_LAUNCH_OPTIONS = config.get('PUPPETEER_LAUNCH_OPTIONS').json().default({}).value;

export const FACEBOOK_COOKIES = config.get('FACEBOOK_COOKIES').json().asType<Record<string, string>>().required().value;
