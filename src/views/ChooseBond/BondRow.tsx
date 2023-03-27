import { priceUnits, trim } from "../../helpers";
import BondLogo from "../../components/BondLogo";
import { Paper, TableRow, TableCell, Slide, Link } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import { IAllBondData } from "../../hooks/bonds";
import { usdc, usdt } from "src/helpers/bond";
interface IBondProps {
    bond: IAllBondData;
}

export function BondDataCard({ bond }: IBondProps) {
    const isBondLoading = !bond.bondPrice ?? true;

    return (
        <Slide direction="up" in={true}>
            <Paper className="bond-data-card">
                {bond.isClosed ? (
                    <div>
                        <div className="bond-pair-sold-out">
                            <BondLogo bond={bond} />
                            <div className="bond-name-sold-out">
                                <p className="bond-name-title-sold-out">{bond.displayName}</p>
                                {bond.isLP && (
                                    <div>
                                        <Link href={"https://app.maiadao.io/#/mints"} target="_blank">
                                            <p className="bond-name-title">Bond Closed</p>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Link component={NavLink} to={`/mints/${bond.name}`}>
                            <div className="bond-table-btn">
                                <p>Claim {bond.displayName}</p>
                            </div>
                        </Link>
                    </div>
                )
                : 
                (
                    <div>
                        {" "}
                        <div className="bond-pair">
                            <BondLogo bond={bond} />
                            <div className="bond-name">
                                <p className="bond-name-title">{bond.displayName}</p>
                                {bond.isLP && (
                                    <div>
                                        <Link href={"https://app.maiadao.io/#/mints"} target="_blank">
                                            <p className="bond-name-title">Bond Closed</p>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="data-row">
                            <p className="bond-name-title">Price</p>
                            <p className="bond-price bond-name-title">
                                <>
                                    {bond.isLP && priceUnits(bond)} {isBondLoading ? <Skeleton width="50px" /> : trim(bond.bondPrice, (bond.isLP || (bond.name !== usdc.name && bond.name !== usdt.name)) ? 4 : 2)} {!bond.isLP && priceUnits(bond)}
                                </>
                            </p>
                        </div>
                        <div className="data-row">
                            <p className="bond-name-title">ROI</p>
                            <p className="bond-name-title">{isBondLoading ? <Skeleton width="50px" /> : `${trim(bond.bondDiscount * 100, 2)}%`}</p>
                        </div>
                        <div className="data-row">
                            <p className="bond-name-title">Purchased</p>
                            <p className="bond-name-title">
                                {isBondLoading ? (
                                    <Skeleton width="80px" />
                                ) : (
                                    new Intl.NumberFormat("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                        maximumFractionDigits: 0,
                                        minimumFractionDigits: 0,
                                    }).format(bond.purchased)
                                )}
                            </p>
                        </div>
                        <Link component={NavLink} to={`/mints/${bond.name}`}>
                            <div className="bond-table-btn">
                                <p>Mint {bond.displayName}</p>
                            </div>
                        </Link>
                    </div>
                )}
            </Paper>
        </Slide>
    );
}

export function BondTableData({ bond }: IBondProps) {
    const isBondLoading = !bond.bondPrice ?? true;

    return (
        <TableRow>
            <TableCell align="left">
                <BondLogo bond={bond} />
                    <div className="bond-name">
                        {bond.isClosed ? 
                            <p className="bond-name-title-sold-out">{bond.displayName}</p>
                        :
                            <p className="bond-name-title">{bond.displayName}</p>
                        }
                        {bond.isLP && (
                            <Link color="primary" href={bond.lpUrl} target="_blank">
                                <p className="bond-name-title">Add liquidity</p>
                            </Link>
                        )}
                    </div>
            </TableCell>
            <TableCell align="center">
                {!bond.isClosed && <p className="bond-name-title">
                    <>
                        <span className="currency-icon">{(bond.isLP || (bond.name !== usdc.name && bond.name !== usdt.name)) && priceUnits(bond)}</span>
                        {isBondLoading ? <Skeleton width="50px" /> : trim(bond.bondPrice, (bond.isLP || (bond.name !== usdc.name && bond.name !== usdt.name)) ? 4 : 2)}
                        <span className="currency-icon">{(!bond.isLP && (bond.name === usdc.name || bond.name === usdt.name)) && priceUnits(bond)}</span>
                    </>
                </p>}
            </TableCell>
            <TableCell align="right">
                {!bond.isClosed && <p className="bond-name-title">{isBondLoading ? <Skeleton width="50px" /> : `${trim(bond.bondDiscount * 100, 2)}%`}</p>}
            </TableCell>
            <TableCell align="right">
                {!bond.isClosed && <p className="bond-name-title">
                    {isBondLoading ? (
                        <Skeleton width="50px" />
                    ) : (
                        new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0,
                        }).format(bond.purchased)
                    )}
                </p>}
            </TableCell>
            <TableCell>
                <Link component={NavLink} to={`/mints/${bond.name}`}>
                    <div className="bond-table-btn">
                        <p>{bond.isClosed ? "Claim" : "Mint"}</p>
                    </div>
                </Link>
            </TableCell>
        </TableRow>
    );
}
