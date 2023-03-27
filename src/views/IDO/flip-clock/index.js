import React from 'react';

import FlipCountdown from '@rumess/react-flip-countdown';

import './style.scss'
import moment from 'moment';

function FlipClock() {
  return (
    <div className="flip-clock">
      <FlipCountdown
        hideYear
        hideMonth
        endAt={moment('09-04-2022', 'DD-MM-YYYY').format('YYYY/MM/DD HH:mm:ss')}
        endAtZero
      />
    </div>
  );
}

export default FlipClock;