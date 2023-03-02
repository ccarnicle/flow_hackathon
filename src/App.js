//importing required libraries
import React, { useState, useEffect, useContext } from 'react';
import { Container, Stack, Box, Typography, Button, List, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Page from '../template/Page'
import { RootStyle, StyledButtonContainer, StyledImageContainer } from '../customStyles/Layout';
import NFTCard from './nftCard'
//fcl
import * as fcl from "@onflow/fcl";
import * as types from "@onflow/types";
//user context
import { UserContext } from '../../../lib/UserContext';
//router 
import Router, {useRouter} from 'next/router';
//nextjs
import Image from 'next/image'
import landscapeImg from '../../../public/Images/nft_3.jpg'

import { first_text, second_text } from './introText';


import { mintNFT } from "./cadence/transactions/mintNFT_tx";
import { getTotalSupply } from "./cadence/scripts/getTotalSupply_script";
import { getMetadata } from "./cadence/scripts/getMetadata_script";
import { getIDs } from "./cadence/scripts/getID_script";
import {setupAccount} from "./cadence/transactions/setup_account"

import { serverAuthorization } from "./auth/authorization";
import { LoginPage } from "./Login";

import '../src/lib/fclConfig'

const newNfts = [
  {
    ipfs: "bafybeig4giwunv4njsadtr2f3adxbm6h7dljtnecdwzipddlf66fvxz5pi",
    player: "Shaq",
    status: "All Star",
    juice: 150,
    landscape: "Jungle"
  }, 
  {
    ipfs: "bafybeihs7flfod6nro6nrkpz4l5gyw5s3tyehjiigaorxydwtsbjavp4fi",
    player: "Kobe",
    status: "Legend",
    juice: 100,
    landscape: "Desert"
  },
  {
    ipfs: "bafybeihayqmfdrlp6ccz2czdefnugvneftosjlvql7q4wd362yu34rg4cu",
    player: "AI",
    status: "Common",
    juice: 100,
    landscape: "Jungle"
  },

]


function App() {

  const [user, setUser] = useContext(UserContext);
  const [ collectionReady, setCollectionReady] = useState(false)
  const [ images, setImages ] = useState([]) 
  const [ userNfts, setUserNfts ] = useState([]) 

  //typewriter effect
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [buttonReady, setButtonReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nftMinted, setNftMinted] = useState(false)
  const [ juiceBalance, setJuiceBalance ] = useState(100)
  const [ seeAllNFTs, setSeeAllNFTs ] = useState(false)
  const [curNft, setCurNft] = useState(0)


  useEffect(() => {

    if(first_text.length === text1.length){
      setButtonReady(true)
    }

    const timeout = setTimeout(() => {
      setText1(first_text.slice(0, text1.length + 1));
    }, 40);
    return () => clearTimeout(timeout);
  }, [text1]);

  useEffect(() => {
    if(isLoading){
      const timeout = setTimeout(() => {
        setText2(second_text.slice(0, text2.length + 1));
      }, 40);
  
      return () => clearTimeout(timeout);
    }
  }, [text2, isLoading]);

  const getCollectionReady = async () => {

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
        //console.log("Testnet explorer link:", `https://testnet.flowscan.org/transaction/${transactionId}`);
        //console.log(transaction);
        //alert("account setup successfully!")

        setCollectionReady(true)

      } catch (err) {
        console.log(err)
      }
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
        await getCollectionReady()
      }
      
      const _id = parseInt(_totalSupply) + 1;
      
      setIsLoading(true)

      //will eventually move to the backend
      try {

        if(juiceBalance < 50){
          alert("Note enough Juice to Mint an NFT")
          throw new Error("not enough juice")
        }

        const transactionId = await fcl.mutate({
          cadence: `${mintNFT}`,
          args: (arg, t) => [
            arg(user.address, types.Address), //address to which the NFT should be minted
            arg("aiSports # "+_id.toString(), types.String), // Name
            arg("aiSports NFTs", types.String), // Description
            arg(newNfts[curNft].ipfs, types.String),
            arg([], types.Array(types.UFix64)), //cuts: [UFix64],
            arg([], types.Array(types.String)), //royaltyDescriptions: [String],
            arg([], types.Array(types.Address)), //royaltyBeneficiaries: [Address],
            arg(newNfts[curNft].status, types.String), //status: String, 
            arg(newNfts[curNft].juice, types.UInt64), //juice: UInt64, 
            arg(newNfts[curNft].player, types.String), //player: String, 
            arg(newNfts[curNft].landscape, types.String) //landscape: String, 
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
        setJuiceBalance(juiceBalance - 50)
        setIsLoading(false)
        setNftMinted(newNfts[curNft])

        if(curNft > 2) {
          setCurNft(0)
        } else{
          setCurNft(curNft+1)
        }

      } catch (error) {
        console.log(error);
        //alert("Error minting NFT, please check the console for error details!")
        setIsLoading(false)
      }
    
    }

  const fetchNFTs = async () => {
      // Empty the images array
      setImages([]);
      setUserNfts([])
      let IDs = [];

      // Fetch the IDs with our script (no fees or signers necessary)
      try {
          IDs = await fcl.query({
          cadence: `${getIDs}`,
          args: (arg, t) => [
              arg(user.address, types.Address), 
          ],
          })
          setCollectionReady(true)
      } catch(err) {
          console.log("No NFTs Owned")
          console.log(err)
          await getCollectionReady()
      }
      
      let _imageSrc = [] 
      let _nftSrc = []   
      try{
          for(let i=0; i<IDs.length; i++) {
          const results = await fcl.query({
              cadence: `${getMetadata}`,
              args: (arg, t) => [
              arg(user.address, types.Address), 
              arg(IDs[i].toString(), types.UInt64),
              ],
          })

          if(results.length > 0){
            for(let i in results){
              let result = results[i]
              // If the source is an IPFS link, remove the "ipfs://" prefix
              if (result["thumbnail"].startsWith("ipfs://")) {
                console.log(result["thumbnail"])
                results[i]["thumbnail"] = "https://nftstorage.link/ipfs/" + result["thumbnail"].substring(7)
              }
            }
          }

          _nftSrc.push(results)
          
          }
      } catch(err) {
          console.log(err)
      }

      console.log(_nftSrc)
      setUserNfts(_nftSrc)
      /*
      if(images.length < _imageSrc.length) {
          setImages((Array.from({length: _imageSrc.length}, (_, i) => i).map((number, index)=>
          <img style={{margin:"10px", height: "150px"}} src={_imageSrc[index]} key={number} alt={"NFT #"+number}
          />
          )))
      }*/
  }

  const RenderMintButton = () => {
      return (
        <div>
          {!nftMinted ? 
            <StyledButtonContainer>
              <Button disabled = {!buttonReady || !collectionReady || isLoading} sx ={{width: '200px'}} color = 'secondary' size = "large" variant="outlined" onClick={() => mint()}>
                Mint NFT to Start
              </Button>
              </StyledButtonContainer>
                :
              <StyledButtonContainer>
                <LoadingButton loading = {isLoading} disabled = {!buttonReady} sx ={{width: '200px'}} color = 'primary' size = "large" variant="outlined" onClick={() => {
                  setNftMinted(false) 
                  setSeeAllNFTs(false)
                 }}>
                  Mint Another NFT
                </LoadingButton>
              </StyledButtonContainer> }
            <Button disabled = {!buttonReady} sx ={{width: '200px'}} color = 'secondary' size = "large"  onClick={() => {
              fetchNFTs()
              setSeeAllNFTs(true)}}>
              See all NFTs
            </Button>
        </div>
      ); 
  }

  if(!user.addr){
    return (<LoginPage/>)
  }

  return (
    <Page title="aiSports' Minter">
    <RootStyle>
        <Container sx={{ pt: 2, width: { md: '770px', lg: '770px', xl: '770px' } }}>
        { seeAllNFTs ?
        <>
        <Typography sx = {{mb: 1}}component="h1" variant="h4" textAlign="center" mb={4}>Your NFTs</Typography>
          <Stack   
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2} 
          mb={6}>
            <Button sx ={{width: '200px'}} color = 'secondary' size = "large"  onClick={() => {
              setNftMinted(false) 
              setSeeAllNFTs(false)}}>
                Back To Minter
            </Button>
          {userNfts[0] && userNfts.map((nft)=>{return(<NFTCard nft = {nft}/>)})}
          </Stack>
          </>
        : <>
        <Typography component="h1" variant="h4" textAlign="center" mb={4}>NFT Minter</Typography>
        {!nftMinted && <Typography sx={{m:2}} variant="body1">{text1}</Typography>}
        <Stack   
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2} 
          mb={4}>

            { !nftMinted ? 
            <Box sx={{ml:1,mr:1 }}>
              {isLoading ? <Typography sx={{m:2}} variant="body1">{text2}</Typography> :
              <Image 
                src={landscapeImg}
                alt="Picture of the a new world"/>
              }
            </Box> : <NFTCard nft = {nftMinted} /> }
            {buttonReady && juiceBalance >= 0 &&
              <Typography variant="subtitle1" component="h2" color="secondary.light" textAlign="center" m={1}>
              Juice Balance: {juiceBalance.toFixed(2)} oz.
              </Typography>
            } 
            <div>
                {user && user.address && <RenderMintButton />}
            </div>
        </Stack>
        </>
        }
        </Container>
    </RootStyle>
    </Page>
)
}

export default App;