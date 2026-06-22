import IconBrandX from "@/assets/icons/IconBrandX.svg"
import IconFacebook from "@/assets/icons/IconFacebook.svg"
import IconGitHub from "@/assets/icons/IconGitHub.svg"
import IconLinkedin from "@/assets/icons/IconLinkedin.svg"
import IconMail from "@/assets/icons/IconMail.svg"
import IconPinterest from "@/assets/icons/IconPinterest.svg"
import IconTelegram from "@/assets/icons/IconTelegram.svg"
import IconWhatsapp from "@/assets/icons/IconWhatsapp.svg"
import { translateFor } from "@/i18n/utils"
import type { Props } from "astro"

type Translator = ReturnType<typeof translateFor>

interface Social {
  name: string
  href: string
  linkTitle: (t: Translator) => string
  icon: (_props: Props) => Element
}

export const SOCIALS: Social[] = [
  {
    name: "Github",
    href: "https://github.com/ycjcl868",
    linkTitle: (t: Translator) => t("socials.github"),
    icon: IconGitHub,
  },
  {
    name: "X",
    href: "https://x.com/ycjcl",
    linkTitle: (t: Translator) => t("socials.x"),
    icon: IconBrandX,
  },
  {
    name: "Mail",
    href: "mailto:chaolinjin@gmail.com",
    linkTitle: (t: Translator) => t("socials.mail"),
    icon: IconMail,
  },
] as const

export const SHARE_LINKS: Social[] = [
  {
    name: "WhatsApp",
    href: "https://wa.me/?text=",
    linkTitle: (t: Translator) => t("sharePost.via", { media: "WhatsApp" }),
    icon: IconWhatsapp,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/sharer.php?u=",
    linkTitle: (t: Translator) => t("sharePost.on", { media: "Facebook" }),
    icon: IconFacebook,
  },
  {
    name: "X",
    href: "https://x.com/intent/post?url=",
    linkTitle: (t: Translator) => t("sharePost.on", { media: "X" }),
    icon: IconBrandX,
  },
  {
    name: "Telegram",
    href: "https://t.me/share/url?url=",
    linkTitle: (t: Translator) => t("sharePost.via", { media: "Telegram" }),
    icon: IconTelegram,
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com/pin/create/button/?url=",
    linkTitle: (t: Translator) => t("sharePost.on", { media: "Pinterest" }),
    icon: IconPinterest,
  },
  {
    name: "Mail",
    href: "mailto:?subject=See%20this%20post&body=",
    linkTitle: (t: Translator) => t("sharePost.via", { media: "Mail" }),
    icon: IconMail,
  },
] as const
