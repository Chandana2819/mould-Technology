"use client";

import {
    BadgeCheck,
    MapPin,
    Phone,
    Mail,
    Globe,
    LucideFacebook,
    LucideLinkedin,
    LucideTwitter,
    LucideYoutube,
} from "lucide-react";
import type { PlanTier } from "@/lib/packages";

type SocialLinks = {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
};

type Props = {
    planTier: PlanTier;
    name: string;
    location?: string;
    logoUrl?: string;
    coverImageUrl?: string;
    tagline?: string;
    tradeNames?: string[];
    phoneNumber?: string;
    email?: string;
    website?: string;
    socialLinks?: SocialLinks;
};

const TIER_STYLES: Record<
    Exclude<PlanTier, "free">,
    {
        badgeBg: string;
        badgeText: string;
        accent: string;
        label: string;
        gradient: string;
    }
> = {
    basic: {
        badgeBg: "bg-white",
        badgeText: "text-gray-700",
        accent: "border-gray-300",
        label: "Verified Supplier",
        gradient: "from-gray-600 to-gray-800",
    },
    professional: {
        badgeBg: "bg-white",
        badgeText: "text-amber-700",
        accent: "border-amber-400",
        label: "Premium Supplier",
        gradient: "from-amber-600 to-amber-800",
    },
    enterprise: {
        badgeBg: "bg-white",
        badgeText: "text-slate-900",
        accent: "border-slate-700",
        label: "Enterprise Partner",
        gradient: "from-slate-700 to-slate-950",
    },
};

function ContactItem({
    icon,
    children,
}: {
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <span className="flex items-center gap-1.5 text-white/90 text-sm drop-shadow">
            {icon}
            {children}
        </span>
    );
}

export default function SupplierPromotionBanner({
    planTier,
    name,
    location,
    logoUrl,
    coverImageUrl,
    tagline,
    tradeNames,
    phoneNumber,
    email,
    website,
    socialLinks,
}: Props) {
    if (planTier === "free") return null;

    const tier = TIER_STYLES[planTier];
    const social = socialLinks || {};
    const hasSocial =
        social.facebook || social.linkedin || social.twitter || social.youtube;
    const hasContactRow =
        phoneNumber || email || website || (tradeNames && tradeNames.length > 0);

    return (
        <div
            className={`w-full overflow-hidden rounded-2xl border ${tier.accent} shadow-xl bg-white mb-10`}
        >
            {/* HERO */}
            <div
                className={`relative min-h-[280px] md:min-h-[360px] bg-gradient-to-br ${tier.gradient}`}
            >
                {coverImageUrl && (
                    <img
                        src={coverImageUrl}
                        alt={name}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}

                {/* Scrims */}
                <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />

                {/* Verified Badge */}
                <div className="absolute top-6 left-6">
                    <div
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold shadow-lg ${tier.badgeBg} ${tier.badgeText}`}
                    >
                        <BadgeCheck className="w-4 h-4" />
                        {tier.label}
                    </div>
                </div>

                {/* Bottom overlay: identity + contact + social all live here */}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-white">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        {/* Identity */}
                        <div className="flex items-end gap-4">
                            {logoUrl && (
                                <img
                                    src={logoUrl}
                                    alt={`${name} logo`}
                                    className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-white object-contain p-1.5 shadow-lg shrink-0"
                                />
                            )}
                            <div>
                                <h2 className="text-2xl md:text-4xl font-bold leading-tight drop-shadow-lg">
                                    {name}
                                </h2>
                                {tagline && (
                                    <p className="mt-1 text-white/90 text-sm md:text-base drop-shadow">
                                        {tagline}
                                    </p>
                                )}
                                {location && (
                                    <div className="flex items-center gap-2 mt-1.5 text-white/90 drop-shadow text-sm">
                                        <MapPin className="w-4 h-4" />
                                        <span>{location}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Social */}
                        {hasSocial && (
                            <div className="flex gap-3 shrink-0">
                                {social.facebook && (
                                    <a
                                        href={social.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <LucideFacebook className="w-5 h-5 text-white/90 hover:text-white" />
                                    </a>
                                )}
                                {social.linkedin && (
                                    <a
                                        href={social.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <LucideLinkedin className="w-5 h-5 text-white/90 hover:text-white" />
                                    </a>
                                )}
                                {social.twitter && (
                                    <a
                                        href={social.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <LucideTwitter className="w-5 h-5 text-white/90 hover:text-white" />
                                    </a>
                                )}
                                {social.youtube && (
                                    <a
                                        href={social.youtube}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <LucideYoutube className="w-5 h-5 text-white/90 hover:text-white" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Contact row */}
                    {hasContactRow && (
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 pt-5 border-t border-white/20">
                            {phoneNumber && (
                                <ContactItem icon={<Phone className="w-3.5 h-3.5" />}>
                                    {phoneNumber}
                                </ContactItem>
                            )}
                            {email && (
                                <ContactItem icon={<Mail className="w-3.5 h-3.5" />}>
                                    {email}
                                </ContactItem>
                            )}
                            {website && (
                                <ContactItem icon={<Globe className="w-3.5 h-3.5" />}>
                                    <a
                                        href={website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                    >
                                        {website}
                                    </a>
                                </ContactItem>
                            )}
                            {tradeNames && tradeNames.length > 0 && (
                                <ContactItem icon={null}>
                                    <span className="text-white/70">Trade Names:</span>{" "}
                                    {tradeNames.join(", ")}
                                </ContactItem>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}