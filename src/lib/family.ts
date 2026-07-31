/* -----------------------------------------------------------------------------
   The other two AFA properties.

   Each app in the family links to the other two and never embeds them. That is
   a security decision before it is a navigation one: three origins mean one
   reflected XSS in a marketing page cannot reach the gateway's session
   (afa-brand/ARCHITECTURE.md, D1 and D5). Every outbound link carries
   rel="noopener noreferrer".

   `canonical` is where each property belongs; the second value is where it
   answers today. Both exist because linking at a name that does not resolve is
   worse than linking at an ugly one that does. When the DNS records exist, set
   AFA_FAMILY_DNS_READY=1 for one build, confirm the links, then delete the
   fallbacks. Mirrors the same switch in afa-site/src/content/site.ts.
   -------------------------------------------------------------------------- */

const dnsReady = process.env.AFA_FAMILY_DNS_READY === '1';

const pick = (canonical: string, liveToday: string) => (dnsReady ? canonical : liveToday);

export const family = [
  {
    id: 'company',
    href: pick('https://afa.co.com', 'https://afa.co.com'),
  },
  {
    id: 'pay',
    href: pick('https://pay.afa.co.com', 'https://afa-pay.samadi-capitaltm.workers.dev'),
  },
] as const;

export type FamilyId = (typeof family)[number]['id'];
