
import { useState, useRef, forwardRef } from 'react';
import moment from 'moment';
import './App.scss';


const ClockHeader = () => (
  <div className="clock_header">
    Clock
  </div>
);


const DisplayTime = ({ time, label }) => (
  <div 
    style={{  boxShadow: label?.includes('Break') ? '1px 1px 30px #ffa39e'  : '5px 5px 60px #bae7ff' }} 
    className="display_timer_container"> 
    <div id="time-left" className="display_timer_content">
        {time}
    </div>
    <span className="display_timer_label" id="timer-label">
      {label}
    </span>
  </div>
);

const ActionsButtons = ({ 
  onStart,
  onCancel
}) => {
  const [isStart, setStart] = useState(false);
  const onClick = () => {
    setStart((state) => !state);
    onStart();
  }
  const reset =() => {
    if(isStart){
      setStart((state) => !state);
    }
    onCancel();
  }
  return(
    <div className="action_buttons_container">
      <button id="start_stop" onClick={onClick} className="action_button" type="button" >
        {isStart ? 'Pause' : 'Start'}
      </button>
      <button id="reset" onClick={reset} className="action_button action_reset" type="button" >
        Reset
      </button>
    </div>
  )
}

const LapListItem = ({
  time,
  count,
}) => (
  <div className="animate__animated animate__bounceIn lap_item">
    <div className="lap_item_number">
      {count} <span>Lap</span>
    </div>
    <div className="lap_item_time">
      {time}
    </div>
  </div>
)

const SessionActions = ({
  children
}) => (
  <div className="session_actions_container">
    {children}
  </div>
)

const SessionLength = ({
  onClickMax,
  onClicMin,
  currentSession
}) => (
  <div className="session_item">
    <span className="session_item_left" >
      <span id="session-label">Session Length</span>
      <p id="session-length">{currentSession}</p>
    </span>
    <span className="session_acction_buttons">
      <span 
        id="session-decrement" 
        onClick={onClicMin} 
        type="button"
        >min
      </span>
      <span 
        id="session-increment" 
        onClick={onClickMax} 
        type="button">
          max
      </span>
    </span>
  </div>
);

const SessionBreak = ({
  onClickMax,
  onClicMin,
  currentSession
}) => (
  <div className="session_item">
    <span className="session_item_left" >
      <span id="break-label">Break Length</span> 
      <p id="break-length">{currentSession}</p>
    </span>
    <span className="session_acction_buttons">
      <span 
        id="break-decrement" 
        onClick={onClicMin} 
        type="button">
          min
      </span>
      <span 
        id="break-increment" 
        onClick={onClickMax} 
        type="button">
          max
      </span>
    </span>
  </div>
)

const Audio = forwardRef((_, ref) => {
  return(
    <audio
    id="beep"
    preload="auto"
    ref={ref}
      src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
    />
  )
})

const getCoutDownDate = (timer) => moment().add(timer, 'seconds');
const getTimerFormat = (diff) => moment.utc(diff).format("mm:ss");
const getDiff = (countDownDate) => countDownDate.diff(moment());
const getDurationAsSecond = (countDownDate) => moment.duration(countDownDate.diff(moment())).as('seconds');


