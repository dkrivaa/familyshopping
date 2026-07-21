import { db } from '@/db';
import { shoppinglist } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
  // Protect the endpoint so randoms on the internet can't trigger it
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await db
    .update(shoppinglist)
    .set({ active: true })
    .where(eq(shoppinglist.isWeekly, true));

  revalidatePath('/');

  return NextResponse.json({ success: true });
}