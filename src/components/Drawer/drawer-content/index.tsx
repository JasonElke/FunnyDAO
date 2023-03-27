import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./social";
import DashboardIcon from "../../../assets/icons/dashboard-sidebar.svg";
import StakeIcon from "../../../assets/icons/stake-sidebar.svg";
import MintIcon from "../../../assets/icons/mint-sidebar.svg";
import SwapIcon from "../../../assets/icons/swap-sidebar.svg";
import CalculatorIcon from "../../../assets/icons/calculator-sidebar.svg";
import GameIcon from "../../../assets/icons/game-sidebar.svg";
import DocsIcon from "../../../assets/icons/document-sidebar.svg";
import { trim, shorten } from "../../../helpers";
import { useAddress } from "../../../hooks";
import useBonds from "../../../hooks/bonds";
import { Link } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./drawer-content.scss";
import MaiaIcon from "../../../assets/icons/logo.svg";
import classnames from "classnames";

function SideBar() {
    const [isActive] = useState();
    const address = useAddress();
    const { bonds } = useBonds();

    const checkPage = useCallback((location: any, page: string): boolean => {
        const currentPath = location.pathname.replace("/", "");
        if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
            return true;
        }
        if (currentPath.indexOf("stake") >= 0 && page === "stake") {
            return true;
        }
        if (currentPath.indexOf("mints") >= 0 && page === "mints") {
            return true;
        }
        if (currentPath.indexOf("calculator") >= 0 && page === "calculator") {
            return true;
        }
        if (currentPath.indexOf("game-nft") >= 0 && page === "game-nft") {
            return true;
        }
        return false;
    }, []);

    return (
        <div className="dapp-sidebar">
            <div className="branding-header">
                {/*https://maiadao.io*/}
                <Link href="https://funnydao.finance/" target="_blank" className="logo-fny">
                    <img alt="" src={MaiaIcon} />
                </Link>

                {address && (
                    <div className="wallet-link">
                        <Link href={`https://testnet.bscscan.com/address/${address}`} target="_blank">
                            <p>{shorten(address)}</p>
                        </Link>
                    </div>
                )}
            </div>

            <div className="dapp-menu-links">
                <div className="dapp-nav">
                    <Link
                        component={NavLink}
                        to="/dashboard"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "dashboard");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img src={DashboardIcon} alt=""/>
                            <p>Dashboard</p>
                        </div>
                    </Link>

                    <Link
                        component={NavLink}
                        to="/stake"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "stake");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img src={StakeIcon} alt=""/>
                            <p>Stake</p>
                        </div>
                    </Link>

                    <Link
                        component={NavLink}
                        id="bond-nav"
                        to="/mints"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "mints");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                             <img alt="" src={MintIcon} />
                            <p>Mint</p>
                        </div>
                    </Link>

                    {/* <div className="bond-discounts">
                        <p>Mint discounts</p>
                        {bonds.map((bond, i) => (bond.isClosed ?  "" :
                            <Link component={NavLink} to={`/mints/${bond.name}`} key={i} className={"bond"}>
                                {!bond.bondDiscount ? (
                                    <Skeleton variant="text" width={"150px"} />
                                ) : (
                                    <p>
                                        {bond.displayName}
                                        <span className="bond-pair-roi">{bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%</span>
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div> */}

                    <Link className="button-dapp-menu" href="https://pancake.kiemtienonline360.com/#/swap?outputCurrency=0xB9E3B00c7b45e2370d68593A04eAbbF6601305cC&chain=testnet" target="_blank">
                        <div className="dapp-menu-item">
                            <img src={SwapIcon} alt=""/>
                            <p>Swap</p>
                        </div>
                    </Link>

                    <Link
                        component={NavLink}
                        to="/calculator"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "calculator");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img src={CalculatorIcon} alt=""/>
                            <p>Calculator</p>
                        </div>
                    </Link>

                    <Link
                        component={NavLink}
                        to="/game-nft"
                        isActive={(match: any, location: any) => {
                            return checkPage(location, "game-nft");
                        }}
                        className={classnames("button-dapp-menu", { active: isActive })}
                    >
                        <div className="dapp-menu-item">
                            <img src={GameIcon} alt=""/>
                            <p>Run to earn</p>
                        </div>
                    </Link>

                    <a
                        href="https://docs.funnydao.finance/"
                        target="_blank"
                        className={classnames("button-dapp-menu", { active: isActive })}
                        rel="noreferrer"
                    >
                        <div className="dapp-menu-item">
                            <img src={DocsIcon} alt=""/>
                            <p>Docs</p>
                        </div>
                    </a>
                </div>
            </div>

            {/*<div className="dapp-menu-doc-link">*/}
            {/*    <Link href="https://docs.funnydao.finance/" target="_blank">*/}
            {/*        <p>Documentation</p>*/}
            {/*    </Link>*/}
            {/*</div>*/}
            <Social />
        </div>
    );
}

export default SideBar;
