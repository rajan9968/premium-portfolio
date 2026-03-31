import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";

const theme = {
    bg: "#0a0a0a",
    surface: "#111111",
    card: "#161616",
    accent: "#e8ff00",
    accentDim: "#c8e000",
    text: "#f0f0f0",
    muted: "#666",
    border: "#222",
};

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${theme.bg};
    color: ${theme.text};
    font-family: 'DM Sans', sans-serif;
    overflow-x: hidden;
    cursor: none;
  }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: ${theme.bg}; }
  ::-webkit-scrollbar-thumb { background: ${theme.accent}; }

  .syne { font-family: 'Syne', sans-serif; }

  a { text-decoration: none; color: inherit; }

  .noise {
    position: fixed; inset: 0; pointer-events: none; z-index: 999;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.35;
  }

  .cursor {
    position: fixed; width: 10px; height: 10px;
    background: ${theme.accent}; border-radius: 50%;
    pointer-events: none; z-index: 9999;
    transition: transform 0.15s ease, width 0.2s, height 0.2s;
    transform: translate(-50%, -50%);
  }

  .cursor-ring {
    position: fixed; width: 36px; height: 36px;
    border: 1.5px solid ${theme.accent}; border-radius: 50%;
    pointer-events: none; z-index: 9998;
    transition: all 0.25s ease;
    transform: translate(-50%, -50%);
    opacity: 0.5;
  }

  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 24px 48px;
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }

  nav .logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: -0.5px; }
  nav .logo span { color: ${theme.accent}; }

  nav ul { display: flex; gap: 36px; list-style: none; }
  nav ul a { font-size: 13px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; opacity: 0.6; transition: opacity 0.2s; }
  nav ul a:hover { opacity: 1; }

  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 28px; font-size: 13px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    cursor: none; border: none; transition: all 0.25s;
  }

  .btn-accent {
    background: ${theme.accent}; color: #000;
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  }
  .btn-accent:hover { background: #fff; transform: translateY(-1px); }

  .btn-ghost {
    background: transparent; color: ${theme.text};
    border: 1px solid ${theme.border};
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  }
  .btn-ghost:hover { border-color: ${theme.accent}; color: ${theme.accent}; }

  section { padding: 120px 48px; max-width: 1400px; margin: 0; }

  .tag {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.15em;
    text-transform: uppercase; color: ${theme.accent};
    margin-bottom: 24px;
  }
  .tag::before { content: ''; display: block; width: 20px; height: 1px; background: ${theme.accent}; }

  h1, h2 { font-family: 'Syne', sans-serif; }

  .divider { width: 100%; height: 1px; background: ${theme.border}; }

  .project-card {
    position: relative; overflow: hidden;
    border: 1px solid ${theme.border};
    background: ${theme.card};
    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
    transition: border-color 0.3s;
    cursor: none;
  }
  .project-card:hover { border-color: ${theme.accent}; }
  .project-card .img-wrap { aspect-ratio: 16/10; overflow: hidden; position: relative; }
  .project-card .img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
  .project-card:hover .img-wrap img { transform: scale(1.05); }
  .project-card .overlay {
    position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%);
    display: flex; flex-direction: column; justify-content: flex-end; padding: 24px;
    opacity: 0; transition: opacity 0.3s;
  }
  .project-card:hover .overlay { opacity: 1; }

  .service-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 28px 0; border-bottom: 1px solid ${theme.border};
    cursor: none; transition: padding-left 0.3s;
  }
  .service-row:hover { padding-left: 16px; }
  .service-row .num { font-family: 'Syne', sans-serif; font-size: 12px; color: ${theme.muted}; margin-right: 24px; }
  .service-row .arrow { font-size: 20px; color: ${theme.muted}; transition: color 0.3s, transform 0.3s; }
  .service-row:hover .arrow { color: ${theme.accent}; transform: translateX(6px); }
  .service-row:hover h3 { color: ${theme.accent}; }

  .tech-pill {
    display: inline-flex; align-items: center; gap: 10px;
    padding: 12px 20px; border: 1px solid ${theme.border};
    font-size: 13px; font-weight: 500; background: ${theme.card};
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
    transition: border-color 0.25s, color 0.25s;
  }
  .tech-pill:hover { border-color: ${theme.accent}; color: ${theme.accent}; }

  .stat-box {
    padding: 40px; border: 1px solid ${theme.border}; background: ${theme.card};
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
  }

  .testimonial-card {
    padding: 40px; border: 1px solid ${theme.border}; background: ${theme.card};
    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
    display: flex; flex-direction: column; gap: 20px;
  }

  footer {
    border-top: 1px solid ${theme.border};
    padding: 60px 48px;
  }

  @media (max-width: 768px) {
    nav { padding: 20px 24px; }
    nav ul { display: none; }
    section { padding: 80px 24px; }
    footer { padding: 40px 24px; }
  }
