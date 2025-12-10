import * as React from "react"
import { Block, SocialIconsBlock, SectionHeader, SocialPlatform } from "../types"
import { nmTheme } from "../theme"
import { InputField, SelectField, SectionContainer, createId, StylingGroup, applyBlockStyles } from "../utils"

// Social platform icons (SVG paths)
const SOCIAL_ICONS: Record<SocialPlatform, { viewBox: string; path: string; brandColor: string }> = {
    facebook: {
        viewBox: "0 0 24 24",
        path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
        brandColor: "#1877F2"
    },
    twitter: {
        viewBox: "0 0 24 24",
        path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
        brandColor: "#000000"
    },
    instagram: {
        viewBox: "0 0 24 24",
        path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
        brandColor: "#E4405F"
    },
    linkedin: {
        viewBox: "0 0 24 24",
        path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
        brandColor: "#0A66C2"
    },
    youtube: {
        viewBox: "0 0 24 24",
        path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
        brandColor: "#FF0000"
    },
    tiktok: {
        viewBox: "0 0 24 24",
        path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
        brandColor: "#000000"
    },
    pinterest: {
        viewBox: "0 0 24 24",
        path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z",
        brandColor: "#E60023"
    },
    snapchat: {
        viewBox: "0 0 24 24",
        path: "M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.12-.063-.18-.015-.255.181-.465.421-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z",
        brandColor: "#FFFC00"
    },
    whatsapp: {
        viewBox: "0 0 24 24",
        path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
        brandColor: "#25D366"
    },
    telegram: {
        viewBox: "0 0 24 24",
        path: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
        brandColor: "#26A5E4"
    },
    discord: {
        viewBox: "0 0 24 24",
        path: "M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z",
        brandColor: "#5865F2"
    },
    slack: {
        viewBox: "0 0 24 24",
        path: "M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z",
        brandColor: "#4A154B"
    },
    github: {
        viewBox: "0 0 24 24",
        path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
        brandColor: "#181717"
    },
    gitlab: {
        viewBox: "0 0 24 24",
        path: "M23.955 13.587l-1.342-4.135-2.664-8.189c-.135-.423-.73-.423-.867 0L16.418 9.45H7.582L4.919 1.263C4.783.84 4.185.84 4.05 1.26L1.386 9.449.044 13.587a.803.803 0 0 0 .292.896l11.358 8.259a.25.25 0 0 0 .292 0l11.358-8.259a.803.803 0 0 0 .292-.896",
        brandColor: "#FC6D26"
    },
    stackoverflow: {
        viewBox: "0 0 24 24",
        path: "M15.725 0l-1.72 1.277 6.39 8.588 1.716-1.277L15.725 0zm-3.94 3.418l-1.369 1.644 8.225 6.85 1.369-1.644-8.225-6.85zm-3.15 4.465l-.905 1.94 9.702 4.517.904-1.94-9.701-4.517zm-1.85 4.86l-.44 2.093 10.473 2.201.44-2.092-10.473-2.203zM1.89 15.47V24h19.19v-8.53h-2.133v6.397H4.021v-6.396H1.89zm4.265 2.133v2.13h10.66v-2.13H6.154Z",
        brandColor: "#F58025"
    },
    email: {
        viewBox: "0 0 24 24",
        path: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
        brandColor: "#EA4335"
    },
    phone: {
        viewBox: "0 0 24 24",
        path: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z",
        brandColor: "#34A853"
    },
    website: {
        viewBox: "0 0 24 24",
        path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
        brandColor: "#4285F4"
    },
    custom: {
        viewBox: "0 0 24 24",
        path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z",
        brandColor: "#666666"
    }
}

