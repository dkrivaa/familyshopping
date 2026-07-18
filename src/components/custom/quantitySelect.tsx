"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

interface QuantitySelectProps {
    id: string,
    value: number
    onChange: (value: number) => void
}

export default function QuantitySelect({ id, value, onChange }: QuantitySelectProps) {
    
    const isAtMin = value <= 0

    function adjustQuantity(delta: number) {
        onChange(Math.max(1, value + delta)) // clamp at 1 instead of 0/empty
    }

    return (
        <div className="flex items-center gap-1">
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => adjustQuantity(-1)}
                disabled={isAtMin}
            >
                <Minus className="h-4 w-4" />
            </Button>

            <Input
                id="quantity"
                type="number"
                min={0}
                step={0.5}
                inputMode="numeric"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="text-center"
            />

            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => adjustQuantity(1)}
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    )
}