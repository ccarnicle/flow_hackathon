import { Box, Grid, Card, CardHeader, CardMedia, List, Tooltip, Typography } from "@mui/material";
import React, { useState, useEffect } from 'react';
import Logo from '../template/Logo'

export default function NFTCard({nft}) {

const [nftImage, setNftImage] = useState(false)

const [player, setPlayer] = useState(false)
const [landscape, setLandscape] = useState(false)

const [status, setStatus] = useState(false)

const [juice, setJuice] = useState(false)
const [name, setName] = useState(false)


useEffect(()=>{

  if(nft.traits){
    let traitsObj = nft.traits.traits
    setPlayer(traitsObj[1].value)
    setLandscape(traitsObj[5].value)
    setStatus(traitsObj[2].value)
    setJuice( traitsObj[4].value)
    setName(nft.name)
    
  }

  if(nft.thumbnail && !nftImage){
      let newImage

      if(nft.thumbnail.substr(0,4) == "ipfs"){
        newImage = "https://nftstorage.link/ipfs/" + nft.thumbnail.substr(7)
      } else {
        newImage =  "https://nftstorage.link/ipfs/" + nft.thumbnail
      }

      setNftImage(newImage)
  }

  if(nft.ipfs && !nftImage){
    let newImage =  "https://nftstorage.link/ipfs/" + nft.ipfs
    setNftImage(newImage)
}

},[nft])

return(
    <Box sx={{ px: 1.5, height: '100%' }} style={{ width: 350 }}>
      <Card sx={{ 
        px: 2,
        py: 1, 
        borderRadius: 1.5,
        backgroundColor: (theme) => theme.palette.background.paper,
        boxShadow: 'none',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        '& ul': {
          fontSize: '0.75rem',
        }
      }}>
        <div>
        <CardHeader
            sx={{
              p: 0,
              alignItems: 'start',
              '& .MuiCardHeader-subheader': { mt: 0 }
            }}
            title={
                <Box sx={{pl: 11}}><Logo /></Box>
            }
            subheader={
              <Box sx={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center' }}>
                Season 1
              </Box>
            }
        />
        <CardMedia
            component="img"
            //height="194"
            src={nftImage ? nftImage : ""}
        />
          <Typography variant="h5" component="h3" pt={2} pb={0} >{name ? name: "aiSports #001"}</Typography>
          <Grid container direction="row">
            <Typography sx={{height: '24px', width:'145px' }} color = "primary" variant="body1" component="p">Status: <strong>{status ? status : nft.status}</strong></Typography>
            <Typography sx={{height: '24px'}} variant="body1" component="p">Player: {player ? player : nft.player}</Typography>
          </Grid>
          <Grid container direction="row">
            <Typography sx={{height: '24px', width:'145px' }} color="secondary.light" variant="body1" component="p">Juice: <strong>{juice ? juice : nft.juice}</strong>oz.</Typography>
            <Typography sx={{height: '24px', mb: 2}} variant="body1" component="p">Landing: {landscape ? landscape : nft.landscape}</Typography>
          </Grid>

        </div>
      </Card>
    </Box>
)

}