#!/usr/bin/env python3
"""Generate the focused WhatsApp-group landing pages.

Edit PAGES below (or add an entry), put the matching list in tools/build_data.py's
DERIVED table (or a top-level list in data/groups.json), then run:
    python3 tools/build_data.py && python3 tools/build_pages.py
Each page renders its invite links client-side from js/groups-data.js.
"""
import html, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://walinks.github.io"
HEAD = (ROOT / "tools/templates/head.html").read_text(encoding="utf-8")

ALL_PAGES = [  # (file stem, label, one-line blurb) — drives the "related" block
    ("jobs-whatsapp-groups", "General Jobs", "Alerts across Pakistan, the Gulf and online"),
    ("pakistan-jobs-whatsapp-groups", "Pakistan Jobs", "Government and private vacancy alerts"),
    ("uae-gulf-jobs-whatsapp-groups", "UAE & Gulf Jobs", "Dubai and Gulf hiring communities"),
    ("online-earning-whatsapp-groups", "Online Earning", "Freelancing and remote-work groups"),
    ("movies-web-series-whatsapp-groups", "Movies & Web Series", "Film and series discussion groups"),
    ("netflix-web-series-whatsapp-groups", "Netflix & Web Series", "OTT and binge-watch chat groups"),
    ("entertainment-funny-whatsapp-groups", "Entertainment & Funny", "Memes, jokes and light-hearted fun"),
    ("funny-memes-whatsapp-groups", "Funny & Memes", "Daily memes and humour groups"),
    ("friendship-whatsapp-groups", "Friendship & Chat", "Meet people and practise languages"),
]

