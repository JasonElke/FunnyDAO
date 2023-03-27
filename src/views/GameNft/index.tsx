import React from 'react'

import Countdown, { zeroPad } from 'react-countdown';

import IconComingSoon from '../../assets/icons/coming-soon.svg'

import './gamenft.scss'
import {COUNT_DOWN} from "../../constants/style";

function GameNft() {
    const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
        if (completed) {
            return <></>;
        } else {
            return <span>{zeroPad(days)}d : {zeroPad(hours)}h : {zeroPad(minutes)}m : {zeroPad(seconds)}s</span>;
        }
    };

    return (
        <div className="game-nft-page">
            <div className="box-body">
                <div className="header">
                    <p className="title-header fs-32">LET THE RUN TO EARN BEGIN</p>

                    <div className="countdown">
                        <Countdown
                            date={new Date(COUNT_DOWN).getTime()}
                            renderer={renderer}
                        />
                    </div>
                    {/* <div className="btn actions">
            <Button className="btn-primary none-border shadow">
              <a href={linkBuyFny} target="_blank">
                <span>Buy</span>
              </a>
            </Button>
            <Link to="/fny-bush-lp">
              <Button className="btn-normal">Bond</Button>
            </Link>
          </div> */}
                </div>
                <div className="title">
                    COMING SOON
                </div>

                <div className="description">We’re currently working on creating something fantastic.</div>

                <img src={IconComingSoon} alt=""/>
            </div>
        </div>
    )
}

export default GameNft