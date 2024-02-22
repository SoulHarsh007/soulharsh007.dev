export default function Metric({
  color = 'bg-red-500',
  title,
  value,
}: Readonly<{color?: string; title: string; value: string}>) {
  return (
    <div className="flex space-x-2.5">
      <div className={`flex w-1 flex-col ${color} rounded`} />
      <div className="space-y-1">
        <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          {title}
        </p>
        <p className="text-tremor-metric text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
          {value}
        </p>
      </div>
    </div>
  );
}
