import React, {useState} from 'react';
import styles from "./ido.module.scss";
import {Button, Input} from "@material-ui/core";

interface props {
  handleBuyToken: (amount: string) => void,
  handleApproveToken: () => {}, 
  isAppvovedBuyToken: any;
  balance?: string,
  maxYouCanBuyFNY: string;
}

function BuyTokenIdoBox(props: props) {
  const maxAmount = "30000"
  const [amount, setAmount] = useState('');

  const handleChangeAmount = (e: any) => {
    const {value} = e?.target
    if (+value > +maxAmount) {
      setAmount(maxAmount)
      return
    }

    setAmount(e?.target?.value)
  }

  return (
    <div className={styles.form_buy_token}>
      <div style={{width: "100%", maxWidth: "500px", margin: "0 auto"}}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Amount</span>
            <span>Balance: {props.balance} BUSD</span>
          </div>
          <Input
            value={amount}
            onChange={handleChangeAmount}
            placeholder="Enter amount"
            className={styles.input_enter_amount}
            endAdornment={<span className={styles.btn_max_amount} onClick={() => setAmount(`${+Number(props.maxYouCanBuyFNY) * 5}`)}>Max</span>}
          />
          <div>Max you can buy: {props.maxYouCanBuyFNY} FNY</div>
          <div>1 FNY: 5 BUSD</div>
        </div>

        {
          !props.isAppvovedBuyToken
            ? (
              <div className={styles.group_btn_buy}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => props.handleApproveToken()}
                  className={styles.btn_gradient_orange}
                >
                  Approve
                </Button>
              </div>
            )
            : (
              <div className={styles.group_btn_buy}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => props.handleBuyToken(amount)}
                  className={styles.btn_gradient_orange}
                >
                  Buy FNY
                </Button>
              </div>
            )
        }
      </div>
    </div>
  );
}

// @ts-ignore
export default BuyTokenIdoBox