const App = () => {
  const audio = useRef(null);
  const historyCount = useRef(0);
  const countDownId = useRef(null);
  const pauseTime = useRef(null);
  const intialTime = useRef();
  const [display, setDisplay] = useState('25:00'); 
  const [session, setSession] = useState(25);
  const [breakSession, setBreakSession] = useState(5);
  const [laps, setLaps] = useState([]) 
  const [label, setLabel] = useState('Session');


  const resetInterval = () => {
    clearInterval(countDownId.current)
    countDownId.current = null;
  }


  const countDown = ({time, calling, cancel}) => {
    const _timer =  pauseTime.current || 60 * time;
    intialTime.current = intialTime.current ? intialTime.current : moment();
    let countDownDate = getCoutDownDate(_timer);
    countDownId.current = setInterval(() => {
      const diff = getDiff(countDownDate);
      pauseTime.current = getDurationAsSecond(countDownDate);
      if(diff <= 0){
        clearInterval(countDownId.current)
        countDownId.current = null;
        pauseTime.current = null;
        cancel?.()
      }else{
        calling?.(diff);
      }
    }, 1000);
  }


  const creteHistory = () => {
    historyCount.current += 1;
    setLaps(state => [
      ...state,
      {
        time: moment(intialTime.current).fromNow(),
        count: historyCount.current,
      }
    ])
  }

  const timerDisplay = (diff, custom) => {
    const format = getTimerFormat(diff);
    if(!custom && format.includes('00:00')){
      audio.current.currentTime = 0;
      audio.current.play();
    }
    setDisplay(custom || format);
  }

  const onBreakSession = (newTimer) => {
    resetInterval();
    pauseTime.current = null;
    setLabel('Break');
    if(!pauseTime.current){
      timerDisplay(null, `${newTimer < 10 ? `0${breakSession}:00` : `${newTimer}:00`}`);
    }
    creteHistory();
    countDown({
      time: newTimer,
      calling: (diff) => {
        timerDisplay(diff);
      },
      cancel: () => {
        startSession(session)
      }
    });
  }

  const startSession = (newTimer) => {
    resetInterval();
    setLabel('Session');
    if(!pauseTime.current){
      timerDisplay(null, `${newTimer < 10 ? `0${breakSession}:00` : `${newTimer}:00`}`);
    }
    countDown({
      time: newTimer,
      calling: (diff) => {
        timerDisplay(diff);
      },
      cancel: () => {
        onBreakSession(breakSession);
      }
    })
  }


  const onClickStart = () => {
    if(countDownId.current){
      return resetInterval();
    }
    startSession(session);
  }

  const resetPauseItem = () => pauseTime.current = null;

  const onCancel = () => {
    historyCount.current = 0;
    audio.current.currentTime = 0;
    audio.current.pause();
    setSession(25);
    setBreakSession(5);
    setLabel('Session');
    setDisplay('25:00');
    setLaps([]);
    resetPauseItem();
    resetInterval();
  }

  const onClickMaxSession = () => {
    if(countDownId.current){
      return;
    }
    resetPauseItem();
    setSession((value) => {
      const _value = value <= 59 ? value + 1 : value;
      const countDownDate = getCoutDownDate(_value * 60);
      const diff = getDiff(countDownDate);
      timerDisplay(diff, (_value === 60 && '60:00'));
      return _value;
    });
  }

  const onClickMinSession = () => {
    if(countDownId.current){
      return;
    }
    resetPauseItem();
    setSession((value) => {
      let _value = value >= 2 ?  value - 1 : value;
      const countDownDate = getCoutDownDate(_value * 60);
      const diff = getDiff(countDownDate);
      timerDisplay(diff);
      return _value;
    });
   
  }

  const onClickMaxSessionBreak = () => {
    if(countDownId.current){
      return;
    }
    resetPauseItem();
    setBreakSession((value) => value <= 59 ? value + 1 : value);
  }

  const onClickMinSessionBreak = () => {
    if(countDownId.current){
      return;
    }
    resetPauseItem();
    setBreakSession((value) => value >= 2 ?  value - 1 : value);
  }


  const lapRender = laps.map((lap) => (
    <LapListItem 
      key={lap.time + lap.count}
      time={lap.time}
      count={lap.count}
    />
  ))

  return(
    <div className="app_container">
      <div className="clock_container">
        <ClockHeader />
        <ActionsButtons 
          onStart={onClickStart}
          onCancel={onCancel}
        />
        <DisplayTime label={label} time={display} />
        <SessionActions>
          <SessionLength 
            currentSession={session}
            onClickMax={onClickMaxSession}
            onClicMin={onClickMinSession}
          />
          <SessionBreak
            currentSession={breakSession}
            onClickMax={onClickMaxSessionBreak}
            onClicMin={onClickMinSessionBreak}
          />
        </SessionActions>
        <Audio ref={audio} />
        <div className="lap_list">
          {lapRender}
        </div>
      </div>
    </div>
  )
}

export default App;
