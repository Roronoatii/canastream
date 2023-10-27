import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SwitchModeButton } from '../../molecules/atoms/ThemeSwitchButton'
import {
  AppBar,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useTheme
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useMobileThreshold } from '../../../hooks/useMobileThreshold'
import { NavigationContext } from '../../../views/Layout/NavigationContext'
import FrontEditorDrawer from '../FrontEditor/FrontEditorDrawer'
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms'
import SpaIcon from '@mui/icons-material/Spa'
import { User, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../../database/firebase.config'
import LoginIcon from '@mui/icons-material/Login'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'

const TopBar = () => {
  const theme = useTheme()
  const { drawerSubState, handleMobileDrawerToggle } =
    useContext(NavigationContext)
  const navigate = useNavigate()

  const isMobile = useMobileThreshold()
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      if (currentUser) {
        setUser(currentUser)
        setIsLoggedIn(true)
      } else {
        setIsLoggedIn(false)
      }
    })

    return () => unsubscribe()
  }, [navigate, auth])

  const navigateToHome = () => {
    navigate('/')
  }

  const handleLoginOrProfileClick = () => {
    if (user) {
      navigate('/profile')
    } else {
      navigate('/login')
    }
  }

  return (
    <AppBar
      position='relative'
      elevation={0}
      sx={{
        px: 1,
        transition: theme =>
          theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
          }),
        ...(drawerSubState === 'normal' && {
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
          })
        }),
        backgroundColor: '#499b4a'
      }}
    >
      <Toolbar disableGutters>
        <Stack
          width={'100%'}
          direction='row'
          justifyContent='space-between'
          alignItems='center'
        >
          {isMobile && (
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={handleMobileDrawerToggle}
              edge='start'
              sx={{
                mx: 1
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant='h6'
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <button
              onClick={navigateToHome}
              style={{
                color: 'white',
                fontSize: '24px',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              CanaStream
            </button>
            <SpaIcon sx={{ ml: 1 }} />
            <SmokingRoomsIcon sx={{ ml: 1 }} />
          </Typography>
        </Stack>
        {isLoggedIn ? (
          <AccountCircleIcon
            onClick={handleLoginOrProfileClick}
            sx={{ mx: 1, cursor: 'pointer' }}
          />
        ) : (
          <LoginIcon
            onClick={handleLoginOrProfileClick}
            sx={{ mx: 1, cursor: 'pointer' }}
          />
        )}
        <SwitchModeButton />
        <FrontEditorDrawer />
      </Toolbar>
    </AppBar>
  )
}

export { TopBar }
