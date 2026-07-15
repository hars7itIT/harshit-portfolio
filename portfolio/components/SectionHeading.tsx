export default function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10">
      <p className="font-mono text-xs text-signal">// {eyebrow}</p>
      <h2 className="mt-2 font-mono text-2xl font-bold text-text sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 max-w-2xl text-muted">{description}</p>}
    </div>
  );
}
