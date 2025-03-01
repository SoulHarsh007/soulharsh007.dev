export default function Metric({
  color = 'bg-red-500',
  title,
  value,
}: Readonly<{color?: string; title: string; value: string}>) {
  return (
    <div className="flex space-x-2.5">
      <div className={`flex w-1 flex-col ${color} rounded`} />
      <div className="space-y-1">
        <p className="dark:text-gray-100 text-gray-800 font-light">
          {title}
        </p>
        <p className="text-gray-900 dark:text-white font-semibold text-3xl">
          {value}
        </p>
      </div>
    </div>
  );
}
