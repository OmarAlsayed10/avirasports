interface SectionShellProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function SectionShell({ title, children, action }: SectionShellProps) {
  return (
    <section className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}