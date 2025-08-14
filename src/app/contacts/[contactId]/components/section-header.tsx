import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
    icon: LucideIcon;
    title: string;
    iconColor?: string;
}

export function SectionHeader({ icon: Icon, title, iconColor = "text-gray-600 dark:text-gray-400" }: SectionHeaderProps) {
    return (
        <div className="flex items-center space-x-3 mb-5">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 leading-tight">
                {title}
            </h3>
        </div>
    );
}
