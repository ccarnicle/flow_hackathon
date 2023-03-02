// React
import React, {useState, useEffect} from 'react';
// next

//mui
import { LoadingButton } from '@mui/lab';
import { Stack } from '@mui/material';

//Flow Client Library
import "../../lib/fclConfig";
import { authenticate, currentUser, query } from "@onflow/fcl" 
import SignUpModal from './SignUpModal';

// ----------------------------------------------------------------------



export default function LoginDapper({user, setUser}) {
  const [checked, setChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dapperUser, setDapperUser] = useState({loggedIn: null})
  const [userFirebaseDetails, setUserFirebaseDetails] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);


  //const [name, setName] = useState('') // probably only needed for testing, will eventually add this into user

  useEffect(() => currentUser.subscribe(setDapperUser), [])

  const UnauthenticatedState = () => {
    return (
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="outlined"
          color="secondary"
          onClick={()=> {
            setIsSubmitting(true)
            authenticate()
          }}
          loading={isSubmitting}
        >
          Connect Wallet
        </LoadingButton>
    )
  }

  useEffect(() => {

    if(dapperUser.addr){ 
     setUser(dapperUser.addr);
    }

  }, [dapperUser])



  return (
    <>
      <Stack spacing={1} alignItems="flex-end">
        <UnauthenticatedState />
      </Stack>
      {isSignUpModalOpen &&
        <SignUpModal isSignUpModalOpen={isSignUpModalOpen} setIsSignUpModalOpen={setIsSignUpModalOpen}
          userFirebaseDetails={userFirebaseDetails}
          setUserFirebaseDetails={setUserFirebaseDetails}
          isTermsAndCondChecked={checked}
          setIsTermsAndCondChecked={setChecked}
          dapperUser = {dapperUser}
        />
      }
    </>
  );
}