`;

// ---- Data ----
const projects = [
    { title: "NexaFlow CRM", tags: ["CRM", "React", "Node.js"], color: "#1a1a2e", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" },
    { title: "Luminary Store", tags: ["E-commerce", "UI/UX", "Shopify"], color: "#0d1117", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80" },
    { title: "Verdant App", tags: ["Mobile", "iOS", "React Native"], color: "#0a1628", img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80" },
    { title: "Axiom SaaS", tags: ["SaaS", "Dashboard", "Angular"], color: "#1a0a0a", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" },
    { title: "Solstice Brand", tags: ["Branding", "Logo", "Identity"], color: "#0a1a0a", img: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&q=80" },
    { title: "Orbit Real Estate", tags: ["Real Estate", "Landing", "UX"], color: "#1a1a0a", img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" },
];

const services = [
    { num: "01", title: "Website Development", sub: "React · Angular · Vue.js · Laravel" },
    { num: "02", title: "Branding & Design", sub: "UI/UX · Logo · Brand Identity" },
    { num: "03", title: "CRM Systems", sub: "Custom · Scalable · Integrated" },
    { num: "04", title: "E-commerce", sub: "Shopify · OpenCart · WooCommerce" },
    { num: "05", title: "Mobile Applications", sub: "iOS · Android · React Native" },
    { num: "06", title: "SEO Optimization", sub: "Technical · On-page · Content" },
];

const techs = ["React.js", "Node.js", "Angular", "Python", "Laravel", "Vue.js", "Figma", "AWS", "Firebase", "PostgreSQL", "Flutter", "TypeScript"];

const testimonials = [
    { name: "Sarah Mitchell", role: "CEO, Luminary Tech", text: "Working with this team transformed our entire digital presence. The attention to detail in both design and development is unmatched." },
    { name: "James Park", role: "Product Lead, NexaFlow", text: "They delivered a CRM that our entire team actually enjoys using. Clean, fast, and built exactly to our specifications." },
    { name: "Elena Vasquez", role: "CMO, Axiom Solutions", text: "From concept to launch in 6 weeks — and the quality exceeded every expectation. Our bounce rate dropped 40% immediately." },
];

// ---- Fade-in wrapper ----
function FadeIn({ children, delay = 0, direction = "up", className = "" }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    const variants = {
        hidden: { opacity: 0, y: direction === "up" ? 40 : direction === "down" ? -40 : 0, x: direction === "left" ? 40 : direction === "right" ? -40 : 0 },
        show: { opacity: 1, y: 0, x: 0, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] } },
    };
    return (
        <motion.div ref={ref} initial="hidden" animate={inView ? "show" : "hidden"} variants={variants} className={className}>
            {children}
        </motion.div>
    );
}

// ---- Custom Cursor ----
function Cursor() {
    const cursorRef = useRef(null);
    const ringRef = useRef(null);
    useEffect(() => {
        const move = (e) => {
            if (cursorRef.current) { cursorRef.current.style.left = e.clientX + "px"; cursorRef.current.style.top = e.clientY + "px"; }
            if (ringRef.current) { ringRef.current.style.left = e.clientX + "px"; ringRef.current.style.top = e.clientY + "px"; }
        };
        window.addEventListener("mousemove", move);
        return () => window.removeEventListener("mousemove", move);
    }, []);
    return (<><div className="cursor" ref={cursorRef} /><div className="cursor-ring" ref={ringRef} /></>);
}

// ---- Nav ----
function Nav() {
    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const h = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", h);
        return () => window.removeEventListener("scroll", h);
    }, []);
    return (
        <motion.nav style={{ background: scrolled ? "rgba(10,10,10,0.95)" : "transparent" }} initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <div className="logo syne">R<span>.</span>Dev</div>
            <ul>
                {["Portfolio", "Services", "Technologies", "About", "Contact"].map(l => (
                    <li key={l}><a href="#">{l}</a></li>
                ))}
            </ul>
            <button className="btn btn-accent syne">Let's Talk</button>
        </motion.nav>
    );
}

// ---- Hero ----
function Hero() {
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 120]);
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);

    const words = ["Design.", "Build.", "Launch."];
    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 100 }}>
            {/* BG grid */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(232,255,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,255,0,0.03) 1px, transparent 1px)`, backgroundSize: "80px 80px", pointerEvents: "none" }} />
            {/* glow */}
            <motion.div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,255,0,0.08) 0%, transparent 70%)", top: "10%", right: "5%", y }} />

            <motion.section style={{ opacity }}>
                <FadeIn delay={0.1}>
                    <div className="tag">Digital Agency — Est. 2018</div>
                </FadeIn>

                <div style={{ overflow: "hidden" }}>
                    {words.map((w, i) => (
                        <FadeIn key={w} delay={0.2 + i * 0.12}>
                            <h1 style={{ fontSize: "clamp(64px, 10vw, 140px)", fontWeight: 800, lineHeight: 0.92, letterSpacing: "-3px", color: i === 2 ? theme.accent : theme.text }}>
                                {w}
                            </h1>
                        </FadeIn>
                    ))}
                </div>

                <FadeIn delay={0.55}>
                    <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: 48, flexWrap: "wrap" }}>
                        <p style={{ maxWidth: 420, lineHeight: 1.7, color: theme.muted, fontSize: 16 }}>
                            We craft digital experiences that drive growth — from concept through code, with precision and creativity at every step.
                        </p>
                        <div style={{ display: "flex", gap: 16 }}>
                            <button className="btn btn-accent syne">View Portfolio ↗</button>
                            <button className="btn btn-ghost syne">Our Services</button>
                        </div>
                    </div>
                </FadeIn>

                <FadeIn delay={0.7}>
                    <div style={{ display: "flex", gap: 48, marginTop: 80, paddingTop: 48, borderTop: `1px solid ${theme.border}`, flexWrap: "wrap" }}>
                        {[["150+", "Clients Served"], ["8+", "Years Experience"], ["400+", "Projects Launched"], ["5.0★", "Avg. Rating"]].map(([val, label]) => (
                            <div key={label}>
                                <div className="syne" style={{ fontSize: 36, fontWeight: 800, color: theme.accent }}>{val}</div>
                                <div style={{ fontSize: 13, color: theme.muted, marginTop: 4 }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </motion.section>
        </div>
    );
}

// ---- Projects ----
function Projects() {
    const [active, setActive] = useState("All");
    const cats = ["All", "CRM", "E-commerce", "Mobile", "SaaS", "Branding"];
    const filtered = active === "All" ? projects : projects.filter(p => p.tags[0] === active);

    return (
        <section>
            <FadeIn><div className="tag">Selected Work</div></FadeIn>
            <FadeIn delay={0.1}>
                <h2 className="syne" style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: 40 }}>
                    Projects that<br /><span style={{ color: theme.accent }}>move the needle.</span>
                </h2>
            </FadeIn>

            {/* filter tabs */}
            <FadeIn delay={0.2}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 48 }}>
                    {cats.map(c => (
                        <button key={c} onClick={() => setActive(c)} className="btn" style={{
                            padding: "8px 20px", fontSize: 12, background: active === c ? theme.accent : "transparent",
                            color: active === c ? "#000" : theme.muted, border: `1px solid ${active === c ? theme.accent : theme.border}`,
                            clipPath: "none", cursor: "none", transition: "all 0.2s",
                        }}>{c}</button>
                    ))}
                </div>
            </FadeIn>

            <AnimatePresence mode="popLayout">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 24 }}>
                    {filtered.map((p, i) => (
                        <motion.div key={p.title} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, delay: i * 0.06 }}>
                            <div className="project-card">
                                <div className="img-wrap">
                                    <img src={p.img} alt={p.title} />
                                    <div className="overlay">
                                        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                                            {p.tags.map(t => <span key={t} style={{ fontSize: 10, padding: "3px 10px", background: "rgba(232,255,0,0.15)", color: theme.accent, border: `1px solid ${theme.accent}`, letterSpacing: "0.1em" }}>{t}</span>)}
                                        </div>
                                        <h3 className="syne" style={{ fontSize: 20, fontWeight: 700 }}>{p.title}</h3>
                                    </div>
                                </div>
                                <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{p.title}</h3>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            {p.tags.map(t => <span key={t} style={{ fontSize: 11, color: theme.muted }}>{t}</span>)}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: 20, color: theme.muted }}>↗</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </AnimatePresence>
        </section>
    );
}

