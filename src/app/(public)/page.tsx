import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import {
    getContentByKeys,
    getPublicProjects,
    getServices,
    resolveText,
} from "@/lib/public-content";
import { heroGradient, sectionGradient } from "@/lib/styles/gradients";
import { cardShadow, softGlow } from "@/lib/styles/shadows";

export const metadata: Metadata = {
    title: "Home",
    description: "Public-facing startup platform landing page.",
};

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
    const heroTitle = heroBlock?.title;
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
            <Section
                className={`relative overflow-hidden pb-20 pt-20 sm:pt-24 ${heroGradient}`}
            >
                <div className="absolute inset-0">
                    <div
                        className={`pointer-events-none absolute -top-32 right-0 h-64 w-64 rounded-full bg-slate-200/40 blur-3xl ${softGlow}`}
                    />
                    <div className="pointer-events-none absolute left-10 top-20 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />
                </div>
                <div className="relative mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div className="flex flex-col gap-6">
                        {heroTitle ? (
                            <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
                                {heroTitle}
                            </h1>
                        ) : null}
                        {heroSubtitle ? (
                            <p className="text-lg text-slate-600 sm:text-xl">{heroSubtitle}</p>
                        ) : null}
                        <div className="flex flex-wrap items-center gap-4">
                            {heroCtaLabel ? (
                                <Button href={heroCtaHref} size="lg">
                                    {heroCtaLabel}
                                </Button>
                            ) : null}
                        </div>
                    </div>
                    <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-8 shadow-sm shadow-slate-200/50">
                        {introTitle ? (
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                                {introTitle}
                            </p>
                        ) : null}
                        {introBody ? (
                            <p className="mt-4 text-lg text-slate-700">{introBody}</p>
                        ) : null}
                    </div>
                </div>
            </Section>

            <Section className={`border-t border-slate-100 ${sectionGradient}`}>
                <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6">
                    <div className="max-w-2xl">
                        {servicesHeading ? (
                            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                                {servicesHeading}
                            </h2>
                        ) : null}
                        {servicesIntro ? (
                            <p className="mt-3 text-base text-slate-600">{servicesIntro}</p>
                        ) : null}
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {previewServices.map((service) => (
                            <Card key={service.id} className={cardShadow}>
                                {service.icon ? (
                                    <span className="text-2xl" aria-hidden>
                                        {service.icon}
                                    </span>
                                ) : null}
                                {service.title ? (
                                    <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                        {service.title}
                                    </h3>
                                ) : null}
                                {service.description ? (
                                    <p className="mt-2 text-sm text-slate-600">
                                        {service.description}
                                    </p>
                                ) : null}
                            </Card>
                        ))}
                    </div>
                    {previewServices.length && servicesLinkLabel ? (
                        <div>
                            <Button href={servicesLinkHref} variant="ghost">
                                {servicesLinkLabel}
                            </Button>
                        </div>
                    ) : null}
                </div>
            </Section>

            <Section className="border-t border-slate-100">
                <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6">
                    <div className="max-w-2xl">
                        {workHeading ? (
                            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                                {workHeading}
                            </h2>
                        ) : null}
                        {workIntro ? (
                            <p className="mt-3 text-base text-slate-600">{workIntro}</p>
                        ) : null}
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {featuredProjects.map((project) => (
                            <Card key={project.id} className={cardShadow}>
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        {project.name}
                                    </h3>
                                    <Badge>{project.status}</Badge>
                                </div>
                                {project.description ? (
                                    <p className="mt-3 text-sm text-slate-600">
                                        {project.description}
                                    </p>
                                ) : null}
                            </Card>
                        ))}
                    </div>
                    {featuredProjects.length && workLinkLabel ? (
                        <div>
                            <Button href={workLinkHref} variant="ghost">
                                {workLinkLabel}
                            </Button>
                        </div>
                    ) : null}
                </div>
            </Section>

            <Section className="border-t border-slate-100">
                <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-6">
                    {ctaTitle ? (
                        <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                            {ctaTitle}
                        </h2>
                    ) : null}
                    {ctaBody ? (
                        <p className="max-w-2xl text-base text-slate-600">{ctaBody}</p>
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
                    {ctaButtonLabel ? null : null}
                </div>
            </Section>
        </div>
    );
}
