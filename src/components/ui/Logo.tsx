// Brand logo — renders the actual SVG mark files in public/brand/.
// Active variant: "D" (roofline). A/B/C kept so the brand can be switched
// instantly: change the default `variant` here or pass <Logo variant="A" />.
//   A = house + heart   B = house + door   C = pin + house   D = roofline (active)

type Variant = "A" | "B" | "C" | "D";

function Wordmark() {
  return (
    <span className="leading-tight">
      <span className="block text-lg font-extrabold tracking-tight">KKC Home Hug</span>
      <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-base-content/50">
        Property
      </span>
    </span>
  );
}

export default function Logo({
  size = 40,
  withText = true,
  variant = "D",
}: {
  size?: number;
  withText?: boolean;
  variant?: Variant;
}) {
  if (variant === "D") {
    return (
      <span className="inline-flex flex-col">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/mark-d.svg" alt="" width={64} height={18} aria-hidden="true" className="-mb-1" />
        {withText ? <Wordmark /> : null}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/brand/mark-${variant.toLowerCase()}.svg`}
        alt=""
        width={size}
        height={size}
        aria-hidden="true"
        className="shadow-sm"
        style={{ borderRadius: 12 }}
      />
      {withText ? <Wordmark /> : null}
    </span>
  );
}
