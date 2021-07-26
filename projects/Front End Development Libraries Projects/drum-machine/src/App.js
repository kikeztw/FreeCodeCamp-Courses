import {
  useState,
  useCallback,
  useEffect
} from 'react';
import {
  Button,
  Container,
  Row,
  Col,
  ButtonGroup
} from 'reactstrap'

const headerKit = 'Heater kit';
const smoothPianoKit = 'smooth Piano kit';

   const keys = [
  {
    keyCode: 81,
    keyTrigger: 'Q',
    id: 'Chord-1',
    id2: 'Heater-1',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3',
    second_url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'
  },
  {
    keyCode: 87,
    keyTrigger: 'W',
    id: 'Chord-2',
    id2: 'Heater-2',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3',
    second_url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'
  },
  {
    keyCode: 69,
    keyTrigger: 'E',
    id: 'Chord-3',
    id2: 'Heater-3',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3',
    second_url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'
  },
  {
    keyCode: 65,
    keyTrigger: 'A',
    id: 'Shaker',
    id2: 'Heater-4',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3',
    second_url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'
  },
  {
    keyCode: 83,
    keyTrigger: 'S',
    id: 'Open-HH',
    id2: 'Clap',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3',
    second_url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3',
  },
  {
    keyCode: 68,
    keyTrigger: 'D',
    id: 'Closed-HH',
    id2: 'Open-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3',
    second_url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
  },
  {
    keyCode: 90,
    keyTrigger: 'Z',
    id: 'Punchy-Kick',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3',
    url2: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3',
    second_url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
  },
  {
    keyCode: 88,
    keyTrigger: 'X',
    id: 'Side-Stick',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3',
    url2: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3',
    second_url:  'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
  },
  {
    keyCode: 67,
    keyTrigger: 'C',
    id: 'Snare',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3',
    url2: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3',
    second_url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
  }
];


const BottomControllers = ({
  onChangeVolumen
}) => {

  const onChangeVol = useCallback((newVol) => {
    return () => {
      onChangeVolumen?.(newVol);
    }
  }, [onChangeVolumen]);

  return(
    <Row className="d-flex justify-content-between mt-2">
      <Col xs={7}>
        <ButtonGroup>
          <Button 
            onClick={onChangeVol(0.1)} 
            color="primary"
          >
            1
          </Button>
          <Button 
            onClick={onChangeVol(0.2)} 
            color="primary"
          >
            2
          </Button>
          <Button 
            onClick={onChangeVol(0.3)} 
            color="primary"
          >
            3
          </Button>
          <Button 
            onClick={onChangeVol(0.4)} 
            color="primary"
          >
            4
          </Button>
          <Button 
            onClick={onChangeVol(0.5)} 
            color="primary"
          >
            5
          </Button>
        </ButtonGroup>
      </Col>
    </Row>
  )
}


const DrumNuttons = ({ currentBank , isDrumActive, vol, onPressDrumPad }) => {


  const _onClick = useCallback((data) => {
    return () => {
      if(isDrumActive){
        const displayId = currentBank === headerKit ? data.id : data.id2;
        const audio = document.getElementById(data.keyTrigger);
        if(audio){
          audio.volumen = vol;
          audio.currentTime = 0;
          audio.play();
          onPressDrumPad(displayId)
        }
      }
    }
  }, [currentBank, isDrumActive, vol, onPressDrumPad]);

  useEffect(() => {

    const onKeyDown = (event) => {
      const eventKey = event.keyCode;
      const getCurrentDrumPad = keys.filter(e => e.keyCode === eventKey);
      if(getCurrentDrumPad?.length){
        _onClick(getCurrentDrumPad[0])();
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    }
  }, [_onClick])

  return keys.map((key) => (
    <Button 
      id={currentBank === headerKit ? key.id : key.id2}
      onClick={_onClick(key)}
      key={key.keyCode} 
      className="mb-3 drum-pad text-uppercase">
      {key.keyTrigger}
      <audio 
        id={key.keyTrigger} 
        className="invisible clip" 
        src={currentBank === headerKit ? key.url : key.second_url}  
      />
    </Button>
  ))
}



const TopControllers = ({ onSwitchBank, currentBank, onChangePower, isDrumActive }) => {
  const color = isDrumActive ? 'success' : 'warning';
  const buttonPowerContent = isDrumActive ? 'TURN OFF' : 'TURN ON';
  return(
    <div className="w-100 d-flex justify-content-between">
      <Button onClick={onChangePower} color={color}>
        {buttonPowerContent}
      </Button>
      <Button
        onClick={onSwitchBank}
        color="primary">
        SWITCH BANK 
      </Button>
    </div>
  )
}

 const Display = ({ value  }) => {
  
  return(
    <div className="w-100 rounded bg-light bg-gradient p-2 drum-display mb-3 mt-4" id="display">
      {value}
    </div>
  )
}

const App = () => {
  const [vol, setVol] = useState(0.1);
  const [display, setDisplay] = useState('');
  const [currentBank, setBank] = useState(headerKit);
  const [isDrumActive, setDrumActive] = useState(true);

  useEffect(() => {
    setDisplay(vol * 100)
  }, [vol]);

  useEffect(() => {
    setDisplay(currentBank)
  }, [currentBank]);

  const onPressDrumPad = useCallback((id) => {
    setDisplay(id);
  }, []);
  
  const handleVolumen = useCallback((newVol) => {
    setVol(newVol);
  }, []);

  const handleDrumPower = useCallback(() => {
    setDrumActive((state) => !state);
  }, []);

  const onSwitchBank = useCallback(() => {
    setBank((state) => (
      state === headerKit ? smoothPianoKit : headerKit
    ))
  }, []);
 
  return(
    <div className="w-100 vh-100 d-flex justify-content-center align-items-center">
      <div className="drum-machine rounded shadow">
        <Container id="drum-machine" className="d-flex flex-wrap justify-content-between">
          <TopControllers 
            isDrumActive={isDrumActive}
            currentBank={currentBank} 
            onChangePower={handleDrumPower}
            onSwitchBank={onSwitchBank} 
          />
          <Display value={display} />
          <DrumNuttons 
            isDrumActive={isDrumActive}
            currentBank={currentBank} 
            volumen={vol}
            onPressDrumPad={onPressDrumPad}
          />
          <BottomControllers 
            onChangeVolumen={handleVolumen}
          />
        </Container>
      </div>
    </div>
  )
}


export default App;
