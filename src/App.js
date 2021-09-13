import * as React from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/wavePortal.json";
import ProgressBar from "./progressbar";
import Post from "./wavePost";

export default function App() {
  
  const [currAccount, setCurrentAccount]= React.useState("")
  const contractAddress = '0xC0ED93FD92247a87368574e6435f0C70f035d4d0'
  const contractABI = abi.abi;
  const [totalWaves, setTotalWaves]= React.useState(0)
  const [allWaves, setAllWaves]= React.useState([])
  const [message, setMessage] = React.useState('');

  const checkIfWalletIsConnected=()=>{
    const {ethereum}= window;
    if(!ethereum){
      console.log("Make sure you have metamask!")
      return

    }else{
      console.log("We have the ethereum object", ethereum)
    }

    //Check if we're authorised to access the user's wallet
    ethereum.request({method: 'eth_accounts'})
    .then(accounts=>{
      //We could have multiple accounts. Check for one
      if (accounts.length !=0){
        //grab the firts account we have access to
        const account = accounts[0];
        
        console.log("Found an authorized account:",  account)
        //store the uers public aacount wallet address for later
        setCurrentAccount(account);
        getAllWaves();
      }else{
        console.log("No authorised account found")
      }
    })
  }

  const connectWallet=()=>{
    const {ethereum} = window;
    if (ethereum){
      alert("Get matamask")
    }
    ethereum.request({method: 'eth_requestAccounts'})
    .then(accounts=>{
      console.log("Connected", accounts[0])
      setCurrentAccount(accounts[0])
    })
    .catch(err=>console.log(err));
    
  }

  const wave = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()

    const waveportalContract = new ethers.Contract(contractAddress, contractABI, signer);
    let count = await waveportalContract.getTotalWaves();
    console.log("Retrieved total wave count....", count.toNumber())
  
    const waveTxn = await waveportalContract.wave(message, { gasLimit: 300000 })
    console.log("Mining.....", waveTxn.hash)
    await waveTxn.wait()
    console.log("Mined...", waveTxn.hash)

    count = await waveportalContract.getTotalWaves()
    setTotalWaves(count.toNumber())
    console.log("Retrieved total wave count...", count.toNumber())
  }
  async function getAllWaves(){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const waveportalContract = new ethers.Contract(contractAddress,  contractABI, signer);
    let waves = await waveportalContract.getAllWaves()
    console.log(waves)
    let wavesCleaned =[]
    waves.forEach(wave=>{
      wavesCleaned.push({
      address: wave.waver,
      timestamp: new Date(wave.timestamp*1000),
      message: wave.mesaage
    })
    })
    setAllWaves(wavesCleaned)
    console.log(allWaves);

    waveportalContract.on("NewWave", (from, timestamp, message, totalwaves_)=>{
      console.log("NewWave", from, timestamp, message, totalwaves_)
      setTotalWaves(totalwaves_)
      console.log(totalWaves)
      setAllWaves(oldArray=>[...oldArray,{
        address: from,
        timestamp: new Date(timestamp *1000),
        message: message
      }])
    })
  }


  React.useEffect(()=>{
    checkIfWalletIsConnected()
  }, [])
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        👋 Lets Connect!
        </div>
    
       
        <div className="bio">
        I am Nancy, a problem solver using software engineering as my tools of trade. 
        </div>
        
      {currAccount ? (

        <div classNme ="waveBox">
  
        <form>
        <div className="waveBox__input">
        <input type="textarea"  value={message}  onInput={e => setMessage(e.target.value)} placeholder="Let's connect, covid-19 edition"/>
        </div>

        <button className="waveBox__button" onClick={wave}>
          Connect with Me
        </button>
        
        </form>
        </div>
        ):( <button className="waveBox__button2" onClick={connectWallet}>
          Connect your Ethereum wallet and let's connect
          </button>)}
        
  
        <div className="feed">
        <div className="feed__header">
         <h2> Nancy's connections</h2>
        {allWaves.map((wave, index)=>{
          return(
            <Post displayID={wave.address}
            timestamp={wave.timestamp.toString()}
            message={wave.message}
            />
          )
        })}
      </div>
    </div>
    </div>
    </div>
  );
}
