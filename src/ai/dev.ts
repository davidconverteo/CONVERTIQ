import { config } from 'dotenv';
config();

import '@/ai/flows/generate-marketing-image-from-prompt.ts';
import '@/ai/flows/create-prompt-from-file-upload.ts';
import '@/ai/flows/adapt-creative-content-for-platform.ts';
import '@/ai/flows/chatbot-flow.ts';
