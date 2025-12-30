import React, { useState } from 'react';
import { Badge, IconButton, Menu, MenuItem, Typography, Box, Divider } from '@mui/material';
import { Bell } from 'lucide-react';
import { useNotification } from './NotificationContext';

export default function NotificationBell() {
    const { notifications, unreadCount, markAsRead } = useNotification();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        markAsRead();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const formatTime = (isoString) => {
        try {
            const date = new Date(isoString);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return '';
        }
    };

    return (
        <>
            <IconButton
                color="inherit"
                onClick={handleClick}
                sx={{ ml: 1 }}
            >
                <Badge badgeContent={unreadCount} color="error">
                    <Bell size={24} />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: 350,
                        maxHeight: 500,
                        mt: 1.5,
                        '& .MuiList-root': {
                            paddingTop: 0,
                            paddingBottom: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f5f5f5' }}>
                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                        Notifications
                    </Typography>
                </Box>
                <Divider />

                {notifications.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No notifications yet
                        </Typography>
                    </Box>
                ) : (
                    notifications.map((notif) => (
                        <MenuItem
                            key={notif.id}
                            onClick={handleClose}
                            sx={{
                                display: 'block',
                                whiteSpace: 'normal',
                                borderBottom: '1px solid #eee',
                                py: 1.5,
                                px: 2,
                                '&:hover': { bgcolor: '#f9f9f9' }
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                    {notif.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {formatTime(notif.time)}
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#555', fontSize: '0.85rem' }}>
                                {notif.body}
                            </Typography>
                        </MenuItem>
                    ))
                )}
            </Menu>
        </>
    );
}
