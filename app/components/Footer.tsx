import Image from "next/image";
import Link from "next/link";
import { InstagramIcon } from "@/components/instagram-icon";
import { XIcon } from "@/components/x-icon";
import { Button } from "@/components/ui/button";
import { FullWidthDivider } from "@/components/full-width-divider";

export function Footer() {
	return (
		<footer className="relative w-full bg-[#171717] text-white">
			<div className="mx-auto w-full max-w-[948px] px-6 md:px-8">
			<FullWidthDivider position="top" className="bg-white/10" />
			<div className="grid grid-cols-6 gap-6 py-4">
				<div className="col-span-6 flex flex-col gap-4 pt-5 md:col-span-4">
					<Link className="w-max" href="/" aria-label="LAB19 — home">
						<Image
							src="/logo.png"
							alt="LAB19 — Sneakers & Lifestyles"
							width={343}
							height={95}
							className="h-6 w-auto"
						/>
					</Link>
					<p className="max-w-sm text-balance text-white/60 text-sm">
						Sneakers & lifestyles. Loud silhouettes, warm palette.
					</p>
					<div className="flex gap-2">
						{socialLinks.map((item, index) => (
							<Button
								asChild
								key={`social-${item.link}-${index}`}
								size="icon"
								variant="outline"
								className="border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
							>
								<a href={item.link} target="_blank" rel="noopener noreferrer">
									{item.icon}
								</a>
							</Button>
						))}
					</div>
				</div>
				<div className="col-span-3 w-full md:col-span-1">
					<span className="text-white/50 text-xs">Shop</span>
					<div className="mt-2 flex flex-col gap-2">
						{shop.map(({ href, title }) => (
							<Link
								className="w-max text-sm text-white/80 hover:text-[#FFE1BA] hover:underline"
								href={href}
								key={title}
							>
								{title}
							</Link>
						))}
					</div>
				</div>
				<div className="col-span-3 w-full md:col-span-1">
					<span className="text-white/50 text-xs">House</span>
					<div className="mt-2 flex flex-col gap-2">
						{house.map(({ href, title }) => (
							<Link
								className="w-max text-sm text-white/80 hover:text-[#FFE1BA] hover:underline"
								href={href}
								key={title}
							>
								{title}
							</Link>
						))}
					</div>
				</div>
			</div>
			<FullWidthDivider className="bg-white/10" />
			<div className="flex items-center justify-center gap-2 py-4">
				<p className="text-center font-light text-white/50 text-sm">
					&copy; 2026 Ecos Studio. All rights reserved.
				</p>
			</div>
			</div>
		</footer>
	);
}

const shop = [
	{ title: "New arrivals", href: "/shop" },
	{ title: "Essentials", href: "/essential" },
	{ title: "Supreme", href: "/supreme" },
	{ title: "Altro", href: "/altro" },
	{ title: "Brands", href: "/brands" },
];

const house = [
	{ title: "About", href: "/about" },
	{ title: "Campaign", href: "/campaign" },
	{ title: "Stockists", href: "/about" },
	{ title: "Contact", href: "/about" },
];

const socialLinks = [
	{ icon: <InstagramIcon />, link: "https://instagram.com" },
	{ icon: <XIcon />, link: "https://twitter.com" },
];
