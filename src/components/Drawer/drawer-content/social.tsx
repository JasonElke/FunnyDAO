import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as GitHub } from "../../../assets/icons/github.svg";
import { ReactComponent as Twitter } from "../../../assets/icons/twitter.svg";
import { ReactComponent as Discord } from "../../../assets/icons/discord.svg";
import DexScreener from "../../../assets/icons/dexscreen.png";
import Medium from "../../../assets/icons/medium.png";
import Telegram from "../../../assets/icons/telegram.png";

export default function Social() {
    return (
        <div className="social-row">
            {/*<Link href="#" target="_blank">*/}
            {/*    <SvgIcon color="primary" component={GitHub} />*/}
            {/*</Link>*/}

            <Link href="https://twitter.com/FunnyDAOFinance" target="_blank">
                <SvgIcon color="primary" component={Twitter} />
            </Link>

            {/*<Link href="#" target="_blank">*/}
            {/*    <SvgIcon color="primary" component={Discord} />*/}
            {/*</Link>*/}

            <Link className="tooltip-item" href="https://t.me/funnydaogroup" target="_blank">
                <img src={Telegram} alt=""/>
            </Link>

            {/*<Link href="#" target="_blank">*/}
            {/*    <img src={DexScreener} alt=""/>*/}
            {/*</Link>*/}

            {/*<Link className="tooltip-item" href="#" target="_blank">*/}
            {/*    <img src={Medium} alt=""/>*/}
            {/*</Link>*/}
        </div>
    );
}
