import React, { useState } from 'react';

// Define a type for the message state to avoid TypeScript errors.
type MessageState = {
  text: string;
  type: 'success' | 'error';
};

// The main application component that contains the pricing UI and subscription logic.
const Pricing = () => {
  // Define the pricing plans data. This can be fetched from an API in a real application.
  const plans = [
    {
      name: "Lite",
      price: "$19",
      period: "/month",
      description: "Basic features to get started",
      features: [
        "Limited profile views",
        "Basic matching",
        "Community support",
      ],
    },
    {
      name: "Standard",
      price: "$49",
      period: "/month",
      description: "Most popular plan for individuals",
      features: [
        "Unlimited profile views",
        "Tinder-style matching",
        "Direct messaging",
        "KYC verification",
      ],
    },
    {
      name: "Premium",
      price: "$99",
      period: "/month",
      description: "Full access for power users",
      features: [
        "All Standard features",
        "Priority support",
        "Advanced analytics",
        "Featured profile badge",
      ],
    },
  ];

  // State to manage the selected plan, form input, loading status, and messages.
  // We now use a union type for the message state: MessageState or null.
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessageState | null>(null);

  // Function to handle the plan selection and open the subscription form.
  // Add a type annotation for the planName parameter.
  const handlePlanSelect = (planName: string) => {
    setSelectedPlan(planName);
    setMessage(null); // Clear previous messages
  };

  // Function to handle form submission and make the API call.
  // Add a type annotation for the event parameter 'e'.
  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("http://localhost:5000/api/subscriptions/subscribe-public", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          plan: selectedPlan,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: data.message, type: 'success' });
        // Optionally reset form after successful submission
        setEmail('');
        setPassword('');
        setSelectedPlan(null);
      } else {
        setMessage({ text: data.message || "An error occurred.", type: 'error' });
      }

    } catch (error) {
      console.error('Subscription error:', error);
      setMessage({ text: "Network error or server unavailable.", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-violet-950 text-white p-4">
      <script src="https://cdn.tailwindcss.com"></script>
      
      {/* Pricing section */}
      <section id="pricing" className="py-12 w-full max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Simple Pricing</h2>
          <p className="text-xl text-gray-300">
            Choose the plan that suits you best
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl p-8 border border-white/10 flex flex-col transform hover:scale-105 transition-transform duration-300"
            >
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-white mb-2">
                  {plan.price}
                  <span className="text-lg text-gray-300">{plan.period}</span>
                </div>
                <p className="text-gray-300">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-400 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handlePlanSelect(plan.name)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Subscription Form Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md border border-gray-700 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Subscribe to {selectedPlan} Plan</h3>
              <button 
                onClick={() => setSelectedPlan(null)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubscribe} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            
            {message && (
              <div className={`mt-4 p-4 rounded-lg text-sm text-center font-medium ${message.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                {message.text}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;

