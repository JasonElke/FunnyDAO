/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import {Link} from '@material-ui/core';
import { Button } from '@material-ui/core';
import { BigNumber, ethers } from 'ethers';
import { useCallback, useEffect, useReducer, useState } from 'react';
import { IDOContract, MAIContract, StakingContract } from 'src/abi';
import { getAddresses } from 'src/constants';
import { useWeb3Context } from 'src/hooks';
import styles from './ido.module.scss';
import Twitter from "../../assets/icons/twitter.svg";
import Telegram from "../../assets/icons/telegram.png";
import DocsIcon from "../../assets/icons/document-sidebar.svg";
import LogoIdo from "../../assets/icons/logo-ido.svg";
import BuyTokenIdoBox from "./BuyTokenIdoBox";
import Clock from "./flip-clock";
import moment from 'moment';
import CircularProgress from "@material-ui/core/CircularProgress";

interface State {
  loading: boolean;
  txPending: boolean;
  connected: boolean;
  finalized: boolean;
  walletMAIBalance?: string;
  walletMAIAllowance?: string;
  whitelisted: boolean;
  allotment?: string;
  idoMAIAmount?: string;
  purchasedAmount?: string;
  stakingAmount?: string;
  error?: Error;
}

export type Action =
  | {
      type: 'load-details-complete';
      walletMAIBalance: string;
      walletMAIAllowance: string;
      whitelisted: boolean;
      allotment: string;
      idoMAIAmount: string;
      purchasedAmount: string;
      connected: boolean;
      stakingAmount: string;
      finalized: boolean;
    }
  | {
      type: 'approve';
    }
  | {
      type: 'approved';
      walletMAIAllowance: string;
    }
  | {
      type: 'purchasing';
    }
  | {
      type: 'purchased';
    }
  | {
      type: 'error';
      error: Error;
    };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'load-details-complete':
      let { type, connected, ...rest } = action;
      if (state.connected && !connected) {
        return state;
      }
      return {
        ...state,
        ...rest,
        loading: false,
        error: undefined,
      };
    case 'approve': {
      return { ...state, txPending: true, error: undefined };
    }
    case 'approved': {
      return {
        ...state,
        txPending: false,
        walletMAIAllowance: action.walletMAIAllowance,
      };
    }
    case 'purchasing': {
      return { ...state, txPending: true, error: undefined };
    }
    case 'purchased': {
      return { ...state, txPending: false };
    }
    case 'error': {
      return { ...state, error: action.error, loading: false, txPending: false };
    }
  }
}

