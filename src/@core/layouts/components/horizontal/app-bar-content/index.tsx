// ** React Imports
import { ReactNode } from 'react'

// ** Next Import
import Link from 'next/link'
import Image from 'next/image'

// ** MUI Imports
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled, useTheme } from '@mui/material/styles'

// ** Type Import
import { Settings } from 'src/@core/context/settingsContext'

// ** Theme Config Import
import themeConfig from 'src/configs/themeConfig'

import { TextField } from '@mui/material'

import moment from 'moment'

interface Props {
  hidden: boolean
  settings: Settings
  saveSettings: (values: Settings) => void
  horizontalAppBarContent?: (props?: any) => ReactNode
  horizontalAppBarBranding?: (props?: any) => ReactNode
}

const StyledLink = styled('a')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  marginRight: theme.spacing(8)
}))

import { useState } from 'react'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';

import useDateRange from 'src/hooks/useDateRange'

import { dispatch } from 'use-bus'
import loader from 'src/loader'

const AppBarContent = (props: Props) => {
  // ** Props
  const {
    horizontalAppBarContent: userHorizontalAppBarContent,
    horizontalAppBarBranding: userHorizontalAppBarBranding
  } = props

  // ** Hooks
  const theme = useTheme()

  const { startDate, setStartDate, endDate, setEndDate } = useDateRange()

  
  function handleChangeFrom(value: any) {
    console.log('handle change from', value)
    setStartDate(value)

    dispatch({ type: 'date_range_from_updated', value })
  }

  function handleChangeTo(value: any) {
    console.log('handle change to', value)
    setEndDate(value)

    dispatch({ type: 'date_range_to_updated', value })
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {userHorizontalAppBarBranding ? (
        userHorizontalAppBarBranding(props)
      ) : (
        <>
        <Link href='/' passHref>
          <StyledLink>
          <Typography
              variant='h6'
              sx={{
                ml: 3,
                fontWeight: 600,
                lineHeight: 'normal',
                textTransform: 'uppercase'
              }}
            >
                <Image loader={loader} src={`/images/Be+The+Broadcast+Logo+White-01.png`} width={'256px'} height={'30px'}/>
            </Typography>
          </StyledLink>

        </Link>

        </>
      )}
      {userHorizontalAppBarContent ? userHorizontalAppBarContent(props) : null}
    </Box>
  )
}

export default AppBarContent
