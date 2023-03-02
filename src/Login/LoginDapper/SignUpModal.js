import PropTypes from 'prop-types';
import { Box, IconButton, Stack, Typography, Checkbox, Link, Button, TextField } from "@mui/material";
import { styled } from '@mui/material/styles';
import { CloseIconDuotone } from '../../../theme/overrides/CustomIcons';
import TransitionsModal from '../../template/transitionsModal';
import { useState } from 'react';
import NextLink from 'next/link';
import useResponsive from "../../../hooks/useResponsive";

function SignUpModal({
  isSignUpModalOpen, setIsSignUpModalOpen, userFirebaseDetails, setUserFirebaseDetails, isTermsAndCondChecked,
  setIsTermsAndCondChecked, dapperUser
}) {
  const [username, setUsername] = useState('');
  const [emailAdd, setEmailAdd] = useState('');
  const isDesktop = useResponsive('up', 'lg');

  const handleChange = (event) => {
    setIsTermsAndCondChecked(event.target.checked);
  };

  return (
    <TransitionsModal
      sx={{
        p: { xs: 2, lg: 4 },
        width: { xs: '100%', lg: '467px' },
        height: '514px',
        bgcolor: (theme) => theme.palette.background.default,
        borderRadius: '10px',
        '& .simplebar-content': {
          p: '30px !important',
          position: 'relative'
        },
        '& .close-icon': { position: 'absolute', right: { xs: 38, lg: 20 }, top: 20 },
        '& label': { fontSize: { xs: '0.75rem', lg: '1rem' } },
        '& input': { fontSize: { xs: '0.875rem', lg: '1rem' } }
      }}
      isOpen={!!isSignUpModalOpen}
      handleClose={() => setIsSignUpModalOpen(false)}
      modalContent={
        <>
        <IconButton className="close-icon" onClick={() => setIsSignUpModalOpen(false)}><CloseIconDuotone /></IconButton>
        <Stack spacing={isDesktop ? 3 : 2}>
          <Typography variant="h4" component="h1" textAlign="center" mt={1.5}>Sign Up</Typography>

          <Typography variant="body1" color="grey.text" sx={{ fontSize: { xs: '0.875rem', lg: '1.125rem' } }}>
            Welcome to aiSports! Please fill in the information to complete your registration.
          </Typography>

          <FormGroup>
            <label htmlFor="username">Username</label>
            <TextField fullWidth id="username" placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={username === '' ? false : !isUsernameValid(username)}
              helperText={username === '' ? '' : (!isUsernameValid(username) && getUsernameErrorMsg(username))}
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="userEmail">Email</label>
            <TextField fullWidth id="userEmail" placeholder="mail@website.com"
              error={emailAdd === '' ? false : !isEmailValid(emailAdd)}
              type="email"
              value={emailAdd}
              onChange={(e) => setEmailAdd(e.target.value)}
              helperText={emailAdd === '' ? '' : (!isEmailValid(emailAdd) && 'Invalid Email')}
            />
          </FormGroup>

          
          <Box alignSelf="flex-start" display="flex" sx={{ alignItems: { xs: 'start', lg: 'center' } }}>
            <Checkbox
              checked={isTermsAndCondChecked}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'controlled' }}
              sx={{ p: 0, pr: 1, mt: { xs: 0.25, lg: 0 } }}
              color="secondary"
            />
            <Typography variant="body1" color="grey.text" sx={{ fontSize: { xs: '0.875rem', lg: '1rem' } }}>
              I agree with the&nbsp;
              <NextLink href='https://metamask.io/' passHref >
                <Link variant="body1" color="primary" rel="noopener noreferrer" target="_blank" sx={{ fontSize: { xs: '0.875rem', lg: '1rem' } }}>
                  Terms &amp; Conditions
                </Link>
              </NextLink>
            </Typography>
          </Box>

          <Button variant="contained" color="secondary" sx={{ width: '100%' }}
            disabled = {isTermsAndCondChecked && isEmailValid(emailAdd) && isUsernameValid(username)  ? false : true  } 
            onClick={async () => {
              //set firebase here.
              setIsSignUpModalOpen(false);
            }}
          >
            Sign Up
          </Button>
        </Stack>
        </>
      }
    />
  )
}

SignUpModal.propTypes = {
  isSignUpModalOpen: PropTypes.bool,
  setIsSignUpModalOpen: PropTypes.func,
  userFirebaseDetails: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  setUserFirebaseDetails: PropTypes.func,
  isTermsAndCondChecked: PropTypes.bool,
  setIsTermsAndCondChecked: PropTypes.func,
}

export default SignUpModal;

const FormGroup = styled(Box)(({ sx}) => ({
  '& label': { display: 'block', marginBottom: 8 },
  '& input': { paddingTop: 8 },
  '& MuiFormHelperText-root': { color: 'red' },
  ...sx
}));

function isEmailValid(emailAdd) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAdd)
}

function isUsernameValid(username) {
  return (username.length > 3 && username.length < 16)  && /^[a-zA-Z0-9_.-]*$/.test(username);
}

function getUsernameErrorMsg(username) {
  if(!(/^[a-zA-Z0-9_.-]*$/.test(username))) {
    return 'Username can only have letters, numbers, period or underscore.';
  }

  if(!(username.length > 3 && username.length < 16)) {
    return 'Username must have 4 - 15 characters'
  }

  return 'Invalid username';
}
