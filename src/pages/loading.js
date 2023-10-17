import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function LoadingPage() {
  return (
    <Box sx={{ 
        display: 'flex', 
        backgroundColor: "rgba(221, 221, 221, 0.5)", 
        height: "100vh", 
        alignItems: "center", 
        width: "100%", 
        justifyContent:"center",
        zIndex: "2",
        position: "absolute",
        top: "0"}}>
      <CircularProgress />
    </Box>
  );
}