export function SocialIconsEditor({
    block,
    onChange,
}: {
    block: SocialIconsBlock
    onChange: (b: Block) => void
}) {
    const header = block.header ?? {}
    const updateHeader = (patch: Partial<SectionHeader>) => onChange({ ...block, header: { ...header, ...patch } })
    const update = (patch: Partial<SocialIconsBlock>) => onChange({ ...block, ...patch })
    const updateItems = (updater: (items: SocialIconsBlock["items"]) => SocialIconsBlock["items"]) =>
        onChange({ ...block, items: updater(block.items) })

    return (
        <div className="space-y-3 text-[11px]">
            <InputField label="العنوان" value={header.title ?? ""} onChange={(v) => updateHeader({ title: v || undefined })} />

            <SelectField
                label="التخطيط"
                value={block.layout}
                onChange={(v) => update({ layout: v as SocialIconsBlock["layout"] })}
                options={[
                    { value: "horizontal", label: "أفقي" },
                    { value: "vertical", label: "عمودي" },
                    { value: "grid", label: "شبكة" },
                    { value: "circular", label: "دائري" },
                ]}
            />

            {block.layout === "grid" && (
                <SelectField
                    label="الأعمدة"
                    value={String(block.columns ?? 3)}
                    onChange={(v) => update({ columns: Number(v) as 2 | 3 | 4 })}
                    options={[
                        { value: "2", label: "عمودين" },
                        { value: "3", label: "3 أعمدة" },
                        { value: "4", label: "4 أعمدة" },
                    ]}
                />
            )}

            <div className="grid grid-cols-2 gap-2">
                <SelectField
                    label="حجم الأيقونة"
                    value={block.iconSize}
                    onChange={(v) => update({ iconSize: v as SocialIconsBlock["iconSize"] })}
                    options={[
                        { value: "small", label: "صغير" },
                        { value: "medium", label: "متوسط" },
                        { value: "large", label: "كبير" },
                        { value: "xlarge", label: "كبير جداً" },
                    ]}
                />

                <SelectField
                    label="الشكل"
                    value={block.iconStyle}
                    onChange={(v) => update({ iconStyle: v as SocialIconsBlock["iconStyle"] })}
                    options={[
                        { value: "square", label: "مربع" },
                        { value: "rounded", label: "مدور" },
                        { value: "circle", label: "دائري" },
                    ]}
                />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <SelectField
                    label="التعبئة"
                    value={block.iconFill}
                    onChange={(v) => update({ iconFill: v as SocialIconsBlock["iconFill"] })}
                    options={[
                        { value: "solid", label: "ممتلئ" },
                        { value: "outline", label: "حدود" },
                        { value: "ghost", label: "شفاف" },
                    ]}
                />

                <SelectField
                    label="المسافة"
                    value={block.gap}
                    onChange={(v) => update({ gap: v as SocialIconsBlock["gap"] })}
                    options={[
                        { value: "tight", label: "ضيق" },
                        { value: "normal", label: "عادي" },
                        { value: "loose", label: "واسع" },
                    ]}
                />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <SelectField
                    label="المحاذاة"
                    value={block.alignment}
                    onChange={(v) => update({ alignment: v as SocialIconsBlock["alignment"] })}
                    options={[
                        { value: "left", label: "يسار" },
                        { value: "center", label: "وسط" },
                        { value: "right", label: "يمين" },
                    ]}
                />

                <SelectField
                    label="تأثير التمرير"
                    value={block.hoverEffect}
                    onChange={(v) => update({ hoverEffect: v as SocialIconsBlock["hoverEffect"] })}
                    options={[
                        { value: "none", label: "بدون" },
                        { value: "scale", label: "تكبير" },
                        { value: "lift", label: "رفع" },
                        { value: "rotate", label: "دوران" },
                        { value: "glow", label: "توهج" },
                    ]}
                />
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={block.useCustomColors}
                        onChange={(e) => update({ useCustomColors: e.target.checked })}
                        className="rounded"
                    />
                    <span>استخدام ألوان مخصصة</span>
                </label>

                {block.useCustomColors && (
                    <div className="grid grid-cols-2 gap-2">
                        <InputField
                            label="اللون"
                            value={block.customColor ?? "#666666"}
                            onChange={(v) => update({ customColor: v })}
                            type="color"
                        />
                        <InputField
                            label="لون التمرير"
                            value={block.customHoverColor ?? "#333333"}
                            onChange={(v) => update({ customHoverColor: v })}
                            type="color"
                        />
                    </div>
                )}
            </div>

            <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">الأيقونات الاجتماعية</span>
                    <button
                        type="button"
                        onClick={() =>
                            updateItems((items) => [
                                ...items,
                                {
                                    id: createId(),
                                    platform: "facebook",
                                    url: "https://facebook.com",
                                },
                            ])
                        }
                        className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-[11px]"
                    >
                        + إضافة أيقونة
                    </button>
                </div>
                {block.items.map((item) => (
                    <div key={item.id} className="space-y-1 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                        <SelectField
                            label="المنصة"
                            value={item.platform}
                            onChange={(v) =>
                                updateItems((items) =>
                                    items.map((i) => (i.id === item.id ? { ...i, platform: v as typeof item.platform } : i)),
                                )
                            }
                            options={[
                                { value: "facebook", label: "Facebook" },
                                { value: "twitter", label: "Twitter/X" },
                                { value: "instagram", label: "Instagram" },
                                { value: "linkedin", label: "LinkedIn" },
                                { value: "youtube", label: "YouTube" },
                                { value: "tiktok", label: "TikTok" },
                                { value: "pinterest", label: "Pinterest" },
                                { value: "snapchat", label: "Snapchat" },
                                { value: "whatsapp", label: "WhatsApp" },
                                { value: "telegram", label: "Telegram" },
                                { value: "discord", label: "Discord" },
                                { value: "slack", label: "Slack" },
                                { value: "github", label: "GitHub" },
                                { value: "gitlab", label: "GitLab" },
                                { value: "stackoverflow", label: "Stack Overflow" },
                                { value: "email", label: "Email" },
                                { value: "phone", label: "Phone" },
                                { value: "website", label: "Website" },
                                { value: "custom", label: "Custom" },
                            ]}
                        />
                        <InputField
                            label="الرابط"
                            value={item.url}
                            onChange={(v) => updateItems((items) => items.map((i) => (i.id === item.id ? { ...i, url: v } : i)))}
                        />
                        {item.platform === "custom" && (
                            <InputField
                                label="التسمية"
                                value={item.customLabel ?? ""}
                                onChange={(v) =>
                                    updateItems((items) =>
                                        items.map((i) => (i.id === item.id ? { ...i, customLabel: v || undefined } : i)),
                                    )
                                }
                            />
                        )}
                        <button
                            type="button"
                            onClick={() => updateItems((items) => items.filter((i) => i.id !== item.id))}
                            className="text-[11px] text-red-500"
                        >
                            حذف الأيقونة
                        </button>
                    </div>
                ))}
            </div>

            <StylingGroup block={block} onChange={update} />
        </div>
    )
}

