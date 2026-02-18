"use client";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  color?: "purple" | "blue" | "green" | "orange" | "pink" | "red";
}

const colorMap = {
  purple: { bg: "bg-[#7C5CFC]/10", text: "text-[#7C5CFC]" },
  blue: { bg: "bg-[#4DA6FF]/10", text: "text-[#4DA6FF]" },
  green: { bg: "bg-[#44D4A0]/10", text: "text-[#44D4A0]" },
  orange: { bg: "bg-[#FF8C42]/10", text: "text-[#FF8C42]" },
  pink: { bg: "bg-[#FF6B9D]/10", text: "text-[#FF6B9D]" },
  red: { bg: "bg-red-100", text: "text-red-600" },
};

export function StatCard({ title, value, icon, change, color = "purple" }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center ${c.text}`}>
          {icon}
        </div>
        {change && (
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
            {change}
          </span>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  );
}
