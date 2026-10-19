/** Studio credit. The wordmark matches elisdevV1: ELI + heart-filled "S2" + light "code". */
export const ELIS2CODE_URL = "https://elis.dev";

export function Elis2codeCredit() {
  return (
    <a
      href={ELIS2CODE_URL}
      target="_blank"
      rel="noopener"
      aria-label="Site by ELIS2code (opens in a new tab)"
      className="group inline-flex items-baseline gap-2 text-sm text-bone/45 transition-colors hover:text-bone/80"
    >
      Site by
      <span className="elis2code text-[1.35rem] leading-none text-[#ecebf3] transition-transform duration-300 group-hover:-translate-y-0.5">
        ELI<span className="elis2code__heart">S2</span>
        <span className="elis2code__code">code</span>
      </span>
    </a>
  );
}
