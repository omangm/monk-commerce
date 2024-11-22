import logo from "../images/logo.svg";

export function Header() {
    return (
        <div className="flex items-center gap-2 py-2 border-2 border-b-[#d1d1d1]">
            <img className="px-2" src={logo} alt="" />
            <p className="text-[#7E8185] font-semibold text-lg">Monk Upsell & Cross-sell</p>
        </div>
    )
}