//importing required libraries
import React, { useState, useEffect } from "react";
import './App.css';
//import twitterLogo from "./assets/twitter-logo.svg";
import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types";

import { mintNFT } from "./cadence/transactions/mintNFT_tx";
import { getTotalSupply } from "./cadence/scripts/getTotalSupply_script";
import { getMetadata } from "./cadence/scripts/getMetadata_script";
import { getIDs } from "./cadence/scripts/getID_script";
import {setupAccount} from "./cadence/transactions/setup_account"

import { serverAuthorization } from "./auth/authorization";

fcl.config({
  "flow.network": "testnet",
  "app.detail.title": "aiSportsMinter", // Change the title!
  "accessNode.api": "https://rest-testnet.onflow.org",
  "app.detail.icon": "https://placekitten.com/g/200/200",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
});

// fcl.account is the same as this function
const getAccount = async (address) => {

  const account = await fcl.send([fcl.getAccount(address)]).then(fcl.decode);

  return account;

};

const ADDRESS = '0xc03bdc0fd49acfed'

const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

function App() {

  const [ user, setUser ] = useState();
  const [ images, setImages ] = useState([])
  const [ collectionReady, setCollectionReady] = useState(false)


  const logIn = () => {
    fcl.authenticate();
};

const logOut = () => {
  setImages([]);
  fcl.unauthenticate();
};

useEffect(() => {
  // This listens to changes in the user objects
  // and updates the connected user
  fcl.currentUser().subscribe(setUser);
}, [])

useEffect(() => {
  if (user && user.addr) {
    fetchNFTs();
  }
}
, [user]);

const RenderLogin = () => {
  return (
    <div>
      <button className="cta-button button-glow" onClick={() => logIn()}>
        Enter the Multiverse
      </button>
    </div>
  );
};


const fetchNFTs = async () => {
  // Empty the images array
  setImages([]);
  let IDs = [];
  
  // Fetch the IDs with our script (no fees or signers necessary)
  try {
    IDs = await fcl.query({
      cadence: `${getIDs}`,
      args: (arg, t) => [
        arg(user.addr, types.Address), 
      ],
    })
    setCollectionReady(true)
  } catch(err) {
    console.log("No NFTs Owned")
  }
  

  let _imageSrc = []
  try{
    for(let i=0; i<IDs.length; i++) {
      const result = await fcl.query({
        cadence: `${getMetadata}`,
        args: (arg, t) => [
          arg(user.addr, types.Address), 
          arg(IDs[i].toString(), types.UInt64),
        ],
      })
      // If the source is an IPFS link, remove the "ipfs://" prefix
      if (result["thumbnail"].startsWith("ipfs://")) {
        _imageSrc.push(result["thumbnail"].substring(7))
        // Add a gateway prefix
        _imageSrc[i] = "https://nftstorage.link/ipfs/" + _imageSrc[i]
      }
      else {
        _imageSrc.push(result["thumbnail"])
      }
    }
  } catch(err) {
    console.log(err)
  }
  
  if(images.length < _imageSrc.length) {
    setImages((Array.from({length: _imageSrc.length}, (_, i) => i).map((number, index)=>
      <img style={{margin:"10px", height: "150px"}} src={_imageSrc[index]} key={number} alt={"NFT #"+number}
      />
    )))
  }
}


const mint = async() => {

  let _totalSupply, signUser;

  try {

    //signUser = await getAccount(ADDRESS) //address of NFTMinter

    _totalSupply = await fcl.query({
      cadence: `${getTotalSupply}`
    })

  } catch(err) {console.log(err)}

  if(!collectionReady){

    console.log("setting up collection!")
    try {

      const transactionId = await fcl.mutate({
        cadence: `${setupAccount}`,
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        limit: 99
      })

      const transaction = await fcl.tx(transactionId).onceSealed();
      console.log("Testnet explorer link:", `https://testnet.flowscan.org/transaction/${transactionId}`);
      console.log(transaction);
      alert("account setup successfully!")

    } catch (err) {
      console.log(err)
    }
  }
  
  const _id = parseInt(_totalSupply) + 1;
  
  try {
    const transactionId = await fcl.mutate({
      cadence: `${mintNFT}`,
      args: (arg, t) => [
        arg(user.addr, types.Address), //address to which the NFT should be minted
        arg("aiSports # "+_id.toString(), types.String), // Name
        arg("aiSports NFTs", types.String), // Description
        arg("ipfs://bafybeig4giwunv4njsadtr2f3adxbm6h7dljtnecdwzipddlf66fvxz5pi", types.String),
        arg([], types.Array(types.UFix64)), //cuts: [UFix64],
        arg([], types.Array(types.String)), //royaltyDescriptions: [String],
        arg([], types.Array(types.Address)), //royaltyBeneficiaries: [Address],
        arg("Legendary", types.String), //status: String, 
        arg("159", types.UInt64), //juice: UInt64, 
        arg("Kobe", types.String), //player: String, 
        arg("Desert", types.String) //landscape: String, 
      ],
      proposer: serverAuthorization,
      payer: serverAuthorization,
      authorizations: [serverAuthorization],
      limit: 999
    })
    console.log("Minting NFT now with transaction ID", transactionId);
    const transaction = await fcl.tx(transactionId).onceSealed();
    console.log("Testnet explorer link:", `https://testnet.flowscan.org/transaction/${transactionId}`);
    console.log(transaction);
    alert("NFT minted successfully!")
  } catch (error) {
    console.log(error);
    alert("Error minting NFT, please check the console for error details!")
  }

}

const RenderLogout = () => {
  if (user && user.addr) {
    return (
      <div className="logout-container">
        <button className="cta-button logout-btn" onClick={() => logOut()}>
          ❎ {"  "}
          {user.addr.substring(0, 6)}...{user.addr.substring(user.addr.length - 4)}
        </button>
      </div>
    );
  }
  return undefined;
};

const RenderMintButton = () => {
  return (
    <div>
      <div className="button-container">
        <button className="cta-button button-glow" onClick={() => mint()}>
          Mint
        </button>
      </div>
      {images.length > 0 ? 
          <>
            <h2>Your NFTs</h2>
              <div className="image-container">
                {images}
              </ div>
          </> 
        : ""}
    </div>
  );
}

  return (
    <div className="App">
      <RenderLogout />
      <div className="container">
        <div className="header-container">
          <div className="ailogo-container">
            <img src="./ais_logo.png" className="ais-logo" alt="aislogo logo"/>
          </div>
          <div className="ai_image-container">
            <img src="./ai_image.png" className="ais-image" alt="aislogo logo"/>
          </div>
          { /*
          <div className="logo-container">
            <img src="./logo.png" className="flow-logo" alt="flow logo"/>
            <p className="header">NFTs coming to Flow ✨</p>
          </div>

          <p className="sub-text">March 2023</p>
          */}
        </div>

        {/* If not logged in, render login button */}
        {user && user.addr ? <RenderMintButton /> : <RenderLogin />}

        { /*
          <div className="footer-container">
            <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
            <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">{`built on @${TWITTER_HANDLE}`}</a>
        </div>
        */ }
      </div>
    </div>
  );
}

export default App;