// ---- Services ----
function Services() {
    return (
        <section>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
                <div>
                    <FadeIn><div className="tag">What We Do</div></FadeIn>
                    <FadeIn delay={0.1}>
                        <h2 className="syne" style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 800, letterSpacing: "-1.5px", lineHeight: 1.05, position: "sticky", top: 120 }}>
                            Full-cycle<br />digital<br /><span style={{ color: theme.accent }}>studio.</span>
                        </h2>
                    </FadeIn>
                </div>
                <div>
                    {services.map((s, i) => (
                        <FadeIn key={s.title} delay={i * 0.08}>
                            <div className="service-row">
                                <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                                    <span className="num">{s.num}</span>
                                    <div>
                                        <h3 className="syne" style={{ fontSize: 18, fontWeight: 700, transition: "color 0.3s", marginBottom: 4 }}>{s.title}</h3>
                                        <span style={{ fontSize: 12, color: theme.muted }}>{s.sub}</span>
                                    </div>
                                </div>
                                <span className="arrow">→</span>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ---- Technologies ----
function Technologies() {
    return (
        <section>
            <FadeIn><div className="tag">Our Stack</div></FadeIn>
            <FadeIn delay={0.1}>
                <h2 className="syne" style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: 48 }}>
                    Built with the<br /><span style={{ color: theme.accent }}>best tools.</span>
                </h2>
            </FadeIn>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {techs.map((t, i) => (
                    <FadeIn key={t} delay={i * 0.04}>
                        <motion.div className="tech-pill" whileHover={{ y: -4 }}>
                            <span style={{ width: 8, height: 8, background: theme.accent, borderRadius: "50%", display: "block" }} />
                            {t}
                        </motion.div>
                    </FadeIn>
                ))}
            </div>

            {/* CTA banner */}
            <FadeIn delay={0.3}>
                <div style={{ marginTop: 80, padding: "60px", background: theme.card, border: `1px solid ${theme.border}`, clipPath: "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
                    <div>
                        <h2 className="syne" style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px" }}>Ready to start a project?</h2>
                        <p style={{ color: theme.muted, marginTop: 8 }}>Let's build something extraordinary together.</p>
                    </div>
                    <div style={{ display: "flex", gap: 16 }}>
                        <button className="btn btn-accent syne">Start a Project ↗</button>
                        <button className="btn btn-ghost syne">Book a Call</button>
                    </div>
                </div>
            </FadeIn>
        </section>
    );
}

// ---- Testimonials ----
function Testimonials() {
    const [active, setActive] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setActive(a => (a + 1) % testimonials.length), 5000);
        return () => clearInterval(t);
    }, []);

    return (
        <section>
            <FadeIn><div className="tag">Client Stories</div></FadeIn>
            <FadeIn delay={0.1}>
                <h2 className="syne" style={{ fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: 48 }}>
                    Words from our<br /><span style={{ color: theme.accent }}>happy clients.</span>
                </h2>
            </FadeIn>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 24 }}>
                {testimonials.map((t, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                        <motion.div className="testimonial-card" animate={{ borderColor: active === i ? theme.accent : theme.border }} transition={{ duration: 0.4 }}>
                            <div style={{ fontSize: 36, color: theme.accent, lineHeight: 1, fontFamily: "Georgia, serif" }}>"</div>
                            <p style={{ color: theme.muted, lineHeight: 1.7, fontSize: 15 }}>{t.text}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 16, borderTop: `1px solid ${theme.border}` }}>
                                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${theme.accent}33, ${theme.accent}11)`, border: `1px solid ${theme.accent}44`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: theme.accent, fontSize: 16 }}>
                                    {t.name[0]}
                                </div>
                                <div>
                                    <div className="syne" style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                                    <div style={{ fontSize: 12, color: theme.muted }}>{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    </FadeIn>
                ))}
            </div>
        </section>
    );
}

// ---- Stats ----
function Stats() {
    const stats = [["400+", "Projects Delivered"], ["150+", "Happy Clients"], ["8+", "Years in Business"], ["5.0", "Clutch Rating"]];
    return (
        <section>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                {stats.map(([val, label], i) => (
                    <FadeIn key={label} delay={i * 0.1}>
                        <div className="stat-box">
                            <div className="syne" style={{ fontSize: 52, fontWeight: 800, color: theme.accent, lineHeight: 1 }}>{val}</div>
                            <div style={{ fontSize: 13, color: theme.muted, marginTop: 12 }}>{label}</div>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </section>
    );
}

// ---- FAQ ----
function FAQ() {
    const items = [
        { q: "How much does a website cost?", a: "Pricing depends on scope — from $2,000 for landing pages to $50,000+ for enterprise platforms. We provide detailed estimates after a free discovery call." },
        { q: "How long does development take?", a: "Most projects ship in 4–12 weeks. Simple landing pages take 2 weeks; complex SaaS builds can run 3–6 months." },
        { q: "Do you offer post-launch support?", a: "Yes. We offer monthly retainers covering updates, hosting management, performance monitoring, and feature additions." },
        { q: "What's the development process?", a: "Discovery → Design → Development → QA → Launch → Support. You're involved at every stage with weekly check-ins and a shared project board." },
    ];
    const [open, setOpen] = useState(null);
    return (
        <section>
            <FadeIn><div className="tag">FAQ</div></FadeIn>
            <FadeIn delay={0.1}>
                <h2 className="syne" style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: 48 }}>
                    Common <span style={{ color: theme.accent }}>questions.</span>
                </h2>
            </FadeIn>
            <div>
                {items.map((item, i) => (
                    <FadeIn key={i} delay={i * 0.07}>
                        <div style={{ borderBottom: `1px solid ${theme.border}`, overflow: "hidden" }}>
                            <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0", background: "none", border: "none", color: theme.text, cursor: "none", textAlign: "left" }}>
                                <span className="syne" style={{ fontSize: 18, fontWeight: 700 }}>{item.q}</span>
                                <motion.span animate={{ rotate: open === i ? 45 : 0 }} style={{ fontSize: 24, color: theme.accent, display: "block", lineHeight: 1 }}>+</motion.span>
                            </button>
                            <AnimatePresence>
                                {open === i && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                                        <p style={{ paddingBottom: 24, color: theme.muted, lineHeight: 1.7, maxWidth: 680 }}>{item.a}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </FadeIn>
                ))}
            </div>
        </section>
    );
}

// ---- Footer ----
function Footer() {
    return (
        <footer>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 40 }}>
                <div>
                    <div className="syne logo" style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Ra<span style={{ color: theme.accent }}>.</span>STUDIO</div>
                    <p style={{ color: theme.muted, fontSize: 13, maxWidth: 300, lineHeight: 1.6 }}>We design and build digital products that help businesses grow and stand out.</p>
                    <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                        {["Instagram", "Dribbble", "Behance", "LinkedIn"].map(s => (
                            <a key={s} href="#" style={{ fontSize: 12, color: theme.muted, padding: "6px 14px", border: `1px solid ${theme.border}`, transition: "color 0.2s, border-color 0.2s" }}
                                onMouseEnter={e => { e.target.style.color = theme.accent; e.target.style.borderColor = theme.accent; }}
                                onMouseLeave={e => { e.target.style.color = theme.muted; e.target.style.borderColor = theme.border; }}>
                                {s}
                            </a>
                        ))}
                    </div>
                </div>
                <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
                    {[["Services", ["Web Dev", "Design", "CRM", "Mobile", "SEO"]], ["Company", ["About", "Portfolio", "Blog", "Awards", "Contact"]]].map(([title, links]) => (
                        <div key={title}>
                            <div className="syne" style={{ fontWeight: 700, fontSize: 13, marginBottom: 16, color: theme.accent }}>{title}</div>
                            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                                {links.map(l => <li key={l}><a href="#" style={{ fontSize: 13, color: theme.muted, transition: "color 0.2s" }} onMouseEnter={e => e.target.style.color = theme.text} onMouseLeave={e => e.target.style.color = theme.muted}>{l}</a></li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ marginTop: 60, paddingTop: 24, borderTop: `1px solid ${theme.border}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <span style={{ fontSize: 12, color: theme.muted }}>© 2026 Nova.Studio — All rights reserved</span>
                <span style={{ fontSize: 12, color: theme.muted }}>Miami, FL · office@nova.studio</span>
            </div>
        </footer>
    );
}

// ---- Marquee ----
function Marquee() {
    const words = ["Website Development", "UI/UX Design", "CRM Systems", "Mobile Apps", "E-commerce", "SEO", "Branding"];
    return (
        <div style={{ borderTop: `1px solid ${theme.border}`, borderBottom: `1px solid ${theme.border}`, background: theme.card, overflow: "hidden", padding: "16px 0" }}>
            <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ display: "flex", gap: 48, width: "max-content" }}>
                {[...words, ...words].map((w, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: theme.muted, whiteSpace: "nowrap" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: theme.accent, display: "block" }} />
                        {w}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

// ---- App ----
export default function App() {
    return (
        <div style={{ background: theme.bg, minHeight: "100vh" }}>
            <style>{style}</style>
            <div className="noise" />
            <Cursor />
            <Nav />
            <Hero />
            <Marquee />
            <Projects />
            <div className="divider" style={{ maxWidth: 1400, margin: "0 auto", padding: "0 48px" }} />
            <Services />
            <Stats />
            <Technologies />
            <Testimonials />
            <FAQ />
            <Footer />
        </div>
    );
}