import React, { useEffect, useState } from "react";
import App from "./App";
import Dashboard from "../views/Dashboard/index";
import { HashRouter } from "react-router-dom";
import { loadTokenPrices } from "../helpers";
import Loading from "../components/Loader";
import Landing from "./Landing";
import IDO from "src/views/IDO";
import { useWeb3Context } from "src/hooks";

function Root() {
    const { connect, hasCachedProvider } = useWeb3Context();

    const isIdo = (): boolean => {
        return window.location.host.includes("ido");
    };

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTokenPrices()
            .then(() => setLoading(false))
            .catch(error => console.log(error));
        if (isIdo() && hasCachedProvider()) {
            connect()
        }
    }, []);

    if (loading) return <Loading />;

    const app = () => (
        <HashRouter>
             {/* <IDO /> */}
             <App />
            {/*{ isIdo() ? <IDO /> :}*/}
        </HashRouter>
    );


    return app();
}

export default Root;
