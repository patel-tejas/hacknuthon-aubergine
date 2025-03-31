"use client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Globe, ArrowRight, User, Clock, AlertTriangle, ShieldAlert } from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/admin/fetch-transactions");
        const data = await res.json();
        console.log("Fetched transactions:", data);
        setTransactions(data.transactions);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  // Fraud detection logic
  const fraudulentTransactions = transactions.filter(tx => 
    (tx.risk_score >= 0.3 || tx.loop_detected)
  );

  const isFraudulent = (tx: any) => (tx.risk_score >= 0.3 || tx.loop_detected);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="fraud">
            <ShieldAlert className="w-4 h-4 mr-2" />
            Fraud Analysis
          </TabsTrigger>
        </TabsList>

        {/* All Transactions Tab - Simplified View */}
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

        {/* Fraud Analysis Tab - Detailed View */}
        <TabsContent value="fraud" className="space-y-4">
          {loading ? (
            <p>Loading transactions...</p>
          ) : fraudulentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <ShieldAlert className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No suspicious activity found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                All transactions cleared by risk analysis
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
                <FraudTransactionCard
                  key={transaction._id}
                  transaction={transaction}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Simplified card for All Transactions view
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
      <Card className={`hover:border-primary/50 transition-colors ${isFraudulent ? "border-red-500/30" : ""}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <Badge
              variant={isFraudulent ? "destructive" : "default"}
              className="rounded-full px-3 py-1 text-sm"
            >
              {isFraudulent ? (
                <>
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  High Risk
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
          <Globe className="h-5 w-5 text-muted-foreground" />
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

          <div className="flex mt-2">
              <h1 className="bg-yellow-400/50 px-2 py-1 rounded text-sm">Risk Score: {transaction.risk_score.toFixed(2)}</h1>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Detailed card for Fraud Analysis view
function FraudTransactionCard({ transaction, index }: { transaction: any, index: number }) {
  const transactionDate = new Date(transaction.timestamp);
  const riskPercentage = (transaction.risk_score * 100).toFixed(1);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="border-red-500/30 hover:border-red-500/50 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="rounded-full px-3 py-1 text-sm">
              <ShieldAlert className="h-4 w-4 mr-1" />
              {transaction.risk_level || "High Risk"}
            </Badge>
            <span className="text-muted-foreground text-sm">
              ${Number(transaction.amount_usd).toLocaleString()}
            </span>
          </div>
          <Globe className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Risk Analysis Section */}
          <div className="bg-red-500/10 p-3 rounded-lg space-y-2">
            <span>{`${transaction.from}-> ${transaction.to}`}</span>
            <div className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-4 w-4" />
              <h4 className="font-semibold">Risk Analysis ({riskPercentage}%)</h4>
            </div>
            
            {transaction.risk_factors?.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Risk Factors:</p>
                <ul className="list-disc list-inside space-y-1">
                  {transaction.risk_factors.map((factor: string, i: number) => (
                    <li key={i} className="text-xs text-red-500">{factor}</li>
                  ))}
                </ul>
              </div>
            )}

            {transaction.risk_actions?.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Recommended Actions:</p>
                <ul className="list-disc list-inside space-y-1">
                  {transaction.risk_actions
                    .filter((action: string) => action)
                    .map((action: string, i: number) => (
                      <li key={i} className="text-xs text-yellow-500">{action}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Loop Analysis Section */}
          {transaction.loop_detected && (
            <div className="bg-orange-500/10 p-3 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-orange-500">
                <AlertTriangle className="h-4 w-4" />
                <h4 className="font-semibold">Suspicious Transaction Pattern</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium">Loop Size:</p>
                  <p>{transaction.loop_size}</p>
                </div>
                <div>
                  <p className="font-medium">Total Cycled:</p>
                  <p>{transaction.full_analysis?.loop_analysis?.total_amount || 'N/A'}</p>
                </div>
              </div>

              {transaction.loop_participants?.length > 0 && (
                <div>
                  <p className="text-sm font-medium mt-2">Participants:</p>
                  <div className="flex flex-wrap gap-2">
                    {transaction.loop_participants.map((participant: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-red-500/20 text-red-500 rounded-full text-xs">
                        {participant}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Transaction Metadata */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-primary" />
              <span className="font-medium">{transaction.from_country}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{transaction.to_country}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{transactionDate.toLocaleDateString()}</span>
              <span>•</span>
              <span>{transactionDate.toLocaleTimeString()}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button className="bg-red-500 hover:bg-red-700 duration-200 transition">Block Transaction</Button>
              <Button>Block User</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}