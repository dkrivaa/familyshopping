"use client";

import { cn } from "@/lib/utils";
import { useOptimistic, useState, useTransition } from "react";
import {
  updateName,
  toggleActive,
  toggleIsWeekly,
  updateQuantity,
  updateBarcode,
  deleteItem,
} from "@/app/actions/shoppinglist";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, ShoppingCart } from "lucide-react";
import { Input } from "../ui/input";
import QuantitySelect from "./quantitySelect";

type ShoppingItem = {
  id: number;
  product: string;
  quantity: number;
  barcode: number | null;
  active: boolean;
  isWeekly: boolean;
  createdAt: Date;
};

export default function DisplayList({ items }: { items: ShoppingItem[] }) {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // track which item's popover is open + form state per open popover
  const [openId, setOpenId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [bcode, setBcode] = useState<number | null>(null);
  const [active, setActive] = useState<boolean>(false);
  const [isWeekly, setIsWeekly] = useState<boolean>(false);

  const [newName, setNewName] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [newBarcode, setNewBarcode] = useState<number | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<boolean>(false);

  function openEdit(item: ShoppingItem) {
    setOpenId(item.id);
    setName(item.product);
    setBcode(item.barcode);
    setActive(item.active);
    setIsWeekly(item.isWeekly);

    setNewName(item.product);
    setNewQuantity(item.quantity);
    setNewBarcode(item.barcode);
  }

  // Remove item from active list (i.e item in cart)
  const [optimisticItems, removeItem] = useOptimistic(
    items,
    (state, id: number) => state.filter((item) => item.id !== id),
  );
  const [, startTransition] = useTransition();

  function handleInCart(item: ShoppingItem) {
    startTransition(async () => {
      removeItem(item.id);
      await toggleActive(item.id, false);
    });
  }

  // UPDATES
  // update name
  async function handleUpdateName() {
    if (!openId || !newName) return;
    await updateName(openId, newName);
    setNewName("");
    setDrawerOpen(false);
  }

  // Update quantity
  async function handleUpdateQuantity() {
    if (!openId || !newQuantity) return;
    await updateQuantity(openId, newQuantity);
    setNewQuantity(1);
    setDrawerOpen(false);
  }

  // Update barcode
  async function handleUpdateBarcode() {
    if (!openId || !newBarcode) return;
    await updateBarcode(openId, newBarcode);
    setNewBarcode(null);
    setDrawerOpen(false);
  }

  // Update active status
  async function handleToggleActive() {
    if (!openId) return;
    await toggleActive(openId, !active);
    setDrawerOpen(false);
  }

  // Update repeat weekly
  async function handleToggleWeekly() {
    if (!openId) return;
    await toggleIsWeekly(openId, !isWeekly);
    setDrawerOpen(false);
  }

  // Remove product
  async function handleDeleteItem() {
    if (!openId) return;
    await deleteItem(openId);
    setDeleteProduct(false);
    setDrawerOpen(false);
  }

  return (
    <Card className="flex flex-col w-full max-w-md gap-2">
      <h1 className="text-2xl mx-auto">Shopping List</h1>
      <ScrollArea className="h-[50vh] max-w-md">
        <div className="flex flex-col w-full gap-2">
          {items.map((item) => (
            <Field
              key={item.id}
              className="grid grid-cols-[4fr_1fr_1fr_1fr] w-full border-2 px-4 items-center"
            >
              <p className={item.active ? "font-semibold" : "text-gray-500"}>
                {item.product}
              </p>
              <p className={item.active ? "font-semibold" : "text-gray-500"}>
                {item.quantity}
              </p>

              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        "justify-center",
                        item.active ? "font-semibold" : "text-gray-500",
                      )}
                      onClick={() => openEdit(item)}
                    >
                      <Pencil />
                    </Button>
                  }
                ></DrawerTrigger>
                <DrawerContent className="items-center h-[80vh] w-full pt-4">
                  <DrawerHeader>
                    <DrawerTitle>{name}</DrawerTitle>
                    <DrawerDescription>Edit this product</DrawerDescription>
                  </DrawerHeader>
                  <div className="flex flex-col gap-8 mt-8">
                    <Field>
                      <FieldLabel htmlFor="Product">
                        Update product name
                      </FieldLabel>
                      <Input
                        id="product"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />
                      <Button onClick={handleUpdateName}>
                        update product name
                      </Button>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="quantity">
                        Update quantity
                      </FieldLabel>
                      <QuantitySelect
                        id="quantity"
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(e)}
                      />
                      <Button onClick={handleUpdateQuantity}>
                        update quantity
                      </Button>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="barcode">update barcode</FieldLabel>
                      <Input
                        id="barcode"
                        type="number"
                        inputMode="numeric"
                        value={String(bcode) ?? null}
                        onChange={(e) => setNewBarcode(Number(e.target.value))}
                      />
                      <Button onClick={handleUpdateBarcode}>
                        update barcode
                      </Button>
                    </Field>
                    <Field orientation="horizontal">
                      <FieldLabel htmlFor="active">Change Active</FieldLabel>
                      <Switch
                        id="active"
                        checked={active}
                        onCheckedChange={handleToggleActive}
                      />
                    </Field>
                    <Field orientation="horizontal">
                      <FieldLabel htmlFor="repeat">Repeat Weekly</FieldLabel>
                      <Switch
                        id="repeat"
                        checked={isWeekly}
                        onCheckedChange={handleToggleWeekly}
                      />
                    </Field>
                    <Field orientation="horizontal">
                      <FieldLabel htmlFor="remove">Remove product</FieldLabel>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setDeleteProduct(true);
                          handleDeleteItem();
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </Field>
                  </div>
                </DrawerContent>
              </Drawer>

              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "justify-center",
                  item.active ? "font-semibold" : "text-gray-500",
                )}
                onClick={() => handleInCart(item)}
              >
                <ShoppingCart />
              </Button>
            </Field>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