PAGES = [
  {
    "stem": "pakistan-jobs-whatsapp-groups", "key": "pakistan-jobs", "icon": "🇵🇰",
    "title": "Pakistan Jobs WhatsApp Groups — Government & Private Job Alerts",
    "desc": "Join Pakistan jobs WhatsApp groups for government vacancies, private-sector openings and daily job alerts. Browse, search and join with one tap.",
    "keywords": "pakistan jobs whatsapp group, govt jobs whatsapp group pakistan, jobs alert pakistan, daily jobs group link",
    "h1": 'Pakistan Jobs <span class="accent">WhatsApp Groups</span>', "sub": "Government notices, private vacancies and daily alerts",
    "lead": "Job ads in Pakistan are scattered across newspapers, department websites and social media. WhatsApp groups pull a lot of that into one chat, so you can see new openings, last dates and test announcements without checking a dozen sources. The groups below are sorted in one list — search by name to find provincial, federal or city-focused communities.",
    "tips": [
      ("Check the source", "Treat a group post as a pointer. Open the official advertisement or department site before you apply."),
      ("Never pay to apply", "Genuine government posts do not ask for fees through chat. Be wary of anyone who asks for money or a CNIC photo."),
      ("Mute and check daily", "Busy groups get hundreds of messages. Mute notifications and scan once or twice a day for closing dates."),
    ],
    "faq": [
      ("Are these Pakistan jobs groups free to join?", "Yes. Every invite link here opens a normal WhatsApp group. You should never need to pay to join."),
      ("Why does a link say it is full or invalid?", "WhatsApp groups have a member limit and admins can reset invite links at any time. If one fails, try another group from the list."),
      ("Are the vacancies in these groups verified?", "Members and admins post the ads, and we do not verify each one. Always confirm on the official source before applying."),
    ],
  },
  {
    "stem": "uae-gulf-jobs-whatsapp-groups", "key": "uae-gulf-jobs", "icon": "🇦🇪",
    "title": "UAE & Gulf Jobs WhatsApp Groups — Dubai Vacancy Alerts",
    "desc": "Find UAE and Gulf jobs WhatsApp groups for Dubai vacancies, driver, nursing and IT roles. Browse the list and join active communities instantly.",
    "keywords": "uae jobs whatsapp group, dubai jobs whatsapp group, gulf jobs group link, job vacancy uae whatsapp",
    "h1": 'UAE &amp; Gulf Jobs <span class="accent">WhatsApp Groups</span>', "sub": "Dubai and Gulf vacancy communities in one list",
    "lead": "Hiring in the Gulf moves quickly, and many recruiters and job-seekers share openings directly in chat groups. This page collects communities focused on UAE and Gulf work, including general vacancy groups and role-specific ones such as software, nursing and cyber security. Use the search box to narrow the list to the role or city you care about.",
    "tips": [
      ("Verify the employer", "Look up the company and its licence before sharing documents. Real employers do not charge recruitment fees to candidates."),
      ("Keep documents private", "Share passport or visa copies only with an employer you have verified, never in a public group."),
      ("Match the role", "Join one or two groups for your trade rather than many, so important posts do not get buried."),
    ],
    "faq": [
      ("Can I find work in Dubai through these groups?", "They are a place to spot openings and ask questions. Hiring decisions and visas are handled by employers, so follow each company's official process."),
      ("Are Gulf job groups safe?", "Most members are job-seekers, but scams exist. Never pay for a job offer and be cautious with unknown recruiters who message you privately."),
      ("Why is a group link not working?", "Invite links can expire or reach the member limit. Try the next group on the list."),
    ],
  },
  {
    "stem": "online-earning-whatsapp-groups", "key": "online-earning", "icon": "💻",
    "title": "Online Earning & Online Jobs WhatsApp Groups",
    "desc": "Join online jobs and online earning WhatsApp groups to find remote work leads, freelancing tips and accounts or HR vacancies. Browse and join instantly.",
    "keywords": "online earning whatsapp group, online jobs whatsapp group, freelancing whatsapp group link, work from home group",
    "h1": 'Online Earning <span class="accent">WhatsApp Groups</span>', "sub": "Remote work, freelancing and career-skill communities",
    "lead": "Online earning is a mix of real freelance and remote work and a lot of get-rich-quick offers. The groups here lean toward job and career communities — online job leads, accounts and finance roles, HR and admin posts and daily job updates. Read the rules after you join, and be sceptical of anything promising guaranteed income.",
    "tips": [
      ("Be sceptical of guarantees", "If a post promises fixed daily income for little work, it is almost always a scam. Real freelance income depends on skills and clients."),
      ("Never send money first", "Do not pay registration, training or security fees to an unknown person to start a task."),
      ("Build a portfolio", "Use leads from groups to apply on established platforms, and keep samples of your work ready."),
    ],
    "faq": [
      ("Can I really earn money from these groups?", "Groups can point you to openings, but income comes from the work itself. Treat them as a source of leads, not a guarantee."),
      ("How do I spot an online-job scam?", "Warning signs include upfront fees, pressure to act fast, vague job details and requests to move chats to private messages."),
      ("Is joining free?", "Yes. If someone asks for payment to join or to unlock a task, leave the group."),
    ],
  },
  {
    "stem": "funny-memes-whatsapp-groups", "key": "funny-memes", "icon": "😂",
    "title": "Funny & Memes WhatsApp Groups — Join Daily Humour Communities",
    "desc": "Join funny and memes WhatsApp groups for daily jokes, viral clips and light-hearted chat. Browse the list, search by name and join with one tap.",
    "keywords": "funny whatsapp groups, memes whatsapp group link, jokes whatsapp group, comedy group link",
    "h1": 'Funny &amp; Memes <span class="accent">WhatsApp Groups</span>', "sub": "Daily jokes, meme dumps and clean fun",
    "lead": "Sometimes a group chat is just there to make you laugh. These communities are built around memes, jokes, funny clips and banter. Group rules differ a lot — some keep things family-friendly and others do not — so read the description when you join and leave if the content is not for you.",
    "tips": [
      ("Check the group rules", "Admins usually pin what is and is not allowed. Respect it to avoid being removed."),
      ("Mind your data", "Meme groups share lots of images and videos. Turn off auto-download so they do not eat mobile data."),
      ("Skip suspicious links", "Do not tap unknown links or forwarded 'prize' messages, even if they are shared as jokes."),
    ],
    "faq": [
      ("Are these groups suitable for children?", "Not necessarily. Content is posted by members and is not moderated by us, so use your judgement and parental controls."),
      ("Can I post my own memes?", "Usually yes, within each group's rules. Some groups limit posting to admins."),
      ("How do I leave a group I do not like?", "Open the group in WhatsApp, tap its name and choose Exit group."),
    ],
  },
  {
    "stem": "netflix-web-series-whatsapp-groups", "key": "netflix-web-series", "icon": "📺",
    "title": "Netflix & Web Series WhatsApp Groups — OTT Discussion Communities",
    "desc": "Join Netflix, OTT and web series WhatsApp groups to talk about new releases and recommendations. Browse the list and join active communities.",
    "keywords": "netflix whatsapp group, web series whatsapp group link, ott whatsapp group, series discussion group",
    "h1": 'Netflix &amp; Web Series <span class="accent">WhatsApp Groups</span>', "sub": "Talk about what you are watching, spoiler-free or not",
    "lead": "Streaming libraries are huge, and the best recommendations usually come from other viewers. These groups are focused on Netflix, OTT platforms and web series, where members swap watch-lists and talk about new seasons. Use them for discussion and discovery, and watch content through the official services.",
    "tips": [
      ("Use official platforms", "Stream through licensed services. Links to pirated copies can carry malware and break copyright law."),
      ("Respect spoilers", "Wait before sharing plot twists, or use spoiler warnings so others can catch up."),
      ("Ask for recommendations", "Tell the group what you liked recently — you will get better suggestions than from a generic list."),
    ],
    "faq": [
      ("Do these groups share free Netflix accounts?", "Sharing account logins breaks the platform's terms and is risky. Use your own subscription."),
      ("Can I find new-release news here?", "Members often post release dates and trailers, but treat it as chat, not an official source."),
      ("What if a group is full?", "WhatsApp caps group size. Try another group on the list or check back after links are refreshed."),
    ],
  },
]

