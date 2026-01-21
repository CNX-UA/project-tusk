import { useEffect, useState } from 'react'
import axios from 'axios'
import { Container, Typography, List, ListItem, ListItemText, Paper, Alert } from '@mui/material' 
import './App.css'

function App() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    axios.get('http://localhost:3000/api/v1/users')
      .then(response => {
        console.log("Data received:", response.data)
        setUsers(response.data)
      })
      .catch(error => console.error("Error:", error))
  }, [])

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Project Tusk 🐘
      </Typography>
      
      <Alert severity="info" style={{ marginBottom: '1rem' }}>
        Frontend connected successfully to the API!
      </Alert>

      <Typography variant="h6" gutterBottom>
        Users (MUI + Axios):
      </Typography>

      <Paper elevation={3}>
        <List>
          {users.map(user => (
            <ListItem key={user.id} divider>
              <ListItemText 
                primary={user.email} 
                secondary={`ID: ${user.id}`} 
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  )
}

export default App