"use client";

import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import QuantitySelect from "@/components/custom/quantitySelect";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";

const itemSchema = z.object({
  item: z.string().trim().min(1, "Product name is required"),
  weekly: z.boolean(),
  qty: z
    .number()
    .positive()
    .refine((val) => Number(val.toFixed(2)) === val),
  barcode: z.number().nullable,
});

interface NewItemProps {
  onSubmit: (
    product: string,
    active: boolean,
    isWeekly: boolean,
    quantity: number,
  ) => Promise<void>;
}

export default function NewItem({ onSubmit }: NewItemProps) {
  const [item, setItem] = useState<string>("");
  const [active, setActive] = useState<boolean>(true);
  const [weekly, setWeekly] = useState<boolean>(false);
  const [qty, setQty] = useState<number>(1);
  const [barcode, setBarcode] = useState<number>(0);

  const [error, setError] = useState<string | null>(null);

  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    // Validate data before submit
    const result = itemSchema.safeParse({
      item,
      weekly,
      qty,
      barcode,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    await onSubmit(
      result.data.item,
      active,
      result.data.weekly,
      result.data.qty,
    );

    setMessage(`Added ${result.data.item} to shoppinglist`);
    toast.success(`Added ${result.data.item} to shoppinglist`, {
      position: "top-center",
      icon: <ThumbsUp />,
    });

    setItem("");
    setWeekly(false);
    setQty(1);
    setBarcode(0);
  }

  return (
    <form
      className="flex flex-col w-full max-w-md justify-center items-center"
      onSubmit={handleSubmit}
    >
      <Card className="w-full px-4 my-4">
        <FieldSet>
          <FieldLegend>New Item</FieldLegend>
          <FieldDescription>Add new item to the shoppinglist</FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="product">Enter product</FieldLabel>
              <Input
                id="product"
                placeholder="Product"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                autoComplete="on"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
              <QuantitySelect id="quantity" value={qty} onChange={setQty} />
            </Field>
            <Field>
                <FieldLabel htmlFor="barcode">Barcode</FieldLabel>
                <Input 
                    id="barcode"
                    type="number"
                    value={barcode}
                    onChange={(e) => setBarcode(Number(e.target.value))}/>
            </Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="weekly">Repeat weekly</FieldLabel>
              <Switch
                id="weekly"
                checked={weekly}
                onCheckedChange={setWeekly}
              />
            </div>
          </FieldGroup>
          <Field>
            <Button type="submit">Submit</Button>
          </Field>
        </FieldSet>
      </Card>
    </form>
  );
}
