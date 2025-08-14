interface MetadataCardProps {
    label: string;
    value: string | React.ReactNode;
}

export function MetadataCard({ label, value }: MetadataCardProps) {
    return (
        <div className="group p-5 bg-white dark:bg-black rounded-2xl border-2 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">{label}</p>
            <div className="text-gray-900 dark:text-gray-100 font-medium text-sm leading-relaxed">{value}</div>
        </div>
    );
}
