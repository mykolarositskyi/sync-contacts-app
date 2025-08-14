import { LucideIcon } from "lucide-react";

interface InfoCardProps {
    icon: LucideIcon;
    label: string;
    value: string;
}

export function InfoCard({ icon: Icon, label, value }: InfoCardProps) {
    return (
        <div className="group flex items-center space-x-4 p-5 bg-white dark:bg-black rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">{label}</p>
                <p className="text-gray-900 dark:text-gray-100 font-medium text-base leading-tight break-words">{value}</p>
            </div>
        </div>
    );
}