def e(s): return html.escape(s, quote=True)

def related(stem):
    cards = "".join(
        f'<a href="/{s}"><span>{e(l)}</span><small>{e(b)}</small></a>'
        for s, l, b in ALL_PAGES if s != stem)
    return cards

def build(p, count):
    url = f"{SITE}/{p['stem']}"
    head = (HEAD.replace("{{TITLE}}", e(p["title"])).replace("{{DESC}}", e(p["desc"]))
                .replace("{{KEYWORDS}}", e(p["keywords"])).replace("{{URL}}", url))
    crumb = json.dumps({
        "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "WhatsApp Groups", "item": SITE + "/whatsapp-groups"},
            {"@type": "ListItem", "position": 3, "name": p["title"].split(" — ")[0], "item": url}]}, indent=2)
    faq_ld = json.dumps({
        "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in p["faq"]]}, indent=2)
    tips = "".join(
        f'<div class="card feature-card" data-reveal><div class="feature-icon">{ic}</div><h3 class="feature-title">{e(t)}</h3><p class="feature-desc">{e(d)}</p></div>'
        for ic, (t, d) in zip(["🔎", "🚫", "🔔"], p["tips"]))
    faq = "".join(
        f'<div class="faq-item"><button class="faq-q" aria-expanded="false">{e(q)}<span class="faq-icon">+</span></button><div class="faq-a"><p>{e(a)}</p></div></div>'
        for q, a in p["faq"])
    return f'''{head}
  <script type="application/ld+json">
{crumb}
  </script>
  <script type="application/ld+json">
{faq_ld}
  </script>
</head>
<body>

<div id="header-root"></div>

<main id="main-content">

  <section class="hero groups-hero" aria-labelledby="page-title">
    <div class="container">
      <div class="hero-inner">
        <div class="hero-content">
          <div class="hero-badge" role="note"><span class="hero-badge-dot"></span>{p["icon"]} {count} groups listed</div>
          <h1 class="hero-title" id="page-title">{p["h1"]}<br/>{e(p["sub"])}</h1>
          <p class="hero-desc">{e(p["lead"])}</p>
          <div class="hero-actions">
            <a href="#groups-list" class="btn btn--primary btn--lg">Browse Groups</a>
            <a href="/whatsapp-groups" class="btn btn--outline btn--lg">All Categories</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="groups-list" aria-labelledby="groups-title">
    <div class="container">
      <div class="section-header section-header--center" data-reveal>
        <p class="section-label">Join instantly</p>
        <h2 class="section-title" id="groups-title">{e(p["title"].split(" — ")[0])}</h2>
        <p class="section-subtitle">Tap Join to open the invite in WhatsApp, or copy the link to share. Groups can fill up or reset their links — if one fails, try another.</p>
      </div>
      <div class="groups-grid" id="groups-grid" data-groups="{p["key"]}" data-cta="Join Group on WhatsApp"></div>
      <div class="info-banner" data-reveal>
        <h3 style="font-size:1.2rem;">Stay safe in public groups</h3>
        <p style="max-width:620px;margin:.5rem auto 0;color:var(--ink-3);">Anyone can join these groups, so your phone number is visible to other members. Do not share personal documents, OTP codes or payment details in a group chat.</p>
      </div>
    </div>
  </section>

  <section class="section section--tinted" aria-labelledby="tips-title">
    <div class="container">
      <div class="section-header section-header--center" data-reveal>
        <p class="section-label">Good to know</p>
        <h2 class="section-title" id="tips-title">Tips before you join</h2>
      </div>
      <div class="features-grid">{tips}</div>
    </div>
  </section>

  <section class="section section--alt" id="faq" aria-labelledby="faq-title">
    <div class="container">
      <div class="section-header section-header--center" data-reveal>
        <p class="section-label">FAQs</p>
        <h2 class="section-title" id="faq-title">Frequently Asked Questions</h2>
      </div>
      <div class="faq-list" style="max-width:860px;margin:0 auto;">{faq}</div>
    </div>
  </section>

  <section class="section" aria-labelledby="related-title">
    <div class="container">
      <div class="section-header section-header--center" data-reveal>
        <p class="section-label">Keep exploring</p>
        <h2 class="section-title" id="related-title">More WhatsApp Group Categories</h2>
      </div>
      <div class="related-groups" data-reveal>{related(p["stem"])}</div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="cta-banner" data-reveal>
        <div class="cta-banner-content">
          <p class="cta-banner-eyebrow">Need a WhatsApp link?</p>
          <h2 class="cta-banner-title">Create Your Own Click-to-Chat Link</h2>
          <p class="cta-banner-desc">Generate wa.me links for your business, customer support or personal profile — free and instant.</p>
          <a href="/#generator" class="btn btn--primary btn--lg">Go to WhatsApp Link Generator →</a>
        </div>
      </div>
    </div>
  </section>
</main>

<div id="footer-root"></div>
<div id="toast-container" aria-live="polite"></div>
<button id="back-top" aria-label="Back to top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg></button>

<script src="components/header.js"></script>
<script src="components/footer.js"></script>
<script src="js/app.js"></script>
<script src="js/groups-data.js"></script>
<script src="js/groups.js"></script>
</body>
</html>
'''

def main():
    data = json.loads(re.sub(r'^/\*.*?\*/\s*window\.WA_GROUPS = |;\s*$', '', (ROOT / "js/groups-data.js").read_text(encoding="utf-8"), flags=re.S))
    for p in PAGES:
        n = len(data[p["key"]])
        (ROOT / f"{p['stem']}.html").write_text(build(p, n), encoding="utf-8")
        print(p["stem"], n)

if __name__ == "__main__":
    main()