export function SocialIconsView({ block }: { block: SocialIconsBlock }) {
    const header = block.header
    const { hoverStyles, ...blockProps } = applyBlockStyles(block.blockStyles)

    // Size mapping
    const sizeMap = {
        small: "h-8 w-8",
        medium: "h-12 w-12",
        large: "h-16 w-16",
        xlarge: "h-20 w-20",
    }

    // Gap mapping
    const gapMap = {
        tight: "gap-2",
        normal: "gap-4",
        loose: "gap-6",
    }

    // Border radius mapping
    const radiusMap = {
        square: "rounded-none",
        rounded: "rounded-lg",
        circle: "rounded-full",
    }

    // Alignment mapping
    const alignmentMap = {
        left: "justify-start",
        center: "justify-center",
        right: "justify-end",
    }

    // Hover effect classes
    const hoverEffectMap = {
        none: "",
        scale: "hover:scale-110",
        lift: "hover:-translate-y-1 hover:shadow-lg",
        rotate: "hover:rotate-12",
        glow: "hover:shadow-lg hover:shadow-current",
    }

    // Layout classes
    const layoutClasses = {
        horizontal: `flex flex-wrap ${alignmentMap[block.alignment]} ${gapMap[block.gap]}`,
        vertical: `flex flex-col ${alignmentMap[block.alignment]} ${gapMap[block.gap]}`,
        grid: `grid ${block.columns === 2 ? "grid-cols-2" : block.columns === 3 ? "grid-cols-3" : "grid-cols-4"} ${gapMap[block.gap]} ${alignmentMap[block.alignment] === "justify-center" ? "justify-items-center" : ""}`,
        circular: "relative",
    }

    const renderIcon = (item: typeof block.items[0], index: number) => {
        const iconData = SOCIAL_ICONS[item.platform]
        const color = block.useCustomColors ? block.customColor : iconData.brandColor
        const hoverColor = block.useCustomColors ? block.customHoverColor : iconData.brandColor

        const iconClasses = `
            ${sizeMap[block.iconSize]}
            ${radiusMap[block.iconStyle]}
            ${hoverEffectMap[block.hoverEffect]}
            flex items-center justify-center
            transition-all duration-300
            ${block.iconFill === "solid"
                ? "text-white"
                : block.iconFill === "outline"
                    ? "border-2"
                    : ""
            }
        `.trim()

        const iconStyle: React.CSSProperties = {
            backgroundColor: block.iconFill === "solid" ? color : "transparent",
            borderColor: block.iconFill === "outline" ? color : undefined,
            color: block.iconFill === "solid" ? "white" : color,
        }

        return (
            <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={iconClasses}
                style={iconStyle}
                title={item.platform}
            >
                <svg viewBox={iconData.viewBox} fill="currentColor" className="h-1/2 w-1/2">
                    <path d={iconData.path} />
                </svg>
            </a>
        )
    }

    return (
        <>
            {hoverStyles && <style>{hoverStyles}</style>}
            <SectionContainer
                {...blockProps}
                className={blockProps.className || ""}
                backgroundColor={block.backgroundColor}
                padding={block.padding}
                containerWidth={block.containerWidth}
            >
                {header?.title && (
                    <div className="mb-6 text-center">
                        <h2 className={`mb-3 ${nmTheme.textSection.title}`}>{header.title}</h2>
                    </div>
                )}
                <div className={layoutClasses[block.layout]}>
                    {block.items.map((item, index) => renderIcon(item, index))}
                </div>
            </SectionContainer>
        </>
    )
}
