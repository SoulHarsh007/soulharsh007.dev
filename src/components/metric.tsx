export function Metric({
  color,
  title,
  value,
}: Readonly<{color?: string; title: string; value: string}>) {
  return (
    <div className="flex space-x-2.5">
      <div className={`flex w-1 flex-col ${color} rounded-sm`} />
      <div className="space-y-1">
        <p>{title}</p>
        <p className="font-semibold text-3xl">{value}</p>
      </div>
    </div>
  );
}
