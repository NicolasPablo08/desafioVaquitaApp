import { firestore } from "./connections/firestore";

const transactionsCollection = firestore.collection("transactions");

type Purchase = {
  id: string;
  from: string;
  amount: number;
  message: string;
  date: Date;
  status: string;
};
export async function getConfirmedPayments(): Promise<Purchase[]> {
  try {
    const transactions = await transactionsCollection.where("status", "==", "confirmed").get();
    const purchases = transactions.docs.map((t) => ({
      id: t.id,
      from: t.data().name,
      amount: parseInt(t.data().amount),
      message: t.data().description,
      date: t.data().timestamps,
      status: t.data().status,
    }));

    return purchases;
  } catch (error) {
    console.error("Error fetching confirmed transactions:", error);
    throw new Error("Could not fetch confirmed transactions");
  }
}

export async function createPurchase(
  // guardamos esta nueva purchase en la db y devolvemos el id
  newPurchInput: Pick<Purchase, "from" | "amount" | "message">
): Promise<string> {
  const purchase = {
    ...newPurchInput,
    date: new Date(),
    status: "pending",
  };
  try {
    const createdTransaction = await transactionsCollection.add({
      name: purchase.from,
      status: purchase.status,
      description: purchase.message,
      amount: purchase.amount,
      timestamps: purchase.date,
    });
    return createdTransaction.id; // devolvemos el id o ticket de la transacción creada
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw new Error("Could not create transaction");
  }
}

export async function confirmPurchase(purchaseId: string) {
  // confirmamos la compra en la DB cambiando el status
  const docRef = transactionsCollection.doc(purchaseId);
  try {
    await docRef.update({ status: "confirmed" });
    console.log(`Purchase ${purchaseId} confirmed`);
    return true;
  } catch (error) {
    console.error("Error confirming transaction:", error);
    throw new Error("Could not confirm transaction");
  }
}
