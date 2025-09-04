import React, { useState, useRef } from "react";
import axios from "axios";
import { useLocation,useNavigate} from "react-router-dom";

// ---------------- ICONS ----------------
function BankIcon({ color = "#2563eb" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="5" fill={color} />
      <path d="M2 11.5L12 5L22 11.5" stroke="white" strokeWidth="1.5" />
      <path d="M4 13V19H20V13" stroke="white" strokeWidth="1.5" />
      <circle cx="12" cy="16" r="1" fill="white" />
    </svg>
  );
}

const CardIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
    <rect width="24" height="24" rx="5" fill="#4f46e5" />
    <rect x="4" y="7" width="16" height="10" rx="2" fill="#fff" />
    <rect x="4" y="10" width="16" height="1.5" fill="#c7d2fe" />
    <circle cx="8" cy="16" r="1" fill="#818cf8" />
    <rect x="15" y="15.3" width="3" height="1.4" rx="0.7" fill="#818cf8" />
  </svg>
);

const UpiIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
    <rect width="48" height="48" rx="12" fill="#065f46" />
    <path d="M17 33L38 15h-9l-8 5.5V33z" fill="#fff" />
    <ellipse cx="16" cy="34" rx="2.2" ry="2" fill="#fff" />
  </svg>
);

const VisaIcon = () => (
  <svg width="28" height="15" viewBox="0 0 28 15" aria-label="Visa">
    <rect width="28" height="15" rx="4" fill="#2563eb" />
    <text x="6" y="10" fill="white" fontSize="8" fontWeight="bold">
      VISA
    </text>
  </svg>
);

const MasterCardIcon = () => (
  <svg width="28" height="15" viewBox="0 0 28 15" aria-label="MasterCard">
    <rect width="28" height="15" rx="4" fill="#fff7ed" />
    <circle cx="11" cy="7.5" r="5" fill="#ea580c" fillOpacity="0.85" />
    <circle cx="17" cy="7.5" r="5" fill="#eab308" fillOpacity="0.8" />
    <text x="7" y="12" fill="#6d28d9" fontSize="6" fontWeight="bold">
      MC
    </text>
  </svg>
);

const RuPayIcon = () => (
  <svg width="28" height="15" viewBox="0 0 28 15" aria-label="RuPay">
    <rect width="28" height="15" rx="4" fill="#f1f5f9" />
    <text x="4" y="10" fill="#0d9488" fontSize="8" fontWeight="bold">
      RuPay
    </text>
  </svg>
);

const GooglePayIcon = () => (
  <svg width="23" height="23" viewBox="0 0 23 23">
    <circle cx="11.5" cy="11.5" r="11.5" fill="#fff" />
    <text x="4" y="14" fill="#34a853" fontWeight="bold" fontSize="8">
      GPay
    </text>
  </svg>
);

const PhonePeIcon = () => (
  <svg width="23" height="23" viewBox="0 0 23 23">
    <circle cx="11.5" cy="11.5" r="11.5" fill="#fff" />
    <text x="7" y="16" fill="#8b5cf6" fontWeight="bold" fontSize="10">
      पे
    </text>
  </svg>
);

const PaytmIcon = () => (
  <svg width="23" height="23" viewBox="0 0 23 23">
    <circle cx="11.5" cy="11.5" r="11.5" fill="#fff" />
    <text x="5" y="16" fill="#0ea5e9" fontWeight="bold" fontSize="10">
      Paytm
    </text>
  </svg>
);

// ---------------- CONFIG ----------------
const BANKS = [
  { name: "HDFC Bank", icon: <BankIcon color="#0747a6" /> },
  { name: "ICICI Bank", icon: <BankIcon color="#ff6600" /> },
  { name: "SBI", icon: <BankIcon color="#1a237e" /> },
  { name: "Axis Bank", icon: <BankIcon color="#a30046" /> },
];

const WALLET_PROVIDERS = [
  { name: "Google Pay", icon: <GooglePayIcon /> },
  { name: "PhonePe", icon: <PhonePeIcon /> },
  { name: "Paytm", icon: <PaytmIcon /> },
];

