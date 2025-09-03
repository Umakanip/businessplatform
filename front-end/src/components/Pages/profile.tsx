// InvitationCard.tsx
import React from 'react';

interface Invitation {
  name: string;
  profile: string; // URL or fallback
  category: string;
}

const invitations: Invitation[] = [
  { name: "Latifa Sambra", profile: "", category: "Adh Service" },
  { name: "Maaz Ahmed", profile: "", category: "Engineer at TMB Liberty Power" },
  { name: "Alexander Krolikowski", profile: "", category: "IT Consultant, Business" },
  // ... up to 10 people, adjust this as needed
];

export default function InvitationList() {
  return (
    <div className="max-w-xl mx-auto bg-white rounded-md shadow p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Invitations</h2>
        <button className="text-blue-600 hover:underline text-sm flex items-center">
          See all 12,088
          <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <ul>
        {invitations.map((inv, idx) => (
          <li key={idx} className="flex items-center border-b py-3">
            {/* SVG profile icon */}
            <svg className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 mr-3" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#d1d5db"/>
              <text x="50%" y="60%" textAnchor="middle" fill="#4b5563" fontSize="16" fontWeight="bold">{inv.name[0]}</text>
            </svg>

            <div className="flex-grow">
              <div className="font-medium">{inv.name}</div>
              <div className="text-xs text-gray-500 mt-1">{inv.category}</div>
            </div>
            <div className="flex space-x-2">
              {/* Accept Button */}
              <button className="px-3 py-1 flex items-center text-white bg-blue-600 rounded hover:bg-blue-700 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Accept
              </button>
              {/* Ignore Button */}
              <button className="px-3 py-1 flex items-center text-gray-700 bg-gray-100 rounded hover:bg-gray-200 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Ignore
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
