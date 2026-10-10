import homeImage from '../assets/images/BG.webp';
import '../App.css';
import { clickAction } from '../utils/util';

function HomeComponent() {

  // TODO
  // Implement the functionality to show posts count below the Post count button

  return (
    <div className="App">
      <header className="App-header">
        <img src={homeImage} className="App-logo" alt="background" height="500px" width="700px"/>
      </header>
      <button onClick={clickAction} className="click_button">{"Post count"}</button>
    </div>
  );
}

export default HomeComponent;
