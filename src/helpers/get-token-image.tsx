import MaiaImg from "../assets/tokens/FNY.svg";
import sMaiaImg from "../assets/tokens/FNY.svg";

function toUrl(tokenPath: string): string {
    const host = window.location.origin;
    return `${host}/${tokenPath}`;
}

export function getTokenUrl(name: string) {
    if (name === "fny") {
        return toUrl(MaiaImg);
    }

    if (name === "sfny") {
        return toUrl(sMaiaImg);
    }

    throw Error(`Token url doesn't support: ${name}`);
}