export default function IDO() {
  const { address: wallet, connect, connected, provider, chainID, disconnect } = useWeb3Context();
  const addresses = getAddresses(chainID);
  const [isLoading, setIsLoading] = useState(false);
  const [approvedBuyIdo, setApprovedBuyIdo] = useState(false);
  const [step, setStep] = useState(1);
  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    txPending: false,
    whitelisted: false,
    connected: false,
    finalized: false,
  });

  // const mai = new ethers.Contract(addresses.MAIA_ADDRESS, MAIContract, provider);
  const dai = new ethers.Contract(addresses.DAI_ADDRESS, MAIContract, provider);
  const ido = new ethers.Contract(addresses.IDO, IDOContract, provider);
  const staking = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);

  const loadDetails = useCallback(async () => {
    const idoMAIAmount = await dai.balanceOf(ido.address);
    let walletMAIBalance = connected ? await dai.balanceOf(wallet) : BigNumber.from(0);
    walletMAIBalance = walletMAIBalance.lt('1000000000') ? '0' : ethers.utils.formatEther(walletMAIBalance);
    const walletMAIAllowance = connected ? ethers.utils.formatEther(await dai.allowance(wallet, ido.address)) : '0.0';
    const whiteListEnabled = await ido.whiteListEnabled();
    const whitelisted = connected ? !whiteListEnabled || (await ido.whiteListed(wallet)) : false;
    let allotment = ethers.utils.formatUnits(await ido.getAllotmentPerBuyer(), 9)
    const purchasedAmount = connected ? ethers.utils.formatUnits(await ido.purchasedAmounts(wallet), 9) : '0.0';
    const warmupInfo = connected ? await staking.warmupInfo(wallet) : { deposit: BigNumber.from(0) };
    const stakingAmount = ethers.utils.formatUnits(warmupInfo.deposit, 9);
    const finalized = await ido.finalized();

    console.log({finalized, stakingAmount, purchasedAmount});

    if (connected) {
      setStep(2)

      if (Number(purchasedAmount) !== 0 && finalized) {
        setStep(3)
      }
    }

    if (finalized) {
      if (connected && Number(purchasedAmount) === 0) {
        setStep(Number(purchasedAmount) === 0 ? 3 : 3)
      }
    } else {
      if (Number(walletMAIAllowance) !== 0) {
        setApprovedBuyIdo(true)
      }

      if (Number(purchasedAmount) !== 0) {
        setStep(3)
      }
    }

    setIsLoading(false)

    dispatch({
      type: 'load-details-complete',
      walletMAIBalance,
      walletMAIAllowance,
      whitelisted,
      allotment,
      idoMAIAmount,
      purchasedAmount,
      connected: Boolean(connected),
      stakingAmount,
      finalized,
    });
  }, [wallet, provider, connected]);

  const claim = useCallback(async () => {
    dispatch({ type: 'purchasing' });
    try {
      const tx = await ido.connect(provider.getSigner()).claim(wallet);
      await tx.wait(3);
      loadDetails();
    } catch (error) {
      console.error(error);
      dispatch({ type: 'error', error: error as Error });
    } finally {
      dispatch({ type: 'purchased' });
    }
  }, [provider, ido]);

  useEffect(() => {
    loadDetails();
  }, [connected]);

  const NotConnectedBox = () => (
    <div className={styles.notConnectedBox}>
      <p className={styles.title}>
        Claim your <span className={styles.highlight}>FNY</span> to join the FunnyDao now!
      </p>
      <div className={styles.button}>
        <a
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className={styles.btn_connect_wallet}
          onClick={() => {
            setIsLoading(true)
            connect()
          }}
        >
          <span />
          <span />
          <span />
          <span />

          {
            isLoading && (
              <CircularProgress
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "8px",
                  color: "#FFFFFF"
                }}
              />
            )
          }

          Connect Your Wallet
        </a>
      </div>
    </div>
  );

  const handleBuyToken = async (amount: string) => {
    try {
      const tx = await ido.connect(provider.getSigner()).purchaseCLAM(amount + '000000000000000000');
      await tx.wait();
      await loadDetails()
      setStep(3)
      alert("Buy success")
    } catch (error) {
      console.log(error);
    }
  }

  const handleApproveBuyToken = async () => {
    try {
      await (await dai.connect(provider.getSigner()).approve(addresses.IDO, '100000000000000000000000000000000')).wait()
      await loadDetails()
      alert('Approve success')
      setApprovedBuyIdo(true)
    } catch (error) {
      console.log(error);
    }
  }

  const SuccessBox = () => (
    <div className={styles.success_box}>
      <div className={styles.presale_header_success}>
        <h1 className={styles.successTitle}>You’ve claimed your FNY!</h1>
        <h1 className={styles.successSubTitle}>Welcome to the FunnyDao</h1>
      </div>
      <div className={styles.presale_success_content}>
        {state.purchasedAmount !== '0.0' && (
          <div className={styles.balance_stats}>
            <p>Your current balance</p>
            <div className={styles.tokenAmounts}>
              <p className={styles.tokenAmount}>
                {Intl.NumberFormat('en').format(Number(state.purchasedAmount || 0))}
                <span className={styles.tokenTitle}>FNY</span>
              </p>
            </div>
          </div>
        )}
        {state.purchasedAmount !== '0.0' && (
          <div className={styles.contribution}>
            <p>Your contribution</p>
            <div className={styles.tokenAmounts}>
              <p className={styles.tokenAmount}>
                {Intl.NumberFormat('en').format(Number(state.purchasedAmount || 0) * 5)}
                <span className={styles.tokenTitle}>BUSD</span>
              </p>
              <p className={styles.tokenSubTitle}>5 BUSD = 1 FNY</p>
            </div>
          </div>
        )}
        {state.purchasedAmount !== '0.0' && (
          <div className={styles.contribution}>
            <p>Your Staking</p>
            <div className={styles.tokenAmounts}>
              <p className={styles.tokenAmount}>
                {Intl.NumberFormat('en').format(Number(state.stakingAmount || 0))}
                <span className={styles.tokenTitle}>sFNY</span>
              </p>
            </div>
          </div>
        )}
      </div>
      <div className={styles.learnMoreArea}>
        {ethers.utils.parseUnits(state.stakingAmount || '0', 9).eq(0) && (
          <div className={styles.claimButton}>
            <div className={styles.group_btn_claim}>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                disableElevation
                onClick={claim}
                className={styles.btn_gradient_orange}
                disabled={!state.finalized || state.txPending}
              >
                Claim & Stake
              </Button>
              <a style={{ textDecoration: 'none' }} href="https://app.dev.funnydao.finance/#/dashboard">
                <Button
                  variant="contained"
                  color="primary"
                  size="medium"
                  disableElevation
                  className={styles.btn_gradient_orange}
                >
                  Enter app
                </Button>
              </a>
            </div>
            {!state.finalized && <p>Stake & Claim will be available after {moment('09/04/2022', 'DD/MM/YYYY').add(4, 'days').endOf('days').format('YYYY/MM/DD HH:mm:ss')}</p>}
            {state.error && <p>{state.error.message}</p>}
          </div>
        )}
      </div>
    </div>
  );

  const renderConnect = () => (
    <div className={styles.claimClamBox}>
      <NotConnectedBox />
    </div>
  )

  const renderBoxSoldOut = () => {
    return  (
      <div className={styles.claimClamBox}>
      <div className={styles.soldOutContainer}>
        <p className={styles.soldOut} style={{margin: "20px"}}>Sold Out!</p>
        <a style={{ textDecoration: 'none' }} href="https://app.dev.funnydao.finance/#/dashboard">
          <Button
            variant="contained"
            color="primary"
            size="large"
            disableElevation
            className={styles.btn_gradient_orange}
            style={{width: "180px"}}
          >
            Open App
          </Button>
        </a>
      </div>
    </div>
    )
  }

  const renderElm = () => {
    switch (step) {
      case 1:
        return renderConnect()
      case 2:
        return <BuyTokenIdoBox maxYouCanBuyFNY={`${state?.allotment}`} balance={state?.walletMAIBalance} handleApproveToken={handleApproveBuyToken}  handleBuyToken={handleBuyToken} isAppvovedBuyToken={approvedBuyIdo} />
      case 3:
        return <SuccessBox />
      case 4:
        return renderBoxSoldOut()
      default:
        return <></>
    }
  }

  const handleFinalize = async () => {
    try {
      await (await ido.connect(provider.getSigner()).finalize('0x1827558762Fd721e37c531dA7Cb82e5ac778d70E')).wait()
      await loadDetails()
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.body}>
      {wallet && wallet.toLowerCase() === '0x1827558762Fd721e37c531dA7Cb82e5ac778d70E'.toLowerCase() && (
        <Button style={{ backgroundColor: 'red' }} onClick={handleFinalize}>done</Button>
      )}
      <div className={styles.header_ido}>
        <a href="https://app.funnydao.finance/#/dashboard" target="_blank" rel="noreferrer">
          <img src={LogoIdo} alt=""/>
        </a>
        <span>FUNNYDAO</span>
      </div>

      <div className={styles.hero_section}>
        <h1 className={styles.title}>FNY IDO</h1>
        <p className={styles.desc}>
          The IDO will be held from {moment('09/04/2022', 'DD/MM/YYYY').format('YYYY/MM/DD HH:mm:ss')} to {moment('09/04/2022', 'DD/MM/YYYY').add(4, 'days').endOf('days').format('YYYY/MM/DD HH:mm:ss')}. Join the FunnyDao now!
        </p>
      </div>

      <Clock/>

      <div className={styles.mainBox}>
        {/*<div className={styles.happyOtterBox}>*/}
        {/*   <img src={happyOtter} className={styles.happyOtter} /> */}
        {/*</div>*/}

        <div className={styles.currentMaiBox}>
          {/* <img src={polygon} className={styles.polygon} /> */}
          <h1>Total bought (FNY)</h1>
          {state?.idoMAIAmount && <h2>${Intl.NumberFormat('en').format(Number(state?.idoMAIAmount || 0) / 1e18)}</h2>}
        </div>
      </div>

      {renderElm()}

      {
        connected && !isLoading && (
          <div className={styles.button}>
            <a
              onClick={disconnect}
              className={styles.btn_connect_wallet}
            >
              <span />
              <span />
              <span />
              <span />
              Disconnect
            </a>
          </div>
        )
      }

      <div className={styles.contact_us}>
        <div className={styles.title_box}>Contact us</div>

        <div className={styles.social_row}>
          <Link href="https://twitter.com/FunnyDAOFinance" target="_blank">
            <img src={Twitter} alt="" />
          </Link>

          <Link href="https://t.me/funnydaogroup" target="_blank">
            <img src={Telegram} alt=""/>
          </Link>

          <Link href="https://docs.funnydao.finance/" target="_blank">
              <img src={DocsIcon} alt=""/>
          </Link>
        </div>
      </div>
    </div>
  );
}