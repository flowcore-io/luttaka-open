import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import {tickets} from "@/database/schemas/tickets"; 

const queryClient = postgres(process.env.POSTGRES_URL!);

export const db = drizzle(queryClient, {
  schema: {
    tickets
  }
});
