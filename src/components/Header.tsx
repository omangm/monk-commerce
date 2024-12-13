import logo from "@/assets/logo.svg";

export function Header() {
	return (
		<div className="flex items-center gap-2 border-2 border-b-[#d1d1d1] py-2">
			<img className="px-2" src={logo} alt="monk commerce" />
			<p className="text-lg font-semibold text-[#7E8185]">
				Monk Upsell & Cross-sell
			</p>
		</div>
	);
}
