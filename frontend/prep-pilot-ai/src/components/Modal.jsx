import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useTheme,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

const Modal = ({ children, isOpen, onClose, title, hideHeader }) => {
  const theme = useTheme()

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
        },
      }}
    >
      {!hideHeader && title && (
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pb: 2,
          }}
        >
          {title}
          <IconButton
            onClick={onClose}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}
      {hideHeader && (
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 1,
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      )}
      <DialogContent sx={{ p: 0 }}>{children}</DialogContent>
    </Dialog>
  )
}

export default Modal