const CARD_ICONS = [
  <VisaIcon key="visa" />,
  <MasterCardIcon key="mastercard" />,
  <RuPayIcon key="rupay" />,
];

type PaymentMethod = "card" | "bank" | "upi";

// ---------------- MAIN COMPONENT ----------------
export default function PaymentPage() {
  const location = useLocation();
  const { subscriptionId, amount: planAmount } = location.state || {};

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [card, setCard] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [showCardBack, setShowCardBack] = useState(false);
  const [bank, setBank] = useState(BANKS[0].name);
  const [upi, setUpi] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "failed">("idle");
  const cvvInput = useRef<HTMLInputElement | null>(null);
const navigate = useNavigate();

  // ---------------- Input Handlers ----------------
  const handleCardInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "number") {
      let formatted = value.replace(/\D/g, "");
      formatted = formatted.replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
      setCard((c) => ({ ...c, number: formatted }));
    } else if (name === "expiry") {
      let formatted = value.replace(/\D/g, "");
      if (formatted.length > 4) formatted = formatted.slice(0, 4);
      if (formatted.length > 2) formatted = formatted.slice(0, 2) + "/" + formatted.slice(2);
      setCard((c) => ({ ...c, expiry: formatted }));
    } else if (name === "cvv") {
      let formatted = value.replace(/\D/g, "").slice(0, 4);
      setCard((c) => ({ ...c, cvv: formatted }));
    } else {
      setCard((c) => ({ ...c, [name]: value }));
    }
  };

  const validateForm = () => {
    let newErrors: { [key: string]: boolean } = {};
    let isValid = true;
    if (method === "card") {
      if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(card.number)) {
        newErrors.number = true;
        isValid = false;
      }
      if (card.name.trim().length < 3) {
        newErrors.name = true;
        isValid = false;
      }
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
        newErrors.expiry = true;
        isValid = false;
      }
      if (card.cvv.length < 3) {
        newErrors.cvv = true;
        isValid = false;
      }
    } else if (method === "upi") {
      if (!/^[\w.\-]+@[\w.\-]+$/.test(upi)) {
        newErrors.upi = true;
        isValid = false;
      }
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleCvvFocus = () => setShowCardBack(true);
  const handleCvvBlur = () => setShowCardBack(false);

  // ---------------- Payment Submit ----------------
const handlePayment = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);
  setPaymentStatus("idle");

  const payload = {
    subscriptionId,
    amount: planAmount,
    status: "success",
  };

  try {
    const response = await axios.post("http://localhost:5000/api/payments", payload);
    if (response.data.success) {
      setPaymentStatus("success");
      console.log("Payment successful:", response.data.data);

      // 👇 Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    } else {
      setPaymentStatus("failed");
      console.error("Payment failed:", response.data.message);
    }
  } catch (error) {
    setPaymentStatus("failed");
    console.error("Payment API call failed:", error);
  } finally {
    setLoading(false);
  }
};




  // UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-2">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-3xl p-6 md:p-9">
        {/* Amount Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-sm text-gray-500 font-medium">
              Amount to Pay
            </div>
            <div className="text-2xl font-extrabold text-gray-900 flex items-center">
              <span>₹</span>
              <span className="ml-1">
  {planAmount
    ? parseFloat(planAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })
    : "0.00"}
</span>

            </div>
          </div>
          <svg width={44} height={44} viewBox="0 0 44 44">
            <circle cx={22} cy={22} r={22} fill="#f3f4f6" />
          </svg>
        </div>

        {/* Payment Methods */}
        <div className="flex space-x-2 rounded-lg mb-7 bg-gray-100 p-2">
          <TabButton active={method === "card"} onClick={() => setMethod("card")}>
            <CardIcon /> <span className="ml-1">Card</span>
          </TabButton>
          <TabButton active={method === "bank"} onClick={() => setMethod("bank")}>
            <BankIcon /> <span className="ml-1">Bank</span>
          </TabButton>
          <TabButton active={method === "upi"} onClick={() => setMethod("upi")}>
            <UpiIcon /> <span className="ml-1 hidden sm:inline">UPI/Wallet</span>
            <span className="ml-1 sm:hidden">UPI</span>
          </TabButton>
        </div>

        <form onSubmit={handlePayment}>
          <div>
            {/* Card */}
            {method === "card" && (
              <>
                {/* Card Mockup */}
                <div className="flex justify-center mb-5">
                  <CardMockup
                    showBack={showCardBack}
                    name={card.name}
                    number={card.number}
                    expiry={card.expiry}
                    cvv={card.cvv}
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Cardholder Name
                    </label>
                    <input
                      name="name"
                      type="text"
                      autoComplete="off"
                      maxLength={24}
                      autoCorrect="off"
                      value={card.name}
                      onChange={handleCardInput}
                      className={`w-full bg-gray-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition text-gray-900 ${
                        errors["name"]
                          ? "border-2 border-red-500"
                          : "border border-gray-200"
                      }`}
                      placeholder="Name on card"
                    />
                    {errors["name"] && (
                      <p className="text-red-500 text-xs mt-1">
                        Enter a valid name
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:space-x-4 gap-y-4">
                    <div className="flex-1">
                      <label className="block text-xs font-medium mb-1">
                        Card Number
                      </label>
                      <input
                        name="number"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9 ]*"
                        autoComplete="cc-number"
                        value={card.number}
                        onChange={handleCardInput}
                        maxLength={19}
                        className={`w-full bg-gray-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition text-gray-900 tracking-widest ${
                          errors["number"]
                            ? "border-2 border-red-500"
                            : "border border-gray-200"
                        }`}
                        placeholder="0000 0000 0000 0000"
                      />
                      {errors["number"] && (
                        <p className="text-red-500 text-xs mt-1">
                          Enter a valid card number
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Expiry
                      </label>
                      <input
                        name="expiry"
                        type="text"
                        inputMode="numeric"
                        pattern="\d{2}/\d{2}"
                        autoComplete="cc-exp"
                        value={card.expiry}
                        onChange={handleCardInput}
                        maxLength={5}
                        className={`w-full bg-gray-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition text-gray-900 text-center ${
                          errors["expiry"]
                            ? "border-2 border-red-500"
                            : "border border-gray-200"
                        }`}
                        placeholder="MM/YY"
                      />
                      {errors["expiry"] && (
                        <p className="text-red-500 text-xs mt-1">
                          Invalid date
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        CVV
                      </label>
                      <input
                        ref={cvvInput}
                        name="cvv"
                        type="password"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        value={card.cvv}
                        onFocus={handleCvvFocus}
                        onBlur={handleCvvBlur}
                        onChange={handleCardInput}
                        maxLength={4}
                        className={`w-full bg-gray-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition text-gray-900 text-center ${
                          errors["cvv"]
                            ? "border-2 border-red-500"
                            : "border border-gray-200"
                        }`}
                        placeholder="123"
                      />
                      {errors["cvv"] && (
                        <p className="text-red-500 text-xs mt-1">Invalid CVV</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    {CARD_ICONS.map((icon) => icon)}
                  </div>
                </div>
              </>
            )}

            {/* Bank */}
            {method === "bank" && (
              <div className="flex flex-col items-start space-y-5">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Bank
                  </label>
                  <div className="relative w-full">
                    <select
                      className="appearance-none w-full bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 transition text-gray-900"
                      value={bank}
                      onChange={(e) => setBank(e.target.value)}
                    >
                      {BANKS.map((b) => (
                        <option value={b.name} key={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                      <svg width="18" height="18" viewBox="0 0 20 20">
                        <path
                          d="M7 7l3 3 3-3"
                          stroke="currentColor"
                          strokeWidth={2}
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="flex space-x-5 items-center">
                  {BANKS.map((b) => (
                    <div
                      key={b.name}
                      className={`p-2 rounded-lg border transition flex items-center text-xs font-semibold ${
                        bank === b.name
                          ? "border-blue-600 text-blue-700 bg-blue-100"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      {b.icon}
                      <span className="ml-2">{b.name.split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* UPI/Wallet */}
            {method === "upi" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1">
                    UPI ID or Wallet Number
                  </label>
                  <input
                    name="upi"
                    type="text"
                    autoComplete="off"
                    value={upi}
                    onChange={(e) => setUpi(e.target.value)}
                    className={`w-full bg-gray-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition text-gray-900 ${
                      errors["upi"]
                        ? "border-2 border-red-500"
                        : "border border-gray-200"
                    }`}
                    placeholder="eg: mobile@upi or 98xxxxxx98"
                  />
                  {errors["upi"] && (
                    <p className="text-red-500 text-xs mt-1">
                      Enter valid UPI ID / wallet
                    </p>
                  )}
                </div>
                <div className="flex space-x-3 items-center">
                  {WALLET_PROVIDERS.map((w) => (
                    <div
                      key={w.name}
                      className="flex items-center px-2 py-1 rounded border border-gray-200 bg-gray-50"
                    >
                      <span>{w.icon}</span>
                      <span className="ml-2 text-xs">{w.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pay Now Button */}
          <button
            type="submit"
            className="mt-8 w-full text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>

          {/* Payment Status Message */}
          {paymentStatus === "success" && (
            <p className="mt-4 text-green-600 text-center font-bold">
              Payment successful! 🎉
            </p>
          )}
          {paymentStatus === "failed" && (
            <p className="mt-4 text-red-600 text-center font-bold">
              Payment failed. Please try again.
            </p>
          )}

          {/* Demo note */}
          <div className="mt-3 text-xs text-gray-400 text-center">
            Demo UI for Payment Checkout – React + Tailwind CSS
          </div>
        </form>
      </div>
    </div>
  );
}

// Helper components (as you provided)
function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center justify-center py-2 px-2 text-sm font-semibold rounded-lg transition ${
        active
          ? "bg-white shadow text-blue-600"
          : "bg-gray-100 text-gray-500 hover:bg-white/70"
      }`}
    >
      {children}
    </button>
  );
}

function CardMockup({
  showBack,
  name,
  number,
  expiry,
  cvv,
}: {
  showBack: boolean;
  name: string;
  number: string;
  expiry: string;
  cvv: string;
}) {
  return (
    <div className="perspective-850 w-72 h-44">
      <div
        className={`relative w-72 h-44 transition-transform duration-700`}
        style={{
          transformStyle: "preserve-3d",
          transform: showBack ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute w-full h-full bg-gradient-to-br from-blue-50 via-blue-100 to-blue-400 rounded-2xl shadow-xl flex flex-col justify-between p-5"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-700 text-sm">
              Credit / Debit Card
            </span>
            <span className="flex items-center space-x-2">
              {CARD_ICONS.map((i) => i)}
            </span>
          </div>
          <div>
            <div className="text-lg font-mono tracking-widest text-gray-900">
              {number || "0000 0000 0000 0000"}
            </div>
            <div className="flex justify-between items-center mt-3">
              <div>
                <div className="text-xs uppercase text-gray-500">
                  Cardholder
                </div>
                <div className="text-sm font-semibold text-gray-800">
                  {name || "FULL NAME"}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase text-gray-500">Expiry</div>
                <div className="text-sm font-semibold text-gray-800">
                  {expiry || "MM/YY"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="absolute w-full h-full bg-gradient-to-br from-blue-700 via-blue-400 to-blue-300 rounded-2xl shadow-xl px-5 pt-6 pb-4"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="w-full h-7 bg-gray-900 rounded-t-md mb-6" />
          <div className="flex flex-col">
            <div className="text-xs text-gray-100 mb-2">CVV</div>
            <div className="w-28 bg-white h-7 rounded text-center flex items-center justify-center text-gray-900 font-semibold text-lg tracking-widest">
              {cvv || "•••"}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .perspective-850 {
          perspective: 850px;
        }
      `}</style>
    </div>
  );
}