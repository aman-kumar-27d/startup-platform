import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { Hero } from "@/components/ui/Hero";
import {
    getContentByKeys,
    getPublicProjects,
    getServices,
    resolveText,
} from "@/lib/public-content";
import { generatePageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
    return generatePageMetadata("HOME");
}

export default async function LandingPage() {
    // Fetch content blocks by their keys
    const contentMap = await getContentByKeys([
        "HOME_HERO",
        "HOME_INTRO",
        "HOME_SERVICES",
        "HOME_WORK",
        "HOME_CTA",
    ]);

    const [services, projects] = await Promise.all([
        getServices(),
        getPublicProjects(),
    ]);

    // Hero section
    const heroBlock = contentMap.get("HOME_HERO");
    const heroSubtitle = heroBlock?.subtitle;
    const heroCtaLabel = heroBlock?.ctaText;
    const heroCtaHref = heroBlock?.ctaLink ?? "/contact";

    // Intro section
    const introBlock = contentMap.get("HOME_INTRO");
    const introTitle = introBlock?.title;
    const introBody = introBlock?.description;

    // Services section
    const servicesBlock = contentMap.get("HOME_SERVICES");
    const servicesHeading = servicesBlock?.title;
    const servicesIntro = servicesBlock?.description;
    const servicesLinkLabel = servicesBlock?.ctaText;
    const servicesLinkHref = servicesBlock?.ctaLink ?? "/services";

    // Work section
    const workBlock = contentMap.get("HOME_WORK");
    const workHeading = workBlock?.title;
    const workIntro = workBlock?.description;
    const workLinkLabel = workBlock?.ctaText;
    const workLinkHref = workBlock?.ctaLink ?? "/work";

    // CTA section
    const ctaBlock = contentMap.get("HOME_CTA");
    const ctaTitle = ctaBlock?.title;
    const ctaBody = ctaBlock?.description;
    const ctaButtonLabel = ctaBlock?.ctaText;
    const ctaButtonHref = ctaBlock?.ctaLink ?? "/contact";

    const previewServices = services.slice(0, 6).map((service, index) => ({
        id: resolveText(service, ["id"]) ?? `service-${index}`,
        title: resolveText(service, ["title", "name", "label"]),
        description: resolveText(service, [
            "description",
            "summary",
            "body",
            "content",
        ]),
        icon: resolveText(service, ["icon", "emoji", "symbol"]),
    }));

    const featuredProjects = projects.slice(0, 6);

    return (
        <div className="bg-white">
            {/* Hero Section - Antigravity-inspired design */}
            <Hero
                title="Scale without"
                highlightedText="Gravity's reach."
                subtitle={
                    heroSubtitle ||
                    "A developer-first platform designed for high-impact deployments. Experience fluidity, speed, and immersive control."
                }
                primaryCtaText={heroCtaLabel || "Start Building Now"}
                primaryCtaHref={heroCtaHref}
                secondaryCtaText="View Demo"
                secondaryCtaHref="#work"
            />

            {/* Intro Section */}
            {(introTitle || introBody) && (
                <Section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-tr from-amber-30 via-white to-orange-30 pt-20">
                    <div className="absolute top-1/4 -left-20 w-150 h-150 bg-green-200/20 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-1/4 -right-20 w-150 h-150 bg-green-200/20 blur-[120px] rounded-full"></div>
                    {/* <div className="absolute inset-0 light-streak blur-3xl opacity-50 transform -rotate-12 translate-y-20"></div> */}
                    <div className="mx-auto max-w-4xl px-6 text-center">
                        {introTitle ? (
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">
                                {introTitle}
                            </p>
                        ) : null}
                        {introBody ? (
                            <p className="mt-4 text-xl text-slate-700 leading-relaxed">{introBody}</p>
                        ) : null}
                    </div>
                </Section>
            )}

            {/* Services Section */}
            <Section className="relative py-32 bg-white" id="services">
                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full light-streak blur-3xl opacity-30 transform -rotate-45">
                    </div>
                    <div className="absolute top-40 left-10 w-96 h-96 bg-amber-100/40 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-40 right-10 w-80 h-80 bg-orange-50/50 rounded-full blur-[100px]"></div>
                </div>
                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="mb-24 text-center">
                        {servicesHeading ? (
                            <span
                                className="text-orange-600 font-semibold tracking-widest text-xs uppercase mb-4 block">{servicesHeading}</span>
                        ) : null}
                        {servicesIntro ? (
                            <p className="text-xl text-slate-700 leading-relaxed">{servicesIntro}</p>
                        ) : null}
                        {/* <h2 className="text-5xl font-bold tracking-tight">Built for velocity</h2> */}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start relative min-h-225">
                        {previewServices.map((service, index) => {
                            const layout = [
                                "md:col-span-5 md:mt-20 antigravity-float-1",
                                "md:col-span-4 md:-mt-12 antigravity-float-2",
                                "md:col-span-3 md:mt-40 antigravity-float-3",
                                "md:col-start-3 md:col-span-6 md:-mt-24 antigravity-float-2",
                                "md:col-span-4 md:mt-12 antigravity-float-1",
                            ];
                            const cardStyles = [
                                "glass-card p-8 rounded-[2.5rem]",
                                "glass-card p-8 rounded-[2.5rem]",
                                "glass-card p-6 rounded-4xl",
                                "glass-card p-10 rounded-[3rem] border-orange-200/30",
                                "glass-card p-8 rounded-[2.5rem]",
                            ];
                            const iconWrap = [
                                "w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-8",
                                "w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8",
                                "w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6",
                                "w-0 h-0",
                                "w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8",
                            ];
                            const iconClass = [
                                "material-symbols-outlined text-amber-600 text-3xl",
                                "material-symbols-outlined text-blue-600 text-3xl",
                                "material-symbols-outlined text-purple-600 text-2xl",
                                "material-symbols-outlined text-orange-500 text-5xl opacity-20",
                                "material-symbols-outlined text-emerald-600 text-3xl",
                            ];
                            const titleClass = [
                                "text-2xl font-bold mb-4",
                                "text-2xl font-bold mb-4",
                                "text-xl font-bold mb-3",
                                "text-3xl font-bold mb-4",
                                "text-2xl font-bold mb-4",
                            ];
                            const bodyClass = [
                                "text-neutral-600 leading-relaxed",
                                "text-neutral-600 leading-relaxed",
                                "text-neutral-600 text-sm leading-relaxed",
                                "text-neutral-600 text-lg leading-relaxed",
                                "text-neutral-600 leading-relaxed",
                            ];
                            const position = index % layout.length;

                            return (
                                <div key={service.id} className={layout[position]}>
                                    <div className={cardStyles[position]}>
                                        {position === 3 ? (
                                            <div className="flex items-start justify-between mb-10">
                                                <div>
                                                    {service.title ? (
                                                        <h3 className={titleClass[position]}>{service.title}</h3>
                                                    ) : null}
                                                    {service.description ? (
                                                        <p className={bodyClass[position]}>{service.description}</p>
                                                    ) : null}
                                                </div>
                                                {service.icon ? (
                                                    <span className={iconClass[position]}>{service.icon}</span>
                                                ) : null}
                                            </div>
                                        ) : (
                                            <>
                                                {service.icon ? (
                                                    <div className={iconWrap[position]}>
                                                        <span className={iconClass[position]}>{service.icon}</span>
                                                    </div>
                                                ) : null}
                                                {service.title ? (
                                                    <h3 className={titleClass[position]}>{service.title}</h3>
                                                ) : null}
                                                {service.description ? (
                                                    <p className={bodyClass[position]}>{service.description}</p>
                                                ) : null}
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {previewServices.length && servicesLinkLabel ? (
                        <div className="mt-4">
                            <Button href={servicesLinkHref} variant="ghost">
                                {servicesLinkLabel} →
                            </Button>
                        </div>
                    ) : null}
                </div>
            </Section>


            {/* Work Section */}
            <Section className="py-32 px-4" id="work">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24 depth-layer-3">
                        {workHeading ? (
                            <h2 className="text-5xl md:text-7xl font-bold mb-6">{workHeading}</h2>
                        ) : null}
                        {workIntro ? (
                            <p className="text-black/40 text-xl max-w-2xl mx-auto">{workIntro}</p>
                        ) : null}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProjects.slice(0, 4).map((project, index) => {
                            const heightSet = ["h-100", "h-[400px]", "h-[400px]", "h-100"];
                            const backHeading = [
                                "Stack Details",
                                "Native Performance",
                                "Intelligence",
                                "Infrastructure",
                            ];
                            const backLists = [
                                [
                                    "React / Next.js 14",
                                    "Three.js Integration",
                                    "Tailwind Engine",
                                    "GSAP Motion",
                                ],
                                [
                                    "Swift / Kotlin",
                                    "Flutter Experts",
                                    "Tactile UI/UX",
                                    "Offline-First",
                                ],
                                [
                                    "Custom LLMs",
                                    "LangChain Dev",
                                    "Vector DBs",
                                    "Auto-Optimization",
                                ],
                                [
                                    "AWS / Azure",
                                    "Edge Computing",
                                    "Kubernetes",
                                    "Terraform IaC",
                                ],
                            ];
                            const cardHeight = heightSet[index] ?? heightSet[0];
                            const heading = backHeading[index] ?? backHeading[0];
                            const listItems = backLists[index] ?? backLists[0];
                            const statusText = project.status || "";

                            return (
                                <div
                                    key={project.id ?? `project-${index}`}
                                    className={`flip-card ${cardHeight} perspective-[1000px] cursor-pointer`}>
                                    <div className="flip-card-inner relative w-full h-full text-center">
                                        <div
                                            className="flip-card-front absolute inset-0 glass-card p-10 rounded-3xl flex flex-col justify-between">
                                            <div className="text-primary">
                                                <span className="material-symbols-outlined text-xl">{statusText}</span>
                                                {/* <Badge>{statusText}</Badge> */}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold mb-4">{project.name}</h3>
                                                <p className="text-sm text-white/60 leading-relaxed">
                                                    {project.description}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className="flip-card-back absolute inset-0 bg-primary rounded-3xl p-10 flex flex-col justify-center items-center text-background-dark">
                                            <h4 className="font-bold text-2xl mb-4">
                                                {project.description || heading}
                                            </h4>
                                            <ul className="text-sm font-bold space-y-2 opacity-80">
                                                {listItems.map((item) => (
                                                    <li key={item}>{item}</li>
                                                ))}
                                            </ul>
                                            <button
                                                className="mt-8 px-6 py-2 border-2 border-background-dark rounded-full font-bold text-sm">Explore
                                                Details</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {featuredProjects.length && workLinkLabel ? (
                        <div className="mt-4">
                            <Button href={workLinkHref} variant="ghost">
                                {workLinkLabel} →
                            </Button>
                        </div>
                    ) : null}
                </div>
            </Section>

            {/* Impact Section */}
            <Section className="py-40 px-4" id="impact">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                        <div className="depth-layer-3">
                            <h2 className="text-5xl md:text-7xl font-bold mb-6">Impact Realized</h2>
                            <p className="text-white/50 text-xl">Commercial-grade results for industry leaders.</p>
                        </div>
                        <a className="text-primary font-bold border-b-2 border-primary/30 pb-2 hover:border-primary transition-all text-xl"
                            href="#">All Projects →</a>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="group relative overflow-hidden rounded-[2.5rem] bg-accent-dark h-150 cursor-pointer">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                                style={{ backgroundImage: "linear-gradient(to top, #050505 0%, transparent 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBrFHKzoLpPtoXN_fJT066PbMU--mmNw9Bfd6FmMfI2TNolp9BaVzVlqrG2BOeANCu6b1A-5vL-a35I-EBVr5eLDhV4jIAI7tREWhZ9rQYVBSQG4CxZDlvIYL3aMgCeTWtGgxxeYMIjPYSftrOZaubxycnlnK68FH4oCqAWDQbJzGuHN2w1wVtv6DrB3zYsXYkBOXWzhUfLzBcD6PcGQdOzDqLdEtSeucB2GG1Wx2eu7ex8a0DRiq4sbJUNw-RzFRCTGsYbnQKFdcGc')" }}>
                            </div>
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity">
                            </div>
                            <div className="absolute bottom-0 p-12 w-full">
                                <span
                                    className="text-primary font-bold tracking-[0.3em] text-sm uppercase mb-6 block neon-text-glow">Fintech
                                    Evolution</span>
                                <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-white/80">Neobank Unified
                                    <br />Spatial
                                    Interface
                                </h3>
                                <div className="flex gap-16 border-t border-white/10 pt-8">
                                    <div>
                                        <div className="text-4xl font-bold text-primary mb-2">+40%</div>
                                        <div className="text-xs text-white/40 uppercase font-black tracking-widest">Performance
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-4xl font-bold text-primary mb-2">200k+</div>
                                        <div className="text-xs text-white/40 uppercase font-black tracking-widest">Active nodes
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="group relative overflow-hidden rounded-[2.5rem] bg-accent-dark h-150 cursor-pointer">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                                style={{ backgroundImage: "linear-gradient(to top, #050505 0%, transparent 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBK_VnoIN2Cs_tp83Kr7NrLCJpwI7iEMDgRywxZCfKc0KQk3Kk6naNP83ibKZZLSIM9p_45mlBUL2U3YNUKrgwmEbSroOeAQ2a2TSCvCQLGoE3h15eksh39JwWWlcrFwIP0KF4oqxbCJqG4Gc9hgMti7-zk2sRhNg0L_yROOWH0G_UZYEqjAC_CQuyv4DqnBciaPCYSKweKC--bMKf16vcBRf1lgrQ_XbknRgqngxHXn4NqXwY9mHBrt41DW-6ey2fWAoKGnVxibeb6')" }}>
                            </div>
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity">
                            </div>
                            <div className="absolute bottom-0 p-12 w-full">
                                <span
                                    className="text-primary font-bold tracking-[0.3em] text-sm uppercase mb-6 block neon-text-glow">Enterprise
                                    AI</span>
                                <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-white/80">Autonomous
                                    <br />Logistics
                                    Pipeline
                                </h3>
                                <div className="flex gap-16 border-t border-white/10 pt-8">
                                    <div>
                                        <div className="text-4xl font-bold text-primary mb-2">12ms</div>
                                        <div className="text-xs text-white/40 uppercase font-black tracking-widest">Global
                                            Latency</div>
                                    </div>
                                    <div>
                                        <div className="text-4xl font-bold text-primary mb-2">$2.4M</div>
                                        <div className="text-xs text-white/40 uppercase font-black tracking-widest">Efficiency
                                            GAIN</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* CTA Section */}
            <Section >
                <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6">
                    {ctaTitle ? (
                        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                            {ctaTitle}
                        </h2>
                    ) : null}
                    {ctaBody ? (
                        <p className="max-w-2xl text-base text-slate-600 leading-relaxed">{ctaBody}</p>
                    ) : null}
                    {ctaButtonLabel ? (
                        <Button href={ctaButtonHref} size="lg">
                            {ctaButtonLabel}
                        </Button>
                    ) : null}
                    {!ctaButtonLabel && heroCtaLabel ? (
                        <Button href={heroCtaHref} size="lg">
                            {heroCtaLabel}
                        </Button>
                    ) : null}
                </div>
            </Section>
        </div>
    );
}
