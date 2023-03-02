// next
import { useContext, useEffect } from 'react';
import { UserContext } from '../../../lib/UserContext';
import Router, {useRouter} from 'next/router';

// @mui
import { Grid, Stack, Container, Typography, Box, } from '@mui/material';

// components
import Image from '../template/Image';
import LoginDapper from './LoginDapper';
import Logo from '../template/Logo';


export default function LoginPage() {

    const [user, setUser] = useContext(UserContext);
    const router = useRouter()


  useEffect(() => {

    if( user?.address ){
      if(router.query.id === "nftMinter"){
        Router.push('/nft/nftMinter')
      } 
    }

  }, [user]);
  
  //ALL OF THESE CHANGES ARE ONLY FOR TESTING, REVERT BACK FOR PROD
  return (
    <Container>
      <Grid container>
        <Grid item xs={12} md={5} lg={5} sx={{ height: '100vh' }}>
          <Stack
            sx={{
              justifyContent: 'space-between',
              py: { xs: 2, lg: 15 },
              textAlign: 'left',
              borderRadius: 2,
              height: '100%',
            }}
          >
            <div>
              <Box sx={{ mb: { xs: 14, lg: 4.5 }, '& > div': { width: '79px', height: '26px' } }}><Logo /></Box>
              <Typography variant="h4" component="h1" mb={2}>Log in to Mint NFT</Typography>
              <Typography variant="body1" component="p" sx={{ 
                mb: { xs: 2, lg: 3 }, color: 'text.secondary',
                fontSize: { xs: '0.875rem', lg: '1.125rem' }
              }}>
                Log in using Blocto
              </Typography>
              <Box mb={3}><LoginDapper setUser = {setUser} /></Box>
            </div>

            <div>
              <Typography variant="caption" sx={{ color: 'grey.text' }}>
                &copy; {new Date().getFullYear()} aiSports
              </Typography>
            </div>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6} sx={{ 
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          zIndex: 999,
          height: '100%',
          width: '50%',
          right: 0,
          pl: { md: 3, lg: 0},
          }}
        >
          <Image
            alt="login"
            src="./Images/logan-weaver-lgnwvr-SKgEBQCJ-jI-unsplash-1.jpg"
            sx={{ height: '100%' }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
