"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle } from "lucide-react"
import { useUser } from "@/context/UserContext"

interface TransactionModalProps {
  onSuccess: () => void
}

const countries = [
  { code: "DE", name: "Germany" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "RU", name: "Russia" },
  { code: "CA", name: "Canada" },
  { code: "FR", name: "France" },
  { code: "CN", name: "China" },
  { code: "KP", name: "North Korea" },
  { code: "JP", name: "Japan" },
  { code: "SD", name: "Sudan" },
  { code: "SY", name: "Syria" },
  { code: "CU", name: "Cuba" },
  { code: "IN", name: "India" },
  { code: "IR", name: "Iran" }
];

export function TransactionModal({ onSuccess }: TransactionModalProps) {
  const { toast } = useToast()
  const { user } = useUser()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    to: "",
    amount_usd: "",
    from_country: user?.country || "",
    to_country: "",
    timestamp: new Date().toISOString(), // Initialize with current time
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const getCountryName = (code: string) => {
    const country = countries.find(c => c.code === code);
    return country?.name || code;
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!user?.username) newErrors.from = "User not authenticated"
    if (!formData.to.trim()) newErrors.to = "Recipient is required"
    if (!formData.amount_usd) {
      newErrors.amount_usd = "Amount is required"
    } else if (isNaN(Number(formData.amount_usd)) || Number(formData.amount_usd) <= 0) {
      newErrors.amount_usd = "Must be positive number"
    }
    if (!formData.from_country) newErrors.from_country = "Origin country required"
    if (!formData.to_country) newErrors.to_country = "Destination country required"
    if (!formData.timestamp) newErrors.timestamp = "Timestamp required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Authentication required")

      // Convert country codes to names
      const fromCountryName = getCountryName(formData.from_country);
      const toCountryName = getCountryName(formData.to_country);

      const response = await fetch("/api/transaction/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          from: user?.username,
          to: formData.to,
          amount_usd: Number(formData.amount_usd),
          from_country: fromCountryName,
          to_country: toCountryName,
          timestamp: formData.timestamp, // Use selected timestamp
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Transaction failed")
      }
      const data = await response.json()
      
      toast({
        title: `Success 🎉 risk_score: ${data?.risk_score}`,
        description: `Transfer of $${formData.amount_usd} initiated`,
      })
      
      setOpen(false)
      onSuccess()
      setFormData({
        to: "",
        amount_usd: "",
        from_country: user?.country || "",
        to_country: "",
        timestamp: new Date().toISOString(), // Reset to current time
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Transaction failed",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
          <DialogDescription>
            Send funds to another user (test midnight transactions for higher risk scores)
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="from">From</Label>
            <Input 
              id="from" 
              value={user?.username || ""} 
              readOnly 
              className="bg-muted"
            />
            {errors.from && <p className="text-sm text-destructive">{errors.from}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              value={formData.to}
              onChange={(e) => handleChange("to", e.target.value)}
              placeholder="Recipient username"
            />
            {errors.to && <p className="text-sm text-destructive">{errors.to}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount_usd}
              onChange={(e) => handleChange("amount_usd", e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0.01"
            />
            {errors.amount_usd && (
              <p className="text-sm text-destructive">{errors.amount_usd}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="timestamp">Transaction Time</Label>
            <Input
              id="timestamp"
              type="datetime-local"
              value={new Date(formData.timestamp).toISOString().slice(0, 16)}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value)
                setFormData(prev => ({
                  ...prev,
                  timestamp: selectedDate.toISOString()
                }))
              }}
            />
            {errors.timestamp && (
              <p className="text-sm text-destructive">{errors.timestamp}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>From Country</Label>
              <Select
                value={formData.from_country}
                onValueChange={(value) => handleChange("from_country", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.from_country && (
                <p className="text-sm text-destructive">{errors.from_country}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>To Country</Label>
              <Select
                value={formData.to_country}
                onValueChange={(value) => handleChange("to_country", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.to_country && (
                <p className="text-sm text-destructive">{errors.to_country}</p>
              )}
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Send Transaction"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}