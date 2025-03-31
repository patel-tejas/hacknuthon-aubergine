"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Globe, ArrowRight, User, Clock, AlertTriangle } from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/admin/fetch-transactions");
        const data = await res.json();
        console.log("Fetched transactions:", data); // Add debug log
        setTransactions(data.transactions);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Modified filter to use risk score and status
  const fraudulentTransactions = transactions.filter(
    tx => (tx.risk_score >= 0.7 && tx.risk_score != null) && tx.status === "pending"
  );

  // Helper function to determine fraud status
  const isFraudulent = (tx: any) => tx.risk_score >= 0.7;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="fraud">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Fraudulent Activity
          </TabsTrigger>
        </TabsList>

        {/* All Transactions Tab */}
        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <p>Loading transactions...</p>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {transactions.map((transaction, index) => (
                <TransactionCard 
                  key={transaction._id}
                  transaction={transaction}
                  index={index}
                  isFraudulent={isFraudulent(transaction)}
                />
              ))}
            </motion.div>
          )}
        </TabsContent>

        {/* Fraudulent Transactions Tab */}
        <TabsContent value="fraud" className="space-y-4">
          {loading ? (
            <p>Loading transactions...</p>
          ) : fraudulentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No fraudulent activity detected</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                All transactions appear to be legitimate
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {fraudulentTransactions.map((transaction, index) => (
                <TransactionCard
                  key={transaction._id}
                  transaction={transaction}
                  index={index}
                  isFraudulent={true}
                />
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TransactionCard({ transaction, index, isFraudulent }: { 
  transaction: any, 
  index: number, 
  isFraudulent: boolean 
}) {
  const transactionDate = new Date(transaction.timestamp);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`hover:border-primary/50 transition-colors group ${isFraudulent ? "border-red-500/30" : ""}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <Badge
              variant={isFraudulent ? "destructive" : "default"}
              className="rounded-full px-3 py-1 text-sm"
            >
              {isFraudulent ? (
                <>
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Fraud Detected
                </>
              ) : (
                <>
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${transaction.status === "completed" ? "bg-primary" : "bg-warning"} opacity-75`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${transaction.status === "completed" ? "bg-primary" : "bg-warning"}`} />
                  </span>
                  {transaction.status}
                </>
              )}
            </Badge>
            <span className="text-muted-foreground text-sm">
              ${Number(transaction.amount_usd).toLocaleString()}
            </span>
          </div>
          <Globe className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </CardHeader>
        <CardContent className="space-y-4">
          {isFraudulent && (
            <div className="bg-red-500/10 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">
                  Risk Score: {(transaction.risk_score * 100).toFixed(1)}%
                </span>
              </div>
              {transaction.loop_detected === "yes" && (
                <p className="text-sm mt-2">
                  Detected transaction loop (Size: {transaction.loop_size})
                </p>
              )}
            </div>
          )}
          
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
  );
}