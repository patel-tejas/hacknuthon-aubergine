"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { motion } from "framer-motion"
import { TransactionModal } from "./TransactionModal"
import { Badge } from "@/components/ui/badge"
import { Clock, ArrowRight, User, Globe } from "lucide-react"
import { useEffect, useState } from "react"
import { useUser } from "@/context/UserContext"
import { Skeleton } from "@/components/ui/skeleton"

interface Transaction {
    _id: string
    from: string
    to: string
    amount_usd: numbera
    from_country: string
    to_country: string
    timestamp: string
    status: string
}

export default function TransactionsPage() {
    const { user } = useUser()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const fetchTransactions = async () => {
        try {
            const response = await fetch("/api/transaction", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })

            if (!response.ok){
                throw new Error("Failed to fetch transactions")
                console.log(await response.json());
                
            }

            const data = await response.json()
            console.log();
            
            setTransactions(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load transactions")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchTransactions()
        }
    }, [user])

    if (error) {
        return (
            <div className="m-10 text-destructive">
                Error: {error}
            </div>
        )
    }

    if (loading) {
        return (
            <div className="space-y-6 m-10">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-[300px]" />
                    <Skeleton className="h-10 w-[150px]" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-[200px] w-full" />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 m-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Transaction History
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Monitor and analyze all blockchain transactions
                    </p>
                </div>
                <TransactionModal onSuccess={fetchTransactions} />
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
                {transactions.map((transaction, index) => {
                    const transactionDate = new Date(transaction.timestamp)

                    return (
                        <motion.div
                            key={transaction._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="hover:border-primary/50 transition-colors group">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={transaction.status === "completed" ? "default" : "warning"}
                                            className="rounded-full px-3 py-1 text-sm"
                                        >
                                            <span className="relative flex h-2 w-2 mr-2">
                                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${transaction.status === "completed" ? 'bg-primary' : 'bg-warning'} opacity-75`} />
                                                <span className={`relative inline-flex rounded-full h-2 w-2 ${transaction.status === "completed" ? 'bg-primary' : 'bg-warning'}`} />
                                            </span>
                                            {transaction.status}
                                        </Badge>
                                        <span className="text-muted-foreground text-sm">
                                            ${transaction.amount_usd.toLocaleString()}
                                        </span>
                                    </div>
                                    <Globe className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4 text-primary" />
                                                <span className="font-medium">{transaction.from_country}</span>
                                                <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
                                                <User className="h-4 w-4 text-primary" />
                                                <span className="font-medium">{transaction.to_country}</span>
                                            </div>
                                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                {transactionDate.toLocaleDateString()}
                                                <span className="mx-1">•</span>
                                                {transactionDate.toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Sender</p>
                                            <p className="truncate font-mono">{transaction.from}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Receiver</p>
                                            <p className="truncate font-mono">{transaction.to}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )
                })}
            </motion.div>
        </div>
    )
}