import PaymentForm from "@/components/payment/PaymentForm"

export const metadata = {
  title: "Adhésion Club Sportif - Paiement",
  description: "Complétez votre paiement d'adhésion pour accéder à toutes les fonctionnalités du club",
}

export default function PaymentPage() {
  return (
    <div className="mt-16 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <PaymentForm />
    </div>
  )
}

