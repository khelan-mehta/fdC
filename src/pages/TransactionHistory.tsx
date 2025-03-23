import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { url } from "@/env";
import Navbar from "@/components/Navbar";
import { ArrowDown } from "lucide-react";

interface Transaction {
  txnId: string;
  recieverId: string;
  amount: number;
  date: string;
}

export default function TransactionsPage() {
  const userId = JSON.parse(localStorage.getItem("user") || '""');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const userId = JSON.parse(localStorage.getItem("user") || '""');
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch(`${url}/auth/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setTransactions(data?.user?.transactions || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, [userId]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Navbar />

      <div className="mt-12 mx-auto p-4 flex flex-col items-center">
        {loading ? (
          <Skeleton className="h-16 w-[80vw] mb-4" />
        ) : transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {transactions.map((txn, index) => (
              <div
                key={txn.txnId}
                className="w-[80vw] flex flex-col items-center"
              >
                {/* Transaction Block */}
                <Card className="w-full shadow-lg border border-gray-300 bg-gray-100">
                  <CardContent className="p-6 text-center">
                    <p className="text-xs text-gray-500">Txn ID: {txn.txnId}</p>
                    <p className="font-semibold text-lg">
                      Recipient: {txn.recieverId}
                    </p>
                    <p className="text-green-600 text-xl font-bold">
                      ₹{txn.amount}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      {new Date(txn.date).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>

                {/* Arrow Between Transactions */}
                {index < transactions.length - 1 && (
                  <ArrowDown className="h-8 w-8 text-gray-400 mt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
