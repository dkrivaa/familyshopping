"use server"

import { db } from "@/db";
import { shoppinglist } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

//Add item to shoppinglist
export async function addItem(product: string, active: boolean, isWeekly: boolean, quantity?: number) {
    
    await db.insert(shoppinglist).values({
        product,
        active: true,
        isWeekly,
        quantity,
    })

    revalidatePath("/")
}


// READ
export async function getItems() {
  return await db
    .select()
    .from(shoppinglist)
    .orderBy(desc(shoppinglist.active), shoppinglist.createdAt);
}


// UPDATE - update product name
export async function updateName(id: number, product: string) {
    await db
        .update(shoppinglist)
        .set( { product })
        .where(eq(shoppinglist.id, id))

    revalidatePath('/');
}


// UPDATE — toggle active/inactive (e.g. "bought" checkbox)
export async function toggleActive(id: number, active: boolean) {
  await db
    .update(shoppinglist)
    .set({ active })
    .where(eq(shoppinglist.id, id));

  revalidatePath('/');
}


// UPDATE — toggle isWeekly (e.g. turn active every tuesday)
export async function toggleIsWeekly(id: number, isWeekly: boolean) {
  await db
    .update(shoppinglist)
    .set({ isWeekly })
    .where(eq(shoppinglist.id, id));

  revalidatePath('/');
}


// UPDATE — edit quantity
export async function updateQuantity(id: number, quantity: number) {
  await db
    .update(shoppinglist)
    .set({ quantity })
    .where(eq(shoppinglist.id, id));

  revalidatePath('/');
}


// DELETE
export async function deleteItem(id: number) {
  await db.delete(shoppinglist).where(eq(shoppinglist.id, id));
  revalidatePath('/');
}

